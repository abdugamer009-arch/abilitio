/** Premium features unlockable with Aura Coins. */
export type UnlockFeature = {
  key: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  tier: "core" | "growth" | "elite";
};

export const AURA_FEATURES: UnlockFeature[] = [
  {
    key: "deep_career_report",
    name: "Deep Career Report",
    tagline: "20-page AI breakdown of your top 5 careers",
    description:
      "Personalized career fit analysis with salary ranges, day-in-the-life, learning paths, and risk factors based on your profile.",
    price: 120,
    tier: "core",
  },
  {
    key: "advanced_iq_breakdown",
    name: "Advanced IQ Breakdown",
    tagline: "Per-domain cognitive analysis",
    description:
      "Logical, pattern, analytical and spatial scores compared against age cohort, with targeted training drills.",
    price: 80,
    tier: "core",
  },
  {
    key: "mbti_premium_layer",
    name: "MBTI Premium Layer",
    tagline: "Shadow functions and cognitive stack",
    description:
      "Goes beyond the 4-letter type — explores your dominant/auxiliary/tertiary/inferior functions and growth blind spots.",
    price: 100,
    tier: "growth",
  },
  {
    key: "growth_roadmap_pro",
    name: "Growth Roadmap Pro",
    tagline: "90-day personalized plan",
    description:
      "Adaptive weekly milestones, habit stacking, and skill challenges generated from your weakest dimensions.",
    price: 180,
    tier: "growth",
  },
  {
    key: "results_pdf_export",
    name: "Premium PDF Export",
    tagline: "Beautiful share-ready report",
    description: "Branded, designer-grade PDF of your full Abilitio profile — perfect to share with mentors or coaches.",
    price: 60,
    tier: "core",
  },
  {
    key: "ai_mentor_unlimited",
    name: "AI Mentor — Unlimited",
    tagline: "Talk to your personal AI mentor",
    description:
      "Unlimited 1:1 chat with an AI tuned to your profile, helping you reflect, plan, and stay accountable.",
    price: 250,
    tier: "elite",
  },
];

/** Coin packages — priced in Uzbek Som (UZS). */
export type CoinPackage = {
  key: string;
  coins: number;
  bonus: number; // extra coins on top
  uzs: number;
  highlight?: string;
  popular?: boolean;
};

export const AURA_PACKAGES: CoinPackage[] = [
  { key: "spark", coins: 100, bonus: 0, uzs: 19_000 },
  { key: "glow", coins: 300, bonus: 30, uzs: 49_000, highlight: "+10% bonus" },
  { key: "aura", coins: 700, bonus: 100, uzs: 99_000, highlight: "+14% bonus", popular: true },
  { key: "nova", coins: 1500, bonus: 300, uzs: 199_000, highlight: "+20% bonus" },
  { key: "infinity", coins: 4000, bonus: 1000, uzs: 449_000, highlight: "+25% bonus" },
];

export function formatUZS(amount: number): string {
  return new Intl.NumberFormat("en-US").format(amount) + " UZS";
}
