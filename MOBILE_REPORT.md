# Mobile assessment repair

## What caused the failure

The old answer grid kept two columns on phones, and its text had no way to shrink between fixed icons. A page-wide clipping rule hid the overflow while question and option text still extended beyond the viewport. The test also inherited display-sized text, tiny Likert labels, generous nested padding and the site's ordinary long-page layout. On a 320 × 568 screen, the first question began below the viewport and the Next button required a long scroll. The pre-fix [diagnosis and screenshots](MOBILE_DIAGNOSIS.md) record the specific elements and source locations. All 54 mobile/tablet baseline locale and age cases failed the strict audit.

## What changed

- The active test has a dedicated `100dvh` reading frame with a `100vh` fallback, safe-area padding, a slim back/progress/exit header, an independently scrolling question area and a stable bottom action. VisualViewport resizing handles rotation and keyboard-sized viewports; the footer remains reachable. At very short landscape heights, the chrome compacts while text controls remain at least 16px and touch targets remain at least 44px.
- Questions use 20–26px text at about 1.35 line height. Answers are full-width cards with wrapping text, visible focus and selected states. The profile chooser stacks its choices on phones and keeps only Start/Continue fixed so enlarged text cannot cover an age choice. Result labels and interest bars stack at mobile/tablet widths. Loading results reserve a viewport so their footer does not jump into view and disappear.
- The test and results skip global smooth scrolling, pinning and route masks. Question transitions are brief transform/opacity changes and respect reduced motion. The existing brain is a lazy SVG illustration on the landing page; it is absent behind the test. Its touch signal is checked by the daily browser runner.
- Display, body and handwritten fonts are bundled with the app. Cold mobile loads no longer wait on Google's font host, which had intermittently delayed the load event after the page was visible.
- Progress, answers and the selected profile remain in the browser tab through refresh and resume. Restart and completion clear the draft. The original signed server grader, age pools, option shuffling, result rules and account ownership checks remain intact.

## Daily check and evidence

Run `npm run test:mobile` in this repository. It runs longest-text and randomized complete 30-question attempts, then a representative stress phase, across the requested nine mobile/tablet viewports plus a 1440px desktop comparison, in English, Russian and Uzbek and both age groups. Stress checks add 200% text, 200% zoom reflow, rotation, keyboard-sized viewports, warm-asset 3G and 4× CPU. The tester inspects descendant bounds, clipped text, scrolling reachability, primary actions, 44px targets, 16px minimum reading text, console and request failures, layout shift and frame timing. It saves every question, chooser and result screenshot. The filterable [gallery](mobile-report/index.html) and its JSON results identify the element and viewport when a case fails. The README explains browser setup and CI/pre-commit use.

The real signed-session check passed all four gender/age combinations at both 390px and 1440px, including refresh, changes of profile, reshuffling and reset. The repository check passed lint, TypeScript, 130 tests and export checks; the production Node build passed.

### Final daily run — 14 October 2026

`npm run test:mobile` exited successfully. All 180/180 locale/age/device cases passed, producing 4,932 screenshots. Longest-text and randomized modes completed every question in every flow; stress mode sampled representative question types with text, zoom, rotation, keyboard-sized and throttled conditions. Each cell below covers English, Russian and Uzbek for both age groups.

| Device | Viewport | Longest text | Randomized | Stress |
| --- | ---: | ---: | ---: | ---: |
| iPhone SE | 375 × 667 | 6/6 | 6/6 | 6/6 |
| iPhone 15 | 390 × 844 | 6/6 | 6/6 | 6/6 |
| iPhone Pro Max | 430 × 932 | 6/6 | 6/6 | 6/6 |
| Pixel 7 | 412 × 915 | 6/6 | 6/6 | 6/6 |
| Galaxy S-class | 360 × 800 | 6/6 | 6/6 | 6/6 |
| Small Android | 320 × 568 | 6/6 | 6/6 | 6/6 |
| iPhone landscape | 844 × 390 | 6/6 | 6/6 | 6/6 |
| Galaxy landscape | 800 × 360 | 6/6 | 6/6 | 6/6 |
| Tablet | 768 × 1024 | 6/6 | 6/6 | 6/6 |
| Desktop comparison | 1440 × 1000 | 6/6 | 6/6 | 6/6 |

There were zero console errors and failed requests. Maximum observed CLS was 0.0525 (limit 0.12), and the lowest median question-transition rate was 59.88 FPS (minimum 25). I reviewed the saved 320px and 375px touch-flow screens: the question and answer text wrap inside cards, the question area scrolls, and the Next action stays visible. [Open the filterable screenshot gallery](mobile-report/index.html).

## Practical limits

Browser checks use Chromium device user agents and touch emulation. The keyboard check resizes the viewport; it does not raise a physical OS keyboard or run native Safari. Browser accounts and saved-result delivery are simulated. The question catalogs, signatures and grading logic use application code, while live account persistence was not checked. The landing page is saved as a visual reference; strict reading-screen assertions apply to the chooser, questions and results. Keep the generated report directories excluded from Vite's watcher so gallery writes cannot reload a test in progress.

The slow-network stress measures warmed question interactions. The development server serves the result route as uncached modules, so the runner restores network speed for that cold navigation and then audits the result screen. CPU throttling remains enabled through the transition.
