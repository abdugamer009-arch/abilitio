// Real local signed question delivery; account/draft/result endpoints below are fixtures.
// This matrix never claims live Supabase persistence or a student pilot.
const { chromium } = require("playwright");
const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const { fixtures } = require("./qa-support.cjs");
const origin = process.env.QA_ORIGIN || "http://127.0.0.1:8080";
const output = "artifacts/picture-assessment-qa";
async function main() {
  await fs.mkdir(output, { recursive: true });
  const data = await fixtures(),
    browser = await chromium.launch();
  const results = [];
  async function run({ lang, width, theme, guest, age }) {
    const name = `${lang}-${width}-${theme}-${guest ? "guest" : "account-fixture"}-${age}`;
    const c = await browser.newContext({
      viewport: { width, height: width === 390 ? 844 : 1000 },
      reducedMotion: "reduce",
    });
    await c.addInitScript(
      ({ lang, theme, guest, result }) => {
        localStorage.setItem("abilitio_lang", lang);
        localStorage.setItem("abilitio-theme", theme);
        localStorage.setItem("abilitio-motion", "off");
        window.__pictureQA = {
          guest,
          user: { id: "00000000-0000-4000-8000-000000000001", email: "qa@example.invalid" },
          result,
        };
      },
      {
        lang,
        theme,
        guest,
        result: {
          ...data.results[age],
          question_set_version:
            age === "teen_adult" ? "picture-reasoning-v1" : "child-preferences-v1",
          cognitive_score: age === "teen_adult" ? 7 : null,
        },
      },
    );
    if (!guest) {
      await c.route("**/src/lib/auth-context.tsx*", async (route) => {
        const res = await route.fetch();
        await route.fulfill({
          response: res,
          body: (await res.text()).replace(
            "return useContext(Ctx);",
            "const original=useContext(Ctx); return original.loading?original:{...original,user:window.__pictureQA.user,loading:false};",
          ),
        });
      });
      await c.route("**/src/integrations/supabase/client.ts*", (route) =>
        route.fulfill({
          contentType: "text/javascript",
          body: `
    export const isSupabaseConfigured=true;
    const chain=new Proxy({}, {get:(_,key)=>key==='then'?done=>done({data:[],error:null}):()=>chain});
    export const supabase={from:()=>chain,auth:{getSession:async()=>({data:{session:null}}),onAuthStateChange:()=>({data:{subscription:{unsubscribe(){}}}})},channel:()=>({on(){return this},subscribe(){return this}}),removeChannel(){}};`,
        }),
      );
      await c.route("**/src/lib/assessment/picture-progress.functions.ts*", (route) =>
        route.fulfill({
          contentType: "text/javascript",
          body: `
    export const loadPictureDraft=async()=>JSON.parse(localStorage.getItem('qa.cloud-draft')||'null');
    export const savePictureDraft=async({data})=>{localStorage.setItem('qa.cloud-draft',JSON.stringify(data.draft));localStorage.setItem('qa.save-calls',String(Number(localStorage.getItem('qa.save-calls')||0)+1));return {saved:true};};
    export const deletePictureDraft=async()=>{localStorage.removeItem('qa.cloud-draft');return {deleted:true};};`,
        }),
      );
      await c.route("**/src/lib/assessment/career.functions.ts*", async (route) => {
        const res = await route.fetch();
        let body = await res.text();
        for (const name of ["submitCareerAssessment", "getMyCareerResult"])
          body = body.replace(
            new RegExp("export const " + name + " = [\\s\\S]*?;(?=\\n)", "g"),
            "export const " + name + " = async()=>window.__pictureQA.result;",
          );
        await route.fulfill({ response: res, body });
      });
    }
    let p,
      errors = [];
    async function page() {
      const p = await c.newPage();
      p.on("pageerror", (e) => errors.push(e.message));
      p.on("console", (m) => {
        if (m.type() === "error") errors.push(m.text());
      });
      return p;
    }
    const key = `abilitio.picture-draft.v1:${guest ? "guest" : "00000000-0000-4000-8000-000000000001"}`;
    async function state() {
      return p.evaluate((key) => JSON.parse(localStorage.getItem(key) || "null"), key);
    }
    async function begin() {
      await p.locator(".picture-assessment").waitFor();
      const gender = p.locator('input[name="profile-gender"]:checked');
      if (!(await gender.count())) await p.locator('label:has(input[value="female"])').click();
      const ageRadio = p.locator(`input[value="${age}"]`);
      if (await ageRadio.isEnabled()) await ageRadio.locator("..").click();
      await p.locator(".picture-card .picture-primary").click();
    }
    async function check(n) {
      await p.locator("#picture-question").waitFor();
      assert.equal((await state()).step, n, name + " step");
      assert.equal(
        await p.evaluate(() => document.documentElement.scrollWidth > innerWidth),
        false,
        name + " overflow",
      );
      assert.equal(await p.locator("nav").count(), 0, name + " focus mode");
      const boxes = await p.locator(".picture-answer").evaluateAll((es) =>
        es.map((e) => ({
          w: e.getBoundingClientRect().width,
          h: e.getBoundingClientRect().height,
        })),
      );
      assert.ok(
        boxes.every((b) => b.w >= 44 && b.h >= 44),
        name + " touch targets",
      );
      assert.equal(
        await p.locator('svg[role="img"]:not([aria-label])').count(),
        0,
        name + " SVG name",
      );
      const d = await state();
      assert.equal(d.session.iq.length, age === "child" ? 0 : 9);
      assert.doesNotMatch(
        JSON.stringify(d.session),
        /"(correct|correctAnswerId|riasec|direction|axis|semantic|premises|dotOutside|normals|ruleExplanation)":/,
      );
    }
    try {
      p = await page();
      await p.goto(origin + "/career-assessment", { waitUntil: "networkidle" });
      await begin();
      for (let n = 0; n < 30; n++) {
        await check(n);
        assert.equal(
          await p.locator(".picture-card .picture-primary").isDisabled(),
          true,
          name + " next needs answer",
        );
        // Exercise scoped shortcuts and normal labeled radio clicks.
        if (n === 0 || n === 12) {
          await p.locator("#picture-question").focus();
          await p.keyboard.press(n === 0 ? "5" : "A");
        } else await p.locator(".picture-answers label").first().click();
        await p.waitForFunction(
          (key) =>
            Object.values(JSON.parse(localStorage.getItem(key)).observations).filter(
              (o) => o.answered,
            ).length > 0,
          key,
        );
        const d = await state(),
          q =
            n < 12
              ? d.session.personality[n]
              : age === "teen_adult" && n < 21
                ? d.session.iq[n - 12]
                : d.session.interest[n - 12 - d.session.iq.length];
        assert.equal(d.observations[q.id].answered, true, name + " chosen observation");
        if (n === 5) {
          await p.reload({ waitUntil: "networkidle" });
          await begin();
          await check(n);
          assert.equal(
            await p.locator(".picture-answers input:checked").count(),
            1,
            name + " refresh retains choice",
          );
        }
        if (n === 14) {
          if (!guest) {
            await p.waitForFunction(
              () => JSON.parse(localStorage.getItem("qa.cloud-draft") || "null")?.step === 14,
            );
            await p.evaluate((key) => localStorage.removeItem(key), key);
          }
          await p.close();
          p = await page();
          await p.goto(origin + "/career-assessment", { waitUntil: "networkidle" });
          await begin();
          await check(n);
          assert.equal(
            await p.locator(".picture-answers input:checked").count(),
            1,
            name + " closed tab/cloud recovery retains choice",
          );
        }
        if ([0, 12, 18, 21].includes(n) && age === "teen_adult")
          await p.screenshot({ path: `${output}/${name}-q${n + 1}.png`, fullPage: true });
        await p.locator(".picture-card .picture-primary").click();
        if (n === 11 || (age === "teen_adult" && n === 20)) {
          await p.locator(".picture-celebrate").waitFor();
          await p.locator(".picture-celebrate .picture-primary").click();
          if (n === 11 && age === "teen_adult") {
            await p.locator(".picture-tips").waitFor();
            await p.locator(".picture-card .picture-primary").click();
          }
        }
      }
      await p.locator(".picture-finish").waitFor();
      const final = await state();
      assert.equal(
        Object.values(final.observations).filter((o) => o.answered).length,
        30,
        name + " all answered",
      );
      assert.ok(
        Object.values(final.observations).every((o) => o.timeMs >= 0),
        name + " private timing",
      );
      assert.equal(
        await p
          .locator("main")
          .getByText(/\d+\s*(seconds|секунд|soniya)/)
          .count(),
        0,
        name + " no timing displayed",
      );
      await p.screenshot({ path: `${output}/${name}-finish.png`, fullPage: true });
      if (!guest) {
        assert.ok(
          (await p.evaluate(() => Number(localStorage.getItem("qa.save-calls")))) >= 30,
          name + " saves every answer",
        );
        await p.locator(".picture-finish .picture-primary").click();
        await p.waitForURL("**/career-results");
        if (age === "teen_adult")
          await p
            .getByText("7.8 / 10 · 7 of 9 correct")
            .or(p.getByText("7.8 / 10 · 7 из 9 верно"))
            .or(p.getByText("7.8 / 10 · 9 tadan 7 ta to‘g‘ri"))
            .waitFor();
      }
      assert.deepEqual(errors, [], name + " browser errors");
      results.push({
        name,
        passed: true,
        questions: 30,
        realSignedQuestionDelivery: true,
        accountFixture: !guest,
        refresh: true,
        closedTabRecovery: true,
      });
      console.log("PASS " + name);
    } catch (e) {
      await p
        ?.screenshot({ path: `${output}/${name}-failure.png`, fullPage: true })
        .catch(() => {});
      throw new Error(name + ": " + e.stack);
    } finally {
      await c.close();
    }
  }
  try {
    const cases = [];
    for (const lang of ["en", "ru", "uz"])
      for (const width of [390, 1440])
        for (const theme of ["light", "dark"])
          for (const guest of [true, false])
            for (const age of ["teen_adult", "child"])
              cases.push({ lang, width, theme, guest, age });
    let index = 0;
    await Promise.all(
      [0, 1].map(async () => {
        while (index < cases.length) await run(cases[index++]);
      }),
    );
    await fs.writeFile(
      output + "/results.json",
      JSON.stringify(
        {
          scope:
            "Local Chromium emulation; account/draft/result fixtures, not live Supabase or student pilot",
          results,
        },
        null,
        2,
      ),
    );
    console.log(`${results.length} complete flows passed`);
  } finally {
    await browser.close();
  }
}
main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
