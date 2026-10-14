import type { PersonalityQ, InterestQ, InterestTheme, RiasecDim } from "./career-assessment";
import type { QT } from "./question-translations";
import { tagInterest, tagPersonality } from "./question-metadata";

// All new content is concrete preference content: no answer keys, math or skill tests.
const statements: [PersonalityQ["axis"], 1 | -1, string, string, string][] = [
  [
    "EI",
    1,
    "I like playing games with a group of friends.",
    "Мне нравится играть с компанией друзей.",
    "Do‘stlarim bilan birga o‘ynashni yoqtiraman.",
  ],
  [
    "EI",
    -1,
    "I like drawing quietly on my own.",
    "Мне нравится спокойно рисовать в одиночку.",
    "Yolg‘iz, tinchgina rasm chizishni yoqtiraman.",
  ],
  [
    "EI",
    1,
    "I like telling my friends about my day.",
    "Мне нравится рассказывать друзьям о своём дне.",
    "Do‘stlarimga kunim haqida aytib berishni yoqtiraman.",
  ],
  [
    "EI",
    -1,
    "After a busy game, I like a quiet break.",
    "После шумной игры мне нравится тихий перерыв.",
    "Shovqinli o‘yindan keyin tinch dam olishni yoqtiraman.",
  ],
  [
    "SN",
    1,
    "I like looking closely at leaves and stones.",
    "Мне нравится рассматривать листья и камешки.",
    "Barglar va toshlarni diqqat bilan ko‘rishni yoqtiraman.",
  ],
  [
    "SN",
    -1,
    "I like making up stories about imaginary animals.",
    "Мне нравится придумывать истории о сказочных животных.",
    "Xayoliy hayvonlar haqida hikoya to‘qishni yoqtiraman.",
  ],
  [
    "SN",
    1,
    "I like building a toy by following its pictures.",
    "Мне нравится собирать игрушку по картинкам.",
    "Rasmlarga qarab o‘yinchoq yig‘ishni yoqtiraman.",
  ],
  [
    "SN",
    -1,
    "I like finding a new way to play with a toy.",
    "Мне нравится придумывать новую игру с игрушкой.",
    "O‘yinchoq bilan yangi o‘yin o‘ylab topishni yoqtiraman.",
  ],
  [
    "TF",
    1,
    "When a toy stops working, I want to see what happened.",
    "Если игрушка сломалась, мне хочется узнать, что случилось.",
    "O‘yinchoq ishlamay qolsa, nima bo‘lganini bilishni xohlayman.",
  ],
  [
    "TF",
    -1,
    "When a friend is sad, I like cheering them up.",
    "Если другу грустно, мне нравится его поддержать.",
    "Do‘stim xafa bo‘lsa, uni xursand qilishni yoqtiraman.",
  ],
  [
    "TF",
    1,
    "I like checking the rules before starting a game.",
    "Мне нравится узнавать правила перед игрой.",
    "O‘yin boshlashdan oldin qoidalarni bilishni yoqtiraman.",
  ],
  [
    "TF",
    -1,
    "I like making sure everyone can join our game.",
    "Мне нравится, когда все могут участвовать в нашей игре.",
    "Hamma o‘yinimizga qo‘shila olishini yoqtiraman.",
  ],
  [
    "JP",
    1,
    "I like putting my toys back in their places.",
    "Мне нравится класть игрушки на свои места.",
    "O‘yinchoqlarimni joyiga qo‘yishni yoqtiraman.",
  ],
  [
    "JP",
    -1,
    "I like choosing what to play as I go.",
    "Мне нравится выбирать игру по настроению.",
    "Nima o‘ynashni o‘sha paytda tanlashni yoqtiraman.",
  ],
  [
    "JP",
    1,
    "I like finishing one drawing before starting another.",
    "Мне нравится закончить один рисунок, прежде чем начать другой.",
    "Yangi rasm boshlashdan oldin avvalgisini tugatishni yoqtiraman.",
  ],
  [
    "JP",
    -1,
    "I like trying a surprise activity.",
    "Мне нравится пробовать неожиданное занятие.",
    "Kutilmagan mashg‘ulotni sinab ko‘rishni yoqtiraman.",
  ],
];

const activities: [string, string, string, string, RiasecDim][] = [
  ["Build a toy house", "Построить игрушечный домик", "O‘yinchoq uy qurish", "square", "R"],
  [
    "Explore leaves and bugs",
    "Рассматривать листья и жуков",
    "Barg va hasharotlarni kuzatish",
    "leaf",
    "I",
  ],
  ["Draw a story", "Нарисовать историю", "Hikoya rasmini chizish", "circle", "A"],
  ["Help a friend", "Помочь другу", "Do‘stga yordam berish", "circle", "S"],
  ["Lead a group game", "Организовать общую игру", "Guruh o‘yinini boshqarish", "star", "E"],
  [
    "Sort a toy collection",
    "Разложить коллекцию игрушек",
    "O‘yinchoqlarni tartiblash",
    "square",
    "C",
  ],
];
// Different concrete activities keep the pool from repeating the same six choices.
const activitySets: (typeof activities)[] = [
  activities,
  [
    ["Make a kite", "Сделать воздушного змея", "Varrak yasash", "square", "R"],
    ["Watch birds outside", "Наблюдать за птицами", "Qushlarni kuzatish", "leaf", "I"],
    ["Make up a song", "Придумать песню", "Qo‘shiq o‘ylab topish", "circle", "A"],
    ["Show a friend a game", "Показать другу игру", "Do‘stga o‘yin ko‘rsatish", "circle", "S"],
    [
      "Organize a treasure hunt",
      "Устроить поиск сокровищ",
      "Xazina qidirish o‘yinini tashkil qilish",
      "star",
      "E",
    ],
    [
      "Arrange a shelf of books",
      "Разложить книги на полке",
      "Kitoblarni javonga tartiblash",
      "square",
      "C",
    ],
  ],
  [
    [
      "Grow a small plant",
      "Вырастить маленькое растение",
      "Kichik o‘simlik o‘stirish",
      "leaf",
      "R",
    ],
    ["Look at clouds", "Наблюдать за облаками", "Bulutlarni kuzatish", "circle", "I"],
    ["Paint a picture", "Нарисовать картину", "Rasm chizish", "circle", "A"],
    [
      "Read with a younger child",
      "Почитать с младшим ребёнком",
      "Kichik bola bilan kitob o‘qish",
      "circle",
      "S",
    ],
    ["Plan a picnic game", "Придумать игру для пикника", "Sayr uchun o‘yin rejalash", "star", "E"],
    [
      "Sort colourful beads",
      "Разложить цветные бусины",
      "Rangli munchoqlarni tartiblash",
      "square",
      "C",
    ],
  ],
  [
    [
      "Build a block tower",
      "Построить башню из кубиков",
      "Kubiklardan minora qurish",
      "square",
      "R",
    ],
    [
      "Explore with a magnifying glass",
      "Рассматривать всё через лупу",
      "Lupa bilan narsalarni kuzatish",
      "leaf",
      "I",
    ],
    [
      "Make a puppet story",
      "Придумать кукольную историю",
      "Qo‘g‘irchoq hikoyasini to‘qish",
      "circle",
      "A",
    ],
    [
      "Make a card for a friend",
      "Сделать открытку другу",
      "Do‘stga tabriknoma yasash",
      "circle",
      "S",
    ],
    [
      "Invite friends to a game",
      "Позвать друзей на игру",
      "Do‘stlarni o‘yinga taklif qilish",
      "star",
      "E",
    ],
    [
      "Put game pieces in order",
      "Разложить детали игры",
      "O‘yin qismlarini tartiblash",
      "square",
      "C",
    ],
  ],
];
const activitiesFor = (i: number) => activitySets[i % activitySets.length];
const prompts: [InterestTheme, string, string, string][] = [
  [
    "games",
    "Which activity would you pick after school?",
    "Что выберешь после школы?",
    "Maktabdan keyin qaysi mashg‘ulotni tanlaysan?",
  ],
  [
    "object",
    "What would you like to try with your friends?",
    "Что хочется попробовать с друзьями?",
    "Do‘stlaring bilan nimani sinab ko‘rmoqchisan?",
  ],
  [
    "landscape",
    "What sounds fun on a rainy day?",
    "Чем интересно заняться в дождливый день?",
    "Yomg‘irli kunda nima qilish qiziqarli?",
  ],
  [
    "animal",
    "Which activity makes you curious?",
    "Какое занятие вызывает любопытство?",
    "Qaysi mashg‘ulot seni qiziqtiradi?",
  ],
  [
    "color",
    "What would you pick for a free afternoon?",
    "Что выберешь в свободный день?",
    "Bo‘sh vaqtingda nimani tanlaysan?",
  ],
  [
    "material",
    "What would you like to make or do today?",
    "Что хочется сделать сегодня?",
    "Bugun nima qilishni xohlaysan?",
  ],
  [
    "sound",
    "What would you like to share with a friend?",
    "Чем хочется заняться вместе с другом?",
    "Do‘sting bilan birga nima qilmoqchisan?",
  ],
  [
    "motion",
    "Which activity would you start first?",
    "С какого занятия начнёшь?",
    "Qaysi mashg‘ulotni avval boshlaysan?",
  ],
  [
    "element",
    "What sounds fun during a holiday?",
    "Чем интересно заняться на каникулах?",
    "Ta’tilda nima qilish qiziqarli?",
  ],
  [
    "pattern",
    "Which activity would you like to learn more about?",
    "О каком занятии хочется узнать больше?",
    "Qaysi mashg‘ulot haqida ko‘proq bilmoqchisan?",
  ],
  [
    "games",
    "Which activity would you choose for a play day?",
    "Что выберешь для дня игр?",
    "O‘yin kuni uchun nimani tanlaysan?",
  ],
  [
    "object",
    "What would you enjoy doing with a new friend?",
    "Чем интересно заняться с новым другом?",
    "Yangi do‘st bilan nima qilish qiziqarli?",
  ],
  [
    "landscape",
    "What would you do on a quiet weekend?",
    "Чем займёшься в спокойный выходной?",
    "Tinch dam olish kunida nima qilasan?",
  ],
  [
    "animal",
    "Which activity would you tell your family about?",
    "О каком занятии расскажешь семье?",
    "Oilangga qaysi mashg‘ulot haqida aytib berasan?",
  ],
  [
    "color",
    "Which activity would you like to do again?",
    "Какое занятие хочется повторить?",
    "Qaysi mashg‘ulotni yana qilishni xohlaysan?",
  ],
  [
    "material",
    "What would you choose at an activity club?",
    "Что выберешь в кружке?",
    "To‘garakda nimani tanlaysan?",
  ],
  [
    "sound",
    "Which activity would make your day happier?",
    "Какое занятие поднимет настроение?",
    "Qaysi mashg‘ulot seni xursand qiladi?",
  ],
  [
    "motion",
    "What would you like to try tomorrow?",
    "Что хочется попробовать завтра?",
    "Ertaga nimani sinab ko‘rmoqchisan?",
  ],
  [
    "element",
    "Which activity would you invite a friend to?",
    "На какое занятие позовёшь друга?",
    "Do‘stingni qaysi mashg‘ulotga taklif qilasan?",
  ],
  [
    "pattern",
    "Which activity would you pick just for fun?",
    "Что выберешь просто для удовольствия?",
    "Shunchaki zavqlanish uchun nimani tanlaysan?",
  ],
];

export const CHILD_PERSONALITY: PersonalityQ[] = statements.map(([axis, direction, prompt], i) =>
  tagPersonality({
    id: `cp${i + 1}`,
    section: "personality",
    prompt,
    axis,
    direction,
    ageGroups: ["child"],
    addedBy: "feature-age",
  }),
);
export const CHILD_INTEREST: InterestQ[] = prompts.map(([theme, prompt], i) =>
  tagInterest({
    id: `ci${i + 1}`,
    section: "interest",
    theme,
    prompt,
    select: "one",
    evidenceKind: "activity",
    ageGroups: ["child"],
    addedBy: "feature-age",
    options: activitiesFor(i).map(([label, , , icon, dim], j) => ({
      id: `ci${i + 1}_${j}`,
      label,
      visual: { kind: "icon", icon },
      riasec: { [dim]: 3 },
    })),
  }),
);
export const CHILD_TRANSLATIONS: Record<string, QT> = Object.fromEntries([
  ...statements.map(([, , , ru, uz], i) => [
    `cp${i + 1}`,
    { ru: { prompt: ru }, uz: { prompt: uz } },
  ]),
  ...prompts.map(([, , ru, uz], i) => [
    `ci${i + 1}`,
    {
      ru: { prompt: ru, options: activitiesFor(i).map((a) => a[1]) },
      uz: { prompt: uz, options: activitiesFor(i).map((a) => a[2]) },
    },
  ]),
]);
