// Lightweight knowledge bases for premium AI-style features (no paid LLM).
// All data is static / derivable so ABBI v1 can render without external APIs.

export type University = {
  name: string;
  country: string;
  city: string;
  minSat: number;
  minIelts: number;
  majors: string[];
  competitiveness: "Reach" | "Match" | "Safety";
  scholarship: string;
  acceptance: number; // %
};

export const UNIVERSITIES: University[] = [
  { name: "Harvard University", country: "USA", city: "Cambridge", minSat: 1500, minIelts: 7.5, majors: ["Computer Science","Business","Psychology","Medicine"], competitiveness: "Reach", scholarship: "Need-based full-ride available", acceptance: 4 },
  { name: "MIT", country: "USA", city: "Cambridge", minSat: 1520, minIelts: 7.0, majors: ["Computer Science","Engineering","Physics","Mathematics"], competitiveness: "Reach", scholarship: "Need-based aid up to 100%", acceptance: 7 },
  { name: "Stanford University", country: "USA", city: "Stanford", minSat: 1500, minIelts: 7.0, majors: ["Computer Science","Business","Engineering","Design"], competitiveness: "Reach", scholarship: "Generous need-based", acceptance: 5 },
  { name: "University of Oxford", country: "UK", city: "Oxford", minSat: 1470, minIelts: 7.5, majors: ["Philosophy","Law","Medicine","Computer Science"], competitiveness: "Reach", scholarship: "Reach Oxford / Clarendon", acceptance: 17 },
  { name: "University of Cambridge", country: "UK", city: "Cambridge", minSat: 1470, minIelts: 7.5, majors: ["Mathematics","Engineering","Natural Sciences","Economics"], competitiveness: "Reach", scholarship: "Gates Cambridge", acceptance: 18 },
  { name: "Imperial College London", country: "UK", city: "London", minSat: 1430, minIelts: 7.0, majors: ["Engineering","Medicine","Computer Science","Business"], competitiveness: "Match", scholarship: "President's Undergraduate", acceptance: 14 },
  { name: "University of Toronto", country: "Canada", city: "Toronto", minSat: 1330, minIelts: 6.5, majors: ["Computer Science","Engineering","Business","Life Sciences"], competitiveness: "Match", scholarship: "Lester B. Pearson (full)", acceptance: 43 },
  { name: "UBC", country: "Canada", city: "Vancouver", minSat: 1300, minIelts: 6.5, majors: ["Computer Science","Forestry","Business","Arts"], competitiveness: "Match", scholarship: "International Major Entrance", acceptance: 52 },
  { name: "NUS", country: "Singapore", city: "Singapore", minSat: 1400, minIelts: 6.5, majors: ["Computer Science","Engineering","Business","Medicine"], competitiveness: "Reach", scholarship: "ASEAN / Science & Tech", acceptance: 5 },
  { name: "ETH Zürich", country: "Switzerland", city: "Zürich", minSat: 1400, minIelts: 7.0, majors: ["Computer Science","Engineering","Physics","Architecture"], competitiveness: "Reach", scholarship: "Excellence Scholarship", acceptance: 27 },
  { name: "TU Munich", country: "Germany", city: "Munich", minSat: 1250, minIelts: 6.5, majors: ["Engineering","Computer Science","Mathematics","Business"], competitiveness: "Match", scholarship: "Deutschlandstipendium", acceptance: 60 },
  { name: "KAIST", country: "South Korea", city: "Daejeon", minSat: 1300, minIelts: 6.5, majors: ["Engineering","Computer Science","Business","Science"], competitiveness: "Match", scholarship: "KAIST International Scholarship", acceptance: 30 },
  { name: "University of Tokyo", country: "Japan", city: "Tokyo", minSat: 1350, minIelts: 7.0, majors: ["Engineering","Science","Economics","Medicine"], competitiveness: "Reach", scholarship: "MEXT scholarship", acceptance: 34 },
  { name: "Sciences Po", country: "France", city: "Paris", minSat: 1300, minIelts: 7.0, majors: ["Political Science","Economics","International Affairs","Law"], competitiveness: "Match", scholarship: "Émile Boutmy", acceptance: 30 },
  { name: "University of Melbourne", country: "Australia", city: "Melbourne", minSat: 1280, minIelts: 6.5, majors: ["Business","Arts","Engineering","Medicine"], competitiveness: "Match", scholarship: "Melbourne International", acceptance: 70 },
  { name: "University of Amsterdam", country: "Netherlands", city: "Amsterdam", minSat: 1200, minIelts: 6.5, majors: ["Psychology","Business","Communication","Computer Science"], competitiveness: "Safety", scholarship: "Amsterdam Merit", acceptance: 78 },
  { name: "Bocconi University", country: "Italy", city: "Milan", minSat: 1300, minIelts: 6.5, majors: ["Business","Economics","Finance","Management"], competitiveness: "Match", scholarship: "Bocconi Merit Award", acceptance: 50 },
  { name: "Westminster International University in Tashkent", country: "Uzbekistan", city: "Tashkent", minSat: 1100, minIelts: 5.5, majors: ["Business","Economics","Law","Computer Science"], competitiveness: "Safety", scholarship: "Rector's Scholarship", acceptance: 80 },
  { name: "Inha University in Tashkent", country: "Uzbekistan", city: "Tashkent", minSat: 1050, minIelts: 5.5, majors: ["Computer Science","Logistics","Business"], competitiveness: "Safety", scholarship: "Academic Excellence", acceptance: 85 },
  { name: "Webster University Tashkent", country: "Uzbekistan", city: "Tashkent", minSat: 1050, minIelts: 5.5, majors: ["Business","Media","Psychology"], competitiveness: "Safety", scholarship: "Webster Global", acceptance: 85 },
];

export const COUNTRIES = Array.from(new Set(UNIVERSITIES.map((u) => u.country))).sort();
export const MAJORS = Array.from(new Set(UNIVERSITIES.flatMap((u) => u.majors))).sort();

/* ─────────────── Mentors ─────────────── */
export type Mentor = {
  name: string;
  profession: string;
  experience: string;
  specialization: string;
  advice: string;
  emoji: string;
  bookingUrl?: string;
};

export const MENTORS: Mentor[] = [
  { name: "Aziz R.", profession: "Senior Software Engineer", experience: "9 years at Google & startups", specialization: "Backend, distributed systems", advice: "Build something every week. Tutorials teach syntax — projects teach engineering.", emoji: "💻" },
  { name: "Dilnoza K.", profession: "Product Designer", experience: "7 years, ex-Figma community lead", specialization: "Design systems & UX research", advice: "Taste compounds. Save what you love, write down why.", emoji: "🎨" },
  { name: "Bekzod T.", profession: "Founder & CEO", experience: "Scaled 2 startups to Series A", specialization: "Strategy, fundraising, GTM", advice: "Talk to 50 users before you write 50 lines of code.", emoji: "🚀" },
  { name: "Madina S.", profession: "Investigative Journalist", experience: "11 years, Reuters & local outlets", specialization: "Long-form reporting & ethics", advice: "Curiosity is your only renewable resource. Spend it.", emoji: "📰" },
  { name: "Dr. Sherzod A.", profession: "Clinical Psychologist", experience: "12 years private practice", specialization: "Cognitive behavioral therapy", advice: "Self-knowledge isn't a luxury — it's career insurance.", emoji: "🧠" },
  { name: "Nigora U.", profession: "Marketing Director", experience: "8 years across B2B & consumer", specialization: "Brand & performance marketing", advice: "Great marketing is a great product, told honestly.", emoji: "📣" },
  { name: "Dr. Jasur M.", profession: "Cardiologist", experience: "15 years, university hospital", specialization: "Preventive cardiology", advice: "Medicine rewards patience. Pick your subspecialty for the next 30 years, not 3.", emoji: "🩺" },
  { name: "Lola I.", profession: "Data Scientist", experience: "6 years at a fintech", specialization: "ML pipelines & analytics", advice: "Statistics first, frameworks later. Tools change every 18 months.", emoji: "📊" },
];

/* ─────────────── Career Battles ─────────────── */
export type CareerSpec = {
  name: string;
  salary: string;          // entry → senior
  skills: string[];
  education: string;
  demand: number;          // 0-100
  personality: string;     // MBTI-ish
  emoji: string;
};

export const CAREER_SPECS: Record<string, CareerSpec> = {
  "Software Engineer": { name: "Software Engineer", salary: "$70k → $250k", skills: ["Programming","System design","Problem solving","Collaboration"], education: "BS Computer Science or equivalent", demand: 95, personality: "INTJ / INTP", emoji: "💻" },
  "Data Scientist":    { name: "Data Scientist",    salary: "$80k → $230k", skills: ["Statistics","Python","ML","Communication"], education: "BS Math/CS, often MS", demand: 90, personality: "INTP / ISTJ", emoji: "📊" },
  "Journalist":        { name: "Journalist",        salary: "$35k → $120k", skills: ["Writing","Interviewing","Research","Ethics"], education: "BA Journalism / English", demand: 55, personality: "ENFP / ENTP", emoji: "📰" },
  "Marketing Specialist":{ name: "Marketing Specialist", salary: "$45k → $160k", skills: ["Copywriting","Analytics","Creativity","Strategy"], education: "BA Marketing / any field", demand: 75, personality: "ENFP / ENTJ", emoji: "📣" },
  "Doctor":            { name: "Doctor",            salary: "$200k → $500k+", skills: ["Diagnosis","Empathy","Endurance","Lifelong learning"], education: "MD + residency (10+ yrs)", demand: 88, personality: "ISTJ / ISFJ", emoji: "🩺" },
  "Psychologist":      { name: "Psychologist",      salary: "$60k → $180k", skills: ["Active listening","Empathy","Research","Patience"], education: "MS/PsyD Psychology", demand: 72, personality: "INFJ / INFP", emoji: "🧠" },
};

export const CAREER_BATTLES: { a: string; b: string }[] = [
  { a: "Software Engineer", b: "Data Scientist" },
  { a: "Journalist", b: "Marketing Specialist" },
  { a: "Doctor", b: "Psychologist" },
];

/* ─────────────── Success Stories ─────────────── */
export type SuccessStory = {
  name: string;
  initials: string;
  title: string;
  badge: string;
  story: string;
};

export const SUCCESS_STORIES: SuccessStory[] = [
  { name: "Aziza N.", initials: "AN", title: "From INFP to product designer at a Y-Combinator startup", badge: "Roadmap Mastery", story: "I took the assessment expecting nothing. ABBI matched me to Product Design — a field I'd dismissed. Six months and one community later, I landed my first design role." },
  { name: "Bobur K.", initials: "BK", title: "SAT 1490 → MIT-style scholarship at a top tech university", badge: "University Unlocked", story: "The University Explorer surfaced schools I hadn't considered. The Roadmap kept me accountable through SAT prep. Today I'm a CS freshman on a full ride." },
  { name: "Sevara M.", initials: "SM", title: "Built a mental-health newsletter with 4k subscribers", badge: "Creative Force", story: "The Community gave me my first 50 readers. Weekly ABBI reports kept me consistent. Now my newsletter pays my rent." },
  { name: "Jasur T.", initials: "JT", title: "From confused engineer to backend lead in 18 months", badge: "Skill Mastery", story: "Skill levels gave me a map. I focused on Logic + Technical, leveled up week after week, and got promoted ahead of schedule." },
];

/* ─────────────── Skill Levels (derived) ─────────────── */
export type SkillKey =
  | "leadership" | "communication" | "logic" | "creativity"
  | "discipline" | "emotional" | "technical";

export type SkillSnapshot = {
  key: SkillKey;
  label: string;
  emoji: string;
  xp: number;       // accumulated
  level: number;
  perLevel: number; // xp needed for one level
  progress: number; // 0-100 to next level
};

const SKILL_META: { key: SkillKey; label: string; emoji: string; perLevel: number }[] = [
  { key: "leadership",   label: "Leadership",            emoji: "👑", perLevel: 120 },
  { key: "communication",label: "Communication",         emoji: "💬", perLevel: 100 },
  { key: "logic",        label: "Logic",                 emoji: "🧮", perLevel: 110 },
  { key: "creativity",   label: "Creativity",            emoji: "🎨", perLevel: 110 },
  { key: "discipline",   label: "Discipline",            emoji: "🔥", perLevel: 100 },
  { key: "emotional",    label: "Emotional Intelligence",emoji: "❤️", perLevel: 120 },
  { key: "technical",    label: "Technical Thinking",    emoji: "⚙️", perLevel: 130 },
];

export function deriveSkillSnapshots(input: {
  lifetimeEarned: number;
  assessmentsCompleted: number;
  unlocksCount: number;
  streakDays: number;
  stats?: Partial<{
    leadership_level: number; communication_score: number; creativity_score: number;
    emotional_intelligence: number; productivity_level: number;
  }> | null;
}): SkillSnapshot[] {
  const base = Math.floor(input.lifetimeEarned * 0.6);
  const aBoost = input.assessmentsCompleted * 40;
  const uBoost = input.unlocksCount * 25;
  const sBoost = input.streakDays * 8;
  const s = input.stats ?? {};

  const xpFor: Record<SkillKey, number> = {
    leadership:    base + aBoost + (s.leadership_level ?? 0) * 4,
    communication: base + aBoost + (s.communication_score ?? 0) * 4,
    logic:         base + aBoost * 1.3 + uBoost,
    creativity:    base + (s.creativity_score ?? 0) * 4 + uBoost,
    discipline:    base + sBoost + (s.productivity_level ?? 0) * 4,
    emotional:     base + (s.emotional_intelligence ?? 0) * 4,
    technical:     base + uBoost * 1.5 + aBoost,
  };

  return SKILL_META.map((m) => {
    const xp = Math.max(0, Math.floor(xpFor[m.key]));
    const level = Math.floor(xp / m.perLevel) + 1;
    const inLevel = xp % m.perLevel;
    const progress = Math.round((inLevel / m.perLevel) * 100);
    return { ...m, xp, level, progress };
  });
}

/* ─────────────── Weekly Report ─────────────── */
export type WeeklyReport = {
  week: string;
  improvements: { label: string; delta: number }[]; // pct deltas
  tasksCompleted: number;
  roadmapProgress: number;
  auraEarned: number;
  suggestions: string[];
};

export function deriveWeeklyReport(input: {
  lifetimeEarned: number;
  streakDays: number;
  assessmentsCompleted: number;
  unlocksCount: number;
  mbti?: string | null;
}): WeeklyReport {
  // Deterministic pseudo-random based on lifetime so it changes as user grows.
  const seed = input.lifetimeEarned + input.streakDays * 7 + input.assessmentsCompleted * 11;
  const pick = (i: number, min: number, max: number) =>
    min + ((seed * (i + 3)) % (max - min + 1));

  const improvements = [
    { label: "Communication", delta: pick(0, 1, 6) },
    { label: "Leadership",    delta: pick(1, 1, 5) },
    { label: "Logic",         delta: pick(2, 2, 7) },
    { label: "Creativity",    delta: pick(3, 1, 5) },
    { label: "Discipline",    delta: pick(4, 1, 6) },
  ];

  const suggestions: string[] = [];
  if (input.streakDays < 3) suggestions.push("Log in 3 days in a row to lock in a streak bonus.");
  if (input.assessmentsCompleted === 0) suggestions.push("Take your first assessment to unlock personalized skill XP.");
  if (input.unlocksCount === 0) suggestions.push("Spend some Aura on a premium feature to accelerate growth.");
  suggestions.push("Drop a thought in your Community — peer feedback boosts EQ.");
  if (input.mbti?.includes("I")) suggestions.push("Try one outbound social action this week (DM, comment, intro).");
  else suggestions.push("Schedule one deep focus block (90 min, no notifications).");

  const today = new Date();
  const week = `Week of ${new Date(today.getTime() - today.getDay() * 86400000).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;

  return {
    week,
    improvements,
    tasksCompleted: Math.max(0, input.assessmentsCompleted + input.unlocksCount + Math.floor(input.streakDays / 2)),
    roadmapProgress: Math.min(100, input.unlocksCount * 15 + input.assessmentsCompleted * 10),
    auraEarned: Math.max(0, Math.floor(input.lifetimeEarned / 7)),
    suggestions: suggestions.slice(0, 4),
  };
}
