import { expect, it } from "vitest";
import { dashboardResult, HISTORY_COLUMNS, HISTORY_PAGE_SIZE } from "@/lib/dashboard/history";
it("requests bounded summaries rather than full private report JSON", () => {
  expect(HISTORY_PAGE_SIZE).toBe(20);
  expect(HISTORY_COLUMNS).not.toContain("*");
  expect(HISTORY_COLUMNS).not.toContain("selected_answers");
  expect(HISTORY_COLUMNS.match(/career_matches/g)).toHaveLength(9);
  expect(HISTORY_COLUMNS).toContain("career_2_category:career_matches->2->>category");
});
it("preserves scores, ordering and the three comparison careers in compact history", () => {
  const mapped = dashboardResult({
    id: "old",
    created_at: "2026-10-01",
    cognitive_score: 7,
    personality_type: "ESTP",
    scoring_version: "v2",
    strengths: ["unverified"],
    improvements: [],
    career_0_name: "Teacher",
    career_0_score: "81.2",
    career_0_category: "Education",
    career_1_name: "Engineer",
    career_1_score: "80",
    career_2_name: "Doctor",
    career_2_score: "78",
  });
  expect(mapped.iq_score).toBe(7);
  expect(mapped.top_strengths).toEqual([]);
  expect(mapped.careers.map((c) => [c.name, c.match])).toEqual([
    ["Teacher", 81],
    ["Engineer", 80],
    ["Doctor", 78],
  ]);
  expect(mapped.careers[0].reason).toBe("Education");
  expect(dashboardResult({ cognitive_score: null, personality_type: null }).iq_score).toBeNull();
});
