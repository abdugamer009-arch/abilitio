import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQueryClient } from "@tanstack/react-query";
import ReactMarkdown from "react-markdown";
import { Sparkles, Send, Bot, User as UserIcon, Coins, MessageCircle, X, Zap } from "lucide-react";
import { useAura } from "@/components/aura/AuraProvider";
import { AuraCoin } from "@/components/aura/AuraCoin";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import {
  ABBI_SUGGESTIONS,
  abbiGreeting,
  generateAbbiReply,
  type AbbiContext,
} from "@/lib/abbi-knowledge";
import { spendAbbiMessage } from "@/lib/abbi.functions";

type ChatMsg = { id: string; role: "user" | "abbi"; content: string };

const FREE_PER_DAY = 3;
const MESSAGE_COST = 2;

function todayKey(userId: string) {
  return `abbi_free_${userId}_${new Date().toISOString().slice(0, 10)}`;
}

export function AbbiChat() {
  const { user } = useAuth();
  const { wallet } = useAura();
  const spendFn = useServerFn(spendAbbiMessage);
  const queryClient = useQueryClient();

  const [ctx, setCtx] = useState<AbbiContext>({});
  const [messages, setMessages] = useState<ChatMsg[]>([
    { id: "welcome", role: "abbi", content: abbiGreeting() },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [freeLeft, setFreeLeft] = useState(FREE_PER_DAY);
  const [outOfCoinsOpen, setOutOfCoinsOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Load assessment-based context (best-effort; safe if no result yet).
  useEffect(() => {
    if (!user) return;
    (async () => {
      const [{ data: result }, { data: profile }] = await Promise.all([
        supabase
          .from("assessment_results")
          .select("mbti_type, iq_score, top_strengths, interest_scores, weaknesses, careers")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle(),
        supabase
          .from("profiles")
          .select("name, age_group")
          .eq("id", user.id)
          .maybeSingle(),
      ]);
      const next: AbbiContext = {
        firstName: (profile?.name as string | undefined) || null,
        ageGroup: ((profile as { age_group?: string } | null)?.age_group as AbbiContext["ageGroup"]) ?? null,
      };
      if (result) {
        const interestScores = (result.interest_scores ?? {}) as Record<string, number>;
        const topInterests = Object.entries(interestScores)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([k]) => k);
        next.mbtiType = result.mbti_type;
        next.iqScore = result.iq_score;
        next.topStrengths = (result.top_strengths as string[]) ?? [];
        next.topInterests = topInterests;
        next.weaknesses = (result.weaknesses as string[]) ?? [];
        next.topCareers = ((result.careers ?? []) as { name: string; match: number; reason?: string }[]).slice(0, 3);
      }
      setCtx(next);
    })();
  }, [user]);

  // Daily free-question counter (per user, per day, localStorage)
  useEffect(() => {
    if (!user || typeof window === "undefined") return;
    const raw = localStorage.getItem(todayKey(user.id));
    const used = raw ? parseInt(raw, 10) || 0 : 0;
    setFreeLeft(Math.max(0, FREE_PER_DAY - used));
  }, [user]);

  function consumeFree() {
    if (!user || typeof window === "undefined") return;
    const key = todayKey(user.id);
    const used = parseInt(localStorage.getItem(key) || "0", 10) || 0;
    localStorage.setItem(key, String(used + 1));
    setFreeLeft(Math.max(0, FREE_PER_DAY - (used + 1)));
  }

  // Auto-scroll to bottom on new message
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  const balance = wallet?.balance ?? 0;
  const needsCoins = freeLeft <= 0;
  const canSend = !typing && input.trim().length > 0 && (!needsCoins || balance >= MESSAGE_COST);

  async function handleSend(text?: string) {
    const content = (text ?? input).trim();
    if (!content || typing) return;

    if (needsCoins && balance < MESSAGE_COST) {
      setOutOfCoinsOpen(true);
      return;
    }

    // Optimistic user message
    const userMsg: ChatMsg = { id: crypto.randomUUID(), role: "user", content };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);

    try {
      if (needsCoins) {
        const res = await spendFn();
        queryClient.setQueryData(["aura", "wallet"], res.wallet);
      } else {
        consumeFree();
      }

      // Pre-compute reply, then simulate a natural "thinking → typing" cadence.
      const reply = generateAbbiReply(content, ctx);
      // Thinking pause: 600-1100ms before typing dots feel "engaged"
      await new Promise((r) => setTimeout(r, 600 + Math.random() * 500));
      // Typing duration: scales with reply length, capped to feel premium not slow
      const typingMs = Math.min(2600, 700 + reply.length * 6);
      await new Promise((r) => setTimeout(r, typingMs));

      setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "abbi", content: reply }]);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong.";
      if (msg.includes("insufficient_balance")) {
        setOutOfCoinsOpen(true);
        // roll back optimistic user message
        setMessages((prev) => prev.filter((m) => m.id !== userMsg.id));
        setInput(content);
      } else {
        setMessages((prev) => [
          ...prev,
          { id: crypto.randomUUID(), role: "abbi", content: `⚠️ ${msg}` },
        ]);
      }
    } finally {
      setTyping(false);
    }
  }


  const statusBar = useMemo(
    () => (
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] font-medium text-primary">
          <AuraCoin size={14} /> {balance.toLocaleString()} Aura
        </span>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-medium ${
            freeLeft > 0
              ? "border-accent/30 bg-accent/10 text-accent"
              : "border-border bg-secondary/50 text-muted-foreground"
          }`}
        >
          <MessageCircle className="h-3 w-3" /> Free today: {freeLeft}/{FREE_PER_DAY}
        </span>
        {needsCoins && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-secondary/40 px-3 py-1 text-[11px] text-muted-foreground">
            <Coins className="h-3 w-3" /> {MESSAGE_COST} Aura per question
          </span>
        )}
      </div>
    ),
    [balance, freeLeft, needsCoins]
  );

  return (
    <div className="space-y-4">
      {/* Hero */}
      <div
        className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-primary/15 via-secondary/30 to-background/40 p-6 backdrop-blur-xl"
        style={{ boxShadow: "0 20px 60px -20px oklch(0.55 0.22 295 / 0.4)" }}
      >
        <div
          className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full opacity-60 blur-3xl"
          style={{ background: "radial-gradient(circle, oklch(0.65 0.24 295 / 0.5), transparent 70%)" }}
        />
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-lg"
              style={{ boxShadow: "0 10px 25px -8px oklch(0.55 0.22 295 / 0.6)" }}
            >
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
                ABBI <span className="gradient-text">AI</span>
              </h2>
              <p className="text-xs text-muted-foreground">
                Your premium AI career mentor — careers, universities, SAT/IELTS & growth.
              </p>
            </div>
          </div>
          {statusBar}
        </div>
      </div>

      {/* Chat window */}
      <div
        className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-secondary/30 via-background/40 to-background/30 backdrop-blur-xl"
        style={{ boxShadow: "0 10px 40px -20px oklch(0.55 0.22 295 / 0.3)" }}
      >
        {/* Transcript */}
        <div ref={scrollRef} className="h-[480px] overflow-y-auto px-4 py-6 sm:px-6">
          <div className="mx-auto flex max-w-3xl flex-col gap-5">
            {messages.map((m) => (
              <MessageBubble key={m.id} role={m.role} content={m.content} />
            ))}
            {typing && <TypingBubble />}
          </div>
        </div>

        {/* Suggestions */}
        {messages.length <= 2 && (
          <div className="border-t border-border/60 bg-secondary/20 px-4 py-3 sm:px-6">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Suggested prompts
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {ABBI_SUGGESTIONS.slice(0, 8).map((s) => (
                <button
                  key={s}
                  onClick={() => handleSend(s)}
                  disabled={typing}
                  className="rounded-full border border-border/60 bg-background/40 px-3 py-1.5 text-[11px] text-muted-foreground transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:text-foreground disabled:opacity-50"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Composer */}
        <div className="border-t border-border/60 bg-background/30 p-3 sm:p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-end gap-2"
          >
            <div className="flex flex-1 items-end gap-2 rounded-2xl border border-border/60 bg-secondary/30 px-3 py-2 transition-all focus-within:border-primary/40">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                rows={1}
                placeholder={
                  needsCoins
                    ? `Ask ABBI anything — costs ${MESSAGE_COST} Aura per question`
                    : "Ask ABBI anything about careers, universities, SAT/IELTS…"
                }
                className="flex-1 resize-none bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
                style={{ maxHeight: 120 }}
              />
            </div>
            <button
              type="submit"
              disabled={!canSend}
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-lg transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
              style={{ boxShadow: "0 10px 24px -10px oklch(0.55 0.22 295 / 0.6)" }}
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
          {needsCoins && (
            <div className="mt-2 flex items-center justify-between gap-3 rounded-xl border border-primary/20 bg-primary/5 px-3 py-2 text-[11px] text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Zap className="h-3 w-3 text-primary" />
                Each ABBI question now costs {MESSAGE_COST} Aura Coins.
              </span>
              <Link
                to="/aura"
                className="font-medium text-primary hover:underline"
              >
                Get more →
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Out of coins modal */}
      {outOfCoinsOpen && (
        <OutOfCoinsModal onClose={() => setOutOfCoinsOpen(false)} />
      )}
    </div>
  );
}

function MessageBubble({ role, content }: { role: "user" | "abbi"; content: string }) {
  if (role === "user") {
    return (
      <div className="flex items-start justify-end gap-3 animate-fade-in">
        <div
          className="max-w-[80%] rounded-2xl rounded-tr-md bg-gradient-to-br from-primary to-accent px-4 py-2.5 text-sm text-primary-foreground shadow-md"
          style={{ boxShadow: "0 8px 20px -10px oklch(0.55 0.22 295 / 0.5)" }}
        >
          {content}
        </div>
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-muted-foreground">
          <UserIcon className="h-4 w-4" />
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-start gap-3 animate-fade-in">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground shadow">
        <Bot className="h-4 w-4" />
      </div>
      <div className="prose prose-sm prose-invert max-w-[85%] rounded-2xl rounded-tl-md border border-border/40 bg-secondary/30 px-4 py-3 text-sm leading-relaxed text-foreground backdrop-blur-md
                      prose-headings:mt-2 prose-headings:mb-1 prose-headings:font-semibold prose-headings:text-foreground
                      prose-h3:text-base prose-p:my-2 prose-strong:text-foreground prose-ul:my-2 prose-li:my-0.5">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  );
}

function TypingBubble() {
  return (
    <div className="flex items-start gap-3 animate-fade-in">
      <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground shadow">
        <Bot className="h-4 w-4" />
        <span className="absolute -inset-1 -z-10 rounded-full opacity-60 blur-md"
          style={{ background: "radial-gradient(circle, oklch(0.65 0.24 295 / 0.6), transparent 70%)" }} />
      </div>
      <div className="flex items-center gap-2 rounded-2xl rounded-tl-md border border-border/40 bg-secondary/30 px-4 py-3 backdrop-blur-md">
        <span className="text-[11px] uppercase tracking-wider text-muted-foreground">ABBI is thinking</span>
        <span className="flex items-center gap-1">
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary" style={{ animationDelay: "0ms" }} />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary" style={{ animationDelay: "150ms" }} />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary" style={{ animationDelay: "300ms" }} />
        </span>
      </div>
    </div>
  );
}


function OutOfCoinsModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div
        className="relative w-full max-w-md overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-secondary/80 via-background to-background/80 p-7 backdrop-blur-xl"
        style={{ boxShadow: "0 30px 80px -20px oklch(0.55 0.22 295 / 0.6)" }}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-secondary/60 text-muted-foreground hover:text-foreground"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
        <div
          className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full opacity-60 blur-3xl"
          style={{ background: "radial-gradient(circle, oklch(0.65 0.24 295 / 0.5), transparent 70%)" }}
        />
        <div className="relative">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-lg">
            <Coins className="h-7 w-7" />
          </div>
          <h3 className="mt-4 text-xl font-bold tracking-tight">Out of Aura Coins</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            You need {MESSAGE_COST} Aura Coins to ask ABBI another question. Top up to keep your
            momentum going.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-end gap-2">
            <button
              onClick={onClose}
              className="rounded-full border border-border px-4 py-2 text-xs hover:bg-secondary"
            >
              Close
            </button>
            <Link
              to="/aura"
              onClick={onClose}
              className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-br from-primary to-accent px-5 py-2 text-xs font-medium text-primary-foreground hover:-translate-y-0.5 transition-all"
              style={{ boxShadow: "0 10px 24px -10px oklch(0.55 0.22 295 / 0.6)" }}
            >
              <AuraCoin size={14} /> Go to Aura Market
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
