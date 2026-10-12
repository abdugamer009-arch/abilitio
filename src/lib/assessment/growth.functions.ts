import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { isInCurrentUtcWeek } from "./utc-week";

export type GrowthState = {
  assessmentsCompleted: number;
  tasksCompleted: number;
  tasksThisWeek: number;
};

/** Aggregated growth state for the dashboard. */
export const getMyGrowthState = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<GrowthState> => {
    const { supabase, userId } = context;
    const assessRes = await supabase
      .from("career_assessment_results")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId);
    if (assessRes.error) throw new Error(assessRes.error.message);
    const { data: tasks, error } = await supabase
      .from("roadmap_task_events")
      .select("updated_at")
      .eq("user_id", userId)
      .eq("completed", true);
    if (error) throw new Error(error.message);
    const now = new Date();
    return {
      tasksCompleted: tasks?.length ?? 0,
      tasksThisWeek: (tasks ?? []).filter((t) => isInCurrentUtcWeek(t.updated_at, now)).length,
      assessmentsCompleted: assessRes.count ?? 0,
    };
  });
