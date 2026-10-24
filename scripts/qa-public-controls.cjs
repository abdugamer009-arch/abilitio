const { chromium } = require("playwright");
const assert = require("node:assert/strict");
const fs = require("node:fs/promises");

async function runPublicControls(origin = "http://127.0.0.1:8104") {
  const browser = await chromium.launch();
  const rows = [];
  await fs.mkdir("artifacts/full-qa/public-controls", { recursive: true });
  try {
    for (const width of [390, 1440])
      for (const lang of ["en", "ru", "uz"])
        for (const theme of ["light", "dark"]) {
          const context = await browser.newContext({
            viewport: { width, height: 900 },
            reducedMotion: "reduce",
            permissions: ["clipboard-read", "clipboard-write"],
          });
          await context.addInitScript(
            ({ lang, theme }) => {
              localStorage.setItem("abilitio_lang", lang);
              localStorage.setItem("abilitio-theme", theme);
            },
            { lang, theme },
          );
          const page = await context.newPage();
          page.setDefaultTimeout(12000);
          await page.goto(origin, { waitUntil: "networkidle" });
          await page.locator(`html[lang=${lang}]`).waitFor();
          for (let i = 0; i < 4; i++) {
            await page.locator("#practice-index .item-tile").nth(i).click();
            const buttons = page.locator(".question-actions button");
            assert.equal(await buttons.first().isDisabled(), true);
            await buttons.last().click();
            await page.locator(".picture-rule").waitFor();
            assert.ok((await page.locator(".picture-rule").innerText()).length > 20);
            await buttons.last().click();
            await page.locator(".picture-rule").waitFor({ state: "hidden" });
            await page
              .locator(".picture-answers label")
              .nth(i % 4)
              .click();
            await buttons.first().press("Enter");
            await page.locator(".answer-status").waitFor();
            assert.match(
              await page.locator(".bench-count strong").innerText(),
              new RegExp(`${i + 1}\\s*/\\s*4`),
            );
          }
          await page.reload({ waitUntil: "networkidle" });
          await page.waitForFunction(
            () => document.querySelectorAll(".item-tile.is-answered").length === 4,
          );
          assert.match(await page.locator(".bench-count strong").innerText(), /4\s*\/\s*4/);
          await page.locator(".bench-bottom button").click();
          assert.match(await page.locator(".bench-count strong").innerText(), /0\s*\/\s*4/);
          assert.equal(await page.locator(".item-tile.is-answered").count(), 0);
          rows.push({
            id: "FLOW-03",
            width,
            lang,
            theme,
            result: "PASS",
            transport: "real public UI; browser-local data",
          });

          await page.goto(origin + "/universities", { waitUntil: "networkidle" });
          await page.locator(".d4-notebook article").nth(19).waitFor();
          assert.equal(await page.locator(".d4-notebook article").count(), 20);
          const search = page.locator("input[type=search]");
          const countries = page.locator("main select");
          for (const country of await countries
            .locator("option")
            .evaluateAll((options) => options.map((o) => o.value).filter(Boolean))) {
            await countries.selectOption(country);
            assert.ok((await page.locator(".d4-notebook article").count()) > 0);
          }
          await countries.selectOption("USA");
          await search.fill("Stanford");
          assert.equal(await page.locator(".d4-notebook article").count(), 1);
          const mark = page.locator(".d4-university-links button");
          await mark.press("Space");
          assert.equal(await mark.getAttribute("aria-pressed"), "true");
          await page.reload({ waitUntil: "networkidle" });
          await page.locator('.d4-university-links button[aria-pressed="true"]').waitFor();
          assert.match(
            await page.locator("main [role=status]").innerText(),
            /20\s*\/\s*20\s*·\s*1/,
          );
          await countries.selectOption("UK");
          await search.fill("Stanford");
          assert.equal(await page.locator(".d4-notebook article").count(), 0);
          assert.match(await page.locator("main [role=status]").innerText(), /0\s*\/\s*20\s*·\s*1/);
          await search.fill("");
          await countries.selectOption("");
          const links = await page
            .locator(".d4-university-links a")
            .evaluateAll((nodes) =>
              nodes.map((a) => ({ href: a.href, target: a.target, rel: a.rel })),
            );
          assert.equal(links.length, 40);
          assert.ok(
            links.every(
              (a) =>
                a.href.startsWith("https://") &&
                a.target === "_blank" &&
                a.rel.includes("noreferrer"),
            ),
          );
          rows.push({
            id: "FLOW-08",
            width,
            lang,
            theme,
            result: "PASS",
            transport: "real public UI; bookmarks in isolated browser",
          });

          await page.goto(origin + "/contact", { waitUntil: "networkidle" });
          await page.locator(".d4-contact-face button").click();
          const address = (
            await page.locator('main a[href^="mailto:"]').first().getAttribute("href")
          ).slice(7);
          assert.equal(await page.evaluate(() => navigator.clipboard.readText()), address);
          assert.match(
            await page.locator('main a[href^="tel:"]').getAttribute("href"),
            /^tel:\+\d+$/,
          );
          let sent = 0;
          await context.route("https://formspree.io/**", async (route) => {
            sent++;
            await new Promise((resolve) => setTimeout(resolve, 200));
            const body = route.request().postDataJSON();
            assert.equal(body.email, "test-guest@example.invalid");
            await route.fulfill({
              status: sent === 1 ? 503 : 200,
              contentType: "application/json",
              body: JSON.stringify({ ok: sent !== 1 }),
            });
          });
          await page.locator('input[name="name"]').fill("test-guest");
          await page.locator('input[name="email"]').fill("invalid-address");
          await page
            .locator('textarea[name="message"]')
            .fill("TEST — intercepted locally; no message delivered.");
          const send = page.locator("form button");
          await send.click();
          assert.equal(sent, 0, "Invalid email reached the provider");
          await page.locator('input[name="email"]').fill("test-guest@example.invalid");
          await send.dblclick({ delay: 0 });
          await page.locator("form [role=alert]").waitFor();
          assert.equal(sent, 1, "Double click duplicated the submission");
          await send.click();
          await page.locator(".sample-result[role=status]").waitFor();
          assert.equal(sent, 2);
          await page.locator(".sample-result button").click();
          await page.locator('select[name="topic"]').selectOption("school");
          await page.locator('input[name="institution"]').waitFor();
          assert.equal(
            await page.locator('input[name="institution"]').getAttribute("required"),
            "",
          );
          await page.locator('select[name="topic"]').selectOption("assessment");
          assert.equal(await page.locator('input[name="institution"]').count(), 0);
          rows.push({
            id: "FLOW-09",
            width,
            lang,
            theme,
            result: "PASS UI",
            transport: "Formspree intercepted; live delivery NOT CHECKED",
          });
          await page.screenshot({
            path: `artifacts/full-qa/public-controls/contact-${width}-${lang}-${theme}.png`,
          });
          await context.close();
          console.log(`Practice, university and contact controls passed ${width}/${lang}/${theme}`);
        }
  } finally {
    await browser.close();
    await fs.writeFile(
      "artifacts/full-qa/public-controls/results.json",
      JSON.stringify(rows, null, 2),
    );
  }
}
module.exports = { runPublicControls };
if (require.main === module)
  runPublicControls(process.env.QA_ORIGIN).catch((e) => {
    console.error(e);
    process.exitCode = 1;
  });
