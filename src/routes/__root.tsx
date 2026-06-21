import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import { Sparkles, Home, RefreshCw } from "lucide-react";

import appCss from "../styles.css?url";
import { AuthProvider } from "@/lib/auth-context";
import { LanguageProvider } from "@/lib/i18n";
import { AuraProvider } from "@/components/aura/AuraProvider";
import { AuraRewardToaster } from "@/components/aura/AuraRewardToaster";
import { FloatingAuthButton } from "@/components/FloatingAuthButton";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";

function CenteredGlow({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4">
      {/* ambient brand glow */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute left-1/2 top-[-10%] h-[55vh] w-[110vw] -translate-x-1/2 rounded-[50%] opacity-50"
          style={{ background: "radial-gradient(ellipse at center, oklch(0.6 0.18 290 / 0.3), transparent 68%)", filter: "blur(70px)" }}
        />
        <div
          className="absolute -bottom-32 right-[-10%] h-[45vh] w-[55vw] rounded-full opacity-35"
          style={{ background: "radial-gradient(ellipse at center, oklch(0.55 0.17 275 / 0.3), transparent 70%)", filter: "blur(80px)" }}
        />
      </div>
      {children}
    </div>
  );
}

function NotFoundComponent() {
  return (
    <CenteredGlow>
      <div className="glass max-w-md rounded-3xl p-10 text-center animate-fade-up">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-[0_10px_30px_-10px_var(--glow)]">
          <Sparkles className="h-7 w-7 text-primary-foreground" />
        </div>
        <h1 className="mt-6 text-7xl font-bold gradient-text">404</h1>
        <h2 className="mt-2 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-3 text-sm text-muted-foreground">
          This page wandered off the map. Let's get you back to discovering your potential.
        </p>
        <div className="mt-7">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-all hover:glow-purple hover:-translate-y-0.5"
          >
            <Home className="h-4 w-4" /> Back home
          </Link>
        </div>
      </div>
    </CenteredGlow>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <CenteredGlow>
      <div className="glass max-w-md rounded-3xl p-10 text-center animate-fade-up">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-destructive/80 to-primary/60 shadow-[0_10px_30px_-10px_var(--glow)]">
          <Sparkles className="h-7 w-7 text-primary-foreground" />
        </div>
        <h1 className="mt-6 text-2xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-all hover:glow-purple hover:-translate-y-0.5"
          >
            <RefreshCw className="h-4 w-4" /> Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary/60"
          >
            <Home className="h-4 w-4" /> Go home
          </a>
        </div>
      </div>
    </CenteredGlow>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Abilitio — Discover Your True Potential" },
      { name: "description", content: "AI-powered talent discovery for students and parents. Uncover natural strengths and explore future career paths." },
      { name: "author", content: "Abilitio" },
      { property: "og:title", content: "Abilitio — Discover Your True Potential" },
      { property: "og:description", content: "AI-powered talent discovery for students and parents. Uncover natural strengths and explore future career paths." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Abilitio — Discover Your True Potential" },
      { name: "twitter:description", content: "AI-powered talent discovery for students and parents. Uncover natural strengths and explore future career paths." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/6b51ab73-ab17-4d2a-b4d8-641f949d00ae/id-preview-c86b1b09--5efbc617-9951-4523-9a26-ef1b314c17e5.lovable.app-1780053609364.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/6b51ab73-ab17-4d2a-b4d8-641f949d00ae/id-preview-c86b1b09--5efbc617-9951-4523-9a26-ef1b314c17e5.lovable.app-1780053609364.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "apple-touch-icon", href: "/favicon.svg" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AuthProvider>
          <AuraProvider>
            {/* Required: nested routes render here. */}
            <Outlet />
            <FloatingAuthButton />
            <AuraRewardToaster />
            <SonnerToaster />

          </AuraProvider>
        </AuthProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}
