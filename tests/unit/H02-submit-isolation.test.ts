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
vi.mock("@/lib/admin/access.server", () => ({ ensureNotBanned: vi.fn() }));
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

it("grades seven picture answers correctly, tags the new set and retains all canonical rankings", async () => {
  const s = pickSessionQuestions("teen_adult", true);
  const token = signSession({
    questionSetVersion: "picture-reasoning-v1",
    personality: s.personality.map((q) => q.id),
    iq: s.iq.map((q) => q.id),
    iqOptionOrders: s.iq.map((q) => q.optionOrder!),
    iqOptionIds: s.iq.map((q) => q.picture!.options.map((o) => o.id)),
    interest: s.interest.map((q) => ({ id: q.id, options: q.options.map((o) => o.id) })),
  });
  const data = {
    sessionToken: token,
    personalityQIds: s.personality.map((q) => q.id),
    personalityAnswers: Array(12).fill(4),
    iqQIds: s.iq.map((q) => q.id),
    iqAnswers: s.iq.map((q, i) => (i < 7 ? q.correct : (q.correct + 1) % q.options.length)),
    interestQIds: s.interest.map((q) => q.id),
    interestAnswers: s.interest.map((q) => [q.options[0].id]),
  };
  const supabase = {
    from: (table: string) => {
      const chain = {
        select: () => chain,
        order: () => chain,
        range: async () => ({
          data: table === "careers" ? CAREER_CATALOG : MAJOR_CATALOG,
          error: null,
        }),
      };
      return chain;
    },
  };
  const run = submitCareerAssessment as unknown as (args: unknown) => Promise<{
    cognitive_score: number;
    question_set_version: string;
    career_matches: unknown[];
  }>;
  const result = await run({ data, context: { supabase, userId: "qa-owner" } });
  expect(result.cognitive_score).toBe(7);
  expect(result.question_set_version).toBe("picture-reasoning-v1");
  expect(result.career_matches).toHaveLength(166);
  expect(saved.rows.at(-1)?.cognitive_score).toBe(7);
  await expect(
    run({
      data: { ...data, iqAnswers: Array(9).fill(-1) },
      context: { supabase, userId: "qa-owner" },
    }),
  ).rejects.toThrow("every question");
});

it("preserves a signed child set tag even when issuance is switched off before submission", async () => {
  const s = pickSessionQuestions("child", true);
  const data = {
    sessionToken: signSession({
      questionSetVersion: "child-preferences-v1",
      personality: s.personality.map((q) => q.id),
      iq: [],
      iqOptionOrders: [],
      interest: s.interest.map((q) => ({ id: q.id, options: q.options.map((o) => o.id) })),
    }),
    personalityQIds: s.personality.map((q) => q.id),
    personalityAnswers: Array(12).fill(4),
    iqQIds: [],
    iqAnswers: [],
    interestQIds: s.interest.map((q) => q.id),
    interestAnswers: s.interest.map((q) => [q.options[0].id]),
  };
  const supabase = {
    from: (table: string) => {
      const chain = {
        select: () => chain,
        order: () => chain,
        range: async () => ({
          data: table === "careers" ? CAREER_CATALOG : MAJOR_CATALOG,
          error: null,
        }),
      };
      return chain;
    },
  };
  const run = submitCareerAssessment as unknown as (args: unknown) => Promise<{
    cognitive_score: number | null;
    question_set_version: string;
    career_matches: unknown[];
  }>;
  const result = await run({ data, context: { supabase, userId: "qa-owner" } });
  expect(result.cognitive_score).toBeNull();
  expect(result.question_set_version).toBe("child-preferences-v1");
  expect(result.career_matches).toHaveLength(166);
});
