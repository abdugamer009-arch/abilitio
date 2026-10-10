-- Owner-run release migration. Review in staging; existing rows are preserved.
BEGIN;
ALTER TABLE public.career_assessment_results ADD COLUMN IF NOT EXISTS session_nonce text;
ALTER TABLE public.career_assessment_results ADD COLUMN IF NOT EXISTS scoring_version text NOT NULL DEFAULT 'v1';
CREATE UNIQUE INDEX IF NOT EXISTS assessment_session_once ON public.career_assessment_results(user_id,session_nonce) WHERE session_nonce IS NOT NULL;
REVOKE INSERT, UPDATE ON public.career_assessment_results FROM authenticated;
DROP POLICY IF EXISTS "results own insert" ON public.career_assessment_results;

CREATE OR REPLACE FUNCTION public.protect_profile_moderation() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
 IF current_user NOT IN ('postgres','service_role','supabase_admin') AND COALESCE(auth.role(),'') <> 'service_role' THEN
  IF TG_OP = 'INSERT' THEN NEW.is_banned := false;
  ELSIF NEW.is_banned IS DISTINCT FROM OLD.is_banned OR NEW.id IS DISTINCT FROM OLD.id THEN
   RAISE EXCEPTION 'Moderation fields cannot be changed by the profile owner';
  END IF;
 END IF;
 RETURN NEW;
END; $$;
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
DROP POLICY IF EXISTS "task journal own read" ON public.roadmap_task_events;
DROP POLICY IF EXISTS "task journal own insert" ON public.roadmap_task_events;
DROP POLICY IF EXISTS "task journal own update" ON public.roadmap_task_events;
CREATE POLICY "task journal own read" ON public.roadmap_task_events FOR SELECT TO authenticated USING(auth.uid()=user_id);
CREATE POLICY "task journal own insert" ON public.roadmap_task_events FOR INSERT TO authenticated WITH CHECK(auth.uid()=user_id);
CREATE POLICY "task journal own update" ON public.roadmap_task_events FOR UPDATE TO authenticated USING(auth.uid()=user_id) WITH CHECK(auth.uid()=user_id);

-- Role rows are the shared authority for actions, RLS, badges and Realtime.
-- Preserve existing admins; provision the two existing founders if present.
INSERT INTO public.user_roles(user_id,role)
SELECT id,'admin'::public.app_role FROM auth.users
WHERE lower(email) IN ('abdugamer009@gmail.com','umaraxmedov0175@gmail.com') AND email_confirmed_at IS NOT NULL
ON CONFLICT (user_id,role) DO NOTHING;

CREATE OR REPLACE FUNCTION public.account_is_banned(_user uuid) RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
 SELECT COALESCE((SELECT is_banned FROM public.profiles WHERE id=_user),true);
$$;
REVOKE ALL ON FUNCTION public.account_is_banned(uuid) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.account_is_banned(uuid) TO authenticated,service_role;
CREATE OR REPLACE FUNCTION public.guard_banned_write() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
 IF auth.uid() IS NOT NULL AND COALESCE(auth.role(),'') <> 'service_role' AND public.account_is_banned(auth.uid()) THEN
  RAISE EXCEPTION 'account_banned' USING ERRCODE='42501';
 END IF;
 IF TG_OP='DELETE' THEN RETURN OLD; END IF;
 RETURN NEW;
END; $$;
REVOKE ALL ON FUNCTION public.guard_banned_write() FROM PUBLIC,anon,authenticated;
DO $$ DECLARE tbl text; BEGIN
 FOREACH tbl IN ARRAY ARRAY['community_messages','roadmap_task_events','user_stats','user_achievements','school_members','school_classes','school_specialized_classes','schools'] LOOP
  EXECUTE format('DROP TRIGGER IF EXISTS banned_write_guard ON public.%I',tbl);
  EXECUTE format('CREATE TRIGGER banned_write_guard BEFORE INSERT OR UPDATE OR DELETE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.guard_banned_write()',tbl);
 END LOOP;
END $$;

-- Principal reads only the names of students enrolled in that principal's school.
DROP POLICY IF EXISTS "principal reads enrolled profiles" ON public.profiles;
CREATE POLICY "principal reads enrolled profiles" ON public.profiles FOR SELECT TO authenticated USING (
 EXISTS (SELECT 1 FROM public.school_members sm JOIN public.schools s ON s.id=sm.school_id WHERE sm.user_id=profiles.id AND sm.role='student' AND s.owner_user_id=auth.uid())
);

-- Retired currency is not a trusted, client-writable reward system.
REVOKE INSERT,UPDATE,DELETE ON public.aura_wallets,public.aura_transactions,public.aura_achievements,public.aura_unlocks,public.aura_purchase_requests FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.aura_apply_delta(uuid,integer,text,text,jsonb) FROM PUBLIC,anon,authenticated;
REVOKE EXECUTE ON FUNCTION public.aura_unlock_feature(text,integer) FROM PUBLIC,anon,authenticated;

-- Peer avatar URLs are signed in the server author loader after message RLS.
-- No broad peer SELECT grant is added to user_stats or private storage.

CREATE OR REPLACE FUNCTION public.replace_school_specialized_classes(_school uuid,_classes jsonb)
RETURNS integer LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE item jsonb; student uuid; n integer := 0;
BEGIN
 IF NOT public.is_school_principal(auth.uid(),_school) OR public.account_is_banned(auth.uid()) THEN RAISE EXCEPTION 'forbidden'; END IF;
 IF _classes IS NULL OR jsonb_typeof(_classes) IS DISTINCT FROM 'array' OR jsonb_array_length(_classes)>32 THEN RAISE EXCEPTION 'invalid_classes'; END IF;
 PERFORM pg_advisory_xact_lock(hashtextextended(_school::text,0));
 FOR item IN SELECT value FROM jsonb_array_elements(_classes) LOOP
  IF length(COALESCE(item->>'title','')) NOT BETWEEN 1 AND 200 OR jsonb_typeof(item->'students') IS DISTINCT FROM 'array' OR jsonb_array_length(item->'students')>60 THEN RAISE EXCEPTION 'invalid_class'; END IF;
  FOR student IN SELECT value::uuid FROM jsonb_array_elements_text(item->'students') LOOP
   IF NOT EXISTS (SELECT 1 FROM public.school_members WHERE school_id=_school AND user_id=student AND role='student') THEN RAISE EXCEPTION 'student_not_enrolled'; END IF;
  END LOOP;
 END LOOP;
 DELETE FROM public.school_specialized_classes WHERE school_id=_school;
 FOR item IN SELECT value FROM jsonb_array_elements(_classes) LOOP
  INSERT INTO public.school_specialized_classes(school_id,title,focus,focus_key,reason,student_user_ids,created_by)
  VALUES(_school,item->>'title',item->>'focus',item->>'focus',item->>'reason',ARRAY(SELECT value::uuid FROM jsonb_array_elements_text(item->'students')),auth.uid());
  n := n+1;
 END LOOP;
 RETURN n;
END; $$;
REVOKE ALL ON FUNCTION public.replace_school_specialized_classes(uuid,jsonb) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.replace_school_specialized_classes(uuid,jsonb) TO authenticated;

CREATE OR REPLACE FUNCTION public.school_save_specialized_class(_school uuid,_title text,_focus text,_focus_key text,_reason text,_students uuid[])
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE saved uuid;
BEGIN
 IF NOT public.is_school_principal(auth.uid(),_school) OR public.account_is_banned(auth.uid()) THEN RAISE EXCEPTION 'forbidden'; END IF;
 IF _students IS NULL OR cardinality(_students)>60 OR COALESCE(length(_title),0) NOT BETWEEN 1 AND 200 OR EXISTS (SELECT 1 FROM unnest(_students) u WHERE NOT EXISTS(SELECT 1 FROM public.school_members m WHERE m.school_id=_school AND m.user_id=u AND m.role='student')) THEN RAISE EXCEPTION 'student_not_enrolled'; END IF;
 INSERT INTO public.school_specialized_classes(school_id,title,focus,focus_key,reason,student_user_ids,created_by)
 VALUES(_school,_title,_focus,_focus_key,_reason,_students,auth.uid()) RETURNING id INTO saved;
 RETURN saved;
END; $$;
REVOKE ALL ON FUNCTION public.school_save_specialized_class(uuid,text,text,text,text,uuid[]) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.school_save_specialized_class(uuid,text,text,text,text,uuid[]) TO authenticated;
COMMIT;
