const { chromium } = require("playwright");
const assert = require("node:assert/strict");
const fs = require("node:fs/promises");

async function runShellNetwork(origin = "http://127.0.0.1:8104") {
  const browser = await chromium.launch();
  const rows = [];
  await fs.mkdir("artifacts/full-qa/shell-network", { recursive: true });
  try {
    for (const width of [390, 768, 1440]) {
      const context = await browser.newContext({
        viewport: { width, height: 900 },
        reducedMotion: "reduce",
      });
      const page = await context.newPage();
      page.setDefaultTimeout(15000);
      for (const route of [
        "/",
        "/about",
        "/features",
        "/pricing",
        "/for-schools",
        "/methodology",
        "/mentors",
        "/success-stories",
        "/contact",
        "/universities",
        "/career-battles",
        "/career-assessment",
        "/auth",
      ]) {
        await page.goto(origin + route, { waitUntil: "networkidle" });
        for (const [label, lang] of [
          ["RU", "ru"],
          ["UZ", "uz"],
          ["ENG", "en"],
        ]) {
          if (width < 1280 && !(await page.locator("#site-menu").isVisible()))
            await page.locator('button[aria-controls="site-menu"]').click();
          await page
            .locator(".language-option:visible")
            .filter({ hasText: new RegExp(`^${label}$`) })
            .click();
          await page.locator(`html[lang=${lang}]`).waitFor();
          assert.ok((await page.locator("main").innerText()).trim().length > 10);
          assert.equal(
            await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1),
            false,
          );
        }
        if (await page.locator("#site-menu").isVisible())
          await page.locator('button[aria-controls="site-menu"]').click();
        await page.locator("header .theme-switch").click();
        await page.waitForFunction(() => document.documentElement.classList.contains("dark"));
        await page.reload({ waitUntil: "networkidle" });
        await page.waitForFunction(() => document.documentElement.classList.contains("dark"));
        await page.locator("header .theme-switch").click();
        await page.waitForFunction(() => !document.documentElement.classList.contains("dark"));
        assert.equal(
          await page.evaluate(() => document.documentElement.dataset.motion),
          "off",
          "System reduce must override animation preference",
        );
        rows.push({
          id: "FLOW-11",
          route,
          width,
          result: "PASS",
          checks: "click all languages; menu; theme/reload; reduced motion",
        });
      }
      await page.emulateMedia({ reducedMotion: "no-preference" });
      await page.goto(origin, { waitUntil: "networkidle" });
      await page.waitForFunction(() => document.documentElement.dataset.motion === "on");
      await page.locator(".hero-instrument").scrollIntoViewIfNeeded();
      await page.waitForFunction(
        () => document.querySelector(".hero-instrument")?.dataset.playing === "true",
      );
      const before = await page.locator(".hero-instrument").getAttribute("data-step");
      await page.waitForFunction(
        (step) => document.querySelector(".hero-instrument")?.dataset.step !== step,
        before,
        { timeout: 4000 },
      );
      await page.locator(".motion-toggle").click();
      await page.waitForFunction(() => document.documentElement.dataset.motion === "off");
      await page.reload({ waitUntil: "networkidle" });
      await page.waitForFunction(() => document.documentElement.dataset.motion === "off");
      rows.push({
        id: "FLOW-11",
        width,
        result: "PASS",
        checks: "Motion on/off/reload; live hero timer; system reduce",
      });

      await page.goto(origin + "/career-assessment", { waitUntil: "networkidle" });
      await page.locator('label:has(input[value="male"])').click();
      await page.locator('label:has(input[value="teen_adult"])').click();
      await context.setOffline(true);
      await page.locator("[data-mobile-primary]").click();
      await page.locator(".text-destructive").filter({ hasText: /.+/ }).first().waitFor();
      await context.setOffline(false);
      const cdp = await context.newCDPSession(page);
      await cdp.send("Network.enable");
      // Explicit Slow 4G profile: 150ms latency, 1.6Mbps down, 750Kbps up.
      await cdp.send("Network.emulateNetworkConditions", {
        offline: false,
        latency: 150,
        downloadThroughput: 1600000 / 8,
        uploadThroughput: 750000 / 8,
      });
      await page.locator("[data-mobile-primary]").click();
      await page.locator('[data-question-index="0"]').waitFor();
      await page.locator('main label:has(input[type="radio"])').first().click();
      await page.reload({ waitUntil: "networkidle" });
      await page.getByRole("button", { name: "Continue where you left off", exact: true }).click();
      await page.locator('[data-question-index="0"]').waitFor();
      assert.equal(await page.locator('main input[type="radio"]:checked').count(), 1);
      rows.push({
        id: "FLOW-02",
        width,
        result: "PASS GUEST",
        checks:
          "offline start error/retry; real signed questions on Slow 4G; draft survives reload",
        liveSaving: "NOT CHECKED",
      });
      await page.screenshot({
        path: `artifacts/full-qa/shell-network/slow-4g-resume-${width}.png`,
      });
      await context.close();
      console.log(`Shell/motion/offline/Slow 4G guest checks passed at ${width}px`);
    }
  } finally {
    await browser.close();
    await fs.writeFile(
      "artifacts/full-qa/shell-network/results.json",
      JSON.stringify(rows, null, 2),
    );
  }
}
module.exports = { runShellNetwork };
if (require.main === module)
  runShellNetwork(process.env.QA_ORIGIN).catch((e) => {
    console.error(e);
    process.exitCode = 1;
  });
