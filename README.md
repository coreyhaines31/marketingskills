# Dust Marketing Skills

A library of 47 marketing skills for [Dust](https://dust.tt) agents. Import them into your Dust workspace to give your marketing agents battle-tested playbooks for conversion optimization, copywriting, SEO, paid ads, lifecycle, and growth — grounded in your own product context, your connected data, and Dust's **Browse** and **Computer** capabilities.

Every skill is built on the open [Agent Skills spec](https://agentskills.io), so it imports **directly into Dust from this GitHub repo** — no reformatting, no copy-paste.

Managed and updated by **Daniel Colaianni**, built for and heavily adapted to the Dust AI platform.

**Contributions welcome!** Found a way to improve a skill or have a new one to add? [Open a PR](#contributing) or [an issue](https://github.com/ryzamedia/dustmarketingskills/issues).

## What are Skills in Dust?

In Dust, a **Skill** is a reusable package of instructions, knowledge, and tools that you share across multiple agents. Instead of re-writing the same guidance into every agent, you build a skill once and attach it wherever it's needed — and when you improve the skill, every agent using it improves too.

Each skill in this repo is a self-contained set of expert marketing instructions. Import one into your workspace and it becomes a Dust Skill you can attach to any marketing agent — giving that agent a professional's playbook for the task, plus guidance on which Dust tools (Browse, Computer, Web Search, Create Files/Images, connectors) to reach for and when.

## How to import into Dust

Dust imports skills straight from a GitHub repository, so setup is a paste:

1. **In Dust, go to Skills → Create skill → Import from GitHub.**
2. **Paste this repository's URL** to bring in the whole library, or paste a single skill's subfolder URL (e.g. `.../tree/main/skills/cro`) to import just one. Dust reads the standard `skills/<name>/SKILL.md` structure and pulls in each skill's instructions, description, and any `references/` files.
3. **Attach the imported skill(s) to a marketing agent.** Any agent with a skill attached will use it automatically when a relevant request comes in — Dust only loads the skills that fit the task, keeping the agent's context lean.
4. **Give the agent the tools each skill expects** (Web Search, Browse, Computer, Create Files, Create Images, Data Visualization, Agent Memory, and connectors like HubSpot, Salesforce, Slack, GA4, Google Drive, Notion). Each skill notes which tools it relies on.
5. **Set up a Product Context knowledge item** once (see [product-marketing](skills/product-marketing/)) and attach it to your marketing agents — every other skill reads from it.

You can also upload the repo as a `.zip` if you'd rather not connect GitHub. Because the skills are the source of truth in Git, re-importing after a `git pull` keeps your Dust workspace in sync.

## How Skills Work Together

Skills reference each other and build on shared context. The `product-marketing` skill is the foundation — it produces a **Product Context** knowledge item (and can store the essentials in Agent Memory) that every other skill references to understand your product, audience, and positioning before doing anything.

```
                            ┌──────────────────────────────────────┐
                            │          product-marketing           │
                            │   (Product Context all skills use)   │
                            └──────────────────┬───────────────────┘
                                               │
    ┌──────────────┬─────────────┬─────────────┼─────────────┬──────────────┬──────────────┐
    ▼              ▼             ▼             ▼             ▼              ▼              ▼
┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────────┐ ┌──────────┐ ┌─────────────┐ ┌───────────┐
│  SEO &   │ │   CRO    │ │Content & │ │  Paid &    │ │ Growth & │ │  Sales &    │ │ Strategy  │
│ Content  │ │          │ │   Copy   │ │Measurement │ │Retention │ │    GTM      │ │           │
├──────────┤ ├──────────┤ ├──────────┤ ├────────────┤ ├──────────┤ ├─────────────┤ ├───────────┤
│seo-audit │ │cro       │ │copywritng│ │ads         │ │referrals │ │revops       │ │mktg-ideas │
│ai-seo    │ │signup    │ │copy-edit │ │ad-creative │ │free-tools│ │sales-enable │ │mktg-psych │
│site-arch │ │onboarding│ │cold-email│ │ab-testing  │ │churn-    │ │launch       │ │customer-  │
│programm  │ │popups    │ │emails    │ │analytics   │ │ prevent  │ │pricing      │ │ research  │
│schema    │ │paywalls  │ │social    │ │            │ │community │ │competitors  │ │           │
│content   │ │          │ │video     │ │            │ │lead-magnt│ │comp-profile │ │           │
│aso       │ │          │ │image     │ │            │ │co-mktg   │ │directory    │ │           │
│          │ │          │ │sms       │ │            │ │          │ │prospecting  │ │           │
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

## Built for Dust's capabilities

These skills are written to take advantage of what a Dust agent can actually do — not just generate text:

- **Browse** — read the live content of any page (landing pages, competitor sites, SERPs) instead of relying on what the user pastes in. Skills like `cro`, `seo-audit`, `competitor-profiling`, and `aso` use it to analyze real pages.
- **Computer** — interact with pages directly: click, type, fill forms, and navigate. Useful for walking a signup flow, reproducing a funnel, or checking how a page behaves, not just how it reads.
- **Web Search** — pull current data, benchmarks, competitors, and trends into the work.
- **Create Files & Create Images** — output finished artifacts: docs, spreadsheets, ad creative, social graphics, hero images, and OG images.
- **Data Visualization** — turn analytics and experiment results into charts inline.
- **Agent Memory** — remember product context, brand voice, and prior decisions across conversations.
- **Connectors** — ground the work in your systems: HubSpot, Salesforce, Slack, Google Drive, Notion, GA4, Google Ads, and 100+ more (natively or via remote MCP servers / Composio). See [`tools/REGISTRY.md`](tools/REGISTRY.md).
- **Triggers** — run skills on a schedule or webhook for recurring workflows (social scheduling, listening, weekly reporting). See [marketing-loops](skills/marketing-loops/).
- **Run an Agent** — chain specialized agents (e.g. a research agent feeding a copywriting agent).

## Available Skills

<!-- SKILLS:START -->
| Skill | Description |
|-------|-------------|
| [ab-testing](skills/ab-testing/) | When the user wants to plan, design, or implement an A/B test or experiment, or build a growth experimentation program.... |
| [ad-creative](skills/ad-creative/) | When the user wants to generate, iterate, or scale ad creative — headlines, descriptions, primary text, or full ad... |
| [ads](skills/ads/) | When the user wants help with paid advertising campaigns on Google Ads, Meta (Facebook/Instagram), LinkedIn, Twitter/X,... |
| [ai-seo](skills/ai-seo/) | When the user wants to optimize content for AI search engines, get cited by LLMs, or appear in AI-generated answers.... |
| [analytics](skills/analytics/) | When the user wants to set up, improve, or audit analytics tracking and measurement. Also use when the user mentions... |
| [aso](skills/aso/) | When the user wants to audit or optimize an App Store or Google Play listing. Also use when the user mentions 'ASO... |
| [churn-prevention](skills/churn-prevention/) | When the user wants to reduce churn, build cancellation flows, set up save offers, recover failed payments, or... |
| [co-marketing](skills/co-marketing/) | When the user wants to find co-marketing partners, plan joint campaigns, or brainstorm partnership opportunities. Use... |
| [cold-email](skills/cold-email/) | Write B2B cold emails and follow-up sequences that get replies. Use when the user wants to write cold outreach emails,... |
| [community-marketing](skills/community-marketing/) | Build and leverage online communities to drive product growth and brand loyalty. Use when the user wants to create a... |
| [competitor-profiling](skills/competitor-profiling/) | When the user wants to research, profile, or analyze competitors from their URLs. Also use when the user mentions... |
| [competitors](skills/competitors/) | When the user wants to create competitor comparison or alternative pages for SEO and sales enablement. Also use when... |
| [content-strategy](skills/content-strategy/) | When the user wants to plan a content strategy, decide what content to create, or figure out what topics to cover. Also... |
| [copy-editing](skills/copy-editing/) | When the user wants to edit, review, or improve existing marketing copy, or refresh outdated content. Also use when the... |
| [copywriting](skills/copywriting/) | When the user wants to write, rewrite, or improve marketing copy for any page — including homepage, landing pages,... |
| [cro](skills/cro/) | When the user wants to optimize, improve, or increase conversions on any marketing page or form — including homepage,... |
| [customer-research](skills/customer-research/) | When the user wants to conduct, analyze, or synthesize customer research. Use when the user mentions "customer... |
| [directory-submissions](skills/directory-submissions/) | When the user wants to submit their product to startup, SaaS, AI, agent, MCP, no-code, or review directories for... |
| [emails](skills/emails/) | When the user wants to create or optimize an email sequence, drip campaign, automated email flow, or lifecycle email... |
| [free-tools](skills/free-tools/) | When the user wants to plan, evaluate, or build a free tool for marketing purposes — lead generation, SEO value, or... |
| [image](skills/image/) | When the user wants to create, generate, edit, or optimize images for marketing — blog heroes, social graphics, product... |
| [launch](skills/launch/) | When the user wants to plan a product launch, feature announcement, or release strategy. Also use when the user... |
| [lead-magnets](skills/lead-magnets/) | When the user wants to create, plan, or optimize a lead magnet for email capture or lead generation. Also use when the... |
| [marketing-council](skills/marketing-council/) | When the user wants multiple expert perspectives on a marketing question — a simulated board of advisors staffed by... |
| [marketing-ideas](skills/marketing-ideas/) | When the user needs marketing ideas, inspiration, or strategies for their SaaS or software product. Also use when the... |
| [marketing-loops](skills/marketing-loops/) | When the user wants to set up a recurring, self-running marketing workflow — a repeatable loop an AI agent runs on a... |
| [marketing-plan](skills/marketing-plan/) | When the user needs a comprehensive marketing plan for a client, a company they advise, or their own product. Also use... |
| [marketing-psychology](skills/marketing-psychology/) | When the user wants to apply psychological principles, mental models, or behavioral science to marketing. Also use when... |
| [offers](skills/offers/) | When the user wants to design, construct, or improve an offer — the thing they actually sell — including value framing,... |
| [onboarding](skills/onboarding/) | When the user wants to optimize post-signup onboarding, user activation, first-run experience, or time-to-value. Also... |
| [paywalls](skills/paywalls/) | When the user wants to create or optimize in-app paywalls, upgrade screens, upsell modals, or feature gates. Also use... |
| [popups](skills/popups/) | When the user wants to create or optimize popups, modals, overlays, slide-ins, or banners for conversion purposes. Also... |
| [pricing](skills/pricing/) | When the user wants help with pricing decisions, packaging, or monetization strategy. Also use when the user mentions... |
| [product-marketing](skills/product-marketing/) | When the user wants to create or update their product marketing context document. Also use when the user mentions... |
| [programmatic-seo](skills/programmatic-seo/) | When the user wants to create SEO-driven pages at scale using templates and data. Also use when the user mentions... |
| [prospecting](skills/prospecting/) | When the user wants to find, qualify, and build a list of prospects to reach out to — across B2B SaaS, general B2B, or... |
| [public-relations](skills/public-relations/) | When the user wants help with public relations, earned media, press coverage, journalist outreach, or media strategy... |
| [referrals](skills/referrals/) | When the user wants to create, optimize, or analyze a referral program, affiliate program, or word-of-mouth strategy.... |
| [revops](skills/revops/) | When the user wants help with revenue operations, lead lifecycle management, or marketing-to-sales handoff processes.... |
| [sales-enablement](skills/sales-enablement/) | When the user wants to create sales collateral, pitch decks, one-pagers, objection handling docs, or demo scripts. Also... |
| [schema](skills/schema/) | When the user wants to add, fix, or optimize schema markup and structured data on their site. Also use when the user... |
| [seo-audit](skills/seo-audit/) | When the user wants to audit, review, or diagnose SEO issues on their site. Also use when the user mentions "SEO... |
| [signup](skills/signup/) | When the user wants to optimize signup, registration, account creation, or trial activation flows. Also use when the... |
| [site-architecture](skills/site-architecture/) | When the user wants to plan, map, or restructure their website's page hierarchy, navigation, URL structure, or internal... |
| [sms](skills/sms/) | When the user wants to plan, build, or optimize SMS or MMS marketing — including welcome flows, abandoned cart texts,... |
| [social](skills/social/) | When the user wants help creating, scheduling, or optimizing social media content for LinkedIn, Twitter/X, Instagram,... |
| [video](skills/video/) | When the user wants to create, generate, or produce video content using AI tools or programmatic frameworks. Also use... |
<!-- SKILLS:END -->

## Using your skills in Dust

Once a skill is imported and attached to an agent, just talk to the agent — Dust routes to the right skill automatically:

```
"@Marketing optimize this landing page for conversions"
→ uses the cro skill (and Browse/Computer to analyze the live page)

"@Marketing write homepage copy for our new plan"
→ uses the copywriting skill

"@Marketing set up GA4 tracking for signups"
→ uses the analytics skill

"@Marketing draft a 5-email welcome sequence"
→ uses the emails skill
```

### Suggested agent setups

You don't need one agent per skill. A few well-scoped agents cover most teams:

- **Marketing Agent** — `cro`, `copywriting`, `copy-editing`, `signup`, `ab-testing` + Browse, Computer, Create Files, and the Product Context knowledge item.
- **SEO Agent** — `seo-audit`, `ai-seo`, `schema`, `programmatic-seo`, `site-architecture` + Browse, Web Search, Create Files.
- **Growth & Lifecycle Agent** — `emails`, `onboarding`, `churn-prevention`, `referrals`, `sms` + your email/CRM connectors.
- **Content & Social Agent** — `content-strategy`, `social`, `image`, `video` + Create Images, connectors, and Triggers for scheduling.
- **RevOps / Sales Agent** — `revops`, `sales-enablement`, `cold-email`, `prospecting`, `competitors` + HubSpot/Salesforce connectors.

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
- `programmatic-seo` - Scaled page generation
- `site-architecture` - Page hierarchy, navigation, URL structure
- `competitors` - Comparison and alternative pages
- `schema` - Structured data

### Paid & Distribution
- `ads` - Google, Meta, LinkedIn ad campaigns
- `ad-creative` - Bulk ad creative generation and iteration
- `social` - Social media scheduling and strategy

### Measurement & Testing
- `analytics` - Event tracking setup
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

### Sales & RevOps
- `revops` - Lead lifecycle, scoring, routing, pipeline management
- `sales-enablement` - Sales decks, one-pagers, objection docs, demo scripts

## Tools & Connectors

Skills reference the tools a Dust agent should use to do the work for real. [`tools/REGISTRY.md`](tools/REGISTRY.md) maps marketing platforms to how you reach them from Dust — native connectors, remote MCP servers, and [Composio](tools/integrations/composio.md) for OAuth-heavy tools without a native server (HubSpot, Salesforce, Meta Ads, LinkedIn Ads, Google Sheets, and more).

## Contributing

Found a way to improve a skill? Have a new skill to suggest? PRs and issues welcome!

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on adding or improving skills.

## Thanks

Originally forked from [Marketing Skills](https://github.com/coreyhaines31/marketingskills) by [Corey Haines](https://corey.co) — thanks to Corey and the original contributors for the foundation before the fork. This project is now maintained and heavily modified by **Daniel Colaianni** for the Dust AI platform, under the MIT License.

## License

[MIT](LICENSE) - Use these however you want.
