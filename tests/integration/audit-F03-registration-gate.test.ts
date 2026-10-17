import { PGlite } from "@electric-sql/pglite";
import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { it, expect } from "vitest";

it("F-03 blocks direct registration while retaining schools and owner invitation renewal", async () => {
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
    const gate = "20261017170000_gate_school_registration.sql";
    for (const file of readdirSync(dir)
      .sort()
      .filter((f) => f !== gate))
      await db.exec(readFileSync(resolve(dir, file), "utf8"));
    const owner = "00000000-0000-4000-8000-000000000091";
    await db.exec(
      `INSERT INTO auth.users(id,email,raw_user_meta_data) VALUES ('${owner}','audit1@example.invalid','{"name":"AUDIT TEST 1"}'); SELECT set_config('request.jwt.claim.sub','${owner}',false); SELECT set_config('request.jwt.claim.role','authenticated',false); SET ROLE authenticated;`,
    );
    const sql =
      "SELECT (public.register_school('AUDIT TEST 1','AUDIT TEST 1','audit1@example.invalid','',1,'','')).id AS id";
    const school = (await db.query<{ id: string }>(sql)).rows[0].id;
    await db.exec("RESET ROLE");
    await db.exec(readFileSync(resolve(dir, gate), "utf8"));
    await db.exec(readFileSync(resolve(dir, gate), "utf8"));
    await db.exec("SET ROLE authenticated");
    await expect(db.query(sql)).rejects.toThrow(/permission denied/);
    expect((await db.query("SELECT id FROM public.schools")).rows).toEqual([{ id: school }]);
    const renewed = await db.query<{ code: string }>(
      "SELECT public.renew_school_invitation($1) AS code",
      [school],
    );
    expect(renewed.rows[0].code).toMatch(/^NVS-[A-F0-9]{32}$/);
    await db.exec("RESET ROLE");
    expect(
      (
        await db.query<{ allowed: boolean }>(
          "SELECT has_function_privilege('anon','public.register_school(text,text,text,text,integer,text,text)','EXECUTE') AS allowed",
        )
      ).rows[0].allowed,
    ).toBe(false);
    // Rollback is explicit and restores the former grant; it does not delete data.
    await db.exec(
      "GRANT EXECUTE ON FUNCTION public.register_school(text,text,text,text,int,text,text) TO authenticated; SET ROLE authenticated;",
    );
    expect((await db.query(sql)).rows).toHaveLength(1);
  } finally {
    await db.close();
  }
}, 30000);
