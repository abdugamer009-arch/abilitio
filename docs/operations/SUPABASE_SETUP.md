# Supabase setup — October 11, 2026

## Active replacement project

The owner selected `cadbpdgljzxnbeamitnq` and approved a fresh database, its scoped access rules, and connecting the Vercel application to it. The earlier project `kxlmpctcaevmognfmalb` was not deleted and no accounts/results were transferred. Users need new accounts after cutover.

The new project was verified empty before initialization. All 25 repository migrations were executed in one transaction and recorded in `supabase_migrations.schema_migrations`. Live counts: **27 public app tables, 166 careers and 52 university majors**. The required `session_nonce`, `scoring_version` and `riasec_profile` result columns are installed.

## Verification

Live SQL checks used temporary records inside a transaction that was rolled back. They verified exact-profile persistence, nonce uniqueness, owner-only result visibility, denial of authenticated fabricated scores, and principal visibility limited to enrolled students. No verification accounts or results remain. These are database checks, not proof of browser signup or email delivery.

The first initialization rolled back on the historical Realtime migration's managed-table ownership error. The June 9 source migration now reads the existing RLS protection rather than altering the Supabase-owned table. Scoped policies are retained. Local PGlite tests now simulate the managed table with RLS already enabled and test community-topic isolation.

## Deployment connection

The Supabase Auth Site URL is `https://abilitio-xt4n.vercel.app`; its redirect allowlist includes `https://abilitio-xt4n.vercel.app/auth**` for login/recovery query parameters. No email provider configuration or delivery test is claimed.

The server URL, public key, server-only service-role key and project reference have been updated in Vercel. The public `VITE_SUPABASE_*` entries are still in a legacy Secret format that Vercel rejects on update. Their replacement as Config values is awaiting owner approval. Production still uses the previous database until the public values are replaced and a deployment is verified.

Keep service-role/signing keys server-only. `supabase/config.toml` identifies the selected replacement project. Future releases must apply only missing migrations; never replay fresh initialization against existing accounts/tables.
