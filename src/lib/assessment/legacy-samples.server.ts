import type { CognitiveQ } from "./career-assessment";
/** Historical IDs and keys: never change while signed attempts may exist. */
export const LEGACY_SAMPLE_QUESTIONS: CognitiveQ[] = [
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
