import { validateCatalog } from "@/lib/assessment/catalog";
import { schoolBucket } from "@/lib/schools/school-model";
import { beforeAll, afterAll, describe, expect, it } from "vitest";
import { PGlite } from "@electric-sql/pglite";
import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";

const db = new PGlite();
const owner = "00000000-0000-4000-8000-000000000001";
const student = "00000000-0000-4000-8000-000000000002";
const outsider = "00000000-0000-4000-8000-000000000003";
const school = "00000000-0000-4000-8000-000000000004";
const migration = resolve("supabase/migrations/20261010160000_repository_reliability.sql");
async function asUser(id: string) {
  await db.exec(
    `RESET ROLE; SELECT set_config('request.jwt.claim.sub','${id}',false); SELECT set_config('request.jwt.claim.role','authenticated',false); SET ROLE authenticated;`,
  );
}

describe("owner release migration", () => {
  beforeAll(async () => {
    // Supabase-owned schemas are simulated; application migrations run unchanged.
    await db.exec(`CREATE ROLE anon; CREATE ROLE authenticated; CREATE ROLE service_role BYPASSRLS; CREATE ROLE supabase_admin;
      CREATE SCHEMA auth; CREATE TABLE auth.users(id uuid PRIMARY KEY,email text,email_confirmed_at timestamptz,raw_user_meta_data jsonb DEFAULT '{}');
      CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql AS $$ SELECT nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
      CREATE FUNCTION auth.role() RETURNS text LANGUAGE sql AS $$ SELECT current_setting('request.jwt.claim.role',true) $$;
      CREATE SCHEMA storage; CREATE TABLE storage.buckets(id text PRIMARY KEY,name text,public boolean,file_size_limit bigint,allowed_mime_types text[]);
      CREATE TABLE storage.objects(id uuid PRIMARY KEY DEFAULT gen_random_uuid(),bucket_id text,name text,owner uuid);
      CREATE FUNCTION storage.foldername(text) RETURNS text[] LANGUAGE sql AS $$ SELECT string_to_array($1,'/') $$;
      CREATE SCHEMA realtime; CREATE TABLE realtime.messages(id uuid);
      ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;
      GRANT SELECT ON realtime.messages TO authenticated;
      CREATE FUNCTION realtime.topic() RETURNS text LANGUAGE sql AS $$ SELECT current_setting('realtime.topic',true) $$;
      CREATE PUBLICATION supabase_realtime;
      GRANT USAGE ON SCHEMA public,auth,storage,realtime TO authenticated,anon,service_role;
      GRANT SELECT ON auth.users TO authenticated;`);
    const dir = resolve("supabase/migrations");
    for (const file of readdirSync(dir).sort())
      await db.exec(readFileSync(resolve(dir, file), "utf8"));
    await db.exec(`GRANT SELECT,UPDATE ON public.profiles TO authenticated;
      INSERT INTO auth.users(id,email) VALUES ('${owner}','principal@example.test'),('${student}','student@example.test'),('${outsider}','outsider@example.test');
      INSERT INTO public.schools(id,code,name,principal_name,email,owner_user_id) VALUES ('${school}','TEST','Test','Principal','principal@example.test','${owner}');
      INSERT INTO public.school_members(school_id,user_id,role) VALUES ('${school}','${owner}','principal'),('${school}','${student}','student');`);
  }, 20000);
  afterAll(async () => {
    await db.close();
  });

  it("caches auth identity in the plan while preserving student profile isolation", async () => {
    const policyQuery =
      "SELECT schemaname,tablename,policyname,roles,cmd,permissive,qual,with_check FROM pg_policies WHERE schemaname IN ('public','storage') ORDER BY schemaname,tablename,policyname";
    const before = await db.query(policyQuery);
    await db.exec(
      readFileSync(resolve("supabase/migrations/20261012111000_rls_auth_initplans.sql"), "utf8"),
    );
    expect((await db.query(policyQuery)).rows).toEqual(before.rows);
    await asUser(student);
    try {
      const visible = await db.query<{ id: string }>("SELECT id FROM public.profiles");
      expect(visible.rows.map((row) => row.id)).toEqual([student]);
      const plan = await db.query("EXPLAIN (FORMAT JSON) SELECT id FROM public.profiles");
      expect(JSON.stringify(plan.rows)).toContain("InitPlan");
    } finally {
      await db.exec("RESET ROLE");
    }
  });

  it("rejects impossible recorded scores while allowing empty and boundary scores", async () => {
    await db.exec("RESET ROLE; BEGIN");
    try {
      await db.query("INSERT INTO public.user_stats(user_id) VALUES ($1)", [student]);
      for (const [sat, ielts] of [
        [400, 0],
        [1600, 9],
        [null, null],
      ]) {
        await db.query("UPDATE public.user_stats SET sat_score=$1,ielts_band=$2 WHERE user_id=$3", [
          sat,
          ielts,
          student,
        ]);
      }
      for (const [sat, ielts] of [
        [100, 7],
        [-10, 20],
        [1601, 8],
        [1200, 7.2],
      ]) {
        await db.exec("SAVEPOINT invalid_score");
        await expect(
          db.query("UPDATE public.user_stats SET sat_score=$1,ielts_band=$2 WHERE user_id=$3", [
            sat,
            ielts,
            student,
          ]),
        ).rejects.toThrow(/check constraint/);
        await db.exec("ROLLBACK TO SAVEPOINT invalid_score");
      }
    } finally {
      await db.exec("ROLLBACK");
    }
  });
  it("configures private avatars with server upload limits", async () => {
    const bucket = await db.query(
      "SELECT public,file_size_limit::int,allowed_mime_types FROM storage.buckets WHERE id='avatars'",
    );
    expect(bucket.rows).toEqual([
      {
        public: false,
        file_size_limit: 5242880,
        allowed_mime_types: ["image/jpeg", "image/png", "image/webp"],
      },
    ]);
  });
  it("expires and renews owner-scoped invitations and counts unsuccessful joins", async () => {
    await db.exec("RESET ROLE; BEGIN");
    try {
      await asUser(outsider);
      await db.exec("SAVEPOINT bad_invite");
      await expect(db.query("SELECT public.renew_school_invitation($1)", [school])).rejects.toThrow(
        /not_principal/,
      );
      await db.exec("ROLLBACK TO SAVEPOINT bad_invite");
    } finally {
      await db.exec("RESET ROLE; ROLLBACK");
    }
    await db.exec("BEGIN");
    try {
      await asUser(owner);
      const code = (
        await db.query<{ code: string }>("SELECT public.renew_school_invitation($1) AS code", [
          school,
        ])
      ).rows[0].code;
      expect(code).toMatch(/^NVS-[A-F0-9]{32}$/);
      await asUser(outsider);
      for (let i = 0; i < 10; i++)
        expect(
          (
            await db.query<{ id: string | null }>(
              "SELECT public.join_school('wrong','AUDIT1') AS id",
            )
          ).rows[0].id,
        ).toBeNull();
      expect(
        (
          await db.query<{ id: string | null }>("SELECT public.join_school($1,'AUDIT1') AS id", [
            code,
          ])
        ).rows[0].id,
      ).toBeNull();
      await db.exec("RESET ROLE");
      await db.query(
        "UPDATE public.school_join_attempts SET window_started_at=now()-interval '2 hours' WHERE user_id=$1",
        [outsider],
      );
      await asUser(outsider);
      expect(
        (
          await db.query<{ id: string | null }>("SELECT public.join_school($1,'AUDIT1') AS id", [
            code,
          ])
        ).rows[0].id,
      ).toBe(school);
      await db.exec("RESET ROLE");
      await db.query(
        "UPDATE public.schools SET invite_expires_at=now()-interval '1 second' WHERE id=$1",
        [school],
      );
      await asUser(student);
      expect(
        (
          await db.query<{ id: string | null }>("SELECT public.join_school($1,'AUDIT1') AS id", [
            code,
          ])
        ).rows[0].id,
      ).toBeNull();
    } finally {
      await db.exec("RESET ROLE; ROLLBACK");
    }
  });
  it("retains managed Realtime protection and limits topics to community members", async () => {
    expect(
      (
        await db.query(
          "SELECT relrowsecurity FROM pg_class WHERE oid='realtime.messages'::regclass",
        )
      ).rows,
    ).toEqual([{ relrowsecurity: true }]);
    const community = (
      await db.query<{ id: string; slug: string }>(
        "SELECT id,slug FROM public.communities ORDER BY slug LIMIT 1",
      )
    ).rows[0];
    await db.query("INSERT INTO public.community_members(community_id,user_id) VALUES ($1,$2)", [
      community.id,
      student,
    ]);
    await db.exec(
      "INSERT INTO realtime.messages(id) VALUES ('00000000-0000-4000-8000-000000000099')",
    );
    await db.query("SELECT set_config('realtime.topic',$1,false)", [`community:${community.slug}`]);
    await asUser(student);
    expect((await db.query("SELECT id FROM realtime.messages")).rows).toHaveLength(1);
    await asUser(outsider);
    expect((await db.query("SELECT id FROM realtime.messages")).rows).toHaveLength(0);
    await asUser(student);
    await db.query("SELECT set_config('realtime.topic',$1,false)", ["community:unrelated"]);
    expect((await db.query("SELECT id FROM realtime.messages")).rows).toHaveLength(0);
    await db.exec("RESET ROLE");
  });
  it("removes stats and achievements when their account is deleted", async () => {
    await db.exec("RESET ROLE; BEGIN");
    try {
      await db.query("INSERT INTO public.user_stats(user_id) VALUES ($1)", [outsider]);
      await db.query(
        "INSERT INTO public.user_achievements(user_id,title) VALUES ($1,'Cleanup fixture')",
        [outsider],
      );
      await db.query("DELETE FROM auth.users WHERE id=$1", [outsider]);
      expect(
        (await db.query("SELECT user_id FROM public.user_stats WHERE user_id=$1", [outsider])).rows,
      ).toHaveLength(0);
      expect(
        (
          await db.query("SELECT user_id FROM public.user_achievements WHERE user_id=$1", [
            outsider,
          ])
        ).rows,
      ).toHaveLength(0);
    } finally {
      await db.exec("ROLLBACK");
    }
  });
  it("does not grant administrator access from a signup email", async () => {
    await db.exec("RESET ROLE; BEGIN");
    try {
      await db.exec(`INSERT INTO auth.users(id,email,email_confirmed_at)
        VALUES ('00000000-0000-4000-8000-000000000088','abdugamer009@gmail.com',now()),
               ('00000000-0000-4000-8000-000000000089','umaraxmedov0175@gmail.com',null);`);
      const roles = await db.query<{ role: string }>(
        "SELECT role::text FROM public.user_roles WHERE user_id IN ('00000000-0000-4000-8000-000000000088','00000000-0000-4000-8000-000000000089') ORDER BY user_id",
      );
      expect(roles.rows).toEqual([{ role: "user" }, { role: "user" }]);
      expect(
        (
          await db.query(
            "SELECT id FROM public.profiles WHERE id IN ('00000000-0000-4000-8000-000000000088','00000000-0000-4000-8000-000000000089')",
          )
        ).rows,
      ).toHaveLength(2);
    } finally {
      await db.exec("ROLLBACK");
    }
  });
  it("can be reapplied without losing existing rows", async () => {
    await db.exec(readFileSync(migration, "utf8"));
    // Restore later authorization changes after exercising this older repair.
    await db.exec(
      readFileSync(resolve("supabase/migrations/20261012101000_server_task_writes.sql"), "utf8"),
    );
    expect((await db.query("SELECT count(*)::int AS n FROM public.profiles")).rows).toEqual([
      { n: 3 },
    ]);
  });
  it("accepts the seeded catalog and maps every career category", async () => {
    const careers = (await db.query("SELECT * FROM public.careers")).rows;
    const majors = (await db.query("SELECT * FROM public.university_majors")).rows;
    const catalog = validateCatalog(careers, majors);
    expect(catalog.careers.length).toBeGreaterThan(100);
    expect(catalog.careers.filter((c) => !schoolBucket(c)).map((c) => c.category)).toEqual([]);
  });
  it("limits principal profile visibility to enrolled students", async () => {
    await asUser(owner);
    const result = await db.query<{ id: string }>("SELECT id FROM public.profiles ORDER BY id");
    expect(result.rows.map((r) => r.id)).toEqual([owner, student]);
  });
  it("rejects fabricated score writes and arbitrary retired currency awards", async () => {
    await asUser(student);
    await expect(
      db.exec(
        `INSERT INTO public.roadmap_task_events(user_id,task_id) VALUES ('${student}','AUDIT_INVALID_TASK')`,
      ),
    ).rejects.toThrow(/permission denied|row-level security/);
    await expect(
      db.exec(
        `INSERT INTO public.career_assessment_results(user_id,cognitive_score) VALUES ('${student}',9)`,
      ),
    ).rejects.toThrow(/permission denied/);
    await expect(
      db.exec(`SELECT public.aura_apply_delta('${student}',999,'award','fake','{}')`),
    ).rejects.toThrow(/permission denied/);
    await expect(
      db.exec(`UPDATE public.profiles SET is_banned=true WHERE id='${student}'`),
    ).rejects.toThrow(/Moderation fields/);
  });
  it("keeps prior class suggestions when replacement validation fails", async () => {
    await asUser(owner);
    const valid = JSON.stringify([
      { title: "Technology", focus: "technology", reason: "Exploration", students: [student] },
    ]);
    await db.query("SELECT public.replace_school_specialized_classes($1,$2::jsonb)", [
      school,
      valid,
    ]);
    const invalid = JSON.stringify([
      { title: "Invalid", focus: "technology", reason: "Exploration", students: [outsider] },
    ]);
    await expect(
      db.query("SELECT public.replace_school_specialized_classes($1,$2::jsonb)", [school, invalid]),
    ).rejects.toThrow(/student_not_enrolled/);
    expect((await db.query("SELECT title FROM public.school_specialized_classes")).rows).toEqual([
      { title: "Technology" },
    ]);
  });
  it("stores exact profiles while retaining nullable historical rows and owner-only reads", async () => {
    await db.exec("RESET ROLE; SELECT set_config('request.jwt.claim.role','service_role',false)");
    const profile = { R: 0.5, I: 0.125, A: 1, S: 0.625, E: 0.875, C: 0.375 };
    const inserted = await db.query<{ id: string }>(
      "INSERT INTO public.career_assessment_results(user_id,riasec_profile) VALUES ($1,$2::jsonb) RETURNING id",
      [student, JSON.stringify(profile)],
    );
    await db.query("INSERT INTO public.career_assessment_results(user_id) VALUES ($1)", [student]);
    await db.exec(
      readFileSync(
        resolve("supabase/migrations/20261011140000_exact_interest_profile.sql"),
        "utf8",
      ),
    );
    await asUser(student);
    const rows = await db.query<{ riasec_profile: unknown }>(
      "SELECT riasec_profile FROM public.career_assessment_results WHERE id=$1",
      [inserted.rows[0].id],
    );
    expect(rows.rows[0].riasec_profile).toEqual(profile);
    expect(
      (
        await db.query(
          "SELECT id FROM public.career_assessment_results WHERE riasec_profile IS NULL",
        )
      ).rows,
    ).toHaveLength(1);
    await asUser(outsider);
    expect(
      (
        await db.query("SELECT id FROM public.career_assessment_results WHERE id=$1", [
          inserted.rows[0].id,
        ])
      ).rows,
    ).toEqual([]);
  });

  it("blocks direct writes by banned users", async () => {
    await db.exec("RESET ROLE; SELECT set_config('request.jwt.claim.sub','',false);");
    await db.exec(`UPDATE public.profiles SET is_banned=true WHERE id='${student}'`);
    await asUser(student);
    await expect(
      db.exec(
        `INSERT INTO public.roadmap_task_events(user_id,task_id) VALUES ('${student}','test-task')`,
      ),
    ).rejects.toThrow(/permission denied/);
    await expect(
      db.query("SELECT public.replace_school_specialized_classes($1,'[]')", [school]),
    ).rejects.toThrow(/forbidden/);
  });
});
