# Hidden Signals

Stage 5 in full: evidence most teardowns never look at. Infrastructure, archives, and third-party footprints show moves the company never announced, often with exact dates. Most of it is free.

## Contents
- Infrastructure
- Archives
- Paid promotion
- Growth counters off the website
- How they see the market

---

## Infrastructure

| Signal | Command or source | What it shows |
|---|---|---|
| **DNS records** | `teardown.mjs dns <domain>` | Email senders from SPF and MX (HubSpot, Customer.io, SendGrid), domain verifications for connected tools (Meta Business, TikTok, Stripe, AI vendors), and the platforms behind `go.`, `help.`, `docs.`, `community.` and other marketing subdomains |
| **Certificate logs** | `teardown.mjs subdomains <domain>` | Every subdomain with the date its first certificate was issued, usually days before launch: free tools, showcases, creator programs, campaigns, enterprise pages, new products |
| **Page scripts** | `teardown.mjs stack <domain>` | Ad pixels, analytics, A/B testing, affiliate and lifecycle tools, dated from archived homepages |
| **UTM parameters** | Links in their posts, ads, emails, and partner pages | How they name campaigns (`utm_source=newsletter_sponsor`, `utm_campaign=q3_creator`), which shows how they organize channels and which partners they track |
| **robots.txt and llms.txt** | `target.com/robots.txt`, `/llms.txt` | Which AI crawlers they allow, and whether they publish an AI-readable summary or agent files (see **ai-seo**) |

Each new subdomain, verification, and mail tool is a candidate move. Date it, label it Inferred, and confirm it with a second source where you can: a new `creators.` subdomain plus a creator program page is Observed.

## Archives

| Signal | Command or source | What it shows |
|---|---|---|
| **Headline history** | `teardown.mjs hero <domain> --months 24` | Every change to the homepage H1, title, and meta description. Positioning shifts dated against the curve. Keyword-led changes ("Build something" → "AI App Builder") mean search started driving positioning |
| **Pricing history** | `teardown.mjs history <url>/pricing` | When prices and plans changed |
| **Sitemap growth** | `teardown.mjs sitemap-growth <domain>` | Sitemap size by month and when each page family first appeared: the dated rollout of programmatic and content pages |
| **Customer logo wall** | Open the captures from `hero` | Who they landed and when. A shift from startup logos to enterprise logos dates a move upmarket |
| **Case studies** | Wayback of `/customers` | How the ideal customer changed: industry, size, use case |
| **Old landing pages** | Wayback CDX for `target.com/lp/*`, `/go/*`, `/try/*` | Retired campaign pages and the offers they ran |

## Paid Promotion

Who the company pays to talk about it. These are dated moves that never show in an ad library.

| Signal | How to find it |
|---|---|
| **Newsletter sponsorships** | Search `"sponsored by [company]"`, `"presented by [company]"`, and `"[company]" sponsor` with newsletter platforms (`site:beehiiv.com`, `site:substack.com`), plus the archives of the category's big newsletters |
| **Podcast ads** | Search transcripts and show notes for `"brought to you by [company]"` and `"[company].com/[show]"` vanity URLs |
| **YouTube sponsorships** | Video descriptions with the company's link and #ad, sponsored, or partner wording; ScrapeCreators YouTube search |
| **Affiliates** | Search the company's domain with `?via=`, `?ref=`, `?aff=`, `?fpr=`, or `/go/` links; affiliate pages on review and comparison sites |
| **Coupon and deal sites** | Search `"[company] coupon"`, `"[company] promo code"`, AppSumo, and lifetime-deal listings. Heavy presence means discount-led acquisition |
| **Conferences and events** | Sponsor pages of the category's main events; the company's own events page and `events.` subdomain |
| **Influencer and creator programs** | `creators.`, `ambassadors.`, or `/partners` pages, plus the creator videos found in stage 2 |

For each: the date, the placement, the offer or code, and the landing page. Vanity URLs and codes tell you which placements they kept buying.

## Growth Counters off the Website

Public numbers that move with growth and are dated:

| Counter | Where |
|---|---|
| Review count and velocity | G2, Capterra, Trustpilot, app stores. Sudden spikes usually mean a review campaign, which is a move |
| App store rank and ratings | App Store and Google Play history (see **aso**) |
| Developer adoption | GitHub stars and contributors over time, npm or PyPI downloads, Docker pulls |
| Browser extensions | Chrome Web Store user counts (Wayback has old counts) |
| Community size | Discord and Slack member counts on invite pages, subreddit subscribers, forum member counts |
| Marketplace listings | Zapier, Slack, HubSpot, Shopify, Salesforce, Atlassian, and Chrome marketplaces: when each listing appeared, and install counts where shown |
| Open metrics | Public revenue or traffic dashboards some companies publish. These are Observed numbers, not estimates |
| AI referral traffic | Similarweb referrals from chatgpt.com and perplexity.ai |
| AI visibility over time | The prompt tracker from stage 2, as share of voice by month |

Add a counter to the timeline when it has dates. A review spike, a marketplace launch, or a jump in GitHub stars is a move.

## How They See the Market

- **Which competitors they target:** the companies named in their `/vs`, `/compare`, and `/alternatives` pages, and in their paid search ads. That's who they believe they're fighting.
- **Which segments they pay for:** landing pages behind their ads, by audience or industry.
- **What their chat bot and sales team say** about competitors (from stage 3).
- **Which partners they co-market with:** integration pages, joint webinars, partner directories.

Use this in the gap stage: if they're targeting the user directly, plays should include the user's own comparison pages (see **competitors**).
