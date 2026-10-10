-- Target the active production project: kxlmpctcaevmognfmalb.
-- Verify in staging first. This is the result-storage part of migration
-- 20261009000000; it deliberately leaves profiles and the task journal alone.
-- Existing results are retained. Run again safely if deployment is interrupted.
BEGIN;
ALTER TABLE public.career_assessment_results
  ADD COLUMN IF NOT EXISTS session_nonce text;
CREATE UNIQUE INDEX IF NOT EXISTS assessment_session_once
  ON public.career_assessment_results (user_id, session_nonce)
  WHERE session_nonce IS NOT NULL;
-- Keep score writes server-authoritative; owners retain their existing reads.
REVOKE INSERT, UPDATE ON public.career_assessment_results FROM authenticated;
DROP POLICY IF EXISTS "results own insert" ON public.career_assessment_results;
COMMIT;

-- Read-only confirmation after applying:
SELECT column_name FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'career_assessment_results'
  AND column_name = 'session_nonce';
