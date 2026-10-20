# Route transition ownership

`MotionProvider` retains the existing GSAP page/story effects. `useRouteTransition` owns navigation with one native compositor curtain: the existing yellow surface, upward cover/reveal and cubic easing. Only transform and opacity are animated by the curtain. A transient transform hint is removed after completion or cancellation. No animation library was added or replaced.

The identical header/footer DOM remains mounted across Home, How it works and Dashboard. Link intent (pointer, focus and touch) preloads route modules. Main route modules preload during browser idle. Dashboard reads begin with intent/navigation and use a short-lived, owner-keyed, consume-once handoff in `src/lib/dashboard/preload.ts`. Existing account filters, pagination, errors and fresh reads on subsequent visits remain authoritative; no account data is persisted in browser storage by this handoff.

Navigation starts preparing code/data immediately. Route mounting and instant scroll restoration happen behind the fully opaque curtain. The incoming dashboard's existing pending state stays covered. The reveal waits for its concurrent render and the visible editorial rows. IntersectionObserver resolves viewport readiness without reading layout on every animation frame. Covered outgoing content retains its intrinsic height until the next page is ready, avoiding temporary scrollbar removal and navigation shifts. Back/forward use history blockers and retain earlier scroll positions. A newer click cancels the prior curtain; it cannot stack a second overlay. Navigation failure releases the overlay.

Decorative CSS loops pause during navigation and while their animated targets are off screen. Heavy illustration components are memoized. New offscreen home/editorial sections mount after the transition; above-the-fold sections, hash destinations and history restoration remain immediate. Old GSAP contexts are killed after the curtain finishes instead of restoring styles on detached pages. New scroll/story setup also waits until the curtain ends. Scroll progress never forces a document-height read inside a transition.

The wipe uses a 60ms cover and 120ms reveal with the original easing and 1:2 cover/reveal ratio, plus the covered preparation interval. Slow uncached code/data can extend that covered interval; do not release it into a blank page. Motion off and reduced motion use two 60ms opacity phases instead of the wipe. Dashboard tabs do not run the route curtain; their existing behavior is retained.

## Verification

Run `npm run check` and `VERCEL=1 npm run build`. Check normal and reduced-motion navigation, rapid clicks, back/forward scroll, 390/1440 layouts and ENG/RU/UZ. Capture Chromium traces at normal speed and 4x CPU with Fast 4G. Record videos separately from trace runs, and run performance measurements without concurrent builds or tests.

Profiling builds, fixtures, traces, recordings and private receipts belong in ignored `artifacts/transition-performance/`. A fixture dashboard checks rendering and navigation, not authenticated database latency or saving. A headless Chromium trace does not establish physical Android performance. Report missed targets explicitly; distinguish compositor frame timing, main-thread rAF timing, render/commit work, and work hidden by the opaque curtain.
