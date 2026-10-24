const { chromium } = require("playwright");
const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const { fixtures, install } = require("./qa-support.cjs");

async function runAbbiRace(origin = "http://127.0.0.1:8104") {
  const browser = await chromium.launch();
  await fs.mkdir("artifacts/full-qa/abbi", { recursive: true });
  try {
    for (const width of [390, 1440]) {
      const context = await browser.newContext({
        viewport: { width, height: 900 },
        reducedMotion: "reduce",
      });
      await install(context, await fixtures());
      await context.route("**/src/lib/abbi/abbi.functions.ts*", async (route) => {
        const response = await route.fetch();
        await route.fulfill({
          response,
          body: (await response.text()).replace(
            /export const generateAbbiMessage = [\s\S]*?;(?=\n)/g,
            "export const generateAbbiMessage=async()=>new Promise(resolve=>{window.__qa.resolveReply=()=>resolve({reply:'CLEARED_REQUEST_MUST_NOT_RETURN'});});",
          ),
        });
      });
      const page = await context.newPage();
      await page.goto(origin + "/dashboard", { waitUntil: "networkidle" });
      await page.getByRole("button", { name: "ABBI Guide", exact: true }).click();
      await page.locator(".student-compose-field textarea").fill("TEST disposable question");
      await page.locator(".student-send").click();
      await page.locator(".student-typing").waitFor();
      await page.getByRole("button", { name: "Clear history", exact: true }).click();
      await page.evaluate(() => window.__qa.resolveReply());
      // The UI deliberately adds a 400–800ms thinking pause after the API reply.
      await page.waitForTimeout(1000);
      await page.screenshot({ path: `artifacts/full-qa/abbi/clear-pending-${width}.png` });
      assert.equal(
        await page.getByText("CLEARED_REQUEST_MUST_NOT_RETURN", { exact: true }).count(),
        0,
        "Cleared request repopulated chat history",
      );
      assert.equal(await page.getByText("TEST disposable question", { exact: true }).count(), 0);
      assert.equal(await page.locator(".student-typing").count(), 0);
      await page.reload();
      await page.getByRole("button", { name: "ABBI Guide", exact: true }).click();
      assert.equal(
        await page.getByText("CLEARED_REQUEST_MUST_NOT_RETURN", { exact: true }).count(),
        0,
        "Cleared reply persisted after refresh",
      );
      await context.close();
      console.log(
        `ABBI clear/pending reply regression passed at ${width}px (fixture transport, no live persistence claim)`,
      );
    }
  } finally {
    await browser.close();
  }
}
module.exports = { runAbbiRace };
if (require.main === module)
  runAbbiRace(process.env.QA_ORIGIN).catch((e) => {
    console.error(e);
    process.exitCode = 1;
  });
