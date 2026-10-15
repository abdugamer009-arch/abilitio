import { readFile, readdir, mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
const files = [];
async function walk(dir) {
  for (const ent of await readdir(dir, { withFileTypes: true })) {
    const path = resolve(dir, ent.name);
    if (ent.isDirectory()) await walk(path);
    else if (/\.(tsx?|json)$/.test(path)) files.push(path);
  }
}
await walk("src");
const links = new Map();
for (const file of files) {
  const text = await readFile(file, "utf8");
  for (const url of text.match(/https:\/\/[^\s"'`<>\\)\]}]+/g) || []) {
    if (/supabase|example\.|localhost|127\.0\.0|schema\.org/.test(url)) continue;
    if (!links.has(url)) links.set(url, []);
    links.get(url).push(file.replace(process.cwd() + "/", ""));
  }
}
const flagged = /stanford|ubc\.|amherst|kaist|wiut|ox\.ac/i;
const targets = [...links].filter(
  ([url]) => !process.argv.includes("--flagged") || flagged.test(url),
);
const results = [];
let index = 0;
await Promise.all(
  Array.from({ length: 4 }, async () => {
    while (index < targets.length) {
      const [url, sources] = targets[index++];
      let result;
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          const response = await fetch(url, {
            headers: {
              "User-Agent":
                "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36",
            },
            redirect: "follow",
            signal: AbortSignal.timeout(12000),
          });
          const status = response.status;
          const snippet = (await response.text()).slice(0, 12000);
          const bot =
            [401, 403, 429].includes(status) ||
            /checking your browser|verify you are human|captcha|access denied|just a moment/i.test(
              snippet,
            );
          result = {
            url,
            finalUrl: response.url,
            status,
            classification: bot
              ? "blocked-by-bot-protection"
              : status === 404 || status === 410
                ? "dead"
                : response.ok
                  ? "OK"
                  : "timeout",
            sources,
            checkedAt: new Date().toISOString(),
          };
          if (response.ok || bot || [404, 410].includes(status)) break;
        } catch (e) {
          result = {
            url,
            classification: "timeout",
            detail: e.name,
            sources,
            checkedAt: new Date().toISOString(),
          };
        }
        if (attempt < 2) await new Promise((r) => setTimeout(r, 300 * (attempt + 1)));
      }
      results.push(result);
      console.log(result.classification + " " + url);
    }
  }),
);
results.sort((a, b) => a.url.localeCompare(b.url));
await mkdir("artifacts/qa/links", { recursive: true });
await writeFile("artifacts/qa/links/results.json", JSON.stringify(results, null, 2));
await writeFile(
  "artifacts/qa/links/report.md",
  "# External links\n\nChecked " +
    new Date().toISOString() +
    "; 3 attempts maximum, browser user agent. Non-404/410 errors are unresolved (timeout), never assumed dead.\n\n| URL | Status | Classification |\n|---|---|---|\n" +
    results.map((r) => `| ${r.url} | ${r.status ?? "—"} | ${r.classification} |`).join("\n"),
);
if (results.some((r) => r.classification === "dead")) process.exitCode = 1;
