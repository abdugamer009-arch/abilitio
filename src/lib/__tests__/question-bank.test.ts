import { describe, it, expect } from "vitest";
import { PERSONALITY_BANK, IQ_BANK, INTEREST_BANK, pickSessionQuestions, getIQCorrect } from "../question-bank";

describe("question banks", () => {
  it("has exactly 200 personality questions", () => {
    expect(PERSONALITY_BANK).toHaveLength(200);
  });

  it("has exactly 200 IQ questions", () => {
    expect(IQ_BANK).toHaveLength(200);
  });

  it("has exactly 200 interest questions", () => {
    expect(INTEREST_BANK).toHaveLength(200);
  });

  it("has no duplicate personality IDs", () => {
    const ids = PERSONALITY_BANK.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("has no duplicate IQ IDs", () => {
    const ids = IQ_BANK.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("has no duplicate interest IDs", () => {
    const ids = INTEREST_BANK.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every personality question has axis EI, SN, TF, or JP", () => {
    const valid = ["EI", "SN", "TF", "JP"];
    PERSONALITY_BANK.forEach((q) => {
      expect(valid).toContain(q.axis);
    });
  });

  it("every personality question has direction 1 or -1", () => {
    PERSONALITY_BANK.forEach((q) => {
      expect([1, -1]).toContain(q.direction);
    });
  });

  it("has at least 40 questions per MBTI axis", () => {
    const axes = ["EI", "SN", "TF", "JP"] as const;
    for (const ax of axes) {
      const count = PERSONALITY_BANK.filter((q) => q.axis === ax).length;
      expect(count).toBeGreaterThanOrEqual(40);
    }
  });

  it("every IQ question has a valid correct index", () => {
    IQ_BANK.forEach((q) => {
      expect(q.correct).toBeGreaterThanOrEqual(0);
      expect(q.correct).toBeLessThan(q.options.length);
    });
  });
});

describe("pickSessionQuestions", () => {
  it("returns 12 personality, 9 IQ, 9 interest", () => {
    const session = pickSessionQuestions();
    expect(session.personality).toHaveLength(12);
    expect(session.iq).toHaveLength(9);
    expect(session.interest).toHaveLength(9);
  });

  it("guarantees 3 questions per MBTI axis", () => {
    const session = pickSessionQuestions();
    const axes = ["EI", "SN", "TF", "JP"];
    for (const ax of axes) {
      const count = session.personality.filter((q) => q.axis === ax).length;
      expect(count).toBeGreaterThanOrEqual(3);
    }
  });

  it("returns different questions each session (shuffled)", () => {
    const s1 = pickSessionQuestions();
    const s2 = pickSessionQuestions();
    const ids1 = s1.personality.map((q) => q.id).join(",");
    const ids2 = s2.personality.map((q) => q.id).join(",");
    // Very unlikely to be identical across 200-question pool
    expect(ids1).not.toBe(ids2);
  });

  it("returns no duplicate questions within a session", () => {
    const session = pickSessionQuestions();
    const pIds = session.personality.map((q) => q.id);
    const iIds = session.iq.map((q) => q.id);
    const intIds = session.interest.map((q) => q.id);
    expect(new Set(pIds).size).toBe(pIds.length);
    expect(new Set(iIds).size).toBe(iIds.length);
    expect(new Set(intIds).size).toBe(intIds.length);
  });
});

describe("getIQCorrect", () => {
  it("returns correct answer for known question", () => {
    const q = IQ_BANK[0];
    expect(getIQCorrect(q.id)).toBe(q.correct);
  });

  it("returns null for unknown id", () => {
    expect(getIQCorrect("nonexistent_999")).toBeNull();
  });
});
