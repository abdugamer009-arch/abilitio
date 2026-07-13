import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { GlowBlob } from "@/components/GlowBlob";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useAuth } from "@/lib/auth-context";
import { submitCareerAssessment } from "@/lib/career.functions";
import { pickSessionQuestions, type SessionQuestions } from "@/lib/question-bank";
import type { PersonalityQ, CognitiveQ, InterestQ } from "@/lib/career-assessment";
import { ArrowLeft, ArrowRight, Brain, Sparkles, Loader2, Target, Shuffle } from "lucide-react";
import { useT, useI18n } from "@/lib/i18n";
import { QUESTION_TRANSLATIONS } from "@/lib/question-translations";
import { track, AnalyticsEvent } from "@/lib/analytics";

function tPrompt(id: string, original: string, lang: string): string {
  if (lang === "en") return original;
  return QUESTION_TRANSLATIONS[id]?.[lang as "ru" | "uz"]?.prompt ?? original;
}
function tCogOpts(id: string, options: string[], lang: string): string[] {
  if (lang === "en") return options;
  return QUESTION_TRANSLATIONS[id]?.[lang as "ru" | "uz"]?.options ?? options;
}
function tIntLabel(id: string, idx: number, label: string, lang: string): string {
  if (lang === "en") return label;
  return QUESTION_TRANSLATIONS[id]?.[lang as "ru" | "uz"]?.options?.[idx] ?? label;
}

export const Route = createFileRoute("/career-assessment")({
  head: () => ({
    meta: [
      { title: "Career Intelligence Assessment — Abilitio" },
      { name: "description", content: "30-question AI-powered career assessment measuring personality, cognitive ability, and interests." },
    ],
  }),
  component: CareerAssessmentPage,
});

const P_COUNT = 12;
const IQ_COUNT = 9;
const INT_COUNT = 9;
const TOTAL = P_COUNT + IQ_COUNT + INT_COUNT; // 30

// Persist in-progress assessments so a reload / crash never loses a user's work.
// The session questions are randomly picked per attempt, so we store them alongside
// the answers — otherwise restored answers would map to the wrong questions.
const PROGRESS_KEY = "abilitio.career_assessment.progress.v1";
type SavedProgress = { session: SessionQuestions; step: number; answers: Answers };

type Answers = {
  personality: (number | null)[];  // 12 likert 1..5
  iq: (number | null)[];           // 9 option indices
  interest: string[][];            // 9 multi-select arrays
};

function makeAnswers(): Answers {
  return {
    personality: Array(P_COUNT).fill(null),
    iq: Array(IQ_COUNT).fill(null),
    interest: Array(INT_COUNT).fill(null).map(() => []),
  };
}

function CareerAssessmentPage() {
  const t = useT();
  const { lang } = useI18n();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const submit = useServerFn(submitCareerAssessment);

  const LIKERT = [
    t.careerAssessment.likert1,
    t.careerAssessment.likert2,
    t.careerAssessment.likert3,
    t.careerAssessment.likert4,
    t.careerAssessment.likert5,
  ];

  const [session, setSession] = useState<SessionQuestions | null>(null);
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Answers>(makeAnswers());

  const startSession = useCallback(() => {
    setSession(pickSessionQuestions());
    setStep(0);
    setAnswers(makeAnswers());
    track(AnalyticsEvent.AssessmentStarted);
  }, []);

  // Restore an interrupted attempt on mount (client-only — localStorage is undefined during SSR).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(PROGRESS_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw) as SavedProgress;
      if (
        saved?.session?.personality?.length === P_COUNT &&
        saved?.session?.iq?.length === IQ_COUNT &&
        saved?.session?.interest?.length === INT_COUNT
      ) {
        setSession(saved.session);
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
      localStorage.setItem(PROGRESS_KEY, JSON.stringify({ session, step, answers } satisfies SavedProgress));
    } catch {
      // Storage full or unavailable — non-fatal.
    }
  }, [session, step, answers]);

  const current = useMemo(() => {
    if (!session) return null;
    if (step < P_COUNT) return { kind: "p" as const, q: session.personality[step] as PersonalityQ, idx: step };
    if (step < P_COUNT + IQ_COUNT) return { kind: "c" as const, q: session.iq[step - P_COUNT] as CognitiveQ, idx: step - P_COUNT };
    return { kind: "i" as const, q: session.interest[step - P_COUNT - IQ_COUNT] as InterestQ, idx: step - P_COUNT - IQ_COUNT };
  }, [session, step]);

  const value = useMemo(() => {
    if (!current) return null;
    if (current.kind === "p") return answers.personality[current.idx];
    if (current.kind === "c") return answers.iq[current.idx];
    return answers.interest[current.idx];
  }, [current, answers]);

  function setValue(v: number | string[]) {
    if (!current) return;
    setAnswers((a) => {
      const next = { ...a };
      if (current.kind === "p") { const arr = [...a.personality]; arr[current.idx] = v as number; next.personality = arr; }
      else if (current.kind === "c") { const arr = [...a.iq]; arr[current.idx] = v as number; next.iq = arr; }
      else { const arr = a.interest.map((x) => [...x]); arr[current.idx] = v as string[]; next.interest = arr; }
      return next;
    });
  }

  const canNext = current?.kind === "i"
    ? (value as string[])?.length > 0
    : value !== null && value !== undefined;

  async function finish() {
    if (!user) { navigate({ to: "/auth", search: { mode: "login", next: "/career-assessment" } }); return; }
    if (!session) return;
    setSubmitting(true);
    try {
      const result = await submit({
        data: {
          personalityQIds: session.personality.map((q) => q.id),
          personalityAnswers: answers.personality.map((v) => v ?? 3),
          iqQIds: session.iq.map((q) => q.id),
          iqAnswers: answers.iq.map((v) => v ?? -1),  // -1 = unanswered (skipped)
          interestQIds: session.interest.map((q) => q.id),
          interestAnswers: answers.interest,
        },
      });
      sessionStorage.setItem("career_last_result_id", result.id);
      try { localStorage.removeItem(PROGRESS_KEY); } catch { /* non-fatal */ }
      track(AnalyticsEvent.AssessmentCompleted);
      navigate({ to: "/career-results" });
    } catch (e: unknown) {
      setSubmitError(e instanceof Error ? e.message : t.careerAssessment.submissionFailed);
      setSubmitting(false);
    }
  }

  if (loading) return <PageShell><div className="px-6 pt-32 text-center text-sm text-muted-foreground">{t.careerAssessment.loading}</div></PageShell>;

  // Intro screen
  if (!session) {
    return (
      <PageShell>
        <section className="relative px-6 pt-16 pb-24">
          <div aria-hidden className="bg-grid pointer-events-none absolute inset-0" />
          <div className="relative mx-auto max-w-3xl">
            <div className="glass rounded-3xl p-10 text-center animate-fade-up">
              <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-[0_12px_40px_-12px_var(--glow)]">
                <Brain className="h-10 w-10 text-primary-foreground" />
                <span className="absolute -inset-1 -z-10 rounded-2xl opacity-50 blur-md" style={{ background: "radial-gradient(circle, oklch(0.65 0.24 295 / 0.5), transparent 70%)" }} />
              </div>
              <h1 className="mt-6 text-4xl font-bold gradient-text">{t.careerAssessment.title}</h1>
              <p className="mt-3 text-muted-foreground">
                {t.careerAssessment.subtitle}
              </p>

              <div className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs text-primary">
                <Shuffle className="h-3 w-3" /> {t.careerAssessment.questionsRefresh}
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-3 text-left">
                <Section icon={<Brain className="h-4 w-4" />} title={t.careerAssessment.sectionPersonality} caption={t.careerAssessment.captionPersonality} />
                <Section icon={<Target className="h-4 w-4" />} title={t.careerAssessment.sectionCognitive} caption={t.careerAssessment.captionCognitive} />
                <Section icon={<Sparkles className="h-4 w-4" />} title={t.careerAssessment.sectionInterests} caption={t.careerAssessment.captionInterests} />
              </div>

              <button onClick={startSession} className="cta-sheen relative mt-8 inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-primary to-accent px-8 py-3 text-sm font-medium text-primary-foreground shadow-[0_8px_28px_-8px_var(--glow)] hover:-translate-y-0.5 transition-all">
                {t.careerAssessment.startBtn} <ArrowRight className="h-4 w-4" />
              </button>
              <Link to="/methodology" className="mt-2 inline-block text-xs text-primary/80 hover:text-primary hover:underline">
                {t.careerAssessment.howItWorks}
              </Link>
            </div>
          </div>
        </section>
      </PageShell>
    );
  }

  const progress = (step / TOTAL) * 100;
  const sectionLabel = step < P_COUNT
    ? t.careerAssessment.sectionPersonality
    : step < P_COUNT + IQ_COUNT
    ? t.careerAssessment.sectionCognitive
    : t.careerAssessment.sectionInterests;

  return (
    <PageShell>
      <section className="px-6 pt-12 pb-24">
        <div className="mx-auto max-w-3xl">
          <div className="mb-4 flex items-center justify-between text-xs text-muted-foreground">
            <span>{sectionLabel}</span>
            <span>{step + 1} / {TOTAL}</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-secondary/60">
            <div className="h-full bg-gradient-to-r from-primary to-accent transition-all" style={{ width: `${progress}%`, boxShadow: "0 0 8px oklch(0.65 0.22 295 / 0.5)" }} />
          </div>

          <div className="glass mt-6 rounded-3xl p-6 sm:p-8">
            {current && (
              <>
                <h2 className="text-xl font-semibold leading-relaxed whitespace-pre-line">{tPrompt(current.q.id, current.q.prompt, lang)}</h2>

                <div className="mt-6">
                  {current.kind === "p" && (
                    <div role="radiogroup" aria-label={sectionLabel} className="space-y-2">
                      {LIKERT.map((label, i) => {
                        const v = i + 1;
                        const selected = value === v;
                        return (
                          <label key={v} className="block cursor-pointer">
                            <input type="radio" name={`p-${current.q.id}`} checked={selected} onChange={() => setValue(v)} className="sr-only peer" />
                            <div className={`w-full rounded-xl border px-4 py-3 text-left transition-all duration-200 peer-focus-visible:ring-2 peer-focus-visible:ring-primary/70 ${selected ? "border-primary/50 bg-gradient-to-r from-primary/12 to-accent/8 shadow-[0_2px_12px_-4px_var(--glow)]" : "border-border hover:bg-secondary/40 hover:border-primary/20"}`}>
                              <div className="flex items-center justify-between">
                                <span className="text-sm">{label}</span>
                                <span className={`flex h-4 w-4 items-center justify-center rounded-full border transition-all ${selected ? "border-primary bg-gradient-to-br from-primary to-accent" : "border-border"}`}>
                                  {selected && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
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
                      {tCogOpts(current.q.id, (current.q as CognitiveQ).options, lang).map((opt, i) => {
                        const selected = value === i;
                        return (
                          <label key={i} className="block cursor-pointer">
                            <input type="radio" name={`c-${current.q.id}`} checked={selected} onChange={() => setValue(i)} className="sr-only peer" />
                            <div className={`w-full rounded-xl border px-4 py-3 text-left transition-all duration-200 peer-focus-visible:ring-2 peer-focus-visible:ring-primary/70 ${selected ? "border-primary/50 bg-gradient-to-r from-primary/12 to-accent/8 shadow-[0_2px_12px_-4px_var(--glow)]" : "border-border hover:bg-secondary/40 hover:border-primary/20"}`}>
                              <div className="flex items-center gap-3">
                                <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold transition-all ${selected ? "bg-gradient-to-br from-primary to-accent border-primary text-primary-foreground shadow-[0_2px_6px_-2px_var(--glow)]" : "border-border text-muted-foreground"}`}>
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
                    <div role="group" aria-label={sectionLabel} className="grid grid-cols-2 gap-2">
                      {(current.q as InterestQ).options.map((opt, optIdx) => {
                        const arr = (value as string[]) ?? [];
                        const selected = arr.includes(opt.key);
                        return (
                          <label key={opt.key} className="cursor-pointer">
                            <input type="checkbox" checked={selected} onChange={() => setValue(selected ? arr.filter((k) => k !== opt.key) : [...arr, opt.key])} className="sr-only peer" />
                            <div className={`rounded-xl border px-4 py-3 text-left text-sm transition-all duration-200 peer-focus-visible:ring-2 peer-focus-visible:ring-primary/70 ${selected ? "border-primary/50 bg-gradient-to-br from-primary/12 to-accent/8 shadow-[0_2px_12px_-4px_var(--glow)]" : "border-border hover:bg-secondary/40 hover:border-primary/20"}`}>
                              <div className="flex items-center justify-between gap-2">
                                <span>{tIntLabel(current.q.id, optIdx, opt.label, lang)}</span>
                                {selected && <span className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent"><span className="h-1 w-1 rounded-full bg-white" /></span>}
                              </div>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>
              </>
            )}

            <div className="mt-8 flex items-center justify-between">
              <button
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                disabled={step === 0}
                className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-5 py-2 text-sm text-primary/80 disabled:opacity-40 hover:border-primary/50 hover:bg-primary/10 transition-all"
              >
                <ArrowLeft className="h-4 w-4" /> {t.careerAssessment.back}
              </button>
              {step < TOTAL - 1 ? (
                <button
                  onClick={() => setStep((s) => s + 1)}
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
                    onClick={() => { setSubmitError(null); finish(); }}
                    disabled={!canNext || submitting}
                    className="cta-sheen relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-primary to-accent px-6 py-2 text-sm text-primary-foreground shadow-[0_6px_20px_-6px_var(--glow)] transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
                  >
                    {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                    {t.careerAssessment.seeResults}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

function Section({ icon, title, caption }: { icon: React.ReactNode; title: string; caption: string }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-secondary/40 to-background/40 p-4 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-[0_8px_24px_-10px_oklch(0.55_0.22_295_/_0.3)]">
      <GlowBlob className="-right-8 -top-8 h-20 w-20 opacity-20 blur-2xl transition-opacity group-hover:opacity-40" alpha={0.8} />
      <div className="relative flex items-center gap-2.5">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-[0_3px_10px_-3px_var(--glow)]">{icon}</span>
        <span className="text-xs font-semibold">{title}</span>
      </div>
      <p className="relative mt-2 text-xs text-muted-foreground">{caption}</p>
    </div>
  );
}
