import { findCareer } from "./abbi-knowledge";

type Guide = {
  names: [string, string];
  work: [string, string];
  skills: [string, string];
  activity: [string, string];
};
/** Curated work, skills and safe practice activities; no salary or admission predictions. */
export const CAREER_GUIDES: Record<string, Guide> = {
  "Software Engineer": {
    names: ["Dasturiy ta’minot muhandisi", "Инженер программного обеспечения"],
    work: [
      "Dasturlar yaratadi, kodni tekshiradi va xatolarni tuzatadi.",
      "Создаёт программы, проверяет код и исправляет ошибки.",
    ],
    skills: [
      "Dasturlash, muammo yechish, Git va jamoaviy ish.",
      "Программирование, решение задач, Git и командная работа.",
    ],
    activity: [
      "Oddiy vazifalar ro‘yxati ilovasini yarating va bir do‘stingiz bilan sinang.",
      "Создайте простой список задач и протестируйте его с другом.",
    ],
  },
  "Data Analyst": {
    names: ["Ma’lumotlar tahlilchisi", "Аналитик данных"],
    work: [
      "Ma’lumotlarni tozalaydi, tahlil qiladi va natijalarni tushuntiradi.",
      "Очищает и анализирует данные, объясняет результаты.",
    ],
    skills: [
      "Elektron jadvallar, SQL, statistika va diagrammalar.",
      "Электронные таблицы, SQL, статистика и диаграммы.",
    ],
    activity: [
      "Ochiq ma’lumotlardan bitta jadval va diagramma tuzing, uchta kuzatuv yozing.",
      "По открытым данным сделайте таблицу и диаграмму, запишите три наблюдения.",
    ],
  },
  "Data Scientist": {
    names: ["Ma’lumotlar olimi", "Специалист по данным"],
    work: [
      "Ma’lumotlardan qonuniyat izlaydi va bashorat modellarini tekshiradi.",
      "Ищет закономерности в данных и проверяет прогнозные модели.",
    ],
    skills: [
      "Python, statistika, tajriba dizayni va modelni baholash.",
      "Python, статистика, планирование экспериментов и оценка моделей.",
    ],
    activity: [
      "Ochiq namunada oddiy model tuzing; alohida tekshiruv ma’lumotlarida uning xatolarini o‘lchang.",
      "На открытом наборе постройте простую модель и измерьте ошибки на отдельной проверочной выборке.",
    ],
  },
  "Cybersecurity Specialist": {
    names: ["Kiberxavfsizlik mutaxassisi", "Специалист по кибербезопасности"],
    work: [
      "Tizimlarni himoya qiladi, xavflarni tekshiradi va hodisalarga javob beradi.",
      "Защищает системы, проверяет риски и реагирует на инциденты.",
    ],
    skills: [
      "Tarmoqlar, operatsion tizimlar, xavf tahlili va hisobot yozish.",
      "Сети, операционные системы, анализ рисков и отчётность.",
    ],
    activity: [
      "Faqat ruxsat berilgan o‘quv laboratoriyasida mashq qiling; boshqa tizimlarni tekshirmang.",
      "Практикуйтесь только в разрешённой учебной лаборатории, не проверяйте чужие системы.",
    ],
  },
  "Product Manager": {
    names: ["Mahsulot menejeri", "Менеджер продукта"],
    work: [
      "Foydalanuvchi ehtiyojlarini o‘rganadi va jamoa bilan mahsulot ustuvorliklarini belgilaydi.",
      "Изучает потребности пользователей и вместе с командой определяет приоритеты продукта.",
    ],
    skills: [
      "Suhbat o‘tkazish, ustuvorlik tanlash, tahlil va muloqot.",
      "Интервью, расстановка приоритетов, анализ и коммуникация.",
    ],
    activity: [
      "Uch kishidan bir kundalik muammo haqida so‘rang va bir sahifalik yechim taklifini yozing.",
      "Спросите троих о повседневной проблеме и опишите решение на одной странице.",
    ],
  },
  "UX / UI Designer": {
    names: ["UX / UI dizayneri", "UX / UI дизайнер"],
    work: [
      "Interfeys va foydalanuvchi yo‘llarini loyihalaydi, qulayligini tekshiradi.",
      "Проектирует интерфейсы и пользовательские сценарии, проверяет удобство.",
    ],
    skills: [
      "Foydalanuvchi tadqiqoti, prototiplar, vizual ierarxiya va foydalanish qulayligi.",
      "Исследование пользователей, прототипы, визуальная иерархия и доступность.",
    ],
    activity: [
      "Ro‘yxatdan o‘tishning uch ekranli prototipini chizing va ikki kishi bilan sinang.",
      "Нарисуйте прототип регистрации из трёх экранов и проверьте его с двумя людьми.",
    ],
  },
  "Graphic Designer": {
    names: ["Grafik dizayner", "Графический дизайнер"],
    work: [
      "Matn, rang va tasvirlar bilan xabarni tushunarli yetkazadi.",
      "Передаёт сообщение с помощью текста, цвета и изображений.",
    ],
    skills: [
      "Tipografika, kompozitsiya, rang va vizual hikoya.",
      "Типографика, композиция, цвет и визуальный рассказ.",
    ],
    activity: [
      "Bir maktab tadbiri uchun afisha yarating va o‘qilishi bo‘yicha fikr oling.",
      "Создайте афишу школьного события и соберите отзывы о читаемости.",
    ],
  },
  Psychologist: {
    names: ["Psixolog", "Психолог"],
    work: [
      "Xulq va tajribani o‘rganadi; kasbiy amaliyot tegishli tayyorgarlikni talab qiladi.",
      "Изучает поведение и опыт; профессиональная практика требует соответствующей подготовки.",
    ],
    skills: [
      "Tinglash, tadqiqot usullari, etika va ma’lumot tahlili.",
      "Слушание, методы исследования, этика и анализ данных.",
    ],
    activity: [
      "Ochiq tadqiqot maqolasini o‘qing va uning savoli, usuli hamda cheklovlarini yozing. Tashxis qo‘ymang.",
      "Прочитайте открытое исследование и опишите вопрос, метод и ограничения. Не ставьте диагнозы.",
    ],
  },
  Journalist: {
    names: ["Jurnalist", "Журналист"],
    work: [
      "Ma’lumot to‘playdi, manbalarni tekshiradi va yangilikni tushuntiradi.",
      "Собирает информацию, проверяет источники и объясняет события.",
    ],
    skills: [
      "Yozish, suhbat, faktlarni tekshirish va manbalar bilan ishlash.",
      "Письмо, интервью, проверка фактов и работа с источниками.",
    ],
    activity: [
      "Ochiq tadbir haqida qisqa xabar yozing, har bir faktga manba ko‘rsating.",
      "Напишите короткую заметку об открытом событии и укажите источник каждого факта.",
    ],
  },
  "Marketing Specialist": {
    names: ["Marketing mutaxassisi", "Специалист по маркетингу"],
    work: [
      "Auditoriyani o‘rganadi, kampaniyalarni rejalaydi va natijani o‘lchaydi.",
      "Изучает аудиторию, планирует кампании и измеряет результат.",
    ],
    skills: [
      "Tadqiqot, matn yozish, tahlil va tajribalarni solishtirish.",
      "Исследование, тексты, аналитика и сравнение экспериментов.",
    ],
    activity: [
      "Xayoliy mahsulot uchun ikki e’lon yozing va qaysi biri tushunarli ekanini so‘rang.",
      "Напишите два объявления для вымышленного продукта и спросите, какое понятнее.",
    ],
  },
  "Public Relations Manager": {
    names: ["Jamoatchilik bilan aloqalar menejeri", "Менеджер по связям с общественностью"],
    work: [
      "Tashkilot xabarlarini tayyorlaydi va jamoatchilik savollariga javob rejalaydi.",
      "Готовит сообщения организации и планирует ответы на вопросы общественности.",
    ],
    skills: [
      "Aniq yozish, tinglash, ommaviy muloqot va vaziyatni tahlil qilish.",
      "Ясное письмо, слушание, публичная коммуникация и анализ ситуации.",
    ],
    activity: [
      "Xayoliy tadbir uchun qisqa press-reliz va beshta savolga javob tayyorlang.",
      "Для вымышленного события подготовьте пресс-релиз и ответы на пять вопросов.",
    ],
  },
  Teacher: {
    names: ["O‘qituvchi", "Учитель"],
    work: [
      "Dars rejalaydi, mavzuni tushuntiradi va o‘quvchining tushunishini tekshiradi.",
      "Планирует уроки, объясняет темы и проверяет понимание учеников.",
    ],
    skills: [
      "Mavzuni bilish, tushuntirish, sabr va foydali fikr berish.",
      "Знание предмета, объяснение, терпение и полезная обратная связь.",
    ],
    activity: [
      "Bilgan mavzuingiz bo‘yicha besh daqiqalik dars tayyorlang va do‘stingizdan nimani tushunganini so‘rang.",
      "Подготовьте пятиминутный урок по знакомой теме и спросите друга, что он понял.",
    ],
  },
  Doctor: {
    names: ["Shifokor", "Врач"],
    work: [
      "Bemorlarni baholaydi va davolashni rejalaydi; litsenziya va tibbiy ta’lim talab qilinadi.",
      "Обследует пациентов и планирует лечение; нужны медицинское образование и допуск к практике.",
    ],
    skills: [
      "Biologiya, ilmiy fikrlash, muloqot va kasbiy etika.",
      "Биология, научное мышление, коммуникация и профессиональная этика.",
    ],
    activity: [
      "Kasb haqida shifokor bilan suhbat uchun savollar tuzing. O‘zingiz tashxis yoki davolash bermang.",
      "Подготовьте вопросы врачу о профессии. Самостоятельно не ставьте диагнозы и не назначайте лечение.",
    ],
  },
  "Business Analyst": {
    names: ["Biznes tahlilchi", "Бизнес-аналитик"],
    work: [
      "Jarayon va ehtiyojlarni o‘rganadi, talablar hamda yaxshilash takliflarini yozadi.",
      "Изучает процессы и потребности, описывает требования и предложения по улучшению.",
    ],
    skills: [
      "Jarayon xaritalari, tahlil, hujjatlashtirish va muloqot.",
      "Схемы процессов, анализ, документация и коммуникация.",
    ],
    activity: [
      "Bir kundalik jarayonni chizing va uni soddalashtirishning ikki usulini taklif qiling.",
      "Нарисуйте схему повседневного процесса и предложите два способа его упростить.",
    ],
  },
  Entrepreneur: {
    names: ["Tadbirkor", "Предприниматель"],
    work: [
      "Muammoni topadi, yechimni sinaydi va biznes resurslarini boshqaradi.",
      "Находит проблему, проверяет решение и управляет ресурсами бизнеса.",
    ],
    skills: [
      "Mijozni tushunish, rejalash, xarajat hisobi va tajriba.",
      "Понимание клиентов, планирование, учёт затрат и эксперименты.",
    ],
    activity: [
      "Pul sarflamasdan qog‘oz prototip yarating va uch kishidan fikr oling.",
      "Без денежных затрат сделайте бумажный прототип и соберите отзывы троих.",
    ],
  },
  Accountant: {
    names: ["Buxgalter", "Бухгалтер"],
    work: [
      "Moliyaviy yozuvlarni yuritadi, hisoblarni tekshiradi va hisobot tayyorlaydi.",
      "Ведёт финансовые записи, сверяет счета и готовит отчётность.",
    ],
    skills: [
      "Aniqlik, elektron jadvallar, hisob asoslari va hujjatlar.",
      "Точность, электронные таблицы, основы учёта и документация.",
    ],
    activity: [
      "Xayoliy tadbir uchun daromad va xarajat jadvalini tuzing, yakuniy summalarni tekshiring.",
      "Составьте таблицу доходов и расходов вымышленного события и проверьте итоги.",
    ],
  },
  Lawyer: {
    names: ["Huquqshunos", "Юрист"],
    work: [
      "Huquqiy manbalarni o‘rganadi, dalillarni tartiblaydi va hujjatlar tayyorlaydi.",
      "Изучает правовые источники, систематизирует аргументы и готовит документы.",
    ],
    skills: [
      "Diqqat bilan o‘qish, tadqiqot, dalillash va aniq yozish.",
      "Внимательное чтение, исследование, аргументация и ясное письмо.",
    ],
    activity: [
      "Ochiq xayoliy vaziyat uchun ikki tomonning dalillarini yozing. Bu kasbiy huquqiy maslahat emas.",
      "Для учебной вымышленной ситуации опишите аргументы двух сторон. Это не профессиональная юридическая консультация.",
    ],
  },
};

export function careerGuideReply(message: string, lang: "uz" | "ru"): string | null {
  const q = message.toLocaleLowerCase();
  const index = lang === "uz" ? 0 : 1;
  const named = Object.entries(CAREER_GUIDES)
    .sort((a, b) => b[1].names[index].length - a[1].names[index].length)
    .find(
      ([en, guide]) =>
        q.includes(en.toLowerCase()) || q.includes(guide.names[index].toLocaleLowerCase()),
    );
  const guide = named?.[1] ?? CAREER_GUIDES[findCareer(message)?.name ?? ""];
  if (!guide) return null;
  const labels =
    lang === "uz"
      ? ["Nima qiladi", "Ko‘nikmalar", "Sinab ko‘ring"]
      : ["Чем занимается", "Навыки", "Попробуйте"];
  return `**${guide.names[index]}**\n\n**${labels[0]}**\n${guide.work[index]}\n\n**${labels[1]}**\n${guide.skills[index]}\n\n**${labels[2]}**\n${guide.activity[index]}`;
}
