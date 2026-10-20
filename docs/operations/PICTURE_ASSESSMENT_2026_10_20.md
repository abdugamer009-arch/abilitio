# Picture assessment release — 20 October 2026

The owner explicitly requested publication of the previously unpublished picture assessment work (“ok deploy them”). The release combines that implementation with the current main branch, retaining the dashboard design, motion changes and both founder biographies. Defaults in `.env.example` remain false for new environments; the two server flags are enabled in Vercel Production and Preview for this publication.

## Verified before publication

- `npm run check`: lint, TypeScript, 255 tests across 42 files and five export checks passed.
- Node and Vercel builds passed with both picture switches enabled.
- 48 complete 30-question browser flows passed in ENG/RU/UZ, mobile/desktop, light/dark and both age paths. Guest delivery uses real local signed sessions; account saving/results in this matrix use explicit fixtures.
- Recovery/controls, 12 localized Workshop practice cases and 12 admin UI cases passed. Browser evidence is Chromium emulation, not physical Android or native Safari validation.
- The affected eight historical result rows were privately backed up. A transactionally rolled-back rehearsal passed before applying only `20261017120000_picture_assessment.sql` to the intended live Supabase project.
- All eight original rows retained the same digest after applying the schema addition (excluding the new metadata column). Scores and rankings were not recalculated.
- Live SQL checks verified owner-scoped drafts, no student reads of private observations and service-role-only RPC execution. Temporary verification records were rolled back. These SQL checks are distinct from an authenticated browser save.

Private backup, build logs, source manifest and database receipts are excluded from Git under `artifacts/unpublished-release/`. No service credentials or student records belong in this document.

## Evidence boundaries and follow-up

No real 30-student pilot has occurred. Item difficulty labels, the proposed target ranges and version equivalence remain unvalidated. An operator QA attempt does not count toward a student pilot. Follow the [pilot protocol](../development/PICTURE_ASSESSMENT.md#admin-review-and-real-pilot) and preserve old resolvers when replacing items.

The production project already has its server service key; no signing key was rotated. Preview does not have equivalent service/signing credentials, so a successful preview build alone cannot prove authenticated signed-session delivery. Code publication does not apply historical migrations or establish email delivery, provider transfer, a completed pilot or physical-device validation.
