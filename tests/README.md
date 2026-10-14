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

`node scripts/verify-profile-flow.cjs` checks all four age/gender combinations at
1440px and 390px against the running development server. Install Playwright or
set `PLAYWRIGHT_MODULE` to an available package path; optionally set `BROWSER_EXE`
to an installed Chrome executable and `QA_ORIGIN` to another local port. It uses
real signed question delivery, keyboard/touch input and reduced motion; only the
account and saved result DTO are mocked. It tests resume, confirmed/cancelled age
changes, gender edits, reshuffling, resets, no leaked answer keys and console
errors. Screenshots and its JSON report go in ignored `artifacts/profile-feature`.
This does not establish live authenticated persistence.

`npm run test:mobile` runs complete longest-text and random attempts plus stress
cases on all nine requested mobile/tablet profiles plus desktop, in EN/RU/UZ
and both age groups. `npm run test:mobile:stress` repeats just the stress phase
with enlarged text,
zoom reflow, rotation, keyboard-sized viewports, 3G and CPU throttling.
The reports name overflowing/clipped elements, measure CLS and frame timing,
and retain screenshots in ignored `mobile-report/`. Language suites run in
independent browsers against one shared development server. See README for
focused pre-commit checks, browser setup and CI artifact upload.
