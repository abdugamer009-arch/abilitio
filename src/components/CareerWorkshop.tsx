import { AssessmentAgeNote } from "./AssessmentAgeNote";
import { WORKSHOP_TASK_TEXT, taskEstimate } from "@/lib/roadmap/workshop-translations";
import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Check, RotateCcw } from "lucide-react";
import { useWords } from "@/lib/editorial";
import { useI18n } from "@/lib/i18n";
import {
  SAMPLE_QUESTIONS,
  SAMPLE_DIFFICULTY,
  sampleRecord,
} from "@/lib/assessment/sample-questions";
import { buildRoadmap, type RoadmapTrack } from "@/lib/roadmap/roadmap-world";
import { ActivityGuide } from "./ActivityGuide";
import { PictureFigure } from "./assessment/PictureFigure";
import "@/styles/picture-assessment.css";
import { StageBadge } from "./StageBadge";
import { CartoonLoop, MarkedText } from "./CartoonArtwork";
import { useMotion } from "./MotionProvider";
import { MOTION } from "@/lib/motion";

const STORAGE_KEY = "abilitio.workshop.v2";
export function CareerWorkshop({
  stage: requestedStage,
  onStage,
}: {
  stage: number;
  onStage: (stage: number) => void;
}) {
  const w = useWords();
  const { lang } = useI18n();
  const { enabled } = useMotion();
  const [stage, setVisibleStage] = useState(requestedStage);
  const [question, setQuestion] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [solution, setSolution] = useState(false);
  const [step, setStep] = useState(0);
  const [track, setTrack] = useState<RoadmapTrack | "">("");
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [preference, setPreference] = useState("");
  const [practiceOpen, setPracticeOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    try {
      const current = localStorage.getItem(STORAGE_KEY);
      const saved = JSON.parse(current || localStorage.getItem("abilitio.workshop.v1") || "null");
      if (saved && typeof saved === "object") {
        if (saved.answers && !Array.isArray(saved.answers))
          setAnswers(
            Object.fromEntries(
              SAMPLE_QUESTIONS.filter(
                (q) =>
                  Number.isInteger(saved.answers[q.id]) &&
                  saved.answers[q.id] >= 0 &&
                  saved.answers[q.id] < q.options.length,
              ).map((q) => [q.id, saved.answers[q.id]]),
            ),
          );
        if (current && ["tech", "creative", "science"].includes(saved.track)) setTrack(saved.track);
        if (current && ["solo", "team"].includes(saved.preference)) setPreference(saved.preference);
        if (saved.done && typeof saved.done === "object" && !Array.isArray(saved.done))
          setDone(
            Object.fromEntries(
              Object.entries(saved.done)
                .filter(([, v]) => typeof v === "boolean")
                .map(([id, v]) => [id, Boolean(v)]),
            ),
          );
      }
    } catch {
      /* Invalid local preview is discarded. */
    }
    setHydrated(true);
  }, []);
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ answers, track, preference, done }));
    } catch {
      /* Preview still works without storage. */
    }
  }, [answers, track, preference, done, hydrated]);
  // Withdraw the previous content before revealing the next exploration stage.
  useEffect(() => {
    if (requestedStage === stage) return;
    if (!enabled) {
      setVisibleStage(requestedStage);
      return;
    }
    let cancelled = false;
    let revert = () => {};
    import("gsap").then(({ gsap }) => {
      if (cancelled) return;
      const current = panel.current?.querySelector(".bench-content");
      if (!current) {
        setVisibleStage(requestedStage);
        return;
      }
      const ctx = gsap.context(() => {
        gsap
          .timeline()
          .addLabel("withdraw")
          .to(
            current,
            { clipPath: "inset(0 0 100% 0)", duration: MOTION.quick, ease: "studioFlow" },
            "withdraw",
          )
          .call(
            () => {
              if (!cancelled) setVisibleStage(requestedStage);
            },
            undefined,
            "withdraw+=0.18",
          );
      });
      revert = () => ctx.revert();
    });
    return () => {
      cancelled = true;
      revert();
    };
  }, [requestedStage, stage, enabled]);
  useEffect(() => {
    if (!enabled || !panel.current) return;
    let disposed = false;
    let cleanup = () => {};
    import("gsap").then(({ gsap }) => {
      if (disposed) return;
      const context = gsap.context(() => {
        gsap
          .timeline()
          .addLabel("plane")
          .fromTo(
            panel.current,
            { clipPath: "inset(0 0 100% 0)" },
            { clipPath: "inset(0 0 0% 0)", duration: MOTION.panel, ease: "studioFlow" },
            "plane",
          )
          .addLabel("details", "plane+=0.18")
          .fromTo(
            panel.current?.querySelectorAll("[data-detail]") || [],
            { x: 12 },
            { x: 0, duration: MOTION.control, stagger: MOTION.stagger, ease: "studioExpo" },
            "details",
          );
      }, panel);
      cleanup = () => context.revert();
    });
    return () => {
      disposed = true;
      cleanup();
    };
  }, [stage, question, track, enabled]);
  const q = SAMPLE_QUESTIONS[question];
  const record = sampleRecord(answers);
  const tasks = (track ? buildRoadmap(track)[0].tasks : []).map((task, i) => {
    const text = lang === "en" ? null : WORKSHOP_TASK_TEXT[track]?.[lang]?.[i];
    return {
      ...task,
      id: task.id,
      title: text?.[0] || task.title,
      description: text?.[1] || task.description,
      estimate: taskEstimate(task.estimate, lang),
    };
  });
  const completed = tasks.filter((t) => done[t.id]).length;
  const titles = [
    w("Notice your signal", "O‘z belgingizni toping", "Найдите свой сигнал"),
    w("Give it a direction", "Yo‘nalish tanlang", "Задайте направление"),
    w("Try the work", "Ishni sinab ko‘ring", "Попробуйте работу"),
  ];
  const stageNames = [
    w("Try questions", "Savollarni sinang", "Попробуйте вопросы"),
    w("Choose a direction", "Yo‘nalish tanlang", "Выберите направление"),
    w("Try an activity", "Faoliyatni sinang", "Попробуйте занятие"),
  ];
  const stageNotes = [
    w(
      "I am exploring what interests me.",
      "Qiziqishlarimni o‘rganyapman.",
      "Я изучаю свои интересы.",
    ),
    w(
      "Choose what you would like to explore.",
      "O‘rganmoqchi bo‘lgan yo‘nalishingizni tanlang.",
      "Выберите, что хотите исследовать.",
    ),
    w(
      "I am ready to test a direction.",
      "Yo‘nalishni amalda sinashga tayyorman.",
      "Я готов проверить направление.",
    ),
  ];
  const prompt = q.picture.prompt[lang];
  return (
    <section id="workshop" className="studio-workshop field-wrap" data-story>
      <div className="section-heading">
        <p className="micro" data-rule>
          {w("01 / YOUR STARTING POINT", "01 / BOSHLANG‘ICH NUQTA", "01 / ВАША ТОЧКА СТАРТА")}
        </p>
        <h2>
          <MarkedText
            mark="circle"
            text={w("Where are you right now?", "Hozir qaysi bosqichdasiz?", "На каком вы этапе?")}
          />
        </h2>
        <p>
          {w(
            "Open any section. These are practice tools, not levels you must unlock.",
            "Istalgan bo‘limni oching. Bular mashq vositalari, ochiladigan darajalar emas.",
            "Откройте любой раздел. Это практика, а не уровни для разблокировки.",
          )}
          <CartoonLoop />
        </p>
      </div>
      <div
        className="stage-picker"
        role="group"
        aria-label={w(
          "Choose your exploration stage",
          "Izlanish bosqichini tanlang",
          "Выберите этап исследования",
        )}
      >
        {stageNames.map((name, i) => (
          <button
            key={i}
            className={`stage-choice stage-${i} ${stage === i ? "is-active" : ""}`}
            aria-label={name}
            aria-pressed={stage === i}
            onClick={() => {
              onStage(i);
              setSolution(false);
            }}
            data-cursor="choose"
          >
            <StageBadge stage={i} />
            <span>
              <span className="micro">0{i + 1}</span>
              <strong>
                <span className="stage-name-full">{name}</span>
                <span className="stage-name-compact">
                  {
                    [
                      w("Practice", "Mashq", "Проба"),
                      w("Choose", "Tanlov", "Выбор"),
                      w("Activity", "Vazifa", "Опыт"),
                    ][i]
                  }
                </span>
              </strong>
              <span className="stage-brand">
                {
                  [
                    w("Signal", "Signal", "Сигнал"),
                    w("Vector", "Vektor", "Вектор"),
                    w("Trajectory", "Trayektoriya", "Траектория"),
                  ][i]
                }
              </span>
              <small>{stageNotes[i]}</small>
            </span>
            <ArrowRight size={18} />
          </button>
        ))}
      </div>
      <p className="stage-context" role="status">
        {stageNotes[stage]}
      </p>
      <div className="workbench" ref={panel}>
        <div className="bench-toolbar">
          <span className="micro">ABILITIO / {stageNames[stage]}</span>
          <span className="status-dot">
            {w(
              "Practice · saved in this browser",
              "Mashq · shu brauzerda saqlanadi",
              "Практика · сохранено в браузере",
            )}
          </span>
        </div>
        <div className="bench-body">
          <button
            className="bench-index-toggle field-button"
            aria-expanded={practiceOpen}
            aria-controls="practice-index"
            onClick={() => setPracticeOpen((v) => !v)}
          >
            {w("Practice overview", "Mashq ko‘rinishi", "Обзор практики")}
          </button>
          <aside
            id="practice-index"
            className={`bench-index ${practiceOpen ? "is-expanded" : ""}`}
            data-detail
          >
            <h3>{w("Practice questions", "Mashq savollari", "Вопросы для практики")}</h3>
            <p>
              {w(
                "Four separate practice puzzles. These do not affect your assessment result.",
                "To‘rtta alohida mashq. Ular baholash natijangizga ta’sir qilmaydi.",
                "Четыре отдельных тренировочных задания. Они не влияют на результат тестирования.",
              )}
            </p>
            <div className="item-grid">
              {SAMPLE_QUESTIONS.map((sample, i) => (
                <button
                  key={sample.id}
                  className={`item-tile difficulty-${SAMPLE_DIFFICULTY[i]} ${answers[sample.id] !== undefined ? "is-answered" : ""}`}
                  aria-pressed={question === i}
                  onClick={() => {
                    setQuestion(i);
                    setSelected(answers[sample.id] ?? null);
                    setSolution(false);
                    setStep(0);
                    onStage(0);
                  }}
                  data-cursor="open"
                >
                  <span>
                    {w("Question", "Savol", "Вопрос")} {i + 1}
                  </span>
                  <span>
                    {answers[sample.id] !== undefined ? (
                      <span className="item-status">
                        {answers[sample.id] === sample.correct
                          ? w("Correct", "To‘g‘ri", "Верно")
                          : w("Try again", "Qayta sinang", "Ещё раз")}
                      </span>
                    ) : (
                      <ArrowRight size={14} />
                    )}
                  </span>
                  <small>
                    {
                      [
                        w("Odd one out", "Farqlisini topish", "Найдите лишнее"),
                        w("Picture series", "Rasmlar qatori", "Ряд картинок"),
                        w("Shape grid", "Shakllar katagi", "Сетка фигур"),
                        w("Turned shape", "Burilgan shakl", "Поворот фигуры"),
                      ][i]
                    }
                  </small>
                  <span className="sr-only">
                    {" "}
                    — {w("Sample", "Namuna", "Пример")} {i + 1}:{" "}
                    {
                      [
                        w("Odd one out", "Farqlisini topish", "Найдите лишнее"),
                        w("Picture series", "Rasmlar qatori", "Ряд картинок"),
                        w("Shape grid", "Shakllar katagi", "Сетка фигур"),
                        w("Turned shape", "Burilgan shakl", "Поворот фигуры"),
                      ][i]
                    }
                  </span>
                </button>
              ))}
            </div>
            <div className="difficulty-key">
              <span>
                <i className="difficulty-introductory" />
                {w("Easy", "Oson", "Легко")}
              </span>
              <span>
                <i className="difficulty-focused" />
                {w("Medium", "O‘rtacha", "Средне")}
              </span>
              <span>
                <i className="difficulty-extended" />
                {w("More challenging", "Qiyinroq", "Сложнее")}
              </span>
            </div>
            <small>
              {w(
                "Difficulty describes the question, not your ability.",
                "Qiyinlik savolga tegishli, qobiliyatingizga emas.",
                "Сложность относится к вопросу, не к вашим способностям.",
              )}
            </small>
            <div className="bench-count">
              <strong>
                {record.attempted}
                <span>/ {record.total}</span>
              </strong>
              <p>{w("samples answered", "namuna javoblangan", "примеров отвечено")}</p>
              <div className="actual-progress">
                <span style={{ width: `${(record.attempted / record.total) * 100}%` }} />
              </div>
            </div>
          </aside>
          <div className="bench-content" key={stage}>
            <div className="bench-title" data-detail>
              <span className={`stage-dot stage-${stage}`} />
              <h3>{titles[stage]}</h3>
              <span className="micro">0{stage + 1}</span>
            </div>
            {stage === 0 ? (
              <div className="question-desk" data-detail>
                <div className="question-label">
                  <span className="micro">
                    {w("Question", "Savol", "Вопрос")} {question + 1} / 4
                  </span>
                  <span className="free-label">
                    {w("Free sample", "Bepul namuna", "Бесплатный пример")}
                  </span>
                </div>
                <div className="picture-practice">
                  <p className="question-prompt" id="practice-question">
                    {prompt}
                  </p>
                  <div className="picture-figure">
                    <PictureFigure figure={q.picture.figure} lang={lang} />
                  </div>
                  <fieldset className="picture-answers" aria-labelledby="practice-question">
                    <legend className="sr-only">
                      {w("Choose one answer", "Bitta javob tanlang", "Выберите один ответ")}
                    </legend>
                    {q.picture.options.map((o, i) => (
                      <label key={o.id}>
                        <input
                          className="sr-only"
                          type="radio"
                          name={q.id}
                          checked={selected === i}
                          onChange={() => setSelected(i)}
                        />
                        <span className="picture-answer">
                          <span className="picture-answer-letter">{"ABCD"[i]}</span>
                          <PictureFigure figure={o.figure} lang={lang} />
                        </span>
                      </label>
                    ))}
                  </fieldset>
                </div>
                <div className="question-actions">
                  <button
                    className="field-button"
                    disabled={selected === null}
                    onClick={() => {
                      if (selected !== null) {
                        setAnswers((a) => ({ ...a, [q.id]: selected }));
                        setSolution(true);
                        setStep(0);
                      }
                    }}
                    data-cursor="explain"
                  >
                    {w("Check & explain", "Tekshirish va izoh", "Проверить и объяснить")}
                    <ArrowRight size={16} />
                  </button>
                  <button
                    className="text-link"
                    onClick={() => {
                      setSolution(!solution);
                      setStep(0);
                    }}
                  >
                    {solution
                      ? w("Close solution", "Izohni yopish", "Закрыть решение")
                      : w("See the approach", "Yondashuvni ko‘rish", "Посмотреть подход")}
                  </button>
                </div>
                {answers[q.id] !== undefined && (
                  <p className="answer-status" role="status">
                    {answers[q.id] === q.correct
                      ? w(
                          "Correct. Here is why.",
                          "To‘g‘ri. Sababini ko‘ring.",
                          "Верно. Вот почему.",
                        )
                      : w(
                          "Try again. The explanation shows the rule.",
                          "Qayta sinang. Izohda qoida ko‘rsatilgan.",
                          "Попробуйте ещё раз. Объяснение показывает правило.",
                        )}
                  </p>
                )}
                {solution && <Explanation question={question} step={step} onStep={setStep} />}
              </div>
            ) : stage === 1 ? (
              <div className="report-desk" data-detail>
                <div className="report-score">
                  <span className="micro">
                    {w("YOUR PRACTICE RECORD", "MASHQ NATIJANGIZ", "ВАШ РЕЗУЛЬТАТ ПРАКТИКИ")}
                  </span>
                  <strong>
                    {record.correct}
                    <span>/ {record.attempted}</span>
                  </strong>
                  <p>
                    {record.attempted
                      ? w(
                          "correct in your latest sample answers",
                          "oxirgi namuna javoblaringiz to‘g‘ri",
                          "верных последних ответов",
                        )
                      : w(
                          "Answer a sample to start a record.",
                          "Natija uchun namunaga javob bering.",
                          "Ответьте на пример, чтобы начать.",
                        )}
                  </p>
                </div>
                <div className="report-controls">
                  <label>
                    {w(
                      "How would you start a project?",
                      "Loyihani qanday boshlaysiz?",
                      "Как вы начнёте проект?",
                    )}
                    <select value={preference} onChange={(e) => setPreference(e.target.value)}>
                      <option value="">
                        {w(
                          "Choose your preference",
                          "Afzalligingizni tanlang",
                          "Выберите предпочтение",
                        )}
                      </option>
                      <option value="solo">
                        {w(
                          "Focused work alone",
                          "Mustaqil diqqatli ish",
                          "Сосредоточенная работа одному",
                        )}
                      </option>
                      <option value="team">
                        {w(
                          "Discuss it with a team",
                          "Jamoa bilan muhokama",
                          "Обсуждение с командой",
                        )}
                      </option>
                    </select>
                  </label>
                  <label>
                    {w("A direction to test", "Sinash uchun yo‘nalish", "Направление для проверки")}
                    <select
                      value={track}
                      onChange={(e) => setTrack(e.target.value as RoadmapTrack | "")}
                    >
                      <option value="">
                        {w("Choose a direction", "Yo‘nalish tanlang", "Выберите направление")}
                      </option>
                      <option value="tech">{w("Technology", "Texnologiya", "Технологии")}</option>
                      <option value="creative">{w("Design", "Dizayn", "Дизайн")}</option>
                      <option value="science">{w("Science", "Fan", "Наука")}</option>
                    </select>
                  </label>
                </div>
                <div className="signal-report">
                  <div>
                    <span className="signal-number">01</span>
                    <strong>{w("Reasoning", "Mantiq", "Рассуждение")}</strong>
                    <span>
                      {record.correct} / {record.attempted} {w("correct", "to‘g‘ri", "верно")}
                    </span>
                  </div>
                  <div>
                    <span className="signal-number">02</span>
                    <strong>{w("Work preference", "Ish uslubi", "Стиль работы")}</strong>
                    <span>
                      {!preference
                        ? w("Not chosen", "Tanlanmagan", "Не выбрано")
                        : preference === "solo"
                          ? w(
                              "Focused / self-selected",
                              "Mustaqil / o‘zingiz tanlagan",
                              "Фокус / выбран вами",
                            )
                          : w(
                              "Collaborative / self-selected",
                              "Jamoaviy / o‘zingiz tanlagan",
                              "Команда / выбрано вами",
                            )}
                    </span>
                  </div>
                  <div>
                    <span className="signal-number">03</span>
                    <strong>
                      {w(
                        "Your chosen direction",
                        "Tanlagan yo‘nalishingiz",
                        "Ваш выбор направления",
                      )}
                    </strong>
                    <span>
                      {!track
                        ? w("Not chosen", "Tanlanmagan", "Не выбрано")
                        : track === "tech"
                          ? w("Technology", "Texnologiya", "Технологии")
                          : track === "creative"
                            ? w("Design", "Dizayn", "Дизайн")
                            : w("Science", "Fan", "Наука")}
                    </span>
                  </div>
                </div>
                <p className="bench-disclaimer">
                  {w(
                    "These are your choices, not calculated recommendations. Practice answers and activities stay in this browser; they do not transfer to the full assessment.",
                    "Bular tanlovlaringiz, hisoblangan tavsiyalar emas. Mashq javoblari va faoliyat shu brauzerda qoladi; to‘liq baholashga o‘tmaydi.",
                    "Это ваши выборы, не расчётные рекомендации. Практика остаётся в браузере и не переносится в полную оценку.",
                  )}
                </p>
                <button className="field-button" disabled={!track} onClick={() => onStage(2)}>
                  {w("Choose a first task", "Birinchi vazifani tanlang", "Выберите первое задание")}
                  <ArrowRight size={16} />
                </button>
              </div>
            ) : (
              <div className="path-desk" data-detail>
                {!track ? (
                  <div className="practice-empty">
                    <h4>
                      {w(
                        "Choose a direction first",
                        "Avval yo‘nalish tanlang",
                        "Сначала выберите направление",
                      )}
                    </h4>
                    <p>
                      {w(
                        "We have not chosen a career for you. Select Technology, Design or Science to see activities you can try.",
                        "Biz siz uchun kasb tanlamadik. Faoliyatlarni ko‘rish uchun Texnologiya, Dizayn yoki Fanni tanlang.",
                        "Мы не выбрали вам профессию. Выберите технологии, дизайн или науку, чтобы увидеть занятия.",
                      )}
                    </p>
                    <button className="field-button" onClick={() => onStage(1)}>
                      {w("Choose a direction", "Yo‘nalish tanlang", "Выберите направление")}
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="path-summary">
                      <p className="micro">
                        {w(
                          "FOUNDATIONS / FIRST EXPERIMENT",
                          "ASOSLAR / BIRINCHI SINOV",
                          "ОСНОВЫ / ПЕРВЫЙ ЭКСПЕРИМЕНТ",
                        )}
                      </p>
                      <h4>
                        {track === "tech"
                          ? w(
                              "Build something small.",
                              "Kichik narsa yarating.",
                              "Создайте что-то небольшое.",
                            )
                          : track === "creative"
                            ? w(
                                "Make your first design.",
                                "Birinchi dizayningizni yarating.",
                                "Создайте первый дизайн.",
                              )
                            : w(
                                "Try an investigation.",
                                "Tadqiqotni sinab ko‘ring.",
                                "Проведите исследование.",
                              )}
                      </h4>
                      <span>
                        {completed} / {tasks.length}{" "}
                        {w(
                          "tasks marked complete",
                          "vazifa bajarilgan deb belgilangan",
                          "заданий отмечено выполненными",
                        )}
                      </span>
                      <div className="actual-progress">
                        <span style={{ width: `${(completed / tasks.length) * 100}%` }} />
                      </div>
                    </div>
                    <ol className="path-list">
                      {tasks.map((task, i) => (
                        <li key={task.id}>
                          <span className="task-number" aria-hidden>
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <div>
                            <h5>{task.title}</h5>
                            <p>{task.description}</p>
                            <ActivityGuide task={task} />
                            <button
                              className="task-complete-button"
                              aria-pressed={Boolean(done[task.id])}
                              aria-label={`${done[task.id] ? w("Completed · undo", "Bajarildi · qaytarish", "Выполнено · отменить") : w("Mark complete", "Bajarildi deb belgilash", "Отметить выполнение")}: ${task.title}`}
                              onClick={() => setDone((d) => ({ ...d, [task.id]: !d[task.id] }))}
                            >
                              {done[task.id] && <Check size={14} aria-hidden />}
                              {done[task.id]
                                ? w(
                                    "Completed · undo",
                                    "Bajarildi · qaytarish",
                                    "Выполнено · отменить",
                                  )
                                : w(
                                    "Mark complete",
                                    "Bajarildi deb belgilash",
                                    "Отметить выполнение",
                                  )}
                            </button>
                          </div>
                          <small>
                            {task.estimate}
                            <span>{w("estimate", "taxmin", "оценка")}</span>
                          </small>
                        </li>
                      ))}
                    </ol>
                    <p className="bench-disclaimer">
                      {w(
                        "Real tasks from the product roadmap. Estimates are planning guidance; completion is self-reported and saved on this device. ",
                        "Mahsulot yo‘l xaritasidagi vazifalar. Vaqt taxminiy; bajarilish shu qurilmada saqlanadi.",
                        "Задания из дорожной карты. Время приблизительное; отметки сохраняются на устройстве.",
                      )}
                    </p>
                    <Link to="/career-assessment" className="text-link">
                      {w(
                        "Build a complete profile",
                        "To‘liq profil yarating",
                        "Создайте полный профиль",
                      )}
                      <ArrowRight size={16} />
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="bench-bottom">
          <span>
            {w(
              "Free student access. No card.",
              "O‘quvchilar uchun bepul. Kartasiz.",
              "Бесплатно ученикам. Без карты.",
            )}
          </span>
          <button
            className="text-link"
            onClick={() => {
              setAnswers({});
              setDone({});
              setQuestion(0);
              setTrack("");
              setPreference("");
              setStep(0);
              onStage(0);
              setSelected(null);
              setSolution(false);
            }}
          >
            <RotateCcw size={13} />
            {w(
              "Clear practice answers and tasks",
              "Mashq javoblari va vazifalarni tozalash",
              "Очистить ответы и задания",
            )}
          </button>
        </div>
      </div>
      <div
        className="assessment-composition"
        aria-label={w(
          "Complete assessment composition",
          "To‘liq baholash tarkibi",
          "Состав полной оценки",
        )}
      >
        <p>
          {w(
            "FULL PROFILE · AGES 15 AND OLDER",
            "TO‘LIQ PROFIL · 15 YOSH VA KATTALAR",
            "ПОЛНЫЙ ПРОФИЛЬ · С 15 ЛЕТ",
          )}
        </p>
        {[
          [12, w("work-preference questions", "ish uslubi savoli", "вопросов о стиле работы")],
          [9, w("reasoning questions", "mantiq savoli", "вопросов на рассуждение")],
          [9, w("interest questions", "qiziqish savoli", "вопросов об интересах")],
        ].map(([n, label], i) => (
          <CompositionStat key={String(label)} n={Number(n)} label={String(label)} plus={i > 0} />
        ))}
        <b className="composition-total" aria-hidden="true">
          = {12 + 9 + 9}
        </b>
      </div>
      <AssessmentAgeNote />
    </section>
  );
}
function Explanation({
  question,
}: {
  question: number;
  step: number;
  onStep: (step: number) => void;
}) {
  const { lang } = useI18n();
  const w = useWords();
  const q = SAMPLE_QUESTIONS[question];
  return (
    <div className="picture-practice">
      <div className="picture-rule">
        <p>
          {w("Answer", "Javob", "Ответ")}: {"ABCD"[q.correct]}
        </p>
        <p>{q.rule[lang]}</p>
      </div>
    </div>
  );
}

function CompositionStat({ n, label, plus }: { n: number; label: string; plus: boolean }) {
  return (
    <>
      {plus && (
        <b className="composition-plus" aria-hidden="true">
          +
        </b>
      )}
      <span>
        <strong data-count={n}>{n}</strong>
        {label}
      </span>
    </>
  );
}
