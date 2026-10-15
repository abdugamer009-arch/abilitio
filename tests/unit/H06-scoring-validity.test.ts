import { CAREER_CATALOG } from "@/lib/assessment/catalog.server";
import { describe, expect, it } from "vitest";
import {
  matchCareers,
  type Career,
  type CognitiveScore,
  type PersonalityScore,
} from "@/lib/assessment/career-engine";
import { SCORING_WEIGHTS, scoringMethodology } from "@/lib/assessment/scoring-config";
import { evidenceCoverage } from "@/lib/assessment/summary-integrity";
import { pickSessionQuestions } from "@/lib/assessment/question-bank";

const personality: PersonalityScore = {
  mbti: "XXXX",
  letters: {},
  workStyle: "Mixed preferences",
  leadershipStyle: "Mixed preferences",
  learningStyle: "Mixed preferences",
  teamStyle: "Mixed preferences",
};
const reasoning: CognitiveScore = { score: 0, tier: "Basic", profile: "Exploring" };
const careers: Career[] = [
  {
    key: "research",
    name: "Research",
    category: "Science",
    description: null,
    salary_min: 0,
    salary_max: 0,
    demand_score: 40,
    required_traits: {},
    required_profile: ["Research"],
    required_interests: ["science", "technology"],
    required_skills: [],
  },
  {
    key: "artist",
    name: "Artist",
    category: "Arts",
    description: null,
    salary_min: 0,
    salary_max: 0,
    demand_score: 99,
    required_traits: {},
    required_profile: ["Innovative"],
    required_interests: ["arts", "design"],
    required_skills: [],
  },
];
const investigative = [
  { key: "science", weight: 1 },
  { key: "technology", weight: 1 },
  { key: "arts", weight: 0 },
  { key: "design", weight: 0 },
];
const artistic = investigative.map((interest) => ({ ...interest, weight: 1 - interest.weight }));

describe("H06 career ranking evidence", () => {
  it("uses mostly direct activities, at most five percent visual preferences, and no uniform reasoning offset", () => {
    expect(SCORING_WEIGHTS.teen_adult.directInterest).toBeGreaterThan(
      SCORING_WEIGHTS.teen_adult.personality,
    );
    expect(SCORING_WEIGHTS.teen_adult.visualPreference).toBeLessThanOrEqual(0.05);
    expect(SCORING_WEIGHTS.teen_adult.reasoning).toBe(0);
    for (const lang of ["en", "ru", "uz"] as const) {
      const explanation = scoringMethodology("teen_adult", lang);
      expect(explanation).toContain(`${SCORING_WEIGHTS.teen_adult.directInterest * 100}%`);
      expect(explanation).toContain(`${SCORING_WEIGHTS.teen_adult.personality * 100}%`);
    }
  });

  it("asks adults about direct activities in every new sitting", () => {
    for (let i = 0; i < 100; i++) {
      const session = pickSessionQuestions("teen_adult");
      expect(
        session.interest.filter((question) => question.evidenceKind === "activity").length,
      ).toBeGreaterThanOrEqual(6);
    }
  });

  it("ranks research first for investigative tech interests and art first for artistic interests", () => {
    expect(matchCareers(careers, personality, reasoning, investigative)[0].key).toBe("research");
    expect(matchCareers(careers, personality, reasoning, artistic)[0].key).toBe("artist");
  });

  it("does not let opposing visual preferences flip strong direct evidence", () => {
    const result = matchCareers(careers, personality, reasoning, investigative, false, artistic);
    expect(result[0].key).toBe("research");
  });

  it("does not change ranking or score when only reasoning score and profile change", () => {
    const low = matchCareers(careers, personality, reasoning, investigative);
    const high = matchCareers(
      careers,
      personality,
      { score: 9, tier: "Exceptional", profile: "Innovative" },
      investigative,
    );
    expect(high.map(({ key, score }) => ({ key, score }))).toEqual(
      low.map(({ key, score }) => ({ key, score })),
    );
  });

  it("labels older visual-only and historical reports as limited evidence", () => {
    expect(evidenceCoverage("v6-direct-interests")).toBe("direct");
    expect(evidenceCoverage("v6-legacy-visual-only")).toBe("limited");
    expect(evidenceCoverage("v5-evidence")).toBe("historical");
  });
  it("keeps investigative/tech and artistic fixtures on top of the real 166-career catalogue", () => {
    const tech = matchCareers(CAREER_CATALOG, personality, reasoning, investigative);
    const art = matchCareers(CAREER_CATALOG, personality, reasoning, artistic);
    expect(tech).toHaveLength(166);
    expect(tech[0].category).toMatch(/Technology|Science/);
    expect(art[0].category).toMatch(/Arts|Design/);
  });
});
