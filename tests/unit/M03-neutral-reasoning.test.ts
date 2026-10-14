import { describe, expect, it } from "vitest";
import { scoreCognitive } from "@/lib/assessment/career-engine";
import { formatReasoningScore, reasoningCaveat } from "@/lib/assessment/reasoning-copy";
import { presentationSummary } from "@/lib/assessment/summary-integrity";

describe("M03 neutral reasoning results", () => {
  it("reports an attempt count rather than an ability tier or thinker profile", () => {
    for (const n of [0, 1, 5, 9]) {
      const result = scoreCognitive(
        Array(n)
          .fill(0)
          .concat(Array(9 - n).fill(1)),
        Array(9).fill(0),
        "INTJ",
      );
      expect(result.score).toBe(n);
      expect(result.tier).toBe("Attempt score");
      expect(result.profile).toBe("Not inferred");
      expect(formatReasoningScore(n, "en")).toBe(`${n} of 9 correct on this attempt`);
    }
  });

  it("explains why the count is uncertain in all supported languages", () => {
    for (const lang of ["en", "ru", "uz"] as const) {
      expect(reasoningCaveat(lang)).toBeTruthy();
      expect(formatReasoningScore(9, lang)).toContain("9");
    }
  });

  it("does not carry earlier ability claims into saved reports", () => {
    const old = presentationSummary({
      scoring_version: "v5-evidence",
      strengths: ["Strong analytical reasoning", "Organized & disciplined"],
      improvements: ["Build problem-solving habits with daily logic puzzles"],
    });
    expect(old.strengths).toEqual(["Organized & disciplined"]);
    expect(old.improvements).toEqual([]);
  });
});
