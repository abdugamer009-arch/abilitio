// Career matching engine — runs server-side inside the submit fn.
// Formula: 40% personality fit + 35% cognitive fit + 25% interest fit.

export type Career = {
  key: string;
  name: string;
  category: string;
  description: string | null;
  salary_min: number;
  salary_max: number;
  demand_score: number;
  required_traits: Record<string, number>; // letter -> weight
  required_profile: string[];              // Analytical, Strategic, etc.
  required_interests: string[];
  required_skills: string[];
};

export type Major = {
  key: string;
  name: string;
  category: string;
  related_career_keys: string[];
  required_traits: Record<string, number>;
  required_profile: string[];
  required_interests: string[];
};

export type PersonalityScore = {
  mbti: string;            // 4 letters
  letters: Record<string, number>; // E/I/S/N/T/F/J/P 0..1 confidence
  workStyle: string;
  leadershipStyle: string;
  learningStyle: string;
  teamStyle: string;
};

export type CognitiveScore = {
  score: number; // 0..10
  tier: "Exceptional" | "Advanced" | "Competent" | "Developing" | "Basic";
  profile: "Analytical" | "Strategic" | "Practical" | "Research" | "Innovative";
};

export type Match = { key: string; name: string; category: string; score: number };

// ---------- Personality ----------
export function scorePersonality(answers: number[]): PersonalityScore {
  // answers are 1..5 for 16 personality Qs in fixed order matching career-assessment.ts
  // axes order: EI x4, SN x4, TF x4, JP x4
  const axes: Array<{ axis: "EI" | "SN" | "TF" | "JP"; dir: 1 | -1 }> = [
    { axis: "EI", dir: 1 }, { axis: "EI", dir: -1 }, { axis: "EI", dir: 1 }, { axis: "EI", dir: -1 },
    { axis: "SN", dir: 1 }, { axis: "SN", dir: -1 }, { axis: "SN", dir: 1 }, { axis: "SN", dir: -1 },
    { axis: "TF", dir: 1 }, { axis: "TF", dir: -1 }, { axis: "TF", dir: 1 }, { axis: "TF", dir: -1 },
    { axis: "JP", dir: 1 }, { axis: "JP", dir: -1 }, { axis: "JP", dir: 1 }, { axis: "JP", dir: -1 },
  ];
  const sums = { EI: 0, SN: 0, TF: 0, JP: 0 };
  axes.forEach((a, i) => {
    const v = (answers[i] ?? 3) - 3; // -2..+2
    sums[a.axis] += v * a.dir;
  });
  const mbti =
    (sums.EI > 0 ? "E" : "I") +
    (sums.SN > 0 ? "S" : "N") +
    (sums.TF > 0 ? "T" : "F") +
    (sums.JP > 0 ? "J" : "P");

  const letters: Record<string, number> = {};
  for (const k of ["EI","SN","TF","JP"] as const) {
    const v = Math.max(-8, Math.min(8, sums[k]));
    const conf = Math.abs(v) / 8;
    const [a, b] = k.split("") as [string, string];
    letters[v > 0 ? a : b] = conf;
    letters[v > 0 ? b : a] = 1 - conf;
  }

  return {
    mbti,
    letters,
    workStyle: workStyleFor(mbti),
    leadershipStyle: leadershipStyleFor(mbti),
    learningStyle: learningStyleFor(mbti),
    teamStyle: teamStyleFor(mbti),
  };
}

function workStyleFor(m: string): string {
  if (m[3] === "J") return m[0] === "I" ? "Focused & Structured" : "Driven & Organized";
  return m[0] === "I" ? "Flexible & Reflective" : "Dynamic & Adaptive";
}
function leadershipStyleFor(m: string): string {
  if (m[2] === "T") return m[3] === "J" ? "Strategic Commander" : "Visionary Analyst";
  return m[3] === "J" ? "Empathetic Organizer" : "Inspirational Mentor";
}
function learningStyleFor(m: string): string {
  if (m[1] === "N") return m[2] === "T" ? "Conceptual & Theoretical" : "Imaginative & Reflective";
  return m[2] === "T" ? "Hands-on & Logical" : "Practical & Personal";
}
function teamStyleFor(m: string): string {
  if (m[0] === "E") return m[2] === "F" ? "Collaborative Connector" : "Bold Initiator";
  return m[2] === "F" ? "Supportive Listener" : "Independent Specialist";
}

// ---------- Cognitive ----------
export function scoreCognitive(answers: number[], correctIndexes: number[], mbti: string): CognitiveScore {
  let score = 0;
  for (let i = 0; i < correctIndexes.length; i++) if (answers[i] === correctIndexes[i]) score++;
  const tier =
    score >= 9 ? "Exceptional" :
    score >= 7 ? "Advanced" :
    score >= 5 ? "Competent" :
    score >= 3 ? "Developing" : "Basic";

  // profile derived from MBTI × tier
  let profile: CognitiveScore["profile"];
  if (mbti[1] === "N" && mbti[2] === "T" && score >= 7) profile = "Strategic";
  else if (mbti[1] === "N" && score >= 7) profile = "Innovative";
  else if (mbti[2] === "T" && score >= 5) profile = "Analytical";
  else if (mbti[1] === "N" && mbti[3] === "P") profile = "Research";
  else profile = "Practical";

  return { score, tier, profile };
}

// ---------- Interests ----------
export function scoreInterests(picks: string[][]): { interests: { key: string; weight: number }[] } {
  const counts: Record<string, number> = {};
  for (const arr of picks) for (const k of arr) counts[k] = (counts[k] ?? 0) + 1;
  const max = Math.max(1, ...Object.values(counts));
  const interests = Object.entries(counts)
    .map(([key, c]) => ({ key, weight: c / max }))
    .sort((a, b) => b.weight - a.weight);
  return { interests };
}

// ---------- Matching ----------
export function matchCareers(
  careers: Career[],
  personality: PersonalityScore,
  cognitive: CognitiveScore,
  interests: { key: string; weight: number }[],
): Match[] {
  const interestMap = new Map(interests.map((i) => [i.key, i.weight]));
  return careers
    .map((c) => {
      // personality fit: weighted by trait letter confidence
      let pSum = 0, pCount = 0;
      for (const [letter, weight] of Object.entries(c.required_traits ?? {})) {
        const conf = personality.letters[letter] ?? 0.5;
        pSum += conf * (weight ?? 1);
        pCount += (weight ?? 1);
      }
      const pFit = pCount ? pSum / pCount : 0.5;

      // cognitive fit
      const cogNorm = cognitive.score / 10;
      const profileMatch = c.required_profile?.includes(cognitive.profile) ? 1 : 0.5;
      const cFit = (cogNorm * 0.6) + (profileMatch * 0.4);

      // interest fit
      const req = c.required_interests ?? [];
      const iFit = req.length
        ? req.reduce((s, k) => s + (interestMap.get(k) ?? 0), 0) / req.length
        : 0.5;

      const raw = pFit * 0.4 + cFit * 0.35 + iFit * 0.25;
      // demand multiplier nudge (small)
      const score = Math.round(Math.min(99, raw * 100 + (c.demand_score - 75) * 0.05));
      return { key: c.key, name: c.name, category: c.category, score };
    })
    .sort((a, b) => b.score - a.score);
}

export function matchMajors(
  majors: Major[],
  personality: PersonalityScore,
  cognitive: CognitiveScore,
  interests: { key: string; weight: number }[],
): Match[] {
  const interestMap = new Map(interests.map((i) => [i.key, i.weight]));
  return majors
    .map((m) => {
      let pSum = 0, pCount = 0;
      for (const [letter, weight] of Object.entries(m.required_traits ?? {})) {
        pSum += (personality.letters[letter] ?? 0.5) * (weight ?? 1);
        pCount += (weight ?? 1);
      }
      const pFit = pCount ? pSum / pCount : 0.5;
      const cogNorm = cognitive.score / 10;
      const profileMatch = m.required_profile?.includes(cognitive.profile) ? 1 : 0.5;
      const cFit = cogNorm * 0.6 + profileMatch * 0.4;
      const req = m.required_interests ?? [];
      const iFit = req.length
        ? req.reduce((s, k) => s + (interestMap.get(k) ?? 0), 0) / req.length
        : 0.5;
      const raw = pFit * 0.4 + cFit * 0.35 + iFit * 0.25;
      return { key: m.key, name: m.name, category: m.category, score: Math.round(Math.min(99, raw * 100)) };
    })
    .sort((a, b) => b.score - a.score);
}

// ---------- Strengths / improvements ----------
export function deriveStrengths(p: PersonalityScore, c: CognitiveScore): string[] {
  const out: string[] = [];
  if (c.tier === "Exceptional" || c.tier === "Advanced") out.push("Strong analytical reasoning");
  if (p.mbti[1] === "N") out.push("Big-picture thinking");
  if (p.mbti[2] === "T") out.push("Logical decision-making");
  if (p.mbti[2] === "F") out.push("Emotional intelligence");
  if (p.mbti[3] === "J") out.push("Organized & disciplined");
  if (p.mbti[3] === "P") out.push("Flexible & adaptive");
  if (p.mbti[0] === "E") out.push("Confident communicator");
  if (p.mbti[0] === "I") out.push("Deep focus & introspection");
  return out.slice(0, 6);
}

export function deriveImprovements(p: PersonalityScore, c: CognitiveScore): string[] {
  const out: string[] = [];
  if (c.tier === "Developing" || c.tier === "Basic") out.push("Build problem-solving habits with daily logic puzzles");
  if (p.mbti[0] === "I") out.push("Practice public speaking to amplify ideas");
  if (p.mbti[0] === "E") out.push("Develop deep-work sessions for focus");
  if (p.mbti[3] === "P") out.push("Use structured planning tools");
  if (p.mbti[3] === "J") out.push("Stay open to changing plans when new data arrives");
  out.push("Develop cross-disciplinary skills outside your strength");
  return out.slice(0, 5);
}

export const RECOMMENDED_SKILLS_BY_PROFILE: Record<string, string[]> = {
  Analytical: ["Data analysis", "Statistics", "Critical reasoning", "SQL / Python"],
  Strategic: ["Strategic planning", "Systems thinking", "Negotiation", "Decision frameworks"],
  Practical: ["Project management", "Technical craftsmanship", "Hands-on labs", "Operations"],
  Research: ["Academic writing", "Lab methodology", "Literature review", "Research design"],
  Innovative: ["Design thinking", "Prototyping", "Creative writing", "Public speaking"],
};
