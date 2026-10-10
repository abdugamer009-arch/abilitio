import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { useWords } from "@/lib/editorial";
import { SchoolReportPreview } from "./SchoolReportPreview";
import { FOUNDERS, FounderPortrait } from "./FounderPortrait";
import { PageShell } from "./PageShell";
import {
  CartoonIllustration,
  CartoonRowIcon,
  CartoonConnector,
  CartoonSparkle,
  MarkedText,
} from "./CartoonArtwork";
type Kind =
  "features" | "about" | "pricing" | "for-schools" | "methodology" | "mentors" | "success-stories";
export function EditorialPage({ kind }: { kind: Kind }) {
  const w = useWords();
  let eyebrow = w("THE FIELD NOTES", "IZLANISH QAYDLARI", "ПОЛЕВЫЕ ЗАМЕТКИ");
  let title = "";
  let intro = "";
  let rows: string[][] = [];
  if (kind === "features") {
    title = w(
      "From questions to a next step.",
      "Savollardan keyingi qadamga.",
      "От вопросов к следующему шагу.",
    );
    intro = w(
      "One assessment. Three signals. A profile you can question, compare and put to work.",
      "Bitta baholash. Uch belgi. O‘rganish, solishtirish va amalda sinash mumkin bo‘lgan profil.",
      "Одна оценка. Три сигнала. Профиль для обсуждения, сравнения и практики.",
    );
    rows = [
      [
        w("Understand the signals", "Belgilarni tushuning", "Поймите сигналы"),
        w(
          "Thirty questions cover reasoning, work preferences and interests. Your result explains the dimensions instead of turning them into a single verdict.",
          "O‘ttiz savol mantiq, ish uslubi va qiziqishlarni qamrab oladi. Natija bitta hukm o‘rniga o‘lchovlarni tushuntiradi.",
          "Тридцать вопросов о мышлении, рабочих предпочтениях и интересах. Результат объясняет измерения вместо единого вердикта.",
        ),
      ],
      [
        w("Compare possible work", "Ish yo‘nalishlarini solishtiring", "Сравните возможную работу"),
        w(
          "Explore suggested careers, compare disciplines and investigate universities. Suggestions describe directions to research, not guaranteed success or admission.",
          "Tavsiya etilgan kasblar, yo‘nalishlar va universitetlarni o‘rganing. Tavsiyalar kafolatlangan muvaffaqiyat yoki qabul emas, izlanish yo‘nalishidir.",
          "Изучите профессии, области и университеты. Подсказки — направления исследования, а не гарантии успеха или поступления.",
        ),
      ],
      [
        w("Try something small", "Kichik ishni sinang", "Попробуйте небольшое дело"),
        w(
          "Your roadmap offers activities to try. Keep a record of what you completed and what you learned. Experience matters more than a decorative score.",
          "Yo‘l xaritasi sinash uchun faoliyatlar beradi. Bajarilgan ish va o‘rganganlaringizni qayd eting. Tajriba bezakli balldan muhimroq.",
          "Маршрут предлагает занятия. Записывайте сделанное и выводы. Опыт важнее декоративного балла.",
        ),
      ],
    ];
  }
  if (kind === "about") {
    title = w(
      "A better conversation about the future.",
      "Kelajak haqida yaxshiroq suhbat.",
      "Более точный разговор о будущем.",
    );
    intro = w(
      "Abilitio is a career exploration project from Uzbekistan. We build tools that give students a starting point, and room to change their minds.",
      "Abilitio — O‘zbekistondagi kasbiy izlanish loyihasi. O‘quvchiga boshlang‘ich nuqta va fikrini o‘zgartirish imkonini beradigan vositalar yaratamiz.",
      "Abilitio — проект исследования профессий из Узбекистана. Мы даём ученикам отправную точку и возможность менять мнение.",
    );
    rows = [
      [
        w("A profile is a hypothesis", "Profil — taxmin", "Профиль — гипотеза"),
        w(
          "The point is to ask better questions about real work. We do not turn a personality label into a limit on a student's future.",
          "Maqsad — haqiqiy ish haqida aniqroq savollar berish. Shaxs turi o‘quvchining kelajagini cheklamaydi.",
          "Цель — точные вопросы о реальной работе. Тип личности не ограничивает будущее ученика.",
        ),
      ],
      [
        w("Show the method", "Usulni ko‘rsating", "Показывайте метод"),
        w(
          "Question counts, scoring scales and limitations should be visible. We publish the methodology and distinguish examples from actual results.",
          "Savollar soni, shkala va chegaralar ochiq bo‘lishi kerak. Metodologiyani beramiz va namunalarni haqiqiy natijalardan ajratamiz.",
          "Количество вопросов, шкалы и ограничения должны быть видны. Мы публикуем метод и отделяем примеры от результатов.",
        ),
      ],
    ];
  }
  if (kind === "pricing") {
    title = w(
      "Free student tools. Clear school arrangements.",
      "Bepul o‘quvchi vositalari. Aniq maktab kelishuvlari.",
      "Бесплатно ученикам. Прозрачно школам.",
    );
    intro = w(
      "Students can use the assessment and exploration tools without a subscription. School onboarding and support are discussed directly.",
      "O‘quvchilar baholash va izlanish vositalarini obunasiz ishlatadi. Maktabni ulash va yordam shartlari bevosita kelishiladi.",
      "Ученики пользуются оценкой и инструментами без подписки. Подключение и сопровождение школ обсуждаются напрямую.",
    );
    rows = [
      [
        w("For an individual student", "Alohida o‘quvchi uchun", "Для ученика"),
        w(
          "Assessment, saved profile, career comparison and university exploration. An account is needed to save completed results. No card is required.",
          "Baholash, saqlangan profil, kasb solishtirish va universitet izlanishi. Yakuniy natijani saqlash uchun hisob kerak. Karta talab qilinmaydi.",
          "Оценка, сохранённый профиль, сравнение профессий и университеты. Для сохранения нужен аккаунт. Карта не требуется.",
        ),
      ],
      [
        w("For a school", "Maktab uchun", "Для школы"),
        w(
          "Talk to us about your student count, language and workflow. We agree the scope and any costs before onboarding; no unsupported popularity badges or fixed promises.",
          "O‘quvchilar soni, til va jarayonni muhokama qiling. Ulashdan oldin hajm va xarajatlar kelishiladi.",
          "Обсудим количество учеников, язык и процесс. Объём и стоимость согласовываются до подключения.",
        ),
      ],
    ];
  }
  if (kind === "for-schools") {
    eyebrow = w("FOR SCHOOLS", "MAKTABLAR UCHUN", "ШКОЛАМ");
    title = w(
      "Help students explore careers together.",
      "O‘quvchilar kasblarni birga o‘rgansin.",
      "Помогите ученикам исследовать профессии вместе.",
    );
    intro = w(
      "Give students an assessment, then a conversation. Class-level views support discussion without presenting a score as destiny.",
      "O‘quvchiga baholash, keyin suhbat bering. Sinf ko‘rinishi ballni taqdir deb ko‘rsatmasdan muhokamaga yordam beradi.",
      "Сначала оценка, затем разговор. Обзор класса помогает обсуждению, не превращая балл в судьбу.",
    );
    rows = [
      [
        w("Set up your school", "Maktabni sozlang", "Подключите школу"),
        w(
          "First contact us to agree the trial size, language, reports and price. Then register your school and give students a join code to connect their accounts.",
          "Avval o‘quvchilar soni, til, hisobotlar va narxni biz bilan kelishing. Keyin maktabni ro‘yxatdan o‘tkazing va hisoblarni ulash uchun kod bering.",
          "Сначала согласуйте число учеников, язык, отчёты и цену. Затем зарегистрируйте школу и дайте ученикам код для подключения аккаунтов.",
        ),
      ],
      [
        w("Discuss the patterns", "Natijalarni muhokama qiling", "Обсудите закономерности"),
        w(
          "Use dashboards and reports to plan conversations about interests and possible work. Do not use this exploratory profile as a selection or exclusion test.",
          "Qiziqishlar va ish haqida suhbat uchun panel va hisobotdan foydalaning. Izlanish profilini saralash yoki chiqarib tashlash testi sifatida ishlatmang.",
          "Используйте отчёты для разговоров об интересах и работе. Профиль не предназначен для отбора или исключения.",
        ),
      ],
      [
        w("Follow with experience", "Tajriba bilan davom eting", "Продолжите опытом"),
        w(
          "Pair the profile with a project, a conversation with a professional, or a visit. Document outcomes from those activities rather than inventing a progress number.",
          "Profilni loyiha, mutaxassis bilan suhbat yoki tashrif bilan to‘ldiring. O‘sish sonini o‘ylab topish o‘rniga faoliyat natijalarini yozing.",
          "Дополните профиль проектом, разговором или визитом. Фиксируйте результаты деятельности вместо выдуманных показателей.",
        ),
      ],
    ];
  }
  if (kind === "methodology") {
    eyebrow = w("METHOD / LIMITS", "USUL / CHEGARALAR", "МЕТОД / ОГРАНИЧЕНИЯ");
    title = w(
      "What we ask. What we infer.",
      "Nimani so‘raymiz. Nimani aniqlaymiz.",
      "Что спрашиваем. Что предполагаем.",
    );
    intro = w(
      "An exploratory profile combines three question sets. It is not a clinical diagnosis, certified IQ score or validated prediction of career success.",
      "Izlanish profili uch savol guruhini birlashtiradi. Bu klinik tashxis, tasdiqlangan IQ yoki kasbiy muvaffaqiyatning tekshirilgan bashorati emas.",
      "Профиль объединяет три набора вопросов. Это не диагноз, подтверждённый IQ или валидированный прогноз карьеры.",
    );
    rows = [
      [
        w("12 personality questions", "12 shaxsiyat savoli", "12 вопросов о личности"),
        w(
          "Five-point responses describe preferences and produce a type and work-style summary. Twelve answers cannot capture the full complexity of a person; preferences can change with context.",
          "Besh pog‘onali javoblar afzalliklarni tasvirlab, tur va ish uslubi xulosasini beradi. O‘n ikki javob insonni to‘liq tasvirlamaydi; vaziyat ta’sir qiladi.",
          "Ответы по пятибалльной шкале описывают предпочтения и стиль работы. Двенадцать ответов не описывают человека полностью; контекст важен.",
        ),
      ],
      [
        w("9 reasoning questions", "9 mantiqiy savol", "9 вопросов на мышление"),
        w(
          "Correct answers contribute to a 0–10 aptitude scale used by the recommendation engine. Language, prior practice and familiarity affect performance. We do not convert it into IQ.",
          "To‘g‘ri javoblar tavsiya tizimidagi 0–10 qobiliyat shkalasiga hissa qo‘shadi. Til, mashq va tanishlik ta’sir qiladi. IQga aylantirmaymiz.",
          "Правильные ответы формируют шкалу способностей 0–10. Влияют язык, практика и знакомство с задачами. В IQ она не переводится.",
        ),
      ],
      [
        w("9 visual interest choices", "9 vizual qiziqish tanlovi", "9 выборов интересов"),
        w(
          "Your visual choices describe preferences across six interest themes: practical, investigative, creative, social, enterprising and organized work. They do not prove skill or future ability.",
          "Vizual tanlovlar amaliy, tadqiqot, ijodiy, ijtimoiy, tashabbuskor va tartibli ish afzalliklarini tasvirlaydi. Ko‘nikma yoki kelajak qobiliyatini isbotlamaydi.",
          "Визуальные выборы описывают интерес к практической, исследовательской, творческой, социальной, предпринимательской и организованной работе. Это не доказательство навыков или будущих способностей.",
        ),
      ],
      [
        w("Career suggestions", "Kasb tavsiyalari", "Предложения профессий"),
        w(
          "A rule-based engine combines the signals with career and major records. Match scores are internal similarity measures, not probabilities. Independent predictive validation is not claimed.",
          "Qoidali tizim belgilarni kasb va yo‘nalish ma’lumotlari bilan bog‘laydi. Moslik ballari ichki o‘xshashlik, ehtimol emas. Mustaqil bashorat tekshiruvi da’vo qilinmaydi.",
          "Правиловый алгоритм связывает сигналы с профессиями. Баллы — внутренняя мера сходства, не вероятность. Независимая прогнозная валидация не заявляется.",
        ),
      ],
    ];
  }
  if (kind === "mentors" || kind === "success-stories") {
    title =
      kind === "mentors"
        ? w(
            "Real people. When they are ready.",
            "Haqiqiy insonlar. Tayyor bo‘lganda.",
            "Реальные люди. Когда готовы.",
          )
        : w(
            "Evidence takes actual work.",
            "Dalil haqiqiy ishni talab qiladi.",
            "Доказательства требуют работы.",
          );
    intro = w(
      "We have no published, consented profiles or outcome studies to show here yet. We will publish names, dates and the limits of each account when those records are ready.",
      "Hozircha ruxsat olingan profil yoki natija tadqiqoti e’lon qilinmagan. Ma’lumotlar tayyor bo‘lganda ism, sana va chegaralar beriladi.",
      "Пока нет опубликованных профилей или исследований результатов с согласием участников. Готовые записи будут содержать имена, даты и ограничения.",
    );
    rows = [
      [
        w(
          "What a future case study will include",
          "Kelajak tadqiqoti tarkibi",
          "Содержание будущего кейса",
        ),
        w(
          "The question the student faced, the activity they tried, their own reflection, the dates and permission to share. We will not substitute a stock portrait or invented testimonial.",
          "O‘quvchining savoli, sinagan faoliyati, o‘z xulosasi, sana va ulashish ruxsati. Soxta surat yoki fikr bilan almashtirmaymiz.",
          "Вопрос ученика, опыт, его выводы, даты и согласие. Без стоковых портретов и придуманных отзывов.",
        ),
      ],
    ];
  }
  return (
    <PageShell>
      <div className={`field-wrap editorial-${kind}`}>
        <header className="field-intro editorial-hero">
          <div>
            <p className="micro">{eyebrow}</p>
            <h1 data-reveal>
              {kind === "methodology" ? (
                <>
                  {title.split(". ")[0]}.<br />
                  <MarkedText text={title.split(". ").slice(1).join(". ")} />
                </>
              ) : (
                <MarkedText
                  text={title}
                  mark={
                    kind === "about" ? "circle" : kind === "for-schools" ? "highlight" : "scribble"
                  }
                />
              )}
            </h1>
            <p>{intro}</p>
          </div>
          {(kind === "methodology" || kind === "about" || kind === "for-schools") && (
            <div className="editorial-illustration" aria-hidden="true">
              <CartoonIllustration kind={kind} />
            </div>
          )}
        </header>
        <section className="editorial-list" aria-label={title}>
          {rows.map(([name, body], i) => {
            const number = kind === "methodology" ? name.match(/^(\d+) /)?.[1] : null;
            return (
              <article key={name}>
                <div className="editorial-row-title">
                  <span className="section-number">0{i + 1}</span>
                  {kind !== "about" && (
                    <span className="cartoon-icon-tile" aria-hidden="true">
                      {(kind === "methodology" || kind === "for-schools") && i < 3 ? (
                        <CartoonRowIcon kind={kind} index={i} />
                      ) : (
                        <Sparkles />
                      )}
                    </span>
                  )}
                  <h2>
                    {number ? (
                      <>
                        <span className="editorial-title-number">{number}</span>
                        {name.slice(number.length)}
                      </>
                    ) : (
                      name
                    )}
                  </h2>
                </div>
                <p>{body}</p>
                {kind === "for-schools" && i < rows.length - 1 && <CartoonConnector />}
              </article>
            );
          })}
        </section>
        {kind === "methodology" && (
          <section className="method-walkthrough field-section">
            <h2>
              {w("Your journey, step by step", "Qadam-baqadam yo‘lingiz", "Ваш путь по шагам")}
            </h2>
            <ol>
              <li>
                <strong>
                  {w(
                    "1. Answer 30 questions",
                    "1. 30 savolga javob bering",
                    "1. Ответьте на 30 вопросов",
                  )}
                </strong>
                <p>
                  {w(
                    "Start as a guest. There is no timer; pause and resume in the same browser. Reasoning questions have correct answers; preference questions do not.",
                    "Mehmon sifatida boshlang. Taymer yo‘q; shu brauzerda to‘xtab qayting. Mantiq savollarida to‘g‘ri javob bor, afzallik savollarida yo‘q.",
                    "Начните без аккаунта. Таймера нет; можно вернуться в этом браузере. В задачах есть верные ответы, в предпочтениях — нет.",
                  )}
                </p>
              </li>
              <li>
                <strong>
                  {w(
                    "2. Create a free account for your results",
                    "2. Natija uchun bepul hisob yarating",
                    "2. Создайте бесплатный аккаунт для результатов",
                  )}
                </strong>
                <p>
                  {w(
                    "Your answers stay in this browser while you sign up or sign in. Submit the completed assessment to save results to your account. Career-fit scores compare answers, not chances of success.",
                    "Kirish yoki ro‘yxatdan o‘tishda javoblar shu brauzerda qoladi. Yakunlangan baholashni yuborib natijani hisobga saqlang. Moslik ballari javoblarni solishtiradi, muvaffaqiyat ehtimolini emas.",
                    "Ответы остаются в браузере при регистрации или входе. Отправьте оценку, чтобы сохранить результат. Баллы сравнивают ответы, а не шансы успеха.",
                  )}
                </p>
              </li>
              <li>
                <strong>
                  {w(
                    "3. Explore, then try the work",
                    "3. O‘rganing, so‘ng ishni sinang",
                    "3. Исследуйте и попробуйте работу",
                  )}
                </strong>
                <p>
                  {w(
                    "Read the reasons behind career suggestions, research study subjects and choose an activity. Mark completion yourself. Practice tools on the homepage are separate and do not transfer into the assessment.",
                    "Kasb tavsiyasi sabablarini o‘qing, o‘qish yo‘nalishini o‘rganing va faoliyat tanlang. Bajarilishni o‘zingiz belgilang. Bosh sahifa mashqlari alohida, baholashga o‘tmaydi.",
                    "Прочитайте причины рекомендаций, изучите направления обучения и выберите занятие. Выполнение отмечаете сами. Практика на главной странице не переносится в оценку.",
                  )}
                </p>
              </li>
            </ol>
          </section>
        )}
        {kind === "for-schools" && <SchoolReportPreview />}
        {kind === "about" && (
          <section className="field-section">
            <p className="micro mb-8">{w("THE FOUNDERS", "ASOSCHILAR", "ОСНОВАТЕЛИ")}</p>
            <blockquote className="founders-motto">
              {w(
                "The future should be a little bit bright.",
                "Kelajak biroz yorqinroq bo‘lishi kerak.",
                "Будущее должно быть немного светлее.",
              )}
            </blockquote>
            <div className="person-register">
              {FOUNDERS.map((founder) => (
                <article key={founder.id}>
                  <FounderPortrait founder={founder} />
                  <div>
                    <h2>{founder.name}</h2>
                    <p className="micro text-muted-foreground">
                      {w("Co-founder", "Hamasoschi", "Сооснователь")}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
        <section className="field-cta">
          <CartoonSparkle />
          <h2>
            {kind === "for-schools"
              ? w("Plan a school trial.", "Maktab sinovini rejalang.", "Запланируйте пилот.")
              : w("Put the questions to work.", "Savollarni amalda sinang.", "Попробуйте вопросы.")}
          </h2>
          <div>
            <Link
              to={kind === "for-schools" || kind === "pricing" ? "/contact" : "/career-assessment"}
              className="field-button"
            >
              {kind === "for-schools" || kind === "pricing"
                ? w("Talk to our team", "Jamoamizga yozing", "Написать команде")
                : w("Begin the assessment", "Baholashni boshlang", "Начать оценку")}
              <ArrowUpRight size={18} />
            </Link>
            {kind === "for-schools" && (
              <Link to="/school/register" className="text-link mt-6 text-sm">
                {w(
                  "Trial already agreed? Register your school",
                  "Sinov kelishildimi? Ro‘yxatdan o‘ting",
                  "Пилот согласован? Регистрация",
                )}
              </Link>
            )}
          </div>
        </section>
      </div>
    </PageShell>
  );
}
