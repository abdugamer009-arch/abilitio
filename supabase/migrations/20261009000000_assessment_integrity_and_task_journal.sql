-- Review/apply in staging first. Server submission now writes validated scores
-- using the service-role client; ordinary owners keep read access only.
ALTER TABLE public.career_assessment_results ADD COLUMN IF NOT EXISTS session_nonce text;
CREATE UNIQUE INDEX IF NOT EXISTS assessment_session_once ON public.career_assessment_results(user_id,session_nonce) WHERE session_nonce IS NOT NULL;
REVOKE INSERT, UPDATE ON public.career_assessment_results FROM authenticated;
DROP POLICY IF EXISTS "results own insert" ON public.career_assessment_results;
-- RLS ownership alone does not protect moderation columns. Enforce immutable
-- moderation/identity on every non-service update/insert, including owner inserts.
CREATE OR REPLACE FUNCTION public.protect_profile_moderation() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
 IF current_user NOT IN ('postgres','service_role','supabase_admin') AND COALESCE(auth.role(),'') <> 'service_role' THEN
  IF TG_OP = 'INSERT' THEN NEW.is_banned := false;
  ELSIF NEW.is_banned IS DISTINCT FROM OLD.is_banned OR NEW.id IS DISTINCT FROM OLD.id THEN
   RAISE EXCEPTION 'Moderation fields cannot be changed by the profile owner';
  END IF;
 END IF;
 RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS profile_moderation_guard ON public.profiles;
CREATE TRIGGER profile_moderation_guard BEFORE INSERT OR UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.protect_profile_moderation();

CREATE TABLE IF NOT EXISTS public.roadmap_task_events (
 user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
 task_id text NOT NULL CHECK(length(task_id) BETWEEN 1 AND 100),
 completed boolean NOT NULL DEFAULT true,
 updated_at timestamptz NOT NULL DEFAULT now(),
 PRIMARY KEY(user_id,task_id)
);
ALTER TABLE public.roadmap_task_events ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE ON public.roadmap_task_events TO authenticated;
GRANT ALL ON public.roadmap_task_events TO service_role;
CREATE POLICY "task journal own read" ON public.roadmap_task_events FOR SELECT TO authenticated USING(auth.uid()=user_id);
CREATE POLICY "task journal own insert" ON public.roadmap_task_events FOR INSERT TO authenticated WITH CHECK(auth.uid()=user_id);
CREATE POLICY "task journal own update" ON public.roadmap_task_events FOR UPDATE TO authenticated USING(auth.uid()=user_id) WITH CHECK(auth.uid()=user_id);
