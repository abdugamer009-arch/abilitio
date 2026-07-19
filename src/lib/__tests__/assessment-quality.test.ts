import { describe, it, expect } from "vitest";
import { INTEREST_BANK } from "../assessment/question-bank";
import {
  DOMAIN_RIASEC,
  scoreInterests,
  deriveRiasecFromInterests,
  hollandCode,
} from "../assessment/career-engine";
import { INTEREST_KEYS, RIASEC_DIMS } from "../assessment/career-assessment";
import { QUESTION_TRANSLATIONS } from "../assessment/question-translations";

describe("DOMAIN_RIASEC coverage (#10)", () => {
  it("covers every interest field with valid, positive RIASEC dims", () => {
    for (const key of INTEREST_KEYS) {
      const v = DOMAIN_RIASEC[key];
      expect(v, `missing DOMAIN_RIASEC entry for "${key}"`).toBeTruthy();
      const entries = Object.entries(v);
      expect(entries.length).toBeGreaterThan(0);
      for (const [dim, w] of entries) {
        expect(RIASEC_DIMS).toContain(dim);
        expect(w).toBeGreaterThan(0);
      }
    }
  });
});

describe("sharpened interest weights (#3)", () => {
  it("spreads weights across the full [0,1] range with a clear top and bottom", () => {
    const { interests } = scoreInterests([{ A: 3 }, { A: 2, S: 1 }]);
    expect(interests[0].weight).toBeCloseTo(1);
    expect(interests[interests.length - 1].weight).toBeCloseTo(0);
    for (const i of interests) {
      expect(i.weight).toBeGreaterThanOrEqual(0);
      expect(i.weight).toBeLessThanOrEqual(1);
    }
  });

  it("preserves ranking after sharpening (arts still beats finance for Artistic picks)", () => {
    const { interests } = scoreInterests([{ A: 3 }, { A: 3 }]);
    const arts = interests.find((i) => i.key === "arts")!;
    const finance = interests.find((i) => i.key === "finance")!;
    expect(arts.weight).toBeGreaterThan(finance.weight);
  });
});

describe("Holland derivation (#1)", () => {
  it("derives a top-3 code whose leading dimension matches strong interests", () => {
    const { interests } = scoreInterests([{ A: 3 }, { A: 3 }, { A: 2 }]);
    const code = hollandCode(deriveRiasecFromInterests(interests));
    expect(code).toHaveLength(3);
    expect(code[0]).toBe("A"); // Artistic dominates
  });

  it("returns an all-zero profile (empty code leader) when there is no signal", () => {
    const profile = deriveRiasecFromInterests(scoreInterests([]).interests);
    expect(Object.values(profile).every((v) => v === 0)).toBe(true);
  });
});

describe("interest translations completeness (#6)", () => {
  it("every interest question has ru + uz prompts and matching option counts", () => {
    for (const q of INTEREST_BANK) {
      const tr = QUESTION_TRANSLATIONS[q.id];
      expect(tr, `missing translation for interest question "${q.id}"`).toBeTruthy();
      expect(tr.ru?.prompt, `missing ru prompt for "${q.id}"`).toBeTruthy();
      expect(tr.uz?.prompt, `missing uz prompt for "${q.id}"`).toBeTruthy();
      expect(tr.ru?.options?.length, `ru option count mismatch for "${q.id}"`).toBe(
        q.options.length,
      );
      expect(tr.uz?.options?.length, `uz option count mismatch for "${q.id}"`).toBe(
        q.options.length,
      );
    }
  });
});
