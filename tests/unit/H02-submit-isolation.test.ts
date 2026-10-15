import { it, expect, vi } from "vitest";
const saved = vi.hoisted(() => ({ rows: [] as Record<string, unknown>[] }));
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
vi.mock("@/lib/admin/admin.functions", () => ({ ensureNotBanned: vi.fn() }));
vi.mock("@/integrations/supabase/client.server", () => ({ supabaseAdmin: {} }));
vi.mock("@/lib/assessment/result-storage.server", () => ({
  persistAssessmentResult: vi.fn(async (_client, row) => {
    saved.rows.push(row);
    return {
      ...row,
      id: "11111111-1111-4111-8111-111111111111",
      created_at: "2026-10-15T00:00:00Z",
    };
  }),
}));
import { submitCareerAssessment } from "@/lib/assessment/career.functions";
import { pickSessionQuestions } from "@/lib/assessment/question-bank";
import { signSession } from "@/lib/assessment/session.server";
import { CAREER_CATALOG, MAJOR_CATALOG } from "@/lib/assessment/catalog.server";
it("H02 actually grades and saves a signed assessment without any membership RPC or write", async () => {
  const s = pickSessionQuestions("teen_adult");
  const data = {
    sessionToken: signSession({
      personality: s.personality.map((q) => q.id),
      iq: s.iq.map((q) => q.id),
      iqOptionOrders: s.iq.map((q) => q.optionOrder!),
      interest: s.interest.map((q) => ({ id: q.id, options: q.options.map((o) => o.id) })),
    }),
    personalityQIds: s.personality.map((q) => q.id),
    personalityAnswers: Array(12).fill(4),
    iqQIds: s.iq.map((q) => q.id),
    iqAnswers: s.iq.map(() => 0),
    interestQIds: s.interest.map((q) => q.id),
    interestAnswers: s.interest.map((q) => [q.options[0].id]),
  };
  const rpc = vi.fn(() => {
    throw new Error("unexpected membership RPC");
  });
  const tables: string[] = [];
  const supabase = {
    rpc,
    from: (table: string) => {
      tables.push(table);
      const q = {
        select: () => q,
        order: () => q,
        range: async () => ({
          data: table === "careers" ? CAREER_CATALOG : MAJOR_CATALOG,
          error: null,
        }),
      };
      return q;
    },
  };
  const run = submitCareerAssessment as unknown as (
    args: unknown,
  ) => Promise<{ career_matches: { evidence?: { support: unknown[] } }[] }>;
  const r = await run({ data, context: { supabase, userId: "qa-owner" } });
  expect(saved.rows).toHaveLength(1);
  expect(r.career_matches).toHaveLength(166);
  expect(r.career_matches.some((c) => c.evidence?.support.length)).toBe(true);
  expect(rpc).not.toHaveBeenCalled();
  expect(tables).toEqual(["careers", "university_majors"]);
  expect(JSON.stringify(r)).not.toMatch(/"correct"|"riasec":|"required_traits"/);
});
