# Routes

TanStack Start uses **file-based routing**. Every `.tsx` file in this directory
is a route. Do **not** create `src/pages/`, `src/routes/_app/index.tsx`, or
`app/layout.tsx` — those are Next.js / Remix conventions. The only root layout
is `src/routes/__root.tsx`.

## Conventions

The current routes live in `src/routes/`:

| File                       | URL or responsibility             |
| -------------------------- | --------------------------------- |
| `index.tsx`                | `/`                               |
| `career-assessment.tsx`    | `/career-assessment`              |
| `career-results.tsx`       | `/career-results`                 |
| `dashboard.tsx`            | `/dashboard`                      |
| `school.dashboard.tsx`     | `/school/dashboard`               |
| `school.class-builder.tsx` | `/school/class-builder`           |
| `sitemap[.]xml.ts`         | `/sitemap.xml` server endpoint    |
| `__root.tsx`               | App shell — preserve `<Outlet />` |

For new dynamic routes, TanStack uses a bare `$` segment such as `$id.tsx`.
Do not turn existing dot-separated route files into arbitrary folders while
organizing the repository; naming affects URLs and route nesting.

`routeTree.gen.ts` is auto-generated. Don't edit it by hand.

The generated file is `src/routeTree.gen.ts`. Run the normal development or build
command after a route change, then inspect the generated diff. Page logic should
call the matching feature module under `src/lib/` rather than copying scoring or
authorization rules into the route.
