import { describe, expect, it } from "vitest";
import {
  PERSONALITY_BANK,
  IQ_BANK,
  INTEREST_BANK,
  pickSessionQuestions,
} from "@/lib/assessment/question-bank";
import { CHILD_PERSONALITY, CHILD_INTEREST } from "@/lib/assessment/child-questions";
import { ADULT_ACTIVITY_BANK } from "@/lib/assessment/activity-questions";

describe("M02 question coverage and similarity", () => {
  it("tags every question with a trait and similarity group", () => {
    for (const question of [
      ...PERSONALITY_BANK,
      ...IQ_BANK,
      ...INTEREST_BANK,
      ...CHILD_PERSONALITY,
      ...CHILD_INTEREST,
      ...ADULT_ACTIVITY_BANK,
    ]) {
      expect(question.trait).toBeTruthy();
      expect(question.similarityGroup).toBeTruthy();
    }
  });

  it("places known near-duplicates in the same group", () => {
    expect(PERSONALITY_BANK.find((q) => q.id === "p1")?.similarityGroup).toBe(
      PERSONALITY_BANK.find((q) => q.id === "p9")?.similarityGroup,
    );
  });

  it("produces 500 distinct-group attempts while covering all four work-preference axes", () => {
    for (let i = 0; i < 500; i++) {
      const session = pickSessionQuestions(i % 2 ? "child" : "teen_adult");
      const all = [...session.personality, ...session.iq, ...session.interest];
      expect(new Set(all.map((q) => q.similarityGroup)).size).toBe(all.length);
      expect(new Set(session.personality.map((q) => q.trait))).toEqual(
        new Set(["EI", "SN", "TF", "JP"]),
      );
    }
  });
  it("balances every available reasoning trait in 500 older attempts", () => {
    const traits = new Set(IQ_BANK.map((q) => q.trait));
    for (let n = 0; n < 500; n++)
      expect(new Set(pickSessionQuestions("teen_adult").iq.map((q) => q.trait))).toEqual(traits);
  });
});
