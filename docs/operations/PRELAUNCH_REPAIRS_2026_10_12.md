# Prelaunch repair ledger — 12 October 2026

This follows the report-only audit. It records repair scope and verification limits; it is not a claim that Abilitio is ready for unrestricted marketing.

## Implemented repairs

| Audit ID | Change                                                                                                                              | Evidence / remaining verification                                                                                                                                                                                                 |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A02      | Private `avatars` bucket, 5 MB limit, JPEG/PNG/WEBP allowlist; existing owner-folder policies retained                              | Migration applied in production; PGlite configuration test passed. Real upload/oversize/ownership lifecycle still needs verification.                                                                                             |
| A03      | Database SAT 400–1600 and IELTS 0–9 in half bands; SAT input minimum 400                                                            | Migration applied in production. Boundary/rejection integration tests passed. Existing rows are not silently rewritten; a follow-up live integrity query found zero invalid scores, and both constraints are now fully validated. |
| A04      | Task writes only through authenticated server validation; server fixes owner/timestamp; weekly count excludes future dates          | Unit/integration tests passed. Deploy server before applying the write-revocation migration.                                                                                                                                      |
| A05      | Stats and achievement ownership FKs cascade from auth users                                                                         | Migration applied in production. Transactional local deletion test passed; full production account/file lifecycle is not yet verified.                                                                                            |
| A06      | Random 122-bit invitation codes, 30-day expiry, ten join attempts/hour/account, owner-only renewal                                  | Local integration tests passed. Deploy NULL-result handling before applying migration; legacy codes rotate without changing memberships.                                                                                          |
| A08      | Canonical/OG/sitemap and result export branding use the current Vercel domain                                                       | Code/build verification; production HTTP verification required after deployment.                                                                                                                                                  |
| A09      | Labels for all 166 careers and 52 majors in RU/UZ; result field translations; localized curated ABBI responses                      | Canonical coverage tests passed. English guide remains unchanged; ABBI is a rule-based guide, not an external language model. Authenticated UI verification remains pending.                                                      |
| A11      | Framing, content-type, referrer and permissions headers; limited CSP                                                                | Vercel configuration builds. CSP does not restrict script sources; verify delivered headers after deploy.                                                                                                                         |
| A12      | University bookmarks scoped by account/guest; ABBI account remount, old-day history removal and UTC-midnight reset for an open chat | Guest bookmark reload and RU/UZ controls tested in browser. Cross-account browser check remains pending. Shared legacy bookmark data is retained but not attributed to an account.                                                |
| A13      | Provider/region/admin-access/browser-retention disclosures corrected in all three languages                                         | Code read and build. Consent workflow and legal review remain open.                                                                                                                                                               |
| A14      | Contact-success and school-contact-success analytics events                                                                         | Only emitted after HTTP success; no message/account data sent. Real delivery, attribution and analytics-provider verification remain open.                                                                                        |
| A19      | ABBI accepts the database child age group                                                                                           | Schema and child-response test passed.                                                                                                                                                                                            |

## Release verification

- `npm run check`: 108 application tests, five export checks, lint and TypeScript passed including the privacy copy and recovery availability guard.
- `VERCEL=1 npm run build`: passed, including the privacy-copy update.
- Local university page: guest bookmark survived reload; Russian and Uzbek controls updated the page after hydration.
- Firefox-specific report: not reproduced. Connected browser inventory does not expose Firefox; exact URL was requested.
- Production Journey assets were already present before this repair batch. Dashboard second-pass artwork was not implemented by this batch.

## Production verification

- Commit `065baf2d2b3a13e0af6d45e019215599e5ac1b77`: Vercel reported success; production HTTP delivered the CSP, framing, referrer and permissions headers.
- All seven 20261012 migrations applied. Live SELECT confirmed authenticated task INSERT/UPDATE privileges are false, avatar bucket is private with a 5,242,880-byte limit and three MIME types, and all seven FK indexes exist.
- Existing temporary test account was supplied by the user; no account was created in this repair batch.
- SAT 100 failed browser validity. SAT 1600 / IELTS 9 saved and survived reload; both were restored to blank afterward.
- Russian ABBI prompt returned Russian guidance through the authenticated server function.
- A synthetic 30-question assessment saved: result `2eec7fd7-6173-425c-8788-e8bef8aacc67`, reasoning 5/9, all 166 career entries confirmed by live SELECT. This is synthetic test data, not the user's assessment.
- Task `default:p1_t1` saved true, survived reload, and was confirmed by live SELECT with a server timestamp.
- The user explicitly chose to keep the test records. The synthetic assessment, task, 1-pixel avatar and test ABBI conversation are retained. No account was created or deleted.

- PNG avatar uploaded to the private bucket, rendered, and reloaded successfully (natural width 1, fixture image).
- Journey had no page overflow at 1440, 1024, 768 or 390px. Mobile dark theme and RU/UZ controls tested in the connected Chromium browser; Firefox remains unverified.
- Existing data integrity SELECT returned zero invalid scores, zero stats orphans and zero achievement orphans. Both score constraints validated successfully.
- Anonymous direct task POST returned HTTP 401 / PostgreSQL 42501 (permission denied), using only the public key.
- Public email recovery defaults unavailable until `VITE_PASSWORD_RECOVERY_ENABLED=true`. Enable only after SMTP and delivery to public users are verified; signup remains available.

## Still open

Email provider/domain and recovery delivery (A01), backup and restore proof (A07), language-addressable SEO (A10), consent/legal review (A13), UTM attribution/provider delivery (A14), unavailable digest (A15), remaining performance-policy/load work (A16; seven missing FK indexes repaired), historical raw-answer reconstruction (A17), and remaining authenticated/lifecycle/security/load release checks (A18).

Historical raw answers were not stored; they cannot be reconstructed honestly. No real user is deleted merely because their name resembles an audit fixture (A20).

## Final verification additions

- Follow-up `c15f046` deployment reported success. The results date/export labels are localized and public recovery requests are gated by verified availability.
- Open-chat UTC midnight behavior and the fifty-message cap are tested by `tests/unit/abbi-history.test.ts`; no claim of a real browser waiting across midnight is made.

## Deployment order

1. Publish tested server/UI code to production.
2. Verify the new build is served.
3. Apply `20261012101000_server_task_writes.sql` and `20261012104000_school_invitation_security.sql` in the production project.
4. Verify database privileges/functions and authenticated saving. A Git push alone does not apply SQL.

Applied: `20261012100000`, `20261012101000`, `20261012102000`, `20261012103000`, `20261012104000`, `20261012105000`, `20261012106000`.

## Changed files

- [.env.example](../../.env.example)
- [docs/README.md](../../docs/README.md)
- [docs/development/LOCAL_SETUP.md](../../docs/development/LOCAL_SETUP.md)
- [docs/operations/AUTH_EMAIL_SETUP.md](../../docs/operations/AUTH_EMAIL_SETUP.md)
- [docs/operations/PRELAUNCH_REPAIRS_2026_10_12.md](../../docs/operations/PRELAUNCH_REPAIRS_2026_10_12.md)
- [public/robots.txt](../../public/robots.txt)
- [src/components/AbbiChat.tsx](../../src/components/AbbiChat.tsx)
- [src/integrations/supabase/types.ts](../../src/integrations/supabase/types.ts)
- [src/lib/abbi/abbi.functions.ts](../../src/lib/abbi/abbi.functions.ts)
- [src/lib/abbi/history.ts](../../src/lib/abbi/history.ts)
- [src/lib/abbi/localized-guide.ts](../../src/lib/abbi/localized-guide.ts)
- [src/lib/abbi/message-schema.ts](../../src/lib/abbi/message-schema.ts)
- [src/lib/analytics.ts](../../src/lib/analytics.ts)
- [src/lib/assessment/growth.functions.ts](../../src/lib/assessment/growth.functions.ts)
- [src/lib/assessment/utc-week.ts](../../src/lib/assessment/utc-week.ts)
- [src/lib/catalog-labels.ts](../../src/lib/catalog-labels.ts)
- [src/lib/constants.ts](../../src/lib/constants.ts)
- [src/lib/i18n.tsx](../../src/lib/i18n.tsx)
- [src/lib/legal-translations.ts](../../src/lib/legal-translations.ts)
- [src/lib/roadmap/tasks.functions.ts](../../src/lib/roadmap/tasks.functions.ts)
- [src/lib/schools/schools.functions.ts](../../src/lib/schools/schools.functions.ts)
- [src/lib/ui-text.ts](../../src/lib/ui-text.ts)
- [src/routes/auth.tsx](../../src/routes/auth.tsx)
- [src/routes/career-results.tsx](../../src/routes/career-results.tsx)
- [src/routes/contact.tsx](../../src/routes/contact.tsx)
- [src/routes/dashboard.tsx](../../src/routes/dashboard.tsx)
- [src/routes/privacy.tsx](../../src/routes/privacy.tsx)
- [src/routes/school.dashboard.tsx](../../src/routes/school.dashboard.tsx)
- [src/routes/universities.tsx](../../src/routes/universities.tsx)
- [supabase/migrations/20261012100000_recorded_score_ranges.sql](../../supabase/migrations/20261012100000_recorded_score_ranges.sql)
- [supabase/migrations/20261012101000_server_task_writes.sql](../../supabase/migrations/20261012101000_server_task_writes.sql)
- [supabase/migrations/20261012102000_personal_record_ownership.sql](../../supabase/migrations/20261012102000_personal_record_ownership.sql)
- [supabase/migrations/20261012103000_avatar_bucket.sql](../../supabase/migrations/20261012103000_avatar_bucket.sql)
- [supabase/migrations/20261012104000_school_invitation_security.sql](../../supabase/migrations/20261012104000_school_invitation_security.sql)
- [supabase/migrations/20261012105000_foreign_key_indexes.sql](../../supabase/migrations/20261012105000_foreign_key_indexes.sql)
- [supabase/migrations/20261012106000_validate_recorded_scores.sql](../../supabase/migrations/20261012106000_validate_recorded_scores.sql)
- [tests/integration/migration.test.ts](../../tests/integration/migration.test.ts)
- [tests/unit/abbi-age.test.ts](../../tests/unit/abbi-age.test.ts)
- [tests/unit/abbi-history.test.ts](../../tests/unit/abbi-history.test.ts)
- [tests/unit/catalog-localization.test.ts](../../tests/unit/catalog-localization.test.ts)
- [tests/unit/utc-week.test.ts](../../tests/unit/utc-week.test.ts)
- [vercel.json](../../vercel.json)
