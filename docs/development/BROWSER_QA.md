# Browser QA and release evidence

The dated [QA ledger](../../QA.md) records the current audit, inventory IDs, defects, evidence and unresolved release gates. A passed fixture run is not proof of a live account save, storage policy, email delivery or AI-provider response.

## Commands

Install the existing Playwright browsers once with `npx playwright install chromium firefox`. No new application package is required.

- `npm run test:e2e`: start a private local Vite server and run public, account-fixture, founder-fixture, keyboard, accessibility and localized browser regressions. Run legacy mode, then a separate fresh server in picture mode. The runner uses public placeholders, deletes the service-role environment variable, creates a temporary local signing secret and never writes production.
- `npm run test:e2e -- --local --picture-only`: picture assessment, SSR loading, public controls and founder-statistics fixture subset.
- `QA_ORIGIN=https://abilitio-xt4n.vercel.app npm run test:e2e -- --guest-live`: real guest-only production route reads, without fixture accounts or mutations. This does not run authenticated flows. Load failures are failures; a stop on repeated timeouts leaves the remaining cases explicitly untested.
- `npm run test:e2e -- --release`: local suite plus an explicit blocked release gate. It intentionally exits nonzero while live account/provider/security/performance evidence is unavailable. It never deploys automatically.
- `node scripts/qa-inventory.mjs --json-only`: regenerate machine-readable source inventory without overwriting the reviewed `QA.md`. Omitting the option rebuilds the initial inventory document; do that only when deliberately restarting the ledger.

The legacy phase exercises real signed local guest sessions as well as deterministic UI fixtures. Picture-mode attempts use real local signed questions with intercepted auth/draft/result transports. Fixture accounts are not Supabase users. Standard `npm run check` independently runs domain, validation and PGlite permission contracts.

Fresh Vite compilation is allowed up to 120 seconds for the initial smoke navigation, controlled by `QA_SMOKE_NAVIGATION_TIMEOUT_MS` in the isolated runner. This setup allowance is not a production latency target. Timeout evidence includes pending requests. Keep production performance measurements separate and run them without concurrent builds/tests.

## Evidence and cleanup

Receipts, logs, screenshots, generated fixture bundles and metadata captures go in ignored `artifacts/full-qa/`, `artifacts/qa/`, `artifacts/profile-feature/` and `artifacts/picture-assessment-qa/`. Do not commit private evidence, accounts, keys or built output. The runner closes its own server and browser resources. It does not create or delete real accounts.

For live authenticated testing, first select an isolated authorized project/branch, arrange disposable student/founder accounts and a cleanup capability, and record an account/row/file ledger. Do not use a real user's logged-in session as a shortcut. Any schema or RLS repair must be a migration tested on a Supabase branch before production. SQL pushes and application code pushes are separate operations.

Release requires all requested live persistence/isolation/provider checks, performance targets, lint/type/unit checks and a production build to pass. Pushing main triggers deployment. Record any explicit owner decision to release a verified repair batch while the wider audit remains incomplete; do not present that release as full launch certification. After deployment, rerun live tests, and follow the owner's revert/redeploy requirement if they fail. Never turn local PASS into a fully-tested production claim.
