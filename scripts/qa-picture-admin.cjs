// Admin UI fixtures; real role denial is separately covered by server and RLS tests.
const { chromium } = require("playwright");
const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const { build } = require("esbuild");
const { fixtures, install, errors } = require("./qa-support.cjs");
const origin = process.env.QA_ORIGIN || "http://127.0.0.1:8080";
(async () => {
  await fs.mkdir("artifacts/picture-assessment-qa", { recursive: true });
  await build({
    stdin: {
      contents: `import {PICTURE_PROPOSALS} from './src/lib/assessment/picture-bank.server';import {questionStatistics} from './src/lib/assessment/picture-statistics';export const stats=questionStatistics([],PICTURE_PROPOSALS.map(q=>({id:q.id,setVersion:'picture-reasoning-v1',slot:q.slot,version:q.version,difficulty:q.difficulty,correctId:q.correctAnswerId,optionIds:q.options.map(o=>o.id)})));`,
      resolveDir: process.cwd(),
      loader: "ts",
    },
    platform: "node",
    bundle: true,
    format: "cjs",
    outfile: "artifacts/picture-assessment-qa/admin-fixture.cjs",
  });
  const stats = require("../artifacts/picture-assessment-qa/admin-fixture.cjs").stats,
    data = await fixtures(),
    b = await chromium.launch(),
    receipt = [];
  try {
    for (const lang of ["en", "ru", "uz"])
      for (const width of [390, 1440])
        for (const theme of ["light", "dark"]) {
          const c = await b.newContext({
            viewport: { width, height: 1000 },
            reducedMotion: "reduce",
          });
          await install(c, data, { lang, theme });
          await c.route("**/src/lib/admin/admin.functions.ts*", async (route) => {
            const response = await route.fetch();
            let body = await response.text();
            const values = {
              checkIsAdmin: '({isAdmin:true,email:"qa@example.invalid"})',
              getAdminUsers: "[]",
              getAdminAnalytics: JSON.stringify({
                totalUsers: 0,
                completedAssessments: 0,
                newUsersThisWeek: 0,
                newUsersThisMonth: 0,
                dau: 0,
                wau: 0,
                mau: 0,
                mostActiveCommunity: null,
                popularCareers: [],
                popularMbti: [],
                weeklySignups: [],
              }),
            };
            for (const [name, value] of Object.entries(values))
              body = body.replace(
                new RegExp("export const " + name + " = [\\s\\S]*?;(?=\\n)", "g"),
                "export const " + name + " = async()=>(" + value + ");",
              );
            await route.fulfill({ response, body });
          });
          await c.route("**/src/lib/assessment/picture-stats.functions.ts*", (route) =>
            route.fulfill({
              contentType: "text/javascript",
              body:
                "export const getPictureQuestionStats=async()=>(" + JSON.stringify(stats) + ");",
            }),
          );
          const p = await c.newPage(),
            faults = errors(p);
          await p.goto(origin + "/admin", { waitUntil: "networkidle" });
          try {
            await p.locator("#picture-stats-heading").waitFor({ timeout: 15000 });
          } catch (e) {
            console.log((await p.locator("body").innerText()).slice(0, 1000), faults);
            throw e;
          }
          assert.equal(
            await p.locator("section[aria-labelledby=picture-stats-heading] tbody tr").count(),
            18,
          );
          assert.equal(
            await p.evaluate(() => document.documentElement.scrollWidth > innerWidth),
            false,
          );
          assert.deepEqual(faults, []);
          await p.locator("section[aria-labelledby=picture-stats-heading]").screenshot({
            path: `artifacts/picture-assessment-qa/admin-${lang}-${width}-${theme}.png`,
          });
          receipt.push({ lang, width, theme, rows: 18, fixture: true });
          await c.close();
        }
    await fs.writeFile(
      "artifacts/picture-assessment-qa/admin.json",
      JSON.stringify(
        {
          scope: "Admin UI fixture only; real authorization covered by unit and PGlite tests",
          receipt,
        },
        null,
        2,
      ),
    );
    console.log("12 admin UI configurations passed");
  } finally {
    await b.close();
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
