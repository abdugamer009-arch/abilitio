import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import { useEffect } from "react";
import { Sparkles, Home, RefreshCw } from "lucide-react";

import appCss from "../styles.css?url";
import { AuthProvider } from "@/lib/auth-context";
import { LanguageProvider } from "@/lib/i18n";
import { FloatingAuthButton } from "@/components/FloatingAuthButton";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { SITE_URL, OG_IMAGE_URL, SITE_NAME, CONTACT_EMAIL } from "@/lib/constants";
import { initAnalytics } from "@/lib/analytics";

const ORG_JSONLD = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/favicon.svg`,
  image: OG_IMAGE_URL,
  email: CONTACT_EMAIL,
  description:
    "AI-powered talent discovery for students, parents, and schools. Uncover natural strengths and explore future career paths.",
};

function CenteredGlow({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4">
      {/* ambient brand glow */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute left-1/2 top-[-10%] h-[55vh] w-[110vw] -translate-x-1/2 rounded-[50%] opacity-50"
          style={{
            background:
              "radial-gradient(ellipse at center, oklch(0.6 0.18 290 / 0.3), transparent 68%)",
            filter: "blur(70px)",
          }}
        />
        <div
          className="absolute -bottom-32 right-[-10%] h-[45vh] w-[55vw] rounded-full opacity-35"
          style={{
            background:
              "radial-gradient(ellipse at center, oklch(0.55 0.17 275 / 0.3), transparent 70%)",
            filter: "blur(80px)",
          }}
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
            onClick={() => {
              router.invalidate();
              reset();
            }}
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
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: "Abilitio — Discover Your True Potential" },
      {
        name: "description",
        content:
          "AI-powered talent discovery for students and parents. Uncover natural strengths and explore future career paths.",
      },
      { name: "author", content: "Abilitio" },
      { property: "og:title", content: "Abilitio — Discover Your True Potential" },
      {
        property: "og:description",
        content:
          "AI-powered talent discovery for students and parents. Uncover natural strengths and explore future career paths.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Abilitio — Discover Your True Potential" },
      {
        name: "twitter:description",
        content:
          "AI-powered talent discovery for students and parents. Uncover natural strengths and explore future career paths.",
      },
      { property: "og:image", content: OG_IMAGE_URL },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:url", content: SITE_URL },
      { name: "twitter:image", content: OG_IMAGE_URL },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "apple-touch-icon", href: "/favicon.svg" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
      },
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_JSONLD) }}
        />
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

  useEffect(() => {
    initAnalytics();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AuthProvider>
          {/* Required: nested routes render here. */}
          <Outlet />
          <FloatingAuthButton />
          <SonnerToaster />
        </AuthProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}
