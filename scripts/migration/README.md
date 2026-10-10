# Nhost migration: source backup phase

Status: migration preparation started on `codex/nhost-migration`. No live data has been exported or copied. Both provider dashboards require sign-in; the user declined the sign-in request. The source-owner credentials/export and a destination project remain unavailable. Production still uses Supabase.

The branch starts from the prepared results API repair so its submission guards and retry handling can be retained during migration. Do not deploy this branch as a completed replacement.

## Export

Install PostgreSQL client tools (`pg_dump` and `pg_restore`) compatible with the source server version. They are currently absent on this computer. The script uses the existing Supabase SDK dependency and Node.js; no new application dependencies are needed.

Provide these variables through protected local configuration, outside Git:

- `SOURCE_SUPABASE_URL`: the verified production project URL.
- `SOURCE_SERVICE_ROLE_KEY`: that project's server-only storage access key.
- `SOURCE_DATABASE_URL`: owner connection string to that same project. Use a direct connection or session pooler, not a transaction pooler.

The script deliberately rejects the other project linked to GitHub. Historical data there requires a separately reviewed export and account reconciliation.

Run from the repository:

```sh
node scripts/migration/export-source.mjs /absolute/private/new-export-directory
node --test scripts/migration/export-source.test.mjs
```

The output directory must be new and outside the repository. The script creates a private database dump and storage manifest, traverses every listed bucket with pagination, and downloads current objects to hashed local filenames. It retains object names/metadata in the private manifest and records SHA-256 checksums. Errors leave `complete: false`; there is no silent skip or restricted-data fallback. Credentials and database errors are not printed.

`complete: true` means this export operation finished for its stated scope. It does **not** prove the source was frozen, that historical object versions/configuration were copied, that the backup is restorable, or that data has reached Nhost. `pg_restore --list` checks archive readability, not a full restore. A snapshot taken during writes is an initial backup only; final cutover requires a write freeze and reconciliation.

This exporter reads the source only. It does not create destination accounts, change roles, alter schemas, upload data, delete anything, or switch Vercel configuration.

## Remaining transfer work

1. Obtain source-owner access or a protected complete database-and-storage export, and access to a Nhost destination project. Choose the production plan/region without assuming approval for a paid subscription.
2. Inventory the live database independently of generated types, restore the backup into an isolated environment, and include provider configuration/jobs/integrations and any separately retained object versions.
3. Map Supabase users to Nhost users with stable IDs, compatible bcrypt hashes and original verification/restriction state. Do not restore Supabase's auth schema over Nhost's auth schema.
4. Adapt authentication, SQL/RPCs, GraphQL permissions, file references and community subscriptions/presence. Keep assessment scoring server-authoritative and apply the intended schema, including `session_nonce`.
5. Transfer all durable records and actual files, verify counts/digests/relationships, and test existing/new user result saving plus cross-user and cross-school access denial.
6. Freeze writes, copy the final delta, reconcile, then deploy the app and Vercel configuration together. Retain the source and backups for rollback; reconcile any new destination writes before reverting.

Nhost documents user imports at https://docs.nhost.io/products/auth/users#import-users. Its auth schema and field mapping must be checked against the provisioned destination version before an importer is implemented.
