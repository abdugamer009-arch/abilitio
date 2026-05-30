import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { useEffect, useState } from "react";
import { z } from "zod";
import { Loader2, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";

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

function AuthPage() {
  const { mode, next } = Route.useSearch();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tab, setTab] = useState<"login" | "signup">(mode);
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) navigate({ to: next ?? "/dashboard" });
  }, [user, next, navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    const ep = emailSchema.safeParse(email.trim());
    if (!ep.success) return setErr("Please enter a valid email");
    const pp = passSchema.safeParse(password);
    if (!pp.success) return setErr(pp.error.issues[0].message);

    setLoading(true);
    try {
      if (tab === "signup") {
        if (name.trim().length < 1 || surname.trim().length < 1) {
          setLoading(false);
          return setErr("Name and surname are required");
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
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: ep.data,
          password: pp.data,
        });
        if (error) throw error;
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Something went wrong";
      setErr(msg);
    } finally {
      setLoading(false);
    }
  }

  async function forgot() {
    setErr(null);
    const ep = emailSchema.safeParse(email.trim());
    if (!ep.success) return setErr("Enter your email above first");
    await supabase.auth.resetPasswordForEmail(ep.data, {
      redirectTo: window.location.origin + "/auth",
    });
    setErr("Check your email for a reset link.");
  }

  return (
    <PageShell>
      <section className="px-6 pt-16 pb-24">
        <div className="mx-auto max-w-md">
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent glow-purple">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="mt-6 text-3xl font-bold gradient-text">
              {tab === "signup" ? "Create your account" : "Welcome back"}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {tab === "signup" ? "Unlock your IQ results & insights" : "Log in to view your dashboard"}
            </p>
          </div>

          <div className="glass mt-8 rounded-3xl p-7">
            <div className="mb-6 grid grid-cols-2 gap-1 rounded-full bg-secondary/60 p-1">
              {(["login", "signup"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setTab(m)}
                  className={`rounded-full py-2 text-sm transition-all ${
                    tab === m ? "bg-primary text-primary-foreground glow-purple" : "text-muted-foreground"
                  }`}
                >
                  {m === "login" ? "Log in" : "Sign up"}
                </button>
              ))}
            </div>

            <form onSubmit={submit} className="space-y-3">
              {tab === "signup" && (
                <div className="grid grid-cols-2 gap-3">
                  <Input placeholder="Name" value={name} onChange={setName} />
                  <Input placeholder="Surname" value={surname} onChange={setSurname} />
                </div>
              )}
              <Input type="email" placeholder="Email" value={email} onChange={setEmail} />
              <Input type="password" placeholder="Password" value={password} onChange={setPassword} />

              {err && (
                <div className="rounded-xl border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">
                  {err}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-all hover:glow-purple disabled:opacity-60"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {tab === "signup" ? "Create account" : "Log in"}
              </button>

              {tab === "login" && (
                <button
                  type="button"
                  onClick={forgot}
                  className="block w-full text-center text-xs text-muted-foreground hover:text-foreground"
                >
                  Forgot password?
                </button>
              )}
            </form>
          </div>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            By continuing, you agree to our{" "}
            <Link to="/" className="underline hover:text-foreground">terms</Link>.
          </p>
        </div>
      </section>
    </PageShell>
  );
}

function Input({
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
