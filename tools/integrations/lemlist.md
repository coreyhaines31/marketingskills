# Lemlist

Multichannel outreach platform: email sequences plus LinkedIn steps (invitations, messages, profile visits) and WhatsApp in one campaign, with personalization, a built-in lead database and enrichment, and reply tracking. Checked against [developer.lemlist.com](https://developer.lemlist.com/api-reference/getting-started/overview) on 2026-10-07.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | REST API for campaigns, leads, activities, webhooks |
| MCP | ✓ | Official hosted server at `https://app.lemlist.com/mcp`: OAuth, or an API key in `X-API-Key` ([setup](https://developer.lemlist.com/mcp/setup)) |
| CLI | [✓](../clis/lemlist.js) | Zero-dependency Node.js CLI in this repo; lemlist also publishes an [official CLI](https://developer.lemlist.com/cli/overview) |
| SDK | - | API-only |

## Authentication

- **Type**: Basic Auth (empty username, API key as password)
- **Header**: `Authorization: Basic base64(:api_key)`
- **Env var**: `LEMLIST_API_KEY`
- **Get key**: [Lemlist Settings > Integrations](https://app.lemlist.com/settings/integrations)

## Common Agent Operations

### List campaigns

```bash
node tools/clis/lemlist.js campaigns list --offset 0 --limit 20
```

### Get campaign details and stats

```bash
# Get campaign
node tools/clis/lemlist.js campaigns get --id cam_abc123

# Get campaign stats
node tools/clis/lemlist.js campaigns stats --id cam_abc123

# Export campaign data
node tools/clis/lemlist.js campaigns export --id cam_abc123
```

### Manage leads in a campaign

```bash
# List leads
node tools/clis/lemlist.js leads list --campaign-id cam_abc123

# Add a lead
node tools/clis/lemlist.js leads add --campaign-id cam_abc123 --email john@example.com --first-name John --last-name Doe --company "Example Inc"

# Get lead details
node tools/clis/lemlist.js leads get --campaign-id cam_abc123 --email john@example.com

# Remove a lead
node tools/clis/lemlist.js leads delete --campaign-id cam_abc123 --email john@example.com
```

### Manage unsubscribes

```bash
# List unsubscribed emails
node tools/clis/lemlist.js unsubscribes list

# Add to unsubscribe list
node tools/clis/lemlist.js unsubscribes add --email john@example.com

# Remove from unsubscribe list
node tools/clis/lemlist.js unsubscribes delete --email john@example.com
```

### View activities

```bash
# All activities
node tools/clis/lemlist.js activities list

# Filter by campaign and type
node tools/clis/lemlist.js activities list --campaign-id cam_abc123 --type emailsOpened
```

### Manage webhooks

```bash
# List hooks
node tools/clis/lemlist.js hooks list

# Create a webhook
node tools/clis/lemlist.js hooks create --target-url https://example.com/webhook --event emailsOpened

# Delete a webhook
node tools/clis/lemlist.js hooks delete --id hook_123
```

### Team info

```bash
node tools/clis/lemlist.js team info
```

## Rate Limits

- 20 requests per 2 seconds ([rate limit docs](https://developer.lemlist.com/api-reference/getting-started/rate-limits))
- LinkedIn steps have their own daily limits per sender (invitations, messages, profile visits), settable through the API. Keep them conservative; any LinkedIn automation risks account restrictions under LinkedIn's terms.

## Use Cases

- **Sales outbound**: email + LinkedIn sequences to verified, segmented lists, from secondary domains
- **Cross-channel stops**: a reply on any lemlist channel stops the lead's remaining steps; push replies and booked meetings that happen elsewhere back via the API so the sequence stops there too
- **Reply tracking**: webhooks for replies, bounces, and unsubscribes feed the CRM and suppression lists
- **Link building and PR outreach**: the same campaign mechanics work for backlink and press outreach

Judge campaigns on replies, positive replies, and meetings rather than opens.

## Relevant Skills

- cold-email
- prospecting
- revops
