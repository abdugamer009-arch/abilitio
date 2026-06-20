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
  totalAuraPurchased: number;
  totalAuraInCirculation: number;
  totalAbbiQuestions: number;
  newUsersThisWeek: number;
  newUsersThisMonth: number;
  dau: number;
  wau: number;
  mau: number;
  payingUsers: number;
  revenueToday: number;
  revenueMonth: number;
  revenueYear: number;
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
    const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000).toISOString();
    const todayStr = now.toISOString().slice(0, 10);
    const monthStr = now.toISOString().slice(0, 7);

    const [profiles, results, wallets, txns, adminRoles, communities, messages] = await Promise.all([
      supabase.from("profiles").select("id, created_at, updated_at"),
      supabase.from("assessment_results").select("id, user_id, mbti_type, careers, created_at"),
      supabase.from("aura_wallets").select("user_id, balance, lifetime_earned, lifetime_spent, updated_at"),
      supabase.from("aura_transactions").select("user_id, amount, reason, created_at"),
      supabase.from("user_roles").select("user_id").eq("role", "admin"),
      supabase.from("communities").select("id, name"),
      supabase.from("community_messages").select("community_id, user_id, created_at"),
    ]);

    const adminIds = new Set<string>((adminRoles.data ?? []).map((r) => (r as { user_id: string }).user_id));
    const allProfiles = (profiles.data ?? []).filter((p) => !adminIds.has((p as { id: string }).id)) as { id: string; created_at: string; updated_at: string }[];
    const allResults = (results.data ?? []).filter((r) => !adminIds.has((r as { user_id: string }).user_id)) as { user_id: string; mbti_type: string | null; careers: unknown }[];
    const allWallets = (wallets.data ?? []).filter((w) => !adminIds.has((w as { user_id: string }).user_id)) as { user_id: string; balance: number }[];
    const allTxns = (txns.data ?? []).filter((t) => !adminIds.has((t as { user_id: string }).user_id)) as { user_id: string; amount: number; reason: string; created_at: string }[];
    const allMessages = (messages.data ?? []).filter((m) => !adminIds.has((m as { user_id: string }).user_id)) as { community_id: string; user_id: string; created_at: string }[];

    const newUsersThisWeek = allProfiles.filter((p) => p.created_at >= weekAgo).length;
    const newUsersThisMonth = allProfiles.filter((p) => p.created_at >= monthAgo).length;

    const activitySets = { dau: new Set<string>(), wau: new Set<string>(), mau: new Set<string>() };
    for (const t of allTxns) {
      if (t.created_at >= dayAgo) activitySets.dau.add(t.user_id);
      if (t.created_at >= weekAgo) activitySets.wau.add(t.user_id);
      if (t.created_at >= monthAgo) activitySets.mau.add(t.user_id);
    }
    for (const m of allMessages) {
      if (m.created_at >= dayAgo) activitySets.dau.add(m.user_id);
      if (m.created_at >= weekAgo) activitySets.wau.add(m.user_id);
      if (m.created_at >= monthAgo) activitySets.mau.add(m.user_id);
    }

    const totalAuraInCirculation = allWallets.reduce((s, w) => s + (w.balance || 0), 0);
    const purchaseTxns = allTxns.filter((t) => typeof t.reason === "string" && t.reason.startsWith("purchase"));
    const totalAuraPurchased = purchaseTxns.reduce((s, t) => s + (t.amount > 0 ? t.amount : 0), 0);
    const totalAbbiQuestions = allTxns.filter((t) => t.reason === "abbi_ai_message").length;

    const payingUsers = new Set<string>(purchaseTxns.map((t) => t.user_id)).size;
    const revenueToday = purchaseTxns
      .filter((t) => t.created_at.slice(0, 10) === todayStr)
      .reduce((s, t) => s + (t.amount > 0 ? t.amount : 0), 0);
    const revenueMonth = purchaseTxns
      .filter((t) => t.created_at.slice(0, 7) === monthStr)
      .reduce((s, t) => s + (t.amount > 0 ? t.amount : 0), 0);
    const revenueYear = purchaseTxns
      .filter((t) => t.created_at >= yearAgo)
      .reduce((s, t) => s + (t.amount > 0 ? t.amount : 0), 0);

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
      if (r.mbti_type) mbtiCount.set(r.mbti_type, (mbtiCount.get(r.mbti_type) || 0) + 1);
      const careers = (r.careers as { name?: string }[]) || [];
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
      totalAuraPurchased,
      totalAuraInCirculation,
      totalAbbiQuestions,
      newUsersThisWeek,
      newUsersThisMonth,
      dau: activitySets.dau.size,
      wau: activitySets.wau.size,
      mau: activitySets.mau.size,
      payingUsers,
      revenueToday,
      revenueMonth,
      revenueYear,
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
  aura_balance: number;
  has_assessment: boolean;
};

const ADMIN_USER_PAGE_SIZE = 500;

export const getAdminUsers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<AdminUserRow[]> => {
    const { supabase, userId } = context;
    await ensureAdmin(supabase, userId);

    const [profiles, wallets, results, authRes] = await Promise.all([
      supabase.from("profiles").select("id, name, surname, age_group, is_banned, created_at"),
      supabase.from("aura_wallets").select("user_id, balance"),
      supabase.from("assessment_results").select("user_id"),
      supabaseAdmin.auth.admin.listUsers({ perPage: ADMIN_USER_PAGE_SIZE }),
    ]);

    const emailMap = new Map<string, string>();
    for (const u of authRes.data?.users ?? []) {
      if (u.email) emailMap.set(u.id, u.email);
    }
    const walletMap = new Map<string, number>();
    for (const w of wallets.data ?? []) {
      const row = w as { user_id: string; balance: number };
      walletMap.set(row.user_id, row.balance);
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
        aura_balance: walletMap.get(p.id) ?? 0,
        has_assessment: assessedSet.has(p.id),
      })).sort((a, b) => (a.created_at > b.created_at ? -1 : 1));
  });

const adjustAuraSchema = z.object({
  target: z.string().uuid("target must be a valid user UUID"),
  amount: z.number().int().min(-10000).max(10000),
  reason: z.string().min(1).max(200).optional(),
});

const setBanSchema = z.object({
  target: z.string().uuid("target must be a valid user UUID"),
  banned: z.boolean(),
});

export const adminAdjustAura = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => adjustAuraSchema.parse(input))
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;
    await ensureAdmin(supabase, userId);
    const { error } = await supabase.rpc("admin_adjust_aura", {
      _target: data.target,
      _amount: data.amount,
      _reason: data.reason ?? "admin_adjust",
    });
    if (error) throw new Error("Failed to adjust aura balance");
    return { ok: true };
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
