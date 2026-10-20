import { supabase } from "@/integrations/supabase/client";
import { readAllResult } from "@/lib/db-read";

function requestDashboard(userId: string) {
  return Promise.all([
    supabase.from("profiles").select("name, surname").eq("id", userId).maybeSingle(),
    readAllResult((from, to) =>
      supabase
        .from("career_assessment_results")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .order("id")
        .range(from, to),
    ),
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
