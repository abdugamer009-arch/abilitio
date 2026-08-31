import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { Reveal } from "@/components/Reveal";
import { SpotlightCard } from "@/components/SpotlightCard";
import { Heart, Lightbulb, Globe, User, Phone, Mail, Send, Loader2, Check } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useT } from "@/lib/i18n";
import { CONTACT_EMAIL, CONTACT_PHONE } from "@/lib/constants";

const CONTACT_PHONE_TEL = CONTACT_PHONE.replace(/\s+/g, "");
const FORMSPREE_ENDPOINT = "https://formspree.io/f/mqejjovw";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
type Status = "idle" | "sending" | "success" | "error";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — Abilitio" },
      {
        name: "description",
        content:
          "Meet the team behind Abilitio. We believe every student carries a unique constellation of talents.",
      },
    ],
  }),
  component: AboutPage,
});

const valueIcons = [Heart, Lightbulb, Globe];

function AboutPage() {
  const t = useT();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");
  const [startedAt] = useState(() => Date.now());
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    if (website.trim() !== "") return;
    if (Date.now() - startedAt < 1500) {
      setStatus("error");
      setErrorMsg(t.contact.errors.generic);
      return;
    }
    const n = name.trim(),
      em = email.trim(),
      m = message.trim();
    if (n.length < 2 || n.length > 100) {
      setStatus("error");
      setErrorMsg(t.contact.errors.name);
      return;
    }
    if (!EMAIL_RE.test(em) || em.length > 200) {
      setStatus("error");
      setErrorMsg(t.contact.errors.email);
      return;
    }
    if (m.length < 5 || m.length > 2000) {
      setStatus("error");
      setErrorMsg(t.contact.errors.msg);
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: n,
          email: em,
          message: m,
          _subject: `New Abilitio contact from ${n}`,
        }),
      });
      if (!res.ok) throw new Error("fail");
      setStatus("success");
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      setStatus("error");
      setErrorMsg(t.contact.errors.generic);
    }
  };

  return (
    <PageShell>
      <section className="relative px-6 pt-20 pb-16">
        <div aria-hidden className="bg-grid pointer-events-none absolute inset-0" />
        <div className="relative mx-auto max-w-3xl text-center animate-fade-up">
          <div className="text-xs uppercase tracking-widest text-accent">{t.about.eyebrow}</div>
          <h1 className="mt-3 text-4xl font-bold md:text-6xl">
            {t.about.titleA} <span className="gradient-text">{t.about.titleB}</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">{t.about.subtitle}</p>
        </div>
      </section>

      <section className="px-6 py-16">
        <Reveal className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
          {t.about.values.map((v, i) => {
            const Icon = valueIcons[i];
            return (
              <SpotlightCard
                key={v.title}
                className="glass rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-[0_6px_24px_-8px_var(--glow)]">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold">{v.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{v.desc}</p>
              </SpotlightCard>
            );
          })}
        </Reveal>
      </section>

      <section className="px-6 py-16">
        <Reveal className="mx-auto max-w-3xl text-center mb-12">
          <div className="text-xs uppercase tracking-widest text-accent">{t.about.teamEyebrow}</div>
          <h2 className="mt-3 text-3xl font-bold md:text-4xl">
            {t.about.teamTitleA} <span className="gradient-text">{t.about.teamTitleB}</span>
          </h2>
        </Reveal>
        <Reveal delay={120} className="mx-auto grid max-w-3xl gap-8 md:grid-cols-2">
          {[
            { role: t.about.founder, name: "Abduraxmon Ibodullayev" },
            { role: t.about.coFounder, name: "Axmedov Umar" },
          ].map((person) => (
            <SpotlightCard
              key={person.name}
              className="glass rounded-3xl p-8 text-center transition-all duration-500 hover:-translate-y-2"
            >
              <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-[0_8px_24px_-8px_var(--glow)]">
                <span
                  className="absolute -inset-1 rounded-full opacity-40 blur-md"
                  style={{
                    background:
                      "radial-gradient(circle, oklch(0.65 0.24 295 / 0.5), transparent 70%)",
                  }}
                />
                <User className="h-8 w-8" />
              </div>
              <h3 className="mt-6 text-xl font-semibold">{person.name}</h3>
              <p className="mt-2 text-sm font-medium text-accent uppercase tracking-wider">
                {person.role}
              </p>
            </SpotlightCard>
          ))}
        </Reveal>
      </section>

      <section className="px-6 py-16">
        <Reveal className="mx-auto max-w-3xl glass rounded-3xl p-10">
          <h2 className="text-2xl font-semibold">{t.about.missionTitle}</h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">{t.about.missionBody}</p>
        </Reveal>
      </section>

      <section id="contact" className="px-6 pb-24 pt-8">
        <Reveal className="mx-auto max-w-3xl text-center mb-10">
          <div className="text-xs uppercase tracking-widest text-accent">{t.contact.eyebrow}</div>
          <h2 className="mt-3 text-3xl font-bold md:text-4xl">
            {t.contact.titleA} <span className="gradient-text">{t.contact.titleB}</span>
          </h2>
          <p className="mt-4 text-muted-foreground">{t.contact.subtitle}</p>
        </Reveal>
        <div className="mx-auto grid max-w-3xl gap-5 sm:grid-cols-2">
          <a
            href={`tel:${CONTACT_PHONE_TEL}`}
            className="glass group flex min-w-0 items-center gap-4 rounded-2xl p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_40px_-12px_var(--glow)]"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-[0_4px_14px_-4px_var(--glow)] transition-transform duration-300 group-hover:scale-105">
              <Phone className="h-4.5 w-4.5" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] uppercase tracking-widest text-muted-foreground">
                {t.contact.phone}
              </div>
              <div className="mt-0.5 truncate text-sm font-medium">{CONTACT_PHONE}</div>
            </div>
          </a>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="glass group flex min-w-0 items-center gap-4 rounded-2xl p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_40px_-12px_var(--glow)]"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-[0_4px_14px_-4px_var(--glow)] transition-transform duration-300 group-hover:scale-105">
              <Mail className="h-4.5 w-4.5" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] uppercase tracking-widest text-muted-foreground">
                {t.contact.email}
              </div>
              <div className="mt-0.5 text-sm font-medium break-all">{CONTACT_EMAIL}</div>
            </div>
          </a>
        </div>

        <form
          onSubmit={handleSubmit}
          className="glass mx-auto mt-8 max-w-3xl rounded-3xl p-8"
          noValidate
        >
          {status === "success" ? (
            <div
              role="status"
              className="flex flex-col items-center justify-center py-8 text-center animate-fade-up"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent glow-purple">
                <Check className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="mt-6 text-2xl font-semibold">{t.contact.successTitle}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{t.contact.successBody}</p>
              <button
                type="button"
                onClick={() => setStatus("idle")}
                className="mt-6 rounded-full border border-primary/20 bg-primary/5 px-5 py-2 text-xs text-muted-foreground transition-all hover:border-primary/40 hover:bg-primary/10 hover:text-primary"
              >
                {t.contact.sendAnother}
              </button>
            </div>
          ) : (
            <div className="space-y-5">
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
                <div>
                  <label htmlFor="name" className="text-xs text-muted-foreground">
                    {t.contact.name}
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t.contact.placeholderName}
                    maxLength={100}
                    className="mt-2 w-full rounded-2xl border border-border bg-secondary/40 px-4 py-3 text-sm outline-none transition-all duration-300 focus:border-primary focus:shadow-[0_0_0_4px_color-mix(in_oklab,var(--primary)_18%,transparent)]"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="text-xs text-muted-foreground">
                    {t.contact.emailLabel}
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t.contact.placeholderEmail}
                    maxLength={200}
                    className="mt-2 w-full rounded-2xl border border-border bg-secondary/40 px-4 py-3 text-sm outline-none transition-all duration-300 focus:border-primary focus:shadow-[0_0_0_4px_color-mix(in_oklab,var(--primary)_18%,transparent)]"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="msg" className="text-xs text-muted-foreground">
                  {t.contact.message}
                </label>
                <textarea
                  id="msg"
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={t.contact.placeholderMsg}
                  maxLength={2000}
                  className="mt-2 w-full rounded-2xl border border-border bg-secondary/40 px-4 py-3 text-sm outline-none transition-all duration-300 focus:border-primary focus:shadow-[0_0_0_4px_color-mix(in_oklab,var(--primary)_18%,transparent)]"
                />
              </div>
              {status === "error" && (
                <div
                  role="alert"
                  className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
                >
                  {errorMsg || t.contact.errors.generic}
                </div>
              )}
              <button
                type="submit"
                disabled={status === "sending"}
                className="cta-sheen relative overflow-hidden inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-accent px-6 py-3 text-sm font-medium text-primary-foreground shadow-[0_6px_20px_-6px_var(--glow)] transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0"
              >
                {status === "sending" ? (
                  <>
                    {t.contact.sending} <Loader2 className="h-4 w-4 animate-spin" />
                  </>
                ) : (
                  <>
                    {t.contact.send} <Send className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          )}
        </form>
      </section>
    </PageShell>
  );
}
