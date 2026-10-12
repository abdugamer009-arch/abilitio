import { expect, it } from "vitest";
import { isInCurrentUtcWeek } from "@/lib/assessment/utc-week";

it("starts the week on Monday UTC and excludes future or invalid timestamps", () => {
  const monday = new Date("2026-10-12T00:00:00Z");
  expect(isInCurrentUtcWeek("2026-10-11T23:59:59Z", monday)).toBe(false);
  expect(isInCurrentUtcWeek("2026-10-12T00:00:00Z", monday)).toBe(true);
  expect(isInCurrentUtcWeek("2099-01-01T00:00:00Z", monday)).toBe(false);
  expect(isInCurrentUtcWeek("invalid", monday)).toBe(false);
  expect(isInCurrentUtcWeek("2026-10-05T00:00:00Z", new Date("2026-10-11T23:59:59Z"))).toBe(true);
});
