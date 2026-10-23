import { supabase } from "@/integrations/supabase/client";
import { readAllResult } from "@/lib/db-read";
import { requestWithDeadline } from "@/lib/assessment/request-deadline";

import { HISTORY_COLUMNS, HISTORY_PAGE_SIZE } from "./history";

const DASHBOARD_REQUEST_TIMEOUT_MS = 15_000;

function dashboardHistoryQuery(userId: string, offset: number, signal: AbortSignal) {
  return supabase
    .from("career_assessment_results")
    .select(HISTORY_COLUMNS, { count: "exact" })
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .order("id")
    .range(offset, offset + HISTORY_PAGE_SIZE - 1)
    .abortSignal(signal);
}

export function requestDashboardHistory(userId: string, offset = 0) {
  return requestWithDeadline(
    async (signal) => dashboardHistoryQuery(userId, offset, signal),
    DASHBOARD_REQUEST_TIMEOUT_MS,
    undefined,
    "Dashboard history timed out",
  );
}

function requestDashboard(userId: string, controller: AbortController) {
  return requestWithDeadline(
    async (signal) =>
      Promise.all([
        supabase
          .from("profiles")
          .select("name, surname")
          .eq("id", userId)
          .abortSignal(signal)
          .maybeSingle(),
        dashboardHistoryQuery(userId, 0, signal),
        supabase
          .from("user_stats")
          .select("*")
          .eq("user_id", userId)
          .abortSignal(signal)
          .maybeSingle(),
        readAllResult((from, to) =>
          supabase
            .from("user_achievements")
            .select("*")
            .eq("user_id", userId)
            .order("created_at", { ascending: false })
            .order("id")
            .range(from, to)
            .abortSignal(signal),
        ),
      ]),
    DASHBOARD_REQUEST_TIMEOUT_MS,
    controller,
    "Dashboard load timed out",
  );
}
// Only a short-lived, owner-keyed handoff. Reading consumes it; edits and later
// visits keep the existing fresh-read behavior. No account data enters storage.
let pending:
  | {
      owner: string;
      expires: number;
      controller: AbortController;
      value: ReturnType<typeof requestDashboard>;
    }
  | undefined;
export function preloadDashboard(userId: string) {
  if (!pending || pending.owner !== userId || pending.expires < Date.now()) {
    pending?.controller.abort();
    const controller = new AbortController();
    pending = {
      owner: userId,
      expires: Date.now() + 15_000,
      controller,
      value: requestDashboard(userId, controller),
    };
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
  pending?.controller.abort();
  pending = undefined;
}
