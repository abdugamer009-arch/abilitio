import { afterEach, beforeEach, expect, it, vi } from "vitest";

const fixture = vi.hoisted(() => ({
  blocked: true,
  calls: [] as Array<{ table: string; signal?: AbortSignal }>,
}));
vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    from(table: string) {
      const call: { table: string; signal?: AbortSignal } = { table };
      fixture.calls.push(call);
      let one = false;
      const chain: object = new Proxy(
        {},
        {
          get(_, key) {
            if (key === "then")
              return (
                resolve: (value: unknown) => unknown,
                reject: (error: unknown) => unknown,
              ) => {
                // A transport which ignores abort must still reach a retryable state.
                if (fixture.blocked) return new Promise(() => {}).then(resolve, reject);
                const data =
                  table === "career_assessment_results"
                    ? [{ id: "saved-report", cognitive_score: 7 }]
                    : table === "profiles"
                      ? { name: "Existing student" }
                      : [];
                return Promise.resolve({
                  data: one && Array.isArray(data) ? (data[0] ?? null) : data,
                  error: null,
                  count: 1,
                }).then(resolve, reject);
              };
            return (...args: unknown[]) => {
              if (key === "abortSignal") call.signal = args[0] as AbortSignal;
              if (key === "maybeSingle") one = true;
              return chain;
            };
          },
        },
      );
      return chain;
    },
  },
}));
import {
  clearDashboardPreload,
  consumeDashboard,
  requestDashboardHistory,
} from "@/lib/dashboard/preload";

beforeEach(() => {
  vi.useFakeTimers();
  clearDashboardPreload();
  fixture.calls.length = 0;
  fixture.blocked = true;
});
afterEach(() => {
  clearDashboardPreload();
  vi.useRealTimers();
});
it("releases a stalled initial dashboard load and aborts its four reads", async () => {
  let outcome = "pending";
  void consumeDashboard("owner").then(
    () => {
      outcome = "resolved";
    },
    () => {
      outcome = "rejected";
    },
  );
  await vi.advanceTimersByTimeAsync(15_001);
  expect(outcome).toBe("rejected");
  expect(fixture.calls).toHaveLength(4);
  expect(fixture.calls.every((call) => call.signal?.aborted)).toBe(true);
});
it("releases a stalled history page so the existing Retry control can be used", async () => {
  let outcome = "pending";
  void Promise.resolve(requestDashboardHistory("owner", 20)).then(
    () => {
      outcome = "resolved";
    },
    () => {
      outcome = "rejected";
    },
  );
  await vi.advanceTimersByTimeAsync(15_001);
  expect(outcome).toBe("rejected");
  expect(fixture.calls[0].signal?.aborted).toBe(true);
});
it("retains a successful report read unchanged", async () => {
  fixture.blocked = false;
  const responses = await consumeDashboard("owner");
  expect(responses[1].data).toEqual([{ id: "saved-report", cognitive_score: 7 }]);
  expect(fixture.calls.some((call) => call.signal?.aborted)).toBe(false);
});
