# Picture assessment implementation — 17 October 2026

Historical implementation receipt. Superseded deployment state is recorded in the [20 October release record](PICTURE_ASSESSMENT_2026_10_20.md). The statements below describe the original 17 October checkpoint.

Implemented locally on `codex/picture-assessment` after approval of the 18 question images and four practice puzzles. No commit, push, deployment, production flag change or live SQL application was performed.

## Delivered behavior

- Focus mode with the supplied cartoon design, ABBI start/finish illustrations, reference-style hatched card shadows, part chips, progress dots, face choices, drawn activity cards, selected badges and explicit Next/Back controls.
- Older path: unchanged 12 work preferences and nine interests, plus nine non-math reasoning slots. Each slot selects one of two approved versions. Child path: unchanged 12 preferences and 18 activities; reasoning remains unassessed.
- Immutable server-only question data with rule/distractor explanations, ENG/RU/UZ prompts, SVG geometry generators and canonical answer IDs. Answer order shuffles and is signed, including the three-answer logic item. Students receive no grading keys or hidden scoring weights.
- Browser-local guest recovery, authenticated draft-saving implementation, owner-specific keys, safe guest sign-in handoff, refresh/closed-tab recovery and private shown/answered/choice/active-time observations. Timing is approximate and is not displayed to students. Storage/cloud failures remain visible and retryable.
- Admin-only item statistics with exposure counts, answer distributions, percent correct, average active time, version gaps and pilot-range/distractor flags. Role checks precede service reads; RLS separately excludes student access to grading/timing rows. Role and ban helpers were moved to a server-only access module to keep the service client out of browser bundles.
- Four independent Workshop practice puzzles, localized red-pen rule explanations and a truthful practice sentence. Retired sample and question IDs remain available for old signed grading. New selections in the enabled picture path contain no old mathematical items.
- New-set display scale is `round(correct / 9 * 10, 1)`: seven correct displays 7.8/10, alongside 7 of 9. The stored score remains the raw correct count. Recommendation/preference/interest scoring and all 166 canonical rankings remain unchanged.
- Historical result scores and rankings are not recomputed. The prepared migration adds `legacy-question-set-unknown` metadata to older rows and saves exact immutable set tags for new attempts.

## Verification evidence

| Check                                    | Outcome                                                                                                                                                        | Evidence boundary                                                                      |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `npm run check`                          | Passed: 220 Vitest tests across 39 files, plus five export checks; lint and TypeScript passed                                                                  | Includes domain/server contracts and PGlite; not live Supabase                         |
| Question-rule validation                 | All 18 scored items and four practice items have exactly one rule-valid answer through 492 option permutations; 24 proper cube views verified                  | Proves encoded rules, not empirical difficulty                                         |
| `NITRO_PRESET=node-server npm run build` | Passed                                                                                                                                                         | Standalone Node production build                                                       |
| Full assessment browser matrix           | 48 complete 30-question flows passed: ENG/RU/UZ, 390/1440px, light/dark, guest/account fixtures, older/child paths                                             | Real local signed question delivery; authenticated saves/results are explicit fixtures |
| Recovery and controls                    | Refresh, closed-tab recovery, back navigation, scoped shortcuts, guest auth redirect/owner transfer, legacy resume/restart and blocked-storage behavior passed | Authentication in handoff is simulated; no account created                             |
| Workshop practice                        | All four items and explanations passed 12 locale/viewport/theme configurations                                                                                 | Local Chromium emulation                                                               |
| Admin statistics UI                      | 12 locale/viewport/theme configurations passed                                                                                                                 | Role/UI fixtures; server-role denial and SQL RLS separately tested                     |
| Legacy mobile regression                 | Six focused Russian Android-small longest/random/stress flows passed, both age paths                                                                           | Existing development fixtures                                                          |
| Client boundary                          | 85 built browser scripts checked: no scored-bank IDs, service-role key references or signing-secret references                                                 | Build scan; practice keys are intentionally public for explanations                    |
| `git diff --check`                       | Passed                                                                                                                                                         | Tracked-source whitespace check                                                        |

Private screenshots and machine receipts are excluded from Git under `artifacts/picture-assessment-qa/`: `results.json`, `controls.json`, `admin.json` and `client-bank-scan.json`. Representative screenshots were visually inspected, including both themes, mobile layouts, the cube net and localized practice explanations.

## Production and remaining work

The general rollout remains off. `ASSESSMENT_PICTURE_ENABLED` and `ASSESSMENT_PICTURE_ROLLOUT_APPROVED` default false. Production requires both flags; puzzle-content approval does not enable general rollout. When off, the existing production assessment still uses its legacy flow and bank. The new non-math path is available in the local preview started with the development flag.

The migration `supabase/migrations/20261017120000_picture_assessment.sql` is prepared and passed the local database suite, but was **not applied to a live project**. Real authenticated draft saving/result saving and recovery were not verified against live Supabase. Apply it to the intended pilot project and verify ownership, saving and retry behavior with an authorized account before inviting students.

No real student pilot has been run, and no empirical item difficulty or version equivalence is claimed. Before general rollout, recruit at least 30 actual students of different ages within the approved older group, review item/version exposure and outcomes, replace failing items, rerun checks and obtain explicit rollout approval. See [the implementation and pilot protocol](../development/PICTURE_ASSESSMENT.md) and [the full retirement inventory](../design/ASSESSMENT_REASONING_RETIREMENT.md). Physical-device/native Safari and Firefox checks were not performed in this task; browser evidence is Chromium emulation.

## Changed files

The following source/configuration/documentation files make up this local implementation. Generated builds, screenshots, credentials and review exports are excluded.

- [.env.example](../../.env.example)
- [docs/README.md](../../docs/README.md)
- [docs/design/ASSESSMENT_REASONING_RETIREMENT.md](../../docs/design/ASSESSMENT_REASONING_RETIREMENT.md)
- [docs/development/ARCHITECTURE.md](../../docs/development/ARCHITECTURE.md)
- [docs/development/PICTURE_ASSESSMENT.md](../../docs/development/PICTURE_ASSESSMENT.md)
- [docs/operations/OWNER_MIGRATIONS.md](../../docs/operations/OWNER_MIGRATIONS.md)
- [docs/operations/PICTURE_ASSESSMENT_2026_10_17.md](../../docs/operations/PICTURE_ASSESSMENT_2026_10_17.md)
- [scripts/qa-picture-admin.cjs](../../scripts/qa-picture-admin.cjs)
- [scripts/qa-picture-assessment.cjs](../../scripts/qa-picture-assessment.cjs)
- [scripts/qa-picture-controls.cjs](../../scripts/qa-picture-controls.cjs)
- [src/components/CareerWorkshop.tsx](../../src/components/CareerWorkshop.tsx)
- [src/components/assessment/ActivityPicture.tsx](../../src/components/assessment/ActivityPicture.tsx)
- [src/components/assessment/AssessmentAbbi.tsx](../../src/components/assessment/AssessmentAbbi.tsx)
- [src/components/assessment/PictureAssessment.tsx](../../src/components/assessment/PictureAssessment.tsx)
- [src/components/assessment/PictureFigure.tsx](../../src/components/assessment/PictureFigure.tsx)
- [src/components/assessment/PictureQuestionStats.tsx](../../src/components/assessment/PictureQuestionStats.tsx)
- [src/integrations/supabase/types.ts](../../src/integrations/supabase/types.ts)
- [src/lib/abbi/abbi.functions.ts](../../src/lib/abbi/abbi.functions.ts)
- [src/lib/admin/access.server.ts](../../src/lib/admin/access.server.ts)
- [src/lib/admin/admin.functions.ts](../../src/lib/admin/admin.functions.ts)
- [src/lib/assessment/career-assessment.ts](../../src/lib/assessment/career-assessment.ts)
- [src/lib/assessment/career.functions.ts](../../src/lib/assessment/career.functions.ts)
- [src/lib/assessment/legacy-samples.server.ts](../../src/lib/assessment/legacy-samples.server.ts)
- [src/lib/assessment/picture-bank.server.json](../../src/lib/assessment/picture-bank.server.json)
- [src/lib/assessment/picture-bank.server.ts](../../src/lib/assessment/picture-bank.server.ts)
- [src/lib/assessment/picture-config.functions.ts](../../src/lib/assessment/picture-config.functions.ts)
- [src/lib/assessment/picture-config.server.ts](../../src/lib/assessment/picture-config.server.ts)
- [src/lib/assessment/picture-descriptions.ts](../../src/lib/assessment/picture-descriptions.ts)
- [src/lib/assessment/picture-draft.ts](../../src/lib/assessment/picture-draft.ts)
- [src/lib/assessment/picture-practice.json](../../src/lib/assessment/picture-practice.json)
- [src/lib/assessment/picture-progress.functions.ts](../../src/lib/assessment/picture-progress.functions.ts)
- [src/lib/assessment/picture-progress.server.ts](../../src/lib/assessment/picture-progress.server.ts)
- [src/lib/assessment/picture-rules.ts](../../src/lib/assessment/picture-rules.ts)
- [src/lib/assessment/picture-statistics.ts](../../src/lib/assessment/picture-statistics.ts)
- [src/lib/assessment/picture-stats.functions.ts](../../src/lib/assessment/picture-stats.functions.ts)
- [src/lib/assessment/picture-types.ts](../../src/lib/assessment/picture-types.ts)
- [src/lib/assessment/question-bank.ts](../../src/lib/assessment/question-bank.ts)
- [src/lib/assessment/reasoning-copy.ts](../../src/lib/assessment/reasoning-copy.ts)
- [src/lib/assessment/sample-questions.ts](../../src/lib/assessment/sample-questions.ts)
- [src/lib/assessment/session.server.ts](../../src/lib/assessment/session.server.ts)
- [src/lib/community/community.functions.ts](../../src/lib/community/community.functions.ts)
- [src/routes/admin.tsx](../../src/routes/admin.tsx)
- [src/routes/career-assessment.tsx](../../src/routes/career-assessment.tsx)
- [src/routes/career-results.tsx](../../src/routes/career-results.tsx)
- [src/styles/picture-assessment.css](../../src/styles/picture-assessment.css)
- [supabase/migrations/20261017120000_picture_assessment.sql](../../supabase/migrations/20261017120000_picture_assessment.sql)
- [tests/integration/migration.test.ts](../../tests/integration/migration.test.ts)
- [tests/unit/H02-submit-isolation.test.ts](../../tests/unit/H02-submit-isolation.test.ts)
- [tests/unit/picture-access.test.ts](../../tests/unit/picture-access.test.ts)
- [tests/unit/picture-assessment.test.ts](../../tests/unit/picture-assessment.test.ts)
- [tests/unit/workshop.test.ts](../../tests/unit/workshop.test.ts)
