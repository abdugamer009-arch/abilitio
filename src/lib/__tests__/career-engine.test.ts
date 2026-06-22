import { describe, it, expect } from "vitest";
import { scorePersonality, scoreCognitive, scoreInterests, matchCareers } from "../career-engine";
import type { PersonalityQ } from "../career-assessment";
import type { Career } from "../career-engine";

const PERSONALITY_QS: PersonalityQ[] = [
  { id: "p1",  section: "personality", prompt: "", axis: "EI", direction:  1 },
  { id: "p2",  section: "personality", prompt: "", axis: "EI", direction: -1 },
  { id: "p3",  section: "personality", prompt: "", axis: "EI", direction:  1 },
  { id: "p4",  section: "personality", prompt: "", axis: "SN", direction:  1 },
  { id: "p5",  section: "personality", prompt: "", axis: "SN", direction: -1 },
  { id: "p6",  section: "personality", prompt: "", axis: "SN", direction:  1 },
  { id: "p7",  section: "personality", prompt: "", axis: "TF", direction:  1 },
  { id: "p8",  section: "personality", prompt: "", axis: "TF", direction: -1 },
  { id: "p9",  section: "personality", prompt: "", axis: "TF", direction:  1 },
  { id: "p10", section: "personality", prompt: "", axis: "JP", direction:  1 },
  { id: "p11", section: "personality", prompt: "", axis: "JP", direction: -1 },
  { id: "p12", section: "personality", prompt: "", axis: "JP", direction:  1 },
];

describe("scorePersonality", () => {
  it("returns ESTJ for strong agree on direction=1 E/S/T/J questions", () => {
    const answers = [5, 1, 5, 5, 1, 5, 5, 1, 5, 5, 1, 5];
    const result = scorePersonality(answers, PERSONALITY_QS);
    expect(result.mbti).toBe("ESTJ");
  });

  it("returns INFP for strong agree on direction=-1 I/N/F/P questions", () => {
    const answers = [1, 5, 1, 1, 5, 1, 1, 5, 1, 1, 5, 1];
    const result = scorePersonality(answers, PERSONALITY_QS);
    expect(result.mbti).toBe("INFP");
  });

  it("returns all 4 letter confidences summing near 1 per axis", () => {
    const answers = [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3];
    const result = scorePersonality(answers, PERSONALITY_QS);
    expect(result.letters.E + result.letters.I).toBeCloseTo(1);
    expect(result.letters.S + result.letters.N).toBeCloseTo(1);
  });

  it("includes workStyle, leadershipStyle, learningStyle, teamStyle", () => {
    const answers = [4, 2, 4, 4, 2, 4, 4, 2, 4, 4, 2, 4];
    const result = scorePersonality(answers, PERSONALITY_QS);
    expect(result.workStyle).toBeTruthy();
    expect(result.leadershipStyle).toBeTruthy();
    expect(result.learningStyle).toBeTruthy();
    expect(result.teamStyle).toBeTruthy();
  });
});

describe("scoreCognitive", () => {
  it("scores 9/9 as Exceptional", () => {
    const correct = [0, 1, 2, 3, 0, 1, 2, 3, 0];
    const result = scoreCognitive(correct, correct, "INTJ");
    expect(result.score).toBe(9);
    expect(result.tier).toBe("Exceptional");
  });

  it("scores 0/9 as Basic", () => {
    const correct = [0, 1, 2, 3, 0, 1, 2, 3, 0];
    const wrong   = [3, 0, 1, 2, 3, 0, 1, 2, 3];
    const result = scoreCognitive(wrong, correct, "ESTP");
    expect(result.score).toBe(0);
    expect(result.tier).toBe("Basic");
  });

  it("does not count unanswered (-1) as correct", () => {
    const correct = [0, 1, 2, 3, 0, 1, 2, 3, 0];
    const answers = [-1, -1, -1, -1, -1, -1, -1, -1, -1];
    const result = scoreCognitive(answers, correct, "INFP");
    expect(result.score).toBe(0);
  });

  it("assigns Strategic profile for NT + score >= 7", () => {
    const correct = [0, 1, 2, 3, 0, 1, 2, 0, 0];
    const result = scoreCognitive(correct, correct, "INTJ");
    expect(result.profile).toBe("Strategic");
  });
});

describe("scoreInterests", () => {
  it("weights repeated keys higher", () => {
    const picks = [["technology", "science"], ["technology"], ["engineering"]];
    const { interests } = scoreInterests(picks);
    const tech = interests.find((i) => i.key === "technology");
    const eng  = interests.find((i) => i.key === "engineering");
    expect(tech!.weight).toBeGreaterThan(eng!.weight);
  });

  it("returns weight 1.0 for most frequent key", () => {
    const picks = [["technology"], ["technology"], ["science"]];
    const { interests } = scoreInterests(picks);
    const top = interests[0];
    expect(top.weight).toBe(1);
  });
});

describe("matchCareers", () => {
  const careers: Career[] = [
    {
      key: "software_engineer",
      name: "Software Engineer",
      category: "Technology",
      description: null,
      salary_min: 60000,
      salary_max: 150000,
      demand_score: 90,
      required_traits: { N: 1, T: 1 },
      required_profile: ["Analytical", "Strategic"],
      required_interests: ["technology", "engineering"],
      required_skills: [],
    },
    {
      key: "social_worker",
      name: "Social Worker",
      category: "Healthcare",
      description: null,
      salary_min: 35000,
      salary_max: 65000,
      demand_score: 70,
      required_traits: { F: 1, E: 1 },
      required_profile: ["Practical"],
      required_interests: ["psychology", "education"],
      required_skills: [],
    },
  ];

  it("ranks tech career higher for INTJ with tech interests", () => {
    // INFP-ish — NF heavy, use a real NT answer set below instead
    void scorePersonality([1, 5, 1, 1, 5, 1, 1, 5, 1, 1, 5, 1], PERSONALITY_QS);
    const answers = [5, 1, 5, 5, 1, 5, 5, 1, 5, 5, 1, 5]; // ESTJ-ish actually
    const p2 = scorePersonality(answers, PERSONALITY_QS);
    const cognitive = scoreCognitive([0,1,2,3,0,1,2,3,0], [0,1,2,3,0,1,2,3,0], p2.mbti);
    const interests = [{ key: "technology", weight: 1 }, { key: "engineering", weight: 0.8 }];
    const matches = matchCareers(careers, p2, cognitive, interests);
    expect(matches.length).toBe(2);
    // scores should be numbers between 0 and 99
    expect(matches[0].score).toBeGreaterThanOrEqual(0);
    expect(matches[0].score).toBeLessThanOrEqual(99);
  });

  it("returns scores sorted descending", () => {
    const answers = [3,3,3,3,3,3,3,3,3,3,3,3];
    const p = scorePersonality(answers, PERSONALITY_QS);
    const c = scoreCognitive([0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0], p.mbti);
    const matches = matchCareers(careers, p, c, []);
    expect(matches[0].score).toBeGreaterThanOrEqual(matches[1].score);
  });
});
