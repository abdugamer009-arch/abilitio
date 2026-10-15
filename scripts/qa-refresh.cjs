// Refresh the two pages refined during final visual review; all other matrix
// screens remain in the full 360-case report. Same seeded network fixtures.
const { chromium } = require("playwright");
const { fixtures, install, errors } = require("./qa-support.cjs");
const assert = require("node:assert/strict");
(async () => {
  const b = await chromium.launch();
  const data = await fixtures();
  try {
    for (const lang of ["en", "uz", "ru"])
      for (const theme of ["light", "dark"])
        for (const width of [1440, 768, 390, 320]) {
          const c = await b.newContext({
            viewport: { width, height: width === 1440 ? 1000 : 844 },
            reducedMotion: "reduce",
          });
          await install(c, data, { lang, theme });
          const p = await c.newPage();
          const faults = errors(p);
          for (const [page, route] of [
            ["landing", "/"],
            ["assessment", "/career-assessment"],
          ]) {
            await p.goto("http://127.0.0.1:8080" + route, { waitUntil: "networkidle" });
            assert.equal(
              await p.evaluate(() => document.documentElement.scrollWidth > innerWidth),
              false,
            );
            await p.screenshot({
              path: `artifacts/qa/final/${lang}-${theme}-${width}-${page}.png`,
              fullPage: true,
            });
          }
          assert.deepEqual(faults, []);
          await c.close();
        }
    console.log("48 refreshed landing/chooser screens passed");
  } finally {
    await b.close();
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
