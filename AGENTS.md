# CLAUDE.md

Guidelines for AI agents working in this repository.

## Repository Overview

This repository contains **Agent Skills** for AI agents following the [Agent Skills specification](https://agentskills.io/specification.md). Skills install to `.agents/skills/` (the cross-agent standard). This repo also serves as a **Claude Code plugin marketplace** via `.claude-plugin/marketplace.json`.

- **Name**: Marketing Skills
- **GitHub**: [coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills)
- **Creator**: Corey Haines
- **License**: MIT
- **Current State**: 32 skills · 61 CLI tools · 68 integration guides · all skills at v1.1.0

## Repository Structure

```
marketingskills/
├── .claude-plugin/
│   └── marketplace.json   # Claude Code plugin marketplace manifest
├── skills/                # 32 Agent Skills
│   └── skill-name/
│       ├── SKILL.md       # Required — main instructions (<500 lines)
│       ├── references/    # Optional — detailed docs loaded on demand
│       ├── evals/         # Optional — evaluation test suites
│       ├── scripts/       # Optional — executable code
│       └── assets/        # Optional — templates, data files
├── tools/
│   ├── clis/              # Zero-dependency Node.js CLI tools (61 tools)
│   ├── integrations/      # API integration guides (68 guides)
│   └── REGISTRY.md        # Tool index with capabilities
├── CLAUDE.md
├── CONTRIBUTING.md
├── LICENSE
├── README.md
└── VERSIONS.md            # Version tracking for all skills
```

## Build / Lint / Test Commands

**Skills** are content-only (no build step). Verify manually:
- YAML frontmatter is valid
- `name` field matches directory name exactly
- `name` is 1-64 chars, lowercase alphanumeric and hyphens only
- `description` is 1-1024 characters
- `SKILL.md` is under 500 lines

**CLI tools** (`tools/clis/*.js`) are zero-dependency Node.js scripts (Node 18+). Verify with:
```bash
node --check tools/clis/<name>.js         # Syntax check
node tools/clis/<name>.js                 # Show usage (no args = help)
node tools/clis/<name>.js <cmd> --dry-run # Preview request without sending
```

## Agent Skills Specification

Skills follow the [Agent Skills spec](https://agentskills.io/specification.md).

### Required Frontmatter

```yaml
---
name: skill-name
description: What this skill does and when to use it. Include trigger phrases.
---
```

### Frontmatter Field Constraints

| Field         | Required | Constraints                                                      |
|---------------|----------|------------------------------------------------------------------|
| `name`        | Yes      | 1-64 chars, lowercase `a-z`, numbers, hyphens. Must match dir.   |
| `description` | Yes      | 1-1024 chars. Describe what it does and when to use it.          |
| `license`     | No       | License name (default: MIT)                                      |
| `metadata`    | No       | Key-value pairs (author, version, etc.)                          |

### Name Field Rules

- Lowercase letters, numbers, and hyphens only
- Cannot start or end with hyphen
- No consecutive hyphens (`--`)
- Must match parent directory name exactly

**Valid**: `page-cro`, `email-sequence`, `ab-test-setup`
**Invalid**: `Page-CRO`, `-page`, `page--cro`

### Optional Skill Directories

```
skills/skill-name/
├── SKILL.md        # Required — main instructions (<500 lines)
├── references/     # Optional — detailed docs loaded on demand
├── evals/          # Optional — evaluation test suites
├── scripts/        # Optional — executable code
└── assets/         # Optional — templates, data files
```

**Evals**: All 32 existing skills have `evals/` directories containing assertion-based test suites (197+ evals total). When creating or significantly modifying a skill, add evals that cover: core use case triggers, boundary conditions, and expected output assertions.

## Writing Style Guidelines

### Structure

- Keep `SKILL.md` under 500 lines (move details to `references/`)
- Use H2 (`##`) for main sections, H3 (`###`) for subsections
- Use bullet points and numbered lists liberally
- Short paragraphs (2-4 sentences max)

### Tone

- Direct and instructional
- Second person ("You are a conversion rate optimization expert")
- Reasoning-based guidance over rigid imperatives — explain *why*, not just *what*
- Professional but approachable

### Formatting

- Bold (`**text**`) for key terms
- Code blocks for examples and templates
- Tables for reference data
- No excessive emojis

### Clarity Principles

- Clarity over cleverness
- Specific over vague
- Active voice over passive
- One idea per section

### Description Field Best Practices

The `description` is critical for skill discovery. Include:
1. What the skill does
2. When to use it (trigger phrases)
3. Related skills for scope boundaries

```yaml
description: When the user wants to optimize conversions on any marketing page. Use when the user says "CRO," "conversion rate optimization," "this page isn't converting." For signup flows, see signup-flow-cro.
```

Avoid trigger phrase conflicts between skills — each skill's description should clearly differentiate its scope from adjacent skills.

## Current Skills (32 total)

| Skill | Category | Description |
|-------|----------|-------------|
| `ab-test-setup` | CRO | A/B testing and experiment planning |
| `ad-creative` | Ads | Bulk ad creative generation and iteration |
| `ai-seo` | SEO | AI search optimization (AEO, GEO, LLMO, AI Overviews) |
| `analytics-tracking` | Analytics | Event tracking setup and measurement |
| `churn-prevention` | Retention | Cancel flows, save offers, dunning, payment recovery |
| `cold-email` | Outreach | B2B cold outreach emails and sequences |
| `competitor-alternatives` | Content | Competitor comparison and alternative pages |
| `content-strategy` | Content | Content planning and topic strategy |
| `copy-editing` | Copy | Edit and polish existing marketing copy |
| `copywriting` | Copy | Marketing page copy and rewriting |
| `email-sequence` | Email | Automated email flows and drip campaigns |
| `form-cro` | CRO | Lead capture and form optimization (non-signup) |
| `free-tool-strategy` | Growth | Free tool planning, evaluation, and building |
| `launch-strategy` | Growth | Product launches and feature announcements |
| `marketing-ideas` | Growth | 140 SaaS marketing ideas and inspiration |
| `marketing-psychology` | Strategy | Psychological principles and behavioral science |
| `onboarding-cro` | CRO | Post-signup user activation and first-run experience |
| `page-cro` | CRO | Homepage, landing page, and marketing page optimization |
| `paid-ads` | Ads | Google, Meta, LinkedIn, TikTok ad campaigns |
| `paywall-upgrade-cro` | CRO | In-app paywalls and upsell modals |
| `popup-cro` | CRO | Popups, modals, overlays, and slide-in optimization |
| `pricing-strategy` | Strategy | Pricing, packaging, and monetization decisions |
| `product-marketing-context` | Foundation | Foundation document for all other skills |
| `programmatic-seo` | SEO | SEO-driven page generation at scale |
| `referral-program` | Growth | Referral, affiliate, and word-of-mouth programs |
| `revops` | Sales | Revenue operations, lead lifecycle, scoring, routing |
| `sales-enablement` | Sales | Sales decks, one-pagers, objection handling, demo scripts |
| `schema-markup` | SEO | Schema markup and structured data implementation |
| `seo-audit` | SEO | Technical and on-page SEO audits |
| `signup-flow-cro` | CRO | Signup, registration, and trial flow optimization |
| `site-architecture` | SEO | Website structure, hierarchy, and navigation planning |
| `social-content` | Content | Social media content creation and scheduling |

**Note**: `product-marketing-context` is the foundation skill — it provides company/product context for all other skills. Skills look for context at `.agents/product-marketing-context.md` (with `.claude/` fallback for older setups).

## Claude Code Plugin

This repo also serves as a plugin marketplace. The manifest at `.claude-plugin/marketplace.json` lists all skills for installation via:

```bash
/plugin marketplace add coreyhaines31/marketingskills
/plugin install marketing-skills
```

See [Claude Code plugins documentation](https://code.claude.com/docs/en/plugins.md) for details.

## Git Workflow

### Branch Naming

- New skills: `feature/skill-name`
- Improvements: `fix/skill-name-description`
- Documentation: `docs/description`

### Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat: add skill-name skill`
- `fix: improve clarity in page-cro`
- `docs: update README`
- `refactor: replace rigid imperatives with reasoning-based guidance`

### Pull Request Checklist

- [ ] `name` matches directory name exactly
- [ ] `name` follows naming rules (lowercase, hyphens, no `--`)
- [ ] `description` is 1-1024 chars with trigger phrases
- [ ] No trigger phrase conflicts with existing skills
- [ ] `SKILL.md` is under 500 lines
- [ ] `evals/` added or updated for new/changed skill
- [ ] No sensitive data or credentials
- [ ] VERSIONS.md updated if skills were modified

## Tool Integrations

This repository includes a tools registry for agent-compatible marketing tools.

- **Tool discovery**: Read `tools/REGISTRY.md` to see available tools and their capabilities
- **Integration details**: See `tools/integrations/{tool}.md` for API endpoints, auth, and common operations
- **MCP-enabled tools**: ga4, stripe, mailchimp, google-ads, resend, zapier, zoominfo, clay, supermetrics, coupler, outreach, crossbeam

### Registry Structure

```
tools/
├── REGISTRY.md              # Index of all 61 tools with capabilities
├── clis/                    # Zero-dependency Node.js CLI tools
│   └── *.js                 # 61 tools — run with node, no npm install needed
└── integrations/            # Detailed integration guides (68 guides)
    ├── ga4.md
    ├── stripe.md
    ├── rewardful.md
    └── ...
```

### CLI Tool Conventions

All CLI tools follow a consistent pattern:
- **No dependencies** — plain Node.js 18+, no npm install
- **JSON output** — machine-readable responses
- **Env var auth** — credentials via environment variables (never hardcoded)
- **Consistent commands** — `node tools/clis/<tool>.js <resource> <action> [options]`
- **`--dry-run` flag** — preview API request without sending
- **No-args = help** — running with no arguments prints usage

### When to Use Tools

Skills reference relevant tools for implementation. For example:
- `referral-program` skill → rewardful, tolt, dub-co, mention-me guides
- `analytics-tracking` skill → ga4, mixpanel, segment guides
- `email-sequence` skill → customer-io, mailchimp, resend guides
- `paid-ads` skill → google-ads, meta-ads, linkedin-ads guides
- `revops` skill → hubspot, salesforce, outreach, clay guides
- `cold-email` skill → hunter, snov, lemlist, instantly guides

## Checking for Updates

When using any skill from this repository:

1. **Once per session**, on first skill use, check for updates:
   - Fetch `VERSIONS.md` from GitHub: https://raw.githubusercontent.com/coreyhaines31/marketingskills/main/VERSIONS.md
   - Compare versions against local skill files

2. **Only prompt if meaningful**:
   - 2 or more skills have updates, OR
   - Any skill has a major version bump (e.g., 1.x to 2.x)

3. **Non-blocking notification** at end of response:
   ```
   ---
   Skills update available: X marketing skills have updates.
   Say "update skills" to update automatically, or run `git pull` in your marketingskills folder.
   ```

4. **If user says "update skills"**:
   - Run `git pull` in the marketingskills directory
   - Confirm what was updated

## Skill Categories

See `README.md` for the current list of skills organized by category. When adding new skills, follow the naming patterns of existing skills in that category. Skills are organized into these categories: **CRO**, **Copy**, **SEO**, **Ads**, **Email**, **Content**, **Growth**, **Strategy**, **Analytics**, **Retention**, **Sales**, and **Foundation**.
