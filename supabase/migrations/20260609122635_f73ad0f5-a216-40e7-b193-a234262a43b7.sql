
-- 1. Remove client INSERT on aura_wallets. aura_apply_delta (SECURITY DEFINER)
--    handles row creation via INSERT ... ON CONFLICT DO NOTHING.
DROP POLICY IF EXISTS wallet_insert_own ON public.aura_wallets;

-- 2. Realtime authorization: gate channel subscriptions to community members or admins.
--    The realtime.messages table stores broadcast/presence messages; RLS here controls
--    which authenticated users may subscribe to a given topic.
-- Supabase owns this table and already enables RLS. The postgres dashboard role
-- may manage its policies, but cannot ALTER the managed table.
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_class WHERE oid = 'realtime.messages'::regclass AND relrowsecurity) THEN
    RAISE EXCEPTION 'Expected Supabase-managed RLS on realtime.messages';
  END IF;
END $$;

DROP POLICY IF EXISTS "community_realtime_member_only" ON realtime.messages;
CREATE POLICY "community_realtime_member_only"
ON realtime.messages
FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin'::public.app_role)
  OR EXISTS (
    SELECT 1
    FROM public.communities c
    JOIN public.community_members m
      ON m.community_id = c.id
    WHERE m.user_id = auth.uid()
      AND (
        realtime.topic() = 'community:' || c.slug
        OR realtime.topic() = 'community:' || c.id::text
      )
  )
);
