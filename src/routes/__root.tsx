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
import { LanguageProvider, useT } from "@/lib/i18n";
import { MotionProvider } from "@/components/MotionProvider";
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
    "Career exploration for students and schools through reasoning, personality and interest questions.",
};

function CenteredState({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4">
      {children}
    </div>
  );
}

function NotFoundComponent() {
  return (
    <LanguageProvider>
      <NotFoundContent />
    </LanguageProvider>
  );
}

function NotFoundContent() {
  const t = useT();
  return (
    <CenteredState>
      <div className="panel max-w-md rounded-3xl p-10 text-center animate-fade-up">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary">
          <Sparkles className="h-7 w-7 text-primary-foreground" />
        </div>
        <h1 className="mt-6 text-7xl font-bold gradient-text">404</h1>
        <h2 className="mt-2 text-xl font-semibold text-foreground">{t.errorPages.notFoundTitle}</h2>
        <p className="mt-3 text-sm text-muted-foreground">{t.errorPages.notFoundBody}</p>
        <div className="mt-7">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-all hover:glow-purple hover:-translate-y-0.5"
          >
            <Home className="h-4 w-4" /> {t.errorPages.backHome}
          </Link>
        </div>
      </div>
    </CenteredState>
  );
}

function ErrorComponent(props: { error: unknown; reset: () => void }) {
  return (
    <LanguageProvider>
      <ErrorContent {...props} />
    </LanguageProvider>
  );
}

function ErrorContent({ error, reset }: { error: unknown; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  const t = useT();

  return (
    <CenteredState>
      <div className="panel max-w-md rounded-3xl p-10 text-center animate-fade-up">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-card">
          <Sparkles className="h-7 w-7 text-primary-foreground" />
        </div>
        <h1 className="mt-6 text-2xl font-semibold tracking-tight text-foreground">
          {t.errorPages.errorTitle}
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">{t.errorPages.errorBody}</p>
        <div className="mt-7 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-all hover:glow-purple hover:-translate-y-0.5"
          >
            <RefreshCw className="h-4 w-4" /> {t.common.tryAgain}
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary/60"
          >
            <Home className="h-4 w-4" /> {t.common.goHome}
          </a>
        </div>
      </div>
    </CenteredState>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: "Abilitio — Find a career worth trying" },
      {
        name: "description",
        content:
          "Explore your reasoning, personality and interests, then choose a career experiment.",
      },
      { name: "author", content: "Abilitio" },
      { property: "og:title", content: "Abilitio — Find a career worth trying" },
      {
        property: "og:description",
        content:
          "Explore your reasoning, personality and interests, then choose a career experiment.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Abilitio — Find a career worth trying" },
      {
        name: "twitter:description",
        content:
          "Explore your reasoning, personality and interests, then choose a career experiment.",
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
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

// Applied before first paint so a stored "light" preference doesn't flash the
// Apply saved theme and the fail-open intro mask before the first paint.
const THEME_INIT_SCRIPT = `try{if(localStorage.getItem("abilitio-theme")==="dark")document.documentElement.classList.add("dark");if(location.pathname==="/"&&!matchMedia("(prefers-reduced-motion: reduce)").matches&&localStorage.getItem("abilitio-motion")!=="off"){document.documentElement.dataset.intro="boot";setTimeout(()=>{if(document.documentElement.dataset.intro==="boot")document.documentElement.dataset.intro="done"},5000)}}catch(e){}`;

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    // Saved theme and intro attributes may be applied before hydration.
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500..800&family=DM+Sans:opsz,wght@9..40,400..800&family=Caveat:wght@600;700&family=Rubik:wght@500..800&family=Onest:wght@400..800&display=swap"
        />
        <HeadContent />
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
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
          <MotionProvider>
            <Outlet />
          </MotionProvider>

          <SonnerToaster />
        </AuthProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}
