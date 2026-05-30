import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { useEffect, useState } from "react";
import { ArrowRight, ArrowLeft, Check, Brain, Clock } from "lucide-react";
import { questions } from "@/lib/iq-questions";

export const Route = createFileRoute("/iq-test")({
  head: () => ({
    meta: [
      { title: "IQ Test — Abilitio" },
      { name: "description", content: "Take a premium 10-question IQ test measuring logic, analysis, and pattern recognition." },
    ],
  }),
  component: IQTestPage,
});

const TOTAL_SECONDS = 10 * 60; // 10 min

function IQTestPage() {
  const navigate = useNavigate();
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(questions.length).fill(null));
  const [secondsLeft, setSecondsLeft] = useState(TOTAL_SECONDS);

  useEffect(() => {
    if (!started) return;
    const id = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(id);
          finish(answers);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started]);

  const progress = ((step) / questions.length) * 100;
  const select = (i: number) => {
    const next = [...answers];
    next[step] = i;
    setAnswers(next);
  };

  function finish(final: (number | null)[]) {
    sessionStorage.setItem("iq_answers", JSON.stringify(final));
    navigate({ to: "/results" });
  }

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");

  if (!started) {
    return (
      <PageShell>
        <section className="px-6 pt-20 pb-24">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent glow-purple">
              <Brain className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="mt-8 text-4xl font-bold md:text-5xl gradient-text">IQ Assessment</h1>
            <p className="mt-4 text-muted-foreground">
              10 questions · 10 minutes · logic, analysis & pattern recognition
            </p>
            <div className="glass mt-10 rounded-3xl p-8 text-left">
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>• Answer each question carefully — you can navigate back</li>
                <li>• A timer runs for the full test</li>
                <li>• Your results will be saved to your account</li>
              </ul>
            </div>
            <button
              onClick={() => setStarted(true)}
              className="mt-10 inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-base font-medium text-primary-foreground transition-all hover:glow-purple hover:-translate-y-0.5"
            >
              Start IQ Test <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </section>
      </PageShell>
    );
  }

  const done = step >= questions.length;
  const q = !done ? questions[step] : null;

  return (
    <PageShell>
      <section className="px-6 pt-12 pb-24">
        <div className="mx-auto max-w-2xl">
          <div className="mb-4 flex items-center justify-between text-xs text-muted-foreground">
            <span>Question {Math.min(step + 1, questions.length)} of {questions.length}</span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1">
              <Clock className="h-3 w-3" /> {mm}:{ss}
            </span>
          </div>
          <div className="mb-10 h-1 overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
              style={{ width: `${done ? 100 : progress}%` }}
            />
          </div>

          {q && (
            <div key={step} className="glass animate-fade-up rounded-3xl p-8 md:p-10">
              <span className="text-xs uppercase tracking-wider text-accent">{q.category}</span>
              <h2 className="mt-2 text-2xl font-semibold leading-snug md:text-3xl">{q.prompt}</h2>
              {q.hint && (
                <div className="mt-4 rounded-xl bg-secondary/60 px-4 py-3 font-mono text-lg tracking-wide">
                  {q.hint}
                </div>
              )}
              <div className="mt-8 space-y-3">
                {q.options.map((opt, i) => {
                  const selected = answers[step] === i;
                  return (
                    <button
                      key={opt}
                      onClick={() => select(i)}
                      className={`group flex w-full items-center justify-between rounded-2xl border px-5 py-4 text-left text-sm transition-all ${
                        selected
                          ? "border-primary bg-primary/15 glow-purple"
                          : "border-border bg-secondary/40 hover:border-primary/60 hover:bg-secondary"
                      }`}
                    >
                      <span>{opt}</span>
                      <span
                        className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                          selected ? "border-accent bg-accent text-accent-foreground" : "border-border"
                        }`}
                      >
                        {selected && <Check className="h-3 w-3" />}
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
                    if (step === questions.length - 1) {
                      finish(answers);
                    } else {
                      setStep((s) => s + 1);
                    }
                  }}
                  disabled={answers[step] === null}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:glow-purple disabled:opacity-40"
                >
                  {step === questions.length - 1 ? "See Results" : "Next"} <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </PageShell>
  );
}
