// Career Intelligence Assessment — 30 questions (16 personality + 10 cognitive + 4 interest)

export type PersonalityQ = {
  id: string;
  section: "personality";
  prompt: string;
  axis: "EI" | "SN" | "TF" | "JP";
  direction: 1 | -1; // 1 = agree pushes toward first letter, -1 = second
};

export type CognitiveQ = {
  id: string;
  section: "cognitive";
  prompt: string;
  options: string[];
  correct: number; // index
};

// ── Interest test (projective) ──
// The interest test never asks users to name a career. Instead it shows
// abstract, symbolic choices — shapes, animals, lines, colours, scenes — and
// each answer maps to a hidden RIASEC (Holland) orientation vector. The engine
// aggregates those vectors and projects them onto concrete field interests,
// so the recommendation is *inferred*, not simply echoed back.
export type RiasecDim = "R" | "I" | "A" | "S" | "E" | "C";
export const RIASEC_DIMS: RiasecDim[] = ["R", "I", "A", "S", "E", "C"];

// How an option is drawn. `icon` names a hand-drawn inline SVG in the shared
// icon set (see interest-icons.tsx); `swatch` is a two-stop colour gradient.
// Both are fully self-contained — there are no emoji or external images.
export type InterestVisual =
  { kind: "icon"; icon: string } | { kind: "swatch"; colors: [string, string] };

export type InterestOption = {
  id: string; // globally-unique, e.g. "s1_square"
  label: string; // short caption
  visual: InterestVisual;
  riasec: Partial<Record<RiasecDim, number>>; // hidden orientation weights
};

export type InterestTheme =
  | "shape"
  | "animal"
  | "line"
  | "color"
  | "landscape"
  | "pattern"
  | "element"
  | "object"
  | "sound"
  | "games"
  | "material"
  | "motion";

export type InterestQ = {
  id: string;
  section: "interest";
  prompt: string;
  theme: InterestTheme;
  select: "one"; // projective: pick the single option that draws you
  options: InterestOption[];
};

export type Q = PersonalityQ | CognitiveQ | InterestQ;

export const INTEREST_KEYS = [
  "technology",
  "engineering",
  "science",
  "healthcare",
  "business",
  "finance",
  "entrepreneurship",
  "marketing",
  "design",
  "arts",
  "journalism",
  "law",
  "politics",
  "education",
  "psychology",
  "sports",
  "architecture",
  "environment",
] as const;

export type InterestKey = (typeof INTEREST_KEYS)[number];

export const PERSONALITY: PersonalityQ[] = [
  // E/I — 4 questions
  {
    id: "p1",
    section: "personality",
    prompt: "You feel energized after spending time with a large group of people.",
    axis: "EI",
    direction: 1,
  },
  {
    id: "p2",
    section: "personality",
    prompt: "You prefer quiet, focused work over collaborative brainstorms.",
    axis: "EI",
    direction: -1,
  },
  {
    id: "p3",
    section: "personality",
    prompt: "You enjoy meeting new people at events.",
    axis: "EI",
    direction: 1,
  },
  {
    id: "p4",
    section: "personality",
    prompt: "You need solo time to recharge after busy days.",
    axis: "EI",
    direction: -1,
  },
  // S/N
  {
    id: "p5",
    section: "personality",
    prompt: "You focus on concrete facts more than abstract ideas.",
    axis: "SN",
    direction: 1,
  },
  {
    id: "p6",
    section: "personality",
    prompt: "You enjoy thinking about future possibilities and big-picture ideas.",
    axis: "SN",
    direction: -1,
  },
  {
    id: "p7",
    section: "personality",
    prompt: "You trust hands-on experience over theoretical models.",
    axis: "SN",
    direction: 1,
  },
  {
    id: "p8",
    section: "personality",
    prompt: "You often see patterns and meanings others miss.",
    axis: "SN",
    direction: -1,
  },
  // T/F
  {
    id: "p9",
    section: "personality",
    prompt: "You make decisions based on logic and analysis rather than feelings.",
    axis: "TF",
    direction: 1,
  },
  {
    id: "p10",
    section: "personality",
    prompt: "You weigh how your decisions affect people's emotions heavily.",
    axis: "TF",
    direction: -1,
  },
  {
    id: "p11",
    section: "personality",
    prompt: "You value fairness and objective rules over harmony.",
    axis: "TF",
    direction: 1,
  },
  {
    id: "p12",
    section: "personality",
    prompt: "You prioritize empathy when giving advice.",
    axis: "TF",
    direction: -1,
  },
  // J/P
  {
    id: "p13",
    section: "personality",
    prompt: "You prefer detailed plans and schedules over improvisation.",
    axis: "JP",
    direction: 1,
  },
  {
    id: "p14",
    section: "personality",
    prompt: "You enjoy keeping options open until the last minute.",
    axis: "JP",
    direction: -1,
  },
  {
    id: "p15",
    section: "personality",
    prompt: "You feel uncomfortable when tasks are left unfinished.",
    axis: "JP",
    direction: 1,
  },
  {
    id: "p16",
    section: "personality",
    prompt: "You adapt quickly to unexpected changes in plans.",
    axis: "JP",
    direction: -1,
  },
];

export const COGNITIVE: CognitiveQ[] = [
  {
    id: "c1",
    section: "cognitive",
    prompt: "Find the next number: 2, 6, 12, 20, 30, ?",
    options: ["36", "40", "42", "44"],
    correct: 2,
  },
  {
    id: "c2",
    section: "cognitive",
    prompt: "All roses are flowers. Some flowers fade quickly. Therefore:",
    options: [
      "All roses fade quickly",
      "Some roses may fade quickly",
      "No roses fade",
      "Only roses fade",
    ],
    correct: 1,
  },
  {
    id: "c3",
    section: "cognitive",
    prompt: "If CAT = 3120 and DOG = 4157, what code is BIRD?",
    options: ["29184", "21845", "29154", "29185"],
    correct: 3,
  },
  {
    id: "c4",
    section: "cognitive",
    prompt: "Which one doesn't belong: Square, Circle, Triangle, Cube?",
    options: ["Square", "Circle", "Triangle", "Cube"],
    correct: 3,
  },
  {
    id: "c5",
    section: "cognitive",
    prompt:
      "If 5 machines make 5 widgets in 5 minutes, how long do 100 machines need for 100 widgets?",
    options: ["100 min", "20 min", "5 min", "1 min"],
    correct: 2,
  },
  {
    id: "c6",
    section: "cognitive",
    prompt: "Pattern: A, C, F, J, O, ?",
    options: ["S", "T", "U", "V"],
    correct: 2,
  },
  {
    id: "c7",
    section: "cognitive",
    prompt: "A train leaves at 60 mph. Another follows 2h later at 80 mph. When does it catch up?",
    options: ["6h", "8h", "10h", "12h"],
    correct: 0,
  },
  {
    id: "c8",
    section: "cognitive",
    prompt: "Which number completes the series: 1, 4, 9, 16, 25, ?",
    options: ["30", "32", "36", "49"],
    correct: 2,
  },
  {
    id: "c9",
    section: "cognitive",
    prompt: "If some A are B and all B are C, then:",
    options: ["All A are C", "Some A are C", "No A are C", "All C are A"],
    correct: 1,
  },
  {
    id: "c10",
    section: "cognitive",
    prompt: "What comes next: 81, 27, 9, 3, ?",
    options: ["0", "1", "1.5", "2"],
    correct: 1,
  },
];

// The live projective interest questions live in the server-authoritative
// question bank (see question-bank.ts → INTEREST_BANK). ALL_QUESTIONS is a
// legacy convenience export used only for the fixed-length sample; the session
// picker draws the real questions from the bank.
export const ALL_QUESTIONS: Q[] = [...PERSONALITY, ...COGNITIVE];
export const TOTAL = 30;
