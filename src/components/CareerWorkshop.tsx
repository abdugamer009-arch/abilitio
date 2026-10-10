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
import { ChoiceOptions } from "./ChoiceOptions";
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
  const prompt =
    lang === "en"
      ? q.prompt
      : question === 0
        ? w("", "Qatorni davom ettiring: 1, 4, 9, 16, 25, ?", "Продолжите ряд: 1, 4, 9, 16, 25, ?")
        : question === 1
          ? w(
              "",
              "Keyingi sonni toping: 2, 6, 12, 20, 30, ?",
              "Найдите следующее число: 2, 6, 12, 20, 30, ?",
            )
          : question === 2
            ? w(
                "",
                "5 mashina 5 daqiqada 5 buyum yasaydi. 100 mashina 100 buyumni qancha vaqtda yasaydi?",
                "5 машин делают 5 изделий за 5 минут. За сколько минут 100 машин сделают 100 изделий?",
              )
            : w(
                "",
                "Qaysi biri farq qiladi: kvadrat, doira, uchburchak, kub?",
                "Что отличается: квадрат, круг, треугольник, куб?",
              );
  const options =
    question === 3
      ? [
          w("Square", "Kvadrat", "Квадрат"),
          w("Circle", "Doira", "Круг"),
          w("Triangle", "Uchburchak", "Треугольник"),
          w("Cube", "Kub", "Куб"),
        ]
      : question === 2
        ? q.options.map((option) => option.replace("min", w("min", "daq", "мин")))
        : q.options;
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
              <strong>{name}</strong>
              <span className="stage-brand">{["Signal", "Vector", "Trajectory"][i]}</span>
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
          <aside className="bench-index" data-detail>
            <h3>{w("Practice questions", "Mashq savollari", "Вопросы для практики")}</h3>
            <p>
              {w(
                "Four free practice questions. These answers do not count toward the full 30-question assessment.",
                "To‘rtta bepul mashq savoli. Javoblar 30 savollik to‘liq baholashga qo‘shilmaydi.",
                "Четыре бесплатных вопроса. Ответы не входят в полную оценку из 30 вопросов.",
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
                        w("Square numbers", "Kvadrat sonlar", "Квадраты чисел"),
                        w("Number pattern", "Sonlar qatori", "Числовой ряд"),
                        w("Parallel work", "Parallel ish", "Параллельная работа"),
                        w("Dimensions", "O‘lchamlar", "Измерения"),
                      ][i]
                    }
                  </small>
                  <span className="sr-only">
                    {" "}
                    — {w("Sample", "Namuna", "Пример")} {i + 1}:{" "}
                    {
                      [
                        w("Square numbers", "Kvadrat sonlar", "Квадраты чисел"),
                        w("Number pattern", "Sonlar qonuniyati", "Закономерность"),
                        w("Parallel work", "Parallel ish", "Параллельная работа"),
                        w("Dimensions", "O‘lchamlar", "Измерения"),
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
                <p className="question-prompt">
                  {question < 2 ? (
                    <>
                      {prompt.split(":")[0]}:
                      <span className="sr-only">{prompt.slice(prompt.indexOf(":") + 1)}</span>
                    </>
                  ) : (
                    prompt
                  )}
                </p>
                {question < 2 && (
                  <SequenceTiles
                    values={q.prompt
                      .slice(q.prompt.indexOf(":") + 1)
                      .split(",")
                      .map((value) => value.trim())}
                    answer={q.options[q.correct]}
                    explained={solution}
                  />
                )}
                <ChoiceOptions
                  options={options}
                  value={selected}
                  feedback={answers[q.id]}
                  correct={q.correct}
                  onChange={setSelected}
                  name={w("Sample answer", "Namuna javobi", "Ответ на пример")}
                />
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
                          "Try a different approach. The explanation shows every step.",
                          "Boshqa yondashuvni sinang. Izohda barcha qadamlar bor.",
                          "Попробуйте другой подход. Решение показывает все шаги.",
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
        <p>{w("THE FULL PROFILE", "TO‘LIQ PROFIL", "ПОЛНЫЙ ПРОФИЛЬ")}</p>
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
    </section>
  );
}
function Explanation({
  question,
  step,
  onStep,
}: {
  question: number;
  step: number;
  onStep: (step: number) => void;
}) {
  const w = useWords();
  const diagram = useRef<HTMLDivElement>(null);
  const { enabled } = useMotion();
  useEffect(() => {
    if (!enabled || !diagram.current) return;
    let cancelled = false;
    let revert = () => {};
    import("gsap").then(({ gsap }) => {
      if (cancelled) return;
      const ctx = gsap.context(() => {
        gsap
          .timeline()
          .addLabel("diagram")
          .fromTo(
            diagram.current,
            { clipPath: "inset(0 100% 0 0)" },
            { clipPath: "inset(0 0% 0 0)", duration: MOTION.panel, ease: "studioExpo" },
            "diagram",
          )
          .fromTo(
            diagram.current?.querySelectorAll("[data-diagram-mark]") || [],
            { scale: 0.9 },
            {
              scale: 1,
              transformOrigin: "50% 50%",
              duration: MOTION.control,
              stagger: MOTION.stagger,
              ease: "studioExpo",
            },
            "diagram+=0.16",
          );
      });
      revert = () => ctx.revert();
    });
    return () => {
      cancelled = true;
      revert();
    };
  }, [step, question, enabled]);
  const summaries = [
    w(
      "Treat each term as a square. Find the next base number.",
      "Har bir sonni kvadrat deb oling. Keyingi asosni toping.",
      "Представьте каждое число квадратом. Найдите следующее основание.",
    ),
    w(
      "Compare neighboring terms. Extend the change, then the series.",
      "Qo‘shni sonlarni solishtiring. Farqni, so‘ng qatorni davom ettiring.",
      "Сравните соседние числа. Продолжите разности, затем ряд.",
    ),
    w(
      "Separate production time from the number of machines.",
      "Ishlab chiqarish vaqtini mashinalar sonidan ajrating.",
      "Отделите время производства от числа машин.",
    ),
    w(
      "Compare dimensions, rather than outline or size.",
      "O‘lcham yoki tashqi chiziqdan ko‘ra fazoviy o‘lchovni solishtiring.",
      "Сравните размерность, а не контур или размер.",
    ),
  ];
  const steps =
    question === 1
      ? [
          w(
            "The differences are +4, +6, +8 and +10.",
            "Farqlar: +4, +6, +8 va +10.",
            "Разности: +4, +6, +8 и +10.",
          ),
          w(
            "Each difference grows by 2. The next is +12.",
            "Har bir farq 2 ga oshadi. Keyingisi +12.",
            "Каждая разность растёт на 2. Следующая: +12.",
          ),
          w(
            "Add 12 to 30. The missing term is 42.",
            "30 ga 12 qo‘shing. Yetishmagan son 42.",
            "Прибавьте 12 к 30. Пропущенное число: 42.",
          ),
        ]
      : question === 0
        ? [
            w(
              "The terms are 1², 2², 3², 4² and 5².",
              "Sonlar: 1², 2², 3², 4² va 5².",
              "Числа: 1², 2², 3², 4² и 5².",
            ),
            w(
              "The base increases by one. Use 6 next.",
              "Asos bittadan oshadi. Keyingisi 6.",
              "Основание растёт на 1. Следующее: 6.",
            ),
            w("6 × 6 = 36. The answer is 36.", "6 × 6 = 36. Javob 36.", "6 × 6 = 36. Ответ: 36."),
          ]
        : question === 2
          ? [
              w(
                "Each machine makes one widget in five minutes.",
                "Har bir mashina 5 daqiqada bitta buyum yasaydi.",
                "Каждая машина делает одно изделие за 5 минут.",
              ),
              w(
                "All 100 machines can work at the same time.",
                "100 mashina bir vaqtda ishlaydi.",
                "Все 100 машин работают одновременно.",
              ),
              w(
                "100 widgets are ready after the same five minutes.",
                "O‘sha 5 daqiqada 100 buyum tayyor bo‘ladi.",
                "Через те же 5 минут готовы 100 изделий.",
              ),
            ]
          : [
              w(
                "Square, circle and triangle are flat figures.",
                "Kvadrat, doira va uchburchak tekis shakllar.",
                "Квадрат, круг и треугольник плоские.",
              ),
              w(
                "A cube has depth as well as width and height.",
                "Kub eni va bo‘yidan tashqari chuqurlikka ega.",
                "У куба есть глубина, ширина и высота.",
              ),
              w(
                "The cube is the only three-dimensional object.",
                "Kub yagona uch o‘lchamli jism.",
                "Куб — единственный трёхмерный объект.",
              ),
            ];
  const colors = ["var(--level-vector)", "var(--level-signal)", "var(--level-trajectory)"];
  const display =
    question === 1
      ? step === 0
        ? ["2", "6", "12", "20", "30"]
        : step === 1
          ? ["+4", "+6", "+8", "+10", "+12"]
          : ["30", "+", "12", "=", "42"]
      : question === 0
        ? step === 0
          ? ["1²", "2²", "3²", "4²", "5²"]
          : step === 1
            ? ["1", "2", "3", "4", "5", "6"]
            : ["6", "×", "6", "=", "36"]
        : question === 2
          ? step === 0
            ? [
                w("1 machine", "1 mashina", "1 машина"),
                "→",
                w("1 widget", "1 buyum", "1 изделие"),
                "/",
                w("5 min", "5 daq", "5 мин"),
              ]
            : step === 1
              ? ["100", w("parallel", "parallel", "параллельно"), w("machines", "mashina", "машин")]
              : [
                  w("100 widgets", "100 buyum", "100 изделий"),
                  w("in", "vaqt:", "за"),
                  w("5 minutes", "5 daqiqa", "5 минут"),
                ]
          : [];
  return (
    <div className="explanation">
      <div className="approach">
        <span className="micro">{w("THE APPROACH", "YONDASHUV", "ПОДХОД")}</span>
        <p>{summaries[question]}</p>
      </div>
      <div
        className="explanation-steps"
        role="group"
        aria-label={w("Solution steps", "Yechim qadamlari", "Шаги решения")}
      >
        {steps.map((_s, i) => (
          <button key={i} aria-pressed={step === i} onClick={() => onStep(i)}>
            <span style={{ borderColor: colors[i] }}>{i + 1}</span>
            <strong>
              {w("Step", "Qadam", "Шаг")} {i + 1}
            </strong>
          </button>
        ))}
      </div>
      <p className="step-copy">
        <span style={{ background: colors[step] }}>{step + 1}</span>
        {steps[step]}
      </p>
      <div ref={diagram} className="solution-diagram">
        <svg
          viewBox="0 0 540 150"
          role="img"
          aria-label={steps[step]}
          style={{ color: "var(--pen-blue)" }}
        >
          <path d="M24 112H516" stroke="currentColor" opacity=".4" />
          {question !== 3 ? (
            display.map((text, i) => (
              <g key={i} data-diagram-mark>
                <text
                  x={(540 * (i + 0.5)) / display.length}
                  y="78"
                  textAnchor="middle"
                  fill="currentColor"
                  fontSize={display.length < 4 ? 24 : question === 2 ? 15 : 30}
                  fontFamily="inherit"
                >
                  {text}
                </text>
                <circle
                  cx={(540 * (i + 0.5)) / display.length}
                  cy="112"
                  r="3"
                  fill="currentColor"
                />
              </g>
            ))
          ) : (
            <g stroke="currentColor" strokeWidth="2" data-diagram-mark>
              <rect x="40" y="45" width="50" height="50" />
              <circle cx="180" cy="70" r="25" />
              <path d="m270 95 25-50 25 50Z" />
              <path d="m402 54 25-14 40 21v39l-25 14-40-21Zm0 0 40 21 25-14m-25 14v39" />
              {step > 0 && (
                <text x="430" y="140" fill="currentColor" stroke="none" textAnchor="middle">
                  3D
                </text>
              )}
            </g>
          )}
        </svg>
      </div>
      <div className="explanation-next">
        <span>{step + 1} / 3</span>
        <button className="text-link" disabled={step === 2} onClick={() => onStep(step + 1)}>
          {w("Next step", "Keyingi qadam", "Следующий шаг")}
          <ArrowRight size={14} />
        </button>
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
function SequenceTiles({
  values,
  answer,
  explained,
}: {
  values: string[];
  answer: string;
  explained: boolean;
}) {
  return (
    <div className="sequence-strip" aria-hidden="true">
      <div className="sequence-tiles">
        {values.map((value, i) => {
          const previous = Number(values[i - 1]);
          const current = value === "?" ? Number(answer) : Number(value);
          const difference = current - previous;
          return (
            <span className="sequence-tile" key={i}>
              {value}
              {explained && i > 0 && (
                <span className="sequence-difference">
                  {difference >= 0 ? "+" : ""}
                  {difference}
                  <svg
                    viewBox="0 0 78 18"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M8 16C22 2 56 2 70 16" vectorEffect="non-scaling-stroke" />
                    <path d="M68.2 9.2L70 16L63.2 14.2" vectorEffect="non-scaling-stroke" />
                  </svg>
                </span>
              )}
              {explained && value === "?" && <span className="sequence-answer">{answer}</span>}
            </span>
          );
        })}
      </div>
    </div>
  );
}
