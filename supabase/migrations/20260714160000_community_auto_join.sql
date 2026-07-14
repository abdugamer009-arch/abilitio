-- ============ Community auto-join by slug ============
-- Assessments now auto-join the user to a community based on their #1 career
-- match. The existing assign_user_to_community(_career_key) resolved by the
-- old career *name* and is no longer wired; this adds a slug-based variant the
-- server function resolves from the career's category/key, and two communities
-- (Engineering, Science) so the expanded catalog maps to relevant homes rather
-- than dumping most users into General.

-- Two additional communities for the broadened careers catalog.
INSERT INTO public.communities (slug, name, career_key, description, welcome_message) VALUES
  ('engineering','Engineering','__engineering__','Designers and builders of the physical world.','Welcome to the Engineering Community. Connect with people who share your strengths and career interests.'),
  ('science','Science & Research','__science__','Researchers, analysts, and discoverers.','Welcome to the Science & Research Community.')
ON CONFLICT (slug) DO NOTHING;

-- Assign the current user to a community identified by slug. Mirrors
-- assign_user_to_community but resolves by slug (which the app controls),
-- falling back to the General community. One community per non-admin user.
CREATE OR REPLACE FUNCTION public.assign_user_to_community_by_slug(_slug text)
RETURNS uuid
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  cid uuid;
  uid uuid := auth.uid();
BEGIN
  IF uid IS NULL THEN
    RAISE EXCEPTION 'unauthenticated';
  END IF;
  SELECT id INTO cid FROM public.communities WHERE slug = _slug;
  IF cid IS NULL THEN
    SELECT id INTO cid FROM public.communities WHERE slug = 'general';
  END IF;
  IF cid IS NULL THEN
    RETURN NULL;
  END IF;
  -- One community per user (non-admin): drop any prior membership first.
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

GRANT EXECUTE ON FUNCTION public.assign_user_to_community_by_slug(text) TO authenticated;
