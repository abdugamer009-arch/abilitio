import { describe, it, expect } from "vitest";
import {
  INTEREST_BANK,
  getInterestRiasec,
  pickSessionQuestions,
} from "../assessment/question-bank";
import {
  scoreInterests,
  matchCareers,
  scorePersonality,
  scoreCognitive,
  type Career,
} from "../assessment/career-engine";
import type { PersonalityQ, RiasecDim } from "../assessment/career-assessment";

// Helper: find an option id in the bank by a substring of its id.
function optId(sub: string): string {
  for (const q of INTEREST_BANK) for (const o of q.options) if (o.id.includes(sub)) return o.id;
  throw new Error(`no option matching ${sub}`);
}

function resolve(ids: string[]): Partial<Record<RiasecDim, number>>[] {
  return ids.map((id) => getInterestRiasec(id)!).filter(Boolean);
}

const P: PersonalityQ[] = Array.from({ length: 12 }, (_, i) => ({
  id: `p${i}`,
  section: "personality",
  prompt: "",
  axis: "EI",
  direction: 1,
}));

describe("interest test end-to-end (projective → job)", () => {
  it("an artistic symbol picker gets creative fields on top", () => {
    // squiggle, paintbrush, jazz sax, violet palette, free doodle, ribbon line
    const picks = resolve([
      optId("s1_squiggle"),
      optId("o1_brush"),
      optId("d1_sax"),
      optId("c1_violet"),
      optId("p1_doodle"),
      optId("l2_wave"),
    ]);
    const { interests } = scoreInterests(picks);
    const top5 = interests.slice(0, 5).map((i) => i.key);
    expect(top5.some((k) => ["arts", "design"].includes(k))).toBe(true);
    // creative should clearly beat finance/law
    const arts = interests.find((i) => i.key === "arts")!;
    const finance = interests.find((i) => i.key === "finance")!;
    expect(arts.weight).toBeGreaterThan(finance.weight);
  });

  it("an enterprising symbol picker surfaces business-type careers", () => {
    // triangle, lion, rising line, ember palette, mountain peak, megaphone
    const picks = resolve([
      optId("s1_triangle"),
      optId("a1_lion"),
      optId("l1_diagonal"),
      optId("c1_ember"),
      optId("n1_mountain"),
      optId("o1_megaphone"),
    ]);
    const { interests } = scoreInterests(picks);
    const top5 = interests.slice(0, 5).map((i) => i.key);
    expect(
      top5.some((k) => ["business", "entrepreneurship", "politics", "marketing"].includes(k)),
    ).toBe(true);

    // Feed into full career matcher with a neutral personality/cognitive.
    const personality = scorePersonality(Array(12).fill(3), P);
    const cognitive = scoreCognitive([], [], personality.mbti);
    const careers: Career[] = [
      {
        key: "entrepreneur",
        name: "Entrepreneur",
        category: "Business",
        description: null,
        salary_min: 0,
        salary_max: 0,
        demand_score: 80,
        required_traits: {},
        required_profile: [],
        required_interests: ["entrepreneurship", "business"],
        required_skills: [],
      },
      {
        key: "painter",
        name: "Painter",
        category: "Arts",
        description: null,
        salary_min: 0,
        salary_max: 0,
        demand_score: 60,
        required_traits: {},
        required_profile: [],
        required_interests: ["arts", "design"],
        required_skills: [],
      },
    ];
    const matches = matchCareers(careers, personality, cognitive, interests);
    expect(matches[0].key).toBe("entrepreneur"); // enterprising picks → business career wins
  });

  it("an investigative picker surfaces science/technology", () => {
    const picks = resolve([
      optId("a1_owl"),
      optId("o1_book"),
      optId("l1_spiral"),
      optId("c1_deep"),
      optId("o2_telescope"),
      optId("v1_dive"),
    ]);
    const { interests } = scoreInterests(picks);
    const top5 = interests.slice(0, 5).map((i) => i.key);
    expect(top5.some((k) => ["science", "technology"].includes(k))).toBe(true);
  });

  it("session picker returns 9 unique, theme-diverse interest questions", () => {
    for (let n = 0; n < 20; n++) {
      const s = pickSessionQuestions();
      expect(s.interest).toHaveLength(9);
      const ids = s.interest.map((q) => q.id);
      expect(new Set(ids).size).toBe(9);
      const themes = new Set(s.interest.map((q) => q.theme));
      // with 12 themes and round-robin, 9 picks must all be distinct themes
      expect(themes.size).toBe(9);
    }
  });
});
