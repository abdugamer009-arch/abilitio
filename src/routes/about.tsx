import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { FloatingShapes } from "@/components/FloatingShapes";
import { Heart, Lightbulb, Globe, User, Phone, Mail } from "lucide-react";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — Abilitio" },
      { name: "description", content: "Meet the team behind Abilitio. We believe every student carries a unique constellation of talents." },
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
        <FloatingShapes />
        <div className="mx-auto max-w-3xl text-center animate-fade-up">
          <div className="text-xs uppercase tracking-widest text-accent">{t.about.eyebrow}</div>
          <h1 className="mt-3 text-4xl font-bold md:text-6xl">{t.about.titleA} <span className="gradient-text">{t.about.titleB}</span></h1>
          <p className="mt-6 text-lg text-muted-foreground">{t.about.subtitle}</p>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
          {t.about.values.map((v, i) => {
            const Icon = valueIcons[i];
            return (
              <div key={v.title} className="glass rounded-2xl p-6 hover-glow">
                <Icon className="h-5 w-5 text-accent" />
                <h3 className="mt-4 font-semibold">{v.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{v.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-3xl text-center mb-12 animate-fade-up">
          <div className="text-xs uppercase tracking-widest text-accent">{t.about.teamEyebrow}</div>
          <h2 className="mt-3 text-3xl font-bold md:text-4xl">{t.about.teamTitleA} <span className="gradient-text">{t.about.teamTitleB}</span></h2>
        </div>
        <div className="mx-auto grid max-w-3xl gap-8 md:grid-cols-2">
          {[
            { role: t.about.founder, name: "Abduraxmon Ibodullayev" },
            { role: t.about.coFounder, name: "Axmedov Umar" },
          ].map((person) => (
            <div
              key={person.name}
              className="glass rounded-3xl p-8 text-center transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_0_60px_-15px_var(--glow)]"
            >
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-accent/20 ring-1 ring-primary/30">
                <User className="h-8 w-8 text-accent" />
              </div>
              <h3 className="mt-6 text-xl font-semibold">{person.name}</h3>
              <p className="mt-2 text-sm font-medium text-accent uppercase tracking-wider">{person.role}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-3xl glass rounded-3xl p-10">
          <h2 className="text-2xl font-semibold">{t.about.missionTitle}</h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">{t.about.missionBody}</p>
        </div>
      </section>

      <section id="contact" className="px-6 pb-24 pt-8">
        <div className="mx-auto max-w-3xl text-center mb-10 animate-fade-up">
          <div className="text-xs uppercase tracking-widest text-accent">{t.contact.eyebrow}</div>
          <h2 className="mt-3 text-3xl font-bold md:text-4xl">{t.contact.titleA} <span className="gradient-text">{t.contact.titleB}</span></h2>
          <p className="mt-4 text-muted-foreground">{t.contact.subtitle}</p>
        </div>
        <div className="mx-auto grid max-w-3xl gap-5 sm:grid-cols-2">
          <a
            href="tel:+998880481881"
            className="glass group flex items-center gap-4 rounded-2xl p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_40px_-12px_var(--glow)]"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-accent/15 ring-1 ring-primary/20">
              <Phone className="h-4.5 w-4.5 text-accent" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] uppercase tracking-widest text-muted-foreground">{t.contact.phone}</div>
              <div className="mt-0.5 truncate text-sm font-medium">+998 88 048 18 81</div>
            </div>
          </a>
          <a
            href="mailto:ibodullayevabdurahmon95@gmail.com"
            className="glass group flex items-center gap-4 rounded-2xl p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_40px_-12px_var(--glow)]"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-accent/15 ring-1 ring-primary/20">
              <Mail className="h-4.5 w-4.5 text-accent" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] uppercase tracking-widest text-muted-foreground">{t.contact.email}</div>
              <div className="mt-0.5 truncate text-sm font-medium">ibodullayevabdurahmon95@gmail.com</div>
            </div>
          </a>
        </div>
      </section>
    </PageShell>
  );
}
