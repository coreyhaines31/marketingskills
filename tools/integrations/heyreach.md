# HeyReach

Cloud LinkedIn outreach automation: runs connection requests, messages, InMails, and profile engagement across multiple LinkedIn sender accounts, with a shared inbox, campaign analytics, and native Instantly and Smartlead integrations for email + LinkedIn sequences.

Facts below were checked against [docs.heyreach.io](https://docs.heyreach.io/hey-reach-api) and HeyReach's [help center](https://help.heyreach.io/en/articles/12123398-how-to-integrate-heyreach-mcp-with-claude) on 2026-10-07.

> **Terms-of-service risk.** LinkedIn's User Agreement prohibits third-party automation, so any tool like this can get sender accounts restricted. LinkedIn also acts against vendors directly: in March 2026 it removed HeyReach's company page and several executives' profiles ([HeyReach's account](https://www.heyreach.io/blog/heyreach-ban)); HeyReach says the product kept working. Use only real profiles you own, stay well under weekly limits, and keep a manual fallback. See the `cold-email` skill's LinkedIn guidance before scaling.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | Public REST API: LinkedIn accounts, lists, leads, campaigns, inbox, analytics, webhooks |
| MCP | ✓ | Official, per-workspace: Integrations > HeyReach MCP Server gives a connection URL and MCP key; authenticate with the workspace API key ([guide](https://help.heyreach.io/en/articles/12123398-how-to-integrate-heyreach-mcp-with-claude)). Several community MCP servers also exist |
| CLI | ✓ | HeyReach publishes a CLI for Mac and Windows ([heyreach.io/cli](https://www.heyreach.io/cli)) |
| SDK | - | API-only |

## Authentication

- **Type**: API key in the `X-API-KEY` header
- **Env var** (convention): `HEYREACH_API_KEY`
- **Get key**: HeyReach workspace settings > Integrations > API
- **Check a key**: `GET https://api.heyreach.io/api/public/auth/CheckApiKey`

## Common Agent Operations

Base URL: `https://api.heyreach.io/api/public`. Most endpoints are `POST`, including reads.

### Campaigns

```bash
# List campaigns
POST /campaign/GetAll

# Pause or resume
POST /campaign/Pause?campaignId=<id>
POST /campaign/Resume?campaignId=<id>
```

### Add leads to a campaign (up to 100 per request)

```bash
POST /campaign/AddLeadsToCampaignV2
X-API-KEY: $HEYREACH_API_KEY

{
  "campaignId": 12345,
  "accountLeadPairs": [
    { "lead": { "profileUrl": "https://www.linkedin.com/in/janedoe", "firstName": "Jane", "companyName": "Acme" } }
  ],
  "resumeFinishedCampaign": false,
  "resumePausedCampaign": false
}
```

Optionally pin a lead to a specific sender with `linkedInAccountId` in the pair. Custom field names may only contain letters, numbers, and underscores.

### Stop a lead when they reply on another channel

```bash
POST /campaign/StopLeadInCampaign
```

Call this from your reply handler when a prospect answers by email or books a meeting, so LinkedIn steps stop too.

### Inbox and replies

```bash
POST /inbox/GetConversationsV2   # conversations across sender accounts, filterable
POST /inbox/SendMessage          # reply in an existing conversation
```

Prefer webhooks (`/webhooks` endpoints) for reply events over polling the inbox.

### Analytics

```bash
POST /stats/GetOverallStats
```

Track acceptance rate, reply rate, and positive replies per sender and campaign. A falling acceptance rate is the earliest sign an account is at risk.

## Rate Limits

- 300 API requests per minute, shared across all requests; `429` when exceeded ([docs](https://docs.heyreach.io/hey-reach-api))
- LinkedIn action limits are a separate, bigger risk than API limits. HeyReach allows up to 40 connection requests a day and caps each sender at 200 a week, but recommends 25 a day for a warmed-up account (30 above 1,000 connections) ([help article](https://help.heyreach.io/en/articles/15128619-how-do-connection-request-limits-work-in-heyreach)). New or low-acceptance accounts should run far lower; many practitioners stay near 100 a week.

## Pricing

Priced per connected LinkedIn sender account. Current plans: [heyreach.io/pricing](https://www.heyreach.io/pricing).

## Alternatives

Expandi, La Growth Machine and lemlist (email + LinkedIn in one sequence), Waalaxy, Dripify, and Unipile (LinkedIn messaging API for builders). All carry the same LinkedIn terms-of-service risk.

## Relevant Skills

- cold-email (multichannel cadence and LinkedIn steps)
- prospecting (building the lead list with LinkedIn profile URLs)
- social (LinkedIn profile and content that raise acceptance)
- revops (logging LinkedIn touches and replies in the CRM)
