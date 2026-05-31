CREATE TABLE public.assessment_sessions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL UNIQUE,
  question_order jsonb NOT NULL DEFAULT '[]'::jsonb,
  option_order jsonb NOT NULL DEFAULT '{}'::jsonb,
  answers jsonb NOT NULL DEFAULT '{}'::jsonb,
  step integer NOT NULL DEFAULT 0,
  started_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.assessment_sessions TO authenticated;
GRANT ALL ON public.assessment_sessions TO service_role;

ALTER TABLE public.assessment_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "assessment_sessions_select_own" ON public.assessment_sessions
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "assessment_sessions_insert_own" ON public.assessment_sessions
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "assessment_sessions_update_own" ON public.assessment_sessions
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "assessment_sessions_delete_own" ON public.assessment_sessions
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.touch_assessment_sessions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER assessment_sessions_set_updated_at
BEFORE UPDATE ON public.assessment_sessions
FOR EACH ROW EXECUTE FUNCTION public.touch_assessment_sessions_updated_at();