
REVOKE EXECUTE ON FUNCTION public.generate_school_code() FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.register_school(text,text,text,text,int,text,text) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.join_school(text,text) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.is_school_principal(uuid,uuid) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.is_school_member(uuid,uuid) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.register_school(text,text,text,text,int,text,text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.join_school(text,text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_school_principal(uuid,uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_school_member(uuid,uuid) TO authenticated;
