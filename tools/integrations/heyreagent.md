# HeyReagent

Hosted MCP server and REST API that acts on your own LinkedIn account: inbox and messages, invitations, people and post search, posts and comments, and Sales Navigator, Recruiter and job-posting actions when the account has those products. Built for driving LinkedIn from an AI app (Claude, ChatGPT, Claude Code, Cursor) or n8n, one action at a time, rather than from a campaign dashboard.

Contributed by HeyReagent's maker. Facts below were checked against [heyreagent.com/docs](https://heyreagent.com/docs), the [OpenAPI file](https://heyreagent.com/openapi.json) and [heyreagent.com/pricing](https://heyreagent.com/pricing) on 2026-10-24.

> **Terms-of-service risk.** LinkedIn's User Agreement does not allow automated activity, and LinkedIn can limit or restrict an account it decides is automated, whichever tool does it. HeyReagent is not made by, affiliated with or endorsed by LinkedIn. Use only your own real profile, stay well under the limits below, and spread actions over the day. See the `cold-email` skill's LinkedIn guidance before scaling.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | REST: each action is one `POST /v1/actions/<name>`. 97 actions in 11 areas (Messages, Search, Posts, Jobs, Network, Profile, InMail, Recruiter, Insight, Account, Sales Navigator), described in an OpenAPI 3.1 file |
| MCP | ✓ | Hosted, Streamable HTTP, at `https://api.heyreagent.com/mcp`. Clients that support it sign in with OAuth (dynamic client registration and PKCE, no client secret), as Claude and ChatGPT do; others send a key. Nothing to install |
| CLI | - | API and MCP only |
| SDK | - | API and MCP only. There is an n8n community node, `n8n-nodes-heyreagent` on npm |

## Authentication

- **Type**: OAuth sign-in for MCP clients that support it; otherwise a key in the `Authorization: Bearer` header
- **Env var** (convention): `HEYREAGENT_API_KEY`
- **Get key**: sign in at heyreagent.com and connect your LinkedIn account, then on the thread page open Menu > Developers. The key is shown once
- **Check a key**: `POST https://api.heyreagent.com/v1/actions/get_usage` (read-only: today's usage and what is left)

## Setup

Claude and ChatGPT: add a custom connector with the MCP address above and sign in to HeyReagent when asked. No key.

Claude Code:

```bash
claude mcp add --transport http heyreagent https://api.heyreagent.com/mcp \
  --header "Authorization: Bearer $HEYREAGENT_API_KEY"
```

Cursor (`.cursor/mcp.json`):

```json
{
  "mcpServers": {
    "heyreagent": {
      "url": "https://api.heyreagent.com/mcp",
      "headers": { "Authorization": "Bearer <your key>" }
    }
  }
}
```

## Common Agent Operations

Base URL: `https://api.heyreagent.com/v1/actions`. Every action is a `POST` with its inputs as the JSON body, reads included. A success answers `{ "ok": true, "result": { ... } }`.

### Who is waiting on a reply

```bash
POST /who_is_waiting_on_me
Authorization: Bearer $HEYREAGENT_API_KEY

{ "limit": 50 }
```

### Read and answer conversations

```bash
POST /list_conversations   # { "unreadOnly": true, "includeThreads": true }
POST /send_message         # { "conversationId": "<id from list_conversations>", "text": "..." }
```

### Find people and invite them

```bash
POST /search_people        # { "keywords": "head of sales fintech", "location": "Berlin", "network": ["second"] }
POST /send_invitation      # { "profileUrl": "https://www.linkedin.com/in/janedoe", "note": "..." }
```

Take ids and profile URLs from earlier answers rather than building them. Pages continue with the `nextCursor` an answer returns.

### Find recent posts on a topic

```bash
POST /search_posts         # { "keywords": "cold email deliverability", "datePosted": "past_week", "authorKeywords": "founder" }
```

### Ask before sending

The 34 actions that change something on LinkedIn (such as `send_message`, `send_invitation` and `create_post`) carry `x-changes-something: true` in the OpenAPI file, so an agent can confirm with the user before calling them.

### Reconnecting LinkedIn

An action answers `linkedin_disconnected` when the LinkedIn session has ended; `connect_linkedin` returns a link to connect it again.

## Rate Limits

Limits are daily, per LinkedIn account and per kind of action. Past one, the action is refused with the time it resets, and `get_usage` shows what is left ([all limits](https://heyreagent.com/docs#limits)):

- Invitations: 30 a day and 200 in any 7 days on a paid LinkedIn account (Premium, Sales Navigator or Recruiter); 20 and 150 on a free one, where only 5 in any 30 days may carry a note
- Messages 100 a day, InMails 40, comments 40, reactions 40, posts 5, profiles read 100
- Search: 1,000 result rows a day, 2,500 on Sales Navigator or Recruiter
- Reading conversations is not limited

LinkedIn can refuse sooner than these numbers (`linkedin_limit_reached`). A new or little-used account should start well below them.

## Pricing

- **Free**: every action except the five Agent ones, but LinkedIn is disconnected after an hour without use, so it suits working live rather than schedules
- **Connect**, $29.99 a month: the same actions with LinkedIn kept connected, so scheduled workflows run
- **Agent**, $499 a month: HeyReagent works the inbox, follow-ups and finding new people itself, and you approve what it sends

Current plans: [heyreagent.com/pricing](https://heyreagent.com/pricing).

## How it differs from campaign tools

HeyReach, Expandi and similar tools run sequences across sender accounts from their own dashboard. HeyReagent's API and MCP expose single actions on your own account, and the sequence lives in the calling agent or workflow. A campaign tool fits multi-sender sequences at volume; an action API fits work driven from an AI app or n8n.

## Alternatives

HeyReach (multi-sender campaigns, with an MCP), lemlist and La Growth Machine (email + LinkedIn in one sequence), Expandi, Waalaxy, Dripify, and Unipile (LinkedIn messaging API for builders). All carry the same LinkedIn terms-of-service risk.

## Relevant Skills

- cold-email (LinkedIn steps in a multichannel cadence, and their risks)
- prospecting (finding people and their LinkedIn profile URLs)
- social (posts and comments on LinkedIn)
