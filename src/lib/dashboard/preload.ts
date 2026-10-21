import { supabase } from "@/integrations/supabase/client";
import { readAllResult } from "@/lib/db-read";

import { HISTORY_COLUMNS, HISTORY_PAGE_SIZE } from "./history";

export function requestDashboardHistory(userId: string, offset = 0) {
  return supabase
    .from("career_assessment_results")
    .select(HISTORY_COLUMNS, { count: "exact" })
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .order("id")
    .range(offset, offset + HISTORY_PAGE_SIZE - 1);
}

function requestDashboard(userId: string) {
  return Promise.all([
    supabase.from("profiles").select("name, surname").eq("id", userId).maybeSingle(),
    requestDashboardHistory(userId),
    supabase.from("user_stats").select("*").eq("user_id", userId).maybeSingle(),
    readAllResult((from, to) =>
      supabase
        .from("user_achievements")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .order("id")
        .range(from, to),
    ),
  ]);
}
// Only a short-lived, owner-keyed handoff. Reading consumes it; edits and later
// visits keep the existing fresh-read behavior. No account data enters storage.
let pending:
  { owner: string; expires: number; value: ReturnType<typeof requestDashboard> } | undefined;
export function preloadDashboard(userId: string) {
  if (!pending || pending.owner !== userId || pending.expires < Date.now()) {
    pending = { owner: userId, expires: Date.now() + 15_000, value: requestDashboard(userId) };
    void pending.value.catch(() => {});
  }
  return pending.value;
}
export function consumeDashboard(userId: string) {
  const value = preloadDashboard(userId);
  pending = undefined;
  return value;
}
export function clearDashboardPreload() {
  pending = undefined;
}
