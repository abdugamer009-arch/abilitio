# Career Intelligence & School Talent Analytics — Implementation Plan

This is a very large feature set. I'll ship it in one cohesive pass, reusing the existing Abilitio design system (purple gradients, glass cards, Recharts) and preserving every current system (Aura, Community, Roadmap, ABBI, Market, existing assessments, For Schools v1).

## 1. New "Career Intelligence" assessment (30 Q)

New flow at `/career-assessment` — separate from existing personality/IQ tests; old ones stay.

- **Q1–16 Personality** (MBTI 4-axis, 5-point Likert, 4 per axis)
- **Q17–26 Cognitive** (10 multiple-choice; pattern / logic / analytical) → score 0–10, tier Exceptional/Advanced/Competent/Developing/Basic, profile label (Analytical / Strategic / Practical / Research / Innovative) derived from MBTI×score
- **Q27–30 Interests** (multi-select across 18 interest tags, weighted)

Questions live in `src/lib/career-assessment.ts` (static set; admin can later move to DB).

## 2. Database (single migration)

New tables, all in `public`, with GRANTs + RLS:

- `career_questions` — id, section (`personality|cognitive|interest`), prompt, options jsonb, correct_index (cognitive), axis (personality), weight, order_index. Seeded by migration.
- `career_assessment_answers` — id, user_id, question_id, answer jsonb, created_at.
- `career_assessment_results` — id, user_id, personality_type text(4), work_style, leadership_style, learning_style, team_style, cognitive_score int, cognitive_tier, cognitive_profile, interests jsonb, career_matches jsonb (top 15 `{key,name,score,category}`), university_matches jsonb (top 10), strengths jsonb, improvements jsonb, created_at.
- `careers` — id, key unique, name, category, description, salary_min, salary_max, demand_score, required_traits jsonb, required_profile text[], required_interests text[], required_skills text[]. Seeded with **80 careers** across the 16 categories (expandable to 200+ later by inserting rows; no code change).
- `university_majors` — id, key, name, category, related_career_keys text[], required_traits jsonb, required_profile text[], required_interests text[]. Seeded with 40 majors.
- `school_specialized_classes` already exists — extend with `focus_key` text.
- `school_users` — id, school_id, user_id, role (`principal|vice_principal|counselor|psychologist|teacher`), created_at. (Reuses school_members semantics for staff; principals can promote.)

SECURITY DEFINER RPCs:

- `submit_career_assessment(_answers jsonb)` — validates 30 answers, computes MBTI, cognitive, interests, runs the matching engine (40/35/25), persists row, awards +20 Aura, returns full result.
- `get_my_career_result()` — latest result.
- `school_career_overview(_school)` — aggregated stats per school (career, personality, cognitive, university distributions; grade heatmap).
- `school_build_class(_school, _focus, _size)` — top-N students by composite fit score for a focus area; inserts into `school_specialized_classes`.
- `school_at_risk(_school)` — students where current class declared vs. top career bucket diverges, with confidence.

## 3. Matching engine

Pure JS in `src/lib/career-engine.ts` (used inside RPC via plpgsql calling out is avoided — we run scoring in TS inside `submitCareerAssessment` server fn before INSERT; RPC only persists).

```
personality_fit = trait overlap (MBTI vs required_traits)   * 0.40
cognitive_fit   = clamp(cog_score/10 vs required_profile)   * 0.35
interest_fit    = weighted overlap (top interests)          * 0.25
```

Same engine drives:

- `careers` → top 15 with %
- `university_majors` → top 10 with %
- School aggregates (talent distribution, university readiness)

## 4. Server functions (`src/lib/career.functions.ts`, extend `schools.functions.ts`)

`submitCareerAssessment`, `getMyCareerResult`, `getCareerHistory`, `listCareers`, `listMajors`, `getSchoolCareerOverview`, `buildSpecializedClass`, `getAtRiskStudents`, `getTeacherLearningStyles`, `getGradeAnalytics`.

All use `requireSupabaseAuth`. Aura award via existing `aura_apply_delta`.

## 5. Routes

- `src/routes/career-assessment.tsx` — 30-question flow (sectioned, progress bar, autosave per section).
- `src/routes/career-results.tsx` — results dashboard: personality, cognitive profile, interests, strengths, improvements, **Top 15 careers**, **Top 10 majors**, recommended skills, share + print-PDF buttons.
- `src/routes/career-results.$resultId.tsx` — historical view.
- `src/routes/_authenticated/school.analytics.tsx` — executive school dashboard (career distribution bar, personality pie, cognitive histogram, university interest, grade heatmap).
- `src/routes/_authenticated/school.class-builder.tsx` — AI Class Builder (pick focus → see recommended students with %).
- `src/routes/_authenticated/school.university-readiness.tsx`.
- `src/routes/_authenticated/school.at-risk.tsx`.
- `src/routes/_authenticated/school.teacher.tsx` — learning-style breakdown + classroom tips.
- `src/routes/_authenticated/school.student.$userId.report.tsx` — parent PDF (print-styled).
- Extend `for-schools.tsx` pricing section with **Starter / Professional / Enterprise** + "Request Demo" / "Contact Sales".

## 6. Dashboard + Profile + ABBI integration

- Dashboard: new "Career Intelligence" card showing latest result snapshot + CTA to retake.
- ABBI: extend `abbi-knowledge.ts` to load `career_assessment_results` for current user and inject into system prompt (personality, cognitive, top 5 careers, top 3 majors). Personalized answers for "what careers fit me", etc.
- "Schools" navbar item: already exists as "For Schools" — rename surfaced label to **Schools** and add a conditional **School Dashboard** entry shown only when the user is a school staff member (via `getMySchoolContext`).

## 7. Aura

`submitCareerAssessment` calls `aura_apply_delta(user, +20, 'earn', 'career_assessment_completed')`. Existing AuraRewardToaster handles the ✨ +20 animation.

## 8. PDF / share

Parent and student reports = print-styled HTML routes with `@media print` + a "Download PDF" button that triggers `window.print()`. No new heavy dep. Share = native `navigator.share` with fallback to copy link.

## 9. Design

100% existing tokens: `--primary` purple, `glass` cards, `gradient-text`, `glow-purple`, Recharts wrapped in existing styling. No new colors.

## 10. What I won't change

- Existing MBTI / IQ / child assessments and results pages.
- Aura economy, Community, Roadmap, ABBI base UI, Market, For Schools v1 register/join.
- Logo / language / theme positions.

## 11. Defaults (proceeding unless you object)

- Career & major seed data: curated list (80 careers, 40 majors) — sufficient for realistic matches; expandable via SQL inserts.
- Cognitive scoring window: 10 MCQs, single correct answer.
- "School accounts" = any user that is `principal|vice_principal|counselor|psychologist|teacher` in `school_members`/`school_users`. Schools navbar item stays public (landing page); School Dashboard link only renders for staff.
- At-risk detection: student's `school_classes.name` keyword vs. top career bucket; confidence = top bucket score.
- PDF = print route (browser PDF), not server-rendered.
- No Stripe wiring for school plans in this pass.

Approve and I'll implement in one batch (migration + seed + engine + routes + ABBI + dashboard + navbar).
