import { describe, expect, it } from "vitest";
import {
  deriveImprovements,
  deriveStrengths,
  scoreCognitive,
  scorePersonality,
} from "@/lib/assessment/career-engine";
import type { PersonalityQ } from "@/lib/assessment/career-assessment";
import { presentationSummary } from "@/lib/assessment/summary-integrity";

const axes: PersonalityQ["axis"][] = ["EI", "SN", "TF", "JP"];
const questions: PersonalityQ[] = axes.flatMap((axis) =>
  [1, -1, 1].map((direction, index) => ({
    id: `${axis}-${index}`,
    section: "personality" as const,
    prompt:
      axis === "JP" && index === 1
        ? "You adapt quickly to unexpected changes in plans."
        : "Preference item",
    axis,
    direction: direction as 1 | -1,
  })),
);
const traits: Record<string, [PersonalityQ["axis"], 1 | -1]> = {
  "Confident communicator": ["EI", 1],
  "Deep focus & introspection": ["EI", -1],
  "Big-picture thinking": ["SN", -1],
  "Logical decision-making": ["TF", 1],
  "Emotional intelligence": ["TF", -1],
  "Organized & disciplined": ["JP", 1],
  "Flexible & adaptive": ["JP", -1],
};
const cognitive = scoreCognitive([], Array(9).fill(0), "XXXX");

function strengths(answers: number[]) {
  return deriveStrengths(scorePersonality(answers, questions), cognitive, answers, questions);
}

describe("H01 answer-level summary integrity", () => {
  it("does not present categorical summaries from historical rows without item evidence", () => {
    const legacy = presentationSummary({
      scoring_version: "v3",
      strengths: ["Flexible & adaptive"],
      improvements: ["Use structured planning tools"],
      work_style: "Dynamic & Adaptive",
    });
    expect(legacy.summary_unverified).toBe(true);
    expect(legacy.strengths).toEqual([]);
    expect(legacy.improvements).toEqual([]);
    expect(legacy.work_style).toBe("Mixed preferences");
    const current = presentationSummary({
      scoring_version: "v5-evidence",
      strengths: ["Organized & disciplined"],
    });
    expect(current.strengths).toEqual(["Organized & disciplined"]);
  });
  it("does not call a student flexible after strongly rejecting the adaptation item", () => {
    const answers = Array(12).fill(3);
    answers.splice(0, 3, 5, 1, 5);
    answers.splice(9, 3, 1, 1, 1); // Two P-supporting items; adaptation strongly opposed.
    expect(scorePersonality(answers, questions).mbti[3]).toBe("P");
    expect(strengths(answers)).not.toContain("Flexible & adaptive");
    expect(strengths(answers).some((text) => text.startsWith("Mixed signals"))).toBe(true);
    expect(scorePersonality(answers, questions).workStyle).toBe("Mixed preferences");
    expect(
      deriveImprovements(scorePersonality(answers, questions), cognitive, answers, questions),
    ).not.toContain("Use structured planning tools");
  });

  it.each(Object.entries(traits))(
    "never claims %s when all its items point the other way",
    (claim, [axis, pole]) => {
      const answers = questions.map((q) =>
        q.axis === axis ? (q.direction * pole === 1 ? 1 : 5) : 3,
      );
      expect(strengths(answers)).not.toContain(claim);
    },
  );

  it("makes zero unsupported claims across 1,000 seeded answer sets", () => {
    let seed = 731;
    const next = () => ((seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) % 5) + 1;
    for (let attempt = 0; attempt < 1000; attempt++) {
      const answers = questions.map(next);
      for (const claim of strengths(answers)) {
        if (!(claim in traits)) continue;
        const [axis, pole] = traits[claim];
        const signals = questions.flatMap((q, i) =>
          q.axis === axis ? [(answers[i] - 3) * q.direction * pole] : [],
        );
        expect(signals.filter((signal) => signal >= 1).length).toBeGreaterThanOrEqual(2);
        expect(signals.reduce((sum, signal) => sum + signal, 0)).toBeGreaterThanOrEqual(2);
        expect(signals.some((signal) => signal <= -2)).toBe(false);
      }
    }
  });
});
