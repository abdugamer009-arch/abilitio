import { LANGS, useI18n } from "@/lib/i18n";

export function LanguageSwitcher() {
  const { lang, setLang } = useI18n();
  return (
    <div className="hidden sm:inline-flex items-center gap-0.5 rounded-full border border-border/60 bg-secondary/40 p-1 backdrop-blur">
      {LANGS.map((l) => {
        const active = lang === l.code;
        return (
          <button
            key={l.code}
            onClick={() => setLang(l.code)}
            aria-pressed={active}
            className={`relative rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide transition-all duration-300 ${
              active
                ? "bg-primary text-primary-foreground shadow-[0_0_18px_-4px_var(--glow)]"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/70"
            }`}
          >
            {l.label}
          </button>
        );
      })}
    </div>
  );
}
