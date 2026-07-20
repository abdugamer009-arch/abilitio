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
} from "@/lib/assessment/iq-test";
import { useT, useI18n } from "@/lib/i18n";
import { IQ_TEST_TRANSLATIONS } from "@/lib/assessment/iq-test-translations";
import { track, AnalyticsEvent } from "@/lib/analytics";
import { useAuth } from "@/lib/auth-context";
import { useServerFn } from "@tanstack/react-start";
import { ensureMyCommunity } from "@/lib/community/community.functions";
import { toast } from "sonner";

function tIQPrompt(id: number, original: string, lang: string): string {
  if (lang === "en") return original;
  return IQ_TEST_TRANSLATIONS[id]?.[lang as "ru" | "uz"]?.prompt ?? original;
}
function tIQNote(id: number, original: string | undefined, lang: string): string | undefined {
  if (lang === "en" || !original) return original;
  return IQ_TEST_TRANSLATIONS[id]?.[lang as "ru" | "uz"]?.note ?? original;
}
function tIQOpts(id: number, options: string[], lang: string): string[] {
  if (lang === "en") return options;
  return IQ_TEST_TRANSLATIONS[id]?.[lang as "ru" | "uz"]?.options ?? options;
}

export const Route = createFileRoute("/iq-test")({
  head: () => ({
    meta: [
      { title: "IQ Test — Abilitio" },
      {
        name: "description",
        content:
          "40-question IQ test measuring verbal, numerical, spatial and logical reasoning. 90 minutes.",
      },
    ],
  }),
  component: IQTestPage,
});

function fmt(sec: number) {
  const m = Math.floor(sec / 60)
    .toString()
    .padStart(2, "0");
  const s = (sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

// Persist an in-progress IQ attempt so a reload or crash never loses 90 minutes
// of work. We store the absolute deadline (not a ticking counter) so the clock
// keeps running in real time — closing the tab can't buy extra time.
const IQ_PROGRESS_KEY = "abilitio.iq_test.progress.v1";
type IqSavedProgress = { step: number; answers: (number | null)[]; deadline: number };

function IQTestPage() {
  const t = useT();
  const { lang } = useI18n();
  const catLabel = (cat: IQCategory) =>
    (
      ({
        verbal: t.iqTest.categoryVerbal,
        numerical: t.iqTest.categoryNumerical,
        spatial: t.iqTest.categorySpatial,
        logical: t.iqTest.categoryLogical,
      }) as Record<IQCategory, string>
    )[cat] ?? CATEGORY_LABELS[cat];
  const [phase, setPhase] = useState<"intro" | "test" | "results">("intro");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(40).fill(null));
  const [timeLeft, setTimeLeft] = useState(IQ_TIME_LIMIT_SECONDS);
  const [elapsed, setElapsed] = useState(0);
  const [deadline, setDeadline] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Deadline-driven clock. Re-syncs to wall-clock time on each tick, so it stays
  // accurate after a reload (where it resumes from the persisted deadline).
  useEffect(() => {
    if (phase !== "test" || deadline == null) return;
    const tick = () => {
      const left = Math.max(0, Math.round((deadline - Date.now()) / 1000));
      setTimeLeft(left);
      setElapsed(IQ_TIME_LIMIT_SECONDS - left);
      if (left <= 0) {
        clearInterval(timerRef.current!);
        setPhase("results");
        track(AnalyticsEvent.IqCompleted, { reason: "timeout" });
      }
    };
    tick(); // sync immediately on enter / restore
    timerRef.current = setInterval(tick, 1000);
    return () => clearInterval(timerRef.current!);
  }, [phase, deadline]);

  // Restore an interrupted attempt on mount (client-only).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(IQ_PROGRESS_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw) as IqSavedProgress;
      if (!Array.isArray(saved.answers) || saved.answers.length !== 40) return;
      setAnswers(saved.answers);
      setStep(Math.min(Math.max(saved.step ?? 0, 0), 39));
      setDeadline(saved.deadline);
      if (saved.deadline - Date.now() > 0) {
        setPhase("test");
      } else {
        // Time expired while the tab was closed — score what they had.
        setTimeLeft(0);
        setElapsed(IQ_TIME_LIMIT_SECONDS);
        setPhase("results");
      }
    } catch {
      // Corrupt or outdated payload — ignore and start fresh.
    }
  }, []);

  // Persist on answer / step change (deadline is stable, so no per-second writes).
  useEffect(() => {
    if (phase !== "test" || deadline == null) return;
    try {
      localStorage.setItem(
        IQ_PROGRESS_KEY,
        JSON.stringify({ step, answers, deadline } satisfies IqSavedProgress),
      );
    } catch {
      // Storage full or unavailable — non-fatal.
    }
  }, [phase, deadline, step, answers]);

  // Clear persisted progress once the attempt is over (finish, timeout, or restore-to-results).
  useEffect(() => {
    if (phase === "results") {
      try {
        localStorage.removeItem(IQ_PROGRESS_KEY);
      } catch {
        /* non-fatal */
      }
    }
  }, [phase]);

  // First test completed → the system assigns a community automatically, no
  // second test required. Server-side no-op if they already belong to one, so
  // this never overrides a career-assessment placement. Best-effort: a failure
  // here must not disturb the results screen.
  const { user } = useAuth();
  const joinCommunity = useServerFn(ensureMyCommunity);
  useEffect(() => {
    if (phase !== "results" || !user) return;
    joinCommunity()
      .then((res) => {
        if (res.joined && res.community) {
          toast.success(`You've been added to the ${res.community.name} community.`);
        }
      })
      .catch(() => {
        /* silent — community join is a bonus on this screen, not the result */
      });
  }, [phase, user, joinCommunity]);

  function start() {
    setPhase("test");
    setStep(0);
    setAnswers(Array(40).fill(null));
    setTimeLeft(IQ_TIME_LIMIT_SECONDS);
    setElapsed(0);
    setDeadline(Date.now() + IQ_TIME_LIMIT_SECONDS * 1000);
    track(AnalyticsEvent.IqStarted);
  }

  function finish() {
    clearInterval(timerRef.current!);
    setPhase("results");
    track(AnalyticsEvent.IqCompleted, { reason: "submitted" });
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

  const bandRows: [string, string][] = [
    ["36–40", t.iqTest.bandExceptional],
    ["31–35", t.iqTest.bandExcellent],
    ["25–30", t.iqTest.bandVeryGood],
    ["19–24", t.iqTest.bandGood],
    ["15–18", t.iqTest.bandAverage],
    ["Below 15", t.iqTest.bandBelowAverage],
  ];

  if (phase === "intro") {
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
              <h1 className="mt-6 text-4xl font-bold gradient-text">{t.iqTest.title}</h1>
              <p className="mt-3 text-muted-foreground text-sm">{t.iqTest.subtitle}</p>
              <p className="mt-1 text-xs text-muted-foreground">{t.iqTest.sourceNote}</p>

              <div className="mt-8 grid gap-4 md:grid-cols-4 text-left">
                {(["verbal", "numerical", "spatial", "logical"] as IQCategory[]).map((cat) => (
                  <div
                    key={cat}
                    className="group relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-secondary/40 to-background/40 p-4 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-[0_8px_24px_-10px_oklch(0.55_0.22_295_/_0.3)]"
                  >
                    <div
                      className="pointer-events-none absolute -right-6 -top-6 h-16 w-16 rounded-full opacity-30 blur-2xl transition-opacity group-hover:opacity-60"
                      style={{ background: CATEGORY_COLORS[cat] }}
                    />
                    <span
                      className="relative inline-block mb-2 rounded-full px-2.5 py-0.5 text-[10px] font-semibold text-white shadow-[0_2px_8px_-2px_rgba(0,0,0,0.3)]"
                      style={{ background: CATEGORY_COLORS[cat] }}
                    >
                      {CATEGORY_LABELS[cat]}
                    </span>
                    <p className="relative text-xs text-muted-foreground">
                      {IQ_QUESTIONS.filter((q) => q.category === cat).length} {t.iqTest.questions}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-left text-xs text-muted-foreground">
                <strong className="text-foreground">{t.iqTest.instructions}:</strong>{" "}
                {t.iqTest.instructionsBody}
              </div>

              <button
                onClick={start}
                className="cta-sheen relative mt-8 inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-primary to-accent px-8 py-3 text-sm font-medium text-primary-foreground shadow-[0_8px_28px_-8px_var(--glow)] hover:-translate-y-0.5 transition-all"
              >
                {t.iqTest.startBtn} <ArrowRight className="h-4 w-4" />
              </button>
              <p className="mt-3 text-xs text-muted-foreground">{t.iqTest.timeLimit}</p>
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
                <span
                  className="absolute -inset-1 -z-10 rounded-2xl opacity-50 blur-md"
                  style={{
                    background:
                      "radial-gradient(circle, oklch(0.65 0.24 295 / 0.5), transparent 70%)",
                  }}
                />
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
                {t.iqTest.timeTaken}: {fmt(elapsed)}
              </div>

              {/* Band table */}
              <div className="mt-6 text-left">
                <div className="overflow-hidden rounded-2xl border border-border/60">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-border bg-secondary/40">
                        <th className="px-4 py-2 text-left font-semibold">{t.iqTest.scoreLabel}</th>
                        <th className="px-4 py-2 text-left font-semibold">
                          {t.iqTest.ratingLabel}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {bandRows.map(([s, r]) => (
                        <tr
                          key={s}
                          className={`border-b border-border/50 ${r === band.label ? "bg-primary/10 font-semibold" : ""}`}
                        >
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
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-[0_3px_10px_-3px_var(--glow)]">
                  <BarChart3 className="h-4 w-4" />
                </span>
                <h2 className="text-lg font-semibold">{t.iqTest.performanceByCategory}</h2>
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
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-[0_3px_10px_-3px_var(--glow)]">
                  <BarChart3 className="h-4 w-4" />
                </span>
                <h2 className="text-lg font-semibold">{t.iqTest.questionReview}</h2>
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
                      <span className="shrink-0 font-mono text-xs w-6 text-center mt-0.5">
                        {q.id}
                      </span>
                      <span
                        className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold text-white"
                        style={{ background: CATEGORY_COLORS[q.category] }}
                      >
                        {catLabel(q.category)}
                      </span>
                      <span className="flex-1 line-clamp-2">
                        {tIQPrompt(q.id, q.prompt, lang).split("\n")[0]}
                      </span>
                      <span className="shrink-0 text-xs font-medium">
                        {skipped
                          ? "—"
                          : isCorrect
                            ? "✓"
                            : `✗ → ${tIQOpts(q.id, q.options, lang)[q.correct]}`}
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
                {t.iqTest.retake} <ArrowRight className="h-4 w-4" />
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
              {catLabel(q.category)}
            </span>
            <span>
              {t.iqTest.question} {step + 1} / 40
            </span>
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
            <h2 className="text-lg font-semibold leading-relaxed whitespace-pre-line">
              {tIQPrompt(q.id, q.prompt, lang)}
            </h2>
            {q.note && (
              <p className="mt-2 text-xs text-muted-foreground italic">
                {tIQNote(q.id, q.note, lang)}
              </p>
            )}

            <div
              role="radiogroup"
              aria-label={`${t.iqTest.question} ${step + 1}`}
              className="mt-6 space-y-2"
            >
              {tIQOpts(q.id, q.options, lang).map((opt, i) => {
                const isSelected = selected === i;
                return (
                  <label key={i} className="block cursor-pointer">
                    <input
                      type="radio"
                      name={`iq-${q.id}`}
                      checked={isSelected}
                      onChange={() =>
                        setAnswers((prev) => {
                          const next = [...prev];
                          next[step] = i;
                          return next;
                        })
                      }
                      className="sr-only peer"
                    />
                    <div
                      className={`w-full rounded-xl border px-4 py-3 text-left transition peer-focus-visible:ring-2 peer-focus-visible:ring-primary/70 ${
                        isSelected
                          ? "border-primary bg-primary/10"
                          : "border-border hover:bg-secondary/40"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold ${isSelected ? "bg-primary border-primary text-primary-foreground" : "border-border text-muted-foreground"}`}
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

            {/* Navigation */}
            <div className="mt-8 flex items-center justify-between">
              <button
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                disabled={step === 0}
                className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-5 py-2 text-sm text-primary/80 disabled:opacity-40 hover:border-primary/50 hover:bg-primary/10 transition-all"
              >
                <ArrowLeft className="h-4 w-4" /> {t.iqTest.back}
              </button>

              {/* Dot nav for quick jump */}
              <div className="hidden sm:flex items-center gap-1">
                {Array.from({ length: 40 }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setStep(i)}
                    title={`${t.iqTest.question} ${i + 1}`}
                    className={`h-2 w-2 rounded-full transition-all ${
                      i === step
                        ? "bg-gradient-to-br from-primary to-accent scale-125 shadow-[0_0_6px_-1px_var(--glow)]"
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
                  {t.iqTest.next} <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  onClick={finish}
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-accent px-6 py-2 text-sm text-primary-foreground shadow-[0_4px_16px_-6px_var(--glow)] hover:-translate-y-0.5 transition-all"
                >
                  <Trophy className="h-4 w-4" /> {t.iqTest.submit}
                </button>
              )}
            </div>

            {/* Unanswered warning on last question */}
            {step === 39 && answers.filter((a) => a === null).length > 0 && (
              <p className="mt-3 text-center text-xs text-amber-400">
                ⚠ {answers.filter((a) => a === null).length} {t.iqTest.unansweredWarning}
              </p>
            )}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
