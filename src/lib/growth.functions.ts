import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type GrowthState = {
  assessmentsCompleted: number;
};

/** Aggregated growth state for the dashboard. */
export const getMyGrowthState = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<GrowthState> => {
    const { supabase, userId } = context;
    const assessRes = await supabase
      .from("assessment_results")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId);
    return {
      assessmentsCompleted: assessRes.count ?? 0,
    };
  });
