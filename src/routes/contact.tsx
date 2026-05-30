import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { Mail, MessageSquare, MapPin, Send, Phone, Copy, Check, Loader2 } from "lucide-react";
import { useState, type FormEvent } from "react";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/mqejjovw";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contacts — Abilitio" },
      { name: "description", content: "Get in touch with the Abilitio team. We'd love to hear from you." },
    ],
  }),
  component: ContactPage,
});

type Status = "idle" | "sending" | "success" | "error";

function ContactPage() {
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [startedAt] = useState(() => Date.now());
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleCopy = async (text: string, type: "phone" | "email") => {
    await navigator.clipboard.writeText(text);
    if (type === "phone") {
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
    } else {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    // Spam guards
    if (website.trim() !== "") return; // honeypot tripped
    if (Date.now() - startedAt < 1500) {
      setStatus("error");
      setErrorMsg("Something went wrong. Please try again.");
      return;
    }

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedMessage = message.trim();

    if (trimmedName.length < 2 || trimmedName.length > 100) {
      setStatus("error");
      setErrorMsg("Please enter a valid name.");
      return;
    }
    if (!EMAIL_RE.test(trimmedEmail) || trimmedEmail.length > 200) {
      setStatus("error");
      setErrorMsg("Please enter a valid email address.");
      return;
    }
    if (trimmedMessage.length < 5 || trimmedMessage.length > 2000) {
      setStatus("error");
      setErrorMsg("Message must be between 5 and 2000 characters.");
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: trimmedName,
          email: trimmedEmail,
          message: trimmedMessage,
          _subject: `New Abilitio contact from ${trimmedName}`,
        }),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      setStatus("error");
      setErrorMsg("Something went wrong. Please try again.");
    }
  };

  return (
    <PageShell>
      <section className="px-6 pt-20 pb-12 text-center">
        <div className="text-xs uppercase tracking-widest text-accent">Contacts</div>
        <h1 className="mt-3 text-4xl font-bold md:text-6xl">Let's <span className="gradient-text">talk</span></h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
          Questions, partnerships, or feedback — we read every message.
        </p>
      </section>

      {/* Primary Contact Cards */}
      <section className="px-6 pb-12">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 md:flex-row md:justify-center">
          <a
            href="tel:+998880481881"
            className="group glass relative w-full max-w-sm overflow-hidden rounded-3xl p-8 text-center transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_0_60px_-10px_var(--glow)] md:w-auto md:flex-1"
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 ring-1 ring-border transition-all duration-500 group-hover:scale-110 group-hover:from-primary/30 group-hover:to-accent/30">
              <Phone className="h-6 w-6 text-primary transition-transform duration-500 group-hover:scale-110" />
            </div>
            <div className="mt-5 text-xs uppercase tracking-widest text-muted-foreground">Phone</div>
            <div className="mt-2 text-2xl font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary">
              +998 88 048 18 81
            </div>
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); handleCopy("+998880481881", "phone"); }}
              className="mx-auto mt-4 inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary/50 px-3 py-1.5 text-xs text-muted-foreground transition-all duration-300 hover:border-primary/30 hover:text-foreground"
            >
              {copiedPhone ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              {copiedPhone ? "Copied" : "Copy"}
            </button>
          </a>

          <a
            href="mailto:ibodullayevabdurahmon95@gmail.com"
            className="group glass relative w-full max-w-sm overflow-hidden rounded-3xl p-8 text-center transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_0_60px_-10px_var(--glow)] md:w-auto md:flex-1"
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 ring-1 ring-border transition-all duration-500 group-hover:scale-110 group-hover:from-primary/30 group-hover:to-accent/30">
              <Mail className="h-6 w-6 text-primary transition-transform duration-500 group-hover:scale-110" />
            </div>
            <div className="mt-5 text-xs uppercase tracking-widest text-muted-foreground">Email</div>
            <div className="mt-2 text-lg font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary md:text-xl">
              ibodullayevabdurahmon95@gmail.com
            </div>
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); handleCopy("ibodullayevabdurahmon95@gmail.com", "email"); }}
              className="mx-auto mt-4 inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary/50 px-3 py-1.5 text-xs text-muted-foreground transition-all duration-300 hover:border-primary/30 hover:text-foreground"
            >
              {copiedEmail ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              {copiedEmail ? "Copied" : "Copy"}
            </button>
          </a>
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
          <div className="space-y-4 md:col-span-1">
            {[
              { icon: MessageSquare, label: "Support", value: "Reply within 24 hours" },
              { icon: MapPin, label: "Based in", value: "Lisbon · Remote" },
            ].map((c) => (
              <div key={c.label} className="glass rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_40px_-5px_var(--glow)]">
                <c.icon className="h-4 w-4 text-accent" />
                <div className="mt-3 text-xs text-muted-foreground">{c.label}</div>
                <div className="text-sm font-medium">{c.value}</div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="glass rounded-3xl p-8 md:col-span-2" noValidate>
            {status === "success" ? (
              <div className="flex h-full flex-col items-center justify-center py-12 text-center animate-fade-up">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent glow-purple">
                  <Check className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="mt-6 text-2xl font-semibold">Message sent successfully.</h3>
                <p className="mt-2 text-sm text-muted-foreground">We'll get back to you shortly.</p>
                <button
                  type="button"
                  onClick={() => setStatus("idle")}
                  className="mt-6 rounded-full border border-border bg-secondary/50 px-5 py-2 text-xs text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <div className="space-y-5">
                {/* Honeypot — hidden from real users */}
                <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
                  <label htmlFor="website">Website</label>
                  <input
                    id="website"
                    name="website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                  />
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <Field label="Name" id="name" value={name} onChange={setName} placeholder="Jane Doe" />
                  <Field label="Email" id="email" type="email" value={email} onChange={setEmail} placeholder="jane@email.com" />
                </div>
                <div>
                  <label htmlFor="msg" className="text-xs text-muted-foreground">Message</label>
                  <textarea
                    id="msg"
                    required
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us more…"
                    maxLength={2000}
                    className="mt-2 w-full rounded-2xl border border-border bg-secondary/40 px-4 py-3 text-sm outline-none transition-all duration-300 focus:border-primary focus:shadow-[0_0_0_4px_color-mix(in_oklab,var(--primary)_18%,transparent)]"
                  />
                </div>

                {status === "error" && (
                  <div className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    {errorMsg || "Something went wrong. Please try again."}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-all duration-300 hover:glow-purple hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0"
                >
                  {status === "sending" ? (
                    <>Sending <Loader2 className="h-4 w-4 animate-spin" /></>
                  ) : (
                    <>Send Message <Send className="h-4 w-4" /></>
                  )}
                </button>
              </div>
            )}
          </form>
        </div>
      </section>
    </PageShell>
  );
}

function Field({
  label, id, type = "text", placeholder, value, onChange,
}: {
  label: string; id: string; type?: string; placeholder?: string;
  value: string; onChange: (v: string) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-xs text-muted-foreground">{label}</label>
      <input
        id={id}
        type={type}
        required
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={type === "email" ? 200 : 100}
        className="mt-2 w-full rounded-2xl border border-border bg-secondary/40 px-4 py-3 text-sm outline-none transition-all duration-300 focus:border-primary focus:shadow-[0_0_0_4px_color-mix(in_oklab,var(--primary)_18%,transparent)]"
      />
    </div>
  );
}
