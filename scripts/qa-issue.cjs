const { chromium } = require("playwright");
const { fixtures, install, errors } = require("./qa-support.cjs");
const fs = require("node:fs/promises");
const assert = require("node:assert/strict");
(async () => {
  const id = process.argv[2];
  const data = await fixtures();
  const b = await chromium.launch({ headless: true });
  try {
    const c = await b.newContext({
      viewport: { width: 390, height: 844 },
      reducedMotion: "reduce",
    });
    await install(c, data);
    const p = await c.newPage();
    const faults = errors(p);
    await p.goto("http://127.0.0.1:8080/career-results", { waitUntil: "networkidle" });
    if (id === "M04") {
      const details = p.locator(".career-reasons").first();
      await details.locator("summary").click();
      await details.getByRole("heading", { name: "Try this week" }).waitFor();
      assert.equal((await details.locator("li").count()) >= 3, true);
    }
    await fs.mkdir("artifacts/qa/" + id, { recursive: true });
    await p.screenshot({ path: "artifacts/qa/" + id + "/390.png", fullPage: true });
    assert.deepEqual(faults, []);
    console.log(id + " passed");
    await c.close();
  } finally {
    await b.close();
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
