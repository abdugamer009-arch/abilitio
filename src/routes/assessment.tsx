import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { useState } from "react";
import { ArrowRight, ArrowLeft, Check } from "lucide-react";

export const Route = createFileRoute("/assessment")({
  head: () => ({
    meta: [
      { title: "Talent Assessment — Abilitio" },
      { name: "description", content: "Begin your AI-powered talent assessment. Roughly 15 minutes." },
    ],
  }),
  component: AssessmentPage,
});

const questions = [
  { q: "When solving a problem, I prefer to…", opts: ["Sketch it out visually", "Break it into logical steps", "Talk it through with others", "Try and iterate quickly"] },
  { q: "I feel most energized when I…", opts: ["Create something new", "Help someone grow", "Solve a complex puzzle", "Lead a team forward"] },
  { q: "My ideal workspace is…", opts: ["Quiet and minimal", "Collaborative and lively", "Outdoors or moving", "Structured and organized"] },
  { q: "I learn best by…", opts: ["Doing and experimenting", "Reading and reflecting", "Listening and discussing", "Watching and modeling"] },
  { q: "What matters most to me is…", opts: ["Creativity", "Impact", "Mastery", "Freedom"] },
];

function AssessmentPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(questions.length).fill(null));
  const done = step >= questions.length;
  const progress = ((done ? questions.length : step) / questions.length) * 100;

  const select = (i: number) => {
    const next = [...answers];
    next[step] = i;
    setAnswers(next);
  };

  return (
    <PageShell>
      <section className="px-6 pt-16 pb-24">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8 flex items-center justify-between text-xs text-muted-foreground">
            <span>Talent Assessment</span>
            <span>{done ? "Complete" : `${step + 1} of ${questions.length}`}</span>
          </div>
          <div className="mb-10 h-1 overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          {!done ? (
            <div key={step} className="glass animate-fade-up rounded-3xl p-8 md:p-10">
              <h2 className="text-2xl font-semibold leading-snug md:text-3xl">{questions[step].q}</h2>
              <div className="mt-8 space-y-3">
                {questions[step].opts.map((opt, i) => {
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
                  onClick={() => setStep((s) => s + 1)}
                  disabled={answers[step] === null}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:glow-purple disabled:opacity-40"
                >
                  {step === questions.length - 1 ? "See Results" : "Next"} <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="glass animate-fade-up rounded-3xl p-10 text-center glow-purple">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent">
                <Check className="h-6 w-6 text-primary-foreground" />
              </div>
              <h2 className="mt-6 text-3xl font-bold">You're all done</h2>
              <p className="mt-3 text-muted-foreground">Our AI is now mapping your talent profile. View your personalized dashboard.</p>
              <a
                href="/dashboard"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:glow-purple"
              >
                Open Dashboard <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          )}
        </div>
      </section>
    </PageShell>
  );
}
