import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Brain, Loader2, Sparkles, Check } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import {
  getPersonalityQuestions,
  submitPersonality,
  getLatestPersonalityResult,
  type MbtiType,
  type PersonalityResult,
} from "@/lib/personality.functions";
import { useAuth } from "@/lib/auth-context";
import { useAura } from "@/components/aura/AuraProvider";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/personality")({
  head: () => ({
    meta: [
      { title: "OEJTS 1.1 Personality Assessment — Abilitio" },
      { name: "description", content: "Discover your personality type, strengths, preferences, and career tendencies." },
    ],
  }),
  component: PersonalityPage,
});

const SCALE = [1, 2, 3, 4, 5] as const;

function PersonalityPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { award } = useAura();

  const fetchQuestions = useServerFn(getPersonalityQuestions);
  const fetchLatest = useServerFn(getLatestPersonalityResult);
  const submit = useServerFn(submitPersonality);

  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<{ result: PersonalityResult; type: MbtiType | null } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const questionsQuery = useQuery({
    queryKey: ["personality-questions"],
    queryFn: () => fetchQuestions(),
    enabled: !!user && started,
  });

  const latestQuery = useQuery({
    queryKey: ["personality-latest"],
    queryFn: () => fetchLatest(),
    enabled: !!user && !started && !done,
  });

  useEffect(() => {
    if (!authLoading && !user) navigate({ to: "/auth" });
  }, [authLoading, user, navigate]);

  const questions = useMemo(() => questionsQuery.data ?? [], [questionsQuery.data]);
  const total = questions.length;
  const current = questions[step];
  const answered = current ? answers[current.question_number] : undefined;
  const progress = total ? Math.round(((step + (answered ? 1 : 0)) / total) * 100) : 0;

  async function handleSubmit() {
    if (Object.keys(answers).length !== 48) {
      setError("Please answer all 48 questions.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const ordered = Array.from({ length: 48 }, (_, i) => answers[i + 1]);
      const out = await submit({ data: { answers: ordered } });
      setDone(out);
      award("assessment_complete").catch(() => undefined);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Submission failed");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) return <ResultsView data={done} onRetake={() => { setDone(null); setStarted(false); setAnswers({}); setStep(0); }} />;

  // Intro / previous result screen
  if (!started) {
    const prev = latestQuery.data;
    return (
      <PageShell>
        <section className="px-6 pt-20 pb-24">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent glow-purple">
              <Brain className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="mt-8 text-4xl font-bold md:text-5xl gradient-text">OEJTS 1.1 Personality Assessment</h1>
            <p className="mt-4 text-muted-foreground">
              Discover your personality type, strengths, preferences, and career tendencies.
            </p>

            {prev && (
              <div className="glass mt-8 rounded-3xl p-6 text-left">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">Your latest result</p>
                <div className="mt-2 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-3xl font-bold gradient-text">{prev.result.mbti_type}</p>
                    {prev.type && <p className="text-sm text-muted-foreground">{prev.type.title}</p>}
                  </div>
                  <button
                    onClick={() => setDone(prev)}
                    className="rounded-full border border-border px-4 py-2 text-sm hover:bg-secondary"
                  >
                    View details
                  </button>
                </div>
              </div>
            )}

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => setStarted(true)}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-base font-medium text-primary-foreground transition-all hover:glow-purple hover:-translate-y-0.5"
              >
                {prev ? "Retake assessment" : "Start assessment"} <ArrowRight className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">48 questions · ~10 minutes</p>
          </div>
        </section>
      </PageShell>
    );
  }

  if (questionsQuery.isLoading || !current) {
    return (
      <PageShell>
        <section className="grid min-h-[60vh] place-items-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </section>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <section className="px-6 pt-12 pb-24">
        <div className="mx-auto max-w-2xl">
          <div className="mb-3 flex items-center justify-between text-xs text-muted-foreground">
            <span>Question {step + 1} of {total}</span>
            <span>{progress}% complete</span>
          </div>
          <Progress value={progress} className="mb-10 h-1.5" />

          <div key={current.id} className="glass animate-fade-up rounded-3xl p-8 md:p-10">
            <p className="text-center text-xs uppercase tracking-wider text-accent">Choose what fits you best</p>

            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-[1fr_auto_1fr] md:items-center">
              <p className="text-center text-base font-medium md:text-right md:text-lg">{current.left_statement}</p>
              <div className="hidden h-10 w-px bg-border/60 md:block" />
              <p className="text-center text-base font-medium md:text-left md:text-lg">{current.right_statement}</p>
            </div>

            <div className="mt-8 flex items-center justify-center gap-2 sm:gap-4">
              {SCALE.map((v) => {
                const isSel = answered === v;
                const size = v === 3 ? "h-10 w-10" : v === 1 || v === 5 ? "h-14 w-14" : "h-12 w-12";
                return (
                  <button
                    key={v}
                    onClick={() => {
                      setAnswers((a) => ({ ...a, [current.question_number]: v }));
                      setError(null);
                    }}
                    className={`${size} rounded-full border-2 text-sm font-semibold transition-all ${
                      isSel
                        ? "border-primary bg-primary text-primary-foreground glow-purple scale-110"
                        : "border-border bg-secondary/40 hover:border-primary/60 hover:bg-secondary"
                    }`}
                    aria-label={`Rating ${v}`}
                  >
                    {isSel ? <Check className="mx-auto h-4 w-4" /> : v}
                  </button>
                );
              })}
            </div>
            <div className="mt-2 flex justify-between px-1 text-[10px] uppercase tracking-wider text-muted-foreground">
              <span>Strongly left</span>
              <span>Neutral</span>
              <span>Strongly right</span>
            </div>

            <div className="mt-10 flex items-center justify-between">
              <button
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                disabled={step === 0}
                className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm transition-colors hover:bg-secondary disabled:opacity-40"
              >
                <ArrowLeft className="h-4 w-4" /> Previous
              </button>
              {step === total - 1 ? (
                <button
                  onClick={handleSubmit}
                  disabled={!answered || submitting}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:glow-purple disabled:opacity-40"
                >
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />} See results
                </button>
              ) : (
                <button
                  onClick={() => setStep((s) => Math.min(total - 1, s + 1))}
                  disabled={!answered}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:glow-purple disabled:opacity-40"
                >
                  Next <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>
            {error && <p className="mt-4 text-center text-xs text-destructive">{error}</p>}
          </div>
        </div>
      </section>
    </PageShell>
  );
}

function ResultsView({ data, onRetake }: { data: { result: PersonalityResult; type: MbtiType | null }; onRetake: () => void }) {
  const { result, type } = data;
  // Each score is sum of 12 items in [1..5] → range [12..60]. Convert to % toward right-side trait.
  const pct = (s: number) => Math.round(((s - 12) / 48) * 100);
  const dims = [
    { left: "Introversion", right: "Extroversion", pct: pct(result.ie_score), pickLeft: result.mbti_type[0] === "I" },
    { left: "Sensing", right: "Intuition", pct: pct(result.sn_score), pickLeft: result.mbti_type[1] === "S" },
    { left: "Feeling", right: "Thinking", pct: pct(result.ft_score), pickLeft: result.mbti_type[2] === "F" },
    { left: "Judging", right: "Perceiving", pct: pct(result.jp_score), pickLeft: result.mbti_type[3] === "J" },
  ];

  return (
    <PageShell>
      <section className="px-6 pt-16 pb-24">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.2em] text-accent">Your personality type</p>
            <h1 className="mt-4 text-7xl font-bold gradient-text md:text-8xl">{result.mbti_type}</h1>
            {type && <p className="mt-3 text-2xl font-semibold">{type.title}</p>}
            <p className="mt-1 text-xs text-muted-foreground">
              Completed {new Date(result.created_at).toLocaleDateString()}
            </p>
          </div>

          {type && (
            <div className="glass mt-10 rounded-3xl p-8">
              <p className="text-base leading-relaxed text-muted-foreground">{type.description}</p>
            </div>
          )}

          <div className="glass mt-6 rounded-3xl p-8">
            <h2 className="text-lg font-semibold">Dimension breakdown</h2>
            <div className="mt-6 space-y-6">
              {dims.map((d) => (
                <div key={d.left}>
                  <div className="flex items-center justify-between text-xs">
                    <span className={d.pickLeft ? "font-semibold text-foreground" : "text-muted-foreground"}>{d.left}</span>
                    <span className={!d.pickLeft ? "font-semibold text-foreground" : "text-muted-foreground"}>{d.right}</span>
                  </div>
                  <div className="relative mt-2 h-2 overflow-hidden rounded-full bg-secondary">
                    <div
                      className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-1000"
                      style={{ width: `${Math.max(2, Math.min(100, d.pct))}%` }}
                    />
                  </div>
                  <div className="mt-1 text-right text-[10px] text-muted-foreground">{d.pct}% {d.right.toLowerCase()}</div>
                </div>
              ))}
            </div>
          </div>

          {type && (
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="glass rounded-3xl p-6">
                <h3 className="text-sm font-semibold text-accent">Strengths</h3>
                <ul className="mt-3 space-y-2 text-sm">
                  {type.strengths.map((s) => (
                    <li key={s} className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 text-primary" /> {s}</li>
                  ))}
                </ul>
              </div>
              <div className="glass rounded-3xl p-6">
                <h3 className="text-sm font-semibold text-accent">Growth areas</h3>
                <ul className="mt-3 space-y-2 text-sm">
                  {type.weaknesses.map((s) => (
                    <li key={s} className="flex items-start gap-2"><Sparkles className="mt-0.5 h-4 w-4 text-primary" /> {s}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <button onClick={onRetake} className="rounded-full border border-border px-6 py-3 text-sm hover:bg-secondary">Retake</button>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
