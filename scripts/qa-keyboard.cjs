const { chromium } = require("playwright");
const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const { fixtures, install, errors } = require("./qa-support.cjs");
async function runKeyboardChecks(origin = "http://127.0.0.1:8080") {
  const b = await chromium.launch();
  const data = await fixtures();
  const routes = [
    "/",
    "/career-assessment",
    "/career-results",
    "/dashboard",
    "/roadmap",
    "/career-battles",
    "/universities",
  ];
  await fs.mkdir("artifacts/qa/keyboard", { recursive: true });
  try {
    const c = await b.newContext({
      viewport: { width: 720, height: 500 },
      reducedMotion: "reduce",
    });
    await install(c, data);
    const p = await c.newPage();
    const faults = errors(p);
    async function tabTo(test) {
      for (let n = 0; n < 220; n++) {
        await p.keyboard.press("Tab");
        const active = await p.evaluate(() => {
          const e = document.activeElement;
          const style = getComputedStyle(e);
          return {
            tag: e.tagName,
            text: e.innerText?.trim(),
            value: e.value,
            type: e.type,
            label: e.getAttribute("aria-label"),
            outline: style.outlineStyle,
            outlineWidth: parseFloat(style.outlineWidth),
          };
        });
        if (test(active)) {
          assert.ok(
            active.outline !== "none" && active.outlineWidth >= 2,
            "missing keyboard focus",
          );
          return;
        }
      }
      throw new Error("Keyboard target not reachable");
    }
    for (const route of routes) {
      await p.goto(origin + route, { waitUntil: "networkidle" });
      await p.locator("main").waitFor();
      assert.equal(
        await p.evaluate(() => document.documentElement.scrollWidth > innerWidth),
        false,
        "200% desktop zoom reflow overflow: " + route,
      );
      await tabTo(
        (a) => a.tag === "A" || a.tag === "BUTTON" || a.tag === "INPUT" || a.tag === "SELECT",
      );
      await p.screenshot({
        path: "artifacts/qa/keyboard/" + (route.slice(1) || "landing") + "-200-reflow.png",
      });
    }
    await p.goto(origin + "/career-assessment", { waitUntil: "networkidle" });
    await tabTo((a) => a.tag === "INPUT" && a.value === "male");
    await p.keyboard.press("Space");
    await tabTo((a) => a.tag === "INPUT" && a.value === "child");
    await p.keyboard.press("ArrowRight");
    await tabTo((a) => a.tag === "BUTTON" && a.text === "Start Assessment");
    await p.keyboard.press("Enter");
    await p.locator('[data-question-index="0"]').waitFor();
    for (let step = 0; step < 30; step++) {
      await p.locator(`[data-question-index="${step}"][data-transitioning="false"]`).waitFor();
      await p.keyboard.press("1");
      if (step < 29) {
        await tabTo((a) => a.tag === "BUTTON" && a.text === "Next");
        await p.keyboard.press("Enter");
        await p.locator(`[data-question-index="${step + 1}"]`).waitFor();
      }
    }
    await tabTo((a) => a.tag === "BUTTON" && a.text?.includes("See My Results"));
    await p.keyboard.press("Enter");
    await p.waitForURL("**/career-results");
    await p.getByRole("searchbox").waitFor();
    await tabTo((a) => a.tag === "BUTTON" && a.text === "Share Card");
    await p.keyboard.press("Enter");
    await p.getByRole("dialog").waitFor();
    await p.keyboard.press("Escape");
    assert.equal(await p.getByRole("dialog").count(), 0);
    assert.equal(await p.locator("dialog").isVisible(), false);
    await tabTo((a) => a.type === "search");
    await p.keyboard.type("no-keyboard-match");
    await p.getByText("0 careers compared", { exact: true }).waitFor();
    await tabTo((a) => a.tag === "BUTTON" && a.text === "Clear search");
    await p.keyboard.press("Enter");
    await p.getByText("166 careers compared", { exact: true }).waitFor();
    await p.screenshot({ path: "artifacts/qa/keyboard/results-keyboard.png" });
    await p.goto(origin + "/dashboard", { waitUntil: "networkidle" });
    await tabTo((a) => a.tag === "BUTTON" && a.text === "Settings");
    await p.keyboard.press("Enter");
    await p.getByRole("button", { name: "Send reset link", exact: true }).waitFor();
    await p.screenshot({ path: "artifacts/qa/keyboard/settings-200-reflow.png" });
    assert.deepEqual(faults, []);
    await c.close();
    console.log(
      "Keyboard-only selection, 30 questions, share dialog, search and settings passed; seven routes passed emulated 200% desktop reflow",
    );
  } finally {
    await b.close();
  }
}
module.exports = { runKeyboardChecks };
if (require.main === module)
  runKeyboardChecks().catch((e) => {
    console.error(e);
    process.exitCode = 1;
  });
