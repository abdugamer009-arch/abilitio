/** Roadmap World — gamified career journey. */

export type RoadmapTrack = "tech" | "creative" | "business" | "science" | "social" | "default";

export type RoadmapTask = {
  id: string;
  title: string;
  description: string;
  xp: number;
  estimate: string; // e.g. "20 min"
};

export type RoadmapPhase = {
  index: 1 | 2 | 3 | 4 | 5;
  name: string;
  subtitle: string;
  tasks: RoadmapTask[];
};

const NAMES: Record<RoadmapPhase["index"], { name: string; subtitle: string }> = {
  1: { name: "Foundations", subtitle: "Discover your core toolkit" },
  2: { name: "Skill Building", subtitle: "Sharpen what makes you stand out" },
  3: { name: "Advanced Growth", subtitle: "Build depth & specialization" },
  4: { name: "Professional Development", subtitle: "Step into the real arena" },
  5: { name: "Mastery", subtitle: "Lead, mentor, create impact" },
};

const TASKS: Record<RoadmapTrack, Record<RoadmapPhase["index"], Omit<RoadmapTask, "id">[]>> = {
  tech: {
    1: [
      { title: "Learn Python basics", description: "Variables, loops, functions, lists & dicts.", xp: 50, estimate: "3 hrs" },
      { title: "Build your first script", description: "Automate a small daily task end-to-end.", xp: 60, estimate: "2 hrs" },
      { title: "Set up Git & GitHub", description: "Create your first repo and push code.", xp: 40, estimate: "45 min" },
      { title: "Master the terminal", description: "Navigate files, run scripts, basic shell commands.", xp: 30, estimate: "1 hr" },
    ],
    2: [
      { title: "Solve 20 logic challenges", description: "Algorithms, pattern recognition, problem-solving fluency.", xp: 80, estimate: "1 week" },
      { title: "Build a personal website", description: "HTML, CSS, deploy live with your name on it.", xp: 100, estimate: "5 hrs" },
      { title: "Pick a stack", description: "Choose React / Python / data — go deep, not wide.", xp: 50, estimate: "1 hr" },
      { title: "Read clean code principles", description: "Naming, functions, structure that scales.", xp: 60, estimate: "2 hrs" },
    ],
    3: [
      { title: "Ship a real project", description: "End-to-end app: auth, database, hosted online.", xp: 150, estimate: "2 weeks" },
      { title: "Contribute to open source", description: "First PR merged into someone else's project.", xp: 120, estimate: "1 week" },
      { title: "Learn system design basics", description: "APIs, databases, caching, scale.", xp: 100, estimate: "1 week" },
    ],
    4: [
      { title: "Apply to 20 internships", description: "Polished resume, custom cover letters.", xp: 150, estimate: "2 weeks" },
      { title: "Practice interview problems", description: "30 LeetCode-style problems, mock interviews.", xp: 180, estimate: "1 month" },
      { title: "Get a mentor", description: "Reach out to 3 engineers, build one relationship.", xp: 100, estimate: "ongoing" },
    ],
    5: [
      { title: "Lead a technical project", description: "Architect, delegate, ship something with a team.", xp: 250, estimate: "1 quarter" },
      { title: "Speak or write publicly", description: "Talk, blog post, or YouTube on what you know.", xp: 200, estimate: "1 month" },
      { title: "Mentor a beginner", description: "Teach what you learned in Phase 1.", xp: 180, estimate: "ongoing" },
    ],
  },
  creative: {
    1: [
      { title: "Pick your medium", description: "Design, video, writing — commit to one for 90 days.", xp: 40, estimate: "30 min" },
      { title: "Daily creative practice", description: "30 days of small daily output.", xp: 80, estimate: "30 days" },
      { title: "Study 10 masters", description: "Analyze what makes their work work.", xp: 50, estimate: "1 week" },
      { title: "Build a portfolio start", description: "Even 3 pieces, presented well.", xp: 60, estimate: "1 week" },
    ],
    2: [
      { title: "Learn the pro tools", description: "Figma, Premiere, Notion — fluency, not basics.", xp: 100, estimate: "2 weeks" },
      { title: "Ship 5 finished pieces", description: "Finishing matters more than starting.", xp: 120, estimate: "1 month" },
      { title: "Develop your style", description: "What's recognizably yours? Name it.", xp: 80, estimate: "ongoing" },
    ],
    3: [
      { title: "First paid project", description: "Even $50 — money changes the bar.", xp: 150, estimate: "2 weeks" },
      { title: "Build an audience", description: "100 followers who care, not 10k who don't.", xp: 150, estimate: "3 months" },
      { title: "Take a critique", description: "Show work, take notes, iterate publicly.", xp: 100, estimate: "ongoing" },
    ],
    4: [
      { title: "Land 3 paying clients", description: "Build a small but real freelance base.", xp: 200, estimate: "2 months" },
      { title: "Raise your rates", description: "Double them. See what happens.", xp: 120, estimate: "1 day" },
      { title: "Build a system", description: "Briefs, contracts, invoicing — professional, not chaotic.", xp: 150, estimate: "1 week" },
    ],
    5: [
      { title: "Launch a signature project", description: "Something only you could have made.", xp: 300, estimate: "1 quarter" },
      { title: "Teach your craft", description: "Course, workshop, or YouTube channel.", xp: 220, estimate: "2 months" },
      { title: "Hire / collaborate", description: "Move from solo to studio.", xp: 200, estimate: "ongoing" },
    ],
  },
  business: {
    1: [
      { title: "Read 3 foundational books", description: "Think strategically, not tactically.", xp: 60, estimate: "1 month" },
      { title: "Master Excel & spreadsheets", description: "Pivot tables, formulas, modeling basics.", xp: 80, estimate: "2 weeks" },
      { title: "Learn the financial statements", description: "P&L, balance sheet, cash flow — fluently.", xp: 100, estimate: "2 weeks" },
    ],
    2: [
      { title: "Take on leadership", description: "Lead a club, project, or team — anywhere.", xp: 120, estimate: "1 quarter" },
      { title: "Practice public speaking", description: "5 talks. Get good. Get comfortable.", xp: 100, estimate: "2 months" },
      { title: "Learn one industry deeply", description: "Pick one. Read everything. Talk to insiders.", xp: 150, estimate: "1 month" },
    ],
    3: [
      { title: "Build a side venture", description: "Even tiny revenue teaches more than theory.", xp: 200, estimate: "3 months" },
      { title: "Negotiate something real", description: "Salary, contract, deal — practice the muscle.", xp: 120, estimate: "ongoing" },
      { title: "Build your network", description: "30 meaningful coffees in 90 days.", xp: 150, estimate: "3 months" },
    ],
    4: [
      { title: "Land a high-leverage role", description: "Strategy, BD, ops — not just a job, a launchpad.", xp: 250, estimate: "3 months" },
      { title: "Own a P&L", description: "Be accountable for a real number.", xp: 200, estimate: "ongoing" },
      { title: "Mentor up & sideways", description: "Find a mentor and become one.", xp: 120, estimate: "ongoing" },
    ],
    5: [
      { title: "Launch or lead a venture", description: "Founder, GM, or owner of an outcome.", xp: 350, estimate: "1+ year" },
      { title: "Build a team", description: "Hire, lead, and develop people.", xp: 250, estimate: "ongoing" },
      { title: "Give back", description: "Angel invest, advise, or teach the next wave.", xp: 200, estimate: "ongoing" },
    ],
  },
  science: {
    1: [
      { title: "Master the scientific method", description: "Question → hypothesis → experiment → revise.", xp: 50, estimate: "1 week" },
      { title: "Read 5 landmark papers", description: "In your field of interest.", xp: 70, estimate: "2 weeks" },
      { title: "Learn statistics basics", description: "Distributions, significance, regression.", xp: 100, estimate: "1 month" },
    ],
    2: [
      { title: "Pick a sub-field", description: "Neuroscience, climate, ML — go deep on one.", xp: 60, estimate: "1 month" },
      { title: "Join a lab or research group", description: "Hands-on beats textbook every time.", xp: 150, estimate: "1 quarter" },
      { title: "Learn a research tool", description: "Python, R, MATLAB — fluency, not familiarity.", xp: 120, estimate: "2 months" },
    ],
    3: [
      { title: "Co-author or present", description: "Poster, paper, or talk at a conference.", xp: 200, estimate: "6 months" },
      { title: "Master experimental design", description: "Controls, variables, reproducibility.", xp: 150, estimate: "ongoing" },
      { title: "Build a research network", description: "PIs, postdocs, peers — they open doors.", xp: 120, estimate: "ongoing" },
    ],
    4: [
      { title: "Apply to grad school or labs", description: "Top-tier programs, multiple targets.", xp: 250, estimate: "1 application cycle" },
      { title: "Get published", description: "First-author paper in a respected journal.", xp: 300, estimate: "1+ year" },
      { title: "Win a grant or fellowship", description: "Funded research = independent science.", xp: 250, estimate: "ongoing" },
    ],
    5: [
      { title: "Lead original research", description: "Your question, your design, your name.", xp: 400, estimate: "multi-year" },
      { title: "Mentor students", description: "Pass on the craft.", xp: 200, estimate: "ongoing" },
      { title: "Translate science publicly", description: "Make your field legible to the world.", xp: 250, estimate: "ongoing" },
    ],
  },
  social: {
    1: [
      { title: "Practice active listening", description: "Reflect back, ask the second question.", xp: 50, estimate: "ongoing" },
      { title: "Read 3 books on people", description: "Psychology, communication, influence.", xp: 60, estimate: "1 month" },
      { title: "Learn basic media tools", description: "Writing, video, podcast basics.", xp: 80, estimate: "2 weeks" },
    ],
    2: [
      { title: "Start writing publicly", description: "One post a week for 12 weeks.", xp: 120, estimate: "3 months" },
      { title: "Practice tough conversations", description: "Hard feedback, real empathy, no avoidance.", xp: 100, estimate: "ongoing" },
      { title: "Build a presence", description: "One platform, real voice, consistent.", xp: 120, estimate: "3 months" },
    ],
    3: [
      { title: "Interview 20 people", description: "On a topic you care about. Publish what you learn.", xp: 180, estimate: "2 months" },
      { title: "Run a workshop or event", description: "Bring people together around something real.", xp: 150, estimate: "1 month" },
      { title: "Find your beat", description: "What story keeps pulling you? Own it.", xp: 120, estimate: "ongoing" },
    ],
    4: [
      { title: "Land a media or social role", description: "Journalism, communications, PR, social impact.", xp: 220, estimate: "3 months" },
      { title: "Publish in a known outlet", description: "Pitch, get accepted, see your byline.", xp: 200, estimate: "ongoing" },
      { title: "Build an audience that trusts you", description: "Quality of attention, not quantity.", xp: 180, estimate: "1 year" },
    ],
    5: [
      { title: "Lead a movement or project", description: "Convene, organize, ship change.", xp: 320, estimate: "1+ year" },
      { title: "Mentor emerging voices", description: "Build the next wave.", xp: 200, estimate: "ongoing" },
      { title: "Give a defining talk", description: "TED-level: what you most want the world to know.", xp: 280, estimate: "ongoing" },
    ],
  },
  default: {
    1: [
      { title: "Clarify your direction", description: "Write a 1-page vision of where you want to be in 3 years.", xp: 50, estimate: "1 hr" },
      { title: "Build a daily learning habit", description: "30 min/day, every day, for 30 days.", xp: 80, estimate: "30 days" },
      { title: "Identify 3 role models", description: "Study their path. What's transferable?", xp: 40, estimate: "1 week" },
    ],
    2: [
      { title: "Develop a signature skill", description: "Pick the one thing you'll be known for.", xp: 100, estimate: "ongoing" },
      { title: "Build something visible", description: "Project, portfolio, content — proof of work.", xp: 120, estimate: "1 month" },
      { title: "Practice the basics deeply", description: "Communication, problem-solving, follow-through.", xp: 80, estimate: "ongoing" },
    ],
    3: [
      { title: "Take on a real challenge", description: "Something where you might fail. Learn fast.", xp: 150, estimate: "1 quarter" },
      { title: "Find mentors & peers", description: "5 people ahead of you, 5 alongside you.", xp: 100, estimate: "ongoing" },
      { title: "Reflect & refine", description: "Monthly review: what worked, what didn't, what's next.", xp: 60, estimate: "ongoing" },
    ],
    4: [
      { title: "Land the right opportunity", description: "Not the easiest one — the one that grows you.", xp: 200, estimate: "3 months" },
      { title: "Build your professional brand", description: "LinkedIn, portfolio, story — all aligned.", xp: 120, estimate: "2 weeks" },
      { title: "Own outcomes, not tasks", description: "Move from 'doing work' to 'driving results'.", xp: 180, estimate: "ongoing" },
    ],
    5: [
      { title: "Lead and create", description: "Make the thing only you could make.", xp: 300, estimate: "1+ year" },
      { title: "Build a team or community", description: "Multiply your impact through others.", xp: 220, estimate: "ongoing" },
      { title: "Give back generously", description: "Mentor, share, teach. The path completes here.", xp: 200, estimate: "ongoing" },
    ],
  },
};

const CAREER_TRACK: Record<string, RoadmapTrack> = {
  "Software Engineer": "tech",
  "Data Analyst": "tech",
  "Product Manager": "tech",
  "Research Scientist": "science",
  "Doctor / Healthcare Professional": "science",
  "Psychologist": "social",
  "Journalist": "social",
  "Public Relations Specialist": "social",
  "Teacher / Educator": "social",
  "UX / Product Designer": "creative",
  "Graphic Designer": "creative",
  "Content Creator": "creative",
  "Civil Engineer / Architect": "creative",
  "Marketing Manager": "business",
  "Entrepreneur / Startup Founder": "business",
  "Financial Analyst": "business",
  "Operations Manager": "business",
  "Lawyer": "business",
};

export function pickTrack(careerName?: string): RoadmapTrack {
  if (!careerName) return "default";
  return CAREER_TRACK[careerName] ?? "default";
}

export function buildRoadmap(track: RoadmapTrack): RoadmapPhase[] {
  const tasks = TASKS[track] ?? TASKS.default;
  return ([1, 2, 3, 4, 5] as const).map((i) => ({
    index: i,
    name: NAMES[i].name,
    subtitle: NAMES[i].subtitle,
    tasks: tasks[i].map((t, idx) => ({ ...t, id: `p${i}_t${idx + 1}` })),
  }));
}

export const TRACK_LABEL: Record<RoadmapTrack, string> = {
  tech: "Technology Path",
  creative: "Creative Path",
  business: "Business & Leadership Path",
  science: "Science & Research Path",
  social: "People & Media Path",
  default: "Personal Growth Path",
};
