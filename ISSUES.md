# External QA issue ledger

Baseline: 14 October 2026, branch `codex/qa-audit-2026-10`. The working tree already contains the earlier age/gender chooser and mobile-assessment repair; this ledger evaluates that current tree. Before-fix captures are in ignored `baseline/`. Protected dashboard/settings and private results cannot be represented as live account screenshots without a disposable QA account; the baseline records the actual sign-in redirect and includes signed-fixture assessment/result captures from the preceding mobile test.

Status meanings: **OPEN** needs a fix and proof; **PARTIAL** has prior related work but still fails this audit's acceptance rule; **BLOCKED** needs the named owner input or live service. A row becomes **FIXED** only after its named test passes and any visual evidence exists. Commits and evidence are filled in as work lands.

| ID | Status | Root cause / current finding | Files | Test | Commit | Evidence |
| --- | --- | --- | --- | --- | --- | --- |
| H01 | FIXED | Old letter-only summaries could contradict a strongly opposed answer; new claims and styles require item-level support. Historical rows lacking answers show an unverified notice. | `career-engine.ts`, `summary-integrity.ts`, `career.functions.ts`, result/dashboard UI | `H01-summary-integrity.test.ts` (opposite traits, 1,000 seeded sets, historical row); 390px browser note check; `npm run check` | `H01 H05: audit baseline and evidence summaries` | `baseline/H01-after/iphone-15-en-teen_adult-longest-mixed-signals.png` |
| H02 | OPEN | Submit invokes community assignment RPC without an opt-in. | `career.functions.ts`, `community.functions.ts`, result UI | Pending zero-membership e2e | — | Pending |
| H03 | BLOCKED | Recovery UI is gated pending verified SMTP/sender delivery. Need configured Supabase SMTP sender domain, approved recovery URL, and a disposable external mailbox for live delivery proof. | `auth.tsx`, `dashboard.tsx`, auth docs | Pending mock-mailer flow and live proof | — | `baseline/*-dashboard.png` |
| H04 | OPEN | Comparison uses four local choices rather than saved recommendations and full catalog. | `career-battles.tsx` | Pending catalog/selection e2e | — | `baseline/*-career-battles.png` |
| H05 | PARTIAL | Prior chooser and child pool are present; consent threshold remains an owner/legal decision. Need applicable jurisdiction(s) and counsel-approved minimum age/parental-consent rule. | `AssessmentProfileChooser.tsx`, assessment pool, methodology | Prior profile unit/browser checks; new full gate pending | — | `baseline/*-signed-chooser.png` |
| H06 | FIXED | Adult sessions now use nine concrete activity/subject choices; child sessions already use direct activities. Ranking uses one shared weight config (70% direct interests/30% work preferences for older students; 75%/25% for children). Visual choices, uniform reasoning offsets, and demand nudges no longer rank careers. Older visual-only signed sessions remain gradable but rank from work preferences alone and show limited evidence. | `activity-questions.ts`, `scoring-config.ts`, `career-engine.ts`, `career.functions.ts`, `EditorialPage.tsx`, result UI | `H06-scoring-validity.test.ts` (6 tests); `npm run check` (146 unit tests); phone browser 2/2 | H06 commit pending | `baseline/H06-after/iphone-15-en-teen_adult-longest-q22.png`, `baseline/H06-after/iphone-15-en-teen_adult-longest-evidence.png` |
| H07 | OPEN | PDF and share card actions need reliable local artifacts and preview proof. | `career-results.tsx` | Pending download/preview e2e | — | `baseline/*-signed-result.png` |
| M01 | PARTIAL | Prior mobile flow uses explicit Next, but desktop interest flow still auto-advances. | `career-assessment.tsx` | Pending rapid-tap e2e | — | Pending |
| M02 | OPEN | Selection lacks similarity-group uniqueness and trait coverage contract. | `question-bank.ts`, session selection | Pending 500-attempt test | — | Pending |
| M03 | OPEN | Ability-like score labels remain. | `career-engine.ts`, result UI | Pending wording test | — | Pending |
| M04 | OPEN | Career cards lack answer-linked reasons, mismatches, work examples, and experiment. | `career-results.tsx`, engine | Pending evidence/visual test | — | Pending |
| M05 | OPEN | Compact history label formatting can merge tokens. | `dashboard.tsx` | Pending formatter test | — | Pending |
| M06 | OPEN | History lacks complete per-attempt report view and comparison. | `dashboard.tsx`, result storage | Pending history e2e | — | Pending |
| M07 | OPEN | Empty search does not provide the requested count, message, and clear action. | `career-results.tsx` | Pending search e2e | — | Pending |
| M08 | OPEN | Comparison permits duplicate selections and empty columns. | `career-battles.tsx` | Pending selector e2e | — | Pending |
| M09 | OPEN | Roadmap phases use generic goals rather than chosen-career work. | `roadmap.tsx`, roadmap logic | Pending career fixture test | — | Pending |
| M10 | OPEN | Dashboard names the curated assistant ABBI AI without a capabilities notice. | `dashboard.tsx`, `AbbiChat.tsx` | Pending copy/visual check | — | Pending |
| M11 | OPEN | Curated guide has unsupported demand/compensation statements. | `abbi-knowledge.ts` | Pending claim audit test | — | Pending |
| M12 | BLOCKED | School terms need owner-approved trial price, scope, payer, and legal wording; neutral student/school copy can be repaired independently. | `terms.tsx`, `privacy.tsx`, school routes | Pending consistency test | — | Pending owner decision |
| M13 | BLOCKED | Registration needs owner-approved scope, payer, student-permission responsibilities before real submission. Need those exact terms. | `school.register.tsx` | Pending mocked-submit e2e | — | Pending owner decision |
| M14 | OPEN | Animated numbers can temporarily show false values. | `CountUp.tsx`, dashboard | Pending reduced-motion/DOM test | — | Pending |
| M15 | OPEN | Workshop stage cards and repeated content push the active task down on phones. | `CareerWorkshop.tsx` | Pending 320–430px visual/touch checks | — | `baseline/*-landing.png` |
| M16 | OPEN | Weekly digest control has no delivery path. | `dashboard.tsx` | Pending absence/delivery test | — | Pending |
| L01 | OPEN | Supporting copy includes 11–13px labels. | `styles.css`, component styles | Pending typography audit | — | Pending |
| L02 | OPEN | Heavy borders/shadows compete with primary results/actions. | shared styles and result components | Pending screenshot comparison | — | Pending |
| L03 | BLOCKED | Team structure can be added, but real role/experience/reviewer content needs owner-provided biographies and review responsibility. | `about.tsx` | Pending placeholder check | — | Pending owner content |
| V01 | OPEN | Flagged external university/funding URLs need verified status/replacement. | university catalog, link-check script | Pending dated link report | — | Pending |
| V02 | OPEN | Full three-language, light/dark flows are not yet audited. | i18n and routes | Pending browser matrix | — | Pending |
| V03 | OPEN | Draft expiry/storage messaging needs explicit proof. | assessment draft logic | Pending fake-timer and browser test | — | Pending |
| V04 | OPEN | Keyboard, focus, contrast, zoom, and live announcements need full pass. | route/components/styles | Pending accessibility suite | — | Pending |
| V05 | OPEN | Console/request clean gate needs full-flow coverage. | e2e harness | Pending `test:all` | — | Pending |
| V06 | OPEN | QA cleanup script must be reviewable and confirmation-gated. | scripts | Pending dry-run test | — | Pending |

No test account, community membership, or production data has been created or removed by this audit.
