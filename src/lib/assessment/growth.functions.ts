import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

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
    const weekStart = new Date();
    weekStart.setUTCHours(0, 0, 0, 0);
    weekStart.setUTCDate(weekStart.getUTCDate() - ((weekStart.getUTCDay() + 6) % 7));
    return {
      tasksCompleted: tasks?.length ?? 0,
      tasksThisWeek: (tasks ?? []).filter((t) => new Date(t.updated_at) >= weekStart).length,
      assessmentsCompleted: assessRes.count ?? 0,
    };
  });
