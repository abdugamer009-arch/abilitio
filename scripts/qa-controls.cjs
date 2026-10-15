const { chromium } = require("playwright");
const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const { fixtures, install, errors } = require("./qa-support.cjs");
async function runControlChecks(origin = "http://127.0.0.1:8080") {
  const data = await fixtures();
  const b = await chromium.launch({ headless: true });
  await fs.mkdir("artifacts/qa/controls", { recursive: true });
  try {
    for (const width of [1440, 390]) {
      const c = await b.newContext({ viewport: { width, height: 844 }, reducedMotion: "reduce" });
      await install(c, data);
      const p = await c.newPage();
      const faults = errors(p);
      await p.addInitScript((s) => {
        const key = "qa.draft-seeded";
        if (!sessionStorage.getItem(key)) {
          sessionStorage.setItem(key, "true");
          sessionStorage.setItem(
            "abilitio.career_assessment.progress.v4",
            JSON.stringify({
              session: s,
              profile: { gender: "female", ageGroup: "teen_adult" },
              step: 21,
              ownerId: "qa-owner",
              answers: {
                personality: Array(12).fill(3),
                iq: Array(9).fill(0),
                interest: Array.from({ length: 9 }, () => []),
              },
            }),
          );
        }
      }, data.sessions.teen_adult);
      await p.goto(origin + "/career-assessment", { waitUntil: "networkidle" });
      await p.getByRole("button", { name: "Continue where you left off", exact: true }).click();
      await p.locator('[data-question-index="21"]').waitFor();
      await p.locator("main label:has(input[type=radio])").first().click();
      await p.waitForTimeout(350);
      assert.equal(
        await p.locator("[data-question-index]").getAttribute("data-question-index"),
        "21",
      );
      await p.getByRole("button", { name: "Next", exact: true }).dblclick({ delay: 10 });
      await p.locator('[data-question-index="22"]').waitFor();
      await p.waitForTimeout(250);
      assert.equal(
        await p.locator("[data-question-index]").getAttribute("data-question-index"),
        "22",
      );
      await p.screenshot({ path: `artifacts/qa/controls/M01-${width}.png`, fullPage: true });
      await p.reload();
      await p.getByRole("button", { name: "Continue where you left off", exact: true }).click();
      await p.locator('[data-question-index="22"]').waitFor();
      await p
        .getByText(
          "Saved in this browser tab for up to 24 hours. Saved to your account only after submission.",
          { exact: true },
        )
        .waitFor();
      await p.screenshot({ path: `artifacts/qa/controls/V03-${width}.png`, fullPage: true });
      assert.deepEqual(faults, []);
      await c.close();
    }
    for (const width of [320, 360, 375, 390, 430]) {
      const height = { 320: 568, 360: 800, 375: 667, 390: 844, 430: 932 }[width];
      const c = await b.newContext({
        viewport: { width, height },
        reducedMotion: "reduce",
        hasTouch: true,
      });
      await install(c, data);
      const p = await c.newPage();
      const faults = errors(p);
      await p.goto(origin + "/#workshop", { waitUntil: "networkidle" });
      await p.locator("#workshop").scrollIntoViewIfNeeded();
      await p.evaluate(() =>
        document.querySelector("#workshop").scrollIntoView({ block: "start", behavior: "instant" }),
      );
      const prompt = p.locator("#workshop .question-prompt");
      const bounds = await prompt.boundingBox();
      assert.ok(
        bounds.y >= 0 && bounds.y + bounds.height < height,
        `active task offscreen at ${width}`,
      );
      assert.equal(
        await p.evaluate(() => document.documentElement.scrollWidth > innerWidth),
        false,
      );
      const tiny = await p.locator("#workshop .stage-choice,#workshop .choice-option").evaluateAll(
        (nodes) =>
          nodes.filter((n) => {
            const r = n.getBoundingClientRect();
            return r.width < 44 || r.height < 44;
          }).length,
      );
      assert.equal(tiny, 0);
      await p.screenshot({ path: `artifacts/qa/controls/M15-${width}.png` });
      await p.getByRole("button", { name: "Practice overview", exact: true }).click();
      await p.locator("#practice-index.is-expanded").waitFor();
      assert.deepEqual(faults, []);
      await c.close();
    }
    console.log("M01/V03 desktop+phone and M15 five-width control checks passed");
  } finally {
    await b.close();
  }
}
module.exports = { runControlChecks };
if (require.main === module)
  runControlChecks().catch((e) => {
    console.error(e);
    process.exitCode = 1;
  });
