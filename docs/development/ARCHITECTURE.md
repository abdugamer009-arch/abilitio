# Architecture and feature map

Abilitio is a React application built with TanStack Start. Routes render the interface; feature modules contain domain logic and server functions; Supabase supplies authentication, PostgreSQL and storage. Nitro packages the server for Vercel or standalone Node.

## Entry points

| File                    | Responsibility                                                |
| ----------------------- | ------------------------------------------------------------- |
| `src/routes/__root.tsx` | App shell, providers, global metadata and fonts               |
| `src/router.tsx`        | Router setup using the generated route tree                   |
| `src/start.ts`          | Request error handling and function authentication attachment |
| `src/server.ts`         | SSR error wrapper                                             |
| `src/routeTree.gen.ts`  | Generated route registry; never edit manually                 |
| `vite.config.ts`        | Framework wrapper, development port and Nitro target          |
| `vercel.json`           | Vercel install/build commands                                 |

## Find the right feature

Paths below are relative to the repository root.

| Feature             | UI entry                                                    | Logic and data                                                                                       |
| ------------------- | ----------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Public practice     | `src/routes/index.tsx`, `src/components/CareerWorkshop.tsx` | `src/lib/assessment/sample-questions.ts`, `src/lib/roadmap/roadmap-world.ts`                         |
| Assessment          | `src/routes/career-assessment.tsx`                          | `src/lib/assessment/career.functions.ts`, `question-bank.ts`, translations, `session.server.ts`      |
| Scoring and results | `src/routes/career-results.tsx`                             | `src/lib/assessment/career-engine.ts`, `catalog.ts`, `catalog.server.ts`, `result-storage.server.ts` |
| Dashboard           | `src/routes/dashboard.tsx`                                  | Assessment/roadmap server functions and `src/components/dashboard/`                                  |
| Roadmap             | `src/routes/roadmap.tsx`                                    | `src/lib/roadmap/tasks.functions.ts`, `useTaskJournal.ts`                                            |
| Schools             | `src/routes/school.*.tsx`                                   | `src/lib/schools/`, assessment school overview functions                                             |
| Community           | `src/routes/community.tsx`                                  | `src/lib/community/community.functions.ts`                                                           |
| Admin               | `src/routes/admin.tsx`                                      | `src/lib/admin/admin.functions.ts`                                                                   |
| ABBI                | `src/routes/abbi.tsx`, `src/components/AbbiChat.tsx`        | `src/lib/abbi/`: curated knowledge and server actions                                                |
| Universities        | `src/routes/universities.tsx`                               | Static research catalog and browser-local bookmarks                                                  |
| Authentication      | `src/routes/auth.tsx`                                       | `src/lib/auth-context.tsx`, `src/integrations/supabase/`                                             |
| Localization        | Routes and shared components                                | `src/lib/i18n.tsx`, legal/workshop/question translations                                             |

Older `/assessment`, `/iq-test` and `/results` routes coexist with the career flow. Check their actual behavior before removing them or changing links.

## Assessment data flow

```mermaid
sequenceDiagram
    participant UI as Browser
    participant FN as Server functions
    participant BANK as Banks and engine
    participant DB as Supabase
    UI->>FN: Start anonymous attempt
    FN->>BANK: Pick older 12/9/9 and child 12/0/18 variants; shuffle options
    FN-->>UI: Both localized DTOs and signed sessions in one response
    Note over UI: Chosen profile and draft stay in this tab during sign-in
    UI->>FN: Submit answers with authenticated session
    FN->>FN: Verify signature, expiry, membership and ban status
    FN->>BANK: Resolve keys and compute scores
    FN->>DB: Read paginated careers and majors
    FN->>BANK: Fill missing seed records, validate and rank
    FN->>DB: Persist server result by user and nonce
    FN-->>UI: Saved result DTO
```

The full bank and hidden answer keys stay on the server. Signed option permutations map displayed positions back to canonical answer keys. Repaired questions have versioned IDs so older signed attempts remain gradable. New results include all 166 canonical careers; historical stored rankings are not rewritten.

The assessment has its own reading layout in `src/styles/assessment.css`. Below 1024px, the frame uses dynamic viewport height and safe-area padding, with a compact header, internally scrolling question region and a persistent bottom action. VisualViewport changes resize the frame for keyboards. Choice copy has zero minimum inline size and wraps inside single-column cards; shared cognitive options use `src/components/choice-options.css`. Phone profile choices also stack so enlarged text cannot be trapped behind the primary action. Keep answer/input text at least 16px and retain native radio semantics.

Assessment/result routes bypass the editorial Lenis, ScrollTrigger and page-mask setup in MotionProvider. Question transitions use short transform/opacity motion and respect reduced motion. The existing brain component is an SVG poster, not a WebGL renderer, and is not mounted behind the assessment. The daily browser matrix lives in `scripts/mobile-qa.cjs`; Node-only fixture generation strips hidden catalog data before browser delivery. See the README for complete, random and stress checks.

The pre-test chooser stores one `{gender, ageGroup}` profile and its draft in sessionStorage, never localStorage or server demographic fields. Valid pre-feature v3 drafts are migrated from localStorage to the session: answers are preserved, the older group is selected, and gender remains required before continuing. `startProfileSessions` delivers both signed variants in the same request; the browser chooses locally. Older attempts retain 12 personality / 9 reasoning / 9 interest items. Child attempts use 12 simple personality / 18 concrete activity questions, drawn from 36 new localized items. Child matching renormalizes personality and interest contributions without a cognitive component; saved cognitive score is null, tier is `Not assessed`, and scoring version is `v4-preferences`. Submitted question membership inherently reveals which variant was used, although no demographic profile is submitted. Both remain exploratory, with no claim of validated child psychometrics.

`result-rules.ts` lists all 166 career keys with rules for each gender. The default neutral factor 1 retains opportunity and preference-based scoring; actor, teacher and dancer have grammatical wording overrides. The presentation engine supports soft downweights, exclusions and a nonempty fallback. These adjustments are browser presentation only: canonical server rankings, community assignment and school reporting remain unchanged. A session-only profile is bound to the saved result ID and account ID, preventing it from styling another person's history. Missing profiles display canonical results. Reset clears the draft and result profile; changing age confirms and starts a new attempt; changing gender retains answers. GSAP panel unsealing reuses `MOTION` and the existing motion provider, cleans up on every transition and respects reduced motion.

Scoring version `v3` represents a tied personality axis as `X`, retains its continuous letter weights at 0.5, and suppresses styles depending on that axis. Results/dashboard display Mixed preferences; a partial or fully tied type yields the neutral Exploring cognitive profile. No new numerical uncertainty cutoff or career weighting scheme is introduced. Saved `v1`/`v2` results are retained; retries return skills from the recovered row's profile.

`v5-evidence` and `v5-preferences-evidence` keep ranking separate from descriptive claims. A new categorical strength or style requires at least two supporting personality answers, a net signal of two, and no opposing answer on that axis. Conflicting answers yield a localized Mixed signals note. Improvements use the same evidence gate. Earlier rows lack retained item-level answers, so their categorical strengths/styles are hidden on presentation and labelled unverified until the student retakes the assessment. The saved record remains intact.

`catalog.server.ts` is derived from SQL seed content. Database records override matching keys and additional records remain available. Reads still surface errors, and `catalog.ts` validates the combined records before matching. Changes to canonical seed content must keep the SQL and server catalog consistent.

`result-storage.server.ts` uses the service-role client only after authentication, membership checks and server computation. A matching owner/nonce unique conflict recovers the saved result rather than creating another row. Other conflicts remain errors.

`result-interest-profile.ts` reads the persisted six-dimension profile for new results. Historical rows without it use an explicitly labelled estimate from their stored field weights. `account-load.ts` discards cancelled result requests and the route gates state by the current account. Browser storage cleanup after an acknowledged save is best effort.

## Data and authorization boundaries

- The public client uses the publishable key. Authenticated queries use user context and database RLS.
- The service-role client bypasses RLS and belongs only in trusted server functions/routes. Explicit authorization remains necessary.
- `user_roles` determines administrative access. School ownership and enrollment restrict principal visibility.
- `src/lib/db-read.ts` handles pagination and visible failures; a failed read must not resemble an empty account.
- Roadmap journals use per-account local queues and cloud reconciliation. University bookmarks and practice state are local browser data.
- `supabase/migrations/` is the schema source of truth. Generated TypeScript types alone do not prove a live schema has been migrated.

## Rendering and deployment

The Vite wrapper supplies the framework plugins; duplicating them breaks the build. `BrainScene.tsx` retains a lazy client canvas boundary with a fallback. Keep browser-only rendering code out of eager SSR imports.

Vercel uses the configured production branch and the `VERCEL=1` Nitro preset. Standalone Node uses `NITRO_PRESET=node-server`. Both need matching backend environment variables for authenticated features. Production signing requires a stable server-only secret or service-role key; development can use an ephemeral key that becomes invalid after a server restart.

## Verification map

- `tests/unit/`: scoring, question coverage, localization, catalog validation, signed sessions, retries, read helpers and school models.
- `tests/integration/migration.test.ts`: the migration chain and release repair in PGlite, including permissions and rollback behavior.
- `scripts/migration/export-source.checks.mjs`: separate Node checks for backup tooling.
- `.github/workflows/verify.yml`: `npm run check` and the standalone Node build.

See [local setup](LOCAL_SETUP.md) for commands and [owner migrations](../operations/OWNER_MIGRATIONS.md) for actual staging/production verification. Local and simulated database checks do not establish live persistence.

## October 15 audit continuation

- New matching uses the single `SCORING_WEIGHTS` config in `assessment/scoring-config.ts`: direct interests/work preferences are 70/30 for older students and 75/25 for children; visual preferences and reasoning carry no career-ranking weight. These are exploratory product rules, not validated predictive coefficients. The methodology reads that same config.
- New `career_matches` JSON entries include public selected-answer evidence. `career-evidence.ts` strips hidden mapping fields; historical rows without this evidence explicitly remain unavailable. No historical answers are reconstructed. Grading/signatures, owner/nonce retry behavior and all canonical rankings remain server-authoritative.
- Result lookup accepts an optional UUID and always filters by authenticated owner. Dashboard history opens the stored report rather than regenerating a score. Comparison warns about different question sets/difficulties/methods. Career comparison starts with three saved recommendations and the public directory; selectors exclude other selected keys.
- `ResultExports` draws local PDF pages and a local image preview with the app's loaded fonts. No private report is sent to an export service. Native sharing is attempted only after the user previews and presses Share. Raster PDF text is visually readable but is not selectable/accessibly tagged; the on-screen report remains the accessible text version.
- Community reads and assessment saves create no membership. `20261015120000_community_consent.sql` retires legacy auto-assignment RPC grants and introduces explicit consent/leave RPCs. Legacy membership rows retain NULL `consented_at`, receive a one-time review notice, and are preserved until the owner leaves. Messages are not silently deleted.
- Career roadmap task IDs are `career:<key>:p<phase>_t1`, separate from earlier track IDs. Existing marks remain saved and are not attributed to rewritten tasks. Canonical keys are known locally; extra database catalog keys are checked on the authenticated server before writes.
- Child review metadata now uses `addedBy: "age-feature"`. The chooser is tab-local; submitting question membership still necessarily reveals the selected question variant. Minimum age/parental permission remains an explicit owner/legal decision.
- School registration is gated by the owner-reviewed `SCHOOL_AGREEMENT`. Null fields are visible draft placeholders; existing school accounts remain available. Do not enable registration until scope, payer and student-permission responsibilities are approved.

The browser gate in `npm run test:all` exercises simulated accounts and network fixtures, alongside actual signed-question delivery in the profile runner and separate server/domain/database contract tests. It is not live Supabase, SMTP, native Safari or physical-device validation. Screenshots, baseline copies, local exports and test logs remain ignored by Git.

## Gated picture assessment

The approved picture flow is implemented behind server-only switches, off by default in production. It preserves the older 12/9/9 path, child 12/0/18 path, preference and interest scoring, canonical recommendations and historical results. Versioned server-only question data, safe geometry DTOs, durable owner-bound drafts and admin-only item telemetry live under `src/lib/assessment/picture-*`; illustrated UI lives under `src/components/assessment/`. Apply `20261017120000_picture_assessment.sql` before signed-in pilot use. See [the implementation and pilot protocol](PICTURE_ASSESSMENT.md) for compatibility, exact rollout gates, verification commands and live-evidence boundaries.

## October 21 performance follow-up

Dashboard history uses bounded metadata/three-career projections and an exact owner-scoped count; full result evidence loads only in the full report. Draft writes coalesce pending snapshots while retaining immediate local recovery and server revision/nonce checks. Static public page HTML alone opts into CDN caching. See [the performance implementation record](../operations/SITE_PERFORMANCE_2026_10_21.md) for request deadlines, route rendering and evidence boundaries.
