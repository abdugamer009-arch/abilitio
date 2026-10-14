const fs = require("node:fs/promises");
const path = require("node:path");
const escape = (s) =>
  String(s).replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c],
  );

async function writeGallery(out, rows, runs, expectedRuns, baseline = false) {
  await fs.writeFile(
    path.join(out, "results.json"),
    JSON.stringify(
      {
        baseline,
        expectedRuns,
        complete: runs.length === expectedRuns,
        mockAccounts: true,
        engine: "Chromium with real device UA/touch profiles",
        runs,
        screens: rows,
      },
      null,
      2,
    ),
  );
  const devices = [...new Set(runs.map((r) => r.device))];
  const cards = rows
    .map(
      (r) =>
        `<article class="${r.failures.length ? "fail" : "pass"}" data-device="${escape(r.device)}" data-lang="${r.lang}" data-age="${r.age}" data-screen="${r.screen}" ${r.lang !== "en" || r.age !== "teen_adult" || r.screen !== "q01" ? "hidden" : ""}><h2>${escape(r.run)} · ${r.screen}</h2><p>${r.viewport.width} × ${r.viewport.height} · ${r.reference ? "Reference capture" : r.failures.length ? escape(r.failures.join("; ")) : "PASS"}</p><a href="${escape(r.image)}"><img loading="lazy" src="${escape(r.image)}" alt="${escape(r.run + " " + r.screen)}"></a></article>`,
    )
    .join("");
  const table = devices
    .map((device) => {
      const cases = runs.filter((r) => r.device === device);
      const bad = cases.filter((r) => !r.passed);
      return `<tr><th>${device}</th><td>${cases.filter((r) => r.passed).length}/${cases.length}</td><td>${Math.min(...cases.map((r) => r.medianFPS ?? 0)).toFixed(1)}</td><td>${Math.max(...cases.map((r) => r.cls ?? 0)).toFixed(3)}</td><td>${bad.length ? `<details><summary>${bad.length} failed</summary>${bad.map((r) => `<p>${escape(r.run)}: ${escape(r.failures.join("; "))}</p>`).join("")}</details>` : "PASS"}</td></tr>`;
    })
    .join("");
  const options = (values, current) =>
    `<option value="">All</option>` +
    values
      .map(
        (value) =>
          `<option ${value === current ? "selected" : ""} value="${value}">${value}</option>`,
      )
      .join("");
  await fs.writeFile(
    path.join(out, "index.html"),
    `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Abilitio mobile QA</title><style>body{font:16px/1.4 system-ui;background:#f8f5ee;color:#1d1b16;margin:24px}header{position:sticky;top:0;background:#f8f5ee;padding:8px 0;z-index:1;border-bottom:2px solid}h1{font-size:28px}h2{font-size:16px}select,button{font:inherit;min-height:44px;padding:8px;border:2px solid;border-radius:8px}label{display:inline-flex;align-items:center;gap:8px;margin:4px}section{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:20px;margin-top:20px}article{border:3px solid #166534;border-radius:16px;padding:12px;background:white}article[hidden]{display:none}.fail{border-color:#c00}img{width:100%;height:450px;object-fit:contain;object-position:top;background:#eee}p,td{overflow-wrap:anywhere}table{width:100%;border-collapse:collapse;margin:20px 0}th,td{padding:10px;text-align:left;border-bottom:1px solid #bbb}details{max-width:60ch}</style><header><h1>${baseline ? "Before fixes" : "Mobile QA"}: ${runs.filter((r) => r.passed).length}/${expectedRuns} flows passed</h1><p>${runs.length === expectedRuns ? "Completed" : "Run in progress"}. Signed, stripped catalog fixtures; simulated accounts/results. Not live saving or native Safari/OS keyboard validation.</p><label>Device <select id="device">${options(devices, "")}</select></label><label>Language <select id="lang">${options(["en", "ru", "uz"], "en")}</select></label><label>Age <select id="age">${options(["teen_adult", "child"], "teen_adult")}</select></label><label>Screen <select id="screen">${options([...new Set(rows.map((r) => r.screen))], "q01")}</select></label><label><input id="only-fail" type="checkbox">Failures only</label></header><table><thead><tr><th>Device</th><th>Passed</th><th>Min median FPS</th><th>Max CLS after load</th><th>Status</th></tr></thead><tbody>${table}</tbody></table><section>${cards}</section><script>const ids=["device","lang","age","screen"];const sync=()=>document.querySelectorAll("article").forEach(el=>{el.hidden=ids.some(id=>document.getElementById(id).value&&el.dataset[id]!==document.getElementById(id).value)||(document.getElementById("only-fail").checked&&el.classList.contains("pass"));});document.querySelectorAll("select,input").forEach(el=>el.addEventListener("change",sync));sync();</script></html>`,
  );
}
module.exports = { writeGallery };
