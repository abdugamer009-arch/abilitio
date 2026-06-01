import { Link, useNavigate } from "@tanstack/react-router";
import { Sparkles, LogOut, LayoutDashboard } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useAuth } from "@/lib/auth-context";
import { useT } from "@/lib/i18n";

export function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const t = useT();

  const navItems = [
    { to: "/", label: t.nav.home },
    { to: "/assessment", label: t.nav.assessment },
    { to: "/features", label: t.nav.features },
    { to: "/about", label: t.nav.about },
  ] as const;

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="mx-auto mt-4 max-w-6xl px-4">
        <nav className="glass flex h-14 items-center justify-between rounded-full pl-5 pr-2.5">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent shadow-[0_4px_18px_-6px_var(--glow)] group-hover:shadow-[0_6px_24px_-4px_var(--glow)] transition-all duration-300">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-[15px] font-semibold tracking-tight">Abilitio</span>
          </Link>
          <ul className="hidden items-center gap-1 md:flex absolute left-1/2 -translate-x-1/2">
            {navItems.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className="rounded-full px-4 py-2 text-[13px] font-medium text-muted-foreground transition-all duration-300 hover:bg-secondary/70 hover:text-foreground"
                  activeProps={{ className: "text-foreground bg-secondary shadow-[0_0_20px_-6px_var(--glow)]" }}
                  activeOptions={{ exact: true }}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <span className="hidden sm:block h-5 w-px bg-border/70" aria-hidden />
            <ThemeToggle />
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-border px-3.5 py-1.5 text-[13px] font-medium hover:bg-secondary/70 transition-all"
                >
                  <LayoutDashboard className="h-3.5 w-3.5" /> {t.nav.dashboard}
                </Link>
                <button
                  onClick={async () => { await signOut(); navigate({ to: "/" }); }}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground transition-all hover:glow-purple hover:-translate-y-0.5"
                  aria-label="Sign out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                search={{ mode: "login" }}
                className="hidden sm:inline-flex items-center rounded-full bg-primary px-4 py-2 text-[13px] font-medium text-primary-foreground transition-all duration-300 hover:glow-purple hover:-translate-y-0.5"
              >
                {t.nav.signIn}
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
