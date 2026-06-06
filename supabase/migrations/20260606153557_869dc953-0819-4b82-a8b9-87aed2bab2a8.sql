
-- ============================================================
-- COMMUNITY SYSTEM + ADMIN BOOTSTRAP + AURA SECURITY HARDENING
-- ============================================================

-- 1) Communities
CREATE TABLE public.communities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  career_key text UNIQUE NOT NULL,
  description text NOT NULL DEFAULT '',
  welcome_message text NOT NULL DEFAULT '',
  member_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.communities TO authenticated;
GRANT ALL ON public.communities TO service_role;
ALTER TABLE public.communities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "communities_read_auth" ON public.communities FOR SELECT TO authenticated USING (true);

-- 2) Community members
CREATE TABLE public.community_members (
  community_id uuid NOT NULL REFERENCES public.communities(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  joined_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (community_id, user_id)
);
GRANT SELECT ON public.community_members TO authenticated;
GRANT ALL ON public.community_members TO service_role;
ALTER TABLE public.community_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "members_read_own_or_admin" ON public.community_members
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

-- 3) Messages
CREATE TABLE public.community_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id uuid NOT NULL REFERENCES public.communities(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  content text NOT NULL CHECK (length(content) BETWEEN 1 AND 2000),
  is_pinned boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX community_messages_community_idx ON public.community_messages(community_id, created_at DESC);
GRANT SELECT, INSERT, DELETE ON public.community_messages TO authenticated;
GRANT ALL ON public.community_messages TO service_role;
ALTER TABLE public.community_messages ENABLE ROW LEVEL SECURITY;

-- Membership check (security definer to avoid recursion concerns)
CREATE OR REPLACE FUNCTION public.is_community_member(_user uuid, _community uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.community_members WHERE user_id = _user AND community_id = _community
  );
$$;

CREATE POLICY "msg_read_member_or_admin" ON public.community_messages
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.is_community_member(auth.uid(), community_id));

CREATE POLICY "msg_insert_member_or_admin" ON public.community_messages
  FOR INSERT TO authenticated
  WITH CHECK (
    user_id = auth.uid()
    AND (public.has_role(auth.uid(), 'admin') OR public.is_community_member(auth.uid(), community_id))
  );

CREATE POLICY "msg_delete_own_or_admin" ON public.community_messages
  FOR DELETE TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

-- Pin/unpin via admin-only RPC; no UPDATE policy.

-- 4) Daily question
CREATE TABLE public.community_daily_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id uuid NOT NULL REFERENCES public.communities(id) ON DELETE CASCADE,
  question text NOT NULL CHECK (length(question) BETWEEN 1 AND 500),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX cdq_community_idx ON public.community_daily_questions(community_id, created_at DESC);
GRANT SELECT ON public.community_daily_questions TO authenticated;
GRANT ALL ON public.community_daily_questions TO service_role;
ALTER TABLE public.community_daily_questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "cdq_read_member_or_admin" ON public.community_daily_questions
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.is_community_member(auth.uid(), community_id));

-- 5) Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.community_messages;

-- 6) Seed communities (matches CAREERS in abbi-knowledge)
INSERT INTO public.communities (slug, name, career_key, description, welcome_message) VALUES
  ('software-engineering','Software Engineering','Software Engineer','Builders, debuggers, and system designers.','Welcome to the Software Engineering Community. Connect with people who share similar strengths and career interests.'),
  ('data-analytics','Data Analytics','Data Analyst','Turn data into decisions.','Welcome to the Data Analytics Community.'),
  ('data-science','Data Science','Data Scientist','Models, experiments and ML.','Welcome to the Data Science Community.'),
  ('cybersecurity','Cybersecurity','Cybersecurity Specialist','Defenders of the digital frontier.','Welcome to the Cybersecurity Community.'),
  ('product-management','Product Management','Product Manager','Vision, strategy, execution.','Welcome to the Product Management Community.'),
  ('design','Design','UX / UI Designer','Designers crafting human-centered products.','Welcome to the Design Community.'),
  ('creative','Creative & Graphic','Graphic Designer','Visual storytellers.','Welcome to the Creative Community.'),
  ('psychology','Psychology','Psychologist','Understanding minds and behavior.','Welcome to the Psychology Community.'),
  ('journalism','Journalism','Journalist','Storytellers and truth seekers.','Welcome to the Journalism Community.'),
  ('marketing','Marketing','Marketing Specialist','Strategy, growth and brand.','Welcome to the Marketing Community.'),
  ('public-relations','Public Relations','Public Relations Manager','Narrative and reputation builders.','Welcome to the PR Community.'),
  ('education','Education','Teacher','Educators shaping the next generation.','Welcome to the Education Community.'),
  ('medicine','Medicine','Doctor','Healers and life sciences.','Welcome to the Medicine Community.'),
  ('business-analysis','Business Analysis','Business Analyst','Bridging business and tech.','Welcome to the Business Analysis Community.'),
  ('entrepreneurship','Entrepreneurship','Entrepreneur','Founders and operators.','Welcome to the Entrepreneurship Community.'),
  ('finance','Finance & Accounting','Accountant','Numbers, audits, and capital.','Welcome to the Finance Community.'),
  ('law','Law','Lawyer','Legal minds and advocates.','Welcome to the Law Community.'),
  ('general','General Talent','__general__','For everyone exploring their path.','Welcome to the General Talent Community.');

-- 7) Assign-user-to-community RPC (called from server fn after results are saved)
CREATE OR REPLACE FUNCTION public.assign_user_to_community(_career_key text)
RETURNS uuid
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  cid uuid;
  uid uuid := auth.uid();
BEGIN
  IF uid IS NULL THEN
    RAISE EXCEPTION 'unauthenticated';
  END IF;
  SELECT id INTO cid FROM public.communities WHERE career_key = _career_key;
  IF cid IS NULL THEN
    SELECT id INTO cid FROM public.communities WHERE career_key = '__general__';
  END IF;
  -- Remove prior memberships (one community per user, non-admin)
  DELETE FROM public.community_members WHERE user_id = uid AND community_id <> cid;
  INSERT INTO public.community_members (community_id, user_id)
    VALUES (cid, uid)
    ON CONFLICT DO NOTHING;
  UPDATE public.communities SET member_count = (
    SELECT COUNT(*) FROM public.community_members WHERE community_id = cid
  ) WHERE id = cid;
  RETURN cid;
END;
$$;

-- 8) Admin pin/unpin
CREATE OR REPLACE FUNCTION public.admin_toggle_pin(_msg uuid, _pin boolean)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN RAISE EXCEPTION 'forbidden'; END IF;
  UPDATE public.community_messages SET is_pinned = _pin WHERE id = _msg;
END;
$$;

-- 9) Admin daily question setter
CREATE OR REPLACE FUNCTION public.admin_set_daily_question(_community uuid, _q text)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE new_id uuid;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN RAISE EXCEPTION 'forbidden'; END IF;
  INSERT INTO public.community_daily_questions(community_id, question)
    VALUES (_community, _q) RETURNING id INTO new_id;
  RETURN new_id;
END;
$$;

-- 10) Spend-to-unlock RPC (replaces direct insert into aura_unlocks)
CREATE OR REPLACE FUNCTION public.aura_unlock_feature(_feature_key text, _price integer)
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  uid uuid := auth.uid();
  w public.aura_wallets;
  existing uuid;
BEGIN
  IF uid IS NULL THEN RAISE EXCEPTION 'unauthenticated'; END IF;
  IF _price < 0 OR _price > 10000 THEN RAISE EXCEPTION 'invalid_price'; END IF;
  SELECT id INTO existing FROM public.aura_unlocks WHERE user_id = uid AND feature_key = _feature_key;
  IF existing IS NOT NULL THEN
    SELECT * INTO w FROM public.aura_wallets WHERE user_id = uid;
    RETURN jsonb_build_object('alreadyUnlocked', true, 'wallet', to_jsonb(w));
  END IF;
  SELECT * INTO w FROM public.aura_apply_delta(uid, -_price, 'spend', 'unlock:' || _feature_key,
    jsonb_build_object('featureKey', _feature_key));
  INSERT INTO public.aura_unlocks(user_id, feature_key) VALUES (uid, _feature_key);
  RETURN jsonb_build_object('alreadyUnlocked', false, 'wallet', to_jsonb(w));
END;
$$;

-- 11) SECURITY HARDENING — remove direct-mutation policies
DROP POLICY IF EXISTS wallet_update_own ON public.aura_wallets;
DROP POLICY IF EXISTS unlock_insert_own ON public.aura_unlocks;
DROP POLICY IF EXISTS "Users can insert their own unlocks" ON public.aura_unlocks;
-- Confirm no INSERT policy exists on aura_transactions for end users
DROP POLICY IF EXISTS txn_insert_own ON public.aura_transactions;
DROP POLICY IF EXISTS "Users can insert their own transactions" ON public.aura_transactions;

-- 12) Admin bootstrap: second admin email + backfill
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, name, surname)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'surname', '')
  );
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

-- Backfill admin for any existing matching account
INSERT INTO public.user_roles (user_id, role)
SELECT u.id, 'admin'::public.app_role
FROM auth.users u
WHERE lower(u.email) IN ('abdugamer009@gmail.com','umaraxmedov0175@gmail.com')
ON CONFLICT (user_id, role) DO NOTHING;
