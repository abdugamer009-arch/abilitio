import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { AmbientBackdrop } from "./AmbientBackdrop";
import { ScrollProgress } from "./ScrollProgress";
import { useT } from "@/lib/i18n";

export function PageShell({ children }: { children: React.ReactNode }) {
  const t = useT();
  return (
    <div className="relative min-h-dvh">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-xl focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground"
      >
        {t.nav.skipToContent}
      </a>
      <ScrollProgress />
      <AmbientBackdrop />
      <Navbar />
      <main
        id="main"
        className="animate-fade-in transition-opacity duration-500 ease-out"
        tabIndex={-1}
      >
        {children}
      </main>
      <Footer />
    </div>
  );
}
