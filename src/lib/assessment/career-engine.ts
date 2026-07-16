// Career matching engine — runs server-side inside the submit fn.
// Formula: 40% personality fit + 35% cognitive fit + 25% interest fit.

import { INTEREST_KEYS, RIASEC_DIMS, type PersonalityQ, type RiasecDim } from "./career-assessment";

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
export function scorePersonality(answers: number[], questions: PersonalityQ[]): PersonalityScore {
  const sums = { EI: 0, SN: 0, TF: 0, JP: 0 };
  questions.forEach((q, i) => {
    const v = (answers[i] ?? 3) - 3; // -2..+2
    sums[q.axis] += v * q.direction;
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
// The projective interest test yields, per answered question, a RIASEC
// orientation vector (from the chosen symbol/shape/animal). We aggregate those
// into one profile and project it onto concrete field interests.
export type RiasecProfile = Record<RiasecDim, number>;

// Each field interest expressed as a blend of the six RIASEC orientations
// (O*NET/Holland-style). These weights are the bridge between "you were drawn
// to a squiggle" and "design / arts rank high for you". Keys must stay within
// INTEREST_KEYS so downstream career/major matching keeps working.
export const DOMAIN_RIASEC: Record<string, Partial<Record<RiasecDim, number>>> = {
  technology:       { I: 3, R: 2, C: 1 },
  engineering:      { R: 3, I: 2, C: 1 },
  science:          { I: 3, R: 1 },
  healthcare:       { S: 3, I: 2, R: 1 },
  business:         { E: 3, C: 2 },
  finance:          { C: 3, E: 2, I: 1 },
  entrepreneurship: { E: 3, A: 1, R: 1 },
  marketing:        { E: 3, A: 2, S: 1 },
  design:           { A: 3, R: 1 },
  arts:             { A: 3, S: 1 },
  journalism:       { A: 2, S: 2, E: 1, I: 1 },
  law:              { E: 2, I: 2, C: 1, S: 1 },
  politics:         { E: 3, S: 2 },
  education:        { S: 3, A: 1 },
  psychology:       { S: 3, I: 2, A: 1 },
  sports:           { R: 3, E: 1, S: 1 },
  architecture:     { A: 2, R: 2, I: 1 },
  environment:      { R: 2, I: 2, S: 1 },
};

const ZERO_PROFILE = (): RiasecProfile => ({ R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 });

/** Unit-normalize a (possibly sparse) RIASEC vector so magnitudes don't skew similarity. */
function unit(v: Partial<Record<RiasecDim, number>>): RiasecProfile {
  const p = ZERO_PROFILE();
  let mag = 0;
  for (const d of RIASEC_DIMS) { p[d] = v[d] ?? 0; mag += p[d] * p[d]; }
  mag = Math.sqrt(mag);
  if (mag > 0) for (const d of RIASEC_DIMS) p[d] /= mag;
  return p;
}

/**
 * Aggregate the RIASEC vectors from the user's chosen symbols and project the
 * result onto the 18 field interests via cosine similarity. Weights are scaled
 * so the strongest field is 1.0 — matching the previous engine's contract, so
 * matchCareers/matchMajors and the results UI are unaffected.
 */
export function scoreInterests(
  picks: Partial<Record<RiasecDim, number>>[],
): { interests: { key: string; weight: number }[]; riasec: RiasecProfile } {
  const sum = ZERO_PROFILE();
  for (const v of picks) for (const d of RIASEC_DIMS) sum[d] += v[d] ?? 0;

  const userUnit = unit(sum);
  const hasSignal = RIASEC_DIMS.some((d) => sum[d] > 0);

  const raw = INTEREST_KEYS.map((key) => {
    const dv = unit(DOMAIN_RIASEC[key] ?? {});
    let dot = 0;
    for (const d of RIASEC_DIMS) dot += userUnit[d] * dv[d];
    return { key, score: Math.max(0, dot) };
  });

  // Sharpen: cosine scores cluster high because the fields share RIASEC
  // dimensions, which makes everything look similar. Rescale across this
  // profile's own min/max and apply a gamma curve so the fields you actually
  // lean toward stand out and the rest fall toward zero. Ranking is preserved
  // (the transform is monotonic), so career/major matching stays consistent.
  const scores = raw.map((r) => r.score);
  const hi = Math.max(...scores);
  const lo = Math.min(...scores);
  const span = hi - lo;
  const GAMMA = 1.6;
  const interests = raw
    .map((r) => {
      let weight = 0;
      if (hasSignal && span > 1e-6) weight = Math.pow((r.score - lo) / span, GAMMA);
      else if (hasSignal && hi > 0) weight = r.score / hi;
      return { key: r.key, weight };
    })
    .sort((a, b) => b.weight - a.weight);

  // Normalized 0..1 profile (relative to its own strongest dimension), handy
  // for surfacing a RIASEC archetype label alongside the field interests.
  const maxDim = Math.max(...RIASEC_DIMS.map((d) => sum[d]));
  const riasec = ZERO_PROFILE();
  if (maxDim > 0) for (const d of RIASEC_DIMS) riasec[d] = sum[d] / maxDim;

  return { interests, riasec };
}

/**
 * Approximate the user's RIASEC profile from their (persisted) field-interest
 * weights, by summing each field's RIASEC signature weighted by how strongly
 * the user scored it. Lets the results page surface a Holland profile without
 * needing a separate stored column.
 */
export function deriveRiasecFromInterests(
  interests: { key: string; weight: number }[],
): RiasecProfile {
  const sum = ZERO_PROFILE();
  for (const { key, weight } of interests) {
    const dv = DOMAIN_RIASEC[key];
    if (!dv) continue;
    for (const d of RIASEC_DIMS) sum[d] += (dv[d] ?? 0) * weight;
  }
  const mx = Math.max(...RIASEC_DIMS.map((d) => sum[d]));
  const p = ZERO_PROFILE();
  if (mx > 0) for (const d of RIASEC_DIMS) p[d] = sum[d] / mx;
  return p;
}

/** Holland code: the user's top-3 RIASEC dimensions, strongest first. */
export function hollandCode(p: RiasecProfile): RiasecDim[] {
  return [...RIASEC_DIMS].sort((a, b) => p[b] - p[a]).slice(0, 3);
}

// ---------- Matching ----------
export type CareerMatch = Match & { matchFields: string[] };

export function matchCareers(
  careers: Career[],
  personality: PersonalityScore,
  cognitive: CognitiveScore,
  interests: { key: string; weight: number }[],
): CareerMatch[] {
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
      // The field interests this career needs that the user actually leans
      // toward (top few) — powers a concrete "why this fits" on the results page.
      const matchFields = req
        .map((k) => ({ k, w: interestMap.get(k) ?? 0 }))
        .filter((x) => x.w > 0.15)
        .sort((a, b) => b.w - a.w)
        .slice(0, 3)
        .map((x) => x.k);
      return { key: c.key, name: c.name, category: c.category, score, matchFields };
    })
    .sort((a, b) => b.score - a.score);
}

/**
 * For each career match, pick the best major to study: among majors whose
 * related_career_keys include the career, choose the one the user scores
 * highest on (so the recommendation is personalized, not just a static link).
 */
export function attachMajorsToCareers<T extends Match>(
  careerMatches: T[],
  majors: Major[],
  majorScores: Match[],
): (T & { major: string | null })[] {
  const scoreByKey = new Map(majorScores.map((m) => [m.key, m.score]));
  return careerMatches.map((c) => {
    let best: Major | null = null;
    let bestScore = -1;
    for (const m of majors) {
      if (!m.related_career_keys?.includes(c.key)) continue;
      const s = scoreByKey.get(m.key) ?? 0;
      if (s > bestScore) { best = m; bestScore = s; }
    }
    return { ...c, major: best?.name ?? null };
  });
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

// ---------- Community routing ----------
// A user's #1 career match decides which community they auto-join. Categories
// map most of the 166 careers to a matching community; a few specific careers
// override the category where a more precise community exists (e.g. a Data
// Scientist joins Data Science rather than the generic Technology community).
// Slugs must exist in the `communities` table; unmapped fields fall back to
// the "general" community.
const CAREER_COMMUNITY_OVERRIDES: Record<string, string> = {
  data_scientist: "data-science",
  data_engineer: "data-analytics",
  statistician: "data-analytics",
  cybersecurity: "cybersecurity",
  product_manager: "product-management",
  pr_specialist: "public-relations",
  graphic_designer: "creative",
  illustrator: "creative",
  animator: "creative",
};

const CATEGORY_COMMUNITY: Record<string, string> = {
  Technology: "software-engineering",
  Engineering: "engineering",
  Architecture: "design",
  Healthcare: "medicine",
  Science: "science",
  Psychology: "psychology",
  "Social Sciences": "psychology",
  Business: "business-analysis",
  Finance: "finance",
  Entrepreneurship: "entrepreneurship",
  Marketing: "marketing",
  Media: "journalism",
  Arts: "creative",
  Design: "design",
  Education: "education",
  Law: "law",
  Government: "law",
};

/** Community slug for a user's top career match. Falls back to "general". */
export function communitySlugForCareer(
  match: { key?: string | null; category?: string | null } | null | undefined,
): string {
  if (!match) return "general";
  return (
    (match.key ? CAREER_COMMUNITY_OVERRIDES[match.key] : undefined) ??
    (match.category ? CATEGORY_COMMUNITY[match.category] : undefined) ??
    "general"
  );
}
