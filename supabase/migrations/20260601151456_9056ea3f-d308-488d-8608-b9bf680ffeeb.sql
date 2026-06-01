CREATE TABLE public.aura_purchase_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  package_key TEXT NOT NULL,
  coins INTEGER NOT NULL CHECK (coins > 0),
  uzs_amount INTEGER NOT NULL CHECK (uzs_amount > 0),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected','cancelled')),
  contact_note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.aura_purchase_requests TO authenticated;
GRANT ALL ON public.aura_purchase_requests TO service_role;

ALTER TABLE public.aura_purchase_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "purchase_select_own" ON public.aura_purchase_requests
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "purchase_insert_own" ON public.aura_purchase_requests
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "purchase_cancel_own" ON public.aura_purchase_requests
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id AND status = 'pending')
  WITH CHECK (auth.uid() = user_id AND status IN ('pending','cancelled'));

CREATE INDEX idx_aura_purchase_requests_user ON public.aura_purchase_requests(user_id, created_at DESC);