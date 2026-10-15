/* Daily phone regression runner. No production credentials/accounts are used.
 * Real device UA/touch profiles in Chromium. Node creates stripped, signed
 * catalog fixtures; only account/result delivery is mocked. --baseline records
 * the pre-fix failures, --quick samples types, default exercises every question.
 */
const fs = require("node:fs/promises");
const exists = require("node:fs").existsSync;
const path = require("node:path");
const { spawn } = require("node:child_process");
const { chromium, devices } = require("playwright");
const { build } = require("esbuild");
const origin = process.env.QA_ORIGIN || "http://127.0.0.1:8080";
const baseline = process.argv.includes("--baseline");
const quick = process.argv.includes("--quick") || baseline;
const filter = process.argv.find((arg) => arg.startsWith("--device="))?.split("=")[1];
const languageFilter = process.argv.find((arg) => arg.startsWith("--lang="))?.split("=")[1];
const stress = process.argv.includes("--stress");
const random = process.argv.includes("--random");
const mixedSignals = process.argv.includes("--mixed-signals");
const out = path.resolve(
  process.argv.find((arg) => arg.startsWith("--out="))?.slice(6) || "mobile-report",
  process.argv.some((arg) => arg.startsWith("--out="))
    ? ""
    : baseline
      ? "baseline"
      : stress
        ? "stress"
        : random
          ? "random"
          : "latest",
);
const draftKey = "abilitio.career_assessment.progress.v4";
const profileList = [
  ["iphone-se", "iPhone SE (3rd gen)", 375, 667],
  ["iphone-15", "iPhone 15", 390, 844],
  ["iphone-max", "iPhone 15 Pro Max", 430, 932],
  ["pixel-7", "Pixel 7", 412, 915],
  ["galaxy", "Galaxy S9+", 360, 800],
  ["android-small", "Pixel 7", 320, 568],
  ["iphone-landscape", "iPhone 15 landscape", 844, 390],
  ["galaxy-landscape", "Galaxy S9+ landscape", 800, 360],
  ["tablet", "iPad Mini", 768, 1024],
  ["desktop", null, 1440, 1000],
];

const { writeGallery } = require("./mobile-report.cjs");
const expectedRuns =
  profileList.filter(([id]) => !filter || id === filter).length * (languageFilter ? 1 : 3) * 2;
if (!expectedRuns || (languageFilter && !["en", "ru", "uz"].includes(languageFilter)))
  throw new Error("Unknown device or language filter; no mobile checks were run.");
const gallery = (rows, runs) => writeGallery(out, rows, runs, expectedRuns, baseline);

async function audit(page, active) {
  return page.evaluate(
    ({ active }) => {
      const failures = [];
      const root = document.querySelector("main");
      if (!root) return ["main missing"];
      const width = innerWidth;
      const scope = (el) => el.closest("main") && !el.closest('[aria-hidden="true"],.sr-only,svg');
      const visible = (el) => {
        const r = el.getBoundingClientRect();
        const css = getComputedStyle(el);
        return r.width > 0 && r.height > 0 && css.visibility !== "hidden" && css.display !== "none";
      };
      const name = (el) =>
        `${el.tagName.toLowerCase()}${el.className && typeof el.className === "string" ? "." + el.className.trim().split(/\s+/).slice(0, 2).join(".") : ""} ${el.textContent?.trim().slice(0, 65)}`;
      if (document.documentElement.scrollWidth > width)
        failures.push(`document overflow ${document.documentElement.scrollWidth}>${width}`);
      for (const el of root.querySelectorAll("*")) {
        if (!scope(el) || !visible(el)) continue;
        const r = el.getBoundingClientRect();
        if (r.left < -1 || r.right > width + 1)
          failures.push(
            `${name(el)} bounds ${r.left.toFixed(1)}..${r.right.toFixed(1)} outside ${width}px`,
          );
        const direct = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
        if (direct) {
          if (el.scrollWidth > el.clientWidth + 1)
            failures.push(`${name(el)} text clipped ${el.scrollWidth}>${el.clientWidth}`);
          if (parseFloat(getComputedStyle(el).fontSize) < 16)
            failures.push(`${name(el)} font ${getComputedStyle(el).fontSize}<16px`);
          if (getComputedStyle(el).whiteSpace === "nowrap")
            failures.push(`${name(el)} uses nowrap`);
        }
        if (el.matches("button,a,input[type=search],label:has(input[type=radio])")) {
          if (r.width < 43.5 || r.height < 43.5)
            failures.push(
              `${name(el)} tap target ${r.width.toFixed(1)}×${r.height.toFixed(1)}<44×44`,
            );
        }
        if (
          el.matches("h2,.scale-label,.choice-option,.visual-choice") &&
          el.scrollHeight > el.clientHeight + 2 &&
          !["auto", "scroll"].includes(getComputedStyle(el).overflowY)
        )
          failures.push(`${name(el)} vertical text clipped`);
      }
      const action =
        root.querySelector("[data-mobile-primary]") || [...root.querySelectorAll("button")].at(-1);
      if (!action) failures.push("primary action missing");
      else if (active && width < 1024) {
        const r = action.getBoundingClientRect();
        if (r.top < 0 || r.bottom > (visualViewport?.height ?? innerHeight) + 1)
          failures.push(
            `primary action offscreen ${r.top.toFixed(1)}..${r.bottom.toFixed(1)} viewport ${innerHeight}`,
          );
      }
      if (active) {
        const q = root.querySelector("h2");
        if (!q) failures.push("question missing");
        // Every offscreen answer must have an ancestor that can actually scroll it into view.
        for (const el of root.querySelectorAll("h2,label:has(input[type=radio])")) {
          const r = el.getBoundingClientRect();
          if (r.bottom <= innerHeight && r.top >= 0) continue;
          let p = el.parentElement,
            reachable = false;
          while (p) {
            const css = getComputedStyle(p);
            if (["auto", "scroll"].includes(css.overflowY) && p.scrollHeight > p.clientHeight) {
              reachable = true;
              break;
            }
            p = p.parentElement;
          }
          if (!reachable && document.documentElement.scrollHeight <= innerHeight)
            failures.push(`${name(el)} unreachable by scrolling`);
        }
      }
      return [...new Set(failures)].slice(0, 30);
    },
    { active },
  );
}

(async () => {
  await fs.mkdir(out, { recursive: true });
  await gallery([], []);
  const bundle = path.join(out, "fixtures.cjs");
  await build({
    entryPoints: [path.resolve("scripts/mobile-qa-data.ts")],
    bundle: true,
    platform: "node",
    format: "cjs",
    outfile: bundle,
  });
  const { buildFixtures } = require(bundle);
  let server;
  try {
    await fetch(origin);
  } catch {
    server = spawn(process.execPath, ["node_modules/vite/bin/vite.js", "--host", "127.0.0.1"], {
      stdio: "ignore",
      windowsHide: true,
    });
    for (let n = 0; n < 100; n++) {
      try {
        await fetch(origin);
        break;
      } catch {
        await new Promise((r) => setTimeout(r, 200));
      }
    }
  }
  const exe =
    process.env.BROWSER_EXE ||
    [
      "C:/Program Files/Google/Chrome/Application/chrome.exe",
      "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
    ].find(exists);
  const browser = await chromium.launch({
    headless: true,
    ...(exe ? { executablePath: exe } : {}),
  });
  const rows = [],
    runs = [];
  try {
    for (const [device, profile, w, h] of profileList.filter(([id]) => !filter || id === filter))
      for (const lang of languageFilter ? [languageFilter] : ["en", "ru", "uz"])
        for (const age of ["teen_adult", "child"]) {
          const gender =
            (profileList.findIndex(([id]) => id === device) +
              (lang === "ru" ? 1 : 0) +
              (age === "child" ? 1 : 0)) %
            2
              ? "female"
              : "male";
          const run = `${device}-${lang}-${age}-${random ? "random" : "longest"}${stress ? "-stress" : ""}`;
          const fixtures = buildFixtures(lang, random ? "random" : "longest");
          const context = await browser.newContext({
            ...(profile ? devices[profile] : {}),
            viewport: { width: w, height: h },
            reducedMotion:
              baseline || (device === "tablet" && lang === "en") ? "reduce" : "no-preference",
          });
          const page = await context.newPage();
          let stressCDP;
          let maxCLS = 0;
          let closing = false;
          page.setDefaultTimeout(stress ? 120000 : 30000);
          const touch = (locator) => (profile ? locator.tap() : locator.click());
          const errors = [];
          const failedRequests = [];
          page.on("pageerror", (e) => errors.push(e.message));
          page.on("console", (m) => {
            if (m.type() === "error") errors.push(m.text());
          });
          page.on("requestfailed", (req) => {
            if (!req.failure()?.errorText.includes("ERR_ABORTED"))
              failedRequests.push(req.url() + " " + req.failure()?.errorText);
          });
          page.on("response", (res) => {
            if (res.status() >= 400) failedRequests.push(res.url() + " HTTP " + res.status());
          });
          await page.addInitScript(
            ({ lang, fixtures, age, stress, mixedSignals }) => {
              if (stress) {
                const grow = () => (document.documentElement.style.fontSize = "200%");
                if (document.documentElement) grow();
                else document.addEventListener("DOMContentLoaded", grow, { once: true });
              }
              localStorage.setItem("abilitio_lang", lang);
              window.__mobileUser = { id: "mobile-qa-owner", email: "mobile@example.invalid" };
              window.__mobileSessions = fixtures.sessions;
              window.__mobileResult =
                mixedSignals && age === "teen_adult"
                  ? {
                      ...fixtures.results[age],
                      strengths: ["Mixed signals: some answers point in different directions."],
                    }
                  : fixtures.results[age];
              window.__mobileCLS = 0;
              window.__mobileShifts = [];
              window.__mobileFrames = [];
              new PerformanceObserver((list) => {
                for (const e of list.getEntries())
                  if (!e.hadRecentInput) {
                    window.__mobileCLS += e.value;
                    window.__mobileShifts.push({
                      value: e.value,
                      time: e.startTime,
                      question:
                        document.querySelector("[data-question-index]")?.dataset.questionIndex,
                      sources: e.sources?.map((source) => ({
                        node: source.node?.tagName + "." + source.node?.className,
                        previous: source.previousRect,
                        current: source.currentRect,
                      })),
                    });
                  }
              }).observe({ type: "layout-shift", buffered: true });
              let last = 0;
              const frame = (now) => {
                if (last && document.querySelector("[data-question-index]"))
                  window.__mobileFrames.push(now - last);
                last = now;
                if (window.__mobileFrames.length > 300) window.__mobileFrames.shift();
                requestAnimationFrame(frame);
              };
              requestAnimationFrame(frame);
            },
            { lang, fixtures, age, stress, mixedSignals },
          );
          const intercept = (handler) => async (route) => {
            try {
              await handler(route);
            } catch (error) {
              if (!closing) failedRequests.push(`fixture delivery: ${error.message}`);
              await route.abort().catch(() => {});
            }
          };
          await page.route(
            "**/src/lib/auth-context.tsx*",
            intercept(async (route) => {
              const res = await route.fetch();
              await route.fulfill({
                response: res,
                body: (await res.text()).replace(
                  "return useContext(Ctx);",
                  "const original=useContext(Ctx); return original.loading ? original : {...original,user:window.__mobileUser,loading:false};",
                ),
              });
            }),
          );
          await page.route(
            "**/src/lib/assessment/career.functions.ts*",
            intercept(async (route) => {
              const res = await route.fetch();
              let body = (await res.text()).replace(
                /export const (submitCareerAssessment|getMyCareerResult) = [\s\S]*?;(?=\n)/g,
                "export const $1 = async () => window.__mobileResult;",
              );
              body = body.replace(
                /export const startProfileSessions = [\s\S]*?;(?=\n)/g,
                "export const startProfileSessions = async () => window.__mobileSessions;",
              );
              await route.fulfill({ response: res, body });
            }),
          );
          await page.route(
            "**/src/lib/community/community.functions.ts*",
            intercept(async (route) => {
              const res = await route.fetch();
              const body = (await res.text()).replace(
                /export const getCommunityChoice = [\s\S]*?;(?=\n)/g,
                "export const getCommunityChoice = async()=>({suggested:null,memberships:[]});",
              );
              await route.fulfill({ response: res, body });
            }),
          );
          const capture = async (screen, active = false) => {
            await page.evaluate(
              () =>
                new Promise((resolve) =>
                  requestAnimationFrame(() => requestAnimationFrame(resolve)),
                ),
            );
            const viewport = await page.evaluate(() => ({
              width: innerWidth,
              height: innerHeight,
            }));
            const failures = (await audit(page, active)).map(
              (f) => `${viewport.width}x${viewport.height}: ${f}`,
            );
            const image = `${run}-${screen}.png`;
            await page.screenshot({ path: path.join(out, image) });
            rows.push({
              run,
              device,
              lang,
              age,
              gender,
              screen,
              image,
              failures,
              viewport: await page.evaluate(() => ({ width: innerWidth, height: innerHeight })),
            });
          };
          try {
            await page.goto(origin);
            await page.locator("main").waitFor();
            await page.locator('.field-header a[href="/dashboard"]').waitFor({ state: "attached" });
            await page.screenshot({ path: path.join(out, `${run}-landing.png`) });
            rows.push({
              run,
              device,
              lang,
              age,
              gender,
              screen: "landing",
              image: `${run}-landing.png`,
              failures: [],
              reference: true,
              viewport: { width: w, height: h },
            });
            await touch(page.locator(".instrument-signals button").nth(1));
            // The illustration's clock advances every 2.6s. Verify the stable
            // workshop state set by the same touch handler, rather than racing
            // the clock's transient aria-pressed state.
            await page
              .locator('.stage-choice.stage-1[aria-pressed="true"]')
              .waitFor({ state: "attached" });
            await page.waitForFunction(() =>
              [
                ...document.querySelectorAll('.brain-frame .cartoon-brain g[style*="opacity"]'),
              ].some((pin) => pin.style.opacity === "1"),
            );
            await page.goto(origin + "/career-assessment");
            await page.locator(`html[lang="${lang}"]`).waitFor();
            await page.locator("input[value=male]").waitFor();
            await touch(
              page.locator("label").filter({ has: page.locator(`input[value=${gender}]`) }),
            );
            await touch(page.locator("label").filter({ has: page.locator(`input[value=${age}]`) }));
            await page.evaluate(() => document.fonts.ready);
            await page.evaluate(() => (window.__mobileCLS = 0));
            await capture("chooser");
            await touch(page.locator("main button").first());
            await page.locator("h2").waitFor();
            if (stress) {
              const cdp = await context.newCDPSession(page);
              stressCDP = cdp;
              await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
              await cdp.send("Network.emulateNetworkConditions", {
                offline: false,
                latency: 400,
                downloadThroughput: 50000,
                uploadThroughput: 50000,
              });
              await page.evaluate(() => (document.documentElement.style.fontSize = "200%"));
            }
            const steps = quick
              ? [...new Set([0, 1, age === "child" ? 0 : 9, age === "child" ? 12 : 21, 29])]
              : Array.from({ length: 30 }, (_, i) => i);
            for (const n of steps) {
              if (quick && n > 0) {
                maxCLS = Math.max(maxCLS, await page.evaluate(() => window.__mobileCLS));
                // Route interception disables browser caching. Keep reloads out of the
                // warm-asset 3G interaction measurement; otherwise all dev modules
                // are artificially redownloaded for every sampled question.
                if (stressCDP)
                  await stressCDP.send("Network.emulateNetworkConditions", {
                    offline: false,
                    latency: 0,
                    downloadThroughput: -1,
                    uploadThroughput: -1,
                  });
                await page.evaluate(
                  ({ key, n }) => {
                    const saved = JSON.parse(sessionStorage.getItem(key));
                    saved.step = n;
                    sessionStorage.setItem(key, JSON.stringify(saved));
                  },
                  { key: draftKey, n },
                );
                await page.reload();
                await page.locator("main button").first().waitFor();
                await touch(page.locator("main button").first());
                await page.locator("h2").waitFor();
                await page.evaluate(() => document.fonts.ready);
                await page.evaluate(() => (window.__mobileCLS = 0));
                if (stressCDP)
                  await stressCDP.send("Network.emulateNetworkConditions", {
                    offline: false,
                    latency: 400,
                    downloadThroughput: 50000,
                    uploadThroughput: 50000,
                  });
              }
              if (!baseline)
                await page.waitForFunction(
                  (n) =>
                    document.querySelector("[data-question-index]")
                      ? Number(
                          document.querySelector("[data-question-index]").dataset.questionIndex,
                        ) === n
                      : true,
                  n,
                );
              await capture(`q${String(n + 1).padStart(2, "0")}`, true);
              const labels = page
                .locator("main label")
                .filter({ has: page.locator("input[type=radio]") });
              const lengths = await labels.allTextContents();
              let index = random
                ? Math.floor(Math.random() * lengths.length)
                : lengths
                    .map((s, i) => ({ i, length: s.length }))
                    .sort((a, b) => b.length - a.length)[0].i;

              await touch(labels.nth(index));
              if (!quick && !stress && n === 0) {
                await page.reload();
                await page.locator(`input[value=${age}]:checked`).waitFor({ state: "attached" });
                await touch(page.locator("[data-mobile-primary]"));
                await page.locator("h2").waitFor();
                if (!(await labels.nth(index).locator("input").isChecked()))
                  throw new Error(`${w}x${h}: selected answer lost after refresh/resume`);
                await capture("resumed-answer", true);
              }
              if (stress && n === 0 && w < 1024) {
                const beforeResize = await page.evaluate(() => window.__mobileCLS);
                await page.setViewportSize({ width: h, height: w });
                await capture("question-rotation", true);
                await page.setViewportSize({ width: w, height: Math.round(h * 0.58) });
                await capture("question-keyboard-resize", true);
                await page.evaluate(() => (document.documentElement.style.fontSize = "100%"));
                await page.setViewportSize({ width: Math.floor(w / 2), height: Math.floor(h / 2) });
                await capture("question-zoom-200-reflow", true);
                await page.setViewportSize({ width: w, height: h });
                await page.evaluate(() => (document.documentElement.style.fontSize = "200%"));
                await page.evaluate(
                  (value) =>
                    new Promise((resolve) =>
                      requestAnimationFrame(() =>
                        requestAnimationFrame(() => {
                          window.__mobileCLS = value;
                          resolve();
                        }),
                      ),
                    ),
                  beforeResize,
                );
              }
              if (n === 29) {
                if (stressCDP)
                  await stressCDP.send("Network.emulateNetworkConditions", {
                    offline: false,
                    latency: 0,
                    downloadThroughput: -1,
                    uploadThroughput: -1,
                  });
                // The result route is a cold navigation in Vite development.
                // Keep 3G on the warmed question interactions, then let the
                // route load without suspending its uncached module requests.
                await touch(page.locator("main button").last());
                break;
              }
              if (!quick) {
                const automatic = (age === "child" ? n >= 12 : n >= 21) && w >= 1024;
                if (!automatic) await touch(page.locator("[data-mobile-primary]"));
                await page.waitForFunction(
                  (n) =>
                    Number(
                      document.querySelector("[data-question-index]")?.dataset.questionIndex,
                    ) ===
                    n + 1,
                  n,
                );
              }
            }
            await page.waitForURL("**/career-results");
            await page.locator("main h1").waitFor();
            await page.locator("main input[type=search]").waitFor();
            await capture("result");
            const evidence = page.locator("[data-evidence-coverage]");
            if (await evidence.count()) {
              await evidence.scrollIntoViewIfNeeded();
              await page.screenshot({ path: path.join(out, `${run}-evidence.png`) });
            }
            if (mixedSignals && age === "teen_adult") {
              const note = page.locator("strong").filter({ hasText: "Mixed signals" });
              await note.waitFor();
              await note.scrollIntoViewIfNeeded();
              await page.screenshot({ path: path.join(out, `${run}-mixed-signals.png`) });
            }
            if (!baseline) {
              const beforeResize = await page.evaluate(() => window.__mobileCLS);
              const search = page.locator("main input[type=search]");
              await touch(search);
              await search.fill("engineer");
              await page.setViewportSize({ width: w, height: Math.round(h * 0.58) });
              await capture("keyboard-resize");
              await page.setViewportSize({ width: w, height: h });
              if (stress) {
                await page.evaluate(() => (document.documentElement.style.fontSize = "100%"));
                await page.setViewportSize({ width: Math.floor(w / 2), height: Math.floor(h / 2) });
                await capture("zoom-200-reflow");
                await page.setViewportSize({ width: w, height: h });
              }
              // Intentional orientation/keyboard/zoom reflow is not an unexpected
              // layout shift. Keep the score from ordinary question/result use.
              await page.evaluate(
                (value) =>
                  new Promise((resolve) =>
                    requestAnimationFrame(() =>
                      requestAnimationFrame(() => {
                        window.__mobileCLS = value;
                        resolve();
                      }),
                    ),
                  ),
                beforeResize,
              );
            }
            const metrics = await page.evaluate(() => ({
              cls: window.__mobileCLS,
              frames: window.__mobileFrames,
              shifts: window.__mobileShifts,
            }));
            metrics.cls = Math.max(maxCLS, metrics.cls);
            const fps =
              1000 /
              (metrics.frames.sort((a, b) => a - b)[Math.floor(metrics.frames.length / 2)] || 16.7);
            const runFailures = rows.filter((r) => r.run === run).flatMap((r) => r.failures);
            if (errors.length) runFailures.push(...errors.map((e) => "console: " + e));
            if (failedRequests.length)
              runFailures.push(...failedRequests.map((e) => "request: " + e));
            if (!baseline && metrics.cls > 0.12)
              runFailures.push(`layout shift ${metrics.cls.toFixed(3)}>0.12`);
            if (!baseline && fps < 25)
              runFailures.push(`median frame rate ${fps.toFixed(1)}<25fps`);
            runs.push({
              run,
              device,
              lang,
              age,
              gender,
              passed: runFailures.length === 0,
              failures: [...new Set(runFailures)],
              consoleErrors: errors,
              failedRequests,
              cls: metrics.cls,
              medianFPS: fps,
              layoutShifts: metrics.shifts,
              fixture: fixtures.longest[age],
            });
          } catch (e) {
            await page.screenshot({ path: path.join(out, `${run}-failure.png`) }).catch(() => {});
            rows.push({
              run,
              device,
              lang,
              age,
              gender,
              screen: "failure",
              image: `${run}-failure.png`,
              failures: [`${w}x${h}: ${e.message}`],
              viewport: { width: w, height: h },
            });
            runs.push({
              run,
              device,
              lang,
              age,
              gender,
              passed: false,
              failures: [`${w}x${h}: ${e.message}`, ...errors, ...failedRequests],
            });
          }
          closing = true;
          await context.close();
          await gallery(rows, runs);
          console.log(
            `${runs.at(-1).passed ? "PASS" : "FAIL"} ${run}: ${runs.at(-1).failures.slice(0, 2).join("; ")}`,
          );
        }
  } finally {
    await gallery(rows, runs);
    await browser.close();
    server?.kill();
  }
  console.log(
    `${runs.filter((r) => r.passed).length}/${runs.length} passed. Gallery: ${path.join(out, "index.html")}`,
  );
  if (!baseline && runs.some((r) => !r.passed)) process.exitCode = 1;
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
