import { Link, useNavigate } from "@tanstack/react-router";
import { Sparkles, LogOut, LayoutDashboard, Menu, X } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { AuraBalance } from "./aura/AuraBalance";
import { useAuth } from "@/lib/auth-context";
import { useT } from "@/lib/i18n";

export function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const t = useT();
  const [open, setOpen] = useState(false);

  const navItems = [
    { to: "/", label: t.nav.home, kind: "text" as const },
    { to: "/assessment", label: t.nav.assessment, kind: "text" as const },
    { to: "/roadmap", label: "Roadmap", kind: "text" as const },
    { to: "/community", label: "Community", kind: "text" as const },
    { to: "/aura-market", label: "Market", kind: "text" as const },
    { to: "/for-schools", label: "Schools", kind: "text" as const },
    { to: "/about", label: t.nav.about, kind: "text" as const },
  ] as const;


  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="mx-auto mt-4 max-w-[1500px] px-4 lg:px-6">
        <nav className="glass flex min-h-16 items-center gap-4 rounded-full px-4 sm:px-5 md:px-6 lg:min-h-[68px]">
          <div className="flex min-w-0 flex-1 items-center gap-6 md:gap-12">
            <Link to="/" className="group flex shrink-0 items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent shadow-[0_4px_18px_-6px_var(--glow)] transition-all duration-300 group-hover:shadow-[0_6px_24px_-4px_var(--glow)]">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-base font-semibold tracking-tight lg:text-[17px]">Abilitio</span>
            </Link>

            <ul className="hidden min-w-0 flex-1 items-center justify-start gap-2 md:flex lg:gap-4">
              {navItems.map((item) => (
                <li key={item.to} className="shrink-0">
                  <Link
                    to={item.to}
                    className="whitespace-nowrap rounded-full px-3.5 py-2 text-sm font-medium text-muted-foreground transition-all duration-300 hover:bg-secondary/70 hover:text-foreground lg:px-4 lg:text-[15px]"
                    activeProps={{ className: "bg-gradient-to-br from-primary/15 to-accent/10 text-foreground border border-primary/20 shadow-[0_0_20px_-6px_var(--glow)]" }}
                    activeOptions={{ exact: true }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Right cluster */}
          <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
            <AuraBalance />
            <LanguageSwitcher />
            <span className="hidden md:block h-5 w-px bg-border/70" aria-hidden />
            <ThemeToggle />

            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="hidden lg:inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5 text-[13px] font-medium text-primary transition-all hover:bg-primary/15 hover:border-primary/50"
                >
                  <LayoutDashboard className="h-3.5 w-3.5" /> {t.nav.dashboard}
                </Link>
                <Link
                  to="/dashboard"
                  className="hidden md:inline-flex lg:hidden h-9 w-9 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary transition-all hover:bg-primary/15"
                  aria-label={t.nav.dashboard}
                >
                  <LayoutDashboard className="h-4 w-4" />
                </Link>
                <button
                  onClick={async () => { await signOut(); navigate({ to: "/" }); }}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-[0_2px_10px_-4px_var(--glow)] transition-all hover:-translate-y-0.5"
                  aria-label="Sign out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                search={{ mode: "login" }}
                className="hidden md:inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-primary to-accent px-4 py-1.5 text-[13px] font-medium text-primary-foreground shadow-[0_4px_14px_-6px_var(--glow)] transition-all hover:-translate-y-0.5"
              >
                Sign in
              </Link>
            )}

            {/* Mobile hamburger */}
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/70 text-foreground transition-all hover:bg-secondary/70 md:hidden"
              aria-label="Toggle menu"
              aria-expanded={open}
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </nav>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden mt-2 glass rounded-2xl p-2 animate-fade-in">
            <ul className="flex flex-col">
              {navItems.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className="block rounded-xl px-4 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:bg-secondary/70 hover:text-foreground"
                    activeProps={{ className: "text-foreground bg-gradient-to-r from-primary/15 to-accent/10 border border-primary/20" }}
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
                    className="mt-1 flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-primary to-accent px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-[0_4px_14px_-6px_var(--glow)]"
                  >
                    Sign in
                  </Link>
                </li>
              )}
              {user && (
                <li>
                  <Link
                    to="/dashboard"
                    onClick={() => setOpen(false)}
                    className="mt-1 flex items-center justify-center gap-1.5 rounded-xl border border-primary/30 bg-primary/10 px-4 py-2.5 text-sm font-medium text-primary transition-all hover:bg-primary/15"
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
