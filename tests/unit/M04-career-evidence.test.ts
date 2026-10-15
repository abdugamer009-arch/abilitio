import { describe, it, expect } from "vitest";
import { buildCareerEvidence } from "@/lib/assessment/career-evidence";
const prompt = { en: "Which would you try?", uz: "Nimani sinaysiz?", ru: "Что попробуете?" };
describe("M04 actual answer evidence", () => {
  it("links only chosen direct answers to a career, with genuine counterevidence", () => {
    const answers = [
      {
        questionId: "a",
        prompt,
        answer: { en: "Build a program", uz: "Dastur tuzish", ru: "Создать программу" },
        fields: ["technology"],
      },
      {
        questionId: "b",
        prompt,
        answer: { en: "Paint", uz: "Rasm", ru: "Рисовать" },
        fields: ["arts"],
      },
    ];
    const evidence = buildCareerEvidence(["technology"], answers);
    expect(evidence.support.map((a) => a.questionId)).toEqual(["a"]);
    expect(evidence.explore.map((a) => a.questionId)).toEqual(["b"]);
    expect(buildCareerEvidence(["technology"], []).support).toEqual([]);
  });
  it("does not turn weak or unmatched evidence into a mismatch claim", () => {
    const e = buildCareerEvidence(["technology"], []);
    expect(e.explore).toEqual([]);
  });
});
