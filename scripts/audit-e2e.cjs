// Public-route smoke and browser error gate. Issue-specific flows are added
// here as each repair lands; mobile-qa covers signed assessment/results flows.
const { chromium, devices } = require("playwright");
const origin = process.env.QA_ORIGIN || "http://127.0.0.1:8080";
const chrome = process.env.BROWSER_EXE || "C:/Program Files/Google/Chrome/Application/chrome.exe";
const routes = ["/", "/career-assessment", "/career-battles", "/universities", "/methodology"];

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: chrome });
  let checked = 0;
  try {
    for (const [name, viewport, profile] of [
      ["desktop", { width: 1440, height: 1000 }, null],
      ["phone", { width: 390, height: 844 }, "iPhone 15"],
    ]) {
      const context = await browser.newContext({
        ...(profile ? devices[profile] : {}),
        viewport,
        reducedMotion: "reduce",
      });
      const page = await context.newPage();
      const errors = [];
      page.on("pageerror", (error) => errors.push(`page: ${error.message}`));
      page.on("console", (message) => {
        if (message.type() === "error") errors.push(`console: ${message.text()}`);
      });
      page.on("requestfailed", (request) => {
        if (!request.failure()?.errorText?.includes("ERR_ABORTED"))
          errors.push(`request: ${request.url()} ${request.failure()?.errorText}`);
      });
      page.on("response", (response) => {
        if (response.status() >= 400) errors.push(`HTTP ${response.status()}: ${response.url()}`);
      });
      for (const route of routes) {
        const before = errors.length;
        await page.goto(origin + route, { waitUntil: "load", timeout: 30000 });
        await page.locator("main").waitFor();
        await page.evaluate(() => document.fonts.ready);
        if (errors.length > before)
          throw new Error(`${name} ${route}: ${errors.slice(before).join("; ")}`);
        checked++;
      }
      await context.close();
    }
  } finally {
    await browser.close();
  }
  console.log(
    `${checked}/${routes.length * 2} public route checks passed with no console or request errors`,
  );
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
