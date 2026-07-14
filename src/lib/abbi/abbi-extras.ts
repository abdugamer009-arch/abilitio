// Lightweight knowledge bases for premium AI-style features (no paid LLM).
// All data is static / derivable so ABBI v1 can render without external APIs.

export type University = {
  name: string;
  country: string;
  city: string;
  minSat: number;
  minIelts: number;
  majors: string[];
  competitiveness: "Reach" | "Match" | "Safety";
  scholarship: string;
  acceptance: number; // %
};

export const UNIVERSITIES: University[] = [
  { name: "Harvard University", country: "USA", city: "Cambridge", minSat: 1500, minIelts: 7.5, majors: ["Computer Science","Business","Psychology","Medicine"], competitiveness: "Reach", scholarship: "Need-based full-ride available", acceptance: 4 },
  { name: "MIT", country: "USA", city: "Cambridge", minSat: 1520, minIelts: 7.0, majors: ["Computer Science","Engineering","Physics","Mathematics"], competitiveness: "Reach", scholarship: "Need-based aid up to 100%", acceptance: 7 },
  { name: "Stanford University", country: "USA", city: "Stanford", minSat: 1500, minIelts: 7.0, majors: ["Computer Science","Business","Engineering","Design"], competitiveness: "Reach", scholarship: "Generous need-based", acceptance: 5 },
  { name: "University of Oxford", country: "UK", city: "Oxford", minSat: 1470, minIelts: 7.5, majors: ["Philosophy","Law","Medicine","Computer Science"], competitiveness: "Reach", scholarship: "Reach Oxford / Clarendon", acceptance: 17 },
  { name: "University of Cambridge", country: "UK", city: "Cambridge", minSat: 1470, minIelts: 7.5, majors: ["Mathematics","Engineering","Natural Sciences","Economics"], competitiveness: "Reach", scholarship: "Gates Cambridge", acceptance: 18 },
  { name: "Imperial College London", country: "UK", city: "London", minSat: 1430, minIelts: 7.0, majors: ["Engineering","Medicine","Computer Science","Business"], competitiveness: "Match", scholarship: "President's Undergraduate", acceptance: 14 },
  { name: "University of Toronto", country: "Canada", city: "Toronto", minSat: 1330, minIelts: 6.5, majors: ["Computer Science","Engineering","Business","Life Sciences"], competitiveness: "Match", scholarship: "Lester B. Pearson (full)", acceptance: 43 },
  { name: "UBC", country: "Canada", city: "Vancouver", minSat: 1300, minIelts: 6.5, majors: ["Computer Science","Forestry","Business","Arts"], competitiveness: "Match", scholarship: "International Major Entrance", acceptance: 52 },
  { name: "NUS", country: "Singapore", city: "Singapore", minSat: 1400, minIelts: 6.5, majors: ["Computer Science","Engineering","Business","Medicine"], competitiveness: "Reach", scholarship: "ASEAN / Science & Tech", acceptance: 5 },
  { name: "ETH Zürich", country: "Switzerland", city: "Zürich", minSat: 1400, minIelts: 7.0, majors: ["Computer Science","Engineering","Physics","Architecture"], competitiveness: "Reach", scholarship: "Excellence Scholarship", acceptance: 27 },
  { name: "TU Munich", country: "Germany", city: "Munich", minSat: 1250, minIelts: 6.5, majors: ["Engineering","Computer Science","Mathematics","Business"], competitiveness: "Match", scholarship: "Deutschlandstipendium", acceptance: 60 },
  { name: "KAIST", country: "South Korea", city: "Daejeon", minSat: 1300, minIelts: 6.5, majors: ["Engineering","Computer Science","Business","Science"], competitiveness: "Match", scholarship: "KAIST International Scholarship", acceptance: 30 },
  { name: "University of Tokyo", country: "Japan", city: "Tokyo", minSat: 1350, minIelts: 7.0, majors: ["Engineering","Science","Economics","Medicine"], competitiveness: "Reach", scholarship: "MEXT scholarship", acceptance: 34 },
  { name: "Sciences Po", country: "France", city: "Paris", minSat: 1300, minIelts: 7.0, majors: ["Political Science","Economics","International Affairs","Law"], competitiveness: "Match", scholarship: "Émile Boutmy", acceptance: 30 },
  { name: "University of Melbourne", country: "Australia", city: "Melbourne", minSat: 1280, minIelts: 6.5, majors: ["Business","Arts","Engineering","Medicine"], competitiveness: "Match", scholarship: "Melbourne International", acceptance: 70 },
  { name: "University of Amsterdam", country: "Netherlands", city: "Amsterdam", minSat: 1200, minIelts: 6.5, majors: ["Psychology","Business","Communication","Computer Science"], competitiveness: "Safety", scholarship: "Amsterdam Merit", acceptance: 78 },
  { name: "Bocconi University", country: "Italy", city: "Milan", minSat: 1300, minIelts: 6.5, majors: ["Business","Economics","Finance","Management"], competitiveness: "Match", scholarship: "Bocconi Merit Award", acceptance: 50 },
  { name: "Westminster International University in Tashkent", country: "Uzbekistan", city: "Tashkent", minSat: 1100, minIelts: 5.5, majors: ["Business","Economics","Law","Computer Science"], competitiveness: "Safety", scholarship: "Rector's Scholarship", acceptance: 80 },
  { name: "Inha University in Tashkent", country: "Uzbekistan", city: "Tashkent", minSat: 1050, minIelts: 5.5, majors: ["Computer Science","Logistics","Business"], competitiveness: "Safety", scholarship: "Academic Excellence", acceptance: 85 },
  { name: "Webster University Tashkent", country: "Uzbekistan", city: "Tashkent", minSat: 1050, minIelts: 5.5, majors: ["Business","Media Production","Psychology"], competitiveness: "Safety", scholarship: "Webster Global", acceptance: 85 },

  // ---- United States ----
  { name: "UC Berkeley", country: "USA", city: "Berkeley", minSat: 1440, minIelts: 7.0, majors: ["Computer Science","Data Science","Business","Statistics","Political Science"], competitiveness: "Reach", scholarship: "Regents' Scholarship", acceptance: 11 },
  { name: "Georgia Tech", country: "USA", city: "Atlanta", minSat: 1400, minIelts: 6.5, majors: ["Computer Science","Artificial Intelligence","Mechanical Engineering","Electrical Engineering","Applied Engineering"], competitiveness: "Reach", scholarship: "Stamps President's Scholars", acceptance: 16 },
  { name: "Purdue University", country: "USA", city: "West Lafayette", minSat: 1300, minIelts: 6.5, majors: ["Aviation","Mechanical Engineering","Agronomy","Computer Science"], competitiveness: "Match", scholarship: "Trustees Scholarship", acceptance: 50 },
  { name: "New York University", country: "USA", city: "New York", minSat: 1400, minIelts: 7.0, majors: ["Business","Film","Performing Arts","Economics"], competitiveness: "Reach", scholarship: "AnBryce Scholarship", acceptance: 12 },
  { name: "University of Michigan", country: "USA", city: "Ann Arbor", minSat: 1400, minIelts: 7.0, majors: ["Business","Medicine","Mechanical Engineering","Public Administration"], competitiveness: "Reach", scholarship: "Merit-based aid", acceptance: 18 },
  { name: "Penn State University", country: "USA", city: "State College", minSat: 1250, minIelts: 6.5, majors: ["Hospitality Management","Agronomy","Criminology","Engineering"], competitiveness: "Match", scholarship: "Provost Award", acceptance: 55 },
  { name: "Arizona State University", country: "USA", city: "Tempe", minSat: 1150, minIelts: 6.0, majors: ["Business","Journalism","Criminology","Nursing"], competitiveness: "Safety", scholarship: "New American University", acceptance: 88 },
  { name: "Embry-Riddle Aeronautical University", country: "USA", city: "Daytona Beach", minSat: 1200, minIelts: 6.0, majors: ["Aviation","Applied Engineering","Logistics"], competitiveness: "Match", scholarship: "Eagle Scholarship", acceptance: 61 },
  { name: "Culinary Institute of America", country: "USA", city: "Hyde Park", minSat: 1000, minIelts: 6.0, majors: ["Culinary Arts","Hospitality Management","Business"], competitiveness: "Match", scholarship: "CIA Grants", acceptance: 95 },
  { name: "The Juilliard School", country: "USA", city: "New York", minSat: 1100, minIelts: 7.0, majors: ["Music","Performing Arts"], competitiveness: "Reach", scholarship: "Kovner Fellowship", acceptance: 7 },
  { name: "Johns Hopkins University", country: "USA", city: "Baltimore", minSat: 1500, minIelts: 7.0, majors: ["Medicine","Nursing","Biomedical Engineering","Biology"], competitiveness: "Reach", scholarship: "Need-based full aid", acceptance: 7 },
  { name: "Babson College", country: "USA", city: "Wellesley", minSat: 1300, minIelts: 6.5, majors: ["Entrepreneurship","Business","Finance"], competitiveness: "Match", scholarship: "Weissman Scholarship", acceptance: 22 },

  // ---- United Kingdom ----
  { name: "London School of Economics", country: "UK", city: "London", minSat: 1450, minIelts: 7.0, majors: ["Economics","Political Science","Sociology","Finance","Statistics"], competitiveness: "Reach", scholarship: "LSE Undergraduate Support", acceptance: 9 },
  { name: "University College London", country: "UK", city: "London", minSat: 1400, minIelts: 7.0, majors: ["Law","Architecture","Medicine","Psychology","Linguistics"], competitiveness: "Reach", scholarship: "UCL Global Scholarship", acceptance: 30 },
  { name: "University of Edinburgh", country: "UK", city: "Edinburgh", minSat: 1350, minIelts: 6.5, majors: ["Veterinary Medicine","Linguistics","History","Medicine"], competitiveness: "Match", scholarship: "Edinburgh Global", acceptance: 40 },
  { name: "King's College London", country: "UK", city: "London", minSat: 1350, minIelts: 7.0, majors: ["Law","Nursing","Dentistry","International Relations"], competitiveness: "Match", scholarship: "King's International", acceptance: 35 },
  { name: "University of Manchester", country: "UK", city: "Manchester", minSat: 1300, minIelts: 6.5, majors: ["Engineering","Business","Data Science","Chemistry"], competitiveness: "Match", scholarship: "Global Futures Scholarship", acceptance: 56 },
  { name: "University of the Arts London", country: "UK", city: "London", minSat: 1100, minIelts: 6.5, majors: ["Fashion Design","Design","Media Production","Performing Arts"], competitiveness: "Match", scholarship: "UAL International", acceptance: 42 },
  { name: "Royal Agricultural University", country: "UK", city: "Cirencester", minSat: 1050, minIelts: 6.0, majors: ["Agronomy","Business","Environmental Science"], competitiveness: "Safety", scholarship: "RAU Bursaries", acceptance: 75 },

  // ---- Canada ----
  { name: "McGill University", country: "Canada", city: "Montreal", minSat: 1350, minIelts: 6.5, majors: ["Medicine","Law","Music","Psychology"], competitiveness: "Match", scholarship: "Major Entrance Scholarship", acceptance: 46 },
  { name: "University of Waterloo", country: "Canada", city: "Waterloo", minSat: 1350, minIelts: 6.5, majors: ["Computer Science","Software Engineering","Mathematics","Statistics"], competitiveness: "Match", scholarship: "President's Scholarship", acceptance: 53 },
  { name: "University of Guelph", country: "Canada", city: "Guelph", minSat: 1150, minIelts: 6.5, majors: ["Veterinary Medicine","Agronomy","Hospitality Management"], competitiveness: "Safety", scholarship: "International Entrance", acceptance: 66 },

  // ---- Europe ----
  { name: "TU Delft", country: "Netherlands", city: "Delft", minSat: 1350, minIelts: 6.5, majors: ["Civil Engineering","Architecture","Aviation","Applied Engineering"], competitiveness: "Match", scholarship: "Justus & Louise van Effen", acceptance: 65 },
  { name: "Wageningen University", country: "Netherlands", city: "Wageningen", minSat: 1200, minIelts: 6.5, majors: ["Agronomy","Environmental Science","Biology"], competitiveness: "Match", scholarship: "Anne van den Ban Fund", acceptance: 70 },
  { name: "KU Leuven", country: "Belgium", city: "Leuven", minSat: 1250, minIelts: 6.5, majors: ["Medicine","Law","Statistics","Biomedical Engineering"], competitiveness: "Match", scholarship: "Science@Leuven", acceptance: 72 },
  { name: "Karolinska Institute", country: "Sweden", city: "Stockholm", minSat: 1350, minIelts: 6.5, majors: ["Medicine","Nursing","Allied Health","Biology"], competitiveness: "Reach", scholarship: "KI Scholarships", acceptance: 25 },
  { name: "Technical University of Denmark", country: "Denmark", city: "Copenhagen", minSat: 1300, minIelts: 6.5, majors: ["Electrical Engineering","Environmental Science","Applied Engineering"], competitiveness: "Match", scholarship: "DTU Scholarships", acceptance: 60 },
  { name: "Politecnico di Milano", country: "Italy", city: "Milan", minSat: 1250, minIelts: 6.0, majors: ["Architecture","Design","Civil Engineering","Fashion Design"], competitiveness: "Match", scholarship: "Merit-based fee waiver", acceptance: 58 },
  { name: "University of Vienna", country: "Austria", city: "Vienna", minSat: 1200, minIelts: 6.5, majors: ["Psychology","History","Linguistics","Political Science"], competitiveness: "Match", scholarship: "Ernst Mach Grant", acceptance: 70 },
  { name: "Charles University", country: "Czech Republic", city: "Prague", minSat: 1150, minIelts: 6.0, majors: ["Medicine","History","Sociology","Pharmacy"], competitiveness: "Safety", scholarship: "Government Scholarship", acceptance: 72 },
  { name: "Warsaw University of Technology", country: "Poland", city: "Warsaw", minSat: 1100, minIelts: 6.0, majors: ["Applied Engineering","Computer Science","Logistics"], competitiveness: "Safety", scholarship: "Ignacy Łukasiewicz", acceptance: 78 },
  { name: "EHL Hospitality Business School", country: "Switzerland", city: "Lausanne", minSat: 1200, minIelts: 6.5, majors: ["Hospitality Management","Business","Entrepreneurship"], competitiveness: "Match", scholarship: "EHL Excellence", acceptance: 33 },
  { name: "Les Roches", country: "Switzerland", city: "Crans-Montana", minSat: 1050, minIelts: 5.5, majors: ["Hospitality Management","Culinary Arts","Business"], competitiveness: "Safety", scholarship: "Les Roches Merit", acceptance: 80 },
  { name: "RWTH Aachen University", country: "Germany", city: "Aachen", minSat: 1250, minIelts: 6.5, majors: ["Mechanical Engineering","Electrical Engineering","Applied Engineering"], competitiveness: "Match", scholarship: "Deutschlandstipendium", acceptance: 55 },
  { name: "Humboldt University of Berlin", country: "Germany", city: "Berlin", minSat: 1200, minIelts: 6.5, majors: ["History","Linguistics","Law","Sociology"], competitiveness: "Match", scholarship: "DAAD Programs", acceptance: 60 },

  // ---- Asia ----
  { name: "Tsinghua University", country: "China", city: "Beijing", minSat: 1480, minIelts: 7.0, majors: ["Engineering","Computer Science","Architecture","Public Administration"], competitiveness: "Reach", scholarship: "Chinese Government Scholarship", acceptance: 8 },
  { name: "Peking University", country: "China", city: "Beijing", minSat: 1470, minIelts: 7.0, majors: ["Economics","Law","Chemistry","International Relations"], competitiveness: "Reach", scholarship: "CSC Scholarship", acceptance: 9 },
  { name: "University of Hong Kong", country: "Hong Kong", city: "Hong Kong", minSat: 1400, minIelts: 6.5, majors: ["Medicine","Dentistry","Business","Law"], competitiveness: "Reach", scholarship: "HKU Foundation", acceptance: 18 },
  { name: "Nanyang Technological University", country: "Singapore", city: "Singapore", minSat: 1380, minIelts: 6.5, majors: ["Engineering","Artificial Intelligence","Media Production","Sports Science","Business"], competitiveness: "Reach", scholarship: "NTU Scholarship", acceptance: 25 },
  { name: "Seoul National University", country: "South Korea", city: "Seoul", minSat: 1400, minIelts: 6.5, majors: ["Medicine","Engineering","Music","Agronomy"], competitiveness: "Reach", scholarship: "SNU Global Scholarship", acceptance: 15 },
  { name: "Keio University", country: "Japan", city: "Tokyo", minSat: 1300, minIelts: 6.5, majors: ["Economics","Law","Medicine","Media Production"], competitiveness: "Match", scholarship: "Keio iPEARL", acceptance: 35 },
  { name: "Hong Kong Polytechnic University", country: "Hong Kong", city: "Hong Kong", minSat: 1250, minIelts: 6.0, majors: ["Hospitality Management","Design","Nursing","Allied Health","Logistics"], competitiveness: "Match", scholarship: "PolyU Entry Scholarship", acceptance: 49 },
  { name: "Universiti Malaya", country: "Malaysia", city: "Kuala Lumpur", minSat: 1200, minIelts: 6.0, majors: ["Medicine","Engineering","Linguistics","Business"], competitiveness: "Safety", scholarship: "UM Excellence", acceptance: 70 },

  // ---- Turkiye & Central Asia ----
  { name: "Koç University", country: "Turkiye", city: "Istanbul", minSat: 1300, minIelts: 6.5, majors: ["Business","Medicine","Law","Psychology"], competitiveness: "Match", scholarship: "Merit tuition waivers", acceptance: 40 },
  { name: "Middle East Technical University", country: "Turkiye", city: "Ankara", minSat: 1250, minIelts: 6.5, majors: ["Engineering","Architecture","Physics","Statistics"], competitiveness: "Match", scholarship: "METU Scholarships", acceptance: 55 },
  { name: "Nazarbayev University", country: "Kazakhstan", city: "Astana", minSat: 1250, minIelts: 6.5, majors: ["Engineering","Medicine","Public Administration","Computer Science"], competitiveness: "Match", scholarship: "Full state funding", acceptance: 45 },
  { name: "Al-Farabi Kazakh National University", country: "Kazakhstan", city: "Almaty", minSat: 1050, minIelts: 5.5, majors: ["Law","Journalism","Biology","International Relations"], competitiveness: "Safety", scholarship: "State Grants", acceptance: 82 },

  // ---- Uzbekistan ----
  { name: "Tashkent University of Information Technologies", country: "Uzbekistan", city: "Tashkent", minSat: 1000, minIelts: 5.5, majors: ["Computer Science","Software Engineering","Artificial Intelligence","Data Science","Applied Engineering"], competitiveness: "Safety", scholarship: "State Grants", acceptance: 85 },
  { name: "New Uzbekistan University", country: "Uzbekistan", city: "Tashkent", minSat: 1150, minIelts: 6.0, majors: ["Engineering","Computer Science","Economics"], competitiveness: "Safety", scholarship: "Presidential Scholarship", acceptance: 70 },
  { name: "Tashkent Medical Academy", country: "Uzbekistan", city: "Tashkent", minSat: 1050, minIelts: 5.5, majors: ["Medicine","Nursing","Pharmacy","Dentistry"], competitiveness: "Safety", scholarship: "State Grants", acceptance: 80 },
  { name: "Tashkent State University of Economics", country: "Uzbekistan", city: "Tashkent", minSat: 1000, minIelts: 5.5, majors: ["Economics","Finance","Logistics","Marketing","Human Resources"], competitiveness: "Safety", scholarship: "State Grants", acceptance: 88 },
  { name: "Tashkent State Agrarian University", country: "Uzbekistan", city: "Tashkent", minSat: 950, minIelts: 5.0, majors: ["Agronomy","Veterinary Medicine","Environmental Science"], competitiveness: "Safety", scholarship: "State Grants", acceptance: 90 },
  { name: "Uzbek State University of World Languages", country: "Uzbekistan", city: "Tashkent", minSat: 1000, minIelts: 5.5, majors: ["Linguistics","Education","Journalism","International Relations"], competitiveness: "Safety", scholarship: "State Grants", acceptance: 85 },
  { name: "Tashkent State Technical University", country: "Uzbekistan", city: "Tashkent", minSat: 1000, minIelts: 5.5, majors: ["Mechanical Engineering","Electrical Engineering","Earth Sciences","Applied Engineering"], competitiveness: "Safety", scholarship: "State Grants", acceptance: 87 },
  { name: "Turin Polytechnic University in Tashkent", country: "Uzbekistan", city: "Tashkent", minSat: 1050, minIelts: 5.5, majors: ["Mechanical Engineering","Civil Engineering","Applied Engineering"], competitiveness: "Safety", scholarship: "Merit discounts", acceptance: 82 },
  { name: "Central Asian University", country: "Uzbekistan", city: "Tashkent", minSat: 1050, minIelts: 5.5, majors: ["Medicine","Business","Computer Science","Dentistry"], competitiveness: "Safety", scholarship: "Founders' Scholarship", acceptance: 85 },
  { name: "TEAM University", country: "Uzbekistan", city: "Tashkent", minSat: 1000, minIelts: 5.5, majors: ["Business","Entrepreneurship","Marketing"], competitiveness: "Safety", scholarship: "Academic Merit", acceptance: 90 },

  // ---- Australia, NZ & others ----
  { name: "University of Sydney", country: "Australia", city: "Sydney", minSat: 1300, minIelts: 6.5, majors: ["Medicine","Law","Veterinary Medicine","Performing Arts"], competitiveness: "Match", scholarship: "Sydney International", acceptance: 45 },
  { name: "Monash University", country: "Australia", city: "Melbourne", minSat: 1250, minIelts: 6.5, majors: ["Pharmacy","Business","Engineering","Education","Human Resources"], competitiveness: "Match", scholarship: "Monash International Merit", acceptance: 60 },
  { name: "University of Otago", country: "New Zealand", city: "Dunedin", minSat: 1150, minIelts: 6.0, majors: ["Dentistry","Medicine","Sports Science","Allied Health","Psychology"], competitiveness: "Safety", scholarship: "Vice-Chancellor's Scholarship", acceptance: 75 },
  { name: "University of Cape Town", country: "South Africa", city: "Cape Town", minSat: 1200, minIelts: 6.5, majors: ["Medicine","Environmental Science","Film","Sociology"], competitiveness: "Match", scholarship: "UCT Council Scholarship", acceptance: 50 },
  { name: "Lomonosov Moscow State University", country: "Russia", city: "Moscow", minSat: 1300, minIelts: 6.0, majors: ["Mathematics","Physics","Law","Journalism"], competitiveness: "Match", scholarship: "Government Quota", acceptance: 35 },
];

/** How a student's SAT / IELTS compare to a university's minimums. */
export type Eligibility = "eligible" | "close" | "below" | "unknown";

// Shared "close enough" margins so every surface agrees on eligibility.
export const SAT_CLOSE_MARGIN = 100;
export const IELTS_CLOSE_MARGIN = 0.5;

export function checkEligibility(u: University, sat: number | null, ielts: number | null): Eligibility {
  if (sat == null && ielts == null) return "unknown";
  // Any known score that misses even the "close" margin → below.
  if (sat != null && sat < u.minSat - SAT_CLOSE_MARGIN) return "below";
  if (ielts != null && ielts < u.minIelts - IELTS_CLOSE_MARGIN) return "below";
  // "Eligible" is only claimed when BOTH requirements are known and cleared;
  // a single missing score leaves the fit unverified ("close" at best).
  const bothKnown = sat != null && ielts != null;
  const satMeets = sat != null && sat >= u.minSat;
  const ieltsMeets = ielts != null && ielts >= u.minIelts;
  if (bothKnown && satMeets && ieltsMeets) return "eligible";
  return "close";
}

// University free-text major tags don't always equal a major's canonical
// name. Map the mismatched / broader tags onto a major's short name so every
// major finds its universities, while a broad tag never bleeds into a more
// specific major (e.g. "Medicine" must not surface under "Veterinary Medicine").
const MAJOR_TAG_ALIASES: Record<string, string> = {
  "business": "business administration",
  "management": "business administration",
  "hospitality management": "hospitality",
  "fashion design": "fashion",
  "human resources": "human resource management",
  "communication": "media production",
  "life sciences": "biology",
  "natural sciences": "biology",
  "forestry": "agronomy",
  "international affairs": "international relations",
};

function canonicalMajorTag(tag: string): string {
  const t = tag.trim().toLowerCase();
  return MAJOR_TAG_ALIASES[t] ?? t;
}

// A major name's canonical "short" form: drop any "& …" / "/ …" suffix.
function majorShortName(name: string): string {
  return name.split(/ [&/] /)[0].trim().toLowerCase();
}

/**
 * Universities offering `majorName`, ranked for this student. Uses exact
 * canonical matching (no fuzzy substring), then orders by how relevant each
 * school is to the student's scores: schools they qualify for first (most
 * selective among those), then within-reach, then below — so a strong
 * student sees top schools, not only the easiest ones.
 */
export function universitiesForMajor(
  majorName: string,
  sat: number | null,
  ielts: number | null,
  limit = 5,
): University[] {
  const target = majorShortName(majorName);
  const tierRank: Record<Eligibility, number> = { eligible: 0, close: 1, unknown: 1, below: 2 };
  return UNIVERSITIES
    .filter((u) => u.majors.some((m) => canonicalMajorTag(m) === target))
    .map((u) => ({ u, elig: checkEligibility(u, sat, ielts) }))
    .sort((a, b) => {
      const t = tierRank[a.elig] - tierRank[b.elig];
      if (t !== 0) return t;
      // Within a tier: qualifying/unknown → most selective (notable) first;
      // close/below → nearest-to-reachable (lowest bar) first.
      return a.elig === "below" || a.elig === "close"
        ? a.u.minSat - b.u.minSat
        : a.u.acceptance - b.u.acceptance;
    })
    .slice(0, limit)
    .map((x) => x.u);
}

export const COUNTRIES = Array.from(new Set(UNIVERSITIES.map((u) => u.country))).sort();
export const MAJORS = Array.from(new Set(UNIVERSITIES.flatMap((u) => u.majors))).sort();

/* ─────────────── Mentors ─────────────── */
export type Mentor = {
  name: string;
  profession: string;
  experience: string;
  specialization: string;
  advice: string;
  emoji: string;
  bookingUrl?: string;
};

export const MENTORS: Mentor[] = [
  { name: "Aziz R.", profession: "Senior Software Engineer", experience: "9 years at Google & startups", specialization: "Backend, distributed systems", advice: "Build something every week. Tutorials teach syntax — projects teach engineering.", emoji: "💻" },
  { name: "Dilnoza K.", profession: "Product Designer", experience: "7 years, ex-Figma community lead", specialization: "Design systems & UX research", advice: "Taste compounds. Save what you love, write down why.", emoji: "🎨" },
  { name: "Bekzod T.", profession: "Founder & CEO", experience: "Scaled 2 startups to Series A", specialization: "Strategy, fundraising, GTM", advice: "Talk to 50 users before you write 50 lines of code.", emoji: "🚀" },
  { name: "Madina S.", profession: "Investigative Journalist", experience: "11 years, Reuters & local outlets", specialization: "Long-form reporting & ethics", advice: "Curiosity is your only renewable resource. Spend it.", emoji: "📰" },
  { name: "Dr. Sherzod A.", profession: "Clinical Psychologist", experience: "12 years private practice", specialization: "Cognitive behavioral therapy", advice: "Self-knowledge isn't a luxury — it's career insurance.", emoji: "🧠" },
  { name: "Nigora U.", profession: "Marketing Director", experience: "8 years across B2B & consumer", specialization: "Brand & performance marketing", advice: "Great marketing is a great product, told honestly.", emoji: "📣" },
  { name: "Dr. Jasur M.", profession: "Cardiologist", experience: "15 years, university hospital", specialization: "Preventive cardiology", advice: "Medicine rewards patience. Pick your subspecialty for the next 30 years, not 3.", emoji: "🩺" },
  { name: "Lola I.", profession: "Data Scientist", experience: "6 years at a fintech", specialization: "ML pipelines & analytics", advice: "Statistics first, frameworks later. Tools change every 18 months.", emoji: "📊" },
];

/* ─────────────── Career Battles ─────────────── */
export type CareerSpec = {
  name: string;
  salary: string;          // entry → senior
  skills: string[];
  education: string;
  demand: number;          // 0-100
  personality: string;     // MBTI-ish
  emoji: string;
};

export const CAREER_SPECS: Record<string, CareerSpec> = {
  "Software Engineer": { name: "Software Engineer", salary: "$70k → $250k", skills: ["Programming","System design","Problem solving","Collaboration"], education: "BS Computer Science or equivalent", demand: 95, personality: "INTJ / INTP", emoji: "💻" },
  "Data Scientist":    { name: "Data Scientist",    salary: "$80k → $230k", skills: ["Statistics","Python","ML","Communication"], education: "BS Math/CS, often MS", demand: 90, personality: "INTP / ISTJ", emoji: "📊" },
  "Journalist":        { name: "Journalist",        salary: "$35k → $120k", skills: ["Writing","Interviewing","Research","Ethics"], education: "BA Journalism / English", demand: 55, personality: "ENFP / ENTP", emoji: "📰" },
  "Marketing Specialist":{ name: "Marketing Specialist", salary: "$45k → $160k", skills: ["Copywriting","Analytics","Creativity","Strategy"], education: "BA Marketing / any field", demand: 75, personality: "ENFP / ENTJ", emoji: "📣" },
  "Doctor":            { name: "Doctor",            salary: "$200k → $500k+", skills: ["Diagnosis","Empathy","Endurance","Lifelong learning"], education: "MD + residency (10+ yrs)", demand: 88, personality: "ISTJ / ISFJ", emoji: "🩺" },
  "Psychologist":      { name: "Psychologist",      salary: "$60k → $180k", skills: ["Active listening","Empathy","Research","Patience"], education: "MS/PsyD Psychology", demand: 72, personality: "INFJ / INFP", emoji: "🧠" },
};

export const CAREER_BATTLES: { a: string; b: string }[] = [
  { a: "Software Engineer", b: "Data Scientist" },
  { a: "Journalist", b: "Marketing Specialist" },
  { a: "Doctor", b: "Psychologist" },
];

/* ─────────────── Success Stories ─────────────── */
export type SuccessStory = {
  name: string;
  initials: string;
  title: string;
  badge: string;
  story: string;
};

export const SUCCESS_STORIES: SuccessStory[] = [
  { name: "Aziza N.", initials: "AN", title: "From INFP to product designer at a Y-Combinator startup", badge: "Roadmap Mastery", story: "I took the assessment expecting nothing. ABBI matched me to Product Design — a field I'd dismissed. Six months and one community later, I landed my first design role." },
  { name: "Bobur K.", initials: "BK", title: "SAT 1490 → MIT-style scholarship at a top tech university", badge: "University Unlocked", story: "The University Explorer surfaced schools I hadn't considered. The Roadmap kept me accountable through SAT prep. Today I'm a CS freshman on a full ride." },
  { name: "Sevara M.", initials: "SM", title: "Built a mental-health newsletter with 4k subscribers", badge: "Creative Force", story: "The Community gave me my first 50 readers. Weekly ABBI reports kept me consistent. Now my newsletter pays my rent." },
  { name: "Jasur T.", initials: "JT", title: "From confused engineer to backend lead in 18 months", badge: "Skill Mastery", story: "Skill levels gave me a map. I focused on Logic + Technical, leveled up week after week, and got promoted ahead of schedule." },
];

/* ─────────────── Skill Levels (derived) ─────────────── */
export type SkillKey =
  | "leadership" | "communication" | "logic" | "creativity"
  | "discipline" | "emotional" | "technical";

export type SkillSnapshot = {
  key: SkillKey;
  label: string;
  emoji: string;
  xp: number;       // accumulated
  level: number;
  perLevel: number; // xp needed for one level
  progress: number; // 0-100 to next level
};

const SKILL_META: { key: SkillKey; label: string; emoji: string; perLevel: number }[] = [
  { key: "leadership",   label: "Leadership",            emoji: "👑", perLevel: 120 },
  { key: "communication",label: "Communication",         emoji: "💬", perLevel: 100 },
  { key: "logic",        label: "Logic",                 emoji: "🧮", perLevel: 110 },
  { key: "creativity",   label: "Creativity",            emoji: "🎨", perLevel: 110 },
  { key: "discipline",   label: "Discipline",            emoji: "🔥", perLevel: 100 },
  { key: "emotional",    label: "Emotional Intelligence",emoji: "❤️", perLevel: 120 },
  { key: "technical",    label: "Technical Thinking",    emoji: "⚙️", perLevel: 130 },
];

export function deriveSkillSnapshots(input: {
  assessmentsCompleted: number;
  stats?: Partial<{
    leadership_level: number; communication_score: number; creativity_score: number;
    emotional_intelligence: number; productivity_level: number;
  }> | null;
}): SkillSnapshot[] {
  const aBoost = input.assessmentsCompleted * 60;
  const s = input.stats ?? {};

  const xpFor: Record<SkillKey, number> = {
    leadership:    aBoost + (s.leadership_level ?? 0) * 4,
    communication: aBoost + (s.communication_score ?? 0) * 4,
    logic:         aBoost * 1.3,
    creativity:    aBoost + (s.creativity_score ?? 0) * 4,
    discipline:    aBoost + (s.productivity_level ?? 0) * 4,
    emotional:     aBoost + (s.emotional_intelligence ?? 0) * 4,
    technical:     aBoost * 1.5,
  };

  return SKILL_META.map((m) => {
    const xp = Math.max(0, Math.floor(xpFor[m.key]));
    const level = Math.floor(xp / m.perLevel) + 1;
    const inLevel = xp % m.perLevel;
    const progress = Math.round((inLevel / m.perLevel) * 100);
    return { ...m, xp, level, progress };
  });
}

/* ─────────────── Weekly Report ─────────────── */
export type WeeklyReport = {
  week: string;
  improvements: { label: string; delta: number }[]; // pct deltas
  tasksCompleted: number;
  roadmapProgress: number;
  assessmentsCompleted: number;
  suggestions: string[];
};

export function deriveWeeklyReport(input: {
  assessmentsCompleted: number;
  mbti?: string | null;
}): WeeklyReport {
  // Deterministic pseudo-random based on activity so it changes as user grows.
  const seed = input.assessmentsCompleted * 11 + 5;
  const pick = (i: number, min: number, max: number) =>
    min + ((seed * (i + 3)) % (max - min + 1));

  const improvements = [
    { label: "Communication", delta: pick(0, 1, 6) },
    { label: "Leadership",    delta: pick(1, 1, 5) },
    { label: "Logic",         delta: pick(2, 2, 7) },
    { label: "Creativity",    delta: pick(3, 1, 5) },
    { label: "Discipline",    delta: pick(4, 1, 6) },
  ];

  const suggestions: string[] = [];
  if (input.assessmentsCompleted === 0) suggestions.push("Take your first assessment to unlock personalized skill XP.");
  else suggestions.push("Retake the assessment this month to track how your profile evolves.");
  suggestions.push("Drop a thought in your Community — peer feedback boosts EQ.");
  if (input.mbti?.includes("I")) suggestions.push("Try one outbound social action this week (DM, comment, intro).");
  else suggestions.push("Schedule one deep focus block (90 min, no notifications).");

  const today = new Date();
  const week = `Week of ${new Date(today.getTime() - today.getDay() * 86400000).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;

  return {
    week,
    improvements,
    tasksCompleted: Math.max(0, input.assessmentsCompleted),
    roadmapProgress: Math.min(100, input.assessmentsCompleted * 20),
    assessmentsCompleted: input.assessmentsCompleted,
    suggestions: suggestions.slice(0, 4),
  };
}
