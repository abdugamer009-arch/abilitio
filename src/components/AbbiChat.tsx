import { WavingAbbi, AbbiAvatar } from "@/components/design4/Artwork";
import { MotionArtwork } from "@/components/design4/MotionArtwork";
import { appendDailyMessage } from "@/lib/abbi/history";
import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import { User as UserIcon } from "lucide-react";
import { SendDrawing, StripedCard, Sparkle, WavyLine } from "@/components/dashboard/StudentPieces";

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
  const requestVersion = useRef(0);
  const pendingReply = useRef(false);
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
    // A reply already in flight belongs to the cleared conversation. It must
    // neither repopulate history nor reset a newer conversation's pending state.
    requestVersion.current += 1;
    pendingReply.current = false;
    setTyping(false);
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
    if (!content || pendingReply.current) return;
    pendingReply.current = true;
    const version = ++requestVersion.current;

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
      if (version !== requestVersion.current) return;
      appendMessage({ id: crypto.randomUUID(), role: "abbi", content: reply });
    } catch (err) {
      if (version !== requestVersion.current) return;
      const msg = err instanceof Error ? err.message : "Something went wrong.";
      appendMessage({ id: crypto.randomUUID(), role: "abbi", content: `⚠️ ${msg}` });
    } finally {
      if (version === requestVersion.current) {
        pendingReply.current = false;
        setTyping(false);
      }
    }
  }

  return (
    <div className="student-abbi">
      {/* Hero */}
      <StripedCard className="student-abbi-hero">
        <div className="student-abbi-title">
          <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
            ABBI{" "}
            <span className="gradient-text">
              {lang === "uz" ? "Yo‘lko‘rsatkich" : lang === "ru" ? "Справочник" : "Guide"}
            </span>
          </h2>
          <p className="text-sm text-muted-foreground">{t.abbiChat.tagline}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {lang === "uz"
              ? "Qoidalar va tayyor materiallarga asoslangan qo‘llanma. Kasb, o‘qish va xavfsiz mashqlarni tushuntiradi. Jonli qidiruv, qabul prognozi, tibbiy yoki huquqiy maslahat bermaydi."
              : lang === "ru"
                ? "Справочник по правилам и подготовленным материалам: профессии, учёба и безопасная практика. Без поиска в реальном времени, прогноза поступления, медицинских или юридических советов."
                : "Curated, rule-based guide to careers, study and safe practice. No live search, admissions predictions, medical or legal advice."}
          </p>
        </div>
        <Sparkle className="student-abbi-sparkle" />
      </StripedCard>

      {/* Chat window */}
      <StripedCard className="student-chat-window">
        {/* Transcript */}
        <div ref={scrollRef} className="student-transcript" role="log" aria-live="polite">
          <div className="student-messages">
            {messages.map((m) =>
              m.id === "welcome" ? (
                <div key={m.id} className="d4-welcome">
                  <MotionArtwork>
                    <WavingAbbi />
                  </MotionArtwork>
                  <div className="d4-welcome-bubble">
                    <MessageBubble role={m.role} content={m.content} />
                  </div>
                </div>
              ) : (
                <MessageBubble key={m.id} role={m.role} content={m.content} />
              ),
            )}
            {typing && (
              <MotionArtwork>
                <TypingBubble />
              </MotionArtwork>
            )}
          </div>
        </div>

        <WavyLine />
        {/* Suggestions */}
        {messages.length <= 2 && (
          <div className="student-suggestions">
            <div className="text-sm uppercase tracking-wider text-muted-foreground">
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
                    className="student-prompt"
                  >
                    {s}
                  </button>
                ))}
            </div>
          </div>
        )}

        {/* Composer */}
        <div className="student-composer">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-end gap-2"
          >
            <div className="student-compose-field">
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
              className="student-send"
              style={{ boxShadow: "4px 4px 0 var(--ink)" }}
              aria-label={t.community.send}
            >
              <SendDrawing />
            </button>
          </form>
          <div className="mt-2 flex justify-end">
            <button
              onClick={clearHistory}
              className="text-sm text-muted-foreground/60 hover:text-muted-foreground transition-colors"
            >
              {t.abbiChat.clear}
            </button>
          </div>
        </div>
      </StripedCard>
    </div>
  );
}

function MessageBubble({ role, content }: { role: "user" | "abbi"; content: string }) {
  if (role === "user") {
    return (
      <div className="student-message student-message-user animate-fade-in">
        <div className="student-bubble" style={{ boxShadow: "4px 4px 0 var(--ink)" }}>
          {content}
        </div>
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-card border border-border/60 text-muted-foreground">
          <UserIcon className="h-4 w-4" />
        </div>
      </div>
    );
  }
  return (
    <div className="student-message animate-fade-in">
      <span className="student-chat-avatar">
        <AbbiAvatar />
      </span>
      {/* chat-md (styles.css) styles the rendered markdown — headings, lists,
          code. The former `prose-*` classes were inert: @tailwindcss/typography
          was never installed, so ABBI's replies rendered as flat unstyled text. */}
      <div className="chat-md student-bubble">
        <ReactMarkdown rehypePlugins={[rehypeSanitize]}>{content}</ReactMarkdown>
      </div>
    </div>
  );
}

function TypingBubble() {
  const t = useT();
  return (
    <div className="student-message animate-fade-in">
      <span className="student-chat-avatar">
        <AbbiAvatar />
      </span>
      <div className="student-bubble student-typing">
        <span className="text-sm uppercase tracking-wider text-muted-foreground">
          {t.abbiChat.thinking}
        </span>
        <span className="flex items-center gap-1">
          <span className="student-typing-dot" style={{ animationDelay: "0ms" }} />
          <span className="student-typing-dot" style={{ animationDelay: "150ms" }} />
          <span className="student-typing-dot" style={{ animationDelay: "300ms" }} />
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
