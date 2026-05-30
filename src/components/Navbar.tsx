import { Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About Us" },
  { to: "/features", label: "Features" },
  { to: "/contact", label: "Contacts" },
] as const;

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="mx-auto mt-4 max-w-6xl px-4">
        <nav className="glass flex items-center justify-between rounded-2xl px-5 py-3">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent group-hover:glow-purple transition-all duration-300">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold tracking-tight">Abilitio</span>
          </Link>
          <ul className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className="rounded-lg px-3 py-1.5 text-sm text-muted-foreground transition-all duration-300 hover:bg-secondary hover:text-foreground hover:shadow-[0_0_20px_-5px_var(--glow)]"
                  activeProps={{ className: "text-foreground bg-secondary shadow-[0_0_20px_-5px_var(--glow)]" }}
                  activeOptions={{ exact: true }}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              to="/contact"
              className="hidden sm:inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-all duration-300 hover:glow-purple hover:-translate-y-0.5"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
