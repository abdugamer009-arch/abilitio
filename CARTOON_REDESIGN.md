# Abilitio cartoon redesign

Implemented in the existing checkout on `cartoon-redesign`. No deployment or push was performed. This checkout already contained substantial uncommitted work; the file list below is measured against a snapshot taken before this redesign, rather than against Git HEAD. Those earlier edits and deletions were retained.

## Implementation

- One light/dark palette and Tailwind theme in `src/styles.css`; the requested five Google Font families load once per document.
- Reference triangle logo, cartoon brain, magnifier, school, speech bubbles, stage badges, pen marks, sparkles and connectors use the supplied SVG paths. The existing lazy illustration lifecycle, captions, loading, retry and analytics are retained around the SVG renderer.
- Shared navigation, footer, controls, inputs, choices, scales, cards, hard shadows, progress, charts, tables, empty/loading/error states and modals use the cartoon system. Mobile settings rows wrap instead of clipping controls.
- Existing workshop stages, persistence, assessment inputs, native radio keyboard behavior, full 30-question flow, score calculations, links, auth handlers and data operations remain in place. Sequence tiles and explanation arcs derive their numbers from the existing sample question.
- Existing founder information, founder photos and all three language dictionaries were retained. Social preview wording was retained while its art and fonts changed.
- Removed unused Three.js/types and old font packages; no runtime package was added.

## Verification

- `npm run lint`: pass.
- `npx tsc --noEmit`: pass.
- `npm test`: 7 files, 66 tests pass.
- `NITRO_PRESET=node-server npm run build`: pass. The build still emits dependency `use client` directive and large-chunk notices. Dev mode also reports `inputValidator` deprecations in existing server functions. The server functions were left unchanged.
- 744 route visits cover all UI routes plus a missing route in ENG/RU/UZ, light/dark, at 1440/1024/768/390. No browser exceptions or horizontal page overflow in the final matrix. The matrix found five test-harness preference mismatches when HTTP redirects dropped QA query arguments at a configuration boundary. A separate 72-case redirect check seeds preferences before navigation and confirms all three legacy redirects preserve ENG/RU/UZ and light/dark at every requested width.
- 96 restored assessment-screen checks cover cognitive, personality and visual-interest screens at all 24 language/theme/width configurations; no page or element overflow or browser exceptions.
- Real guest interactions cover all 30 questions; workshop disabled/selected/wrong/correct answers, sequence arcs, answer persistence and reset; language/theme persistence; motion on/off and independent illustration cycling.
- 288 authenticated UI visits use synthetic browser-only fixtures, not real accounts. Fixtures replace modules only in the QA browser; they are never written into application source. Populated results, school/admin dashboards, school forms, roadmap, community empty state and ABBI are checked across all 24 configurations.
- 192 dashboard tab, score-editing and settings views are checked across all 24 configurations, including element bounds so page-level clipping cannot hide an overflow. A further 24 fixture views verify the add-activity form and roadmap celebration dialog in all three languages and both themes at desktop/phone widths.
- A dev hot-reload run briefly produced a stale language-context SSR warning. After restarting, all 192 tab/settings checks passed without browser errors. A separate 72-case production preview check covers home, sign-in and 404 in all three languages, both themes and all four widths; all pass with saved preferences and no overflow or browser errors.
- Source audit: no changed translated `w(...)` calls, Supabase calls, analytics calls, or route declarations. Assessment banks/scoring/server functions, auth/Supabase integration, dictionaries, generated routes, build configuration and server entry points are unchanged against the pre-task snapshot. No pre-existing source file was deleted.

## Reference differences and remaining limits

The four pages are **not pixel-identical** to the templates. Their visual tokens and drawings follow the HTML files, but the existing site's copy and content differ. Keeping the original copy and features takes precedence over replacing them with reference placeholders:

- Home retains “Practice tools”, the existing kicker, explanatory paragraph, account guidance and stage labels. This changes wrapping and vertical positions. The real motto and two founder photos replace the reference's photo placeholder and “AWAITING APPROVAL” stamp; no matching existing approval label exists to split.
- How it works retains the live wording in the interest section and the extra journey walkthrough, which are absent/different in the reference.
- For schools retains its existing heading and onboarding copy, plus the real site's report preview. The longer heading produces an extra line and shifts the school illustration and step cards down.
- Team retains the existing motto, actual portraits, founder names/roles/order and CTA labels. Portraits are preserved instead of substituting initials-only placeholders.
- Existing additional/legacy pages, all link destinations and untranslated original labels in some administrative/report screens are retained.
- The reference is light only. Dark mode follows the requested dark tokens rather than an unprovided dark screenshot. Phone/tablet layouts wrap longer text and controls to preserve visibility and touch targets.
- Authored assessment color swatches retain their original colors and two-color fills because those are question stimuli, not site branding. Existing photos and unused old font files also remain on disk under the no-deletion rule; the app no longer loads those fonts.
- This local checkout has no configured account service. Live sign-in, persistence to Supabase, admin permission checks, uploads, real-time messages, server-backed result submission and outbound reset mail could not be verified. The fixtures verify presentation only. No live database data was modified.

## Files changed by this task

- [CARTOON_REDESIGN.md](/home/umaraxmedov/Documents/ChatGPT/abilitio/CARTOON_REDESIGN.md)
- [package-lock.json](/home/umaraxmedov/Documents/ChatGPT/abilitio/package-lock.json)
- [package.json](/home/umaraxmedov/Documents/ChatGPT/abilitio/package.json)
- [public/apple-touch-icon.png](/home/umaraxmedov/Documents/ChatGPT/abilitio/public/apple-touch-icon.png)
- [public/favicon.svg](/home/umaraxmedov/Documents/ChatGPT/abilitio/public/favicon.svg)
- [public/og-image.png](/home/umaraxmedov/Documents/ChatGPT/abilitio/public/og-image.png)
- [src/components/AbbiChat.tsx](/home/umaraxmedov/Documents/ChatGPT/abilitio/src/components/AbbiChat.tsx)
- [src/components/AdminBadge.tsx](/home/umaraxmedov/Documents/ChatGPT/abilitio/src/components/AdminBadge.tsx)
- [src/components/BrainCanvas.tsx](/home/umaraxmedov/Documents/ChatGPT/abilitio/src/components/BrainCanvas.tsx)
- [src/components/BrainPoster.tsx](/home/umaraxmedov/Documents/ChatGPT/abilitio/src/components/BrainPoster.tsx)
- [src/components/BrainScene.tsx](/home/umaraxmedov/Documents/ChatGPT/abilitio/src/components/BrainScene.tsx)
- [src/components/BrandMark.tsx](/home/umaraxmedov/Documents/ChatGPT/abilitio/src/components/BrandMark.tsx)
- [src/components/CareerWorkshop.tsx](/home/umaraxmedov/Documents/ChatGPT/abilitio/src/components/CareerWorkshop.tsx)
- [src/components/CartoonArtwork.tsx](/home/umaraxmedov/Documents/ChatGPT/abilitio/src/components/CartoonArtwork.tsx)
- [src/components/ChoiceOptions.tsx](/home/umaraxmedov/Documents/ChatGPT/abilitio/src/components/ChoiceOptions.tsx)
- [src/components/EditorialPage.tsx](/home/umaraxmedov/Documents/ChatGPT/abilitio/src/components/EditorialPage.tsx)
- [src/components/Footer.tsx](/home/umaraxmedov/Documents/ChatGPT/abilitio/src/components/Footer.tsx)
- [src/components/LanguageSwitcher.tsx](/home/umaraxmedov/Documents/ChatGPT/abilitio/src/components/LanguageSwitcher.tsx)
- [src/components/MotionProvider.tsx](/home/umaraxmedov/Documents/ChatGPT/abilitio/src/components/MotionProvider.tsx)
- [src/components/Navbar.tsx](/home/umaraxmedov/Documents/ChatGPT/abilitio/src/components/Navbar.tsx)
- [src/components/ProfilePhotoCard.tsx](/home/umaraxmedov/Documents/ChatGPT/abilitio/src/components/ProfilePhotoCard.tsx)
- [src/components/ScrollProgress.tsx](/home/umaraxmedov/Documents/ChatGPT/abilitio/src/components/ScrollProgress.tsx)
- [src/components/StageBadge.tsx](/home/umaraxmedov/Documents/ChatGPT/abilitio/src/components/StageBadge.tsx)
- [src/components/ThemeToggle.tsx](/home/umaraxmedov/Documents/ChatGPT/abilitio/src/components/ThemeToggle.tsx)
- [src/lib/error-page.ts](/home/umaraxmedov/Documents/ChatGPT/abilitio/src/lib/error-page.ts)
- [src/routes/__root.tsx](/home/umaraxmedov/Documents/ChatGPT/abilitio/src/routes/__root.tsx)
- [src/routes/abbi.tsx](/home/umaraxmedov/Documents/ChatGPT/abilitio/src/routes/abbi.tsx)
- [src/routes/admin.tsx](/home/umaraxmedov/Documents/ChatGPT/abilitio/src/routes/admin.tsx)
- [src/routes/auth.tsx](/home/umaraxmedov/Documents/ChatGPT/abilitio/src/routes/auth.tsx)
- [src/routes/career-assessment.tsx](/home/umaraxmedov/Documents/ChatGPT/abilitio/src/routes/career-assessment.tsx)
- [src/routes/career-results.tsx](/home/umaraxmedov/Documents/ChatGPT/abilitio/src/routes/career-results.tsx)
- [src/routes/community.tsx](/home/umaraxmedov/Documents/ChatGPT/abilitio/src/routes/community.tsx)
- [src/routes/dashboard.tsx](/home/umaraxmedov/Documents/ChatGPT/abilitio/src/routes/dashboard.tsx)
- [src/routes/index.tsx](/home/umaraxmedov/Documents/ChatGPT/abilitio/src/routes/index.tsx)
- [src/routes/roadmap.tsx](/home/umaraxmedov/Documents/ChatGPT/abilitio/src/routes/roadmap.tsx)
- [src/routes/school.analytics.tsx](/home/umaraxmedov/Documents/ChatGPT/abilitio/src/routes/school.analytics.tsx)
- [src/routes/school.dashboard.tsx](/home/umaraxmedov/Documents/ChatGPT/abilitio/src/routes/school.dashboard.tsx)
- [src/routes/school.report.tsx](/home/umaraxmedov/Documents/ChatGPT/abilitio/src/routes/school.report.tsx)
- [src/styles.css](/home/umaraxmedov/Documents/ChatGPT/abilitio/src/styles.css)

## Route inventory

| Route | Source |
|---|---|
| `/abbi` | [src/routes/abbi.tsx](/home/umaraxmedov/Documents/ChatGPT/abilitio/src/routes/abbi.tsx) |
| `/about` | [src/routes/about.tsx](/home/umaraxmedov/Documents/ChatGPT/abilitio/src/routes/about.tsx) |
| `/admin` | [src/routes/admin.tsx](/home/umaraxmedov/Documents/ChatGPT/abilitio/src/routes/admin.tsx) |
| `/assessment` | [src/routes/assessment.tsx](/home/umaraxmedov/Documents/ChatGPT/abilitio/src/routes/assessment.tsx) |
| `/auth` | [src/routes/auth.tsx](/home/umaraxmedov/Documents/ChatGPT/abilitio/src/routes/auth.tsx) |
| `/career-assessment` | [src/routes/career-assessment.tsx](/home/umaraxmedov/Documents/ChatGPT/abilitio/src/routes/career-assessment.tsx) |
| `/career-battles` | [src/routes/career-battles.tsx](/home/umaraxmedov/Documents/ChatGPT/abilitio/src/routes/career-battles.tsx) |
| `/career-results` | [src/routes/career-results.tsx](/home/umaraxmedov/Documents/ChatGPT/abilitio/src/routes/career-results.tsx) |
| `/community` | [src/routes/community.tsx](/home/umaraxmedov/Documents/ChatGPT/abilitio/src/routes/community.tsx) |
| `/contact` | [src/routes/contact.tsx](/home/umaraxmedov/Documents/ChatGPT/abilitio/src/routes/contact.tsx) |
| `/dashboard` | [src/routes/dashboard.tsx](/home/umaraxmedov/Documents/ChatGPT/abilitio/src/routes/dashboard.tsx) |
| `/features` | [src/routes/features.tsx](/home/umaraxmedov/Documents/ChatGPT/abilitio/src/routes/features.tsx) |
| `/for-schools` | [src/routes/for-schools.tsx](/home/umaraxmedov/Documents/ChatGPT/abilitio/src/routes/for-schools.tsx) |
| `/` | [src/routes/index.tsx](/home/umaraxmedov/Documents/ChatGPT/abilitio/src/routes/index.tsx) |
| `/iq-test` | [src/routes/iq-test.tsx](/home/umaraxmedov/Documents/ChatGPT/abilitio/src/routes/iq-test.tsx) |
| `/mentors` | [src/routes/mentors.tsx](/home/umaraxmedov/Documents/ChatGPT/abilitio/src/routes/mentors.tsx) |
| `/methodology` | [src/routes/methodology.tsx](/home/umaraxmedov/Documents/ChatGPT/abilitio/src/routes/methodology.tsx) |
| `/pricing` | [src/routes/pricing.tsx](/home/umaraxmedov/Documents/ChatGPT/abilitio/src/routes/pricing.tsx) |
| `/privacy` | [src/routes/privacy.tsx](/home/umaraxmedov/Documents/ChatGPT/abilitio/src/routes/privacy.tsx) |
| `/results` | [src/routes/results.tsx](/home/umaraxmedov/Documents/ChatGPT/abilitio/src/routes/results.tsx) |
| `/roadmap` | [src/routes/roadmap.tsx](/home/umaraxmedov/Documents/ChatGPT/abilitio/src/routes/roadmap.tsx) |
| `/school/analytics` | [src/routes/school.analytics.tsx](/home/umaraxmedov/Documents/ChatGPT/abilitio/src/routes/school.analytics.tsx) |
| `/school/class-builder` | [src/routes/school.class-builder.tsx](/home/umaraxmedov/Documents/ChatGPT/abilitio/src/routes/school.class-builder.tsx) |
| `/school/dashboard` | [src/routes/school.dashboard.tsx](/home/umaraxmedov/Documents/ChatGPT/abilitio/src/routes/school.dashboard.tsx) |
| `/school/join` | [src/routes/school.join.tsx](/home/umaraxmedov/Documents/ChatGPT/abilitio/src/routes/school.join.tsx) |
| `/school/register` | [src/routes/school.register.tsx](/home/umaraxmedov/Documents/ChatGPT/abilitio/src/routes/school.register.tsx) |
| `/school/report` | [src/routes/school.report.tsx](/home/umaraxmedov/Documents/ChatGPT/abilitio/src/routes/school.report.tsx) |
| `/sitemap.xml` | [src/routes/sitemap[.]xml.ts](/home/umaraxmedov/Documents/ChatGPT/abilitio/src/routes/sitemap[.]xml.ts) |
| `/success-stories` | [src/routes/success-stories.tsx](/home/umaraxmedov/Documents/ChatGPT/abilitio/src/routes/success-stories.tsx) |
| `/terms` | [src/routes/terms.tsx](/home/umaraxmedov/Documents/ChatGPT/abilitio/src/routes/terms.tsx) |
| `/universities` | [src/routes/universities.tsx](/home/umaraxmedov/Documents/ChatGPT/abilitio/src/routes/universities.tsx) |

`src/routes/__root.tsx` provides the shell, 404 and route-error rendering. The missing-page route used for QA is not an added application route. Sitemap is a server endpoint, not a UI page.

## Shared component inventory

- [src/components/AbbiChat.tsx](/home/umaraxmedov/Documents/ChatGPT/abilitio/src/components/AbbiChat.tsx)
- [src/components/ActivityGuide.tsx](/home/umaraxmedov/Documents/ChatGPT/abilitio/src/components/ActivityGuide.tsx)
- [src/components/AdminBadge.tsx](/home/umaraxmedov/Documents/ChatGPT/abilitio/src/components/AdminBadge.tsx)
- [src/components/AmbientBackdrop.tsx](/home/umaraxmedov/Documents/ChatGPT/abilitio/src/components/AmbientBackdrop.tsx)
- [src/components/BrainCanvas.tsx](/home/umaraxmedov/Documents/ChatGPT/abilitio/src/components/BrainCanvas.tsx)
- [src/components/BrainPoster.tsx](/home/umaraxmedov/Documents/ChatGPT/abilitio/src/components/BrainPoster.tsx)
- [src/components/BrainScene.tsx](/home/umaraxmedov/Documents/ChatGPT/abilitio/src/components/BrainScene.tsx)
- [src/components/BrandMark.tsx](/home/umaraxmedov/Documents/ChatGPT/abilitio/src/components/BrandMark.tsx)
- [src/components/CareerWorkshop.tsx](/home/umaraxmedov/Documents/ChatGPT/abilitio/src/components/CareerWorkshop.tsx)
- [src/components/CartoonArtwork.tsx](/home/umaraxmedov/Documents/ChatGPT/abilitio/src/components/CartoonArtwork.tsx)
- [src/components/ChoiceOptions.tsx](/home/umaraxmedov/Documents/ChatGPT/abilitio/src/components/ChoiceOptions.tsx)
- [src/components/CountUp.tsx](/home/umaraxmedov/Documents/ChatGPT/abilitio/src/components/CountUp.tsx)
- [src/components/EditorialPage.tsx](/home/umaraxmedov/Documents/ChatGPT/abilitio/src/components/EditorialPage.tsx)
- [src/components/FloatingShapes.tsx](/home/umaraxmedov/Documents/ChatGPT/abilitio/src/components/FloatingShapes.tsx)
- [src/components/Footer.tsx](/home/umaraxmedov/Documents/ChatGPT/abilitio/src/components/Footer.tsx)
- [src/components/FounderPortrait.tsx](/home/umaraxmedov/Documents/ChatGPT/abilitio/src/components/FounderPortrait.tsx)
- [src/components/GlowBlob.tsx](/home/umaraxmedov/Documents/ChatGPT/abilitio/src/components/GlowBlob.tsx)
- [src/components/GradientDivider.tsx](/home/umaraxmedov/Documents/ChatGPT/abilitio/src/components/GradientDivider.tsx)
- [src/components/LanguageSwitcher.tsx](/home/umaraxmedov/Documents/ChatGPT/abilitio/src/components/LanguageSwitcher.tsx)
- [src/components/LegalPage.tsx](/home/umaraxmedov/Documents/ChatGPT/abilitio/src/components/LegalPage.tsx)
- [src/components/MaskText.tsx](/home/umaraxmedov/Documents/ChatGPT/abilitio/src/components/MaskText.tsx)
- [src/components/MotionProvider.tsx](/home/umaraxmedov/Documents/ChatGPT/abilitio/src/components/MotionProvider.tsx)
- [src/components/Navbar.tsx](/home/umaraxmedov/Documents/ChatGPT/abilitio/src/components/Navbar.tsx)
- [src/components/PageShell.tsx](/home/umaraxmedov/Documents/ChatGPT/abilitio/src/components/PageShell.tsx)
- [src/components/ProfilePhotoCard.tsx](/home/umaraxmedov/Documents/ChatGPT/abilitio/src/components/ProfilePhotoCard.tsx)
- [src/components/Reveal.tsx](/home/umaraxmedov/Documents/ChatGPT/abilitio/src/components/Reveal.tsx)
- [src/components/SchoolReportPreview.tsx](/home/umaraxmedov/Documents/ChatGPT/abilitio/src/components/SchoolReportPreview.tsx)
- [src/components/ScrollProgress.tsx](/home/umaraxmedov/Documents/ChatGPT/abilitio/src/components/ScrollProgress.tsx)
- [src/components/SpotlightCard.tsx](/home/umaraxmedov/Documents/ChatGPT/abilitio/src/components/SpotlightCard.tsx)
- [src/components/StageBadge.tsx](/home/umaraxmedov/Documents/ChatGPT/abilitio/src/components/StageBadge.tsx)
- [src/components/ThemeToggle.tsx](/home/umaraxmedov/Documents/ChatGPT/abilitio/src/components/ThemeToggle.tsx)
- [src/components/dashboard/ExtraSections.tsx](/home/umaraxmedov/Documents/ChatGPT/abilitio/src/components/dashboard/ExtraSections.tsx)
- [src/components/ui/sonner.tsx](/home/umaraxmedov/Documents/ChatGPT/abilitio/src/components/ui/sonner.tsx)

## Review evidence

Production preview: [Abilitio](http://localhost:8092/). Development preview: [Abilitio dev](http://localhost:8081/).

At 1440px, the supplied HTML is rendered on the left and the existing site after the redesign on the right. Template behavior/scripts are omitted from these QA-only renders.

- [Home comparison](/tmp/abilitio-cartoon/comparison-Main.png)
- [How it works comparison](/tmp/abilitio-cartoon/comparison-HowItWorks.png)
- [For schools comparison](/tmp/abilitio-cartoon/comparison-ForSchools.png)
- [Team comparison](/tmp/abilitio-cartoon/comparison-Team.png)
- [Source boundary audit](/tmp/abilitio-cartoon/source-audit.json)
- [Route matrix](/tmp/abilitio-cartoon/matrix.json)
- [Assessment screen matrix](/tmp/abilitio-cartoon/assessmentQA.json)
- [Workshop and assessment interactions](/tmp/abilitio-cartoon/interactions.json)
- [Authenticated fixture matrix](/tmp/abilitio-cartoon/authenticated.json)
- [Dashboard tab and settings checks](/tmp/abilitio-cartoon/states.json)
- [Legacy redirect checks](/tmp/abilitio-cartoon/redirects.json)
- [Activity form and modal checks](/tmp/abilitio-cartoon/forms-modal.json)
- [Production preview checks](/tmp/abilitio-cartoon/recheck.json)

QA files are temporary local artifacts in `/tmp/abilitio-cartoon`; no alternate application or fake data is included in the repository.
