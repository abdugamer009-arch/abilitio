import { Link } from "@tanstack/react-router";
import { Sparkles, ArrowUpRight } from "lucide-react";
import { useT } from "@/lib/i18n";

type FooterLink = { to: string; label: string; hash?: string };

export function Footer() {
  const t = useT();

  const columns: { title: string; links: FooterLink[] }[] = [
    {
      title: t.footer.product,
      links: [
        { to: "/career-assessment", label: "Assessment" },
        { to: "/career-battles", label: "Career Battles" },
        { to: "/roadmap", label: "Roadmap" },
        { to: "/universities", label: "Universities" },
        { to: "/pricing", label: "Pricing" },
      ],
    },
    {
      title: t.footer.company,
      links: [
        { to: "/about", label: t.footer.about },
        { to: "/success-stories", label: "Success Stories" },
        { to: "/for-schools", label: "For Schools" },
        { to: "/contact", label: t.footer.contacts },
      ],
    },
    {
      title: t.footer.legal,
      links: [
        { to: "/privacy", label: t.footer.privacy },
        { to: "/terms", label: t.footer.terms },
      ],
    },
    {
      title: "Resources",
      links: [
        { to: "/features", label: t.footer.features },
        { to: "/mentors", label: "Mentors" },
        { to: "/community", label: "Community" },
        { to: "/methodology", label: "How It Works" },
      ],
    },
  ];

  return (
    <footer className="relative mt-32">
      {/* top hairline glow */}
      <div className="gradient-divider-glow" aria-hidden />

      <div className="mx-auto max-w-[1500px] px-6 py-16 lg:px-10 lg:py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-6">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="group inline-flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent shadow-[0_6px_22px_-8px_var(--glow)] transition-transform duration-300 group-hover:scale-105">
                <Sparkles className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-semibold tracking-tight">Abilitio</span>
            </Link>
            <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-muted-foreground">
              {t.footer.tagline}
            </p>
            <Link
              to="/career-assessment"
              className="group mt-6 inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition-all hover:bg-primary/15 hover:-translate-y-0.5"
            >
              Start your assessment
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground/70">{col.title}</h4>
              <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      hash={link.hash}
                      className="group inline-flex items-center gap-1 transition-colors duration-200 hover:text-foreground"
                    >
                      <span className="relative">
                        {link.label}
                        <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-gradient-to-r from-primary to-accent transition-all duration-300 group-hover:w-full" />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-border/50 pt-8 text-sm text-muted-foreground md:flex-row">
          <p>© {new Date().getFullYear()} Abilitio. {t.footer.rights}</p>
          <p className="inline-flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            {t.footer.crafted}
          </p>
        </div>
      </div>
    </footer>
  );
}
