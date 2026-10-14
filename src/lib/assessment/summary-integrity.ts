// Older saved reports did not retain answer-level evidence. Do not present
// their inferred strengths or styles as verified claims after the new rules.
export const EVIDENCE_SCORING_VERSION = "v5-evidence";
export const EVIDENCE_PREFERENCES_VERSION = "v5-preferences-evidence";
export const DIRECT_SCORING_VERSION = "v6-direct-interests";
export const DIRECT_PREFERENCES_VERSION = "v6-direct-preferences";
export const LEGACY_VISUAL_VERSION = "v6-legacy-visual-only";

export function evidenceCoverage(version?: string | null): "direct" | "limited" | "historical" {
  if (version === DIRECT_SCORING_VERSION || version === DIRECT_PREFERENCES_VERSION) return "direct";
  if (version === LEGACY_VISUAL_VERSION) return "limited";
  return "historical";
}

export function presentationSummary(input: {
  scoring_version?: string | null;
  strengths?: unknown;
  improvements?: unknown;
  work_style?: string | null;
  leadership_style?: string | null;
  learning_style?: string | null;
  team_style?: string | null;
}) {
  const verified =
    input.scoring_version === EVIDENCE_SCORING_VERSION ||
    input.scoring_version === EVIDENCE_PREFERENCES_VERSION ||
    input.scoring_version === DIRECT_SCORING_VERSION ||
    input.scoring_version === DIRECT_PREFERENCES_VERSION ||
    input.scoring_version === LEGACY_VISUAL_VERSION;
  const strings = (value: unknown): string[] =>
    Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
  return {
    summary_unverified: !verified,
    strengths: verified
      ? strings(input.strengths).filter((claim) => claim !== "Strong analytical reasoning")
      : [],
    improvements: verified
      ? strings(input.improvements).filter(
          (claim) => claim !== "Build problem-solving habits with daily logic puzzles",
        )
      : [],
    work_style: verified ? (input.work_style ?? null) : "Mixed preferences",
    leadership_style: verified ? (input.leadership_style ?? null) : "Mixed preferences",
    learning_style: verified ? (input.learning_style ?? null) : "Mixed preferences",
    team_style: verified ? (input.team_style ?? null) : "Mixed preferences",
  };
}
