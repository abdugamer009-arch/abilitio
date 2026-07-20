import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "dark" | "light";

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  const stored = localStorage.getItem("abilitio-theme") as Theme | null;
  if (stored === "dark" || stored === "light") return stored;
  // No stored preference: reflect whatever the document currently shows
  // (the root shell defaults to dark; the pre-paint script may have removed it).
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const initial = getInitialTheme();
    setTheme(initial);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem("abilitio-theme", theme);
  }, [theme, mounted]);

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="group relative inline-flex h-9 w-16 items-center rounded-full border border-border bg-secondary/60 backdrop-blur transition-all duration-300 hover:shadow-[0_0_24px_-4px_var(--glow)]"
    >
      <span
        className={`absolute top-1 left-1 flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-md transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isDark ? "translate-x-0" : "translate-x-7"
        }`}
      >
        <Moon
          className={`absolute h-3.5 w-3.5 transition-all duration-300 ${
            isDark ? "opacity-100 rotate-0" : "opacity-0 -rotate-90"
          }`}
        />
        <Sun
          className={`absolute h-3.5 w-3.5 transition-all duration-300 ${
            isDark ? "opacity-0 rotate-90" : "opacity-100 rotate-0"
          }`}
        />
      </span>
      <span className="pointer-events-none ml-2 flex w-full justify-between px-2 text-muted-foreground">
        <Moon className={`h-3 w-3 transition-opacity ${isDark ? "opacity-0" : "opacity-60"}`} />
        <Sun className={`h-3 w-3 transition-opacity ${isDark ? "opacity-60" : "opacity-0"}`} />
      </span>
    </button>
  );
}
