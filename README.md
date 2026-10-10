# Abilitio

Career exploration for students and schools, built with React 19, TanStack Start, TypeScript and Supabase. The current interface uses illustrated SVG scenes, Tailwind, GSAP and Lenis. Assessment scores and suggestions are exploratory, not clinical or admission predictions.

## Development

Use Node 22 or later and the npm lockfile:

```sh
npm ci --legacy-peer-deps
npm run dev
```

Open http://localhost:8080. Copy `.env.example` to `.env` to configure Supabase. Public pages and anonymous assessment questions work without account credentials; saving results requires authentication and the owner-run schema migration.

```sh
npm run lint
npx tsc --noEmit
npm test
NITRO_PRESET=node-server npm run build
PORT=8090 node .output/server/index.mjs
```

Vercel uses `vercel.json` and the `VERCEL=1` Nitro preset. Keep `SUPABASE_SERVICE_ROLE_KEY` and `ASSESSMENT_SIGNING_SECRET` server-only. Production requires a stable signing key or the service-role key; ephemeral development signing keys expire after a server restart. The active app and service-role credentials must reference the same Supabase project.

## Release and database handoff

See [OWNER_MIGRATIONS.md](OWNER_MIGRATIONS.md) before enabling result saves, moderation or class generation. The repository contains migrations; pushing code does not apply them to Supabase. New installations require the entire migration chain. Existing projects need the unapplied migrations, with the release repair providing repeatable result-storage and task-journal setup.

Assessments select 12 personality, nine reasoning and nine interest questions. Reasoning is displayed as correct answers out of nine. New results use scoring version `v2`; historical scores are preserved as `v1`. Signed attempts expire after 24 hours and repeated submission returns the original result.

Admin access comes from `user_roles`, matching database policies and community badges. Provision additional administrators in the database; the previous `ADMIN_EMAILS` application allowlist is no longer used.

## Behavior and limits

- Account loaders surface failed reads instead of treating them as empty histories. Admin/catalog/school reads retrieve every page; community history uses a cursor.
- Roadmap task journals use per-account local queues and cloud storage, with retry and online reconciliation. University research bookmarks persist on this browser.
- ABBI is a curated English-language guide. Localized notices explain its language limitation. Match scores describe exploratory fit, not success probability.
- Weekly digest delivery is unavailable until an email integration is implemented. No enabled switch promises delivery.
- Fonts currently load through Google Fonts. Supabase recovery and confirmation URLs must allow the deployed origin.

GitHub Actions runs lint, TypeScript, unit/database migration tests and the Node build. Local migration tests simulate Supabase-owned schemas with PGlite; they do not establish production schema state, real email delivery or live multi-account behavior.
