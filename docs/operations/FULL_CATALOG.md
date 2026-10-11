# Full assessment catalog

New attempts select 30 questions from all 561 catalog items: 12 of 280 personality statements, 9 of 260 reasoning questions, and 9 of 21 interest questions. Personality selection retains three statements per axis; interest selection retains theme variety. Questions and reasoning/interest answer positions are shuffled. Repeats across different attempts remain possible; this is random selection, not a guaranteed no-repeat rotation.

The previously excluded 209 reasoning questions now have Russian and Uzbek instructions and options. English wordplay retains its English stimulus with localized instructions. Twenty-one defective or incomplete reasoning items have corrected versions. Already-issued signed attempts can still use their original IDs and answer keys. This is not a professional validation of the assessment bank.

Answer permutations are included in the signed server session. The server maps submitted positions back to the appropriate correct answer. Correct answer keys and the full question bank are not sent to the browser.

New results compare and retain all 166 canonical career profiles. A server catalog derived from the existing SQL seeds fills missing database seed records while retaining database overrides and additional career records. All canonical careers have a study-major link. Results initially show the top 15, with search across all matches and a Show all careers control. Historical results that saved only 15 matches retain their original data; complete a new assessment for the full ranking.

## Verification

- 88 Vitest tests pass in the combined main verification suite. A seeded coverage test runs 1,000 attempts and reaches every one of the 561 items, verifies 30 distinct IDs per attempt, personality balance, all 24 reasoning option permutations, signed shuffled scoring, and preserved interest-option membership.
- Catalog tests verify all 166 ranked careers, finite sorted scores, study-major links, database overrides, and missing-seed completion.
- Five separate migration-export checks pass using `node --test scripts/migration/export-source.checks.mjs`.
- TypeScript, lint and the Vercel production build pass.
- A real local browser attempt displays a newly eligible reasoning question in English, Russian and Uzbek; switching languages preserves the shuffled option order.

## Production dependency

These changes preserve authentication and result storage. The fresh Supabase project `cadbpdgljzxnbeamitnq` has all repository migrations, including `session_nonce`, `scoring_version` and `riasec_profile`. Live SQL persistence and access checks passed; browser signup and authenticated save/reload remain unverified. See [the current setup record](SUPABASE_SETUP.md). The old project was retained and its accounts/results were not transferred. Nhost transfer was abandoned; backup preparation tooling remains available.
