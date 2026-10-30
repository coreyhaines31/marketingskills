# AgentaOS

Merchant of record for SaaS, digital products and services: card payments and subscriptions, VAT, sales tax and invoices handled, payouts to local bank accounts in 85 countries, including several Stripe does not serve. Individuals and companies can sell.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | REST API for payment links, checkouts, subscriptions, invoices |
| MCP | ✓ | Hosted server at `https://mcp.agentaos.ai/mcp` (OAuth, no key), or local `npx -y agentaos` |
| CLI | ✓ | `agenta` (npm package `agentaos`) |
| SDK | ✓ | Node.js / TypeScript (`@agentaos/pay`) |

## Authentication

- **Type**: API key
- **Header**: `x-api-key: {secret_key}`
- **Get key**: AgentaOS dashboard > Developers > API keys
- **Base URL**: `https://api.agentaos.ai/api/v1`
- **Test vs live**: the key prefix selects the mode. `sk_test_` keys use test data only; `sk_live_` keys move real money and need a verified business. Test and live data are separate.

## Common Agent Operations

### Create a product (payment link)

AgentaOS calls a product a payment link. Amounts are in currency units, not cents.

```bash
POST https://api.agentaos.ai/api/v1/gateway/payment-links

{
  "amount": 29,
  "currency": "EUR",
  "name": "Pro Plan",
  "description": "Monthly access to Pro features",
  "type": "subscription",
  "billingInterval": "month",
  "trialPeriodDays": 14
}
```

### List products

```bash
GET https://api.agentaos.ai/api/v1/gateway/payment-links
```

### Create a checkout

Create it from a payment link (`linkId`) or from an `amount`. Send the buyer to the returned `checkoutUrl`.

```bash
POST https://api.agentaos.ai/api/v1/gateway/sessions

{
  "linkId": "2f0c...uuid",
  "buyerEmail": "buyer@example.com",
  "successUrl": "https://example.com/success",
  "cancelUrl": "https://example.com/pricing",
  "metadata": { "userId": "u_123" }
}
```

An `Idempotency-Key` header is supported.

### Retrieve a checkout

```bash
GET https://api.agentaos.ai/api/v1/gateway/sessions/{sessionId}
```

### List subscriptions

```bash
GET https://api.agentaos.ai/api/v1/gateway/subscriptions?limit=20&offset=0
```

### Cancel a subscription

```bash
POST https://api.agentaos.ai/api/v1/gateway/subscriptions/{id}/cancel
```

### Preview and apply a plan change

```bash
GET https://api.agentaos.ai/api/v1/gateway/subscriptions/{id}/plan-change/preview
POST https://api.agentaos.ai/api/v1/gateway/subscriptions/{id}/plan-change
```

### Resume a canceled subscription (before period end)

```bash
POST https://api.agentaos.ai/api/v1/gateway/subscriptions/{id}/resume
```

### List a subscription's invoices

```bash
GET https://api.agentaos.ai/api/v1/gateway/subscriptions/{id}/invoices
```

## Webhooks

- **Signature header**: `x-agentaos-signature` (HMAC-SHA256). Verify with `agentaos.webhooks.verify()` from `@agentaos/pay` before trusting a payload.
- **Events**: `checkout.session.completed`, `subscription.created`, `subscription.renewed`, `subscription.updated`, `subscription.payment_failed`, `subscription.canceled`, `dispute.created`, `dispute.closed`, `webhook.test`.

## Key Metrics

- `status` (checkout) - `open`, `completed`, `expired`, `cancelled`
- `environment` - `test` or `live`
- `current_period_end` (subscription webhook data) - When the current period ends
- `amount` in webhook `data` - Sent as a string

## Parameters

### Payment link
- `type` - `one_time` (default) or `subscription`
- `billingInterval` - `month` or `year` (required for subscriptions)
- `trialPeriodDays` - 1 to 730, subscriptions only
- `currency` - `EUR`, `USD` (defaults to the account's settlement currency)

### Pagination
- `limit` - Default 20, max 100
- `offset` - Default 0

## When to Use

- Selling SaaS, digital products or services worldwide without registering for VAT and sales tax in each country
- Founders based in countries where Stripe or PayPal is not available, or selling without a registered company
- Letting an AI agent create products and checkouts and read subscriptions over MCP
- Compare with **stripe** (processor: you stay the seller and handle tax) and **paddle** (merchant of record) for the same jobs

## Pricing

- 4.5% + EUR 0.50 per card sale, no monthly fee; Pro plan EUR 49 a month with 4% + EUR 0.40 ([pricing](https://agentaos.ai/pricing))

## Rate Limits

- 60 requests per 60 seconds per endpoint, per client IP
- `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset` headers
- HTTP 429 with `Retry-After` when exceeded

## Relevant Skills

- pricing
- paywalls
- churn-prevention
- launch
