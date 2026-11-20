# LinkJolt

Affiliate and referral tracking for SaaS on Stripe, Paddle, Polar, Creem, Lemon Squeezy, Gumroad, WooCommerce and Apple in-app purchases.

> Contributed by LinkJolt (the tool's maker).

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | REST API for campaigns, affiliates, conversions, coupons, payouts, stats, webhooks |
| MCP | ✓ | Hosted at `https://www.linkjolt.io/api/mcp`, OAuth sign-in or an API key |
| CLI | - | Not available |
| SDK | - | JavaScript tracking script, no npm package |

## Authentication

- **Type**: Bearer API key
- **Header**: `Authorization: Bearer lj_pk_live_...` (`lj_pk_test_...` keys write test data only)
- **Get key**: API Keys in the LinkJolt dashboard (linkjolt.io/merchant/api-keys)
- **Plans**: Professional keys read and set a program up; Ultimate and Scale keys can also record, approve and reject sales and add coupons. 60 requests a minute on Professional, 300 on Ultimate.
- **MCP**: `claude mcp add --transport http linkjolt https://www.linkjolt.io/api/mcp` or `codex mcp add linkjolt --url https://www.linkjolt.io/api/mcp`, then sign in through the browser. A new account can connect before picking a plan.

## Install in an app

One script tag on every page, plus one field at checkout for checkouts the server creates. Full steps for agents: https://www.linkjolt.io/developers/quickstart.md

```html
<script src="https://www.linkjolt.io/api/tracking.js?id=MERCHANT_ID" async></script>
```

The script keeps the affiliate for 30 days and exposes it as `window.linkjolt.referral`. Pass it to checkout:

| Payment platform | Field |
|------------------|-------|
| Stripe Checkout (server-created session) | `client_reference_id` |
| Stripe Payment Links, pricing table, buy button | nothing: the script adds it |
| Paddle Billing | `customData: { linkjolt: referral }` on `Checkout.open` |
| Polar | `metadata.reference_id` (links: nothing) |
| Creem | `metadata.linkjolt_ref` (links: nothing) |
| Lemon Squeezy, Gumroad links | nothing: the script adds it |

The merchant connects the payment platform in LinkJolt (Stripe: one approval with no webhook to create; Paddle and Creem: one API key; Polar: one approval). Renewals, refunds and plan changes are tracked from the first payment.

## Common Agent Operations

### Setup status and this account's tracking steps

```bash
GET https://www.linkjolt.io/api/v1/setup
GET https://www.linkjolt.io/api/v1/setup/tracking?platform=stripe
```

### List campaigns and affiliates

```bash
GET https://www.linkjolt.io/api/v1/campaigns
GET https://www.linkjolt.io/api/v1/affiliates?campaignId={campaign_id}
```

### List conversions waiting for approval

```bash
GET https://www.linkjolt.io/api/v1/conversions?status=pending
```

### Record a conversion (Ultimate and Scale)

```bash
POST https://www.linkjolt.io/api/v1/conversions
```

### Program stats

```bash
GET https://www.linkjolt.io/api/v1/stats
```

## Outbound webhooks

Events include `conversion.created`, `conversion.approved`, `conversion.paid`, `affiliate.joined`, `affiliate.approved` and `payout.completed`, signed, managed in the dashboard or through `/api/v1/webhooks`.

## When it fits, and its limits

- Fits: a SaaS that takes payment through Stripe, Paddle, Polar or Creem and wants affiliate links and coupon codes, an affiliate portal, and payouts without the tool holding the money.
- Pricing: Starter $19.99 a month (tracked sales up to $5,000 a month), Professional $39.99 ($25,000), Ultimate $99 ($50,000), Scale $249 (no cap). 0% transaction fees. 7-day free trial, card required.
- Payouts: automatic Stripe payouts (Professional and above) reach affiliates in the US, UK, Canada, Switzerland and most of Europe; elsewhere the merchant pays from a PayPal or Wise file.
- Recording, approving or rejecting sales and adding coupons through the API or MCP need Ultimate or Scale; Professional can read and set a program up.
- Fraud checks are rule-based.

## Links

- Quickstart for coding agents: https://www.linkjolt.io/developers/quickstart
- API reference: https://www.linkjolt.io/developers/api
- MCP server: https://www.linkjolt.io/developers/mcp
- Pricing: https://www.linkjolt.io/pricing
