const fs = require("node:fs/promises");
async function runUniversityLinks() {
  const source = await fs.readFile("src/routes/universities.tsx", "utf8");
  const links = [...source.matchAll(/(?:url|funding):\s*"(https:[^"]+)"/g)].map((m) => m[1]);
  if (links.length !== 40) throw new Error("Update the catalog expectation deliberately");
  const rows = [];
  let cursor = 0;
  await Promise.all(
    Array.from({ length: 4 }, async () => {
      while (cursor < links.length) {
        const url = links[cursor++];
        try {
          const response = await fetch(url, {
            signal: AbortSignal.timeout(20000),
            redirect: "follow",
          });
          rows.push({
            id: "FLOW-08",
            url,
            finalUrl: response.url,
            status: response.status,
            result: response.ok
              ? "PASS HTTP"
              : [401, 403, 405, 429].includes(response.status)
                ? "NOT CHECKED — remote access restriction"
                : "FAIL HTTP",
          });
          await response.body?.cancel();
        } catch (e) {
          rows.push({ id: "FLOW-08", url, result: "NOT CHECKED — transport", error: e.message });
        }
      }
    }),
  );
  await fs.mkdir("artifacts/full-qa", { recursive: true });
  await fs.writeFile("artifacts/full-qa/university-links.json", JSON.stringify(rows, null, 2));
  console.log(JSON.stringify(rows, null, 2));
  if (rows.some((r) => r.result === "FAIL HTTP"))
    throw new Error("University source link returned an error");
  return rows;
}
module.exports = { runUniversityLinks };
if (require.main === module)
  runUniversityLinks().catch((e) => {
    console.error(e.message);
    process.exitCode = 1;
  });
