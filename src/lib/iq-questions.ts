export type Category = "logical" | "analytical" | "pattern";

export type Question = {
  id: number;
  category: Category;
  prompt: string;
  hint?: string;
  options: string[];
  answer: number; // index
};

export const questions: Question[] = [
  {
    id: 1,
    category: "pattern",
    prompt: "What number comes next in the sequence?",
    hint: "2, 4, 8, 16, 32, ?",
    options: ["48", "60", "64", "72"],
    answer: 2,
  },
  {
    id: 2,
    category: "logical",
    prompt: "If all Bloops are Razzies, and all Razzies are Lazzies, then all Bloops are definitely…",
    options: ["Razzies", "Lazzies", "Both Razzies and Lazzies", "Neither"],
    answer: 2,
  },
  {
    id: 3,
    category: "analytical",
    prompt: "A train travels 60 km in 45 minutes. What is its speed in km/h?",
    options: ["60", "75", "80", "90"],
    answer: 2,
  },
  {
    id: 4,
    category: "pattern",
    prompt: "Find the missing number:",
    hint: "1, 1, 2, 3, 5, 8, ?, 21",
    options: ["11", "12", "13", "14"],
    answer: 2,
  },
  {
    id: 5,
    category: "logical",
    prompt: "Which shape does NOT belong with the others?",
    options: ["Square", "Triangle", "Circle", "Pentagon"],
    answer: 2,
  },
  {
    id: 6,
    category: "analytical",
    prompt: "If 5 machines make 5 widgets in 5 minutes, how long do 100 machines take to make 100 widgets?",
    options: ["1 minute", "5 minutes", "20 minutes", "100 minutes"],
    answer: 1,
  },
  {
    id: 7,
    category: "pattern",
    prompt: "Complete the pattern:",
    hint: "△ ▲ △ ▲ △ ?",
    options: ["△", "▲", "○", "■"],
    answer: 1,
  },
  {
    id: 8,
    category: "logical",
    prompt: "Book is to Reading as Fork is to:",
    options: ["Drawing", "Writing", "Eating", "Stirring"],
    answer: 2,
  },
  {
    id: 9,
    category: "analytical",
    prompt: "What is the next prime number after 23?",
    options: ["25", "27", "29", "31"],
    answer: 2,
  },
  {
    id: 10,
    category: "pattern",
    prompt: "Which number completes the sequence?",
    hint: "3, 6, 12, 24, 48, ?",
    options: ["72", "84", "96", "108"],
    answer: 2,
  },
];

export type Scored = {
  score: number; // 70-160 IQ-ish
  level: string;
  logical: number; // 0-100
  analytical: number;
  pattern: number;
  correct: number;
};

export function scoreAnswers(answers: (number | null)[]): Scored {
  let logCorrect = 0, logTotal = 0;
  let anaCorrect = 0, anaTotal = 0;
  let patCorrect = 0, patTotal = 0;

  questions.forEach((q, i) => {
    const got = answers[i] === q.answer;
    if (q.category === "logical") { logTotal++; if (got) logCorrect++; }
    if (q.category === "analytical") { anaTotal++; if (got) anaCorrect++; }
    if (q.category === "pattern") { patTotal++; if (got) patCorrect++; }
  });

  const correct = logCorrect + anaCorrect + patCorrect;
  // Map correct (0..10) to IQ 70..150
  const score = Math.round(70 + (correct / questions.length) * 80);
  const level =
    score >= 140 ? "Gifted" :
    score >= 125 ? "Highly Intelligent" :
    score >= 110 ? "Above Average" :
    score >= 90  ? "Average" : "Developing";

  const pct = (c: number, t: number) => (t === 0 ? 0 : Math.round((c / t) * 100));

  return {
    score,
    level,
    logical: pct(logCorrect, logTotal),
    analytical: pct(anaCorrect, anaTotal),
    pattern: pct(patCorrect, patTotal),
    correct,
  };
}
