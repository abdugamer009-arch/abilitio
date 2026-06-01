import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/** Catalogue of valid earn reasons + their fixed rewards. */
export const AURA_EARN = {
  assessment_complete: { amount: 20, label: "Assessment completed" },
  daily_login: { amount: 5, label: "Daily login" },
  streak_bonus_7: { amount: 25, label: "7-day streak bonus" },
  improvement_task: { amount: 10, label: "Improvement task" },
  retake_assessment: { amount: 5, label: "Retake assessment" },
  share_results: { amount: 10, label: "Shared results" },
  milestone: { amount: 15, label: "Milestone reached" },
  roadmap_step: { amount: 20, label: "Roadmap step finished" },
} as const;

export type AuraEarnKey = keyof typeof AURA_EARN;

export type WalletDTO = {
  balance: number;
  lifetime_earned: number;
  lifetime_spent: number;
  streak_days: number;
  last_login_date: string | null;
};

/** Read current wallet (creates an empty row on first call). */
export const getAuraWallet = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<WalletDTO> => {
    const { supabase, userId } = context;
    const { data, error } = await supabase
      .from("aura_wallets")
      .select("balance, lifetime_earned, lifetime_spent, streak_days, last_login_date")
      .eq("user_id", userId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (data) return data as WalletDTO;
    const { data: inserted, error: insErr } = await supabase
      .from("aura_wallets")
      .insert({ user_id: userId })
      .select("balance, lifetime_earned, lifetime_spent, streak_days, last_login_date")
      .single();
    if (insErr) throw new Error(insErr.message);
    return inserted as WalletDTO;
  });

/** Award coins. The reason key is validated server-side; clients cannot pick the amount. */
export const awardAura = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ reasonKey: z.enum(Object.keys(AURA_EARN) as [AuraEarnKey, ...AuraEarnKey[]]) }).parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const entry = AURA_EARN[data.reasonKey];
    const { data: w, error } = await supabase.rpc("aura_apply_delta", {
      _user: userId,
      _amount: entry.amount,
      _kind: "earn",
      _reason: data.reasonKey,
      _meta: {},
    });
    if (error) throw new Error(error.message);
    return { wallet: w as WalletDTO, amount: entry.amount, label: entry.label };
  });

/** Spend coins to unlock a feature. Idempotent — already-unlocked features return without charging. */
export const unlockFeature = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z.object({
      featureKey: z.string().min(1).max(64).regex(/^[a-z0-9_]+$/),
      price: z.number().int().min(0).max(10000),
    }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: existing } = await supabase
      .from("aura_unlocks").select("id").eq("user_id", userId).eq("feature_key", data.featureKey).maybeSingle();
    if (existing) {
      const { data: w } = await supabase
        .from("aura_wallets").select("balance, lifetime_earned, lifetime_spent, streak_days, last_login_date")
        .eq("user_id", userId).single();
      return { alreadyUnlocked: true, wallet: w as WalletDTO };
    }
    const { data: w, error } = await supabase.rpc("aura_apply_delta", {
      _user: userId, _amount: -data.price, _kind: "spend",
      _reason: `unlock:${data.featureKey}`, _meta: { featureKey: data.featureKey },
    });
    if (error) throw new Error(error.message === "insufficient_balance" ? "insufficient_balance" : error.message);
    await supabase.from("aura_unlocks").insert({ user_id: userId, feature_key: data.featureKey });
    return { alreadyUnlocked: false, wallet: w as WalletDTO };
  });

/** Daily-login streak handling. Returns the awarded amount (0 if already claimed today). */
export const claimDailyLogin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const today = new Date().toISOString().slice(0, 10);

    const { data: w0 } = await supabase
      .from("aura_wallets").select("last_login_date, streak_days")
      .eq("user_id", userId).maybeSingle();

    const last = w0?.last_login_date ?? null;
    if (last === today) {
      const { data: full } = await supabase
        .from("aura_wallets").select("balance, lifetime_earned, lifetime_spent, streak_days, last_login_date")
        .eq("user_id", userId).single();
      return { amount: 0, wallet: full as WalletDTO, streak: full?.streak_days ?? 0, bonus: false };
    }

    // Determine if streak continues (yesterday) or resets.
    let newStreak = 1;
    if (last) {
      const lastD = new Date(last + "T00:00:00Z");
      const diff = Math.floor((Date.parse(today + "T00:00:00Z") - lastD.getTime()) / 86400000);
      newStreak = diff === 1 ? (w0!.streak_days ?? 0) + 1 : 1;
    }

    const baseAmount = AURA_EARN.daily_login.amount;
    const bonus = newStreak > 0 && newStreak % 7 === 0;
    const totalAmount = baseAmount + (bonus ? AURA_EARN.streak_bonus_7.amount : 0);

    const { data: w, error } = await supabase.rpc("aura_apply_delta", {
      _user: userId, _amount: totalAmount, _kind: "earn",
      _reason: bonus ? "streak_bonus_7" : "daily_login",
      _meta: { streak: newStreak },
    });
    if (error) throw new Error(error.message);

    await supabase.from("aura_wallets")
      .update({ last_login_date: today, streak_days: newStreak })
      .eq("user_id", userId);

    return {
      amount: totalAmount,
      wallet: { ...(w as WalletDTO), last_login_date: today, streak_days: newStreak },
      streak: newStreak,
      bonus,
    };
  });
