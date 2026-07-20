// Translations for the standalone IQ test (routes/iq-test.tsx).
// Kept separate from question-translations.ts on purpose: that module holds the
// career-assessment banks and is only ever needed server-side, while this one
// ships to the browser with the IQ test page. Splitting them keeps ~100 kB of
// career translations out of the client bundle.
import type { QT } from "./question-translations";

export const IQ_TEST_TRANSLATIONS: Record<number, QT> = {
  1: {
    ru: {
      prompt:
        "Белая точка движется по два места против часовой стрелки на каждом этапе. Чёрная точка движется по одному месту по часовой стрелке. Белая начинает в нижнем левом углу, чёрная — в верхнем правом. После скольких этапов обе точки окажутся в одном углу?",
      options: ["2 этапа", "4 этапа", "6 этапов", "8 этапов"],
    },
    uz: {
      prompt:
        "Oq nuqta har bosqichda soat miliga qarshi 2 ta joy silжийди. Qora nuqta soat mili bo'yicha 1 ta joy siljiydi. Oq qo'yi chap burchakdan, qora o'ng yuqori burchakdan boshlaydi. Necha bosqichdan keyin ikkalasi bir burchakda bo'ladi?",
      options: ["2 bosqich", "4 bosqich", "6 bosqich", "8 bosqich"],
    },
  },
  4: {
    ru: {
      prompt:
        "Какие два слова наиболее ПРОТИВОПОЛОЖНЫ по значению?\nвоображаемый, реалистичный, неразборчивый, неосуществимый, радикальный, приукрашенный",
      options: [
        "воображаемый / радикальный",
        "реалистичный / неосуществимый",
        "неразборчивый / приукрашенный",
        "радикальный / приукрашенный",
      ],
    },
    uz: {
      prompt:
        "Qaysi ikki so'z ma'nosi bo'yicha eng qarama-qarshi?\nxayoliy, realistik, o'qib bo'lmaydigan, amalga oshirilmaydigan, radikal, bezatilgan",
      options: [
        "xayoliy / radikal",
        "realistik / amalga oshirilmaydigan",
        "o'qib bo'lmaydigan / bezatilgan",
        "radikal / bezatilgan",
      ],
    },
  },
  7: {
    ru: {
      prompt:
        "Определите по одному слову из каждой скобки, которое образует связь со словом в верхнем регистре.\nСДЕРЖИВАТЬ (подавлять / отрицать / скрывать)\nУТАИВАТЬ (обуздывать / резервировать / скрывать)",
      options: [
        "отрицать / обуздывать",
        "подавлять / резервировать",
        "скрывать / скрывать",
        "подавлять / обуздывать",
      ],
    },
    uz: {
      prompt:
        "Har bir qavsdan bir so'z tanlang.\nCHEKLAMOQ (bostirmoq / inkor etmoq / yashirmoq)\nYASHIRMOQ (jilovlamoq / saqlamoq / yashirmoq)",
      options: [
        "inkor etmoq / jilovlamoq",
        "bostirmoq / saqlamoq",
        "yashirmoq / yashirmoq",
        "bostirmoq / jilovlamoq",
      ],
    },
  },
  11: {
    ru: {
      prompt: "Коллега относится к коллеге, как сообщник относится к:",
      options: ["соучастнику", "другу", "помощнику", "товарищу", "последователю"],
    },
    uz: {
      prompt: "Hamkor sheriкka qanday munosabatda bo'lsa, hamkorchi shunday munosabatda:",
      options: ["sherikchi", "do'st", "yordamchi", "hamroh", "izdosh"],
    },
  },
  12: {
    ru: {
      prompt:
        "Что является лишним?\nзнаменитый, прославленный, восхваляемый, сказочный, примечательный",
      options: ["знаменитый", "прославленный", "сказочный", "примечательный"],
    },
    uz: {
      prompt: "Qaysi biri ortiqcha?\nmashxur, ulug'vor, mashhur, sehrli, e'tiborga molik",
      options: ["mashxur", "ulug'vor", "sehrli", "e'tiborga molik"],
    },
  },
  17: {
    ru: {
      prompt:
        "Какое слово в скобках наиболее ПРОТИВОПОЛОЖНО значению слова СМЯГЧАТЬ?\n(усиливать, облегчать, ценить, доверять, разрушать)",
      options: ["усиливать", "облегчать", "ценить", "разрушать"],
    },
    uz: {
      prompt:
        "Qavs ichidagi qaysi so'z YUMSHATMOQ so'ziga eng qarama-qarshi ma'noda?\n(kuchaytirmoq, yengillashtirmoq, qadrlamoq, ishonmoq, yo'q qilmoq)",
      options: ["kuchaytirmoq", "yengillashtirmoq", "qadrlamoq", "yo'q qilmoq"],
    },
  },
  19: {
    ru: {
      prompt:
        "Какие два слова наиболее близки по значению?\nобразованный, ясный, буквальный, обессиленный, многословный, дословный",
      options: [
        "образованный / ясный",
        "буквальный / дословный",
        "многословный / образованный",
        "ясный / дословный",
      ],
    },
    uz: {
      prompt:
        "Qaysi ikki so'z ma'nosi jihatidan eng yaqin?\nta'limli, aniq, so'zma-so'z, halsiz, so'zchil, aynan",
      options: ["ta'limli / aniq", "so'zma-so'z / aynan", "so'zchil / ta'limli", "aniq / aynan"],
    },
  },
  23: {
    ru: {
      prompt:
        "Какое слово в скобках наиболее близко по значению к ПРИВЫЧНЫЙ?\n(постоянный, привычный, колонизированный, обыденный, энергичный)",
      options: ["постоянный", "привычный", "колонизированный", "обыденный"],
    },
    uz: {
      prompt:
        "Qavs ichidagi qaysi so'z ODATLANGAN so'ziga eng yaqin ma'noda?\n(doimiy, odatiy, mustamlaka qilingan, oddiy, faol)",
      options: ["doimiy", "odatiy", "mustamlaka qilingan", "oddiy"],
    },
  },
  25: {
    ru: {
      prompt:
        "Бочка вмещает 85 литров, когда полная. Сколько литров остаётся после использования 40%?",
      options: ["34 литра", "45 литров", "51 литр", "55 литров"],
    },
    uz: {
      prompt:
        "Bir bochka to'la bo'lganda 85 litr sig'adi. 40% ishlatilgandan keyin necha litr qoladi?",
      options: ["34 litr", "45 litr", "51 litr", "55 litr"],
    },
  },
  31: {
    ru: {
      prompt:
        "Переключатель A переключает лампочки 1 и 2. Переключатель B — лампочки 2 и 4. Переключатель C — лампочки 1 и 3. Переключатели A, C, B включаются по порядку.\nНачало: лампочки 1●, 2○, 3●, 4○\nРезультат: лампочки 1●, 2●, 3○, 4○\nКакой переключатель неисправен?",
      options: ["Переключатель A", "Переключатель B", "Переключатель C", "Ни один не неисправен"],
    },
    uz: {
      prompt:
        "A tugmasi 1 va 2-chiroqlarni o'zgartiradi. B tugmasi 2 va 4-chiroqlarni. C tugmasi 1 va 3-chiroqlarni. A, C, B tartibida bosiladi.\nBoshlang'ich: 1●, 2○, 3●, 4○\nNatija: 1●, 2●, 3○, 4○\nQaysi tugma nosoz?",
      options: ["A tugmasi", "B tugmasi", "C tugmasi", "Hech biri nosoz emas"],
    },
  },
};
