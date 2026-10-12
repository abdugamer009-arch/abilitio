# Local setup and verification

## Public-only development

Use Node.js 22+ and the npm lockfile. The legacy-peer flag matches the repository's Vercel and CI install commands.

```sh
npm ci --legacy-peer-deps
npm run dev
```

The default URL is `http://localhost:8080`. Use `npm run dev -- --port 8085` when the default port is occupied. Public pages and guest assessment questions work without a configured backend; saving a result needs authentication and the required schema.

## Connect a backend

Copy `.env.example` to `.env` and replace placeholders with values for the intended project. `.env` is ignored by Git. Do not paste secrets into documentation, logs or screenshots.

| Variables                                              | Scope and purpose                                                          |
| ------------------------------------------------------ | -------------------------------------------------------------------------- |
| `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`   | Public browser connection                                                  |
| `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`             | Server/authenticated connection to the same project                        |
| `SUPABASE_SERVICE_ROLE_KEY`                            | Server-only result persistence and trusted operations; bypasses RLS        |
| `ASSESSMENT_SIGNING_SECRET`                            | Stable server-only signed-attempt key; otherwise uses the service-role key |
| `VITE_PLAUSIBLE_DOMAIN`, optional `VITE_PLAUSIBLE_SRC` | Optional analytics; leave unset to disable it                              |

The template also carries public project-ID settings. Every public/server URL and key must belong to the intended project. Restart the development server after environment changes. Browser variables are bundled at build time; a production change requires a rebuild.

Before relying on authenticated results, apply the appropriate schema to an authorized staging backend following [OWNER_MIGRATIONS.md](../operations/OWNER_MIGRATIONS.md). Supabase confirmation/recovery URLs must allow the app origin. Never substitute a publishable key for the service-role key or remove nonce checks to bypass missing SQL.

## Commands

| Command                    | Purpose                                              |
| -------------------------- | ---------------------------------------------------- |
| `npm run dev`              | Vite/TanStack development server                     |
| `npm run lint`             | ESLint, including source formatting rules            |
| `npm run typecheck`        | TypeScript for source, tests and build configuration |
| `npm test`                 | All Vitest tests                                     |
| `npm run test:unit`        | Unit and mocked-contract tests                       |
| `npm run test:integration` | PGlite database integration checks                   |
| `npm run test:export`      | Node checks for source-backup tooling                |
| `npm run check`            | Lint, types, all Vitest tests and export checks      |
| `npm run test:watch`       | Interactive Vitest run                               |
| `npm run format`           | Format the repository; review the resulting diff     |

PGlite runs locally without a hosted Supabase account. It simulates provider-owned schemas; it does not verify the deployed database or real emails.

## Build targets

```sh
# Standalone Node: same target used by CI
NITRO_PRESET=node-server npm run build
PORT=8090 node .output/server/index.mjs

# Vercel output: same target selected on Vercel
VERCEL=1 npm run build
```

Generated build directories are ignored. Use the configured Vercel deployment for production; building locally does not publish it or apply database migrations.

## Common failures

| Symptom                                                            | Check                                                                         |
| ------------------------------------------------------------------ | ----------------------------------------------------------------------------- |
| Public pages work, account features fail                           | Backend variables, same-project keys, authentication and owner-run migrations |
| Result insert reports missing `session_nonce` or `scoring_version` | Active database migration state; see the owner guide                          |
| Attempt becomes invalid after a dev restart                        | Ephemeral development signing key changed; begin a new attempt                |
| Build fails after adding plugins                                   | Wrapper already provides TanStack, React, Tailwind and Nitro plugins          |
| UI shows no account data after an API failure                      | Retain the visible error; do not hide it as an empty history                  |

Verify real saved results with disposable staging accounts: finish, save, reload, sign out/in, retry, and check that another user cannot read the row. Report these separately from local tests.

## Password recovery availability

`VITE_PASSWORD_RECOVERY_ENABLED` defaults to false. Configure SMTP, verify signup/recovery redirects and test delivery to an ordinary public user before enabling it and rebuilding. This flag only controls the recovery request interface; it does not disable sign-in, signup or processing a valid recovery link. See the prelaunch repair ledger for remaining email and release checks.
