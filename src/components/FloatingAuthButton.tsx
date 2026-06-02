import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { User, Loader2, Sparkles, X, LogOut, LayoutDashboard } from "lucide-react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const emailSchema = z.string().email().max(255);
const passSchema = z.string().min(8, "At least 8 characters").max(72);

export function FloatingAuthButton() {
  const { user, signOut, loading } = useAuth();
  const [openAuth, setOpenAuth] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const navigate = useNavigate();

  if (loading) return null;

  const initial =
    (user?.user_metadata?.name as string | undefined)?.[0]?.toUpperCase() ??
    user?.email?.[0]?.toUpperCase() ??
    "U";

  return (
    <>
      <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end gap-3">
        {user && openMenu && (
          <div className="glass animate-scale-in flex w-56 flex-col overflow-hidden rounded-2xl border border-white/10 p-1.5 shadow-[0_20px_60px_-15px_var(--glow)]">
            <div className="px-3 py-2.5">
              <div className="truncate text-[13px] font-semibold">
                {(user.user_metadata?.name as string) ?? user.email}
              </div>
              <div className="truncate text-[11px] text-muted-foreground">{user.email}</div>
            </div>
            <div className="h-px bg-border/60" />
            <button
              onClick={() => {
                setOpenMenu(false);
                navigate({ to: "/dashboard" });
              }}
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-left text-[13px] font-medium text-foreground transition-colors hover:bg-secondary/70"
            >
              <LayoutDashboard className="h-4 w-4" /> Dashboard
            </button>
            <button
              onClick={async () => {
                setOpenMenu(false);
                await signOut();
                navigate({ to: "/" });
              }}
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-left text-[13px] font-medium text-destructive transition-colors hover:bg-destructive/10"
            >
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </div>
        )}

        <button
          aria-label={user ? "Profile" : "Sign in"}
          onClick={() => (user ? setOpenMenu((v) => !v) : setOpenAuth(true))}
          className={cn(
            "group relative inline-flex h-14 w-14 items-center justify-center rounded-full",
            "border border-white/15 bg-gradient-to-br from-primary/40 to-accent/30 backdrop-blur-xl",
            "shadow-[0_10px_40px_-10px_var(--glow)] transition-all duration-300",
            "hover:-translate-y-0.5 hover:scale-105 hover:shadow-[0_16px_50px_-10px_var(--glow)]",
          )}
        >
          <span className="absolute inset-0 -z-10 rounded-full bg-primary/30 blur-xl opacity-60 animate-pulse" />
          {user ? (
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-sm font-semibold text-primary-foreground">
              {initial}
            </span>
          ) : (
            <User className="h-5 w-5 text-foreground/90 transition-transform group-hover:scale-110" />
          )}
        </button>
      </div>

      {openAuth && <AuthModal onClose={() => setOpenAuth(false)} />}
    </>
  );
}

function AuthModal({ onClose }: { onClose: () => void }) {
  const t = useT();
  const { user } = useAuth();
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (user) onClose();
  }, [user, onClose]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setInfo(null);
    const ep = emailSchema.safeParse(email.trim());
    if (!ep.success) return setErr(t.auth.errInvalidEmail);
    const pp = passSchema.safeParse(password);
    if (!pp.success) return setErr(pp.error.issues[0].message);

    setBusy(true);
    try {
      if (tab === "signup") {
        if (name.trim().length < 1 || surname.trim().length < 1) {
          setBusy(false);
          return setErr(t.auth.errNameRequired);
        }
        const { error } = await supabase.auth.signUp({
          email: ep.data,
          password: pp.data,
          options: {
            emailRedirectTo: window.location.origin,
            data: { name: name.trim(), surname: surname.trim() },
          },
        });
        if (error) throw error;
        setInfo(t.auth.checkEmail);
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: ep.data,
          password: pp.data,
        });
        if (error) throw error;
      }
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : t.auth.errGeneric);
    } finally {
      setBusy(false);
    }
  }

  async function forgot() {
    setErr(null);
    setInfo(null);
    const ep = emailSchema.safeParse(email.trim());
    if (!ep.success) return setErr(t.auth.errEmailFirst);
    await supabase.auth.resetPasswordForEmail(ep.data, {
      redirectTo: window.location.origin + "/auth",
    });
    setInfo(t.auth.checkEmail);
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center px-4 animate-fade-in">
      <div
        className="absolute inset-0 bg-background/70 backdrop-blur-md"
        onClick={onClose}
        aria-hidden
      />
      <div className="relative w-full max-w-md animate-scale-in">
        <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-br from-primary/30 via-accent/20 to-transparent blur-2xl" />
        <div className="glass rounded-3xl border border-white/10 p-7 shadow-[0_30px_80px_-20px_var(--glow)]">
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary/70 hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-[0_10px_30px_-8px_var(--glow)]">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <h2 className="mt-5 text-2xl font-bold gradient-text">
              {tab === "signup" ? t.auth.signupTitle : t.auth.loginTitle}
            </h2>
            <p className="mt-1.5 text-xs text-muted-foreground">
              {tab === "signup" ? t.auth.signupSub : t.auth.loginSub}
            </p>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-1 rounded-full bg-secondary/60 p-1">
            {(["login", "signup"] as const).map((m) => (
              <button
                key={m}
                onClick={() => {
                  setTab(m);
                  setErr(null);
                  setInfo(null);
                }}
                className={cn(
                  "rounded-full py-2 text-xs font-medium transition-all",
                  tab === m
                    ? "bg-primary text-primary-foreground shadow-[0_6px_18px_-6px_var(--glow)]"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {m === "login" ? t.auth.login : t.auth.signup}
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="mt-5 space-y-3">
            {tab === "signup" && (
              <div className="grid grid-cols-2 gap-3">
                <ModalInput placeholder={t.auth.name} value={name} onChange={setName} />
                <ModalInput placeholder={t.auth.surname} value={surname} onChange={setSurname} />
              </div>
            )}
            <ModalInput type="email" placeholder={t.auth.email} value={email} onChange={setEmail} />
            <ModalInput
              type="password"
              placeholder={t.auth.password}
              value={password}
              onChange={setPassword}
            />

            {err && (
              <div className="rounded-xl border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">
                {err}
              </div>
            )}
            {info && (
              <div className="rounded-xl border border-primary/40 bg-primary/10 px-3 py-2 text-xs text-foreground">
                {info}
              </div>
            )}

            <button
              type="submit"
              disabled={busy}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-all hover:glow-purple hover:-translate-y-0.5 disabled:opacity-60"
            >
              {busy && <Loader2 className="h-4 w-4 animate-spin" />}
              {tab === "signup" ? t.auth.createAccount : t.auth.login}
            </button>

            {tab === "login" && (
              <button
                type="button"
                onClick={forgot}
                className="block w-full text-center text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                {t.auth.forgot}
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

function ModalInput({
  type = "text",
  placeholder,
  value,
  onChange,
}: {
  type?: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-2xl border border-border bg-secondary/40 px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:bg-secondary focus:shadow-[0_0_0_4px_var(--glow)]"
    />
  );
}
