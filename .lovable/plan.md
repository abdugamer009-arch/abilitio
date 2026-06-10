# For Schools — Implementation Plan

Large feature set. Shipping in one cohesive pass with sensible defaults. All existing systems (Aura, Community, Roadmap, ABBI, Market, premium purple identity) untouched.

## 1. Navbar

`src/components/Navbar.tsx` — insert `For Schools` (→ `/for-schools`) between Market and About. Logo / language / theme positions unchanged.

## 2. Database (single migration)

New tables (all in `public`, with GRANTs + RLS):

- `schools` — id, code (unique, e.g. `NVS-2026-A1B2`), name, principal_name, email, phone, city, country, student_count_estimate, plan (`starter|professional|enterprise`), owner_user_id, created_at.
- `school_classes` — id, school_id, name (`9A`), grade, created_at, UNIQUE(school_id, name).
- `school_members` — id, school_id, user_id, role (`principal|teacher|student`), class_id (nullable, students only), joined_at, UNIQUE(school_id, user_id).
- `school_specialized_classes` — id, school_id, title, focus (engineering/business/…), reason, student_user_ids uuid[], created_by, created_at. (AI-generated suggestions, editable.)

Helpers (SECURITY DEFINER):
- `generate_school_code()` → unique `NVS-YYYY-XXXX`.
- `register_school(name, principal_name, email, phone, students, city, country)` → creates school + adds caller as principal. Returns row.
- `join_school(code, class_name)` → looks up school, upserts class, inserts member as student. Returns school_id.
- `is_school_principal(_user, _school)`, `is_school_member(_user, _school)` — for policies (no recursion).
- `school_overview(_school)` → JSON aggregated stats (totals, completion rate, talent buckets, career counts).
- `school_class_breakdown(_school)` → per-class JSON.
- `school_top_talents(_school)` → top 5 per dimension.
- `school_suggest_classes(_school)` → groups by top career bucket; inserts into `school_specialized_classes`; returns rows.

RLS:
- `schools`: SELECT to members + principal; INSERT via `register_school` only.
- `school_classes`: SELECT to members; INSERT/UPDATE via RPC.
- `school_members`: SELECT own row + principal of same school; INSERT via `join_school`/`register_school`; DELETE by principal.
- `school_specialized_classes`: SELECT/INSERT/UPDATE/DELETE principal only.

GRANTs to `authenticated` + `service_role` per project rules.

## 3. Server functions (`src/lib/schools.functions.ts`)

All use `requireSupabaseAuth`:
- `registerSchool(input)` — Zod-validated, calls `register_school` RPC.
- `joinSchool({ code, className })` — Zod-validated, calls `join_school`.
- `getMySchoolContext()` — returns `{ role, school, class }` for current user (or null).
- `getPrincipalDashboard()` — overview + class breakdown + top talents.
- `getClassDetails(classId)` — students with redacted results (name + top career + MBTI).
- `generateSpecializedClasses()` — runs AI sort by career bucket; persists.
- `listSchoolSuggestions()` / `deleteSchoolSuggestion(id)`.
- `getTeacherDashboard()` — limited view scoped to assigned classes.

Sorting logic = pure JS over `assessment_results` rows joined to members (career_match top entry, MBTI traits, IQ).

## 4. Routes

- `src/routes/for-schools.tsx` — public marketing landing: hero, value prop, plans (Starter/Pro/Enterprise), two CTAs: "Register School" / "Join as Student".
- `src/routes/_authenticated/school.register.tsx` — registration form. On success: success card with generated school code (copy button), CTA to principal dashboard.
- `src/routes/_authenticated/school.join.tsx` — code + class form. Redirects to dashboard.
- `src/routes/_authenticated/school.dashboard.tsx` — principal dashboard (overview cards + Recharts: talent distribution bar, career distribution pie, class comparison stacked bar; top talents grid; AI Insights cards; "Generate Specialized Classes" button; reports download).
- `src/routes/_authenticated/school.class.$classId.tsx` — class drilldown.
- `src/routes/_authenticated/school.teacher.tsx` — teacher view (read-only class analytics).

Add small auth-aware entry on student dashboard: "Join your school" card if not yet a member.

## 5. AI Insights

Heuristic strings derived from aggregates (no extra LLM call needed for v1):
- Highest career bucket → "Class X shows strong Y potential."
- Grade-level concentration of leaders → leadership insight.
- Engineering vs creative balance comments.

(Open to upgrade to Lovable AI later — kept deterministic to avoid cost in dashboard render.)

## 6. PDF reports

Use existing browser `window.print()` route variants for v1 (print-styled pages with `@media print`):
- `school.report.tsx` (school-wide).
- `school.student.$userId.report.tsx` (parent report).
Both render a clean white printable layout. No new heavy dep. If user later wants true PDF, swap to `pdf-lib` server fn.

## 7. Subscription plans

UI-only tiers on the landing page + dashboard banner showing current plan. Enforcement: soft cap on `join_school` (warns when over plan limit; principal can upgrade via "Contact us" CTA — no payment integration in this pass unless user asks).

## 8. Design

Reuse glass cards, gradient headers, Recharts wrapped in `ChartContainer` (shadcn). No new colors — uses existing `--primary` purple tokens.

## 9. What I won't change

- Existing routes, Aura economy, Community, Roadmap, ABBI, Market.
- Logo / language / theme positions.
- Student assessment flow (just reads results).

## Defaults (proceeding unless you object)

- School code format: `NVS-{year}-{4 alnum}` (regenerate on collision).
- One school per user as principal; students belong to one school + one class.
- Career buckets mapped from existing assessment career keys → 8 groups (engineering, business, medical, creative, communication, research, technology, leadership).
- Teacher accounts: principal can promote a member to `teacher` and assign class(es). Single class per teacher in v1.
- PDF = print-styled HTML route (no new dep).
- No Stripe wiring for school plans yet.

Approve and I'll implement.
