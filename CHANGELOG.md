# Changelog

## 2026-11-07 — BUG-06: show the existing empty state for missing skills

- Show the existing localized “No data yet.” phrase when a saved result has no recommended skills, instead of an empty card.
- Reproduced the empty card in the completed live test result. Lint and TypeScript pass; no new copy or scoring rules.

## 2026-11-07 — BUG-05: stop adding zero-score top interests

- Derive up to three positive RIASEC dimensions instead of padding the displayed code with zero-score dimensions. Stored answers, numeric profiles, career rankings and reasoning grades stay intact.
- The Enterprising-only live attempt exposed the issue. Single-signal and no-signal regression assertions failed before the fix; 13 focused tests pass afterward.

## 2026-11-07 — BUG-04: localize the ABBI dashboard tab

- Use the existing Russian and Uzbek ABBI heading translations in the dashboard tab. English wording, tab behavior and layout are retained.
- Reproduced the mixed-language tab manually on production; lint and TypeScript pass. Live verification is recorded in BUGS.md after release.

## 2026-11-03 — TEAM-01: update team portraits and membership

- Removed the former manager entry, translated biography, portrait styling and public photo asset from the shared team roster used by the homepage and Team page.
- Replaced Axmedov Umar’s portrait with the owner-supplied November update, optimized as WebP, and adjusted its framing. Removed the retired portrait asset.
- Verify both pages in ENG/RU/UZ at 390px and 1440px on a main-source Vercel preview before production publication; retain the existing roles and biographies for the remaining team members.

## 2026-10-25 — BUG-02: preserve newly saved assessment drafts

- Stop rejecting unexpired drafts merely because a device clock trails the server clock. Server signature checks and the 24-hour server expiry remain unchanged.
- Reproduced the loss manually on production; repeated save/exit/reopen/back in the local production build with a 38-second server clock lead and retained both question position and answer.
- Full local checks pass (44 test files, 237 tests and five export checks); Vercel build passes. Full authenticated/manual release gates remain pending in BUGS.md. This entry does not claim deployment.

## 2026-10-25 — Repair methodology section

- Replace the divider class on the “Who this is for” content section with a dedicated section style, restoring its height and readable background instead of the black block.
- Remove the obsolete homepage-practice sentence in ENG, RU and UZ after retiring that feature.

## 2026-10-25 — Remove homepage trial questions

- Remove the entire homepage starting-point workshop, including its three steps, four sample questions, answer counter and task controls.
- Remove the free-question hero button and send Practice tools navigation to the existing Career Journey page.
- Keep the full assessment and existing account data; update browser checks for the simplified homepage.

## 2026-10-25 — Production repair release

- Published the five QA repairs and scoped browser tooling from main (`84a2110`). Production guest verification passed 576 route cases, eight full guest assessment attempts, 12 public-control configurations and ten protected-API guest denials.
- Assessment now paints its loading state before JavaScript. Live client-key pattern scan passed across 91 JavaScript assets.
- Record incomplete authenticated/provider checks and missed performance targets in `QA.md`; deployment does not establish full launch readiness.

## 2026-10-24 — QA coverage and release ledger

- Inventory routes, interactive callsites and service boundaries in `QA.md`, with explicit executed/read/not-checked scope and evidence.
- Add `npm run test:e2e` for isolated local browser regressions in legacy and picture assessment modes; keep account, email and provider fixtures distinct from live verification.
- Update browser selectors for current folder tabs/workshop and drain intercepted requests before teardown; isolate profile-flow dashboard reads from real services.
- Record live Supabase RLS/policy/storage metadata, advisor warnings, guest API denials and incomplete production/performance checks. No database migration or production data write in this audit. The owner requested deployment of the completed repair batch on October 25; full audit certification remains incomplete.

## 2026-10-24 — QA-ASSESS-01: show the assessment while startup is pending

- The enabled picture assessment now server-renders its existing translated loading card while checking account and legacy-draft state. Slow or unavailable JavaScript no longer leaves the page completely blank. Account ownership, draft selection and question behavior are unchanged.
- Reproduced the missing first-paint content with JavaScript disabled; 390px and 1440px regressions now verify a visible, announced loading state. A new production Lighthouse result remains pending deployment.

## 2026-10-24 — QA-ADMIN-01: recover from failed moderation actions

- Failed ban/unban or user-refresh requests now show the existing localized generic error and release the busy control, instead of escaping as unhandled promises. Access checks and moderation rules are unchanged.
- Reproduced the unhandled rejection with a disposable founder/student fixture; phone and desktop checks cover failure feedback, retry, ban/unban and user search. Production administrator actions remain unverified.

## 2026-10-24 — QA-COM-01: report failed daily-question reads

- Community daily questions now surface database read errors through the existing error state. The existing default question is used only after a successful empty read, so a permissions or database failure cannot masquerade as saved content.
- The regression failed before the repair and now passes alongside successful-empty and saved-question cases. This verifies the server handler with a mocked database response, not production RLS.

## 2026-10-24 — QA-ABBI-02: align composer and server length limits

- The ABBI composer now enforces the existing 2,000-character server limit while pasting or typing. Oversized messages are no longer optimistically removed and sent only to fail server validation.
- A 2,001-character browser paste reproduced the mismatch before the fix; phone and desktop regressions now cover the limit, empty/whitespace input and a valid send. No wording, scoring or provider changes.

## 2026-10-24 — QA-ABBI-01: clearing a pending conversation

- Clearing ABBI history now invalidates pending replies, so an older reply cannot restore cleared messages or interfere with a newer conversation. A synchronous pending guard also prevents duplicate sends before the next render.
- Reproduced the returning cleared reply before the repair; desktop and phone fixture regressions now verify that it stays absent after refresh. Live authenticated verification and the complete release gate remain pending.

## 2026-10-23 — Design pass 4

- Replaced the home brain with the reference trail SVG and synchronized practice, choose and try stations. Rebuilt the workshop selector row and normalized practice answer drawings while retaining question data and progress.
- Applied the postcard contact form, university notebook, folder tabs, activity sticky notes, waving ABBI and corkboard Settings designs. Live copy and account data remain authoritative; the illustration footer uses its requested shorter label.
- Added per-illustration visibility and motion-preference handling, responsive layouts, keyboard focus styles, synchronized appearance controls and dark-theme contrast repairs. No schema, account, grading, route or provider changes.
- Verification and release evidence are recorded in the private design-pass-4 delivery; implementation guidance is in `docs/development/DESIGN_PASS_4.md`.

## 2026-10-23 — REL-02, SEC-02: bounded dashboard reads and patched test tooling

- Dashboard and additional history reads now stop waiting after 15 seconds and expose the existing localized Retry screen. Old idle handoffs receive cancellation when replaced or cleared. Successful data, exact totals and query ownership are unchanged.
- Updated the existing Vitest family to 4.1.12, addressing two moderate development-tool advisories. No new package names or production dependency changes; the full dependency audit reports zero known vulnerabilities.
- Verification records include two failing blocked-read tests before the fix, three passing deadline/success cases after it, and a 390px stalled-transport/retry recovery check preserving 45 total reports with 20 loaded rows. The final local gate passed lint, types, 233 tests/43 files, five export checks and a Vercel build; 12 dashboard language/width/theme regression cases also passed. Publication additionally requires a main-source Vercel preview at 390/1440px.

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

### 2026-11-08 — REQUEST-07

- Show only the three highest-ranked career suggestions on the assessment report and PDF. Continue ranking against the full catalog; remove the report’s show-all and catalog-search controls.

### 2026-11-08 — REQUEST-08

- Give all 20 child activity questions distinct six-choice sets, translated into ENG/RU/UZ, with activity-specific SVG pictures. Expand child preferences from 16 to 32 statements. Each attempt still contains 12 preferences and 18 activity choices, with no reasoning score.
- Issue new child content as v2; retain original IDs, translations and score mappings so existing v1 drafts resume unchanged.

### 2026-11-08 — REQUEST-09

- Put founder engagement/platform metrics, growth charts and user management first. Collapse detailed question statistics at the bottom and fetch them only when opened.

### 2026-11-08 — BUG-08

- Add the missing car, compass, leaf and moon drawings to the new child activity set; check that every child activity has a specific illustration.
