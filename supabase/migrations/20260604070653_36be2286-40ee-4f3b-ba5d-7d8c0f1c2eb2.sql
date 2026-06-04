
-- App roles enum + user_roles table
CREATE TYPE public.app_role AS ENUM ('admin','user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.has_role(_user_id, 'admin'::public.app_role)
$$;

CREATE POLICY "Users read own roles, admins read all" ON public.user_roles
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- Add age_group + is_banned to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS age_group text CHECK (age_group IN ('child','teen','adult')),
  ADD COLUMN IF NOT EXISTS is_banned boolean NOT NULL DEFAULT false;

-- Admin can read/update all profiles
CREATE POLICY "Admins read all profiles" ON public.profiles
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update all profiles" ON public.profiles
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Admins can read aura wallets / transactions / assessment results / stats
CREATE POLICY "Admins read all wallets" ON public.aura_wallets
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins read all transactions" ON public.aura_transactions
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins read all results" ON public.assessment_results
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins read all stats" ON public.user_stats
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Upgrade handle_new_user trigger: if email matches abdugamer009@gmail.com,
-- grant admin role + 999999 aura.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, name, surname)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'surname', '')
  );

  -- Default user role
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user')
    ON CONFLICT (user_id, role) DO NOTHING;

  -- Admin bootstrap for the founder account
  IF lower(NEW.email) = 'abdugamer009@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin')
      ON CONFLICT (user_id, role) DO NOTHING;
    INSERT INTO public.aura_wallets (user_id, balance, lifetime_earned)
      VALUES (NEW.id, 999999, 999999)
      ON CONFLICT (user_id) DO UPDATE SET balance = 999999, lifetime_earned = GREATEST(public.aura_wallets.lifetime_earned, 999999);
  END IF;

  RETURN NEW;
END;
$$;

-- Ensure trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Admin aura admin operations function (atomic add/remove)
CREATE OR REPLACE FUNCTION public.admin_adjust_aura(_target uuid, _amount integer, _reason text)
RETURNS public.aura_wallets LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  w public.aura_wallets;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'forbidden';
  END IF;
  SELECT * INTO w FROM public.aura_apply_delta(
    _target, _amount,
    CASE WHEN _amount >= 0 THEN 'earn' ELSE 'spend' END,
    COALESCE(_reason, 'admin_adjust'),
    jsonb_build_object('by', auth.uid())
  );
  RETURN w;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_set_ban(_target uuid, _banned boolean)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'forbidden';
  END IF;
  UPDATE public.profiles SET is_banned = _banned, updated_at = now() WHERE id = _target;
END;
$$;
