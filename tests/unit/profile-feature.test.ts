import { describe, it, expect, vi } from "vitest";
import { CHILD_PERSONALITY, CHILD_INTEREST } from "@/lib/assessment/child-questions";
import {
  pickSessionQuestions,
  getInterestRiasec,
  validateAgePools,
  PERSONALITY_BANK,
  IQ_BANK,
  INTEREST_BANK,
} from "@/lib/assessment/question-bank";
import { QUESTION_TRANSLATIONS } from "@/lib/assessment/question-translations";
import {
  scorePersonality,
  scoreInterests,
  matchCareers,
  matchMajors,
} from "@/lib/assessment/career-engine";
import { CAREER_CATALOG, MAJOR_CATALOG } from "@/lib/assessment/catalog.server";
import { applyResultRules, resultRules, type ResultRule } from "@/lib/assessment/result-rules";
import {
  signSession,
  verifySession,
  validateSessionSubmission,
} from "@/lib/assessment/session.server";
import {
  validProfile,
  rememberResultProfile,
  readResultProfile,
  resetAttempt,
  DRAFT_KEY,
  LEGACY_DRAFT_KEY,
  readAttemptDraft,
} from "@/lib/assessment/attempt-profile";

describe("age and gender assessment", () => {
  it("tags every existing item and localizes every added child item with aligned options", () => {
    for (const q of [...PERSONALITY_BANK, ...IQ_BANK, ...INTEREST_BANK])
      expect(q.ageGroups).toEqual(["teen_adult"]);
    for (const q of [...CHILD_PERSONALITY, ...CHILD_INTEREST]) {
      expect(q.ageGroups).toEqual(["child"]);
      expect(q.addedBy).toBe("feature-age");
      for (const lang of ["ru", "uz"] as const) {
        const tr = QUESTION_TRANSLATIONS[q.id][lang];
        expect(tr.prompt).toBeTruthy();
        if (q.section === "interest") expect(tr.options).toHaveLength(q.options.length);
      }
    }
  });
  for (const gender of ["male", "female"] as const)
    for (const age of ["child", "teen_adult"] as const) {
      it(`${gender}/${age}: valid signed attempt, balanced questions, varied order and all career results`, () => {
        const s = pickSessionQuestions(age);
        expect(s.iq).toHaveLength(age === "child" ? 0 : 9);
        expect(s.interest).toHaveLength(age === "child" ? 18 : 9);
        const items = [...s.personality, ...s.iq, ...s.interest];
        expect(items).toHaveLength(30);
        expect(new Set(items.map((q) => q.id)).size).toBe(30);
        expect(items.every((q) => q.ageGroups?.includes(age))).toBe(true);
        if (age === "child")
          expect(items.every((q) => q.addedBy === "feature-age" && q.section !== "cognitive")).toBe(
            true,
          );
        for (const axis of ["EI", "SN", "TF", "JP"])
          expect(s.personality.filter((q) => q.axis === axis)).toHaveLength(3);
        const next = pickSessionQuestions(age);
        expect(next.personality.map((q) => q.id)).not.toEqual(s.personality.map((q) => q.id));
        const claim = verifySession(
          signSession({
            personality: s.personality.map((q) => q.id),
            iq: s.iq.map((q) => q.id),
            iqOptionOrders: s.iq.map((q) => q.optionOrder!),
            interest: s.interest.map((q) => ({ id: q.id, options: q.options.map((o) => o.id) })),
          }),
        );
        const answers = {
          personalityQIds: claim.personality,
          personalityAnswers: Array(12).fill(4),
          iqQIds: claim.iq,
          iqAnswers: Array(s.iq.length).fill(0),
          interestQIds: claim.interest.map((q) => q.id),
          interestAnswers: claim.interest.map((q) => [q.options[0]]),
        };
        expect(() => validateSessionSubmission(claim, answers)).not.toThrow();
        expect(() => validateSessionSubmission(claim, { ...answers, iqAnswers: [0, 0] })).toThrow();
        const p = scorePersonality(answers.personalityAnswers, s.personality);
        const { interests } = scoreInterests(
          answers.interestAnswers.map(([id]) => getInterestRiasec(id)!),
        );
        const cognitive = { score: 5, tier: "Competent" as const, profile: "Practical" as const };
        const ranked = matchCareers(CAREER_CATALOG, p, cognitive, interests, age === "child");
        expect(ranked).toHaveLength(166);
        const displayed = applyResultRules(ranked, gender, "en");
        expect(displayed[0].key).toBeTruthy();
        expect(displayed.every((m) => Number.isFinite(m.score))).toBe(true);
        if (age === "child") {
          expect(
            matchCareers(CAREER_CATALOG, p, { ...cognitive, score: 0 }, interests, true),
          ).toEqual(matchCareers(CAREER_CATALOG, p, { ...cognitive, score: 9 }, interests, true));
          expect(
            matchMajors(MAJOR_CATALOG, p, { ...cognitive, score: 0 }, interests, true),
          ).toEqual(matchMajors(MAJOR_CATALOG, p, { ...cognitive, score: 9 }, interests, true));
        }
      });
    }
  it("covers every canonical career, supports weights/wording/exclusions, never leaves empty results, and does not mutate saved scores", () => {
    for (const c of CAREER_CATALOG) expect(resultRules[c.key]).toBeTruthy();
    const matches = [
      { key: "actor", name: "Actor", score: 90 },
      { key: "teacher", name: "Teacher", score: 80 },
    ];
    const original = structuredClone(matches);
    expect(applyResultRules(matches, "female", "en")[0].name).toBe("Actress");
    expect(applyResultRules(matches, "female", "ru")[1].name).toBe("Учительница");
    const custom: Record<string, ResultRule> = {
      actor: { male: { action: "weight", factor: 0.5 }, female: { action: "exclude" } },
    };
    expect(applyResultRules(matches, "male", "en", custom)[0].key).toBe("teacher");
    expect(applyResultRules(matches, "female", "en", custom)[0].key).toBe("teacher");
    custom.teacher = { male: { action: "exclude" }, female: { action: "exclude" } };
    expect(applyResultRules(matches, "female", "en", custom)[0].key).toBe("actor");
    expect(applyResultRules([], "female", "uz")).toHaveLength(1);
    expect(matches).toEqual(original);
  });
  it("warns for deficient pools and fails safely when an age pool is empty", () => {
    const warn = vi.fn();
    validateAgePools(warn);
    expect(warn).not.toHaveBeenCalled();
    const saved = CHILD_INTEREST.splice(0);
    try {
      validateAgePools(warn);
      expect(warn).toHaveBeenCalledWith(expect.stringContaining("child"));
      expect(() => pickSessionQuestions("child")).toThrow("interest pool");
    } finally {
      CHILD_INTEREST.push(...saved);
    }
  });
  it("requires both recognized choices", () => {
    expect(validProfile({ gender: "female", ageGroup: "child" })).toBe(true);
    expect(validProfile({ gender: "male", ageGroup: null })).toBe(false);
    expect(validProfile({ gender: null, ageGroup: "teen_adult" })).toBe(false);
    expect(validProfile({ gender: "bad", ageGroup: "child" })).toBe(false);
  });
  it("keeps profiles in session storage, binds presentation to account/result, and clears on reset", () => {
    const values = new Map<string, string>();
    const storage = {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => values.set(key, value),
      removeItem: (key: string) => values.delete(key),
    };
    vi.stubGlobal("sessionStorage", storage);
    const permanent = { setItem: vi.fn() };
    vi.stubGlobal("localStorage", permanent);
    try {
      values.set(DRAFT_KEY, "draft");
      rememberResultProfile("result", "owner", { gender: "female", ageGroup: "child" });
      expect(readResultProfile("result", "owner")?.gender).toBe("female");
      expect(readResultProfile("other-result", "owner")).toBeNull();
      expect(readResultProfile("result", "other-owner")).toBeNull();
      expect(values.has(DRAFT_KEY)).toBe(false);
      expect(permanent.setItem).not.toHaveBeenCalled();
      resetAttempt();
      expect(values.size).toBe(0);
      expect(readResultProfile("result", "owner")).toBeNull();
    } finally {
      resetAttempt();
      vi.unstubAllGlobals();
    }
  });
  it("reads existing drafts for migration while preferring session-only progress", () => {
    const session = new Map<string, string>();
    const permanent = new Map([[LEGACY_DRAFT_KEY, "legacy"]]);
    vi.stubGlobal("sessionStorage", {
      getItem: (key: string) => session.get(key) ?? null,
      removeItem: (key: string) => session.delete(key),
    });
    vi.stubGlobal("localStorage", {
      getItem: (key: string) => permanent.get(key) ?? null,
      removeItem: (key: string) => permanent.delete(key),
    });
    try {
      expect(readAttemptDraft()).toBe("legacy");
      session.set(DRAFT_KEY, "current");
      expect(readAttemptDraft()).toBe("current");
      resetAttempt();
      expect(readAttemptDraft()).toBeNull();
    } finally {
      resetAttempt();
      vi.unstubAllGlobals();
    }
  });
  it("retains result presentation in memory if session storage is unavailable", () => {
    vi.stubGlobal("sessionStorage", {
      getItem: () => {
        throw new Error("blocked");
      },
      setItem: () => {
        throw new Error("blocked");
      },
      removeItem: () => {
        throw new Error("blocked");
      },
    });
    try {
      rememberResultProfile("result", "owner", { gender: "male", ageGroup: "teen_adult" });
      expect(readResultProfile("result", "owner")?.gender).toBe("male");
      expect(readResultProfile("result", "another-owner")).toBeNull();
      resetAttempt();
      expect(readResultProfile("result", "owner")).toBeNull();
    } finally {
      resetAttempt();
      vi.unstubAllGlobals();
    }
  });
});
