import { memo } from "react";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { LogOut, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { BrandMark } from "./BrandMark";
import { useAuth } from "@/lib/auth-context";
import { useWords } from "@/lib/editorial";

export const Navbar = memo(function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const w = useWords();
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  // The shared chrome now persists; retain the old route-unmount menu reset.
  useEffect(() => setOpen(false), [location.pathname]);
  const links = [
    { to: "/roadmap", label: w("Practice tools", "Mashq vositalari", "Практика") },
    { to: "/methodology", label: w("How it works", "Qanday ishlaydi", "Как это работает") },
    { to: "/for-schools", label: w("For schools", "Maktablar uchun", "Школам") },
    { to: "/about", label: w("Team", "Jamoa", "Команда") },
  ];
  useEffect(() => {
    if (!open) return;
    const close = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        trigger.current?.focus();
      }
    };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [open]);
  return (
    <header className="field-header">
      <nav
        className="field-wrap field-nav"
        aria-label={w("Main navigation", "Asosiy menyu", "Основное меню")}
      >
        <Link to="/" className="field-brand" aria-label="Abilitio">
          <BrandMark />
          <span>
            abilitio<span className="brand-dot">.</span>
          </span>
        </Link>
        <ul className="nav-links">
          {links.map((l) => (
            <li key={l.to}>
              <Link
                to={l.to}
                activeOptions={{ exact: true }}
                className={
                  l.to === "/roadmap" && location.pathname === "/roadmap"
                    ? "nav-journey-active"
                    : undefined
                }
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="nav-tools">
          <div className="nav-language">
            <LanguageSwitcher />
          </div>
          <ThemeToggle />
          <Link className="nav-login text-link text-sm" to={user ? "/dashboard" : "/auth"}>
            {user
              ? w("My dashboard", "Mening panelim", "Мой кабинет")
              : w("Sign in", "Kirish", "Войти")}
          </Link>
          {user && (
            <button
              className="icon-button"
              aria-label={w("Sign out", "Chiqish", "Выйти")}
              onClick={async () => {
                await signOut();
                navigate({ to: "/" });
              }}
            >
              <LogOut size={16} />
            </button>
          )}
          <button
            ref={trigger}
            className="icon-button nav-toggle"
            aria-expanded={open}
            aria-controls="site-menu"
            aria-label={w("Menu", "Menyu", "Меню")}
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>
      <svg
        className="header-wave"
        viewBox="0 0 1440 12"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M0 6Q60 0 120 6T240 6T360 6T480 6T600 6T720 6T840 6T960 6T1080 6T1200 6T1320 6T1440 6"
          fill="none"
          stroke="var(--ink)"
          strokeWidth="3"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      {open && (
        <div id="site-menu" className="nav-menu field-wrap">
          <LanguageSwitcher />
          {links.map((l) => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
          <Link to={user ? "/dashboard" : "/auth"} onClick={() => setOpen(false)}>
            {user
              ? w("My dashboard", "Mening panelim", "Мой кабинет")
              : w("Sign in", "Kirish", "Войти")}
          </Link>
        </div>
      )}
    </header>
  );
});
