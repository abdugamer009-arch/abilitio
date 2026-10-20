import data from "./picture-practice.json";
import { publicPicture, type PictureProposal } from "./picture-rules";
import type { PictureText } from "./picture-types";
const proposals = data as unknown as PictureProposal[];
const rules: PictureText[] = [
  {
    en: "The small dot is inside the outline in every picture except the answer.",
    ru: "Во всех картинках, кроме ответа, маленькая точка находится внутри контура.",
    uz: "Javobdan boshqa rasmlarda kichik nuqta shakl ichida joylashgan.",
  },
  {
    en: "The pointer makes the same quarter-turn anticlockwise at every step.",
    ru: "На каждом шаге указатель поворачивается против часовой стрелки на четверть оборота.",
    uz: "Ko‘rsatkich har safar soat miliga qarshi chorak aylana buriladi.",
  },
  {
    en: "Every row repeats the same white shape. Match the other shapes in the last row.",
    ru: "В каждом ряду повторяется одна белая фигура. Найдите такую же фигуру для последнего ряда.",
    uz: "Har qatorda bir xil oq shakl takrorlanadi. Oxirgi qatordagi shaklni tanlang.",
  },
  {
    en: "Turn the shape without flipping it. Only the answer preserves how the arms join; the others are reflected.",
    ru: "Поверните фигуру без отражения. Только в ответе сохраняется соединение выступов; остальные варианты отражены.",
    uz: "Shaklni aks ettirmasdan buring. Faqat javobda qismlar birikishi saqlanadi; boshqalari aks ettirilgan.",
  },
];
/** Separate, never-scored practice. These IDs are absent from the assessment bank. */
export const SAMPLE_QUESTIONS = proposals.map((q, i) => ({
  id: q.id,
  prompt: q.questionLine.en,
  picture: publicPicture(q),
  options: q.options.map((_, i) => "ABCD"[i]),
  correct: q.options.findIndex((o) => o.id === q.correctAnswerId),
  rule: rules[i],
}));
export const SAMPLE_DIFFICULTY = [
  "introductory",
  "introductory",
  "introductory",
  "focused",
] as const;
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
