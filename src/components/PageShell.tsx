import { createContext, useContext, type ReactNode } from "react";
import { useLocation } from "@tanstack/react-router";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

import { ScrollProgress } from "./ScrollProgress";
import { useT } from "@/lib/i18n";

const SharedShellContext = createContext(false);

/** Retain the identical chrome DOM across the three main student destinations. */
export function SharedPageShell({ children }: { children: ReactNode }) {
  const pathname = useLocation({ select: (location) => location.pathname });
  const shared = [
    "/",
    "/methodology",
    "/dashboard",
    "/universities",
    "/about",
    "/for-schools",
  ].includes(pathname);
  return (
    <SharedShellContext.Provider value={shared}>
      {shared ? <PageFrame>{children}</PageFrame> : children}
    </SharedShellContext.Provider>
  );
}

export function PageShell({ children }: { children: ReactNode }) {
  const shared = useContext(SharedShellContext);
  return shared ? children : <PageFrame>{children}</PageFrame>;
}

function PageFrame({ children }: { children: ReactNode }) {
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

      <Navbar />
      <main id="main" className="page-plane" tabIndex={-1}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
