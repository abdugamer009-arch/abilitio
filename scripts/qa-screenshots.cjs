const { chromium } = require("playwright");
const fs = require("node:fs/promises");
const { fixtures, install, errors } = require("./qa-support.cjs");
(async () => {
  const out = process.argv[2] || "baseline/authenticated-fixtures";
  await fs.mkdir(out, { recursive: true });
  const data = await fixtures();
  const browser = await chromium.launch({ headless: true });
  const report = [];
  try {
    for (const width of [1440, 768, 390, 320]) {
      const context = await browser.newContext({
        viewport: { width, height: width === 1440 ? 1000 : 844 },
        reducedMotion: "reduce",
      });
      await install(context, data);
      const page = await context.newPage();
      const faults = errors(page);
      for (const [name, route] of Object.entries({
        landing: "/",
        assessment: "/career-assessment",
        results: "/career-results",
        dashboard: "/dashboard",
        roadmap: "/roadmap",
        battles: "/career-battles",
        universities: "/universities",
        settings: "/dashboard",
      })) {
        await page.goto((process.env.QA_ORIGIN || "http://127.0.0.1:8080") + route, {
          waitUntil: "networkidle",
        });
        await page.locator("main").waitFor();
        if (name === "settings") await page.getByRole("button", { name: /^Settings$/ }).click();
        await page.screenshot({ path: out + "/" + width + "-" + name + ".png", fullPage: true });
        report.push({
          width,
          name,
          path: out + "/" + width + "-" + name + ".png",
          errors: [...faults],
          fixture: true,
        });
      }
      await page.goto((process.env.QA_ORIGIN || "http://127.0.0.1:8080") + "/career-assessment", {
        waitUntil: "networkidle",
      });
      await page.locator('label:has(input[value="male"])').click();
      await page.locator('label:has(input[value="teen_adult"])').click();
      await page.locator("[data-mobile-primary]").click();
      await page.locator('[data-question-index="0"]').waitFor();
      await page.screenshot({ path: out + "/" + width + "-question.png", fullPage: true });
      report.push({
        width,
        name: "question",
        path: out + "/" + width + "-question.png",
        errors: [...faults],
        fixture: true,
      });
      await context.close();
    }
  } finally {
    await browser.close();
    await fs.writeFile(out + "/index.json", JSON.stringify(report, null, 2));
  }
  console.log(
    "Captured " +
      report.length +
      " fixture screens; errors: " +
      report.reduce((n, r) => n + r.errors.length, 0),
  );
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
