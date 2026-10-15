// Dry run by default. Do not run --apply until the human explicitly confirms
// this exact owner and these exact fixture IDs. Never identifies QA by name.
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { pathToFileURL } from "node:url";
export function validateManifest(value) {
  const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (
    !value ||
    !uuid.test(value.ownerId) ||
    !Array.isArray(value.resultIds) ||
    !Array.isArray(value.communityIds) ||
    [...value.resultIds, ...value.communityIds].some((id) => !uuid.test(id))
  )
    throw new Error("Provide an owner UUID and exact resultIds/communityIds UUID arrays");
  if (!value.resultIds.length && !value.communityIds.length) throw new Error("Manifest is empty");
  return {
    ownerId: value.ownerId,
    resultIds: [...new Set(value.resultIds)],
    communityIds: [...new Set(value.communityIds)],
  };
}
export async function cleanup(client, manifest, apply = false, confirmation = "") {
  const m = validateManifest(manifest);
  if (apply && confirmation !== m.ownerId)
    throw new Error("Explicit owner confirmation is required");
  const result = m.resultIds.length
    ? await client
        .from("career_assessment_results")
        .select("id")
        .eq("user_id", m.ownerId)
        .in("id", m.resultIds)
    : { data: [], error: null };
  const membership = m.communityIds.length
    ? await client
        .from("community_members")
        .select("community_id")
        .eq("user_id", m.ownerId)
        .in("community_id", m.communityIds)
    : { data: [], error: null };
  if (result.error || membership.error) throw new Error("Cannot verify QA record ownership");
  if (result.data.length !== m.resultIds.length || membership.data.length !== m.communityIds.length)
    throw new Error(
      "Some IDs are absent or do not belong to the confirmed owner; no deletions performed",
    );
  if (apply) {
    if (m.resultIds.length) {
      const r = await client
        .from("career_assessment_results")
        .delete()
        .eq("user_id", m.ownerId)
        .in("id", m.resultIds);
      if (r.error) throw new Error("Result cleanup failed; inspect before retry");
    }
    if (m.communityIds.length) {
      const r = await client
        .from("community_members")
        .delete()
        .eq("user_id", m.ownerId)
        .in("community_id", m.communityIds);
      if (r.error) throw new Error("Membership cleanup failed; inspect before retry");
      for (const id of m.communityIds) {
        const count = await client
          .from("community_members")
          .select("*", { count: "exact", head: true })
          .eq("community_id", id);
        if (count.error) throw new Error("Membership count read failed");
        const update = await client
          .from("communities")
          .update({ member_count: count.count })
          .eq("id", id);
        if (update.error) throw new Error("Membership count update failed");
      }
    }
  }
  return {
    mode: apply ? "applied" : "dry-run",
    ...m,
    resultCount: result.data.length,
    membershipCount: membership.data.length,
  };
}
async function main() {
  const arg = process.argv.find((a) => a.startsWith("--manifest="));
  if (!arg)
    throw new Error(
      "Usage: node scripts/cleanup-qa.mjs --manifest=/private/path.json [--apply]. Default is read-only.",
    );
  const m = validateManifest(JSON.parse(await readFile(arg.slice(11), "utf8")));
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY)
    throw new Error("Server-only SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY required");
  const { createClient } = await import("@supabase/supabase-js");
  const client = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const report = await cleanup(
    client,
    m,
    process.argv.includes("--apply"),
    process.env.QA_CLEANUP_CONFIRM,
  );
  await mkdir("artifacts/qa", { recursive: true });
  await writeFile("artifacts/qa/cleanup-plan.json", JSON.stringify(report, null, 2));
  console.log(
    `${report.mode}: ${report.resultCount} results and ${report.membershipCount} memberships; private plan in artifacts/qa/cleanup-plan.json`,
  );
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href)
  main().catch((e) => {
    console.error(e.message);
    process.exitCode = 1;
  });
