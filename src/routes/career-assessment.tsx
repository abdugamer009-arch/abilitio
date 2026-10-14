import "@/styles/assessment.css";
import { AssessmentProfileChooser } from "@/components/AssessmentProfileChooser";
import { useMotion } from "@/components/MotionProvider";
import { MOTION } from "@/lib/motion";
import {
  DRAFT_KEY,
  LEGACY_DRAFT_KEY,
  readAttemptDraft,
  resetAttempt,
  EMPTY_PROFILE,
  validProfile,
  rememberResultProfile,
  type AttemptProfile,
} from "@/lib/assessment/attempt-profile";
import { rememberSavedAssessment } from "@/lib/assessment/saved-attempt";
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
  startProfileSessions,
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
  Settings2,
  X,
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

// Section order: cognitive (IQ) first, then personality, then interests.
// v3: the section order changed (IQ now leads); bumping discards saved v2
// progress whose step index pointed into the old ordering.
const PROGRESS_KEY = DRAFT_KEY;
type SavedProgress = {
  session: ClientSession;
  profile: AttemptProfile;
  step: number;
  answers: Answers;
  ownerId?: string | null;
};

type Answers = {
  personality: (number | null)[]; // 12 likert 1..5
  iq: (number | null)[]; // 9 option indices
  interest: string[][]; // 9 single-select arrays
};

function makeAnswers(iqCount = 9, interestCount = 9): Answers {
  return {
    personality: Array(P_COUNT).fill(null),
    iq: Array(iqCount).fill(null),
    interest: Array(interestCount)
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
  const { enabled: motionEnabled } = useMotion();
  const panel = useRef<HTMLDivElement>(null);
  const questionScroll = useRef<HTMLDivElement>(null);
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const submit = useServerFn(submitCareerAssessment);
  const start = useServerFn(startProfileSessions);

  const LIKERT = [
    t.careerAssessment.likert1,
    t.careerAssessment.likert2,
    t.careerAssessment.likert3,
    t.careerAssessment.likert4,
    t.careerAssessment.likert5,
  ];

  const [profile, setProfile] = useState<AttemptProfile>(EMPTY_PROFILE);
  const [choosing, setChoosing] = useState(true);
  const startPending = useRef(false);
  const [session, setSession] = useState<ClientSession | null>(null);
  const [step, setStep] = useState(0);
  const [starting, setStarting] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const submissionPending = useRef(false);
  const sessionOwner = useRef<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Answers>(makeAnswers());

  const IQ_COUNT = session?.iq.length ?? (profile.ageGroup === "child" ? 0 : 9);
  const INT_COUNT = session?.interest.length ?? (profile.ageGroup === "child" ? 18 : 9);
  const TOTAL = P_COUNT + IQ_COUNT + INT_COUNT;

  // Reuse the workshop's panel unseal and authored easing, with one cleanup owner.
  useEffect(() => {
    if (choosing || !session) return;
    panel.current?.querySelector<HTMLElement>("h2")?.focus({ preventScroll: true });
    if (!motionEnabled || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let cancelled = false;
    let cleanup = () => {};
    import("gsap").then(({ gsap }) => {
      if (cancelled || !panel.current) return;
      const context = gsap.context(() => {
        const content = panel.current?.querySelector(".assessment-question-content");
        if (content)
          gsap.fromTo(
            content,
            { y: 8, opacity: 0.65 },
            {
              y: 0,
              opacity: 1,
              duration: MOTION.quick,
              ease: "studioExpo",
              clearProps: "transform,opacity",
            },
          );
      }, panel);
      cleanup = () => context.revert();
    });
    return () => {
      cancelled = true;
      cleanup();
    };
  }, [choosing, session, motionEnabled, step]);

  // VisualViewport handles keyboards and rotation without changing assessment state.
  useEffect(() => {
    const viewport = window.visualViewport;
    const sync = () =>
      document.documentElement.style.setProperty(
        "--assessment-viewport-height",
        `${viewport?.height ?? window.innerHeight}px`,
      );
    sync();
    viewport?.addEventListener("resize", sync);
    window.addEventListener("resize", sync);
    return () => {
      viewport?.removeEventListener("resize", sync);
      window.removeEventListener("resize", sync);
      document.documentElement.style.removeProperty("--assessment-viewport-height");
    };
  }, []);
  useEffect(() => {
    const el = questionScroll.current;
    if (!el || choosing) return;
    const sync = () => {
      el.dataset.more = el.scrollHeight - el.scrollTop - el.clientHeight > 4 ? "true" : "false";
    };
    const observer = new ResizeObserver(sync);
    observer.observe(el);
    if (el.firstElementChild) observer.observe(el.firstElementChild);
    el.addEventListener("scroll", sync, { passive: true });
    sync();
    return () => {
      observer.disconnect();
      el.removeEventListener("scroll", sync);
    };
  }, [step, choosing, session]);

  // Fetch a fresh, server-picked session (questions + translations, no answers).
  const startSession = useCallback(async () => {
    if (startPending.current || !validProfile(profile)) return;
    if (session) {
      setChoosing(false);
      return;
    }
    startPending.current = true;
    setStarting(true);
    setSubmitError(null);
    try {
      const variants = await start();
      const s = variants[profile.ageGroup!];
      if (s.personality.length !== 12 || s.interest.length + s.iq.length !== 18)
        throw new Error("Assessment questions are unavailable. Please retry.");
      sessionOwner.current = user?.id ?? null;
      setSession(s);
      setChoosing(false);
      setStep(0);
      setAnswers(makeAnswers(s.iq.length, s.interest.length));
      track(AnalyticsEvent.AssessmentStarted);
    } catch (e: unknown) {
      setSubmitError(e instanceof Error ? e.message : t.careerAssessment.submissionFailed);
    } finally {
      startPending.current = false;
      setStarting(false);
    }
  }, [start, t, user?.id, profile, session]);

  // Restore an interrupted attempt on mount (client-only — localStorage is undefined during SSR).
  useEffect(() => {
    if (loading) return;
    setProfile(EMPTY_PROFILE);
    setChoosing(true);
    setSession(null);
    setStep(0);
    setAnswers(makeAnswers());
    try {
      const raw = readAttemptDraft();
      if (!raw) return;
      const saved = JSON.parse(raw) as SavedProgress;
      // Existing older drafts have no gender choice: retain answers and require it.
      if (!saved.profile) saved.profile = { gender: null, ageGroup: "teen_adult" };
      const needsGender = saved.profile.gender === null && saved.profile.ageGroup === "teen_adult";
      if (!needsGender && !validProfile(saved.profile)) return;
      const iqCount = saved.profile.ageGroup === "child" ? 0 : 9;
      const interestCount = saved.profile.ageGroup === "child" ? 18 : 9;
      const s = saved?.session;
      if (saved.ownerId && saved.ownerId !== user?.id) return;
      const encoded = s?.sessionToken?.split(".")[0];
      const claim = JSON.parse(atob(encoded.replace(/-/g, "+").replace(/_/g, "/")));
      // UI expiry only; the server still verifies the signature and membership.
      if (typeof claim.expires !== "number" || claim.expires <= Date.now()) {
        sessionStorage.removeItem(PROGRESS_KEY);
        return;
      }
      const ok =
        typeof s?.sessionToken === "string" &&
        s?.personality?.length === P_COUNT &&
        s?.iq?.length === iqCount &&
        s?.interest?.length === interestCount &&
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
        a.iq.length === iqCount &&
        a.iq.every(
          (v: unknown) =>
            v === null || (Number.isInteger(v) && typeof v === "number" && v >= -1 && v <= 3),
        ) &&
        Array.isArray(a.interest) &&
        a.interest.length === interestCount &&
        a.interest.every(
          (v: unknown) =>
            Array.isArray(v) && v.length <= 1 && v.every((id: unknown) => typeof id === "string"),
        );
      if (ok && validAnswers) {
        sessionOwner.current = user?.id ?? null;
        setProfile(saved.profile);
        setChoosing(true);
        setSession(s);
        setStep(Number.isInteger(saved.step) ? Math.min(Math.max(saved.step, 0), 29) : 0);
        if (saved.answers) setAnswers(saved.answers);
      }
    } catch {
      // Corrupt or outdated payload — ignore and start fresh.
    }
  }, [loading, user?.id]);

  // Bring each new question into view. Without this the page keeps the previous
  // scroll offset, so the prompt sits above the viewport for all 30 steps.
  useEffect(() => {
    if (!session) return;
    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    questionScroll.current?.scrollTo({ top: 0, behavior: "auto" });
    questionScroll.current?.querySelector<HTMLElement>("h2")?.focus({ preventScroll: true });
    if (!window.matchMedia("(max-width: 1023px)").matches)
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  }, [session, step, choosing]);

  useEffect(() => {
    if (session && [0, IQ_COUNT, IQ_COUNT + P_COUNT].includes(step))
      track(AnalyticsEvent.AssessmentStage, {
        stage:
          step < IQ_COUNT ? "reasoning" : step < IQ_COUNT + P_COUNT ? "personality" : "interests",
      });
  }, [session, step, IQ_COUNT]);

  // Persist after every answer / step change while an attempt is in progress.
  useEffect(() => {
    if (!session || loading || sessionOwner.current !== (user?.id ?? null)) return;
    try {
      sessionStorage.setItem(
        PROGRESS_KEY,
        JSON.stringify({
          session,
          profile,
          step,
          answers,
          ownerId: user?.id ?? null,
        } satisfies SavedProgress),
      );
      try {
        localStorage.removeItem(LEGACY_DRAFT_KEY);
      } catch {
        /* optional migration cleanup */
      }
    } catch {
      // Storage full or unavailable — non-fatal.
    }
  }, [session, profile, step, answers, loading, user?.id]);

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
  }, [session, step, IQ_COUNT]);

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
    if (!canNext || submitting) return;
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    setStep((s) => (s === step ? Math.min(TOTAL - 1, s + 1) : s));
  }
  function goBack() {
    if (step === 0) {
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
      setChoosing(true);
    } else setStep((s) => (s === step ? Math.max(0, s - 1) : s));
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
      if (window.matchMedia("(max-width: 1023px)").matches) return;
      if (step < TOTAL - 1) {
        const from = step;
        advanceTimer.current = setTimeout(
          () => setStep((s) => (s === from && s < TOTAL - 1 ? s + 1 : s)),
          260,
        );
      }
    },
    [step, setValue, TOTAL],
  );

  const finish = useCallback(async () => {
    if (submissionPending.current) return;
    if (!user) {
      navigate({ to: "/auth", search: { mode: "signup", next: "/career-assessment" } });
      return;
    }
    if (!session) return;
    submissionPending.current = true;
    setSubmitError(null);
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
      rememberSavedAssessment(result.id, PROGRESS_KEY);
      rememberResultProfile(result.id, user.id, profile);
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
    } finally {
      submissionPending.current = false;
    }
  }, [user, session, answers, submit, navigate, t, profile]);

  // Keyboard shortcuts: number keys pick an option, ←/→ or Enter navigate.
  useEffect(() => {
    if (!session || !current || choosing) return;
    function onKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (["INPUT", "TEXTAREA", "SELECT", "BUTTON", "A"].includes(tag ?? "")) return;
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
  }, [session, current, canNext, step, value, finish, selectInterest, choosing]);

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
  function editProfile() {
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    setChoosing(true);
  }
  function restartTest() {
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    setSession(null);
    setAnswers(makeAnswers());
    setStep(0);
    setProfile(EMPTY_PROFILE);
    setChoosing(true);
    setSubmitError(null);
    resetAttempt();
  }
  function changeProfile(next: AttemptProfile) {
    if (session && next.ageGroup !== profile.ageGroup) {
      if (
        !window.confirm(
          w(
            "Changing the age group starts a new test and clears these answers. Continue?",
            "Yosh guruhini o‘zgartirish yangi testni boshlaydi va javoblarni o‘chiradi. Davom etasizmi?",
            "Смена возрастной группы начнёт новый тест и удалит ответы. Продолжить?",
          ),
        )
      )
        return;
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
      setSession(null);
      setStep(0);
      setAnswers(
        makeAnswers(next.ageGroup === "child" ? 0 : 9, next.ageGroup === "child" ? 18 : 9),
      );
      try {
        sessionStorage.removeItem(PROGRESS_KEY);
      } catch {
        /* optional */
      }
    }
    setProfile(next);
  }

  if (!session || choosing) {
    return (
      <div className="assessment-flow assessment-entry">
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
                <h1 className="mt-6 text-4xl font-bold gradient-text">
                  {t.careerAssessment.title}
                </h1>
                <p className="mt-3 text-muted-foreground">
                  {w(
                    "30 questions. No timer. Pause and return in this browser.",
                    "30 ta savol. Taymer yo‘q. Shu brauzerda tanaffus qilib qayting.",
                    "30 вопросов. Без таймера. Можно сделать паузу и вернуться в этом браузере.",
                  )}
                </p>
                {accountNotice}

                <AssessmentProfileChooser
                  profile={profile}
                  onChange={changeProfile}
                  disabled={starting}
                />
                <details className="mt-6 text-left text-sm">
                  <summary className="cursor-pointer font-medium">
                    {w("Before you start", "Boshlashdan oldin", "Перед началом")}
                  </summary>
                  <div className="assessment-instructions mt-3">
                    <p>
                      {w(
                        "Set aside about 15 minutes as a planning estimate, not a measured completion time. Take longer if you need.",
                        "Reja uchun taxminan 15 daqiqa ajrating; bu o‘lchangan tugatish vaqti emas. Kerak bo‘lsa ko‘proq vaqt oling.",
                        "Для планирования выделите примерно 15 минут; это не измеренное время прохождения. При необходимости потратьте больше.",
                      )}
                    </p>
                    <p>
                      {profile.ageGroup === "child"
                        ? w(
                            "Choose what you enjoy playing and doing. There are no right or wrong answers.",
                            "O‘ynashni va bajarishni yoqtirgan narsalaringni tanla. To‘g‘ri yoki noto‘g‘ri javob yo‘q.",
                            "Выбирай игры и занятия, которые тебе нравятся. Правильных и неправильных ответов нет.",
                          )
                        : w(
                            "Answer reasoning questions, then work-style statements, then choose activities and subjects. There are no right or wrong answers in the preference sections.",
                            "Mantiq savollari, ish uslubi fikrlari va vizual afzalliklarga javob bering. Afzallik bo‘limlarida to‘g‘ri yoki noto‘g‘ri javob yo‘q.",
                            "Ответьте на задачи, утверждения о стиле работы и визуальные предпочтения. В разделах предпочтений нет правильных или неправильных ответов.",
                          )}
                    </p>
                    <p>
                      {w(
                        "Your draft stays in this tab for this session, for up to 24 hours. Cloud saving happens after submission, not while answering.",
                        "Javoblar sessiya davomida ushbu oynada 24 soatgacha qoladi. Bulutga saqlash yuborilgandan keyin bo‘ladi.",
                        "Черновик остаётся в этой вкладке на время сеанса, до 24 часов. В аккаунт он сохраняется после отправки.",
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
                  <p className="mt-3 text-sm text-muted-foreground">
                    {profile.ageGroup === "child"
                      ? w(
                          "Your test has 12 questions about how you like to play and 18 about activities you enjoy. There are no maths or ability questions.",
                          "Testingda o‘ynash uslubing haqida 12 ta va yoqtirgan mashg‘ulotlaring haqida 18 ta savol bor. Matematika yoki qobiliyat savollari yo‘q.",
                          "В твоём тесте 12 вопросов о том, как ты любишь играть, и 18 о любимых занятиях. Задач на математику или способности нет.",
                        )
                      : w(
                          "Each attempt shuffles 30 questions from a bank of 561. All 166 career profiles are compared when you save your results.",
                          "Har urinishda 561 savollik bankdan 30 ta savol aralashtirib tanlanadi. Natija saqlanganda barcha 166 kasb profili solishtiriladi.",
                          "Каждая попытка выбирает 30 перемешанных вопросов из банка 561. При сохранении сравниваются все 166 профилей профессий.",
                        )}
                  </p>
                </details>
                <div className="mt-8 grid gap-4 md:grid-cols-3 text-left">
                  {profile.ageGroup !== "child" && (
                    <Section
                      icon={<Target className="h-4 w-4" />}
                      title={t.careerAssessment.sectionCognitive}
                      caption={t.careerAssessment.captionCognitive}
                    />
                  )}
                  <Section
                    icon={<Brain className="h-4 w-4" />}
                    title={t.careerAssessment.sectionPersonality}
                    caption={
                      profile.ageGroup === "child"
                        ? w(
                            "12 questions about how you like to play.",
                            "Qanday o‘ynashni yoqtirishing haqida 12 ta savol.",
                            "12 вопросов о том, как тебе нравится играть.",
                          )
                        : t.careerAssessment.captionPersonality
                    }
                  />
                  <Section
                    icon={<Sparkles className="h-4 w-4" />}
                    title={t.careerAssessment.sectionInterests}
                    caption={
                      profile.ageGroup === "child"
                        ? w(
                            "18 questions about activities you enjoy.",
                            "Yoqtirgan mashg‘ulotlaring haqida 18 ta savol.",
                            "18 вопросов о занятиях, которые тебе нравятся.",
                          )
                        : t.careerAssessment.captionInterests
                    }
                  />
                </div>

                {submitError && (
                  <div className="mt-6 rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-2 text-xs text-destructive">
                    {submitError}
                  </div>
                )}

                <div className="assessment-entry-actions">
                  <button
                    data-mobile-primary
                    onClick={startSession}
                    disabled={starting || !validProfile(profile)}
                    className="cta-sheen relative mt-8 inline-flex items-center gap-2 overflow-hidden rounded-full bg-primary px-8 py-3 text-sm font-medium text-primary-foreground hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:hover:translate-y-0"
                  >
                    {starting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                    {session
                      ? w(
                          "Continue where you left off",
                          "Qolgan joydan davom ettirish",
                          "Продолжить с места остановки",
                        )
                      : t.careerAssessment.startBtn}{" "}
                    {!starting && <ArrowRight className="h-4 w-4" />}
                  </button>
                </div>
                {session && (
                  <button
                    onClick={restartTest}
                    disabled={starting}
                    className="field-button ml-3 mt-4 text-sm"
                  >
                    {w("Restart test", "Testni qayta boshlash", "Начать заново")}
                  </button>
                )}
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
      </div>
    );
  }

  const phases = [
    ...(IQ_COUNT ? [{ icon: Target, label: t.careerAssessment.sectionCognitive }] : []),
    { icon: Brain, label: t.careerAssessment.sectionPersonality },
    { icon: Sparkles, label: t.careerAssessment.sectionInterests },
  ];
  const phaseIndex = (step < IQ_COUNT ? 0 : step < IQ_COUNT + P_COUNT ? 1 : 2) - (IQ_COUNT ? 0 : 1);
  const progress = ((step + (canNext ? 1 : 0)) / TOTAL) * 100;
  const sectionLabel = phases[phaseIndex].label;
  const prompt = current ? current.q.prompt[l] : "";

  return (
    <div className="assessment-flow assessment-running">
      <PageShell>
        <section className="assessment-test-section px-6 pt-12 pb-24">
          <div className="assessment-test-inner mx-auto max-w-3xl">
            <header className="assessment-test-header">
              <div className="assessment-desktop-only">{accountNotice}</div>
              <div className="assessment-controls">
                <button
                  aria-label={t.careerAssessment.back}
                  onClick={goBack}
                  disabled={submitting}
                  className="field-button assessment-mobile-back"
                >
                  <ArrowLeft className="h-5 w-5" />
                  <span className="assessment-back-label">{t.careerAssessment.back}</span>
                </button>
                <button
                  aria-label={w("Change choices", "Tanlovlarni o‘zgartirish", "Изменить выбор")}
                  onClick={editProfile}
                  disabled={submitting}
                  className="field-button"
                >
                  <Settings2 className="h-5 w-5" />
                  <span className="assessment-edit-label">
                    {w("Change choices", "Tanlovlarni o‘zgartirish", "Изменить выбор")}
                  </span>
                </button>
                <Link
                  to="/"
                  aria-label={w("Exit test", "Testdan chiqish", "Выйти из теста")}
                  className="field-button assessment-exit"
                >
                  <X className="h-5 w-5" />
                </Link>
              </div>
              <div className="assessment-desktop-only">
                {" "}
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
              </div>
              <div className="assessment-progress-meta" role="status" aria-live="polite">
                <span className="assessment-section-name">{sectionLabel}</span>
                <span>
                  {step + 1} / {TOTAL}
                </span>
              </div>
              <div
                className="assessment-progress w-full"
                role="progressbar"
                aria-label={sectionLabel}
                aria-valuemin={0}
                aria-valuemax={TOTAL}
                aria-valuenow={step + (canNext ? 1 : 0)}
              >
                <div
                  className="h-full bg-primary transition-[width] duration-200 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </header>
            <div
              ref={panel}
              className="assessment-question-panel panel mt-6 rounded-3xl p-6 sm:p-8"
            >
              <div
                ref={questionScroll}
                className="assessment-question-scroll"
                role="region"
                aria-labelledby="assessment-question"
                tabIndex={0}
              >
                {current && (
                  <div
                    key={step}
                    data-question-index={step}
                    className="assessment-question-content"
                  >
                    <h2
                      id="assessment-question"
                      tabIndex={-1}
                      className="text-xl font-semibold leading-relaxed whitespace-pre-line"
                    >
                      {prompt}
                    </h2>

                    <div className="mt-6">
                      {current.kind === "p" && (
                        <div
                          role="radiogroup"
                          aria-label={sectionLabel}
                          className="assessment-scale"
                        >
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
                          className="assessment-interest-options grid grid-cols-2 gap-2.5 sm:grid-cols-3"
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
              </div>
              <div className="assessment-actions mt-8 flex items-center justify-between">
                <button
                  onClick={goBack}
                  disabled={submitting}
                  className="assessment-bottom-back inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-5 py-2 text-sm text-primary/80 disabled:opacity-40 hover:border-primary/50 hover:bg-primary/10 transition-all"
                >
                  <ArrowLeft className="h-4 w-4" /> {t.careerAssessment.back}
                </button>
                {step < TOTAL - 1 ? (
                  <button
                    data-mobile-primary
                    onClick={goNext}
                    disabled={!canNext}
                    className="cta-sheen relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-primary px-6 py-2 text-sm text-primary-foreground transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
                  >
                    {t.careerAssessment.next} <ArrowRight className="h-4 w-4" />
                  </button>
                ) : (
                  <div className="flex flex-col items-end gap-2">
                    {submitError && (
                      <div className="assessment-submit-error rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-2 text-xs text-destructive max-w-xs text-right">
                        {submitError}
                      </div>
                    )}
                    <button
                      data-mobile-primary
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

            <div className="keyboard-hint mt-3 hidden items-center justify-center gap-1.5 text-[11px] text-muted-foreground sm:flex">
              <Keyboard className="h-3.5 w-3.5" /> {t.careerAssessment.keyboardHint}
            </div>
          </div>
        </section>
      </PageShell>
    </div>
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
