# Marketing Tools Registry

Quick reference for AI agents to discover tool capabilities and integration methods.

## How to Use This Registry

1. **Find tools by category** - Browse sections below for tools in each domain
2. **Check integration methods** - See what APIs, MCPs, CLIs, or SDKs are available
3. **Read integration guides** - Detailed setup and common operations in `integrations/`
4. **Connect selected accounts** - Use [guided setup](SETUP.md) for local credentials, approval gates, and a first read-only check

---

## Verified Partners

> **Full rules & boundaries:** [PARTNERS.md](PARTNERS.md) — the canonical governance doc (tool taxonomy, what sponsorship buys and never buys, disclosure, the partner lifecycle, and the `integrations/` spec).

◆ **Verified Partners** are tools whose makers fund Marketing Skills through the [partner program](https://marketing-skills.com/sponsorship). What the marker means — and doesn't:

- **Disclosed + vetted for fit.** Each carries a disclosure header in its integration guide and is marked ◆ in the index below.
- **Additive, never biasing.** A partner is listed *alongside* the neutral options for the same job, never instead of them. Partner status never removes or demotes another tool and **never changes what any skill recommends** — if a non-partner is the right answer, that's the answer. The badge means "paid, disclosed, vetted for fit," not "best in category."

Anyone — including tool makers and partners — may contribute content that names a tool, as long as it makes an agent *aware* of the right option without manufacturing a recommendation. The bar is the [integrity rubric in CONTRIBUTING.md](../CONTRIBUTING.md#mentioning-tools-the-integrity-rubric) (options not one answer, disclosed, passes the swap test).

<!-- PARTNERS:START -->
| Partner | Category | Guide |
|---------|----------|-------|
| ◆ Converly | Conversion tracking / attribution | [converly.md](integrations/converly.md) |
| ◆ Ploy | AI website & growth platform | [ploy.md](integrations/ploy.md) |
<!-- PARTNERS:END -->

<!-- The table above is generated from partners.json — run `node scripts/sync-partners.mjs`. -->

---

## Tool Index

| Tool | Category | API | MCP | CLI | SDK | Guide |
|------|----------|:---:|:---:|:---:|:---:|-------|
| ◆ converly | Conversion Tracking | ✓ | ✓ | ✓ | - | [converly.md](integrations/converly.md) |
| ◆ ploy | Website | ✓ | - | ✓ | - | [ploy.md](integrations/ploy.md) |
| ga4 | Analytics | ✓ | ✓ | [✓](clis/ga4.js) | ✓ | [ga4.md](integrations/ga4.md) |
| mixpanel | Analytics | ✓ | - | [✓](clis/mixpanel.js) | ✓ | [mixpanel.md](integrations/mixpanel.md) |
| amplitude | Analytics | ✓ | - | [✓](clis/amplitude.js) | ✓ | [amplitude.md](integrations/amplitude.md) |
| posthog | Analytics | ✓ | - | ✓ | ✓ | [posthog.md](integrations/posthog.md) |
| segment | Analytics | ✓ | - | [✓](clis/segment.js) | ✓ | [segment.md](integrations/segment.md) |
| adobe-analytics | Analytics | ✓ | - | [✓](clis/adobe-analytics.js) | ✓ | [adobe-analytics.md](integrations/adobe-analytics.md) |
| plausible | Analytics | ✓ | - | [✓](clis/plausible.js) | - | [plausible.md](integrations/plausible.md) |
| google-search-console | SEO | ✓ | - | [✓](clis/google-search-console.js) | ✓ | [google-search-console.md](integrations/google-search-console.md) |
| semrush | SEO | ✓ | - | [✓](clis/semrush.js) | - | [semrush.md](integrations/semrush.md) |
| ahrefs | SEO | ✓ | - | [✓](clis/ahrefs.js) | - | [ahrefs.md](integrations/ahrefs.md) |
| dataforseo | SEO | ✓ | - | [✓](clis/dataforseo.js) | ✓ | [dataforseo.md](integrations/dataforseo.md) |
| keywords-everywhere | SEO | ✓ | - | [✓](clis/keywords-everywhere.js) | - | [keywords-everywhere.md](integrations/keywords-everywhere.md) |
| rankparse | SEO | ✓ | ✓ | [✓](clis/rankparse.js) | - | [rankparse.md](integrations/rankparse.md) |
| clearbit | Data Enrichment (legacy) | ✓ | - | [✓](clis/clearbit.js) | ✓ | [clearbit.md](integrations/clearbit.md) |
| apollo | Data Enrichment | ✓ | ✓ | [✓](clis/apollo.js) | - | [apollo.md](integrations/apollo.md) |
| zoominfo | Data Enrichment | ✓ | ✓ | [✓](clis/zoominfo.js) | - | [zoominfo.md](integrations/zoominfo.md) |
| clay | Data Enrichment | ✓ | ✓ | [✓](clis/clay.js) | - | [clay.md](integrations/clay.md) |
| fullenrich | Data Enrichment | ✓ | ✓ | - | - | [fullenrich.md](integrations/fullenrich.md) |
| leadmagic | Data Enrichment | ✓ | ✓ | ✓ | - | [leadmagic.md](integrations/leadmagic.md) |
| supermetrics | Data Aggregation | ✓ | ✓ | [✓](clis/supermetrics.js) | - | [supermetrics.md](integrations/supermetrics.md) |
| coupler | Data Aggregation | ✓ | ✓ | [✓](clis/coupler.js) | - | [coupler.md](integrations/coupler.md) |
| hubspot | CRM | ✓ | ✓ | ✓ | ✓ | [hubspot.md](integrations/hubspot.md) |
| salesforce | CRM | ✓ | - | ✓ | ✓ | [salesforce.md](integrations/salesforce.md) |
| close | CRM | ✓ | ✓ | [✓](clis/close.js) | - | [close.md](integrations/close.md) |
| attio | CRM | ✓ | ✓ | - | ✓ | [attio.md](integrations/attio.md) |
| stripe | Payments | ✓ | ✓ | ✓ | ✓ | [stripe.md](integrations/stripe.md) |
| paddle | Payments | ✓ | - | [✓](clis/paddle.js) | ✓ | [paddle.md](integrations/paddle.md) |
| rewardful | Referral | ✓ | - | [✓](clis/rewardful.js) | - | [rewardful.md](integrations/rewardful.md) |
| tolt | Referral | ✓ | - | [✓](clis/tolt.js) | - | [tolt.md](integrations/tolt.md) |
| dub-co | Links | ✓ | - | [✓](clis/dub.js) | ✓ | [dub-co.md](integrations/dub-co.md) |
| mention-me | Referral | ✓ | - | [✓](clis/mention-me.js) | - | [mention-me.md](integrations/mention-me.md) |
| partnerstack | Affiliate | ✓ | - | [✓](clis/partnerstack.js) | - | [partnerstack.md](integrations/partnerstack.md) |
| mailchimp | Email | ✓ | ✓ | [✓](clis/mailchimp.js) | ✓ | [mailchimp.md](integrations/mailchimp.md) |
| customer-io | Email | ✓ | - | [✓](clis/customer-io.js) | ✓ | [customer-io.md](integrations/customer-io.md) |
| sendgrid | Email | ✓ | - | [✓](clis/sendgrid.js) | ✓ | [sendgrid.md](integrations/sendgrid.md) |
| resend | Email | ✓ | ✓ | [✓](clis/resend.js) | ✓ | [resend.md](integrations/resend.md) |
| sequenzy | Email | ✓ | ✓ | ✓ | - | [sequenzy.md](integrations/sequenzy.md) |
| nitrosend | Email | ✓ | ✓ | - | - | [nitrosend.md](integrations/nitrosend.md) |
| kit | Email | ✓ | - | [✓](clis/kit.js) | ✓ | [kit.md](integrations/kit.md) |
| beehiiv | Newsletter | ✓ | - | [✓](clis/beehiiv.js) | - | [beehiiv.md](integrations/beehiiv.md) |
| klaviyo | Email/SMS | ✓ | - | [✓](clis/klaviyo.js) | ✓ | [klaviyo.md](integrations/klaviyo.md) |
| postmark | Email | ✓ | - | [✓](clis/postmark.js) | ✓ | [postmark.md](integrations/postmark.md) |
| brevo | Email/SMS | ✓ | - | [✓](clis/brevo.js) | ✓ | [brevo.md](integrations/brevo.md) |
| activecampaign | Email/CRM | ✓ | - | [✓](clis/activecampaign.js) | ✓ | [activecampaign.md](integrations/activecampaign.md) |
| twilio | SMS/Voice | ✓ | - | ✓ | ✓ | [twilio.md](integrations/twilio.md) |
| plivo | SMS/Voice | ✓ | - | - | ✓ | [plivo.md](integrations/plivo.md) |
| postscript | SMS | ✓ | - | - | - | [postscript.md](integrations/postscript.md) |
| attentive | SMS | ✓ | - | - | - | [attentive.md](integrations/attentive.md) |
| audiencetap | SMS/Email | ✓ | - | - | - | [audiencetap.md](integrations/audiencetap.md) |
| hunter | Email Outreach | ✓ | ✓ | [✓](clis/hunter.js) | - | [hunter.md](integrations/hunter.md) |
| snov | Email Outreach | ✓ | - | [✓](clis/snov.js) | - | [snov.md](integrations/snov.md) |
| truelist | Email Verification | ✓ | ✓ | [✓](clis/truelist.js) | ✓ | [truelist.md](integrations/truelist.md) |
| github | Developer Intent | ✓ | - | [✓](clis/github-prospects.js) | ✓ | [github.md](integrations/github.md) |
| firecrawl | Site Scraping & AI Search | ✓ | ✓ | [✓](clis/firecrawl.js) | ✓ | [firecrawl.md](integrations/firecrawl.md) |
| browserbase | Site Scraping | ✓ | ✓ | - | ✓ | [browserbase.md](integrations/browserbase.md) |
| apify | Site Scraping | ✓ | ✓ | ✓ | ✓ | [apify.md](integrations/apify.md) |
| lemlist | Email Outreach | ✓ | ✓ | [✓](clis/lemlist.js) | - | [lemlist.md](integrations/lemlist.md) |
| instantly | Email Outreach | ✓ | ✓ | [✓](clis/instantly.js) | - | [instantly.md](integrations/instantly.md) |
| google-ads | Ads | ✓ | ✓ | [✓](clis/google-ads.js) | ✓ | [google-ads.md](integrations/google-ads.md) |
| meta-ads | Ads | ✓ | - | [✓](clis/meta-ads.js) | ✓ | [meta-ads.md](integrations/meta-ads.md) |
| linkedin-ads | Ads | ✓ | - | [✓](clis/linkedin-ads.js) | - | [linkedin-ads.md](integrations/linkedin-ads.md) |
| tiktok-ads | Ads | ✓ | - | [✓](clis/tiktok-ads.js) | ✓ | [tiktok-ads.md](integrations/tiktok-ads.md) |
| zapier | Automation | ✓ | ✓ | [✓](clis/zapier.js) | ✓ | [zapier.md](integrations/zapier.md) |
| hotjar | CRO | ✓ | - | [✓](clis/hotjar.js) | - | [hotjar.md](integrations/hotjar.md) |
| optimizely | A/B Testing | ✓ | - | [✓](clis/optimizely.js) | ✓ | [optimizely.md](integrations/optimizely.md) |
| calendly | Scheduling | ✓ | ✓ | [✓](clis/calendly.js) | - | [calendly.md](integrations/calendly.md) |
| savvycal | Scheduling | ✓ | - | [✓](clis/savvycal.js) | - | [savvycal.md](integrations/savvycal.md) |
| typeform | Forms | ✓ | - | [✓](clis/typeform.js) | ✓ | [typeform.md](integrations/typeform.md) |
| intercom | Messaging | ✓ | - | [✓](clis/intercom.js) | ✓ | [intercom.md](integrations/intercom.md) |
| outreach | Sales Engagement | ✓ | ✓ | [✓](clis/outreach.js) | - | [outreach.md](integrations/outreach.md) |
| heyreach | LinkedIn Outreach | ✓ | ✓ | ✓ | - | [heyreach.md](integrations/heyreach.md) |
| crossbeam | Partner Ecosystem | ✓ | ✓ | [✓](clis/crossbeam.js) | - | [crossbeam.md](integrations/crossbeam.md) |
| introw | Partner Ecosystem | - | ✓ | - | - | [introw.md](integrations/introw.md) |
| pendo | Product Analytics | ✓ | - | [✓](clis/pendo.js) | - | [pendo.md](integrations/pendo.md) |
| similarweb | Competitive Intelligence | ✓ | - | [✓](clis/similarweb.js) | - | [similarweb.md](integrations/similarweb.md) |
| exa | AI Search | ✓ | ✓ | [✓](clis/exa.js) | ✓ | [exa.md](integrations/exa.md) |
| firehose | Competitive Intelligence | ✓ | - | - | - | [firehose.md](integrations/firehose.md) |
| sparktoro | Audience Research | - | - | - | - | [sparktoro.md](integrations/sparktoro.md) |
| rb2b | Visitor Identification | ✓ | - | - | - | [rb2b.md](integrations/rb2b.md) |
| theirstack | Hiring & Tech Signals | ✓ | ✓ | - | - | [theirstack.md](integrations/theirstack.md) |
| gong | Revenue Intelligence | ✓ | - | - | - | [gong.md](integrations/gong.md) |
| airops | AI Content | ✓ | - | [✓](clis/airops.js) | - | [airops.md](integrations/airops.md) |
| buffer | Social | ✓ | - | [✓](clis/buffer.js) | - | [buffer.md](integrations/buffer.md) |
| wistia | Video | ✓ | - | [✓](clis/wistia.js) | - | [wistia.md](integrations/wistia.md) |
| heygen | Video | ✓ | ✓ | - | ✓ | [heygen.md](integrations/heygen.md) |
| hyperframes | Video | - | - | ✓ | ✓ | [hyperframes.md](integrations/hyperframes.md) |
| trustpilot | Reviews | ✓ | - | [✓](clis/trustpilot.js) | - | [trustpilot.md](integrations/trustpilot.md) |
| g2 | Reviews | ✓ | - | [✓](clis/g2.js) | - | [g2.md](integrations/g2.md) |
| onesignal | Push | ✓ | - | [✓](clis/onesignal.js) | ✓ | [onesignal.md](integrations/onesignal.md) |
| demio | Webinar | ✓ | - | [✓](clis/demio.js) | - | [demio.md](integrations/demio.md) |
| livestorm | Webinar | ✓ | - | [✓](clis/livestorm.js) | - | [livestorm.md](integrations/livestorm.md) |
| shopify | Commerce | ✓ | - | ✓ | ✓ | [shopify.md](integrations/shopify.md) |
| wordpress | CMS | ✓ | - | ✓ | ✓ | [wordpress.md](integrations/wordpress.md) |
| webflow | CMS | ✓ | - | ✓ | ✓ | [webflow.md](integrations/webflow.md) |
| sanity | Headless CMS | ✓ | - | ✓ | ✓ | [sanity.md](integrations/sanity.md) |
| contentful | Headless CMS | ✓ | - | ✓ | ✓ | [contentful.md](integrations/contentful.md) |
| strapi | Headless CMS | ✓ | - | ✓ | ✓ | [strapi.md](integrations/strapi.md) |
| composio | Integration Layer | ✓ | ✓ | ✓ | ✓ | [composio.md](integrations/composio.md) |
| cogny | Integration Layer | - | ✓ | - | - | [cogny.md](integrations/cogny.md) |
| glasser | Integration Layer | ✓ | ✓ | ✓ | - | [glasser.md](integrations/glasser.md) |

---

## By Category

### Analytics

Track user behavior, measure conversions, and analyze marketing performance.

| Tool | Best For | MCP Available |
|------|----------|:-------------:|
| **ga4** | Web analytics, Google ecosystem | ✓ |
| **mixpanel** | Product analytics, event tracking | - |
| **amplitude** | Product analytics, cohort analysis | - |
| **posthog** | Open-source analytics, session replay | - |
| **segment** | Customer data platform, routing | - |
| **adobe-analytics** | Enterprise analytics | - |
| **plausible** | Privacy-focused analytics | - |

**Agent recommendation**: Start with GA4 if using Google ecosystem. Use Mixpanel or Amplitude for deeper product analytics. Plausible for privacy-focused sites.

### SEO

Search engine optimization tools for keyword research, rank tracking, and site audits.

| Tool | Best For | Notes |
|------|----------|-------|
| **google-search-console** | Free, authoritative search data | Direct from Google |
| **semrush** | Competitive analysis, keyword research | Comprehensive |
| **ahrefs** | Backlink analysis, content research | Best for links |
| **dataforseo** | SERP tracking, backlinks, on-page audits | Comprehensive API |
| **keywords-everywhere** | Quick keyword research, traffic estimates | Credit-based |
| **rankparse** | Cheap, agent-friendly backlinks + domain data | Credit-based, MCP available |

**Agent recommendation**: Google Search Console is essential (free). Add Semrush or Ahrefs for competitive research. DataForSEO for programmatic SERP data. Keywords Everywhere for quick keyword lookups. RankParse for agent workflows where per-call cost matters — backlinks, domain authority, and tech stack at a fraction of enterprise pricing.

### CRM

Customer relationship management and sales tools.

| Tool | Best For | CLI Available |
|------|----------|:-------------:|
| **hubspot** | SMB, marketing + sales alignment | ✓ |
| **salesforce** | Enterprise, complex sales processes | ✓ |
| **close** | SMB, high-velocity sales | [✓](clis/close.js) |
| **attio** | Startups and agencies, flexible objects and lists | API + hosted MCP |

**Agent recommendation**: HubSpot for startups/SMBs. Attio for startups and agencies that want a flexible CRM an agent can read and write. Close for high-velocity inside sales. Salesforce for enterprise.

### Payments

Payment processing and subscription management.

| Tool | Best For | MCP Available |
|------|----------|:-------------:|
| **stripe** | SaaS subscriptions, developer-friendly | ✓ |
| **paddle** | SaaS billing with tax handling | - |

**Agent recommendation**: Stripe is the default for SaaS. Paddle for built-in tax compliance.

### Referral & Affiliate

Tools for referral programs, affiliate tracking, and partner management.

| Tool | Best For | Stripe Integration |
|------|----------|:------------------:|
| **rewardful** | Stripe-native affiliate programs | ✓ |
| **tolt** | SaaS affiliate programs | ✓ |
| **mention-me** | Enterprise referral programs | ✓ |
| **dub-co** | Link tracking, attribution | - |
| **partnerstack** | Enterprise partner programs | ✓ |

**Agent recommendation**: Rewardful or Tolt for Stripe-based SaaS. PartnerStack for enterprise partner programs. Dub.co for link attribution.

### Email

Email marketing, transactional email, and automation platforms.

| Tool | Best For | MCP Available |
|------|----------|:-------------:|
| **mailchimp** | SMB email marketing | ✓ |
| **customer-io** | Behavior-based messaging | - |
| **sendgrid** | Transactional email at scale | - |
| **resend** | Developer-friendly transactional | ✓ |
| **sequenzy** | Lifecycle email, sequences, transactional email | ✓ |
| **kit** | Creator/newsletter focused | - |
| **beehiiv** | Newsletter platform | - |
| **klaviyo** | E-commerce email + SMS | - |
| **postmark** | Deliverability-focused transactional | - |
| **brevo** | Email + SMS, popular in EU | - |
| **activecampaign** | Email automation + CRM | - |

**Agent recommendation**: Resend for transactional (dev-friendly). Sequenzy for lifecycle email, sequences, and agent-driven email marketing. Postmark for deliverability. Customer.io for advanced automation. Kit for creators. Beehiiv for newsletters. Klaviyo for e-commerce email/SMS. ActiveCampaign for email + CRM combo.

### SMS / Messaging

SMS and MMS marketing platforms and programmable messaging APIs.

| Tool | Best For | MCP Available |
|------|----------|:-------------:|
| **klaviyo** | DTC ecom already on Klaviyo email | - |
| **postscript** | Shopify DTC, SMS-first depth | - |
| **attentive** | Mid-market+ DTC, full-service | - |
| **twilio** | Custom API builds, transactional, dev-first | - |
| **plivo** | Twilio alternative, lower per-send cost | - |
| **audiencetap** | DTC with AI-forward creative + on-pack QR opt-in | - |
| **brevo** | EU SMB email + SMS combo | - |
| **customer-io** | Behavior-based SMS automation | - |

**Agent recommendation**: Klaviyo SMS for ecom already on Klaviyo email. Postscript for Shopify-first depth. Attentive for mid-market+ wanting concierge support. Twilio (or Plivo for lower cost) for custom builds and transactional/auth. AudienceTap when AI creative or on-pack QR opt-in matters.

### Advertising

Paid advertising platforms and campaign management.

| Tool | Best For | MCP Available |
|------|----------|:-------------:|
| **google-ads** | Search intent, high-intent traffic | ✓ |
| **meta-ads** | Demand gen, visual products, B2C | - |
| **linkedin-ads** | B2B, job title targeting | - |
| **tiktok-ads** | Younger demographics, video | - |

**Agent recommendation**: Google Ads for search intent. Meta for demand generation. LinkedIn for B2B.

### Automation

Workflow automation and integration platforms.

| Tool | Best For | MCP Available |
|------|----------|:-------------:|
| **zapier** | No-code integrations + SDK for 8,000+ apps | ✓ |

**Agent recommendation**: Zapier SDK for agents that need to interact with any app directly. Zaps for always-on automations.

### CRO & A/B Testing

Conversion rate optimization, heatmaps, and experimentation.

| Tool | Best For | Notes |
|------|----------|-------|
| **hotjar** | Heatmaps, recordings, surveys | Visual behavior data |
| **optimizely** | A/B testing, feature flags | Enterprise experimentation |

**Agent recommendation**: Hotjar for understanding user behavior. Optimizely for running experiments.

### Scheduling

Booking and appointment scheduling tools.

| Tool | Best For | Notes |
|------|----------|-------|
| **calendly** | Meeting scheduling, lead gen | Most popular |
| **savvycal** | Personalized scheduling | Developer-friendly |

**Agent recommendation**: Calendly for general use. SavvyCal for personalized booking experiences.

### Forms & Surveys

Form builders and survey platforms.

| Tool | Best For | Notes |
|------|----------|-------|
| **typeform** | Interactive forms, surveys | Conversational UX |

**Agent recommendation**: Typeform for engaging forms and surveys.

### Messaging

In-app messaging, chat, and customer communication.

| Tool | Best For | Notes |
|------|----------|-------|
| **intercom** | In-app messaging, support, product tours | Full customer platform |

**Agent recommendation**: Intercom for in-app messaging and customer support.

### Social Media

Social media scheduling, management, and analytics.

| Tool | Best For | Notes |
|------|----------|-------|
| **buffer** | Social scheduling, analytics | Multi-platform |

**Agent recommendation**: Buffer for scheduling and analytics across social platforms.

### Video

Video hosting, creation, and AI generation.

| Tool | Best For | Notes |
|------|----------|-------|
| **wistia** | Video hosting, marketing analytics | Best for marketing video hosting |
| **heygen** | AI avatars, talking-head videos | MCP server available |
| **hyperframes** | Programmatic video from HTML/CSS | Open source, agent-native |

**Agent recommendation**: HeyGen for AI avatar videos (MCP-enabled). Hyperframes for templated, data-driven video from code. Wistia for hosting and analytics.

### Data Enrichment

Company and person data enrichment for sales and marketing.

| Tool | Best For | Notes |
|------|----------|-------|
| **clearbit** | Company/person enrichment (existing API keys only) | Now HubSpot Breeze Intelligence; no new standalone API keys; Logo API ended 2025-12-08 |
| **apollo** | B2B prospecting, email finding | Large database |
| **zoominfo** | B2B contacts, intent data | Enterprise-grade |
| **clay** | Waterfall enrichment, outbound | 75+ data providers |
| **fullenrich** | Waterfall email + mobile finding | Many providers per lookup; charges only on a hit; verify its catch-all results |
| **leadmagic** | Email finding, job changes, technographics, lookalikes | Credit-based API; charges only on a hit |

**Agent recommendation**: Apollo for prospecting and outbound. Clearbit only if you already hold a legacy API key (otherwise Breeze Intelligence inside HubSpot). ZoomInfo for enterprise B2B data with intent signals. Clay for waterfall enrichment across multiple providers.

### Email Verification

Pre-outreach email deliverability validation.

| Tool | Best For | Notes |
|------|----------|-------|
| **truelist** | Bulk + single email verification, catch-all resolution | Returns `email_state` (ok / email_invalid / accept_all / risky / unknown) + `email_sub_state`. Batches with webhook + CSV results, `enhanced` strategy for catch-alls. Hosted OAuth MCP, CLI, 7-language SDKs. |

**Agent recommendation**: Truelist for any prospect list before outreach — Apollo/ZoomInfo/Hunter data accuracy is typically 60–80%, validation is non-negotiable to keep sender reputation healthy.

### Developer Intent / GitHub

Discovery channel for dev-tool SaaS prospecting via GitHub stargazers, forkers, and watchers.

| Tool | Best For | Notes |
|------|----------|-------|
| **github** | Stargazers / forks / watchers of competitor or adjacent repos | Public API; pair with Apollo/Clay/Hunter for email enrichment |

**Agent recommendation**: Use `github-prospects.js` CLI to pull stargazers/forks of 3–5 anchor repos (competitors, category leaders, complementary tools). Filter to users with `company` field set, then enrich missing emails via Apollo or Hunter, then validate via Truelist before outreach.

### Site Scraping (single-target only)

Programmatic page extraction for **individual public business sites** — not for the platforms hosting prospects (Google Maps, LinkedIn, Yelp, Apollo, etc.).

| Tool | Best For | Notes |
|------|----------|-------|
| **firecrawl** | Page → clean markdown / structured extraction | API + MCP; lower overhead for "just give me the content" |
| **browserbase** | Real Chromium when rendering, interaction, or session state is required | API + MCP (Stagehand); use when Firecrawl can't handle the page |
| **apify** | Ready-made scrapers for public directories, marketplaces, job boards, and site crawls | API + hosted MCP; per-Actor pricing; never LinkedIn or Google Maps scrapers |

**Agent recommendation**: Default to Firecrawl for static-ish pages and structured extraction. Use Browserbase when the site requires JS rendering, form interaction, cookie consent, or auth — and when you want session recordings for debugging. **For both: discovery happens on platforms (manual browser); extraction happens on the prospect's own website URL.** Don't point either tool at LinkedIn, Google Maps, Yelp, or similar.

### Reviews

Review management and social proof platforms. For honest invitation programs, response triage, and permissioned testimonial reuse, use the referrals skill's [review programs reference](https://github.com/coreyhaines31/marketingskills/blob/main/skills/referrals/references/review-programs.md). Platform incentive and collection rules differ; consult its conditional policy reference before a campaign.

| Tool | Best For | Notes |
|------|----------|-------|
| **trustpilot** | Consumer business reviews | Most recognized |
| **g2** | Software/B2B reviews | Best for SaaS |

**Agent recommendation**: Trustpilot for consumer products. G2 for B2B software.

### Push Notifications

Push notification delivery platforms.

| Tool | Best For | Notes |
|------|----------|-------|
| **onesignal** | Multi-channel push notifications | Web + mobile |

**Agent recommendation**: OneSignal for web and mobile push notifications.

### Webinar

Webinar and virtual event platforms.

| Tool | Best For | Notes |
|------|----------|-------|
| **demio** | Marketing webinars | Simple, focused |
| **livestorm** | Video engagement, webinars | Full event platform |

**Agent recommendation**: Demio for marketing-focused webinars. Livestorm for full event engagement.

### Sales Engagement

Sales engagement and outreach automation platforms.

| Tool | Best For | Notes |
|------|----------|-------|
| **outreach** | Enterprise sales engagement | Sequences, tasks, analytics |

**Agent recommendation**: Outreach for enterprise sales teams managing multi-touch sequences at scale.

### LinkedIn Outreach

LinkedIn connection requests, messages, and inbox across sender accounts. All third-party LinkedIn automation breaks LinkedIn's User Agreement and risks account restrictions.

| Tool | Best For | Notes |
|------|----------|-------|
| **heyreach** | Multi-sender LinkedIn campaigns, email + LinkedIn with Instantly/Smartlead | API + official per-workspace MCP; LinkedIn removed its company page in March 2026 |

**Agent recommendation**: Use real, owned profiles only, keep each sender well under weekly connection limits, and stop LinkedIn steps when a prospect replies on any channel. Alternatives: lemlist and La Growth Machine (email + LinkedIn in one sequence), Expandi, Waalaxy, Unipile (API for builders).

### Product Analytics

Product analytics, feature adoption tracking, and in-app guidance.

| Tool | Best For | Notes |
|------|----------|-------|
| **pendo** | Feature adoption, in-app guides | Product-led growth |

**Agent recommendation**: Pendo for tracking feature adoption and delivering targeted in-app guidance.

### Competitive Intelligence

Traffic analytics, competitor benchmarking, and market research.

| Tool | Best For | Notes |
|------|----------|-------|
| **similarweb** | Website traffic, competitor analysis | Traffic sources, keywords |

**Agent recommendation**: Similarweb for competitor traffic analysis and market benchmarking.

### Audience Research

Audience intelligence and behavioral research tools.

| Tool | Best For | Notes |
|------|----------|-------|
| **sparktoro** | Audience affinities, behavioral data | Clickstream + social data |

**Agent recommendation**: SparkToro for discovering where your ICP spends time — what they read, watch, listen to, follow, and search for. Essential for customer research, content strategy, and media buying decisions.

### Visitor Identification

Website visitor de-anonymization for B2B sales and marketing.

| Tool | Best For | Notes |
|------|----------|-------|
| **rb2b** | Person-level visitor ID, intent signals | LinkedIn profiles, emails, page-level data |

**Agent recommendation**: RB2B for identifying anonymous B2B website visitors and routing high-intent visitors to outreach tools. Pairs well with Clay for enrichment and Instantly/Lemlist for cold email.

### Hiring & Tech Signals

Buying signals from job postings and technology adoption: who is hiring for a role you serve, and who uses (or just adopted) a relevant tool.

| Tool | Best For | Notes |
|------|----------|-------|
| **theirstack** | Companies hiring for a role; tech stack inferred from job postings | API + hosted MCP (OAuth or API key); webhooks for new postings |
| **leadmagic** | Job-change checks for past champions; per-company technographics and funding | Credit-based API + MCP |

**Agent recommendation**: Use hiring and tech signals to time and justify outreach, not as the whole list. Combine 2–3 signals with ICP fit, and act within days of a fresh signal.

### Revenue Intelligence

Sales conversation analytics, call recording, and deal intelligence.

| Tool | Best For | Notes |
|------|----------|-------|
| **gong** | Call recording, transcript analysis, deal insights | REST API, 10k API calls/day |

**Agent recommendation**: Gong for mining sales call transcripts for customer research, competitive intelligence, and coaching insights. Essential for revenue attribution and win/loss analysis.

### AI Content

AI-powered content generation and optimization platforms.

| Tool | Best For | Notes |
|------|----------|-------|
| **airops** | AI content workflows, SEO content | Flow-based automation |

**Agent recommendation**: AirOps for building AI content workflows that generate SEO-optimized content at scale.

### AI Search

AI-powered web search APIs built for LLMs and agents. Return structured results with on-demand text, highlights, and summaries.

| Tool | Best For | Notes |
|------|----------|-------|
| **exa** | Neural/semantic web search, content research, competitor discovery | Search + findSimilar + Contents; MCP and SDKs available |

**Agent recommendation**: Exa for neural search over the open web — content research, competitor/similar-page discovery, link prospecting, news monitoring, and audience research. Pairs well with seo-audit, content-strategy, and competitor-profiling skills.

### Partner Ecosystem

Partner data sharing, co-sell, and ecosystem management.

| Tool | Best For | Notes |
|------|----------|-------|
| **crossbeam** | Account overlaps, co-sell | Now part of Reveal |
| **introw** | Partner management, deal registration, QBRs | MCP-enabled PRM |

**Agent recommendation**: Crossbeam for identifying partner account overlaps and co-sell opportunities. Introw for full partner relationship management — partner pipeline, commissions, tasks, and automated business review prep.

### Email Outreach

Cold email outreach and email finding tools for link building and sales prospecting.

| Tool | Best For | Notes |
|------|----------|-------|
| **hunter** | Email finding, domain search | Largest email database |
| **snov** | Email finding, drip campaigns | Built-in sequences |
| **lemlist** | Cold email campaigns | Personalization features |
| **instantly** | Cold email at scale | Email warmup built-in |

**Agent recommendation**: Hunter for finding emails. Instantly for email-only cold campaigns at volume; lemlist when the sequence mixes email and LinkedIn. Snov for combined finding + outreach. Verify every list (Truelist) before upload, and send from secondary domains.

### Data Aggregation

Marketing data pipeline tools that connect multiple platforms for unified reporting.

| Tool | Best For | Notes |
|------|----------|-------|
| **supermetrics** | Cross-platform data pulling | 200+ connectors |
| **coupler** | Automated data flows to sheets/BI | Scheduled pipelines |

**Agent recommendation**: Supermetrics for pulling data from multiple marketing platforms into unified reports. Coupler.io for automated data flows to spreadsheets and BI tools.

### Commerce & CMS

E-commerce platforms and content management systems.

| Tool | Best For | CLI Available |
|------|----------|:-------------:|
| **shopify** | E-commerce, product sales | ✓ |
| **wordpress** | Blogs, content sites | ✓ |
| **webflow** | Design-focused marketing sites | ✓ |
| **sanity** | Headless CMS, structured content | ✓ |
| **contentful** | Enterprise headless CMS, multi-locale | ✓ |
| **strapi** | Open-source headless CMS, self-hosted | ✓ |

**Agent recommendation**: Shopify for e-commerce. Webflow for marketing sites. WordPress for blogs. For headless CMS: Sanity for developer-flexible content, Contentful for enterprise multi-locale, Strapi for self-hosted/budget-conscious. See [headless CMS guide](../skills/content-strategy/references/headless-cms.md) for selection criteria.

---

## CLI Tools

Zero-dependency, single-file Node.js CLIs for tools that don't ship their own. See [`clis/README.md`](clis/README.md) for install instructions and usage.

All CLIs follow a consistent pattern:
- **No dependencies** — Node 18+ only, uses native `fetch`
- **JSON output** — pipe to `jq`, save to file, or use in scripts
- **Env var auth** — set `{TOOL}_API_KEY` and go
- **Consistent commands** — `{tool} <resource> <action> [options]`

---

## MCP-Enabled Tools

These tools have Model Context Protocol servers available, enabling direct agent interaction:

- **ga4** - Google Analytics 4 data access
- **stripe** - Payment and subscription management
- **mailchimp** - Email campaign management
- **google-ads** - Ad campaign management
- **resend** - Transactional email sending
- **zapier** - Workflow automation + SDK for 8,000+ app integrations
- **zoominfo** - B2B contacts and intent data
- **clay** - Data enrichment and outbound automation
- **supermetrics** - Cross-platform marketing data
- **coupler** - Marketing data pipelines
- **outreach** - Sales engagement sequences
- **crossbeam** - Partner ecosystem data
- **introw** - Partner relationship management
- **exa** - AI-powered web search for LLMs and agents
- **apollo** - B2B prospecting, enrichment, and sequences
- **hubspot** - CRM read and write
- **attio** - CRM read and write (writes need confirmation)
- **close** - CRM and inside sales
- **instantly** - Cold email campaigns, leads, replies, and warmup
- **lemlist** - Email + LinkedIn sequences
- **heyreach** - LinkedIn outreach (per-workspace MCP key)
- **hunter** - Email finding and verification
- **truelist** - Email verification and batches
- **fullenrich** - Waterfall email and mobile enrichment
- **leadmagic** - Enrichment, job changes, technographics
- **theirstack** - Hiring and technographic signals
- **apify** - Ready-made scrapers (Actors)
- **firecrawl** - Page scraping and crawling
- **browserbase** - Cloud browser automation
- **calendly** - Availability and booking links

To use MCP tools, ensure the appropriate MCP server is configured in your environment. Most hosted servers sign in with per-user OAuth, which suits interactive sessions; for scheduled or unattended agent runs, use the tool's API key (with the CLI or API, or an MCP that accepts a key header). MCP status checked 2026-10-07.

### Composio Integration

[Composio](integrations/composio.md) provides managed OAuth and pre-built connectors for 500+ tools via a single MCP server. It adds MCP access to tools that don't have native MCP servers, including Salesforce, Meta Ads, LinkedIn Ads, Google Sheets, Slack, Notion, and more. (HubSpot now has its own official MCP server.)

- **Setup**: `npx @composio/mcp@latest setup`
- **Quick start**: See [tools/composio/README.md](composio/README.md)
- **Marketing tool mapping**: See [tools/composio/marketing-tools.md](composio/marketing-tools.md)

Use Composio when you need MCP access to OAuth-heavy tools. Prefer native MCP servers (GA4, Stripe, Mailchimp, etc.) when available — they have deeper coverage.

### Cogny Integration

[Cogny](integrations/cogny.md) is a hosted MCP gateway focused on marketing channels — one federated MCP URL with managed OAuth across every channel you've connected. Narrower than Composio (marketing-only) and useful when you want SEO, paid social, and privacy-friendly analytics behind a single MCP login.

- **Setup**: connect channels at [cogny.com](https://cogny.com), then in Claude.ai go to Settings → Connectors → Add custom connector and paste `https://app.cogny.com/mcp`
- **Channels**: Search Console, Bing Webmaster, Semrush, LinkedIn Ads, Reddit Ads, TikTok Ads, Plausible, Fathom
- **Pricing**: Solo plan starts at $9/mo (7-day trial)

Use Cogny when you only need marketing channels and want to avoid running your own OAuth proxy. Prefer native APIs when you need deep, custom control of a single tool.

### Glasser Integration

[Glasser](integrations/glasser.md) is a pay-per-call broker for paid data APIs — SEO metrics, SERP, web/news search, company and person enrichment, email finding, social scraping — under one key. Data APIs only; OAuth tools (GA4, ad platforms, CRMs) are not covered.

- **Setup**: `npm install -g @glasser-ai/cli && glasser login`, or MCP at `https://api.glasser.ai/mcp` with a Bearer key
- **Providers**: 20+ across SEO, search, enrichment, email finding, and scraping — DataForSEO, Ahrefs, Semrush, Serper, SerpApi, Exa, People Data Labs, Apollo, ZoomInfo, Hunter, ScrapeCreators, TikHub, Apify, Bright Data, and others (full list in the guide)
- **Pricing**: per call at the price each endpoint publishes; no subscription

Use Glasser for occasional lookups across several paid vendors when no accounts are set up. Prefer a vendor's own API when you already hold its key, and Google Search Console for your own site's search data.

---

## Quick Start by Use Case

### Setting up analytics tracking
1. Read [ga4.md](integrations/ga4.md) for web analytics
2. Read [segment.md](integrations/segment.md) if routing to multiple tools

### Launching a referral program
1. Read [rewardful.md](integrations/rewardful.md) or [tolt.md](integrations/tolt.md) for Stripe-based programs
2. Read [dub-co.md](integrations/dub-co.md) for link tracking

### Setting up email automation
1. Read [customer-io.md](integrations/customer-io.md) for behavior-based automation
2. Read [resend.md](integrations/resend.md) for transactional email

### Running sales outbound (list → signals → enrich → verify → send → LinkedIn → CRM)

Strategy, copy, cadence, and compliance live in the `prospecting` and `cold-email` skills; this is the tool chain. Pick one tool per job; alternatives are listed so no single vendor is required.

| Step | Job | Tools (alternatives) | Claude Code (CLI/API) | Hosted agent (MCP) |
|------|-----|----------------------|:---------------------:|:------------------:|
| 1 | Build the account list | [apollo](integrations/apollo.md), [zoominfo](integrations/zoominfo.md), [clay](integrations/clay.md), [exa](integrations/exa.md) (lookalikes), [leadmagic](integrations/leadmagic.md) (lookalikes), [apify](integrations/apify.md) (public directories) | ✓ | ✓ |
| 2 | Add buying signals | [theirstack](integrations/theirstack.md) (hiring, tech), [leadmagic](integrations/leadmagic.md) (job changes), [rb2b](integrations/rb2b.md) (site visitors), [github](integrations/github.md) (dev intent) | ✓ | ✓ (rb2b via Zapier) |
| 3 | Find contacts and emails | [apollo](integrations/apollo.md), [fullenrich](integrations/fullenrich.md) (waterfall), [leadmagic](integrations/leadmagic.md), [hunter](integrations/hunter.md), [clay](integrations/clay.md) | ✓ | ✓ |
| 4 | Verify before sending | [truelist](integrations/truelist.md) (catch-all resolution) | ✓ | ✓ |
| 5 | Send email sequences | [instantly](integrations/instantly.md), [lemlist](integrations/lemlist.md), [outreach](integrations/outreach.md) (enterprise) | ✓ | ✓ |
| 6 | LinkedIn steps | [heyreach](integrations/heyreach.md), [lemlist](integrations/lemlist.md) (email + LinkedIn) | API | ✓ |
| 7 | Book meetings | [calendly](integrations/calendly.md), [savvycal](integrations/savvycal.md) | ✓ | ✓ (calendly) |
| 8 | Log in the CRM | [hubspot](integrations/hubspot.md), [attio](integrations/attio.md), [close](integrations/close.md), [salesforce](integrations/salesforce.md) | ✓ | ✓ (salesforce via [composio](integrations/composio.md)) |
| 9 | Retarget target accounts | [linkedin-ads](integrations/linkedin-ads.md) (Matched Audiences) | ✓ | via composio |

**Rules that apply to every run:**
- **Verify every list before it reaches a sender** (step 4), and re-verify anything older than 30–60 days. Keep hard bounces under 2%.
- **One suppression list across tools**: customers, open deals, opt-outs from any channel, and past bounces, synced to every sender's blocklist.
- **A reply on any channel stops every channel** (email, LinkedIn, calls) for that person.
- **No LinkedIn scraping** with logged-in accounts, cookies, or fake profiles, and no Google Maps scrapers.
- **Hosted MCPs mostly sign in with per-user OAuth**, which suits interactive sessions with a human approving writes. Scheduled or unattended runs (a nightly signal sweep, reply triage) should use API keys through the CLIs or APIs, or MCPs that accept a key header (Instantly, Apollo, lemlist, Hunter, TheirStack, Firecrawl).
- **Stage outward-facing actions for approval** until the workflow has a track record: new campaigns, first sends to a segment, and CRM writes.

### Running email outreach for backlinks
1. Read [hunter.md](integrations/hunter.md) for finding emails
2. Read [lemlist.md](integrations/lemlist.md) or [instantly.md](integrations/instantly.md) for sending campaigns

### Running paid ads
1. Read [google-ads.md](integrations/google-ads.md) for search campaigns
2. Read [meta-ads.md](integrations/meta-ads.md) for social campaigns
