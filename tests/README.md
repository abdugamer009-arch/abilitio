# Test layout

Run `npm test` for the whole Vitest suite. `npm run check` also runs lint,
TypeScript and the separate backup-export checks used by CI.

| Folder         | Scope                                                                                                     | Command                    |
| -------------- | --------------------------------------------------------------------------------------------------------- | -------------------------- |
| `unit/`        | Scoring, localization, question coverage, signed sessions, catalogs and mocked persistence/read contracts | `npm run test:unit`        |
| `integration/` | SQL migration chain, RLS permissions and rollback behavior in PGlite                                      | `npm run test:integration` |

Import application code with the `@/` alias. Both TypeScript and Vitest resolve
it to `src/`. Test files are included in TypeScript checking.

Integration tests simulate Supabase-owned schemas locally; they do not connect
to production. Live persistence and email checks require authorized disposable
staging accounts, as described in the owner migration guide.

Backup tooling has a separate Node runner:
`scripts/migration/export-source.checks.mjs` via `npm run test:export`.
Keep it outside Vitest's `*.test.*` discovery pattern.
