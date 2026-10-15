-- Preserve existing memberships and messages. NULL consent marks legacy membership.
ALTER TABLE public.community_members ADD COLUMN IF NOT EXISTS consented_at timestamptz;
-- Retire both automatic assignment entry points, including their implicit
-- deletion of other memberships. Historical migrations remain unchanged.
REVOKE ALL ON FUNCTION public.assign_user_to_community(text) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.assign_user_to_community_by_slug(text) FROM PUBLIC, anon, authenticated;
CREATE OR REPLACE FUNCTION public.join_community_with_consent(_community_id uuid, _consent boolean)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE uid uuid := (SELECT auth.uid());
BEGIN
 IF uid IS NULL OR _consent IS DISTINCT FROM true THEN RAISE EXCEPTION 'explicit_consent_required'; END IF;
 IF EXISTS(SELECT 1 FROM profiles WHERE id=uid AND is_banned) THEN RAISE EXCEPTION 'forbidden'; END IF;
 IF NOT EXISTS(SELECT 1 FROM communities WHERE id=_community_id) THEN RAISE EXCEPTION 'community_not_found'; END IF;
 INSERT INTO community_members(community_id,user_id,consented_at) VALUES(_community_id,uid,now())
 ON CONFLICT(community_id,user_id) DO UPDATE SET consented_at=EXCLUDED.consented_at;
 UPDATE communities SET member_count=(SELECT count(*) FROM community_members WHERE community_id=_community_id) WHERE id=_community_id;
END; $$;
CREATE OR REPLACE FUNCTION public.leave_community(_community_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE uid uuid := (SELECT auth.uid());
BEGIN
 IF uid IS NULL THEN RAISE EXCEPTION 'unauthenticated'; END IF;
 DELETE FROM community_members WHERE community_id=_community_id AND user_id=uid;
 UPDATE communities SET member_count=(SELECT count(*) FROM community_members WHERE community_id=_community_id) WHERE id=_community_id;
END; $$;
REVOKE ALL ON FUNCTION public.join_community_with_consent(uuid,boolean) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.leave_community(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.join_community_with_consent(uuid,boolean),public.leave_community(uuid) TO authenticated;
