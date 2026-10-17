-- Keep the internal database-admin checks and authenticated admin actions.
-- Anonymous callers do not need an executable entry point to admin writes.
BEGIN;
REVOKE EXECUTE ON FUNCTION
  public.admin_adjust_aura(uuid,integer,text),
  public.admin_set_ban(uuid,boolean),
  public.admin_set_daily_question(uuid,text),
  public.admin_toggle_pin(uuid,boolean)
  FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION
  public.admin_adjust_aura(uuid,integer,text),
  public.admin_set_ban(uuid,boolean),
  public.admin_set_daily_question(uuid,text),
  public.admin_toggle_pin(uuid,boolean)
  TO authenticated, service_role;
COMMIT;
