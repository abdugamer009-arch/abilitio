
-- Guard aura_apply_delta so only owner / admin / service role can mutate a wallet
CREATE OR REPLACE FUNCTION public.aura_apply_delta(_user uuid, _amount integer, _kind text, _reason text, _meta jsonb DEFAULT '{}'::jsonb)
 RETURNS aura_wallets
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  w public.aura_wallets;
  caller uuid := auth.uid();
BEGIN
  -- Allow: service_role (caller IS NULL), wallet owner, or admin. Block everyone else.
  IF caller IS NOT NULL AND caller <> _user AND NOT public.has_role(caller, 'admin'::public.app_role) THEN
    RAISE EXCEPTION 'forbidden';
  END IF;

  INSERT INTO public.aura_wallets(user_id, balance) VALUES (_user, 0)
    ON CONFLICT (user_id) DO NOTHING;

  IF _amount < 0 THEN
    SELECT * INTO w FROM public.aura_wallets WHERE user_id = _user FOR UPDATE;
    IF w.balance + _amount < 0 THEN
      RAISE EXCEPTION 'insufficient_balance';
    END IF;
  END IF;

  UPDATE public.aura_wallets
    SET balance = balance + _amount,
        lifetime_earned = lifetime_earned + GREATEST(_amount, 0),
        lifetime_spent  = lifetime_spent  + GREATEST(-_amount, 0),
        updated_at = now()
    WHERE user_id = _user
    RETURNING * INTO w;

  INSERT INTO public.aura_transactions(user_id, amount, kind, reason, meta)
    VALUES (_user, _amount, _kind, _reason, _meta);

  RETURN w;
END;
$function$;

-- Remove direct user inserts on aura_achievements and aura_transactions.
-- Server functions now route through service-role (supabaseAdmin) which bypasses RLS.
DROP POLICY IF EXISTS ach_insert_own ON public.aura_achievements;
DROP POLICY IF EXISTS tx_insert_own  ON public.aura_transactions;
