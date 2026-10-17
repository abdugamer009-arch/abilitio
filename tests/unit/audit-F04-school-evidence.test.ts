import { describe, expect, it, vi } from "vitest";

const fixture = vi.hoisted(() => ({ version: "v1" as string | null }));
vi.mock("@tanstack/react-start", () => ({
  createServerFn: () => {
    const chain = {
      middleware: () => chain,
      inputValidator: () => chain,
      handler: (fn: unknown) => fn,
    };
    return chain;
  },
}));
vi.mock("@/integrations/supabase/auth-middleware", () => ({ requireSupabaseAuth: {} }));
vi.mock("@/lib/schools/owned-school", () => ({
  loadOwnedSchool: vi.fn(async () => ({ id: "school-x", name: "AUDIT TEST 1" })),
}));
vi.mock("@/integrations/supabase/client.server", () => ({
  supabaseAdmin: {
    from: (table: string) => {
      let columns = "*";
      const query = {
        select: (value: string) => {
          columns = value;
          return query;
        },
        eq: () => query,
        in: () => query,
        order: () => query,
        range: async () => ({
          error: null,
          data: (() => {
            const datasets: Record<string, unknown[]> = {
              school_classes: [{ id: "class-x", name: "9A", grade: 9 }],
              school_members: [{ user_id: "student-a", class_id: "class-x" }],
              profiles: [{ id: "student-a", name: "AUDIT TEST", surname: "1" }],
              career_assessment_results: [
                {
                  user_id: "student-a",
                  career_matches: [],
                  personality_type: "ENTP",
                  cognitive_score: 5,
                  strengths: ["Confident communicator", "Strong analytical reasoning"],
                  scoring_version: fixture.version,
                  created_at: "2026-10-17T00:00:00Z",
                },
              ],
            };
            return (datasets[table] ?? []).map((row) =>
              columns === "*"
                ? row
                : Object.fromEntries(
                    columns
                      .split(",")
                      .map((key) => [key.trim(), (row as Record<string, unknown>)[key.trim()]]),
                  ),
            );
          })(),
        }),
      };
      return query;
    },
  },
}));

import { getPrincipalDashboard } from "@/lib/schools/schools.functions";

const run = getPrincipalDashboard as unknown as (args: unknown) => Promise<{
  students: { strengths: string[] }[];
  topTalents: { dimension: string; students: unknown[] }[];
}>;

describe("F-04 school report evidence", () => {
  it.each([null, "v1", "v2", "v3", "v4-preferences"])(
    "does not reuse unsupported historical strengths from %s",
    async (version) => {
      fixture.version = version;
      const result = await run({ context: { supabase: {}, userId: "school-owner" } });
      expect(result.students[0].strengths).toEqual([]);
      expect(result.topTalents.find((t) => t.dimension === "Top Communicators")?.students).toEqual(
        [],
      );
      expect(
        result.topTalents.find((t) => t.dimension === "Top Problem Solvers")?.students,
      ).toEqual([]);
    },
  );

  it.each([
    "v5-evidence",
    "v5-preferences-evidence",
    "v6-direct-interests",
    "v6-direct-preferences",
  ])("retains supported labels and suppresses retired reasoning claims for %s", async (version) => {
    fixture.version = version;
    const result = await run({ context: { supabase: {}, userId: "school-owner" } });
    expect(result.students[0].strengths).toEqual(["Confident communicator"]);
    expect(
      result.topTalents.find((t) => t.dimension === "Top Communicators")?.students,
    ).toHaveLength(1);
    expect(result.topTalents.find((t) => t.dimension === "Top Problem Solvers")?.students).toEqual(
      [],
    );
  });
});
