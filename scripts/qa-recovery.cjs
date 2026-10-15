const { chromium } = require("playwright");
const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const { fixtures, install, errors } = require("./qa-support.cjs");
async function runRecoveryChecks(origin = "http://127.0.0.1:8080") {
  const b = await chromium.launch();
  try {
    const c = await b.newContext({
      viewport: { width: 390, height: 844 },
      reducedMotion: "reduce",
    });
    await install(c, await fixtures(), { guest: true });
    const p = await c.newPage();
    const faults = errors(p);
    await fs.mkdir("artifacts/qa/recovery", { recursive: true });
    await c.route("**/src/lib/constants.ts*", async (route) => {
      const r = await route.fetch();
      await route.fulfill({
        response: r,
        body: (await r.text()).replace(
          /export const PASSWORD_RECOVERY_ENABLED = [^;]*;/,
          "export const PASSWORD_RECOVERY_ENABLED = true;",
        ),
      });
    });
    await c.route("**/src/lib/auth/recovery.functions.ts*", async (route) => {
      const r = await route.fetch();
      await route.fulfill({
        response: r,
        body: (await r.text()).replace(
          /export const requestPasswordRecovery = [\s\S]*?;(?=\n)/g,
          `export const requestPasswordRecovery=async({data})=>{if(data.email==='known@example.invalid')sessionStorage.setItem('qa.mock-mail',JSON.stringify({href:'/auth?mode=recovery',expires:Date.now()+60000}));return {accepted:true}};`,
        ),
      });
    });
    const message = "If this address has an account, check its inbox for a recovery link.";
    for (const email of ["missing@example.invalid", "known@example.invalid"]) {
      await p.goto(origin + "/auth", { waitUntil: "networkidle" });
      await p.getByRole("textbox", { name: "Email", exact: true }).fill(email);
      await p.getByRole("button", { name: "Forgot password?", exact: true }).click();
      await p.getByText(message, { exact: true }).waitFor();
      if (email.startsWith("missing"))
        assert.equal(await p.evaluate(() => sessionStorage.getItem("qa.mock-mail")), null);
    }
    await p.screenshot({ path: "artifacts/qa/recovery/mock-request.png", fullPage: true });
    const mail = await p.evaluate(() => JSON.parse(sessionStorage.getItem("qa.mock-mail")));
    assert.ok(mail.expires > Date.now());
    await p.evaluate(() => sessionStorage.setItem("qa.recovery-session", "yes"));
    await p.goto(origin + mail.href, { waitUntil: "networkidle" });
    await p.getByRole("textbox", { name: "New password", exact: true }).fill("Fixture-only-7284");
    await p
      .getByRole("textbox", { name: "Confirm password", exact: true })
      .fill("Fixture-only-7284");
    await p.getByRole("button", { name: /Update password|Save password|Set password/i }).click();
    await p.getByRole("heading", { name: "Password updated.", exact: true }).waitFor();
    await p.screenshot({ path: "artifacts/qa/recovery/mock-confirmation.png", fullPage: true });
    await p.getByRole("link", { name: "Continue to dashboard", exact: true }).click();
    await p.waitForURL("**/dashboard");
    assert.equal(await p.evaluate(() => sessionStorage.getItem("qa.mock-updated")), "yes");
    await p.evaluate(() => sessionStorage.removeItem("qa.recovery-session"));
    await p.goto(origin + "/auth?mode=recovery", { waitUntil: "networkidle" });
    await p.getByRole("textbox", { name: "New password", exact: true }).fill("Fixture-only-7284");
    await p
      .getByRole("textbox", { name: "Confirm password", exact: true })
      .fill("Fixture-only-7284");
    await p.getByRole("button", { name: /Update password|Save password|Set password/i }).click();
    await p
      .getByRole("alert")
      .filter({ hasText: "Open a valid recovery link from your email." })
      .waitFor();
    await fs.mkdir("artifacts/qa/recovery", { recursive: true });
    await p.screenshot({ path: "artifacts/qa/recovery/expired-session.png", fullPage: true });
    assert.deepEqual(faults, []);
    await c.close();
    console.log(
      "Mock-mailer request, same unknown-address response, password update and expired-session UI passed; live provider delivery unverified",
    );
  } finally {
    await b.close();
  }
}
module.exports = { runRecoveryChecks };
if (require.main === module)
  runRecoveryChecks().catch((e) => {
    console.error(e);
    process.exitCode = 1;
  });
