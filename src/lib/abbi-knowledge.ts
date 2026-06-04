// ABBI AI v1 — Static career knowledge base + lightweight response engine.
// No paid LLM. Designed so a real model can later replace `generateAbbiReply()`
// without changing the chat UI contract.

export type CareerInfo = {
  name: string;
  description: string;
  responsibilities: string[];
  skills: string[];
  majors: string[];
  educationPath: string;
  salaryRange: string;
  outlook: string;
  advantages: string[];
  challenges: string[];
  fitsMbti?: string[];        // personality types it suits
  interestKeys?: string[];    // matches `interest_scores` keys
};

export const CAREERS: CareerInfo[] = [
  {
    name: "Software Engineer",
    description: "Designs, builds and maintains software systems used by businesses and consumers.",
    responsibilities: ["Write and review code", "Design system architecture", "Debug and optimize performance", "Collaborate with product & design"],
    skills: ["Problem solving", "Algorithms & data structures", "JavaScript / Python / Go", "Version control (Git)", "System design"],
    majors: ["Computer Science", "Software Engineering", "Computer Engineering"],
    educationPath: "Bachelor's in CS or related → internships → junior engineer → mid/senior. Many succeed via self-taught + portfolio.",
    salaryRange: "$70k – $250k+ (US); $25k – $90k+ in emerging markets",
    outlook: "Very strong — 22% growth projected through 2030 (BLS).",
    advantages: ["Remote-friendly", "High demand globally", "Creative + analytical work", "Strong compensation"],
    challenges: ["Continuous learning required", "Long debugging sessions", "Can be sedentary"],
    fitsMbti: ["INTJ", "INTP", "ISTP", "ENTP"],
    interestKeys: ["analytical", "technical", "creativity"],
  },
  {
    name: "Data Analyst",
    description: "Turns raw data into insights that guide business decisions.",
    responsibilities: ["Build dashboards & reports", "Run SQL queries", "Communicate findings to stakeholders", "Clean and validate data"],
    skills: ["SQL", "Excel / Sheets", "Python or R", "Statistics", "Data visualization (Tableau, Power BI)"],
    majors: ["Statistics", "Mathematics", "Economics", "Business Analytics", "Computer Science"],
    educationPath: "Bachelor's in a quantitative field → entry analyst role → senior analyst → analytics lead / data scientist.",
    salaryRange: "$55k – $120k (US); $15k – $45k entry in emerging markets",
    outlook: "Strong — analytics is core to nearly every industry.",
    advantages: ["Versatile across industries", "Clear career ladder", "Mix of logic + storytelling"],
    challenges: ["Lots of data cleaning", "Stakeholder politics", "Requires precision"],
    fitsMbti: ["ISTJ", "INTJ", "ENTJ", "INTP"],
    interestKeys: ["analytical", "organization"],
  },
  {
    name: "Data Scientist",
    description: "Uses statistics, ML and code to discover patterns and build predictive models.",
    responsibilities: ["Develop ML models", "A/B testing", "Feature engineering", "Productionize models with engineers"],
    skills: ["Python", "Machine learning", "Statistics", "SQL", "Experimentation"],
    majors: ["Computer Science", "Statistics", "Applied Mathematics", "Physics"],
    educationPath: "Bachelor's → optional Master's/PhD → analyst or ML engineer → data scientist.",
    salaryRange: "$95k – $200k+ (US)",
    outlook: "High demand, especially in AI-driven companies.",
    advantages: ["Cutting-edge work", "High pay", "Strong impact on product"],
    challenges: ["Steep math/stats requirement", "Models often fail in production", "Ambiguous problems"],
    fitsMbti: ["INTJ", "INTP", "ENTJ"],
    interestKeys: ["analytical", "technical", "curiosity"],
  },
  {
    name: "Cybersecurity Specialist",
    description: "Protects organizations from digital threats, breaches and vulnerabilities.",
    responsibilities: ["Monitor networks", "Run penetration tests", "Respond to incidents", "Build security policies"],
    skills: ["Networking", "Linux", "Scripting", "Threat modeling", "Security certifications (CompTIA, CEH, OSCP)"],
    majors: ["Cybersecurity", "Computer Science", "Information Systems"],
    educationPath: "Bachelor's + certifications → SOC analyst → security engineer → specialist or architect.",
    salaryRange: "$80k – $180k (US)",
    outlook: "Critical and growing — every company needs security.",
    advantages: ["Mission-driven", "High pay", "Always evolving"],
    challenges: ["High-pressure incidents", "On-call rotations", "Constant learning"],
    fitsMbti: ["ISTJ", "INTJ", "ISTP"],
    interestKeys: ["analytical", "technical"],
  },
  {
    name: "Product Manager",
    description: "Owns the vision, strategy and roadmap of a product, aligning teams to ship value.",
    responsibilities: ["Define product strategy", "Prioritize roadmap", "Talk to users", "Align engineering, design, marketing"],
    skills: ["Communication", "Strategic thinking", "Data literacy", "User research", "Prioritization"],
    majors: ["Business", "Computer Science", "Engineering", "Design", "Economics"],
    educationPath: "Any bachelor's → APM/associate PM → PM → senior PM → director of product.",
    salaryRange: "$100k – $250k+ (US)",
    outlook: "Strong demand in tech; very competitive at top companies.",
    advantages: ["High impact", "Cross-functional work", "Great compensation"],
    challenges: ["Accountability without authority", "Constant context switching", "Hard to break into"],
    fitsMbti: ["ENTJ", "ENTP", "ENFJ", "INTJ"],
    interestKeys: ["leadership", "communication", "analytical"],
  },
  {
    name: "UX / UI Designer",
    description: "Designs intuitive, beautiful interfaces and end-to-end product experiences.",
    responsibilities: ["User research", "Wireframes & prototypes", "Visual design", "Usability testing"],
    skills: ["Figma", "Design systems", "User research", "Typography", "Interaction design"],
    majors: ["Design", "HCI", "Psychology", "Computer Science"],
    educationPath: "Degree or bootcamp + portfolio → junior designer → senior → lead/principal.",
    salaryRange: "$70k – $180k (US)",
    outlook: "Healthy demand, especially in product-led companies.",
    advantages: ["Creative + analytical", "Visual results", "Strong remote potential"],
    challenges: ["Heavy iteration / critique", "Subjective feedback", "Saturated junior market"],
    fitsMbti: ["INFP", "ENFP", "ISFP", "INFJ"],
    interestKeys: ["creativity", "communication"],
  },
  {
    name: "Graphic Designer",
    description: "Creates visual content for brands, campaigns, packaging and digital media.",
    responsibilities: ["Brand identity", "Marketing collateral", "Social media graphics", "Print & digital layout"],
    skills: ["Adobe Suite / Figma", "Typography", "Color theory", "Composition", "Brand thinking"],
    majors: ["Graphic Design", "Visual Communication", "Fine Arts"],
    educationPath: "Degree or self-taught + strong portfolio → junior → senior → art director.",
    salaryRange: "$45k – $110k (US)",
    outlook: "Stable, but AI tools are reshaping junior roles.",
    advantages: ["Highly creative", "Freelance-friendly", "Visible impact"],
    challenges: ["Crowded market", "Tight deadlines", "Client revisions"],
    fitsMbti: ["ISFP", "INFP", "ENFP"],
    interestKeys: ["creativity"],
  },
  {
    name: "Psychologist",
    description: "Studies the mind and behavior; helps individuals improve mental health and wellbeing.",
    responsibilities: ["Counsel clients", "Conduct assessments", "Research behavior", "Develop treatment plans"],
    skills: ["Empathy", "Active listening", "Research methods", "Ethical reasoning"],
    majors: ["Psychology", "Cognitive Science", "Neuroscience"],
    educationPath: "Bachelor's → Master's or PhD/PsyD → licensure → practice.",
    salaryRange: "$60k – $140k (US)",
    outlook: "Growing — mental health awareness is rising.",
    advantages: ["Deeply meaningful", "Diverse settings (clinical, research, org)", "Lifelong learning"],
    challenges: ["Long education path", "Emotionally taxing", "Licensing requirements"],
    fitsMbti: ["INFJ", "INFP", "ENFJ"],
    interestKeys: ["eq", "communication", "curiosity"],
  },
  {
    name: "Journalist",
    description: "Investigates, writes and reports stories that inform the public.",
    responsibilities: ["Interview sources", "Research stories", "Write articles", "Fact-check"],
    skills: ["Writing", "Interviewing", "Research", "Curiosity", "News judgment"],
    majors: ["Journalism", "Communications", "Political Science", "English"],
    educationPath: "Degree + internships/clips → staff reporter → editor or freelance.",
    salaryRange: "$40k – $90k (US); higher at major outlets",
    outlook: "Disrupted industry; freelance & niche newsletters growing.",
    advantages: ["Meet fascinating people", "Public impact", "Travel & variety"],
    challenges: ["Modest pay early on", "Tight deadlines", "Industry instability"],
    fitsMbti: ["ENFP", "ENTP", "ENFJ"],
    interestKeys: ["communication", "curiosity"],
  },
  {
    name: "Marketing Specialist",
    description: "Plans and executes campaigns that grow awareness and revenue.",
    responsibilities: ["Run campaigns", "Content strategy", "SEO/SEM", "Analyze performance"],
    skills: ["Copywriting", "Analytics", "SEO", "Social media", "Brand strategy"],
    majors: ["Marketing", "Business", "Communications", "Psychology"],
    educationPath: "Bachelor's → coordinator → specialist → manager → director.",
    salaryRange: "$50k – $130k (US)",
    outlook: "Strong, especially for performance & content marketers.",
    advantages: ["Creative + analytical", "Many industries", "Measurable impact"],
    challenges: ["Channel changes fast", "Always-on culture", "Attribution is messy"],
    fitsMbti: ["ENFP", "ENTP", "ENFJ", "ESFP"],
    interestKeys: ["creativity", "communication"],
  },
  {
    name: "Public Relations Manager",
    description: "Shapes how organizations are perceived by media, customers and the public.",
    responsibilities: ["Media relations", "Crisis communications", "Press releases", "Spokesperson coaching"],
    skills: ["Writing", "Networking", "Strategic communication", "Composure under pressure"],
    majors: ["PR", "Communications", "Journalism", "Marketing"],
    educationPath: "Bachelor's + internships → coordinator → specialist → manager → director.",
    salaryRange: "$60k – $150k (US)",
    outlook: "Steady — every brand needs reputation management.",
    advantages: ["Dynamic & people-driven", "High visibility", "Crisis adrenaline"],
    challenges: ["High stress events", "Always 'on'", "Hard-to-measure outcomes"],
    fitsMbti: ["ENFJ", "ENTJ", "ENFP"],
    interestKeys: ["communication", "leadership"],
  },
  {
    name: "Teacher",
    description: "Educates and mentors students across subjects and age groups.",
    responsibilities: ["Plan lessons", "Teach classes", "Grade work", "Mentor students"],
    skills: ["Communication", "Patience", "Subject expertise", "Classroom management"],
    majors: ["Education", "Subject-specific (Math, History, etc.)"],
    educationPath: "Bachelor's + teaching credential → classroom teacher → department lead → principal.",
    salaryRange: "$45k – $90k (US, varies wildly by region)",
    outlook: "Stable demand; shortages in STEM and special ed.",
    advantages: ["Meaningful impact", "Summers / breaks", "Job security"],
    challenges: ["Modest pay", "Heavy admin load", "Emotional energy"],
    fitsMbti: ["ENFJ", "ESFJ", "INFJ", "ISFJ"],
    interestKeys: ["communication", "eq"],
  },
  {
    name: "Doctor",
    description: "Diagnoses and treats illness; one of the most respected professions.",
    responsibilities: ["See patients", "Diagnose & treat", "Order tests", "Coordinate care"],
    skills: ["Biology & medicine mastery", "Diagnostic reasoning", "Empathy", "Stamina"],
    majors: ["Pre-med (Biology, Chemistry)", "Biomedical Sciences"],
    educationPath: "Bachelor's → MCAT → 4-year medical school → 3–7 year residency → optional fellowship.",
    salaryRange: "$200k – $500k+ (US)",
    outlook: "Always in demand; long & expensive path.",
    advantages: ["Save lives", "High prestige & pay", "Many specialties"],
    challenges: ["Long, costly training", "High stress", "Long hours early in career"],
    fitsMbti: ["ISTJ", "ESTJ", "INFJ", "INTJ"],
    interestKeys: ["analytical", "eq"],
  },
  {
    name: "Business Analyst",
    description: "Bridges business needs and technical solutions to improve processes.",
    responsibilities: ["Gather requirements", "Process modeling", "Stakeholder workshops", "Translate needs to specs"],
    skills: ["Communication", "SQL", "Process design", "Documentation", "Critical thinking"],
    majors: ["Business", "Information Systems", "Economics", "Computer Science"],
    educationPath: "Bachelor's → junior BA → senior BA → product owner or consultant.",
    salaryRange: "$65k – $130k (US)",
    outlook: "Strong — every enterprise transformation needs BAs.",
    advantages: ["Cross-industry", "Mix of business + tech", "Clear ladder"],
    challenges: ["Stakeholder politics", "Lots of meetings", "Ambiguous scope"],
    fitsMbti: ["ENTJ", "INTJ", "ISTJ"],
    interestKeys: ["analytical", "communication"],
  },
  {
    name: "Entrepreneur",
    description: "Builds and runs ventures, taking on risk to create new value.",
    responsibilities: ["Set vision", "Raise capital", "Hire & lead team", "Sell & ship"],
    skills: ["Resilience", "Sales", "Strategy", "Storytelling", "Resourcefulness"],
    majors: ["Any — execution matters more than degree"],
    educationPath: "Optional degree → side projects → first venture → iterate. Many top founders are self-taught.",
    salaryRange: "$0 – $∞ (long tail; most ventures fail; the winners go very far)",
    outlook: "Always relevant; tooling now lowers the barrier dramatically.",
    advantages: ["Total ownership", "Unlimited upside", "Build what you believe in"],
    challenges: ["High failure rate", "Income volatility", "Mental load 24/7"],
    fitsMbti: ["ENTJ", "ENTP", "INTJ", "ESTP"],
    interestKeys: ["leadership", "creativity", "curiosity"],
  },
  {
    name: "Accountant",
    description: "Manages financial records, ensures compliance and advises on financial strategy.",
    responsibilities: ["Bookkeeping", "Tax filing", "Audits", "Financial reporting"],
    skills: ["Attention to detail", "Math literacy", "Accounting software", "Ethics"],
    majors: ["Accounting", "Finance", "Business"],
    educationPath: "Bachelor's → CPA exam → staff accountant → senior → manager → partner.",
    salaryRange: "$55k – $130k (US); higher with CPA & specialization",
    outlook: "Stable; automation reshaping entry-level.",
    advantages: ["Reliable demand", "Clear path to CPA", "Many industries"],
    challenges: ["Seasonal crunch (tax season)", "Detail fatigue", "Compliance pressure"],
    fitsMbti: ["ISTJ", "ESTJ", "ISFJ"],
    interestKeys: ["analytical", "organization"],
  },
  {
    name: "Lawyer",
    description: "Advises clients on legal matters and represents them in negotiations and court.",
    responsibilities: ["Research law", "Draft contracts", "Negotiate", "Litigate"],
    skills: ["Argumentation", "Writing", "Research", "Ethical reasoning"],
    majors: ["Pre-law (Political Science, History, English)", "Any rigorous discipline"],
    educationPath: "Bachelor's → LSAT → 3-year JD → bar exam → associate → partner.",
    salaryRange: "$70k – $300k+ (US, depends on firm/specialty)",
    outlook: "Competitive at top end; strong in corporate, tech, IP law.",
    advantages: ["Prestige", "Intellectual challenge", "High pay in BigLaw"],
    challenges: ["Long hours", "High debt", "Stress + ethical weight"],
    fitsMbti: ["ENTJ", "INTJ", "ESTJ", "ENTP"],
    interestKeys: ["analytical", "communication"],
  },
];

const CAREER_INDEX = new Map(CAREERS.map((c) => [c.name.toLowerCase(), c]));

export function findCareer(query: string): CareerInfo | null {
  const q = query.toLowerCase();
  for (const c of CAREERS) {
    if (q.includes(c.name.toLowerCase())) return c;
  }
  // common aliases
  const aliases: Record<string, string> = {
    coder: "Software Engineer",
    programmer: "Software Engineer",
    developer: "Software Engineer",
    "data scientist": "Data Scientist",
    designer: "UX / UI Designer",
    ux: "UX / UI Designer",
    ui: "UX / UI Designer",
    marketing: "Marketing Specialist",
    pr: "Public Relations Manager",
    physician: "Doctor",
    md: "Doctor",
    ceo: "Entrepreneur",
    founder: "Entrepreneur",
    attorney: "Lawyer",
  };
  for (const [k, v] of Object.entries(aliases)) {
    if (q.includes(k)) return CAREER_INDEX.get(v.toLowerCase()) ?? null;
  }
  return null;
}

// ---------- Personalization context ----------
export type AbbiAgeGroup = "child" | "teen" | "adult";
export type TopCareer = { name: string; match: number; reason?: string };
export type AbbiContext = {
  mbtiType?: string | null;
  iqScore?: number | null;
  topStrengths?: string[];
  topInterests?: string[]; // e.g. ["analytical","creativity"]
  weaknesses?: string[];
  topCareers?: TopCareer[];
  ageGroup?: AbbiAgeGroup | null;
  firstName?: string | null;
};

function personalizeFor(career: CareerInfo, ctx: AbbiContext): string | null {
  const reasons: string[] = [];
  if (ctx.mbtiType && career.fitsMbti?.includes(ctx.mbtiType)) {
    reasons.push(`your personality type **${ctx.mbtiType}** is a strong fit`);
  }
  const overlap = (career.interestKeys ?? []).filter((k) => ctx.topInterests?.includes(k));
  if (overlap.length) reasons.push(`your standout abilities in ${overlap.join(" & ")}`);
  if (ctx.iqScore && ctx.iqScore >= 115 && (career.interestKeys?.includes("analytical") || career.interestKeys?.includes("technical"))) {
    reasons.push(`your above-average cognitive score (${ctx.iqScore})`);
  }
  if (!reasons.length) return null;
  return `Based on your assessment, **${career.name}** is a strong match — ${reasons.join(", ")}.`;
}

// ---------- Suggested quick prompts ----------
export const ABBI_SUGGESTIONS = [
  "What does a Software Engineer do?",
  "How much can a Data Analyst earn?",
  "Is Marketing a good career?",
  "What skills should I learn?",
  "What universities are best for Computer Science?",
  "What jobs fit introverts?",
  "What jobs fit extroverts?",
  "How can I prepare for IELTS?",
  "How can I prepare for SAT?",
  "What should I study to become a CEO?",
  "What career fits me best?",
  "How can I improve my leadership skills?",
];

// ---------- Response engine ----------
function md(career: CareerInfo): string {
  return [
    `### ${career.name}`,
    career.description,
    "",
    `**What they do**`,
    ...career.responsibilities.map((r) => `- ${r}`),
    "",
    `**Key skills**: ${career.skills.join(", ")}`,
    `**Recommended majors**: ${career.majors.join(", ")}`,
    `**Education path**: ${career.educationPath}`,
    `**Salary range**: ${career.salaryRange}`,
    `**Outlook**: ${career.outlook}`,
    "",
    `**Advantages**`,
    ...career.advantages.map((a) => `- ${a}`),
    "",
    `**Challenges**`,
    ...career.challenges.map((c) => `- ${c}`),
  ].join("\n");
}

function universitiesFor(query: string): string | null {
  const q = query.toLowerCase();
  if (q.includes("computer science") || q.includes("software") || q.includes("cs")) {
    return [
      "### Top universities for Computer Science",
      "- **MIT** — Cambridge, USA",
      "- **Stanford University** — California, USA",
      "- **Carnegie Mellon University** — Pittsburgh, USA",
      "- **ETH Zürich** — Switzerland",
      "- **University of Cambridge** — UK",
      "- **National University of Singapore** — Singapore",
      "",
      "Most accept strong SAT (1450+), top math grades, and a portfolio or olympiad results.",
    ].join("\n");
  }
  if (q.includes("business") || q.includes("mba")) {
    return [
      "### Top universities for Business",
      "- **Harvard Business School**",
      "- **Wharton (UPenn)**",
      "- **Stanford GSB**",
      "- **London Business School**",
      "- **INSEAD** — France/Singapore",
    ].join("\n");
  }
  if (q.includes("medicine") || q.includes("medical") || q.includes("doctor")) {
    return [
      "### Top universities for Medicine",
      "- **Johns Hopkins** — USA",
      "- **Harvard Medical School**",
      "- **University of Oxford** — UK",
      "- **Karolinska Institutet** — Sweden",
      "- **UCLA** — USA",
    ].join("\n");
  }
  if (q.includes("design")) {
    return [
      "### Top universities for Design",
      "- **Rhode Island School of Design (RISD)**",
      "- **Parsons School of Design**",
      "- **Royal College of Art** — London",
      "- **Aalto University** — Helsinki",
    ].join("\n");
  }
  return null;
}

function satGuide(): string {
  return [
    "### SAT Preparation Plan",
    "**Total score**: 1600 (Math 800 + Reading & Writing 800)",
    "",
    "**3-month plan**",
    "1. **Diagnostic test** — full-length SAT (Khan Academy / Bluebook).",
    "2. **Weeks 1–4**: master fundamentals — algebra, geometry, grammar rules, reading strategies.",
    "3. **Weeks 5–8**: timed sectional drills; review every wrong answer.",
    "4. **Weeks 9–12**: full-length practice tests every weekend; refine pacing.",
    "",
    "**Resources**: Khan Academy (free, official partner), College Board Bluebook app, *The Official SAT Study Guide*.",
    "",
    "**Target scores**: 1200+ solid; 1400+ competitive; 1500+ Ivy-tier.",
  ].join("\n");
}

function ieltsGuide(): string {
  return [
    "### IELTS Preparation Plan",
    "**4 modules**: Listening, Reading, Writing, Speaking — each scored 0–9.",
    "",
    "**8-week plan**",
    "1. **Week 1**: take a diagnostic — identify your weakest module.",
    "2. **Weeks 2–4**: focused drills on each module (Cambridge IELTS books 15–18).",
    "3. **Weeks 5–6**: writing — 1 Task 1 + 1 Task 2 daily, get feedback.",
    "4. **Weeks 7–8**: full mock tests under timed conditions.",
    "",
    "**Speaking**: practice aloud daily for 10 minutes — record yourself.",
    "**Writing**: study Band 8/9 sample answers; learn linking phrases.",
    "",
    "**Targets**: 6.5+ for most universities; 7.0+ for top-tier programs.",
  ].join("\n");
}

function leadershipGuide(): string {
  return [
    "### How to grow as a leader",
    "1. **Lead a small project first** — even a school club or study group.",
    "2. **Read** *Extreme Ownership* (Willink) and *The Making of a Manager* (Zhuo).",
    "3. **Develop emotional intelligence** — practice listening more than talking.",
    "4. **Communicate vision clearly** — write 1-page weekly updates.",
    "5. **Mentor someone** — teaching forces clarity.",
    "6. **Take initiative** — leaders are people who move *before* being asked.",
  ].join("\n");
}

function introvertExtrovertFit(introvert: boolean): string {
  return introvert
    ? [
        "### Careers that suit introverts",
        "- **Software Engineer** — deep focus, mostly written collaboration.",
        "- **Data Scientist / Analyst** — analytical and solo-friendly.",
        "- **UX Researcher** — 1:1 user interviews, deep analysis.",
        "- **Writer / Journalist** — independent craft.",
        "- **Accountant** — structured and detail-driven.",
        "- **Cybersecurity Specialist** — investigation-heavy.",
      ].join("\n")
    : [
        "### Careers that suit extroverts",
        "- **Marketing Specialist** — networking, storytelling, campaigns.",
        "- **Public Relations Manager** — media + communications.",
        "- **Sales / Business Development** — relationship-driven.",
        "- **Product Manager** — constant cross-team collaboration.",
        "- **Teacher** — daily human energy exchange.",
        "- **Entrepreneur** — selling vision to investors, customers, hires.",
      ].join("\n");
}

function ceoPath(): string {
  return [
    "### Path to becoming a CEO",
    "There is no single path, but these are the most reliable ingredients:",
    "1. **Pick a domain you'd happily study for 10 years** — finance, tech, healthcare, retail, etc.",
    "2. **Build deep operating experience** — start in a function (product, sales, finance) and master it.",
    "3. **Study business broadly** — economics, accounting, strategy. An MBA helps for traditional paths.",
    "4. **Develop leadership early** — manage people, own P&L, lead initiatives.",
    "5. **Or: start your own company** — the fastest way to be a CEO is to build one.",
    "",
    "**Recommended majors**: Business, Economics, Engineering, Computer Science.",
    "**Recommended reads**: *Good to Great*, *The Hard Thing About Hard Things*, *Measure What Matters*.",
  ].join("\n");
}

function bestFitFromContext(ctx: AbbiContext): string {
  if (!ctx.mbtiType && !ctx.topInterests?.length) {
    return [
      "I'd love to give you a personalized answer — but you haven't completed your assessment yet.",
      "",
      "Take the **Abilitio Assessment** first, then ask me again and I'll match you to careers based on your real IQ, personality and interests.",
    ].join("\n");
  }
  const ranked = CAREERS
    .map((c) => {
      let score = 0;
      if (ctx.mbtiType && c.fitsMbti?.includes(ctx.mbtiType)) score += 3;
      score += (c.interestKeys ?? []).filter((k) => ctx.topInterests?.includes(k)).length;
      return { c, score };
    })
    .sort((a, b) => b.score - a.score)
    .filter((x) => x.score > 0)
    .slice(0, 3);

  if (!ranked.length) {
    return "Based on your profile, you have a broad range of options — try asking me about a specific career like *Software Engineer* or *Marketing Specialist*.";
  }
  return [
    `### Your top career matches`,
    ...ranked.map(({ c }, i) => `**${i + 1}. ${c.name}** — ${c.description}`),
    "",
    ctx.mbtiType ? `These align with your **${ctx.mbtiType}** personality and your standout abilities.` : "",
  ].filter(Boolean).join("\n");
}

function skillsToLearn(ctx: AbbiContext): string {
  const focus = ctx.topInterests?.[0];
  const base = [
    "### Skills worth learning in 2026",
    "- **Critical thinking** — the most transferable skill of all.",
    "- **Writing clearly** — a multiplier in every career.",
    "- **Basic data literacy** — SQL + spreadsheets.",
    "- **AI fluency** — prompt design, evaluating model output.",
    "- **One programming language** — Python is the safest bet.",
    "- **Public speaking** — careers compound when you can present.",
  ];
  if (focus === "creativity") base.push("- **Design fundamentals** — typography, layout, color.");
  if (focus === "leadership") base.push("- **Negotiation & coaching** — read *Never Split the Difference*.");
  return base.join("\n");
}

const GREETING = [
  "👋 Hi! I'm **ABBI**, your AI career mentor. Ask me about any career, university or skill — I've got you.",
  "Welcome 👋 I'm **ABBI**. Ask me anything about careers, education, SAT/IELTS prep or growth — let's build your future.",
];

export function abbiGreeting(): string {
  return GREETING[Math.floor(Math.random() * GREETING.length)];
}

export function generateAbbiReply(message: string, ctx: AbbiContext): string {
  const q = message.trim().toLowerCase();

  // Greetings / smalltalk
  if (/^(hi|hello|hey|salom|assalom)/i.test(q)) {
    return `${abbiGreeting()}\n\nTry one of the suggested questions below to get started.`;
  }

  // Best-fit personalization
  if (q.includes("career fits me") || q.includes("best career for me") || q.includes("which career")) {
    return bestFitFromContext(ctx);
  }

  // SAT / IELTS
  if (q.includes("sat")) return satGuide();
  if (q.includes("ielts")) return ieltsGuide();

  // Personality fit
  if (q.includes("introvert")) return introvertExtrovertFit(true);
  if (q.includes("extrovert") || q.includes("extravert")) return introvertExtrovertFit(false);

  // Leadership / productivity
  if (q.includes("leadership") || q.includes("leader")) return leadershipGuide();
  if (q.includes("productive") || q.includes("productivity")) {
    return [
      "### Boost your productivity",
      "- **Plan tomorrow tonight** — pick your 3 most important tasks.",
      "- **Deep work blocks** — two 90-minute focused sessions daily.",
      "- **Cut inputs** — fewer notifications, more output.",
      "- **Track energy, not hours** — sleep 8h, walk 30m, hydrate.",
      "- **Weekly review** — Sunday: what worked, what didn't, what's next.",
    ].join("\n");
  }

  // CEO / entrepreneurship
  if (q.includes("ceo") || q.includes("startup founder") || q.includes("become a founder")) return ceoPath();

  // Skills
  if (q.includes("skill") && (q.includes("should") || q.includes("learn") || q.includes("important"))) {
    return skillsToLearn(ctx);
  }

  // University recommendations
  const uniAnswer = q.includes("universit") || q.includes("college") ? universitiesFor(q) : null;
  if (uniAnswer) return uniAnswer;

  // Career lookup
  const career = findCareer(q);
  if (career) {
    const personalized = personalizeFor(career, ctx);
    const body = md(career);
    return personalized ? `${personalized}\n\n${body}` : body;
  }

  // Salary fallback if career not matched but "earn/salary" detected
  if (q.includes("salary") || q.includes("earn")) {
    return "I can share salary ranges for any specific career — try asking me *How much does a Software Engineer earn?* or another role from the list below.";
  }

  // Default reflective answer
  return [
    "That's a great question. Here's how I can help:",
    "- Ask about a **specific career** (Software Engineer, Designer, Doctor, Lawyer, etc.) — I'll explain skills, education, salary and outlook.",
    "- Ask about **SAT** or **IELTS** prep plans.",
    "- Ask **what career fits me best** to get a personalized match (works best after completing the Abilitio Assessment).",
    "- Ask about **universities** for a major (e.g. Computer Science, Business, Medicine).",
    "",
    "Try one of the suggested prompts below 👇",
  ].join("\n");
}
