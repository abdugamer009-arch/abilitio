import { describe, it, expect } from "vitest";
import {
  PERSONALITY_BANK,
  INTEREST_BANK,
  TRANSLATED_IQ_POOL,
  pickSessionQuestions,
} from "../assessment/question-bank";
import { QUESTION_TRANSLATIONS } from "../assessment/question-translations";

// Localization is a hard invariant: a session picked on the server serves every
// language, so anything a session can contain must be fully translated into
// Russian and Uzbek. These tests fail the build when someone adds a question
// (or option) without complete translations.
describe("assessment localization coverage", () => {
  it("every personality question has ru and uz prompts", () => {
    const missing = PERSONALITY_BANK.filter((q) => {
      const t = QUESTION_TRANSLATIONS[q.id];
      return !t?.ru?.prompt || !t?.uz?.prompt;
    }).map((q) => q.id);
    expect(missing).toEqual([]);
  });

  it("every interest question has ru and uz prompts and full option labels", () => {
    const missing = INTEREST_BANK.filter((q) => {
      const t = QUESTION_TRANSLATIONS[q.id];
      return (
        !t?.ru?.prompt ||
        !t?.uz?.prompt ||
        t.ru.options?.length !== q.options.length ||
        t.uz.options?.length !== q.options.length
      );
    }).map((q) => q.id);
    expect(missing).toEqual([]);
  });

  it("the cognitive pool is large enough for varied 9-question draws", () => {
    expect(TRANSLATED_IQ_POOL.length).toBeGreaterThanOrEqual(40);
  });

  it("every question in the cognitive pool has complete, order-aligned ru/uz options", () => {
    for (const q of TRANSLATED_IQ_POOL) {
      const t = QUESTION_TRANSLATIONS[q.id];
      expect(t?.ru?.prompt, `${q.id} ru prompt`).toBeTruthy();
      expect(t?.uz?.prompt, `${q.id} uz prompt`).toBeTruthy();
      expect(t?.ru?.options?.length, `${q.id} ru options`).toBe(q.options.length);
      expect(t?.uz?.options?.length, `${q.id} uz options`).toBe(q.options.length);
    }
  });

  it("picked sessions only ever contain fully translated cognitive questions", () => {
    const poolIds = new Set(TRANSLATED_IQ_POOL.map((q) => q.id));
    for (let i = 0; i < 40; i++) {
      const s = pickSessionQuestions();
      expect(s.iq).toHaveLength(9);
      for (const q of s.iq) {
        expect(poolIds.has(q.id), `session contained untranslated ${q.id}`).toBe(true);
      }
    }
  });
});
