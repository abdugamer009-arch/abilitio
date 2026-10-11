# Abilitio repository guidance

## Orientation

This file applies to this repository. Read `README.md`, `docs/development/ARCHITECTURE.md` and relevant feature files before modifying unfamiliar behavior. The user's current request defines scope and authorization; do not impose an extra approval step for ordinary reversible work.

Before Git operations, inspect the working tree, branch and remote. Preserve unrelated changes. Use `codex/` for new agent branches unless the user specifies otherwise. Never force-push shared history. When asked to publish to `main`, combine current remote changes, resolve conflicts deliberately, verify, and push without dropping other contributors' work.

## Where things live

- `src/routes/`: TanStack Start file-based routes; `__root.tsx` is the application shell.
- `src/lib/assessment/`: question banks, translations, signed sessions, server grading, catalog validation and result persistence.
- Other `src/lib/` feature directories: schools, community, roadmap, admin and ABBI logic.
- `src/integrations/supabase/`: public/authenticated clients, service-role server client and database types.
- `tests/unit/`: domain and mocked-contract tests. `tests/integration/`: PGlite database checks.
- `docs/README.md`: documentation index. Operational requirements are in `docs/operations/`.
- `supabase/migrations/`: ordered schema history. `scripts/migration/`: backup preparation, not a completed Nhost adapter.

## Invariants

1. Do not manually edit `src/routeTree.gen.ts`. The router generates it.
2. Do not duplicate plugins delegated by `@lovable.dev/vite-tanstack-config`. Read `vite.config.ts` before build changes.
3. Retain the lazy client canvas boundary. Do not eagerly SSR-import browser-only rendering code.
4. Questions and grading are server-authoritative. Client responses must never include correct answers or hidden scoring weights. Sign option order, validate submission membership and preserve owner/nonce retry idempotency.
5. Current catalog: 280 personality, 260 reasoning, 21 interest questions; 30 per attempt (12/9/9). All 166 canonical careers are retained in new rankings. Update tests and documentation deliberately if scope changes.
6. Localization must keep prompts and options aligned in ENG/RU/UZ. Use versioned IDs for repaired questions so unexpired older sessions remain gradable.
7. Validate database catalogs and surface failed reads. Preserve user overrides, extra catalog records and historical results.
8. Service-role and signing keys stay server-only. Never put them in `VITE_*`, client modules, screenshots, logs or Git. Match public/server credentials to the intended project.
9. Role checks and RLS must agree. Do not restore the retired admin email allowlist or bypass result storage to hide a schema error.
10. Keep builds, verification screenshots, private exports and credentials out of Git. Root configuration stays where its tools expect it.

## Verification and reporting

Use `npm run check` for lint, TypeScript, Vitest and export checks. Run `NITRO_PRESET=node-server npm run build` for a Node build or `VERCEL=1 npm run build` for Vercel changes. Run checks appropriate to the diff; documentation-only changes need formatting and link/path verification, not new behavior tests.

For UI changes, verify the affected desktop/mobile flow and relevant languages. Never present mocked accounts or PGlite as live database validation. Update developer or operations guides when conventions or release requirements change.

Production uses Supabase unless current verified evidence establishes a completed cutover. The owner migration guide records schema requirements. Code pushes do not apply SQL. State clearly whether repairs, live authenticated saving, provider transfer or email delivery were actually performed; do not infer success from a passing build.
