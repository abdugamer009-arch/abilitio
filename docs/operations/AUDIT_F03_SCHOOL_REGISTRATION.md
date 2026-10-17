# F-03: enforce the closed school registration gate

The application currently rejects registration because `SCHOOL_AGREEMENT` is
unapproved. The older authenticated `register_school` RPC grant bypasses that
check. Migration `20261017170000_gate_school_registration.sql` revokes that grant
without changing schools, memberships, invitation renewal or principal reads.

Apply only to an approved staging database first. Verify direct authenticated
registration fails with permission denied and existing principal operations
remain available. Local PGlite tests are simulated database checks, not hosted
staging or production evidence. A code push does not apply this migration.

Do not enable school registration by changing the TypeScript gate alone. After
the owner approves the agreement and authorizes reopening registration, restore
the authenticated grant in a separately reviewed migration and test both the app
and direct RPC paths. Never grant this RPC to `anon` or `PUBLIC`.

Rollback, only when explicitly authorized for the target database:

```sql
GRANT EXECUTE ON FUNCTION public.register_school(text,text,text,text,int,text,text)
  TO authenticated;
```

Rollback restores the prior bypass, so it is not a safe default workaround for
a registration error. The forward change touches no rows and requires no data
repair. Production migration and rollback remain subject to explicit F-03 approval.
