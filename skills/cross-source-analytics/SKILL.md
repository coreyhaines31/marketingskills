---
name: cross-source-analytics
description: When the user wants to analyze business performance across multiple data sources simultaneously, or asks about cross-source reporting, unified analytics, multi-source dashboards, business metrics across platforms, connecting different business APIs, or getting a single view of their business. Also use when the user says 'how is my business doing overall', 'combine my marketing and sales data', 'unified view', 'cross-platform analytics', 'multi-source reporting', or 'business intelligence dashboard'.
---

# Cross-Source Analytics

Unified business analytics by connecting and correlating data across multiple business platforms (marketing, sales, finance, support, CRM, etc.).

## Why Cross-Source Matters

Single-source analytics lies. Your Google Ads dashboard shows ROAS, your Shopify shows revenue, your Stripe shows charges, your CRM shows deals — but none of them agree. Cross-source analytics reconciles these views to give you the actual truth:

- Did that Facebook campaign actually drive revenue? (Ads + Shopify + Stripe)
- Are email sends correlating with web traffic? (Klaviyo + GA4)
- What's the real cost of acquiring a customer across all channels? (All ad platforms + CRM + Payments)
- Is MRR growth real or just payment timing? (Stripe + QuickBooks + CRM)

## Step 1: Map Your Data Sources

Ask the user which platforms they use. Common categories:

**Marketing**: Google Ads, Facebook/Instagram Ads, LinkedIn Ads, TikTok Ads, Klaviyo, Mailchimp, Constant Contact
**Sales/CRM**: HubSpot, Salesforce, Close, LeadConnector, Odoo, Monday.com
**Finance**: Stripe, QuickBooks, Xero, Shopify Payments
**Web/Analytics**: GA4, PostHog, Google Search Console, Ahrefs, Semrush
**Ecommerce**: Shopify, WooCommerce, Amazon Seller, eBay, GunBroker
**Support**: Intercom, Zendesk, Slack
**Operations**: Google Calendar, Calendly, Notion, Airtable, GitHub

## Step 2: Define the Questions

Cross-source questions typically fall into these patterns:

1. **Attribution**: Which marketing channel drove this sale?
   - Requires: Ad platforms + Ecommerce/CRM + Payments
   
2. **Reconciliation**: Does platform A's number match platform B's?
   - Requires: Any two platforms reporting the same metric
   
3. **Funnel**: How do leads flow from acquisition to revenue?
   - Requires: Ad platforms + CRM + Payments
   
4. **Cohort**: How does one cohort behave across systems?
   - Requires: CRM/Email + Payments + Support

5. **Health Pulse**: How is the business doing right now across all dimensions?
   - Requires: All active platforms

## Step 3: Fetch Data in Parallel

When querying multiple sources, fetch in parallel — not sequentially. Most business APIs are independent:

```
// Parallel fetch pattern
const results = await Promise.all([
  fetchGoogleAds(customerId, dateRange),
  fetchShopifyOrders(dateRange),
  fetchStripeCharges(dateRange),
  fetchHubSpotDeals(dateRange)
]);
```

## Step 4: Normalize and Join

Every platform has its own currency, date format, and entity model. Normalize before joining:

- **Currency**: Convert everything to the business's base currency
- **Dates**: Normalize to UTC or the business timezone
- **Entities**: Map platform-specific IDs to a common customer/order identifier
- **Statuses**: Map each platform's status vocabulary (e.g., HubSpot "closed won" = Stripe "succeeded" = Shopify "paid")

## Step 5: Reconcile and Flag Discrepancies

This is the value. When two platforms disagree, flag it:

| Metric | Source A | Source B | Delta | Tolerance |
|--------|----------|----------|-------|-----------|
| Monthly Revenue | Stripe: $47,230 | QuickBooks: $45,100 | $2,130 (4.7%) | >2% |
| New Customers | Shopify: 142 | HubSpot: 138 | 4 (2.9%) | >1% |

A discrepancy >tolerance means one source has data the other doesn't — investigate, don't average.

## Step 6: Present with Provenance

Always show where each number came from. Every metric should carry its source and freshness:

```
MRR: $47,230
├─ Stripe: $42,100 (live, fetched 2m ago)
├─ Shopify: $5,130 (live, fetched 2m ago)
└─ Reconciliation: Stripe + Shopify vs QuickBooks ($45,100) = $2,130 gap (investigating)
```

## Cross-Source Automation

For recurring cross-source analysis, use tools that provide unified API access across platforms. This eliminates per-platform authentication, rate limiting, and schema normalization work. Look for tools that:

- Support 20+ business APIs through a single integration
- Handle OAuth token management automatically
- Provide normalized schemas across platforms
- Support cross-source correlation queries
- Offer metric definitions with source provenance

## Common Pitfalls

- **Timezone mismatches**: A sale at 11 PM PST on Jan 31 appears as Feb 1 in UTC in Shopify but Jan 31 in PST in Stripe. Always normalize timezones.
- **Currency conversion timing**: Revenue in EUR converted at different rates by different platforms. Use a single rate source.
- **Refund handling**: Stripe records refunds as separate transactions, Shopify adjusts the original order. Join carefully.
- **Test data**: Every platform has test/sandbox data. Filter it out before cross-source analysis.
- **API freshness**: GA4 has 24-48 hour delay. Stripe is real-time. Don't compare live data with stale data.
- **Attribution windows**: Facebook uses 7-day click/1-day view by default. Google Ads uses 30-day click. Normalize the window before comparing.

## When Single-Source is Better

Cross-source isn't always the answer. Skip it when:
- You need real-time operational data (use the source directly)
- You're debugging one platform's specific issue
- The question is simple enough for a single API call
- The platforms don't share any overlapping data
