# Hunter.io

Email finding and verification: domain search (everyone with a public email at a company), email finder (name + domain), verifier, enrichment, a B2B company database (Discover), and simple sending campaigns. Used for sales prospecting, PR, and link building. Checked against [hunter.io/api-documentation](https://hunter.io/api-documentation/v2) on 2026-10-07.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | REST API for domain search, email finder, verification |
| MCP | ✓ | Official server at `https://mcp.hunter.io/mcp`: API key in `X-API-Key`, or OAuth where the client supports it; all plans ([hunter.io/mcp](https://hunter.io/mcp)) |
| CLI | [✓](../clis/hunter.js) | Zero-dependency Node.js CLI |
| SDK | - | API-only |

## Authentication

- **Type**: API Key (query parameter)
- **Parameter**: `api_key={key}`
- **Env var**: `HUNTER_API_KEY`
- **Get key**: [Hunter dashboard > API](https://hunter.io/api-keys)

## Common Agent Operations

### Find emails for a domain

```bash
node tools/clis/hunter.js domain search --domain example.com --limit 10
```

### Find a specific person's email

```bash
node tools/clis/hunter.js email find --domain example.com --first-name John --last-name Doe
```

### Verify an email address

```bash
node tools/clis/hunter.js email verify --email john@example.com
```

### Count emails available for a domain

```bash
node tools/clis/hunter.js domain count --domain example.com
```

### Manage leads

```bash
# List leads
node tools/clis/hunter.js leads list --limit 20

# Create a lead
node tools/clis/hunter.js leads create --email john@example.com --first-name John --last-name Doe --company "Example Inc"

# Delete a lead
node tools/clis/hunter.js leads delete --id 12345
```

### Manage campaigns

```bash
# List campaigns
node tools/clis/hunter.js campaigns list

# Get campaign details
node tools/clis/hunter.js campaigns get --id 12345

# Start/pause a campaign
node tools/clis/hunter.js campaigns start --id 12345
node tools/clis/hunter.js campaigns pause --id 12345
```

### Check account usage

```bash
node tools/clis/hunter.js account info
```

## Rate Limits

- Free plan: 25 searches/month, 50 verifications/month
- Paid plans scale with tier
- Domain Search and Email Finder: 15 requests/second, 500/minute
- Email Verifier: 10 requests/second, 300/minute
- Discover: 5 requests/second, 50/minute

## Use Cases

- **Sales prospecting**: find the decision maker's email at each target account (one step in an enrichment waterfall), using Discover or Domain Search to list companies and people
- **Verification**: check emails before they enter a sequence; resolve catch-all results with a dedicated verifier before sending
- **Link building and PR**: find editors and site owners at target domains

Hunter's confidence score is a guide, not a guarantee. Verify every address before it reaches a sending tool, and keep hard bounces under 2%.

## Relevant Skills

- prospecting
- cold-email
- public-relations
