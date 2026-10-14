// One daily command exercises complete attempts plus layout/performance stresses.
const { spawn } = require("node:child_process");
const fs = require("node:fs/promises");
const extra = process.argv.slice(2);
(async () => {
  await fs.mkdir("mobile-report", { recursive: true });
  await fs.writeFile(
    "mobile-report/index.html",
    '<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Daily mobile QA</title><body style="font:18px system-ui;padding:24px"><h1>Daily mobile QA: RUNNING</h1><p>The galleries update as each device finishes. A final PASS appears only when all three phases complete.</p><a href="latest/index.html">Longest text</a> · <a href="random/index.html">Randomized</a> · <a href="stress/index.html">Stress</a></body></html>',
  );
  const codes = [];
  for (const mode of [[], ["--random"], ["--stress", "--quick"]]) {
    const child = spawn(process.execPath, ["scripts/mobile-matrix.cjs", ...mode, ...extra], {
      stdio: "inherit",
      windowsHide: true,
    });
    const stop = () => child.kill();
    process.once("SIGINT", stop);
    const code = await new Promise((resolve) => {
      child.once("exit", (code) => resolve(code ?? 1));
      child.once("error", () => resolve(1));
    });
    process.removeListener("SIGINT", stop);
    codes.push(code);
  }
  await fs.writeFile(
    "mobile-report/index.html",
    `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Daily mobile QA</title><style>body{font:18px system-ui;margin:32px;background:#f8f5ee}a{display:block;padding:16px;margin:16px;border:2px solid;border-radius:12px}</style><h1>Daily mobile QA: ${codes.every((c) => c === 0) ? "PASS" : "FAIL"}</h1><a href="latest/index.html">Longest text / complete flow: ${codes[0] === 0 ? "PASS" : "FAIL"}</a><a href="random/index.html">Randomized / complete flow: ${codes[1] === 0 ? "PASS" : "FAIL"}</a><a href="stress/index.html">Stress cases: ${codes[2] === 0 ? "PASS" : "FAIL"}</a><a href="baseline/index.html">Before-fix diagnosis gallery</a></html>`,
  );
  if (codes.some((c) => c !== 0)) process.exitCode = 1;
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
