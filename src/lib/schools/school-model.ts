const CATEGORY_BUCKET: Record<string, string> = {
  Sports: "sports",
  Hospitality: "hospitality",
  "Social Impact": "social-impact",
  "Public Safety": "public-safety",
  Trades: "trades",
  Aviation: "aviation",
  Transport: "transport",
  Agriculture: "agriculture",
  Technology: "technology",
  Engineering: "engineering",
  Architecture: "engineering",
  Healthcare: "medical",
  Psychology: "medical",
  Science: "research",
  "Social Sciences": "research",
  Business: "business",
  Finance: "business",
  Entrepreneurship: "leadership",
  Marketing: "business",
  Media: "communication",
  Arts: "creative",
  Design: "creative",
  Education: "communication",
  Law: "communication",
  Government: "communication",
};
const LEGACY_BUCKET: Record<string, string> = {
  "Software Engineer": "technology",
  "Data Analyst": "technology",
  "Research Scientist": "research",
  "UX / Product Designer": "creative",
  "Graphic Designer": "creative",
  Journalist: "communication",
  "Marketing Manager": "business",
  "Public Relations Specialist": "communication",
  "Entrepreneur / Startup Founder": "leadership",
  "Product Manager": "leadership",
  "Teacher / Educator": "communication",
  Psychologist: "medical",
  "Content Creator": "creative",
  "Civil Engineer / Architect": "engineering",
  "Financial Analyst": "business",
  "Doctor / Healthcare Professional": "medical",
  Lawyer: "communication",
  "Operations Manager": "leadership",
};
export function schoolBucket(
  career: { category?: string; name?: string } | undefined,
): string | null {
  if (!career) return null;
  return (
    (career.category ? CATEGORY_BUCKET[career.category] : undefined) ??
    (career.name ? LEGACY_BUCKET[career.name] : undefined) ??
    null
  );
}
/** These describe actual saved answers; unsupported leadership/creativity claims are omitted. */
export const SCHOOL_STRENGTHS = [
  { dimension: "Top Communicators", labels: ["communication", "Confident communicator"] },
  { dimension: "Top Problem Solvers", labels: ["analytical", "Strong analytical reasoning"] },
];
