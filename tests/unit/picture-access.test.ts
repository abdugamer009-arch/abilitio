import { expect, it, vi } from "vitest";
const reads = vi.hoisted(() => ({ service: vi.fn() }));
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
vi.mock("@/integrations/supabase/client.server", () => ({
  supabaseAdmin: { from: reads.service, rpc: reads.service },
}));
import { getPictureQuestionStats } from "@/lib/assessment/picture-stats.functions";
import { savePictureDraft } from "@/lib/assessment/picture-progress.functions";
it("denies a student before any private observation read", async () => {
  const role = {
    select: () => role,
    eq: () => role,
    maybeSingle: async () => ({ data: null, error: null }),
  };
  const fn = getPictureQuestionStats as unknown as (arg: unknown) => Promise<unknown>;
  await expect(
    fn({ context: { supabase: { from: () => role }, userId: "student" } }),
  ).rejects.toThrow("forbidden");
  expect(reads.service).not.toHaveBeenCalled();
});
it("rejects a queued draft save after the authenticated account changes", async () => {
  const fn = savePictureDraft as unknown as (arg: unknown) => Promise<unknown>;
  await expect(
    fn({ data: { expectedOwner: "former-owner" }, context: { userId: "new-owner" } }),
  ).rejects.toThrow("Account changed");
  expect(reads.service).not.toHaveBeenCalled();
});
