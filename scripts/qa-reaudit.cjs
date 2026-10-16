// Anonymous public-page regression checks. Contact submissions are intercepted on device.
const { chromium, firefox } = require("playwright");
const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const { AxeBuilder } = require("@axe-core/playwright");
const { errors } = require("./qa-support.cjs");
const forgot = { en: "Forgot password?", uz: "Parolni unutdingizmi?", ru: "Забыли пароль?" };
async function runReauditChecks(origin = "http://127.0.0.1:8080", options = {}) {
  const only = options.issue;
  const reports = [];
  const out = "artifacts/qa/reaudit/regressions";
  await fs.mkdir(out, { recursive: true });
  for (const name of (process.env.QA_BROWSERS || "chromium").split(",")) {
    assert.ok(["chromium", "firefox"].includes(name));
    const b = await { chromium, firefox }[name].launch();
    try {
      for (const width of only ? [390] : [1440, 320])
        for (const lang of only ? ["en"] : ["en", "uz", "ru"])
          for (const theme of only ? ["light"] : ["light", "dark"]) {
            const c = await b.newContext({
              viewport: { width, height: 900 },
              timezoneId: "Asia/Tashkent",
              reducedMotion: "reduce",
            });
            await c.addInitScript(
              ({ lang, theme }) => {
                localStorage.setItem("abilitio_lang", lang);
                localStorage.setItem("abilitio-theme", theme);
              },
              { lang, theme },
            );
            const p = await c.newPage();
            const faults = errors(p);
            const id = `${name}-${width}-${lang}-${theme}`;
            const routes =
              only === "R01"
                ? ["/auth?mode=register", "/auth?mode=signup", "/auth?mode=unsupported"]
                : only === "R02"
                  ? ["/auth"]
                  : only === "R03"
                    ? ["/", "/features", "/pricing"]
                    : [
                        "/auth?mode=register",
                        "/auth?mode=signup",
                        "/auth",
                        "/",
                        "/features",
                        "/pricing",
                        "/mentors",
                        "/success-stories",
                        "/for-schools",
                        "/contact?topic=school",
                      ];
            for (const route of routes) {
              const r = await p.goto(origin + route, { waitUntil: "networkidle" });
              const screenshot = `${out}/${id}-${route.slice(1).replace(/\W/g, "-") || "landing"}.png`;
              await p.screenshot({ path: screenshot, fullPage: true });
              assert.equal(r.status(), 200, route);
              await p.locator(`html[lang="${lang}"]`).waitFor();
              if (route.startsWith("/auth")) {
                assert.equal(
                  await p.locator('input[autocomplete="given-name"]').count(),
                  route.includes("signup") ? 1 : 0,
                );
                if (route === "/auth") {
                  const button = p.getByRole("button", { name: forgot[lang], exact: true });
                  if (await button.isDisabled()) {
                    assert.equal(
                      await button.getAttribute("aria-describedby"),
                      "recovery-unavailable",
                    );
                    assert.equal(await p.locator("#recovery-unavailable").isVisible(), true);
                    assert.match(
                      await p.locator("#recovery-unavailable a").getAttribute("href"),
                      /^mailto:/,
                    );
                  }
                }
              }
              if (["/", "/features"].includes(route)) {
                const note = p.locator("[data-assessment-age-note]");
                assert.equal(await note.count(), 1, "R03 child path explanation missing");
                assert.match(await note.innerText(), /14.*12.*18/s);
                if (route === "/")
                  assert.match(await p.locator(".assessment-composition > p").innerText(), /15/);
              }
              assert.equal(
                await p.evaluate(() => document.documentElement.scrollWidth > innerWidth),
                false,
                route,
              );
              if (!only && lang === "en") {
                const a = await new AxeBuilder({ page: p })
                  .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
                  .analyze();
                assert.deepEqual(
                  a.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.html) })),
                  [],
                  route,
                );
              }
              reports.push({ id, route, screenshot, mockedAccount: false });
            }
            if (!only) {
              let sent = 0;
              await c.route("https://formspree.io/**", async (route) => {
                sent++;
                const body = route.request().postDataJSON();
                assert.equal(body.topic, "school");
                assert.equal(body.email, "qa@example.invalid");
                await route.fulfill({
                  status: 200,
                  contentType: "application/json",
                  body: JSON.stringify({ ok: true }),
                });
              });
              await p.locator('input[name="name"]').fill("QA Fixture");
              await p.locator('input[name="email"]').fill("qa@example.invalid");
              await p.locator('input[name="institution"]').fill("Fixture school");
              await p.locator('input[name="role"]').fill("QA");
              await p.locator('input[name="students"]').fill("10");
              await p
                .locator('textarea[name="message"]')
                .fill("Mocked QA inquiry; never delivered.");
              await p.locator("form button").click();
              await p.locator(".sample-result[role=status]").waitFor();
              assert.equal(sent, 1);
              await p.screenshot({ path: `${out}/${id}-contact-mocked.png`, fullPage: true });
            }
            assert.deepEqual(faults, []);
            await c.close();
            console.log(`Public regression checks passed ${id}`);
          }
    } finally {
      await b.close();
    }
  }
  await fs.writeFile(
    `${out}/receipt${only ? "-" + only : ""}.json`,
    JSON.stringify(reports, null, 2),
  );
}
module.exports = { runReauditChecks };
if (require.main === module)
  runReauditChecks(process.env.QA_ORIGIN, {
    issue: process.argv.find((a) => a.startsWith("--issue="))?.slice(8),
  }).catch((e) => {
    console.error(e);
    process.exitCode = 1;
  });
