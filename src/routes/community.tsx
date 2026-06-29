import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useServerFn } from "@tanstack/react-start";
import {
  getMyCommunities, getCommunityMessages, sendCommunityMessage,
  deleteCommunityMessage, togglePinMessage, getCommunityDailyQuestion,
  setCommunityDailyQuestion, fetchMessageAuthors,
  type CommunityDTO, type CommunityMessageDTO, type AuthorDTO,
} from "@/lib/community.functions";
import { supabase } from "@/integrations/supabase/client";
import { resolveAvatarUrl } from "@/components/ProfilePhotoCard";
import { AdminBadge } from "@/components/AdminBadge";
import { Send, Pin, Trash2, Users, Sparkles, Lock, Pencil } from "lucide-react";

export const Route = createFileRoute("/community")({
  head: () => ({ meta: [
    { title: "Community — Abilitio" },
    { name: "description", content: "Connect with students and mentors, share progress, and get inspired on your talent-discovery journey." },
  ] }),
  component: CommunityPage,
});

function CommunityPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const getMine = useServerFn(getMyCommunities);
  const [data, setData] = useState<{ communities: CommunityDTO[]; isAdmin: boolean } | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (loading) return;
    if (!user) { navigate({ to: "/auth", search: { mode: "login", next: "/community" } }); return; }
    getMine().then((d) => {
      setData(d);
      if (d.communities.length) setActiveId(d.communities[0].id);
    });
  }, [user, loading, navigate, getMine]);

  if (loading || !data) {
    return <PageShell><div className="px-6 pt-32 text-center text-sm text-muted-foreground">Loading community…</div></PageShell>;
  }

  if (!data.communities.length) {
    return (
      <PageShell>
        <section className="px-4 pt-16 pb-24 sm:px-6">
          <div className="mx-auto max-w-xl rounded-3xl border border-border/60 bg-secondary/30 p-10 text-center backdrop-blur-xl">
            <Lock className="mx-auto h-10 w-10 text-primary" />
            <h1 className="mt-4 text-2xl font-semibold">Complete your assessment to unlock your community</h1>
            <p className="mt-2 text-sm text-muted-foreground">Take the talent assessment so we can match you with people who share your strengths and career interests.</p>
            <button onClick={() => navigate({ to: "/assessment" })} className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:glow-purple">
              Start assessment
            </button>
          </div>
        </section>
      </PageShell>
    );
  }

  const active = data.communities.find((c) => c.id === activeId) ?? data.communities[0];

  return (
    <PageShell>
      <div className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-[600px] overflow-hidden">
        <div className="absolute left-1/2 top-[-200px] h-[700px] w-[1100px] -translate-x-1/2 rounded-full opacity-50 blur-3xl"
          style={{ background: "radial-gradient(ellipse, oklch(0.55 0.22 295 / 0.32), transparent 60%)" }} />
      </div>
      <section className="px-4 pt-10 pb-24 sm:px-6">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[260px_1fr]">
          <Sidebar communities={data.communities} activeId={active.id} setActive={setActiveId} isAdmin={data.isAdmin} />
          <CommunityChat community={active} isAdmin={data.isAdmin} currentUserId={user!.id} />
        </div>
      </section>
    </PageShell>
  );
}

function Sidebar({ communities, activeId, setActive, isAdmin }: {
  communities: CommunityDTO[]; activeId: string; setActive: (id: string) => void; isAdmin: boolean;
}) {
  return (
    <aside className="rounded-3xl border border-border/60 bg-secondary/30 p-3 backdrop-blur-xl lg:sticky lg:top-24 lg:h-[calc(100vh-7rem)] lg:overflow-y-auto">
      <div className="px-3 pt-2 pb-3">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">{isAdmin ? "All Communities" : "Your Community"}</h2>
      </div>
      <ul className="space-y-1">
        {communities.map((c) => {
          const active = c.id === activeId;
          return (
            <li key={c.id}>
              <button
                onClick={() => setActive(c.id)}
                className={`group flex w-full items-center justify-between gap-2 rounded-2xl px-3 py-2.5 text-left text-[13px] transition-all ${
                  active ? "bg-gradient-to-br from-primary/20 to-accent/15 text-foreground shadow-[0_8px_24px_-10px_var(--glow)]" : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                }`}
              >
                <span className="truncate font-medium">{c.name}</span>
                <span className="shrink-0 rounded-full bg-secondary/70 px-1.5 py-0.5 text-[10px] tabular-nums text-muted-foreground">{c.member_count}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}

function CommunityChat({ community, isAdmin, currentUserId }: { community: CommunityDTO; isAdmin: boolean; currentUserId: string }) {
  const fetchMsgs = useServerFn(getCommunityMessages);
  const sendFn = useServerFn(sendCommunityMessage);
  const deleteFn = useServerFn(deleteCommunityMessage);
  const pinFn = useServerFn(togglePinMessage);
  const fetchDaily = useServerFn(getCommunityDailyQuestion);
  const setDailyFn = useServerFn(setCommunityDailyQuestion);
  const fetchAuthors = useServerFn(fetchMessageAuthors);

  const [messages, setMessages] = useState<CommunityMessageDTO[]>([]);
  const [authors, setAuthors] = useState<Record<string, AuthorDTO>>({});
  const [daily, setDaily] = useState<{ question: string } | null>(null);
  const [input, setInput] = useState("");
  const [online, setOnline] = useState(1);
  const [sending, setSending] = useState(false);
  const [editingDaily, setEditingDaily] = useState(false);
  const [dailyDraft, setDailyDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const upsertAuthor = async (uid: string) => {
    if (authors[uid]) return;
    const res = await fetchAuthors({ data: { userIds: [uid] } });
    setAuthors((a) => ({ ...a, ...Object.fromEntries(res.map((x) => [x.user_id, x])) }));
  };

  useEffect(() => {
    setMessages([]); setAuthors({});
    (async () => {
      const [m, q] = await Promise.all([
        fetchMsgs({ data: { communityId: community.id } }),
        fetchDaily({ data: { communityId: community.id } }),
      ]);
      setMessages(m.messages);
      setAuthors(Object.fromEntries(m.authors.map((a) => [a.user_id, a])));
      setDaily({ question: q.question });
    })();
  }, [community.id, fetchMsgs, fetchDaily]);

  // realtime
  useEffect(() => {
    const channel = supabase.channel(`community:${community.id}`, { config: { presence: { key: currentUserId } } })
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "community_messages", filter: `community_id=eq.${community.id}` }, (payload) => {
        const m = payload.new as CommunityMessageDTO;
        setMessages((prev) => prev.some((x) => x.id === m.id) ? prev : [...prev, m]);
        upsertAuthor(m.user_id);
      })
      .on("postgres_changes", { event: "DELETE", schema: "public", table: "community_messages", filter: `community_id=eq.${community.id}` }, (payload) => {
        const id = (payload.old as any).id;
        setMessages((prev) => prev.filter((x) => x.id !== id));
      })
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "community_messages", filter: `community_id=eq.${community.id}` }, (payload) => {
        const m = payload.new as CommunityMessageDTO;
        setMessages((prev) => prev.map((x) => x.id === m.id ? m : x));
      })
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState();
        setOnline(Object.keys(state).length || 1);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") await channel.track({ uid: currentUserId, at: Date.now() });
      });
    return () => { supabase.removeChannel(channel); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [community.id, currentUserId]);

  useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }); }, [messages.length]);

  const pinned = useMemo(() => messages.filter((m) => m.is_pinned), [messages]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || sending) return;
    setSending(true);
    try {
      const row = await sendFn({ data: { communityId: community.id, content: text } });
      setMessages((prev) => prev.some((x) => x.id === row.id) ? prev : [...prev, row]);
      setInput("");
      upsertAuthor(row.user_id);
    } catch (e: any) {
      console.error(e);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="rounded-3xl border border-border/60 bg-gradient-to-br from-secondary/40 via-background/40 to-background/30 p-6 backdrop-blur-xl"
        style={{ boxShadow: "0 18px 50px -22px oklch(0.55 0.22 295 / 0.35)" }}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{community.name} <span className="text-muted-foreground/70 font-normal">Community</span></h1>
            <p className="mt-1 max-w-xl text-sm text-muted-foreground">{community.welcome_message}</p>
          </div>
          <div className="flex shrink-0 items-center gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary/60 px-3 py-1.5">
              <Users className="h-3.5 w-3.5" /> {community.member_count} members
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_var(--glow)]" />
              {online} online
            </span>
          </div>
        </div>
      </div>

      {/* Daily question */}
      <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/15 via-accent/10 to-transparent p-5 backdrop-blur-xl">
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-50 blur-3xl" style={{ background: "radial-gradient(circle, oklch(0.65 0.24 295 / 0.4), transparent 70%)" }} />
        <div className="relative flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-lg">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <div className="text-[10px] uppercase tracking-[0.2em] text-primary/80">ABBI Daily Question</div>
            {editingDaily ? (
              <div className="mt-2 flex gap-2">
                <input value={dailyDraft} onChange={(e) => setDailyDraft(e.target.value)} className="flex-1 rounded-xl border border-border bg-background/60 px-3 py-2 text-sm" />
                <button onClick={async () => { await setDailyFn({ data: { communityId: community.id, question: dailyDraft } }); setDaily({ question: dailyDraft }); setEditingDaily(false); }} className="rounded-xl bg-primary px-3 py-2 text-xs font-medium text-primary-foreground">Save</button>
                <button onClick={() => setEditingDaily(false)} className="rounded-xl border border-border px-3 py-2 text-xs">Cancel</button>
              </div>
            ) : (
              <p className="mt-1 text-base font-medium leading-relaxed">{daily?.question ?? "…"}</p>
            )}
          </div>
          {isAdmin && !editingDaily && (
            <button onClick={() => { setDailyDraft(daily?.question ?? ""); setEditingDaily(true); }} className="rounded-full border border-border/70 p-2 text-muted-foreground hover:text-foreground" aria-label="Edit daily question">
              <Pencil className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Pinned strip */}
      {pinned.length > 0 && (
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-3">
          <div className="mb-2 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-amber-400/90">
            <Pin className="h-3 w-3" /> Pinned
          </div>
          <div className="space-y-1.5">
            {pinned.map((m) => (
              <div key={m.id} className="text-xs text-foreground/90">
                <span className="font-medium">{authors[m.user_id]?.name ?? "—"}: </span>{m.content}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex h-[58vh] flex-col rounded-3xl border border-border/60 bg-secondary/20 backdrop-blur-xl">
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 sm:px-6">
          {messages.length === 0 ? (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">Be the first to start the conversation.</div>
          ) : (
            <div className="space-y-4">
              {messages.map((m) => (
                <MessageRow key={m.id} message={m} author={authors[m.user_id]} isOwn={m.user_id === currentUserId} isAdmin={isAdmin}
                  onDelete={async () => { await deleteFn({ data: { id: m.id } }); setMessages((p) => p.filter((x) => x.id !== m.id)); }}
                  onTogglePin={async () => { await pinFn({ data: { id: m.id, pin: !m.is_pinned } }); setMessages((p) => p.map((x) => x.id === m.id ? { ...x, is_pinned: !m.is_pinned } : x)); }}
                />
              ))}
            </div>
          )}
        </div>
        <div className="border-t border-border/60 p-3">
          <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Message ${community.name}…`}
              maxLength={2000}
              className="flex-1 rounded-full border border-border/70 bg-background/60 px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary/50"
            />
            <button type="submit" disabled={!input.trim() || sending} className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-[0_8px_20px_-8px_var(--glow)] transition-all hover:-translate-y-0.5 disabled:opacity-50">
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function MessageRow({ message, author, isOwn, isAdmin, onDelete, onTogglePin }: {
  message: CommunityMessageDTO; author: AuthorDTO | undefined; isOwn: boolean; isAdmin: boolean;
  onDelete: () => void; onTogglePin: () => void;
}) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  useEffect(() => {
    let alive = true;
    resolveAvatarUrl(author?.avatar_url ?? null).then((u) => { if (alive) setAvatarUrl(u); });
    return () => { alive = false; };
  }, [author?.avatar_url]);

  const initials = (author?.name ?? "AB").split(" ").map((s) => s[0]).join("").slice(0, 2).toUpperCase();
  const time = new Date(message.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="group flex gap-3">
      <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-primary to-accent text-xs font-semibold text-primary-foreground">
        {avatarUrl ? <img src={avatarUrl} alt="" className="h-full w-full object-cover" /> : <span className="flex h-full w-full items-center justify-center">{initials}</span>}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">{author?.name ?? "Explorer"}</span>
          {author?.is_admin && <AdminBadge />}
          <span className="text-[10px] text-muted-foreground">{time}</span>
          {message.is_pinned && <Pin className="h-3 w-3 text-amber-400" />}
          {(isAdmin || isOwn) && (
            <div className="ml-auto flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
              {isAdmin && (
                <button onClick={onTogglePin} className="rounded-md p-1 text-muted-foreground hover:text-amber-400" title={message.is_pinned ? "Unpin" : "Pin"}>
                  <Pin className="h-3.5 w-3.5" />
                </button>
              )}
              <button onClick={onDelete} className="rounded-md p-1 text-muted-foreground hover:text-destructive" title="Delete">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
        <div className="mt-1 inline-block max-w-full rounded-2xl rounded-tl-md bg-gradient-to-br from-secondary/70 to-secondary/40 px-3.5 py-2 text-sm leading-relaxed shadow-sm">
          {message.content}
        </div>
      </div>
    </div>
  );
}
