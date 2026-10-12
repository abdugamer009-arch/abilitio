# Supabase setup — October 11, 2026

## Active replacement project

The owner selected `cadbpdgljzxnbeamitnq` and approved a fresh database, its scoped access rules, and connecting the Vercel application to it. The earlier project `kxlmpctcaevmognfmalb` was not deleted and no accounts/results were transferred. Users need new accounts after cutover.

The new project was verified empty before initialization. All 25 repository migrations were executed in one transaction and recorded in `supabase_migrations.schema_migrations`. Live counts: **27 public app tables, 166 careers and 52 university majors**. The required `session_nonce`, `scoring_version` and `riasec_profile` result columns are installed.

## Verification

Live SQL checks used temporary records inside a transaction that was rolled back. They verified exact-profile persistence, nonce uniqueness, owner-only result visibility, denial of authenticated fabricated scores, and principal visibility limited to enrolled students. No verification accounts or results remain. These are database checks, not proof of browser signup or email delivery.

The first initialization rolled back on the historical Realtime migration's managed-table ownership error. The June 9 source migration now reads the existing RLS protection rather than altering the Supabase-owned table. Scoped policies are retained. Local PGlite tests now simulate the managed table with RLS already enabled and test community-topic isolation.

## Deployment connection

The Supabase Auth Site URL is `https://abilitio-xt4n.vercel.app`; its redirect allowlist includes `https://abilitio-xt4n.vercel.app/auth**` for login/recovery query parameters. No email provider configuration or delivery test is claimed.

The server URL, public key, server-only service-role key and project reference have been updated in Vercel. The three public `VITE_SUPABASE_*` entries were replaced with Config values for the same project in Production and Preview after owner authorization. Production deployment `CbZ6YAaT6M4uH9Qf6TZPFzqtwS8o` from main commit `cba839e` reached Ready and received the production domain. Its published auth page and eight linked JavaScript bundles use only `https://cadbpdgljzxnbeamitnq.supabase.co` and the matching public key. No service-role text was found in those bundles. The new project’s public Auth settings and career catalog APIs returned HTTP 200, and the production assessment successfully loaded a server-generated question. Subsequent live signup API, browser login, authenticated assessment save/reload and cross-account isolation passed; see the [live audit](LIVE_AUDIT_2026_10_11.md). Email delivery remains unverified.

Keep service-role/signing keys server-only. `supabase/config.toml` identifies the selected replacement project. Future releases must apply only missing migrations; never replay fresh initialization against existing accounts/tables.

## Signup without email confirmation

At the owner's explicit request, **Confirm email is disabled** in production. The live Auth settings endpoint reports `mailer_autoconfirm: true`, `disable_signup: false` and email authentication enabled. New signups can receive a session immediately; their email ownership is not verified. Password recovery still requires working email delivery, and custom SMTP remains unconfigured.

Before this setting changed, migration `20261011180000_explicit_admin_provisioning.sql` was applied and recorded in the live migration history. It removes the historical email-based admin signup bootstrap: new accounts receive only the `user` role. Existing role assignments are preserved. Future administrator provisioning must use an owner-verified account UUID, not a claimed email address. Do not replay old founder bootstrap/backfill migrations against accounts created without email verification.

The live function definition check confirmed no admin grant remains in the signup trigger. Local `npm run check` passed 97 tests plus five export checks, lint and TypeScript. The subsequent [live audit](LIVE_AUDIT_2026_10_11.md) verified signup through the public Auth API, browser password login, authenticated assessment saving and reload. Browser signup form submission and email delivery remain unverified.

## October 12 repair release

The initialization counts above describe the original setup. Eight later repair migrations (`20261012100000` through `20261012111000`) add recorded-score constraints, trusted task writes, personal-record foreign keys, private avatar storage, invitation controls, FK indexes and RLS identity caching. The school join-attempt table adds one public app table. See [the repair ledger](PRELAUNCH_REPAIRS_2026_10_12.md) for live evidence and remaining release limits.
