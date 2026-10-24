/* Run against npm run dev. Uses real signed question delivery; mocks only account/results.
 * PLAYWRIGHT_MODULE may point to an installed Playwright package; BROWSER_EXE to Chrome.
 * Outputs captures/JSON in ignored artifacts/profile-feature. No production accounts used.
 */
const fs = require("node:fs/promises");
const path = require("node:path");
const assert = require("node:assert/strict");
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const origin = process.env.QA_ORIGIN || "http://127.0.0.1:8080";
const out = path.resolve("artifacts/profile-feature");
const draftKey = "abilitio.career_assessment.progress.v4";
const widths = process.env.QA_WIDTH ? [Number(process.env.QA_WIDTH)] : [1440, 390];
assert(widths.every((width) => [1440, 390].includes(width)));

(async () => {
  await fs.mkdir(out, { recursive: true });
  const browser = await chromium.launch({
    headless: true,
    ...(process.env.BROWSER_EXE ? { executablePath: process.env.BROWSER_EXE } : {}),
  });
  const reports = [];
  try {
    for (const width of widths)
      for (const gender of ["male", "female"])
        for (const ageGroup of ["child", "teen_adult"]) {
          const context = await browser.newContext({
            viewport: { width, height: width === 390 ? 844 : 1000 },
            isMobile: width === 390,
            hasTouch: width === 390,
            reducedMotion: width === 390 ? "reduce" : "no-preference",
          });
          const page = await context.newPage();
          const errors = [];
          page.on("pageerror", (e) => errors.push(e.message));
          page.on("console", (m) => {
            if (m.type() === "error") errors.push(m.text());
          });
          page.on("requestfailed", (r) =>
            errors.push(`request: ${r.url()} ${r.failure()?.errorText}`),
          );
          page.on("response", (r) => {
            if (r.status() >= 400) errors.push(`HTTP ${r.status()}: ${r.url()}`);
          });
          const catalog = await fs.readFile("src/lib/assessment/catalog.server.ts", "utf8");
          const matches = [
            ...catalog
              .split("export const MAJOR_CATALOG")[0]
              .matchAll(/key: "([^"]+)",\s+name: "([^"]+)",\s+category: "([^"]+)"/g),
          ].map((m) => ({
            key: m[1],
            name: m[2],
            category: m[3],
            score: m[1] === "actor" ? 95 : 70,
            matchFields: ["arts"],
            major: null,
          }));
          const result = {
            id: "qa-result",
            personality_type: "ENFP",
            work_style: "Collaborative",
            leadership_style: "Supportive",
            learning_style: "Visual",
            team_style: "Collaborative",
            cognitive_score: ageGroup === "child" ? null : 5,
            cognitive_tier: ageGroup === "child" ? "Not assessed" : "Competent",
            cognitive_profile: "Exploring",
            interests: [{ key: "arts", weight: 1 }],
            riasec_profile: { R: 0, I: 0, A: 1, S: 0, E: 0, C: 0 },
            riasec_is_estimated: false,
            holland_code: ["A", "S", "I"],
            career_matches: matches,
            university_matches: [],
            strengths: [],
            improvements: [],
            recommended_skills: [],
            created_at: "2026-10-14T00:00:00Z",
          };
          await page.addInitScript(
            ({ result }) => {
              window.__qaUser = { id: "qa-owner", email: "qa@example.invalid" };
              window.__qaResult = result;
            },
            { result },
          );
          // Navigation can warm the dashboard while this signed-question test
          // tabs across its links. Keep those account reads inside the fixture;
          // question delivery below still reaches the real local server.
          await page.route("**/src/integrations/supabase/client.ts*", (route) =>
            route.fulfill({
              contentType: "text/javascript",
              body: `
                export const isSupabaseConfigured=true;
                function query(){let one=false;const chain=new Proxy({}, {get(_,key){if(key==='then')return done=>done({data:one?null:[],error:null,count:0});return ()=>{if(key==='single'||key==='maybeSingle')one=true;return chain;};}});return chain;}
                export const supabase={from:query,auth:{getSession:async()=>({data:{session:null}}),onAuthStateChange:()=>({data:{subscription:{unsubscribe(){}}}})}};
              `,
            }),
          );
          await page.route("**/src/lib/auth-context.tsx*", async (route) => {
            const response = await route.fetch();
            const body = (await response.text()).replace(
              "return useContext(Ctx);",
              "const original = useContext(Ctx); return original.loading ? original : {...original, user: window.__qaUser, loading: false};",
            );
            await route.fulfill({ response, body });
          });
          await page.route("**/src/lib/community/community.functions.ts*", async (route) => {
            const res = await route.fetch();
            await route.fulfill({
              response: res,
              body: (await res.text()).replace(
                /export const getCommunityChoice = [\s\S]*?;(?=\n)/g,
                "export const getCommunityChoice=async()=>({suggested:null,memberships:[]});",
              ),
            });
          });
          await page.route("**/src/lib/assessment/career.functions.ts*", async (route) => {
            const response = await route.fetch();
            const body = (await response.text()).replace(
              /export const (submitCareerAssessment|getMyCareerResult) = [\s\S]*?;(?=\n)/g,
              "export const $1 = async () => window.__qaResult;",
            );
            await route.fulfill({ response, body });
          });
          await page.goto(`${origin}/career-assessment`);
          const start = page.getByRole("button", { name: "Start Assessment", exact: true });
          await start.waitFor();
          assert.equal(await start.isDisabled(), true);
          const choose = async (value) => {
            const input = page.locator(`input[value="${value}"]`);
            if (width === 1440) {
              await input.focus();
              await page.keyboard.press("Space");
            } else await page.locator("label").filter({ has: input }).tap();
          };
          await choose(gender);
          assert.equal(await start.isDisabled(), true);
          await choose(ageGroup);
          assert.equal(await start.isEnabled(), true);
          if (width === 1440) {
            await page.getByRole("button", { name: "Motion: on", exact: true }).waitFor();
            await page.waitForTimeout(800); // Authored panel entrance is 720ms.
          }
          await page.waitForFunction(() => {
            const cards = document.querySelectorAll('input[name="profile-gender"] + span');
            return (
              cards.length === 2 &&
              getComputedStyle(cards[0]).backgroundColor !==
                getComputedStyle(cards[1]).backgroundColor
            );
          });
          const backgrounds = await page
            .locator('input[name="profile-gender"] + span')
            .evaluateAll((cards) => cards.map((card) => getComputedStyle(card).backgroundColor));
          assert.notEqual(
            backgrounds[0],
            backgrounds[1],
            "Selected and unselected cards must look different",
          );
          assert.equal(
            await page.locator('input[name="profile-gender"]:checked + span svg').count(),
            1,
          );
          await page.screenshot({
            path: path.join(out, `after-entry-${gender}-${ageGroup}-${width}.png`),
            fullPage: true,
          });
          if (width === 1440) {
            await start.focus();
            await page.keyboard.press("Enter");
          } else await start.tap();
          await page.locator("h2").waitFor();
          if (width === 1440) await page.waitForTimeout(800);
          const draft = await page.evaluate(
            (key) => JSON.parse(sessionStorage.getItem(key)),
            draftKey,
          );
          assert.equal(draft.session.iq.length, ageGroup === "child" ? 0 : 9);
          assert.equal(draft.session.interest.length, ageGroup === "child" ? 18 : 9);
          if (ageGroup === "child")
            assert(
              draft.session.personality.every((q) => q.id.startsWith("cp")) &&
                draft.session.interest.every((q) => q.id.startsWith("ci")),
            );
          assert(!/"(correct|riasec|direction|axis)":/.test(JSON.stringify(draft.session)));
          await page.screenshot({
            path: path.join(out, `after-question-${gender}-${ageGroup}-${width}.png`),
            fullPage: true,
          });
          const first = await page.locator("h2").innerText();
          // Answer, refresh, change gender, cancel age change: preserve question and answer.
          await page
            .locator("main label")
            .filter({ has: page.locator("input[type=radio]") })
            .first()
            .click();
          await page.reload();
          if (ageGroup === "teen_adult") {
            // Model a still-valid draft from before this feature shipped.
            await page.evaluate((key) => {
              const saved = JSON.parse(sessionStorage.getItem(key));
              delete saved.profile;
              localStorage.setItem("abilitio.career_assessment.progress.v3", JSON.stringify(saved));
              sessionStorage.removeItem(key);
            }, draftKey);
            await page.reload();
            await page
              .getByRole("button", { name: "Continue where you left off", exact: true })
              .waitFor();
            assert.equal(
              await page
                .getByRole("button", { name: "Continue where you left off", exact: true })
                .isDisabled(),
              true,
            );
            await choose(gender);
          }
          await page
            .getByRole("button", { name: "Continue where you left off", exact: true })
            .waitFor();
          await page
            .getByRole("button", { name: "Continue where you left off", exact: true })
            .click();
          assert.equal(await page.locator("h2").innerText(), first);
          assert.equal(await page.locator("main input[type=radio]").first().isChecked(), true);
          await page.getByRole("button", { name: "Change choices", exact: true }).click();
          await choose(gender === "male" ? "female" : "male");
          await choose(gender);
          page.once("dialog", (dialog) => dialog.dismiss());
          await choose(ageGroup === "child" ? "teen_adult" : "child");
          assert.equal(await page.locator(`input[value="${ageGroup}"]`).isChecked(), true);
          await page
            .getByRole("button", { name: "Continue where you left off", exact: true })
            .click();
          // Complete using keyboard on desktop, touch on mobile.
          for (let i = 0; i < 30; i++) {
            await page.getByText(`${i + 1} / 30`, { exact: true }).waitFor();
            await page
              .locator(`[data-question-index="${i}"][data-transitioning="false"]`)
              .waitFor();
            if (width === 1440) {
              await page.locator("h2").click();
              await page.keyboard.press("1");
            } else
              await page
                .locator("main label")
                .filter({ has: page.locator("input[type=radio]") })
                .first()
                .tap();
            if (i < 29) {
              if (width === 1440) {
                await page.getByRole("button", { name: "Next", exact: true }).focus();
                await page.keyboard.press("Enter");
              } else await page.getByRole("button", { name: "Next", exact: true }).tap();
            }
          }
          await page.getByRole("button", { name: "See My Results", exact: false }).click();
          await page.waitForURL("**/career-results");
          await page
            .getByRole("heading", {
              name: ageGroup === "child" ? "Ideas to try" : "Your Career Profile",
              exact: true,
            })
            .waitFor();
          await page
            .getByText(gender === "female" ? "Actress" : "Actor", { exact: true })
            .first()
            .waitFor();
          if (width === 1440) await page.waitForTimeout(800);
          const body = await page.locator("main").innerText();
          if (ageGroup === "child")
            assert(!body.includes("/9") && body.includes("no ability or maths questions"));
          assert.equal(
            await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
            false,
          );
          if (width === 1440) {
            // Existing counters start when scrolled into view. Visit the bottom before capture.
            await page.evaluate(() =>
              window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "instant" }),
            );
            await page.waitForTimeout(1200); // Existing counter animation is 1100ms.
            await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
            await page.waitForTimeout(400);
          }
          await page.screenshot({
            path: path.join(out, `after-result-${gender}-${ageGroup}-${width}.png`),
            fullPage: true,
          });
          assert.equal(await page.evaluate((key) => localStorage.getItem(key), draftKey), null);
          await page.getByRole("button", { name: "Retake", exact: true }).click();
          await start.waitFor();
          assert.equal(await start.isDisabled(), true);
          await choose(gender);
          await choose(ageGroup);
          await start.click();
          await page.locator("h2").waitFor();
          const second = await page.evaluate(
            (key) => JSON.parse(sessionStorage.getItem(key)),
            draftKey,
          );
          assert.notDeepEqual(
            second.session.personality.map((q) => q.id),
            draft.session.personality.map((q) => q.id),
          );
          // Confirm an age switch and exercise rapid double start with real question delivery.
          await page.getByRole("button", { name: "Change choices", exact: true }).click();
          page.once("dialog", (dialog) => dialog.accept());
          await choose(ageGroup === "child" ? "teen_adult" : "child");
          await page.getByRole("button", { name: "Start Assessment", exact: true }).dblclick();
          await page.locator("h2").waitFor();
          const switched = await page.evaluate(
            (key) => JSON.parse(sessionStorage.getItem(key)),
            draftKey,
          );
          assert.equal(switched.step, 0);
          assert.equal(switched.session.iq.length, ageGroup === "child" ? 9 : 0);
          assert(switched.answers.personality.every((answer) => answer === null));
          assert.deepEqual(errors, []);
          reports.push({
            gender,
            ageGroup,
            width,
            status: "passed",
            questionSource: "real signed server sessions",
            resultSource: "mocked account/result DTO; grading covered by unit tests",
            consoleErrors: errors,
          });
          console.log(`Passed ${gender}/${ageGroup} at ${width}px`);
          await context.close();
        }
    await fs.writeFile(
      path.join(
        out,
        process.env.QA_WIDTH
          ? `browser-results-${process.env.QA_WIDTH}.json`
          : "browser-results.json",
      ),
      JSON.stringify(reports, null, 2),
    );
    console.log(JSON.stringify(reports, null, 2));
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
