import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

type ResultInsert = Database["public"]["Tables"]["career_assessment_results"]["Insert"];

/** Retry the same validated attempt without creating or overwriting a result. */
export async function persistAssessmentResult(
  client: SupabaseClient<Database>,
  result: ResultInsert & { user_id: string; session_nonce: string },
) {
  const { data, error } = await client
    .from("career_assessment_results")
    .insert(result)
    .select("*")
    .single();
  if (!error && data) return data;

  if (error?.code === "23505") {
    const existing = await client
      .from("career_assessment_results")
      .select("*")
      .eq("user_id", result.user_id)
      .eq("session_nonce", result.session_nonce)
      .maybeSingle();
    if (!existing.error && existing.data) return existing.data;
  }

  // Do not fall back to an unvalidated client write or omit replay protection.
  throw new Error(error?.message ?? "Assessment result was not saved");
}
