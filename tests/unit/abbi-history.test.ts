import { expect, it } from "vitest";
import { appendDailyMessage } from "@/lib/abbi/history";

it("does not carry yesterday's open chat across midnight UTC", () => {
  expect(
    appendDailyMessage(
      ["yesterday"],
      "today",
      "2026-10-11",
      new Date("2026-10-12T00:00:00Z"),
      "welcome",
    ),
  ).toEqual({ day: "2026-10-12", messages: ["welcome", "today"] });
});
it("retains current-day conversation and caps it at fifty messages", () => {
  const now = new Date("2026-10-12T23:59:59Z");
  expect(appendDailyMessage(["previous"], "new", "2026-10-12", now, "welcome").messages).toEqual([
    "previous",
    "new",
  ]);
  const result = appendDailyMessage(
    Array.from({ length: 50 }, (_, i) => String(i)),
    "new",
    "2026-10-12",
    now,
    "welcome",
  );
  expect(result.messages).toHaveLength(50);
  expect(result.messages[0]).toBe("1");
  expect(result.messages.at(-1)).toBe("new");
});
