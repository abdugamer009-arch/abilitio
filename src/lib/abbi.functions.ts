import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { WalletDTO } from "./aura.functions";

const ABBI_MESSAGE_COST = 2;
const NEW_USER_BONUS = 20;
const BONUS_KEY = "new_user_bonus";

/** Spend 2 Aura coins to ask ABBI a paid question. */
export const spendAbbiMessage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data, error } = await supabase.rpc("aura_apply_delta", {
      _user: userId,
      _amount: -ABBI_MESSAGE_COST,
      _kind: "spend",
      _reason: "abbi_ai_message",
      _meta: {},
    });
    if (error) {
      const reason = error.message?.includes("insufficient_balance") ? "insufficient_balance" : error.message;
      throw new Error(reason);
    }
    return { wallet: data as WalletDTO, amount: ABBI_MESSAGE_COST };
  });

/** Award the +20 first-time-account bonus. Idempotent via aura_achievements row.
 *  Uses service-role client for the achievement insert because the public
 *  self-insert RLS policy has been removed for security. */
export const claimNewUserBonus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: existing } = await supabaseAdmin
      .from("aura_achievements")
      .select("id")
      .eq("user_id", userId)
      .eq("achievement_key", BONUS_KEY)
      .maybeSingle();

    if (existing) {
      const { data: w } = await supabase
        .from("aura_wallets")
        .select("balance, lifetime_earned, lifetime_spent, streak_days, last_login_date")
        .eq("user_id", userId)
        .single();
      return { awarded: false, amount: 0, wallet: w as WalletDTO };
    }

    const { data: w, error } = await supabase.rpc("aura_apply_delta", {
      _user: userId,
      _amount: NEW_USER_BONUS,
      _kind: "earn",
      _reason: BONUS_KEY,
      _meta: {},
    });
    if (error) throw new Error(error.message);

    await supabaseAdmin
      .from("aura_achievements")
      .insert({ user_id: userId, achievement_key: BONUS_KEY });

    return { awarded: true, amount: NEW_USER_BONUS, wallet: w as WalletDTO };
  });
