import { createServerFn } from "@tanstack/react-start";
import { ROADMAP_TASK_IDS } from "./roadmap-world";
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
      .refine((v) => Object.keys(v).length <= 1000)
      .parse(data),
  )
  .handler(async ({ context, data }) => {
    const validIds = new Set(ROADMAP_TASK_IDS);
    const extra = Object.keys(data).filter((id) => !validIds.has(id));
    if (extra.length) {
      const parsed = extra.map((id) => /^career:([a-z0-9_]+):p[1-5]_t1$/.exec(id));
      if (parsed.some((m) => !m)) throw new Error("invalid_task");
      const keys = [...new Set(parsed.map((m) => m![1]))];
      const { data: careers, error } = await context.supabase
        .from("careers")
        .select("key")
        .in("key", keys);
      if (error) throw new Error(error.message);
      const known = new Set(careers?.map((c) => c.key) ?? []);
      if (parsed.some((m) => !known.has(m![1]))) throw new Error("invalid_task");
      for (const id of extra) validIds.add(id);
    }
    if (Object.keys(data).some((id) => !validIds.has(id))) throw new Error("invalid_task");
    const rows = Object.entries(data).map(([task_id, completed]) => ({
      task_id,
      completed,
      user_id: context.userId,
      updated_at: new Date().toISOString(),
    }));
    if (!rows.length) return;
    // Only this authenticated, catalog-validated path may write journal rows.
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("roadmap_task_events")
      .upsert(rows, { onConflict: "user_id,task_id" });
    if (error) throw new Error(error.message);
  });
