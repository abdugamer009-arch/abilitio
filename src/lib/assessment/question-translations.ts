// Translations for question bank prompts and options.
// English is the source; fall back to English when a key is absent.

export type QT = {
  ru: { prompt: string; note?: string; options?: string[] };
  uz: { prompt: string; note?: string; options?: string[] };
};

// ─── Career-assessment questions (personality p1–p280, cognitive, interest i1–i200) ───
export const QUESTION_TRANSLATIONS: Record<string, QT> = {
  // ── Personality (prompts only; likert labels come from i18n) ──
  p1: {
    ru: { prompt: "Вы чувствуете прилив энергии после общения в большой группе людей." },
    uz: { prompt: "Katta guruh bilan vaqt o'tkazgach energiyangiz ko'tariladi." },
  },
  p2: {
    ru: { prompt: "Вы предпочитаете тихую сосредоточенную работу совместным мозговым штурмам." },
    uz: { prompt: "Jamoaviy fikrlashuvdan ko'ra tinch va diqqatli ishni afzal ko'rasiz." },
  },
  p3: {
    ru: { prompt: "Вам нравится знакомиться с новыми людьми на мероприятиях." },
    uz: { prompt: "Tadbirlarda yangi odamlar bilan tanishishni yaxshi ko'rasiz." },
  },
  p4: {
    ru: { prompt: "Вам нужно время наедине с собой, чтобы восстановиться после насыщенных дней." },
    uz: { prompt: "Qiyin kunlardan keyin o'zingizni tiklash uchun yolg'iz vaqt kerak bo'ladi." },
  },
  p5: {
    ru: { prompt: "Вам легко начать разговор с незнакомыми людьми." },
    uz: { prompt: "Begonalar bilan suhbat boshlash sizga oson keladi." },
  },
  p6: {
    ru: { prompt: "Вы часто чувствуете усталость после длительных социальных мероприятий." },
    uz: { prompt: "Uzoq ijtimoiy tadbirlardan keyin ko'pincha charchab qolasiz." },
  },
  p7: {
    ru: { prompt: "Вам нравится быть в центре внимания в обществе." },
    uz: { prompt: "Ijtimoiy muhitda diqqat markazida bo'lishni yaxshi ko'rasiz." },
  },
  p8: {
    ru: { prompt: "Вы предпочитаете разговоры тет-а-тет групповым обсуждениям." },
    uz: { prompt: "Guruh muhokamalaridan ko'ra ikki kishilik suhbatni afzal ko'rasiz." },
  },
  p9: {
    ru: { prompt: "Вас радует перспектива посетить вечеринку или собрание." },
    uz: { prompt: "Ziyofat yoki yig'ilishlarga borish istagi sizni quvontiradi." },
  },
  p10: {
    ru: {
      prompt: "Вам нужно время наедине с собой после насыщенного дня, чтобы восстановить энергию.",
    },
    uz: { prompt: "Qiyin kundan keyin energiyangizni tiklash uchun yolg'iz vaqt kerak bo'ladi." },
  },
  p11: {
    ru: { prompt: "Вы больше сосредоточены на конкретных фактах, чем на абстрактных идеях." },
    uz: { prompt: "Abstrakt g'oyalardan ko'ra aniq faktlarga ko'proq e'tibor berasiz." },
  },
  p12: {
    ru: { prompt: "Вам нравится думать о будущих возможностях и глобальных идеях." },
    uz: {
      prompt:
        "Kelajakdagi imkoniyatlar va keng qamrovli g'oyalar haqida o'ylashni yaxshi ko'rasiz.",
    },
  },
  p13: {
    ru: { prompt: "Вы доверяете практическому опыту больше, чем теоретическим моделям." },
    uz: { prompt: "Nazariy modellarga qaraganda amaliy tajribaga ko'proq ishonasiz." },
  },
  p14: {
    ru: { prompt: "Вы часто замечаете закономерности и смыслы, которые другие упускают." },
    uz: { prompt: "Boshqalar e'tibor bermaydigan qonuniyatlar va ma'nolarni ko'pincha sezasiz." },
  },
  p15: {
    ru: { prompt: "Вы предпочитаете пошаговые инструкции расплывчатым руководствам." },
    uz: {
      prompt: "Noaniq ko'rsatmalardan ko'ra bosqichma-bosqich yo'riqnomalarni afzal ko'rasiz.",
    },
  },
  p16: {
    ru: { prompt: "Вас привлекают большие идеи и теории, даже если они кажутся непрактичными." },
    uz: { prompt: "Nomaqbul ko'rinsa ham, katta g'oyalar va nazariyalar sizni o'ziga tortadi." },
  },
  p17: {
    ru: { prompt: "Вы предпочитаете жить настоящим, а не планировать далёкое будущее." },
    uz: { prompt: "Uzoq kelajakni rejalashtirish o'rniga hozirgi onda yashashni afzal ko'rasiz." },
  },
  p18: {
    ru: { prompt: "Вы часто задумываетесь о более глубоких смыслах и связях между вещами." },
    uz: {
      prompt: "Narsalar orasidagi chuqurroq ma'nolar va bog'liqliklar haqida ko'pincha o'ylaysiz.",
    },
  },
  p19: {
    ru: { prompt: "Вы доверяете непосредственному опыту больше, чем интуиции или предчувствиям." },
    uz: { prompt: "To'g'ridan-to'g'ri tajribangizga intuitsiyangizdan ko'ra ko'proq ishonasiz." },
  },
  p20: {
    ru: { prompt: "Вам нравится исследовать абстрактные концепции и гипотетические сценарии." },
    uz: { prompt: "Abstrakt tushunchalar va faraziy stsenariylarni o'rganishni yaxshi ko'rasiz." },
  },
  p21: {
    ru: { prompt: "Вы принимаете решения на основе логики и анализа, а не чувств." },
    uz: {
      prompt: "Qarorlarni his-tuyg'ular asosida emas, mantiq va tahlil asosida qabul qilasiz.",
    },
  },
  p22: {
    ru: { prompt: "При принятии решений вы учитываете их влияние на эмоции других людей." },
    uz: { prompt: "Qaror qabul qilishda u odamlarning his-tuyg'ulariga ta'sirini hisobga olasiz." },
  },
  p23: {
    ru: { prompt: "Вы цените честность и объективные правила выше гармонии." },
    uz: { prompt: "Uyg'unlikdan ko'ra adolat va ob'ektiv qoidalarni qadrlaysiz." },
  },
  p24: {
    ru: { prompt: "При консультировании вы ставите во главу угла эмпатию." },
    uz: { prompt: "Maslahat berayotganda hamdardlikni birinchi o'ringa qo'yasiz." },
  },
  p25: {
    ru: { prompt: "Критикуя чью-то работу, вы сосредотачиваетесь на фактах, а не на чувствах." },
    uz: {
      prompt:
        "Kimningdir ishini tanqid qilayotganda, his-tuyg'ularga emas, faktlarga e'tibor qaratasiz.",
    },
  },
  p26: {
    ru: { prompt: "Вам дискомфортно высказывать критику, даже когда она необходима." },
    uz: { prompt: "Zarur bo'lsa ham tanqid bildirish sizga noqulay." },
  },
  p27: {
    ru: { prompt: "Вы считаете, что правда важнее тактичности." },
    uz: { prompt: "Haqiqat muloyimlikdan muhimroq deb hisoblaysiz." },
  },
  p28: {
    ru: { prompt: "Вам естественно ставить себя на место других." },
    uz: { prompt: "O'zingizni boshqalarning o'rniga qo'yish sizga tabiiy keladi." },
  },
  p29: {
    ru: {
      prompt: "Вы предпочитаете разрешать споры с помощью объективных данных, а не компромисса.",
    },
    uz: {
      prompt:
        "Murosadan ko'ra ob'ektiv ma'lumotlar yordamida nizolarni hal qilishni afzal ko'rasiz.",
    },
  },
  p30: {
    ru: { prompt: "Истории о страданиях и несправедливости трогают вас больше, чем статистика." },
    uz: {
      prompt:
        "Statistikadan ko'ra qiyinchilik va adolatsizlik haqidagi hikoyalar sizni ko'proq ta'sirlantiradi.",
    },
  },
  p31: {
    ru: { prompt: "Вы предпочитаете детальные планы и расписания импровизации." },
    uz: { prompt: "Improvizatsiyadan ko'ra batafsil rejalar va jadvallarni afzal ko'rasiz." },
  },
  p32: {
    ru: { prompt: "Вам нравится сохранять открытые варианты до последнего момента." },
    uz: { prompt: "Oxirgi daqiqagacha variantlarni ochiq saqlashni yaxshi ko'rasiz." },
  },
  p33: {
    ru: { prompt: "Вам некомфортно, когда задачи остаются незавершёнными." },
    uz: { prompt: "Vazifalar tugallanmay qolganida o'zingizni noqulay his qilasiz." },
  },
  p34: {
    ru: { prompt: "Вы быстро приспосабливаетесь к неожиданным изменениям в планах." },
    uz: { prompt: "Rejalardagi kutilmagan o'zgarishlarga tez moslashib ketasiz." },
  },
  p35: {
    ru: { prompt: "Вам нравится иметь чёткую повестку перед началом проекта." },
    uz: { prompt: "Loyiha boshlanishidan oldin aniq kun tartibiga ega bo'lishni yaxshi ko'rasiz." },
  },
  p36: {
    ru: { prompt: "Вы предпочитаете изучать варианты, а не привязываться к одному плану." },
    uz: {
      prompt: "Yagona rejaga bog'lanishdan ko'ra variantlarni ko'rib chiqishni afzal ko'rasiz.",
    },
  },
  p37: {
    ru: { prompt: "Вы устанавливаете себе дедлайны, даже когда это не требуется." },
    uz: { prompt: "Hech kim talab qilmasa ham o'zingiz uchun muddatlar belgilaysiz." },
  },
  p38: {
    ru: {
      prompt: "Вы считаете жёсткие расписания ограничивающими и предпочитаете следовать потоку.",
    },
    uz: { prompt: "Qat'iy jadvallarni cheklovchi deb bilasiz va erkin harakatni afzal ko'rasiz." },
  },
  p39: {
    ru: { prompt: "Вы удовлетворены, когда выполняете список дел раньше срока." },
    uz: { prompt: "Vazifalar ro'yxatini muddatidan oldin bajarsangiz, qoniqish his qilasiz." },
  },
  p40: {
    ru: {
      prompt:
        "Вы склонны начинать несколько проектов одновременно и свободно переключаться между ними.",
    },
    uz: {
      prompt:
        "Bir vaqtning o'zida bir nechta loyiha boshlash va ular orasida erkin almashinishga moyilsiz.",
    },
  },
  p41: {
    ru: {
      prompt: "Вы скорее посетите нетворкинг-мероприятие, чем проведёте спокойный вечер дома.",
    },
    uz: { prompt: "Tinch kechadan ko'ra networking tadbiriga borishni afzal ko'rasiz." },
  },
  p42: {
    ru: { prompt: "Вы лучше обрабатываете мысли, проговаривая их с другими." },
    uz: { prompt: "Fikrlaringizni boshqalar bilan o'rtoqlashib, yaxshiroq o'ylaysiz." },
  },
  p43: {
    ru: {
      prompt:
        "Вы часто чувствуете себя одинокими, когда слишком много времени проводите в одиночестве.",
    },
    uz: { prompt: "Juda ko'p vaqtni yolg'iz o'tkazganingizda ko'pincha yolg'izlik his qilasiz." },
  },
  p44: {
    ru: { prompt: "Вы находите светскую беседу приятной и лёгкой." },
    uz: { prompt: "Muloqotning yuzaki suhbat qismi siz uchun qulay va qiziqarli." },
  },
  p45: {
    ru: { prompt: "Вы быстро заводите друзей и имеете широкий круг общения." },
    uz: { prompt: "Tez do'st topasiz va keng ijtimoiy doiraga egasiz." },
  },
  p46: {
    ru: { prompt: "Вы первыми представляетесь в комнате, полной незнакомцев." },
    uz: { prompt: "Begonalar to'la xonada birinchi bo'lib o'zingizni tanishtirасиз." },
  },
  p47: {
    ru: { prompt: "Групповые мозговые штурмы заряжают вас, а не истощают." },
    uz: { prompt: "Guruh fikrlashuvi sizi charchatmay, aksincha, energiya beradi." },
  },
  p48: {
    ru: { prompt: "Вы предпочитаете телефонные звонки текстовым сообщениям." },
    uz: { prompt: "Matnli xabarlardan ko'ra telefon qo'ng'iroqlarini afzal ko'rasiz." },
  },
  p49: {
    ru: { prompt: "Вы склонны думать вслух, а не размышлять молча." },
    uz: { prompt: "Jim o'ylamay, ovoz chiqarib fikrlashga moyilsiz." },
  },
  p50: {
    ru: { prompt: "Вам комфортно быть представителем своей команды." },
    uz: { prompt: "Jamoangiz nomidan so'zlovchi bo'lishga tayyor siz." },
  },
  p51: {
    ru: { prompt: "Вам часто нужна тишина для концентрации на сложных задачах." },
    uz: { prompt: "Murakkab masalalar ustida ishlashda ko'pincha sukunat kerak." },
  },
  p52: {
    ru: { prompt: "Вы предпочитаете небольшую группу близких друзей широкой социальной сети." },
    uz: {
      prompt: "Keng ijtimoiy tarmoqdan ko'ra yaqin do'stlarning kichik guruhini afzal ko'rasiz.",
    },
  },
  p53: {
    ru: { prompt: "Вы чувствуете себя продуктивнее, работая из дома в одиночестве." },
    uz: { prompt: "Uyda yolg'iz ishlayotganingizda o'zingizni ko'proq samarali his qilasiz." },
  },
  p54: {
    ru: { prompt: "Вы находите утомительным посещение нескольких социальных мероприятий подряд." },
    uz: { prompt: "Ketma-ket ijtimoiy tadbirlarda qatnashish sizi charchatadi." },
  },
  p55: {
    ru: {
      prompt:
        "Вы часто предпочитаете наблюдать за групповыми активностями, а не участвовать в них.",
    },
    uz: { prompt: "Ko'pincha guruh faoliyatlarida qatnashishdan ko'ra kuzatishni afzal ko'rasiz." },
  },
  p56: {
    ru: { prompt: "Вы предпочитаете отправить письмо по электронной почте, а не позвонить." },
    uz: { prompt: "Qo'ng'iroq qilishdan ko'ra elektron pochta jo'natishni afzal ko'rasiz." },
  },
  p57: {
    ru: { prompt: "Вы предпочитаете обдумывать проблемы самостоятельно, прежде чем обсуждать их." },
    uz: { prompt: "Muhokama qilishdan oldin masalalarni o'z-o'zingiz yechishni afzal ko'rasiz." },
  },
  p58: {
    ru: {
      prompt: "Вы чувствуете себя собой, когда у вас есть длительные периоды непрерывного времени.",
    },
    uz: { prompt: "Uzun uzilishsiz vaqtingiz bo'lganda o'zingiz bo'lib his qilasiz." },
  },
  p59: {
    ru: { prompt: "Большие вечеринки склонны оставлять вас в состоянии перегрузки." },
    uz: { prompt: "Katta ziyofatlar sizni ortiq ta'sirlantirish holatiga olib keladi." },
  },
  p60: {
    ru: {
      prompt: "Вам нравится проводить выходные за одиночными хобби, такими как чтение или походы.",
    },
    uz: {
      prompt:
        "Dam olish kunlarini o'qish yoki sayr qilish kabi yolg'iz mashg'ulotlar bilan o'tkazishni yaxshi ko'rasiz.",
    },
  },
  p61: {
    ru: { prompt: "Вам нравится участвовать во многих делах одновременно." },
    uz: { prompt: "Bir vaqtning o'zida ko'p ishlarni qilishni yaxshi ko'rasiz." },
  },
  p62: {
    ru: { prompt: "Представление своих идей перед аудиторией заряжает вас энергией." },
    uz: { prompt: "Auditoriya oldida g'oyalaringizni taqdim etish sizga energiya beradi." },
  },
  p63: {
    ru: { prompt: "Вам быстро становится скучно, когда вы долго остаётесь в одиночестве." },
    uz: { prompt: "Uzoq muddat yolg'iz qolganingizda tez zerikasiz." },
  },
  p64: {
    ru: { prompt: "Вам нравится вести групповые обсуждения и фасилитировать разговоры." },
    uz: {
      prompt: "Guruh muhokamalarini olib borishni va suhbatlarni osonlashtirishni yaxshi ko'rasiz.",
    },
  },
  p65: {
    ru: {
      prompt:
        "Вы склонны свободно делиться личным опытом с людьми, с которыми только что познакомились.",
    },
    uz: { prompt: "Yangi tanishlaringizga shaxsiy tajribalaringizni erkin baham ko'rasiz." },
  },
  p66: {
    ru: {
      prompt: "Вы находите работу в офисах открытой планировки стимулирующей, а не отвлекающей.",
    },
    uz: { prompt: "Ochiq ofislarda ishlashni chalg'ituvchi emas, balki qiziqarli deb bilasiz." },
  },
  p67: {
    ru: { prompt: "Вам редко нужно время для восстановления после насыщенной социальной недели." },
    uz: {
      prompt: "Sermashaqqat ijtimoiy haftadan keyin kamdan-kam tiklanish vaqti kerak bo'ladi.",
    },
  },
  p68: {
    ru: {
      prompt:
        "Вы предпочитаете поддерживать несколько глубоких, личных отношений, а не много поверхностных.",
    },
    uz: {
      prompt: "Ko'p tanishdan ko'ra bir nechta chuqur va shaxsiy munosabatlarni afzal ko'rasiz.",
    },
  },
  p69: {
    ru: { prompt: "Когда вы в стрессе, вы замыкаетесь, а не ищете людей." },
    uz: { prompt: "Stressli paytlarda odamlarni izlash o'rniga yolg'izlanasiz." },
  },
  p70: {
    ru: { prompt: "Вы избирательны в том, кому открываетесь эмоционально." },
    uz: { prompt: "Emotsional jihatdan kimga ochilishingizni tanlashda tanlamchi bo'lasiz." },
  },
  p71: {
    ru: { prompt: "Вы часто мысленно репетируете разговоры перед тем, как их провести." },
    uz: { prompt: "Suhbatlarni amalga oshirishdan oldin ko'pincha aqliy mashq qilasiz." },
  },
  p72: {
    ru: { prompt: "Вы находите многолюдные места умственно утомительными." },
    uz: { prompt: "Gavjum muhitlar sizni ruhan toliqtiradi." },
  },
  p73: {
    ru: { prompt: "В групповой обстановке вы предпочитаете больше слушать, чем говорить." },
    uz: { prompt: "Guruh muhitida gapirganingizdan ko'ra ko'proq tinglashni afzal ko'rasiz." },
  },
  p74: {
    ru: { prompt: "Вам больше нравятся глубокие разговоры тет-а-тет, чем групповые обсуждения." },
    uz: { prompt: "Guruh muhokamalaridan ko'ra chuqur ikki kishilik suhbatlarni afzal ko'rasiz." },
  },
  p75: {
    ru: { prompt: "После отпуска в компании вам нужно время наедине с собой для восстановления." },
    uz: {
      prompt: "Ko'p odamlar bilan ta'tildan qaytgach, tiklanish uchun yolg'iz vaqt kerak bo'ladi.",
    },
  },
  p76: {
    ru: { prompt: "Вам комфортно вступать в разговор без особой подготовки." },
    uz: { prompt: "Ko'p tayyorgarliksiz suhbatga qo'shilishga tayyor bo'lasiz." },
  },
  p77: {
    ru: { prompt: "Вы часто ищете социальные активности, чтобы поднять себе настроение." },
    uz: { prompt: "Kayfiyatingizni ko'tarish uchun ijtimoiy faoliyatlar izlaysiz." },
  },
  p78: {
    ru: { prompt: "Вы комфортно чувствуете себя в роли открытого и спонтанного человека." },
    uz: { prompt: "O'zingizga ishonchli va boshqalarga ochiq bo'lasiz." },
  },
  p79: {
    ru: { prompt: "Длительное одиночество делает вас беспокойными." },
    uz: { prompt: "Uzoq muddat yolg'iz qolsangiz, bezovta bo'lasiz." },
  },
  p80: {
    ru: { prompt: "Перед тем как высказаться в дискуссии, вы склонны подумать молча." },
    uz: { prompt: "Muhokamaga hissa qo'shishdan oldin jimgina o'ylashga moyilsiz." },
  },
  p81: {
    ru: { prompt: "Вас интересует то, что реально и поддаётся проверке, а не то, что возможно." },
    uz: {
      prompt: "Mumkin narsalardan ko'ra haqiqiy va tekshiriladigan narsalarga ko'proq qiziqasiz.",
    },
  },
  p82: {
    ru: { prompt: "Вы внимательно замечаете детали, которые другие часто упускают." },
    uz: { prompt: "Boshqalar ko'pincha e'tibor bermaydigan tafsilotlarga katta e'tibor berasiz." },
  },
  p83: {
    ru: { prompt: "Вы хорошо запоминаете конкретные факты и цифры." },
    uz: { prompt: "Aniq faktlar va raqamlarni eslab qolishda yaxshisiz." },
  },
  p84: {
    ru: {
      prompt: "Вы доверяете тому, что можно увидеть и потрогать, больше, чем абстрактным теориям.",
    },
    uz: {
      prompt:
        "Abstrakt nazariyalardan ko'ra ko'rish va teginish mumkin bo'lgan narsalarga ko'proq ishonasiz.",
    },
  },
  p85: {
    ru: {
      prompt:
        "Вы предпочитаете досконально освоить один навык, прежде чем переходить к следующему.",
    },
    uz: {
      prompt: "Keyingisiga o'tishdan oldin bitta mahoratni chuqur o'rganishni afzal ko'rasiz.",
    },
  },
  p86: {
    ru: { prompt: "Вам нравится рутина и постоянство в повседневной работе." },
    uz: { prompt: "Kundalik ishingizda tartib va izchillikni yaxshi ko'rasiz." },
  },
  p87: {
    ru: { prompt: "Вы предпочитаете следовать установленным методам, а не изобретать новые." },
    uz: {
      prompt: "Yangilarini ixtiro qilishdan ko'ra mavjud usullarga amal qilishni afzal ko'rasiz.",
    },
  },
  p88: {
    ru: { prompt: "Вы сосредоточены на текущей ситуации, а не на размышлениях о будущем." },
    uz: { prompt: "Kelajak haqida taxmin qilish o'rniga hozirgi vaziyatga e'tibor berasiz." },
  },
  p89: {
    ru: { prompt: "Вы скорее практичный, чем философский человек." },
    uz: { prompt: "Falsafiy emas, balki amaliy insondirsiz." },
  },
  p90: {
    ru: { prompt: "Вы считаете, что опыт — лучший учитель." },
    uz: { prompt: "Tajriba eng yaxshi o'qituvchi deb hisoblaysiz." },
  },
  p91: {
    ru: { prompt: "Вас привлекают мозговые штурмы, где исследуются необычные возможности." },
    uz: { prompt: "G'ayrioddiy imkoniyatlarni o'rganadigan fikrlashuv sessiyalariga moyilsiz." },
  },
  p92: {
    ru: { prompt: "Вы часто представляете, как можно изменить или улучшить вещи." },
    uz: {
      prompt:
        "Ko'pincha narsalar qanday boshqacha yoki yaxshiroq bo'lishi mumkinligini tasavvur qilasiz.",
    },
  },
  p93: {
    ru: { prompt: "Вас больше интересуют теории и концепции, чем факты и детали." },
    uz: {
      prompt: "Faktlar va tafsilotlardan ko'ra nazariyalar va tushunchalarga ko'proq qiziqasiz.",
    },
  },
  p94: {
    ru: { prompt: "Вы часто находите связи между идеями из совершенно разных областей." },
    uz: { prompt: "Butunlay boshqa sohalardan g'oyalar orasida aloqalar topasiz." },
  },
  p95: {
    ru: { prompt: "Вам нравится рассуждать о долгосрочном будущем." },
    uz: { prompt: "Uzoq muddatli kelajakni taxmin qilishni yaxshi ko'rasiz." },
  },
  p96: {
    ru: { prompt: "Вас воодушевляют новые идеи, даже если они ещё не практичны." },
    uz: { prompt: "Hali amaliy bo'lmasa ham yangi g'oyalar sizni hayajonlantiradi." },
  },
  p97: {
    ru: { prompt: "Вы склонны читать между строк, а не воспринимать всё буквально." },
    uz: { prompt: "Narsalarni yuzaki qabul qilish o'rniga satrlar orasini o'qishga moyilsiz." },
  },
  p98: {
    ru: { prompt: "Вам комфортнее с неопределённостью, чем с жёсткой структурой." },
    uz: { prompt: "Qat'iy tuzilmadan ko'ra noaniqlikda ko'proq qulaysiz." },
  },
  p99: {
    ru: { prompt: "Вы часто мечтаете о будущих возможностях." },
    uz: { prompt: "Ko'pincha kelajakdagi imkoniyatlar haqida xayol qilasiz." },
  },
  p100: {
    ru: { prompt: "Вы доверяете своей интуиции не меньше, а то и больше, чем опыту." },
    uz: { prompt: "Tajribangizdan kamida shunchalik, balki ko'proq intuitsiyangizga ishonasiz." },
  },
  p101: {
    ru: { prompt: "Вы предпочитаете чёткое описание должности с хорошо определёнными задачами." },
    uz: { prompt: "Aniq vazifalar bilan yaxshi belgilangan lavozim tavsifini afzal ko'rasiz." },
  },
  p102: {
    ru: { prompt: "Вы находите комфорт в устоявшихся традициях и проверенных методах." },
    uz: { prompt: "Qaror qilingan an'analar va isbotlangan usullarda qulaylik topasiz." },
  },
  p103: {
    ru: { prompt: "Вы предпочитаете инструкции самостоятельному обучению методом проб и ошибок." },
    uz: { prompt: "Sinov va xato yo'li bilan o'rganishdan ko'ra ko'rsatmalarni afzal ko'rasiz." },
  },
  p104: {
    ru: {
      prompt:
        "Вы считаете чисто теоретические дискуссии неэффективными без практического применения.",
    },
    uz: { prompt: "Amaliy tatbiqi bo'lmagan sof nazariy muhokamalarni samarasiz deb bilasiz." },
  },
  p105: {
    ru: { prompt: "Вы замечаете, когда что-то в вашей среде изменилось, даже незначительно." },
    uz: { prompt: "Muhitingizda biror narsa o'zgarganda, hatto ozgina bo'lsa ham, sezasiz." },
  },
  p106: {
    ru: { prompt: "Вы предпочитаете задачи с осязаемым, измеримым результатом." },
    uz: { prompt: "Aniq, o'lchanadigan natijaga ega vazifalarni afzal ko'rasiz." },
  },
  p107: {
    ru: { prompt: "Вам нравится работать с фактами, данными и конкретной информацией." },
    uz: { prompt: "Faktlar, ma'lumotlar va aniq axborot bilan ishlashni yaxshi ko'rasiz." },
  },
  p108: {
    ru: { prompt: "Вас интригуют скрытые закономерности, связывающие разрозненные вещи." },
    uz: { prompt: "Turli narsalarni bog'laydigan yashirin qonuniyatlar sizni qiziqtiradi." },
  },
  p109: {
    ru: { prompt: "Вы часто думаете метафорами и символами." },
    uz: { prompt: "Ko'pincha metaforalar va ramzlar orqali fikrlaysiz." },
  },
  p110: {
    ru: { prompt: "Вы предпочитаете работать над инновационными задачами, а не рутинными." },
    uz: {
      prompt: "Odatiy masalalar o'rniga innovatsion masalalar ustida ishlashni afzal ko'rasiz.",
    },
  },
  p111: {
    ru: { prompt: "Вы любите исследовать сценарии «что, если», даже если они гипотетические." },
    uz: { prompt: "Faraziy bo'lsa ham 'agar bo'lsa' stsenariylarini o'rganishni yaxshi ko'rasiz." },
  },
  p112: {
    ru: { prompt: "Перед принятием решения вы часто представляете несколько будущих исходов." },
    uz: {
      prompt:
        "Qaror qabul qilishdan oldin ko'pincha bir nechta kelajak natijalarini ko'z oldingizga keltirasiz.",
    },
  },
  p113: {
    ru: { prompt: "Вас заряжают открытые вопросы, не имеющие единственного ответа." },
    uz: { prompt: "Yagona javobi bo'lmagan ochiq savollar sizni energiyalantiradi." },
  },
  p114: {
    ru: { prompt: "Вы находите монотонную, детально-ориентированную работу утомительной." },
    uz: { prompt: "Monoton, tafsilotlarga yo'naltirilgan ishni zerikarli deb bilasiz." },
  },
  p115: {
    ru: { prompt: "Вас больше интересует общая картина, чем конкретные детали." },
    uz: { prompt: "Aniq tafsilotlardan ko'ra umumiy manzaraga ko'proq qiziqasiz." },
  },
  p116: {
    ru: { prompt: "Решая проблемы, вы предпочитаете придерживаться проверенных подходов." },
    uz: {
      prompt:
        "Muammolarni hal qilayotganda, sinov-ishonchli yondashuvlarga yopishishni afzal ko'rasiz.",
    },
  },
  p117: {
    ru: { prompt: "Вы предпочитаете конкретные цели абстрактным видениям." },
    uz: { prompt: "Abstrakt tasavvurlardan ko'ra aniq maqsadlarni afzal ko'rasiz." },
  },
  p118: {
    ru: { prompt: "Вы замечаете детали в своей физической среде, которые другие упускают." },
    uz: { prompt: "Boshqalar e'tibor bermaydigan jismoniy muhitdagi tafsilotlarni sezasiz." },
  },
  p119: {
    ru: { prompt: "Вы склонны думать о наиболее вероятном, а не о наиболее воображаемом." },
    uz: { prompt: "Eng hayoliy emas, balki eng ehtimoliy narsalar haqida o'ylashga moyilsiz." },
  },
  p120: {
    ru: { prompt: "Вы часто погружаетесь в видение будущего и теряете связь с настоящим." },
    uz: { prompt: "Ko'pincha kelajak tasavvuriga sho'ng'ib, hozirdan uzilib qolasiz." },
  },
  p121: {
    ru: {
      prompt:
        "Давая обратную связь, вы сосредотачиваетесь на том, что можно улучшить, а не на чувствах.",
    },
    uz: {
      prompt:
        "Fikr bildirganingizda, his-tuyg'ular emas, takomillashtirilishi mumkin bo'lgan narsalarga e'tibor qaratasiz.",
    },
  },
  p122: {
    ru: { prompt: "Вы считаете, что наиболее этичный выбор максимизирует рациональную пользу." },
    uz: { prompt: "Eng axloqiy tanlov ratsional foydani maksimallashtiradi deb hisoblaysiz." },
  },
  p123: {
    ru: {
      prompt:
        "Вы можете отстаивать позицию, с которой не согласны, чтобы логически изучить все стороны.",
    },
    uz: {
      prompt:
        "Barcha tomonlarni mantiqiy o'rganish uchun rozi bo'lmagan pozitsiyani ham himoya qila olasiz.",
    },
  },
  p124: {
    ru: { prompt: "Вы предпочитаете, чтобы вас уважали, а не любили." },
    uz: { prompt: "Sevilishdan ko'ra hurmat qilinishni afzal ko'rasiz." },
  },
  p125: {
    ru: { prompt: "Решая проблемы, вы отделяете эмоциональные реакции от самой проблемы." },
    uz: { prompt: "Muammolarni hal qilayotganda emotsional reaktsiyalarni muammodan ajratasiz." },
  },
  p126: {
    ru: { prompt: "Вас убеждают весомые аргументы, а не эмоциональные призывы." },
    uz: { prompt: "Emotsional murojaatlardan ko'ra mantiqiy dalillar sizni ko'proq ishontiradi." },
  },
  p127: {
    ru: {
      prompt: "Вам легко принимать решения, не задумываясь о возможном эмоциональном воздействии.",
    },
    uz: { prompt: "Emotsional ta'sirni ikki marta o'ylamasdan qarorlar qabul qila olasiz." },
  },
  p128: {
    ru: {
      prompt:
        "Вы часто указываете на недостатки планов, даже если это нарушает групповую динамику.",
    },
    uz: { prompt: "Guruh dinamikasini buzsa ham, rejalaridagi kamchiliklarni ko'rsatasiz." },
  },
  p129: {
    ru: { prompt: "Вы считаете, что правила и стандарты должны применяться одинаково ко всем." },
    uz: {
      prompt: "Qoidalar va standartlar hammaga teng ravishda qo'llanilishi kerak deb hisoblaysiz.",
    },
  },
  p130: {
    ru: { prompt: "Когда друг просит совета, вы даёте честную обратную связь, а не утешение." },
    uz: { prompt: "Do'stingiz maslahat so'raganda, tasalli o'rniga halol fikr bildirasiz." },
  },
  p131: {
    ru: { prompt: "Перед тем как принять решение, вы учитываете, как оно скажется на людях." },
    uz: {
      prompt: "Qaror qabul qilishdan oldin u odamlarga qanday ta'sir qilishini hisobga olasiz.",
    },
  },
  p132: {
    ru: { prompt: "Поддержание гармонии в группе важно, даже если это требует компромисса." },
    uz: { prompt: "Murosa qilishni talab qilsa ham, guruh uyg'unligini saqlash siz uchun muhim." },
  },
  p133: {
    ru: { prompt: "Вы остро реагируете на критику в свой адрес." },
    uz: { prompt: "Sizga yo'naltirilgan tanqid chuqur ta'sir qiladi." },
  },
  p134: {
    ru: { prompt: "Вам трудно сказать что-то жёсткое, даже когда это правда." },
    uz: { prompt: "Hatto haqiqat bo'lsa ham, qattiq biror narsa aytish sizga qiyin." },
  },
  p135: {
    ru: { prompt: "Эмоциональный климат в помещении сильно влияет на ваше настроение." },
    uz: { prompt: "Xonadagi emotsional muhit kayfiyatingizga kuchli ta'sir qiladi." },
  },
  p136: {
    ru: { prompt: "Когда кто-то расстроен, ваш первый инстинкт — утешить его." },
    uz: { prompt: "Kimdir xafa bo'lganda, birinchi instinktingiz uni tasalli berishdir." },
  },
  p137: {
    ru: { prompt: "Вы считаете, что отношения важнее, чем быть правым." },
    uz: { prompt: "To'g'ri bo'lishdan ko'ra munosabatlar muhimroq deb hisoblaysiz." },
  },
  p138: {
    ru: { prompt: "Вы часто чувствуете, как себя ощущают другие, даже без слов." },
    uz: { prompt: "Ko'pincha boshqalarning his-tuyg'ularini ular aytmasidan oldin sezasiz." },
  },
  p139: {
    ru: { prompt: "Вы избегаете конфликтов, потому что они эмоционально затратны." },
    uz: { prompt: "Emotsional jihatdan qimmat bo'lgani uchun qarama-qarshiliklardan qochasiz." },
  },
  p140: {
    ru: { prompt: "Вы гордитесь положительным влиянием, которое оказываете на окружающих." },
    uz: { prompt: "Atrofingizga ko'rsatadigan ijobiy ta'siringiz bilan faxrlanasiz." },
  },
  p141: {
    ru: {
      prompt: "Вы применяете последовательные логические критерии при оценке своей и чужой работы.",
    },
    uz: { prompt: "O'z va boshqalarning ishini baholashda izchil mantiqiy mezonlar qo'llaysiz." },
  },
  p142: {
    ru: {
      prompt: "Вы предпочитаете прямые и основанные на данных оценки работы, а не расплывчатые.",
    },
    uz: {
      prompt:
        "Muloyim, ammo noaniq fikrlardan ko'ra to'g'ridan-to'g'ri va ma'lumotlarga asoslangan baholamalarni afzal ko'rasiz.",
    },
  },
  p143: {
    ru: { prompt: "Эффективность и компетентность для вас важнее дружелюбия." },
    uz: { prompt: "Samaradorlik va kompetentlik muomalagirlikdan muhimroq." },
  },
  p144: {
    ru: { prompt: "Вы не позволяете личной лояльности влиять на объективное суждение." },
    uz: { prompt: "Shaxsiy sadoqatni ob'ektiv hukmni bulg'ashga qo'ymaysiz." },
  },
  p145: {
    ru: { prompt: "Вы считаете, что в профессиональной среде не место эмоциям." },
    uz: { prompt: "Professional muhitda his-tuyg'ularni chetga qo'yish kerak deb hisoblaysiz." },
  },
  p146: {
    ru: { prompt: "Вам легко дискутировать, не принимая несогласие на свой счёт." },
    uz: { prompt: "Kelishmovchilikni shaxsiy qilib olmay, mavzu bo'yicha bahs yuritish oson." },
  },
  p147: {
    ru: { prompt: "Принимая важное жизненное решение, логика перевешивает личные чувства." },
    uz: {
      prompt:
        "Muhim hayotiy qaror qabul qilayotganda, mantiq shaxsiy his-tuyg'ulardan ustun turadi.",
    },
  },
  p148: {
    ru: {
      prompt: "Вы чувствуете вину, когда вынуждены ставить эффективность выше чьих-то чувств.",
    },
    uz: {
      prompt:
        "Samaradorlikni birovning his-tuyg'ularidan ustun qo'yishingiz kerak bo'lganda aybdorlik his qilasiz.",
    },
  },
  p149: {
    ru: { prompt: "Вы остро нуждаетесь в том, чтобы никто не чувствовал себя исключённым." },
    uz: {
      prompt:
        "Hech kim tashqarida qolmasligiga ishonch hosil qilish uchun kuchli ehtiyoj his qilasiz.",
    },
  },
  p150: {
    ru: { prompt: "Вы скорее проиграете спор, чем испортите отношения." },
    uz: { prompt: "Munosabatni buzmash uchun bahsni yutqazishni afzal ko'rasiz." },
  },
  p151: {
    ru: { prompt: "На ваше настроение часто влияет эмоциональный тон разговоров вокруг вас." },
    uz: { prompt: "Kayfiyatingiz ko'pincha atrofdagi suhbatlarning emotsional ohangiga bog'liq." },
  },
  p152: {
    ru: {
      prompt: "Вы замечаете, что кто-то эмоционально страдает, ещё до того, как он скажет об этом.",
    },
    uz: { prompt: "Kimdir aytmasdan oldin emotsional qiynalayotganini sezasiz." },
  },
  p153: {
    ru: { prompt: "Вы склонны давать людям кредит доверия, исходя из их обстоятельств." },
    uz: { prompt: "Odamlarga holatlariga qarab hukmingiz foydasiga moyil bo'lasiz." },
  },
  p154: {
    ru: {
      prompt:
        "Вы находите чисто объективные решения, игнорирующие человеческую цену, неудовлетворительными.",
    },
    uz: {
      prompt: "Inson qadrini e'tiborsiz qoldiradigan sof ob'ektiv qarorlar sizni qoniqtirmaydi.",
    },
  },
  p155: {
    ru: { prompt: "Вы быстро замечаете и публично признаёте вклад других." },
    uz: { prompt: "Boshqalarning hissalarini tez sezasiz va ommaviy e'tirof etasiz." },
  },
  p156: {
    ru: {
      prompt: "Для вас получить правильный ответ важнее, чем поддерживать командный моральный дух.",
    },
    uz: { prompt: "Jamoa ruhiyatini saqlashdan ko'ra to'g'ri javob olish siz uchun muhimroq." },
  },
  p157: {
    ru: {
      prompt:
        "Вы могли бы реструктурировать команду ради эффективности, даже если это задело бы чьи-то чувства.",
    },
    uz: {
      prompt:
        "Hatto kimni xafa qilsa ham, samaradorlik uchun jamoani qayta tuzishga tayyor bo'lasiz.",
    },
  },
  p158: {
    ru: { prompt: "Для вас быть последовательным важнее, чем быть сострадательным." },
    uz: { prompt: "Rahmdil bo'lishdan ko'ra izchil bo'lish sizga ko'proq muhim." },
  },
  p159: {
    ru: { prompt: "Когда кто-то жалуется, вы инстинктивно ищете решение, а не сочувствие." },
    uz: {
      prompt: "Kimdir shikoyat qilganda, hamdardlikdan oldin instinktiv ravishda yechim izlaysiz.",
    },
  },
  p160: {
    ru: { prompt: "Вам трудно оставаться нейтральным, когда страдает кто-то близкий." },
    uz: { prompt: "Qadrlagan birovingiz azob chekayotganda, neytral qolish siz uchun qiyin." },
  },
  p161: {
    ru: {
      prompt: "Вы чувствуете наибольший контроль, когда ваш календарь полностью распланирован.",
    },
    uz: {
      prompt: "Taqvimingiz to'liq rejalashtirilganda o'zingizni eng nazoratlangan his qilasiz.",
    },
  },
  p162: {
    ru: {
      prompt:
        "Вы быстро принимаете решения, чтобы двигаться вперёд, а не держать варианты открытыми.",
    },
    uz: {
      prompt:
        "Variantlarni ochiq ushlab turishdan ko'ra oldinga siljish uchun tezda qaror qabul qilasiz.",
    },
  },
  p163: {
    ru: { prompt: "Вам приятно вычёркивать пункты из списка дел." },
    uz: { prompt: "Vazifalar ro'yxatidan punktlarni belgilash siz uchun qoniqarli." },
  },
  p164: {
    ru: { prompt: "Вы предпочитаете прийти заранее, а не рисковать опоздать." },
    uz: { prompt: "Kech qolish xavfini o'rniga erta kelishni afzal ko'rasiz." },
  },
  p165: {
    ru: { prompt: "Вам некомфортно, когда ваше рабочее или жилое пространство не организовано." },
    uz: {
      prompt: "Ish yoki yashash joyingiz tartibsiz bo'lganida o'zingizni noqulay his qilasiz.",
    },
  },
  p166: {
    ru: { prompt: "Вы предпочитаете полностью завершить один проект, прежде чем начать другой." },
    uz: {
      prompt: "Boshqasini boshlashdan oldin bitta loyihani to'liq yakunlashni afzal ko'rasiz.",
    },
  },
  p167: {
    ru: { prompt: "Вам нравится следовать чёткому распорядку дня." },
    uz: { prompt: "Tuzilgan kundalik tartibga amal qilishni yaxshi ko'rasiz." },
  },
  p168: {
    ru: { prompt: "Вы любите планировать поездки заблаговременно." },
    uz: { prompt: "Sayohat rejalarini oldindan belgilashni yaxshi ko'rasiz." },
  },
  p169: {
    ru: { prompt: "Чёткие ожидания и определённые роли значительно снижают ваш стресс." },
    uz: {
      prompt: "Aniq kutishlar va belgilangan rollar stressingizni sezilarli darajada kamaytiradi.",
    },
  },
  p170: {
    ru: { prompt: "Нерешённые вопросы не дают вам покоя, пока не будут урегулированы." },
    uz: { prompt: "Hal qilinmagan masalalar hal qilinguncha sizni bezovta qiladi." },
  },
  p171: {
    ru: { prompt: "Вам нравятся планы в последнюю минуту и спонтанные решения." },
    uz: { prompt: "Oxirgi daqiqadagi rejalar va spontan qarorlarni yaxshi ko'rasiz." },
  },
  p172: {
    ru: { prompt: "Вы часто откладываете решения как можно дольше, чтобы сохранить гибкость." },
    uz: {
      prompt:
        "Ko'pincha moslashuvchanlikni saqlash uchun imkon qadar uzoqroq qarorlarni ochiq qoldirasiz.",
    },
  },
  p173: {
    ru: {
      prompt: "Вы находите жёсткие расписания стесняющими и предпочитаете работать в своём темпе.",
    },
    uz: {
      prompt:
        "Qat'iy jadvallarni cheklovchi deb bilasiz va o'z sur'atingizda ishlashni afzal ko'rasiz.",
    },
  },
  p174: {
    ru: { prompt: "Вам комфортно начинать задачи, не зная точно, как вы их завершите." },
    uz: { prompt: "Qanday tamom bo'lishini bilmasdan vazifalarni boshlashga tayyor bo'lasiz." },
  },
  p175: {
    ru: { prompt: "Вы склонны работать лучше всего под давлением приближающегося дедлайна." },
    uz: {
      prompt:
        "Yaqinlashib kelayotgan muddatning bosimi ostida eng yaxshi natija berishga moyilsiz.",
    },
  },
  p176: {
    ru: {
      prompt:
        "Вам комфортно оставить кое-что незавершённым, если появится что-то более интересное.",
    },
    uz: {
      prompt:
        "Yangi qiziqarli narsa paydo bo'lsa, yakunlanmagan ishlarni qoldirishga tayyor bo'lasiz.",
    },
  },
  p177: {
    ru: {
      prompt:
        "Вы предпочитаете гибкий план, который может адаптироваться, а не фиксированное расписание.",
    },
    uz: { prompt: "Qat'iy jadval o'rniga moslashuvchi rejani afzal ko'rasiz." },
  },
  p178: {
    ru: { prompt: "Вы находите структурированные среды сдерживающими вашу творческую сторону." },
    uz: { prompt: "Tuzilgan muhitlar ijodkorligingizni bo'g'adi deb hisoblaysiz." },
  },
  p179: {
    ru: {
      prompt: "Вам нравится сам процесс исследования больше, чем достижение конечного результата.",
    },
    uz: {
      prompt: "Xulosa chiqarishdan ko'ra izlanish jarayonining o'zini ko'proq yaxshi ko'rasiz.",
    },
  },
  p180: {
    ru: {
      prompt:
        "Вы предпочитаете оставлять выходные нераспланированными, чтобы делать то, что хочется.",
    },
    uz: {
      prompt:
        "Dam olish kunlaringizni rejalashtirilmagan holda qoldirasiz, shunda istaganingizni qila olasiz.",
    },
  },
  p181: {
    ru: {
      prompt:
        "Вы чувствуете себя наиболее продуктивным, работая по приоритизированному списку задач.",
    },
    uz: {
      prompt:
        "Birinchi o'ringa qo'yilgan vazifalar ro'yxatidan ishlayotganingizda o'zingizni eng samarali his qilasiz.",
    },
  },
  p182: {
    ru: {
      prompt:
        "Вы испытываете удовлетворение, когда долгосрочный план воплощается так, как было задумано.",
    },
    uz: {
      prompt:
        "Uzoq muddatli rejaning mo'ljallanganiday amalga oshishini ko'rganingizda qoniqish his qilasiz.",
    },
  },
  p183: {
    ru: { prompt: "Вы предпочитаете быстро разрешать конфликты, а не позволять им затягиваться." },
    uz: { prompt: "Nizolarni cho'zishga qo'ymay tezda hal qilishni afzal ko'rasiz." },
  },
  p184: {
    ru: { prompt: "Вы создаёте детальные планы перед началом нового проекта." },
    uz: { prompt: "Yangi loyiha boshlanishidan oldin batafsil rejalar tuzasiz." },
  },
  p185: {
    ru: { prompt: "Неопределённость в ваших обязанностях вызывает у вас тревогу." },
    uz: { prompt: "Mas'uliyatingizdagi noaniqlik sizda tashvish uyg'otadi." },
  },
  p186: {
    ru: { prompt: "Вы любите принять решение и выполнять его, не пересматривая." },
    uz: { prompt: "Qaror qabul qilish va keyin ikkilanmasdan bajarishni yaxshi ko'rasiz." },
  },
  p187: {
    ru: {
      prompt: "Вы скорее подготовитесь заранее, чем будете импровизировать в важной ситуации.",
    },
    uz: {
      prompt:
        "Muhim vaziyatda improvizatsiya qilishdan ko'ra ortiqcha tayyorlanishni afzal ko'rasiz.",
    },
  },
  p188: {
    ru: {
      prompt:
        "Вам нравится каждый раз делать одно и то же по-разному, в зависимости от настроения.",
    },
    uz: {
      prompt:
        "Bir xil ishni har safar boshqacha usulda, kayfiyatingizga qarab qilishni yaxshi ko'rasiz.",
    },
  },
  p189: {
    ru: {
      prompt:
        "Вы часто начинаете много интересных проектов, но испытываете трудности с их завершением.",
    },
    uz: {
      prompt:
        "Ko'pincha ko'p qiziqarli loyihalar boshlaysiz, lekin barchasini yakunlashda qiynalasiz.",
    },
  },
  p190: {
    ru: {
      prompt:
        "Вас заряжает возможность реагировать на меняющиеся обстоятельства в режиме реального времени.",
    },
    uz: {
      prompt:
        "O'zgarib borayotgan sharoitlarga real vaqtda javob bera olish imkoniyati sizni energiyalantiradi.",
    },
  },
  p191: {
    ru: {
      prompt: "В путешествиях вы предпочитаете импровизировать, а не планировать каждую деталь.",
    },
    uz: {
      prompt:
        "Sayohatlarda har bir tafsilotni rejalashtirishdan ko'ra qanday bo'lishiga qarab ketishni afzal ko'rasiz.",
    },
  },
  p192: {
    ru: { prompt: "Вы считаете, что слишком много планирования убивает вашу спонтанность." },
    uz: { prompt: "Juda ko'p rejalashtirish spontanligingizni o'ldiradi deb hisoblaysiz." },
  },
  p193: {
    ru: { prompt: "Иногда вы откладываете решения, просто чтобы посмотреть, как всё разовьётся." },
    uz: {
      prompt:
        "Ba'zan voqealar o'z-o'zidan qanday rivojlanishini ko'rish uchun qarorlarni kechiktirasiz.",
    },
  },
  p194: {
    ru: {
      prompt: "Вы предпочитаете открытые проекты проектам с чётко определёнными рамками и сроками.",
    },
    uz: {
      prompt:
        "Belgilangan qamrov va muddat bilan belgilangan loyihalardan ko'ra ochiq uqli loyihalarni afzal ko'rasiz.",
    },
  },
  p195: {
    ru: { prompt: "Неожиданные изменения в планах — это возможности, а не проблемы." },
    uz: { prompt: "Rejalardagi kutilmagan o'zgarishlar muammolar emas, imkoniyatlardir." },
  },
  p196: {
    ru: {
      prompt: "Вы ведёте детальный календарь и редко пропускаете запланированные обязательства.",
    },
    uz: {
      prompt:
        "Batafsil taqvim tutasiz va rejalashtirilgan majburiyatlarni kamdan-kam o'tkazib yuborasiz.",
    },
  },
  p197: {
    ru: { prompt: "Вам трудно расслабиться, когда в списке есть незавершённые задачи." },
    uz: { prompt: "Ro'yxatda tugatilmagan vazifalar borligi sizni dam olishdan to'xtatadi." },
  },
  p198: {
    ru: {
      prompt: "Вы предпочитаете рабочую среду с чёткими правилами и предсказуемыми результатами.",
    },
    uz: { prompt: "Aniq qoidalar va kutilgan natijalar bilan ishchi muhitni afzal ko'rasiz." },
  },
  p199: {
    ru: {
      prompt:
        "Вы чувствуете себя наиболее творческим, когда у вас полная свобода без фиксированного плана.",
    },
    uz: {
      prompt:
        "Belgilangan rejasisiz to'liq erkinlik bo'lganida o'zingizni eng ijodkor his qilasiz.",
    },
  },
  p200: {
    ru: {
      prompt:
        "Слишком большое количество открытых вариантов для вас более стрессово, чем слишком малое.",
    },
    uz: { prompt: "Juda ko'p ochiq variantlardan bosim jazosi kamroq variantdan ko'ra og'irroq." },
  },
  p201: {
    ru: {
      prompt:
        "Вы считаете групповые сессии решения проблем более продуктивными, чем работу в одиночку.",
    },
    uz: {
      prompt:
        "Guruh muammolarni hal qilish sessiyalarini yolg'iz ishlashdan ko'ra samaraliroq deb hisoblaysiz.",
    },
  },
  p202: {
    ru: { prompt: "Вы лучше думаете, когда можете проговорить свои идеи с кем-то." },
    uz: { prompt: "G'oyalaringizni birov bilan muhokama qilganingizda yaxshiroq fikrlaysiz." },
  },
  p203: {
    ru: { prompt: "Вы чувствуете себя заряженным и мотивированным после вечера с друзьями." },
    uz: {
      prompt:
        "Do'stlar bilan kechadan keyin o'zingizni energiyalangan va motivatsiyalangan his qilasiz.",
    },
  },
  p204: {
    ru: { prompt: "Вы часто сами выходите на контакт с людьми, а не ждёте их." },
    uz: { prompt: "Ko'pincha odamlar bilan bog'lanish tashabbusini o'zingiz ko'rasiz." },
  },
  p205: {
    ru: {
      prompt:
        "Длительная удалённая работа заставляет вас чувствовать себя изолированным и немотивированным.",
    },
    uz: {
      prompt: "Uzoq muddat uydan ishlash sizni izolyatsiyalangan va motivatsiyasiz his qildiradi.",
    },
  },
  p206: {
    ru: {
      prompt:
        "Вы чувствуете себя наиболее уверенным и красноречивым, когда выступаете перед группой.",
    },
    uz: { prompt: "Guruh oldida gapirganingizda o'zingizni eng ishonchli his qilasiz." },
  },
  p207: {
    ru: {
      prompt: "Вам нравится посещать социальные мероприятия, даже если вы там никого не знаете.",
    },
    uz: { prompt: "Ko'p tanish bo'lmasa ham ijtimoiy tadbirlarga borishni yaxshi ko'rasiz." },
  },
  p208: {
    ru: { prompt: "Вам комфортно включаться в групповые активности, не зная всех участников." },
    uz: { prompt: "Hamma tanish bo'lmasa ham guruh faoliyatlariga qo'shilishga tayyor bo'lasiz." },
  },
  p209: {
    ru: {
      prompt:
        "Вам скучно и неспокойно, когда несколько дней проходит без социального взаимодействия.",
    },
    uz: { prompt: "Bir necha kun ijtimoiy aloqasiz o'tsa, zerikasiz va bezovtalanasiz." },
  },
  p210: {
    ru: {
      prompt:
        "Вам легко поддерживать разговор даже с людьми, с которыми вы только что познакомились.",
    },
    uz: { prompt: "Yaqinda tanishgan odamlar bilan ham suhbatni davom ettira olasiz." },
  },
  p211: {
    ru: { prompt: "В офисах открытой планировки или шумных средах вас легко отвлечь." },
    uz: { prompt: "Ochiq rejalama yoki shovqinli muhitlarda siz uchun diqqatni to'plash qiyin." },
  },
  p212: {
    ru: { prompt: "Вы предпочитаете полностью обдумать идеи в голове, прежде чем делиться ими." },
    uz: {
      prompt:
        "G'oyalaringizni boshqalar bilan baham ko'rishdan oldin to'liq ichingizda rivojlantirishni afzal ko'rasiz.",
    },
  },
  p213: {
    ru: { prompt: "Вам комфортнее в небольшом, доверительном кругу, чем на большой вечеринке." },
    uz: { prompt: "Katta ziyofatdan ko'ra kichik, do'stona yig'ilishda ko'proq qulaysiz." },
  },
  p214: {
    ru: {
      prompt:
        "После недели насыщенного социального общения вам нужно несколько дней на полное восстановление.",
    },
    uz: {
      prompt:
        "Bir hafta jadal ijtimoiy muloqotdan keyin to'liq tiklanish uchun bir necha kun kerak bo'ladi.",
    },
  },
  p215: {
    ru: {
      prompt:
        "Вы избирательны в том, сколько вы рассказываете людям, с которыми недавно познакомились.",
    },
    uz: { prompt: "Yaqinda tanishmaganlaringizga nima aytishingizda tanlamsiz." },
  },
  p216: {
    ru: { prompt: "Вам некомфортно, когда люди приходят без предупреждения." },
    uz: {
      prompt:
        "Odamlar oldindan ogohlantirmasdan tashrif buyurganda o'zingizni noqulay his qilasiz.",
    },
  },
  p217: {
    ru: { prompt: "Ваши лучшие идеи приходят, когда вы одни и вас никто не беспокоит." },
    uz: {
      prompt: "Eng yaxshi g'oyalaringiz yolg'iz va to'liq bezovta bo'lmaganingizda paydo bo'ladi.",
    },
  },
  p218: {
    ru: {
      prompt:
        "Вам комфортнее вносить вклад письменно или по электронной почте, чем в живых дискуссиях.",
    },
    uz: {
      prompt:
        "Jonli muhokamalardan ko'ra yozma yoki elektron pochta orqali hissa qo'shishni afzal ko'rasiz.",
    },
  },
  p219: {
    ru: {
      prompt:
        "После работы вам часто нужно тихое время, прежде чем вы почувствуете готовность общаться.",
    },
    uz: {
      prompt:
        "Ishdan keyin ijtimoiylashishga tayyor bo'lish uchun ko'pincha tinch vaqt kerak bo'ladi.",
    },
  },
  p220: {
    ru: {
      prompt: "Вам обычно требуется больше времени, чтобы разогреться с новыми людьми, чем другим.",
    },
    uz: { prompt: "Odatda yangi odamlar bilan isishishga ko'pchilikdan ko'ra ko'proq vaqt kerak." },
  },
  p221: {
    ru: { prompt: "Вы предпочитаете работать с проверенными методами, которые надёжно работают." },
    uz: { prompt: "Ishonchli ishlash uchun isbotlangan usullar bilan ishlashni afzal ko'rasiz." },
  },
  p222: {
    ru: { prompt: "Вы доверяете данным и доказательствам гораздо больше, чем интуиции." },
    uz: { prompt: "Ma'lumotlar va dalillarga intuitsiyadan ancha ko'proq ishonasiz." },
  },
  p223: {
    ru: {
      prompt:
        "Вы сосредоточены на текущей ситуации, а не на размышлениях об отдалённых возможностях.",
    },
    uz: {
      prompt: "Uzoq imkoniyatlar haqida mulohaza yuritish o'rniga joriy vaziyatga e'tibor berasiz.",
    },
  },
  p224: {
    ru: { prompt: "Вам приятнее освоить практический навык, чем исследовать новую теорию." },
    uz: {
      prompt:
        "Yangi nazariyani o'rganishdan ko'ra amaliy mahorat egallash sizga ko'proq qoniqish beradi.",
    },
  },
  p225: {
    ru: {
      prompt:
        "Вы предпочитаете точные инструкции с чёткими измерениями, а не расплывчатые приближения.",
    },
    uz: {
      prompt: "Noaniq taxminlardan ko'ra aniq o'lchovlar bilan aniq ko'rsatmalarni afzal ko'rasiz.",
    },
  },
  p226: {
    ru: {
      prompt: "Вы находите практические демонстрации более полезными, чем теоретические модели.",
    },
    uz: { prompt: "Nazariy modellardan ko'ra amaliy ko'rsatmalarni foydali deb bilasiz." },
  },
  p227: {
    ru: { prompt: "Вы склонны описывать ситуации буквально и конкретно, а не с помощью метафор." },
    uz: {
      prompt:
        "Vaziyatlarni metaforalar bilan emas, balki literal va aniq ifodalar bilan tasvirlaysiz.",
    },
  },
  p228: {
    ru: {
      prompt:
        "Оценивая человека, вы цените практический опыт больше, чем академические квалификации.",
    },
    uz: {
      prompt:
        "Kimnidir baholaganda, akademik malakalardan ko'ra amaliy tajribani ko'proq qadraysiz.",
    },
  },
  p229: {
    ru: {
      prompt:
        "Вы сосредоточены на том, что происходит на самом деле, а не на теоретических возможностях.",
    },
    uz: {
      prompt:
        "Nazariy sodir bo'lishi mumkin bo'lgan narsadan ko'ra haqiqatda nima sodir bo'lishiga e'tibor berasiz.",
    },
  },
  p230: {
    ru: { prompt: "Вы предпочитаете учиться на практике, а не читать о теме сначала." },
    uz: {
      prompt: "Mavzu haqida avval o'qishdan ko'ra amaliyot orqali o'rganishni afzal ko'rasiz.",
    },
  },
  p231: {
    ru: { prompt: "Вы любите исследовать гипотетические сценарии и вопросы «что, если»." },
    uz: {
      prompt: "Faraziy stsenariylarni va 'agar bo'lsa' savollarini o'rganishni yaxshi ko'rasiz.",
    },
  },
  p232: {
    ru: { prompt: "Вы часто замечаете скрытые связи между, казалось бы, несвязанными вещами." },
    uz: {
      prompt:
        "Ko'pincha butunlay bog'liq bo'lmagan narsalar orasidagi yashirin aloqalarni sezasiz.",
    },
  },
  p233: {
    ru: { prompt: "Вы чаще мечтаете о будущих возможностях, чем сосредотачиваетесь на настоящем." },
    uz: {
      prompt:
        "Hozirga e'tibor berishdan ko'ra kelajakdagi imkoniyatlar haqida ko'proq xayol qilasiz.",
    },
  },
  p234: {
    ru: {
      prompt:
        "Вы предпочитаете проекты, требующие творческого решения проблем, а не рутинные задачи.",
    },
    uz: {
      prompt:
        "Monoton vazifalar o'rniga ijodiy muammolarni hal qilishni talab qiladigan loyihalarni afzal ko'rasiz.",
    },
  },
  p235: {
    ru: {
      prompt:
        "Вам нравится читать книги, исследующие абстрактные, философские или умозрительные идеи.",
    },
    uz: {
      prompt:
        "Abstrakt, falsafiy yoki spekulyativ g'oyalarni o'rganadigan kitoblarni o'qishni yaxshi ko'rasiz.",
    },
  },
  p236: {
    ru: {
      prompt:
        "Вы чувствуете себя наиболее вовлечённым, когда задача требует воображения и новых подходов.",
    },
    uz: {
      prompt:
        "Vazifa tasavvur va yangi yondashuvlarni talab qilganda o'zingizni eng maftun his qilasiz.",
    },
  },
  p237: {
    ru: { prompt: "Принимая важные решения, вы доверяете своим предчувствиям и интуиции." },
    uz: { prompt: "Muhim qarorlar qabul qilayotganda sezgilar va ichki ovozingizga ishonasiz." },
  },
  p238: {
    ru: { prompt: "Вас больше интересует вопрос «почему что-то работает», чем «как именно»." },
    uz: {
      prompt:
        "Nimaningdir aynan qanday ishlashidan ko'ra nima uchun ishlashini bilish sizga qiziqroq.",
    },
  },
  p239: {
    ru: {
      prompt:
        "Вам нравится думать о том, как нынешние тенденции могут сформировать далёкое будущее.",
    },
    uz: {
      prompt:
        "Joriy tendentsiyalar uzoq kelajakni qanday shakllantirishini o'ylashni yaxshi ko'rasiz.",
    },
  },
  p240: {
    ru: {
      prompt:
        "Вы часто выдвигаете идеи, которые другие считают нестандартными или опережающими своё время.",
    },
    uz: {
      prompt:
        "Ko'pincha boshqalar g'ayrioddiy yoki zamonidan oldingi deb hisoblaydigan g'oyalar taklif qilasiz.",
    },
  },
  p241: {
    ru: {
      prompt:
        "Оценивая решение, вы сосредотачиваетесь на логических последствиях, а не на личном влиянии.",
    },
    uz: {
      prompt:
        "Qarorni baholayotganda, shaxsiy ta'sir o'rniga mantiqiy oqibatlarga e'tibor berasiz.",
    },
  },
  p242: {
    ru: { prompt: "Для вас важнее быть правым, чем быть любимым." },
    uz: { prompt: "Sevilishdan ko'ra to'g'ri bo'lish sizga muhimroq." },
  },
  p243: {
    ru: {
      prompt:
        "Вы предпочитаете честную прямую обратную связь воодушевляющей, но расплывчатой похвале.",
    },
    uz: {
      prompt:
        "Rag'batlantiruvchi, lekin noaniq maqtovdan ko'ra halol va to'g'ridan-to'g'ri fikrni afzal ko'rasiz.",
    },
  },
  p244: {
    ru: {
      prompt: "Вам комфортно принимать жёсткие решения, даже если они расстраивают окружающих.",
    },
    uz: {
      prompt: "Atrofingizdagilarni xafa qilsa ham, qiyin qarorlar qabul qilishga tayyor bo'lasiz.",
    },
  },
  p245: {
    ru: { prompt: "Работая над сложной проблемой, вы сознательно отделяете эмоции от анализа." },
    uz: {
      prompt:
        "Murakkab muammo ustida ishlayotganda, emotsiyalarni tahlildan ongli ravishda ajratasiz.",
    },
  },
  p246: {
    ru: {
      prompt: "Вас раздражает, когда важные решения принимаются на основе чувств, а не фактов.",
    },
    uz: {
      prompt:
        "Muhim qarorlar dalillarga emas, his-tuyg'ularga asoslanganida sizi hafsalasi pir qiladi.",
    },
  },
  p247: {
    ru: {
      prompt:
        "Вы предпочитаете оценивать работу по объективным критериям, а не субъективным впечатлениям.",
    },
    uz: {
      prompt:
        "Sub'ektiv taassurotlardan ko'ra ob'ektiv mezonlar bo'yicha ishni baholashni afzal ko'rasiz.",
    },
  },
  p248: {
    ru: {
      prompt:
        "Урегулируя конфликт, вы сосредотачиваетесь на справедливом результате, а не на том, чтобы все были довольны.",
    },
    uz: {
      prompt:
        "Nizoni hal qilishda, barchani xursand qilishdan ko'ra adolatli natijaga erishishga e'tibor berasiz.",
    },
  },
  p249: {
    ru: {
      prompt:
        "Вы применяете одни и те же принципы последовательно ко всем, независимо от личных чувств.",
    },
    uz: {
      prompt:
        "Shaxsiy his-tuyg'ularingizdan qat'i nazar, bir xil tamoyillarni barcha odamlarga izchil qo'llaysiz.",
    },
  },
  p250: {
    ru: {
      prompt:
        "Вы считаете эмоциональные призывы в аргументах менее убедительными, чем фактические рассуждения.",
    },
    uz: {
      prompt:
        "Dalillarga asoslangan mulohazadan ko'ra bahslardagi emotsional murojaatlarni kamroq ishonchli deb bilasiz.",
    },
  },
  p251: {
    ru: {
      prompt: "Вам трудно не соглашаться с кем-то близким, даже когда вы знаете, что они неправы.",
    },
    uz: {
      prompt:
        "Noto'g'ri ekanini bilsangiz ham, sevgan odamingiz bilan rozi bo'lmaslik siz uchun qiyin.",
    },
  },
  p252: {
    ru: { prompt: "Вы склонны воспринимать критику лично, даже если она конструктивная." },
    uz: { prompt: "Tanqid qurilish xarakterida bo'lsa ham, uni shaxsiy qilib olishga moyilsiz." },
  },
  p253: {
    ru: {
      prompt:
        "Когда друг расстроен, ваш первый инстинкт — утешить его, а не предложить немедленное решение.",
    },
    uz: {
      prompt:
        "Do'stingiz xafa bo'lganda, birinchi instinktingiz darhol yechim taklif qilish emas, balki tasalli berishdir.",
    },
  },
  p254: {
    ru: {
      prompt: "Вы естественно ощущаете эмоциональную атмосферу комнаты, как только входите в неё.",
    },
    uz: { prompt: "Xonaga kirganda, uning emotsional muhitini tabiiy his qilasiz." },
  },
  p255: {
    ru: {
      prompt:
        "Большинство своих решений вы принимаете, опираясь на ощущения, а не на логический анализ.",
    },
    uz: {
      prompt:
        "Ko'p qarorlaringizni mantiqiy tahlildan ko'ra his-tuyg'ularingizga asosib qabul qilasiz.",
    },
  },
  p256: {
    ru: {
      prompt:
        "Зная, что кто-то обижен вашим решением, вы хотите его пересмотреть, даже если оно было правильным.",
    },
    uz: {
      prompt:
        "Qaroringizdan birov xafa bo'lganini bilsangiz, u to'g'ri bo'lsa ham qaytadan ko'rib chiqmoqchi bo'lasiz.",
    },
  },
  p257: {
    ru: {
      prompt:
        "Вы ставите поддержание гармонии в группе выше, чем продвижение наиболее логичного результата.",
    },
    uz: {
      prompt:
        "Eng mantiqiy natijaga intilishdan ko'ra guruh uyg'unligini saqlashni birinchi o'ringa qo'yasiz.",
    },
  },
  p258: {
    ru: {
      prompt:
        "Вы считаете, что решение, не причиняющее никому вреда, всегда предпочтительнее наиболее эффективного.",
    },
    uz: {
      prompt:
        "Hech kimga zarar etkazmaydigan qaror har doim eng samarali qarordan afzalroq deb hisoblaysiz.",
    },
  },
  p259: {
    ru: { prompt: "Истории о несправедливости и человеческих страданиях глубоко трогают вас." },
    uz: { prompt: "Adolatsizlik va insoniy azob haqidagi hikoyalar sizni chuqur ta'sirlantiradi." },
  },
  p260: {
    ru: {
      prompt:
        "Чувства и ценности вовлечённых людей являются для вас ключевым фактором при любом решении.",
    },
    uz: {
      prompt:
        "Har qanday qaror qabul qilishda ishtirokchilarning his-tuyg'ulari va qadriyatlari asosiy omil hisoblanadi.",
    },
  },
  p261: {
    ru: { prompt: "Вы чувствуете себя наиболее уверенно, когда у вас есть чёткий пошаговый план." },
    uz: {
      prompt: "Aniq, bosqichma-bosqich rejangiz bo'lganda o'zingizni eng ishonchli his qilasiz.",
    },
  },
  p262: {
    ru: {
      prompt: "Вам не нравятся изменения планов в последнюю минуту, даже если изменение к лучшему.",
    },
    uz: {
      prompt:
        "O'zgarish yaxshilanish bo'lsa ham, rejalardagi oxirgi daqiqadagi o'zgarishlarni yoqtirmaysiz.",
    },
  },
  p263: {
    ru: {
      prompt: "Приняв курс действий, вы доводите его до конца, а не пересматриваете постоянно.",
    },
    uz: {
      prompt: "Harakat yo'lini tanlagach, doimiy qayta baholash o'rniga uni oxiriga olib borasiz.",
    },
  },
  p264: {
    ru: { prompt: "Вам легко отказаться от новых запросов, когда расписание уже заполнено." },
    uz: { prompt: "Jadvalingiz to'la bo'lganda yangi so'rovlarga 'yo'q' deyish oson." },
  },
  p265: {
    ru: { prompt: "Вам приятно завершить все задачи, прежде чем переходить к новым." },
    uz: {
      prompt: "Yangilariga o'tishdan oldin barcha vazifalarni yakunlashni qoniqarli deb bilasiz.",
    },
  },
  p266: {
    ru: {
      prompt: "Вы планируете личное время и отдых так же обдуманно, как рабочие обязательства.",
    },
    uz: {
      prompt:
        "Shaxsiy vaqt va dam olishni ish majburiyatlarini rejalashtirganingiz kabi ongli ravishda rejalashtirasiz.",
    },
  },
  p267: {
    ru: {
      prompt:
        "Начиная новый проект, вы составляете полный план, прежде чем написать первую строку.",
    },
    uz: {
      prompt: "Yangi loyiha boshlanishida, birinchi satrni yozishdan oldin to'liq reja tuzasiz.",
    },
  },
  p268: {
    ru: { prompt: "Вы чувствуете себя спокойнее всего, когда знаете, что вас ждёт до конца дня." },
    uz: {
      prompt: "Kunning qolgan qismida nima kutayotganingizni bilganingizda eng tinch his qilasiz.",
    },
  },
  p269: {
    ru: { prompt: "Вы часто составляете списки и организуете вещи по категориям или системам." },
    uz: {
      prompt:
        "Ko'pincha ro'yxatlar tuzasiz va buyumlarni kategoriyalar yoki sistemalar bo'yicha tartibga solasiz.",
    },
  },
  p270: {
    ru: {
      prompt:
        "Вы испытываете подлинное удовлетворение, выполнив всё из своего ежедневного списка задач.",
    },
    uz: {
      prompt:
        "Kunlik vazifalar ro'yxatingizdan hammasini bajarganingizda haqiqiy qoniqish his qilasiz.",
    },
  },
  p271: {
    ru: {
      prompt:
        "Вы часто меняете планы на ходу, когда появляется что-то более интересное или перспективное.",
    },
    uz: {
      prompt:
        "Ko'pincha yangi qiziqarli yoki istiqbolli narsa paydo bo'lganda o'rta yo'lda rejalarni o'zgartirasiz.",
    },
  },
  p272: {
    ru: {
      prompt:
        "Вы предпочитаете работать во вспышках вдохновения, а не по фиксированному расписанию.",
    },
    uz: { prompt: "Belgilangan jadvalda emas, balki ilhom lahzalarida ishlashni afzal ko'rasiz." },
  },
  p273: {
    ru: {
      prompt:
        "Вы чувствуете беспокойство, когда застряли в жёстком плане без места для импровизации.",
    },
    uz: {
      prompt:
        "Improvizatsiya uchun joy qoldirmaydigan qat'iy rejaga mahkam bo'lganda bezovtalanasiz.",
    },
  },
  p274: {
    ru: { prompt: "Перед принятием решения вы склонны собирать всё больше и больше информации." },
    uz: { prompt: "Qaror qabul qilishdan oldin tobora ko'proq ma'lumot yig'ishga moyilsiz." },
  },
  p275: {
    ru: { prompt: "Вам вполне комфортно начинать проект, не зная точно, чем он завершится." },
    uz: { prompt: "Loyiha qanday tugashi noma'lum bo'lsa ham, uni boshlashga tayyor bo'lasiz." },
  },
  p276: {
    ru: { prompt: "Вы предпочитаете гибкие, обсуждаемые сроки жёстким, фиксированным." },
    uz: {
      prompt:
        "Qat'iy, belgilangan muddatlardan ko'ra moslashuvchan, muzokara qilinishi mumkin bo'lganlarni afzal ko'rasiz.",
    },
  },
  p277: {
    ru: {
      prompt:
        "Ваши лучшие творческие идеи склонны появляться, когда у вас нет фиксированной повестки.",
    },
    uz: {
      prompt:
        "Eng yaxshi ijodiy g'oyalaringiz belgilangan kun tartibi yoki tuzilma bo'lmaganida paydo bo'ladi.",
    },
  },
  p278: {
    ru: {
      prompt:
        "Вы держите свои долгосрочные цели нечёткими, чтобы адаптироваться по мере появления новых возможностей.",
    },
    uz: {
      prompt:
        "Yangi imkoniyatlar paydo bo'lganda moslanadigan, uzoq muddatli maqsadlaringizni noaniq saqlaysiz.",
    },
  },
  p279: {
    ru: {
      prompt:
        "Вам нравится пробовать новые подходы к знакомым проблемам, даже если старый работает.",
    },
    uz: {
      prompt:
        "Eski yondashuv ishlayotgan bo'lsa ham, tanish muammolarga yangi yondashuvlarni sinab ko'rishni yaxshi ko'rasiz.",
    },
  },
  p280: {
    ru: {
      prompt:
        "Вы чувствуете себя наиболее живым, когда у вас несколько захватывающих незавершённых проектов.",
    },
    uz: {
      prompt:
        "Bir vaqtning o'zida bir nechta hayajonli, lekin tugallanmagan loyihalaringiz bo'lganda o'zingizni eng jonlangan his qilasiz.",
    },
  },

  // ── Cognitive — verbal analogies & word-meaning questions (options translated) ──
  c2: {
    ru: {
      prompt: "Все розы — цветы. Некоторые цветы быстро вянут. Следовательно:",
      options: [
        "Все розы быстро вянут",
        "Некоторые розы могут быстро вянуть",
        "Никакие розы не вянут",
        "Только розы вянут",
      ],
    },
    uz: {
      prompt: "Barcha atirgullar gul. Ba'zi gullar tez so'ladi. Demak:",
      options: [
        "Barcha atirgullar tez so'ladi",
        "Ba'zi atirgullar tez so'lishi mumkin",
        "Hech bir atirgul so'lmaydi",
        "Faqat atirgullar so'ladi",
      ],
    },
  },
  c4: {
    ru: {
      prompt: "Что лишнее: Квадрат, Круг, Треугольник, Куб?",
      options: ["Квадрат", "Круг", "Треугольник", "Куб"],
    },
    uz: {
      prompt: "Qaysi biri ortiqcha: Kvadrat, Doira, Uchburchak, Kub?",
      options: ["Kvadrat", "Doira", "Uchburchak", "Kub"],
    },
  },
  c7: {
    ru: {
      prompt:
        "Поезд отходит со скоростью 60 км/ч. Второй поезд выезжает 2 часа спустя со скоростью 80 км/ч. Когда он догонит первый?",
      options: [
        "Через 6 ч после первого",
        "Через 8 ч после первого",
        "Через 10 ч после первого",
        "Через 12 ч после первого",
      ],
    },
    uz: {
      prompt:
        "Poyezd 60 km/soat tezlikda jo'nadi. Ikkinchi poyezd 2 soat keyin 80 km/soat tezlikda jo'naydi. Qachon birinchisiga yetib oladi?",
      options: [
        "Birinchidan 6 soat keyin",
        "Birinchidan 8 soat keyin",
        "Birinchidan 10 soat keyin",
        "Birinchidan 12 soat keyin",
      ],
    },
  },
  c9: {
    ru: {
      prompt: "Если некоторые A являются B и все B являются C, то:",
      options: [
        "Все A являются C",
        "Некоторые A являются C",
        "Никакие A не являются C",
        "Все C являются A",
      ],
    },
    uz: {
      prompt: "Agar ba'zi A lar B bo'lsa va barcha B lar C bo'lsa, u holda:",
      options: [
        "Barcha A lar C dir",
        "Ba'zi A lar C dir",
        "Hech bir A C emas",
        "Barcha C lar A dir",
      ],
    },
  },
  iq4: {
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
        "Qaysi ikki so'z ma'nosi bo'yicha eng qarama-QARSHi?\nxayoliy, realistik, o'qib bo'lmaydigan, amalga oshirilmaydigan, radikal, bezatilgan",
      options: [
        "xayoliy / radikal",
        "realistik / amalga oshirilmaydigan",
        "o'qib bo'lmaydigan / bezatilgan",
        "radikal / bezatilgan",
      ],
    },
  },
  iq5: {
    ru: {
      prompt: "Коллега относится к коллеге, как сообщник относится к:",
      options: ["соучастнику", "другу", "помощнику", "товарищу"],
    },
    uz: {
      prompt: "Hamkor sheriкga qanday bog'liq bo'lsa, hamkorchi shunday bog'liq:",
      options: ["sherikchi", "do'st", "yordamchi", "hamroh"],
    },
  },
  iq6: {
    ru: {
      prompt:
        "Что является лишним?\nзнаменитый, прославленный, прославленный, сказочный, примечательный",
      options: ["знаменитый", "прославленный", "сказочный", "примечательный"],
    },
    uz: {
      prompt: "Qaysi biri ortiqcha?\nmashxur, ulug'vor, mashhur, sehrli, e'tiborga molik",
      options: ["mashxur", "ulug'vor", "sehrli", "e'tiborga molik"],
    },
  },
  iq9: {
    ru: {
      prompt:
        "Какое слово в скобках наиболее ПРОТИВОПОЛОЖНО значению слова СМЯГЧАТЬ?\n(усиливать, облегчать, ценить, доверять, разрушать)",
      options: ["усиливать", "облегчать", "ценить", "разрушать"],
    },
    uz: {
      prompt:
        "Qavs ichidagi qaysi so'z YUMSHATMOQ so'ziga eng ko'p QARSHi ma'noda?\n(kuchaytirmoq, yengillashtirmoq, qadrlamoq, ishonmoq, yo'q qilmoq)",
      options: ["kuchaytirmoq", "yengillashtirmoq", "qadrlamoq", "yo'q qilmoq"],
    },
  },
  iq10: {
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
        "Qaysi ikki so'z ma'nosi bo'yicha eng yaqin?\nta'limli, aniq, so'zma-so'z, halsiz, so'zchil, aynan",
      options: ["ta'limli / aniq", "so'zma-so'z / aynan", "so'zchil / ta'limli", "aniq / aynan"],
    },
  },
  iq13: {
    ru: {
      prompt:
        "Какое слово в скобках наиболее близко по значению к ПРИВЫЧНЫЙ?\n(постоянный, привычный, колонизированный, обычный, энергичный)",
      options: ["постоянный", "привычный", "колонизированный", "обычный"],
    },
    uz: {
      prompt:
        "Qavs ichidagi qaysi so'z ODATLANGAN so'ziga ma'nosi jihatidan eng yaqin?\n(doimiy, odatiy, mustamlaka qilingan, oddiy, faol)",
      options: ["doimiy", "odatiy", "mustamlaka qilingan", "oddiy"],
    },
  },
  iq26: {
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
        "Har bir qavsdan bir so'z tanlang, u bosh harflar bilan yozilgan so'z bilan bog'lansin.\nCHEKLAMOQ (bostirmoq / inkor etmoq / yashirmoq)\nYASHIRMOQ (jilovlamoq / saqlamoq / yashirmoq)",
      options: [
        "inkor etmoq / jilovlamoq",
        "bostirmoq / saqlamoq",
        "yashirmoq / yashirmoq",
        "bostirmoq / jilovlamoq",
      ],
    },
  },

  // ── Interest questions (projective — prompts + option labels, in option order) ──
  ins1: {
    ru: {
      prompt: "Какая фигура притягивает вас интуитивно?",
      options: ["Квадрат", "Треугольник", "Круг", "Волнистая линия", "Прямоугольник", "Ромб"],
    },
    uz: {
      prompt: "Qaysi shakl sizni beixtiyor o'ziga tortadi?",
      options: ["Kvadrat", "Uchburchak", "Doira", "To'lqinli chiziq", "To'rtburchak", "Romb"],
    },
  },
  ina1: {
    ru: {
      prompt: "Какое существо больше всего похоже на вас?",
      options: ["Лев", "Сова", "Дельфин", "Орёл", "Лиса", "Волк"],
    },
    uz: {
      prompt: "Qaysi jonivor sizga eng ko'p o'xshaydi?",
      options: ["Sher", "Boyo'g'li", "Delfin", "Burgut", "Tulki", "Bo'ri"],
    },
  },
  inl1: {
    ru: {
      prompt: "Какая линия ощущается как «вы»?",
      options: ["Прямая", "Восходящая", "Волна", "Зигзаг", "Спираль", "Сетка"],
    },
    uz: {
      prompt: "Qaysi chiziq eng ko'p 'siz'ga o'xshaydi?",
      options: ["To'g'ri", "Ko'tariluvchi", "To'lqin", "Zigzag", "Spiral", "To'r"],
    },
  },
  inc1: {
    ru: {
      prompt: "Какая палитра вас притягивает?",
      options: ["Уголь", "Глубина моря", "Луг", "Фиолет", "Солнечная", "Земляная"],
    },
    uz: {
      prompt: "Qaysi ranglar palitrasi sizni o'ziga tortadi?",
      options: ["Cho'g'", "Dengiz tubi", "O'tloq", "Binafsha", "Quyoshli", "Tuproq rang"],
    },
  },
  inn1: {
    ru: {
      prompt: "Где бы вы предпочли оказаться прямо сейчас?",
      options: [
        "Горная вершина",
        "Открытый океан",
        "Дремучий лес",
        "Огни города",
        "Золотое поле",
        "Тихая пустыня",
      ],
    },
    uz: {
      prompt: "Ayni damda qayerda bo'lishni istardingiz?",
      options: [
        "Tog' cho'qqisi",
        "Ochiq okean",
        "Qalin o'rmon",
        "Shahar chiroqlari",
        "Oltin dala",
        "Sokin sahro",
      ],
    },
  },
  inp1: {
    ru: {
      prompt: "Какой узор привлекает ваш взгляд?",
      options: [
        "Упорядоченные точки",
        "Геометрия",
        "Плавные формы",
        "Микросхема",
        "Мраморные прожилки",
        "Свободный рисунок",
      ],
    },
    uz: {
      prompt: "Qaysi naqsh e'tiboringizni tortadi?",
      options: [
        "Tartibli nuqtalar",
        "Geometrik",
        "Tabiiy oqim",
        "Mikrosxema",
        "Marmar tomirlari",
        "Erkin chizma",
      ],
    },
  },
  ine1: {
    ru: {
      prompt: "Какая стихия вам ближе?",
      options: ["Огонь", "Вода", "Земля", "Воздух", "Молния", "Кристалл"],
    },
    uz: {
      prompt: "Qaysi unsur sizga yaqinroq?",
      options: ["Olov", "Suv", "Yer", "Havo", "Chaqmoq", "Kristall"],
    },
  },
  ino1: {
    ru: {
      prompt: "Выберите предмет, к которому вы потянетесь инстинктивно.",
      options: ["Компас", "Книга", "Кисть", "Лупа", "Рупор", "Гаечный ключ"],
    },
    uz: {
      prompt: "Beixtiyor qo'l cho'zadigan buyumni tanlang.",
      options: ["Kompas", "Kitob", "Mo'yqalam", "Lupa", "Karnay", "Gayka kaliti"],
    },
  },
  ind1: {
    ru: {
      prompt: "Какой звук трогает вас больше всего?",
      options: ["Ровный барабан", "Джазовый саксофон", "Скрипка", "Электроника", "Электрогитара"],
    },
    uz: {
      prompt: "Qaysi tovush sizni eng ko'p ta'sirlantiradi?",
      options: [
        "Bir maromdagi baraban",
        "Jaz saksofoni",
        "Skripka",
        "Elektron musiqa",
        "Elektrogitara",
      ],
    },
  },
  ins2: {
    ru: {
      prompt: "Каким знаком вы бы подписались?",
      options: ["Звезда", "Шестиугольник", "Круг", "Квадрат", "Ромб", "Волнистая линия"],
    },
    uz: {
      prompt: "Ismingizni qaysi belgi bilan imzolardingiz?",
      options: ["Yulduz", "Olti burchak", "Doira", "Kvadrat", "Romb", "To'lqinli chiziq"],
    },
  },
  ina2: {
    ru: {
      prompt: "За каким животным вы могли бы наблюдать часами?",
      options: ["Пчела", "Черепаха", "Бабочка", "Слон", "Лошадь", "Осьминог"],
    },
    uz: {
      prompt: "Qaysi hayvonni soatlab kuzatishingiz mumkin?",
      options: ["Asalari", "Toshbaqa", "Kapalak", "Fil", "Ot", "Sakkizoyoq"],
    },
  },
  inl2: {
    ru: {
      prompt: "Проведите линию, которая ощущается естественной.",
      options: ["Две рельсы", "Восхождение", "Лента", "Резкие повороты", "Виток внутрь", "Сеть"],
    },
    uz: {
      prompt: "Tabiiy tuyuladigan yo'lni chizing.",
      options: [
        "Ikki rels",
        "Ko'tarilish",
        "Lenta",
        "Keskin burilishlar",
        "Ichkariga o'ralish",
        "To'r",
      ],
    },
  },
  inc2: {
    ru: {
      prompt: "Какой свет вас притягивает?",
      options: ["Неон", "Пастель", "Монохром", "Лесной бирюзовый", "Янтарное золото", "Индиго"],
    },
    uz: {
      prompt: "Qaysi yorug'lik sizni o'ziga tortadi?",
      options: ["Neon", "Pastel", "Monoxrom", "O'rmon feruzasi", "Kahrabo tilla", "Indigo"],
    },
  },
  inn2: {
    ru: {
      prompt: "Идеальный вид из вашего окна — это...",
      options: [
        "Звёздное небо",
        "Просторные поля",
        "Оживлённый порт",
        "Лофт с картинами",
        "Горная тропа",
        "Тихая библиотека",
      ],
    },
    uz: {
      prompt: "Deraza oldidagi ideal manzarangiz...",
      options: [
        "Yulduzli osmon",
        "Keng dalalar",
        "Gavjum port",
        "Rasmlarga to'la loft",
        "Tog' so'qmog'i",
        "Sokin kutubxona",
      ],
    },
  },
  ino2: {
    ru: {
      prompt: "Один инструмент на целый год — какой оставите?",
      options: ["Телескоп", "Камера", "Ящик с инструментами", "Счёты", "Микрофон", "Карта"],
    },
    uz: {
      prompt: "Bir yilga bitta asbob — qaysinisini olib qolasiz?",
      options: ["Teleskop", "Kamera", "Asboblar quti", "Cho't", "Mikrofon", "Xarita"],
    },
  },
  ing1: {
    ru: {
      prompt: "В какую игру вы бы с радостью играли всю ночь?",
      options: [
        "Шахматы",
        "Пазл",
        "Импровизация",
        "Командная эстафета",
        "Карточный блеф",
        "Конструктор",
      ],
    },
    uz: {
      prompt: "Qaysi o'yinni tun bo'yi zavq bilan o'ynardingiz?",
      options: [
        "Shaxmat",
        "Pazl",
        "Improvizatsiya",
        "Jamoaviy estafeta",
        "Karta blefi",
        "Konstruktor",
      ],
    },
  },
  inm1: {
    ru: {
      prompt: "Какой материал вы бы формировали руками?",
      options: ["Глина", "Сталь", "Стекло", "Дерево", "Ткань", "Камень"],
    },
    uz: {
      prompt: "Qaysi materialni qo'lingiz bilan shakllantirardingiz?",
      options: ["Loy", "Po'lat", "Shisha", "Yog'och", "Mato", "Tosh"],
    },
  },
  inv1: {
    ru: {
      prompt: "Какое движение лучше всего описывает вас?",
      options: [
        "Спринт",
        "Медленный подъём",
        "Танец",
        "Глубокое погружение",
        "Ровный марш",
        "Свободное скольжение",
      ],
    },
    uz: {
      prompt: "Qaysi harakat sizni eng yaxshi ta'riflaydi?",
      options: [
        "Sprint",
        "Sekin ko'tarilish",
        "Raqs",
        "Chuqur sho'ng'ish",
        "Bir maromdagi yurish",
        "Erkin parvoz",
      ],
    },
  },
  inp2: {
    ru: {
      prompt: "Какую поверхность вы бы провели рукой?",
      options: [
        "Упорядоченные точки",
        "Геометрия",
        "Плавные формы",
        "Микросхема",
        "Мраморные прожилки",
        "Свободный рисунок",
      ],
    },
    uz: {
      prompt: "Qaysi yuzani qo'lingiz bilan silardingiz?",
      options: [
        "Tartibli nuqtalar",
        "Geometrik",
        "Tabiiy oqim",
        "Mikrosxema",
        "Marmar tomirlari",
        "Erkin chizma",
      ],
    },
  },
  ine2: {
    ru: {
      prompt: "Какая сила природы вас больше всего завораживает?",
      options: ["Огонь", "Вода", "Земля", "Воздух", "Молния", "Кристалл"],
    },
    uz: {
      prompt: "Tabiatning qaysi kuchi sizni ko'proq maftun etadi?",
      options: ["Olov", "Suv", "Yer", "Havo", "Chaqmoq", "Kristall"],
    },
  },
  ind2: {
    ru: {
      prompt: "Каким инструментом вы бы хотели овладеть?",
      options: ["Барабаны", "Саксофон", "Скрипка", "Синтезатор", "Электрогитара"],
    },
    uz: {
      prompt: "Qaysi cholg'u asbobini o'rganmoqchisiz?",
      options: ["Baraban", "Saksofon", "Skripka", "Sintezator", "Elektrogitara"],
    },
  },
};
