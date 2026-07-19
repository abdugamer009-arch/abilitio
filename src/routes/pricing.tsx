import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { Check, Sparkles } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { GlowBlob } from "@/components/GlowBlob";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — Abilitio" },
      { name: "description", content: "Abilitio is 100% free. Every assessment, insight, and tool is available to everyone at no cost." },
    ],
  }),
  component: PricingPage,
});

function PricingPage() {
  const t = useT();

  // Everything is free now — surface the full, previously-tiered feature set as
  // a single free plan. De-duplicated so shared features only appear once.
  const features = Array.from(
    new Set([
      t.pricing.plan2F1, t.pricing.plan2F2, t.pricing.plan2F3, t.pricing.plan2F4, t.pricing.plan2F5,
      t.pricing.plan3F2, t.pricing.plan3F3, t.pricing.plan3F4,
    ]),
  );

  return (
    <PageShell>
      <section className="relative px-6 pt-20 pb-12 text-center">
        <div aria-hidden className="bg-grid pointer-events-none absolute inset-0" />
        <div className="relative animate-fade-up">
          <div className="text-xs uppercase tracking-widest text-accent">{t.pricing.eyebrow}</div>
          <h1 className="mt-3 text-4xl font-bold md:text-6xl">
            {t.pricing.title} <span className="gradient-text">{t.pricing.titleHighlight}</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">{t.pricing.subtitle}</p>
        </div>
      </section>

      <section className="px-6 pb-20">
        <Reveal className="mx-auto max-w-xl">
          <div className="glass glow-purple relative overflow-hidden rounded-3xl border border-primary/40 p-8">
            <GlowBlob className="-right-10 -top-10 h-40 w-40 opacity-40 blur-3xl" />
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-primary to-accent px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary-foreground">
              {t.pricing.mostPopular}
            </div>

            <div className="flex items-center gap-2 text-primary">
              <Sparkles className="h-4 w-4" />
              <h3 className="text-lg font-semibold">{t.pricing.plan1Name}</h3>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{t.pricing.plan1Desc}</p>

            <div className="mt-6 flex items-baseline gap-2">
              <span className="text-5xl font-bold gradient-text">{t.pricing.plan1Price}</span>
              <span className="text-sm text-muted-foreground">{t.pricing.freeForever}</span>
            </div>

            <ul className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
              {features.map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-[0_2px_8px_-2px_var(--glow)]">
                    <Check className="h-2.5 w-2.5" />
                  </span>
                  {f}
                </li>
              ))}
            </ul>

            <Link
              to="/assessment"
              className="cta-sheen relative mt-8 inline-flex w-full items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-primary to-accent px-5 py-3 text-sm font-medium text-primary-foreground shadow-[0_6px_20px_-6px_var(--glow)] transition-all hover:-translate-y-0.5"
            >
              {t.pricing.plan1Cta}
            </Link>
          </div>
        </Reveal>

        <div className="mx-auto mt-10 max-w-2xl text-center text-sm text-muted-foreground">
          {t.pricing.schoolQuestion} <Link to="/contact" className="text-accent hover:underline">{t.pricing.getInTouch}</Link>.
        </div>
      </section>
    </PageShell>
  );
}
