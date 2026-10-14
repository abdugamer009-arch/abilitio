// Exploration weights are product rules, not validated predictive coefficients.
// Both matching and the Methodology copy import this object.
export const SCORING_WEIGHTS = {
  teen_adult: { directInterest: 0.7, personality: 0.3, visualPreference: 0, reasoning: 0 },
  child: { directInterest: 0.75, personality: 0.25, visualPreference: 0, reasoning: 0 },
} as const;

export function scoringMethodology(age: keyof typeof SCORING_WEIGHTS, lang: "en" | "ru" | "uz") {
  const weights = SCORING_WEIGHTS[age];
  const direct = weights.directInterest * 100;
  const personality = weights.personality * 100;
  const text = {
    en: `Career ranking uses direct activity and subject interests (${direct}%) and work preferences (${personality}%). Visual choices and reasoning answers do not change the ranking. Reasoning is shown separately. These are exploratory rules, not validated predictions.`,
    ru: `Рейтинг профессий учитывает интерес к занятиям и предметам (${direct}%) и рабочие предпочтения (${personality}%). Визуальные выборы и ответы на задания по мышлению не меняют рейтинг. Результат заданий показан отдельно. Это исследовательские правила, а не проверенный прогноз.`,
    uz: `Kasblar tartibi mashg‘ulot va fanlarga qiziqish (${direct}%) hamda ish afzalliklariga (${personality}%) asoslanadi. Vizual tanlovlar va mantiqiy javoblar tartibni o‘zgartirmaydi. Mantiqiy natija alohida ko‘rsatiladi. Bu izlanish qoidalari, tasdiqlangan bashorat emas.`,
  };
  return text[lang];
}
