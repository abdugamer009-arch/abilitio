ALTER TABLE public.schools ADD COLUMN invite_expires_at timestamptz NOT NULL DEFAULT (now() + interval '30 days');
CREATE TABLE public.school_join_attempts (
 user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
 window_started_at timestamptz NOT NULL DEFAULT now(),
 attempts integer NOT NULL DEFAULT 0 CHECK (attempts >= 0)
);
ALTER TABLE public.school_join_attempts ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.school_join_attempts FROM anon, authenticated;
GRANT ALL ON public.school_join_attempts TO service_role;

CREATE OR REPLACE FUNCTION public.generate_school_code() RETURNS text
LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
 SELECT 'NVS-' || upper(replace(gen_random_uuid()::text, '-', ''))
$$;
REVOKE ALL ON FUNCTION public.generate_school_code() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.generate_school_code() TO service_role;
-- Rotate the short legacy invitations, without touching any memberships.
UPDATE public.schools SET code=public.generate_school_code()
 WHERE code ~ '^NVS-[0-9]{4}-[A-F0-9]{4}$';

CREATE OR REPLACE FUNCTION public.join_school(_code text, _class_name text)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
 uid uuid := auth.uid(); s_id uuid; c_id uuid; n integer;
BEGIN
 IF uid IS NULL THEN RAISE EXCEPTION 'unauthenticated'; END IF;
 IF public.account_is_banned(uid) THEN RAISE EXCEPTION 'account_banned'; END IF;
 -- Return NULL for invalid/rate-limited invitations so failed attempts commit
 -- their counter. Raising an exception here would roll the counter back.
 INSERT INTO public.school_join_attempts AS a(user_id,attempts) VALUES (uid,1)
 ON CONFLICT (user_id) DO UPDATE SET
  attempts=CASE WHEN a.window_started_at <= now()-interval '1 hour' THEN 1 ELSE a.attempts+1 END,
  window_started_at=CASE WHEN a.window_started_at <= now()-interval '1 hour' THEN now() ELSE a.window_started_at END
 RETURNING attempts INTO n;
 IF n > 10 THEN RETURN NULL; END IF;
 IF coalesce(_class_name,'') !~ '^[A-Za-z0-9 -]{1,16}$' OR length(coalesce(_code,'')) > 40 THEN RETURN NULL; END IF;
 SELECT id INTO s_id FROM public.schools WHERE code=upper(trim(_code)) AND invite_expires_at > now();
 IF s_id IS NULL THEN RETURN NULL; END IF;
 INSERT INTO public.school_classes(school_id,name) VALUES (s_id,upper(trim(_class_name)))
 ON CONFLICT (school_id,name) DO UPDATE SET name=EXCLUDED.name RETURNING id INTO c_id;
 INSERT INTO public.school_members(school_id,user_id,role,class_id) VALUES (s_id,uid,'student',c_id)
 ON CONFLICT (school_id,user_id) DO UPDATE SET class_id=EXCLUDED.class_id;
 RETURN s_id;
END;
$$;
REVOKE ALL ON FUNCTION public.join_school(text,text) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.join_school(text,text) TO authenticated;

CREATE OR REPLACE FUNCTION public.renew_school_invitation(_school_id uuid)
RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE new_code text;
BEGIN
 IF auth.uid() IS NULL OR public.account_is_banned(auth.uid()) THEN RAISE EXCEPTION 'forbidden'; END IF;
 IF NOT EXISTS (SELECT 1 FROM public.schools WHERE id=_school_id AND owner_user_id=auth.uid()) THEN RAISE EXCEPTION 'not_principal'; END IF;
 new_code := public.generate_school_code();
 UPDATE public.schools SET code=new_code,invite_expires_at=now()+interval '30 days' WHERE id=_school_id;
 RETURN new_code;
END;
$$;
REVOKE ALL ON FUNCTION public.renew_school_invitation(uuid) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.renew_school_invitation(uuid) TO authenticated;
