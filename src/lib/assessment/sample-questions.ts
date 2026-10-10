import type { CognitiveQ } from "./career-assessment";
/** Public samples also live in the authoritative assessment bank. */
export const SAMPLE_QUESTIONS: CognitiveQ[] = [
  {
    id: "c8",
    section: "cognitive",
    prompt: "Which number completes the series: 1, 4, 9, 16, 25, ?",
    options: ["30", "32", "36", "49"],
    correct: 2,
  },
  {
    id: "c1",
    section: "cognitive",
    prompt: "Find the next number: 2, 6, 12, 20, 30, ?",
    options: ["36", "40", "42", "44"],
    correct: 2,
  },
  {
    id: "c5",
    section: "cognitive",
    prompt:
      "If 5 machines make 5 widgets in 5 minutes, how long do 100 machines need for 100 widgets?",
    options: ["100 min", "20 min", "5 min", "1 min"],
    correct: 2,
  },
  {
    id: "c4",
    section: "cognitive",
    prompt: "Which one doesn't belong: Square, Circle, Triangle, Cube?",
    options: ["Square", "Circle", "Triangle", "Cube"],
    correct: 3,
  },
];
export const SAMPLE_DIFFICULTY = ["introductory", "focused", "extended", "introductory"] as const;
export function sampleRecord(answers: Record<string, number>) {
  const attempted = SAMPLE_QUESTIONS.filter(
    (q) =>
      Number.isInteger(answers[q.id]) && answers[q.id] >= 0 && answers[q.id] < q.options.length,
  );
  return {
    attempted: attempted.length,
    correct: attempted.filter((q) => answers[q.id] === q.correct).length,
    total: SAMPLE_QUESTIONS.length,
  };
}
