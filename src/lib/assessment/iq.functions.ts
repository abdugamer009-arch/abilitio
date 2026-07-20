import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { ensureNotBanned } from "../admin/admin.functions";
import { IQ_BAND, IQ_TIME_LIMIT_SECONDS, scoreIq } from "./iq-test";

// The client submits its raw answer sheet, never a score: the server re-scores
// with the shared scoreIq helper, so a crafted request can't store an inflated
// result. (The bank itself ships to the browser — the test is client-rendered —
// so this guards the stored record's integrity, not the answers' secrecy.)
const submitSchema = z.object({
  answers: z.array(z.number().int().min(0).max(7).nullable()).length(40),
  timeSeconds: z.number().int().min(0).max(IQ_TIME_LIMIT_SECONDS),
});

export type IqSubmitResultDTO = {
  score: number;
  level: string;
  /** Best score across all of this user's saved attempts, including this one. */
  best: number;
  attempts: number;
};

export const submitIqResult = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => submitSchema.parse(d))
  .handler(async ({ data, context }): Promise<IqSubmitResultDTO> => {
    const { supabase, userId } = context;
    await ensureNotBanned(userId);

    const { score, byCat } = scoreIq(data.answers);
    const level = IQ_BAND(score).label;
    const cat = (name: string) => byCat.find((c) => c.cat === name)?.correct ?? 0;

    // Column names predate the current test (logical/analytical/pattern era);
    // map today's categories onto them and keep the raw sheet in `answers`,
    // so nothing is lost: verbal = correct_count − the three stored categories.
    const { error } = await supabase.from("iq_results").insert({
      user_id: userId,
      score,
      level,
      correct_count: score,
      total_questions: 40,
      logical_score: cat("logical"),
      analytical_score: cat("numerical"),
      pattern_score: cat("spatial"),
      time_seconds: data.timeSeconds,
      answers: data.answers,
    });
    if (error) throw new Error(error.message);

    const { data: rows } = await supabase.from("iq_results").select("score").eq("user_id", userId);
    const scores = ((rows ?? []) as { score: number }[]).map((r) => r.score);
    return {
      score,
      level,
      best: scores.length ? Math.max(...scores) : score,
      attempts: scores.length || 1,
    };
  });

export type IqHistoryDTO = {
  attempts: number;
  best: { score: number; level: string } | null;
  last: { score: number; level: string; created_at: string } | null;
};

/** Compact history for the intro screen: attempt count, best, most recent. */
export const getMyIqHistory = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<IqHistoryDTO> => {
    const { supabase, userId } = context;
    const { data: rows } = await supabase
      .from("iq_results")
      .select("score, level, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(50);
    const list = (rows ?? []) as { score: number; level: string; created_at: string }[];
    if (!list.length) return { attempts: 0, best: null, last: null };
    const best = list.reduce((a, b) => (b.score > a.score ? b : a));
    return {
      attempts: list.length,
      best: { score: best.score, level: best.level },
      last: { score: list[0].score, level: list[0].level, created_at: list[0].created_at },
    };
  });
