# Assessment results API repair

The active production browser uses Supabase project `kxlmpctcaevmognfmalb`.
On 10 October 2026, a read-only REST probe using the deployed public key found:

- `career_assessment_results?select=id&limit=0`: HTTP 200.
- `career_assessment_results?select=session_nonce&limit=0`: HTTP 400, PostgreSQL `42703`, `column career_assessment_results.session_nonce does not exist`.
- `careers` and `university_majors` with `limit=0`: HTTP 200.

The deployed assessment submission inserts `session_nonce`. Its required migration was not applied to the active database. This is a confirmed storage incompatibility, not a UI-only failure. No real user rows were read or written in these probes. The exact affected-user error response and a real authenticated save have not been obtained, so this is not a claim that there are no other configuration issues.

## Repair prepared

`supabase/fixes/assessment_result_storage.sql` contains the focused, repeatable result-storage repair: add the column, enforce one result per user/signed attempt, and retain server-authoritative score writes. Existing result rows are retained. It excludes unrelated profile/task-journal changes from the earlier migration.

Review/apply in staging first, then apply to the **active project** as the database owner. The GitHub integration points to a different project (`hszgnxvishlrfqjuwkgm`); applying SQL there would not repair this site's database. Check that Vercel's server URL, publishable key and service-role key all belong to the active project. Never substitute an anonymous key for the service-role key, expose that key to the browser, or drop the nonce to bypass the migration.

The Supabase dashboard currently requires owner sign-in. The local Vercel CLI is signed into a different team from the production project. Therefore the schema change has **not** been applied remotely, and production result saving is **not fixed yet**.

## Retry fixes

- Repeated Finish/Enter actions are guarded while submission is pending. Failure keeps the existing answers and permits retry.
- A retry after a successful save but lost response returns the stored result for that same user and signed attempt. A different unique conflict, missing migration, or failed lookup still fails; no scores are overwritten and no client writes are added.
- Personality, reasoning, interests, career matching and scoring formulas are unchanged.

Lint, TypeScript, Vercel production build, and 71 tests pass. Five new tests cover successful storage, a lost-response retry scoped to owner and nonce, unrelated conflicts, missing schema, and failed recovery reads. Browser retry evidence is stored alongside the existing local audit artifacts.

## Required verification after the database repair

Use disposable accounts in staging: complete an assessment, sign up/confirm if required, submit, load results directly and reload, then sign out/in and verify the same stored result. Retry the same submission and confirm no second result is created. Confirm a different user cannot read that result and fabricated owner inserts remain forbidden. Validate one authorized disposable production account only after the schema and matching environment are verified; do not test by writing to real users' profiles.
