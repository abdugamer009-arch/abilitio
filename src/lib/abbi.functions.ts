import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import type { WalletDTO } from "./aura.functions";
import { ABBI_MESSAGE_COST, ABBI_NEW_USER_BONUS, ABBI_BONUS_KEY } from "./constants";
import { generateAbbiReply, type AbbiContext } from "./abbi-knowledge";

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

    const { data: existing } = await supabaseAdmin
      .from("aura_achievements")
      .select("id")
      .eq("user_id", userId)
      .eq("achievement_key", ABBI_BONUS_KEY)
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
      _amount: ABBI_NEW_USER_BONUS,
      _kind: "earn",
      _reason: ABBI_BONUS_KEY,
      _meta: {},
    });
    if (error) throw new Error(error.message);

    await supabaseAdmin
      .from("aura_achievements")
      .insert({ user_id: userId, achievement_key: ABBI_BONUS_KEY });

    return { awarded: true, amount: ABBI_NEW_USER_BONUS, wallet: w as WalletDTO };
  });

const abbiMessageSchema = z.object({
  message: z.string().min(1).max(2000),
  ctx: z.object({
    firstName: z.string().nullable().optional(),
    mbtiType: z.string().nullable().optional(),
    iqScore: z.number().nullable().optional(),
    topCareers: z.array(z.object({ name: z.string(), match: z.number(), reason: z.string().optional() })).optional(),
    topStrengths: z.array(z.string()).optional(),
    weaknesses: z.array(z.string()).optional(),
    ageGroup: z.enum(["teen", "adult"]).nullable().optional(),
  }),
});

/** Generate an ABBI reply. Uses Claude claude-sonnet-4-6 if ANTHROPIC_API_KEY is set, otherwise falls back to template engine. */
export const generateAbbiMessage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => abbiMessageSchema.parse(d))
  .handler(async ({ data }): Promise<{ reply: string }> => {
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (apiKey) {
      try {
        const { default: Anthropic } = await import("@anthropic-ai/sdk");
        const client = new Anthropic({ apiKey });

        const ctx = data.ctx;
        const systemPrompt = [
          "You are ABBI, a warm, expert AI career mentor on the Abilitio platform.",
          "You help students and young adults discover their strengths, ideal careers, and university paths.",
          "Be concise, encouraging, and practical. Use markdown formatting. Max 300 words per reply.",
          ctx.mbtiType ? `The user's personality type is ${ctx.mbtiType}.` : "",
          ctx.iqScore != null ? `Their cognitive score is ${ctx.iqScore}/10.` : "",
          ctx.topCareers?.length ? `Their top career matches: ${ctx.topCareers.slice(0, 3).map(c => `${c.name} (${c.match}%)`).join(", ")}.` : "",
          ctx.topStrengths?.length ? `Their strengths: ${ctx.topStrengths.join(", ")}.` : "",
          ctx.weaknesses?.length ? `Areas to improve: ${ctx.weaknesses.join(", ")}.` : "",
        ].filter(Boolean).join(" ");

        const response = await client.messages.create({
          model: "claude-sonnet-4-6",
          max_tokens: 512,
          system: systemPrompt,
          messages: [{ role: "user", content: data.message }],
        });

        const text = response.content[0]?.type === "text" ? response.content[0].text : null;
        if (text) return { reply: text };
      } catch (err) {
        console.warn("[abbi] Claude API failed, falling back to templates:", err);
      }
    }

    // Template fallback
    return { reply: generateAbbiReply(data.message, data.ctx as AbbiContext) };
  });
