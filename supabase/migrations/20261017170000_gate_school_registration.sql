-- School registration is currently disabled by SCHOOL_AGREEMENT in the app.
-- Enforce the same closed gate for direct browser RPC calls. Existing schools,
-- memberships and principal operations are unchanged.
BEGIN;
REVOKE EXECUTE ON FUNCTION public.register_school(text,text,text,text,int,text,text)
  FROM PUBLIC, anon, authenticated;
COMMIT;
