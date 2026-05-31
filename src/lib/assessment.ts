// Full assessment: IQ (10) + Interests (10) + MBTI (10) + career matching

export type Section = "iq" | "interests" | "mbti";

export type IQQuestion = {
  id: string;
  section: "iq";
  category: "logical" | "analytical" | "pattern";
  prompt: string;
  hint?: string;
  options: string[];
  answer: number;
};

export type InterestTrait =
  | "creativity" | "leadership" | "communication" | "technical"
  | "business" | "teamwork" | "curiosity" | "organization"
  | "eq" | "analytical";

export type InterestQuestion = {
  id: string;
  section: "interests";
  prompt: string;
  options: { label: string; traits: Partial<Record<InterestTrait, number>> }[];
};

export type MbtiAxis = "EI" | "SN" | "TF" | "JP";
export type MbtiQuestion = {
  id: string;
  section: "mbti";
  prompt: string;
  axis: MbtiAxis;
  // option index -> letter contribution
  options: { label: string; letter: "E" | "I" | "S" | "N" | "T" | "F" | "J" | "P" }[];
};

export type AnyQuestion = IQQuestion | InterestQuestion | MbtiQuestion;

// ---------------- IQ ----------------
export const iqQuestions: IQQuestion[] = [
  { id: "iq1", section: "iq", category: "pattern", prompt: "What number comes next in the sequence?", hint: "2, 4, 8, 16, 32, ?", options: ["48", "60", "64", "72"], answer: 2 },
  { id: "iq2", section: "iq", category: "logical", prompt: "All Bloops are Razzies. All Razzies are Lazzies. So all Bloops are…", options: ["Razzies only", "Lazzies only", "Both Razzies and Lazzies", "Neither"], answer: 2 },
  { id: "iq3", section: "iq", category: "analytical", prompt: "A train travels 60 km in 45 minutes. Speed in km/h?", options: ["60", "75", "80", "90"], answer: 2 },
  { id: "iq4", section: "iq", category: "pattern", prompt: "Find the missing number:", hint: "1, 1, 2, 3, 5, 8, ?, 21", options: ["11", "12", "13", "14"], answer: 2 },
  { id: "iq5", section: "iq", category: "logical", prompt: "Which word does NOT belong?", options: ["Apple", "Orange", "Banana", "Carrot"], answer: 3 },
  { id: "iq6", section: "iq", category: "analytical", prompt: "If 5 machines make 5 widgets in 5 minutes, how long do 100 machines take to make 100 widgets?", options: ["1 minute", "5 minutes", "20 minutes", "100 minutes"], answer: 1 },
  { id: "iq7", section: "iq", category: "pattern", prompt: "Complete the pattern:", hint: "△ ▲ △ ▲ △ ?", options: ["△", "▲", "○", "■"], answer: 1 },
  { id: "iq8", section: "iq", category: "logical", prompt: "Book is to Reading as Fork is to:", options: ["Drawing", "Writing", "Eating", "Stirring"], answer: 2 },
  { id: "iq9", section: "iq", category: "analytical", prompt: "What is the next prime number after 23?", options: ["25", "27", "29", "31"], answer: 2 },
  { id: "iq10", section: "iq", category: "pattern", prompt: "Which number completes the sequence?", hint: "3, 6, 12, 24, 48, ?", options: ["72", "84", "96", "108"], answer: 2 },
];

// ---------------- Interests ----------------
const t = (o: Partial<Record<InterestTrait, number>>) => o;
export const interestQuestions: InterestQuestion[] = [
  { id: "in1", section: "interests", prompt: "Do you enjoy leading group projects?", options: [
    { label: "Absolutely, I take charge naturally", traits: t({ leadership: 3, communication: 2 }) },
    { label: "Sometimes, when needed", traits: t({ leadership: 1, teamwork: 2 }) },
    { label: "I prefer contributing as a team member", traits: t({ teamwork: 3, eq: 1 }) },
    { label: "I'd rather work independently", traits: t({ analytical: 2, technical: 2 }) },
  ]},
  { id: "in2", section: "interests", prompt: "Would you rather design something or analyze data?", options: [
    { label: "Design — visual and expressive", traits: t({ creativity: 3 }) },
    { label: "Analyze — patterns and numbers", traits: t({ analytical: 3, technical: 2 }) },
    { label: "Both — depending on the project", traits: t({ creativity: 1, analytical: 1, curiosity: 1 }) },
    { label: "Neither — I prefer working with people", traits: t({ communication: 3, eq: 2 }) },
  ]},
  { id: "in3", section: "interests", prompt: "Do you prefer working with people or systems?", options: [
    { label: "People — conversations energize me", traits: t({ communication: 3, eq: 2 }) },
    { label: "Systems — logic and structure", traits: t({ technical: 3, analytical: 2 }) },
    { label: "A mix of both", traits: t({ teamwork: 2, organization: 1 }) },
    { label: "Ideas — abstract thinking", traits: t({ curiosity: 3, creativity: 2 }) },
  ]},
  { id: "in4", section: "interests", prompt: "How do you feel about presenting in front of an audience?", options: [
    { label: "I love the spotlight", traits: t({ communication: 3, leadership: 2 }) },
    { label: "Confident with preparation", traits: t({ organization: 2, communication: 1 }) },
    { label: "Nervous but doable", traits: t({ eq: 1 }) },
    { label: "I avoid it whenever possible", traits: t({ technical: 2, analytical: 1 }) },
  ]},
  { id: "in5", section: "interests", prompt: "When you see a complex problem, your first instinct is to…", options: [
    { label: "Brainstorm creative angles", traits: t({ creativity: 3, curiosity: 2 }) },
    { label: "Break it into logical steps", traits: t({ analytical: 3, organization: 2 }) },
    { label: "Discuss it with others", traits: t({ communication: 2, teamwork: 2 }) },
    { label: "Build a prototype and iterate", traits: t({ technical: 3, curiosity: 1 }) },
  ]},
  { id: "in6", section: "interests", prompt: "Money or meaning — what motivates you more?", options: [
    { label: "Building something profitable", traits: t({ business: 3, leadership: 2 }) },
    { label: "Making a real impact on people", traits: t({ eq: 3, communication: 1 }) },
    { label: "Mastering a craft", traits: t({ technical: 2, creativity: 2 }) },
    { label: "Discovering new ideas", traits: t({ curiosity: 3, analytical: 1 }) },
  ]},
  { id: "in7", section: "interests", prompt: "How organized is your workspace?", options: [
    { label: "Spotless — everything has its place", traits: t({ organization: 3 }) },
    { label: "Tidy enough", traits: t({ organization: 2, teamwork: 1 }) },
    { label: "Creative chaos", traits: t({ creativity: 3, curiosity: 1 }) },
    { label: "I work mostly digital", traits: t({ technical: 2 }) },
  ]},
  { id: "in8", section: "interests", prompt: "Which class would you choose?", options: [
    { label: "Art / Design", traits: t({ creativity: 3 }) },
    { label: "Computer Science", traits: t({ technical: 3, analytical: 2 }) },
    { label: "Psychology", traits: t({ eq: 3, curiosity: 1 }) },
    { label: "Business & Economics", traits: t({ business: 3, leadership: 1 }) },
  ]},
  { id: "in9", section: "interests", prompt: "When a friend has a hard day, you usually…", options: [
    { label: "Listen carefully and empathize", traits: t({ eq: 3, communication: 1 }) },
    { label: "Offer practical solutions", traits: t({ analytical: 2, leadership: 1 }) },
    { label: "Distract them with fun plans", traits: t({ creativity: 2, communication: 1 }) },
    { label: "Give them space", traits: t({ organization: 1 }) },
  ]},
  { id: "in10", section: "interests", prompt: "What's your dream side project?", options: [
    { label: "Launching a startup", traits: t({ business: 3, leadership: 2 }) },
    { label: "Building an app or game", traits: t({ technical: 3, creativity: 1 }) },
    { label: "Writing, film, or art", traits: t({ creativity: 3, communication: 1 }) },
    { label: "Researching something new", traits: t({ curiosity: 3, analytical: 2 }) },
  ]},
];

// ---------------- MBTI ----------------
export const mbtiQuestions: MbtiQuestion[] = [
  { id: "mb1", section: "mbti", axis: "EI", prompt: "Do social gatherings energize you?", options: [
    { label: "Yes, I feel recharged after them", letter: "E" },
    { label: "No, I need quiet time to recharge", letter: "I" },
  ]},
  { id: "mb2", section: "mbti", axis: "EI", prompt: "At a party you usually…", options: [
    { label: "Meet many new people", letter: "E" },
    { label: "Talk deeply with a few", letter: "I" },
  ]},
  { id: "mb3", section: "mbti", axis: "EI", prompt: "Working from home long-term sounds…", options: [
    { label: "Isolating — I miss people", letter: "E" },
    { label: "Ideal — fewer distractions", letter: "I" },
  ]},
  { id: "mb4", section: "mbti", axis: "SN", prompt: "You're drawn more to…", options: [
    { label: "Concrete facts and details", letter: "S" },
    { label: "Patterns and possibilities", letter: "N" },
  ]},
  { id: "mb5", section: "mbti", axis: "SN", prompt: "When learning something new you prefer…", options: [
    { label: "Step-by-step instructions", letter: "S" },
    { label: "Big-picture concepts first", letter: "N" },
  ]},
  { id: "mb6", section: "mbti", axis: "TF", prompt: "Do you make decisions based more on logic or feelings?", options: [
    { label: "Logic and objective analysis", letter: "T" },
    { label: "Values and how people feel", letter: "F" },
  ]},
  { id: "mb7", section: "mbti", axis: "TF", prompt: "Giving feedback, you tend to be…", options: [
    { label: "Direct and honest", letter: "T" },
    { label: "Gentle and supportive", letter: "F" },
  ]},
  { id: "mb8", section: "mbti", axis: "JP", prompt: "Do you prefer planning or spontaneity?", options: [
    { label: "Planning — I love a clear schedule", letter: "J" },
    { label: "Spontaneity — I go with the flow", letter: "P" },
  ]},
  { id: "mb9", section: "mbti", axis: "JP", prompt: "Your to-do list looks like…", options: [
    { label: "Neatly organized and prioritized", letter: "J" },
    { label: "Loose — I adapt as the day goes", letter: "P" },
  ]},
  { id: "mb10", section: "mbti", axis: "EI", prompt: "In meetings you usually…", options: [
    { label: "Speak up and think out loud", letter: "E" },
    { label: "Listen first, share later", letter: "I" },
  ]},
];

export const allQuestions: AnyQuestion[] = [
  ...iqQuestions,
  ...interestQuestions,
  ...mbtiQuestions,
];

// ---------------- Scoring ----------------
export type ScoredResult = {
  iq: { score: number; level: string; logical: number; analytical: number; pattern: number; correct: number };
  mbti: { type: string; scores: Record<"E"|"I"|"S"|"N"|"T"|"F"|"J"|"P", number> };
  interests: Record<InterestTrait, number>;
  strengths: string[];
  weaknesses: string[];
  careers: { name: string; match: number; reason: string }[];
};

const TRAIT_LABEL: Record<InterestTrait, string> = {
  creativity: "Creativity",
  leadership: "Leadership",
  communication: "Communication",
  technical: "Technical Thinking",
  business: "Business Mindset",
  teamwork: "Teamwork",
  curiosity: "Curiosity",
  organization: "Organization",
  eq: "Emotional Intelligence",
  analytical: "Analytical Thinking",
};

type CareerDef = {
  name: string;
  traits: Partial<Record<InterestTrait, number>>;
  mbti?: Partial<Record<"E"|"I"|"S"|"N"|"T"|"F"|"J"|"P", number>>;
  iqWeight?: number; // 0..1 how much IQ matters (default 0.4)
  reason: string;
};

const CAREERS: CareerDef[] = [
  { name: "Software Engineer", traits: { technical: 3, analytical: 3, curiosity: 2 }, mbti: { I: 1, N: 1, T: 2 }, iqWeight: 0.6, reason: "Strong analytical and technical skills, comfortable with deep focus." },
  { name: "Data Analyst", traits: { analytical: 3, technical: 2, organization: 2 }, mbti: { I: 1, T: 2, J: 1 }, iqWeight: 0.6, reason: "Loves patterns, numbers, and structured problem solving." },
  { name: "Research Scientist", traits: { curiosity: 3, analytical: 3, technical: 2 }, mbti: { I: 1, N: 2, T: 1 }, iqWeight: 0.7, reason: "Deeply curious mind drawn to investigation and analysis." },
  { name: "UX / Product Designer", traits: { creativity: 3, eq: 2, technical: 1, communication: 1 }, mbti: { N: 2, F: 1 }, iqWeight: 0.3, reason: "Creative thinker who designs experiences for real humans." },
  { name: "Graphic Designer", traits: { creativity: 3, organization: 1 }, mbti: { N: 1, F: 1, P: 1 }, iqWeight: 0.2, reason: "Visual storyteller with a strong creative instinct." },
  { name: "Journalist", traits: { communication: 3, curiosity: 3, creativity: 1 }, mbti: { E: 2, N: 1 }, iqWeight: 0.3, reason: "Curious, communicative, energized by people and stories." },
  { name: "Marketing Manager", traits: { communication: 3, business: 2, creativity: 2, leadership: 2 }, mbti: { E: 2, N: 1 }, iqWeight: 0.3, reason: "Blends creative storytelling with business outcomes." },
  { name: "Public Relations Specialist", traits: { communication: 3, eq: 2, organization: 2 }, mbti: { E: 2, F: 1, J: 1 }, iqWeight: 0.2, reason: "Strong people skills and a knack for messaging." },
  { name: "Entrepreneur / Startup Founder", traits: { business: 3, leadership: 3, curiosity: 2, creativity: 1 }, mbti: { E: 1, N: 1, J: 1 }, iqWeight: 0.4, reason: "Driven, visionary, and comfortable leading through ambiguity." },
  { name: "Product Manager", traits: { leadership: 2, communication: 2, analytical: 2, business: 2, organization: 2 }, mbti: { N: 1, T: 1, J: 1 }, iqWeight: 0.4, reason: "Strategic thinker who connects users, business, and engineering." },
  { name: "Teacher / Educator", traits: { communication: 3, eq: 3, organization: 2 }, mbti: { F: 2, J: 1 }, iqWeight: 0.2, reason: "Empathetic communicator who loves helping others grow." },
  { name: "Psychologist", traits: { eq: 3, communication: 2, curiosity: 2, analytical: 1 }, mbti: { I: 1, N: 1, F: 2 }, iqWeight: 0.4, reason: "Deeply attuned to people and motivated to understand the mind." },
  { name: "Content Creator", traits: { creativity: 3, communication: 2, curiosity: 1 }, mbti: { E: 1, N: 1, P: 1 }, iqWeight: 0.2, reason: "Creative voice with a natural pull toward expression." },
  { name: "Civil Engineer / Architect", traits: { technical: 2, creativity: 2, organization: 3, analytical: 2 }, mbti: { S: 1, T: 1, J: 1 }, iqWeight: 0.5, reason: "Structured builder who balances aesthetics and function." },
  { name: "Financial Analyst", traits: { analytical: 3, business: 3, organization: 2 }, mbti: { T: 2, J: 1 }, iqWeight: 0.5, reason: "Numbers-driven and detail-oriented in business contexts." },
  { name: "Doctor / Healthcare Professional", traits: { eq: 2, analytical: 2, organization: 2, communication: 1 }, mbti: { S: 1, J: 1 }, iqWeight: 0.6, reason: "Methodical care combined with strong human awareness." },
  { name: "Lawyer", traits: { analytical: 2, communication: 3, organization: 2 }, mbti: { T: 2, J: 1 }, iqWeight: 0.5, reason: "Sharp arguer who thrives on logic and language." },
  { name: "Operations Manager", traits: { leadership: 2, organization: 3, business: 2, teamwork: 2 }, mbti: { J: 2, T: 1 }, iqWeight: 0.3, reason: "Brings order to teams and processes at scale." },
];

const sectionFor = (id: string): Section =>
  id.startsWith("iq") ? "iq" : id.startsWith("in") ? "interests" : "mbti";

export function scoreAssessment(answers: Record<string, number>): ScoredResult {
  // IQ
  let log = [0, 0], ana = [0, 0], pat = [0, 0];
  iqQuestions.forEach((q) => {
    const got = answers[q.id] === q.answer;
    if (q.category === "logical") { log[1]++; if (got) log[0]++; }
    if (q.category === "analytical") { ana[1]++; if (got) ana[0]++; }
    if (q.category === "pattern") { pat[1]++; if (got) pat[0]++; }
  });
  const correct = log[0] + ana[0] + pat[0];
  const iqScore = Math.round(70 + (correct / iqQuestions.length) * 80);
  const iqLevel =
    iqScore >= 140 ? "Gifted" :
    iqScore >= 125 ? "Highly Intelligent" :
    iqScore >= 110 ? "Above Average" :
    iqScore >= 90  ? "Average" : "Developing";
  const pct = (c: number, t: number) => (t === 0 ? 0 : Math.round((c / t) * 100));

  // Interests
  const interests: Record<InterestTrait, number> = {
    creativity: 0, leadership: 0, communication: 0, technical: 0,
    business: 0, teamwork: 0, curiosity: 0, organization: 0,
    eq: 0, analytical: 0,
  };
  interestQuestions.forEach((q) => {
    const idx = answers[q.id];
    if (idx == null) return;
    const opt = q.options[idx];
    Object.entries(opt.traits).forEach(([k, v]) => {
      interests[k as InterestTrait] += v as number;
    });
  });
  // analytical also boosted by IQ analytical/logical performance
  interests.analytical += Math.round((log[0] + ana[0]) * 0.7);

  // normalize interests to 0-100
  const maxInterest = Math.max(1, ...Object.values(interests));
  const interestsPct: Record<InterestTrait, number> = { ...interests };
  (Object.keys(interestsPct) as InterestTrait[]).forEach((k) => {
    interestsPct[k] = Math.round((interests[k] / maxInterest) * 100);
  });

  // MBTI
  const mScores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
  mbtiQuestions.forEach((q) => {
    const idx = answers[q.id];
    if (idx == null) return;
    mScores[q.options[idx].letter]++;
  });
  // Ensure SN/TF/JP have at least one tie-break — default to N/F/P when zero
  const type =
    (mScores.E >= mScores.I ? "E" : "I") +
    (mScores.S > mScores.N ? "S" : "N") +
    (mScores.T > mScores.F ? "T" : "F") +
    (mScores.J > mScores.P ? "J" : "P");

  // Strengths / weaknesses
  const sortedTraits = (Object.keys(interestsPct) as InterestTrait[])
    .sort((a, b) => interestsPct[b] - interestsPct[a]);
  const strengths = sortedTraits.slice(0, 4).map((k) => TRAIT_LABEL[k]);
  const weaknesses = sortedTraits.slice(-3).reverse().map((k) => TRAIT_LABEL[k]);

  // Careers scoring
  const iqNorm = Math.min(1, Math.max(0, (iqScore - 70) / 80)); // 0..1
  const ranked = CAREERS.map((c) => {
    let traitSum = 0, traitMax = 0;
    Object.entries(c.traits).forEach(([k, w]) => {
      const weight = w as number;
      traitMax += weight * 3; // each option contributes up to ~3
      traitSum += Math.min(weight * 3, (interests[k as InterestTrait] || 0) * weight / 2);
    });
    const traitScore = traitMax === 0 ? 0 : traitSum / traitMax;

    let mbtiBonus = 0, mbtiMax = 0;
    Object.entries(c.mbti ?? {}).forEach(([letter, w]) => {
      const weight = w as number;
      mbtiMax += weight;
      const l = letter as keyof typeof mScores;
      const got = type.includes(l) ? 1 : 0;
      mbtiBonus += weight * got;
    });
    const mbtiScore = mbtiMax === 0 ? 0.5 : mbtiBonus / mbtiMax;

    const iqW = c.iqWeight ?? 0.4;
    // weighted blend: interests dominant, MBTI fit, IQ scaling
    const raw = 0.55 * traitScore + 0.25 * mbtiScore + iqW * 0.20 * iqNorm + 0.05;
    return { name: c.name, raw, reason: c.reason };
  }).sort((a, b) => b.raw - a.raw);

  // Map top to 75-97% with descending spread, slight noise based on answers
  const top = ranked.slice(0, 3);
  const base = 88 + Math.round(iqNorm * 9); // 88..97
  const careers = top.map((c, i) => ({
    name: c.name,
    match: Math.max(60, base - i * 7 - Math.round((1 - c.raw) * 5)),
    reason: c.reason,
  }));

  return {
    iq: {
      score: iqScore, level: iqLevel,
      logical: pct(log[0], log[1]),
      analytical: pct(ana[0], ana[1]),
      pattern: pct(pat[0], pat[1]),
      correct,
    },
    mbti: { type, scores: mScores },
    interests: interestsPct,
    strengths,
    weaknesses,
    careers,
  };
}

export const MBTI_DESCRIPTIONS: Record<string, string> = {
  INTJ: "Strategic, independent, and visionary.",
  INTP: "Analytical, original, and endlessly curious.",
  ENTJ: "Decisive leader with bold long-term vision.",
  ENTP: "Inventive debater who thrives on new ideas.",
  INFJ: "Insightful idealist driven by purpose.",
  INFP: "Imaginative, empathetic, and value-driven.",
  ENFJ: "Charismatic mentor who inspires others.",
  ENFP: "Enthusiastic creator who connects people.",
  ISTJ: "Reliable, organized, and detail-oriented.",
  ISFJ: "Warm, dedicated, and quietly supportive.",
  ESTJ: "Practical leader who gets things done.",
  ESFJ: "Caring connector who builds harmony.",
  ISTP: "Hands-on problem solver and tinkerer.",
  ISFP: "Gentle artist with a deep aesthetic sense.",
  ESTP: "Bold doer who thrives in the moment.",
  ESFP: "Energetic performer who brings the fun.",
};
