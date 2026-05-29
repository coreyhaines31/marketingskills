# Marketing Operations Stack — Skills + MCPs per AARRR Stage

This doc maps every marketing-skill and every relevant MCP/API integration to the AARRR stage(s) it primarily serves. It's the source for Section 11 of every plan.

> **Note on scope.** Skills below live in this `marketingskills` repo. A few references point to optional tools from adjacent Claude Code marketplaces (e.g., `vercel:agent-browser`, `compound-engineering:diagram-maker`) — substitute equivalents if not installed. When a plan references a skill or tool that isn't available, fall back to the underlying tactic and call it out in Section 13's open decisions.

## The thesis

A small team + fCMO + agentic tooling = output of a 15–20-person traditional marketing org. The skills + MCPs encode workflows that previously required dedicated headcount per channel.

The plan's Section 11 makes this thesis explicit by:
1. Mapping skills to stages so the founder sees which skills execute which work
2. Mapping MCPs/APIs to stages so the founder sees the tooling layer
3. Naming a concrete operational example that proves the stack works
4. Showing capability unlocks by funding stage (pre-seed → seed → Series A)

## Marketing skills mapped to AARRR

### Acquisition skills

| Skill | What it does | Primary use in Acquisition |
|---|---|---|
| `seo-audit` | Audit site for technical and on-page SEO | Quarterly site health checks |
| `ai-seo` | Optimize content for AI search engines / LLM citation | Future-proof content strategy |
| `programmatic-seo` | Build template-driven SEO pages at scale | Location, comparison, integration page systems |
| `schema` | Add structured data markup | Rich snippets, eligibility for AI citation |
| `content-strategy` | Plan content topics, pillars, cadence | Setting the editorial calendar |
| `competitors` | Build vs-pages and alternative-to-pages | Capture high-intent SERPs against competitors |
| `ads` | Plan and structure paid campaigns | Apple Search Ads, Meta, Google, LinkedIn |
| `ad-creative` | Generate ad variations and creative | Iterate ad creative across platforms |
| `social` | Plan and write social media content | LinkedIn, Twitter/X, Instagram, TikTok |
| `typefully` | Schedule/post tweets, threads, LinkedIn content | Cadence operations for founder-led channels |
| `cold-email` | Write B2B cold outreach + sequences | Outbound for B2B SaaS / hybrid businesses |
| `analytics` | Set up tracking, GA4, conversion events | Funnel instrumentation |
| `free-tools` | Plan engineering-as-marketing free tools | Build tools that generate links + leads |
| `marketing-website-design` | Design marketing sites with intention | Pillar/landing page design |
| `launch` | Plan and execute launches (Product Hunt, GA, feature launches) | GTM moments — strategy + tactical execution |

### Activation skills

| Skill | What it does | Primary use in Activation |
|---|---|---|
| `onboarding` | Optimize user onboarding flows | Onboarding rebuild, activation rate tests |
| `signup` | Optimize signup/registration | Reduce friction at top of activation |
| `cro` | Optimize any marketing page or form | Conversion testing across pages, forms, landing pages |
| `paywalls` | Optimize paywalls and upgrade screens | Trial → paid conversion (also Revenue) |
| `popups` | Optimize popups, modals, slide-ins | Lead capture + activation prompts |
| `copywriting` | Write marketing copy | Onboarding screens, paywall copy, CTAs |
| `copy-editing` | Edit and improve existing copy | Voice / clarity pass before ship |
| `copycraft` | Real-time copy variation overlay | Live copy iteration during reviews |
| `website-copy` | Write full website copy (stage-8 from CF process) | Comprehensive site copy production |
| `ab-testing` | Plan A/B tests | Structure for onboarding variant tests |
| `marketing-psychology` | Apply behavioral science to copy and CRO | Persuasion principles in activation moments |

### Retention skills

| Skill | What it does | Primary use in Retention |
|---|---|---|
| `emails` | Design email sequences | Customer.io / Mailchimp / Resend flow building |
| `churn-prevention` | Build cancellation flows, save offers, win-back | Reduce churn, recover failed payments |
| `copywriting` / `copy-editing` | Email copy production | Lifecycle email content |
| `paywalls` | (cross-cuts) — upgrade prompts in retention emails | Upsell within lifecycle |
| `ab-testing` | Test email variants | Subject line, CTA, timing tests |

### Referral skills

| Skill | What it does | Primary use in Referral |
|---|---|---|
| `referrals` | Plan and launch referral / affiliate / ambassador programs | Core skill for Section 7 |
| `social` | Create ambassador-shareable content | Talking points, post templates |
| `copywriting` | Ambassador / affiliate email copy | Recruitment, onboarding, communication |
| `marketing-website-design` | Per-ambassador landing pages | Attribution surface |
| `emails` | Ambassador lifecycle emails | Onboarding, monthly digest, payout notifications |

### Revenue skills

| Skill | What it does | Primary use in Revenue |
|---|---|---|
| `pricing` | Audit and optimize pricing | Plan tier structure, annual defaults, value metrics |
| `paywalls` | Paywall optimization | Trial → paid, free → paid conversion |
| `sales-enablement` | Build sales decks, one-pagers, demos | B2B sales support material |
| `revops` | Revenue operations, lead lifecycle | Marketing → sales handoff |
| `ab-testing` | Pricing experiments | Test annual default, intro pricing, tier consolidation |

### Cross-cutting / brand foundation skills

| Skill | What it does | Primary use |
|---|---|---|
| `product-marketing` | Set up the `.agents/product-marketing.md` context file (positioning, ICP, voice) | Foundational — run first; every section of the plan references this |
| `customer-research` | Conduct customer interviews + surveys | Section 2 + Section 3 (Current state) |
| `marketing-psychology` | Apply behavioral science | Cross-cuts copy, CRO, paywalls |
| `marketing-ideas` | The 139-idea library | Section 12 of plan (Idea bank) |

## MCPs and APIs mapped to AARRR

### Acquisition tooling

| Tool | What it provides | Wired-at-client check |
|---|---|---|
| **Ahrefs API** | SEO data: keyword research, backlinks, competitor analysis | Required `AHREFS_API_KEY` in `.env` |
| **DataForSEO API** | SERP data, keyword volume, competitor SERP analysis | Required API key |
| **GA4 MCP** | Traffic by channel, conversion events, retention curves | Wired via gcp project + service account |
| **GitHub MCP** | Repo work: marketing site (`site-name-promo` patterns), content authoring | Standard `gh` CLI auth + MCP server |
| **Typefully MCP** | Social posting (LinkedIn, X, Threads, Bluesky) | Typefully account + API key |
| **Google Ads MCP** | Ad account management, campaign creation, performance pulls | Wired post-budget-unlock |
| **agent-browser** | Browser automation (form fills, screenshots, scraping) | CLI install: `npm install -g agent-browser` |
| **dev-browser** | General-purpose browser automation | MCP server install |
| **defuddle** | Clean markdown extraction from web pages | CLI install |
| **Notion** | Internal knowledge directory access | Notion API key |
| **Stripe MCP** | LTV math, paid-CAC reconciliation (cross-cuts to Revenue) | Stripe account + restricted key |

### Activation tooling

| Tool | What it provides |
|---|---|
| **App Store Connect** | Conversion rate by listing variant, install funnel | Usually manual + `dev-browser` for screenshots |
| **GitHub MCP** | Mobile app repo for onboarding code edits |
| **Figma / Pencil MCP** | Onboarding screen design + iteration |
| **Customer.io MCP** | In-app messaging + lifecycle email coordination |
| **Stripe MCP** | Subscription state for paywall logic |
| **GA4 MCP** | Activation events instrumentation |

### Retention tooling

| Tool | What it provides |
|---|---|
| **Customer.io MCP** | The retention infrastructure — flow building, segmentation, sending |
| **Shopify** | Hardware buyer events as lifecycle triggers |
| **Stripe MCP** | Subscription state, churn cohorts, plan changes |
| **GA4 MCP** | Session events, retention curves |
| **Resend / Mailchimp / SendGrid** | Alternatives to Customer.io for different stacks |

### Referral tooling

| Tool | What it provides |
|---|---|
| **Dub.co** | Ambassador attribution, short links, per-ambassador tracking |
| **Stripe MCP** | Commission accounting + payouts via Connect |
| **GitHub MCP** | Per-ambassador landing pages |
| **Customer.io MCP** | Ambassador lifecycle (recruitment → onboarding → monthly digest → payout notifications) |
| **Rewardful / Tolt / Mention Me** | Alternatives to Dub for affiliate management |

### Revenue tooling

| Tool | What it provides |
|---|---|
| **Stripe MCP** | Pricing tests, subscription analytics, churn cohort analysis, blended CAC math |
| **Shopify** | Hardware transactions |
| **GA4 MCP** | Revenue events |
| **Customer.io MCP** | Paywall / pricing-related lifecycle |
| **Notion** | Commercial knowledge directory |

### Cross-cutting tooling

| Tool | What it provides |
|---|---|
| **Notion** | Shared knowledge base |
| **GitHub MCP** | Shared context repo (`{client-org}/{client-context}`) |
| **defuddle** | Research extraction |
| **obsidian-cli** | Working notes for fCMO |
| **Pencil MCP** | Design files |
| **Figma MCP** | Design files (if Figma) |

## Capability unlocks by funding stage

The plan's Section 11 must include this table (or equivalent), specific to the client's current and projected funding stages.

| Stage | Headcount | Tooling | Channels live |
|---|---|---|---|
| **Pre-seed / bootstrapped** | fCMO + founder team | All current tooling + marketing-skills library + MCP layer | Organic only (SEO, content, App Store, founder-led social, events, WOM, ambassador) |
| **Seed close** | + first marketing hire (lifecycle/content owner) | + paid ad accounts (Apple Search Ads, Meta, LinkedIn) + `ads` skill activated | + paid acquisition pilot ($5–15K/mo — see `funding-stage-unlocks.md` for canonical tiers) |
| **Seed deployment** | + designer (potentially fractional) | + analytics expansion (Mixpanel / Amplitude if needed) | + paid scaling ($20–50K/mo) + first launches (PH, GA) |
| **Series A** | + performance marketing lead + content lead | + dedicated tooling spend ($2–5K/mo software) + sponsored event budget | + paid scaling ($50–150K/mo) + international consideration + B2B vertical expansion |
| **Series B+** | Full-stack marketing org (10+ people) | + agency partnerships + PR firm | + brand campaigns + acquisitions + sponsorships at category level |

## The concrete-example test

Section 11 of the plan must include at least one concrete operational example that proves the stack thesis. The example should be:
- A specific event (not abstract claim)
- From this client's actual history if possible (most credible)
- Tied to a non-technical person executing via the stack (proves it works without dedicated engineering)

Examples from real engagements:
- *"On the kickoff call, Alex drafted a working Customer.io abandoned-cart flow live, using Customer.io's Claude MCP. Validated that a non-technical founder can ship lifecycle work using the skill pattern independently."*
- *"In two weeks, the team scaled from 0 to 14 ranking keywords using `programmatic-seo` against the Ahrefs API + GitHub MCP — no dedicated SEO hire required."*
- *"The first email campaign generated a 24% reply rate after `cold-email` skill + GA4 MCP + Stripe MCP gave the team a verified target list of users with high LTV but no recent activity."*

If the client has no such moment in their history yet, frame the example as the *first move* — "Here's the demonstration the team will run in week one to validate the stack:"

## When the stack doesn't apply (yet)

For clients without MCP connections set up, frame Section 11 differently:
- List the skills that DO apply with current tooling
- Name which MCPs would unlock which sections of the plan
- Treat MCP setup as a Q1 priority alongside the bedrock fixes

A plan can't claim the agentic-stack thesis if the stack isn't wired. Be honest about state.
