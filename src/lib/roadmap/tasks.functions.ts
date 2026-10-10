import { createServerFn } from "@tanstack/react-start";
import { buildRoadmap, type RoadmapTrack } from "./roadmap-world";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
export const loadTaskJournal = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("roadmap_task_events")
      .select("task_id,completed")
      .eq("user_id", context.userId);
    if (error) throw new Error(error.message);
    return Object.fromEntries((data ?? []).map((r) => [r.task_id, r.completed])) as Record<
      string,
      boolean
    >;
  });
export const saveTaskJournal = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) =>
    z
      .record(z.string().min(1).max(100), z.boolean())
      .refine((v) => Object.keys(v).length <= 200)
      .parse(data),
  )
  .handler(async ({ context, data }) => {
    const validIds = new Set(
      (["tech", "creative", "business", "science", "social", "default"] as RoadmapTrack[]).flatMap(
        (track) => buildRoadmap(track).flatMap((p) => p.tasks.map((t) => t.id)),
      ),
    );
    if (Object.keys(data).some((id) => !validIds.has(id))) throw new Error("invalid_task");
    const rows = Object.entries(data).map(([task_id, completed]) => ({
      task_id,
      completed,
      user_id: context.userId,
      updated_at: new Date().toISOString(),
    }));
    if (!rows.length) return;
    const { error } = await context.supabase
      .from("roadmap_task_events")
      .upsert(rows, { onConflict: "user_id,task_id" });
    if (error) throw new Error(error.message);
  });
