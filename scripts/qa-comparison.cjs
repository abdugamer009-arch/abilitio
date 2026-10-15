const fs = require("node:fs");
const path = require("node:path");
const dir = "artifacts/qa/comparison";
fs.mkdirSync(dir, { recursive: true });
const pages = [
  "landing",
  "assessment",
  "question",
  "results",
  "dashboard",
  "roadmap",
  "battles",
  "universities",
  "settings",
];
const pairs = [];
for (const width of [1440, 768, 390, 320])
  for (const page of pages) {
    const before = `../../../baseline/original-fc16fe5/${width}-${page}.png`;
    const after = `../final/en-light-${width}-${page}.png`;
    if (!fs.existsSync(path.resolve(dir, before)) || !fs.existsSync(path.resolve(dir, after)))
      throw new Error("Missing comparison " + width + "/" + page);
    pairs.push({ width, page, before, after });
  }
fs.writeFileSync(dir + "/pairs.json", JSON.stringify(pairs, null, 2));
fs.writeFileSync(
  dir + "/index.html",
  `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Abilitio audit comparison</title><style>body{font:16px system-ui;background:#f8f5ee;color:#1d1b16;margin:24px}select{font:inherit;padding:12px;margin:12px;border:2px solid;border-radius:10px}.pair{display:grid;grid-template-columns:1fr 1fr;gap:20px;align-items:start}figure{margin:0;min-width:0}img{width:100%;height:auto;border:1px solid #aaa}figcaption{font-weight:700;margin:10px 0}@media(max-width:700px){.pair{grid-template-columns:1fr}}</style><h1>Before / after audit review</h1><p>Original production source fc16fe5 versus this local repair. Accounts/results are seeded development fixtures; no production account screenshot is implied. Wrapping intentionally changes after readability repairs.</p><label>View <select id="view"></select></label><div class="pair"><figure><figcaption>Before · production source</figcaption><img id="before" alt="Before audit repair"></figure><figure><figcaption>After · local repair</figcaption><img id="after" alt="After audit repair"></figure></div><script>const rows=${JSON.stringify(pairs)};const select=document.querySelector('#view');for(const [i,r] of rows.entries()){const o=document.createElement('option');o.value=i;o.textContent=r.width+'px / '+r.page;select.append(o)}function show(){const r=rows[select.value];document.querySelector('#before').src=r.before;document.querySelector('#after').src=r.after}select.addEventListener('change',show);show()</script></html>`,
);
console.log("Created " + pairs.length + " before/after pairs");
