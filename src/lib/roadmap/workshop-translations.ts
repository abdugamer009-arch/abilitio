/** Exact first-phase roadmap tasks, localized without changing their content or estimates. */
export const WORKSHOP_TASK_TEXT: Record<string, { uz: string[][]; ru: string[][] }> = {
  tech: {
    uz: [
      [
        "Python’da kichik hisob yarating",
        "Xarajatlar ro‘yxatini tuzing va yig‘indini kichik dasturda tekshiring.",
      ],
      [
        "Birinchi skriptingizni yarating",
        "Kichik kundalik ishni boshidan oxirigacha avtomatlashtiring.",
      ],
      ["Git va GitHub’ni sozlang", "Birinchi repozitoriy yarating va kod yuklang."],
      [
        "Terminalda beshta buyruqni sinang",
        "Fayllarni topish, skript ishga tushirish va asosiy buyruqlar.",
      ],
    ],
    ru: [
      [
        "Попробуйте расчёт на Python",
        "Создайте список расходов и проверьте сумму в небольшой программе.",
      ],
      ["Создайте первый скрипт", "Автоматизируйте небольшое повседневное дело целиком."],
      ["Настройте Git и GitHub", "Создайте первый репозиторий и загрузите код."],
      [
        "Попробуйте пять команд терминала",
        "Навигация по файлам, запуск скриптов и основные команды.",
      ],
    ],
  },
  creative: {
    uz: [
      [
        "Ijod yo‘nalishini tanlang",
        "Matn, rasm va video rejalashni sinang; keyingi mashq uchun bittasini tanlang.",
      ],
      ["Har kuni ijod qiling", "30 kun davomida har kuni kichik ish yarating."],
      [
        "10 ustaning ishini o‘rganing",
        "Ularning ishini samarali qiladigan jihatlarni tahlil qiling.",
      ],
      ["Portfolioni boshlang", "Yaxshi taqdim etilgan uchta ish ham yetarli boshlanish."],
    ],
    ru: [
      [
        "Выберите творческую среду",
        "Попробуйте текст, рисунок и план видео; выберите формат следующей практики.",
      ],
      ["Ежедневная творческая практика", "30 дней небольших ежедневных работ."],
      ["Изучите 10 мастеров", "Разберите, что делает их работы убедительными."],
      ["Начните портфолио", "Даже три хорошо представленные работы — начало."],
    ],
  },
  science: {
    uz: [
      ["Kichik ilmiy tajriba sinang", "Savol → faraz → tajriba → qayta ko‘rib chiqish."],
      ["5 muhim maqolani o‘qing", "O‘zingiz qiziqqan sohada."],
      ["Statistika asoslarini o‘rganing", "Taqsimotlar, ahamiyat va regressiya."],
    ],
    ru: [
      ["Попробуйте небольшой научный опыт", "Вопрос → гипотеза → эксперимент → пересмотр."],
      ["Прочитайте 5 ключевых статей", "В интересующей вас области."],
      ["Изучите основы статистики", "Распределения, значимость и регрессия."],
    ],
  },
};
export function taskEstimate(value: string, lang: string) {
  if (lang === "en") return value;
  return value
    .replace(/hrs?\b/g, lang === "uz" ? "soat" : "ч")
    .replace(/min\b/g, lang === "uz" ? "daq" : "мин")
    .replace(/weeks?\b/g, lang === "uz" ? "hafta" : "нед.")
    .replace(/months?\b/g, lang === "uz" ? "oy" : "мес.")
    .replace(/days?\b/g, lang === "uz" ? "kun" : "дн.");
}
