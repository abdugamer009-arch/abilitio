const { chromium } = require("playwright");
const assert = require("node:assert/strict");
const fs = require("node:fs/promises");

async function runAssessmentFirstPaint(origin = "http://127.0.0.1:8107") {
  const browser = await chromium.launch();
  await fs.mkdir("artifacts/full-qa/assessment-paint", { recursive: true });
  try {
    for (const width of [390, 1440]) {
      const context = await browser.newContext({
        viewport: { width, height: 900 },
        javaScriptEnabled: false,
      });
      const page = await context.newPage();
      await page.goto(origin + "/career-assessment", { waitUntil: "load" });
      const status = page.getByRole("status");
      await page.screenshot({ path: `artifacts/full-qa/assessment-paint/no-js-${width}.png` });
      assert.equal(await status.count(), 1, "The assessment is blank before its scripts load");
      assert.ok(
        (await status.innerText()).trim().length > 0,
        "The server must render the existing loading text",
      );
      assert.equal(await status.isVisible(), true);
      assert.equal(await page.locator("main[aria-busy=true]").count(), 1);
      await context.close();
      console.log(
        `Picture assessment renders a visible loading state before JavaScript at ${width}px`,
      );
    }
  } finally {
    await browser.close();
  }
}
module.exports = { runAssessmentFirstPaint };
if (require.main === module)
  runAssessmentFirstPaint(process.env.QA_ORIGIN).catch((e) => {
    console.error(e);
    process.exitCode = 1;
  });
