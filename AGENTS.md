# AGENTS.md

Guidelines for AI agents working in this repository.

## Repository Overview

This repository contains **Agent Skills** for marketing, packaged for the [Dust AI platform](https://dust.tt). Skills follow the open [Agent Skills specification](https://agentskills.io/specification.md), so Dust imports each one **directly from GitHub** (`Skills → Create skill → Import from GitHub`) with no reformatting.

- **Name**: Dust Marketing Skills
- **GitHub**: [ryzamedia/dustmarketingskills](https://github.com/ryzamedia/dustmarketingskills)
- **Maintainer**: Daniel Colaianni
- **Origin**: Forked from [Marketing Skills](https://github.com/coreyhaines31/marketingskills) by Corey Haines — thanks to the original contributors before the fork.
- **License**: MIT

## Repository Structure

```
dustmarketingskills/
├── skills/                # Agent Skills (imported into Dust)
│   └── skill-name/
│       ├── SKILL.md       # Required skill file
│       └── references/    # Optional detailed docs
├── tools/
│   ├── clis/              # Zero-dependency Node.js reference CLIs
│   ├── composio/          # Composio integration layer (MCP for OAuth-heavy tools)
│   ├── integrations/      # Per-tool integration guides (how to reach each from Dust)
│   └── REGISTRY.md        # Tool index mapped to Dust connectors / MCP
├── CONTRIBUTING.md
├── VERSIONS.md            # Per-skill versions + changelog
├── LICENSE
└── README.md
```

## Build / Lint / Test Commands

**Skills** are content-only (no build step). Verify manually:
- YAML frontmatter is valid
- `name` field matches directory name exactly
- `name` is 1-64 chars, lowercase alphanumeric and hyphens only
- `description` is 1-1024 characters
- The body reads well as Dust **Guidelines** and references Dust capabilities (see below), not filesystem paths or a specific coding agent

**Reference CLI tools** (`tools/clis/*.js`) are zero-dependency Node.js scripts (Node 18+). They document how an API works; in Dust the equivalent is usually a native connector or MCP server. Verify a CLI with:
```bash
node --check tools/clis/<name>.js   # Syntax check
node tools/clis/<name>.js           # Show usage (no args = help)
```

## Writing skills for Dust

When Dust imports a skill, the frontmatter `description` becomes the skill's **"What will this skill be used for"** trigger and the markdown body becomes its **Guidelines**. Write bodies so a Dust agent can act, not just advise:

- Reference **Dust tools** by capability: **Browse** (read live pages), **Computer** (click/type/fill forms/navigate), **Web Search**, **Create Files**, **Create Images**, **Data Visualization**, **Agent Memory**, **Run an Agent**, and **connectors** (HubSpot, Salesforce, Slack, GA4, Google Drive, Notion, …).
- For shared product/brand context, reference the **Product Context** knowledge item (created by the `product-marketing` skill) and/or **Agent Memory** — never a local file like `.agents/product-marketing.md`.
- For recurring workflows, reference Dust **Triggers** (schedules/webhooks), not a coding-agent loop mechanism.
- Keep skills cross-agent-safe: no tool-specific templating syntax that only one agent executes.

## Versioning

**Per-skill version** — `metadata.version` in each SKILL.md, mirrored in the `VERSIONS.md` table. Bump on ANY shipped change to that skill. Minor for a new capability or new description triggers; patch for fixes and clarifications. Users compare `VERSIONS.md` against the version in their Dust workspace to know when to re-import.

**Changelog** — add a dated entry to `VERSIONS.md` summarizing what shipped in each release.

Bump the version in the same PR that ships the change.

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

**Valid**: `cro`, `emails`, `ab-testing`
**Invalid**: `Page-CRO`, `-page`, `page--cro`

### Optional Skill Directories

```
skills/skill-name/
├── SKILL.md        # Required - main instructions (<500 lines)
├── references/     # Optional - detailed docs loaded on demand
├── scripts/        # Optional - executable code
└── assets/         # Optional - templates, data files
```

Dust imports `references/` files alongside the skill, so keep long material there rather than inlining it into SKILL.md.

## Writing Style Guidelines

### Structure

- Keep `SKILL.md` under 500 lines (move details to `references/`)
- Use H2 (`##`) for main sections, H3 (`###`) for subsections
- Use bullet points and numbered lists liberally
- Short paragraphs (2-4 sentences max)

### Tone

- Direct and instructional
- Second person ("You are a conversion rate optimization expert")
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

The `description` is critical for skill discovery (it becomes Dust's "What will this skill be used for"). Include:
1. What the skill does
2. When to use it (trigger phrases)
3. Related skills for scope boundaries

```yaml
description: When the user wants to optimize conversions on any marketing page. Use when the user says "CRO," "conversion rate optimization," "this page isn't converting." For signup flows, see signup.
```

## Importing into Dust

End users install these skills through Dust's native GitHub import:

1. In Dust, go to **Skills → Create skill → Import from GitHub**.
2. Paste the repo URL (whole library) or a single skill's subfolder URL (e.g. `.../tree/main/skills/cro`).
3. Attach the imported skill to a marketing agent, give the agent the tools the skill expects, and attach the **Product Context** knowledge item.

Re-importing after a `git pull` keeps a workspace in sync with this repo. See `README.md` for the full walkthrough and suggested agent setups.

## Git Workflow

### Branch Naming

- New skills: `feature/skill-name`
- Improvements: `fix/skill-name-description`
- Documentation: `docs/description`

### Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat: add skill-name skill`
- `fix: improve clarity in cro`
- `docs: update README`

### Pull Request Checklist

- [ ] `name` matches directory name exactly
- [ ] `name` follows naming rules (lowercase, hyphens, no `--`)
- [ ] `description` is 1-1024 chars with trigger phrases
- [ ] `SKILL.md` is under 500 lines
- [ ] Body references Dust capabilities, not local files or a specific coding agent
- [ ] `metadata.version` bumped and `VERSIONS.md` updated
- [ ] No sensitive data or credentials

## Tool Integrations

Skills reference marketing platforms by capability and tell the agent how to reach them from Dust.

- **Tool discovery**: Read `tools/REGISTRY.md` for the platform → Dust-access mapping.
- **Integration details**: See `tools/integrations/{tool}.md` for endpoints, auth, and common operations.
- **Native connectors & MCP**: Many tools (Slack, Notion, Google Drive, GitHub, GA4, Google Ads, Stripe, etc.) are available as Dust connectors or remote MCP servers.
- **Composio**: For OAuth-heavy tools without a native Dust server (HubSpot, Salesforce, Meta Ads, LinkedIn Ads, Google Sheets, Slack, Notion), [Composio](tools/integrations/composio.md) exposes them to Dust agents through a single MCP server. See `tools/composio/marketing-tools.md` for the full toolkit mapping.
- **Browse & Computer**: When no connector or API exists, an agent can use **Browse** to read a page or **Computer** to interact with it directly.

Skills reference relevant tools for implementation. For example:
- `referrals` skill → rewardful, tolt, dub-co, mention-me guides
- `analytics` skill → ga4, mixpanel, segment guides
- `emails` skill → customer-io, mailchimp, resend guides
- `ads` skill → google-ads, meta-ads, linkedin-ads guides

## Checking for Updates

When using any skill from this repository:

1. Compare each skill's `metadata.version` against the version in the Dust workspace (or the current `VERSIONS.md`, available at `https://raw.githubusercontent.com/ryzamedia/dustmarketingskills/main/VERSIONS.md`).
2. To update, **re-import** the skill from GitHub in Dust (or `git pull` your fork and re-import). Dust versions the skill on each import, so history is preserved.

## Skill Categories

See `README.md` for the current list of skills organized by category. When adding new skills, follow the naming patterns of existing skills in that category.
