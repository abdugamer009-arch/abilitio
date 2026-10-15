// Complete assessment attempts in dark mode supplement the page/theme matrix.
const { chromium } = require("playwright");
const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const { fixtures, install, errors } = require("./qa-support.cjs");
async function runDarkFlows(origin = "http://127.0.0.1:8080") {
  const b = await chromium.launch();
  const data = await fixtures();
  const results = [];
  await fs.mkdir("artifacts/qa/dark-flows", { recursive: true });
  try {
    for (const lang of ["en", "uz", "ru"])
      for (const age of ["child", "teen_adult"]) {
        const c = await b.newContext({
          viewport: { width: 390, height: 844 },
          reducedMotion: "reduce",
        });
        await install(c, data, { lang, theme: "dark", age });
        const p = await c.newPage();
        const faults = errors(p);
        await p.goto(origin + "/career-assessment", { waitUntil: "networkidle" });
        await p.locator('label:has(input[value="female"])').click();
        await p.locator(`label:has(input[value="${age}"])`).click();
        await p.locator("[data-mobile-primary]").click();
        for (let n = 0; n < 30; n++) {
          await p.locator(`[data-question-index="${n}"][data-transitioning="false"]`).waitFor();
          await p.locator("main label:has(input[type=radio])").first().click();
          await p.locator("[data-mobile-primary]").click();
        }
        await p.waitForURL("**/career-results");
        await p.getByRole("searchbox").waitFor();
        assert.equal(await p.locator("html").evaluate((n) => n.classList.contains("dark")), true);
        assert.equal(
          await p.evaluate(() => document.documentElement.scrollWidth > innerWidth),
          false,
        );
        await p.screenshot({ path: `artifacts/qa/dark-flows/${lang}-${age}.png`, fullPage: true });
        assert.deepEqual(faults, []);
        results.push({ lang, age, theme: "dark", questions: 30, fixture: true, errors: faults });
        await c.close();
        console.log(`Dark full attempt passed ${lang}/${age}`);
      }
    await fs.writeFile("artifacts/qa/dark-flows/results.json", JSON.stringify(results, null, 2));
  } finally {
    await b.close();
  }
}
module.exports = { runDarkFlows };
if (require.main === module)
  runDarkFlows().catch((e) => {
    console.error(e);
    process.exitCode = 1;
  });
