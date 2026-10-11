import { afterEach, describe, expect, it, vi } from "vitest";
import { CAREER_CATALOG, MAJOR_CATALOG, completeCatalog } from "../assessment/catalog.server";
import {
  PERSONALITY_BANK,
  IQ_BANK,
  INTEREST_BANK,
  pickSessionQuestions,
  getIQCorrect,
} from "../assessment/question-bank";
import { matchCareers, attachMajorsToCareers, matchMajors } from "../assessment/career-engine";
import { sessionIQAnswerKeys, signSession, verifySession } from "../assessment/session.server";

afterEach(() => vi.restoreAllMocks());

describe("full assessment coverage", () => {
  it("can deliver all 561 items with balanced, non-duplicated attempts and varied option orders", () => {
    let seed = 37491;
    vi.spyOn(Math, "random").mockImplementation(() => {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      return seed / 2 ** 32;
    });
    const seen = new Set<string>();
    const orders = new Set<string>();
    for (let i = 0; i < 1000; i++) {
      const session = pickSessionQuestions();
      const all = [...session.personality, ...session.iq, ...session.interest];
      expect(all).toHaveLength(30);
      expect(new Set(all.map((q) => q.id)).size).toBe(30);
      all.forEach((q) => seen.add(q.id));
      for (const axis of ["EI", "SN", "TF", "JP"])
        expect(session.personality.filter((q) => q.axis === axis)).toHaveLength(3);
      const claim = verifySession(
        signSession({
          personality: session.personality.map((q) => q.id),
          iq: session.iq.map((q) => q.id),
          iqOptionOrders: session.iq.map((q) => q.optionOrder!),
          interest: session.interest.map((q) => ({
            id: q.id,
            options: q.options.map((o) => o.id),
          })),
        }),
      );
      const keys = sessionIQAnswerKeys(
        claim,
        session.iq.map((q) => getIQCorrect(q.id)!),
      );
      session.iq.forEach((q, index) => {
        const original = IQ_BANK.find((item) => item.id === q.id)!;
        expect(q.options[keys[index]]).toBe(original.options[original.correct]);
        expect(new Set(q.optionOrder).size).toBe(4);
        orders.add(q.optionOrder!.join());
      });
      for (const q of session.interest) {
        const original = INTEREST_BANK.find((item) => item.id === q.id)!;
        expect(q.options.map((o) => o.id).sort()).toEqual(original.options.map((o) => o.id).sort());
      }
    }
    expect(seen).toEqual(
      new Set([...PERSONALITY_BANK, ...IQ_BANK, ...INTEREST_BANK].map((q) => q.id)),
    );
    expect(seen.size).toBe(561);
    expect(orders.size).toBe(24);
  });

  it("keeps older signed attempts gradable and rejects malformed permutations", () => {
    const claim = {
      nonce: "test",
      expires: Date.now() + 1000,
      personality: [],
      iq: ["iq21"],
      interest: [],
    };
    expect(sessionIQAnswerKeys(claim, [getIQCorrect("iq21")!])).toEqual([2]);
    expect(getIQCorrect("iq21_v2")).toBe(1);
    expect(() => sessionIQAnswerKeys({ ...claim, iqOptionOrders: [[0, 0, 2, 3]] }, [2])).toThrow(
      "option ordering",
    );
    expect(() => sessionIQAnswerKeys({ ...claim, iqOptionOrders: [[3, 1, 2, 0]] }, [-999])).toThrow(
      "unknown cognitive question",
    );
    expect(() => sessionIQAnswerKeys({ ...claim, iqOptionOrders: [] }, [2])).toThrow(
      "option ordering",
    );
  });
});

describe("complete career matching", () => {
  it("fills missing seed records while retaining database overrides and additional careers", () => {
    const overridden = { ...CAREER_CATALOG[0], name: "Updated career name" };
    const extra = { ...CAREER_CATALOG[0], key: "custom_career" };
    const completed = completeCatalog(CAREER_CATALOG, [overridden, extra]);
    expect(completed).toHaveLength(167);
    expect(completed.find((row) => row.key === overridden.key)?.name).toBe(overridden.name);
    expect(completed.some((row) => row.key === extra.key)).toBe(true);
    expect(completeCatalog(CAREER_CATALOG, [])).toHaveLength(166);
  });

  it("scores every career and links every canonical career to a study major", () => {
    const personality = {
      mbti: "INTJ",
      letters: { I: 0.8, E: 0.2, N: 0.8, S: 0.2, T: 0.8, F: 0.2, J: 0.8, P: 0.2 },
      workStyle: "",
      leadershipStyle: "",
      learningStyle: "",
      teamStyle: "",
    };
    const cognitive = { score: 8, tier: "Advanced" as const, profile: "Analytical" as const };
    const interests = [
      { key: "technology", weight: 1 },
      { key: "science", weight: 0.8 },
    ];
    const scores = matchCareers(CAREER_CATALOG, personality, cognitive, interests);
    const results = attachMajorsToCareers(
      scores,
      MAJOR_CATALOG,
      matchMajors(MAJOR_CATALOG, personality, cognitive, interests),
    );
    expect(results).toHaveLength(166);
    expect(new Set(results.map((row) => row.key)).size).toBe(166);
    expect(results.filter((row) => !row.major).map((row) => row.key)).toEqual([]);
    expect(results.every((row) => Number.isFinite(row.score))).toBe(true);
    expect(results.map((row) => row.score)).toEqual(
      results.map((row) => row.score).sort((a, b) => b - a),
    );
  });
});
