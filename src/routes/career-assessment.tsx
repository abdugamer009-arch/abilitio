import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { useCallback, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useAuth } from "@/lib/auth-context";
import { submitCareerAssessment } from "@/lib/career.functions";
import { pickSessionQuestions, type SessionQuestions } from "@/lib/question-bank";
import type { PersonalityQ, CognitiveQ, InterestQ } from "@/lib/career-assessment";
import { ArrowLeft, ArrowRight, Brain, Sparkles, Loader2, Target, Shuffle } from "lucide-react";

export const Route = createFileRoute("/career-assessment")({
  head: () => ({
    meta: [
      { title: "Career Intelligence Assessment — Abilitio" },
      { name: "description", content: "30-question AI-powered career assessment measuring personality, cognitive ability, and interests." },
    ],
  }),
  component: CareerAssessmentPage,
});

const LIKERT = ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"];
const P_COUNT = 12;
const IQ_COUNT = 9;
const INT_COUNT = 9;
const TOTAL = P_COUNT + IQ_COUNT + INT_COUNT; // 30

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
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const submit = useServerFn(submitCareerAssessment);

  const [session, setSession] = useState<SessionQuestions | null>(null);
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [answers, setAnswers] = useState<Answers>(makeAnswers());

  const startSession = useCallback(() => {
    setSession(pickSessionQuestions());
    setStep(0);
    setAnswers(makeAnswers());
  }, []);

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
      navigate({ to: "/career-results" });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Submission failed";
      alert(msg);
      setSubmitting(false);
    }
  }

  if (loading) return <PageShell><div className="px-6 pt-32 text-center text-sm text-muted-foreground">Loading…</div></PageShell>;

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
              <h1 className="mt-6 text-4xl font-bold gradient-text">Career Intelligence Assessment</h1>
              <p className="mt-3 text-muted-foreground">
                30 questions · 3 sections · personalized career, cognitive & university profile.
              </p>

              <div className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs text-primary">
                <Shuffle className="h-3 w-3" /> Questions refresh every session
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-3 text-left">
                <Section icon={<Brain className="h-4 w-4" />} title="Personality" caption="12 Q · MBTI-style traits, work, leadership & team style." />
                <Section icon={<Target className="h-4 w-4" />} title="Cognitive / IQ" caption="9 Q · logic, pattern recognition & analytical reasoning." />
                <Section icon={<Sparkles className="h-4 w-4" />} title="Interests" caption="9 Q · fields, impact areas & career motivations." />
              </div>

              <button onClick={startSession} className="cta-sheen relative mt-8 inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-primary to-accent px-8 py-3 text-sm font-medium text-primary-foreground shadow-[0_8px_28px_-8px_var(--glow)] hover:-translate-y-0.5 transition-all">
                Start Assessment <ArrowRight className="h-4 w-4" />
              </button>
              <p className="mt-3 text-xs text-muted-foreground">Reward: +20 Aura Coins on completion ✨</p>
            </div>
          </div>
        </section>
      </PageShell>
    );
  }

  const progress = (step / TOTAL) * 100;
  const sectionLabel = step < P_COUNT ? "Personality" : step < P_COUNT + IQ_COUNT ? "Cognitive / IQ" : "Interests";

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

          <div className="glass mt-6 rounded-3xl p-8">
            {current && (
              <>
                <h2 className="text-xl font-semibold leading-relaxed whitespace-pre-line">{current.q.prompt}</h2>

                <div className="mt-6 space-y-2">
                  {current.kind === "p" && LIKERT.map((label, i) => {
                    const v = i + 1;
                    const selected = value === v;
                    return (
                      <button key={v} onClick={() => setValue(v)} className={`w-full rounded-xl border px-4 py-3 text-left transition-all duration-200 ${selected ? "border-primary/50 bg-gradient-to-r from-primary/12 to-accent/8 shadow-[0_2px_12px_-4px_var(--glow)]" : "border-border hover:bg-secondary/40 hover:border-primary/20"}`}>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">{label}</span>
                          <span className={`flex h-4 w-4 items-center justify-center rounded-full border transition-all ${selected ? "border-primary bg-gradient-to-br from-primary to-accent" : "border-border"}`}>
                            {selected && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                          </span>
                        </div>
                      </button>
                    );
                  })}

                  {current.kind === "c" && (current.q as CognitiveQ).options.map((opt, i) => {
                    const selected = value === i;
                    return (
                      <button key={i} onClick={() => setValue(i)} className={`w-full rounded-xl border px-4 py-3 text-left transition-all duration-200 ${selected ? "border-primary/50 bg-gradient-to-r from-primary/12 to-accent/8 shadow-[0_2px_12px_-4px_var(--glow)]" : "border-border hover:bg-secondary/40 hover:border-primary/20"}`}>
                        <div className="flex items-center gap-3">
                          <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold transition-all ${selected ? "bg-gradient-to-br from-primary to-accent border-primary text-primary-foreground shadow-[0_2px_6px_-2px_var(--glow)]" : "border-border text-muted-foreground"}`}>
                            {String.fromCharCode(65 + i)}
                          </span>
                          <span className="text-sm">{opt}</span>
                        </div>
                      </button>
                    );
                  })}

                  {current.kind === "i" && (
                    <div className="grid grid-cols-2 gap-2">
                      {(current.q as InterestQ).options.map((opt) => {
                        const arr = (value as string[]) ?? [];
                        const selected = arr.includes(opt.key);
                        return (
                          <button
                            key={opt.key}
                            onClick={() => setValue(selected ? arr.filter((k) => k !== opt.key) : [...arr, opt.key])}
                            className={`rounded-xl border px-4 py-3 text-left text-sm transition-all duration-200 ${selected ? "border-primary/50 bg-gradient-to-br from-primary/12 to-accent/8 shadow-[0_2px_12px_-4px_var(--glow)]" : "border-border hover:bg-secondary/40 hover:border-primary/20"}`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span>{opt.label}</span>
                              {selected && <span className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent"><span className="h-1 w-1 rounded-full bg-white" /></span>}
                            </div>
                          </button>
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
                className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2 text-sm disabled:opacity-40 hover:bg-secondary/50"
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
              {step < TOTAL - 1 ? (
                <button
                  onClick={() => setStep((s) => s + 1)}
                  disabled={!canNext}
                  className="cta-sheen relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-primary to-accent px-6 py-2 text-sm text-primary-foreground shadow-[0_6px_20px_-6px_var(--glow)] transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
                >
                  Next <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  onClick={finish}
                  disabled={!canNext || submitting}
                  className="cta-sheen relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-primary to-accent px-6 py-2 text-sm text-primary-foreground shadow-[0_6px_20px_-6px_var(--glow)] transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
                >
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                  See My Results
                </button>
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
      <div className="pointer-events-none absolute -right-8 -top-8 h-20 w-20 rounded-full opacity-20 blur-2xl transition-opacity group-hover:opacity-40"
        style={{ background: "radial-gradient(circle, oklch(0.65 0.24 295 / 0.8), transparent 70%)" }} />
      <div className="relative flex items-center gap-2.5">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-[0_3px_10px_-3px_var(--glow)]">{icon}</span>
        <span className="text-xs font-semibold">{title}</span>
      </div>
      <p className="relative mt-2 text-xs text-muted-foreground">{caption}</p>
    </div>
  );
}
