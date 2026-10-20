const { chromium } = require("playwright");
const fs = require("node:fs/promises");
const assert = require("node:assert/strict");
const { fixtures } = require("./qa-support.cjs");
const origin = process.env.QA_ORIGIN || "http://127.0.0.1:8080";
async function main() {
  const b = await chromium.launch(),
    receipt = [];
  await fs.mkdir("artifacts/picture-assessment-qa", { recursive: true });
  try {
    // Legacy-draft recovery and explicit restart into the approved new flow.
    const old = await fixtures(),
      c = await b.newContext({ reducedMotion: "reduce" });
    await c.addInitScript((session) => {
      if (!sessionStorage.getItem("qa.legacy-installed")) {
        sessionStorage.setItem("qa.legacy-installed", "yes");
        sessionStorage.setItem(
          "abilitio.career_assessment.progress.v4",
          JSON.stringify({
            session,
            profile: { gender: "female", ageGroup: "teen_adult" },
            step: 0,
            answers: {
              personality: Array(12).fill(null),
              iq: Array(9).fill(null),
              interest: Array.from({ length: 9 }, () => []),
            },
            ownerId: null,
          }),
        );
      }
    }, old.sessions.teen_adult);
    let p = await c.newPage();
    await p.goto(origin + "/career-assessment", { waitUntil: "networkidle" });
    await p.getByRole("button", { name: "Restart test", exact: true }).click();
    await p.locator(".picture-assessment").waitFor();
    await p.locator("label:has(input[value=female])").click();
    await p.locator("label:has(input[value=teen_adult])").click();
    await p.locator(".picture-card .picture-primary").click();
    await p.locator("#picture-question").waitFor();
    // A header control owns its own shortcuts; answering is scoped to the main test.
    await p.getByRole("button", { name: "Motion", exact: true }).focus();
    await p.keyboard.press("5");
    assert.equal(await p.locator(".picture-answers input:checked").count(), 0);
    await p.locator("#picture-question").focus();
    await p.keyboard.press("5");
    assert.equal(await p.locator(".picture-answers input:checked").count(), 1);
    for (let n = 0; n < 12; n++) {
      if (n > 0) await p.locator(".picture-answers label").first().click();
      await p.locator(".picture-card .picture-primary").click();
    }
    await p.locator(".picture-celebrate .picture-primary").click();
    await p.locator(".picture-tips").waitFor();
    const chips = p.locator("header .picture-part-current");
    assert.match(await chips.innerText(), /2 ·\s*Reasoning/);
    assert.equal(await p.locator(".picture-part-done").count(), 1);
    await p.locator(".picture-card .picture-primary").click();
    await p.locator("#picture-question").waitFor();
    await p.locator(".picture-answers label").first().click();
    await p.locator(".picture-card .picture-secondary").click();
    assert.equal(
      await p.evaluate(
        () => JSON.parse(localStorage.getItem("abilitio.picture-draft.v1:guest")).step,
      ),
      11,
    );
    await p.screenshot({
      path: "artifacts/picture-assessment-qa/controls-desktop.png",
      fullPage: true,
    });
    receipt.push({
      legacyResumeAndRestart: true,
      scopedShortcuts: true,
      reasoningIntroChips: true,
      back: true,
    });
    await c.close();
    // Block only draft storage: no silent Save-and-exit when persistence fails.
    const blocked = await b.newContext({ reducedMotion: "reduce" });
    await blocked.addInitScript(() => {
      const set = Storage.prototype.setItem;
      Storage.prototype.setItem = function (key, value) {
        if (key.startsWith("abilitio.picture-draft"))
          throw new DOMException("Quota", "QuotaExceededError");
        return set.call(this, key, value);
      };
    });
    p = await blocked.newPage();
    await p.goto(origin + "/career-assessment", { waitUntil: "networkidle" });
    await p.locator("label:has(input[value=female])").click();
    await p.locator("label:has(input[value=teen_adult])").click();
    await p.locator(".picture-card .picture-primary").click();
    await p.locator("#picture-question").waitFor();
    await p.locator(".picture-answers label").first().click();
    await p.getByRole("button", { name: "Save and exit", exact: true }).click();
    await p.getByRole("alert").waitFor();
    assert.ok(p.url().endsWith("/career-assessment"));
    receipt.push({ storageFailureKeepsTestOpen: true });
    await blocked.close();
    // Guest -> auth redirect -> simulated sign-in: transfer all answers into one owner key.
    const handoff = await b.newContext({ reducedMotion: "reduce" });
    await handoff.route("**/src/lib/auth-context.tsx*", async (route) => {
      const response = await route.fetch();
      await route.fulfill({
        response,
        body: (await response.text()).replace(
          "return useContext(Ctx);",
          "const original=useContext(Ctx); return original.loading?original:{...original,user:sessionStorage.getItem('qa.signed-in')?(window.__pictureQAUser??={id:'00000000-0000-4000-8000-000000000001',email:'qa@example.invalid'}):null,loading:false};",
        ),
      });
    });
    await handoff.route("**/src/lib/assessment/picture-progress.functions.ts*", (route) =>
      route.fulfill({
        contentType: "text/javascript",
        body: "export const loadPictureDraft=async()=>null;export const savePictureDraft=async()=>({saved:true});export const deletePictureDraft=async()=>({deleted:true});",
      }),
    );
    p = await handoff.newPage();
    await p.goto(origin + "/career-assessment", { waitUntil: "networkidle" });
    await p.locator("label:has(input[value=female])").click();
    await p.locator("label:has(input[value=teen_adult])").click();
    await p.locator(".picture-card .picture-primary").click();
    for (let n = 0; n < 30; n++) {
      await p.locator("#picture-question").waitFor();
      await p.locator(".picture-answers label").first().click();
      await p.locator(".picture-card .picture-primary").click();
      if (n === 11 || n === 20) {
        await p.locator(".picture-celebrate .picture-primary").click();
        if (n === 11) await p.locator(".picture-card .picture-primary").click();
      }
    }
    await p.locator(".picture-finish .picture-primary").click();
    await p.waitForURL("**/auth?**");
    await p.evaluate(() => sessionStorage.setItem("qa.signed-in", "yes"));
    await p.goto(origin + "/career-assessment", { waitUntil: "networkidle" });
    await p.locator(".picture-card .picture-primary").click();
    await p.locator(".picture-finish").waitFor();
    const transferred = await p.evaluate(() => ({
      guest: localStorage.getItem("abilitio.picture-draft.v1:guest"),
      owner: JSON.parse(
        localStorage.getItem("abilitio.picture-draft.v1:00000000-0000-4000-8000-000000000001"),
      ),
    }));
    assert.equal(transferred.guest, null);
    assert.equal(
      Object.values(transferred.owner.observations).filter((o) => o.answered).length,
      30,
    );
    receipt.push({ guestAuthRedirectAndOwnerTransfer: true, authenticationFixture: true });
    await handoff.close();
    // All four new practice puzzles and localized red-pen rules, with no numerical samples.
    for (const lang of ["en", "ru", "uz"])
      for (const width of [390, 1440])
        for (const theme of ["light", "dark"]) {
          const context = await b.newContext({
            viewport: { width, height: 900 },
            reducedMotion: "reduce",
          });
          await context.addInitScript(
            ({ lang, theme }) => {
              localStorage.setItem("abilitio_lang", lang);
              localStorage.setItem("abilitio-theme", theme);
              localStorage.setItem("abilitio-motion", "off");
            },
            { lang, theme },
          );
          const page = await context.newPage();
          await page.goto(origin + "/", { waitUntil: "networkidle" });
          for (let i = 0; i < 4; i++) {
            if (width === 390 && i === 0) await page.locator(".bench-index-toggle").click();
            await page.locator(".item-grid button").nth(i).click();
            await page.locator(".question-desk .picture-answers label").first().click();
            await page.locator(".question-actions .field-button").first().click();
            await page.locator(".picture-rule").waitFor();
            assert.ok((await page.locator(".picture-rule").innerText()).length > 35);
            assert.equal(
              await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
              false,
            );
          }
          await page.locator(".question-desk").screenshot({
            path: `artifacts/picture-assessment-qa/practice-${lang}-${width}-${theme}.png`,
          });
          receipt.push({ practice: true, lang, width, theme, questions: 4 });
          await context.close();
        }
    await fs.writeFile(
      "artifacts/picture-assessment-qa/controls.json",
      JSON.stringify({ scope: "Local controls and practice browser checks", receipt }, null, 2),
    );
    console.log("Controls and 12 localized practice configurations passed");
  } finally {
    await b.close();
  }
}
main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
