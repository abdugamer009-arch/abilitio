# Mobile assessment diagnosis

Baseline was captured before application fixes. Evidence lives in the ignored `mobile-report/baseline/index.html` gallery and `results.json`. The tester uses actual Playwright device user agents and touch profiles in Chromium, with explicitly simulated account/result delivery because the local account service is unconfigured. Longest prompts and options are selected from the actual EN/RU/UZ catalogs; no answer keys or scoring weights are delivered to the browser.

## Confirmed root causes

| Failure                                                           | Element and original source                                                                                                          | Cause                                                                                                                                                                 | Evidence                                                                                                                                         |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Answer text/icons spill beyond cards, sometimes beyond the screen | `.choice-options`, `.choice-option` and its second span; `src/styles.css:1675`, `src/components/ChoiceOptions.tsx:28`                | Two columns remain on small phones; fixed letter/check icons and padding consume the available width. The text flex child has no `min-width:0` or long-word wrapping. | `mobile-report/baseline/initial-320.png`; longest reasoning/option `q01` / `q02` captures in every locale/device                                 |
| Page-width-only tests miss the defect                             | `.page-plane`; `src/styles.css:241`                                                                                                  | `overflow-x:clip` masks overflowing descendants; the document stays 320px wide while answer descendants reach 352px.                                                  | Element-bound diagnostics in baseline JSON; initial 320px reproduction                                                                           |
| Long Russian heading/long prompts are clipped                     | Intro `h1`, question `h2`; `src/routes/career-assessment.tsx`                                                                        | Display heading defaults and nested 24px section + 24/40px panel padding leave too little usable width; headings do not wrap long words.                              | Russian chooser and longest-prompt captures                                                                                                      |
| Answers and controls are too small                                | `.assessment-scale .scale-label`, visual-interest labels, chooser legends; `src/styles.css:3182`, `src/routes/career-assessment.tsx` | Five fixed Likert columns and two/three interest columns; 11–14px labels and short buttons/links.                                                                     | Font/tap-target failures in baseline JSON                                                                                                        |
| Question and Next require searching below the fold                | Account notice, phase header and actions; `src/routes/career-assessment.tsx`                                                         | Ordinary long document flow with large site/account chrome and actions after the question; no bounded reading area or anchored action bar.                            | Initial 320px question starts at y=631 on a 568px viewport; baseline action-offscreen failures                                                   |
| Result labels/search controls need mobile sizing                  | `src/routes/career-results.tsx`                                                                                                      | Desktop microcopy sizes, fixed chart labels and min-content flex widths are inherited on phones.                                                                      | Result captures and clipped/font/tap-target failures                                                                                             |
| Global choreography is inappropriate for the active test          | `src/components/MotionProvider.tsx`, assessment transition effect                                                                    | Route-wide clip masks and generic smooth-scroll/ScrollTrigger initialization compete with a dedicated scroll area.                                                    | Motion-on verification will separately check the new test-local transition; baseline uses reduced motion to distinguish geometry from animation. |

The current `BrainCanvas.tsx` renders a lazy SVG poster, not a WebGL renderer. The active assessment mounts no brain canvas. No particle-count or DPR setting exists to lower; the test must continue to mount no renderer behind its controls.

## Implementation rules

- Scope a dedicated grid to the active assessment: slim progress/back/exit header, `minmax(0,1fr)` vertically scrollable question area, and stable bottom navigation. Use `100vh` fallback, `100dvh`, safe-area insets and VisualViewport sizing for keyboards/rotation.
- Use 20–26px reading typography with 1.35 line height; answer/control text at least 16px; full-width answer cards at least 56px tall. Set shrinkable children and `overflow-wrap:anywhere`, with the actual document language retained.
- Keep the site's tokens, borders, selected states and fonts. Make selection explicit, preserve desktop layouts, session progress, age pools, shuffling and gender rules.
- Skip global smooth-scroll and pin/parallax setup on assessment routes. Use a short transform/opacity question transition, honour reduced motion, and clean up listeners/animations on exit.
- The repeatable tester must inspect descendant bounds and text containers, not just document width. Save every question screen, check actionable target sizes and primary-button reachability, and include keyboard/rotation, font/zoom, slow-network/CPU stresses and a desktop comparison.

## Completed pre-fix baseline

All nine requested mobile/tablet profiles failed the strict audit in all six locale/age cases (54/54 failures), with zero console errors and failed requests. The six desktop attempts hit an initial tester touch-mode error; that tester error was fixed separately and is not reported as an application defect. Desktop comparison uses the earlier 1440px captures plus the corrected final regression run.

| Profile          | Viewport   | Baseline locale/age cases |
| ---------------- | ---------- | ------------------------- |
| iphone-se        | 375 × 667  | 6/6 failed                |
| iphone-15        | 390 × 844  | 6/6 failed                |
| iphone-max       | 430 × 932  | 6/6 failed                |
| pixel-7          | 412 × 915  | 6/6 failed                |
| galaxy           | 360 × 800  | 6/6 failed                |
| android-small    | 320 × 568  | 6/6 failed                |
| iphone-landscape | 844 × 390  | 6/6 failed                |
| galaxy-landscape | 800 × 360  | 6/6 failed                |
| tablet           | 768 × 1024 | 6/6 failed                |

Full screenshots and named failures: [baseline gallery](mobile-report/baseline/index.html).

## Additional failures found under stress

- At 200% text size, the chooser's fixed action group covered the age cards. Secondary restart/methodology controls now remain in document flow; only Start/Continue is fixed. Profile cards stack and their labels shrink and wrap.
- A tablet/full-results transition produced CLS 0.218 because the footer was visible beneath a short loading skeleton, then moved offscreen when the actual result arrived. The result reading plane now reserves at least one dynamic viewport; the targeted Russian tablet recheck passed both ages (CLS 0.008 / 0.043).
- At 844 × 226 keyboard-sized landscape height with 200% text, the header and action area exceeded the available height. Very short viewports now use 44px icon controls, a 16px count/action label, compact spacing and an internally scrolling reader.
- Enlarged interest labels in three-column result cards had only 6px left beside a fixed 192px bar. Mobile/tablet interest rows now stack the label and full-width bar. The hidden radar no longer leaves an empty grid column.
- The tester excludes deliberate viewport/font reflow and initial module/font loading from its after-load CLS threshold, while still auditing geometry at those sizes. It retains layout-shift source records to distinguish loading transitions from real movement during use.
- Generated HTML galleries initially triggered Vite's global page reload during other device cases, causing interrupted imports and unreliable measurements. `vite.config.ts` now excludes both report and verification artifact directories from its watcher. Genuine delivery failures still fail the suite; closing a completed context no longer crashes another case's route interceptor.
- The app's Google-hosted font stylesheet could render a page while its font-file requests remained pending, delaying the browser load event beyond 30 seconds on a cold mobile visit. Font files are now bundled locally through Fontsource, and the external stylesheet was removed from both the root page and error page. The previously failing Uzbek Pixel 7 child case passed after this change.
- Throttling uncached Vite development modules during the final navigation once left the results route blank with `ERR_NETWORK_IO_SUSPENDED`. The stress runner now measures 3G/4× CPU on warmed question interactions and restores normal network speed before its cold result-route navigation. Result layout and errors are still audited after navigation.
