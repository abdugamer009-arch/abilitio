export type ReasoningLanguage = "en" | "ru" | "uz";

export function formatReasoningScore(
  score: number | null,
  lang: ReasoningLanguage,
  questionSetVersion?: string,
): string {
  if (score == null) {
    return {
      en: "Reasoning not assessed",
      ru: "Задания на мышление не проходились",
      uz: "Mantiqiy savollar baholanmagan",
    }[lang];
  }
  const correct = Math.max(0, Math.min(9, score));
  if (questionSetVersion === "picture-reasoning-v1") {
    const scaled = (Math.round((correct / 9) * 100) / 10).toFixed(1);
    return {
      en: `${scaled} / 10 · ${correct} of 9 correct`,
      ru: `${scaled} / 10 · ${correct} из 9 верно`,
      uz: `${scaled} / 10 · 9 tadan ${correct} ta to‘g‘ri`,
    }[lang];
  }
  return {
    en: `${correct} of 9 correct on this attempt`,
    ru: `${correct} из 9 верно в этой попытке`,
    uz: `Bu urinishda 9 tadan ${correct} ta to‘g‘ri`,
  }[lang];
}

export function reasoningCaveat(lang: ReasoningLanguage): string {
  return {
    en: "Familiarity, language and question difficulty can affect this score. It does not measure ability or rank careers.",
    ru: "Знакомство с заданиями, язык и сложность вопросов влияют на результат. Он не измеряет способности и не меняет рейтинг профессий.",
    uz: "Tanishlik, til va savollar qiyinligi natijaga ta’sir qiladi. U qobiliyatni o‘lchamaydi yoki kasblar tartibini o‘zgartirmaydi.",
  }[lang];
}
