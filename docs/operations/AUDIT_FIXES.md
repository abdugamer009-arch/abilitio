# October 11 audit fixes

| Reproduced problem                                                                    | Implemented repair                                                                                              |
| ------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| A delayed result from account A overwrote account B's results.                        | Cancel obsolete requests and gate rendered state by its account owner.                                          |
| Reasoning question `iq135` counted five primes between 10 and 30.                     | New `iq135_v2` grades six; the original signed key remains available for unexpired attempts.                    |
| Reconstructing RIASEC from projected field weights could change the primary interest. | Persist the exact six scores and use them on submission and reload. Historical rows retain a labelled estimate. |
| Blocked/full browser storage turned an acknowledged save into an error.               | Isolate optional storage writes and cleanup from successful navigation.                                         |
| Two owned schools caused singular career queries to fail.                             | Share deterministic latest-owned-school selection across principal tools.                                       |

Validation: 95 Vitest tests, five export checks, lint and TypeScript checks. Regression tests cover delayed successes/errors, storage denial, grading, exact-profile round trips, and multiple-school query behavior. PGlite checks exercise the migration chain, repeatability, historical null profiles and per-account visibility.

Apply the migrations in [the owner handoff](OWNER_MIGRATIONS.md) before validating production persistence. The new exact-profile column is not applied by a Git push. Authenticated browser flows and production database writes remain unverified without owner access.
