-- ============ Admin read access to career_assessment_results ============
-- The admin dashboard reads assessment data for platform analytics. The
-- legacy `assessment_results` table had an "Admins read all results" policy,
-- but the live `career_assessment_results` table (which every assessment now
-- writes to) never got one. Without it, an admin's user-scoped query returns
-- only their own row, so MBTI/career distributions and completion counts read
-- as ~1. Mirror the legacy admin policy onto the live table.

CREATE POLICY "Admins read all career results" ON public.career_assessment_results
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
