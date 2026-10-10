import { useWords } from "@/lib/editorial";
import { isSupabaseConfigured } from "@/integrations/supabase/config";
import { ChoiceOptions } from "@/components/ChoiceOptions";
import { pageMeta } from "@/lib/seo";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { GlowBlob } from "@/components/GlowBlob";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useAuth } from "@/lib/auth-context";
import {
  submitCareerAssessment,
  startCareerSession,
  type ClientSession,
} from "@/lib/assessment/career.functions";
import type { InterestVisual } from "@/lib/assessment/career-assessment";
import { INTEREST_ICONS } from "@/lib/assessment/interest-icons";
import {
  ArrowLeft,
  ArrowRight,
  Brain,
  Sparkles,
  Loader2,
  Target,
  Shuffle,
  Check,
  Keyboard,
} from "lucide-react";
import { useT, useI18n } from "@/lib/i18n";
import { track, AnalyticsEvent } from "@/lib/analytics";
import { toast } from "sonner";

export const Route = createFileRoute("/career-assessment")({
  head: () =>
    pageMeta(
      "/career-assessment",
      "Explore your career profile",
      "Thirty questions about reasoning, work preferences and interests. An exploratory profile, not a diagnosis.",
    ),
  component: CareerAssessmentPage,
});

const P_COUNT = 12;
const IQ_COUNT = 9;
const INT_COUNT = 9;
const TOTAL = P_COUNT + IQ_COUNT + INT_COUNT; // 30

// Section order: cognitive (IQ) first, then personality, then interests.
// v3: the section order changed (IQ now leads); bumping discards saved v2
// progress whose step index pointed into the old ordering.
const PROGRESS_KEY = "abilitio.career_assessment.progress.v3";
type SavedProgress = { session: ClientSession; step: number; answers: Answers };

type Answers = {
  personality: (number | null)[]; // 12 likert 1..5
  iq: (number | null)[]; // 9 option indices
  interest: string[][]; // 9 single-select arrays
};

function makeAnswers(): Answers {
  return {
    personality: Array(P_COUNT).fill(null),
    iq: Array(IQ_COUNT).fill(null),
    interest: Array(INT_COUNT)
      .fill(null)
      .map(() => []),
  };
}

type Lang = "en" | "ru" | "uz";

function CareerAssessmentPage() {
  const t = useT();
  const w = useWords();
  const { lang } = useI18n();
  const l = lang as Lang;
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const submit = useServerFn(submitCareerAssessment);
  const start = useServerFn(startCareerSession);

  const LIKERT = [
    t.careerAssessment.likert1,
    t.careerAssessment.likert2,
    t.careerAssessment.likert3,
    t.careerAssessment.likert4,
    t.careerAssessment.likert5,
  ];

  const [session, setSession] = useState<ClientSession | null>(null);
  const [step, setStep] = useState(0);
  const [starting, setStarting] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Answers>(makeAnswers());

  // Fetch a fresh, server-picked session (questions + translations, no answers).
  const startSession = useCallback(async () => {
    setStarting(true);
    setSubmitError(null);
    try {
      const s = await start();
      setSession(s);
      setStep(0);
      setAnswers(makeAnswers());
      track(AnalyticsEvent.AssessmentStarted);
    } catch (e: unknown) {
      setSubmitError(e instanceof Error ? e.message : t.careerAssessment.submissionFailed);
    } finally {
      setStarting(false);
    }
  }, [start, t]);

  // Restore an interrupted attempt on mount (client-only — localStorage is undefined during SSR).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(PROGRESS_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw) as SavedProgress;
      const s = saved?.session;
      const ok =
        typeof s?.sessionToken === "string" &&
        s?.personality?.length === P_COUNT &&
        s?.iq?.length === IQ_COUNT &&
        s?.interest?.length === INT_COUNT &&
        s.personality.every(
          (q) =>
            typeof q?.id === "string" &&
            q?.prompt &&
            [q.prompt.en, q.prompt.uz, q.prompt.ru].every((v) => typeof v === "string"),
        ) &&
        s.iq.every(
          (q) =>
            typeof q?.id === "string" &&
            q?.prompt &&
            [q.prompt.en, q.prompt.uz, q.prompt.ru].every((v) => typeof v === "string") &&
            q.options &&
            [q.options.en, q.options.uz, q.options.ru].every(
              (v) => Array.isArray(v) && v.length === 4 && v.every((o) => typeof o === "string"),
            ),
        ) &&
        s.interest.every(
          (q) =>
            typeof q?.id === "string" &&
            q?.prompt &&
            [q.prompt.en, q.prompt.uz, q.prompt.ru].every((v) => typeof v === "string") &&
            Array.isArray(q.options) &&
            q.options.every(
              (o) =>
                typeof o?.id === "string" &&
                o.visual &&
                (o.visual.kind === "icon"
                  ? typeof o.visual.icon === "string"
                  : o.visual.kind === "swatch" &&
                    Array.isArray(o.visual.colors) &&
                    o.visual.colors.length === 2 &&
                    o.visual.colors.every((c) => typeof c === "string")),
            ) &&
            q.labels &&
            [q.labels.en, q.labels.uz, q.labels.ru].every(
              (v) =>
                Array.isArray(v) &&
                v.length === q.options.length &&
                v.every((o) => typeof o === "string"),
            ),
        );
      const a = saved?.answers;
      const validAnswers =
        a &&
        Array.isArray(a.personality) &&
        a.personality.length === P_COUNT &&
        a.personality.every(
          (v: unknown) =>
            v === null || (Number.isInteger(v) && typeof v === "number" && v >= 1 && v <= 5),
        ) &&
        Array.isArray(a.iq) &&
        a.iq.length === IQ_COUNT &&
        a.iq.every(
          (v: unknown) =>
            v === null || (Number.isInteger(v) && typeof v === "number" && v >= -1 && v <= 3),
        ) &&
        Array.isArray(a.interest) &&
        a.interest.length === INT_COUNT &&
        a.interest.every(
          (v: unknown) =>
            Array.isArray(v) && v.length <= 1 && v.every((id: unknown) => typeof id === "string"),
        );
      if (ok && validAnswers) {
        setSession(s);
        setStep(typeof saved.step === "number" ? Math.min(Math.max(saved.step, 0), TOTAL - 1) : 0);
        if (saved.answers) setAnswers(saved.answers);
      }
    } catch {
      // Corrupt or outdated payload — ignore and start fresh.
    }
  }, []);

  // Bring each new question into view. Without this the page keeps the previous
  // scroll offset, so the prompt sits above the viewport for all 30 steps.
  useEffect(() => {
    if (!session) return;
    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  }, [session, step]);

  useEffect(() => {
    if (session && [0, 9, 21].includes(step))
      track(AnalyticsEvent.AssessmentStage, {
        stage: step < 9 ? "reasoning" : step < 21 ? "personality" : "interests",
      });
  }, [session, step]);

  // Persist after every answer / step change while an attempt is in progress.
  useEffect(() => {
    if (!session) return;
    try {
      localStorage.setItem(
        PROGRESS_KEY,
        JSON.stringify({ session, step, answers } satisfies SavedProgress),
      );
    } catch {
      // Storage full or unavailable — non-fatal.
    }
  }, [session, step, answers]);

  const current = useMemo(() => {
    if (!session) return null;
    if (step < IQ_COUNT) return { kind: "c" as const, q: session.iq[step], idx: step };
    if (step < IQ_COUNT + P_COUNT)
      return { kind: "p" as const, q: session.personality[step - IQ_COUNT], idx: step - IQ_COUNT };
    return {
      kind: "i" as const,
      q: session.interest[step - IQ_COUNT - P_COUNT],
      idx: step - IQ_COUNT - P_COUNT,
    };
  }, [session, step]);

  const value = useMemo(() => {
    if (!current) return null;
    if (current.kind === "p") return answers.personality[current.idx];
    if (current.kind === "c") return answers.iq[current.idx];
    return answers.interest[current.idx];
  }, [current, answers]);

  const setValue = useCallback(
    (v: number | string[]) => {
      if (!current) return;
      setAnswers((a) => {
        const next = { ...a };
        if (current.kind === "p") {
          const arr = [...a.personality];
          arr[current.idx] = v as number;
          next.personality = arr;
        } else if (current.kind === "c") {
          const arr = [...a.iq];
          arr[current.idx] = v as number;
          next.iq = arr;
        } else {
          const arr = a.interest.map((x) => [...x]);
          arr[current.idx] = v as string[];
          next.interest = arr;
        }
        return next;
      });
    },
    [current],
  );

  const canNext =
    current?.kind === "i" ? (value as string[])?.length > 0 : value !== null && value !== undefined;

  function goNext() {
    setStep((s) => Math.min(TOTAL - 1, s + 1));
  }
  function goBack() {
    setStep((s) => Math.max(0, s - 1));
  }

  // Interest questions are single-select gut picks — auto-advance so the section
  // feels like a snappy quiz. Never on the final step; guarded against a manual
  // Back/Next during the delay causing a surprise double-jump.
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
    },
    [],
  );
  const selectInterest = useCallback(
    (optId: string) => {
      setValue([optId]);
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
      if (step < TOTAL - 1) {
        const from = step;
        advanceTimer.current = setTimeout(
          () => setStep((s) => (s === from && s < TOTAL - 1 ? s + 1 : s)),
          260,
        );
      }
    },
    [step, setValue],
  );

  const finish = useCallback(async () => {
    if (!user) {
      navigate({ to: "/auth", search: { mode: "signup", next: "/career-assessment" } });
      return;
    }
    if (!session) return;
    setSubmitting(true);
    try {
      const result = await submit({
        data: {
          sessionToken: session.sessionToken,
          personalityQIds: session.personality.map((q) => q.id),
          personalityAnswers: answers.personality.map((v) => v ?? 3),
          iqQIds: session.iq.map((q) => q.id),
          iqAnswers: answers.iq.map((v) => v ?? -1),
          interestQIds: session.interest.map((q) => q.id),
          interestAnswers: answers.interest,
        },
      });
      sessionStorage.setItem("career_last_result_id", result.id);
      try {
        localStorage.removeItem(PROGRESS_KEY);
      } catch {
        /* non-fatal */
      }
      track(AnalyticsEvent.AssessmentCompleted);
      track(AnalyticsEvent.ResultSaved);
      // The system placed them in a community during submit — say so, so
      // nobody thinks another test is needed to join one.
      if (result.joined_community) {
        toast.success(t.community.joined.replace("{name}", result.joined_community));
      }
      navigate({ to: "/career-results" });
    } catch (e: unknown) {
      setSubmitError(e instanceof Error ? e.message : t.careerAssessment.submissionFailed);
      setSubmitting(false);
    }
  }, [user, session, answers, submit, navigate, t]);

  // Keyboard shortcuts: number keys pick an option, ←/→ or Enter navigate.
  useEffect(() => {
    if (!session || !current) return;
    function onKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      const q = current!;
      const n = Number(e.key);
      if (q.kind === "p" && n >= 1 && n <= 5) {
        e.preventDefault();
        setValue(n);
        return;
      }
      if (q.kind === "c" && n >= 1 && n <= q.q.options.en.length) {
        e.preventDefault();
        setValue(n - 1);
        return;
      }
      if (q.kind === "i" && n >= 1 && n <= q.q.options.length) {
        e.preventDefault();
        selectInterest(q.q.options[n - 1].id);
        return;
      }
      if (e.key === "Enter" || e.key === "ArrowRight") {
        if (canNext) {
          e.preventDefault();
          if (step < TOTAL - 1) goNext();
          else finish();
        }
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goBack();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, current, canNext, step, value, finish, selectInterest]);

  if (loading)
    return (
      <PageShell>
        <section
          className="px-6 pt-16 pb-24"
          aria-busy="true"
          aria-label={t.careerAssessment.loading}
        >
          <div className="mx-auto max-w-3xl">
            <div className="skeleton h-96 rounded-3xl" />
          </div>
        </section>
      </PageShell>
    );

  const accountNotice = !user && (
    <p className="assessment-account-note" role="note">
      {isSupabaseConfigured
        ? w(
            "A free account is required to view and save results. Your answers stay in this browser during sign-up.",
            "Natijani ko‘rish va saqlash uchun bepul hisob kerak. Ro‘yxatdan o‘tishda javoblar shu brauzerda qoladi.",
            "Для просмотра и сохранения результатов нужен бесплатный аккаунт. Ответы остаются здесь при регистрации.",
          )
        : w(
            "This local site can run the questions, but account saving and full results are unavailable until the account service is connected. Practice answers remain in this browser.",
            "Mahalliy sayt savollarni ko‘rsatadi, lekin hisob xizmati ulanmaguncha to‘liq natija va hisobga saqlash ishlamaydi. Mashq javoblari shu brauzerda qoladi.",
            "Локальный сайт показывает вопросы, но полные результаты и сохранение недоступны до подключения аккаунтов. Ответы остаются в браузере.",
          )}
    </p>
  );
  // ── Intro screen ──
  if (!session) {
    return (
      <PageShell>
        <section className="relative px-6 pt-16 pb-24">
          <div aria-hidden className="bg-grid pointer-events-none absolute inset-0" />
          <div className="relative mx-auto max-w-3xl">
            <div className="panel rounded-3xl p-10 text-center animate-fade-up">
              <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-primary">
                <Brain className="h-10 w-10 text-primary-foreground" />
                <span
                  className="absolute -inset-1 -z-10 rounded-2xl opacity-50 blur-md"
                  style={{
                    background: "var(--yellow)",
                  }}
                />
              </div>
              <h1 className="mt-6 text-4xl font-bold gradient-text">{t.careerAssessment.title}</h1>
              <p className="mt-3 text-muted-foreground">{t.careerAssessment.subtitle}</p>
              {accountNotice}

              <div className="assessment-instructions mt-6 text-left text-sm">
                <p>
                  {w(
                    "Set aside about 15 minutes as a planning estimate, not a measured completion time. Take longer if you need.",
                    "Reja uchun taxminan 15 daqiqa ajrating; bu o‘lchangan tugatish vaqti emas. Kerak bo‘lsa ko‘proq vaqt oling.",
                    "Для планирования выделите примерно 15 минут; это не измеренное время прохождения. При необходимости потратьте больше.",
                  )}
                </p>
                <p>
                  {w(
                    "Answer reasoning questions, then work-style statements, then visual preferences. There are no right or wrong answers in the preference sections.",
                    "Mantiq savollari, ish uslubi fikrlari va vizual afzalliklarga javob bering. Afzallik bo‘limlarida to‘g‘ri yoki noto‘g‘ri javob yo‘q.",
                    "Ответьте на задачи, утверждения о стиле работы и визуальные предпочтения. В разделах предпочтений нет правильных или неправильных ответов.",
                  )}
                </p>
                <p>
                  {w(
                    "There is no timer. You can pause and return in this browser. Results require a free account; your answers are kept here while you sign up or sign in. Cloud saving happens after submission, not while answering.",
                    "Taymer yo‘q. Shu brauzerda tanaffus qilib qaytishingiz mumkin. Natija uchun bepul hisob kerak; ro‘yxatdan o‘tish yoki kirish paytida javoblar shu yerda qoladi. Bulutga saqlash yuborilgandan keyin bo‘ladi.",
                    "Таймера нет. Можно сделать паузу и вернуться в этом браузере. Для результатов нужен бесплатный аккаунт; ответы остаются здесь во время регистрации или входа. В аккаунт они сохраняются после отправки.",
                  )}
                </p>
                <p>
                  {w(
                    "You receive career ideas, suggested study subjects and activities to explore. University links are research starting points, not admission or scholarship eligibility decisions.",
                    "Kasb g‘oyalari, o‘qish yo‘nalishlari va sinash faoliyatlari olasiz. Universitet havolalari izlanish boshlanishi, qabul yoki stipendiya qarori emas.",
                    "Вы получите идеи профессий, учебных направлений и занятий. Ссылки вузов — начало исследования, не решение о приёме или стипендии.",
                  )}
                </p>
              </div>
              <div className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs text-primary">
                <Shuffle className="h-3 w-3" /> {t.careerAssessment.questionsRefresh}
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-3 text-left">
                <Section
                  icon={<Target className="h-4 w-4" />}
                  title={t.careerAssessment.sectionCognitive}
                  caption={t.careerAssessment.captionCognitive}
                />
                <Section
                  icon={<Brain className="h-4 w-4" />}
                  title={t.careerAssessment.sectionPersonality}
                  caption={t.careerAssessment.captionPersonality}
                />
                <Section
                  icon={<Sparkles className="h-4 w-4" />}
                  title={t.careerAssessment.sectionInterests}
                  caption={t.careerAssessment.captionInterests}
                />
              </div>

              {submitError && (
                <div className="mt-6 rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-2 text-xs text-destructive">
                  {submitError}
                </div>
              )}

              <button
                onClick={startSession}
                disabled={starting}
                className="cta-sheen relative mt-8 inline-flex items-center gap-2 overflow-hidden rounded-full bg-primary px-8 py-3 text-sm font-medium text-primary-foreground hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:hover:translate-y-0"
              >
                {starting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {t.careerAssessment.startBtn} {!starting && <ArrowRight className="h-4 w-4" />}
              </button>
              <Link
                to="/methodology"
                className="mt-2 inline-block text-xs text-primary/80 hover:text-primary hover:underline"
              >
                {t.careerAssessment.howItWorks}
              </Link>
            </div>
          </div>
        </section>
      </PageShell>
    );
  }

  const phases = [
    { icon: Target, label: t.careerAssessment.sectionCognitive },
    { icon: Brain, label: t.careerAssessment.sectionPersonality },
    { icon: Sparkles, label: t.careerAssessment.sectionInterests },
  ];
  const phaseIndex = step < IQ_COUNT ? 0 : step < IQ_COUNT + P_COUNT ? 1 : 2;
  const progress = ((step + (canNext ? 1 : 0)) / TOTAL) * 100;
  const sectionLabel = phases[phaseIndex].label;
  const prompt = current ? current.q.prompt[l] : "";

  return (
    <PageShell>
      <section className="px-6 pt-12 pb-24">
        <div className="mx-auto max-w-3xl">
          {accountNotice}
          <p className="text-xs text-muted-foreground mb-4">
            {step >= IQ_COUNT
              ? w(
                  "Preference questions: choose what feels closest to you. There is no correct answer.",
                  "Afzallik savollari: sizga eng yaqinini tanlang. To‘g‘ri javob yo‘q.",
                  "Вопросы предпочтений: выбирайте близкий вам вариант. Правильного ответа нет.",
                )
              : w(
                  "Reasoning practice: choose the answer you think is correct. Nine questions cannot measure your full ability.",
                  "Mantiq: to‘g‘ri deb bilgan javobni tanlang. To‘qqiz savol to‘liq qobiliyatingizni o‘lchamaydi.",
                  "Задачи: выберите верный, по вашему мнению, ответ. Девять вопросов не измеряют все способности.",
                )}
          </p>
          {/* Phase stepper */}
          <div className="mb-4 flex items-center gap-1.5">
            {phases.map((ph, i) => {
              const active = i === phaseIndex;
              const done = i < phaseIndex;
              const Icon = ph.icon;
              return (
                <div key={i} className="flex flex-1 items-center gap-1.5">
                  <div
                    className={`flex items-center gap-2 rounded-full border px-2.5 py-1.5 transition-all ${active ? "border-primary/50 bg-primary/10 text-primary" : done ? "border-primary/25 text-primary/70" : "border-border text-muted-foreground"}`}
                  >
                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition-all ${active || done ? "bg-primary text-primary-foreground" : "bg-secondary/60"}`}
                    >
                      {done ? <Check className="h-3 w-3" /> : <Icon className="h-3 w-3" />}
                    </span>
                    <span className="hidden text-xs font-medium sm:inline">{ph.label}</span>
                  </div>
                  {i < phases.length - 1 && (
                    <div
                      className={`h-px flex-1 transition-colors ${done ? "bg-primary/40" : "bg-border"}`}
                    />
                  )}
                </div>
              );
            })}
          </div>

          <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
            <span>{sectionLabel}</span>
            <span>
              {step + 1} / {TOTAL}
            </span>
          </div>
          <div className="assessment-progress w-full">
            <div
              className="h-full bg-primary transition-[width] duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="panel mt-6 rounded-3xl p-6 sm:p-8">
            {current && (
              <div key={step} className="animate-fade-up">
                <h2 className="text-xl font-semibold leading-relaxed whitespace-pre-line">
                  {prompt}
                </h2>

                <div className="mt-6">
                  {current.kind === "p" && (
                    <div role="radiogroup" aria-label={sectionLabel} className="assessment-scale">
                      {LIKERT.map((label, i) => {
                        const v = i + 1;
                        const selected = value === v;
                        return (
                          <label key={v} className="block cursor-pointer">
                            <input
                              type="radio"
                              name={`p-${current.q.id}`}
                              checked={selected}
                              onChange={() => setValue(v)}
                              className="sr-only peer"
                            />
                            <span className="scale-choice">{v}</span>
                            <span className="scale-label">{label}</span>
                          </label>
                        );
                      })}
                    </div>
                  )}

                  {current.kind === "c" && (
                    <ChoiceOptions
                      options={current.q.options[l]}
                      value={typeof value === "number" ? value : null}
                      onChange={setValue}
                      name={sectionLabel}
                    />
                  )}

                  {current.kind === "i" && (
                    <div
                      role="radiogroup"
                      aria-label={sectionLabel}
                      className="grid grid-cols-2 gap-2.5 sm:grid-cols-3"
                    >
                      {current.q.options.map((opt, optIdx) => {
                        const arr = (value as string[]) ?? [];
                        const selected = arr.includes(opt.id);
                        return (
                          <label key={opt.id} className="cursor-pointer">
                            <input
                              type="radio"
                              name={`i-${current.q.id}`}
                              checked={selected}
                              onChange={() => selectInterest(opt.id)}
                              className="sr-only peer"
                            />
                            <div className="visual-choice flex h-full flex-col items-center gap-2.5 px-3 py-4 text-center peer-focus-visible:ring-2 peer-focus-visible:ring-primary/70">
                              <span className="interest-art-frame flex h-14 w-14 items-center justify-center">
                                <InterestArt visual={opt.visual} />
                              </span>
                              <span className="visual-choice-check" aria-hidden="true">
                                <Check size={16} />
                              </span>
                              <span className="text-xs font-medium text-foreground">
                                {current.q.labels[l][optIdx]}
                              </span>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="mt-8 flex items-center justify-between">
              <button
                onClick={goBack}
                disabled={step === 0}
                className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-5 py-2 text-sm text-primary/80 disabled:opacity-40 hover:border-primary/50 hover:bg-primary/10 transition-all"
              >
                <ArrowLeft className="h-4 w-4" /> {t.careerAssessment.back}
              </button>
              {step < TOTAL - 1 ? (
                <button
                  onClick={goNext}
                  disabled={!canNext}
                  className="cta-sheen relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-primary px-6 py-2 text-sm text-primary-foreground transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
                >
                  {t.careerAssessment.next} <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <div className="flex flex-col items-end gap-2">
                  {submitError && (
                    <div className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-2 text-xs text-destructive max-w-xs text-right">
                      {submitError}
                    </div>
                  )}
                  <button
                    onClick={() => {
                      setSubmitError(null);
                      finish();
                    }}
                    disabled={!canNext || submitting}
                    className="cta-sheen relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-primary px-6 py-2 text-sm text-primary-foreground transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
                  >
                    {submitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Sparkles className="h-4 w-4" />
                    )}
                    {user
                      ? t.careerAssessment.seeResults
                      : w(
                          "Create account to view results",
                          "Natija uchun hisob yarating",
                          "Создать аккаунт для результатов",
                        )}
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="mt-3 hidden items-center justify-center gap-1.5 text-[11px] text-muted-foreground sm:flex">
            <Keyboard className="h-3.5 w-3.5" /> {t.careerAssessment.keyboardHint}
          </div>
        </div>
      </section>
    </PageShell>
  );
}

// Renders a projective interest option's visual: a colour swatch, or one of the
// hand-drawn SVG icons in the shared icon set (interest-icons.tsx). SVG strokes
// use currentColor so they inherit the card's selected/hover colour and adapt to
// light & dark themes. There are no emoji or external images anywhere.
function InterestArt({ visual }: { visual: InterestVisual }) {
  if (visual.kind === "swatch") {
    const [a, b] = visual.colors;
    return (
      <span
        aria-hidden
        className="h-12 w-12 rounded-xl border border-foreground/10"
        style={{ background: `linear-gradient(135deg, ${a}, ${b})` }}
      />
    );
  }
  return (
    <svg
      className="h-14 w-14"
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {INTEREST_ICONS[visual.icon] ?? INTEREST_ICONS.circle}
    </svg>
  );
}

function Section({
  icon,
  title,
  caption,
}: {
  icon: React.ReactNode;
  title: string;
  caption: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card p-4 transition-all hover:-translate-y-0.5 hover:border-primary/30">
      <GlowBlob
        className="-right-8 -top-8 h-20 w-20 opacity-20 blur-2xl transition-opacity group-hover:opacity-40"
        alpha={0.8}
      />
      <div className="relative flex items-center gap-2.5">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          {icon}
        </span>
        <span className="text-xs font-semibold">{title}</span>
      </div>
      <p className="relative mt-2 text-xs text-muted-foreground">{caption}</p>
    </div>
  );
}
