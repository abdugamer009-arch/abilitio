import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { ACHIEVEMENTS, type GrowthState } from "./aura-growth";

export type AchievementRow = { achievement_key: string; unlocked_at: string };

export const getMyAchievements = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<AchievementRow[]> => {
    const { supabase, userId } = context;
    const { data, error } = await supabase
      .from("aura_achievements")
      .select("achievement_key, unlocked_at")
      .eq("user_id", userId)
      .order("unlocked_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []) as AchievementRow[];
  });

export type EvaluateResult = {
  newlyUnlocked: { key: string; reward: number }[];
  totalReward: number;
};

/**
 * Idempotently evaluates achievements against current state and grants any newly-earned ones.
 * Safe to call repeatedly; only inserts keys the user doesn't already own.
 */
export const evaluateAchievements = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<EvaluateResult> => {
    const { supabase, userId } = context;

    // Load state
    const [walletRes, achRes, assessRes, unlockRes] = await Promise.all([
      supabase
        .from("aura_wallets")
        .select("balance, lifetime_earned, lifetime_spent, streak_days")
        .eq("user_id", userId)
        .maybeSingle(),
      supabase.from("aura_achievements").select("achievement_key").eq("user_id", userId),
      supabase.from("assessment_results").select("id", { count: "exact", head: true }).eq("user_id", userId),
      supabase.from("aura_unlocks").select("id", { count: "exact", head: true }).eq("user_id", userId),
    ]);

    const w = walletRes.data;
    const state: GrowthState = {
      balance: w?.balance ?? 0,
      lifetimeEarned: w?.lifetime_earned ?? 0,
      lifetimeSpent: w?.lifetime_spent ?? 0,
      streakDays: w?.streak_days ?? 0,
      assessmentsCompleted: assessRes.count ?? 0,
      unlocksCount: unlockRes.count ?? 0,
    };

    const owned = new Set((achRes.data ?? []).map((r) => r.achievement_key));
    const newlyUnlocked: { key: string; reward: number }[] = [];

    for (const a of ACHIEVEMENTS) {
      if (owned.has(a.key)) continue;
      if (!a.check(state)) continue;

      // Insert achievement
      const { error: insErr } = await supabase
        .from("aura_achievements")
        .insert({ user_id: userId, achievement_key: a.key });
      if (insErr) continue; // skip duplicates / failures silently

      // Award coins
      if (a.reward > 0) {
        await supabase.rpc("aura_apply_delta", {
          _user: userId,
          _amount: a.reward,
          _kind: "earn",
          _reason: `achievement:${a.key}`,
          _meta: { achievement: a.key },
        });
      }
      newlyUnlocked.push({ key: a.key, reward: a.reward });
    }

    const totalReward = newlyUnlocked.reduce((sum, x) => sum + x.reward, 0);
    return { newlyUnlocked, totalReward };
  });

/** Aggregated growth state for the dashboard. */
export const getMyGrowthState = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<GrowthState> => {
    const { supabase, userId } = context;
    const [walletRes, assessRes, unlockRes] = await Promise.all([
      supabase
        .from("aura_wallets")
        .select("balance, lifetime_earned, lifetime_spent, streak_days")
        .eq("user_id", userId)
        .maybeSingle(),
      supabase.from("assessment_results").select("id", { count: "exact", head: true }).eq("user_id", userId),
      supabase.from("aura_unlocks").select("id", { count: "exact", head: true }).eq("user_id", userId),
    ]);
    const w = walletRes.data;
    return {
      balance: w?.balance ?? 0,
      lifetimeEarned: w?.lifetime_earned ?? 0,
      lifetimeSpent: w?.lifetime_spent ?? 0,
      streakDays: w?.streak_days ?? 0,
      assessmentsCompleted: assessRes.count ?? 0,
      unlocksCount: unlockRes.count ?? 0,
    };
  });
