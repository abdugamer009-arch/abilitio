import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { Brain, LineChart, Compass, ShieldCheck, Sparkles, Users, Target, BookOpen, Zap } from "lucide-react";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/features")({
  head: () => ({
    meta: [
      { title: "Features — Abilitio" },
      { name: "description", content: "Talent discovery, AI analytics, career mapping, and parent insights — all in one beautiful platform." },
    ],
  }),
  component: FeaturesPage,
});

function FeaturesPage() {
  const t = useT();
  const groups = [
    {
      title: t.featuresPage.discover,
      items: [
        { icon: Brain, ...t.featuresPage.items.adaptive },
        { icon: Target, ...t.featuresPage.items.dimensions },
        { icon: Sparkles, ...t.featuresPage.items.personality },
      ],
    },
    {
      title: t.featuresPage.analyze,
      items: [
        { icon: LineChart, ...t.featuresPage.items.dashboards },
        { icon: Zap, ...t.featuresPage.items.recs },
        { icon: BookOpen, ...t.featuresPage.items.reports },
      ],
    },
    {
      title: t.featuresPage.grow,
      items: [
        { icon: Compass, ...t.featuresPage.items.career },
        { icon: Users, ...t.featuresPage.items.parent },
        { icon: ShieldCheck, ...t.featuresPage.items.privacy },
      ],
    },
  ];

  return (
    <PageShell>
      <section className="px-6 pt-20 pb-12 text-center">
        <div className="text-xs uppercase tracking-widest text-accent">{t.featuresPage.eyebrow}</div>
        <h1 className="mt-3 text-4xl font-bold md:text-6xl">{t.featuresPage.titleA} <span className="gradient-text">{t.featuresPage.titleB}</span></h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">{t.featuresPage.subtitle}</p>
      </section>

      {groups.map((g) => (
        <section key={g.title} className="px-6 py-12">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-8 text-2xl font-semibold">{g.title}</h2>
            <div className="grid gap-5 md:grid-cols-3">
              {g.items.map((f) => (
                <div key={f.title} className="glass rounded-2xl p-6 hover-glow">
                  <f.icon className="h-5 w-5 text-accent" />
                  <h3 className="mt-4 font-semibold">{f.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}
    </PageShell>
  );
}
