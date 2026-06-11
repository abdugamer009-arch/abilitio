import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type PersonalityQuestion = {
  id: string;
  question_number: number;
  left_statement: string;
  right_statement: string;
};

export type PersonalityResult = {
  id: string;
  ie_score: number;
  sn_score: number;
  ft_score: number;
  jp_score: number;
  mbti_type: string;
  created_at: string;
};

export type MbtiType = {
  type_code: string;
  title: string;
  description: string;
  strengths: string[];
  weaknesses: string[];
};

/** Load all 48 questions (left/right text only; category & scoring NOT exposed). */
export const getPersonalityQuestions = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<PersonalityQuestion[]> => {
    const { data, error } = await context.supabase
      .from("personality_questions")
      .select("id, question_number, left_statement, right_statement")
      .order("question_number", { ascending: true });
    if (error) throw new Error(error.message);
    return (data ?? []) as PersonalityQuestion[];
  });

/** Submit all 48 answers and compute MBTI server-side. */
export const submitPersonality = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z.object({
      answers: z.array(z.number().int().min(1).max(5)).length(48),
    }).parse(input),
  )
  .handler(async ({ data, context }): Promise<{ result: PersonalityResult; type: MbtiType | null }> => {
    const { supabase, userId } = context;
    const { data: row, error } = await (supabase as unknown as {
      rpc: (n: string, p: unknown) => Promise<{ data: unknown; error: { message: string } | null }>;
    }).rpc("submit_personality_assessment", { _answers: data.answers });
    if (error) throw new Error(error.message);
    const result = row as unknown as PersonalityResult;

    // Persist individual answers (best-effort; result already saved).
    const { data: qs } = await supabase
      .from("personality_questions")
      .select("id, question_number");
    if (qs) {
      const rows = (qs as { id: string; question_number: number }[]).map((q) => ({
        user_id: userId,
        question_id: q.id,
        answer_value: data.answers[q.question_number - 1],
      }));
      await supabase.from("personality_answers").upsert(rows, { onConflict: "user_id,question_id" });
    }

    const { data: typeRow } = await supabase
      .from("mbti_types")
      .select("type_code, title, description, strengths, weaknesses")
      .eq("type_code", result.mbti_type)
      .maybeSingle();

    return { result, type: (typeRow as MbtiType | null) ?? null };
  });

/** Get latest result for the signed-in user (for profile/dashboard). */
export const getLatestPersonalityResult = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<{ result: PersonalityResult; type: MbtiType | null } | null> => {
    const { supabase, userId } = context;
    const { data, error } = await supabase
      .from("personality_results")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!data) return null;
    const result = data as PersonalityResult;
    const { data: typeRow } = await supabase
      .from("mbti_types")
      .select("type_code, title, description, strengths, weaknesses")
      .eq("type_code", result.mbti_type)
      .maybeSingle();
    return { result, type: (typeRow as MbtiType | null) ?? null };
  });
