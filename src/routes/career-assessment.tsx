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
        <section className="px-6 pt-16 pb-24">
          <div className="mx-auto max-w-3xl">
            <div className="glass rounded-3xl p-10 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent">
                <Brain className="h-10 w-10 text-primary-foreground" />
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

              <button onClick={startSession} className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3 text-sm font-medium text-primary-foreground hover:glow-purple hover:-translate-y-0.5 transition">
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
            <div className="h-full bg-gradient-to-r from-primary to-accent transition-all" style={{ width: `${progress}%` }} />
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
                      <button key={v} onClick={() => setValue(v)} className={`w-full rounded-xl border px-4 py-3 text-left transition ${selected ? "border-primary bg-primary/10" : "border-border hover:bg-secondary/40"}`}>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">{label}</span>
                          <span className={`h-4 w-4 rounded-full border ${selected ? "bg-primary border-primary" : "border-border"}`} />
                        </div>
                      </button>
                    );
                  })}

                  {current.kind === "c" && (current.q as CognitiveQ).options.map((opt, i) => {
                    const selected = value === i;
                    return (
                      <button key={i} onClick={() => setValue(i)} className={`w-full rounded-xl border px-4 py-3 text-left transition ${selected ? "border-primary bg-primary/10" : "border-border hover:bg-secondary/40"}`}>
                        <div className="flex items-center gap-3">
                          <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold ${selected ? "bg-primary border-primary text-primary-foreground" : "border-border text-muted-foreground"}`}>
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
                            className={`rounded-xl border px-4 py-3 text-left text-sm transition ${selected ? "border-primary bg-primary/10" : "border-border hover:bg-secondary/40"}`}
                          >
                            {opt.label}
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
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2 text-sm text-primary-foreground hover:glow-purple disabled:opacity-50"
                >
                  Next <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  onClick={finish}
                  disabled={!canNext || submitting}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2 text-sm text-primary-foreground hover:glow-purple disabled:opacity-50"
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
    <div className="rounded-2xl border border-border bg-secondary/30 p-4">
      <div className="flex items-center gap-2 text-primary">{icon}<span className="text-xs font-semibold">{title}</span></div>
      <p className="mt-1.5 text-xs text-muted-foreground">{caption}</p>
    </div>
  );
}
