# Contributing to Abilitio

Start with [README.md](README.md) and the [architecture map](docs/development/ARCHITECTURE.md). This is a TanStack Start application with a Supabase backend; both interface behavior and database contracts matter.

## Make a change

1. Fetch the current remote state and check the working tree. Preserve unrelated local work.
2. Create a descriptive branch from current `main`, such as `codex/assessment-copy` or `fix/result-retry`.
3. Read the relevant route, feature module and tests before editing. Keep changes focused on the requested behavior.
4. Update documentation if setup, schema, permissions or user-visible behavior changes.
5. Run appropriate checks, review the diff, then commit with a concrete description.

Use small commits that explain an outcome: `Fix shuffled reasoning answer grading` is more useful than `updates`. Do not rewrite shared history or force-push `main`. A pull request should explain the problem, resulting behavior, verification and remaining limits; use the repository template.

## Put files where they belong

| Change                                 | Location                                                                        |
| -------------------------------------- | ------------------------------------------------------------------------------- |
| Page or URL                            | `src/routes/` using TanStack naming; see [routing](docs/development/ROUTING.md) |
| Shared interface                       | `src/components/`; dashboard-specific UI in `src/components/dashboard/`         |
| Domain logic or server action          | The matching feature directory under `src/lib/`                                 |
| Database integration                   | `src/integrations/supabase/`                                                    |
| Pure logic or mocked-contract test     | `tests/unit/`                                                                   |
| SQL integration test                   | `tests/integration/`                                                            |
| Schema change                          | A new ordered file in `supabase/migrations/`                                    |
| Development guidance                   | `docs/development/`                                                             |
| Release procedure or incident evidence | `docs/operations/`                                                              |
| Design history                         | `docs/design/`                                                                  |

Keep generated output, browser captures, private exports and credentials outside Git. Do not relocate root tooling configuration merely to reduce the root file count.

## Verification

```sh
npm ci --legacy-peer-deps
npm run check
NITRO_PRESET=node-server npm run build
```

Use `VERCEL=1 npm run build` for deployment-output changes. For UI work, check the affected desktop/mobile flow and English, Russian and Uzbek where relevant. Use authorized disposable staging accounts for authenticated work and distinguish those checks from mocked/local tests.

Add meaningful coverage for scoring, shuffling, persistence, authorization, migration effects and error recovery when those behaviors change. Do not add tests that simply repeat trivial display copy.

## Guardrails

- Let the router generate `src/routeTree.gen.ts`; never hand-edit it.
- The Vite wrapper supplies the framework plugins. Do not add duplicate React, TanStack, Tailwind or Nitro plugins.
- Retain the lazy browser-only canvas boundary in `BrainScene.tsx`.
- Keep scored writes server-authoritative; preserve signed question/option membership and idempotent retries.
- Keep service-role and signing secrets on the server. Public/server settings must target the same project.
- Preserve existing results and their scoring version. Version changed question IDs when an issued signed attempt could still reference the old item.
- Report database read failures; do not turn them into apparently empty user histories.
- Preserve the migration chain. Apply missing migrations in order, with the release guide's stated exceptions.

Pushing or deploying code does not repair a database. Follow [OWNER_MIGRATIONS.md](docs/operations/OWNER_MIGRATIONS.md) for owner-run setup and live verification.
