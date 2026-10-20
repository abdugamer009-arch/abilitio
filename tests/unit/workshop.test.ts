import { buildRoadmap, scopedTaskState, type RoadmapTrack } from "@/lib/roadmap/roadmap-world";
import { describe, it, expect } from "vitest";
import { IQ_BANK } from "@/lib/assessment/question-bank";
import { SAMPLE_QUESTIONS, sampleRecord } from "@/lib/assessment/sample-questions";
describe("public workshop and authoritative question bank", () => {
  it("uses four independent practice questions, separate from every scored bank", () => {
    expect(SAMPLE_QUESTIONS).toHaveLength(4);
    for (const q of SAMPLE_QUESTIONS) expect(IQ_BANK.some((item) => item.id === q.id)).toBe(false);
  });
  it("records only valid attempted practice answers and computes real correctness", () => {
    const [a, b, c, d] = SAMPLE_QUESTIONS;
    expect(
      sampleRecord({
        [a.id]: a.correct,
        [b.id]: (b.correct + 1) % 4,
        [c.id]: 99,
        [d.id]: -1,
        unrelated: 0,
      }),
    ).toEqual({ attempted: 2, correct: 1, total: 4 });
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
