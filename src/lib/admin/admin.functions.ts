import { readAllResult } from "../db-read";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { SupabaseClient } from "@supabase/supabase-js";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import type { Database } from "@/integrations/supabase/types";

type DbClient = SupabaseClient<Database>;

export type AuthContext = { supabase: DbClient; userId: string; claims?: { email?: string } };

/** Database roles are authoritative across actions, RLS, badges and Realtime. */
export async function resolveAdminStatus(
  context: AuthContext,
): Promise<{ isAdmin: boolean; email: string | null }> {
  const { data, error } = await context.supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", context.userId)
    .eq("role", "admin")
    .maybeSingle();
  if (error) throw new Error("Could not verify administrator access");
  return { isAdmin: Boolean(data), email: context.claims?.email ?? null };
}

export async function ensureAdmin(context: AuthContext) {
  const { isAdmin } = await resolveAdminStatus(context);
  if (!isAdmin) throw new Error("forbidden");
}

/** Protected writes require a successful moderation lookup. */
export async function ensureNotBanned(userId: string): Promise<void> {
  const { data, error } = await supabaseAdmin
    .from("profiles")
    .select("is_banned")
    .eq("id", userId)
    .maybeSingle();
  if (error || !data) throw new Error("Account status is unavailable. Please retry.");
  if (data.is_banned) throw new Error("account_banned");
}

export type AdminAnalytics = {
  totalUsers: number;
  completedAssessments: number;
  newUsersThisWeek: number;
  newUsersThisMonth: number;
  dau: number;
  wau: number;
  mau: number;
  mostActiveCommunity: { name: string; messageCount: number } | null;
  popularCareers: { name: string; count: number }[];
  popularMbti: { type: string; count: number }[];
  weeklySignups: { day: string; count: number }[];
};

export const getAdminAnalytics = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<AdminAnalytics> => {
    await ensureAdmin(context);

    const now = new Date();
    const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();

    // Resolve the DB admin role first, then read complete paginated datasets.
    const [profiles, results, adminRoles, communities, messages] = await Promise.all([
      readAllResult((from, to) =>
        supabaseAdmin
          .from("profiles")
          .select("id, created_at, updated_at")
          .order("id")
          .range(from, to),
      ),
      readAllResult((from, to) =>
        supabaseAdmin
          .from("career_assessment_results")
          .select("id, user_id, personality_type, career_matches, created_at")
          .order("id")
          .range(from, to),
      ),
      readAllResult((from, to) =>
        supabaseAdmin
          .from("user_roles")
          .select("user_id")
          .eq("role", "admin")
          .order("id")
          .range(from, to),
      ),
      readAllResult((from, to) =>
        supabaseAdmin.from("communities").select("id, name").order("id").range(from, to),
      ),
      readAllResult((from, to) =>
        supabaseAdmin
          .from("community_messages")
          .select("community_id, user_id, created_at")
          .order("id")
          .range(from, to),
      ),
    ]);

    // Surface a failed read instead of rendering it as real data. Every query
    // below falls back to `[]`, so without this check a bad service-role key
    // (or any outage) produces a dashboard confidently reporting zero users,
    // zero assessments and no activity — which reads as "the product is dead"
    // rather than "the query failed".
    const failed = [
      ["profiles", profiles.error],
      ["career_assessment_results", results.error],
      ["user_roles", adminRoles.error],
      ["communities", communities.error],
      ["community_messages", messages.error],
    ].filter(([, err]) => err) as [string, { message: string }][];

    if (failed.length) {
      const detail = failed.map(([table, err]) => `${table}: ${err.message}`).join("; ");
      console.error("[admin] analytics read failed —", detail);
      throw new Error(
        `Could not load analytics. The server could not read from the database (${detail}). Check SUPABASE_SERVICE_ROLE_KEY.`,
      );
    }

    const adminIds = new Set<string>(
      (adminRoles.data ?? []).map((r) => (r as { user_id: string }).user_id),
    );
    const allProfiles = (profiles.data ?? []).filter(
      (p) => !adminIds.has((p as { id: string }).id),
    ) as { id: string; created_at: string; updated_at: string }[];
    const allResults = (results.data ?? []).filter(
      (r) => !adminIds.has((r as { user_id: string }).user_id),
    ) as {
      user_id: string;
      personality_type: string | null;
      career_matches: unknown;
      created_at: string;
    }[];
    const allMessages = (messages.data ?? []).filter(
      (m) => !adminIds.has((m as { user_id: string }).user_id),
    ) as { community_id: string; user_id: string; created_at: string }[];

    const newUsersThisWeek = allProfiles.filter((p) => p.created_at >= weekAgo).length;
    const newUsersThisMonth = allProfiles.filter((p) => p.created_at >= monthAgo).length;

    const activitySets = { dau: new Set<string>(), wau: new Set<string>(), mau: new Set<string>() };
    for (const r of allResults) {
      if (r.created_at >= dayAgo) activitySets.dau.add(r.user_id);
      if (r.created_at >= weekAgo) activitySets.wau.add(r.user_id);
      if (r.created_at >= monthAgo) activitySets.mau.add(r.user_id);
    }
    for (const m of allMessages) {
      if (m.created_at >= dayAgo) activitySets.dau.add(m.user_id);
      if (m.created_at >= weekAgo) activitySets.wau.add(m.user_id);
      if (m.created_at >= monthAgo) activitySets.mau.add(m.user_id);
    }

    const commNameMap = new Map<string, string>(
      (communities.data ?? []).map((c) => [(c as { id: string }).id, (c as { name: string }).name]),
    );
    const commCount = new Map<string, number>();
    for (const m of allMessages)
      commCount.set(m.community_id, (commCount.get(m.community_id) || 0) + 1);
    const sortedComm = [...commCount.entries()].sort((a, b) => b[1] - a[1]);
    const mostActiveCommunity = sortedComm[0]
      ? { name: commNameMap.get(sortedComm[0][0]) ?? "—", messageCount: sortedComm[0][1] }
      : null;

    const mbtiCount = new Map<string, number>();
    const careerCount = new Map<string, number>();
    for (const r of allResults) {
      if (r.personality_type)
        mbtiCount.set(r.personality_type, (mbtiCount.get(r.personality_type) || 0) + 1);
      const careers = (r.career_matches as { name?: string }[]) || [];
      const top = careers[0];
      if (top?.name) careerCount.set(top.name, (careerCount.get(top.name) || 0) + 1);
    }
    const popularCareers = [...careerCount.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, count]) => ({ name, count }));
    const popularMbti = [...mbtiCount.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([type, count]) => ({ type, count }));

    const days: { day: string; count: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 86400000);
      const key = d.toISOString().slice(0, 10);
      const label = d.toLocaleDateString("en-US", { weekday: "short" });
      const count = allProfiles.filter((p) => p.created_at.slice(0, 10) === key).length;
      days.push({ day: label, count });
    }

    return {
      totalUsers: allProfiles.length,
      completedAssessments: allResults.length,
      newUsersThisWeek,
      newUsersThisMonth,
      dau: activitySets.dau.size,
      wau: activitySets.wau.size,
      mau: activitySets.mau.size,
      mostActiveCommunity,
      popularCareers,
      popularMbti,
      weeklySignups: days,
    };
  });

export type AdminUserRow = {
  id: string;
  name: string;
  surname: string;
  email: string;
  age_group: string | null;
  is_banned: boolean;
  created_at: string;
  has_assessment: boolean;
};

const ADMIN_USER_PAGE_SIZE = 500;

async function listAllAuthUsers() {
  const users = [];
  for (let page = 1; ; page++) {
    const result = await supabaseAdmin.auth.admin.listUsers({
      page,
      perPage: ADMIN_USER_PAGE_SIZE,
    });
    if (result.error) throw new Error("Could not load account emails");
    users.push(...result.data.users);
    if (result.data.users.length < ADMIN_USER_PAGE_SIZE) return { data: { users }, error: null };
  }
}

export const getAdminUsers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<AdminUserRow[]> => {
    await ensureAdmin(context);

    const [profiles, results, authRes] = await Promise.all([
      readAllResult((from, to) =>
        supabaseAdmin
          .from("profiles")
          .select("id, name, surname, age_group, is_banned, created_at")
          .order("id")
          .range(from, to),
      ),
      readAllResult((from, to) =>
        supabaseAdmin
          .from("career_assessment_results")
          .select("user_id")
          .order("id")
          .range(from, to),
      ),
      listAllAuthUsers(),
    ]);

    // Same reasoning as getAdminAnalytics: an unreported failure here renders
    // as "No users found", which looks like an empty product rather than a
    // broken connection.
    const failed = [
      ["profiles", profiles.error],
      ["career_assessment_results", results.error],
      ["auth.users", authRes.error],
    ].filter(([, err]) => err) as [string, { message: string }][];

    if (failed.length) {
      const detail = failed.map(([source, err]) => `${source}: ${err.message}`).join("; ");
      console.error("[admin] user list read failed —", detail);
      throw new Error(
        `Could not load users. The server could not read from the database (${detail}). Check SUPABASE_SERVICE_ROLE_KEY.`,
      );
    }

    const emailMap = new Map<string, string>();
    for (const u of authRes.data?.users ?? []) {
      if (u.email) emailMap.set(u.id, u.email);
    }
    const assessedSet = new Set<string>(
      (results.data ?? []).map((r) => (r as { user_id: string }).user_id),
    );

    return (
      (profiles.data ?? []) as {
        id: string;
        name: string | null;
        surname: string | null;
        age_group: string | null;
        is_banned: boolean | null;
        created_at: string;
      }[]
    )
      .map((p) => ({
        id: p.id,
        name: p.name ?? "",
        surname: p.surname ?? "",
        email: emailMap.get(p.id) ?? "—",
        age_group: p.age_group ?? null,
        is_banned: !!p.is_banned,
        created_at: p.created_at,
        has_assessment: assessedSet.has(p.id),
      }))
      .sort((a, b) => (a.created_at > b.created_at ? -1 : 1));
  });

const setBanSchema = z.object({
  target: z.string().uuid("target must be a valid user UUID"),
  banned: z.boolean(),
});

export const adminSetBan = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => setBanSchema.parse(input))
  .handler(async ({ context, data }) => {
    await ensureAdmin(context);
    // The verified DB administrator may update moderation through the service role.
    const { error } = await supabaseAdmin
      .from("profiles")
      .update({ is_banned: data.banned, updated_at: new Date().toISOString() })
      .eq("id", data.target);
    if (error) throw new Error("Failed to update ban status");
    return { ok: true };
  });

export const checkIsAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<{ isAdmin: boolean; email: string | null }> => {
    return resolveAdminStatus(context);
  });
