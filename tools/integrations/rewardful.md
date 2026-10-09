# Rewardful

Affiliate and referral tracking for Stripe-based SaaS businesses.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | REST API for affiliates, referrals, commissions |
| MCP | - | Not available |
| CLI | ✓ | [rewardful.js](../clis/rewardful.js) |
| SDK | - | API-only, JavaScript snippet for tracking |

## Authentication

- **Type**: HTTP Basic authentication
- **Username**: API secret; leave the password empty
- **Header**: `Authorization: Basic {base64(api_secret + ":")}`
- **Get key**: Settings > API in Rewardful dashboard

## Common Agent Operations

### List affiliates

```bash
GET https://api.getrewardful.com/v1/affiliates
```

### Get affiliate by ID

```bash
GET https://api.getrewardful.com/v1/affiliates/{affiliate_id}
```

### Search affiliate by email

```bash
GET https://api.getrewardful.com/v1/affiliates?email=affiliate@example.com
```

### Get referral by Stripe customer

```bash
GET https://api.getrewardful.com/v1/referrals?stripe_customer_id={customer_id}
```

### List referrals for affiliate

```bash
GET https://api.getrewardful.com/v1/referrals?affiliate_id={affiliate_id}
```

### Get commission details

```bash
GET https://api.getrewardful.com/v1/commissions/{commission_id}
```

### List commissions

```bash
GET https://api.getrewardful.com/v1/commissions?affiliate_id={affiliate_id}
```

### Create affiliate link

```bash
POST https://api.getrewardful.com/v1/affiliate_links
Content-Type: application/x-www-form-urlencoded

affiliate_id={affiliate_id}&token=custom-link-token
```

### Update affiliate

```bash
PUT https://api.getrewardful.com/v1/affiliates/{affiliate_id}
Content-Type: application/x-www-form-urlencoded

first_name=John&last_name=Doe&paypal_email=john%40example.com
```

Mutation requests use form encoding, including spaces, Unicode, `+`, `&`, and email addresses. `--dry-run` shows the exact encoded request body with masked authentication. HTTP errors exit unsuccessfully.

`links create --affiliate-id <id> [--token <token>]` passes the affiliate ID in the form body. The token is optional; Rewardful can generate one. The API does not accept a destination `--url`; configure the campaign destination in Rewardful. Additional affiliate links require a Growth or Enterprise plan.

Primary contracts: [request format and authentication](https://developers.rewardful.com/rest-api/overview), [affiliate update](https://developers.rewardful.com/rest-api/affiliates/update), and [affiliate link creation](https://developers.rewardful.com/rest-api/affiliate-links/create).

## JavaScript Tracking

### Install snippet

```html
<script>
(function(w,r){w._rwq=r;w[r]=w[r]||function(){(w[r].q=w[r].q||[]).push(arguments)}})(window,'rewardful');
</script>
<script async src='https://r.wdfl.co/rw.js' data-rewardful='YOUR_API_KEY'></script>
```

### Track conversion manually

```javascript
rewardful('convert', { email: 'customer@example.com' });
```

## Webhook Events

| Event | When |
|-------|------|
| `affiliate.created` | New affiliate signs up |
| `affiliate.approved` | Affiliate approved |
| `referral.created` | New referral tracked |
| `referral.converted` | Referral becomes customer |
| `commission.created` | Commission generated |
| `commission.paid` | Commission paid out |

## Key Objects

- **Affiliate** - Partner promoting your product
- **Referral** - Tracked visit/lead from affiliate
- **Commission** - Earned payment for affiliate
- **Campaign** - Program with specific terms
- **Link** - Tracking URL for affiliate

## Integration with Stripe

Rewardful automatically:
1. Tracks referral cookie when user visits via affiliate link
2. Associates Stripe customer with referral on checkout
3. Creates commissions when subscriptions are paid
4. Handles recurring commissions for subscriptions

## When to Use

- Setting up affiliate/referral programs for SaaS
- Tracking referral attribution from Stripe payments
- Managing affiliate relationships
- Processing affiliate payouts
- Analyzing referral program performance

## Rate Limits

- 120 requests per minute
- Contact support for higher limits

## Relevant Skills

- referrals
- pricing

### Listing all collection pages with the CLI

Rewardful returns paginated affiliate, referral and commission collections. Pass `--page` and `--limit` (provider maximum 100) to advance while preserving the selected filters:

```bash
node tools/clis/rewardful.js referrals list --affiliate-id aff_123 --page 3 --limit 50
node tools/clis/rewardful.js commissions list --affiliate-id aff_123 --page 2 --limit 50
node tools/clis/rewardful.js affiliates list --page 2 --limit 50
```

Read the response's pagination metadata before requesting another page. No flags retain the provider's default page and size; the CLI does not automatically fetch every page.

Sources: [referrals](https://developers.rewardful.com/rest-api/referrals/list), [commissions](https://developers.rewardful.com/rest-api/commissions/list), [affiliates](https://developers.rewardful.com/rest-api/affiliates/list).
