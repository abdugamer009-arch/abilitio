# Site performance work — 21 October 2026

This change addresses startup downloads, dashboard history, assessment draft writes and route rendering. It retains the existing artwork, language copy, scoring, stored results, route destinations and animation library. It introduces no database migration or dependency.

## Data and saving

Dashboard history uses owner-scoped, newest-first pages of 20 with an exact count. Only report metadata and the name/score/category of the three displayed careers are selected. Nested evidence and the other 163 career entries remain in the full owner-scoped report, rather than being downloaded for the dashboard. Older pages append as the history is scrolled; failures expose Retry, and comparison remains available across loaded pages. Activity levels and assessment totals use the exact total, not the number of loaded rows. The consumed preload is not redundantly fetched again by idle warming of the current route.

Device drafts still write synchronously after every answer/state change. Account saves debounce small changes and retain one in-flight snapshot plus only the newest pending snapshot. Finish and Save and exit flush the newest snapshot and preserve the server's owner/revision/nonce checks. Save, recovery and submission requests have a 15-second client deadline; a timeout is a retryable error, not proof that a server write was undone. Existing owner/nonce idempotency remains essential for a response arriving late. Optional cleanup cannot delay showing an acknowledged saved result, and the recovery loader already excludes completed nonces.

## Rendering and delivery

Chat code loads on dashboard tab intent/use, not as a dependency of every idle-preloaded dashboard. Tab selection retains the existing content while the chat module is prepared. Public routes share their navigation/footer DOM. Offscreen dashboard sections prepare independently behind the existing opaque curtain. The completed SVG brain no longer retains a second invisible copy of the same drawing; the lazy boundary and initial fallback remain. Assessment figures and ABBI are memoized.

Infinite animation targets and page sizes are discovered outside the navigation input task. The route-active root flag stays stable across cover/hold/reveal, avoiding repeated document-wide selector invalidation. The opaque curtain covers page replacement; an additional inherited visibility toggle on every page descendant is unnecessary and was removed. Curtain shapes, colors, direction, easing and moving durations are retained. Dashboard tabs retain their existing style and have no added full-page transition.

English/Uzbek startup no longer preloads unused Cyrillic fonts. A saved Russian language preloads the Cyrillic fonts before hydration. Font files and CSS font families are unchanged.

Only `/`, `/universities`, `/methodology`, `/about` and `/for-schools` opt into public CDN caching (five minutes with stale revalidation). Their server HTML contains public content; account state is resolved in the browser. Dashboard, assessment, result and server-function responses are not opted into this cache. Verify public cache headers and real provider cache hits after deployment; a local header is not proof of a production hit.

## Verification boundaries

Run `npm run check` and a Vercel build. Vitest is limited to the repository's `tests/` tree so private archived source copies under `artifacts/` do not run as duplicate tests against the wrong signing module. Browser fixtures, local optimized traces and historical sample byte counts are separate from live authenticated saving and physical-device evidence. Private traces, recordings, backups and screenshots belong under ignored artifacts, not Git. Do not describe every device or network as perfectly smooth from one laboratory capture.
