import { beforeEach, describe, expect, it, vi } from "vitest";

const { reads } = vi.hoisted(() => ({ reads: vi.fn() }));
vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    from(table: string) {
      let owner = "";
      const query = {
        select: () => query,
        eq: (_column: string, value: string) => {
          owner = value;
          return query;
        },
        order: () => query,
        maybeSingle: () => query,
        range: () => query,
        then(resolve: (value: unknown) => unknown) {
          reads(table, owner);
          return Promise.resolve({
            data: table === "profiles" ? { name: owner } : [],
            error: null,
          }).then(resolve);
        },
      };
      return query;
    },
  },
}));
import { clearDashboardPreload, consumeDashboard, preloadDashboard } from "@/lib/dashboard/preload";

describe("dashboard navigation data handoff", () => {
  beforeEach(() => {
    clearDashboardPreload();
    reads.mockClear();
    vi.useRealTimers();
  });
  it("starts the four reads before mount and consumes the same in-flight result once", async () => {
    const preload = preloadDashboard("owner-a");
    const mounted = consumeDashboard("owner-a");
    expect(mounted).toBe(preload);
    await mounted;
    expect(reads).toHaveBeenCalledTimes(4);
    await consumeDashboard("owner-a");
    expect(reads).toHaveBeenCalledTimes(8);
  });
  it("never hands one account's prefetched result to another account", async () => {
    await preloadDashboard("owner-a");
    const result = await consumeDashboard("owner-b");
    expect(result[0].data).toEqual({ name: "owner-b" });
    expect(reads.mock.calls.slice(4).every((call) => call[1] === "owner-b")).toBe(true);
  });
  it("expires abandoned intent and discards data on sign-out", async () => {
    vi.useFakeTimers();
    await preloadDashboard("owner-a");
    vi.advanceTimersByTime(15_001);
    await preloadDashboard("owner-a");
    expect(reads).toHaveBeenCalledTimes(8);
    clearDashboardPreload();
    await consumeDashboard("owner-a");
    expect(reads).toHaveBeenCalledTimes(12);
  });
});
