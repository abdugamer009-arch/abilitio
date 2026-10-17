import { PGlite } from "@electric-sql/pglite";
import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { it, expect } from "vitest";

it("F-14 denies anonymous admin entry points while preserving real admin checks and actions", async () => {
  const db = new PGlite();
  try {
    await db.exec(`CREATE ROLE anon; CREATE ROLE authenticated; CREATE ROLE service_role BYPASSRLS; CREATE ROLE supabase_admin;
CREATE SCHEMA auth; CREATE TABLE auth.users(id uuid PRIMARY KEY,email text,email_confirmed_at timestamptz,raw_user_meta_data jsonb DEFAULT '{}');
CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql AS $$ SELECT nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
CREATE FUNCTION auth.role() RETURNS text LANGUAGE sql AS $$ SELECT current_setting('request.jwt.claim.role',true) $$;
CREATE SCHEMA storage; CREATE TABLE storage.buckets(id text PRIMARY KEY,name text,public boolean,file_size_limit bigint,allowed_mime_types text[]);
CREATE TABLE storage.objects(id uuid PRIMARY KEY DEFAULT gen_random_uuid(),bucket_id text,name text,owner uuid);
CREATE FUNCTION storage.foldername(text) RETURNS text[] LANGUAGE sql AS $$ SELECT string_to_array($1,'/') $$;
CREATE SCHEMA realtime; CREATE TABLE realtime.messages(id uuid); ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON realtime.messages TO authenticated; CREATE FUNCTION realtime.topic() RETURNS text LANGUAGE sql AS $$ SELECT current_setting('realtime.topic',true) $$;
CREATE PUBLICATION supabase_realtime; GRANT USAGE ON SCHEMA public,auth,storage,realtime TO authenticated,anon,service_role;
GRANT SELECT ON auth.users TO authenticated;`);
    const dir = resolve("supabase/migrations");
    const repair = "20261017171000_admin_rpc_execution_grants.sql";
    for (const file of readdirSync(dir)
      .sort()
      .filter((f) => f !== repair))
      await db.exec(readFileSync(resolve(dir, file), "utf8"));
    const admin = "00000000-0000-4000-8000-000000000091";
    const student = "00000000-0000-4000-8000-000000000092";
    await db.exec(
      `INSERT INTO auth.users(id,email,raw_user_meta_data) VALUES ('${admin}','audit1@example.invalid','{"name":"AUDIT TEST 1"}'),('${student}','audit2@example.invalid','{"name":"AUDIT TEST 2"}'); INSERT INTO public.user_roles(user_id,role) VALUES ('${admin}','admin');`,
    );
    const community = (await db.query<{ id: string }>("SELECT id FROM public.communities LIMIT 1"))
      .rows[0].id;
    const message = (
      await db.query<{ id: string }>(
        "INSERT INTO public.community_messages(community_id,user_id,content) VALUES ($1,$2,'AUDIT TEST 2') RETURNING id",
        [community, student],
      )
    ).rows[0].id;
    const calls = [
      {
        signature: "public.admin_adjust_aura(uuid,integer,text)",
        sql: "SELECT public.admin_adjust_aura($1,1,'AUDIT TEST 1')",
        args: [student],
      },
      {
        signature: "public.admin_set_ban(uuid,boolean)",
        sql: "SELECT public.admin_set_ban($1,false)",
        args: [student],
      },
      {
        signature: "public.admin_set_daily_question(uuid,text)",
        sql: "SELECT public.admin_set_daily_question($1,'AUDIT TEST 1')",
        args: [community],
      },
      {
        signature: "public.admin_toggle_pin(uuid,boolean)",
        sql: "SELECT public.admin_toggle_pin($1,true)",
        args: [message],
      },
    ];
    for (const call of calls)
      expect(
        (
          await db.query<{ allowed: boolean }>(
            "SELECT has_function_privilege('anon',$1,'EXECUTE') AS allowed",
            [call.signature],
          )
        ).rows[0].allowed,
      ).toBe(true);
    await db.exec(readFileSync(resolve(dir, repair), "utf8"));
    await db.exec(readFileSync(resolve(dir, repair), "utf8"));
    for (const call of calls) {
      for (const role of ["authenticated", "service_role"])
        expect(
          (
            await db.query<{ allowed: boolean }>(
              "SELECT has_function_privilege($1,$2,'EXECUTE') AS allowed",
              [role, call.signature],
            )
          ).rows[0].allowed,
        ).toBe(true);
      await db.exec("SET ROLE anon");
      await expect(db.query(call.sql, call.args)).rejects.toThrow(/permission denied/);
      await db.exec(
        `RESET ROLE; SELECT set_config('request.jwt.claim.sub','${student}',false); SELECT set_config('request.jwt.claim.role','authenticated',false); SET ROLE authenticated;`,
      );
      await expect(db.query(call.sql, call.args)).rejects.toThrow(/forbidden/);
      await db.exec(
        `RESET ROLE; SELECT set_config('request.jwt.claim.sub','${admin}',false); SET ROLE authenticated;`,
      );
      await expect(db.query(call.sql, call.args)).resolves.toBeDefined();
      await db.exec("RESET ROLE");
    }
    expect(
      (
        await db.query<{ is_pinned: boolean }>(
          "SELECT is_pinned FROM public.community_messages WHERE id=$1",
          [message],
        )
      ).rows[0].is_pinned,
    ).toBe(true);
    expect(
      (
        await db.query(
          "SELECT id FROM public.community_daily_questions WHERE question='AUDIT TEST 1'",
        )
      ).rows,
    ).toHaveLength(1);
    expect(
      (
        await db.query<{ balance: number }>(
          "SELECT balance FROM public.aura_wallets WHERE user_id=$1",
          [student],
        )
      ).rows[0].balance,
    ).toBe(1);
    // Documented rollback restores exactly the old effective anonymous access.
    for (const call of calls)
      await db.exec(`GRANT EXECUTE ON FUNCTION ${call.signature} TO PUBLIC`);
    for (const call of calls)
      expect(
        (
          await db.query<{ allowed: boolean }>(
            "SELECT has_function_privilege('anon',$1,'EXECUTE') AS allowed",
            [call.signature],
          )
        ).rows[0].allowed,
      ).toBe(true);
  } finally {
    await db.close();
  }
}, 30000);
