import { describe, it, expect } from "vitest";
import { buildFixtures } from "../../scripts/mobile-qa-data";
import type { ClientSession } from "@/lib/assessment/career.functions";
import { verifySession, validateSessionSubmission } from "@/lib/assessment/session.server";
import { PERSONALITY_BANK, IQ_BANK } from "@/lib/assessment/question-bank";
import { ADULT_ACTIVITY_BANK } from "@/lib/assessment/activity-questions";
import { CHILD_INTEREST } from "@/lib/assessment/child-questions";
import { QUESTION_TRANSLATIONS } from "@/lib/assessment/question-translations";

describe("repeatable mobile QA fixtures", () => {
  for (const lang of ["en", "ru", "uz"]) {
    it(`${lang}: includes the actual longest reasoning prompt/option and strips hidden grading data`, () => {
      const fixtures = buildFixtures(lang, "longest");
      const session = fixtures.sessions.teen_adult as ClientSession;
      const prompt = (q: { id: string; prompt: string }) =>
        lang === "en" ? q.prompt : QUESTION_TRANSLATIONS[q.id][lang as "ru" | "uz"].prompt;
      const options = (q: (typeof IQ_BANK)[number]) =>
        lang === "en" ? q.options : QUESTION_TRANSLATIONS[q.id][lang as "ru" | "uz"].options!;
      expect(Math.max(...session.iq.map((q) => q.prompt[lang as "en" | "ru" | "uz"].length))).toBe(
        Math.max(...IQ_BANK.map((q) => prompt(q).length)),
      );
      expect(
        Math.max(
          ...session.iq.flatMap((q) => q.options[lang as "en" | "ru" | "uz"].map((o) => o.length)),
        ),
      ).toBe(Math.max(...IQ_BANK.flatMap((q) => options(q).map((o) => o.length))));
      expect(JSON.stringify(fixtures.sessions)).not.toMatch(/"(correct|riasec|direction|axis)":/);
      const claim = verifySession(session.sessionToken);
      expect(() =>
        validateSessionSubmission(claim, {
          personalityQIds: session.personality.map((q) => q.id),
          iqQIds: session.iq.map((q) => q.id),
          interestQIds: session.interest.map((q) => q.id),
          interestAnswers: session.interest.map((q) => [q.options[0].id]),
        }),
      ).not.toThrow();
      for (const axis of ["EI", "SN", "TF", "JP"])
        expect(
          session.personality.filter(
            (q) => PERSONALITY_BANK.find((p) => p.id === q.id)?.axis === axis,
          ),
        ).toHaveLength(3);
      const child = fixtures.sessions.child as ClientSession;
      for (const [selected, pool] of [
        [session, ADULT_ACTIVITY_BANK],
        [child, CHILD_INTEREST],
      ] as const) {
        const locale = lang as "en" | "ru" | "uz";
        expect(Math.max(...selected.interest.map((q) => q.prompt[locale].length))).toBe(
          Math.max(...pool.map((q) => prompt(q).length)),
        );
        expect(
          Math.max(
            ...selected.interest.flatMap((q) => q.labels[locale].map((label) => label.length)),
          ),
        ).toBe(
          Math.max(
            ...pool.flatMap((q) =>
              lang === "en"
                ? q.options.map((o) => o.label.length)
                : QUESTION_TRANSLATIONS[q.id][lang as "ru" | "uz"].options!.map(
                    (label) => label.length,
                  ),
            ),
          ),
        );
      }
      expect(child.iq).toHaveLength(0);
      expect(child.personality).toHaveLength(12);
      expect(child.interest).toHaveLength(18);
      expect((fixtures.results.child as { career_matches: unknown[] }).career_matches).toHaveLength(
        166,
      );
    });
  }
  it("random attempts change order and keep localized option alignment", () => {
    const a = buildFixtures("ru", "random").sessions.teen_adult as ClientSession;
    const b = buildFixtures("ru", "random").sessions.teen_adult as ClientSession;
    expect(a.personality.map((q) => q.id)).not.toEqual(b.personality.map((q) => q.id));
    for (const q of a.interest)
      for (const lang of ["en", "ru", "uz"] as const)
        expect(q.labels[lang]).toHaveLength(q.options.length);
  });
});
