import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { generateAbbiReply, type AbbiContext } from "./abbi-knowledge";
import { ensureNotBanned } from "../admin/admin.functions";

const abbiMessageSchema = z.object({
  message: z.string().min(1).max(2000),
  ctx: z.object({
    firstName: z.string().nullable().optional(),
    mbtiType: z.string().nullable().optional(),
    iqScore: z.number().nullable().optional(),
    topCareers: z
      .array(z.object({ name: z.string(), match: z.number() }))
      .optional(),
    topStrengths: z.array(z.string()).optional(),
    weaknesses: z.array(z.string()).optional(),
    ageGroup: z.enum(["teen", "adult"]).nullable().optional(),
  }),
});

/**
 * Generate an ABBI reply from the built-in career knowledge base.
 *
 * This used to call the Anthropic API first and fall back to the knowledge
 * base only when that failed. The paid path is gone on purpose: it is a
 * per-message running cost, and the fallback was doing all the real work
 * anyway whenever the account had no credit — silently, so the chat looked
 * fine while never actually reaching a model.
 *
 * The knowledge base is not a language model, but it is well matched to what
 * this chat is actually asked: it recognises 17 careers by name or alias
 * anywhere in a message, answers SAT/IELTS, university, salary, leadership
 * and personality-fit questions, and personalises against the user's own
 * assessment (MBTI type, top career matches, weakest dimensions). Anything it
 * doesn't recognise gets an honest list of what it can help with.
 *
 * Keeping it free also means no rate limiting: the daily cap and the
 * abbi_usage bookkeeping existed only to protect the API budget, so both are
 * gone along with a database write on every single message.
 */
export const generateAbbiMessage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => abbiMessageSchema.parse(d))
  .handler(async ({ data, context }): Promise<{ reply: string }> => {
    await ensureNotBanned(context.userId);
    return { reply: generateAbbiReply(data.message, data.ctx as AbbiContext) };
  });
