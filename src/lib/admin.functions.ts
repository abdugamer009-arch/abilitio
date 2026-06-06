import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function ensureAdmin(supabase: any, userId: string) {
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
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();

    const [profiles, results, wallets, txns, adminRoles] = await Promise.all([
      supabase.from("profiles").select("id, created_at"),
      supabase.from("assessment_results").select("id, user_id, mbti_type, careers"),
      supabase.from("aura_wallets").select("user_id, balance, lifetime_earned, lifetime_spent"),
      supabase.from("aura_transactions").select("user_id, amount, reason, created_at"),
      supabase.from("user_roles").select("user_id").eq("role", "admin"),
    ]);

    const adminIds = new Set<string>((adminRoles.data ?? []).map((r: any) => r.user_id));
    const allProfiles = (profiles.data ?? []).filter((p: any) => !adminIds.has(p.id));
    const allResults = (results.data ?? []).filter((r: any) => !adminIds.has(r.user_id));
    const allWallets = (wallets.data ?? []).filter((w: any) => !adminIds.has(w.user_id));
    const allTxns = (txns.data ?? []).filter((t: any) => !adminIds.has(t.user_id));

    const newUsersThisWeek = allProfiles.filter((p: any) => p.created_at >= weekAgo).length;
    const newUsersThisMonth = allProfiles.filter((p: any) => p.created_at >= monthAgo).length;

    const totalAuraInCirculation = allWallets.reduce((s: number, w: any) => s + (w.balance || 0), 0);
    const totalAuraPurchased = allTxns
      .filter((t: any) => t.reason === "purchase" || t.reason?.startsWith("purchase"))
      .reduce((s: number, t: any) => s + (t.amount > 0 ? t.amount : 0), 0);
    const totalAbbiQuestions = allTxns.filter((t: any) => t.reason === "abbi_ai_message").length;

    const mbtiCount = new Map<string, number>();
    const careerCount = new Map<string, number>();
    for (const r of allResults) {
      if (r.mbti_type) mbtiCount.set(r.mbti_type, (mbtiCount.get(r.mbti_type) || 0) + 1);
      const careers = (r.careers as any[]) || [];
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
      const count = allProfiles.filter((p: any) => p.created_at.slice(0, 10) === key).length;
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

export const getAdminUsers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<AdminUserRow[]> => {
    const { supabase, userId } = context;
    await ensureAdmin(supabase, userId);

    // Use admin client to read auth.users emails
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const [profiles, wallets, results, authRes] = await Promise.all([
      supabase.from("profiles").select("id, name, surname, age_group, is_banned, created_at"),
      supabase.from("aura_wallets").select("user_id, balance"),
      supabase.from("assessment_results").select("user_id"),
      supabaseAdmin.auth.admin.listUsers({ perPage: 1000 }),
    ]);

    const emailMap = new Map<string, string>();
    for (const u of authRes.data?.users ?? []) {
      if (u.email) emailMap.set(u.id, u.email);
    }
    const walletMap = new Map<string, number>();
    for (const w of wallets.data ?? []) walletMap.set((w as any).user_id, (w as any).balance);
    const assessedSet = new Set<string>((results.data ?? []).map((r: any) => r.user_id));

    return (profiles.data ?? []).map((p: any) => ({
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

export const adminAdjustAura = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { target: string; amount: number; reason?: string }) => input)
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;
    await ensureAdmin(supabase, userId);
    const { error } = await supabase.rpc("admin_adjust_aura", {
      _target: data.target,
      _amount: data.amount,
      _reason: data.reason ?? "admin_adjust",
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminSetBan = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { target: string; banned: boolean }) => input)
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;
    await ensureAdmin(supabase, userId);
    const { error } = await supabase.rpc("admin_set_ban", {
      _target: data.target,
      _banned: data.banned,
    });
    if (error) throw new Error(error.message);
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
