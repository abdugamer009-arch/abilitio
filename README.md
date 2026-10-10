# Abilitio

Career exploration for students and schools. React, TanStack Start, TypeScript and Supabase; the flagship public experience uses a decision-workshop identity with midnight/paper, chartreuse, steel blue and coral, self-hosted Syne/IBM Plex Sans, and a procedural Three.js brain.

## Run locally

Use Node 22 or later. npm is the canonical package manager; `package-lock.json` is the reproducible lockfile. The obsolete Bun lockfile was removed after the dependency refresh.

```bash
npm ci --legacy-peer-deps
npm run dev
```

Open http://localhost:8080. Public pages and the anonymous assessment can run without backend credentials. Account actions report that the service is unavailable until configured; saving a completed assessment requires an account and the migration below.

For the Node production build:

```bash
NITRO_PRESET=node-server npm run build
PORT=8090 node .output/server/index.mjs
```

Vercel retains the existing `vercel.json` install/build workflow. Its `VERCEL=1` environment selects Nitro's Vercel preset. Do not deploy a Node `.output` folder as a static-only site: the application needs its server actions.

## Backend configuration and release gate

Copy `.env.example` to `.env` and replace the placeholders. Client `VITE_SUPABASE_*` values must exist at build time; server Supabase URL/key and `SUPABASE_SERVICE_ROLE_KEY` must exist at runtime. Keep the service-role key and `ASSESSMENT_SIGNING_SECRET` server-only. Use a stable random signing secret of at least 32 bytes; without one or a service-role key, local development uses an ephemeral key and assessment drafts expire after a server restart.

Before enabling scored saves and cloud task history, review and apply **`supabase/migrations/20261009000000_assessment_integrity_and_task_journal.sql` in staging**. It adds replay protection, removes client writes to scored results, protects moderation fields, and introduces owner-scoped task events. It has not been applied to a remote database during this implementation. Apply the existing migration chain to a new project first. Confirm service-role writes and normal-user reads, then attempt fabricated direct inserts/moderation updates with a staging user. Deploy server code and schema together.

Configure Supabase's allowed site/redirect URLs, then test a real recovery email and confirmed new-password flow. Test two user accounts, school analytics, avatar upload failure, community history and offline task reconciliation. Guest browser checks cannot establish those live-account behaviors.

The contact form uses the project's existing Formspree endpoint. Its success and failure UI were tested with intercepted responses; no real email was sent. Verify endpoint ownership, origin permissions and actual recipient delivery before launch.

Analytics remain opt-in through `VITE_PLAUSIBLE_DOMAIN`. They cover home CTA, assessment stages, auth return, result save, first task, scene fallback and CLS/INP/LCP. Payloads exclude answers and account identifiers. Review your analytics configuration before enabling it.

## Design and behavior

- `src/styles.css`: shared palette, typography, spacing, grid, surface and motion tokens. Syne supplies the display voice and IBM Plex Sans supplies legible body text and Cyrillic headings. Fonts are self-hosted; licenses are in `public/fonts`.
- `src/components/BrainCanvas.tsx`: grouped quality settings, folded hemispheres/fissure/cerebellum, custom GLSL particles and synapses, assembly, pointer/scroll signals and adaptive rendering. Bloom/chromatic/vignette processing is reserved for capable desktop GPUs; mobile/software renderers use lower budgets.
- `src/components/BrainScene.tsx`: an immediate SVG study, actual module/first-frame readiness milestones, context-loss fallback and retry. The intro is nonblocking. Motion off, OS reduced motion and `?static=1` use the illustrated equivalent.
- The account SDK loads separately from public rendering. When Supabase is configured it restores the session through the same client; server-function calls still attach its bearer token.
- Roadmap task IDs include the career path. Older unscoped completion marks are retained in the original local keys (and remote rows), excluded from current progress, and flagged for review; new local journals use v2 keys.
- `src/components/MotionProvider.tsx`: one Lenis/GSAP clock, route cleanup, masked reveals, sticky question index, contextual cursor and magnetic controls. Touch retains native scrolling.
- Public editorial routes, the four-question workshop, school inquiry flow and source-backed university gateway are complete in English, Uzbek and Russian. Legal text remains English with an explicit localized notice.
- `src/components/CareerWorkshop.tsx`: four authoritative questions, three illustrated solution steps each, a true local record, self-selected work preferences, and product-roadmap tasks with track-scoped persistence. Signal → Vector → Trajectory changes the live workbench without signup.
- Career suggestions are exploratory. Reasoning is reported on its original 0–10 scale, never as clinical IQ. University links point to official undergraduate sources; no invented eligibility, scholarships or fit percentages.
- The proof section explains method and publication standards. Real pilot stories need consented source material; no testimonial or school outcome was fabricated.

The existing server-backed product cannot be delivered faithfully as a single HTML file. Authentication, signed assessment submission, ownership policies and dashboards require the retained application/server structure. The delivery includes complete source and a production build instead.

## Verification and handoff

```bash
npm run lint
npx tsc --noEmit
npm test
npm audit
```

`PLAN.md` maps all 44 audit findings and records scope decisions and staging/hardware checks. The sibling `abilitio-rebuild-delivery` folder contains `REPORT.md`, raw Lighthouse/Playwright evidence, a before/after gallery, source archive and production build. Local automated checks do not constitute Safari, Firefox or physical GPU/device validation. No code was pushed, site deployed, remote schema changed or credentials embedded.
