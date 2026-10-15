export type PracticeGuide = {
  examples: string[];
  experiment: string;
  prerequisite: string;
  mentor: string;
};
type Lang = "en" | "uz" | "ru";
const guides: Record<string, Record<Lang, PracticeGuide>> = {
  tech: {
    en: {
      examples: [
        "Build a small tool for a user's task.",
        "Test a change and document what failed.",
        "Review a solution with a teammate.",
      ],
      experiment:
        "This week: build a tiny checklist or spreadsheet tool; ask one person to try it and record what you change.",
      prerequisite: "Practice basic programming, testing and explaining your work.",
      mentor:
        "Ask a software or engineering practitioner to review a small project; use a moderated student coding group.",
    },
    uz: {
      examples: [
        "Foydalanuvchi vazifasi uchun kichik vosita tuzish.",
        "O‘zgarishni sinash va xatoni qayd etish.",
        "Yechimni jamoadosh bilan ko‘rib chiqish.",
      ],
      experiment:
        "Bu hafta: kichik ro‘yxat yoki jadval vositasini tuzing; bir kishiga sinating va o‘zgarishlarni yozing.",
      prerequisite: "Dasturlash, sinash va ishni tushuntirish asoslarini mashq qiling.",
      mentor:
        "Dasturchi yoki muhandisdan kichik loyihani ko‘rib chiqishni so‘rang; nazorat qilinadigan o‘quvchilar guruhini tanlang.",
    },
    ru: {
      examples: [
        "Создать инструмент для задачи пользователя.",
        "Проверить изменение и записать ошибки.",
        "Обсудить решение с коллегой.",
      ],
      experiment:
        "На этой неделе: сделайте небольшой список задач или таблицу; дайте одному человеку попробовать и запишите изменения.",
      prerequisite: "Практикуйте основы программирования, тестирования и объяснения работы.",
      mentor:
        "Попросите программиста или инженера разобрать небольшой проект; выбирайте модерируемые ученические группы.",
    },
  },
  creative: {
    en: {
      examples: [
        "Develop a brief and sketch alternatives.",
        "Make and revise a draft.",
        "Discuss a piece of work with its audience.",
      ],
      experiment:
        "This week: make two posters for the same school event, ask a classmate which is clearer, then revise one.",
      prerequisite: "Practice composition, storytelling and responding to feedback.",
      mentor: "Ask a designer, writer or arts teacher for feedback on one draft.",
    },
    uz: {
      examples: [
        "Vazifani aniqlash va variantlar chizish.",
        "Qoralama yaratish va tahrirlash.",
        "Ishni uning auditoriyasi bilan muhokama qilish.",
      ],
      experiment:
        "Bu hafta: bir maktab tadbiri uchun ikki afisha tuzing, sinfdoshdan qaysi biri tushunarli ekanini so‘rang va birini yangilang.",
      prerequisite: "Kompozitsiya, hikoya qilish va fikr asosida tahrirlashni mashq qiling.",
      mentor: "Dizayner, yozuvchi yoki san’at o‘qituvchisidan bir qoralamaga fikr so‘rang.",
    },
    ru: {
      examples: [
        "Уточнить задачу и набросать варианты.",
        "Создать и доработать черновик.",
        "Обсудить работу с её аудиторией.",
      ],
      experiment:
        "На этой неделе: сделайте два плаката для школьного события, спросите одноклассника, какой понятнее, и доработайте один.",
      prerequisite: "Практикуйте композицию, повествование и работу с отзывами.",
      mentor: "Попросите дизайнера, писателя или учителя искусства оценить черновик.",
    },
  },
  science: {
    en: {
      examples: [
        "Form a question and a testable explanation.",
        "Collect and check observations.",
        "Explain a finding and its limits.",
      ],
      experiment:
        "This week: compare the growth of two safe plants or analyze a public dataset; record your method and one uncertainty.",
      prerequisite: "Practice observation, basic statistics and keeping a methods notebook.",
      mentor: "Ask a science teacher or researcher to review your question and safety plan.",
    },
    uz: {
      examples: [
        "Savol va tekshiriladigan izoh tuzish.",
        "Kuzatuvlarni yig‘ish va tekshirish.",
        "Xulosa va cheklovlarni tushuntirish.",
      ],
      experiment:
        "Bu hafta: ikki xavfsiz o‘simlik o‘sishini solishtiring yoki ochiq ma’lumotni tahlil qiling; usul va bir noaniqlikni yozing.",
      prerequisite: "Kuzatish, boshlang‘ich statistika va usul daftarini yuritishni mashq qiling.",
      mentor:
        "Tabiiy fan o‘qituvchisi yoki tadqiqotchidan savol va xavfsizlik rejasini tekshirishni so‘rang.",
    },
    ru: {
      examples: [
        "Сформулировать вопрос и проверяемое объяснение.",
        "Собрать и проверить наблюдения.",
        "Объяснить вывод и его ограничения.",
      ],
      experiment:
        "На этой неделе: сравните рост двух безопасных растений или изучите открытые данные; запишите метод и одну неопределённость.",
      prerequisite: "Практикуйте наблюдение, основы статистики и ведение записей о методах.",
      mentor:
        "Попросите учителя естественных наук или исследователя оценить вопрос и план безопасности.",
    },
  },
  business: {
    en: {
      examples: [
        "Clarify a customer or organization's problem.",
        "Compare options using a simple budget or table.",
        "Present a recommendation and its tradeoffs.",
      ],
      experiment:
        "This week: plan a fictional school event budget; compare two options and ask a teacher what you missed.",
      prerequisite: "Practice spreadsheets, basic accounting and clear communication.",
      mentor: "Ask a business, economics or accounting teacher to review your example budget.",
    },
    uz: {
      examples: [
        "Mijoz yoki tashkilot muammosini aniqlash.",
        "Variantlarni oddiy budjet yoki jadval bilan solishtirish.",
        "Tavsiya va murosalarni tushuntirish.",
      ],
      experiment:
        "Bu hafta: xayoliy maktab tadbiri budjetini tuzing; ikki variantni solishtiring va o‘qituvchidan kamchiliklarni so‘rang.",
      prerequisite: "Jadval, boshlang‘ich hisob va aniq muloqotni mashq qiling.",
      mentor:
        "Biznes, iqtisod yoki hisob o‘qituvchisidan namunaviy budjetni ko‘rib chiqishni so‘rang.",
    },
    ru: {
      examples: [
        "Уточнить задачу клиента или организации.",
        "Сравнить варианты с помощью бюджета или таблицы.",
        "Представить рекомендацию и компромиссы.",
      ],
      experiment:
        "На этой неделе: составьте бюджет вымышленного школьного события; сравните два варианта и спросите учителя, что упущено.",
      prerequisite: "Практикуйте таблицы, основы учёта и ясное общение.",
      mentor: "Попросите преподавателя бизнеса, экономики или учёта разобрать пример бюджета.",
    },
  },
  social: {
    en: {
      examples: [
        "Listen to a person's question or learning need.",
        "Plan an explanation or supervised activity.",
        "Review feedback and adjust the next step.",
      ],
      experiment:
        "This week: teach a ten-minute lesson on a topic you know; ask what was unclear and revise your explanation. Do not offer medical or legal advice.",
      prerequisite: "Practice listening, explaining and understanding professional boundaries.",
      mentor:
        "Ask an educator or qualified practitioner about supervised learning and required qualifications.",
    },
    uz: {
      examples: [
        "Inson savoli yoki o‘rganish ehtiyojini tinglash.",
        "Izoh yoki nazoratli mashg‘ulotni rejalash.",
        "Fikrlarni tahlil qilish va keyingi qadamni yangilash.",
      ],
      experiment:
        "Bu hafta: bilgan mavzuingizda o‘n daqiqalik dars o‘ting; noaniq joylarni so‘rang va izohni yangilang. Tibbiy yoki huquqiy maslahat bermang.",
      prerequisite: "Tinglash, tushuntirish va kasbiy chegaralarni tushunishni mashq qiling.",
      mentor:
        "O‘qituvchi yoki malakali mutaxassisdan nazoratli o‘rganish va zarur malakalar haqida so‘rang.",
    },
    ru: {
      examples: [
        "Выслушать вопрос или учебную потребность человека.",
        "Подготовить объяснение или занятие под наблюдением.",
        "Учесть отзывы и скорректировать следующий шаг.",
      ],
      experiment:
        "На этой неделе: проведите десятиминутный урок на знакомую тему; уточните непонятное и улучшите объяснение. Не давайте медицинских или юридических советов.",
      prerequisite: "Практикуйте слушание, объяснение и понимание профессиональных границ.",
      mentor:
        "Спросите педагога или квалифицированного специалиста об обучении под наблюдением и нужных квалификациях.",
    },
  },
  general: {
    en: {
      examples: [
        "Clarify a task and its constraints.",
        "Make a small draft or model.",
        "Review the result and document improvements.",
      ],
      experiment:
        "This week: read two actual role descriptions, choose one safe beginner task and make a small example; ask a teacher to review it.",
      prerequisite:
        "Identify the tools, training and safety requirements in actual role descriptions.",
      mentor:
        "Ask a teacher to help you contact a practitioner through a supervised school channel.",
    },
    uz: {
      examples: [
        "Vazifa va cheklovlarni aniqlash.",
        "Kichik qoralama yoki model yaratish.",
        "Natijani tekshirish va yaxshilashni yozish.",
      ],
      experiment:
        "Bu hafta: ikkita haqiqiy kasb tavsifini o‘qing, xavfsiz boshlang‘ich vazifani tanlang va kichik namuna yarating; o‘qituvchiga ko‘rsating.",
      prerequisite:
        "Haqiqiy kasb tavsiflaridan vositalar, ta’lim va xavfsizlik talablarini aniqlang.",
      mentor:
        "O‘qituvchidan maktabning nazoratli kanali orqali mutaxassis bilan bog‘lanishda yordam so‘rang.",
    },
    ru: {
      examples: [
        "Уточнить задачу и ограничения.",
        "Сделать небольшой черновик или модель.",
        "Проверить результат и записать улучшения.",
      ],
      experiment:
        "На этой неделе: прочитайте два реальных описания роли, выберите безопасную задачу для новичка и сделайте пример; покажите учителю.",
      prerequisite:
        "Найдите инструменты, обучение и требования безопасности в реальных описаниях роли.",
      mentor:
        "Попросите учителя помочь связаться со специалистом через контролируемый школьный канал.",
    },
  },
};
export function practiceFamily(category: string): string {
  if (/technology|engineering/i.test(category)) return "tech";
  if (/arts|design|media|architecture/i.test(category)) return "creative";
  if (/science|environment/i.test(category)) return "science";
  if (/business|finance|market|entrepreneur/i.test(category)) return "business";
  if (/education|health|psychology|social|law/i.test(category)) return "social";
  return "general";
}
export function workExperiment(category: string, lang: Lang): PracticeGuide {
  return guides[practiceFamily(category)][lang];
}
