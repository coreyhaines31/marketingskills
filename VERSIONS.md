# Marketing Skills Versions

Current versions of all skills. Agents can compare against local versions to check for updates.

| Skill | Version | Last Updated |
|-------|---------|--------------|
| ab-test-setup | 1.1.0 | 2026-02-27 |
| ad-creative | 1.1.0 | 2026-02-27 |
| ai-seo | 1.1.0 | 2026-02-27 |
| analytics-tracking | 1.1.0 | 2026-02-27 |
| churn-prevention | 1.1.0 | 2026-02-27 |
| cold-email | 1.1.0 | 2026-02-27 |
| competitor-alternatives | 1.1.0 | 2026-02-27 |
| content-strategy | 1.1.0 | 2026-02-27 |
| copy-editing | 1.1.0 | 2026-02-27 |
| copywriting | 1.1.0 | 2026-02-27 |
| email-sequence | 1.1.0 | 2026-02-27 |
| form-cro | 1.1.0 | 2026-02-27 |
| free-tool-strategy | 1.1.0 | 2026-02-27 |
| launch-strategy | 1.1.0 | 2026-02-27 |
| marketing-ideas | 1.1.0 | 2026-02-27 |
| marketing-psychology | 1.1.0 | 2026-02-27 |
| onboarding-cro | 1.1.0 | 2026-02-27 |
| page-cro | 1.1.0 | 2026-02-27 |
| paid-ads | 1.1.0 | 2026-02-27 |
| persona-messaging | 1.1.0 | 2026-03-08 |
| paywall-upgrade-cro | 1.1.0 | 2026-02-27 |
| popup-cro | 1.1.0 | 2026-02-27 |
| pricing-strategy | 1.1.0 | 2026-02-27 |
| product-marketing-context | 1.1.0 | 2026-02-27 |
| programmatic-seo | 1.1.0 | 2026-02-27 |
| referral-program | 1.1.0 | 2026-02-27 |
| revops | 1.1.0 | 2026-02-27 |
| sales-enablement | 1.1.0 | 2026-02-27 |
| schema-markup | 1.1.0 | 2026-02-27 |
| seo-audit | 1.1.0 | 2026-02-27 |
| signup-flow-cro | 1.1.0 | 2026-02-27 |
| site-architecture | 1.1.0 | 2026-02-27 |
| social-content | 1.1.0 | 2026-02-27 |

## Recent Changes

### 2026-03-08
- Added `persona-messaging` skill for buyer persona dossiers, persona-specific messaging, and research fallback for unknown personas
- Cross-referenced from `cold-email`, `email-sequence`, and `sales-enablement`

### 2026-02-27
- Migrated context path from `.claude/` to `.agents/` for agent-agnostic compatibility
- All skills now check `.agents/product-marketing-context.md` first, with `.claude/` fallback for older setups
- Updated install paths in README to reference `.agents/skills/`
- Bumped all 32 skills from 1.0.0 → 1.1.0

### 2026-02-22
- Added `revops` skill for revenue operations, lead lifecycle, scoring, routing, pipeline management, and CRM automation
- Added `sales-enablement` skill for sales decks, one-pagers, objection handling, demo scripts, and sales playbooks

### 2026-02-21
- Added `site-architecture` skill for website structure planning, page hierarchy, navigation design, URL structure, and internal linking strategy

### 2026-02-18
- Added `ai-seo` skill for AI search optimization (AEO, GEO, LLMO, AI Overviews)
- Moved AEO/GEO content patterns from `seo-audit` references to `ai-seo` skill
- Added `churn-prevention` skill for cancel flows, save offers, dunning, and payment recovery

### 2026-02-17
- Added `ad-creative` skill for bulk ad creative generation and performance-based iteration
- Added 51 zero-dependency CLI tools for marketing platforms (`tools/clis/`)
- Added 31 new integration guides (`tools/integrations/`)
- Added 4 email outreach CLIs: hunter, snov, lemlist, instantly
- Security hardening: header auth for meta-ads, URL encoding, input validation
- All CLIs reviewed via independent codex audit (auth, security, error handling, consistency)

### 2026-01-27
- Initial version tracking added
- Added tools registry with 29 integration guides
