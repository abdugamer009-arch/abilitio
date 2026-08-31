// Career Intelligence Assessment — shared types and constants for the
// 30-question live assessment (12 personality + 9 cognitive + 9 interest).
// The actual question content is server-authoritative and lives in
// question-bank.ts; this file only defines the shapes it's built from.

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
  | { kind: "icon"; icon: string }
  | { kind: "swatch"; colors: [string, string] };

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
