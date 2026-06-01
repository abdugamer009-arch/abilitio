import type { LucideIcon } from "lucide-react";
import { Brain, Compass, Flame, Sparkles, Trophy, Target, Crown, Rocket, Star, Eye } from "lucide-react";

/** ───────── Achievements ───────── */
export type Achievement = {
  key: string;
  name: string;
  description: string;
  icon: LucideIcon;
  reward: number; // coins granted on unlock
  /** Evaluator runs against the user's wallet + counters. */
  check: (s: GrowthState) => boolean;
};

export type GrowthState = {
  lifetimeEarned: number;
  lifetimeSpent: number;
  balance: number;
  streakDays: number;
  assessmentsCompleted: number;
  unlocksCount: number;
};

export const ACHIEVEMENTS: Achievement[] = [
  {
    key: "first_spark",
    name: "First Spark",
    description: "Earn your very first Aura Coin.",
    icon: Sparkles,
    reward: 5,
    check: (s) => s.lifetimeEarned >= 1,
  },
  {
    key: "self_aware",
    name: "Self-Aware",
    description: "Complete your first assessment.",
    icon: Eye,
    reward: 10,
    check: (s) => s.assessmentsCompleted >= 1,
  },
  {
    key: "consistent_mind",
    name: "Consistent Mind",
    description: "Reach a 3-day login streak.",
    icon: Flame,
    reward: 10,
    check: (s) => s.streakDays >= 3,
  },
  {
    key: "weeklong_focus",
    name: "Weeklong Focus",
    description: "Reach a 7-day login streak.",
    icon: Flame,
    reward: 25,
    check: (s) => s.streakDays >= 7,
  },
  {
    key: "unstoppable",
    name: "Unstoppable",
    description: "Reach a 30-day login streak.",
    icon: Rocket,
    reward: 100,
    check: (s) => s.streakDays >= 30,
  },
  {
    key: "coin_collector",
    name: "Coin Collector",
    description: "Earn 100 lifetime Aura Coins.",
    icon: Star,
    reward: 15,
    check: (s) => s.lifetimeEarned >= 100,
  },
  {
    key: "rising_aura",
    name: "Rising Aura",
    description: "Earn 500 lifetime Aura Coins.",
    icon: Trophy,
    reward: 50,
    check: (s) => s.lifetimeEarned >= 500,
  },
  {
    key: "aura_master",
    name: "Aura Master",
    description: "Earn 2,000 lifetime Aura Coins.",
    icon: Crown,
    reward: 150,
    check: (s) => s.lifetimeEarned >= 2000,
  },
  {
    key: "investor",
    name: "Investor in Self",
    description: "Unlock your first premium feature.",
    icon: Target,
    reward: 20,
    check: (s) => s.unlocksCount >= 1,
  },
  {
    key: "deep_explorer",
    name: "Deep Explorer",
    description: "Unlock 3 premium features.",
    icon: Compass,
    reward: 50,
    check: (s) => s.unlocksCount >= 3,
  },
];

/** ───────── Skill Tree ───────── */
export type SkillNode = {
  key: string;
  name: string;
  tagline: string;
  icon: LucideIcon;
  /** XP needed to fully master this node (1 XP = 1 lifetime coin earned). */
  xpToMaster: number;
  /** Source dimension that contributes to this node. */
  derive: (s: GrowthState) => number;
};

export const SKILL_NODES: SkillNode[] = [
  {
    key: "self_awareness",
    name: "Self-Awareness",
    tagline: "Know thyself",
    icon: Eye,
    xpToMaster: 100,
    derive: (s) => s.assessmentsCompleted * 50 + Math.min(s.lifetimeEarned, 50),
  },
  {
    key: "cognition",
    name: "Cognition",
    tagline: "Sharpen the mind",
    icon: Brain,
    xpToMaster: 250,
    derive: (s) => Math.floor(s.lifetimeEarned * 0.4),
  },
  {
    key: "discipline",
    name: "Discipline",
    tagline: "Show up daily",
    icon: Flame,
    xpToMaster: 200,
    derive: (s) => s.streakDays * 10,
  },
  {
    key: "mastery",
    name: "Mastery",
    tagline: "Invest in growth",
    icon: Target,
    xpToMaster: 300,
    derive: (s) => s.unlocksCount * 80 + Math.floor(s.lifetimeSpent * 0.2),
  },
  {
    key: "vision",
    name: "Vision",
    tagline: "See the long arc",
    icon: Compass,
    xpToMaster: 500,
    derive: (s) => Math.floor(s.lifetimeEarned * 0.25),
  },
];

/** ───────── Milestones (lifetime earned tiers) ───────── */
export type Milestone = {
  threshold: number;
  name: string;
  aura: string;
};

export const MILESTONES: Milestone[] = [
  { threshold: 0, name: "Initiate", aura: "Faint glow" },
  { threshold: 100, name: "Seeker", aura: "Soft violet" },
  { threshold: 500, name: "Ascendant", aura: "Bright magenta" },
  { threshold: 1500, name: "Luminary", aura: "Radiant gold" },
  { threshold: 5000, name: "Sovereign", aura: "Crystalline white" },
];

export function currentMilestone(lifetimeEarned: number): { current: Milestone; next: Milestone | null; progress: number } {
  let current = MILESTONES[0];
  let next: Milestone | null = null;
  for (let i = 0; i < MILESTONES.length; i++) {
    if (lifetimeEarned >= MILESTONES[i].threshold) {
      current = MILESTONES[i];
      next = MILESTONES[i + 1] ?? null;
    }
  }
  const progress = next
    ? Math.min(1, (lifetimeEarned - current.threshold) / (next.threshold - current.threshold))
    : 1;
  return { current, next, progress };
}
