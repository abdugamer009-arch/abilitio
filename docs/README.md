# Abilitio documentation

Start with the [project README](../README.md). This index separates current working guidance from historical design and incident records.

## Development

| Guide                                                 | Purpose                                                                |
| ----------------------------------------------------- | ---------------------------------------------------------------------- |
| [Architecture](development/ARCHITECTURE.md)           | Feature map, entry points, assessment flow and data boundaries         |
| [Local setup](development/LOCAL_SETUP.md)             | Public-only development, backend environment and verification commands |
| [Route transitions](development/ROUTE_TRANSITIONS.md) | Curtain ownership, preloading, scroll and performance checks           |
| [Routing](development/ROUTING.md)                     | TanStack naming and generated-route conventions                        |
| [Contributing](../CONTRIBUTING.md)                    | Branches, file placement, checks and release workflow                  |
| [Agent guidance](../AGENTS.md)                        | Invariants for future coding sessions                                  |

## Operations

| Guide                                                                       | Status and purpose                                                                          |
| --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| [Review and self-review, October 13](operations/REVIEW_2026_10_13.md)       | Original findings, corrected interpretation, repairs and verification limits                |
| [Prelaunch repairs, October 12](operations/PRELAUNCH_REPAIRS_2026_10_12.md) | Current repairs, live verification and launch blockers                                      |
| [Live production audit](operations/LIVE_AUDIT_2026_10_11.md)                | Real signup, saved results, account isolation, UI repairs and remaining verification limits |
| [Auth email setup](operations/AUTH_EMAIL_SETUP.md)                          | Resend domain verification, SMTP connection and recovery acceptance checks                  |
| [Supabase setup](operations/SUPABASE_SETUP.md)                              | Selected project, live schema checks and deployment status                                  |
| [Owner migrations](operations/OWNER_MIGRATIONS.md)                          | Current owner-run release procedure and staging checks                                      |
| [October 11 audit fixes](operations/AUDIT_FIXES.md)                         | Five reproduced regressions, repairs and release requirements                               |
| [Full catalog](operations/FULL_CATALOG.md)                                  | Implemented 561-question/166-career behavior and validation limits                          |
| [Results API investigation](operations/RESULTS_API_REPAIR.md)               | Historical missing-column evidence; use the newer owner migration guide for releases        |
| [Source backup preparation](../scripts/migration/README.md)                 | Database/storage export tooling; no completed provider transfer                             |

## Design history

These records explain earlier decisions and verification. Their historical counts, plans and local paths are not a statement of current production state.

| Record                                         | Purpose                                               |
| ---------------------------------------------- | ----------------------------------------------------- |
| [Cartoon redesign](design/CARTOON_REDESIGN.md) | Illustrated interface changes and prior checks        |
| [Clarity fixes](design/CLARITY_FIXES.md)       | Trust, accessibility and explanation changes          |
| [Product plan](design/PLAN.md)                 | Original product direction and implementation history |
| [Critique](design/CRITIQUE.md)                 | Earlier interface audit                               |

Keep new setup/architecture guidance in `development/`, operational evidence in `operations/`, and design retrospectives in `design/`. Link back here when adding a guide.

## Picture assessment pilot

- [Implementation, switches and pilot protocol](development/PICTURE_ASSESSMENT.md)
- [Full reasoning retirement register](design/ASSESSMENT_REASONING_RETIREMENT.md)

- [20 October picture assessment release and evidence boundaries](operations/PICTURE_ASSESSMENT_2026_10_20.md)
