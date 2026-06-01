import { Link, useNavigate } from "@tanstack/react-router";
import { Sparkles, LogOut, LayoutDashboard, Menu, X } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useAuth } from "@/lib/auth-context";
import { useT } from "@/lib/i18n";

export function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const t = useT();
  const [open, setOpen] = useState(false);

  const navItems = [
    { to: "/", label: t.nav.home },
    { to: "/assessment", label: t.nav.assessment },
    { to: "/features", label: t.nav.features },
    { to: "/about", label: t.nav.about },
  ] as const;

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="mx-auto mt-4 max-w-6xl px-4">
        <nav className="glass flex h-14 items-center gap-4 rounded-full pl-5 pr-2.5">
          {/* Logo */}
          <Link to="/" className="flex shrink-0 items-center gap-2.5 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent shadow-[0_4px_18px_-6px_var(--glow)] group-hover:shadow-[0_6px_24px_-4px_var(--glow)] transition-all duration-300">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-[15px] font-semibold tracking-tight">Abilitio</span>
          </Link>

          {/* Center nav */}
          <ul className="hidden flex-1 items-center justify-center gap-1 lg:flex">
            {navItems.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className="rounded-full px-3.5 py-1.5 text-[13px] font-medium text-muted-foreground transition-all duration-300 hover:bg-secondary/70 hover:text-foreground"
                  activeProps={{ className: "text-foreground bg-secondary shadow-[0_0_20px_-6px_var(--glow)]" }}
                  activeOptions={{ exact: true }}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Spacer for non-lg widths so right cluster stays right */}
          <div className="flex-1 lg:hidden" />

          {/* Right cluster */}
          <div className="flex shrink-0 items-center gap-2">
            <LanguageSwitcher />
            <span className="hidden sm:block h-5 w-px bg-border/70" aria-hidden />
            <ThemeToggle />

            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="hidden md:inline-flex items-center gap-1.5 rounded-full border border-border/70 px-3.5 py-1.5 text-[13px] font-medium hover:bg-secondary/70 transition-all"
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

            {/* Mobile hamburger */}
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="inline-flex lg:hidden h-9 w-9 items-center justify-center rounded-full border border-border/70 text-foreground hover:bg-secondary/70 transition-all"
              aria-label="Toggle menu"
              aria-expanded={open}
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </nav>

        {/* Mobile menu */}
        {open && (
          <div className="lg:hidden mt-2 glass rounded-2xl p-2 animate-fade-in">
            <ul className="flex flex-col">
              {navItems.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className="block rounded-xl px-4 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:bg-secondary/70 hover:text-foreground"
                    activeProps={{ className: "text-foreground bg-secondary" }}
                    activeOptions={{ exact: true }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              {!user && (
                <li>
                  <Link
                    to="/auth"
                    search={{ mode: "login" }}
                    onClick={() => setOpen(false)}
                    className="mt-1 block rounded-xl bg-primary px-4 py-2.5 text-center text-sm font-medium text-primary-foreground"
                  >
                    {t.nav.signIn}
                  </Link>
                </li>
              )}
              {user && (
                <li>
                  <Link
                    to="/dashboard"
                    onClick={() => setOpen(false)}
                    className="mt-1 flex items-center justify-center gap-1.5 rounded-xl border border-border/70 px-4 py-2.5 text-sm font-medium"
                  >
                    <LayoutDashboard className="h-4 w-4" /> {t.nav.dashboard}
                  </Link>
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </header>
  );
}
