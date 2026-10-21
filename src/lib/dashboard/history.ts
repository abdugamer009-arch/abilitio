import { presentationSummary } from "@/lib/assessment/summary-integrity";

export const HISTORY_PAGE_SIZE = 20;
// Fetch only the three displayed career summaries, never nested evidence for
// all 166 careers. Full reports remain available through owner-scoped lookup.
export const HISTORY_COLUMNS = [
  "id",
  "cognitive_score",
  "personality_type",
  "scoring_version",
  "strengths",
  "improvements",
  "created_at",
  ...[0, 1, 2].flatMap((i) => [
    `career_${i}_name:career_matches->${i}->>name`,
    `career_${i}_score:career_matches->${i}->>score`,
    `career_${i}_category:career_matches->${i}->>category`,
  ]),
].join(",");

export function dashboardResult(row: Record<string, unknown>) {
  const summary = presentationSummary({
    scoring_version: row.scoring_version as string | null,
    strengths: row.strengths as string[] | null,
    improvements: row.improvements as string[] | null,
  });
  const careers = [0, 1, 2].flatMap((i) =>
    typeof row[`career_${i}_name`] === "string"
      ? [
          {
            name: row[`career_${i}_name`] as string,
            match: Math.round(Number(row[`career_${i}_score`])),
            reason: (row[`career_${i}_category`] as string | null) ?? "",
          },
        ]
      : [],
  );
  return {
    id: row.id as string,
    iq_score: row.cognitive_score as number | null,
    mbti_type: (row.personality_type as string) ?? "—",
    top_strengths: summary.strengths,
    weaknesses: summary.improvements,
    careers,
    created_at: row.created_at as string,
  };
}
