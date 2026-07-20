import { describe, it, expect } from "vitest";
import { IQ_QUESTIONS, IQ_BAND, scoreIq } from "../assessment/iq-test";

describe("scoreIq", () => {
  it("scores a perfect sheet at 40", () => {
    const perfect = IQ_QUESTIONS.map((q) => q.correct);
    const { score, byCat } = scoreIq(perfect);
    expect(score).toBe(40);
    expect(byCat.every((c) => c.correct === c.total)).toBe(true);
  });

  it("scores an empty sheet at 0", () => {
    const { score, byCat } = scoreIq(Array(40).fill(null));
    expect(score).toBe(0);
    expect(byCat.every((c) => c.correct === 0)).toBe(true);
  });

  it("category totals cover all 40 questions", () => {
    const { byCat } = scoreIq(Array(40).fill(null));
    expect(byCat.reduce((sum, c) => sum + c.total, 0)).toBe(IQ_QUESTIONS.length);
  });

  it("total score equals the sum of per-category correct counts", () => {
    // Answer only the first 10 questions correctly.
    const partial = IQ_QUESTIONS.map((q, i) => (i < 10 ? q.correct : null));
    const { score, byCat } = scoreIq(partial);
    expect(score).toBe(10);
    expect(byCat.reduce((sum, c) => sum + c.correct, 0)).toBe(score);
  });
});

describe("IQ_BAND", () => {
  it("maps boundary scores to the documented bands", () => {
    expect(IQ_BAND(40).label).toBe("Exceptional");
    expect(IQ_BAND(36).label).toBe("Exceptional");
    expect(IQ_BAND(35).label).toBe("Excellent");
    expect(IQ_BAND(19).label).toBe("Good");
    expect(IQ_BAND(14).label).toBe("Below Average");
    expect(IQ_BAND(0).label).toBe("Below Average");
  });
});
