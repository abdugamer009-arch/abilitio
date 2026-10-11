// Complete localized instructions and order-aligned options for the expanded cognitive pool.
// English letters/anagrams/grammar remain explicit English stimuli, not silently translated puzzles.
import type { QT } from "./question-translations";

export const COGNITIVE_TRANSLATIONS: Record<string, QT> = {
  c8: {
    ru: {
      prompt: "Найдите пропущенное число или элемент последовательности: 1, 4, 9, 16, 25, ?",
      options: ["30", "32", "36", "49"],
    },
    uz: {
      prompt: "Ketma-ketlikdagi yetishmayotgan son yoki elementni toping: 1, 4, 9, 16, 25, ?",
      options: ["30", "32", "36", "49"],
    },
  },
  c1: {
    ru: {
      prompt: "Найдите пропущенное число или элемент последовательности: 2, 6, 12, 20, 30, ?",
      options: ["36", "40", "42", "44"],
    },
    uz: {
      prompt: "Ketma-ketlikdagi yetishmayotgan son yoki elementni toping: 2, 6, 12, 20, 30, ?",
      options: ["36", "40", "42", "44"],
    },
  },
  c5: {
    ru: {
      prompt:
        "Если 5 станков делают 5 деталей за 5 минут, сколько минут нужно 100 станкам, чтобы сделать 100 деталей?",
      options: ["100 мин", "20 мин", "5 мин", "1 мин"],
    },
    uz: {
      prompt:
        "5 ta stanok 5 ta detalni 5 daqiqada tayyorlasa, 100 ta stanok 100 ta detalni necha daqiqada tayyorlaydi?",
      options: ["100 daqiqa", "20 daqiqa", "5 daqiqa", "1 daqiqa"],
    },
  },
  c3: {
    ru: {
      prompt: "Если CAT = 3120 и DOG = 4157, какой код у BIRD? Используйте английский алфавит.",
      options: ["29184", "21845", "29154", "29185"],
    },
    uz: {
      prompt: "CAT = 3120 va DOG = 4157 bo‘lsa, BIRD kodi qanday? Ingliz alifbosidan foydalaning.",
      options: ["29184", "21845", "29154", "29185"],
    },
  },
  c6: {
    ru: {
      prompt: "Продолжите последовательность английских букв: A, C, F, J, O, ?",
      options: ["S", "T", "U", "V"],
    },
    uz: {
      prompt: "Ingliz harflari ketma-ketligini davom ettiring: A, C, F, J, O, ?",
      options: ["S", "T", "U", "V"],
    },
  },
  c10: {
    ru: {
      prompt: "Найдите пропущенное число или элемент последовательности: 81, 27, 9, 3, ?",
      options: ["0", "1", "1.5", "2"],
    },
    uz: {
      prompt: "Ketma-ketlikdagi yetishmayotgan son yoki elementni toping: 81, 27, 9, 3, ?",
      options: ["0", "1", "1.5", "2"],
    },
  },
  iq1_v2: {
    ru: {
      prompt:
        "Белая точка начинает в нижнем левом углу и на каждом шаге перемещается на два угла против часовой стрелки. Чёрная начинает в верхнем правом углу и перемещается на один угол по часовой стрелке. Через сколько шагов они окажутся в одном углу?",
      options: ["2 этапа", "4 этапа", "6 этапа", "8 этапа"],
    },
    uz: {
      prompt:
        "Oq nuqta pastki chap burchakdan boshlanib, har bosqichda soat miliga teskari ikki burchak siljiydi. Qora nuqta yuqori o‘ng burchakdan boshlanib, soat mili bo‘ylab bir burchak siljiydi. Necha bosqichdan so‘ng ular bir burchakda bo‘ladi?",
      options: ["2 bosqich", "4 bosqich", "6 bosqich", "8 bosqich"],
    },
  },
  iq2: {
    ru: {
      prompt:
        "Найдите недостающий код по примерам: 72496 → 1315; 62134 → 97; 85316 → 167; 28439 → ?",
      options: ["1412", "5823", "741", "2819"],
    },
    uz: {
      prompt:
        "Misollarga qarab yetishmayotgan kodni toping: 72496 → 1315; 62134 → 97; 85316 → 167; 28439 → ?",
      options: ["1412", "5823", "741", "2819"],
    },
  },
  iq3: {
    ru: {
      prompt:
        "Какая группа английских букв отличается от остальных? CEFH, HJKN, LNOQ, PRSV, UWXZ, DFGI.",
      options: ["CEFH", "HJKN", "PRSV", "DFGI"],
    },
    uz: {
      prompt:
        "Qaysi ingliz harflari guruhi boshqalaridan farq qiladi? CEFH, HJKN, LNOQ, PRSV, UWXZ, DFGI.",
      options: ["CEFH", "HJKN", "PRSV", "DFGI"],
    },
  },
  iq7: {
    ru: {
      prompt:
        "Найдите пропущенное число или элемент последовательности: 100, 95, ?, 79, 68, ?, 40, 23",
      options: ["88 и 55", "85 и 52", "86 и 54", "90 и 57"],
    },
    uz: {
      prompt:
        "Ketma-ketlikdagi yetishmayotgan son yoki elementni toping: 100, 95, ?, 79, 68, ?, 40, 23",
      options: ["88 va 55", "85 va 52", "86 va 54", "90 va 57"],
    },
  },
  iq8: {
    ru: {
      prompt:
        "Какая пара близких по смыслу английских слов является анаграммой GAINED VOTE? Английские слова сохранены для задания.",
      options: ["DEVOTED / GAIN", "DONATE / GIVE", "AVID / TONE", "VOTED / AGAIN"],
    },
    uz: {
      prompt:
        "Qaysi ma’nodosh ingliz so‘zlari jufti GAINED VOTE anagrammasidir? Topshiriq uchun ingliz so‘zlari saqlangan.",
      options: ["DEVOTED / GAIN", "DONATE / GIVE", "AVID / TONE", "VOTED / AGAIN"],
    },
  },
  iq11: {
    ru: {
      prompt:
        "Найдите пропущенное число или элемент последовательности: 19  9  17\n23 12  25\n13  ?  31",
      options: ["9", "11", "13", "15"],
    },
    uz: {
      prompt:
        "Ketma-ketlikdagi yetishmayotgan son yoki elementni toping: 19  9  17\n23 12  25\n13  ?  31",
      options: ["9", "11", "13", "15"],
    },
  },
  iq12: {
    ru: {
      prompt:
        "Какая английская буква находится на три позиции правее буквы непосредственно слева от буквы на четыре позиции левее G? Алфавит: A B C D E F G H I …",
      options: ["C", "D", "E", "F"],
    },
    uz: {
      prompt:
        "G dan to‘rt o‘rin chapdagi harfning darhol chapidagi harfdan uch o‘rin o‘ngda qaysi ingliz harfi turadi? Alifbo: A B C D E F G H I …",
      options: ["C", "D", "E", "F"],
    },
  },
  iq15: {
    ru: {
      prompt:
        "Какая пара противоположных по смыслу английских слов является анаграммой DECISIVE LARK? Английские слова сохранены для задания.",
      options: ["CRAVE / DISLIKE", "LACKED / REVISE", "DERIVED / LACKS", "CLEARS / DIVIDE"],
    },
    uz: {
      prompt:
        "Qaysi qarama-qarshi ma’noli ingliz so‘zlari jufti DECISIVE LARK anagrammasidir? Topshiriq uchun ingliz so‘zlari saqlangan.",
      options: ["CRAVE / DISLIKE", "LACKED / REVISE", "DERIVED / LACKS", "CLEARS / DIVIDE"],
    },
  },
  iq17: {
    ru: {
      prompt: "Найдите пропущенное число или элемент последовательности: 10, 21, 33, 46, 60, 75, ?",
      options: ["88", "90", "91", "93"],
    },
    uz: {
      prompt:
        "Ketma-ketlikdagi yetishmayotgan son yoki elementni toping: 10, 21, 33, 46, 60, 75, ?",
      options: ["88", "90", "91", "93"],
    },
  },
  iq19_v2: {
    ru: {
      prompt:
        "Выберите слово для пропуска в английском предложении: The association held ___ annual show.",
      options: ["it's", "its", "it", "it is"],
    },
    uz: {
      prompt:
        "Ingliz gapidagi bo‘sh joyga mos so‘zni tanlang: The association held ___ annual show.",
      options: ["it's", "its", "it", "it is"],
    },
  },
  iq20: {
    ru: {
      prompt:
        "Найдите пропущенное число или элемент последовательности: 1  3   7  13\n4  6  10  16\n9  11 15  21\n16 18  22  ?",
      options: ["24", "26", "28", "30"],
    },
    uz: {
      prompt:
        "Ketma-ketlikdagi yetishmayotgan son yoki elementni toping: 1  3   7  13\n4  6  10  16\n9  11 15  21\n16 18  22  ?",
      options: ["24", "26", "28", "30"],
    },
  },
  iq21_v2: {
    ru: {
      prompt:
        "A переключает лампы 1 и 2; B — 2 и 4; C — 1 и 3. Неисправный выключатель ничего не меняет. Нажали A, C, затем B. Сначала горели только 1 и 3, в конце — только 1 и 2. Какой выключатель неисправен?",
      options: ["Выключатель A", "Выключатель B", "Выключатель C", "Ни один"],
    },
    uz: {
      prompt:
        "A 1 va 2 chiroqni, B 2 va 4 ni, C 1 va 3 ni almashtiradi. Nosoz kalit hech narsani o‘zgartirmaydi. A, C, so‘ng B bosildi. Avval faqat 1 va 3 yongan, oxirida faqat 1 va 2 yondi. Qaysi kalit nosoz?",
      options: ["A kalit", "B kalit", "C kalit", "Hech biri"],
    },
  },
  iq22_v2: {
    ru: {
      prompt:
        "Число в середине равно сумме чисел слева и справа. Строки: (3.5, 7.5, 4), (5, 11, 6), (1.5, 3.5, 2), (4.5, ?, 2). Найдите ?.",
      options: ["5.5", "6.5", "7.5", "8.0"],
    },
    uz: {
      prompt:
        "O‘rtadagi son chap va o‘ng sonlarning yig‘indisi. Qatorlar: (3.5, 7.5, 4), (5, 11, 6), (1.5, 3.5, 2), (4.5, ?, 2). ? ni toping.",
      options: ["5.5", "6.5", "7.5", "8.0"],
    },
  },
  iq23: {
    ru: {
      prompt:
        "Найдите пропущенное число или элемент последовательности: 49  615  62\n85  177  29\n53   ?   74",
      options: ["910", "127", "821", "635"],
    },
    uz: {
      prompt:
        "Ketma-ketlikdagi yetishmayotgan son yoki elementni toping: 49  615  62\n85  177  29\n53   ?   74",
      options: ["910", "127", "821", "635"],
    },
  },
  iq24: {
    ru: {
      prompt: "Часы показывают 3:15. Каков угол между часовой и минутной стрелками?",
      options: ["0°", "7.5°", "15°", "22.5°"],
    },
    uz: {
      prompt: "Soat 3:15 ni ko‘rsatmoqda. Soat va daqiqa millari orasidagi burchak qancha?",
      options: ["0°", "7.5°", "15°", "22.5°"],
    },
  },
  iq25: {
    ru: {
      prompt:
        "Какое из английских слов стоит последним по алфавиту: Arthropod, Artificer, Arteriole, Artichoke? Слова не переводятся, поскольку проверяется их порядок.",
      options: ["Arthropod", "Artificer", "Arteriole", "Artichoke"],
    },
    uz: {
      prompt:
        "Qaysi ingliz so‘zi alifbo tartibida oxirgi: Arthropod, Artificer, Arteriole, Artichoke? Harflar tartibi tekshirilgani uchun so‘zlar tarjima qilinmagan.",
      options: ["Arthropod", "Artificer", "Arteriole", "Artichoke"],
    },
  },
  iq27_v2: {
    ru: {
      prompt:
        "Начните с A и переходите на одну клетку по горизонтали или вертикали. Строки сетки: ABC / FED / GHI. Какую последовательность можно пройти, не посещая клетку повторно?",
      options: ["ACBDEFGHI", "ABCDEFGHI", "ABCFEDGHI", "ABDECFGHI"],
    },
    uz: {
      prompt:
        "A dan boshlang va gorizontal yoki vertikal bir katak yuring. Jadval qatorlari: ABC / FED / GHI. Katakka qaytmasdan qaysi ketma-ketlikni o‘tish mumkin?",
      options: ["ACBDEFGHI", "ABCDEFGHI", "ABCFEDGHI", "ABDECFGHI"],
    },
  },
  iq28_v2: {
    ru: {
      prompt:
        "Читайте периметр сетки 3×3 по часовой стрелке от верхнего левого угла. Строки: NOC / LXT / ANU. Какая последовательность получится?",
      options: ["NOCTUNAL", "NOCNALUT", "NOLANUTC", "NOCLTUNA"],
    },
    uz: {
      prompt:
        "3×3 jadvalning chetini yuqori chap burchakdan soat mili bo‘ylab o‘qing. Qatorlar: NOC / LXT / ANU. Qaysi ketma-ketlik hosil bo‘ladi?",
      options: ["NOCTUNAL", "NOCNALUT", "NOLANUTC", "NOCLTUNA"],
    },
  },
  iq29_v2: {
    ru: {
      prompt: "Примените то же правило вычитания: (9, 4) → 5; (7, 5) → 2; (8, 1) → 7; (11, 6) → ?",
      options: ["3", "4", "5", "6"],
    },
    uz: {
      prompt: "Bir xil ayirish qoidasini qo‘llang: (9, 4) → 5; (7, 5) → 2; (8, 1) → 7; (11, 6) → ?",
      options: ["3", "4", "5", "6"],
    },
  },
  iq30_v2: {
    ru: {
      prompt:
        "Сложите первые две цифры и отдельно последние три, затем запишите суммы подряд. Например, 72496 → 915 и 62134 → 88. Каков код 28439?",
      options: ["1016", "1412", "1214", "1610"],
    },
    uz: {
      prompt:
        "Dastlabki ikki raqamni va oxirgi uch raqamni alohida qo‘shib, yig‘indilarni yonma-yon yozing. Masalan, 72496 → 915 va 62134 → 88. 28439 kodi qanday?",
      options: ["1016", "1412", "1214", "1610"],
    },
  },
  iq31: {
    ru: {
      prompt: "В обычном году февраль имеет 28 дней. Сколько месяцев имеют ровно 30 дней?",
      options: ["2", "3", "4", "5"],
    },
    uz: {
      prompt: "Oddiy yilda fevral 28 kun. Nechta oy aynan 30 kundan iborat?",
      options: ["2", "3", "4", "5"],
    },
  },
  iq32_v2: {
    ru: {
      prompt:
        "A выше B. C ниже A. D выше C. Какая пара включает всех, кто может быть самым высоким?",
      options: ["A и D", "A и B", "B и C", "C и D"],
    },
    uz: {
      prompt:
        "A B dan baland. C A dan past. D C dan baland. Eng baland bo‘lishi mumkin bo‘lganlarning barchasi qaysi juftlikda?",
      options: ["A va D", "A va B", "B va C", "C va D"],
    },
  },
  iq34: {
    ru: {
      prompt:
        "Mary вдвое старше, чем была Ann, когда Mary была столько лет, сколько Ann сейчас. Mary 24 года. Сколько лет Ann?",
      options: ["16", "18", "20", "22"],
    },
    uz: {
      prompt:
        "Maryning yoshi, Mary Annning hozirgi yoshida bo‘lgan paytdagi Ann yoshidan ikki baravar katta. Mary 24 yoshda. Ann necha yoshda?",
      options: ["16", "18", "20", "22"],
    },
  },
  iq35: {
    ru: {
      prompt: "Найдите лишнее: Молоток, Стамеска, Гаечный ключ, Отвёртка, Малярная кисть, Пила.",
      options: ["Молоток", "Малярная кисть", "Стамеска", "Гаечный ключ"],
    },
    uz: {
      prompt:
        "Ortiqchasini toping: Bolg‘a, Iskana, Gayka kaliti, Otvyortka, Bo‘yoq cho‘tkasi, Arra.",
      options: ["Bolg‘a", "Bo‘yoq cho‘tkasi", "Iskana", "Gayka kaliti"],
    },
  },
  iq36: {
    ru: {
      prompt: "Найдите пропущенное число или элемент последовательности: AB, CE, FI, JN, ?",
      options: ["OS", "OT", "PS", "PT"],
    },
    uz: {
      prompt: "Ketma-ketlikdagi yetishmayotgan son yoki elementni toping: AB, CE, FI, JN, ?",
      options: ["OS", "OT", "PS", "PT"],
    },
  },
  iq37: {
    ru: {
      prompt: "Переставив английские буквы CIFAIPC, вы получите название чего?",
      options: ["Город", "Океан", "Страна", "Гора"],
    },
    uz: {
      prompt: "CIFAIPC ingliz harflarini qayta tartiblab, nimaning inglizcha nomini hosil qilasiz?",
      options: ["Shahar", "Okean", "Davlat", "Tog‘"],
    },
  },
  iq39: {
    ru: {
      prompt: "Что тяжелее: килограмм перьев или килограмм железа?",
      options: ["Железо", "Перья", "Они весят одинаково", "Зависит от влажности"],
    },
    uz: {
      prompt: "Qaysi biri og‘irroq: bir kilogramm patmi yoki bir kilogramm temirmi?",
      options: ["Temir", "Patlar", "Og‘irligi teng", "Namlikka bog‘liq"],
    },
  },
  iq40: {
    ru: {
      prompt: "Как «Книга» связано с «Библиотека», так «Картина» связано с чем?",
      options: ["Холст", "Музей", "Художник", "Рама"],
    },
    uz: {
      prompt: "«Kitob» «Kutubxona»ga qanday aloqador bo‘lsa, «Rasm» nimaga shunday aloqador?",
      options: ["Tuval", "Muzey", "Rassom", "Ramka"],
    },
  },
  iq44: {
    ru: {
      prompt: "Найдите пропущенное число: 5, 10, 20, ?, 80, 160.",
      options: ["35", "40", "45", "50"],
    },
    uz: {
      prompt: "Yetishmayotgan sonni toping: 5, 10, 20, ?, 80, 160.",
      options: ["35", "40", "45", "50"],
    },
  },
  iq45: {
    ru: {
      prompt: "Часы показывают 3:15. Каков угол между часовой и минутной стрелками?",
      options: ["0°", "7.5°", "15°", "22.5°"],
    },
    uz: {
      prompt: "Soat 3:15 ni ko‘rsatmoqda. Soat va daqiqa millari orasidagi burchak qancha?",
      options: ["0°", "7.5°", "15°", "22.5°"],
    },
  },
  iq47: {
    ru: {
      prompt: "Найдите лишнее: Скрипка, Гитара, Труба, Виолончель, Арфа.",
      options: ["Скрипка", "Труба", "Виолончель", "Арфа"],
    },
    uz: {
      prompt: "Ortiqchasini toping: Skripka, Gitara, Karnay, Violonchel, Arfa.",
      options: ["Skripka", "Karnay", "Violonchel", "Arfa"],
    },
  },
  iq52: {
    ru: {
      prompt: "Найдите пропущенное число или элемент последовательности: 100, 91, 83, 76, 70, ?",
      options: ["63", "65", "67", "69"],
    },
    uz: {
      prompt: "Ketma-ketlikdagi yetishmayotgan son yoki elementni toping: 100, 91, 83, 76, 70, ?",
      options: ["63", "65", "67", "69"],
    },
  },
  iq54: {
    ru: {
      prompt: "Найдите пропущенное число или элемент последовательности: 5, 11, 23, 47, ?, 191",
      options: ["93", "95", "97", "99"],
    },
    uz: {
      prompt: "Ketma-ketlikdagi yetishmayotgan son yoki elementni toping: 5, 11, 23, 47, ?, 191",
      options: ["93", "95", "97", "99"],
    },
  },
  iq55: {
    ru: {
      prompt: "Найдите пропущенное число или элемент последовательности: 3, 9, 27, 81, ?",
      options: ["162", "243", "324", "405"],
    },
    uz: {
      prompt: "Ketma-ketlikdagi yetishmayotgan son yoki elementni toping: 3, 9, 27, 81, ?",
      options: ["162", "243", "324", "405"],
    },
  },
  iq56: {
    ru: {
      prompt: "Найдите пропущенное число или элемент последовательности: 7, 14, 28, 56, ?",
      options: ["96", "112", "120", "128"],
    },
    uz: {
      prompt: "Ketma-ketlikdagi yetishmayotgan son yoki elementni toping: 7, 14, 28, 56, ?",
      options: ["96", "112", "120", "128"],
    },
  },
  iq58: {
    ru: {
      prompt: "Найдите пропущенное число или элемент последовательности: 1, 4, 10, 22, 46, ?",
      options: ["84", "92", "94", "96"],
    },
    uz: {
      prompt: "Ketma-ketlikdagi yetishmayotgan son yoki elementni toping: 1, 4, 10, 22, 46, ?",
      options: ["84", "92", "94", "96"],
    },
  },
  iq59: {
    ru: {
      prompt: "Найдите пропущенное число или элемент последовательности: 6, 11, 21, 41, 81, ?",
      options: ["131", "151", "161", "171"],
    },
    uz: {
      prompt: "Ketma-ketlikdagi yetishmayotgan son yoki elementni toping: 6, 11, 21, 41, 81, ?",
      options: ["131", "151", "161", "171"],
    },
  },
  iq60: {
    ru: {
      prompt: "Найдите пропущенное число или элемент последовательности: 1, 3, 7, 15, 31, ?",
      options: ["57", "61", "63", "67"],
    },
    uz: {
      prompt: "Ketma-ketlikdagi yetishmayotgan son yoki elementni toping: 1, 3, 7, 15, 31, ?",
      options: ["57", "61", "63", "67"],
    },
  },
  iq61: {
    ru: {
      prompt: "Найдите пропущенное число или элемент последовательности: 120, 60, 20, 5, ?",
      options: ["0.5", "1", "1.25", "1.5"],
    },
    uz: {
      prompt: "Ketma-ketlikdagi yetishmayotgan son yoki elementni toping: 120, 60, 20, 5, ?",
      options: ["0.5", "1", "1.25", "1.5"],
    },
  },
  iq62: {
    ru: {
      prompt: "Найдите пропущенное число или элемент последовательности: 2, 6, 18, 54, ?",
      options: ["108", "148", "162", "216"],
    },
    uz: {
      prompt: "Ketma-ketlikdagi yetishmayotgan son yoki elementni toping: 2, 6, 18, 54, ?",
      options: ["108", "148", "162", "216"],
    },
  },
  iq63: {
    ru: {
      prompt: "Найдите пропущенное число или элемент последовательности: 1, 8, 27, 64, ?, 216",
      options: ["100", "112", "125", "135"],
    },
    uz: {
      prompt: "Ketma-ketlikdagi yetishmayotgan son yoki elementni toping: 1, 8, 27, 64, ?, 216",
      options: ["100", "112", "125", "135"],
    },
  },
  iq64: {
    ru: {
      prompt: "Найдите пропущенное число или элемент последовательности: 0, 1, 3, 6, 10, 15, ?",
      options: ["19", "20", "21", "22"],
    },
    uz: {
      prompt: "Ketma-ketlikdagi yetishmayotgan son yoki elementni toping: 0, 1, 3, 6, 10, 15, ?",
      options: ["19", "20", "21", "22"],
    },
  },
  iq65: {
    ru: {
      prompt: "Найдите пропущенное число или элемент последовательности: 256, 128, 64, 32, ?",
      options: ["8", "12", "16", "24"],
    },
    uz: {
      prompt: "Ketma-ketlikdagi yetishmayotgan son yoki elementni toping: 256, 128, 64, 32, ?",
      options: ["8", "12", "16", "24"],
    },
  },
  iq66: {
    ru: {
      prompt: "Найдите пропущенное число или элемент последовательности: 5, 6, 8, 11, 15, 20, ?",
      options: ["24", "25", "26", "27"],
    },
    uz: {
      prompt: "Ketma-ketlikdagi yetishmayotgan son yoki elementni toping: 5, 6, 8, 11, 15, 20, ?",
      options: ["24", "25", "26", "27"],
    },
  },
  iq67: {
    ru: {
      prompt: "Найдите пропущенное число или элемент последовательности: 4, 7, 12, 19, 28, ?",
      options: ["37", "38", "39", "40"],
    },
    uz: {
      prompt: "Ketma-ketlikdagi yetishmayotgan son yoki elementni toping: 4, 7, 12, 19, 28, ?",
      options: ["37", "38", "39", "40"],
    },
  },
  iq68: {
    ru: {
      prompt: "Найдите пропущенное число или элемент последовательности: 2, 3, 5, 7, 11, 13, ?",
      options: ["15", "17", "19", "21"],
    },
    uz: {
      prompt: "Ketma-ketlikdagi yetishmayotgan son yoki elementni toping: 2, 3, 5, 7, 11, 13, ?",
      options: ["15", "17", "19", "21"],
    },
  },
  iq69: {
    ru: {
      prompt: "Найдите пропущенное число или элемент последовательности: 1, 2, 4, 7, 11, 16, ?",
      options: ["20", "21", "22", "23"],
    },
    uz: {
      prompt: "Ketma-ketlikdagi yetishmayotgan son yoki elementni toping: 1, 2, 4, 7, 11, 16, ?",
      options: ["20", "21", "22", "23"],
    },
  },
  iq70: {
    ru: {
      prompt: "Найдите пропущенное число или элемент последовательности: 64, 32, 16, 8, 4, ?",
      options: ["0", "1", "2", "3"],
    },
    uz: {
      prompt: "Ketma-ketlikdagi yetishmayotgan son yoki elementni toping: 64, 32, 16, 8, 4, ?",
      options: ["0", "1", "2", "3"],
    },
  },
  iq71: {
    ru: {
      prompt: "Найдите пропущенное число или элемент последовательности: 12, 24, 48, 96, ?",
      options: ["144", "168", "192", "200"],
    },
    uz: {
      prompt: "Ketma-ketlikdagi yetishmayotgan son yoki elementni toping: 12, 24, 48, 96, ?",
      options: ["144", "168", "192", "200"],
    },
  },
  iq72: {
    ru: {
      prompt: "Найдите пропущенное число или элемент последовательности: 1000, 500, 250, 125, ?",
      options: ["50", "60", "62.5", "65"],
    },
    uz: {
      prompt: "Ketma-ketlikdagi yetishmayotgan son yoki elementni toping: 1000, 500, 250, 125, ?",
      options: ["50", "60", "62.5", "65"],
    },
  },
  iq73: {
    ru: {
      prompt: "Найдите пропущенное число или элемент последовательности: 3, 5, 9, 17, 33, ?",
      options: ["55", "60", "61", "65"],
    },
    uz: {
      prompt: "Ketma-ketlikdagi yetishmayotgan son yoki elementni toping: 3, 5, 9, 17, 33, ?",
      options: ["55", "60", "61", "65"],
    },
  },
  iq74: {
    ru: {
      prompt: "Найдите пропущенное число или элемент последовательности: 10, 9, 7, 4, 0, ?",
      options: ["-3", "-4", "-5", "-6"],
    },
    uz: {
      prompt: "Ketma-ketlikdagi yetishmayotgan son yoki elementni toping: 10, 9, 7, 4, 0, ?",
      options: ["-3", "-4", "-5", "-6"],
    },
  },
  iq75: {
    ru: {
      prompt: "Найдите пропущенное число или элемент последовательности: 1, 5, 14, 30, 55, ?",
      options: ["80", "88", "91", "95"],
    },
    uz: {
      prompt: "Ketma-ketlikdagi yetishmayotgan son yoki elementni toping: 1, 5, 14, 30, 55, ?",
      options: ["80", "88", "91", "95"],
    },
  },
  iq76: {
    ru: {
      prompt: "Найдите пропущенное число или элемент последовательности: 2, 5, 10, 17, 26, ?",
      options: ["35", "36", "37", "38"],
    },
    uz: {
      prompt: "Ketma-ketlikdagi yetishmayotgan son yoki elementni toping: 2, 5, 10, 17, 26, ?",
      options: ["35", "36", "37", "38"],
    },
  },
  iq77: {
    ru: {
      prompt: "Найдите пропущенное число или элемент последовательности: 72, 36, 18, 9, ?",
      options: ["3", "4", "4.5", "5"],
    },
    uz: {
      prompt: "Ketma-ketlikdagi yetishmayotgan son yoki elementni toping: 72, 36, 18, 9, ?",
      options: ["3", "4", "4.5", "5"],
    },
  },
  iq78: {
    ru: {
      prompt: "Найдите пропущенное число или элемент последовательности: 1, 4, 9, 16, 25, 36, ?",
      options: ["42", "47", "49", "51"],
    },
    uz: {
      prompt: "Ketma-ketlikdagi yetishmayotgan son yoki elementni toping: 1, 4, 9, 16, 25, 36, ?",
      options: ["42", "47", "49", "51"],
    },
  },
  iq79: {
    ru: {
      prompt: "Найдите следующее число: 2, 12, 36, 80, 150, ?",
      options: ["222", "245", "252", "260"],
    },
    uz: {
      prompt: "Keyingi sonni toping: 2, 12, 36, 80, 150, ?",
      options: ["222", "245", "252", "260"],
    },
  },
  iq80: {
    ru: {
      prompt: "Найдите пропущенное число или элемент последовательности: 3, 6, 11, 18, 27, 38, ?",
      options: ["49", "51", "52", "54"],
    },
    uz: {
      prompt: "Ketma-ketlikdagi yetishmayotgan son yoki elementni toping: 3, 6, 11, 18, 27, 38, ?",
      options: ["49", "51", "52", "54"],
    },
  },
  iq82: {
    ru: {
      prompt: "Как «Рыба» связано с «Вода», так «Птица» связано с чем?",
      options: ["Крыло", "Небо", "Перо", "Воздух"],
    },
    uz: {
      prompt: "«Baliq» «Suv»ga qanday aloqador bo‘lsa, «Qush» nimaga shunday aloqador?",
      options: ["Qanot", "Osmon", "Pat", "Havo"],
    },
  },
  iq84_v2: {
    ru: {
      prompt: "Марафон относится к бегу, как парусная регата к чему?",
      options: ["Плавание", "Велоспорт", "Парусный спорт", "Скалолазание"],
    },
    uz: {
      prompt: "Marafon yugurishga qanday aloqador bo‘lsa, yelkanli regata nimaga shunday aloqador?",
      options: ["Suzish", "Velosport", "Yelkanli sport", "Qoyaga chiqish"],
    },
  },
  iq85: {
    ru: {
      prompt: "Как «Автобиография» связано с «Автор», так «Портрет» связано с чем?",
      options: ["Галерея", "Модель", "Художник", "Холст"],
    },
    uz: {
      prompt:
        "«Tarjimayi hol» «Muallif»ga qanday aloqador bo‘lsa, «Portret» nimaga shunday aloqador?",
      options: ["Galereya", "Model", "Rassom", "Tuval"],
    },
  },
  iq86: {
    ru: {
      prompt: "Как «Перчатки» связано с «Руки», так «Шлем» связано с чем?",
      options: ["Шея", "Голова", "Плечи", "Лицо"],
    },
    uz: {
      prompt: "«Qo‘lqop» «Qo‘llar»ga qanday aloqador bo‘lsa, «Shlem» nimaga shunday aloqador?",
      options: ["Bo‘yin", "Bosh", "Yelkalar", "Yuz"],
    },
  },
  iq87: {
    ru: {
      prompt: "Найдите лишнее: Рубин, Сапфир, Изумруд, Жемчуг, Алмаз.",
      options: ["Рубин", "Жемчуг", "Алмаз", "Сапфир"],
    },
    uz: {
      prompt: "Ortiqchasini toping: Yoqut, Sapfir, Zumrad, Marvarid, Olmos.",
      options: ["Yoqut", "Marvarid", "Olmos", "Sapfir"],
    },
  },
  iq89: {
    ru: {
      prompt: "Найдите лишнее: Оркестр, Симфония, Концерт, Соната, Фуга.",
      options: ["Оркестр", "Симфония", "Концерт", "Соната"],
    },
    uz: {
      prompt: "Ortiqchasini toping: Orkestr, Simfoniya, Konsert, Sonata, Fuga.",
      options: ["Orkestr", "Simfoniya", "Konsert", "Sonata"],
    },
  },
  iq90: {
    ru: {
      prompt: "Как «Громкий» связано с «Тихий», так «Быстрый» связано с чем?",
      options: ["Быстрый", "Медленный", "Безмолвный", "Неподвижный"],
    },
    uz: {
      prompt:
        "«Baland ovozli» «Past ovozli»ga qanday aloqador bo‘lsa, «Tez» nimaga shunday aloqador?",
      options: ["Tez", "Sekin", "Ovozsiz", "Harakatsiz"],
    },
  },
  iq91: {
    ru: {
      prompt: "Какое слово ближе по смыслу к «Упорный»?",
      options: ["Хрупкий", "Настойчивый", "Спокойный", "Гибкий"],
    },
    uz: {
      prompt: "Qaysi so‘z «Qat’iyatli»ga ma’nodosh?",
      options: ["Mo‘rt", "Tirishqoq", "Xotirjam", "Moslashuvchan"],
    },
  },
  iq92: {
    ru: {
      prompt: "Какое слово противоположно по смыслу слову «Доброжелательный»?",
      options: ["Щедрый", "Злонамеренный", "Безразличный", "Нейтральный"],
    },
    uz: {
      prompt: "Qaysi so‘z «Xayrixoh»ga qarama-qarshi ma’noli?",
      options: ["Saxiy", "Yovuz niyatli", "Befarq", "Betaraf"],
    },
  },
  iq93: {
    ru: {
      prompt: "Какое слово ближе по смыслу к «Многословный»?",
      options: ["Краткий", "Лаконичный", "Многословный", "Безмолвный"],
    },
    uz: {
      prompt: "Qaysi so‘z «Sergap»ga ma’nodosh?",
      options: ["Qisqa", "Lo‘nda", "Sergap", "Ovozsiz"],
    },
  },
  iq94: {
    ru: {
      prompt: "Какое слово противоположно по смыслу слову «Преходящий»?",
      options: ["Мимолётный", "Постоянный", "Краткий", "Временный"],
    },
    uz: {
      prompt: "Qaysi so‘z «O‘tkinchi»ga qarama-qarshi ma’noli?",
      options: ["Bir lahzalik", "Doimiy", "Qisqa", "Vaqtinchalik"],
    },
  },
  iq95: {
    ru: {
      prompt: "Какое слово ближе по смыслу к «Мудрый»?",
      options: ["Мудрый", "Глупый", "Молодой", "Небрежный"],
    },
    uz: {
      prompt: "Qaysi so‘z «Dono»ga ma’nodosh?",
      options: ["Dono", "Ahmoq", "Yosh", "Beparvo"],
    },
  },
  iq96: {
    ru: {
      prompt: "Как «Свет» связано с «Освещать», так «Темнота» связано с чем?",
      options: ["Тень", "Затемнять", "Ночь", "Тусклый"],
    },
    uz: {
      prompt:
        "«Yorug‘lik» «Yoritmoq»ga qanday aloqador bo‘lsa, «Qorong‘ilik» nimaga shunday aloqador?",
      options: ["Soya", "Qorong‘ilashtirmoq", "Tun", "Xira"],
    },
  },
  iq97: {
    ru: {
      prompt: "Найдите лишнее: Треугольник, Квадрат, Пятиугольник, Сфера, Шестиугольник.",
      options: ["Треугольник", "Квадрат", "Сфера", "Шестиугольник"],
    },
    uz: {
      prompt: "Ortiqchasini toping: Uchburchak, Kvadrat, Beshburchak, Sfera, Oltiburchak.",
      options: ["Uchburchak", "Kvadrat", "Sfera", "Oltiburchak"],
    },
  },
  iq98: {
    ru: {
      prompt: "Как «Архитектор» связано с «Чертёж», так «Композитор» связано с чем?",
      options: ["Оркестр", "Партитура", "Дирижёр", "Пианино"],
    },
    uz: {
      prompt: "«Me’mor» «Chizma»ga qanday aloqador bo‘lsa, «Bastakor» nimaga shunday aloqador?",
      options: ["Orkestr", "Partitura", "Dirijyor", "Pianino"],
    },
  },
  iq99: {
    ru: {
      prompt: "Какое слово ближе по смыслу к «Восторженный»?",
      options: ["Подавленный", "Воодушевлённый", "Спокойный", "Сдержанный"],
    },
    uz: {
      prompt: "Qaysi so‘z «Jo‘shqin»ga ma’nodosh?",
      options: ["Tushkun", "G‘ayratli", "Xotirjam", "Vazmin"],
    },
  },
  iq100: {
    ru: {
      prompt: "Как «Стая» связано с «Птицы», так «Стая хищников» связано с чем?",
      options: ["Рыба", "Пчёлы", "Волки", "Вороны"],
    },
    uz: {
      prompt:
        "«Gala» «Qushlar»ga qanday aloqador bo‘lsa, «Yirtqichlar to‘dasi» nimaga shunday aloqador?",
      options: ["Baliq", "Asalarilar", "Bo‘rilar", "Qarg‘alar"],
    },
  },
  iq101: {
    ru: {
      prompt: "Какое слово противоположно по смыслу слову «Расточительный»?",
      options: ["Расточительный", "Расточительный", "Бережливый", "Щедрый"],
    },
    uz: {
      prompt: "Qaysi so‘z «Isrofgar»ga qarama-qarshi ma’noli?",
      options: ["Isrofgar", "Haddan tashqari sarflovchi", "Tejamkor", "Saxiy"],
    },
  },
  iq102: {
    ru: {
      prompt: "Как «Глаз» связано с «Видеть», так «Ухо» связано с чем?",
      options: ["Звук", "Слышать", "Слушать", "Шум"],
    },
    uz: {
      prompt: "«Ko‘z» «Ko‘rmoq»ga qanday aloqador bo‘lsa, «Quloq» nimaga shunday aloqador?",
      options: ["Tovush", "Eshitmoq", "Tinglamoq", "Shovqin"],
    },
  },
  iq103: {
    ru: {
      prompt: "Найдите лишнее: Роза, Тюльпан, Дуб, Маргаритка, Лилия.",
      options: ["Роза", "Тюльпан", "Дуб", "Лилия"],
    },
    uz: {
      prompt: "Ortiqchasini toping: Atirgul, Lola, Eman, Moychechak, Liliya.",
      options: ["Atirgul", "Lola", "Eman", "Liliya"],
    },
  },
  iq105: {
    ru: {
      prompt: "Какое слово ближе по смыслу к «Ясный»?",
      options: ["Запутанный", "Ясный", "Тёмный", "Плотный"],
    },
    uz: {
      prompt: "Qaysi so‘z «Aniq»ga ma’nodosh?",
      options: ["Chalkash", "Aniq", "Qorong‘i", "Zich"],
    },
  },
  iq107: {
    ru: {
      prompt: "Найдите лишнее: Железо, Золото, Ртуть, Бронза, Платина.",
      options: ["Железо", "Золото", "Ртуть", "Бронза"],
    },
    uz: {
      prompt: "Ortiqchasini toping: Temir, Oltin, Simob, Bronza, Platina.",
      options: ["Temir", "Oltin", "Simob", "Bronza"],
    },
  },
  iq108: {
    ru: {
      prompt: "Какое слово ближе по смыслу к «Язвительный»?",
      options: ["Сладкий", "Горький", "Мягкий", "Нейтральный"],
    },
    uz: {
      prompt: "Qaysi so‘z «Achchiq»ga ma’nodosh?",
      options: ["Shirin", "Achchiq", "Yumshoq", "Betaraf"],
    },
  },
  iq109: {
    ru: {
      prompt: "Как «Дерево» связано с «Лес», так «Звезда» связано с чем?",
      options: ["Небо", "Планета", "Галактика", "Луна"],
    },
    uz: {
      prompt: "«Daraxt» «O‘rmon»ga qanday aloqador bo‘lsa, «Yulduz» nimaga shunday aloqador?",
      options: ["Osmon", "Sayyora", "Galaktika", "Oy"],
    },
  },
  iq110: {
    ru: {
      prompt: "Какое слово противоположно по смыслу слову «Разговорчивый»?",
      options: ["Разговорчивый", "Многословный", "Молчаливый", "Красноречивый"],
    },
    uz: {
      prompt: "Qaysi so‘z «Sergap»ga qarama-qarshi ma’noli?",
      options: ["Sergap", "Ko‘p gapiradigan", "Kamgap", "Notiq"],
    },
  },
  iq115: {
    ru: {
      prompt: "Если P → Q и Q → R, что обязательно верно?",
      options: ["R → P", "P → R", "Q → P", "R → Q"],
    },
    uz: {
      prompt: "P → Q va Q → R bo‘lsa, qaysi xulosa albatta rost?",
      options: ["R → P", "P → R", "Q → P", "R → Q"],
    },
  },
  iq116: {
    ru: {
      prompt:
        "Пять человек сидят в ряд. Alice правее Bob; Carol левее Bob; Dave правее Alice; Eve крайняя слева. Кто посередине?",
      options: ["Alice", "Bob", "Carol", "Dave"],
    },
    uz: {
      prompt:
        "Besh kishi bir qatorda o‘tiribdi. Alice Bobdan o‘ngda, Carol Bobdan chapda, Dave Alicedan o‘ngda, Eve eng chapda. O‘rtada kim?",
      options: ["Alice", "Bob", "Carol", "Dave"],
    },
  },
  iq117: {
    ru: {
      prompt: "Некоторые спортсмены — врачи. Все врачи образованны. Какой вывод следует?",
      options: [
        "Все спортсмены образованны",
        "Некоторые спортсмены образованны",
        "Ни один спортсмен не образован",
        "Все образованные люди — спортсмены",
      ],
    },
    uz: {
      prompt: "Ba’zi sportchilar shifokor. Barcha shifokorlar bilimli. Qaysi xulosa kelib chiqadi?",
      options: [
        "Barcha sportchilar bilimli",
        "Ba’zi sportchilar bilimli",
        "Hech bir sportchi bilimli emas",
        "Barcha bilimli odamlar sportchi",
      ],
    },
  },
  iq118_v2: {
    ru: {
      prompt: "Сегодня среда. Какой день недели был 100 дней назад?",
      options: ["Понедельник", "Вторник", "Среда", "Суббота"],
    },
    uz: {
      prompt: "Bugun chorshanba. 100 kun oldin haftaning qaysi kuni edi?",
      options: ["Dushanba", "Seshanba", "Chorshanba", "Shanba"],
    },
  },
  iq120: {
    ru: {
      prompt: "Все Zen являются Pek, и ни один Pek не является Quel. Какой вывод следует?",
      options: [
        "Некоторые Zen — Quel",
        "Ни один Zen не является Quel",
        "Все Quel — Zen",
        "Некоторые Pek — Zen",
      ],
    },
    uz: {
      prompt: "Barcha Zenlar Pek, hech bir Pek Quel emas. Qaysi xulosa kelib chiqadi?",
      options: [
        "Ba’zi Zenlar Quel",
        "Hech bir Zen Quel emas",
        "Barcha Quellar Zen",
        "Ba’zi Peklar Zen",
      ],
    },
  },
  iq121: {
    ru: {
      prompt:
        "Часы отстают на 5 минут за каждый час. Их правильно установили в полдень. Что они покажут в 18:00?",
      options: ["5:30", "5:33", "5:45", "5:55"],
    },
    uz: {
      prompt:
        "Soat har soatda 5 daqiqa orqada qoladi. Tushda to‘g‘ri sozlangan bo‘lsa, 18:00 da nimani ko‘rsatadi?",
      options: ["5:30", "5:33", "5:45", "5:55"],
    },
  },
  iq123_v2: {
    ru: {
      prompt:
        "Jack вдвое старше Jill. Через 10 лет он будет в 1.5 раза старше Jill. Сколько лет Jill сейчас?",
      options: ["10", "15", "20", "25"],
    },
    uz: {
      prompt:
        "Jack Jilldan ikki baravar katta. 10 yildan keyin Jackning yoshi Jillnikidan 1.5 baravar bo‘ladi. Jill hozir necha yoshda?",
      options: ["10", "15", "20", "25"],
    },
  },
  iq126: {
    ru: {
      prompt:
        "Отец на 30 лет старше сына. Через 5 лет возраст отца будет в 4 раза больше возраста сына. Сколько лет сыну сейчас?",
      options: ["5", "7", "8", "10"],
    },
    uz: {
      prompt:
        "Ota o‘g‘lidan 30 yosh katta. 5 yildan keyin otaning yoshi o‘g‘linikidan 4 baravar bo‘ladi. O‘g‘il hozir necha yoshda?",
      options: ["5", "7", "8", "10"],
    },
  },
  iq127: {
    ru: {
      prompt:
        "Две свечи одинаковой высоты равномерно сгорают за 4 и 6 часов. Через сколько часов одна станет вдвое выше другой?",
      options: ["2 ч", "3 ч", "4 ч", "5 ч"],
    },
    uz: {
      prompt:
        "Balandligi teng ikki sham bir tekis yonib, 4 va 6 soatda tugaydi. Necha soatdan keyin biri ikkinchisidan ikki baravar baland bo‘ladi?",
      options: ["2 soat", "3 soat", "4 soat", "5 soat"],
    },
  },
  iq129: {
    ru: {
      prompt:
        "Бак наполняется за 6 часов и опустошается за 10 часов. За сколько часов он наполнится, если оба крана открыты?",
      options: ["12 ч", "15 ч", "16 ч", "18 ч"],
    },
    uz: {
      prompt:
        "Idish 6 soatda to‘ladi va 10 soatda bo‘shaydi. Ikkala jo‘mrak ochiq bo‘lsa, necha soatda to‘ladi?",
      options: ["12 soat", "15 soat", "16 soat", "18 soat"],
    },
  },
  iq130: {
    ru: {
      prompt:
        "Maria получила 70, 80 и 90 за три теста. Сколько нужно за четвёртый для среднего 85?",
      options: ["95", "98", "100", "105"],
    },
    uz: {
      prompt:
        "Maria uchta testdan 70, 80 va 90 oldi. O‘rtacha 85 bo‘lishi uchun to‘rtinchi testdan qancha olishi kerak?",
      options: ["95", "98", "100", "105"],
    },
  },
  iq131: {
    ru: {
      prompt: "Все красные квадраты большие. Этот квадрат не большой. Какой вывод следует?",
      options: [
        "Он красный",
        "Он не красный",
        "Он может быть красным или не красным",
        "Он другого цвета",
      ],
    },
    uz: {
      prompt: "Barcha qizil kvadratlar katta. Bu kvadrat katta emas. Qaysi xulosa kelib chiqadi?",
      options: [
        "U qizil",
        "U qizil emas",
        "U qizil ham, qizil bo‘lmagan ham bo‘lishi mumkin",
        "U boshqa rangda",
      ],
    },
  },
  iq132: {
    ru: {
      prompt:
        "Из 12 шаров один тяжелее остальных. Каково минимальное число взвешиваний на чашечных весах, чтобы гарантированно его найти?",
      options: ["2", "3", "4", "5"],
    },
    uz: {
      prompt:
        "12 ta shardan biri og‘irroq. Uni aniq topish uchun pallali tarozida eng kam necha marta tortish kerak?",
      options: ["2", "3", "4", "5"],
    },
  },
  iq133: {
    ru: {
      prompt: "Понедельник = 1, вторник = 2, … воскресенье = 7. Чему равно среда + пятница?",
      options: ["7", "8", "9", "10"],
    },
    uz: {
      prompt: "Dushanba = 1, seshanba = 2, … yakshanba = 7. Chorshanba + juma nechaga teng?",
      options: ["7", "8", "9", "10"],
    },
  },
  iq135: {
    ru: {
      prompt: "Сколько простых чисел строго между 10 и 30?",
      options: ["3", "4", "5", "6"],
    },
    uz: {
      prompt: "10 va 30 orasida nechta tub son bor?",
      options: ["3", "4", "5", "6"],
    },
  },
  iq136: {
    ru: {
      prompt: "Периметр квадратного поля 400 м. Какова площадь?",
      options: ["1000 м²", "5000 м²", "10 000 м²", "40 000 м²"],
    },
    uz: {
      prompt: "Kvadrat maydon perimetri 400 m. Uning yuzi qancha?",
      options: ["1000 m²", "5000 m²", "10 000 m²", "40 000 m²"],
    },
  },
  iq137: {
    ru: {
      prompt: "В английском алфавите A = 1, B = 2, … Z = 26. Какова сумма значений букв CAB?",
      options: ["6", "8", "9", "12"],
    },
    uz: {
      prompt:
        "Ingliz alifbosida A = 1, B = 2, … Z = 26. CAB harflari qiymatlari yig‘indisi qancha?",
      options: ["6", "8", "9", "12"],
    },
  },
  iq138: {
    ru: {
      prompt: "Из 30 человек 18 играют в шахматы, 16 — в теннис. Как минимум сколько играют в оба?",
      options: ["2", "4", "6", "8"],
    },
    uz: {
      prompt:
        "30 kishidan 18 tasi shaxmat, 16 tasi tennis o‘ynaydi. Eng kamida nechtasi ikkalasini ham o‘ynaydi?",
      options: ["2", "4", "6", "8"],
    },
  },
  iq139: {
    ru: {
      prompt:
        "Товар куплен за £80 и продан за £100. Каков процент прибыли относительно закупочной цены?",
      options: ["20%", "25%", "30%", "33%"],
    },
    uz: {
      prompt: "Mahsulot £80 ga olinib, £100 ga sotildi. Xarid narxiga nisbatan foyda necha foiz?",
      options: ["20%", "25%", "30%", "33%"],
    },
  },
  iq140_v2: {
    ru: {
      prompt: "Площадь прямоугольника 48 м², длина 8 м. Каков периметр?",
      options: ["24 м", "28 м", "32 м", "40 м"],
    },
    uz: {
      prompt: "To‘g‘ri to‘rtburchak yuzi 48 m², uzunligi 8 m. Perimetri qancha?",
      options: ["24 m", "28 m", "32 m", "40 m"],
    },
  },
  iq141: {
    ru: {
      prompt: "Найдите пропущенное число или элемент последовательности: Z, X, V, T, R, ?",
      options: ["P", "O", "N", "Q"],
    },
    uz: {
      prompt: "Ketma-ketlikdagi yetishmayotgan son yoki elementni toping: Z, X, V, T, R, ?",
      options: ["P", "O", "N", "Q"],
    },
  },
  iq142: {
    ru: {
      prompt: "Найдите пропущенное число или элемент последовательности: AZ, BY, CX, DW, ?",
      options: ["EU", "EV", "FV", "FU"],
    },
    uz: {
      prompt: "Ketma-ketlikdagi yetishmayotgan son yoki elementni toping: AZ, BY, CX, DW, ?",
      options: ["EU", "EV", "FV", "FU"],
    },
  },
  iq143_v2: {
    ru: {
      prompt:
        "Сдвиг каждой буквы на одну вперёд в английском алфавите даёт FRIEND → GSJFOE. Как кодируется HOUSE?",
      options: ["IPVTF", "GNRRD", "HTXRD", "IOVRD"],
    },
    uz: {
      prompt:
        "Ingliz alifbosida har bir harfni bir o‘rin oldinga surish FRIEND → GSJFOE ni beradi. HOUSE qanday kodlanadi?",
      options: ["IPVTF", "GNRRD", "HTXRD", "IOVRD"],
    },
  },
  iq144: {
    ru: {
      prompt: "Найдите пропущенное число или элемент последовательности: B, E, H, K, N, ?",
      options: ["O", "P", "Q", "R"],
    },
    uz: {
      prompt: "Ketma-ketlikdagi yetishmayotgan son yoki elementni toping: B, E, H, K, N, ?",
      options: ["O", "P", "Q", "R"],
    },
  },
  iq145: {
    ru: {
      prompt: "Найдите пропущенное число или элемент последовательности: A1, B3, C6, D10, ?",
      options: ["E14", "E15", "F14", "F15"],
    },
    uz: {
      prompt: "Ketma-ketlikdagi yetishmayotgan son yoki elementni toping: A1, B3, C6, D10, ?",
      options: ["E14", "E15", "F14", "F15"],
    },
  },
  iq146: {
    ru: {
      prompt: "Найдите пропущенное число или элемент последовательности: AC, CE, EG, GI, ?",
      options: ["HJ", "IJ", "IK", "JK"],
    },
    uz: {
      prompt: "Ketma-ketlikdagi yetishmayotgan son yoki elementni toping: AC, CE, EG, GI, ?",
      options: ["HJ", "IJ", "IK", "JK"],
    },
  },
  iq147: {
    ru: {
      prompt: "В ABCDEFGHIJK какая буква на шесть позиций правее третьей буквы слева?",
      options: ["H", "I", "J", "K"],
    },
    uz: {
      prompt: "ABCDEFGHIJK da chapdan uchinchi harfdan olti o‘rin o‘ngda qaysi harf turadi?",
      options: ["H", "I", "J", "K"],
    },
  },
  iq148: {
    ru: {
      prompt: "Найдите пропущенное число или элемент последовательности: 1A, 2C, 3E, 4G, ?",
      options: ["5H", "5I", "6H", "6I"],
    },
    uz: {
      prompt: "Ketma-ketlikdagi yetishmayotgan son yoki elementni toping: 1A, 2C, 3E, 4G, ?",
      options: ["5H", "5I", "6H", "6I"],
    },
  },
  iq149_v2: {
    ru: {
      prompt: "В английском алфавите A = 1, B = 2, … Z = 26. Какова сумма значений букв BLACK?",
      options: ["27", "29", "31", "33"],
    },
    uz: {
      prompt:
        "Ingliz alifbosida A = 1, B = 2, … Z = 26. BLACK harflari qiymatlari yig‘indisi qancha?",
      options: ["27", "29", "31", "33"],
    },
  },
  iq150: {
    ru: {
      prompt: "Найдите пропущенное число или элемент последовательности: M, N, P, S, W, ?",
      options: ["A", "B", "C", "D"],
    },
    uz: {
      prompt: "Ketma-ketlikdagi yetishmayotgan son yoki elementni toping: M, N, P, S, W, ?",
      options: ["A", "B", "C", "D"],
    },
  },
  iq151: {
    ru: {
      prompt: "Найдите следующую английскую букву: B, D, G, K, P, ?",
      options: ["U", "V", "W", "X"],
    },
    uz: {
      prompt: "Keyingi ingliz harfini toping: B, D, G, K, P, ?",
      options: ["U", "V", "W", "X"],
    },
  },
  iq152: {
    ru: {
      prompt: "Продолжите последовательность английских букв: BA, DC, FE, HG, ?",
      options: ["IJ", "JI", "KL", "LK"],
    },
    uz: {
      prompt: "Ingliz harflari ketma-ketligini davom ettiring: BA, DC, FE, HG, ?",
      options: ["IJ", "JI", "KL", "LK"],
    },
  },
  iq153: {
    ru: {
      prompt: "Найдите пропущенное число или элемент последовательности: 2B, 4D, 6F, 8H, ?",
      options: ["10I", "10J", "11J", "12J"],
    },
    uz: {
      prompt: "Ketma-ketlikdagi yetishmayotgan son yoki elementni toping: 2B, 4D, 6F, 8H, ?",
      options: ["10I", "10J", "11J", "12J"],
    },
  },
  iq154: {
    ru: {
      prompt: "Найдите пропущенное число или элемент последовательности: J10, H8, F6, D4, ?",
      options: ["B1", "B2", "C2", "C3"],
    },
    uz: {
      prompt: "Ketma-ketlikdagi yetishmayotgan son yoki elementni toping: J10, H8, F6, D4, ?",
      options: ["B1", "B2", "C2", "C3"],
    },
  },
  iq155: {
    ru: {
      prompt: "Найдите пропущенное число или элемент последовательности: AAB, ABB, ABC, ABD, ?",
      options: ["ABE", "ACE", "BBE", "BCE"],
    },
    uz: {
      prompt: "Ketma-ketlikdagi yetishmayotgan son yoki elementni toping: AAB, ABB, ABC, ABD, ?",
      options: ["ABE", "ACE", "BBE", "BCE"],
    },
  },
  iq160_v2: {
    ru: {
      prompt:
        "Прямоугольный пол имеет длину 10 м и ширину 8 м. Каково кратчайшее расстояние по полу между противоположными углами?",
      options: ["10 м", "12 м", "√164 м", "18 м"],
    },
    uz: {
      prompt:
        "To‘g‘ri to‘rtburchak pol uzunligi 10 m, eni 8 m. Qarama-qarshi burchaklar orasidagi pol bo‘ylab eng qisqa masofa qancha?",
      options: ["10 m", "12 m", "√164 m", "18 m"],
    },
  },
  iq161_v2: {
    ru: {
      prompt: "Какое тело имеет ровно пять плоских граней?",
      options: ["Куб", "Пятиугольная призма", "Четырёхугольная пирамида", "Тетраэдр"],
    },
    uz: {
      prompt: "Qaysi jismning aynan beshta tekis yoqi bor?",
      options: ["Kub", "Beshburchakli prizma", "Kvadrat asosli piramida", "Tetraedr"],
    },
  },
  iq162_v2: {
    ru: {
      prompt:
        "Фигуру отразили относительно вертикальной оси, затем повернули на 90° по часовой стрелке. Какое описание перечисляет обе операции?",
      options: [
        "Только поворот на 90° против часовой стрелки",
        "Только отражение относительно горизонтальной оси",
        "Поворот и отражение",
        "Ни поворот, ни отражение",
      ],
    },
    uz: {
      prompt:
        "Shakl vertikal o‘qqa nisbatan akslantirilib, soat mili bo‘ylab 90° burildi. Qaysi tavsif ikkala amalni sanab beradi?",
      options: [
        "Faqat soat miliga teskari 90° burish",
        "Faqat gorizontal o‘qqa nisbatan akslantirish",
        "Burish va akslantirish",
        "Burish ham, akslantirish ham emas",
      ],
    },
  },
  iq163: {
    ru: {
      prompt:
        "Каждая сторона большого треугольника разделена пополам, середины соединены, образуя четыре равных маленьких треугольника. Сколько всего треугольников?",
      options: ["4", "5", "6", "7"],
    },
    uz: {
      prompt:
        "Katta uchburchak tomonlari o‘rtalari birlashtirilib, to‘rtta teng kichik uchburchak hosil qilindi. Jami nechta uchburchak bor?",
      options: ["4", "5", "6", "7"],
    },
  },
  iq164: {
    ru: {
      prompt: "В квадрат со стороной 10 см вписан круг. Какова площадь круга?",
      options: ["25π", "50π", "75π", "100π"],
    },
    uz: {
      prompt: "Tomoni 10 cm kvadrat ichiga aylana ichki chizilgan. Doira yuzi qancha?",
      options: ["25π", "50π", "75π", "100π"],
    },
  },
  iq165: {
    ru: {
      prompt: "Какую букву больше всего напоминает английская N после поворота на 180°?",
      options: ["Z", "S", "N", "H"],
    },
    uz: {
      prompt: "Ingliz N harfi 180° burilganda qaysi harfga eng ko‘p o‘xshaydi?",
      options: ["Z", "S", "N", "H"],
    },
  },
  iq166: {
    ru: {
      prompt: "Поезд длиной 200 м проходит столб за 10 секунд. Какова скорость?",
      options: ["20 м/с", "25 м/с", "30 м/с", "40 м/с"],
    },
    uz: {
      prompt: "Uzunligi 200 m poyezd ustundan 10 soniyada o‘tadi. Tezligi qancha?",
      options: ["20 m/soniya", "25 m/soniya", "30 m/soniya", "40 m/soniya"],
    },
  },
  iq167: {
    ru: {
      prompt: "Среднее пяти последовательных чётных чисел равно 32. Каково наибольшее?",
      options: ["34", "36", "38", "40"],
    },
    uz: {
      prompt: "Ketma-ket beshta juft sonning o‘rtachasi 32. Eng kattasi qancha?",
      options: ["34", "36", "38", "40"],
    },
  },
  iq168: {
    ru: {
      prompt: "Сколькими способами можно расставить 3 разные книги на полке?",
      options: ["3", "6", "9", "12"],
    },
    uz: {
      prompt: "Uchta turli kitobni tokchaga necha xil tartibda joylashtirish mumkin?",
      options: ["3", "6", "9", "12"],
    },
  },
  iq170: {
    ru: {
      prompt:
        "Сумма цифр двузначного числа равна 9. Перестановка цифр увеличивает число на 27. Найдите исходное число.",
      options: ["27", "36", "45", "54"],
    },
    uz: {
      prompt:
        "Ikki xonali son raqamlari yig‘indisi 9. Raqamlar o‘rni almashganda son 27 ga ortadi. Dastlabki sonni toping.",
      options: ["27", "36", "45", "54"],
    },
  },
  iq171: {
    ru: {
      prompt:
        "Велосипедист едет 1 час со скоростью 12 км/ч, затем 2 часа со скоростью 18 км/ч. Какова средняя скорость всего пути?",
      options: ["14 км/ч", "15 км/ч", "16 км/ч", "17 км/ч"],
    },
    uz: {
      prompt:
        "Velosipedchi 1 soat 12 km/soat, so‘ng 2 soat 18 km/soat tezlikda yurdi. Butun yo‘l uchun o‘rtacha tezlik qancha?",
      options: ["14 km/soat", "15 km/soat", "16 km/soat", "17 km/soat"],
    },
  },
  iq172: {
    ru: {
      prompt: "Сколькими нулями заканчивается 25! (факториал 25)?",
      options: ["4", "5", "6", "7"],
    },
    uz: {
      prompt: "25! (25 faktorial) oxirida nechta nol bor?",
      options: ["4", "5", "6", "7"],
    },
  },
  iq173: {
    ru: {
      prompt: "Если 3x + 2 = 17, чему равен x?",
      options: ["3", "4", "5", "6"],
    },
    uz: {
      prompt: "3x + 2 = 17 bo‘lsa, x qancha?",
      options: ["3", "4", "5", "6"],
    },
  },
  iq174: {
    ru: {
      prompt:
        "Человек прошёл 3 км на север, затем 4 км на восток. Каково расстояние до начальной точки?",
      options: ["4 км", "5 км", "6 км", "7 км"],
    },
    uz: {
      prompt: "Kishi shimolga 3 km, sharqqa 4 km yurdi. Boshlang‘ich nuqtagacha masofa qancha?",
      options: ["4 km", "5 km", "6 km", "7 km"],
    },
  },
  iq175: {
    ru: {
      prompt:
        "Какое число строго между 1 и 100 одновременно является квадратом и кубом целого числа?",
      options: ["8", "27", "64", "100"],
    },
    uz: {
      prompt: "1 va 100 orasidagi qaysi son bir vaqtning o‘zida butun sonning kvadrati va kubidir?",
      options: ["8", "27", "64", "100"],
    },
  },
  iq176_v2: {
    ru: {
      prompt:
        "В мешке 4 красных и 6 синих шаров. Два вытаскивают без возвращения. Какова вероятность двух красных?",
      options: ["2/15", "4/15", "1/5", "2/9"],
    },
    uz: {
      prompt:
        "Xaltada 4 qizil, 6 ko‘k shar bor. Ikkitasi qaytarmasdan olinadi. Ikkalasi ham qizil bo‘lish ehtimoli qancha?",
      options: ["2/15", "4/15", "1/5", "2/9"],
    },
  },
  iq177: {
    ru: {
      prompt: "Если 2^n = 64, чему равно n?",
      options: ["5", "6", "7", "8"],
    },
    uz: {
      prompt: "2^n = 64 bo‘lsa, n qancha?",
      options: ["5", "6", "7", "8"],
    },
  },
  iq178: {
    ru: {
      prompt: "Бак заполнен на 1/3. Добавление 20 литров заполнило его до 1/2. Какова вместимость?",
      options: ["90 л", "100 л", "110 л", "120 л"],
    },
    uz: {
      prompt: "Idish 1/3 qismi to‘lgan. 20 litr qo‘shilgach 1/2 qismi to‘ldi. Sig‘imi qancha?",
      options: ["90 litr", "100 litr", "110 litr", "120 litr"],
    },
  },
  iq179: {
    ru: {
      prompt:
        "Поезд едет 120 км туда за 3 часа и 120 км обратно за 2 часа. Какова средняя скорость всего пути?",
      options: ["48 км/ч", "50 км/ч", "52 км/ч", "57.6 км/ч"],
    },
    uz: {
      prompt:
        "Poyezd 120 km yo‘lni 3 soatda borib, 120 km ni 2 soatda qaytadi. Butun yo‘l uchun o‘rtacha tezlik qancha?",
      options: ["48 km/soat", "50 km/soat", "52 km/soat", "57.6 km/soat"],
    },
  },
  iq180: {
    ru: {
      prompt: "Длина прямоугольника вдвое больше ширины, площадь 72 м². Каков периметр?",
      options: ["24 м", "36 м", "48 м", "54 м"],
    },
    uz: {
      prompt: "To‘g‘ri to‘rtburchak uzunligi enidan ikki baravar, yuzi 72 m². Perimetri qancha?",
      options: ["24 m", "36 m", "48 m", "54 m"],
    },
  },
  iq181: {
    ru: {
      prompt: "Удвоив число и прибавив 3, получаем 19. Найдите число.",
      options: ["6", "7", "8", "9"],
    },
    uz: {
      prompt: "Sonni ikki baravar oshirib 3 qo‘shsak, 19 chiqadi. Sonni toping.",
      options: ["6", "7", "8", "9"],
    },
  },
  iq182: {
    ru: {
      prompt: "Какое простое число идёт после 89?",
      options: ["91", "93", "97", "99"],
    },
    uz: {
      prompt: "89 dan keyingi tub son qaysi?",
      options: ["91", "93", "97", "99"],
    },
  },
  iq183: {
    ru: {
      prompt: "Сколько диагоналей у шестиугольника?",
      options: ["6", "8", "9", "12"],
    },
    uz: {
      prompt: "Oltiburchakning nechta diagonali bor?",
      options: ["6", "8", "9", "12"],
    },
  },
  iq184: {
    ru: {
      prompt:
        "Средний балл 30 учеников — 70. Приходит ученик с баллом 100. Каков новый средний балл с округлением до десятых?",
      options: ["70.7", "71", "71.5", "72"],
    },
    uz: {
      prompt:
        "30 o‘quvchining o‘rtacha bali 70. Bali 100 bo‘lgan yangi o‘quvchi qo‘shildi. Yangi o‘rtacha ballni o‘ndan birgacha yaxlitlang.",
      options: ["70.7", "71", "71.5", "72"],
    },
  },
  iq185: {
    ru: {
      prompt: "Какая дробь наибольшая: 2/3, 3/4, 5/7, 7/10?",
      options: ["2/3", "3/4", "5/7", "7/10"],
    },
    uz: {
      prompt: "Qaysi kasr eng katta: 2/3, 3/4, 5/7, 7/10?",
      options: ["2/3", "3/4", "5/7", "7/10"],
    },
  },
  iq186: {
    ru: {
      prompt: "Катеты прямоугольного треугольника равны 6 и 8. Какова гипотенуза?",
      options: ["9", "10", "11", "12"],
    },
    uz: {
      prompt: "To‘g‘ri burchakli uchburchak katetlari 6 va 8. Gipotenuzasi qancha?",
      options: ["9", "10", "11", "12"],
    },
  },
  iq187: {
    ru: {
      prompt:
        "Sarah втрое старше David. Через 12 лет её возраст будет вдвое больше его. Сколько лет David сейчас?",
      options: ["6", "12", "15", "18"],
    },
    uz: {
      prompt:
        "Sarah Daviddan uch baravar katta. 12 yildan keyin uning yoshi Davidnikidan ikki baravar bo‘ladi. David hozir necha yoshda?",
      options: ["6", "12", "15", "18"],
    },
  },
  iq188: {
    ru: {
      prompt: "Часовая стрелка проходит 30° за час. Сколько градусов она проходит за 40 минут?",
      options: ["15°", "20°", "25°", "30°"],
    },
    uz: {
      prompt: "Soat mili bir soatda 30° siljiydi. 40 daqiqada necha daraja siljiydi?",
      options: ["15°", "20°", "25°", "30°"],
    },
  },
  iq189: {
    ru: {
      prompt: "Цену снизили на 30%, затем ещё на 20%. Какова общая скидка от исходной цены?",
      options: ["44%", "46%", "50%", "56%"],
    },
    uz: {
      prompt:
        "Narx avval 30%, so‘ng yana 20% tushirildi. Dastlabki narxga nisbatan umumiy chegirma qancha?",
      options: ["44%", "46%", "50%", "56%"],
    },
  },
  iq190: {
    ru: {
      prompt: "Какова сумма внутренних углов пятиугольника?",
      options: ["360°", "450°", "540°", "720°"],
    },
    uz: {
      prompt: "Beshburchak ichki burchaklari yig‘indisi qancha?",
      options: ["360°", "450°", "540°", "720°"],
    },
  },
  iq192: {
    ru: {
      prompt:
        "Найдите пропущенное число или элемент последовательности: 0, 1, 1, 2, 3, 5, 8, 13, 21, ?",
      options: ["29", "34", "36", "40"],
    },
    uz: {
      prompt:
        "Ketma-ketlikdagi yetishmayotgan son yoki elementni toping: 0, 1, 1, 2, 3, 5, 8, 13, 21, ?",
      options: ["29", "34", "36", "40"],
    },
  },
  iq193: {
    ru: {
      prompt: "Продолжите последовательность: 1, 3, 6, 10, 15, 21, 28, ?",
      options: ["34", "36", "37", "40"],
    },
    uz: {
      prompt: "Ketma-ketlikni davom ettiring: 1, 3, 6, 10, 15, 21, 28, ?",
      options: ["34", "36", "37", "40"],
    },
  },
  iq194: {
    ru: {
      prompt: "Найдите пропущенное число или элемент последовательности: 4, 9, 16, 25, 36, 49, ?",
      options: ["56", "60", "64", "72"],
    },
    uz: {
      prompt: "Ketma-ketlikdagi yetishmayotgan son yoki elementni toping: 4, 9, 16, 25, 36, 49, ?",
      options: ["56", "60", "64", "72"],
    },
  },
  iq195: {
    ru: {
      prompt: "Найдите пропущенное число или элемент последовательности: 2, 5, 10, 17, 26, 37, ?",
      options: ["48", "50", "52", "54"],
    },
    uz: {
      prompt: "Ketma-ketlikdagi yetishmayotgan son yoki elementni toping: 2, 5, 10, 17, 26, 37, ?",
      options: ["48", "50", "52", "54"],
    },
  },
  iq196: {
    ru: {
      prompt: "Найдите пропущенное число или элемент последовательности: 512, 256, 128, 64, 32, ?",
      options: ["12", "16", "20", "24"],
    },
    uz: {
      prompt: "Ketma-ketlikdagi yetishmayotgan son yoki elementni toping: 512, 256, 128, 64, 32, ?",
      options: ["12", "16", "20", "24"],
    },
  },
  iq197: {
    ru: {
      prompt: "Найдите пропущенное число или элемент последовательности: 1, 2, 4, 7, 11, 16, 22, ?",
      options: ["28", "29", "30", "32"],
    },
    uz: {
      prompt:
        "Ketma-ketlikdagi yetishmayotgan son yoki elementni toping: 1, 2, 4, 7, 11, 16, 22, ?",
      options: ["28", "29", "30", "32"],
    },
  },
  iq198: {
    ru: {
      prompt: "Найдите пропущенное число или элемент последовательности: 2, 6, 12, 20, 30, 42, ?",
      options: ["52", "54", "56", "60"],
    },
    uz: {
      prompt: "Ketma-ketlikdagi yetishmayotgan son yoki elementni toping: 2, 6, 12, 20, 30, 42, ?",
      options: ["52", "54", "56", "60"],
    },
  },
  iq199: {
    ru: {
      prompt: "Найдите следующее число: 3, 7, 13, 21, 31, 43, ?",
      options: ["55", "57", "58", "60"],
    },
    uz: {
      prompt: "Keyingi sonni toping: 3, 7, 13, 21, 31, 43, ?",
      options: ["55", "57", "58", "60"],
    },
  },
  iq200: {
    ru: {
      prompt: "Найдите пропущенное число или элемент последовательности: 2, 3, 6, 11, 20, 37, ?",
      options: ["66", "68", "70", "74"],
    },
    uz: {
      prompt: "Ketma-ketlikdagi yetishmayotgan son yoki elementni toping: 2, 3, 6, 11, 20, 37, ?",
      options: ["66", "68", "70", "74"],
    },
  },
  iq201: {
    ru: {
      prompt: "Найдите лишнее: Тревожный, Обеспокоенный, Озабоченный, Ликующий, Опасливый.",
      options: ["Тревожный", "Обеспокоенный", "Ликующий", "Опасливый"],
    },
    uz: {
      prompt:
        "Ortiqchasini toping: Xavotirli, Tashvishli, Tashvishga tushgan, Juda xursand, Hadiksiragan.",
      options: ["Xavotirli", "Tashvishli", "Juda xursand", "Hadiksiragan"],
    },
  },
  iq202: {
    ru: {
      prompt: "Как «Мелодия» связано с «Песня», так «Глава» связано с чем?",
      options: ["Страница", "Книга", "Абзац", "Автор"],
    },
    uz: {
      prompt: "«Kuy» «Qo‘shiq»ga qanday aloqador bo‘lsa, «Bob» nimaga shunday aloqador?",
      options: ["Sahifa", "Kitob", "Xatboshi", "Muallif"],
    },
  },
  iq203: {
    ru: {
      prompt: "Какое слово ближе по смыслу к «Бережливый»?",
      options: ["Щедрый", "Расточительный", "Экономный", "Расточительный"],
    },
    uz: {
      prompt: "Qaysi so‘z «Tejamkor»ga ma’nodosh?",
      options: ["Saxiy", "Haddan tashqari sarflovchi", "Tejaydigan", "Isrofgar"],
    },
  },
  iq204: {
    ru: {
      prompt: "Какое слово противоположно по смыслу слову «Мимолётный»?",
      options: ["Краткий", "Мимолётный", "Долговечный", "Временный"],
    },
    uz: {
      prompt: "Qaysi so‘z «O‘tkinchi»ga qarama-qarshi ma’noli?",
      options: ["Qisqa", "Bir lahzalik", "Uzoq davom etadigan", "Vaqtinchalik"],
    },
  },
  iq205: {
    ru: {
      prompt: "Найдите лишнее: Медь, Золото, Олово, Сталь, Серебро.",
      options: ["Медь", "Золото", "Сталь", "Серебро"],
    },
    uz: {
      prompt: "Ortiqchasini toping: Mis, Oltin, Qalay, Po‘lat, Kumush.",
      options: ["Mis", "Oltin", "Po‘lat", "Kumush"],
    },
  },
  iq206: {
    ru: {
      prompt: "Какое слово ближе по смыслу к «Лаконичный»?",
      options: ["Многословный", "Разговорчивый", "Лаконичный", "Красноречивый"],
    },
    uz: {
      prompt: "Qaysi so‘z «Lo‘nda»ga ma’nodosh?",
      options: ["Ko‘p gapiradigan", "Sergap", "Lo‘nda", "Notiq"],
    },
  },
  iq207: {
    ru: {
      prompt: "Как «Скептический» связано с «Доверчивый», так «Щедрый» связано с чем?",
      options: ["Добрый", "Скупой", "Благотворительный", "Щедрый"],
    },
    uz: {
      prompt:
        "«Shubha qiluvchi» «Ishonuvchan»ga qanday aloqador bo‘lsa, «Saxiy» nimaga shunday aloqador?",
      options: ["Mehribon", "Xasis", "Saxovatli", "Saxiy"],
    },
  },
  iq208: {
    ru: {
      prompt: "Найдите лишнее: Базилик, Орегано, Тимьян, Имбирь, Розмарин.",
      options: ["Базилик", "Орегано", "Имбирь", "Розмарин"],
    },
    uz: {
      prompt: "Ortiqchasini toping: Rayhon, Oregano, Tog‘jambil, Zanjabil, Rozmarin.",
      options: ["Rayhon", "Oregano", "Zanjabil", "Rozmarin"],
    },
  },
  iq209: {
    ru: {
      prompt: "Какое слово противоположно по смыслу слову «Воинственный»?",
      options: ["Агрессивный", "Враждебный", "Миролюбивый", "Драчливый"],
    },
    uz: {
      prompt: "Qaysi so‘z «Urushqoq»ga qarama-qarshi ma’noli?",
      options: ["Tajovuzkor", "Dushmanona", "Tinchliksevar", "Jangari"],
    },
  },
  iq210: {
    ru: {
      prompt: "Как «Библиотека» связано с «Книги», так «Виноградник» связано с чем?",
      options: ["Вино", "Виноград", "Бутылки", "Бочки"],
    },
    uz: {
      prompt: "«Kutubxona» «Kitoblar»ga qanday aloqador bo‘lsa, «Uzumzor» nimaga shunday aloqador?",
      options: ["Sharob", "Uzum", "Shishalar", "Bochkalar"],
    },
  },
  iq211: {
    ru: {
      prompt: "Alex старше Ben. Charlie младше Alex. Ben старше Charlie. Кто самый старший?",
      options: ["Alex", "Ben", "Charlie", "Нельзя определить"],
    },
    uz: {
      prompt: "Alex Bendan katta. Charlie Alexdan kichik. Ben Charliedan katta. Eng kattasi kim?",
      options: ["Alex", "Ben", "Charlie", "Aniqlab bo‘lmaydi"],
    },
  },
  iq212_v2: {
    ru: {
      prompt: "Ни один A не является B, а некоторые C являются B. Что обязательно верно?",
      options: [
        "Некоторые C не являются A",
        "Ни один C не является A",
        "Некоторые B являются A",
        "Ни один A не является C",
      ],
    },
    uz: {
      prompt: "Hech bir A B emas, ba’zi Clar B. Qaysi xulosa albatta rost?",
      options: ["Ba’zi Clar A emas", "Hech bir C A emas", "Ba’zi Blar A", "Hech bir A C emas"],
    },
  },
  iq213: {
    ru: {
      prompt:
        "Все спортсмены тренируются ежедневно. Sam не тренируется ежедневно. Какой вывод следует?",
      options: [
        "Sam не спортсмен",
        "Sam может быть спортсменом",
        "Sam иногда тренируется",
        "Все неспортсмены похожи на Sam",
      ],
    },
    uz: {
      prompt:
        "Barcha sportchilar har kuni mashq qiladi. Sam har kuni mashq qilmaydi. Qaysi xulosa kelib chiqadi?",
      options: [
        "Sam sportchi emas",
        "Sam sportchi bo‘lishi mumkin",
        "Sam ba’zan mashq qiladi",
        "Barcha sportchi bo‘lmaganlar Samga o‘xshaydi",
      ],
    },
  },
  iq214: {
    ru: {
      prompt: "Какова медиана чисел 8, 12, 14, 40, 42?",
      options: ["12", "13", "14", "15"],
    },
    uz: {
      prompt: "8, 12, 14, 40, 42 sonlarining medianasi qancha?",
      options: ["12", "13", "14", "15"],
    },
  },
  iq215: {
    ru: {
      prompt: "Из A следует B, из B следует C, а C ложно. Что можно заключить?",
      options: ["A истинно", "B истинно", "A ложно", "Ничего об A"],
    },
    uz: {
      prompt: "A dan B, B dan C kelib chiqadi, C esa yolg‘on. Qanday xulosa qilish mumkin?",
      options: ["A rost", "B rost", "A yolg‘on", "A haqida xulosa yo‘q"],
    },
  },
  iq216: {
    ru: {
      prompt: "Emma набрала 45 из 60. Сколько это процентов?",
      options: ["70%", "72%", "75%", "80%"],
    },
    uz: {
      prompt: "Emma 60 dan 45 ball oldi. Bu necha foiz?",
      options: ["70%", "72%", "75%", "80%"],
    },
  },
  iq217: {
    ru: {
      prompt: "Автомобиль расходует 8 литров на 100 км. Сколько нужно на 350 км?",
      options: ["24", "28", "30", "32"],
    },
    uz: {
      prompt: "Avtomobil 100 km ga 8 litr sarflaydi. 350 km ga necha litr kerak?",
      options: ["24", "28", "30", "32"],
    },
  },
  iq218: {
    ru: {
      prompt: "Шесть друзей поровну разделили счёт £150. Сколько платит каждый?",
      options: ["£22", "£24", "£25", "£30"],
    },
    uz: {
      prompt: "Olti do‘st £150 hisobni teng bo‘lishdi. Har biri qancha to‘laydi?",
      options: ["£22", "£24", "£25", "£30"],
    },
  },
  iq220: {
    ru: {
      prompt: "В мешке 12 предметов. Убрали 25%, затем 1/3 оставшихся. Сколько осталось?",
      options: ["5", "6", "7", "8"],
    },
    uz: {
      prompt: "Xaltada 12 buyum bor. Avval 25%, so‘ng qolganining 1/3 qismi olindi. Nechta qoldi?",
      options: ["5", "6", "7", "8"],
    },
  },
  iq221: {
    ru: {
      prompt: "Ребро куба 3 см. Какова полная площадь поверхности?",
      options: ["27 см²", "36 см²", "54 см²", "81 см²"],
    },
    uz: {
      prompt: "Kub qirrasi 3 cm. To‘liq sirt yuzi qancha?",
      options: ["27 cm²", "36 cm²", "54 cm²", "81 cm²"],
    },
  },
  iq222: {
    ru: {
      prompt: "Лист бумаги сложили пополам 3 раза. Сколько слоёв получилось?",
      options: ["6", "8", "9", "12"],
    },
    uz: {
      prompt: "Qog‘oz uch marta teng ikkiga buklandi. Nechta qatlam hosil bo‘ldi?",
      options: ["6", "8", "9", "12"],
    },
  },
  iq223: {
    ru: {
      prompt: "Катеты прямоугольного треугольника 5 и 12. Какова гипотенуза?",
      options: ["11", "13", "14", "15"],
    },
    uz: {
      prompt: "To‘g‘ri burchakli uchburchak katetlari 5 va 12. Gipotenuzasi qancha?",
      options: ["11", "13", "14", "15"],
    },
  },
  iq226: {
    ru: {
      prompt:
        "Конус и цилиндр имеют одинаковые основание и высоту. Какую долю объёма цилиндра составляет объём конуса?",
      options: ["1/2", "1/3", "1/4", "2/3"],
    },
    uz: {
      prompt:
        "Konus va silindrning asosi va balandligi bir xil. Konus hajmi silindr hajmining qanday qismiga teng?",
      options: ["1/2", "1/3", "1/4", "2/3"],
    },
  },
  iq227: {
    ru: {
      prompt: "Диагональ прямоугольника 10, одна сторона 6. Какова площадь?",
      options: ["40", "48", "60", "80"],
    },
    uz: {
      prompt: "To‘g‘ri to‘rtburchak diagonali 10, bir tomoni 6. Yuzi qancha?",
      options: ["40", "48", "60", "80"],
    },
  },
  iq228: {
    ru: {
      prompt: "Угол равен 40°. Каков смежный с ним угол?",
      options: ["50°", "140°", "150°", "180°"],
    },
    uz: {
      prompt: "Burchak 40°. Unga qo‘shni to‘ldiruvchi burchak qancha?",
      options: ["50°", "140°", "150°", "180°"],
    },
  },
  iq229: {
    ru: {
      prompt: "Основание треугольника 10, высота 7. Какова площадь?",
      options: ["35", "40", "50", "70"],
    },
    uz: {
      prompt: "Uchburchak asosi 10, balandligi 7. Yuzi qancha?",
      options: ["35", "40", "50", "70"],
    },
  },
  iq230: {
    ru: {
      prompt:
        "Куб 3×3×3 из единичных кубиков окрашен снаружи. Сколько маленьких кубиков имеют ровно одну окрашенную грань?",
      options: ["6", "12", "18", "24"],
    },
    uz: {
      prompt:
        "Birlik kubchalardan tuzilgan 3×3×3 kubning tashqi yoqlari bo‘yaldi. Nechta kubchaning aynan bitta yoqi bo‘yalgan?",
      options: ["6", "12", "18", "24"],
    },
  },
  iq231: {
    ru: {
      prompt:
        "Найдите пропущенное число или элемент последовательности: 1, 11, 21, 1211, 111221, ?",
      options: ["312211", "312111", "211321", "123111"],
    },
    uz: {
      prompt:
        "Ketma-ketlikdagi yetishmayotgan son yoki elementni toping: 1, 11, 21, 1211, 111221, ?",
      options: ["312211", "312111", "211321", "123111"],
    },
  },
  iq233: {
    ru: {
      prompt:
        "Пароль из четырёх цифр использует 0–9 без повторений, ноль в начале разрешён. Сколько таких паролей?",
      options: ["5040", "3024", "10000", "9000"],
    },
    uz: {
      prompt:
        "To‘rt raqamli parolda 0–9 takrorlanmasdan ishlatiladi, boshida nol bo‘lishi mumkin. Nechta shunday parol bor?",
      options: ["5040", "3024", "10000", "9000"],
    },
  },
  iq234: {
    ru: {
      prompt: "Сколькими способами можно набрать ровно 50 пенсов монетами 10 и 20 пенсов?",
      options: ["2", "3", "4", "5"],
    },
    uz: {
      prompt: "10 va 20 penslik tangalar bilan aynan 50 pensni necha xil usulda yig‘ish mumkin?",
      options: ["2", "3", "4", "5"],
    },
  },
  iq235: {
    ru: {
      prompt: "Какова последняя цифра числа 7^50?",
      options: ["1", "3", "7", "9"],
    },
    uz: {
      prompt: "7^50 sonining oxirgi raqami qanday?",
      options: ["1", "3", "7", "9"],
    },
  },
  iq236: {
    ru: {
      prompt:
        "В мешке 3 красных и 5 синих шариков. Два выбирают без возвращения. Какова вероятность двух синих?",
      options: ["5/14", "5/16", "25/64", "2/9"],
    },
    uz: {
      prompt:
        "Xaltada 3 qizil va 5 ko‘k sharcha bor. Ikkitasi qaytarmasdan olinadi. Ikkalasi ko‘k bo‘lish ehtimoli qancha?",
      options: ["5/14", "5/16", "25/64", "2/9"],
    },
  },
  iq237: {
    ru: {
      prompt: "Сумма трёх последовательных нечётных чисел 51. Каково наибольшее?",
      options: ["15", "17", "19", "21"],
    },
    uz: {
      prompt: "Ketma-ket uchta toq son yig‘indisi 51. Eng kattasi qancha?",
      options: ["15", "17", "19", "21"],
    },
  },
  iq238: {
    ru: {
      prompt: "Если log₂(x) = 5, чему равен x?",
      options: ["10", "16", "32", "64"],
    },
    uz: {
      prompt: "log₂(x) = 5 bo‘lsa, x qancha?",
      options: ["10", "16", "32", "64"],
    },
  },
  iq239: {
    ru: {
      prompt: "Сколькими способами можно поставить 4 разных человека в ряд?",
      options: ["12", "16", "24", "32"],
    },
    uz: {
      prompt: "To‘rt turli kishini bir qatorga necha xil tartibda qo‘yish mumkin?",
      options: ["12", "16", "24", "32"],
    },
  },
  iq240: {
    ru: {
      prompt: "Какой набор углов может образовать треугольник?",
      options: ["60°, 70°, 80°", "90°, 90°, 90°", "45°, 45°, 90°", "100°, 120°, 40°"],
    },
    uz: {
      prompt: "Qaysi burchaklar to‘plami uchburchak hosil qila oladi?",
      options: ["60°, 70°, 80°", "90°, 90°, 90°", "45°, 45°, 90°", "100°, 120°, 40°"],
    },
  },
  iq241: {
    ru: {
      prompt:
        "Цену подняли на 25% от себестоимости, затем дали скидку 20%. Какова итоговая прибыль или убыток?",
      options: ["0% (без прибыли и убытка)", "5% прибыли", "5% убытка", "2% убытка"],
    },
    uz: {
      prompt:
        "Narx tannarxdan 25% oshirilib, so‘ng 20% chegirma berildi. Yakuniy foyda yoki zarar qancha?",
      options: ["0% (foyda ham, zarar ham yo‘q)", "5% foyda", "5% zarar", "2% zarar"],
    },
  },
  iq242: {
    ru: {
      prompt:
        "Сколько упорядоченных наборов из трёх букв можно составить из A, B, C, D без повторений?",
      options: ["12", "24", "36", "48"],
    },
    uz: {
      prompt:
        "A, B, C, D dan harflarni takrorlamasdan nechta tartibli uch harfli ketma-ketlik tuzish mumkin?",
      options: ["12", "24", "36", "48"],
    },
  },
  iq243: {
    ru: {
      prompt:
        "Квадратная пирамида имеет квадратное основание и 4 треугольные грани. Сколько у неё рёбер?",
      options: ["6", "8", "10", "12"],
    },
    uz: {
      prompt: "Kvadrat piramidaning kvadrat asosi va 4 uchburchak yoqi bor. Nechta qirrasi bor?",
      options: ["6", "8", "10", "12"],
    },
  },
  iq244: {
    ru: {
      prompt: "Чему равно 20% от 20% числа 500?",
      options: ["10", "15", "20", "25"],
    },
    uz: {
      prompt: "500 ning 20 foizining 20 foizi qancha?",
      options: ["10", "15", "20", "25"],
    },
  },
  iq245: {
    ru: {
      prompt:
        "Труба A наполняет бассейн за 10 часов, B — за 15. За сколько часов они наполнят его вместе?",
      options: ["4 ч", "5 ч", "6 ч", "7 ч"],
    },
    uz: {
      prompt:
        "A quvur hovuzni 10 soatda, B 15 soatda to‘ldiradi. Birgalikda necha soatda to‘ldiradi?",
      options: ["4 soat", "5 soat", "6 soat", "7 soat"],
    },
  },
  iq246: {
    ru: {
      prompt:
        "Бросают три стандартных шестигранных кубика. Какова вероятность одинакового числа на всех трёх?",
      options: ["1/36", "1/12", "1/6", "1/216"],
    },
    uz: {
      prompt:
        "Uchta odatiy olti yoqli zar tashlanadi. Uchalasida bir xil son chiqish ehtimoli qancha?",
      options: ["1/36", "1/12", "1/6", "1/216"],
    },
  },
  iq247: {
    ru: {
      prompt: "Если sin(30°) = 0.5, чему равен sin(150°)?",
      options: ["−0.5", "0", "0.5", "1"],
    },
    uz: {
      prompt: "sin(30°) = 0.5 bo‘lsa, sin(150°) qancha?",
      options: ["−0.5", "0", "0.5", "1"],
    },
  },
  iq248: {
    ru: {
      prompt: "Радиус цилиндра 3 см, высота 10 см. Каков объём?",
      options: ["90π см³", "100π см³", "60π см³", "120π см³"],
    },
    uz: {
      prompt: "Silindr radiusi 3 cm, balandligi 10 cm. Hajmi qancha?",
      options: ["90π cm³", "100π cm³", "60π cm³", "120π cm³"],
    },
  },
  iq249: {
    ru: {
      prompt:
        "Куб 4×4×4 из единичных кубиков окрашен снаружи. Сколько маленьких кубиков не имеют окрашенных граней?",
      options: ["4", "8", "16", "24"],
    },
    uz: {
      prompt:
        "Birlik kubchalardan tuzilgan 4×4×4 kub tashqaridan bo‘yaldi. Nechta kubchaning hech bir yoqi bo‘yalmagan?",
      options: ["4", "8", "16", "24"],
    },
  },
  iq250: {
    ru: {
      prompt: "£1000 вложены под 10% годовых со сложным процентом. Какова сумма через 2 года?",
      options: ["£1100", "£1200", "£1210", "£1220"],
    },
    uz: {
      prompt: "£1000 yiliga 10% murakkab foiz bilan qo‘yildi. 2 yildan keyin qancha bo‘ladi?",
      options: ["£1100", "£1200", "£1210", "£1220"],
    },
  },
};
