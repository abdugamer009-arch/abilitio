import { appendDailyMessage } from "@/lib/abbi/history";
import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import { Sparkles, Send, Bot, User as UserIcon } from "lucide-react";
import { GlowBlob } from "@/components/GlowBlob";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { guidePrompts, guideGreeting } from "@/lib/abbi/localized-guide";
import { generateAbbiMessage } from "@/lib/abbi/abbi.functions";
import { useI18n, useT } from "@/lib/i18n";

type ChatMsg = { id: string; role: "user" | "abbi"; content: string };

function AbbiSession() {
  const t = useT();
  const { lang } = useI18n();
  const { user } = useAuth();
  const replyFn = useServerFn(generateAbbiMessage);

  const [ctx, setCtx] = useState<Record<string, unknown>>({});
  const [messages, setMessages] = useState<ChatMsg[]>([
    { id: "welcome", role: "abbi", content: guideGreeting(lang) },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const messageDay = useRef(new Date().toISOString().slice(0, 10));
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  // Grow the composer with its content (up to the max height) so multi-line
  // questions stay visible instead of scrolling inside a one-line box.
  function autoGrow() {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }

  function historyKey(userId: string) {
    return `abbi_history_${userId}_${new Date().toISOString().slice(0, 10)}`;
  }

  function purgeHistory(userId: string, keep?: string) {
    const prefix = `abbi_history_${userId}_`;
    try {
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key?.startsWith(prefix) && key !== keep) localStorage.removeItem(key);
      }
    } catch {
      /* Browser storage is optional. */
    }
  }

  useEffect(() => {
    if (!user) return;
    messageDay.current = new Date().toISOString().slice(0, 10);
    purgeHistory(user.id, historyKey(user.id));
    try {
      const raw: unknown = JSON.parse(localStorage.getItem(historyKey(user.id)) || "[]");
      if (Array.isArray(raw)) {
        const saved = raw
          .filter(
            (m): m is ChatMsg =>
              m &&
              typeof m.id === "string" &&
              typeof m.content === "string" &&
              (m.role === "user" || m.role === "abbi"),
          )
          .slice(-50);
        if (saved.length) setMessages(saved);
      }
    } catch {
      /* Corrupt or unavailable storage keeps the welcome message. */
    }
  }, [user]);

  useEffect(() => {
    if (!user || messages.length <= 1) return;
    const today = new Date().toISOString().slice(0, 10);
    if (messageDay.current !== today) {
      messageDay.current = today;
      purgeHistory(user.id);
      setMessages([{ id: "welcome", role: "abbi", content: guideGreeting(lang) }]);
      return;
    }
    try {
      purgeHistory(user.id, historyKey(user.id));
      localStorage.setItem(historyKey(user.id), JSON.stringify(messages.slice(-50)));
    } catch {
      /* The conversation can continue without persistence. */
    }
  }, [messages, user, lang]);

  function clearHistory() {
    if (!user) return;
    purgeHistory(user.id);
    setMessages([{ id: "welcome", role: "abbi", content: guideGreeting(lang) }]);
  }

  useEffect(() => {
    setMessages((current) =>
      current.map((m) => (m.id === "welcome" ? { ...m, content: guideGreeting(lang) } : m)),
    );
  }, [lang]);

  // Load career-assessment context (best-effort; safe if no result yet).
  useEffect(() => {
    if (!user) return;
    (async () => {
      const [{ data: result }, { data: profile }] = await Promise.all([
        supabase
          .from("career_assessment_results")
          .select(
            "personality_type, cognitive_score, strengths, improvements, interests, career_matches",
          )
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle(),
        supabase.from("profiles").select("name, age_group").eq("id", user.id).maybeSingle(),
      ]);
      const next: Record<string, unknown> = {
        firstName: (profile?.name as string | undefined) || null,
        ageGroup: (profile as { age_group?: string } | null)?.age_group ?? null,
      };
      if (result) {
        const interests = (result.interests as Array<{ key: string; weight: number }> | null) ?? [];
        const topInterests = [...interests]
          .sort((a, b) => b.weight - a.weight)
          .slice(0, 3)
          .map((i) => i.key);
        next.mbtiType = result.personality_type?.includes("X") ? null : result.personality_type;
        next.iqScore = null;
        next.topStrengths = (result.strengths as string[]) ?? [];
        next.topInterests = topInterests;
        next.weaknesses = (result.improvements as string[]) ?? [];
        next.topCareers = (
          (result.career_matches ?? []) as Array<{ name: string; score: number; category?: string }>
        )
          .slice(0, 3)
          .map((c) => ({ name: c.name, match: Math.round(c.score), reason: c.category ?? "" }));
      }
      setCtx(next);
    })();
  }, [user]);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  const canSend = !typing && input.trim().length > 0;

  function appendMessage(message: ChatMsg) {
    const now = new Date();
    const previousDay = messageDay.current;
    const today = now.toISOString().slice(0, 10);
    if (user && previousDay !== today) purgeHistory(user.id);
    messageDay.current = today;
    const welcome: ChatMsg = { id: "welcome", role: "abbi", content: guideGreeting(lang) };
    setMessages(
      (previous) => appendDailyMessage(previous, message, previousDay, now, welcome).messages,
    );
  }

  async function handleSend(text?: string) {
    const content = (text ?? input).trim();
    if (!content || typing) return;

    // Optimistic user message
    const userMsg: ChatMsg = { id: crypto.randomUUID(), role: "user", content };
    appendMessage(userMsg);
    setInput("");
    if (inputRef.current) inputRef.current.style.height = "auto";
    setTyping(true);

    try {
      // Fetch an authenticated reply from the curated guide.
      const { reply } = await replyFn({ data: { message: content, ctx, lang } });
      // Thinking pause so the response feels natural, not instant
      await new Promise((r) => setTimeout(r, 400 + Math.random() * 400));

      appendMessage({ id: crypto.randomUUID(), role: "abbi", content: reply });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong.";
      appendMessage({ id: crypto.randomUUID(), role: "abbi", content: `⚠️ ${msg}` });
    } finally {
      setTyping(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* Hero */}
      <div
        className="relative overflow-hidden rounded-3xl border border-border/60 bg-card p-6 "
        style={{ boxShadow: "4px 4px 0 var(--ink)" }}
      >
        <GlowBlob className="-right-16 -top-16 h-64 w-64 opacity-60 blur-3xl" alpha={0.5} />
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg"
              style={{ boxShadow: "4px 4px 0 var(--ink)" }}
            >
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
                ABBI{" "}
                <span className="gradient-text">
                  {lang === "uz" ? "Yo‘lko‘rsatkich" : lang === "ru" ? "Справочник" : "Guide"}
                </span>
              </h2>
              <p className="text-xs text-muted-foreground">{t.abbiChat.tagline}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {lang === "uz"
                  ? "Tayyorlangan kasb va o‘qish qo‘llanmasi."
                  : lang === "ru"
                    ? "Подготовленный справочник по профессиям и учёбе."
                    : "Curated guide with English responses."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Chat window */}
      <div
        className="relative overflow-hidden rounded-3xl border border-border/60 bg-card "
        style={{ boxShadow: "4px 4px 0 var(--ink)" }}
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
              {t.abbiChat.suggested}
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {guidePrompts(lang)
                .slice(0, 8)
                .map((s) => (
                  <button
                    key={s}
                    onClick={() => handleSend(s)}
                    disabled={typing}
                    className="rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-[11px] text-muted-foreground transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/10 hover:text-primary disabled:opacity-50"
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
                ref={inputRef}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  autoGrow();
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                rows={1}
                placeholder={t.abbiChat.placeholder}
                aria-label={t.abbiChat.inputAria}
                className="flex-1 resize-none bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
                style={{ maxHeight: 120 }}
              />
            </div>
            <button
              type="submit"
              disabled={!canSend}
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
              style={{ boxShadow: "4px 4px 0 var(--ink)" }}
              aria-label={t.community.send}
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
          <div className="mt-2 flex justify-end">
            <button
              onClick={clearHistory}
              className="text-[10px] text-muted-foreground/60 hover:text-muted-foreground transition-colors"
            >
              {t.abbiChat.clear}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ role, content }: { role: "user" | "abbi"; content: string }) {
  if (role === "user") {
    return (
      <div className="flex items-start justify-end gap-3 animate-fade-in">
        <div
          className="max-w-[80%] rounded-2xl rounded-tr-md bg-primary px-4 py-2.5 text-sm text-primary-foreground shadow-md"
          style={{ boxShadow: "4px 4px 0 var(--ink)" }}
        >
          {content}
        </div>
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-card border border-border/60 text-muted-foreground">
          <UserIcon className="h-4 w-4" />
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-start gap-3 animate-fade-in">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow">
        <Bot className="h-4 w-4" />
      </div>
      {/* chat-md (styles.css) styles the rendered markdown — headings, lists,
          code. The former `prose-*` classes were inert: @tailwindcss/typography
          was never installed, so ABBI's replies rendered as flat unstyled text. */}
      <div className="chat-md max-w-[85%] rounded-2xl rounded-tl-md border border-border/40 bg-secondary/30 px-4 py-3 text-sm leading-relaxed text-foreground -md">
        <ReactMarkdown rehypePlugins={[rehypeSanitize]}>{content}</ReactMarkdown>
      </div>
    </div>
  );
}

function TypingBubble() {
  const t = useT();
  return (
    <div className="flex items-start gap-3 animate-fade-in">
      <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow">
        <Bot className="h-4 w-4" />
        <span
          className="absolute -inset-1 -z-10 rounded-full opacity-60 blur-md"
          style={{
            background: "var(--yellow)",
          }}
        />
      </div>
      <div className="flex items-center gap-2 rounded-2xl rounded-tl-md border border-border/40 bg-secondary/30 px-4 py-3 -md">
        <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
          {t.abbiChat.thinking}
        </span>
        <span className="flex items-center gap-1">
          <span
            className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary"
            style={{ animationDelay: "0ms" }}
          />
          <span
            className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary"
            style={{ animationDelay: "150ms" }}
          />
          <span
            className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary"
            style={{ animationDelay: "300ms" }}
          />
        </span>
      </div>
    </div>
  );
}

// Remount on account changes so an outgoing account's messages cannot be saved
// under the incoming account's key during an auth transition.
export function AbbiChat() {
  const { user } = useAuth();
  return user ? <AbbiSession key={user.id} /> : null;
}
