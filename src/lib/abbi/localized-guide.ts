import { catalogLabel, catalogLabels } from "../catalog-labels";
import type { AbbiContext } from "./abbi-knowledge";
import { abbiGreeting, ABBI_SUGGESTIONS } from "./abbi-knowledge";
import { careerGuideReply } from "./career-guides";
type Lang = "en" | "uz" | "ru";
const prompts = [
  ["Dasturiy ta’minot muhandisi nima qiladi?", "Что делает инженер программного обеспечения?"],
  [
    "Ma’lumotlar tahlilchisi qancha daromad olishi mumkin?",
    "Сколько может зарабатывать аналитик данных?",
  ],
  ["Marketing yaxshi kasb yo‘nalishimi?", "Маркетинг — подходящая профессия?"],
  ["Qanday ko‘nikmalarni o‘rganishim kerak?", "Какие навыки мне стоит изучать?"],
  [
    "Kompyuter fanlari uchun universitetni qanday tanlayman?",
    "Как выбрать университет для компьютерных наук?",
  ],
  ["Introvertlarga qanday ishlar mos?", "Какие профессии подходят интровертам?"],
  ["Ekstrovertlarga qanday ishlar mos?", "Какие профессии подходят экстравертам?"],
  ["IELTS ga qanday tayyorlanaman?", "Как подготовиться к IELTS?"],
  ["SAT ga qanday tayyorlanaman?", "Как подготовиться к SAT?"],
  ["Rahbar bo‘lish uchun nima o‘rganishim kerak?", "Что изучать, чтобы стать руководителем?"],
  ["Menga qaysi kasb ko‘proq mos?", "Какая профессия мне больше подходит?"],
  ["Yetakchilik ko‘nikmalarimni qanday rivojlantiraman?", "Как развивать лидерские навыки?"],
];
export function guidePrompts(lang: Lang): string[] {
  return lang === "en" ? ABBI_SUGGESTIONS : prompts.map((p) => p[lang === "uz" ? 0 : 1]);
}
export function guideGreeting(lang: Lang): string {
  if (lang === "en") return abbiGreeting();
  return lang === "uz"
    ? "👋 Salom! Men **ABBI**man. Kasblar, universitet tanlash, SAT/IELTS yoki keyingi amaliy qadamingiz haqida so‘rang."
    : "👋 Привет! Я **ABBI**. Спросите о профессиях, выборе университета, SAT/IELTS или следующем практическом шаге.";
}
/** Localized curated guidance. Canonical names/results remain unchanged. */
export function localizedGuideReply(message: string, ctx: AbbiContext, lang: "uz" | "ru"): string {
  const w = (uz: string, ru: string) => (lang === "uz" ? uz : ru);
  const q = message.toLocaleLowerCase();
  const caution = w(
    "Bu izlanish uchun yo‘l-yo‘riq, muvaffaqiyat yoki qabul kafolati emas.",
    "Это ориентир для исследования, а не гарантия успеха или поступления.",
  );
  if (/salary|earn|daromad|maosh|qancha|зарабат|зарплат|доход/.test(q))
    return w(
      "Daromad mamlakat, yil, tajriba va ish beruvchiga bog‘liq. Tanlagan kasbingiz uchun hududingizdagi rasmiy mehnat statistikasi va haqiqiy vakansiyalarni tekshiring. Bitta taxminiy raqamni kafolat deb qabul qilmang.",
      "Доход зависит от страны, года, опыта и работодателя. Проверьте официальную статистику труда и реальные вакансии вашей профессии в нужном регионе. Не воспринимайте приблизительную цифру как гарантию.",
    );
  if (/sat|ielts/.test(q)) {
    const exam = /ielts/.test(q) ? "IELTS" : "SAT";
    return (
      `**${exam}**\n\n` +
      w(
        "1. Rasmiy namuna bilan boshlang va xatolaringizni yozib boring.\n2. Eng qiyin ikki mavzuga kundalik mashq ajrating.\n3. Har bir xatoning sababini tushuntirib, keyin o‘xshash savolni qayta yeching.\n4. Vaqt chegarasida rasmiy mashqni takrorlang. Natija oshishini oldindan kafolatlab bo‘lmaydi.",
        "1. Начните с официального пробного задания и ведите журнал ошибок.\n2. Ежедневно практикуйте две самые сложные темы.\n3. Объясните причину каждой ошибки и решите похожее задание заново.\n4. Повторяйте официальную практику с ограничением времени. Рост балла заранее не гарантирован.",
      )
    );
  }
  if (/universit|university|degree|major|study|o‘qish|o'qish|университет|вуз|учёб|учеб/.test(q))
    return w(
      "Universitetlar bo‘limidagi rasmiy havolalardan boshlang. Bakalavriat dasturi, fuqarolik talablari, muddatlar va barcha xarajatlarni tekshiring. Moliyaviy yordamni faqat universitet tasdiqlagan taklif asosida hisoblang. Abilitio qabul ehtimolini baholamaydi.",
      "Начните с официальных ссылок в разделе университетов. Проверьте программу бакалавриата, требования к гражданству, сроки и полную стоимость. Учитывайте финансовую помощь только по подтверждённому предложению университета. Abilitio не оценивает вероятность поступления.",
    );
  const careerReply = careerGuideReply(message, lang);
  if (careerReply) return careerReply + "\n\n" + caution;
  if (
    /improv|weak|rivoj|ko‘nik|ko'nik|leadership|yetakchi|rahbar|навык|развив|улучш|лидер/.test(q)
  ) {
    const areas = (ctx.weaknesses?.length ? ctx.weaknesses : ctx.topStrengths)?.slice(0, 3) ?? [];
    return (
      w(
        "Bu hafta bitta ko‘nikmani tanlang, kichik amaliy vazifa bajaring va bir kishidan fikr oling. Natijani yozib, keyingi urinishni rejalashtiring.",
        "Выберите один навык на неделю, выполните небольшое практическое задание и попросите одного человека дать обратную связь. Запишите результат и спланируйте следующую попытку.",
      ) +
      (areas.length ? "\n\n" + areas.map((a) => "- " + catalogLabel(a, lang)).join("\n") : "") +
      "\n\n" +
      caution
    );
  }
  const matches = ctx.topCareers?.slice(0, 3) ?? [];
  const named = Object.entries(catalogLabels).find(
    ([en, t]) => q.includes(en.toLowerCase()) || q.includes(t[lang].toLocaleLowerCase()),
  );
  if (named)
    return (
      `**${catalogLabel(named[0], lang)}**\n\n` +
      w(
        "Bu yo‘nalishni sinash uchun kichik loyiha tanlang, shu kasbda ishlaydigan odam bilan suhbatlashing va o‘qish hamda ish talablarini rasmiy manbadan tekshiring. Qiziqishingiz va tajribangizni birga baholang.",
        "Чтобы попробовать это направление, выберите небольшой проект, поговорите с человеком этой профессии и проверьте требования к обучению и работе по официальным источникам. Оцените вместе свой интерес и практический опыт.",
      ) +
      "\n\n" +
      caution
    );
  if (matches.length)
    return (
      w(
        "Baholashingizdagi izlanish yo‘nalishlari:",
        "Направления для исследования из вашей оценки:",
      ) +
      "\n\n" +
      matches
        .map((c, i) => `${i + 1}. **${catalogLabel(c.name, lang)}** — ${c.match}/100`)
        .join("\n") +
      "\n\n" +
      caution
    );
  if (ctx.ageGroup === "child")
    return w(
      "Sizning qiziqishingiz muhim! Turli kasblar, o‘qish va ijod haqida birga izlanishimiz mumkin. Ishonchli katta bilan kichik, xavfsiz mashg‘ulot tanlang.",
      "Ваше любопытство важно! Мы можем исследовать профессии, учёбу и творчество. Выберите небольшое безопасное занятие вместе с доверенным взрослым.",
    );
  return (
    guideGreeting(lang) +
    "\n\n" +
    w(
      "O‘zingiz haqingizdagi tavsiyalar uchun avval baholashni tugating. Istalgan kasb yoki o‘rganmoqchi bo‘lgan ko‘nikmangizni yozing.",
      "Для персональных рекомендаций сначала завершите оценку. Напишите профессию или навык, который хотите изучить.",
    )
  );
}
