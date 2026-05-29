import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { FloatingShapes } from "@/components/FloatingShapes";
import { Heart, Lightbulb, Globe } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Abilitio" },
      { name: "description", content: "We believe every student carries a unique constellation of talents. Abilitio helps reveal them." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <PageShell>
      <section className="relative px-6 pt-20 pb-16">
        <FloatingShapes />
        <div className="mx-auto max-w-3xl text-center animate-fade-up">
          <div className="text-xs uppercase tracking-widest text-accent">About Abilitio</div>
          <h1 className="mt-3 text-4xl font-bold md:text-6xl">A new way to see <span className="gradient-text">young minds</span></h1>
          <p className="mt-6 text-lg text-muted-foreground">
            We believe every student carries a unique constellation of talents. Abilitio uses thoughtful AI to make those talents visible — to students, parents, and educators.
          </p>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
          {[
            { icon: Heart, title: "Human first", desc: "Technology in service of people, not the other way around." },
            { icon: Lightbulb, title: "Research backed", desc: "Built with psychologists, educators, and data scientists." },
            { icon: Globe, title: "Globally inclusive", desc: "Designed for every culture, language, and learning style." },
          ].map((v) => (
            <div key={v.title} className="glass rounded-2xl p-6 hover-glow">
              <v.icon className="h-5 w-5 text-accent" />
              <h3 className="mt-4 font-semibold">{v.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-3xl glass rounded-3xl p-10">
          <h2 className="text-2xl font-semibold">Our mission</h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            To help one million students discover what makes them unique by 2030. We're building tools that move beyond test scores — tools that recognize creativity, empathy, curiosity, and grit as the engines of a life well lived.
          </p>
        </div>
      </section>
    </PageShell>
  );
}
