import { createClient } from "@supabase/supabase-js";
import { createHash } from "node:crypto";
import { mkdir, realpath, writeFile, stat, open } from "node:fs/promises";
import { spawn } from "node:child_process";
import { dirname, isAbsolute, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const repository = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const activeProject = "kxlmpctcaevmognfmalb";
const digest = (value) => createHash("sha256").update(value).digest("hex");

export function sourceConfig(env) {
  const project = env.SOURCE_PROJECT_ID || activeProject;
  if (project !== activeProject) throw new Error("Source must be the verified production project.");
  if (env.SOURCE_SUPABASE_URL !== `https://${project}.supabase.co`)
    throw new Error("Source API URL does not match the verified production project.");
  if (!env.SOURCE_SERVICE_ROLE_KEY) throw new Error("SOURCE_SERVICE_ROLE_KEY is required.");
  let db;
  try {
    db = new URL(env.SOURCE_DATABASE_URL);
  } catch {
    throw new Error("SOURCE_DATABASE_URL is required.");
  }
  const user = decodeURIComponent(db.username);
  const direct = db.hostname === `db.${project}.supabase.co`;
  const pooler = db.hostname.endsWith(".pooler.supabase.com") && user === `postgres.${project}`;
  if (!["postgres:", "postgresql:"].includes(db.protocol) || (!direct && !pooler) || !db.password)
    throw new Error("Database connection must belong to the verified production project.");
  return { project, url: env.SOURCE_SUPABASE_URL, key: env.SOURCE_SERVICE_ROLE_KEY, db };
}

export async function prepareOutput(path) {
  if (!isAbsolute(path)) throw new Error("Export directory must be an absolute path.");
  const parent = await realpath(dirname(resolve(path)));
  const target = resolve(parent, resolve(path).split(sep).at(-1));
  if (target === repository || target.startsWith(repository + sep))
    throw new Error("Export directory must be outside the Git repository.");
  // A new directory prevents stale or partial exports from being mistaken for this run.
  await mkdir(target, { mode: 0o700 });
  return target;
}

function pgEnvironment(db) {
  const env = { ...process.env };
  delete env.PGSERVICE;
  delete env.PGSERVICEFILE;
  delete env.PGOPTIONS;
  return {
    ...env,
    PGHOST: db.hostname,
    PGPORT: db.port || "5432",
    PGUSER: decodeURIComponent(db.username),
    PGPASSWORD: decodeURIComponent(db.password),
    PGDATABASE: decodeURIComponent(db.pathname.slice(1)) || "postgres",
    PGSSLMODE: "verify-full",
    PGCONNECT_TIMEOUT: "20",
  };
}

async function pgTool(command, args, env) {
  await new Promise((accept, reject) => {
    const child = spawn(command, args, { env, stdio: ["ignore", "ignore", "pipe"] });
    // Never print database errors: they can contain credentials or private row values.
    child.stderr.resume();
    child.on("error", () =>
      reject(new Error(`${command} is unavailable; install PostgreSQL client tools.`)),
    );
    child.on("close", (code) =>
      code === 0 ? accept() : reject(new Error(`${command} failed. Backup is incomplete.`)),
    );
  });
}

export async function* listFiles(client, bucket, prefix = "", seen = new Set()) {
  if (seen.has(prefix)) throw new Error("Storage listing returned a folder cycle.");
  seen.add(prefix);
  for (let offset = 0; ; offset += 100) {
    const { data, error } = await client.storage.from(bucket).list(prefix, {
      limit: 100,
      offset,
      sortBy: { column: "name", order: "asc" },
    });
    if (error || !Array.isArray(data))
      throw new Error("Storage listing failed. Backup is incomplete.");
    for (const item of data) {
      if (typeof item.name !== "string" || !item.name || item.name.includes("/"))
        throw new Error("Unexpected storage entry. Backup is incomplete.");
      const path = prefix ? `${prefix}/${item.name}` : item.name;
      if (item.id == null && item.metadata == null) yield* listFiles(client, bucket, path, seen);
      else yield { ...item, path };
    }
    if (data.length < 100) break;
  }
}

async function hashFile(path) {
  const hash = createHash("sha256");
  const handle = await open(path);
  try {
    for await (const chunk of handle.createReadStream()) hash.update(chunk);
  } finally {
    await handle.close();
  }
  return hash.digest("hex");
}

export async function exportSource(env, output) {
  const config = sourceConfig(env);
  const directory = await prepareOutput(output);
  const manifestPath = resolve(directory, "manifest.json");
  const manifest = {
    formatVersion: 1,
    project: config.project,
    startedAt: new Date().toISOString(),
    complete: false,
    scope:
      "database snapshot and current storage objects; not provider configuration or historical object versions",
    writeFreezeVerified: false,
    buckets: [],
    files: [],
    database: null,
  };
  const save = () => writeFile(manifestPath, JSON.stringify(manifest, null, 2), { mode: 0o600 });
  await save();
  const dbPath = resolve(directory, "database.dump");
  await writeFile(dbPath, "", { mode: 0o600, flag: "wx" });
  await pgTool("pg_dump", ["--format=custom", "--file", dbPath], pgEnvironment(config.db));
  await pgTool("pg_restore", ["--list", dbPath], pgEnvironment(config.db));
  manifest.database = {
    localFile: "database.dump",
    bytes: (await stat(dbPath)).size,
    sha256: await hashFile(dbPath),
  };
  await save();
  const client = createClient(config.url, config.key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data: buckets, error } = await client.storage.listBuckets();
  if (error || !Array.isArray(buckets))
    throw new Error("Bucket inventory failed. Backup is incomplete.");
  manifest.buckets = buckets;
  const filesDirectory = resolve(directory, "objects");
  await mkdir(filesDirectory, { mode: 0o700 });
  for (const bucket of buckets) {
    for await (const file of listFiles(client, bucket.id)) {
      const { data, error: downloadError } = await client.storage
        .from(bucket.id)
        .download(file.path);
      if (downloadError || !data) throw new Error("Object download failed. Backup is incomplete.");
      const bytes = Buffer.from(await data.arrayBuffer());
      if (file.metadata?.size != null && Number(file.metadata.size) !== bytes.length)
        throw new Error("Object size changed during export. Backup is incomplete.");
      const localFile = `objects/${digest(JSON.stringify([bucket.id, file.path]))}`;
      await writeFile(resolve(directory, localFile), bytes, { mode: 0o600, flag: "wx" });
      manifest.files.push({
        bucket: bucket.id,
        ...file,
        localFile,
        bytes: bytes.length,
        sha256: digest(bytes),
      });
      await save();
    }
  }
  manifest.complete = true;
  manifest.finishedAt = new Date().toISOString();
  await save();
  return { buckets: buckets.length, files: manifest.files.length };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.umask(0o077);
  if (!process.argv[2]) {
    console.error(
      "Usage: node scripts/migration/export-source.mjs /absolute/private/new-export-directory",
    );
    process.exitCode = 1;
  } else {
    exportSource(process.env, process.argv[2])
      .then(({ buckets, files }) => {
        console.log(
          `Source backup saved: ${buckets} buckets, ${files} current objects. Restore and final reconciliation remain required.`,
        );
      })
      .catch((error) => {
        console.error(error.message);
        process.exitCode = 1;
      });
  }
}
