-- Server validates task membership, binds the authenticated owner and sets time.
REVOKE INSERT, UPDATE ON public.roadmap_task_events FROM authenticated, anon;
DROP POLICY IF EXISTS "task journal own insert" ON public.roadmap_task_events;
DROP POLICY IF EXISTS "task journal own update" ON public.roadmap_task_events;
