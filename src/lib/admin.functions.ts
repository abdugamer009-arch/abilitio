import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { SupabaseClient } from "@supabase/supabase-js";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import type { Database } from "@/integrations/supabase/types";

type DbClient = SupabaseClient<Database>;

async function ensureAdmin(supabase: DbClient, userId: string) {
  const { data } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (!data) throw new Error("forbidden");
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
    const { supabase, userId } = context;
    await ensureAdmin(supabase, userId);

    const now = new Date();
    const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();

    const [profiles, results, adminRoles, communities, messages] = await Promise.all([
      supabase.from("profiles").select("id, created_at, updated_at"),
      supabase.from("career_assessment_results").select("id, user_id, personality_type, career_matches, created_at"),
      supabase.from("user_roles").select("user_id").eq("role", "admin"),
      supabase.from("communities").select("id, name"),
      supabase.from("community_messages").select("community_id, user_id, created_at"),
    ]);

    const adminIds = new Set<string>((adminRoles.data ?? []).map((r) => (r as { user_id: string }).user_id));
    const allProfiles = (profiles.data ?? []).filter((p) => !adminIds.has((p as { id: string }).id)) as { id: string; created_at: string; updated_at: string }[];
    const allResults = (results.data ?? []).filter((r) => !adminIds.has((r as { user_id: string }).user_id)) as { user_id: string; personality_type: string | null; career_matches: unknown; created_at: string }[];
    const allMessages = (messages.data ?? []).filter((m) => !adminIds.has((m as { user_id: string }).user_id)) as { community_id: string; user_id: string; created_at: string }[];

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

    const commNameMap = new Map<string, string>((communities.data ?? []).map((c) => [(c as { id: string }).id, (c as { name: string }).name]));
    const commCount = new Map<string, number>();
    for (const m of allMessages) commCount.set(m.community_id, (commCount.get(m.community_id) || 0) + 1);
    const sortedComm = [...commCount.entries()].sort((a, b) => b[1] - a[1]);
    const mostActiveCommunity = sortedComm[0]
      ? { name: commNameMap.get(sortedComm[0][0]) ?? "—", messageCount: sortedComm[0][1] }
      : null;

    const mbtiCount = new Map<string, number>();
    const careerCount = new Map<string, number>();
    for (const r of allResults) {
      if (r.personality_type) mbtiCount.set(r.personality_type, (mbtiCount.get(r.personality_type) || 0) + 1);
      const careers = (r.career_matches as { name?: string }[]) || [];
      const top = careers[0];
      if (top?.name) careerCount.set(top.name, (careerCount.get(top.name) || 0) + 1);
    }
    const popularCareers = [...careerCount.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6).map(([name, count]) => ({ name, count }));
    const popularMbti = [...mbtiCount.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8).map(([type, count]) => ({ type, count }));

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

export const getAdminUsers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<AdminUserRow[]> => {
    const { supabase, userId } = context;
    await ensureAdmin(supabase, userId);

    const [profiles, results, authRes] = await Promise.all([
      supabase.from("profiles").select("id, name, surname, age_group, is_banned, created_at"),
      supabase.from("career_assessment_results").select("user_id"),
      supabaseAdmin.auth.admin.listUsers({ perPage: ADMIN_USER_PAGE_SIZE }),
    ]);

    const emailMap = new Map<string, string>();
    for (const u of authRes.data?.users ?? []) {
      if (u.email) emailMap.set(u.id, u.email);
    }
    const assessedSet = new Set<string>((results.data ?? []).map((r) => (r as { user_id: string }).user_id));

    return ((profiles.data ?? []) as { id: string; name: string | null; surname: string | null; age_group: string | null; is_banned: boolean | null; created_at: string }[])
      .map((p) => ({
        id: p.id,
        name: p.name ?? "",
        surname: p.surname ?? "",
        email: emailMap.get(p.id) ?? "—",
        age_group: p.age_group ?? null,
        is_banned: !!p.is_banned,
        created_at: p.created_at,
        has_assessment: assessedSet.has(p.id),
      })).sort((a, b) => (a.created_at > b.created_at ? -1 : 1));
  });

const setBanSchema = z.object({
  target: z.string().uuid("target must be a valid user UUID"),
  banned: z.boolean(),
});

export const adminSetBan = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => setBanSchema.parse(input))
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;
    await ensureAdmin(supabase, userId);
    const { error } = await supabase.rpc("admin_set_ban", {
      _target: data.target,
      _banned: data.banned,
    });
    if (error) throw new Error("Failed to update ban status");
    return { ok: true };
  });

export const checkIsAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<{ isAdmin: boolean }> => {
    const { supabase, userId } = context;
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();
    return { isAdmin: !!data };
  });
