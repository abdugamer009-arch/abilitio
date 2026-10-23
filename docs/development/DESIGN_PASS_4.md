# Design pass 4

The six owner-provided `*4.dc.html` artboards define the visual geometry. Live English, Uzbek and Russian copy, question content, account data and route behavior take precedence over sample artboard content.

## Implementation

- `src/components/design4/Artwork.tsx` contains memoized inline SVGs copied from those references. Its HTML strings are fixed, trusted build-time constants; never interpolate user content into them.
- `use-artwork-motion.ts` owns visibility and document-visibility observation. `MotionArtwork.tsx` connects the existing motion preference to each drawing. The hero station interval is 2,800 ms; artwork loops pause outside the viewport, with Motion off, or with the system reduced-motion preference.
- `src/styles/design-pass-4.css` follows the application and dashboard stylesheets in the root document. Keep this order. Pastel paper uses illustration ink in both themes; large text also respects the owner's 4.5:1 contrast floor. Existing dark tokens and route-transition ownership remain intact.
- Workshop figures use their existing data and grading. The optional `practice` drawing prop normalizes answer canvases to 120 × 120, stroke width 4 and dot radius 7 without changing scored assessment rendering.
- Folder tabs share a board while retaining the existing buttons, state and lazy loading. The profile header remains above every tab. Tally marks use the fetched count, four strokes plus a diagonal for each group of five.
- Profile, university, contact and ABBI handlers retain their existing persistence and access checks. No schema, migration, role or provider change is included.

## Verification

Run `npm run check` and `VERCEL=1 npm run build`. Inspect home/workshop, contact, university research, Recorded activity, ABBI and Settings at 390 px and 1440 px in both themes. Verify actual `innerWidth` before recording a screenshot: the in-app browser viewport override applies to its selected tab, not every background tab. Allow hydration to settle before changing a theme or reading selected-state attributes.

Private screenshots, build logs, visual-only account fixtures and deployment receipts belong outside Git. A local visual fixture is not proof of authenticated production persistence. Keep production smoke tests separate and preserve the owner's retained test records.
