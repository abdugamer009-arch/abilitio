# Picture assessment and pilot

The owner approved the 18 question proposals and four independent practice puzzles on 17 October 2026. That approval covered implementation. On 20 October 2026 the owner explicitly requested deployment of the unpublished changes; see the [release record](../operations/PICTURE_ASSESSMENT_2026_10_20.md). No real student pilot has occurred, so difficulty and version equivalence remain provisional. The prior question-removal inventory is retained in [the retirement register](../design/ASSESSMENT_REASONING_RETIREMENT.md). The current child path remains 12 preferences and 18 activities, with no reasoning; introducing a child reasoning score needs a separate age-reviewed design decision.

## Switching and compatibility

Both server-only switches default to false in `.env.example`:

```sh
ASSESSMENT_PICTURE_ENABLED=true npm run dev
```

Development and staging can use the first flag. A production build additionally requires `ASSESSMENT_PICTURE_ROLLOUT_APPROVED=true`. Keep both switches false in new environments unless the owner authorizes rollout. The owner authorized production publication on 20 October before a student pilot; the pilot below remains outstanding and no empirical validation is claimed. No `VITE_*` switch or query parameter enables the new set.

When disabled, the production assessment uses its existing flow and bank. When enabled, new older attempts use only the 18 approved items, one random version per slot in easy-to-hard order, 12 unchanged preferences and nine unchanged interests. Old signed attempts remain resolvable and resumable until their original expiry; restarting one enters the new flow. Legacy mathematical questions remain server-side solely for compatibility and the disabled legacy flow. Workshop independently uses four new unscored practice items with disjoint IDs; it never draws from the assessment bank.

`picture-bank.server.json` contains the immutable original authoring records: ID, slot, version, type, provisional difficulty, age group, figure data, canonical answer IDs, rule, distractor explanations and ENG/RU/UZ question lines. Do not import it into client modules. `picture-rules.ts` generates grids and series from their rules, folds planar nets into face normals, normalizes polyomino cells and validates rule solutions. `publicPicture` whitelists visible geometry; it removes answer keys, predicates, generation rules and face normals. Server delivery shuffles answer positions, signs the canonical answer IDs and permutations, and omits all hidden grading data.

Three-answer logic items use signed counts rather than the former four-answer assumption. The server validates membership, option bounds and complete new-set submissions before grading. Career ranking, preference and interest scoring remain unchanged. A new-set report displays `round(correct / 9 * 10, 1)` alongside the raw count; seven correct shows 7.8/10. The database stores the raw count. Earlier stored results and rankings are never recomputed or silently converted.

`20261017120000_picture_assessment.sql` adds immutable question-set metadata. Existing rows receive `legacy-question-set-unknown`, since historical exact membership cannot be reconstructed. Existing `scoring_version`, scores and rankings remain intact. Child picture-flow attempts are tagged `child-preferences-v1` and retain a null reasoning score.

## Drafts and private observations

Guests keep a durable browser-local draft under a guest-specific key. Authenticated drafts have an account-specific key; a guest draft can transfer into the signing-in account once and is then removed from the guest key. Demographic presentation choices remain in tab-local storage, outside cloud draft payloads. Reopening a tab keeps answers and position but may ask for those presentation choices again. Signed attempts still expire after 24 hours; recovery does not extend expiry.

After each answer, shown/answered state, canonical chosen ID and elapsed foreground time are recorded for every administered question, including unshown questions as false. Timing pauses in hidden tabs and is never displayed to students. It is approximate browser telemetry, not trusted proof of effort or a grading input. The device write is synchronous and account requests are serialized. Save-and-exit awaits account saving; failure keeps the test open. Errors remain visible and retryable instead of claiming a cloud save succeeded.

Authenticated server actions validate ownership, the signed session, answer membership and observation consistency. They rebuild question wording/geometry from the authoritative bank rather than trusting a stored client DTO. `save_picture_progress` atomically stores the draft and server-graded observations. Its grant is service-role-only; direct browser writes are revoked. A stale revision cannot replace a newer one, and completed nonces cannot resurrect drafts. Original owner/nonce result retry idempotency remains in `persistAssessmentResult`.

The database migration is required before signed-in pilot use. Code pushes do not apply SQL. Apply and verify it against the intended project using [the owner migration process](../operations/OWNER_MIGRATIONS.md). Unit/PGlite checks and browser fixtures are not live authenticated database evidence.

## Admin review and real pilot

The existing admin page contains the item statistics view. Shared role and ban checks live in `src/lib/admin/access.server.ts`; browser-callable server functions do not re-export those service-dependent helpers. Server role checks precede service-role reads, and RLS separately permits item reads only for admins. Students cannot read grading/timing rows. Rows are grouped by question set, age group and question/version. Correct percentages and option percentages use answered attempts; average active time uses shown attempts, including unanswered shows. Unobserved percentages remain unavailable, not zero. Canonical answer IDs survive shuffling. Repeated saves update one owner/nonce/item row rather than counting as extra students or extra attempts.

Outstanding empirical validation after the owner-authorized release:

1. Recruit at least 30 actual students across different ages within the approved older group. Track age coverage and consent through the school's authorized pilot process; the app does not invent or infer exact ages.
2. Check exposure for both versions of every slot. A total of 30 students is only an initial signal; a version with few answers is not validated.
3. Review easy items against 75–90%, medium against 45–70%, and hard against 20–45% correct. Slot 7 initially uses the medium target. Replace any item outside its range or with a distractor selected more often than the correct answer.
4. Inspect each version pair's percentage-point gap and sample sizes. The UI reports the gap without inventing a statistical equivalence threshold or claiming difficulty validation.
5. Re-run rule, localization and flow checks after replacements, increment changed IDs and set version deliberately, and preserve earlier grading resolvers.
6. Record the owner’s rollout decision separately from empirical validation. The 20 October deployment approval does not establish student difficulty or version equivalence.

Pilot results, age coverage, item replacements and the final rollout decision must be recorded from real evidence. No synthetic student records or simulated percentages count toward this pilot.

## Verification

```sh
npm run check
NITRO_PRESET=node-server npm run build
# Start Vite separately with ASSESSMENT_PICTURE_ENABLED=true, then:
node scripts/qa-picture-assessment.cjs
node scripts/qa-picture-controls.cjs
node scripts/qa-picture-admin.cjs
```

The picture matrix exercises full 30-question attempts in ENG/RU/UZ at 390px and 1440px, light/dark, guest/account fixtures, both age paths, refresh and closed-tab recovery. It uses real local signed question delivery. Account, draft and result endpoints in the authenticated browser cases are explicit fixtures. The SQL suite separately exercises grants, RLS, ownership, stale-revision protection and atomic rollback in PGlite. Neither replaces live saving, a physical-device check or the real pilot. Captures and receipts are ignored under `artifacts/picture-assessment-qa/`.
