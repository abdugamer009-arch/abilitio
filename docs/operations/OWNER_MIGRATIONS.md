# Owner database handoff

This is the release procedure for existing and fresh projects. The selected replacement project and live initialization evidence are recorded in [Supabase setup](SUPABASE_SETUP.md). Do not infer deployment or account transfer from a GitHub link.

## Apply before production verification

1. Confirm the production Supabase project used by the app. The earlier result-repair investigation identified `kxlmpctcaevmognfmalb`; a connected integration had pointed to a different project. Verify the current deployed URLs rather than assuming those environments match.
2. Back up the database and test on a staging copy. Compare its applied migrations with `supabase/migrations`. A new project needs the complete chain in filename order. For an existing project, apply only missing migrations in order.
3. Apply `20261010160000_repository_reliability.sql` after the prerequisite career, school and community schemas. It includes repeatable `session_nonce`, replay index, scoring version, task journal and moderation setup even if the October 9 integrity migration was missed. Do not apply the older October 9 migration afterward: its policy statements are not repeatable.
4. Apply `20261011140000_exact_interest_profile.sql` to store the six exact RIASEC scores on new results. Historical rows remain nullable and are shown as estimates; do not backfill projected scores as exact measurements.
5. Verify `SUPABASE_SERVICE_ROLE_KEY` and server/client URLs refer to this same project, and set a stable server-only `ASSESSMENT_SIGNING_SECRET`. Restart/redeploy after schema setup. Never place either secret in a VITE variable.
6. Confirm existing founders have admin role rows. The migration provisions the two existing confirmed founder emails; preserve existing role rows and explicitly provision any additional administrators previously configured through `ADMIN_EMAILS`.

## Migration effects

Existing assessment rows remain intact and receive `scoring_version='v1'`. New server-computed results use `v2`. The `(user_id, session_nonce)` partial unique index makes retry idempotent. Ordinary clients cannot insert/update scored results. The migration protects profile moderation fields, blocks banned-account writes, grants principals visibility of enrolled student profiles, restricts retired Aura mutations, and installs an atomic specialized-class replacement RPC.

Principal tools select the most recently created owned school, breaking creation-time ties by ID. Multiple registrations therefore remain usable.

Class replacement validates ownership and school enrollment before deleting any previous suggestions. An invalid replacement rolls back the transaction. No broad peer-profile, user-stat or private-storage read grant is added; community authors and avatar URLs are resolved server-side only after message visibility checks.

## Verify with staging accounts

- Complete and save one assessment; repeat Finish/retry with the same signed attempt. Exactly one result should exist, with nonce, `v2`, and the exact `riasec_profile`. Reload and confirm the Holland code and radar scores agree with the saved response. Historical results must show the estimate notice. Missing catalog/schema must produce a visible failure rather than empty recommendations.
- Try a direct authenticated score insert, moderation-field update and arbitrary Aura award. All must be denied. A normal user must still read their own result and record a task.
- Ban a test user and try direct community/task writes and protected server actions. All must be denied. Verify administrators can still moderate other users.
- As a principal, read enrolled students' names/results; unrelated profiles must stay hidden. Generate classes, then send an invalid replacement and confirm prior classes remain.
- Check authorized community messages, older-history pagination and author avatars. An arbitrary user-ID lookup outside visible messages must fail.
- Confirm email signup/recovery returns to the requested app path. Check both an existing administrator and a newly provisioned administrator.

Local verification includes the entire migration chain, repeatability, profile visibility, score/Aura permission denial, immutable moderation fields, banned task writes and class replacement rollback. These checks use simulated Supabase schemas in PostgreSQL-compatible PGlite. Owner staging/live checks remain necessary.

## Operational notes

Apply schema before relying on the newly deployed class RPC and `scoring_version` / `riasec_profile` fields. Deploying code alone cannot repair the missing production column. The fresh Supabase database was initialized as recorded in [SUPABASE_SETUP.md](SUPABASE_SETUP.md). No email provider was configured and no multilingual ABBI responses were fabricated. Historical assessments are not recalculated.

## Fresh-project compatibility

Fresh initialization on `cadbpdgljzxnbeamitnq` exposed an ownership error in the June 9 migration: Supabase already enables RLS on its managed `realtime.messages` table, and the dashboard PostgreSQL role cannot alter that table. The migration now checks the existing protection and retains its scoped policy. This historical-file correction is necessary because a fresh installation fails before later migrations can run. Existing installations need no replay of the June 9 migration.

Reference: [Supabase managed Realtime ownership troubleshooting](https://supabase.com/docs/guides/troubleshooting/realtime-must-be-owner-of-table-messages).

## Administrator identity after optional email confirmation

Production signup no longer verifies email ownership. Apply `20261011180000_explicit_admin_provisioning.sql` before disabling confirmation in another environment. It keeps existing administrators and removes automatic grants from new signups. Provision future administrator roles only after verifying the specific account UUID and the owner's identity. Never use a claimed email or an automatically populated `email_confirmed_at` timestamp as proof of identity when autoconfirm is enabled. Do not rerun the historical founder-email backfills.

## October 15 consent release

Before releasing the audit continuation, apply `20261015120000_community_consent.sql` to the intended Supabase project. It preserves existing memberships/messages, adds nullable `consented_at`, revokes both legacy assignment entry points from public/anonymous/authenticated callers, and grants explicit consent/leave operations. This repository change has **not** applied production SQL. PGlite is a simulated migration check only.

In an authorized disposable account verify: assessment save creates zero memberships; opening communities creates zero memberships; the invitation describes name/avatar/message visibility; Join alone creates consented membership; Leave removes only the caller's selected membership. Confirm an old member gets a review notice, and a second account cannot leave that membership. Keep the existing assessment nonce and ownership checks.

Recovery requires both flags and external delivery proof in [email setup](AUTH_EMAIL_SETUP.md). School program enrollment remains gated until approved terms in `src/lib/schools/school-agreement.ts`. The new local exports require no server secrets or additional provider.

`node scripts/cleanup-qa.mjs --manifest=/private/manifest.json` is a read-only ownership-checked dry run. The manifest requires `ownerId`, exact `resultIds`, and exact `communityIds` UUID arrays; names/emails are never used to guess QA data. Apply only after explicit human confirmation of that exact manifest, with `--apply` and `QA_CLEANUP_CONFIRM` equal to that owner UUID. Server-only `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are required. The tool does not delete accounts, messages or unrelated results. No production cleanup has been performed by this continuation.
