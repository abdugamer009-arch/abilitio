import { Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { useT } from "@/lib/i18n";

export function Footer() {
  const t = useT();
  return (
    <footer className="mt-32 border-t border-border/50">
      <div className="mx-auto max-w-[1500px] px-6 py-16 lg:px-10 lg:py-20">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent">
                <Sparkles className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-semibold">Abilitio</span>
            </Link>
            <p className="mt-5 max-w-md text-base text-muted-foreground">
              {t.footer.tagline}
            </p>
          </div>
          <div>
            <h4 className="text-base font-semibold">{t.footer.product}</h4>
            <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
              <li><Link to="/features" className="transition-colors duration-300 hover:text-foreground">{t.footer.features}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-base font-semibold">{t.footer.company}</h4>
            <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
              <li><Link to="/about" className="transition-colors duration-300 hover:text-foreground">{t.footer.about}</Link></li>
              <li><Link to="/about" hash="contact" className="transition-colors duration-300 hover:text-foreground">{t.footer.contacts}</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/50 pt-8 text-sm text-muted-foreground md:flex-row">
          <p>© {new Date().getFullYear()} Abilitio. {t.footer.rights}</p>
          <p>{t.footer.crafted}</p>
        </div>
      </div>
    </footer>
  );
}
