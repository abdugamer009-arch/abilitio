# Abilitio documentation

Start with the [project README](../README.md). This index separates current working guidance from historical design and incident records.

## Development

| Guide                                       | Purpose                                                                |
| ------------------------------------------- | ---------------------------------------------------------------------- |
| [Architecture](development/ARCHITECTURE.md) | Feature map, entry points, assessment flow and data boundaries         |
| [Local setup](development/LOCAL_SETUP.md)   | Public-only development, backend environment and verification commands |
| [Routing](development/ROUTING.md)           | TanStack naming and generated-route conventions                        |
| [Contributing](../CONTRIBUTING.md)          | Branches, file placement, checks and release workflow                  |
| [Agent guidance](../AGENTS.md)              | Invariants for future coding sessions                                  |

## Operations

| Guide                                                         | Status and purpose                                                                   |
| ------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| [Owner migrations](operations/OWNER_MIGRATIONS.md)            | Current owner-run release procedure and staging checks                               |
| [Full catalog](operations/FULL_CATALOG.md)                    | Implemented 561-question/166-career behavior and validation limits                   |
| [Results API investigation](operations/RESULTS_API_REPAIR.md) | Historical missing-column evidence; use the newer owner migration guide for releases |
| [Source backup preparation](../scripts/migration/README.md)   | Database/storage export tooling; no completed provider transfer                      |

## Design history

These records explain earlier decisions and verification. Their historical counts, plans and local paths are not a statement of current production state.

| Record                                         | Purpose                                               |
| ---------------------------------------------- | ----------------------------------------------------- |
| [Cartoon redesign](design/CARTOON_REDESIGN.md) | Illustrated interface changes and prior checks        |
| [Clarity fixes](design/CLARITY_FIXES.md)       | Trust, accessibility and explanation changes          |
| [Product plan](design/PLAN.md)                 | Original product direction and implementation history |
| [Critique](design/CRITIQUE.md)                 | Earlier interface audit                               |

Keep new setup/architecture guidance in `development/`, operational evidence in `operations/`, and design retrospectives in `design/`. Link back here when adding a guide.
