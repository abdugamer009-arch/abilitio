// Capture the current experience before audit repairs. Protected pages are
// recorded as their honest unauthenticated redirect when no QA account exists.
const fs = require("node:fs/promises");
const path = require("node:path");
const { chromium, devices } = require("playwright");

const origin = process.env.QA_ORIGIN || "http://127.0.0.1:8080";
const chrome = process.env.BROWSER_EXE || "C:/Program Files/Google/Chrome/Application/chrome.exe";
const out = path.resolve("baseline");
const profiles = [
  ["desktop", 1440, 1000, null],
  ["tablet", 768, 1024, "iPad Mini"],
  ["iphone-15", 390, 844, "iPhone 15"],
  ["android-small", 320, 568, "Pixel 7"],
];
const routes = [
  ["landing", "/"],
  ["chooser", "/career-assessment"],
  ["results", "/career-results"],
  ["dashboard", "/dashboard"],
  ["roadmap", "/roadmap"],
  ["career-battles", "/career-battles"],
  ["universities", "/universities"],
  ["settings", "/dashboard"],
];

(async () => {
  await fs.mkdir(out, { recursive: true });
  const browser = await chromium.launch({ headless: true, executablePath: chrome });
  const records = [];
  try {
    for (const [profile, width, height, device] of profiles) {
      for (const screen of ["landing", "chooser", "q01", "result"]) {
        const source = path.resolve(
          "mobile-report/latest/en",
          `${profile}-en-teen_adult-longest-${screen}.png`,
        );
        try {
          await fs.copyFile(source, path.join(out, `${profile}-signed-${screen}.png`));
          records.push({
            profile,
            width,
            height,
            screen: `signed-${screen}`,
            source: "previous signed-fixture mobile QA; simulated account/result delivery",
            image: `${profile}-signed-${screen}.png`,
          });
        } catch (error) {
          if (error.code !== "ENOENT") throw error;
        }
      }
      const context = await browser.newContext({
        ...(device ? devices[device] : {}),
        viewport: { width, height },
        reducedMotion: "reduce",
      });
      const page = await context.newPage();
      for (const [name, route] of routes) {
        const consoleErrors = [];
        const failedRequests = [];
        const onError = (error) => consoleErrors.push(error.message);
        const onRequest = (request) =>
          failedRequests.push(`${request.url()} ${request.failure()?.errorText}`);
        page.on("pageerror", onError);
        page.on("requestfailed", onRequest);
        let navigationError = null;
        try {
          await page.goto(origin + route, { waitUntil: "domcontentloaded", timeout: 30000 });
          await page.waitForTimeout(1200);
        } catch (error) {
          navigationError = error.message;
        }
        const image = `${profile}-${name}.png`;
        await page.screenshot({ path: path.join(out, image), fullPage: true, timeout: 30000 });
        records.push({
          profile,
          width,
          height,
          screen: name,
          requested: route,
          actual: page.url(),
          image,
          navigationError,
          consoleErrors,
          failedRequests,
          accountLimited: ["results", "dashboard", "settings"].includes(name),
        });
        page.off("pageerror", onError);
        page.off("requestfailed", onRequest);
      }
      await context.close();
    }
  } finally {
    await browser.close();
  }
  await fs.writeFile(path.join(out, "index.json"), JSON.stringify(records, null, 2));
  console.log(`Saved ${records.length} baseline captures to ${out}`);
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
