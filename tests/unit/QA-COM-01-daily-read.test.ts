import { expect, it, vi } from "vitest";

vi.mock("@tanstack/react-start", () => ({
  createServerFn: () => {
    const chain = {
      middleware: () => chain,
      inputValidator: () => chain,
      handler: (handler: unknown) => handler,
    };
    return chain;
  },
}));
vi.mock("@/integrations/supabase/auth-middleware", () => ({ requireSupabaseAuth: {} }));
vi.mock("@/integrations/supabase/client.server", () => ({ supabaseAdmin: {} }));
vi.mock("@/lib/admin/access.server", () => ({
  resolveAdminStatus: vi.fn(),
  ensureNotBanned: vi.fn(),
}));

import { getCommunityDailyQuestion } from "@/lib/community/community.functions";

const run = getCommunityDailyQuestion as unknown as (args: unknown) => Promise<{
  question: string;
  createdAt: string | null;
}>;
function request(response: unknown) {
  const query = {
    select: () => query,
    eq: () => query,
    order: () => query,
    limit: () => query,
    maybeSingle: async () => response,
  };
  return {
    data: { communityId: "11111111-1111-4111-8111-111111111111" },
    context: { userId: "test-student", supabase: { from: () => query } },
  };
}

it("does not disguise a failed daily-question read as a successful default question", async () => {
  await expect(
    run(request({ data: null, error: { message: "permission denied" } })),
  ).rejects.toThrow("permission denied");
});

it("retains the existing fallback only after a successful empty read", async () => {
  const result = await run(request({ data: null, error: null }));
  expect(result.question.length).toBeGreaterThan(10);
  expect(result.createdAt).toBeNull();
});

it("returns the actual saved daily question unchanged", async () => {
  const saved = { question: "TEST saved question", created_at: "2026-10-24T00:00:00Z" };
  expect(await run(request({ data: saved, error: null }))).toEqual({
    question: saved.question,
    createdAt: saved.created_at,
  });
});
