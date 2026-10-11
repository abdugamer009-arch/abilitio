-- Nullable: historical answers cannot be recovered from projected field weights.
BEGIN;
ALTER TABLE public.career_assessment_results
  ADD COLUMN IF NOT EXISTS riasec_profile jsonb;
COMMIT;
