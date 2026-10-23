import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useT } from "@/lib/i18n";

type Theme = "dark" | "light";

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";
  try {
    const stored = localStorage.getItem("abilitio-theme");
    if (stored === "dark" || stored === "light") return stored;
  } catch {
    /* optional storage */
  }
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

export function ThemeToggle() {
  const t = useT();
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const initial = getInitialTheme();
    setTheme(initial);
    setMounted(true);
  }, []);

  useEffect(() => {
    // Header and Settings render the same appearance control. Observe the
    // shared visual state so either switch immediately reflects the other.
    const root = document.documentElement;
    const sync = () => setTheme(root.classList.contains("dark") ? "dark" : "light");
    const observer = new MutationObserver(sync);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    try {
      localStorage.setItem("abilitio-theme", theme);
    } catch {
      /* optional storage */
    }
  }, [theme, mounted]);

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      aria-label={t.common.toggleTheme}
      aria-pressed={isDark}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="theme-switch"
    >
      <Moon aria-hidden="true" />
      <span className="theme-knob">
        <Sun aria-hidden="true" />
      </span>
    </button>
  );
}
