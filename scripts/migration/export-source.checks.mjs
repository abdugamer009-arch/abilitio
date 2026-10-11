import { test } from "node:test";
import assert from "node:assert/strict";
import { listFiles, sourceConfig, prepareOutput } from "./export-source.mjs";

const project = "kxlmpctcaevmognfmalb";
const config = {
  SOURCE_SUPABASE_URL: `https://${project}.supabase.co`,
  SOURCE_SERVICE_ROLE_KEY: "synthetic-secret",
  SOURCE_DATABASE_URL: `postgresql://postgres:synthetic@db.${project}.supabase.co/postgres`,
};

test("accepts matching direct and pooler source connections", () => {
  assert.equal(sourceConfig(config).project, project);
  assert.equal(
    sourceConfig({
      ...config,
      SOURCE_DATABASE_URL: `postgresql://postgres.${project}:synthetic@aws-0-eu-central-1.pooler.supabase.com:5432/postgres`,
    }).project,
    project,
  );
});
test("rejects mismatched sources and insecure API endpoints", () => {
  for (const change of [
    { SOURCE_SUPABASE_URL: "http://example.com" },
    { SOURCE_PROJECT_ID: "hszgnxvishlrfqjuwkgm" },
    {
      SOURCE_DATABASE_URL:
        "postgresql://postgres.other:synthetic@aws-0-eu-central-1.pooler.supabase.com/postgres",
    },
    { SOURCE_DATABASE_URL: "postgresql://postgres:synthetic@evil.example/postgres" },
  ])
    assert.throws(() => sourceConfig({ ...config, ...change }));
});
test("refuses a backup inside Git", async () => {
  await assert.rejects(prepareOutput(`${process.cwd()}/private-export`), /outside the Git/);
});
test("paginates full pages and traverses nested objects without unsafe local paths", async () => {
  const calls = [];
  const client = {
    storage: {
      from: () => ({
        list: async (prefix, options) => {
          calls.push([prefix, options.offset]);
          if (prefix === "folder")
            return { data: [{ name: "..", id: "nested", metadata: { size: 1 } }] };
          if (options.offset === 100) return { data: [{ name: "last", id: "last" }] };
          return {
            data: [
              { name: "folder", id: null, metadata: null },
              ...Array.from({ length: 99 }, (_, i) => ({ name: `file${i}`, id: `${i}` })),
            ],
          };
        },
      }),
    },
  };
  const files = [];
  for await (const file of listFiles(client, "avatars")) files.push(file);
  assert.equal(files.length, 101);
  assert.equal(files[0].path, "folder/..");
  assert.deepEqual(calls, [
    ["", 0],
    ["folder", 0],
    ["", 100],
  ]);
});
test("fails rather than silently skipping inaccessible storage", async () => {
  const client = {
    storage: { from: () => ({ list: async () => ({ data: null, error: { message: "secret" } }) }) },
  };
  await assert.rejects(async () => {
    for await (const unused of listFiles(client, "private")) void unused;
  }, /incomplete/);
});
