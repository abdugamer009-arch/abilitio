import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Brain, Clock, Trophy, BarChart3 } from "lucide-react";
import { CountUp } from "@/components/CountUp";
import {
  IQ_QUESTIONS,
  IQ_BAND,
  CATEGORY_COLORS,
  CATEGORY_LABELS,
  IQ_TIME_LIMIT_SECONDS,
  type IQCategory,
} from "@/lib/iq-test";

export const Route = createFileRoute("/iq-test")({
  head: () => ({
    meta: [
      { title: "IQ Test — Abilitio" },
      { name: "description", content: "40-question IQ test measuring verbal, numerical, spatial and logical reasoning. 90 minutes." },
    ],
  }),
  component: IQTestPage,
});

function fmt(sec: number) {
  const m = Math.floor(sec / 60).toString().padStart(2, "0");
  const s = (sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function IQTestPage() {
  const [phase, setPhase] = useState<"intro" | "test" | "results">("intro");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(40).fill(null));
  const [timeLeft, setTimeLeft] = useState(IQ_TIME_LIMIT_SECONDS);
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (phase !== "test") return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          setPhase("results");
          return 0;
        }
        return t - 1;
      });
      setElapsed((e) => e + 1);
    }, 1000);
    return () => clearInterval(timerRef.current!);
  }, [phase]);

  function start() {
    setPhase("test");
    setStep(0);
    setAnswers(Array(40).fill(null));
    setTimeLeft(IQ_TIME_LIMIT_SECONDS);
    setElapsed(0);
  }

  function finish() {
    clearInterval(timerRef.current!);
    setPhase("results");
  }

  const q = IQ_QUESTIONS[step];
  const selected = answers[step];
  const progress = ((step + 1) / 40) * 100;

  // Results computation
  const score = answers.filter((a, i) => a === IQ_QUESTIONS[i].correct).length;
  const band = IQ_BAND(score);
  const byCat = (["verbal", "numerical", "spatial", "logical"] as IQCategory[]).map((cat) => {
    const qs = IQ_QUESTIONS.filter((q) => q.category === cat);
    const correct = qs.filter((q, _) => answers[q.id - 1] === q.correct).length;
    return { cat, correct, total: qs.length };
  });

  if (phase === "intro") {
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
              <h1 className="mt-6 text-4xl font-bold gradient-text">IQ Test</h1>
              <p className="mt-3 text-muted-foreground text-sm">
                40 questions · 90 minutes · Verbal, Numerical, Spatial & Logical reasoning
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Source: Philip Carter, <em>The Complete Book of Intelligence Tests</em> (Wiley, 2005)
              </p>

              <div className="mt-8 grid gap-4 md:grid-cols-4 text-left">
                {(["verbal", "numerical", "spatial", "logical"] as IQCategory[]).map((cat) => (
                  <div key={cat} className="rounded-2xl border border-border/60 bg-secondary/30 p-4 transition-all hover:-translate-y-0.5 hover:border-primary/30">
                    <span
                      className="inline-block mb-2 rounded-full px-2.5 py-0.5 text-[10px] font-semibold text-white shadow-sm"
                      style={{ background: CATEGORY_COLORS[cat] }}
                    >
                      {CATEGORY_LABELS[cat]}
                    </span>
                    <p className="text-xs text-muted-foreground">
                      {IQ_QUESTIONS.filter((q) => q.category === cat).length} questions
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-left text-xs text-muted-foreground">
                <strong className="text-foreground">Instructions:</strong> One question at a time. You can go back to review previous answers. The test ends when time runs out or you submit. Some spatial questions describe visual puzzles — reason from the description.
              </div>

              <button
                onClick={start}
                className="cta-sheen relative mt-8 inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-primary to-accent px-8 py-3 text-sm font-medium text-primary-foreground shadow-[0_8px_28px_-8px_var(--glow)] hover:-translate-y-0.5 transition-all"
              >
                Start Test <ArrowRight className="h-4 w-4" />
              </button>
              <p className="mt-3 text-xs text-muted-foreground">90-minute time limit</p>
            </div>
          </div>
        </section>
      </PageShell>
    );
  }

  if (phase === "results") {
    return (
      <PageShell>
        <section className="relative px-6 pt-12 pb-24">
          <div aria-hidden className="bg-grid pointer-events-none absolute inset-0" />
          <div className="relative mx-auto max-w-3xl space-y-6">
            {/* Score card */}
            <div className="glass rounded-3xl p-10 text-center animate-fade-up">
              <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-[0_8px_30px_-10px_var(--glow)]">
                <Trophy className="h-8 w-8" />
                <span className="absolute -inset-1 -z-10 rounded-2xl opacity-50 blur-md" style={{ background: "radial-gradient(circle, oklch(0.65 0.24 295 / 0.5), transparent 70%)" }} />
              </div>
              <div className="mt-4 text-7xl font-bold gradient-text tabular-nums">
                <CountUp value={score} duration={1200} />
                <span className="text-3xl text-muted-foreground">/40</span>
              </div>
              <div
                className="mt-3 inline-block rounded-full px-5 py-1.5 text-sm font-semibold text-white"
                style={{ background: band.color }}
              >
                {band.label}
              </div>
              <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                Time taken: {fmt(elapsed)}
              </div>

              {/* Band table */}
              <div className="mt-6 text-left">
                <div className="overflow-hidden rounded-2xl border border-border">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-border bg-secondary/40">
                        <th className="px-4 py-2 text-left font-semibold">Score</th>
                        <th className="px-4 py-2 text-left font-semibold">Rating</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ["36–40", "Exceptional"],
                        ["31–35", "Excellent"],
                        ["25–30", "Very Good"],
                        ["19–24", "Good"],
                        ["15–18", "Average"],
                        ["Below 15", "Below Average"],
                      ].map(([s, r]) => (
                        <tr key={s} className={`border-b border-border/50 ${r === band.label ? "bg-primary/10 font-semibold" : ""}`}>
                          <td className="px-4 py-2">{s}</td>
                          <td className="px-4 py-2">{r}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Category breakdown */}
            <div className="glass rounded-3xl p-8">
              <div className="flex items-center gap-2 mb-6">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-[0_3px_10px_-3px_var(--glow)]"><BarChart3 className="h-4 w-4" /></span>
                <h2 className="text-lg font-semibold">Performance by Category</h2>
              </div>
              <div className="space-y-4">
                {byCat.map(({ cat, correct, total }) => {
                  const pct = Math.round((correct / total) * 100);
                  return (
                    <div key={cat}>
                      <div className="mb-1.5 flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2">
                          <span
                            className="inline-block h-2.5 w-2.5 rounded-full"
                            style={{ background: CATEGORY_COLORS[cat] }}
                          />
                          {CATEGORY_LABELS[cat]}
                        </span>
                        <span className="tabular-nums text-muted-foreground">
                          {correct}/{total} ({pct}%)
                        </span>
                      </div>
                      <div className="h-2.5 overflow-hidden rounded-full bg-secondary/60">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${pct}%`, background: CATEGORY_COLORS[cat] }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Question review */}
            <div className="glass rounded-3xl p-8">
              <div className="flex items-center gap-2.5 mb-4">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-[0_3px_10px_-3px_var(--glow)]"><BarChart3 className="h-4 w-4" /></span>
                <h2 className="text-lg font-semibold">Question Review</h2>
              </div>
              <div className="space-y-3">
                {IQ_QUESTIONS.map((q, i) => {
                  const given = answers[i];
                  const isCorrect = given === q.correct;
                  const skipped = given === null;
                  return (
                    <div
                      key={q.id}
                      className={`flex items-start gap-3 rounded-xl border p-3 text-sm ${
                        skipped
                          ? "border-border/40 bg-secondary/20 text-muted-foreground"
                          : isCorrect
                          ? "border-green-500/30 bg-green-500/10"
                          : "border-red-500/30 bg-red-500/10"
                      }`}
                    >
                      <span className="shrink-0 font-mono text-xs w-6 text-center mt-0.5">{q.id}</span>
                      <span
                        className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold text-white"
                        style={{ background: CATEGORY_COLORS[q.category] }}
                      >
                        {CATEGORY_LABELS[q.category]}
                      </span>
                      <span className="flex-1 line-clamp-2">{q.prompt.split("\n")[0]}</span>
                      <span className="shrink-0 text-xs font-medium">
                        {skipped ? "—" : isCorrect ? "✓" : `✗ → ${q.options[q.correct]}`}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={start}
                className="cta-sheen relative overflow-hidden inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-accent px-8 py-3 text-sm font-medium text-primary-foreground shadow-[0_8px_28px_-8px_var(--glow)] hover:-translate-y-0.5 transition-all"
              >
                Retake Test <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>
      </PageShell>
    );
  }

  // Test phase
  return (
    <PageShell>
      <section className="px-6 pt-12 pb-24">
        <div className="mx-auto max-w-3xl">
          {/* Header row */}
          <div className="mb-3 flex items-center justify-between text-xs text-muted-foreground">
            <span
              className="inline-block rounded-full px-3 py-1 text-[11px] font-semibold text-white"
              style={{ background: CATEGORY_COLORS[q.category] }}
            >
              {CATEGORY_LABELS[q.category]}
            </span>
            <span>Question {step + 1} / 40</span>
            <span
              className={`flex items-center gap-1.5 font-mono font-semibold ${timeLeft < 300 ? "text-red-400" : "text-foreground"}`}
            >
              <Clock className="h-3.5 w-3.5" />
              {fmt(timeLeft)}
            </span>
          </div>

          {/* Progress bar */}
          <div className="h-2 w-full overflow-hidden rounded-full bg-secondary/60">
            <div
              className="h-full bg-gradient-to-r from-primary to-accent transition-all"
              style={{ width: `${progress}%`, boxShadow: "0 0 8px oklch(0.65 0.22 295 / 0.5)" }}
            />
          </div>

          {/* Question card */}
          <div className="glass mt-6 rounded-3xl p-8">
            <h2 className="text-lg font-semibold leading-relaxed whitespace-pre-line">{q.prompt}</h2>
            {q.note && (
              <p className="mt-2 text-xs text-muted-foreground italic">{q.note}</p>
            )}

            <div className="mt-6 space-y-2">
              {q.options.map((opt, i) => {
                const isSelected = selected === i;
                return (
                  <button
                    key={i}
                    onClick={() =>
                      setAnswers((prev) => {
                        const next = [...prev];
                        next[step] = i;
                        return next;
                      })
                    }
                    className={`w-full rounded-xl border px-4 py-3 text-left transition ${
                      isSelected
                        ? "border-primary bg-primary/10"
                        : "border-border hover:bg-secondary/40"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold ${isSelected ? "bg-primary border-primary text-primary-foreground" : "border-border text-muted-foreground"}`}>
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span className="text-sm">{opt}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Navigation */}
            <div className="mt-8 flex items-center justify-between">
              <button
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                disabled={step === 0}
                className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2 text-sm disabled:opacity-40 hover:bg-secondary/50 transition"
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </button>

              {/* Dot nav for quick jump */}
              <div className="hidden sm:flex items-center gap-1">
                {Array.from({ length: 40 }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setStep(i)}
                    title={`Question ${i + 1}`}
                    className={`h-2 w-2 rounded-full transition-all ${
                      i === step
                        ? "bg-primary scale-125"
                        : answers[i] !== null
                        ? "bg-primary/40"
                        : "bg-border"
                    }`}
                  />
                ))}
              </div>

              {step < 39 ? (
                <button
                  onClick={() => setStep((s) => s + 1)}
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-accent px-6 py-2 text-sm text-primary-foreground shadow-[0_4px_16px_-6px_var(--glow)] hover:-translate-y-0.5 transition-all"
                >
                  Next <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  onClick={finish}
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-accent px-6 py-2 text-sm text-primary-foreground shadow-[0_4px_16px_-6px_var(--glow)] hover:-translate-y-0.5 transition-all"
                >
                  <Trophy className="h-4 w-4" /> Submit
                </button>
              )}
            </div>

            {/* Unanswered warning on last question */}
            {step === 39 && answers.filter((a) => a === null).length > 0 && (
              <p className="mt-3 text-center text-xs text-amber-400">
                ⚠ {answers.filter((a) => a === null).length} question(s) unanswered. You can still submit.
              </p>
            )}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
