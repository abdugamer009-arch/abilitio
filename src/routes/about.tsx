import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { Reveal } from "@/components/Reveal";
import { SpotlightCard } from "@/components/SpotlightCard";
import { Heart, Lightbulb, Globe, User, Phone, Mail, Send } from "lucide-react";
import { useT } from "@/lib/i18n";
import { CONTACT_EMAIL, CONTACT_PHONE } from "@/lib/constants";

const CONTACT_PHONE_TEL = CONTACT_PHONE.replace(/\s+/g, "");

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

        {/* A full second copy of the /contact form lived here — same fields,
            same Formspree endpoint, same validation, two places to keep in
            sync, and 26% of this page's height. Linking to the real one
            instead. */}
        <div className="mt-8 text-center">
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/40 px-5 py-2.5 text-sm transition-colors hover:bg-secondary"
          >
            {t.contact.send} <Send className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
