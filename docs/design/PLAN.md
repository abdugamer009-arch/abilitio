# Abilitio — product-led rebuild plan

Written after baseline captures and CRITIQUE.md, before source changes. Reference principles: [Bedrock Prep](https://www.bedrockprep.com/), inspected 9 October 2026. Borrow product visibility and explanatory clarity; no copied text, colors, assets, badges or layout.

## Our idea

- Product: career exploration through personality, reasoning and interests, followed by a practical career task.
- Audience: students choosing their first career direction, including students in Uzbekistan; schools support that journey.
- Desired outcome: choose a career worth trying and a concrete first experiment.
- Promise: **Find a career worth trying.** Tagline: **Your next move, with reasons.**
- Verified proof directly beneath the promise: **30 questions** — existing session has 12 personality, 9 reasoning, 9 interest questions. This is scope, not an impact statistic.
- Two commitments: try a free question locally; start the complete assessment.
- Access: student tools are free. School pilots require a conversation; no verified public price or paid student plan exists. Do not fabricate one.

## Principle mapping

| Principle           | Our application                                                                                                                                              | Decision                                                                           |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------- |
| Sharp niche/promise | Career direction for students; 30-question proof; free question and complete assessment CTAs                                                                 | Use                                                                                |
| Founder trust       | Two supplied founder portraits, confirmed names and shared motto                                                                                        | Use; owner-supplied portraits and motto                                         |
| Branded stages      | Signal / Vector / Trajectory: noticing interests, comparing directions, trying real work. SVG badges and self-placement update the workbench without sign-up | Use; exploration states, never IQ/rank                                             |
| True numbers        | 30 questions, 12/9/9 composition, actual local answers and task completion; estimates labeled                                                                | Use; TODO verified pilot sample/outcomes, no invented reach                        |
| Live product        | Shared real-bank reasoning question, indexed difficulty grid, locally derived result, selectable roadmap and tracked task                                    | Use; never label illustrative local state as a validated profile                   |
| Explanation         | Approach first, then three numbered steps; same blue/lime/coral tokens connect text and SVG                                                                  | Use                                                                                |
| Freemium            | Every displayed student sample is free; school scope beside a preview                                                                                        | Skip fictitious Pro/billing/discount/RECOMMENDED; no current paid student offering |
| Light previews      | Small controlled SVG/UI loops, pause control; brain is the signature canvas                                                                                  | Use; no heavy autoplay video                                                       |
| Short structure     | Hero → founder bridge → one workbench → access; four nav links, compact footer                                                                               | Use; avoid repeated features                                                       |

## Locked art direction

**Concept:** A decision workshop — a precise instrument for turning self-observation into a next move.

- Colors: midnight ink #111b29 and warm white #f5f4ed; chartreuse #d5e96c (Signal/start), steel blue #96b9df (Vector/compare), coral #e9a78b (Trajectory/test). These three colors also encode introductory / focused / extended activity effort, always accompanied by labels.
- Typography: self-hosted Syne variable display + IBM Plex Sans text, with Cyrillic text/headline fallback. Scale 12/14/16/20/24/32/48/72/96; fluid mobile title 44–56.
- Grid: 1280 px, twelve columns, 24 px desktop and 20 px mobile gutters. Eight-pixel spacing: 8/16/24/32/48/64/80/96. Hero asymmetric; workbench is an actual product surface.
- Surfaces: 2 px controls, 8 px product surface, 1 px rules, zero default shadows/glass/blobs. Light product plane against ink composition, restrained texture through linework only.
- Motion: custom expo-out cubic-bezier(.16,1,.3,1); flow cubic-bezier(.76,0,.24,1). Duration tiers .18/.36/.72/1.08 seconds, stagger .065 seconds. Register CustomEase names from these tokens; no powerN/default/linear tweens in the new system.
- Choreography: labelled hero (rule / promise / proof / actions / anatomy), labelled section and route exit/entry timelines; masked words, clip planes, ordered SVG explanation steps. Velocity feeds slight instrument skew and shader distortion; never unreadable body text.
- Signature brain: closed folded hemispheres/fissure, ceramic skin with 16k particles and synapses on a dedicated ink stage; mobile 10k with adaptive software tier. Rim/noise/pulses/assembly, scene-specific postprocessing, scroll camera, pointer lighting. Explicit static equivalent and full disposal.

## Build order and verification

1. [x] Tokens/fonts/base. Type/lint; screenshot both widths; check header/body contrast.
2. [x] Hero/proof/two CTAs and rebuilt brain surface/material. Capture assembly frames; console, resize, reduced motion and draw budget.
3. [x] Founder/trust. Check explicit placeholders and no invented biography/numbers; both widths.
4. [x] Stage picker and SVG badges. Keyboard, self-placement updates, no signup, no layout jump.
5. [x] True numbers. Confirm session counts against source; count only actual demo answers/tasks.
6. [x] Live product: real-bank item grid, result and task path. Exercise every state, correct/incorrect answers, reload persistence and completion.
7. [x] Full explanation. Verify arithmetic, color linkage, numbered steps, one drawing per step; reduced-motion/keyboard equivalent.
8. [x] Honest access comparison. All free labels truthful; school action opens working inquiry route. No fictitious billing.
9. [x] Four-item navigation/minimal footer. Mobile Escape/focus return, language/theme/utility reachability, links.
10. [x] Global motion/preloader/route transitions. Frame sequences per timeline; pause/intersection/tab/resize/context recovery; FPS/GC.
11. [x] Copy/localization. English/Uzbek/Russian; one outcome and no repeated feature descriptions, no banned phrases.
12. [x] Regression audit/delivery. All public/guest routes, console/network/axe, build/type/lint/tests, Lighthouse, 60-second FPS/heap; annotated before/after and source ZIP. Live account/database checks explicitly separate.

## Definition of done

Working product-led page and its complete interaction states; stage system changes useful content; full question solution; authentic local progress; no fabricated paid tier or proof. Authored motion reviewed in frame sequences, readable/mobile/static equivalent. Build/type/lint/tests pass, no guest-route errors/overflow/axe failures. Target 60 FPS and static Lighthouse85+/accessibility95+; software results identified as such. Preserve earlier security safeguards and document unapplied schema/live account limits. A single HTML cannot preserve signed server actions/Supabase auth; retain the existing app and deliver its complete source/build.

## Content TODOs (not fabricated)

- Founder portraits, names and motto supplied on 9 October 2026. Both founders have equal co-founder attribution; an extended biography is optional.
- TODO_PILOT_EVIDENCE: verified dated sample and outcomes. Do not display a made-up audience count.
- TODO_SCHOOL_PRICE: agreed school scope/price; no billing/savings invented.

## Earlier audit — retained source fixes, re-test after redesign

## Audit mapping (ordered by severity)

These are the original audit recommendations and reproductions, retained for traceability; descriptions of the old UI are not descriptions of the rebuild. Checked items mean source remediation is present. Remote schema enforcement, account workflows and physical-browser/GPU checks still require staging. D02 and D04 require real source material; B14 fetches the newest 100 but older-history pagination remains open.

### High

- [x] **B01** Validate configuration at startup; document local setup; let public content survive unavailable authentication. (S). Verification: Run npm ci and npm run dev without environment variables, then load /.
- [x] **B02** Use collapsed navigation until the complete header fits; validate English, Russian and Uzbek, plus signed-in controls. (S). Verification: Open / at 1024×900. Schools/About links sit underneath the right-hand controls.
- [x] **B03** Confine the pinned scene to the hero and finish its fade before the next content begins. (M). Verification: Open / at 1440×900; scroll approximately 675px and wait.
- [x] **B04** Handle recovery errors; add a recovery-token screen with confirmed new-password submission and success/error states. (M). Verification: Enter an email; intercept the recover request with HTTP 400; click Forgot password. It still says to check email. Follow a real recovery link later with staging credentials.
- [x] **B06** Use dark ink on pale violet controls or darken their background; check every primary-action state. (S). Verification: Open /auth in a fresh dark-mode context and run axe.
- [x] **B07** Add visible associated labels: First career, Compare with; connect school labels using id/htmlFor. (S). Verification: Open /career-battles and inspect its selects with axe or a screen reader.
- [x] **B12** Share the existing downloadable image, or introduce an explicit opt-in revocable read-only share token. (M). Verification: Inspect share(); send its URL to a second account. Live two-account reproduction awaits staging access.
- [x] **B13** Commit the new reference first, clean up the old object after success, and revoke preview URLs in finally/unmount cleanup. (M). Verification: In staging, force user_stats update to fail after successful upload/removal. Source confirms destructive ordering.
- [x] **B15** Issue expiring session IDs; verify question/option membership and uniqueness before scoring; reject altered submissions. (L). Verification: Submit duplicated valid IQ IDs and mismatched interest option IDs in staging. No live exploit was attempted.
- [x] **B16** Restrict scored writes to a validated server/database operation while preserving ownership reads. Verify deployed RLS before migration. (M). Verification: In staging, attempt an authenticated direct insert with user_id=self and fabricated scores. Live policy state is unknown.
- [x] **B17** Limit editable profile columns; route moderation through an authorized operation; verify deployed grants/policies. (M). Verification: In staging, attempt to update your own is_banned field through the user client. No live exploit was attempted.
- [x] **S01** Remove fabricated deltas and IQ labels. Show actual completed activities, actual dates and the original aptitude scale. (M). Verification: Read deriveWeeklyReport and the dashboard result mapper; compare them with methodology’s explicit not-an-IQ statement.
- [x] **S02** Publish only substantiated claims; link to methodology; remove unbuilt parent promises; use one measured or explicitly estimated duration. (S). Verification: Expand all homepage FAQ answers, compare the duration stat and route inventory.
- [x] **S03** Replace fit percentages with clearly scoped score-range guidance. Add official sources, degree level, citizenship eligibility and verification dates; correct scholarship records. (L). Verification: Set SAT=1600, IELTS=9: cards report 100% fit. Oxford lists Clarendon and Cambridge lists Gates Cambridge.
- [x] **I01** Profile and reduce startup dependencies; show a lightweight poster first; defer expensive scene setup until visible/idle; preserve actual assessment interactivity first. (L). Verification: Build the clean snapshot and inspect client chunks plus Lighthouse network requests.
- [x] **I03** Add an adaptive quality tier based on frame time, reduce post-processing/DPR before removing content, and offer a static fallback for weak devices. (M). Verification: Profile hero animation on a real low-end Android and integrated-GPU laptop, then compare with this host’s software samples.
- [x] **D01** Add a clearly labeled interactive sample: answer three sample questions, see the three signals, inspect career reasoning and try one next step. Payoff: reduces uncertainty before the full assessment. (M). Verification: Proposed feature; keep sample data separate from real results.
- [ ] **D02** Add real consented pilot case studies with dates, sample size, exact workflow and documented outcomes; show the school report with anonymized real data. Payoff: earns student and school trust. (L). Verification: Proposed feature; no invented testimonials or school endorsements.
- [x] **D03** Persist per-user task events to the backend with offline queue/retry; derive progress from these events. Payoff: reliable return visits and truthful analytics. (L). Verification: Proposed persistence extension; verify existing RLS/schema conventions.
- [ ] **D04** Add verified undergraduate program records, citizenship-specific funding, full annual cost, deadlines and official source links. Payoff: students can build a realistic shortlist. (L). Verification: Proposed feature; must follow catalog correction S03.

### Medium

- [x] **B05** Validate the entire persisted payload with a versioned schema; discard invalid drafts and offer restart. (S). Verification: Start an assessment, change its saved localStorage answers to {}, reload.
- [x] **B08** Move active literals into the existing dictionaries; translate the complete journey and preserve proper nouns. (M). Verification: Select UZ, scroll through the landing page and footer, then open methodology.
- [x] **B09** Build a theme-aware exposure/background treatment; verify composer transparency and bloom rather than just changing the CSS halo. (M). Verification: Switch the homepage to light mode and wait for its scene to assemble.
- [x] **B10** Implement keyboard dismissal and return focus to the trigger; keep non-modal disclosure semantics or deliberately make it a dialog. (S). Verification: At 390px open the menu, press Escape: aria-expanded stays true.
- [x] **B11** Track visibility and intersection together; subscribe to motion-preference changes; redraw once when paused. (S). Verification: Toggle reduced motion while / is mounted. Then scroll to footer, dispatch hidden→visible visibility states: clearRect calls resume offscreen. The visibility check used a deterministic simulation.
- [ ] **B14** Load the newest page descending and reverse for display; paginate older messages with a cursor. (S). Verification: Use a staging community with more than 100 messages and open it.
- [x] **B18** Render retryable localized error states and distinguish empty results from failed requests. (S). Verification: Force an overview/growth fetch to reject with a network/database error in staging.
- [x] **B19** Catch clipboard failures and offer selectable text; distinguish share cancellation from share errors. (S). Verification: Deny clipboard permission or make writeText reject, then click Copy or Share.
- [x] **S04** Label a specific illustrative sample, show why a sample matches, and source region/date-based labor-market facts. (S). Verification: Visit / in a fresh anonymous context and inspect its career cards/comparison blocks.
- [x] **S05** Keep legible body text; introduce a purposeful display treatment, flat editorial rows and violet used for reasoning rather than every surface. Reserve depth for the brain. (M). Verification: Compare homepage, features, about and school pages side by side.
- [x] **S06** Use a concrete proposition such as Find three careers worth exploring; explain that 30 questions produce an exploratory profile, then preview the real output. (S). Verification: Read the hero before clicking. Identify the promised deliverable and evidence behind next-gen.
- [x] **S07** Use real founder portraits/bios or designed text portraits; use discipline-specific line illustrations; reserve a single mascot style for the learning journey. (M). Verification: Compare About founder cards, career battle emoji and the final CTA.
- [x] **S08** Use a deliberate 48/80/120px spacing rhythm by section role; reveal only key transitions; connect question → signal → career → next action. (M). Verification: Scroll the full homepage at 390px; compare repeated card entrances and inter-section gaps.
- [x] **S09** Distinguish free student tools from school offerings, state actual limits and remove popularity claims until substantiated. (S). Verification: Compare /pricing with /for-schools.
- [x] **I02** Reserve the scene’s dimensions and render a designed SVG/poster immediately; crossfade on first rendered frame. Avoid a blocking preloader. (M). Verification: Throttle the brain chunk or disable WebGL; inspect the first few seconds. CLS was zero in the recorded Lighthouse run, so a layout-shift failure was not established.
- [x] **I04** Generate route-specific canonical/social metadata, reconcile the public sitemap and use View assessment features as link text. Keep existing valid 1200×630 OG asset/favicon. (S). Verification: Open /features and inspect og:title/og:url; compare sitemap with route inventory.
- [x] **I05** Use a coherent heading hierarchy or non-heading labels; place utility navigation inside a named landmark. (S). Verification: Run axe on public pages; inspect the accessibility tree. Skip-to-content already works.
- [x] **I06** Add an accessible Motion on/off preference or make the university strip static. Keep OS reduced-motion support. (S). Verification: Read the continuously moving strip for more than five seconds; seek a pause/stop control.
- [x] **I07** Format the affected files as a discrete approved batch; move shared exports only where it improves module boundaries. (S). Verification: Run npm run lint in the clean snapshot.
- [x] **I08** Consolidate catalog ownership with provenance; remove unused datasets/components after checking imports; update current product and processor descriptions. (M). Verification: Compare SQL career seeds, ABBI knowledge, comparison catalog and active routes; search incoming imports.
- [x] **D05** Use three selectable regions/signals tied to personality, reasoning and interests; show a single question-to-result explanation. Payoff: turns memorable motion into product comprehension. (M). Verification: Proposed feature; preserve keyboard access and a static equivalent.
- [x] **D06** Add a short school-specific inquiry flow with institution, role, student count, language and requested pilot; show what happens next. Payoff: qualified inquiries and a clear onboarding handoff. (M). Verification: Proposed feature; connect to a verified recipient and avoid duplicate generic forms.
- [x] **D07** Extend existing events for CTA→assessment start→question-stage dropoff→auth return→saved result→first task, plus scene fallback and Web Vitals. Payoff: prioritize real user friction. (S). Verification: Proposed instrumentation extension; keep personal answers and minors’ identifiers out of event payloads.

### Low

- [x] **B20** Update counters correctly on value changes; cancel pending frames in cleanup. (S). Verification: Change a mounted CountUp value after its first animation, or navigate away during animation. No sustained leak was proven.

## Verification record — rebuild

- Before source changes: CRITIQUE.md and the plan above, 1440/390 intro sequences and 650 px scroll stops in the sibling delivery folder.
- Visual batch 1: new tokens, hero, founder slots, stages, workshop, solutions, access, nav and motion. Review exposed premature brain opening, empty GSAP targets and a clipped diagram label; these were corrected.
- Visual batch 2: both requested widths plus 1024, same intro/scroll checkpoints. Homepage height 2621/2611/3160 px at 1440/1024/390. New medial cortex and separate assembly/scroll clocks make the intact silhouette visible before scrolling.
- Functional gate: all four real answers, every solution step, report arithmetic, preferences/direction, track-specific task completion/reload, reset, native keyboard radios, menu Escape/focus return, free/full CTAs and route curtains, school topic, mocked contact success/failure, Uzbek and OS reduced motion at all three widths.
- Accessibility: 60 public/guest route visits clean; additional light/dark tests cover every workshop stage, incorrect answers, malformed storage and Russian/Uzbek layout. Numbered task labels were corrected after the dynamic sweep.
- Code: 66 tests across seven files; type and lint pass; Node build, isolated npm ci and Vercel build pass; npm audit reports zero vulnerabilities. Account SDK is split from the initial main chunk (247 → 188 KB gzipped).
- Shared roadmap correction: task identity now includes its direction. New v2 local journals cannot apply tech marks to creative work. Ambiguous old local keys and remote rows remain preserved and excluded from current counts, with an explicit review notice. Live migration/session checks remain staging gates.
- Sustained FPS, heap, Lighthouse and archive smoke results are recorded in the delivery REPORT.md. Evidence comes from Chromium/SwiftShader, not a physical mid-range laptop.

- Final visual batch 3 repeats desktop/mobile intro and scroll checkpoints after font/startup refinements. The hero rail uses a clip reveal rather than compressing its labels; the explanatory proof copy stays readable while the numeric proof is revealed. Software construction generates its actual 6k budget rather than generating 10k and discarding 4k.

- Proof digits reserve width so the counter cannot move adjacent copy. Final raw Lighthouse results and residual Chrome preload advisories are recorded without claiming universal zero warnings.

## Founder update — 9 October 2026

Owner-supplied photographs identify Axmedov Umar (black suit) and Abduraxmon (flag). Original JPEGs are preserved; shared CSS framing selects the face and a little shoulder on the homepage and About page. Both carry the same co-founder role. The supplied motto replaces the placeholder note and hero tagline, with Uzbek/Russian equivalents. No biography is invented. Build, typecheck and changed-file lint pass; both pages checked at 1440/1024/390 with loaded portraits, no horizontal overflow or JavaScript exceptions. New screenshots are in delivery/after/founders. Earlier motion and performance evidence predates this content update.

## Clarity follow-up — 9 October 2026

The owner approved resolving all 14 misunderstandings. CLARITY_FIXES.md maps each finding to the implemented change. Plain workshop labels, unselected preferences, honest account/result disclosure, consistent numbering, real activity guides, accurate dashboard measurements and school report/access explanations are complete. Legacy workshop answers/task marks and old database rating columns are preserved. Public flows pass at 1440/1024/390; full 30-question guest handoff retains answers. Account-screen checks use an isolated sample fixture; real Supabase integration remains a staging gate. Expanded-guide mobile overflow and secondary/selected-label contrast discovered during this batch were corrected. Screenshots and raw checks are in delivery/after/clarity. Earlier performance measurements were not repeated.
