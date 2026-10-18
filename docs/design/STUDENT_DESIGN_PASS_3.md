# Student dashboard design pass 3

This branch applies the owner's four October 18 HTML references to the existing student dashboard. `Dashboard.dc(1).html` supplies the profile and Results; `DashTabs.dc(2).html` supplies score tickets, activity notes and the university notebook; `Abbi.dc(1).html` and `Settings.dc(1).html` supply the corresponding tabs.

## Ownership and boundaries

- `src/components/dashboard/StudentPieces.tsx` contains reusable paper decorations and the supplied SVG path geometry. Illustrations retain their original dark ink on pastel fills; themed paper, typography and outlines use the existing light/dark tokens.
- `src/styles/student-dashboard.css` owns the dashboard styles. Its selectors and header adjustments are scoped to student pages. Importing the stylesheet elsewhere must not restyle Practice tools.
- The dashboard route retains all seven existing tab keys, data reads/writes, saved-value calculations, translation calls and navigation destinations. Activities, achievements, comparison controls, Security and Session remain available even where a reference omits them.
- Profile/photo presentation is shared across every dashboard tab. The camera opens the existing Settings tab. File validation, signed avatar URLs, storage upload and replacement cleanup are unchanged.
- ABBI keeps its existing guide name, greeting, prompts, reply generation, sanitized Markdown, history and composer behavior. The reference's AI wording is not substituted for the product's current strings.
- The digest switch is a disabled presentation of the unavailable service. It does not save a preference or claim to send email. Its copy already exists in the translation catalog.
- Scores retain the `/9` scale and the saved number, including the child not-assessed state. The static reference's `/10`, `7.8`, `Strong` and example names are not new product facts. No classification or scoring rule is added.
- No assessment, Practice, translation catalog, backend, migration or dependency changes belong to this pass. Audit fix branches and picture-assessment work remain separate.

## Visual checks

Check all seven tabs in ENG/RU/UZ and both themes at measured 390px and 1440px. Confirm the document has no horizontal overflow, controls remain keyboard accessible, long names/copy wrap and wide chat content scrolls inside the bubble. Check Motion off and reduced motion; the new CSS animations use the existing global pause policy and a reduced-motion override.

Private screenshot captures and check logs live in ignored `artifacts/design-pass-3/`. Local fixture configuration is ignored, never imported by the normal Vite config and must never be deployed. A local fixture screenshot validates rendering and UI interactions; it does not validate hosted authentication or database persistence.

The review gallery records each checklist item as done only with visible capture evidence. Preserve the original captured frames when building stitched comparison images and record any normalization performed by the screenshot backend.

## Release gate

Do not merge this branch, deploy production or write a production deployment entry until the owner explicitly says `APPROVE DESIGN`. After approval, combine approved changes with current main, run the checks/build, deploy, inspect every live dashboard tab and record the actual deployment and smoke-test results in `CHANGELOG.md`.
