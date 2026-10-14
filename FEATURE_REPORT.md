# Age and gender feature report

Implemented on 14 October 2026. The plan was written before source edits: [FEATURE_PLAN.md](FEATURE_PLAN.md).

## Behavior and privacy

The chooser requires both selections, uses native accessible radios, and has distinct selected cards, check marks and keyboard focus. Start reuses the existing workshop panel unsealing, motion timings and easing. Reduced motion is respected. Profile editing retains answers when gender changes; age changes require confirmation and a fresh shuffled attempt. Refresh offers the chooser and Continue; Retake clears choices. Valid pre-feature v3 drafts migrate to session storage with answers intact and a required gender choice. Double starts and automatic advance timers are guarded and cleaned up.

One profile object has `gender: male | female` and `ageGroup: child | teen_adult`. Profile/drafts stay in memory/sessionStorage; no demographic field is sent to server functions, analytics or persisted to accounts. Both signed question variants are fetched identically. Submitted question membership necessarily identifies the question variant. This is minimal collection, not a promise that the variant cannot be inferred from answers.

Older flow retains all 561 existing questions, 30-item attempts (12 personality / 9 reasoning / 9 interest), existing scoring and all 166 career matches. Children draw 12 balanced personality statements and 18 concrete activity preferences from 36 new items, with no maths, abstract reasoning or ability test. Fisher–Yates preserves personality axis balance and interest-theme coverage. Load validation warns below required section coverage; empty pools fail recoverably.

Child matching renormalizes personality/interest contributions (40:25) without cognition; saved cognitive score is null, tier is Not assessed, scoring version is v4-preferences. Child results use friendly examples and omit ability scores, type labels and adult strengths/improvement tiles. The content is exploratory; the coverage minimum is not psychometric validation.

## Files and data fields

| Files                                                                   | Change                                                                            |
| ----------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| `src/components/AssessmentProfileChooser.tsx`                           | Native radio cards, focus and selected states, EN/RU/UZ copy                      |
| `src/lib/assessment/child-questions.ts`, `question-translations.ts`     | New question content and aligned translations/options                             |
| `career-assessment.ts`, `question-bank.ts`                              | Age metadata, pool validation, balanced age selection, hidden interest resolution |
| `career.functions.ts`, `session.server.ts`, `career-engine.ts`          | Dual signed delivery, variable signed section validation, preference-only scoring |
| `attempt-profile.ts`, `result-rules.ts`                                 | Session-only profile/result binding, storage fallback, reset and rules engine     |
| `src/routes/career-assessment.tsx`, `career-results.tsx`                | Chooser/resume/change/restart integration and age/gender presentation             |
| `tests/unit/profile-feature.test.ts`, `scripts/verify-profile-flow.cjs` | Domain and Playwright checks                                                      |
| `docs/development/ARCHITECTURE.md`, `tests/README.md`, this report      | Behavior and verification documentation                                           |

Question fields: `ageGroups` and optional `addedBy: feature-age`. Every existing question is conservatively older-only; every new child question is explicitly tagged. No schema migration is needed; existing nullable cognitive columns and text scoring version support this variant. Routes, lazy brain boundary, WebGL, original animations and canonical saved rankings are retained.

## Editing result rules

`src/lib/assessment/result-rules.ts` lists all 166 career keys and both gender rules. Defaults use neutral soft weight factor 1, with grammatical wording overrides for actor (EN/RU/UZ), teacher and dancer (RU). No hard exclusions or arbitrary gender-based ability assumptions are enabled.

For example change `software_engineer: normal()` to:

`software_engineer: { male: { action: "normal" }, female: { action: "weight", factor: 0.9 } }`

Supported actions: normal, weight (factor 0..1), exclude, wording (labels by language). A gender can be switched to `{ action: "exclude" }` in one line. The engine applies the chosen rule after scoring, re-ranks and keeps a valid fallback even when all candidates are excluded or missing. Scores in the saved result are not mutated. These are session presentation rules; canonical community assignment, school analytics and other historical views remain based on server rankings. The profile is bound to both result ID and account ID. Without it, historical results use canonical wording.

## Verification

- Final full repository check passed: lint, TypeScript, 126 Vitest tests and five export checks.
- Final Node production build passed. Existing framework inputValidator deprecation/chunk-size notices remain. [Build log](artifacts/profile-feature/build.log).
- Browser checks: all four combinations at 1440 and 390; real signed question delivery, desktop keyboard, mobile touch/reduced motion, varied attempts, retained answers, age-change cancel/confirm, Retake, double start, no hidden keys, no horizontal overflow, distinct selected cards and no console errors.
- Result-screen browser checks use an isolated simulated account and result DTO. Actual scoring is tested by domain tests, including independence from cognitive scores for children and all 166 careers. This is not live database saving verification.
- EN/RU/UZ: all added prompts/options aligned in unit checks, plus localized browser spot checks.

| Profile        | Desktop | Mobile | Domain scoring/rules |
| -------------- | ------- | ------ | -------------------- |
| Male / child   | Pass    | Pass   | Pass                 |
| Male / 15+     | Pass    | Pass   | Pass                 |
| Female / child | Pass    | Pass   | Pass                 |
| Female / 15+   | Pass    | Pass   | Pass                 |

Machine-readable browser evidence: [browser-results.json](artifacts/profile-feature/browser-results.json) and [Russian/Uzbek spot checks](artifacts/profile-feature/localized-results.json). Captures are ignored by Git.

## Screenshot comparison

| View             | Before                                                                         | After                                                                                                                                                                             |
| ---------------- | ------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Desktop entry    | [Before](artifacts/profile-feature/before-entry-1440.png)                      | [After](artifacts/profile-feature/after-entry-female-child-1440.png)                                                                                                              |
| Mobile entry     | [Before](artifacts/profile-feature/before-entry-390.png)                       | [After](artifacts/profile-feature/after-entry-female-child-390.png)                                                                                                               |
| Desktop question | [Before](artifacts/profile-feature/before-question-1440.png)                   | [Older](artifacts/profile-feature/after-question-male-teen_adult-1440.png) / [Child](artifacts/profile-feature/after-question-male-child-1440.png)                                |
| Mobile question  | [Before](artifacts/profile-feature/before-question-390.png)                    | [Older](artifacts/profile-feature/after-question-male-teen_adult-390.png) / [Child](artifacts/profile-feature/after-question-male-child-390.png)                                  |
| Result           | [Existing account gate](artifacts/profile-feature/before-result-gate-1440.png) | [Desktop simulated result](artifacts/profile-feature/after-result-female-child-1440.png) / [Mobile simulated result](artifacts/profile-feature/after-result-female-child-390.png) |

Fonts, tokens, borders, shadows and shell remain consistent in the captures; chooser controls reuse existing visual-choice styling. Child question copy/sections and result wording intentionally differ. Landing baseline was captured during its entrance animation, so it cannot establish a settled pixel-level comparison. Landing source and brain rendering were not changed; settled after captures supplement the original baseline. Browser checks are not a device-wide 60fps certification.

## Added child-friendly questions

Every item below includes Russian and Uzbek text in [child-questions.ts](src/lib/assessment/child-questions.ts); all have `addedBy: feature-age`. Activity options vary across four sets of six concrete activities, mapped server-side to RIASEC dimensions.

### Personality (16)

- **cp1**: I like playing games with a group of friends.
- **cp2**: I like drawing quietly on my own.
- **cp3**: I like telling my friends about my day.
- **cp4**: After a busy game, I like a quiet break.
- **cp5**: I like looking closely at leaves and stones.
- **cp6**: I like making up stories about imaginary animals.
- **cp7**: I like building a toy by following its pictures.
- **cp8**: I like finding a new way to play with a toy.
- **cp9**: When a toy stops working, I want to see what happened.
- **cp10**: When a friend is sad, I like cheering them up.
- **cp11**: I like checking the rules before starting a game.
- **cp12**: I like making sure everyone can join our game.
- **cp13**: I like putting my toys back in their places.
- **cp14**: I like choosing what to play as I go.
- **cp15**: I like finishing one drawing before starting another.
- **cp16**: I like trying a surprise activity.

### Activity preferences (20)

- **ci1**: Which activity would you pick after school?
- **ci2**: What would you like to try with your friends?
- **ci3**: What sounds fun on a rainy day?
- **ci4**: Which activity makes you curious?
- **ci5**: What would you pick for a free afternoon?
- **ci6**: What would you like to make or do today?
- **ci7**: What would you like to share with a friend?
- **ci8**: Which activity would you start first?
- **ci9**: What sounds fun during a holiday?
- **ci10**: Which activity would you like to learn more about?
- **ci11**: Which activity would you choose for a play day?
- **ci12**: What would you enjoy doing with a new friend?
- **ci13**: What would you do on a quiet weekend?
- **ci14**: Which activity would you tell your family about?
- **ci15**: Which activity would you like to do again?
- **ci16**: What would you choose at an activity club?
- **ci17**: Which activity would make your day happier?
- **ci18**: What would you like to try tomorrow?
- **ci19**: Which activity would you invite a friend to?
- **ci20**: Which activity would you pick just for fun?

## Limits and recommended follow-up

Live authenticated saving/result retrieval require a configured account service; baseline was blocked at the same account gate. No deployment, production account changes or SQL migration was performed. Review child translations/content with educators and validate the questionnaire before making reliability claims. Session-only demographic wording expires with the tab session; it is intentionally absent from permanent historical results.
