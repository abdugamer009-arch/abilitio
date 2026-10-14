// Independent language suites run concurrently; each owns its browser/report.
const { spawn } = require("node:child_process");
const fs = require("node:fs/promises");
const path = require("node:path");
const { writeGallery } = require("./mobile-report.cjs");
const args = process.argv.slice(2);
const selected = args.find((arg) => arg.startsWith("--lang="))?.slice(7);
const languages = selected ? [selected] : ["en", "ru", "uz"];
const mode = args.includes("--stress") ? "stress" : args.includes("--random") ? "random" : "latest";
const out = path.resolve("mobile-report", mode);
(async () => {
  const origin = process.env.QA_ORIGIN || "http://127.0.0.1:8080";
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
    for (let n = 0; n < 100; n++) {
      try {
        await fetch(origin);
        break;
      } catch {
        await new Promise((resolve) => setTimeout(resolve, 200));
      }
    }
  }
  try {
    await fs.mkdir(out, { recursive: true });
    await writeGallery(
      out,
      [],
      [],
      (args.some((a) => a.startsWith("--device=")) ? 1 : 10) * languages.length * 2,
    );
    const pending = [...languages];
    const codes = await Promise.all(
      Array.from(
        { length: Math.min(languages.length, Number(process.env.QA_WORKERS) || 2) },
        async () => {
          const results = [];
          while (pending.length) {
            const lang = pending.shift();
            if (!lang) break;
            const child = spawn(
              process.execPath,
              [
                "scripts/mobile-qa.cjs",
                ...args.filter((arg) => !arg.startsWith("--lang=")),
                `--lang=${lang}`,
                `--out=${path.join(out, lang)}`,
              ],
              { stdio: "inherit", windowsHide: true },
            );
            const stop = () => child.kill();
            process.once("SIGINT", stop);
            const code = await new Promise((resolve) => {
              child.once("exit", (code) => resolve(code ?? 1));
              child.once("error", () => resolve(1));
            });
            process.removeListener("SIGINT", stop);
            results.push(code);
          }
          return results;
        },
      ),
    ).then((groups) => groups.flat());
    const rows = [],
      runs = [];
    let expected = 0;
    for (const lang of languages) {
      const report = JSON.parse(await fs.readFile(path.join(out, lang, "results.json"), "utf8"));
      expected += report.expectedRuns;
      runs.push(...report.runs);
      rows.push(
        ...report.screens.map((screen) => ({ ...screen, image: `${lang}/${screen.image}` })),
      );
    }
    await writeGallery(out, rows, runs, expected);
    if (codes.some((code) => code !== 0) || runs.length !== expected) process.exitCode = 1;
  } finally {
    server?.kill();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
