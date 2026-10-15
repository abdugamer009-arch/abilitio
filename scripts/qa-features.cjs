const { chromium } = require("playwright");
const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const { fixtures, install, errors } = require("./qa-support.cjs");
async function runFeatureChecks(origin = "http://127.0.0.1:8080") {
  const data = await fixtures();
  const b = await chromium.launch({ headless: true });
  const records = [];
  await fs.mkdir("artifacts/qa/features", { recursive: true });
  try {
    for (const width of [1440, 390]) {
      const c = await b.newContext({
        viewport: { width, height: width === 1440 ? 1000 : 844 },
        reducedMotion: "reduce",
        acceptDownloads: true,
      });
      await install(c, data);
      const p = await c.newPage();
      p.setDefaultTimeout(10000);
      const faults = errors(p);
      async function shot(id, locator) {
        const file = `artifacts/qa/features/${id}-${width}.png`;
        await (locator || p).screenshot({ path: file, ...(locator ? {} : { fullPage: true }) });
        records.push({ id, width, file, fixture: true });
      }
      await p.goto(origin + "/career-results", { waitUntil: "networkidle" });
      await p.getByRole("searchbox").fill("no-such-career-xyz");
      await p.getByText("0 careers compared", { exact: true }).waitFor();
      await p.getByText("No careers match 'no-such-career-xyz'", { exact: true }).waitFor();
      await shot("M07");
      await p.getByRole("button", { name: "Clear search", exact: true }).click();
      await p.getByText("166 careers compared", { exact: true }).waitFor();
      await p.locator(".career-reasons").first().locator("summary").click();
      await shot("M04", p.locator(".career-reasons").first());
      const downloadEvent = p.waitForEvent("download", { timeout: 10000 });
      await p.getByRole("button", { name: "Download PDF", exact: true }).click();
      const pdf = await downloadEvent;
      const pdfPath = `artifacts/qa/features/H07-${width}.pdf`;
      await pdf.saveAs(pdfPath);
      const bytes = await fs.readFile(pdfPath);
      assert.equal(bytes.subarray(0, 5).toString(), "%PDF-");
      assert.ok(bytes.length > 1000);
      await p.getByRole("searchbox").fill("test");
      await p.getByRole("searchbox").fill("");
      await p.getByRole("button", { name: "Share Card", exact: true }).click();
      await p.getByRole("dialog").waitFor();
      assert.ok(
        (await p.getByRole("img", { name: "Career card preview" }).getAttribute("src")).startsWith(
          "data:image/png",
        ),
      );
      await shot("H07-preview", p.getByRole("dialog"));
      const imageDownload = p.waitForEvent("download");
      await p.getByRole("link", { name: "Download image", exact: true }).click();
      await (await imageDownload).saveAs(`artifacts/qa/features/H07-${width}.png`);
      await p.getByRole("button", { name: "Close", exact: true }).click();
      assert.equal(await p.evaluate(() => window.__qa.members.length), 0);
      await p.getByRole("button", { name: "Join the Technology community?" }).click();
      await p.getByRole("button", { name: "Leave community" }).waitFor();
      await shot("H02");
      await p.getByRole("button", { name: "Leave community" }).click();
      assert.equal(await p.evaluate(() => window.__qa.members.length), 0);
      await p.goto(origin + "/career-battles", { waitUntil: "networkidle" });
      const selects = p.locator("main select");
      assert.equal(await selects.count(), 3);
      const chosen = await selects.evaluateAll((nodes) => nodes.map((n) => n.value));
      assert.equal(new Set(chosen).size, 3);
      assert.equal(chosen[0], data.results.teen_adult.career_matches[0].key);
      for (let i = 0; i < 3; i++) {
        const opts = await selects
          .nth(i)
          .locator("option")
          .evaluateAll((nodes) => nodes.map((n) => n.value));
        for (let j = 0; j < 3; j++) if (j !== i) assert.ok(!opts.includes(chosen[j]));
      }
      await shot("H04-M08");
      for (let i = 0; i < 3; i++) await selects.nth(i).selectOption("");
      await p.getByRole("status").filter({ hasText: "Choose two or three careers" }).waitFor();
      await p.goto(origin + "/dashboard", { waitUntil: "networkidle" });
      await p
        .getByText(/Reasoning: .* · Type:/)
        .first()
        .waitFor();
      await shot("M05");
      const checkboxes = p.getByRole("checkbox", { name: "Compare attempt", exact: true });
      await checkboxes.nth(0).check();
      await checkboxes.nth(1).check();
      await p.getByRole("heading", { name: "Compare attempts", exact: true }).waitFor();
      await shot("M06");
      await p.getByRole("link", { name: "View result", exact: true }).nth(1).click();
      await p.waitForURL(/resultId=22222222/);
      await p.getByRole("searchbox").waitFor();
      await p.goto(origin + "/dashboard", { waitUntil: "networkidle" });
      await p.getByRole("button", { name: "Settings", exact: true }).click();
      assert.equal(await p.getByText("Weekly digest email", { exact: true }).count(), 0);
      await shot("M16");
      assert.deepEqual(faults, []);
      await c.close();
      console.log(`Feature flows passed at ${width}px`);
    }
    const legacy = await b.newContext({
      viewport: { width: 390, height: 844 },
      reducedMotion: "reduce",
    });
    await install(legacy, data, { legacy: true });
    const lp = await legacy.newPage();
    const legacyErrors = errors(lp);
    await lp.goto(origin + "/career-results", { waitUntil: "networkidle" });
    const notice = lp.getByText(
      "Earlier versions may have joined a community automatically. Review your memberships below.",
      { exact: true },
    );
    await notice.waitFor();
    await lp.screenshot({ path: "artifacts/qa/features/H02-legacy-390.png", fullPage: true });
    await lp.getByRole("button", { name: "Dismiss notice", exact: true }).click();
    await lp.reload();
    await lp.getByRole("button", { name: "Leave community", exact: true }).waitFor();
    assert.equal(await notice.count(), 0);
    await lp.getByRole("button", { name: "Leave community", exact: true }).click();
    await lp.getByRole("button", { name: "Join the Technology community?" }).waitFor();
    assert.equal(await lp.evaluate(() => window.__qa.members.length), 0);
    assert.deepEqual(legacyErrors, []);
    await legacy.close();
    console.log("Legacy one-time notice and leave passed");
  } finally {
    await b.close();
    await fs.writeFile("artifacts/qa/features/index.json", JSON.stringify(records, null, 2));
  }
}
module.exports = { runFeatureChecks };
if (require.main === module)
  runFeatureChecks().catch((e) => {
    console.error(e);
    process.exitCode = 1;
  });
