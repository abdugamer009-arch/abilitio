import { beforeEach, describe, expect, it, vi } from "vitest";

const { reads } = vi.hoisted(() => ({ reads: vi.fn() }));
vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    from(table: string) {
      let owner = "";
      let columns = "";
      let range: number[] = [];
      const query = {
        select: (value: string) => {
          columns = value;
          return query;
        },
        eq: (_column: string, value: string) => {
          owner = value;
          return query;
        },
        order: () => query,
        abortSignal: () => query,
        maybeSingle: () => query,
        range: (from: number, to: number) => {
          range = [from, to];
          return query;
        },
        then(resolve: (value: unknown) => unknown) {
          reads(table, owner, columns, range);
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
import {
  clearDashboardPreload,
  consumeDashboard,
  preloadDashboard,
  requestDashboardHistory,
} from "@/lib/dashboard/preload";

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

it("uses compact, ordered owner-scoped pages for later history", async () => {
  await requestDashboardHistory("owner-next", 20);
  const query = reads.mock.calls.at(-1)!;
  expect(query[0]).toBe("career_assessment_results");
  expect(query[1]).toBe("owner-next");
  expect(query[2]).not.toContain("*");
  expect(query[2]).toContain("career_0_name:career_matches->0->>name");
  expect(query[3]).toEqual([20, 39]);
});
