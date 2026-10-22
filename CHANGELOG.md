# Changelog

## 2026-10-22 — A11Y-01, A11Y-02: readable dashboard and assessment text

- Growth Areas badges now use the existing foreground text color; the dark assessment start heading uses the existing pen-red theme color. Wording, layout, scoring and stored data are unchanged.
- Verified the two failing contrast cases before the fix and all 14 light/dark browser cases after it, plus lint, TypeScript, 230 tests, five export checks and a Vercel build. Publication requires the main-source Vercel preview at 390px and 1440px; the audit report and private deployment receipt record that gate and the live smoke check.

## 2026-10-19 — Student dashboard design pass 3

The owner approved publication with “approve i need results” on October 19, 2026.

- Applied the supplied profile, Results, score ticket, activity note, university notebook, ABBI and Settings designs across the seven existing student dashboard tabs.
- Preserved saved data, routes, translations, scoring and ABBI reply behavior. Practice tools and assessment work are unchanged. The unavailable digest remains disabled.
- Before release: lint, TypeScript, 186 tests, five export checks, Vercel build and preview CI passed. The local visual matrix covered 84 tab/language/theme/width states; comparison captures use isolated fixtures.
- Production deployment `ca43a87` completed successfully: https://abilitio-xt4n.vercel.app/dashboard (Vercel deployment `EtmhDZ5ChxZHYNcRWgdcnfmijQvA`). All seven tabs were inspected in the existing signed-in production session. Saved results and career recommendations were retained. Recorded activity loaded from the live backend. No saved values, uploads or messages were changed during this smoke test.

## 2026-10-20 — Route transition performance

- Retained the yellow upward curtain and existing easing with a single native transform/opacity layer. Shared chrome and memoized drawings avoid unnecessary remounts; route code and owner-scoped dashboard reads start before mounting. Below-fold content and decorative effects wait until the transition finishes.
- Preserved history scroll positions, fragment destinations, mobile menu behavior, translations and saved-data queries. Motion off/reduced motion uses a 120ms fade. Dashboard tabs keep their existing instant swap. No dependency or schema change.
- Verified lint, types, 189 tests, five export checks, Vercel build, history/rapid-click/fade flows and 24 language/theme/width cases. Separate optimized local-fixture traces and 12 recordings are retained outside Git. The final 4× CPU measurements still exceed the 50ms long-task and 450ms total targets, and whole-window rAF throughput remains below 55fps on the two page routes. This release improves the curtain but does not establish perfect smoothness, live backend latency or physical Android performance.
