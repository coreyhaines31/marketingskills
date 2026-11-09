# Marketing Skills for AI Agents

A collection of AI agent skills focused on marketing tasks. Built for technical marketers and founders who want AI coding agents to help with conversion optimization, copywriting, SEO, analytics, and growth engineering. Works with Claude Code, OpenAI Codex, Cursor, Windsurf, and any agent that supports the [Agent Skills spec](https://agentskills.io).

Built by [Corey Haines](https://corey.co?ref=marketingskills). Need hands-on help? Check out [Conversion Factory](https://conversionfactory.co?ref=marketingskills) — Corey's agency for conversion optimization, landing pages, and growth strategy. Want to learn more about marketing? Subscribe to [Swipe Files](https://swipefiles.com?ref=marketingskills). Want to get dangerously good at using AI for marketing? Check out [AI Marketing Training](https://conversionfactory.co/offers/ai-marketing-training?ref=marketingskills). Want an autonomous AI agent that uses these skills to be your CMO? Try [Magister](https://magistermarketing.com?ref=marketingskills).

New to the terminal and coding agents? Check out the companion guide [Coding for Marketers](https://codingformarketers.com?ref=marketingskills).

Want your agent to read your marketing accounts? Follow the [guided tool connection workflow](tools/SETUP.md) for scoped credentials and a first read-only result.

**Contributions welcome!** Found a way to improve a skill or have a new one to add? [Open a PR](#contributing).

Run into a problem or have a question? [Open an issue](https://github.com/coreyhaines31/marketingskills/issues) — we're happy to help.

## Partners

The library is free and MIT-licensed. [Verified Partners](tools/REGISTRY.md#verified-partners) fund the work — vetted, disclosed tool integrations, listed alongside the neutral options and never influencing what the core skills recommend. The full rules and boundaries are in [tools/PARTNERS.md](tools/PARTNERS.md). [Become a partner →](https://marketing-skills.com/sponsorship)

<!-- PARTNERS:START -->
> ◆ **[Converly](https://converly.io)** — *Conversion tracking / attribution.* Server-side conversion tracking that fires when someone submits a form, books a meeting, or starts a chat — passing click IDs and identifiers for Enhanced Conversions (Google) and stronger match quality (Meta), across about 100 tools. CLI + MCP so your agent sets it up in minutes. → [Integration guide](tools/integrations/converly.md)

> ◆ **[Ploy](https://ploy.ai)** — *AI website & growth platform.* AI marketing platform built around a hosted website builder — an in-app agent that builds and publishes pages, PloyDB for pages at scale, routing to add pages to an existing site, built-in analytics and visitor identification, and a CLI for coding agents. → [Integration guide](tools/integrations/ploy.md)

> ◆ **[AIsa](https://aisa.one)** — *SEO, search & social data.* One AIsa key, pay as you go, instead of a subscription to every data platform. Agents get SEO, search, social, and market data from Similarweb, Semrush, Ahrefs, DataForSEO, Tavily, Reddit, X, and more through REST or MCP, and pay only for the calls they make. → [Integration guide](tools/integrations/aisa.md)

> ◆ **[Omnia](https://www.useomnia.com)** — *AI search visibility (AEO).* Omnia tracks how AI engines answer your customers' questions every day: visibility, citations, Share of Voice and sentiment for your brand and competitors. Connect the Omnia MCP to Claude and these skills run on real AI answers data instead of guesses. Or let your Omnia Agent turn it into prioritized work that you review and approve. → [Integration guide](tools/integrations/omnia.md)

> ◆ **[Livestorm](https://livestorm.co)** — *Webinars & virtual events.* Browser-based platform for webinars, virtual events, and online meetings, with registration pages, live engagement, recordings, and analytics. A REST API, webhooks, and an official MCP server let agents create events, manage registrants, and pull attendance data. → [Integration guide](tools/integrations/livestorm.md)
<!-- PARTNERS:END -->

<!-- The Partners block above is generated from partners.json — run `node scripts/sync-partners.mjs` after editing it. -->

## What are Skills?

Skills are markdown files that give AI agents specialized knowledge and workflows for specific tasks. When you add these to your project, your agent can recognize when you're working on a marketing task and apply the right frameworks and best practices.

## How Skills Work Together

Skills reference each other and build on shared context. The `product-marketing` skill is the foundation — every other skill checks it first to understand your product, audience, and positioning before doing anything.

```
                            ┌──────────────────────────────────────┐
                            │          product-marketing           │
                            │    (read by all other skills first)  │
                            └──────────────────┬───────────────────┘
                                               │
    ┌──────────────┬─────────────┬─────────────┼─────────────┬──────────────┬──────────────┐
    ▼              ▼             ▼             ▼             ▼              ▼              ▼
┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────────┐ ┌──────────┐ ┌─────────────┐ ┌───────────┐
│  SEO &   │ │   CRO    │ │Content & │ │  Paid &    │ │ Growth & │ │  Sales &    │ │ Strategy  │
│ Content  │ │          │ │   Copy   │ │Measurement │ │Retention │ │    GTM      │ │           │
├──────────┤ ├──────────┤ ├──────────┤ ├────────────┤ ├──────────┤ ├─────────────┤ ├───────────┤
│seo-audit │ │cro       │ │copywritin│ │ads         │ │referrals │ │revops       │ │mktg-ideas │
│ai-seo    │ │signup    │ │copy-edit │ │ad-creative │ │free-tools│ │sales-enable │ │mktg-psych │
│site-arch │ │onboarding│ │cold-email│ │ab-testing  │ │churn-    │ │launch       │ │customer-  │
│programm  │ │popups    │ │emails    │ │analytics   │ │ prevent  │ │pricing      │ │ research  │
│schema    │ │paywalls  │ │social    │ │            │ │community │ │competitors  │ │reverse-   │
│content   │ │          │ │video     │ │            │ │lead-magnt│ │comp-profile │ │ eng-mktg  │
│aso       │ │          │ │image     │ │            │ │co-mktg   │ │directory    │ │           │
│link-build│ │          │ │sms       │ │            │ │          │ │prospecting  │ │           │
└────┬─────┘ └────┬─────┘ └────┬─────┘ └─────┬──────┘ └────┬─────┘ └──────┬──────┘ └─────┬─────┘
     │            │            │              │             │              │              │
     └────────────┴─────┬──────┴──────────────┴─────────────┴──────────────┴──────────────┘
                        │
         Skills cross-reference each other:
           copywriting ↔ cro ↔ ab-testing
           revops ↔ sales-enablement ↔ cold-email
           seo-audit ↔ schema ↔ ai-seo
           customer-research → copywriting, cro, competitors
```

See each skill's **Related Skills** section for the full dependency map.

## Available Skills

<!-- SKILLS:START -->
| Skill | Description |
|-------|-------------|
| [ab-testing](skills/ab-testing/) | When the user wants to plan, design, and read A/B tests and experiments, or build a growth experimentation program. Use... |
| [ad-creative](skills/ad-creative/) | When the user wants to write and iterate ad creative at scale: headlines, primary text, descriptions, hooks, and full... |
| [ads](skills/ads/) | When the user wants to plan, run, and fix paid ad campaigns on Google Ads, Meta, LinkedIn, X, and other platforms:... |
| [ai-seo](skills/ai-seo/) | When the user wants to get content cited and recommended in AI answers: ChatGPT, Perplexity, Claude, Gemini, and Google... |
| [analytics](skills/analytics/) | When the user wants to set up, improve, or audit analytics tracking: tracking plans, event taxonomies, GA4, GTM,... |
| [aso](skills/aso/) | When the user wants to audit and optimize App Store and Google Play listings: title, subtitle, keywords, descriptions,... |
| [attribution](skills/attribution/) | When the user wants to work out which marketing actually drives conversions and revenue: choosing and reading... |
| [churn-prevention](skills/churn-prevention/) | When the user wants to reduce churn and keep subscribers: cancellation flows, exit surveys, save offers, pause options,... |
| [co-marketing](skills/co-marketing/) | When the user wants to find co-marketing partners and plan joint campaigns: integration partners, cross-promotion,... |
| [cold-email](skills/cold-email/) | When the user wants to write and run B2B cold outbound that gets replies: cold emails and follow-ups, sending domains... |
| [community-marketing](skills/community-marketing/) | When the user wants to build and grow online communities that drive product growth: launching and running Discord,... |
| [competitor-profiling](skills/competitor-profiling/) | When the user wants to research competitors from their URLs into structured, dated profile files: positioning, pricing,... |
| [competitors](skills/competitors/) | When the user wants to create and audit competitor comparison and alternative pages for SEO and buyers: '[Product] vs... |
| [content-strategy](skills/content-strategy/) | When the user wants to plan a content strategy: what to write, topic clusters and pillars, editorial calendars, and... |
| [conversion-tracking](skills/conversion-tracking/) | When the user wants to set up, audit, or fix conversion tracking so form fills, bookings, calls, signups, and purchases... |
| [copy-editing](skills/copy-editing/) | When the user wants to edit, tighten, proofread, or refresh existing marketing copy and outdated content without... |
| [copywriting](skills/copywriting/) | When the user wants to write or rewrite marketing copy for homepages, landing, pricing, feature, about, and product... |
| [cro](skills/cro/) | When the user wants to increase conversions on marketing pages and forms: homepages, landing pages, pricing pages, demo... |
| [customer-research](skills/customer-research/) | When the user wants to run and synthesize customer research: interview scripts, surveys, transcript and support-ticket... |
| [directory-submissions](skills/directory-submissions/) | When the user wants to submit a product to startup, SaaS, AI, agent, MCP, and review directories for backlinks,... |
| [emails](skills/emails/) | When the user wants to create or improve automated email sequences and lifecycle programs: welcome series, trial and... |
| [events](skills/events/) | When the user wants to plan, run, sponsor, or speak at events and turn them into pipeline: webinars, conferences, trade... |
| [free-tools](skills/free-tools/) | When the user wants to plan, evaluate, or build free tools as marketing (engineering as marketing): calculators,... |
| [image](skills/image/) | When the user wants to create, generate, edit, or optimize marketing images: blog heroes, social graphics, product... |
| [influencer-marketing](skills/influencer-marketing/) | When the user wants to run influencer, creator, and ambassador partnerships: finding and vetting creators, rates and... |
| [launch](skills/launch/) | When the user wants to plan product and feature launches: Product Hunt, feature announcements, beta and early access,... |
| [lead-magnets](skills/lead-magnets/) | When the user wants to plan, create, and optimize lead magnets that grow an email list: checklists, templates, ebooks,... |
| [link-building](skills/link-building/) | When the user wants to earn backlinks and third-party mentions that lift rankings and AI citations: link gap and... |
| [marketing-council](skills/marketing-council/) | When the user wants several expert perspectives on a marketing decision from a simulated board of legendary marketers... |
| [marketing-ideas](skills/marketing-ideas/) | When the user wants to brainstorm marketing ideas, growth tactics, and channels to try for a SaaS or software product,... |
| [marketing-loops](skills/marketing-loops/) | When the user wants to set up recurring marketing workflows an AI agent runs on its own on a cadence or trigger: weekly... |
| [marketing-plan](skills/marketing-plan/) | When the user wants to build a comprehensive marketing or go-to-market plan for a client, a company you advise, or your... |
| [marketing-psychology](skills/marketing-psychology/) | When the user wants to apply psychology and behavioral science to marketing: cognitive biases, mental models,... |
| [offers](skills/offers/) | When the user wants to design or improve the offer itself: value stacking, bonuses, guarantees and risk reversal,... |
| [onboarding](skills/onboarding/) | When the user wants to improve post-signup onboarding and activation: first-run experience, aha moments, checklists,... |
| [paywalls](skills/paywalls/) | When the user wants to create and optimize in-app paywalls, upgrade screens, upsell modals, feature gates, and... |
| [popups](skills/popups/) | When the user wants to create and optimize popups, modals, slide-ins, sticky bars, and banners that convert: exit... |
| [pricing](skills/pricing/) | When the user wants to decide pricing and packaging: tiers, value metrics, per-seat vs usage, freemium and trials,... |
| [product-marketing](skills/product-marketing/) | When the user wants to create or update the product marketing context document (.agents/product-marketing.md): product,... |
| [programmatic-seo](skills/programmatic-seo/) | When the user wants to build SEO pages at scale from templates and data: location, integration, comparison, directory,... |
| [prospecting](skills/prospecting/) | When the user wants to find, qualify, and build prospect lists for outbound across B2B and local businesses: ICP-fit... |
| [public-relations](skills/public-relations/) | When the user wants to earn press and media coverage: journalist pitches, press releases, media lists and kits,... |
| [referrals](skills/referrals/) | When the user wants to create and optimize referral and affiliate programs and word of mouth: refer-a-friend... |
| [reverse-engineer-marketing](skills/reverse-engineer-marketing/) | When the user wants to reverse engineer how another company grew and what to copy: a dated log of their moves against... |
| [revops](skills/revops/) | When the user wants to design revenue operations: lead lifecycle stages, MQL and SQL definitions, lead scoring and... |
| [sales-enablement](skills/sales-enablement/) | When the user wants to create sales collateral: decks, one-pagers, objection handling, demo scripts, talk tracks,... |
| [schema](skills/schema/) | When the user wants to add, fix, and validate schema markup and structured data (JSON-LD): product, review, recipe,... |
| [seo-audit](skills/seo-audit/) | When the user wants to audit and diagnose SEO: technical SEO, indexing and crawl issues, traffic drops after Google... |
| [signup](skills/signup/) | When the user wants to optimize signup, registration, and trial start flows: form fields, steps, SSO, credit card... |
| [site-architecture](skills/site-architecture/) | When the user wants to plan or restructure a website: page hierarchy, navigation, URL structure, visual sitemaps,... |
| [sms](skills/sms/) | When the user wants to plan and optimize SMS, MMS, and WhatsApp marketing: welcome flows, abandoned cart,... |
| [social](skills/social/) | When the user wants to create and optimize organic social content for LinkedIn, X, Instagram, TikTok, and Facebook:... |
| [video](skills/video/) | When the user wants to create and produce video with AI tools or code: product demos, explainers, AI avatars and... |
<!-- SKILLS:END -->

## Installation

### Option 1: CLI Install (Recommended)

Use [npx skills](https://github.com/vercel-labs/skills) to install skills directly:

```bash
# Install all skills
npx skills add coreyhaines31/marketingskills

# Install specific skills
npx skills add coreyhaines31/marketingskills --skill cro copywriting

# List available skills
npx skills add coreyhaines31/marketingskills --list
```

The CLI detects which agents you have installed and asks where to install. For Claude Code it installs into `.claude/skills/`; universal agents share `.agents/skills/`.

> [!TIP]
> If you run the command from **inside** an agent session (e.g., asking Claude Code to install the skills for you), the CLI runs non-interactively and may only install to the universal `.agents/skills/` directory, which Claude Code does not read. Pass the agent explicitly:
>
> ```bash
> npx skills add coreyhaines31/marketingskills -a claude-code
> ```

### Option 2: Claude Code Plugin

Install via Claude Code's built-in plugin system:

```bash
# Add the marketplace
/plugin marketplace add coreyhaines31/marketingskills

# Install all marketing skills
/plugin install marketing-skills
```

> **Note:** `/plugin` is only available in an interactive Claude Code CLI session. It is **not** available in Claude Code on the web, GitHub Actions, or other non-interactive/remote environments — in those cases you'll see `/plugin isn't available in this environment`. Use **Option 1 (`npx skills`)** instead, or the equivalent CLI commands:
>
> ```bash
> claude plugin marketplace add coreyhaines31/marketingskills
> claude plugin install marketing-skills@marketingskills
> ```

### Option 3: OpenAI Codex Plugin

Install via Codex's plugin system:

```bash
# Add the marketplace
codex plugin marketplace add coreyhaines31/marketingskills

# Then browse and install from inside a Codex session
/plugins
```

Select **marketing-skills** to install all skills. To pick up new releases later, run `codex plugin marketplace upgrade`.

### Option 4: Clone and Copy

Clone the entire repo and copy the skills folder:

```bash
git clone https://github.com/coreyhaines31/marketingskills.git
cp -r marketingskills/skills/* .agents/skills/
```

### Option 5: Git Submodule

Add as a submodule for easy updates:

```bash
git submodule add https://github.com/coreyhaines31/marketingskills.git .agents/marketingskills
```

Then reference skills from `.agents/marketingskills/skills/`.

### Option 6: Fork and Customize

1. Fork this repository
2. Customize skills for your specific needs
3. Clone your fork into your projects

### Option 7: SkillKit (Multi-Agent)

Use [SkillKit](https://github.com/rohitg00/skillkit) to install skills across multiple AI agents (Claude Code, Cursor, Copilot, etc.):

```bash
# Install all skills
npx skillkit install coreyhaines31/marketingskills

# Install specific skills
npx skillkit install coreyhaines31/marketingskills --skill cro copywriting

# List available skills
npx skillkit install coreyhaines31/marketingskills --list
```

### Option 8: Claude Web Skill ZIPs

Download the desired `<name>-claude-web.zip` from [Releases](https://github.com/coreyhaines31/marketingskills/releases/latest), then use **Customize → Skills → + Create skill → Upload a skill** in Claude. Each archive contains one skill. Account permissions and code execution must allow skills.

The web-target archive uses an explicitly reviewed shorter description; its instructions and resources are preserved. The attached web manifest lists any skills whose description still needs review; newly created release notes also summarize omissions. Installing a ZIP does not configure local CLIs, MCP servers, credentials, or related skills. See [release packaging and verification](docs/skill-release-packaging.md) for archive contents, source variants, and unverified client limitations.

### Option 9: Perplexity Computer Skill ZIPs

Download the desired `<name>-perplexity.zip` from [Releases](https://github.com/coreyhaines31/marketingskills/releases/latest), then in Perplexity Computer use **Plugins → Add custom → Skill → Upload skill**. These archives keep the original skill files with `SKILL.md` at the root, which Perplexity requires; the source and Claude web ZIPs nest the skill in a folder and won't upload there. Installing a ZIP doesn't configure local CLIs, MCP servers, or related skills.

## Upgrading from v1.x to v2.0

v2.0 renames 17 skills and consolidates `page-cro` + `form-cro` into a single `cro` skill. If you installed the v1.x skills, you'll have **stale old-name folders** in your install directory after upgrading — the new skills install alongside the old ones, so you'll see both `skills/page-cro/` and `skills/cro/`, etc. Clean them up:

```bash
# From the directory where you installed the skills (e.g., .agents/skills/ or .claude/skills/)
rm -rf page-cro form-cro \
       ab-test-setup analytics-tracking aso-audit competitor-alternatives \
       email-sequence free-tool-strategy launch-strategy onboarding-cro \
       paid-ads paywall-upgrade-cro popup-cro pricing-strategy \
       product-marketing-context referral-program schema-markup \
       signup-flow-cro social-content
```

Then reinstall the v2.0 skills via your usual method (e.g., `npx skills add coreyhaines31/marketingskills`).

### Migrate the product marketing context file

In v2.0 the context file moved from `.claude/` to `.agents/` and was renamed from `product-marketing-context.md` to `product-marketing.md`. Move your existing context file:

```bash
mkdir -p .agents
# v2.0 file (or pre-v2.0 file with new name)
mv .claude/product-marketing.md .agents/product-marketing.md 2>/dev/null
# pre-v2.0 file with legacy name
mv .claude/product-marketing-context.md .agents/product-marketing.md 2>/dev/null
```

Skills will still check `.claude/` and the legacy `product-marketing-context.md` filename as fallbacks, so nothing breaks if you don't migrate.

### Full rename map

| Old | New |
|-----|-----|
| `ab-test-setup` | `ab-testing` |
| `analytics-tracking` | `analytics` |
| `aso-audit` | `aso` |
| `competitor-alternatives` | `competitors` |
| `email-sequence` | `emails` |
| `form-cro` | merged into `cro` |
| `free-tool-strategy` | `free-tools` |
| `launch-strategy` | `launch` |
| `onboarding-cro` | `onboarding` |
| `page-cro` | `cro` |
| `paid-ads` | `ads` |
| `paywall-upgrade-cro` | `paywalls` |
| `popup-cro` | `popups` |
| `pricing-strategy` | `pricing` |
| `product-marketing-context` | `product-marketing` |
| `referral-program` | `referrals` |
| `schema-markup` | `schema` |
| `signup-flow-cro` | `signup` |
| `social-content` | `social` |

## Usage

Once installed, just ask your agent to help with marketing tasks:

```
"Help me optimize this landing page for conversions"
→ Uses cro skill

"Write homepage copy for my SaaS"
→ Uses copywriting skill

"Set up GA4 tracking for signups"
→ Uses analytics skill

"Create a 5-email welcome sequence"
→ Uses emails skill
```

You can also invoke skills directly:

```
/cro
/emails
/seo-audit
```

## Skill Categories

### Conversion Optimization
- `cro` - Pages and forms
- `signup` - Registration flows
- `onboarding` - Post-signup activation
- `popups` - Modals and overlays
- `paywalls` - In-app upgrade moments

### Content & Copy
- `copywriting` - Marketing page copy
- `copy-editing` - Edit and polish existing copy
- `cold-email` - B2B cold outreach emails and sequences
- `emails` - Automated email flows
- `social` - Social media content
- `image` - AI image generation, design tools, and optimization

### SEO & Discovery
- `seo-audit` - Technical and on-page SEO
- `ai-seo` - AI search optimization (AEO, GEO, LLMO)
- `link-building` - Earned links and mentions on AI-cited pages
- `programmatic-seo` - Scaled page generation
- `site-architecture` - Page hierarchy, navigation, URL structure
- `competitors` - Comparison and alternative pages
- `schema` - Structured data

### Paid & Distribution
- `ads` - Google, Meta, LinkedIn ad campaigns
- `events` - Webinars, conferences, sponsorships, speaking
- `ad-creative` - Bulk ad creative generation and iteration
- `social` - Social media scheduling and strategy

### Measurement & Testing
- `analytics` - Event tracking setup
- `conversion-tracking` - Pixels, conversion tags, server-side delivery, and tracking audits
- `ab-testing` - Experiment design

### Retention
- `churn-prevention` - Cancel flows, save offers, dunning, payment recovery

### Growth Engineering
- `co-marketing` - Partner identification and joint campaigns
- `free-tools` - Marketing tools and calculators
- `referrals` - Referral and affiliate programs

### Strategy & Monetization
- `marketing-ideas` - 140 SaaS marketing ideas
- `marketing-psychology` - Mental models and psychology
- `launch` - Product launches and announcements
- `pricing` - Pricing, packaging, and monetization
- `reverse-engineer-marketing` - Growth teardowns of any company, with plays to copy

### Sales & RevOps
- `revops` - Lead lifecycle, scoring, routing, pipeline management
- `sales-enablement` - Sales decks, one-pagers, objection docs, demo scripts

## Contributing

Found a way to improve a skill? Have a new skill to suggest? PRs and issues welcome!

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on adding or improving skills.

## License

[MIT](LICENSE) - Use these however you want.

<br />
<br />
<a href="https://vercel.com/open-source-program">
  <img alt="Vercel OSS Program" src="https://vercel.com/oss/program-badge-2026.svg" />
</a>
