import type { ReasoningLanguage } from "./reasoning-copy";
export function historyLabel(score: number | null, type: string, lang: ReasoningLanguage) {
  const labels = {
    en: ["Reasoning", "Type", "Not assessed", "Mixed preferences"],
    uz: ["Mantiqiy", "Tur", "Baholanmagan", "Aralash afzalliklar"],
    ru: ["Мышление", "Тип", "Не оценивалось", "Смешанные предпочтения"],
  }[lang];
  return `${labels[0]}: ${score == null ? labels[2] : `${score}/9`} · ${labels[1]}: ${type.includes("X") ? labels[3] : type}`;
}
export function filterCareers<T extends { name: string; category: string }>(
  careers: T[],
  query: string,
  label: (s: string) => string = (s) => s,
): T[] {
  const text = query.trim().toLocaleLowerCase();
  return careers.filter((c) =>
    `${c.name} ${c.category} ${label(c.name)} ${label(c.category)}`
      .toLocaleLowerCase()
      .includes(text),
  );
}
export function initialComparison(keys: string[]): string[] {
  return [...new Set(keys)].slice(0, 3).concat(["", "", ""]).slice(0, 3);
}
export function chooseDistinct(current: string[], index: number, key: string) {
  if (key && current.some((k, i) => i !== index && k === key)) return current;
  return current.map((k, i) => (i === index ? key : k));
}
