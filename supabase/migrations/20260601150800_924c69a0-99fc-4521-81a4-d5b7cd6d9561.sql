-- Aura Coins ecosystem foundation
CREATE TABLE public.aura_wallets (
  user_id UUID PRIMARY KEY,
  balance INTEGER NOT NULL DEFAULT 0,
  lifetime_earned INTEGER NOT NULL DEFAULT 0,
  lifetime_spent INTEGER NOT NULL DEFAULT 0,
  streak_days INTEGER NOT NULL DEFAULT 0,
  last_login_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.aura_wallets TO authenticated;
GRANT ALL ON public.aura_wallets TO service_role;
ALTER TABLE public.aura_wallets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "wallet_select_own" ON public.aura_wallets FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "wallet_insert_own" ON public.aura_wallets FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "wallet_update_own" ON public.aura_wallets FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.aura_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  amount INTEGER NOT NULL,
  kind TEXT NOT NULL,
  reason TEXT NOT NULL,
  meta JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_aura_tx_user ON public.aura_transactions(user_id, created_at DESC);
GRANT SELECT, INSERT ON public.aura_transactions TO authenticated;
GRANT ALL ON public.aura_transactions TO service_role;
ALTER TABLE public.aura_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tx_select_own" ON public.aura_transactions FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "tx_insert_own" ON public.aura_transactions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.aura_unlocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  feature_key TEXT NOT NULL,
  unlocked_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, feature_key)
);
GRANT SELECT, INSERT ON public.aura_unlocks TO authenticated;
GRANT ALL ON public.aura_unlocks TO service_role;
ALTER TABLE public.aura_unlocks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "unlock_select_own" ON public.aura_unlocks FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "unlock_insert_own" ON public.aura_unlocks FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.aura_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  achievement_key TEXT NOT NULL,
  unlocked_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, achievement_key)
);
GRANT SELECT, INSERT ON public.aura_achievements TO authenticated;
GRANT ALL ON public.aura_achievements TO service_role;
ALTER TABLE public.aura_achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ach_select_own" ON public.aura_achievements FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "ach_insert_own" ON public.aura_achievements FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Atomic credit/debit function
CREATE OR REPLACE FUNCTION public.aura_apply_delta(_user UUID, _amount INTEGER, _kind TEXT, _reason TEXT, _meta JSONB DEFAULT '{}'::jsonb)
RETURNS public.aura_wallets
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  w public.aura_wallets;
BEGIN
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
$$;
GRANT EXECUTE ON FUNCTION public.aura_apply_delta(UUID, INTEGER, TEXT, TEXT, JSONB) TO authenticated, service_role;