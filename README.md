# Marketing Skills for Claude Code

A collection of AI agent skills focused on marketing tasks. Built for technical marketers and founders who want Claude Code (or similar AI coding assistants) to help with conversion optimization, copywriting, SEO, analytics, and growth engineering.

Built by [Corey Haines](https://corey.co). Need hands-on help? Check out [Conversion Factory](https://conversionfactory.co) — Corey's agency for conversion optimization, landing pages, and growth strategy.

**Contributions welcome!** Found a way to improve a skill or have a new one to add? [Open a PR](#contributing).

## What are Skills?

Skills are markdown files that give AI agents specialized knowledge and workflows for specific tasks. When you add these to your project, Claude Code can recognize when you're working on a marketing task and apply the right frameworks and best practices.

## Available Skills

| Skill | Description | Triggers |
|-------|-------------|----------|
| [ab-test-setup](skills/ab-test-setup/) | Plan and implement A/B tests | "A/B test," "split test," "experiment" |
| [analytics-tracking](skills/analytics-tracking/) | Set up tracking and measurement | "tracking," "GA4," "GTM," "events" |
| [competitor-alternatives](skills/competitor-alternatives/) | Competitor comparison and alternative pages | "vs page," "alternative page," "[X] vs [Y]" |
| [copy-editing](skills/copy-editing/) | Edit and polish existing copy | "edit this copy," "review my copy," "copy sweep" |
| [copywriting](skills/copywriting/) | Write or improve marketing copy | "write copy," "rewrite," "headlines," "CTA copy" |
| [email-sequence](skills/email-sequence/) | Build email sequences and drip campaigns | "email sequence," "drip campaign," "nurture" |
| [form-cro](skills/form-cro/) | Optimize lead capture and contact forms | "form optimization," "lead form," "contact form" |
| [free-tool-strategy](skills/free-tool-strategy/) | Plan engineering-as-marketing tools | "free tool," "calculator," "lead gen tool" |
| [launch-strategy](skills/launch-strategy/) | Product launches and feature announcements | "launch," "Product Hunt," "feature release" |
| [marketing-ideas](skills/marketing-ideas/) | 140 SaaS marketing ideas and strategies | "marketing ideas," "growth ideas," "how to market" |
| [marketing-psychology](skills/marketing-psychology/) | 70+ mental models for marketing | "psychology," "mental models," "cognitive bias" |
| [onboarding-cro](skills/onboarding-cro/) | Improve user activation and onboarding | "onboarding," "activation," "first-run experience" |
| [page-cro](skills/page-cro/) | Conversion optimization for any marketing page | "optimize [page]," "CRO," "page isn't converting" |
| [paid-ads](skills/paid-ads/) | Create and optimize paid ad campaigns | "PPC," "Google Ads," "Meta ads," "paid media" |
| [paywall-upgrade-cro](skills/paywall-upgrade-cro/) | In-app paywalls and upgrade screens | "paywall," "upgrade screen," "feature gate" |
| [popup-cro](skills/popup-cro/) | Create/optimize popups and modals | "popup," "modal," "exit intent" |
| [pricing-strategy](skills/pricing-strategy/) | Design pricing, packaging, and monetization | "pricing," "tiers," "freemium," "willingness to pay" |
| [programmatic-seo](skills/programmatic-seo/) | Build SEO pages at scale | "programmatic SEO," "template pages," "pages at scale" |
| [referral-program](skills/referral-program/) | Design referral and affiliate programs | "referral," "affiliate," "word of mouth," "viral" |
| [schema-markup](skills/schema-markup/) | Add structured data and rich snippets | "schema," "JSON-LD," "structured data" |
| [seo-audit](skills/seo-audit/) | Audit technical and on-page SEO | "SEO audit," "technical SEO," "not ranking" |
| [signup-flow-cro](skills/signup-flow-cro/) | Optimize signup and registration flows | "signup optimization," "registration form" |
| [social-content](skills/social-content/) | Create and schedule social media content | "LinkedIn post," "Twitter thread," "social media" |

## Installation

### Option 1: add-skill

Use [add-skill](https://github.com/vercel-labs/add-skill) to install skills directly:

```bash
# Install all skills
npx add-skill coreyhaines31/marketingskills

# Install specific skills
npx add-skill coreyhaines31/marketingskills --skill page-cro copywriting

# List available skills
npx add-skill coreyhaines31/marketingskills --list
```

This automatically installs to your `.claude/skills/` directory.

### Option 2: Claude Code Plugin

Install via Claude Code's built-in plugin system:

```bash
# Add the marketplace
/plugin marketplace add coreyhaines31/marketingskills

# Install all marketing skills
/plugin install marketing-skills
```

### Option 3: Clone and Copy

Clone the entire repo and copy the skills folder:

```bash
git clone https://github.com/coreyhaines31/marketingskills.git
cp -r marketingskills/skills/* .claude/skills/
```

### Option 4: Git Submodule

Add as a submodule for easy updates:

```bash
git submodule add https://github.com/coreyhaines31/marketingskills.git .claude/marketingskills
```

Then reference skills from `.claude/marketingskills/skills/`.

### Option 5: Fork and Customize

1. Fork this repository
2. Customize skills for your specific needs
3. Clone your fork into your projects

### Option 6: SkillKit

Use [skillkit](https://github.com/rohitg00/skillkit) to install skills across multiple AI agents:

```bash
# Install all skills
npx skillkit install coreyhaines31/marketingskills

# Install specific skills
npx skillkit install coreyhaines31/marketingskills --skill page-cro copywriting

# List available skills without installing
npx skillkit install coreyhaines31/marketingskills --list
```

## Usage

Once installed, just ask Claude Code to help with marketing tasks:

```
"Help me optimize this landing page for conversions"
→ Uses page-cro skill

"Write homepage copy for my SaaS"
→ Uses copywriting skill

"Set up GA4 tracking for signups"
→ Uses analytics-tracking skill

"Create a 5-email welcome sequence"
→ Uses email-sequence skill
```

You can also invoke skills directly:

```
/page-cro
/email-sequence
/seo-audit
```

## Skill Categories

### Conversion Optimization
- `page-cro` - Any marketing page
- `signup-flow-cro` - Registration flows
- `onboarding-cro` - Post-signup activation
- `form-cro` - Lead capture forms
- `popup-cro` - Modals and overlays
- `paywall-upgrade-cro` - In-app upgrade moments

### Content & Copy
- `copywriting` - Marketing page copy
- `copy-editing` - Edit and polish existing copy
- `email-sequence` - Automated email flows
- `social-content` - Social media content

### SEO & Discovery
- `seo-audit` - Technical and on-page SEO
- `programmatic-seo` - Scaled page generation
- `competitor-alternatives` - Comparison and alternative pages
- `schema-markup` - Structured data

### Paid & Distribution
- `paid-ads` - Google, Meta, LinkedIn ad campaigns
- `social-content` - Social media scheduling and strategy

### Measurement & Testing
- `analytics-tracking` - Event tracking setup
- `ab-test-setup` - Experiment design

### Growth Engineering
- `free-tool-strategy` - Marketing tools and calculators
- `referral-program` - Referral and affiliate programs

### Strategy & Monetization
- `marketing-ideas` - 140 SaaS marketing ideas
- `marketing-psychology` - Mental models and psychology
- `launch-strategy` - Product launches and announcements
- `pricing-strategy` - Pricing, packaging, and monetization

## Contributing

Found a way to improve a skill? Have a new skill to suggest? PRs and issues welcome!

**Ideas for contributions:**
- Improve existing skill instructions or frameworks
- Add new experiment ideas or best practices
- Fix typos or clarify confusing sections
- Suggest new skills (open an issue first to discuss)
- Add examples or case studies

**How to contribute:**
1. Fork the repo
2. Edit the skill file(s)
3. Submit a PR with a clear description of what you improved

### Skill File Structure

Each skill is a directory containing a `SKILL.md` file:

```
skills/
  skill-name/
    SKILL.md
```

The `SKILL.md` file follows this format:

```markdown
---
name: skill-name
description: One-line description for skill selection
---

# Skill Name

[Full instructions for the AI agent]
```

## License

MIT - Use these however you want.
