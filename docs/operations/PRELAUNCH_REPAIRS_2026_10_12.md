# Prelaunch repair ledger — 12 October 2026

This follows the report-only audit. It records repair scope and verification limits; it is not a claim that Abilitio is ready for unrestricted marketing.

## Implemented repairs

| Audit ID | Change                                                                                                                     | Evidence / remaining verification                                                                                                                                                  |
| -------- | -------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A02      | Private `avatars` bucket, 5 MB limit, JPEG/PNG/WEBP allowlist; existing owner-folder policies retained                     | Migration applied in production; PGlite configuration test passed. Real upload/oversize/ownership lifecycle still needs verification.                                              |
| A03      | Database SAT 400–1600 and IELTS 0–9 in half bands; SAT input minimum 400                                                   | Migration applied in production. Boundary/rejection integration tests passed. Existing rows are not silently rewritten; constraints are NOT VALID pending review.                  |
| A04      | Task writes only through authenticated server validation; server fixes owner/timestamp; weekly count excludes future dates | Unit/integration tests passed. Deploy server before applying the write-revocation migration.                                                                                       |
| A05      | Stats and achievement ownership FKs cascade from auth users                                                                | Migration applied in production. Transactional local deletion test passed; full production account/file lifecycle is not yet verified.                                             |
| A06      | Random 122-bit invitation codes, 30-day expiry, ten join attempts/hour/account, owner-only renewal                         | Local integration tests passed. Deploy NULL-result handling before applying migration; legacy codes rotate without changing memberships.                                           |
| A08      | Canonical/OG/sitemap and result export branding use the current Vercel domain                                              | Code/build verification; production HTTP verification required after deployment.                                                                                                   |
| A09      | Labels for all 166 careers and 52 majors in RU/UZ; result field translations; localized curated ABBI responses             | Canonical coverage tests passed. English guide remains unchanged; ABBI is a rule-based guide, not an external language model. Authenticated UI verification remains pending.       |
| A11      | Framing, content-type, referrer and permissions headers; limited CSP                                                       | Vercel configuration builds. CSP does not restrict script sources; verify delivered headers after deploy.                                                                          |
| A12      | University bookmarks scoped by account/guest; ABBI account remount and old-day history removal                             | Guest bookmark reload and RU/UZ controls tested in browser. Cross-account browser check remains pending. Shared legacy bookmark data is retained but not attributed to an account. |
| A13      | Provider/region/admin-access/browser-retention disclosures corrected in all three languages                                | Code read and build. Consent workflow and legal review remain open.                                                                                                                |
| A14      | Contact-success and school-contact-success analytics events                                                                | Only emitted after HTTP success; no message/account data sent. Real delivery, attribution and analytics-provider verification remain open.                                         |
| A19      | ABBI accepts the database child age group                                                                                  | Schema and child-response test passed.                                                                                                                                             |

## Release verification

- `npm run check`: 106 application tests, five export checks, lint and TypeScript passed before the final privacy-copy update.
- `VERCEL=1 npm run build`: passed, including the privacy-copy update.
- Local university page: guest bookmark survived reload; Russian and Uzbek controls updated the page after hydration.
- Firefox-specific report: not reproduced. Connected browser inventory does not expose Firefox; exact URL was requested.
- Production Journey assets were already present before this repair batch. Dashboard second-pass artwork was not implemented by this batch.

## Still open

Email provider/domain and recovery delivery (A01), backup and restore proof (A07), language-addressable SEO (A10), consent/legal review (A13), UTM attribution/provider delivery (A14), unavailable digest (A15), performance-advisor/load work (A16), historical raw-answer reconstruction (A17), and remaining authenticated/lifecycle/security/load release checks (A18).

Historical raw answers were not stored; they cannot be reconstructed honestly. No real user is deleted merely because their name resembles an audit fixture (A20).

## Deployment order

1. Publish tested server/UI code to production.
2. Verify the new build is served.
3. Apply `20261012101000_server_task_writes.sql` and `20261012104000_school_invitation_security.sql` in the production project.
4. Verify database privileges/functions and authenticated saving. A Git push alone does not apply SQL.

Applied already: `20261012100000`, `20261012102000`, `20261012103000`. Track actual final deployment evidence here once confirmed.
