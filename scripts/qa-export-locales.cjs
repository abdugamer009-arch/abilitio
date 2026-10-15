const { chromium } = require("playwright");
const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const { fixtures, install, errors } = require("./qa-support.cjs");
async function runExportLocaleChecks(origin = "http://127.0.0.1:8080") {
  const b = await chromium.launch();
  const data = await fixtures();
  await fs.mkdir("artifacts/qa/export-locales", { recursive: true });
  try {
    for (const lang of ["en", "ru", "uz"])
      for (const age of ["child", "teen_adult"]) {
        const c = await b.newContext({
          viewport: { width: 390, height: 844 },
          reducedMotion: "reduce",
        });
        await install(c, data, { lang, age });
        const p = await c.newPage();
        const faults = errors(p);
        await p.goto(origin + "/career-results", { waitUntil: "networkidle" });
        const label = { en: "Download PDF", ru: "Скачать PDF", uz: "PDF yuklash" }[lang];
        const event = p.waitForEvent("download", { timeout: 10000 });
        await p.getByRole("button", { name: label, exact: true }).click();
        const d = await event;
        const file = `artifacts/qa/export-locales/${lang}-${age}.pdf`;
        await d.saveAs(file);
        assert.ok((await fs.stat(file)).size > 1000);
        assert.deepEqual(faults, []);
        await c.close();
        console.log("Local PDF passed " + lang + "/" + age);
      }
  } finally {
    await b.close();
  }
}
module.exports = { runExportLocaleChecks };
if (require.main === module)
  runExportLocaleChecks().catch((e) => {
    console.error(e);
    process.exitCode = 1;
  });
