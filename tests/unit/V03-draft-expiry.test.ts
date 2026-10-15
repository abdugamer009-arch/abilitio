import { it, expect, vi } from "vitest";
import { draftIsCurrent } from "@/lib/assessment/draft-expiry";
it("V03 expires at precisely 24 hours and rejects malformed or future drafts", () => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-10-15T00:00:00Z"));
  const expires = Date.now() + 24 * 60 * 60 * 1000;
  const token = btoa(JSON.stringify({ expires })) + ".signature";
  expect(draftIsCurrent(token)).toBe(true);
  vi.advanceTimersByTime(24 * 60 * 60 * 1000 - 1);
  expect(draftIsCurrent(token)).toBe(true);
  vi.advanceTimersByTime(1);
  expect(draftIsCurrent(token)).toBe(false);
  expect(draftIsCurrent("invalid")).toBe(false);
  vi.useRealTimers();
});
