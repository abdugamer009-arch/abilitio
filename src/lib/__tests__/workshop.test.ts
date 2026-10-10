import { buildRoadmap, scopedTaskState, type RoadmapTrack } from "../roadmap/roadmap-world";
import { describe, it, expect } from "vitest";
import { IQ_BANK } from "../assessment/question-bank";
import { SAMPLE_QUESTIONS, sampleRecord } from "../assessment/sample-questions";
describe("public workshop and authoritative question bank", () => {
  it("uses the same four questions without duplicate IDs", () => {
    for (const q of SAMPLE_QUESTIONS)
      expect(IQ_BANK.filter((item) => item.id === q.id)).toEqual([q]);
  });
  it("records only valid attempted answers and computes real correctness", () => {
    expect(sampleRecord({ c1: 2, c8: 0, c5: 99, c4: -1, unrelated: 0 })).toEqual({
      attempted: 2,
      correct: 1,
      total: 4,
    });
  });
  it("square and difference samples have mathematically correct keys", () => {
    const c1 = SAMPLE_QUESTIONS.find((q) => q.id === "c1")!;
    expect(Number(c1.options[c1.correct])).toBe(6 * 7);
    const c8 = SAMPLE_QUESTIONS.find((q) => q.id === "c8")!;
    expect(Number(c8.options[c8.correct])).toBe(6 * 6);
  });
  it("letter encoding uses alphabet positions including final D=4", () => {
    const q = IQ_BANK.find((q) => q.id === "c3")!;
    expect(q.options[q.correct]).toBe([..."BIRD"].map((c) => c.charCodeAt(0) - 64).join(""));
  });
  it("train catch-up key satisfies both distances at the same instant", () => {
    const q = IQ_BANK.find((q) => q.id === "c7")!;
    const hours = parseInt(q.options[q.correct]);
    expect(60 * hours).toBe(80 * (hours - 2));
  });
});

describe("path-scoped task identity", () => {
  it("assigns a unique identity to every task across all career paths", () => {
    const ids = (
      ["tech", "creative", "business", "science", "social", "default"] as RoadmapTrack[]
    ).flatMap((track) =>
      buildRoadmap(track).flatMap((phase) => phase.tasks.map((task) => task.id)),
    );
    expect(new Set(ids).size).toBe(ids.length);
  });
  it("does not interpret ambiguous older or unrelated marks as current progress", () => {
    const task = buildRoadmap("tech")[0].tasks[0].id;
    expect(scopedTaskState({ p1_t1: true, [task]: false, unknown: true })).toEqual({
      [task]: false,
    });
    expect(
      scopedTaskState({ [task]: true })[buildRoadmap("creative")[0].tasks[0].id],
    ).toBeUndefined();
  });
});
