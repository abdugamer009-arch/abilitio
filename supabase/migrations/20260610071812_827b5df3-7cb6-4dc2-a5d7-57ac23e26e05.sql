
-- ============ TABLES ============
CREATE TABLE public.schools (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  name text NOT NULL,
  principal_name text NOT NULL,
  email text NOT NULL,
  phone text,
  city text,
  country text,
  student_count_estimate int DEFAULT 0,
  plan text NOT NULL DEFAULT 'starter' CHECK (plan IN ('starter','professional','enterprise')),
  owner_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.schools TO authenticated;
GRANT ALL ON public.schools TO service_role;
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.school_classes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  name text NOT NULL,
  grade int,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(school_id, name)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.school_classes TO authenticated;
GRANT ALL ON public.school_classes TO service_role;
ALTER TABLE public.school_classes ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.school_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('principal','teacher','student')),
  class_id uuid REFERENCES public.school_classes(id) ON DELETE SET NULL,
  joined_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(school_id, user_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.school_members TO authenticated;
GRANT ALL ON public.school_members TO service_role;
ALTER TABLE public.school_members ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.school_specialized_classes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  title text NOT NULL,
  focus text NOT NULL,
  reason text NOT NULL,
  student_user_ids uuid[] NOT NULL DEFAULT '{}',
  created_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.school_specialized_classes TO authenticated;
GRANT ALL ON public.school_specialized_classes TO service_role;
ALTER TABLE public.school_specialized_classes ENABLE ROW LEVEL SECURITY;

-- ============ HELPERS ============
CREATE OR REPLACE FUNCTION public.is_school_principal(_user uuid, _school uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.schools WHERE id = _school AND owner_user_id = _user);
$$;

CREATE OR REPLACE FUNCTION public.is_school_member(_user uuid, _school uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.school_members WHERE user_id = _user AND school_id = _school);
$$;

-- ============ POLICIES ============
CREATE POLICY "schools_select_member_or_principal" ON public.schools
  FOR SELECT TO authenticated
  USING (owner_user_id = auth.uid() OR public.is_school_member(auth.uid(), id));

CREATE POLICY "school_classes_select_members" ON public.school_classes
  FOR SELECT TO authenticated
  USING (public.is_school_member(auth.uid(), school_id) OR public.is_school_principal(auth.uid(), school_id));

CREATE POLICY "school_members_select_self_or_principal" ON public.school_members
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_school_principal(auth.uid(), school_id));

CREATE POLICY "school_specialized_select_principal" ON public.school_specialized_classes
  FOR SELECT TO authenticated
  USING (public.is_school_principal(auth.uid(), school_id));

CREATE POLICY "school_specialized_modify_principal" ON public.school_specialized_classes
  FOR ALL TO authenticated
  USING (public.is_school_principal(auth.uid(), school_id))
  WITH CHECK (public.is_school_principal(auth.uid(), school_id));

-- ============ RPCs ============
CREATE OR REPLACE FUNCTION public.generate_school_code()
RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  candidate text;
  yr text := to_char(now(), 'YYYY');
  i int := 0;
BEGIN
  LOOP
    candidate := 'NVS-' || yr || '-' || upper(substring(md5(random()::text || clock_timestamp()::text) from 1 for 4));
    EXIT WHEN NOT EXISTS (SELECT 1 FROM public.schools WHERE code = candidate);
    i := i + 1;
    IF i > 10 THEN RAISE EXCEPTION 'code_generation_failed'; END IF;
  END LOOP;
  RETURN candidate;
END;
$$;

CREATE OR REPLACE FUNCTION public.register_school(
  _name text, _principal_name text, _email text, _phone text,
  _students int, _city text, _country text
) RETURNS public.schools
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  uid uuid := auth.uid();
  s public.schools;
  new_code text;
  plan_choice text := 'starter';
BEGIN
  IF uid IS NULL THEN RAISE EXCEPTION 'unauthenticated'; END IF;
  IF length(coalesce(_name,'')) < 2 THEN RAISE EXCEPTION 'invalid_name'; END IF;
  IF _students > 500 THEN plan_choice := 'enterprise';
  ELSIF _students > 100 THEN plan_choice := 'professional';
  END IF;
  new_code := public.generate_school_code();
  INSERT INTO public.schools(code, name, principal_name, email, phone, city, country, student_count_estimate, plan, owner_user_id)
    VALUES (new_code, _name, _principal_name, _email, _phone, _city, _country, coalesce(_students,0), plan_choice, uid)
    RETURNING * INTO s;
  INSERT INTO public.school_members(school_id, user_id, role) VALUES (s.id, uid, 'principal')
    ON CONFLICT DO NOTHING;
  RETURN s;
END;
$$;

CREATE OR REPLACE FUNCTION public.join_school(_code text, _class_name text)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  uid uuid := auth.uid();
  s_id uuid;
  c_id uuid;
BEGIN
  IF uid IS NULL THEN RAISE EXCEPTION 'unauthenticated'; END IF;
  IF length(coalesce(_class_name,'')) = 0 OR length(_class_name) > 16 THEN RAISE EXCEPTION 'invalid_class'; END IF;
  SELECT id INTO s_id FROM public.schools WHERE code = upper(_code);
  IF s_id IS NULL THEN RAISE EXCEPTION 'invalid_code'; END IF;
  INSERT INTO public.school_classes(school_id, name) VALUES (s_id, _class_name)
    ON CONFLICT (school_id, name) DO UPDATE SET name = EXCLUDED.name
    RETURNING id INTO c_id;
  INSERT INTO public.school_members(school_id, user_id, role, class_id)
    VALUES (s_id, uid, 'student', c_id)
    ON CONFLICT (school_id, user_id) DO UPDATE SET class_id = EXCLUDED.class_id;
  RETURN s_id;
END;
$$;
