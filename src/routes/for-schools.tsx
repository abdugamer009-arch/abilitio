import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { Reveal } from "@/components/Reveal";
import { SpotlightCard } from "@/components/SpotlightCard";
import {
  GraduationCap,
  BarChart3,
  Users,
  Sparkles,
  Shield,
  ArrowRight,
  Check,
  Mail,
} from "lucide-react";
import { FloatingShapes } from "@/components/FloatingShapes";
import { GlowBlob } from "@/components/GlowBlob";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/for-schools")({
  head: () => ({
    meta: [
      { title: "For Schools — Abilitio" },
      {
        name: "description",
        content:
          "AI talent discovery for schools: identify student strengths and build specialized classes from real assessment data.",
      },
      { property: "og:title", content: "Abilitio for Schools" },
      {
        property: "og:description",
        content:
          "Discover student talent and design specialized classes with AI-powered analytics.",
      },
    ],
  }),
  component: ForSchoolsPage,
});

function ForSchoolsPage() {
  const t = useT();

  const PLANS = [
    {
      name: t.forSchools.plan1Name,
      limit: t.forSchools.plan1Limit,
      price: t.forSchools.plan1Price,
      cta: t.forSchools.plan1Cta,
      ctaTo: "/school/register" as const,
      contact: false,
      features: [t.forSchools.plan1F1, t.forSchools.plan1F2, t.forSchools.plan1F3],
    },
    {
      name: t.forSchools.plan2Name,
      limit: t.forSchools.plan2Limit,
      price: t.forSchools.plan2Price,
      cta: t.forSchools.plan2Cta,
      ctaTo: "/contact" as const,
      contact: true,
      features: [
        t.forSchools.plan2F1,
        t.forSchools.plan2F2,
        t.forSchools.plan2F3,
        t.forSchools.plan2F4,
      ],
      highlight: true,
    },
    {
      name: t.forSchools.plan3Name,
      limit: t.forSchools.plan3Limit,
      price: t.forSchools.plan3Price,
      cta: t.forSchools.plan3Cta,
      ctaTo: "/contact" as const,
      contact: true,
      features: [
        t.forSchools.plan3F1,
        t.forSchools.plan3F2,
        t.forSchools.plan3F3,
        t.forSchools.plan3F4,
      ],
    },
  ];

  const FEATURES = [
    { icon: BarChart3, title: t.forSchools.feature1Title, body: t.forSchools.feature1Body },
    { icon: Users, title: t.forSchools.feature2Title, body: t.forSchools.feature2Body },
    { icon: Sparkles, title: t.forSchools.feature3Title, body: t.forSchools.feature3Body },
  ];

  return (
    <PageShell>
      <section className="relative px-6 pt-20 pb-12">
        <div aria-hidden className="bg-grid pointer-events-none absolute inset-0" />
        <FloatingShapes />
        <div className="relative mx-auto max-w-5xl text-center animate-fade-up">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs text-primary">
            <GraduationCap className="h-3.5 w-3.5" /> {t.forSchools.badge}
          </div>
          <h1 className="mt-6 text-4xl font-bold tracking-tight md:text-6xl">
            <span className="gradient-text">{t.forSchools.titleA}</span>
            <br />
            {t.forSchools.titleB}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground md:text-lg">
            {t.forSchools.subtitle}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/school/register"
              className="cta-sheen relative inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-accent px-6 py-3 text-sm font-medium text-primary-foreground shadow-[0_6px_20px_-6px_var(--glow)] transition-all hover:-translate-y-0.5 overflow-hidden"
            >
              {t.forSchools.registerBtn} <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/school/join"
              className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-6 py-3 text-sm font-medium text-primary transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:bg-primary/15 hover:shadow-[0_6px_16px_-6px_oklch(0.55_0.22_295_/_0.3)]"
            >
              {t.forSchools.joinBtn}
            </Link>
          </div>
        </div>
      </section>

      <section className="px-6 pb-12">
        <Reveal className="mx-auto grid max-w-5xl gap-4 md:grid-cols-3">
          {FEATURES.map((f) => (
            <SpotlightCard key={f.title} className="glass rounded-2xl p-6">
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-[0_6px_24px_-8px_var(--glow)]">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
            </SpotlightCard>
          ))}
        </Reveal>
      </section>

      <section className="px-6 pb-24">
        <div className="mx-auto max-w-5xl">
          <Reveal className="mb-8 text-center">
            <h2 className="text-2xl font-bold md:text-3xl">{t.forSchools.plansTitle}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{t.forSchools.plansSubtitle}</p>
          </Reveal>
          <Reveal delay={100} className="grid gap-5 md:grid-cols-3">
            {PLANS.map((p) => (
              <div
                key={p.name}
                className={`relative overflow-hidden glass rounded-3xl p-7 transition-all duration-300 hover:-translate-y-1 ${"highlight" in p && p.highlight ? "ring-1 ring-primary/40 shadow-[0_20px_60px_-30px_var(--glow)]" : "hover-glow"}`}
              >
                {"highlight" in p && p.highlight && (
                  <>
                    <GlowBlob className="-right-10 -top-10 h-40 w-40 opacity-40 blur-3xl" />
                    <div className="relative mb-3 inline-flex rounded-full bg-gradient-to-r from-primary to-accent px-2.5 py-0.5 text-[11px] font-semibold text-primary-foreground shadow-[0_2px_10px_-4px_var(--glow)]">
                      {t.forSchools.mostPopular}
                    </div>
                  </>
                )}
                <div className="text-sm text-muted-foreground">{p.name}</div>
                <div className="mt-1 text-2xl font-bold gradient-text">{p.price}</div>
                <div className="mt-1 text-xs text-muted-foreground">{p.limit}</div>
                <ul className="mt-5 space-y-2 text-sm">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-[0_2px_8px_-2px_var(--glow)]">
                        <Check className="h-2.5 w-2.5" />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  to={p.ctaTo}
                  className={`mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all hover:-translate-y-0.5 ${
                    "highlight" in p && p.highlight
                      ? "cta-sheen relative overflow-hidden bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-[0_6px_20px_-6px_var(--glow)]"
                      : "border border-primary/30 bg-primary/10 text-primary hover:border-primary/50 hover:bg-primary/15 hover:shadow-[0_6px_16px_-6px_oklch(0.55_0.22_295_/_0.3)]"
                  }`}
                >
                  {p.contact ? <Mail className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
                  {p.cta}
                </Link>
              </div>
            ))}
          </Reveal>
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              {t.forSchools.pricingQuestion}{" "}
              <Link to="/contact" className="font-medium text-accent hover:underline">
                {t.forSchools.getInTouch}
              </Link>
            </p>
          </div>
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-[0_2px_8px_-2px_var(--glow)]">
              <Shield className="h-3 w-3" />
            </span>{" "}
            {t.forSchools.privacyNote}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
