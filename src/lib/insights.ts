import type { ScoredResult } from "./assessment";
import { MBTI_DESCRIPTIONS } from "./assessment";

// ---------- AI-style personality summary (deterministic, template based) ----------
export function generateAISummary(r: ScoredResult): string {
  const mbti = r.mbti.type;
  const mbtiDesc = MBTI_DESCRIPTIONS[mbti] ?? "";
  const top = r.strengths.slice(0, 3);
  const topCareer = r.careers[0]?.name ?? "a creative field";
  const level = r.iq.level.toLowerCase();

  const parts = [
    `You are an ${mbti} — ${mbtiDesc.replace(/\.$/, "")}.`,
    `Your cognitive profile sits in the ${level} range, with standout abilities in ${top
      .slice(0, 2)
      .join(" and ")}${top[2] ? `, supported by ${top[2]}` : ""}.`,
    `This combination tends to thrive in roles like ${topCareer}, where independent thinking and ${top[0]?.toLowerCase() ?? "drive"} translate directly into impact.`,
    `Lean into environments that reward depth and originality — they're where your edge becomes obvious.`,
  ];
  return parts.join(" ");
}

// ---------- University recommendations per career ----------
export type University = { name: string; location: string; focus: string };

const UNIVERSITIES: Record<string, University[]> = {
  tech: [
    { name: "MIT", location: "Cambridge, USA", focus: "Computer Science & Engineering" },
    { name: "Stanford University", location: "California, USA", focus: "AI & Software Systems" },
    { name: "ETH Zürich", location: "Zürich, Switzerland", focus: "Computer Science" },
    { name: "Carnegie Mellon University", location: "Pittsburgh, USA", focus: "Machine Learning" },
  ],
  business: [
    { name: "Harvard Business School", location: "Boston, USA", focus: "MBA & Leadership" },
    { name: "Wharton (UPenn)", location: "Philadelphia, USA", focus: "Finance & Strategy" },
    { name: "London Business School", location: "London, UK", focus: "Global Management" },
    { name: "INSEAD", location: "Fontainebleau, France", focus: "International Business" },
  ],
  design: [
    { name: "Parsons School of Design", location: "New York, USA", focus: "Design & Visual Arts" },
    { name: "Rhode Island School of Design", location: "Providence, USA", focus: "Industrial & Graphic Design" },
    { name: "Royal College of Art", location: "London, UK", focus: "Design Research" },
    { name: "Aalto University", location: "Helsinki, Finland", focus: "Design & Innovation" },
  ],
  science: [
    { name: "University of Cambridge", location: "Cambridge, UK", focus: "Natural Sciences" },
    { name: "University of Oxford", location: "Oxford, UK", focus: "Research & Sciences" },
    { name: "Caltech", location: "Pasadena, USA", focus: "Physics & Engineering" },
    { name: "Princeton University", location: "New Jersey, USA", focus: "Theoretical Research" },
  ],
  social: [
    { name: "Yale University", location: "New Haven, USA", focus: "Psychology & Humanities" },
    { name: "Columbia University", location: "New York, USA", focus: "Journalism & Social Sciences" },
    { name: "Sciences Po", location: "Paris, France", focus: "Politics & Communication" },
    { name: "University of Chicago", location: "Chicago, USA", focus: "Behavioral Science" },
  ],
  health: [
    { name: "Johns Hopkins University", location: "Baltimore, USA", focus: "Medicine & Public Health" },
    { name: "Karolinska Institutet", location: "Stockholm, Sweden", focus: "Medical Sciences" },
    { name: "University of Oxford", location: "Oxford, UK", focus: "Clinical Medicine" },
    { name: "UCLA", location: "Los Angeles, USA", focus: "Health Sciences" },
  ],
  law: [
    { name: "Harvard Law School", location: "Cambridge, USA", focus: "Law & Policy" },
    { name: "Yale Law School", location: "New Haven, USA", focus: "Constitutional Law" },
    { name: "University of Oxford", location: "Oxford, UK", focus: "Jurisprudence" },
    { name: "LSE", location: "London, UK", focus: "Law & Government" },
  ],
};

const CAREER_TO_TRACK: Record<string, keyof typeof UNIVERSITIES> = {
  "Software Engineer": "tech",
  "Data Analyst": "tech",
  "Product Manager": "tech",
  "Research Scientist": "science",
  "UX / Product Designer": "design",
  "Graphic Designer": "design",
  "Content Creator": "design",
  "Civil Engineer / Architect": "design",
  "Journalist": "social",
  "Public Relations Specialist": "social",
  "Marketing Manager": "business",
  "Entrepreneur / Startup Founder": "business",
  "Financial Analyst": "business",
  "Operations Manager": "business",
  "Teacher / Educator": "social",
  "Psychologist": "social",
  "Doctor / Healthcare Professional": "health",
  "Lawyer": "law",
};

export function getUniversitiesFor(careerName: string): University[] {
  const track = CAREER_TO_TRACK[careerName] ?? "business";
  return UNIVERSITIES[track];
}

// ---------- Radar dataset ----------
export function buildRadarData(r: ScoredResult) {
  const dims: [string, string][] = [
    ["analytical", "Analytical"],
    ["creativity", "Creativity"],
    ["leadership", "Leadership"],
    ["communication", "Communication"],
    ["technical", "Technical"],
    ["eq", "Empathy"],
    ["curiosity", "Curiosity"],
    ["organization", "Organization"],
  ];
  return dims.map(([k, label]) => ({
    dimension: label,
    value: (r.interests as Record<string, number>)[k] ?? 0,
  }));
}
