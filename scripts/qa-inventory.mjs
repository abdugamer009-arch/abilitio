import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

// Source inventory only. It deliberately records no behavioral PASS results.
const root = process.cwd();
const files = [];
function walk(dir) {
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, item.name);
    if (item.isDirectory()) walk(file);
    else if (/\.[cm]?[jt]sx?$/.test(file) && !file.endsWith("routeTree.gen.ts")) files.push(file);
  }
}
walk("src");
files.sort();
const sources = new Map(
  files.map((file) => [
    file,
    ts.createSourceFile(file, fs.readFileSync(file, "utf8"), ts.ScriptTarget.Latest, true),
  ]),
);
const routes = [];
const imports = new Map();
for (const [file, source] of sources) {
  const deps = [];
  function visit(node) {
    if (ts.isCallExpression(node) && node.expression.getText(source) === "createFileRoute") {
      const route = node.arguments[0];
      if (route && ts.isStringLiteral(route))
        routes.push({
          route: route.text,
          file,
          line: source.getLineAndCharacterOfPosition(node.getStart()).line + 1,
        });
    }
    const specifier = ts.isImportDeclaration(node)
      ? node.moduleSpecifier
      : ts.isCallExpression(node) && node.expression.kind === ts.SyntaxKind.ImportKeyword
        ? node.arguments[0]
        : null;
    if (specifier && ts.isStringLiteral(specifier)) {
      const name = specifier.text;
      if (name.startsWith("@/") || name.startsWith(".")) {
        const base = name.startsWith("@/")
          ? `src/${name.slice(2)}`
          : path.join(path.dirname(file), name);
        const resolved = [
          base,
          `${base}.tsx`,
          `${base}.ts`,
          `${base}/index.tsx`,
          `${base}/index.ts`,
        ].find((candidate) => sources.has(candidate));
        if (resolved) deps.push(resolved);
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(source);
  imports.set(file, deps);
}
function closure(file, seen = new Set()) {
  if (seen.has(file)) return seen;
  seen.add(file);
  for (const dep of imports.get(file) || []) closure(dep, seen);
  return seen;
}
const shared = closure("src/routes/__root.tsx");
const routeDeps = routes.map((route) => ({ ...route, deps: closure(route.file) }));
const rows = routes.map(({ route, file, line }, i) => ({
  id: `PAGE-${String(i + 1).padStart(3, "0")}`,
  kind: "route",
  detail: route,
  file,
  line,
  routes: route,
}));
rows.push({
  id: "PAGE-404",
  kind: "route",
  detail: "Unknown path /qa-not-found; root notFoundComponent",
  file: "src/routes/__root.tsx",
  line: 1,
  routes: "*",
});
let control = 0;
let api = 0;
const compact = (text) => text.replace(/\s+/g, " ").slice(0, 190);
for (const [file, source] of sources) {
  const pages = shared.has(file)
    ? "shared shell"
    : routeDeps
        .filter((r) => r.deps.has(file))
        .map((r) => r.route)
        .join(", ") || "not statically reachable / gated";
  function add(kind, detail, node) {
    rows.push({
      id: `${kind === "control" ? "UI" : "API"}-${String(kind === "control" ? ++control : ++api).padStart(3, "0")}`,
      kind,
      detail: compact(detail),
      file,
      line: source.getLineAndCharacterOfPosition(node.getStart()).line + 1,
      routes: pages,
    });
  }
  function visit(node) {
    if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
      const tag = node.tagName.getText(source);
      const attrs = node.attributes.properties.filter(ts.isJsxAttribute);
      const event = attrs.filter((a) => /^on[A-Z]/.test(a.name.getText(source)));
      if (
        /^(a|button|input|select|textarea|form|summary|Link|.*(Button|Select|Input|Switch|TabsTrigger|Dialog|MenuItem|Checkbox|RadioGroupItem))$/.test(
          tag,
        ) ||
        event.length
      ) {
        const detail = attrs
          .filter((a) =>
            /^(to|href|type|role|name|aria-label|title|placeholder|on[A-Z].*)$/.test(
              a.name.getText(source),
            ),
          )
          .map((a) => a.getText(source))
          .join(" ");
        const parentText = ts.isJsxElement(node.parent)
          ? compact(node.parent.children.map((child) => child.getText(source)).join(" "))
          : "";
        add("control", `<${tag}> ${detail} ${parentText}`, node);
      }
    }
    if (
      ts.isVariableDeclaration(node) &&
      node.initializer &&
      node.initializer.getText(source).includes("createServerFn(")
    ) {
      add("server function", node.name.getText(source), node);
    }
    if (ts.isCallExpression(node)) {
      const expr = node.expression.getText(source);
      if (
        /\.from$|\.rpc$|\.auth\.[A-Za-z]+$|\.(upload|remove|createSignedUrl|download)$|^(fetch|sendBeacon)$|\.(setItem|removeItem|clear)$/.test(
          expr,
        )
      )
        add("service/storage call", node.getText(source), node);
    }
    ts.forEachChild(node, visit);
  }
  visit(source);
}
const flows = [
  [
    "FLOW-01",
    "Signup, login, wrong password, logout, recovery, session expiry and signed-out dashboard",
  ],
  [
    "FLOW-02",
    "Full assessment, types, age paths, save/exit/resume, authenticated finish/results/history",
  ],
  ["FLOW-03", "All four practice puzzles, answers, explanation, counter, persistence and clear"],
  ["FLOW-04", "Journey: every island, mascot marker, all tasks and journal reconciliation"],
  ["FLOW-05", "Every dashboard tab, actual counts, points, levels and UTC week boundary"],
  [
    "FLOW-06",
    "ABBI suggested/typed/long/empty/error messages, localization, owner isolation, history clear",
  ],
  [
    "FLOW-07",
    "Settings: avatar formats/size/type/drop/default, profile, language/theme persistence",
  ],
  [
    "FLOW-08",
    "Universities: search/filter/combined/empty/bookmarks/counter and all official links",
  ],
  ["FLOW-09", "Contact: topics/required/email validation/TEST submission/copy/email/phone"],
  [
    "FLOW-10",
    "Admin page/API guest/student denial, founder charts/actions using only disposable users",
  ],
  ["FLOW-11", "Every route, 404, shell/menu/footer/keyboard/history/focus/motion/loading/error"],
  [
    "SEC-01",
    "Supabase advisors, branch-tested migrations if needed, test-user A/B API and RLS isolation",
  ],
  ["SEC-02", "Client secret boundary, protected endpoints and server input validation"],
  ["PERF-01", "Mobile Lighthouse Home/Dashboard/assessment; 4x CPU transition FPS and long tasks"],
  [
    "REL-01",
    "Full checks/build, complete E2E gate, deployment, live rerun, rollback if release fails",
  ],
  ["DATA-01", "Disposable account/row/file ledger and cleanup, no real user data"],
].map(([id, detail]) => ({
  id,
  kind: "flow",
  detail,
  file: "QA.md",
  line: 1,
  routes: "see source inventory",
}));
const all = [...flows, ...rows];
fs.mkdirSync("artifacts/full-qa", { recursive: true });
fs.writeFileSync("artifacts/full-qa/inventory.json", JSON.stringify(all, null, 2));
const cell = (s) =>
  String(s).replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\|/g, "\\|").replace(/\n/g, " ");
const content = `# Abilitio full QA — 2026-10-24\n\nBaseline: production/main a8f4420. Inventory created before this audit's behavioral tests. Generated source callsites include gated/unused code, explicitly marked; repeated data-driven controls share a callsite ID and require all rendered instances in the test report. Static import reachability is a guide, not a claim that every branch renders.\n\n## Status rules\n\nTESTED means executed with recorded evidence; READ means code review only; NOT CHECKED names missing evidence. PASS/FAIL applies only to executed assertions. Fixtures are never live account/database proof. No production deployment is authorized by a partial/blocked test run.\n\n## Required matrix\n\nEvery applicable flow: guest / disposable student / disposable founder; ENG/RU/UZ; light/dark; 390/768/1440px; Motion on/off/system reduce; normal/Slow 4G/brief offline. Physical Android requires an attached authorized device. Browser emulation is labelled separately. Authenticated mutation tests require scoped disposable accounts and a cleanup capability before creation.\n\n## Initial blockers\n\n- Supabase connector is disconnected/unavailable; advisors, branches and managed disposable-account cleanup are not accessible yet. Reconnection requested. No existing real account will be used.\n- No physical Android device supplied.\n- Password recovery/provider status must be verified; do not enable email delivery without the owner's sender decision.\n\n## Inventory\n\n| ID | Item | Source | Applicable pages | Status / result / evidence |\n| --- | --- | --- | --- | --- |\n${all.map((r) => `| ${r.id} | ${cell(r.detail)} | [${r.file}:${r.line}](${r.file}#L${r.line}) | ${cell(r.routes)} | NOT CHECKED — inventoried, behavior pending |`).join("\n")}\n\n## Execution ledger\n\nNo behavior tests executed yet in this audit.\n`;
if (!process.argv.includes("--json-only")) fs.writeFileSync(path.join(root, "QA.md"), content);
console.log(
  `Inventory written before testing: ${routes.length + 1} routes/404, ${control} control callsites, ${api} service/function/storage callsites, ${flows.length} flow gates.`,
);
