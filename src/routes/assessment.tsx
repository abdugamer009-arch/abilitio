import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { useEffect, useState } from "react";
import { ArrowRight, ArrowLeft, Check, Brain, Clock, Sparkles, Target, Heart } from "lucide-react";
import { allQuestions, type AnyQuestion } from "@/lib/assessment";

export const Route = createFileRoute("/assessment")({
  head: () => ({
    meta: [
      { title: "Talent Assessment — Abilitio" },
      { name: "description", content: "Discover your IQ, personality, and best-fit careers with a 30-question AI assessment." },
    ],
  }),
  component: AssessmentPage,
});

const TOTAL_SECONDS = 20 * 60;

const SECTION_META = {
  iq: { label: "IQ Test", icon: Brain, desc: "Logic & reasoning" },
  interests: { label: "Interests & Abilities", icon: Target, desc: "Strengths & passions" },
  mbti: { label: "Personality (MBTI)", icon: Heart, desc: "How you think & feel" },
} as const;

function AssessmentPage() {
  const navigate = useNavigate();
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [secondsLeft, setSecondsLeft] = useState(TOTAL_SECONDS);
  const [startedAt] = useState(() => Date.now());

  useEffect(() => {
    if (!started) return;
    const id = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) { clearInterval(id); finish(answers); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started]);

  const total = allQuestions.length;
  const q: AnyQuestion | null = step < total ? allQuestions[step] : null;
  const progress = (step / total) * 100;

  const select = (i: number) => {
    if (!q) return;
    setAnswers((a) => ({ ...a, [q.id]: i }));
  };

  function finish(final: Record<string, number>) {
    const elapsed = Math.floor((Date.now() - startedAt) / 1000);
    sessionStorage.setItem("assessment_answers", JSON.stringify(final));
    sessionStorage.setItem("assessment_seconds", String(elapsed));
    navigate({ to: "/results" });
  }

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");

  if (!started) {
    return (
      <PageShell>
        <section className="px-6 pt-20 pb-24">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent glow-purple">
              <Sparkles className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="mt-8 text-4xl font-bold md:text-5xl gradient-text">Talent Assessment</h1>
            <p className="mt-4 text-muted-foreground">
              30 questions · ~15 minutes · AI-powered career matching
            </p>

            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {(["iq", "interests", "mbti"] as const).map((k) => {
                const m = SECTION_META[k];
                const Icon = m.icon;
                return (
                  <div key={k} className="glass rounded-2xl p-6 text-left hover-glow">
                    <Icon className="h-5 w-5 text-accent" />
                    <h3 className="mt-4 font-semibold">{m.label}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">{m.desc} · 10 questions</p>
                  </div>
                );
              })}
            </div>

            <div className="glass mt-8 rounded-3xl p-7 text-left text-sm text-muted-foreground">
              <ul className="space-y-2">
                <li>• Answer honestly — there are no wrong answers in interests & personality.</li>
                <li>• A timer of 20 minutes runs for the entire assessment.</li>
                <li>• Your top 3 careers are computed from all three sections combined.</li>
                <li>• Results are saved to your account after you sign in.</li>
              </ul>
            </div>

            <button
              onClick={() => setStarted(true)}
              className="mt-10 inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-base font-medium text-primary-foreground transition-all hover:glow-purple hover:-translate-y-0.5"
            >
              Start Assessment <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </section>
      </PageShell>
    );
  }

  if (!q) return null;
  const section = SECTION_META[q.section];
  const SectionIcon = section.icon;
  const selected = answers[q.id];

  const options =
    q.section === "iq"
      ? q.options.map((o) => ({ label: o }))
      : q.options.map((o) => ({ label: o.label }));

  return (
    <PageShell>
      <section className="px-6 pt-12 pb-24">
        <div className="mx-auto max-w-2xl">
          <div className="mb-4 flex items-center justify-between text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <SectionIcon className="h-3.5 w-3.5 text-accent" /> {section.label} · {step + 1}/{total}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1">
              <Clock className="h-3 w-3" /> {mm}:{ss}
            </span>
          </div>
          <div className="mb-10 h-1 overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div key={q.id} className="glass animate-fade-up rounded-3xl p-8 md:p-10">
            <span className="text-xs uppercase tracking-wider text-accent">{section.label}</span>
            <h2 className="mt-2 text-2xl font-semibold leading-snug md:text-3xl">{q.section === "iq" || q.section === "interests" || q.section === "mbti" ? q.prompt : ""}</h2>
            {q.section === "iq" && q.hint && (
              <div className="mt-4 rounded-xl bg-secondary/60 px-4 py-3 font-mono text-lg tracking-wide">{q.hint}</div>
            )}

            <div className="mt-8 space-y-3">
              {options.map((opt, i) => {
                const isSel = selected === i;
                return (
                  <button
                    key={i}
                    onClick={() => select(i)}
                    className={`group flex w-full items-center justify-between rounded-2xl border px-5 py-4 text-left text-sm transition-all ${
                      isSel ? "border-primary bg-primary/15 glow-purple" : "border-border bg-secondary/40 hover:border-primary/60 hover:bg-secondary"
                    }`}
                  >
                    <span>{opt.label}</span>
                    <span className={`flex h-5 w-5 items-center justify-center rounded-full border ${isSel ? "border-accent bg-accent text-accent-foreground" : "border-border"}`}>
                      {isSel && <Check className="h-3 w-3" />}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-10 flex items-center justify-between">
              <button
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                disabled={step === 0}
                className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm transition-colors hover:bg-secondary disabled:opacity-40"
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
              <button
                onClick={() => {
                  if (step === total - 1) finish(answers);
                  else setStep((s) => s + 1);
                }}
                disabled={selected == null}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:glow-purple disabled:opacity-40"
              >
                {step === total - 1 ? "See Results" : "Next"} <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
