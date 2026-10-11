# Production audit — October 11, 2026

Target: https://abilitio-xt4n.vercel.app with Supabase project `cadbpdgljzxnbeamitnq`.

## Live evidence

- Created two synthetic standard-user accounts through the public signup API. Signup returned a session without email confirmation; password login succeeded. Browser login used the first account.
- Completed a 30-question assessment in the production browser. Submission saved successfully; results survived reload and contained all 166 ranked careers, six exact interest dimensions, a session nonce and scoring version `v2`.
- Saved SAT 1300 and IELTS 6.5. Verified the stored values using the account's authenticated API.
- Completed a roadmap task; completion survived browser reload and was present in its authenticated database records.
- ABBI returned a software engineering response. Finance community membership and its empty chat loaded; no messages were posted.
- Anonymous access and the second account could not read the first account's result. A fabricated result insert using the authenticated public client was rejected with HTTP 403 / `42501`. New accounts received the `user` role.
- Ordinary-user browser access to admin and principal dashboards was denied.
- University search found MIT; its browser-local bookmark survived reload. Desktop and mobile navigation and ENG/RU/UZ controls were exercised. Career comparison changed its content when selecting Design. The checked mobile comparison had no horizontal overflow or broken images.
- All 30 page routes returned HTTP 200 without missing-environment/server-error text. This checks their rendered shells, not every guarded feature. All 23 same-origin assets discovered in eight public page responses loaded successfully. Sitemap and robots returned 200; an unknown route correctly returned 404.

## Reproduced fixes

Dashboard reasoning labels and ring maximum used 10 although each attempt has nine reasoning questions. They now use nine, including history and translations. A saved IELTS band of 6.5 displayed as 7 because the animated counter rounded to whole numbers; IELTS now retains one decimal. The unavailable email-status labels now have Russian and Uzbek translations.

After these changes, `npm run check` passed lint, TypeScript, 97 Vitest tests and five export checks. `VERCEL=1 npm run build` passed using the selected project's public settings.

## Follow-up privileged checks

- Registered a clearly labelled test school in the production browser and enrolled the existing synthetic assessment account through the authenticated join RPC. The principal dashboard displayed one student, one class and one completed assessment.
- Before enrollment, the principal could not read the student result; after enrollment it could. An unrelated profile remained hidden.
- Saved a synthetic class through the principal RPC; an invalid replacement referencing an unenrolled account was rejected and the previous class remained unchanged.
- The production class-builder UI built and saved a Finance Class. An authenticated database read verified the saved class contains only the enrolled audit student.
- A dedicated temporary administrator loaded the production analytics/user-management dashboard. Browser ban and unban succeeded on the synthetic assessment account. While banned, roadmap and community-message inserts returned HTTP 403; no test message was created. Unban was verified and the temporary admin role was revoked. Existing owner roles were untouched.

## Limits and follow-up

- Custom SMTP is unconfigured. Public email delivery and password recovery are not verified. The owner registered Resend; its domain setup awaits an owned domain. See [email setup](AUTH_EMAIL_SETUP.md). Weekly digest delivery is not implemented and is labelled unavailable.
- Admin analytics/moderation and principal enrollment/read/class-saving checks above passed. Full browser enrollment form submission, automatic multi-student grouping, photo uploads, successful chat sending, and PDF/print export remain unverified.
- Some career, generated roadmap and ABBI content remains English when interface controls are Russian or Uzbek; this audit does not certify complete content localization.
- Synthetic audit accounts and their clearly identified test data are retained for repeat checks. Credentials and screenshots stay outside Git. No existing human account or result was modified.
- Browser signup form submission was not exercised: actual signup was verified through the public Auth API, followed by browser password login and assessment completion.
