# Marketing Skills Versions

Current versions of all skills. Agents can compare against local versions to check for updates.

| Skill | Version | Last Updated |
|-------|---------|--------------|
| ab-testing | 2.0.0 | 2026-05-05 |
| ad-creative | 2.0.0 | 2026-05-05 |
| ai-seo | 2.0.0 | 2026-05-05 |
| analytics | 2.0.0 | 2026-05-05 |
| aso | 2.0.0 | 2026-05-05 |
| churn-prevention | 2.0.0 | 2026-05-05 |
| co-marketing | 2.0.0 | 2026-05-05 |
| cold-email | 2.0.0 | 2026-05-05 |
| community-marketing | 2.0.0 | 2026-05-05 |
| competitor-profiling | 2.0.0 | 2026-05-05 |
| competitors | 2.0.0 | 2026-05-05 |
| content-strategy | 2.0.0 | 2026-05-05 |
| copy-editing | 2.0.0 | 2026-05-05 |
| copywriting | 2.0.0 | 2026-05-05 |
| cro | 2.0.0 | 2026-05-05 |
| customer-research | 2.0.0 | 2026-05-05 |
| directory-submissions | 2.0.0 | 2026-05-05 |
| emails | 2.0.0 | 2026-05-05 |
| free-tools | 2.0.0 | 2026-05-05 |
| image | 2.0.0 | 2026-05-05 |
| launch | 2.0.0 | 2026-05-05 |
| lead-magnets | 2.0.0 | 2026-05-05 |
| marketing-ideas | 2.0.0 | 2026-05-05 |
| marketing-psychology | 2.0.0 | 2026-05-05 |
| onboarding | 2.0.0 | 2026-05-05 |
| ads | 2.0.0 | 2026-05-05 |
| paywalls | 2.0.0 | 2026-05-05 |
| popups | 2.0.0 | 2026-05-05 |
| pricing | 2.0.0 | 2026-05-05 |
| product-marketing | 2.0.0 | 2026-05-05 |
| programmatic-seo | 2.0.0 | 2026-05-05 |
| referrals | 2.0.0 | 2026-05-05 |
| revops | 2.0.0 | 2026-05-05 |
| sales-enablement | 2.0.0 | 2026-05-05 |
| schema | 2.0.0 | 2026-05-05 |
| seo-audit | 2.0.0 | 2026-05-05 |
| signup | 2.0.0 | 2026-05-05 |
| site-architecture | 2.0.0 | 2026-05-05 |
| social | 2.0.0 | 2026-05-05 |
| video | 2.0.0 | 2026-05-05 |

## Recent Changes

### 2.0.0 (2026-05-05)

**Breaking changes** — Users must reinstall skills after this update.

#### Skill Renames (17)
| Old Name | New Name |
|----------|----------|
| ab-test-setup | ab-testing |
| analytics-tracking | analytics |
| aso-audit | aso |
| competitor-alternatives | competitors |
| email-sequence | emails |
| free-tool-strategy | free-tools |
| launch-strategy | launch |
| onboarding-cro | onboarding |
| paid-ads | ads |
| paywall-upgrade-cro | paywalls |
| popup-cro | popups |
| pricing-strategy | pricing |
| product-marketing-context | product-marketing |
| referral-program | referrals |
| schema-markup | schema |
| signup-flow-cro | signup |
| social-content | social |

#### Consolidations (1)
- `page-cro` + `form-cro` → `cro` (form content moved to `references/form.md`)

#### Why 2.0?
- Shorter, cleaner skill names
- Consistent naming conventions (no more `-strategy`, `-setup`, `-cro` suffixes)
- Consolidated CRO into single skill with references
- All cross-references updated across 100+ files

**Total skills: 40**

### 1.10.0 (2026-05-04)
- Added `co-marketing` skill for partner identification, joint campaigns, and co-marketing strategy
- Total skills: 41

### 2026-04-24
- Added `image` skill for AI image generation, design tools, profile/listing banners, and optimization
- Added `video` skill for AI video production (Hyperframes, HeyGen, Veo, Runway, Kling)
- Added short-form video section to `social` (1.3.0) — TikTok, Reels, Shorts frameworks
- Added HeyGen and Hyperframes tool integration guides
- Fixed plugin marketplace: `source` field now passes Claude Code schema validation (#270)
- Added proper `plugin.json` manifest with `"skills": "./skills"`
- Total skills: 40

### 2026-04-21
- Added `directory-submissions` skill for Product Hunt, G2, AI directories, and backlink strategy
- Added `competitor-profiling` skill for competitive intelligence research
- Added international SEO & localization section to `seo-audit` (1.2.0)
- Added conversion tracking reference to `ads` (cross-platform pixel setup)
- Added Zapier SDK integration for 8,000+ app access
- Fixed plugin loading: removed `./` prefix from marketplace.json skill paths (#243)
- Hardened CLI tools: Supermetrics API key moved to header, ZoomInfo JWT masked by default
- Fixed community-marketing YAML frontmatter (#240)
- Fixed Zapier webhook URL validation (#247)
- Added missing skills to VERSIONS.md (aso, community-marketing, customer-research — shipped in prior releases)
- Total skills: 38

### 2026-03-14
- Added `lead-magnets` skill for lead magnet strategy, format selection, and conversion optimization
- Added Composio integration layer for MCP access to OAuth-heavy tools (HubSpot, Salesforce, Meta Ads, LinkedIn Ads, Google Sheets, Slack, Notion, etc.)
- Added headless CMS integration guides (Sanity, Contentful, Strapi) with headless-cms reference
- Added 197 evals across all 33 skills for automated quality testing
- Optimized all 32 skill descriptions for better trigger phrase matching
- Replaced rigid imperatives with reasoning-based guidance across all skills
- Added 10 new CLI tools (airops, clay, close, coupler, crossbeam, outreach, pendo, similarweb, supermetrics, zoominfo)
- Added 13 new integration guides
- Bumped all 32 existing skills from 1.1.0 → 1.2.0

### 2026-02-27
- Migrated context path from `.claude/` to `.agents/` for agent-agnostic compatibility
- All skills now check `.agents/product-marketing.md` first, with `.claude/` fallback for older setups
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
