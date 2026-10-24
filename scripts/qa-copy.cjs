const { chromium } = require("playwright");
const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const { fixtures, install, errors } = require("./qa-support.cjs");
async function runCopyChecks(origin = "http://127.0.0.1:8080") {
  const b = await chromium.launch();
  const data = await fixtures();
  await fs.mkdir("artifacts/qa/copy", { recursive: true });
  try {
    for (const lang of ["en", "uz", "ru"]) {
      const c = await b.newContext({
        viewport: { width: 390, height: 844 },
        reducedMotion: "reduce",
      });
      await install(c, data, { lang });
      const p = await c.newPage();
      const faults = errors(p);
      await p.goto(origin + "/dashboard", { waitUntil: "networkidle" });
      await p.getByRole("button", { name: "ABBI Guide", exact: true }).click();
      // Folder tabs render their board in a React transition. Wait for the
      // selected panel before reading copy from the outgoing Results board.
      await p.locator(".student-abbi").waitFor();
      const abbi = await p.locator("main").innerText();
      assert.ok(abbi.includes({ en: "rule-based", uz: "Qoidalar", ru: "по правилам" }[lang]));
      assert.ok(!abbi.includes("ABBI AI"));
      await p.screenshot({ path: `artifacts/qa/copy/M10-${lang}.png`, fullPage: true });
      await p.locator("main textarea").fill("Software Engineer");
      await p.locator("main textarea").press("Enter");
      await p.waitForFunction(() => document.querySelectorAll(".chat-md").length >= 2);
      const guide = await p.locator(".chat-md").last().innerText();
      assert.ok(guide.length > 100);
      assert.ok(!/High demand globally|Strong compensation|\$\d/.test(guide));
      await p.screenshot({ path: `artifacts/qa/copy/M11-${lang}.png`, fullPage: true });
      await p.goto(origin + "/school/register", { waitUntil: "networkidle" });
      assert.equal(await p.locator("button[type=submit]").isDisabled(), true);
      assert.equal(await p.locator("dd").count(), 3);
      const placeholders = await p.locator("dd").allTextContents();
      assert.ok(placeholders.every((s) => s.startsWith("[")));
      await p.screenshot({ path: `artifacts/qa/copy/M13-${lang}.png`, fullPage: true });
      await p.goto(origin + "/about", { waitUntil: "networkidle" });
      assert.equal(await p.locator(".person-register article").count(), 2);
      assert.equal(await p.locator(".person-register dt").count(), 2);
      assert.ok(
        (await p.locator(".person-register dd").allTextContents()).every(
          (text) => text.trim().length > 10 && !text.startsWith("["),
        ),
      );
      await p.screenshot({ path: `artifacts/qa/copy/L03-${lang}.png`, fullPage: true });
      await p.goto(origin + "/terms", { waitUntil: "networkidle" });
      const terms = await p.locator("main").innerText();
      assert.ok(
        terms.includes(
          {
            en: "Student tools are free.",
            uz: "O‘quvchi vositalari bepul.",
            ru: "Инструменты для учеников бесплатны.",
          }[lang],
        ),
      );
      assert.ok(!terms.includes("There are no paid plans"));
      await p.screenshot({ path: `artifacts/qa/copy/M12-${lang}.png`, fullPage: true });
      assert.deepEqual(faults, []);
      await c.close();
      console.log(
        "Guide, gated school agreement, existing founder profiles and free/student terms verified in " +
          lang,
      );
    }
  } finally {
    for (const context of b.contexts()) await context.unrouteAll({ behavior: "wait" });
    await b.close();
  }
}
module.exports = { runCopyChecks };
if (require.main === module)
  runCopyChecks().catch((e) => {
    console.error(e);
    process.exitCode = 1;
  });
