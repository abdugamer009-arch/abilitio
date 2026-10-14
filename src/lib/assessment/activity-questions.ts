import type { InterestQ, InterestTheme, RiasecDim } from "./career-assessment";
import type { QT } from "./question-translations";
import { tagInterest } from "./question-metadata";

type Translated = [en: string, ru: string, uz: string];
type Activity = [...Translated, dim: RiasecDim, icon: string];
type Set = { theme: InterestTheme; prompt: Translated; choices: Activity[] };

// Concrete activities/subjects are the primary career evidence. These are
// preferences, not tests of skill or predictions of future performance.
const sets: Set[] = [
  {
    theme: "games",
    prompt: [
      "Which school project would you choose?",
      "Какой школьный проект вы бы выбрали?",
      "Qaysi maktab loyihasini tanlaysiz?",
    ],
    choices: [
      [
        "Build a working model",
        "Собрать работающую модель",
        "Ishlaydigan model yasash",
        "R",
        "square",
      ],
      [
        "Investigate a scientific question",
        "Исследовать научный вопрос",
        "Ilmiy savolni tadqiq qilish",
        "I",
        "leaf",
      ],
      ["Design the presentation", "Оформить презентацию", "Taqdimotni bezash", "A", "circle"],
      [
        "Interview people about their needs",
        "Поговорить с людьми об их потребностях",
        "Odamlar bilan ehtiyojlari haqida suhbatlashish",
        "S",
        "circle",
      ],
      [
        "Pitch the idea to a group",
        "Представить идею группе",
        "Guruhga g‘oyani taqdim etish",
        "E",
        "star",
      ],
      [
        "Plan the timeline and budget",
        "Составить план и бюджет",
        "Reja va byudjet tuzish",
        "C",
        "square",
      ],
    ],
  },
  {
    theme: "object",
    prompt: [
      "Which subject would you explore further?",
      "Какой предмет вы бы изучили глубже?",
      "Qaysi fanni chuqurroq o‘rganasiz?",
    ],
    choices: [
      [
        "Engineering and making things",
        "Инженерия и создание вещей",
        "Muhandislik va buyum yasash",
        "R",
        "square",
      ],
      ["Biology and research", "Биология и исследования", "Biologiya va tadqiqot", "I", "leaf"],
      ["Art and design", "Искусство и дизайн", "San’at va dizayn", "A", "circle"],
      [
        "Education and helping people",
        "Образование и помощь людям",
        "Ta’lim va odamlarga yordam",
        "S",
        "circle",
      ],
      [
        "Business and entrepreneurship",
        "Бизнес и предпринимательство",
        "Biznes va tadbirkorlik",
        "E",
        "star",
      ],
      [
        "Accounting and information systems",
        "Бухгалтерия и информационные системы",
        "Buxgalteriya va axborot tizimlari",
        "C",
        "square",
      ],
    ],
  },
  {
    theme: "landscape",
    prompt: [
      "How would you spend a free afternoon?",
      "Как бы вы провели свободный день?",
      "Bo‘sh tushdan keyinni qanday o‘tkazasiz?",
    ],
    choices: [
      [
        "Repair or build something",
        "Починить или собрать что-то",
        "Biror narsani tuzatish yoki yasash",
        "R",
        "square",
      ],
      [
        "Explore data or an experiment",
        "Изучить данные или провести опыт",
        "Ma’lumot yoki tajribani o‘rganish",
        "I",
        "leaf",
      ],
      [
        "Draw, write or make music",
        "Рисовать, писать или сочинять музыку",
        "Rasm chizish, yozish yoki musiqa yaratish",
        "A",
        "circle",
      ],
      [
        "Tutor or support someone",
        "Помочь кому-то с учёбой",
        "Kimgadir o‘qishda yordam berish",
        "S",
        "circle",
      ],
      [
        "Organize a small event",
        "Организовать небольшое мероприятие",
        "Kichik tadbir tashkil qilish",
        "E",
        "star",
      ],
      [
        "Organize records or a collection",
        "Упорядочить записи или коллекцию",
        "Yozuvlar yoki to‘plamni tartiblash",
        "C",
        "square",
      ],
    ],
  },
  {
    theme: "animal",
    prompt: [
      "Which workplace visit sounds most interesting?",
      "Какое рабочее место вам интересно посетить?",
      "Qaysi ish joyiga tashrif sizga qiziq?",
    ],
    choices: [
      [
        "A workshop where people build equipment",
        "Мастерская, где собирают оборудование",
        "Uskunalar yasaladigan ustaxona",
        "R",
        "square",
      ],
      [
        "A research laboratory",
        "Исследовательская лаборатория",
        "Tadqiqot laboratoriyasi",
        "I",
        "leaf",
      ],
      ["A design studio", "Дизайн-студия", "Dizayn studiyasi", "A", "circle"],
      [
        "A community support center",
        "Центр помощи людям",
        "Odamlarga yordam markazi",
        "S",
        "circle",
      ],
      ["A startup team", "Команда нового бизнеса", "Yangi biznes jamoasi", "E", "star"],
      [
        "An operations office",
        "Офис управления процессами",
        "Jarayonlarni boshqarish idorasi",
        "C",
        "square",
      ],
    ],
  },
  {
    theme: "color",
    prompt: [
      "Which story would you read first?",
      "Какую историю вы бы прочитали первой?",
      "Qaysi xabarni avval o‘qiysiz?",
    ],
    choices: [
      ["How a bridge was built", "Как построили мост", "Ko‘prik qanday qurilgani", "R", "square"],
      [
        "A new scientific discovery",
        "О новом научном открытии",
        "Yangi ilmiy kashfiyot",
        "I",
        "leaf",
      ],
      [
        "How an exhibition was created",
        "Как создали выставку",
        "Ko‘rgazma qanday yaratilgani",
        "A",
        "circle",
      ],
      [
        "How volunteers helped a family",
        "Как волонтёры помогли семье",
        "Ko‘ngillilar oilaga qanday yordam bergani",
        "S",
        "circle",
      ],
      [
        "How a small business began",
        "Как появился малый бизнес",
        "Kichik biznes qanday boshlangani",
        "E",
        "star",
      ],
      [
        "How a team improved its process",
        "Как команда улучшила процесс",
        "Jamoa jarayonni qanday yaxshilagani",
        "C",
        "square",
      ],
    ],
  },
  {
    theme: "material",
    prompt: [
      "Which short course would you try?",
      "Какой короткий курс вы бы попробовали?",
      "Qaysi qisqa kursni sinab ko‘rasiz?",
    ],
    choices: [
      [
        "Electronics and tools",
        "Электроника и инструменты",
        "Elektronika va asboblar",
        "R",
        "square",
      ],
      [
        "Research methods and coding",
        "Методы исследования и программирование",
        "Tadqiqot usullari va dasturlash",
        "I",
        "leaf",
      ],
      [
        "Illustration and storytelling",
        "Иллюстрация и рассказы",
        "Rasm va hikoya yaratish",
        "A",
        "circle",
      ],
      [
        "Teaching and listening",
        "Обучение и умение слушать",
        "O‘rgatish va tinglash",
        "S",
        "circle",
      ],
      [
        "Marketing a new idea",
        "Продвижение новой идеи",
        "Yangi g‘oyani targ‘ib qilish",
        "E",
        "star",
      ],
      [
        "Spreadsheets and planning",
        "Таблицы и планирование",
        "Jadvallar va rejalash",
        "C",
        "square",
      ],
    ],
  },
  {
    theme: "sound",
    prompt: [
      "How would you help improve your neighborhood?",
      "Как бы вы помогли улучшить свой район?",
      "Mahallangizni yaxshilashga qanday yordam berasiz?",
    ],
    choices: [
      [
        "Build or repair a shared space",
        "Построить или починить общее место",
        "Umumiy joyni qurish yoki tuzatish",
        "R",
        "square",
      ],
      [
        "Test water or air quality",
        "Проверить качество воды или воздуха",
        "Suv yoki havo sifatini tekshirish",
        "I",
        "leaf",
      ],
      ["Create a mural", "Создать настенную роспись", "Devoriy rasm yaratish", "A", "circle"],
      [
        "Tutor younger students",
        "Помогать младшим ученикам",
        "Kichik o‘quvchilarga yordam berish",
        "S",
        "circle",
      ],
      [
        "Lead a fundraising effort",
        "Организовать сбор средств",
        "Mablag‘ yig‘ishni boshqarish",
        "E",
        "star",
      ],
      [
        "Track supplies and schedules",
        "Вести учёт материалов и расписание",
        "Jihozlar va jadvalni hisobga olish",
        "C",
        "square",
      ],
    ],
  },
  {
    theme: "motion",
    prompt: [
      "Which part of a research project would you take?",
      "Какую часть исследовательского проекта вы бы выбрали?",
      "Tadqiqot loyihasining qaysi qismini tanlaysiz?",
    ],
    choices: [
      [
        "Build a device to collect observations",
        "Собрать устройство для наблюдений",
        "Kuzatish uchun qurilma yasash",
        "R",
        "square",
      ],
      [
        "Analyze the results",
        "Проанализировать результаты",
        "Natijalarni tahlil qilish",
        "I",
        "leaf",
      ],
      [
        "Explain results with visuals",
        "Объяснить результаты с помощью иллюстраций",
        "Natijalarni rasmlar bilan tushuntirish",
        "A",
        "circle",
      ],
      [
        "Ask participants about their experience",
        "Расспросить участников об их опыте",
        "Ishtirokchilardan tajribasini so‘rash",
        "S",
        "circle",
      ],
      [
        "Present the proposal to decision makers",
        "Представить предложение руководителям",
        "Taklifni qaror qabul qiluvchilarga taqdim etish",
        "E",
        "star",
      ],
      [
        "Manage files and deadlines",
        "Управлять файлами и сроками",
        "Fayllar va muddatlarni boshqarish",
        "C",
        "square",
      ],
    ],
  },
  {
    theme: "element",
    prompt: [
      "Which summer experience would you choose?",
      "Какой летний опыт вы бы выбрали?",
      "Yozda qaysi tajribani tanlaysiz?",
    ],
    choices: [
      [
        "A maker workshop",
        "Мастерская для создания вещей",
        "Buyumlar yasash ustaxonasi",
        "R",
        "square",
      ],
      [
        "A science research group",
        "Группа научных исследований",
        "Ilmiy tadqiqot guruhi",
        "I",
        "leaf",
      ],
      ["A creative studio", "Творческая студия", "Ijodiy studiya", "A", "circle"],
      [
        "A youth support program",
        "Программа помощи молодёжи",
        "Yoshlarga yordam dasturi",
        "S",
        "circle",
      ],
      [
        "A startup challenge",
        "Конкурс предпринимательских идей",
        "Tadbirkorlik g‘oyalari tanlovi",
        "E",
        "star",
      ],
      [
        "An operations team",
        "Команда по организации процессов",
        "Jarayonlarni tashkil qilish jamoasi",
        "C",
        "square",
      ],
    ],
  },
];

export const ADULT_ACTIVITY_BANK: InterestQ[] = sets.map((set, index) =>
  tagInterest({
    id: `ai${index + 1}`,
    section: "interest",
    theme: set.theme,
    prompt: set.prompt[0],
    select: "one",
    evidenceKind: "activity",
    ageGroups: ["teen_adult"],
    options: set.choices.map(([label, , , dim, icon], optionIndex) => ({
      id: `ai${index + 1}_${optionIndex}`,
      label,
      visual: { kind: "icon", icon },
      riasec: { [dim]: 3 },
    })),
  }),
);

export const ADULT_ACTIVITY_TRANSLATIONS: Record<string, QT> = Object.fromEntries(
  sets.map((set, index) => [
    `ai${index + 1}`,
    {
      ru: { prompt: set.prompt[1], options: set.choices.map((choice) => choice[1]) },
      uz: { prompt: set.prompt[2], options: set.choices.map((choice) => choice[2]) },
    },
  ]),
);
