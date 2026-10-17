// Real signed questions through account handoff; never creates an account or saves a result.
const { chromium, firefox } = require("playwright");
const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const { errors } = require("./qa-support.cjs");
async function runAnonymousChecks(origin = "http://127.0.0.1:8080") {
  const reports = [];
  const out = process.env.QA_EVIDENCE_DIR
    ? `${process.env.QA_EVIDENCE_DIR}/anonymous`
    : "artifacts/qa/reaudit/anonymous";
  await fs.mkdir(out, { recursive: true });
  for (const name of (process.env.QA_BROWSERS || "chromium").split(",")) {
    assert.ok(["chromium", "firefox"].includes(name));
    const b = await { chromium, firefox }[name].launch();
    try {
      for (const age of ["child", "teen_adult"])
        for (const gender of ["male", "female"]) {
          const c = await b.newContext({
            viewport: { width: 390, height: 844 },
            reducedMotion: "reduce",
            timezoneId: "Asia/Tashkent",
          });
          const p = await c.newPage();
          const faults = errors(p);
          let serverWrites = 0;
          p.on("request", (r) => {
            if (r.url().startsWith(origin + "/_serverFn/") && r.method() === "POST") serverWrites++;
          });
          await p.goto(origin + "/career-assessment", { waitUntil: "networkidle" });
          await p.locator(`label:has(input[value="${gender}"])`).click();
          await p.locator(`label:has(input[value="${age}"])`).click();
          await p.locator("[data-mobile-primary]").click();
          for (let n = 0; n < 30; n++) {
            await p.locator(`[data-question-index="${n}"][data-transitioning="false"]`).waitFor();
            await p.locator('main label:has(input[type="radio"])').first().click();
            await p.locator("[data-mobile-primary]").click();
          }
          await p.waitForURL("**/auth?*");
          const url = new URL(p.url());
          assert.equal(url.searchParams.get("mode"), "signup");
          assert.equal(url.searchParams.get("next"), "/career-assessment");
          // SPA URL changes can precede the sign-up route settling in Firefox.
          // Model reload after the form is ready; never swallow navigation errors.
          await p.locator('input[autocomplete="given-name"]').waitFor();
          await p.waitForLoadState("networkidle");
          const stats = () =>
            p.evaluate(() => {
              const d = JSON.parse(
                sessionStorage.getItem("abilitio.career_assessment.progress.v4"),
              );
              return {
                step: d.step,
                answers: [...d.answers.personality, ...d.answers.iq, ...d.answers.interest].filter(
                  (v) => v !== null && v !== undefined && (!Array.isArray(v) || v.length),
                ).length,
                owner: d.ownerId,
              };
            });
          assert.deepEqual(await stats(), { step: 29, answers: 30, owner: null });
          await p.screenshot({
            path: `${out}/${name}-${age}-${gender}-handoff.png`,
            fullPage: true,
          });
          await p.reload({ waitUntil: "networkidle" });
          assert.deepEqual(await stats(), { step: 29, answers: 30, owner: null });
          await p.goto(origin + "/career-assessment", { waitUntil: "networkidle" });
          await p.getByRole("button", { name: "Continue where you left off", exact: true }).click();
          await p.locator('[data-question-index="29"][data-transitioning="false"]').waitFor();
          assert.equal(await p.locator("[data-mobile-primary]").isEnabled(), true);
          await p.screenshot({
            path: `${out}/${name}-${age}-${gender}-resumed.png`,
            fullPage: true,
          });
          assert.deepEqual(faults, []);
          assert.equal(serverWrites, 0, "Anonymous answers must not be submitted to a server");
          reports.push({
            origin,
            browser: name,
            age,
            gender,
            signedQuestions: 30,
            retainedAnswers: 30,
            accountCreated: false,
            resultSaved: false,
            serverPosts: serverWrites,
          });
          await fs.writeFile(
            `${out}/receipt-${name}.json`,
            JSON.stringify(
              reports.filter((r) => r.browser === name),
              null,
              2,
            ),
          );
          await c.close();
          console.log(`Anonymous signed flow passed ${name}/${age}/${gender}`);
        }
    } finally {
      await b.close();
    }
  }
}
module.exports = { runAnonymousChecks };
if (require.main === module)
  runAnonymousChecks(process.env.QA_ORIGIN).catch((e) => {
    console.error(e);
    process.exitCode = 1;
  });
