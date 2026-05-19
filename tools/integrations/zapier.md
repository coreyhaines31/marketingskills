# Zapier

Workflow automation platform connecting 8,000+ apps. The Zapier SDK gives AI agents direct access to any app's actions without building OAuth flows or reverse-engineering APIs.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | REST API for Zaps, tasks, and webhooks |
| MCP | ✓ | Available via Zapier MCP server |
| CLI | ✓ | `@zapier/zapier-sdk-cli` for app discovery and type generation |
| SDK | ✓ | `@zapier/zapier-sdk` — TypeScript SDK for 8,000+ app integrations |

## Authentication

### Legacy API (Zaps management)

- **Type**: API Key
- **Header**: `X-API-Key: {api_key}`
- **Get key**: Settings > API in Zapier account

### SDK Authentication

**Browser-based login (development):**
```bash
npx zapier-sdk login
```

**Server-side (production):**
- Client Credentials — store as environment variables
- Direct token — set `ZAPIER_CREDENTIALS` env var

Browser-based login only works locally. Use Client Credentials for any server-side deployment.

## SDK Quick Start

### Install

```bash
npm install @zapier/zapier-sdk
npm install -D @zapier/zapier-sdk-cli @types/node typescript
npm pkg set type=module
```

### Initialize

```typescript
import { createZapierSdk } from "@zapier/zapier-sdk";
const zapier = createZapierSdk();
```

### CLI Commands

| Command | Purpose |
|---------|---------|
| `npx zapier-sdk login` | Authenticate (dev only) |
| `npx zapier-sdk list-apps --search "query"` | Search available apps |
| `npx zapier-sdk list-actions APP_KEY` | List actions for an app |
| `npx zapier-sdk add [app-key]` | Generate TypeScript types |

### SDK Methods

| Method | Purpose |
|--------|---------|
| `zapier.listConnections()` | List authenticated app connections |
| `zapier.findFirstConnection()` | Find a specific connection |
| `zapier.runAction()` | Execute an action on a connected app |
| `zapier.apps.slack()` | App proxy pattern for clean syntax |
| `zapier.fetch()` | Custom authenticated API calls |

### Example: Send a Slack Message

```typescript
import { createZapierSdk } from "@zapier/zapier-sdk";

const zapier = createZapierSdk();
const slack = await zapier.apps.slack();

await slack.sendChannelMessage({
  channel: "#marketing",
  message: "Campaign launched!"
});
```

### Example: Create a HubSpot Contact

```typescript
const hubspot = await zapier.apps.hubspot();

await hubspot.createContact({
  email: "lead@example.com",
  firstName: "Jane",
  lastName: "Doe"
});
```

### Pagination

Use `.items()` for large datasets:

```typescript
const contacts = await hubspot.listContacts({ maxItems: 100 });
for await (const contact of contacts.items()) {
  console.log(contact.email);
}
```

### Governance Note

Direct API calls via `zapier.fetch()` are not subject to org app/action restriction policies. Use pre-built actions where possible if your org has governance requirements.

---

## Zaps API (Legacy)

### List Zaps

```bash
GET https://api.zapier.com/v1/zaps
```

### Get Zap details

```bash
GET https://api.zapier.com/v1/zaps/{zap_id}
```

### Turn Zap on/off

```bash
POST https://api.zapier.com/v1/zaps/{zap_id}/on
POST https://api.zapier.com/v1/zaps/{zap_id}/off
```

### Get task history

```bash
GET https://api.zapier.com/v1/zaps/{zap_id}/tasks
```

### Get profile info

```bash
GET https://api.zapier.com/v1/profiles/me
```

## Webhooks (Triggers)

### Catch Hook (receive data)

Create a "Webhooks by Zapier" trigger to receive data:

```bash
POST https://hooks.zapier.com/hooks/catch/{webhook_id}/

{
  "event": "user.created",
  "user_id": "123",
  "email": "user@example.com"
}
```

### Send data to Zapier

Most common: trigger a Zap from your app:

```bash
POST https://hooks.zapier.com/hooks/catch/{account_id}/{hook_id}/

{
  "name": "John Doe",
  "email": "john@example.com",
  "plan": "pro"
}
```

## Common Marketing Automations

### With SDK (recommended for agents)

```typescript
// Lead capture to CRM
const hubspot = await zapier.apps.hubspot();
await hubspot.createContact({ email, firstName, lastName });

// New customer notification
const slack = await zapier.apps.slack();
await slack.sendChannelMessage({ channel: "#revenue", message: `New customer: ${email}` });

// Add to email sequence
const customerio = await zapier.apps.customerio();
await customerio.createOrUpdatePerson({ email, plan: "pro" });
```

### With Zaps (no-code)

- Typeform → Zapier → HubSpot (lead capture)
- Stripe → Zapier → Slack (new customer alerts)
- Form submission → Zapier → Customer.io (email sequences)
- New review → Zapier → Slack (social proof)
- New referral → Zapier → Spreadsheet + Slack (referral tracking)

## Webhook Payload Structure

When sending to Zapier, structure data as flat JSON:

```json
{
  "customer_name": "John Doe",
  "customer_email": "john@example.com",
  "plan_name": "Pro",
  "plan_price": 99,
  "signup_date": "2024-01-15"
}
```

## Key Concepts

- **Zap** - Automated workflow (no-code)
- **SDK** - Programmatic access to 8,000+ app integrations
- **Trigger** - Event that starts a Zap
- **Action** - Task performed by Zap or SDK
- **Task** - Single action execution
- **Connection** - Authenticated link to an app (shared between Zaps and SDK)

## When to Use

- **SDK**: When an AI agent needs to interact with any app directly — send messages, create records, sync data
- **Zaps**: When you need always-on automation without code
- **Webhooks**: When triggering workflows from your own app
- **API**: When managing Zaps programmatically

## Rate Limits

- API: 100 requests per minute
- SDK: Rate limits per connected app
- Task limits by plan tier

## Relevant Skills

- emails
- analytics
- referrals
- revops
