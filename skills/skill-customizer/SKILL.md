---
name: skill-customizer
description: Customize any marketing skill for a specific company by fetching their website and pre-filling company context, competitors, pricing, talk tracks, and examples. Use when the user says "customize this skill for my company", "adapt this skill for [domain/URL]", "personalize [skill name] for us", "set up [skill] for my business", or shares a URL and names a skill they want tailored. Works for any skill in the marketingskills plugin. The result is a local override saved to ~/.claude/skills/ that takes precedence over the default skill — no setup needed on future invocations.
metadata:
  version: 1.0.0
---

# Skill Customizer

Adapt any marketing skill to a specific company so it works out of the box — no repeated setup, no generic placeholders, no "what company do you work for?" prompts.

## What You Need From the User

1. **Company website URL** — the main site (e.g. `https://example.com`). Used to extract company context automatically.
2. **Which skill(s) to customize** — one or more skill names from the marketingskills plugin (e.g. `competitive-intelligence`, `cold-email`, `cro`). If the user says "all skills" or "everything", customize the 5–8 most relevant ones based on company type.

If either is missing, ask before proceeding.

---

## Step 1 — Extract Company Profile from Website

Fetch the website and extract the following. If a page doesn't have everything, try `/about`, `/pricing`, `/product`:

```
- Company name
- What they sell (product/service, in one sentence)
- Target customers (who buys, in one sentence)
- Core value proposition / positioning tagline
- Pricing (tiers, prices, model — if visible)
- Key features or service inclusions
- Brand voice (formal/casual, bold/approachable, etc.)
- Any competitor or alternative mentions
- Geographic focus (local, regional, global)
- Business model (SaaS, e-commerce, services, marketplace, etc.)
```

If the website is sparse or vague, note what's missing and make reasonable inferences — don't ask the user to fill gaps unless critical.

---

## Step 2 — Locate the Original Skill

Find the original skill file. Check these paths in order:

```bash
# Installed plugin location (most common)
find ~/Library/Application\ Support/Claude -name "SKILL.md" -path "*/<skill-name>/SKILL.md" 2>/dev/null | head -3

# Local marketingskills repo
find ~/marketingskills/skills/<skill-name>/SKILL.md 2>/dev/null

# Already-customized local override
~/.claude/skills/<skill-name>/SKILL.md
```

Read the original SKILL.md fully before customizing. The customization must preserve the skill's structure, phases, and output format — only replace generic placeholders with company-specific content.

---

## Step 3 — Write the Customized Skill

Save the customized skill to:
```
~/.claude/skills/<skill-name>/SKILL.md
```

This path is always checked before the plugin version, so the override takes effect immediately with no configuration needed.

### What to Customize (and What to Keep)

**Always customize:**
- Frontmatter `description` — add the company name so it's clear this is a tailored version
- Company context block — replace any "what company do you work for?" setup with pre-filled facts
- Examples and templates — swap generic examples for ones that match the company's product/market
- Default competitor list — replace generic placeholders with real, researched competitors for this market
- Talk tracks — rewrite to reflect actual pricing, actual inclusions, actual differentiators
- Landmine questions — tailor to the company's specific competitive advantages
- Tone/voice — match the brand voice extracted from the website

**Always preserve:**
- The skill's core phases and execution flow
- Output format (HTML, markdown, email, etc.)
- Any tool connector logic (CRM, docs, chat)
- Refresh cadence and related skills sections
- The overall structure so the skill is still recognizable

### How to Write the Company Context Block

Place this near the top of the skill body, right after the intro paragraph:

```markdown
## Your Company Context (Pre-filled)

**Company:** [Name]
**Website:** [URL]
**What you sell:** [One clear sentence — product/service, key inclusions, price if known]
**Core positioning:** "[Tagline or positioning statement]"
**Target customer:** [Who buys, in one sentence]
**Business model:** [SaaS / services / e-commerce / etc.]

> Skip setup questions — context is pre-loaded. Go straight to [the first real action].
```

---

## Step 4 — Verify and Report

After writing the file, confirm:

```
✓ Saved to: ~/.claude/skills/<skill-name>/SKILL.md
✓ Company context pre-filled for: [Company Name]
✓ Competitors updated: [list if applicable]
✓ Talk tracks customized: yes/no
✓ Original skill structure preserved: yes
```

Tell the user:
- How to trigger the customized skill (the same phrase as before — the trigger doesn't change)
- What was changed vs. what was kept
- That they can re-run this skill anytime with a different URL to re-customize

---

## Customization Patterns by Skill Type

Different skills need different customization emphasis:

### `competitive-intelligence`
Focus on: competitor list (research real ones for the market), comparison dimensions (what travelers/buyers actually compare), talk tracks tied to real pricing and inclusions, landmine questions that expose competitors' gaps.

### `cold-email`
Focus on: ICP (ideal customer profile) populated from the website, pain points that match the product, social proof signals visible on the site, subject line styles that match brand voice, CTAs aligned to their conversion goal.

### `cro`
Focus on: the actual product pages and flows on their site, specific friction points common in their industry, pricing page patterns for their business model, trust signals relevant to their market.

### `email-sequence`
Focus on: onboarding milestones specific to their product, activation metrics that matter for their business type, tone matching their brand voice, upsell triggers relevant to their pricing tiers.

### `customer-research`
Focus on: customer segments visible from the website, the jobs-to-be-done for their specific product, where their customers likely hang out (channels), research questions tailored to their market.

### `pricing-strategy`
Focus on: their current pricing model and tiers, comparable products in their market, packaging patterns common for their business type.

### `content-strategy`
Focus on: their target audience's likely search intent, content formats that work in their industry, SEO opportunities based on their product category.

---

## Example Output Structure

After customizing `competitive-intelligence` for `https://example.com`:

```
~/.claude/skills/competitive-intelligence/SKILL.md

Changes made:
- Pre-filled: Acme Corp, B2B SaaS, project management tool, $29–$149/mo
- Competitors added: Asana, Monday.com, ClickUp, Notion, Linear (researched for market)
- Talk tracks: rewritten around Acme's unlimited-seats pricing model
- Landmine questions: 5 questions targeting per-seat competitor pricing
- Tone: matched to Acme's direct, no-fluff brand voice
- Preserved: all phases, HTML output format, CRM connector logic
```

---

## Batch Customization

If the user asks to customize multiple skills at once:

1. Extract the company profile once (reuse across all skills)
2. Identify which skills are most relevant to their business type:
   - **SaaS**: cold-email, competitor-intelligence, cro, email-sequence, pricing-strategy, content-strategy
   - **E-commerce**: cro, email-sequence, content-strategy, customer-research, ad-creative
   - **Services/agencies**: cold-email, competitor-intelligence, sales-enablement, customer-research
   - **Marketplaces**: cro, content-strategy, community-marketing, referral-program
3. Customize them in parallel, then report a summary of all changes

---

## Re-customization

If the user runs this skill again with a new URL for the same skill name, overwrite the existing local override. The previous version is replaced — there's no version history. If they want to preserve both, they need to rename the skill directory manually.

---

## Related Skills

- **competitive-intelligence** — First skill to customize for most businesses
- **cold-email** — High-value customization for B2B companies
- **product-marketing-context** — Alternative approach: stores company context as a shared file all skills can read
