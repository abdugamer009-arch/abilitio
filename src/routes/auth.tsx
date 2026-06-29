import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { useEffect, useState } from "react";
import { z } from "zod";
import { Loader2, Sparkles, Eye, EyeOff, MailCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { useT } from "@/lib/i18n";

const searchSchema = z.object({
  mode: z.enum(["login", "signup"]).optional().default("login"),
  next: z.string().optional(),
});

export const Route = createFileRoute("/auth")({
  validateSearch: searchSchema,
  head: () => ({ meta: [{ title: "Sign in — Abilitio" }] }),
  component: AuthPage,
});

const emailSchema = z.string().email().max(255);
const passSchema = z.string().min(8, "At least 8 characters").max(72);

type AuthStrings = ReturnType<typeof useT>["auth"];

/** Map raw Supabase auth errors to friendly, localized messages. */
function localizeAuthError(message: string, a: AuthStrings): string {
  const m = message.toLowerCase();
  if (m.includes("invalid login credentials")) return a.errInvalidCredentials;
  if (m.includes("already registered") || m.includes("already been registered") || m.includes("user already")) return a.errUserExists;
  if (m.includes("email not confirmed")) return a.errEmailNotConfirmed;
  if (m.includes("password")) return a.errWeakPassword;
  return message || a.errGeneric;
}

function AuthPage() {
  const t = useT();
  const { mode, next } = Route.useSearch();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tab, setTab] = useState<"login" | "signup">(mode);
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [confirmEmailSent, setConfirmEmailSent] = useState<string | null>(null);

  useEffect(() => { if (user) navigate({ to: next ?? "/dashboard" }); }, [user, next, navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    const ep = emailSchema.safeParse(email.trim());
    if (!ep.success) return setErr(t.auth.errInvalidEmail);
    const pp = passSchema.safeParse(password);
    if (!pp.success) return setErr(pp.error.issues[0].message);

    setLoading(true);
    try {
      if (tab === "signup") {
        if (name.trim().length < 1 || surname.trim().length < 1) {
          setLoading(false);
          return setErr(t.auth.errNameRequired);
        }
        const { data, error } = await supabase.auth.signUp({
          email: ep.data,
          password: pp.data,
          options: { emailRedirectTo: window.location.origin, data: { name: name.trim(), surname: surname.trim() } },
        });
        if (error) throw error;
        // When email confirmation is required, Supabase returns a user without a
        // session. Show an explicit "check your inbox" state instead of silence.
        if (!data.session) {
          setConfirmEmailSent(ep.data);
          return;
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: ep.data, password: pp.data });
        if (error) throw error;
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : t.auth.errGeneric;
      setErr(localizeAuthError(msg, t.auth));
    } finally {
      setLoading(false);
    }
  }

  async function forgot() {
    setErr(null);
    const ep = emailSchema.safeParse(email.trim());
    if (!ep.success) return setErr(t.auth.errEmailFirst);
    await supabase.auth.resetPasswordForEmail(ep.data, { redirectTo: window.location.origin + "/auth" });
    setErr(t.auth.checkEmail);
  }

  return (
    <PageShell>
      <section className="px-6 pt-16 pb-24">
        <div className="mx-auto max-w-md">
          {confirmEmailSent ? (
            <div className="glass animate-fade-up rounded-3xl p-8 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent glow-purple">
                <MailCheck className="h-7 w-7 text-primary-foreground" />
              </div>
              <h1 className="mt-6 text-2xl font-bold gradient-text">{t.auth.checkInboxTitle}</h1>
              <p className="mt-3 text-sm text-muted-foreground">
                {t.auth.checkInboxBody}{" "}
                <span className="font-medium text-foreground">{confirmEmailSent}</span>
              </p>
              <p className="mt-2 text-xs text-muted-foreground">{t.auth.checkInboxHint}</p>
              <button
                type="button"
                onClick={() => { setConfirmEmailSent(null); setErr(null); setPassword(""); setTab("login"); }}
                className="mt-6 inline-flex w-full items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 px-5 py-3 text-sm font-medium text-primary transition-all hover:bg-primary/15"
              >
                {t.auth.backToLogin}
              </button>
            </div>
          ) : (
            <>
              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent glow-purple">
                  <Sparkles className="h-5 w-5 text-primary-foreground" />
                </div>
                <h1 className="mt-6 text-3xl font-bold gradient-text">
                  {tab === "signup" ? t.auth.signupTitle : t.auth.loginTitle}
                </h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  {tab === "signup" ? t.auth.signupSub : t.auth.loginSub}
                </p>
              </div>

              <div className="glass mt-8 rounded-3xl p-7">
                <div className="mb-6 grid grid-cols-2 gap-1 rounded-full bg-secondary/60 p-1">
                  {(["login", "signup"] as const).map((m) => (
                    <button key={m} onClick={() => { setTab(m); setErr(null); }} className={`rounded-full py-2 text-sm transition-all ${tab === m ? "bg-primary text-primary-foreground glow-purple" : "text-muted-foreground"}`}>
                      {m === "login" ? t.auth.login : t.auth.signup}
                    </button>
                  ))}
                </div>

                <form onSubmit={submit} className="space-y-3">
                  {tab === "signup" && (
                    <div className="grid grid-cols-2 gap-3">
                      <Input placeholder={t.auth.name} value={name} onChange={setName} />
                      <Input placeholder={t.auth.surname} value={surname} onChange={setSurname} />
                    </div>
                  )}
                  <Input type="email" placeholder={t.auth.email} value={email} onChange={setEmail} />
                  <PasswordInput
                    placeholder={t.auth.password}
                    value={password}
                    onChange={setPassword}
                    visible={showPassword}
                    onToggle={() => setShowPassword((v) => !v)}
                    showLabel={t.auth.showPassword}
                    hideLabel={t.auth.hidePassword}
                  />

                  {err && (
                    <div className="rounded-xl border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">{err}</div>
                  )}

                  <button type="submit" disabled={loading} className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-all hover:glow-purple disabled:opacity-60">
                    {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                    {tab === "signup" ? t.auth.createAccount : t.auth.login}
                  </button>

                  {tab === "login" && (
                    <button type="button" onClick={forgot} className="block w-full text-center text-xs text-muted-foreground hover:text-foreground">
                      {t.auth.forgot}
                    </button>
                  )}
                </form>
              </div>

              <p className="mt-6 text-center text-xs text-muted-foreground">
                {t.auth.terms}{" "}
                <Link to="/terms" className="underline hover:text-foreground">{t.auth.termsLink}</Link>.
              </p>
              <p className="mt-2 text-center text-xs text-muted-foreground">
                <Link to="/privacy" className="underline hover:text-foreground">{t.auth.privacyLink}</Link>
              </p>
            </>
          )}
        </div>
      </section>
    </PageShell>
  );
}

function Input({ type = "text", placeholder, value, onChange }: { type?: string; placeholder: string; value: string; onChange: (v: string) => void; }) {
  return (
    <input type={type} placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-2xl border border-border bg-secondary/40 px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:bg-secondary focus:shadow-[0_0_0_4px_var(--glow)]" />
  );
}

function PasswordInput({
  placeholder, value, onChange, visible, onToggle, showLabel, hideLabel,
}: {
  placeholder: string; value: string; onChange: (v: string) => void;
  visible: boolean; onToggle: () => void; showLabel: string; hideLabel: string;
}) {
  return (
    <div className="relative">
      <input
        type={visible ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-border bg-secondary/40 px-4 py-3 pr-11 text-sm outline-none transition-all focus:border-primary focus:bg-secondary focus:shadow-[0_0_0_4px_var(--glow)]"
      />
      <button
        type="button"
        onClick={onToggle}
        aria-label={visible ? hideLabel : showLabel}
        aria-pressed={visible}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
      >
        {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}
