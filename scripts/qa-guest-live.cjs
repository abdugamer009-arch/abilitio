// Real guest browser checks. No account, form submission or data API is mocked.
const { chromium } = require("playwright");
const fs = require("node:fs/promises");
const path = require("node:path");
const assert = require("node:assert/strict");

async function runGuestLive(origin = "https://abilitio-xt4n.vercel.app") {
  const out = path.resolve("artifacts/full-qa/guest-live");
  await fs.mkdir(out, { recursive: true });
  const inventory = JSON.parse(await fs.readFile("artifacts/full-qa/inventory.json", "utf8"));
  const routes = inventory.filter((item) => item.kind === "route");
  const browser = await chromium.launch({ headless: true });
  const rows = [];
  try {
    // Independent anonymous contexts never reuse the owner's browser session.
    await Promise.all(
      [390, 768, 1440].map(async (width) => {
        let consecutiveTimeouts = 0;
        let transportBlocked = false;
        for (const lang of ["en", "ru", "uz"]) {
          for (const theme of ["light", "dark"]) {
            const context = await browser.newContext({
              viewport: { width, height: width === 1440 ? 1000 : 844 },
              reducedMotion: "reduce",
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
            const faults = [];
            page.on("pageerror", (e) => faults.push(`page: ${e.message}`));
            page.on("console", (m) => {
              if (m.type() === "error") faults.push(`console: ${m.text()}`);
            });
            page.on("requestfailed", (r) =>
              faults.push(`request: ${r.url()} ${r.failure()?.errorText}`),
            );
            for (const item of routes) {
              const route = item.id === "PAGE-404" ? "/qa-not-found" : item.detail;
              const before = faults.length;
              const row = {
                id: item.id,
                route,
                width,
                lang,
                theme,
                origin,
                role: "guest",
                fixture: false,
              };
              if (transportBlocked) {
                rows.push({
                  ...row,
                  result: "NOT CHECKED",
                  failure:
                    "Three consecutive navigation timeouts; transport must recover before more requests.",
                });
                continue;
              }
              try {
                console.log(`START ${width}/${lang}/${theme} ${route}`);
                const response = await page.goto(origin + route, {
                  waitUntil: "networkidle",
                  timeout: 45000,
                });
                row.status = response.status();
                if (route === "/sitemap.xml") {
                  assert.equal(row.status, 200);
                  assert.ok((await page.content()).includes("urlset"));
                } else {
                  await page.locator("h1, main").first().waitFor();
                  await page.waitForFunction(
                    (lang) => document.documentElement.lang === lang,
                    lang,
                  );
                  await page.waitForFunction(() => document.fonts.status === "loaded", null, {
                    timeout: 10000,
                  });
                  row.state = await page.evaluate(() => ({
                    url: location.pathname + location.search,
                    lang: document.documentElement.lang,
                    dark: document.documentElement.classList.contains("dark"),
                    overflow: document.documentElement.scrollWidth > innerWidth + 1,
                    heading: document.querySelector("h1")?.textContent?.trim(),
                    blankLinks: [...document.querySelectorAll("a[href]")].filter(
                      (a) => a.getAttribute("href") === "#",
                    ).length,
                  }));
                  assert.equal(row.state.dark, theme === "dark", "theme mismatch");
                  assert.equal(row.state.overflow, false, "horizontal page overflow");
                  assert.equal(row.state.blankLinks, 0, "placeholder # link");
                  assert.ok(
                    row.status < 400 || (item.id === "PAGE-404" && row.status === 404),
                    `HTTP ${row.status}`,
                  );
                  if (item.id === "PAGE-404") assert.equal(row.state.heading, "404");
                }
                row.errors = faults
                  .slice(before)
                  .filter((m) => !(item.id === "PAGE-404" && m.includes("404")));
                assert.deepEqual(row.errors, [], "browser errors");
                row.result = "PASS";
                consecutiveTimeouts = 0;
              } catch (error) {
                row.result = "FAIL";
                row.failure = error.message;
                row.errors = faults.slice(before);
                consecutiveTimeouts = error.message.includes("page.goto: Timeout")
                  ? consecutiveTimeouts + 1
                  : 0;
                transportBlocked = consecutiveTimeouts >= 3;
              }
              if (row.result === "FAIL" || (lang === "en" && theme === "light" && width !== 768)) {
                row.screenshot = `${item.id}-${width}-${lang}-${theme}.png`;
                await page
                  .screenshot({ path: path.join(out, row.screenshot), timeout: 10000 })
                  .catch(() => {});
              }
              rows.push(row);
              await fs.writeFile(path.join(out, "results.json"), JSON.stringify(rows, null, 2));
            }
            await context.close();
            console.log(
              `Guest routes ${width}/${lang}/${theme}: ${rows.filter((r) => r.width === width && r.lang === lang && r.theme === theme && r.result === "PASS").length}/${routes.length}`,
            );
          }
        }
      }),
    );
  } finally {
    await browser.close();
    await fs.writeFile(path.join(out, "results.json"), JSON.stringify(rows, null, 2));
  }
  const failures = rows.filter((r) => r.result !== "PASS");
  console.log(
    `${rows.length - failures.length}/${rows.length} real guest route matrix assertions passed; ${failures.length} failures.`,
  );
  if (failures.length) throw new Error(`Guest matrix failed; see ${out}/results.json`);
  return rows;
}
module.exports = { runGuestLive };
if (require.main === module)
  runGuestLive(process.env.QA_ORIGIN).catch((e) => {
    console.error(e.message);
    process.exitCode = 1;
  });
