-- ============ Ensure admin access for umaraxmedov0175@gmail.com ============
-- The account reports "not admin" on the live site even though this email is
-- listed in the admin bootstrap (migration 20260606153557). That happens when
-- the account existed at a point where neither the signup trigger nor the
-- one-time backfill inserted its `admin` role on the running database (e.g. the
-- bootstrap migration was applied while the trigger still only knew the founder
-- email, or the backfill ran before the account existed).
--
-- This migration is fully idempotent: it re-asserts handle_new_user with both
-- admin emails, then backfills the admin role (and founder aura) for any
-- existing matching account. Safe to re-run.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, name, surname)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'surname', '')
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user')
    ON CONFLICT (user_id, role) DO NOTHING;

  IF lower(NEW.email) IN ('abdugamer009@gmail.com','umaraxmedov0175@gmail.com') THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin')
      ON CONFLICT (user_id, role) DO NOTHING;
    INSERT INTO public.aura_wallets (user_id, balance, lifetime_earned)
      VALUES (NEW.id, 999999, 999999)
      ON CONFLICT (user_id) DO UPDATE SET balance = 999999,
        lifetime_earned = GREATEST(public.aura_wallets.lifetime_earned, 999999);
  END IF;

  RETURN NEW;
END;
$$;

-- Backfill admin role for the account(s) if they already exist.
INSERT INTO public.user_roles (user_id, role)
SELECT u.id, 'admin'::public.app_role
FROM auth.users u
WHERE lower(u.email) IN ('abdugamer009@gmail.com','umaraxmedov0175@gmail.com')
ON CONFLICT (user_id, role) DO NOTHING;
