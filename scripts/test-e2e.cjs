const { spawn } = require("node:child_process");
const { createServer } = require("node:net");
const { randomBytes } = require("node:crypto");
const fs = require("node:fs/promises");
const { openSync, closeSync } = require("node:fs");

async function command(file, env, args = []) {
  await new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [file, ...args], { stdio: "inherit", env });
    child.once("error", reject);
    child.once("exit", (code) =>
      code === 0 ? resolve() : reject(new Error(`${file}: exit ${code}`)),
    );
  });
}
async function freePort() {
  const listener = createServer();
  await new Promise((resolve) => listener.listen(0, "127.0.0.1", resolve));
  const port = listener.address().port;
  await new Promise((resolve) => listener.close(resolve));
  return port;
}
async function main() {
  const pictureOnly = process.argv.includes("--picture-only");
  const scope = process.argv.includes("--release")
    ? "full-release"
    : process.argv.includes("--guest-live")
      ? "live-guest"
      : "local-fixtures";
  await fs.mkdir("artifacts/full-qa", { recursive: true });
  await new Promise((resolve, reject) => {
    const child = spawn(process.execPath, ["scripts/qa-inventory.mjs", "--json-only"], {
      stdio: "inherit",
    });
    child.once("exit", (code) => (code === 0 ? resolve() : reject(new Error("Inventory failed"))));
    child.once("error", reject);
  });
  if (scope === "live-guest") {
    await require("./qa-guest-live.cjs").runGuestLive(process.env.QA_ORIGIN);
    return;
  }
  const port = await freePort();
  const origin = `http://127.0.0.1:${port}`;
  // These public placeholders align SSR with intercepted browser SDK modules.
  // The server has no real database credentials and cannot write production.
  const env = {
    ...process.env,
    QA_ORIGIN: origin,
    // Fresh Vite compilation is setup cost, not a production latency measurement.
    QA_SMOKE_NAVIGATION_TIMEOUT_MS: "120000",
    VITE_SUPABASE_URL: "https://qa-fixture.invalid",
    VITE_SUPABASE_PUBLISHABLE_KEY: "qa-public-placeholder",
    SUPABASE_URL: "https://qa-fixture.invalid",
    SUPABASE_PUBLISHABLE_KEY: "qa-public-placeholder",
    ASSESSMENT_SIGNING_SECRET: randomBytes(32).toString("hex"),
    ASSESSMENT_PICTURE_ENABLED: pictureOnly ? "true" : "false",
    ASSESSMENT_PICTURE_ROLLOUT_APPROVED: pictureOnly ? "true" : "false",
    PASSWORD_RECOVERY_ENABLED: "false",
    VITE_PASSWORD_RECOVERY_ENABLED: "false",
  };
  delete env.SUPABASE_SERVICE_ROLE_KEY;
  const serverLog = openSync(
    `artifacts/full-qa/e2e-${pictureOnly ? "picture-" : ""}server.log`,
    "w",
  );
  const server = spawn(
    process.execPath,
    [
      "node_modules/vite/bin/vite.js",
      "--host",
      "127.0.0.1",
      "--port",
      String(port),
      "--strictPort",
    ],
    { env, stdio: ["ignore", serverLog, serverLog] },
  );
  closeSync(serverLog);
  const receipt = {
    scope,
    origin,
    liveAccounts: "NOT CHECKED",
    productionWrites: 0,
    completed: [],
  };
  try {
    let ready = false;
    for (let n = 0; n < 100; n++) {
      try {
        const response = await fetch(origin, { signal: AbortSignal.timeout(15000) });
        ready = response.ok;
        await response.body?.cancel();
      } catch {
        /* startup */
      }
      if (ready) break;
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
    if (!ready) throw new Error("Isolated E2E server did not start");
    console.log(
      "LOCAL BROWSER REGRESSIONS: account/API/email transports are fixtures, not live database proof.",
    );
    const scripts = pictureOnly
      ? [
          "scripts/qa-assessment-first-paint.cjs",
          "scripts/qa-picture-assessment.cjs",
          "scripts/qa-picture-controls.cjs",
          "scripts/qa-picture-admin.cjs",
        ]
      : [
          "scripts/audit-e2e.cjs",
          "scripts/qa-public-controls.cjs",
          "scripts/qa-abbi-race.cjs",
          "scripts/qa-abbi-input.cjs",
          "scripts/qa-admin-actions.cjs",
          "scripts/qa-roadmap.cjs",
          "scripts/qa-shell-network.cjs",
        ];
    for (const file of scripts) {
      await command(file, env);
      receipt.completed.push(file);
    }
    receipt.result = "PASS LOCAL";
  } catch (error) {
    receipt.result = "FAIL";
    throw error;
  } finally {
    server.kill("SIGTERM");
    await fs.writeFile(
      `artifacts/full-qa/e2e-${pictureOnly ? "picture-" : ""}receipt.json`,
      JSON.stringify(receipt, null, 2),
    );
  }
  if (!pictureOnly) {
    try {
      await command("scripts/test-e2e.cjs", env, ["--local", "--picture-only"]);
      receipt.completed.push("picture-mode-regressions");
    } catch (error) {
      receipt.result = "FAIL";
      throw error;
    } finally {
      await fs.writeFile("artifacts/full-qa/e2e-receipt.json", JSON.stringify(receipt, null, 2));
    }
  }
  if (scope === "full-release") {
    console.error(
      "BLOCKED: live student/founder persistence, isolation, provider delivery and cleanup require an accessible disposable Supabase environment. Local fixtures do not satisfy the release gate. No deployment was performed.",
    );
    process.exitCode = 2;
  }
}
main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
