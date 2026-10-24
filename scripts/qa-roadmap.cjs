const { chromium } = require("playwright");
const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const { fixtures, install, errors } = require("./qa-support.cjs");
async function runRoadmap(origin = "http://127.0.0.1:8105") {
  const browser = await chromium.launch();
  const rows = [];
  await fs.mkdir("artifacts/full-qa/roadmap", { recursive: true });
  try {
    const data = await fixtures();
    for (const width of [390, 1440])
      for (const lang of ["en", "ru", "uz"])
        for (const theme of ["light", "dark"]) {
          const context = await browser.newContext({
            viewport: { width, height: 900 },
            reducedMotion: "reduce",
          });
          await install(context, data, { lang, theme });
          const page = await context.newPage();
          const faults = errors(page);
          await page.goto(origin + "/roadmap", { waitUntil: "networkidle" });
          const islands = page.locator(".journey-island");
          await islands.nth(4).waitFor();
          let previousMarker = "";
          let completed = 0;
          for (let i = 0; i < 5; i++) {
            await islands.nth(i).press("Enter");
            assert.equal(await islands.nth(i).getAttribute("aria-pressed"), "true");
            const marker = await page.locator(".journey-abbi").getAttribute("style");
            assert.notEqual(marker, previousMarker, "ABBI marker did not move with the island");
            previousMarker = marker;
            assert.ok((await page.locator(".journey-phase-heading").innerText()).trim());
            for (const summary of await page.locator(".journey-panels details summary").all()) {
              await summary.click();
              assert.equal(await summary.locator("..").getAttribute("open"), "");
            }
            const tasks = page.locator(".journey-panels .task-complete-button");
            const count = await tasks.count();
            assert.ok(count > 0);
            for (let j = 0; j < count; j++) {
              await tasks.nth(j).click();
              assert.equal(await tasks.nth(j).isDisabled(), true);
              completed++;
            }
            await page.getByRole("dialog").waitFor();
            await page.keyboard.press("Escape");
            assert.equal(await page.getByRole("dialog").count(), 0);
          }
          await page.reload({ waitUntil: "networkidle" });
          await page.locator(".journey-island-done").nth(4).waitFor();
          assert.equal(await page.locator(".journey-island-done").count(), 5);
          assert.equal(
            await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1),
            false,
          );
          assert.deepEqual(faults, []);
          await page.screenshot({
            path: `artifacts/full-qa/roadmap/${width}-${lang}-${theme}.png`,
          });
          rows.push({
            id: "FLOW-04",
            width,
            lang,
            theme,
            islands: 5,
            completed,
            result: "PASS FIXTURE",
            persistence: "local queue only; live Supabase NOT CHECKED",
          });
          await context.unrouteAll({ behavior: "wait" });
          await context.close();
          console.log(`All islands/tasks/marker/modal/reload passed ${width}/${lang}/${theme}`);
        }
  } finally {
    await browser.close();
    await fs.writeFile("artifacts/full-qa/roadmap/results.json", JSON.stringify(rows, null, 2));
  }
}
module.exports = { runRoadmap };
if (require.main === module)
  runRoadmap(process.env.QA_ORIGIN).catch((e) => {
    console.error(e);
    process.exitCode = 1;
  });
