# F-14: restrict anonymous execution of administrative RPCs

The live catalog and security advisor show that four administrative write RPCs
inherit EXECUTE from PUBLIC. Their internal role checks remain essential and
are unchanged. This is defense in depth; no anonymous administrative write was
demonstrated or attempted in production.

Migration `20261017171000_admin_rpc_execution_grants.sql` removes execution from
PUBLIC/anon and explicitly preserves authenticated/service-role execution.
Authenticated non-admins must still fail the functions' internal checks. RLS
helper functions retain their existing grants.

Run the migration and role checks in an approved hosted staging database before
production approval. Local PGlite simulates managed Supabase schemas and is not
a live authorization test. Code deployment does not apply SQL.

Rollback only with authorization for the target database:

```sql
GRANT EXECUTE ON FUNCTION
  public.admin_adjust_aura(uuid,integer,text),
  public.admin_set_ban(uuid,boolean),
  public.admin_set_daily_question(uuid,text),
  public.admin_toggle_pin(uuid,boolean)
  TO PUBLIC;
```

Rollback restores the former public exposure. No rows are changed by either
grant migration. Production execution requires written F-14 approval.
