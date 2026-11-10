# SaaS: Teardown Pack

Load this pack when the target sells software by subscription or usage: product-led tools, sales-led platforms, developer tools, and AI apps. Growth here compounds through the product itself, so the free plan, the integrations, and the sales motion matter as much as the marketing site.

## Contents
- How to recognize it
- What drives growth here
- Signals to collect
- Going inside
- Rules that limit copying
- Plays that usually transfer
- Metrics to ask about

---

## How to Recognize It

- `app.`, `dashboard.`, `console.`, or `api.` subdomains in `teardown.mjs subdomains <domain>`, and a `/login` or `/signup` path in the sitemap.
- A `/pricing` page with plans per seat, per usage, or per credit, and a free plan or trial.
- Page families like `/integrations`, `/templates`, `/changelog`, `/docs`, `/vs`, `/alternatives`.
- Product analytics and lifecycle scripts in `teardown.mjs stack <domain>` (Segment, PostHog, Amplitude, Intercom, Customer.io).
- `teardown.mjs detect <domain>` returns SaaS hints from these patterns.
- **Sub-type:** a "Book a demo" CTA ahead of "Start free" means sales-led. Docs, an API reference, and an npm or GitHub link mean a dev tool. Credit-based pricing and model names on the pricing page mean an AI app.

## What Drives Growth Here

- **Product-led:** sign-ups come from search, templates, and sharing; revenue comes from free users hitting a limit or inviting a team. Look hard at the free plan's limits and what non-users see.
- **Sales-led:** pipeline comes from outbound, paid search on high-intent terms, events, partners, and analyst coverage. The sales process and who they target matter more than the homepage.
- **Dev tools:** adoption starts in docs, GitHub, package registries, and now AI coding assistants. Docs search traffic and package downloads lead revenue.
- **AI apps:** growth often comes in spikes from launches, founder posts, and creator demos, then depends on retention. Check whether the curve holds after each spike.
- **Expansion:** in mature SaaS, much of the growth comes from existing accounts (seats, usage, upgrades) rather than new logos. Look for team and enterprise plans, usage add-ons, and "Contact sales" thresholds added over time.

## Signals to Collect

| Signal | Where or how | What it shows |
|---|---|---|
| Free plan limits over time | `teardown.mjs history <domain>/pricing` and the archived captures (open the captures for limits, since the command only diffs prices) | When they loosened or tightened the free plan, a common growth lever. Each change becomes a move |
| ★ Integration marketplace listings | Zapier, Slack, HubSpot, Salesforce AppExchange, Atlassian Marketplace, Chrome Web Store; Wayback for listing dates | Distribution through other products' users. Each new listing is a dated move |
| Template gallery size | `teardown.mjs sitemap-growth <domain>`, reading the `/templates` family | A search and activation engine; the rollout date and growth rate |
| Changelog cadence | The changelog page and its archive | Shipping speed, and which launches got announced as marketing moments |
| ★ Client-side experiments | `teardown.mjs experiments <domain>` | Running A/B tests, often with readable names (pricing defaults, onboarding steps): their test roadmap |
| Comparison pages | `/vs`, `/alternatives`, `/compare` families from `site` | Which competitors they target, and when they started |
| Docs search traffic | Ranked keywords on `docs.` or `/docs` from the SEO tool | For dev tools, the main top-of-funnel |
| Package and repo adoption | GitHub stars and contributors over time, npm, PyPI, or Docker pull counts | Developer adoption that leads revenue for dev tools |
| ★ AI assistant presence | The prompt tracker, plus asking coding assistants how to do the task the product solves | Whether AI tools recommend or write code for the product |
| Review site placement | G2 and Capterra category grids and review count over time | Mid-market credibility; review spikes line up with review campaigns (often timed before a quarterly G2 report) and become moves |
| ★ Pricing page unit changes | Archived pricing pages: per seat to per usage, credits, or outcome pricing | A packaging shift, often the biggest dated move in AI and usage-based tools |
| ★ Public company filings | `teardown.mjs filings <company>` for public peers | Real customer counts, sales and marketing spend, and retention disclosures to sanity-check estimates |
| Sales hiring | Job posts for SDRs, AEs, solutions engineers, by region | A shift to sales-led or a new market, dated by first posting |
| Partner and affiliate program | `/partners`, `/affiliates`, and `stack` (PartnerStack, Rewardful, Tolt) | Agency and affiliate distribution, and its reward |

## Going Inside

With approval, under the user's real identity:
- **Free plan or trial:** time to first result, the onboarding questions (they reveal segmentation), and the first upgrade prompt. Note whether the product asks you to invite teammates and when.
- **Limits:** hit the free limit and screenshot the upgrade wall and the plan it pushes.
- **Seat and usage prompts:** add a second workspace or project if free, and see how expansion is triggered.
- **Sales-led:** book a demo only under the user's name. Record routing (instant calendar or "we'll be in touch"), speed to response, and the follow-up sequence.
- **Lifecycle emails:** log the trial sequence, especially the day before and after the trial ends.
- Don't create extra accounts to stretch a free trial, and don't use the API in ways the terms forbid.

## Rules That Limit Copying

- **Terms of service** often bar competitors from signing up or benchmarking. Read them first (see go-inside).
- **Review platforms:** G2 and Capterra have rules on incentivized reviews. Copy the program structure, not any incentive that breaks their policy.
- **Comparison pages:** claims about a named competitor must be accurate and current. False comparative claims create legal risk under advertising law (the FTC in the US, and equivalents elsewhere); check with counsel for aggressive comparisons.
- **Email outreach:** CAN-SPAM sets US rules for commercial email (accurate headers, a physical address, a working opt-out). GDPR and PECR restrict unsolicited email in the EU and UK more tightly. Copy the sequence design, not a list.
- **Trademarks:** under Google Ads' trademark policy, bidding on a competitor's brand name as a keyword is allowed, but the owner can file a complaint that restricts use of the mark in ad text. Trademark law still applies on top of platform policy; check with counsel.

## Plays That Usually Transfer

| Play | Run it with |
|---|---|
| Template or use-case page family | **programmatic-seo** |
| Comparison and alternative pages | **competitors** |
| Free plan limits and the upgrade wall | **pricing**, **paywalls** |
| Faster first result and invite prompts | **onboarding**, **signup** |
| Integration listings and co-marketing | **co-marketing**, **directory-submissions** |
| Trial and lifecycle email sequence | **emails** |
| Showing up in AI answers and coding assistants | **ai-seo** |
| Affiliate and agency partner program | **referrals** |

## Metrics to Ask About

- **Sign-up to activation rate:** share of sign-ups that reach the first meaningful result.
- **Free to paid conversion:** share of free or trial users who pay, and how long it takes.
- **Net revenue retention:** revenue from a cohort a year later, including expansion and churn.
- **CAC payback:** months of gross margin to recover the cost of acquiring a customer.
- **Pipeline by source:** for sales-led, the share of qualified pipeline from each channel.
- **Time to value:** minutes or days from sign-up to first result.
- **Seat or usage expansion:** growth in seats or usage within paying accounts.
