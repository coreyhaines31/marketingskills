# Marketing Tools Registry

Quick reference for AI agents to discover tool capabilities and integration methods.

## How to Use This Registry

1. **Find tools by category** - Browse sections below for tools in each domain
2. **Check integration methods** - See what APIs, MCPs, CLIs, or SDKs are available
3. **Read integration guides** - Detailed setup and common operations in `integrations/`

---

## Tool Index

| Tool | Category | API | MCP | CLI | SDK | Guide |
|------|----------|:---:|:---:|:---:|:---:|-------|
| ga4 | Analytics | ✓ | ✓ | - | ✓ | [ga4.md](integrations/ga4.md) |
| mixpanel | Analytics | ✓ | - | - | ✓ | [mixpanel.md](integrations/mixpanel.md) |
| amplitude | Analytics | ✓ | - | - | ✓ | [amplitude.md](integrations/amplitude.md) |
| posthog | Analytics | ✓ | - | ✓ | ✓ | [posthog.md](integrations/posthog.md) |
| segment | Analytics | ✓ | - | - | ✓ | [segment.md](integrations/segment.md) |
| adobe-analytics | Analytics | ✓ | - | - | ✓ | [adobe-analytics.md](integrations/adobe-analytics.md) |
| google-search-console | SEO | ✓ | - | - | ✓ | [google-search-console.md](integrations/google-search-console.md) |
| semrush | SEO | ✓ | - | - | - | [semrush.md](integrations/semrush.md) |
| ahrefs | SEO | ✓ | - | - | - | [ahrefs.md](integrations/ahrefs.md) |
| hubspot | CRM | ✓ | - | ✓ | ✓ | [hubspot.md](integrations/hubspot.md) |
| salesforce | CRM | ✓ | - | ✓ | ✓ | [salesforce.md](integrations/salesforce.md) |
| stripe | Payments | ✓ | ✓ | ✓ | ✓ | [stripe.md](integrations/stripe.md) |
| rewardful | Referral | ✓ | - | - | - | [rewardful.md](integrations/rewardful.md) |
| tolt | Referral | ✓ | - | - | - | [tolt.md](integrations/tolt.md) |
| dub-co | Links | ✓ | - | - | ✓ | [dub-co.md](integrations/dub-co.md) |
| mention-me | Referral | ✓ | - | - | - | [mention-me.md](integrations/mention-me.md) |
| mailchimp | Email | ✓ | ✓ | - | ✓ | [mailchimp.md](integrations/mailchimp.md) |
| customer-io | Email | ✓ | - | - | ✓ | [customer-io.md](integrations/customer-io.md) |
| sendgrid | Email | ✓ | - | - | ✓ | [sendgrid.md](integrations/sendgrid.md) |
| resend | Email | ✓ | ✓ | - | ✓ | [resend.md](integrations/resend.md) |
| kit | Email | ✓ | - | - | ✓ | [kit.md](integrations/kit.md) |
| google-ads | Ads | ✓ | ✓ | - | ✓ | [google-ads.md](integrations/google-ads.md) |
| meta-ads | Ads | ✓ | - | - | ✓ | [meta-ads.md](integrations/meta-ads.md) |
| linkedin-ads | Ads | ✓ | - | - | - | [linkedin-ads.md](integrations/linkedin-ads.md) |
| tiktok-ads | Ads | ✓ | - | - | ✓ | [tiktok-ads.md](integrations/tiktok-ads.md) |
| zapier | Automation | ✓ | ✓ | - | - | [zapier.md](integrations/zapier.md) |
| shopify | Commerce | ✓ | - | ✓ | ✓ | [shopify.md](integrations/shopify.md) |
| wordpress | CMS | ✓ | - | ✓ | ✓ | [wordpress.md](integrations/wordpress.md) |
| webflow | CMS | ✓ | - | ✓ | ✓ | [webflow.md](integrations/webflow.md) |

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

**Agent recommendation**: Start with GA4 if using Google ecosystem. Use Mixpanel or Amplitude for deeper product analytics.

### SEO

Search engine optimization tools for keyword research, rank tracking, and site audits.

| Tool | Best For | Notes |
|------|----------|-------|
| **google-search-console** | Free, authoritative search data | Direct from Google |
| **semrush** | Competitive analysis, keyword research | Comprehensive |
| **ahrefs** | Backlink analysis, content research | Best for links |

**Agent recommendation**: Google Search Console is essential (free). Add Semrush or Ahrefs for competitive research.

### CRM

Customer relationship management and sales tools.

| Tool | Best For | CLI Available |
|------|----------|:-------------:|
| **hubspot** | SMB, marketing + sales alignment | ✓ |
| **salesforce** | Enterprise, complex sales processes | ✓ |

**Agent recommendation**: HubSpot for startups/SMBs, Salesforce for enterprise.

### Payments

Payment processing and subscription management.

| Tool | Best For | MCP Available |
|------|----------|:-------------:|
| **stripe** | SaaS subscriptions, developer-friendly | ✓ |

**Agent recommendation**: Stripe is the default for SaaS and developer-focused products.

### Referral & Affiliate

Tools for referral programs, affiliate tracking, and partner management.

| Tool | Best For | Stripe Integration |
|------|----------|:------------------:|
| **rewardful** | Stripe-native affiliate programs | ✓ |
| **tolt** | SaaS affiliate programs | ✓ |
| **mention-me** | Enterprise referral programs | ✓ |
| **dub-co** | Link tracking, attribution | - |

**Agent recommendation**: Rewardful or Tolt for Stripe-based SaaS. Dub.co for link attribution.

### Email

Email marketing, transactional email, and automation platforms.

| Tool | Best For | MCP Available |
|------|----------|:-------------:|
| **mailchimp** | SMB email marketing | ✓ |
| **customer-io** | Behavior-based messaging | - |
| **sendgrid** | Transactional email at scale | - |
| **resend** | Developer-friendly transactional | ✓ |
| **kit** | Creator/newsletter focused | - |

**Agent recommendation**: Resend for transactional (dev-friendly). Customer.io for advanced automation. Kit for creators.

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
| **zapier** | No-code integrations | ✓ |

**Agent recommendation**: Zapier for connecting tools without code.

### Commerce & CMS

E-commerce platforms and content management systems.

| Tool | Best For | CLI Available |
|------|----------|:-------------:|
| **shopify** | E-commerce, product sales | ✓ |
| **wordpress** | Blogs, content sites | ✓ |
| **webflow** | Design-focused marketing sites | ✓ |

**Agent recommendation**: Shopify for e-commerce. Webflow for marketing sites. WordPress for blogs.

---

## MCP-Enabled Tools

These tools have Model Context Protocol servers available, enabling direct agent interaction:

- **ga4** - Google Analytics 4 data access
- **stripe** - Payment and subscription management
- **mailchimp** - Email campaign management
- **google-ads** - Ad campaign management
- **resend** - Transactional email sending
- **zapier** - Workflow automation

To use MCP tools, ensure the appropriate MCP server is configured in your environment.

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

### Running paid ads
1. Read [google-ads.md](integrations/google-ads.md) for search campaigns
2. Read [meta-ads.md](integrations/meta-ads.md) for social campaigns
