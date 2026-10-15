const { chromium } = require("playwright");
const AxeBuilder = require("@axe-core/playwright").default;
const { fixtures, install, errors } = require("./qa-support.cjs");
const fs = require("node:fs/promises");
async function runAccessibility(origin = "http://127.0.0.1:8080") {
  const data = await fixtures();
  const b = await chromium.launch({ headless: true });
  const report = [];
  await fs.mkdir("artifacts/qa/accessibility", { recursive: true });
  try {
    for (const theme of ["light", "dark"]) {
      const c = await b.newContext({
        viewport: { width: 390, height: 844 },
        reducedMotion: "reduce",
      });
      await install(c, data, { theme });
      const p = await c.newPage();
      const faults = errors(p);
      for (const route of [
        "/",
        "/career-assessment",
        "/career-results",
        "/dashboard",
        "/roadmap",
        "/career-battles",
        "/universities",
      ]) {
        await p.goto(origin + route, { waitUntil: "networkidle" });
        await p.locator("main").waitFor();
        const axe = await new AxeBuilder({ page: p })
          .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
          .analyze();
        const violations = axe.violations.map((v) => ({
          id: v.id,
          impact: v.impact,
          nodes: v.nodes.map((n) => ({ target: n.target, summary: n.failureSummary })),
        }));
        const overflow = await p.evaluate(() => document.documentElement.scrollWidth > innerWidth);
        // A visible keyboard focus must be reachable without a pointer.
        await p.keyboard.press("Tab");
        const focus = await p.evaluate(() => {
          const e = document.activeElement;
          return !!e && e !== document.body;
        });
        report.push({ theme, route, violations, overflow, focus, errors: [...faults] });
        await p.screenshot({
          path:
            "artifacts/qa/accessibility/" + theme + "-" + (route.slice(1) || "landing") + ".png",
          fullPage: true,
        });
      }
      await c.close();
    }
  } finally {
    await b.close();
    await fs.writeFile("artifacts/qa/accessibility/report.json", JSON.stringify(report, null, 2));
  }
  const bad = report.filter(
    (r) => r.violations.length || r.overflow || !r.focus || r.errors.length,
  );
  for (const r of bad)
    console.log(r.theme, r.route, JSON.stringify(r.violations), r.overflow, r.errors);
  if (bad.length) throw new Error(`${bad.length}/${report.length} accessibility cases failed`);
  console.log(report.length + " accessibility cases passed");
}
module.exports = { runAccessibility };
if (require.main === module)
  runAccessibility().catch((e) => {
    console.error(e);
    process.exitCode = 1;
  });
