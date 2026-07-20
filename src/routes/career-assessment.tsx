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

export const Route = createFileRoute("/career-assessment")({
  head: () => ({
    meta: [
      { title: "Career Intelligence Assessment — Abilitio" },
      {
        name: "description",
        content:
          "30-question AI-powered career assessment measuring personality, cognitive ability, and interests.",
      },
    ],
  }),
  component: CareerAssessmentPage,
});

const P_COUNT = 12;
const IQ_COUNT = 9;
const INT_COUNT = 9;
const TOTAL = P_COUNT + IQ_COUNT + INT_COUNT; // 30

// v2: sessions are now server-delivered with per-language text; older cached
// (v1) sessions have an incompatible shape, so the key bump discards them.
const PROGRESS_KEY = "abilitio.career_assessment.progress.v2";
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
        s?.personality?.length === P_COUNT &&
        s?.iq?.length === IQ_COUNT &&
        s?.interest?.length === INT_COUNT &&
        typeof s.personality[0]?.prompt?.en === "string";
      if (ok) {
        setSession(s);
        setStep(typeof saved.step === "number" ? Math.min(Math.max(saved.step, 0), TOTAL - 1) : 0);
        if (saved.answers) setAnswers(saved.answers);
      }
    } catch {
      // Corrupt or outdated payload — ignore and start fresh.
    }
  }, []);

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
    if (step < P_COUNT) return { kind: "p" as const, q: session.personality[step], idx: step };
    if (step < P_COUNT + IQ_COUNT)
      return { kind: "c" as const, q: session.iq[step - P_COUNT], idx: step - P_COUNT };
    return {
      kind: "i" as const,
      q: session.interest[step - P_COUNT - IQ_COUNT],
      idx: step - P_COUNT - IQ_COUNT,
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
      navigate({ to: "/auth", search: { mode: "login", next: "/career-assessment" } });
      return;
    }
    if (!session) return;
    setSubmitting(true);
    try {
      const result = await submit({
        data: {
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

  // ── Intro screen ──
  if (!session) {
    return (
      <PageShell>
        <section className="relative px-6 pt-16 pb-24">
          <div aria-hidden className="bg-grid pointer-events-none absolute inset-0" />
          <div className="relative mx-auto max-w-3xl">
            <div className="glass rounded-3xl p-10 text-center animate-fade-up">
              <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-[0_12px_40px_-12px_var(--glow)]">
                <Brain className="h-10 w-10 text-primary-foreground" />
                <span
                  className="absolute -inset-1 -z-10 rounded-2xl opacity-50 blur-md"
                  style={{
                    background:
                      "radial-gradient(circle, oklch(0.65 0.24 295 / 0.5), transparent 70%)",
                  }}
                />
              </div>
              <h1 className="mt-6 text-4xl font-bold gradient-text">{t.careerAssessment.title}</h1>
              <p className="mt-3 text-muted-foreground">{t.careerAssessment.subtitle}</p>

              <div className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs text-primary">
                <Shuffle className="h-3 w-3" /> {t.careerAssessment.questionsRefresh}
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-3 text-left">
                <Section
                  icon={<Brain className="h-4 w-4" />}
                  title={t.careerAssessment.sectionPersonality}
                  caption={t.careerAssessment.captionPersonality}
                />
                <Section
                  icon={<Target className="h-4 w-4" />}
                  title={t.careerAssessment.sectionCognitive}
                  caption={t.careerAssessment.captionCognitive}
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
                className="cta-sheen relative mt-8 inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-primary to-accent px-8 py-3 text-sm font-medium text-primary-foreground shadow-[0_8px_28px_-8px_var(--glow)] hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:hover:translate-y-0"
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
    { icon: Brain, label: t.careerAssessment.sectionPersonality },
    { icon: Target, label: t.careerAssessment.sectionCognitive },
    { icon: Sparkles, label: t.careerAssessment.sectionInterests },
  ];
  const phaseIndex = step < P_COUNT ? 0 : step < P_COUNT + IQ_COUNT ? 1 : 2;
  const progress = ((step + (canNext ? 1 : 0)) / TOTAL) * 100;
  const sectionLabel = phases[phaseIndex].label;
  const prompt = current ? current.q.prompt[l] : "";

  return (
    <PageShell>
      <section className="px-6 pt-12 pb-24">
        <div className="mx-auto max-w-3xl">
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
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition-all ${active || done ? "bg-gradient-to-br from-primary to-accent text-primary-foreground" : "bg-secondary/60"}`}
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
          <div className="h-2 w-full overflow-hidden rounded-full bg-secondary/60">
            <div
              className="h-full bg-gradient-to-r from-primary to-accent transition-[width] duration-500 ease-out"
              style={{ width: `${progress}%`, boxShadow: "0 0 8px oklch(0.65 0.22 295 / 0.5)" }}
            />
          </div>

          <div className="glass mt-6 rounded-3xl p-6 sm:p-8">
            {current && (
              <div key={step} className="animate-fade-up">
                <h2 className="text-xl font-semibold leading-relaxed whitespace-pre-line">
                  {prompt}
                </h2>

                <div className="mt-6">
                  {current.kind === "p" && (
                    <div role="radiogroup" aria-label={sectionLabel} className="space-y-2">
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
                            <div
                              className={`w-full rounded-xl border px-4 py-3 text-left transition-all duration-200 peer-focus-visible:ring-2 peer-focus-visible:ring-primary/70 ${selected ? "border-primary/50 bg-gradient-to-r from-primary/12 to-accent/8 shadow-[0_2px_12px_-4px_var(--glow)]" : "border-border hover:bg-secondary/40 hover:border-primary/20"}`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="flex items-center gap-3 text-sm">
                                  <span
                                    className={`hidden h-5 w-5 shrink-0 items-center justify-center rounded-md border text-[10px] font-bold sm:flex ${selected ? "border-primary bg-primary/15 text-primary" : "border-border text-muted-foreground"}`}
                                  >
                                    {v}
                                  </span>
                                  {label}
                                </span>
                                <span
                                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-all ${selected ? "border-primary bg-gradient-to-br from-primary to-accent" : "border-border"}`}
                                >
                                  {selected && (
                                    <span className="h-1.5 w-1.5 rounded-full bg-white" />
                                  )}
                                </span>
                              </div>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  )}

                  {current.kind === "c" && (
                    <div role="radiogroup" aria-label={sectionLabel} className="space-y-2">
                      {current.q.options[l].map((opt, i) => {
                        const selected = value === i;
                        return (
                          <label key={i} className="block cursor-pointer">
                            <input
                              type="radio"
                              name={`c-${current.q.id}`}
                              checked={selected}
                              onChange={() => setValue(i)}
                              className="sr-only peer"
                            />
                            <div
                              className={`w-full rounded-xl border px-4 py-3 text-left transition-all duration-200 peer-focus-visible:ring-2 peer-focus-visible:ring-primary/70 ${selected ? "border-primary/50 bg-gradient-to-r from-primary/12 to-accent/8 shadow-[0_2px_12px_-4px_var(--glow)]" : "border-border hover:bg-secondary/40 hover:border-primary/20"}`}
                            >
                              <div className="flex items-center gap-3">
                                <span
                                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold transition-all ${selected ? "bg-gradient-to-br from-primary to-accent border-primary text-primary-foreground shadow-[0_2px_6px_-2px_var(--glow)]" : "border-border text-muted-foreground"}`}
                                >
                                  {String.fromCharCode(65 + i)}
                                </span>
                                <span className="text-sm">{opt}</span>
                              </div>
                            </div>
                          </label>
                        );
                      })}
                    </div>
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
                            <div
                              className={`flex h-full flex-col items-center gap-2.5 rounded-2xl border px-3 py-4 text-center transition-all duration-200 peer-focus-visible:ring-2 peer-focus-visible:ring-primary/70 ${selected ? "border-primary/60 bg-gradient-to-br from-primary/12 to-accent/8 text-primary shadow-[0_4px_16px_-6px_var(--glow)] -translate-y-0.5" : "border-border text-foreground/70 hover:-translate-y-0.5 hover:bg-secondary/40 hover:border-primary/25"}`}
                            >
                              <span className="flex h-14 w-14 items-center justify-center">
                                <InterestArt visual={opt.visual} />
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
                  className="cta-sheen relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-primary to-accent px-6 py-2 text-sm text-primary-foreground shadow-[0_6px_20px_-6px_var(--glow)] transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
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
                    className="cta-sheen relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-primary to-accent px-6 py-2 text-sm text-primary-foreground shadow-[0_6px_20px_-6px_var(--glow)] transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
                  >
                    {submitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Sparkles className="h-4 w-4" />
                    )}
                    {t.careerAssessment.seeResults}
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
        className="h-12 w-12 rounded-xl border border-foreground/10 shadow-[inset_0_1px_4px_rgba(0,0,0,0.15)]"
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
      strokeWidth={2.5}
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
    <div className="group relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-secondary/40 to-background/40 p-4 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-[0_8px_24px_-10px_oklch(0.55_0.22_295_/_0.3)]">
      <GlowBlob
        className="-right-8 -top-8 h-20 w-20 opacity-20 blur-2xl transition-opacity group-hover:opacity-40"
        alpha={0.8}
      />
      <div className="relative flex items-center gap-2.5">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-[0_3px_10px_-3px_var(--glow)]">
          {icon}
        </span>
        <span className="text-xs font-semibold">{title}</span>
      </div>
      <p className="relative mt-2 text-xs text-muted-foreground">{caption}</p>
    </div>
  );
}
