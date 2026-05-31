import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, ArrowLeft, Check, Brain, Clock, Sparkles, Target, Heart, RotateCcw } from "lucide-react";
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
const STORAGE_KEY = "abilitio_assessment_session_v1";

const SECTION_META = {
  iq: { label: "IQ Test", icon: Brain, desc: "Logic & reasoning" },
  interests: { label: "Interests & Abilities", icon: Target, desc: "Strengths & passions" },
  mbti: { label: "Personality (MBTI)", icon: Heart, desc: "How you think & feel" },
} as const;

type Session = {
  questionOrder: string[]; // shuffled question ids
  optionOrder: Record<string, number[]>; // qid -> permutation of original option indices
  answers: Record<string, number>; // qid -> original option index
  startedAt: number;
  step: number;
};

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function createSession(): Session {
  const qOrder = shuffle(allQuestions.map((q) => q.id));
  const optionOrder: Record<string, number[]> = {};
  allQuestions.forEach((q) => {
    optionOrder[q.id] = shuffle(q.options.map((_, i) => i));
  });
  return { questionOrder: qOrder, optionOrder, answers: {}, startedAt: Date.now(), step: 0 };
}

function loadSession(): Session | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw) as Session;
    if (!s?.questionOrder || s.questionOrder.length !== allQuestions.length) return null;
    return s;
  } catch { return null; }
}

function saveSession(s: Session) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch {}
}

function clearSession() {
  try { localStorage.removeItem(STORAGE_KEY); } catch {}
}

function AssessmentPage() {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [started, setStarted] = useState(false);
  const [resumable, setResumable] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(TOTAL_SECONDS);

  // Hydrate from localStorage
  useEffect(() => {
    const existing = loadSession();
    if (existing && Object.keys(existing.answers).length > 0) {
      setResumable(true);
    }
  }, []);

  // Persist whenever session changes
  useEffect(() => {
    if (session) saveSession(session);
  }, [session]);

  // Timer
  useEffect(() => {
    if (!started || !session) return;
    const update = () => {
      const elapsed = Math.floor((Date.now() - session.startedAt) / 1000);
      setSecondsLeft(Math.max(0, TOTAL_SECONDS - elapsed));
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [started, session]);

  // Auto-finish on timeout
  useEffect(() => {
    if (started && session && secondsLeft === 0) finish(session);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft, started]);

  const startNew = () => {
    const s = createSession();
    setSession(s);
    setStarted(true);
    setResumable(false);
  };

  const resume = () => {
    const s = loadSession();
    if (s) { setSession(s); setStarted(true); setResumable(false); }
    else startNew();
  };

  const orderedQuestions = useMemo<AnyQuestion[]>(() => {
    if (!session) return [];
    const byId = new Map(allQuestions.map((q) => [q.id, q] as const));
    return session.questionOrder.map((id) => byId.get(id)!).filter(Boolean);
  }, [session]);

  const total = orderedQuestions.length;
  const step = session?.step ?? 0;
  const q: AnyQuestion | null = session && step < total ? orderedQuestions[step] : null;
  const progress = total ? (step / total) * 100 : 0;

  // Map option indices through the shuffle for the current question
  const shuffledOptions = useMemo(() => {
    if (!q || !session) return [] as { label: string; originalIdx: number }[];
    const perm = session.optionOrder[q.id] ?? q.options.map((_, i) => i);
    return perm.map((origIdx) => ({
      label: (q.options[origIdx] as any).label ?? (q.options[origIdx] as any),
      originalIdx: origIdx,
    }));
  }, [q, session]);

  const selectedShuffledIdx = useMemo(() => {
    if (!q || !session) return -1;
    const stored = session.answers[q.id];
    if (stored == null) return -1;
    const perm = session.optionOrder[q.id] ?? q.options.map((_, i) => i);
    return perm.indexOf(stored);
  }, [q, session]);

  const select = (shuffledIdx: number) => {
    if (!q || !session) return;
    const originalIdx = shuffledOptions[shuffledIdx].originalIdx;
    setSession({ ...session, answers: { ...session.answers, [q.id]: originalIdx } });
  };

  const goNext = () => {
    if (!session) return;
    if (step === total - 1) { finish(session); return; }
    setSession({ ...session, step: step + 1 });
  };
  const goBack = () => {
    if (!session) return;
    setSession({ ...session, step: Math.max(0, step - 1) });
  };

  function finish(s: Session) {
    const elapsed = Math.floor((Date.now() - s.startedAt) / 1000);
    sessionStorage.setItem("assessment_answers", JSON.stringify(s.answers));
    sessionStorage.setItem("assessment_seconds", String(elapsed));
    clearSession();
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
                <li>• Questions and answer choices are randomized for every attempt.</li>
                <li>• Your progress is saved automatically — refresh-safe.</li>
                <li>• A 20-minute timer runs for the whole assessment.</li>
                <li>• Results are saved to your account after you sign in.</li>
              </ul>
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              {resumable && (
                <button
                  onClick={resume}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-base font-medium text-primary-foreground transition-all hover:glow-purple hover:-translate-y-0.5"
                >
                  Resume Assessment <ArrowRight className="h-4 w-4" />
                </button>
              )}
              <button
                onClick={startNew}
                className={`inline-flex items-center gap-2 rounded-full px-8 py-4 text-base font-medium transition-all hover:-translate-y-0.5 ${
                  resumable
                    ? "border border-border bg-secondary text-foreground hover:bg-secondary/70"
                    : "bg-primary text-primary-foreground hover:glow-purple"
                }`}
              >
                {resumable ? (<><RotateCcw className="h-4 w-4" /> Start Over</>) : (<>Start Assessment <ArrowRight className="h-4 w-4" /></>)}
              </button>
            </div>
          </div>
        </section>
      </PageShell>
    );
  }

  if (!q || !session) return null;
  const section = SECTION_META[q.section];
  const SectionIcon = section.icon;

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
            <h2 className="mt-2 text-2xl font-semibold leading-snug md:text-3xl">{q.prompt}</h2>
            {q.section === "iq" && q.hint && (
              <div className="mt-4 rounded-xl bg-secondary/60 px-4 py-3 font-mono text-lg tracking-wide">{q.hint}</div>
            )}

            <div className="mt-8 space-y-3">
              {shuffledOptions.map((opt, i) => {
                const isSel = selectedShuffledIdx === i;
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
                onClick={goBack}
                disabled={step === 0}
                className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm transition-colors hover:bg-secondary disabled:opacity-40"
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
              <button
                onClick={goNext}
                disabled={selectedShuffledIdx === -1}
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
