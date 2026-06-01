import { Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { useT } from "@/lib/i18n";

export function Footer() {
  const t = useT();
  return (
    <footer className="mt-32 border-t border-border/50">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
                <Sparkles className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-semibold">Abilitio</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              {t.footer.tagline}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold">{t.footer.product}</h4>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li><Link to="/features" className="transition-colors duration-300 hover:text-foreground">{t.footer.features}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold">{t.footer.company}</h4>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li><Link to="/about" className="transition-colors duration-300 hover:text-foreground">{t.footer.about}</Link></li>
              <li><Link to="/about" hash="contact" className="transition-colors duration-300 hover:text-foreground">{t.footer.contacts}</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border/50 pt-6 text-xs text-muted-foreground md:flex-row">
          <p>© {new Date().getFullYear()} Abilitio. {t.footer.rights}</p>
          <p>{t.footer.crafted}</p>
        </div>
      </div>
    </footer>
  );
}
