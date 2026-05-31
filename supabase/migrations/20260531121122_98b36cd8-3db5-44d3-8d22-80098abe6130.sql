CREATE TABLE public.assessment_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  iq_score INTEGER NOT NULL,
  iq_level TEXT NOT NULL,
  logical_score INTEGER NOT NULL DEFAULT 0,
  analytical_score INTEGER NOT NULL DEFAULT 0,
  pattern_score INTEGER NOT NULL DEFAULT 0,
  mbti_type TEXT NOT NULL,
  mbti_scores JSONB NOT NULL DEFAULT '{}'::jsonb,
  interest_scores JSONB NOT NULL DEFAULT '{}'::jsonb,
  top_strengths JSONB NOT NULL DEFAULT '[]'::jsonb,
  weaknesses JSONB NOT NULL DEFAULT '[]'::jsonb,
  careers JSONB NOT NULL DEFAULT '[]'::jsonb,
  answers JSONB NOT NULL DEFAULT '{}'::jsonb,
  time_seconds INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.assessment_results TO authenticated;
GRANT ALL ON public.assessment_results TO service_role;

ALTER TABLE public.assessment_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "assessment_results_select_own" ON public.assessment_results
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "assessment_results_insert_own" ON public.assessment_results
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "assessment_results_delete_own" ON public.assessment_results
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE INDEX idx_assessment_results_user_created ON public.assessment_results(user_id, created_at DESC);