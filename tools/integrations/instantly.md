# Instantly

Cold email sending platform: campaigns and sequences, sending-account management with warmup, inbox rotation, a shared reply inbox (Unibox), lead lists, a built-in lead database (SuperSearch), and inbox placement tests.

API facts below were checked against [developer.instantly.ai](https://developer.instantly.ai/api-reference/introduction) on 2026-10-07.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | REST API v2. v1 was deprecated on 2026-01-19 ([migration guide](https://developer.instantly.ai/guides/api-v1-migration)) |
| MCP | ✓ | Official hosted server at `https://mcp.instantly.ai/mcp`, exposing the full v2 API as tools ([docs](https://developer.instantly.ai/mcp/introduction)) |
| CLI | [✓](../clis/instantly.js) | Zero-dependency Node.js CLI (API v2) |
| SDK | - | API-only |

## Authentication

- **Type**: Bearer token (`Authorization: Bearer <key>`), with scoped API keys
- **Env var**: `INSTANTLY_API_KEY`
- **Get key**: Instantly Settings > Integrations > API. Create a v2 key; v1 keys don't work with v2.
- **MCP**: send the same key as an `Authorization` header (preferred) or `x-instantly-api-key`. Avoid the URL-embedded key option; it ends up in logs. Because the MCP takes an API key rather than per-user OAuth, it also works for scheduled, unattended agent runs.

## Common Agent Operations

### Campaigns

```bash
node tools/clis/instantly.js campaigns list --limit 20
node tools/clis/instantly.js campaigns get --id <campaign-id>
node tools/clis/instantly.js campaigns activate --id <campaign-id>
node tools/clis/instantly.js campaigns pause --id <campaign-id>

# Why is a campaign not sending (or sending slowly)?
node tools/clis/instantly.js campaigns sending-status --id <campaign-id>
```

### Leads

Verify every list before it goes in (see the `prospecting` skill and the [Truelist guide](truelist.md)).

```bash
# Add one lead to a campaign
node tools/clis/instantly.js leads add --campaign-id <id> --email jane@acme.com \
  --first-name Jane --company "Acme" --job-title "VP Marketing" --skip-if-in-workspace

# Add up to 1,000 leads from a JSON file
node tools/clis/instantly.js leads bulk-add --campaign-id <id> --file leads.json --skip-if-in-workspace

# List leads in a campaign (cursor pagination)
node tools/clis/instantly.js leads list --campaign-id <id> --limit 100

# Record a reply outcome
node tools/clis/instantly.js leads interest --email jane@acme.com --status meeting-booked
```

Interest statuses: `interested`, `meeting-booked`, `meeting-completed`, `won`, `out-of-office`, `not-interested`, `wrong-person`, `lost`, `no-show`.

### Replies

```bash
# Received emails, newest first (filter to a campaign, or unread only)
node tools/clis/instantly.js emails replies --campaign-id <id> --unread
node tools/clis/instantly.js emails unread-count
```

For near-real-time reply handling, use Instantly's [webhooks](https://developer.instantly.ai/guides/webhook-events) (reply, interest-change, and bounce events) instead of polling.

### Sending accounts and warmup

```bash
node tools/clis/instantly.js accounts list --limit 50
node tools/clis/instantly.js accounts get --email sender@yourdomain.com
node tools/clis/instantly.js accounts warmup-analytics --emails sender1@yourdomain.com,sender2@yourdomain.com
```

### Analytics

```bash
node tools/clis/instantly.js analytics campaign --campaign-id <id> --start-date 2026-09-01 --end-date 2026-09-30
node tools/clis/instantly.js analytics overview
node tools/clis/instantly.js analytics steps --campaign-id <id>
```

Judge campaigns on replies, positive replies, and meetings. Open rates are unreliable since Apple Mail Privacy Protection, and many teams turn open tracking off for cold email.

### Blocklist (suppression)

```bash
node tools/clis/instantly.js blocklist list --search acme.com
node tools/clis/instantly.js blocklist add --entries "customer.com,unsubscribed@example.com"
```

Keep customers, open deals, competitors, and everyone who opted out on any channel in the blocklist.

## Rate Limits

- 100 requests per second and 6,000 per minute, shared across the whole workspace and all its API keys (v1 and v2 combined). Exceeding either returns `429`.
- A few endpoints are slower: listing emails is 20 requests per minute; sending a test email is 10 per minute.
- Source: [Rate limit docs](https://developer.instantly.ai/getting-started/rate-limit)

## Other API surfaces

Not wrapped by the CLI; call them through the MCP or the API directly:
- **Inbox placement tests** (seed tests across providers before launching a campaign)
- **Lead lists** and verification statistics per list
- **SuperSearch** lead database and enrichment
- **Done-for-you domains and mailboxes**, with domain availability checks
- **Webhooks** and custom tags

## Use Cases

- **Sales outbound**: run cold email campaigns to verified, segmented lists, from secondary domains with warmed sending accounts
- **Reply triage**: pull received replies, classify them, and set interest status so stopped leads leave the sequence
- **Deliverability monitoring**: check warmup analytics, account vitals, sending status, and placement tests before scaling volume
- **Link building and PR outreach**: the same campaign mechanics work for backlink and press outreach

## Relevant Skills

- cold-email
- prospecting
- revops
- marketing-loops
