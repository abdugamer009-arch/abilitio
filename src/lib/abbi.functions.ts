import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { generateAbbiReply, type AbbiContext } from "./abbi-knowledge";
import { ABBI_DAILY_AI_LIMIT } from "./constants";

/** True if the user is still under today's AI-reply cap. Fails open on error
 *  (a monitoring/DB hiccup should degrade to "allowed", not block the chat). */
async function underDailyAiLimit(userId: string): Promise<boolean> {
  const since = new Date();
  since.setUTCHours(0, 0, 0, 0);
  const { count, error } = await supabaseAdmin
    .from("abbi_usage")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("created_at", since.toISOString());
  if (error) {
    console.warn("[abbi] usage count failed, allowing:", error.message);
    return true;
  }
  return (count ?? 0) < ABBI_DAILY_AI_LIMIT;
}

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
  .handler(async ({ data, context }): Promise<{ reply: string }> => {
    const apiKey = process.env.ANTHROPIC_API_KEY;

    // Only spend on the Anthropic API while the user is under the daily cap;
    // past it, transparently fall back to the free template engine.
    if (apiKey && (await underDailyAiLimit(context.userId))) {
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
        if (text) {
          // Record the billable call (best-effort; never block the reply).
          await supabaseAdmin.from("abbi_usage").insert({ user_id: context.userId }).then(
            undefined,
            (e) => console.warn("[abbi] usage log failed:", e),
          );
          return { reply: text };
        }
      } catch (err) {
        console.warn("[abbi] Claude API failed, falling back to templates:", err);
      }
    }

    // Template fallback
    return { reply: generateAbbiReply(data.message, data.ctx as AbbiContext) };
  });
