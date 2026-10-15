import type { RoadmapPhase } from "./roadmap-world";
import { workExperiment } from "../assessment/work-experiments";
import { catalogLabel } from "../catalog-labels";
export function careerRoadmap(
  career: { key: string; name: string; category: string },
  lang: "en" | "uz" | "ru",
): RoadmapPhase[] {
  const guide = workExperiment(career.category, lang);
  const name = catalogLabel(career.name, lang);
  const titles = {
    en: [
      "Observe the work",
      "Try a small experiment",
      "Practice the prerequisites",
      "Meet the field",
      "Review your direction",
    ],
    uz: [
      "Ishni kuzating",
      "Kichik tajriba qiling",
      "Asoslarni mashq qiling",
      "Soha bilan tanishing",
      "Yo‘nalishni qayta ko‘ring",
    ],
    ru: [
      "Изучите работу",
      "Попробуйте небольшой опыт",
      "Практикуйте основы",
      "Познакомьтесь с областью",
      "Пересмотрите направление",
    ],
  }[lang];
  const text = {
    en: [
      `For ${name}, compare these field examples with two real role descriptions: ${guide.examples.join(" ")}`,
      guide.experiment,
      guide.prerequisite,
      guide.mentor,
      `For ${name}, write what you enjoyed, what was difficult and one question still open. Choose whether to continue or explore another direction.`,
    ],
    uz: [
      `${name} uchun soha misollarini ikki haqiqiy kasb tavsifi bilan solishtiring: ${guide.examples.join(" ")}`,
      guide.experiment,
      guide.prerequisite,
      guide.mentor,
      `${name} bo‘yicha yoqqan, qiyin bo‘lgan jihat va bir ochiq savolni yozing. Davom etish yoki boshqa yo‘nalishni o‘rganishni tanlang.`,
    ],
    ru: [
      `Для направления ${name} сравните примеры с двумя реальными описаниями роли: ${guide.examples.join(" ")}`,
      guide.experiment,
      guide.prerequisite,
      guide.mentor,
      `Для направления ${name} запишите, что понравилось, что было сложно и какой вопрос остался. Решите, продолжать ли знакомство или выбрать другое направление.`,
    ],
  }[lang];
  return ([1, 2, 3, 4, 5] as const).map((index) => ({
    index,
    name: titles[index - 1],
    subtitle: name,
    tasks: [
      {
        id: `career:${career.key}:p${index}_t1`,
        title: `${name} · ${titles[index - 1]}`,
        description: text[index - 1],
        xp: 0,
        estimate: { en: "At your pace", uz: "O‘z sur’atingizda", ru: "В своём темпе" }[lang],
      },
    ],
  }));
}
