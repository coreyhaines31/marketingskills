# Tolt

Affiliate program management for SaaS, with Stripe and Paddle integration.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | REST API for partners, customers, commissions |
| MCP | - | Not available |
| CLI | ✓ | [tolt.js](../clis/tolt.js) |
| SDK | - | JavaScript snippet for tracking |

## Authentication

- **Type**: API Key
- **Header**: `Authorization: Bearer {api_key}`
- **Get key**: Settings > API in Tolt dashboard

## Current Public API

The API base is `https://api.tolt.com/v1`, with `partners`, `customers`, and
`commissions` resources. The CLI keeps `affiliates` as an alias for `partners`
and `referrals` as an alias for `customers`.

### List partners, customers, or commissions

```bash
node tools/clis/tolt.js partners list --program-id prg_example
node tools/clis/tolt.js customers list --program-id prg_example --partner-id part_example
node tools/clis/tolt.js commissions list --program-id prg_example --partner-id part_example
```

These list operations require `program_id`. `--affiliate-id` remains an alias
for the `--partner-id` filter. Use `--limit`, `--starting-after`, or
`--ending-before` to page through results. Cursors are the returned record IDs.

### Create or update a partner

```bash
node tools/clis/tolt.js partners create --program-id prg_example --email jane@example.com --first-name Jane --last-name Doe
node tools/clis/tolt.js partners update --id part_example --payout-method paypal --paypal-email jane@example.com
```

Creation requires email, first name, last name, and program ID. Update uses
`PUT /partners/{id}` and puts the payout email inside `payout_details`.
Use explicit first/last names instead of the old ambiguous `--name` input.

### Retrieve a record

```bash
node tools/clis/tolt.js partners get part_example
node tools/clis/tolt.js customers get --id cust_example
```

Customer retrieval uses the Tolt customer record ID, not an external billing
customer ID. The old `--customer-id` lookup returns a migration error rather
than silently treating a Stripe/customer reference as a Tolt record ID.

### Migration limits

The current public reference does not document payout-history retrieval or
`commission_rate` as a partner update field. Those old commands/options return
an actionable error directing users to the dashboard rather than issuing an
undocumented request. `--dry-run` previews the request without sending it.

Primary contracts: [partners list](https://docs.tolt.com/partners/list),
[create](https://docs.tolt.com/partners/create), [update](https://docs.tolt.com/partners/update),
[customers list](https://docs.tolt.com/customers/list),
[retrieve](https://docs.tolt.com/customers/retrieve), and
[commissions list](https://docs.tolt.com/commissions/list).

## JavaScript Tracking

### Install snippet

```html
<script src="https://cdn.tolt.io/tolt.js" data-tolt="YOUR_PUBLIC_KEY"></script>
```

### Track signup

```javascript
window.tolt.signup(stripeCustomerId);
```

### Identify existing customer

```javascript
window.tolt.identify(stripeCustomerId);
```

## Webhook Events

| Event | When |
|-------|------|
| `affiliate.created` | New affiliate registered |
| `affiliate.approved` | Affiliate approved |
| `referral.created` | New referral tracked |
| `referral.converted` | Referral converted to customer |
| `commission.created` | Commission earned |
| `payout.completed` | Payout sent |

## Key Features

- **Stripe native** - Automatic commission tracking
- **Paddle support** - Works with Paddle billing
- **Affiliate dashboard** - White-labeled portal
- **Payout automation** - PayPal and Wise payouts
- **Custom commission tiers** - Different rates per affiliate

## Key Objects

- **Affiliate** - Partner in your program
- **Referral** - Tracked conversion
- **Commission** - Earned affiliate payment
- **Payout** - Processed payment to affiliate
- **Program** - Campaign configuration

## When to Use

- Setting up SaaS affiliate programs
- Managing affiliate relationships
- Tracking Stripe or Paddle-based referrals
- Processing affiliate payouts
- Building affiliate dashboards

## Rate Limits

- 100 requests per minute
- Higher limits on enterprise plans

## Relevant Skills

- referrals
- pricing
