const { chromium } = require("playwright");
const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const { fixtures, install, errors } = require("./qa-support.cjs");
async function runMatrix(origin = "http://127.0.0.1:8080") {
  const data = await fixtures();
  const b = await chromium.launch();
  const rows = [];
  const out = "artifacts/qa/final";
  await fs.mkdir(out, { recursive: true });
  const routes = {
    landing: "/",
    assessment: "/career-assessment",
    question: "/career-assessment",
    results: "/career-results",
    dashboard: "/dashboard",
    roadmap: "/roadmap",
    battles: "/career-battles",
    universities: "/universities",
    settings: "/dashboard",
    abbi: "/dashboard",
    school: "/school/register",
    about: "/about",
    terms: "/terms",
    privacy: "/privacy",
    methodology: "/methodology",
  };
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
          for (const [name, route] of Object.entries(routes)) {
            await p.goto(origin + route, { waitUntil: "networkidle" });
            await p.locator("main").waitFor();
            if (name === "question") {
              await p.locator('label:has(input[value="male"])').click();
              await p.locator('label:has(input[value="teen_adult"])').click();
              await p.locator("[data-mobile-primary]").click();
              await p.locator('[data-question-index="0"]').waitFor();
            }
            if (name === "settings") await p.locator(".dashboard-tab").last().click();
            if (name === "abbi")
              await p.getByRole("button", { name: "ABBI Guide", exact: true }).click();
            if (name === "school")
              assert.equal(await p.locator("button[type=submit]").isDisabled(), true);
            const overflow = await p.evaluate(
              () => document.documentElement.scrollWidth > innerWidth,
            );
            const image = `${lang}-${theme}-${width}-${name}.png`;
            await p.screenshot({ path: out + "/" + image, fullPage: true });
            rows.push({
              lang,
              theme,
              width,
              name,
              route,
              overflow,
              image,
              errors: [...faults],
              fixture: true,
            });
          }
          await c.close();
          console.log(`Page matrix ${lang}/${theme}/${width} complete`);
        }
  } finally {
    await b.close();
    await fs.writeFile(out + "/index.json", JSON.stringify(rows, null, 2));
  }
  const failed = rows.filter((r) => r.overflow || r.errors.length);
  if (failed.length) {
    console.log(
      failed.map((r) => ({
        lang: r.lang,
        theme: r.theme,
        width: r.width,
        name: r.name,
        overflow: r.overflow,
        errors: r.errors.slice(0, 2),
      })),
    );
    throw new Error(failed.length + " page matrix cases failed");
  }
  console.log(
    rows.length +
      " language/theme/width screens passed with no page overflow or console/request errors",
  );
}
module.exports = { runMatrix };
if (require.main === module)
  runMatrix().catch((e) => {
    console.error(e);
    process.exitCode = 1;
  });
