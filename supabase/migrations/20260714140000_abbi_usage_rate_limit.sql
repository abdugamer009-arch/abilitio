-- ============ ABBI usage log (rate limiting) ============
-- ABBI chat is now free and unlimited-feeling, but the Claude-API-backed
-- endpoint must be protected from a single account draining the API budget.
-- One row is written per AI-backed reply; the server counts today's rows
-- per user and refuses further AI calls past a daily cap (falling back to
-- the free template engine).

CREATE TABLE IF NOT EXISTS public.abbi_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS abbi_usage_user_day_idx ON public.abbi_usage(user_id, created_at DESC);

GRANT SELECT, INSERT ON public.abbi_usage TO authenticated;
GRANT ALL ON public.abbi_usage TO service_role;

ALTER TABLE public.abbi_usage ENABLE ROW LEVEL SECURITY;
CREATE POLICY "abbi_usage own select" ON public.abbi_usage FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "abbi_usage own insert" ON public.abbi_usage FOR INSERT WITH CHECK (auth.uid() = user_id);
