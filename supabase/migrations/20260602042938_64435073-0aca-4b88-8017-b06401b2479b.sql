
-- User stats (single row per user)
CREATE TABLE public.user_stats (
  user_id uuid NOT NULL PRIMARY KEY,
  sat_score integer,
  ielts_band numeric(3,1),
  study_progress integer NOT NULL DEFAULT 0,
  leadership_level integer NOT NULL DEFAULT 0,
  productivity_level integer NOT NULL DEFAULT 0,
  creativity_score integer NOT NULL DEFAULT 0,
  communication_score integer NOT NULL DEFAULT 0,
  emotional_intelligence integer NOT NULL DEFAULT 0,
  tagline text,
  avatar_url text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_stats TO authenticated;
GRANT ALL ON public.user_stats TO service_role;

ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_stats_select_own" ON public.user_stats FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "user_stats_insert_own" ON public.user_stats FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "user_stats_update_own" ON public.user_stats FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "user_stats_delete_own" ON public.user_stats FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TRIGGER trg_user_stats_updated_at
BEFORE UPDATE ON public.user_stats
FOR EACH ROW EXECUTE FUNCTION public.touch_assessment_sessions_updated_at();

-- User achievements (many rows per user)
CREATE TABLE public.user_achievements (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  description text,
  icon text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_achievements TO authenticated;
GRANT ALL ON public.user_achievements TO service_role;

ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_achievements_select_own" ON public.user_achievements FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "user_achievements_insert_own" ON public.user_achievements FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "user_achievements_update_own" ON public.user_achievements FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "user_achievements_delete_own" ON public.user_achievements FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TRIGGER trg_user_achievements_updated_at
BEFORE UPDATE ON public.user_achievements
FOR EACH ROW EXECUTE FUNCTION public.touch_assessment_sessions_updated_at();

CREATE INDEX idx_user_achievements_user ON public.user_achievements(user_id, created_at DESC);
