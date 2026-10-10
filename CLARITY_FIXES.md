# Clarity fixes — 9 October 2026

This follow-up implements the 14 misunderstandings identified in the user-experience review. Existing routes, assessment scoring, account ownership, founder photographs and design conventions are retained.

| # | Misunderstanding | Implemented change | Main files |
|---|---|---|---|
| 1 | Brain imagery obscures the product | Hero explains questions → careers/study subjects → practical activities. Brain is labelled an animated illustration. | src/routes/index.tsx |
| 2 | Signal/Vector/Trajectory are unexplained | Plain primary labels: Try questions, Choose a direction, Try an activity. Original names are secondary; descriptions remain visible on mobile. | src/components/CareerWorkshop.tsx |
| 3 | Default technology/solo choices look inferred | Both start unselected. Previous answers/task marks are preserved; ambiguous v1 defaults are discarded. Explicit v2 choices persist. | src/components/CareerWorkshop.tsx |
| 4 | Vector appears to compare careers | Label and explanation accurately describe choosing a direction to test. | src/components/CareerWorkshop.tsx |
| 5 | Account requirement appears too late | Homepage and assessment disclose that results require a free account. Guest finish opens signup with answers retained. Unconfigured account services show an honest unavailable notice. | src/routes/career-assessment.tsx, src/routes/auth.tsx |
| 6 | Separate reasoning bars look independently measured | Removed duplicated subscores; show the actual overall reasoning result and nine-question limitation. | src/routes/dashboard.tsx |
| 7 | Editable personal ratings look like measured abilities | Show only user-entered SAT/IELTS scores. Missing values say Not recorded. Old database rating fields are preserved without displaying them as measurements. | src/routes/dashboard.tsx |
| 8 | Career percentage looks like success probability | Fit score uses /100, with an explanation that it is an exploration suggestion, not probability or ability. Share card agrees. | src/routes/dashboard.tsx, src/routes/career-results.tsx |
| 9 | Practice answers appear to transfer to assessment | Four-question practice is explicitly separate from the 30-question assessment; browser-local practice and choices do not transfer. | src/components/CareerWorkshop.tsx |
| 10 | R.01/C1 numbering and checkmarks mislead | Consistent Question 1–4 labels, visible topics, explicit correct/try-again feedback. | src/components/CareerWorkshop.tsx |
| 11 | Tasks lack instructions; completion is ambiguous | Eleven tailored first-phase guides include instructions and completion criteria; opening instructions and recording completion are separate controls. Later tasks receive an evidence/reflection guide. Shared guide also appears in the account roadmap. | src/components/ActivityGuide.tsx, src/routes/roadmap.tsx |
| 12 | Level appears to measure ability | Activity level is labelled and its points formula explained; no career-readiness claim. | src/routes/dashboard.tsx |
| 13 | Methodology relies on jargon and vague timing | Practical three-step journey first; plain assessment section names. No timer; 15 minutes explicitly a planning estimate, not a measured duration. | src/components/EditorialPage.tsx, src/routes/career-assessment.tsx, src/lib/i18n.tsx |
| 14 | Schools cannot see the process/report/access boundaries | Concrete trial sequence, clearly fictional sample report, account-linking and principal-access notice before joining. My dashboard naming and study-subject wording replace ambiguous labels. | src/components/SchoolReportPreview.tsx, src/routes/school.join.tsx, src/components/Navbar.tsx |

## Verification

- TypeScript, lint and Node production build pass; 66 existing tests across seven files pass.
- Public flows at 1440/1024/390: all 11 guides opened, completion criteria visible, no horizontal overflow or captured JavaScript exceptions; preference persistence, per-direction completion and reset checked.
- Complete anonymous 30-question mobile assessment: signup handoff and retained local answers checked.
- Uzbek/Russian public-page checks at desktop/mobile include homepage, methodology, schools and assessment; screenshots and automated accessibility evidence are in the sibling delivery folder `after/clarity`.
- Dashboard/result screens checked at desktop/mobile in an isolated, explicitly labelled sample-data fixture. Missing scores, editing/saving sample scores, activity labels and fit scores checked. Fixture uses no real account or remote database writes.
- Legacy workshop answers and task marks preserved while ambiguous defaults clear; normal-motion stage changes checked on desktop/mobile.
- Testing caught expanded-guide mobile overflow and low-contrast selected/secondary labels; both corrected and rechecked.

## Limits

Supabase/account credentials are absent on this local installation. Real sign-in, emailed recovery, server-scored saves, account isolation and school permissions still require the configured staging integration checks described in README.md. No remote schema was changed. No new Lighthouse, sustained FPS or memory measurements are claimed for this clarity follow-up; earlier delivery measurements belong to the preceding rebuild. Browser evidence is Chromium on this host, not physical-device Safari/Firefox validation.
