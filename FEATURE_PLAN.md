# Pre-test profile feature

## Baseline and existing architecture

Baseline captured before edits in ignored `artifacts/profile-feature/`: landing, entry and question at 1440/390; completion and account gate at 1440. Browser page errors: none. Live results are unavailable locally because Supabase is unconfigured; do not claim live saving verification.

`/assessment` redirects to `/career-assessment`. The route collects indexed answers and retains progress across sign-in. Server functions select balanced 12 personality / 9 reasoning / 9 interest questions with Fisher–Yates and sign membership and option permutations. Submission authenticates, verifies the signature, resolves hidden keys and RIASEC weights, scores and persists all 166 career matches. `/career-results` fetches the saved result. Existing CSS, page shell, reveal animation, scroll and lazy brain boundary remain the integration surfaces.

## Files and design

- `career-assessment.ts`: shared age metadata types.
- New `child-questions.ts`: 16 simple personality statements and 20 concrete activity prompts in EN/RU/UZ; `addedBy: feature-age`.
- `question-bank.ts`, `question-translations.ts`: tag existing items, select age pools with balanced axes/themes, validate coverage, resolve child scoring server-side.
- `career.functions.ts`, `session.server.ts`: issue both signed age variants without receiving profile choices; validate variant counts; child scoring uses preferences/interests and neutral cognitive contribution, with no reported reasoning score.
- New `attempt-profile.ts` and `result-rules.ts`: session-only profile/progress utilities and configurable per-career gender wording/weight/exclusion engine with nonempty fallback.
- New `AssessmentProfileChooser.tsx`; assessment/results routes: required chooser, resume, confirmed age restart, full restart, session-only presentation rules bound to saved result/account.
- Tests, report and architecture documentation: meaningful domain and scripted browser verification.

## New fields/state

`ageGroups: (child | teen_adult)[]`, `addedBy?: feature-age`; `profile = { gender: male | female | null, ageGroup: child | teen_adult | null }`. One chooser visibility state, asynchronous start guard, variable section counts. Progress and profile use sessionStorage only, never permanent storage, analytics or server payloads. Both variants are fetched identically for all users; hidden scoring remains server-side. Submitted question IDs inherently identify the question variant, but no demographic field is submitted or persisted. Gender rules affect only the session's displayed ranking/wording, not persisted server scores.

## Regression checklist

- All four combinations: required choices, valid result presentation, child no math/advanced questions, older balance and keys intact.
- Fresh shuffle, EN/RU/UZ alignment, coverage warnings, empty pool and exclusion fallback.
- 1440 and 390, keyboard, touch, reduced motion, console errors, overflow and baseline comparison.
- Change gender retains answers; change age requires confirmation and resets; cancel retains progress; refresh resumes; direct and legacy routes gate; restart clears choices; rapid start guarded; timers/listeners cleaned.
- Existing auth, account ownership, signed option order, submission retries, saved history, scroll and brain remain intact.
- Run complete check and Node build. Separate mocked browser result verification from live backend validation.
