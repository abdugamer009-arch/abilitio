const { chromium } = require("playwright");
const assert = require("node:assert/strict");
const { fixtures, install } = require("./qa-support.cjs");

async function runAbbiInput(origin = "http://127.0.0.1:8104") {
  const browser = await chromium.launch();
  try {
    for (const width of [390, 1440]) {
      const context = await browser.newContext({
        viewport: { width, height: 900 },
        reducedMotion: "reduce",
      });
      await install(context, await fixtures());
      const page = await context.newPage();
      await page.goto(origin + "/dashboard", { waitUntil: "networkidle" });
      await page.getByRole("button", { name: "ABBI Guide", exact: true }).click();
      const input = page.locator(".student-compose-field textarea");
      assert.equal(await page.locator(".student-send").isDisabled(), true);
      await input.fill(" ");
      assert.equal(await page.locator(".student-send").isDisabled(), true);
      // Paste through browser input: the server's 2,000-character limit must be
      // enforced before the UI optimistically clears a message it cannot send.
      await input.fill("x".repeat(2001));
      assert.equal(
        (await input.inputValue()).length,
        2000,
        "Composer accepts a message the server will reject",
      );
      await input.fill("Software Engineer");
      await input.press("Enter");
      await page.locator(".student-typing").waitFor({ state: "hidden" });
      assert.ok((await page.locator(".student-message-user").count()) === 1);
      assert.ok((await page.locator(".chat-md").last().innerText()).length > 0);
      await context.close();
      console.log(
        `ABBI empty/whitespace/2,001-character paste and valid send passed at ${width}px (fixture transport)`,
      );
    }
  } finally {
    await browser.close();
  }
}
module.exports = { runAbbiInput };
if (require.main === module)
  runAbbiInput(process.env.QA_ORIGIN).catch((e) => {
    console.error(e);
    process.exitCode = 1;
  });
