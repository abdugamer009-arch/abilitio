// Public-route smoke and browser error gate. Issue-specific flows are added
// here as each repair lands; mobile-qa covers signed assessment/results flows.
const { chromium, devices } = require("playwright");
const { spawn } = require("node:child_process");
const origin = process.env.QA_ORIGIN || "http://127.0.0.1:8080";
const chrome = process.env.BROWSER_EXE;
const routes = ["/", "/career-assessment", "/career-battles", "/universities", "/methodology"];

(async () => {
  let server;
  try {
    await fetch(origin);
  } catch {
    server = spawn(
      process.execPath,
      [
        "node_modules/vite/bin/vite.js",
        "--host",
        "127.0.0.1",
        "--port",
        new URL(origin).port || "8080",
        "--strictPort",
      ],
      { stdio: "ignore", windowsHide: true },
    );
    let ready = false;
    for (let n = 0; n < 100; n++) {
      try {
        await fetch(origin);
        ready = true;
        break;
      } catch {
        await new Promise((resolve) => setTimeout(resolve, 200));
      }
    }
    if (!ready) {
      server.kill();
      throw new Error(`Local test server did not start at ${origin}`);
    }
  }
  const browser = await chromium.launch({
    headless: true,
    ...(chrome ? { executablePath: chrome } : {}),
  });
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
    await require("./qa-features.cjs").runFeatureChecks(origin);
    await require("./qa-export-locales.cjs").runExportLocaleChecks(origin);
    await require("./qa-controls.cjs").runControlChecks(origin);
    await require("./qa-recovery.cjs").runRecoveryChecks(origin);
    await require("./qa-accessibility.cjs").runAccessibility(origin);
    await require("./qa-matrix.cjs").runMatrix(origin);
    await require("./qa-keyboard.cjs").runKeyboardChecks(origin);
    await require("./qa-copy.cjs").runCopyChecks(origin);
    await new Promise((resolve, reject) => {
      const child = spawn(process.execPath, ["scripts/verify-profile-flow.cjs"], {
        stdio: "inherit",
        env: { ...process.env, QA_ORIGIN: origin },
      });
      child.once("error", reject);
      child.once("exit", (code) =>
        code === 0 ? resolve() : reject(new Error("Four-profile browser regression failed")),
      );
    });
  } finally {
    await browser.close();
    server?.kill();
  }
  console.log(
    `${checked}/${routes.length * 2} public route checks passed with no console or request errors`,
  );
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
