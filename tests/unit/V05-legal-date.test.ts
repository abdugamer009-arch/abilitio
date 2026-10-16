import { describe, expect, it } from "vitest";
import { execFileSync } from "node:child_process";
import { LEGAL_LAST_UPDATED } from "@/lib/constants";

describe("V05 legal document hydration", () => {
  it("keeps the review date identical between server and browser time zones", () => {
    const dates = ["UTC", "Asia/Tashkent", "America/Los_Angeles"].map((timezone) =>
      execFileSync(
        process.execPath,
        [
          "-e",
          `process.stdout.write(new Date(${JSON.stringify(LEGAL_LAST_UPDATED)}).toLocaleDateString('en-US', {year:'numeric',month:'long',day:'numeric',timeZone:'UTC'}))`,
        ],
        { env: { ...process.env, TZ: timezone }, encoding: "utf8" },
      ),
    );
    expect(dates).toEqual(["October 12, 2026", "October 12, 2026", "October 12, 2026"]);
  });
});
