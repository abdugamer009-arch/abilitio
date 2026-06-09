
-- 1. Remove client INSERT on aura_wallets. aura_apply_delta (SECURITY DEFINER)
--    handles row creation via INSERT ... ON CONFLICT DO NOTHING.
DROP POLICY IF EXISTS wallet_insert_own ON public.aura_wallets;

-- 2. Realtime authorization: gate channel subscriptions to community members or admins.
--    The realtime.messages table stores broadcast/presence messages; RLS here controls
--    which authenticated users may subscribe to a given topic.
ALTER TABLE IF EXISTS realtime.messages ENABLE ROW LEVEL SECURITY;

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
