# Nitrosend

AI-native email platform: marketing campaigns, automation flows, contacts, transactional email and agent inboxes, run by AI agents through a remote MCP server, a REST API or a CLI.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | REST API at `https://api.nitrosend.com/v1/my`, plus an Events API for product events |
| MCP | ✓ | Remote MCP server at `https://api.nitrosend.com/mcp` (Streamable HTTP, OAuth) |
| CLI | ✓ | `@nitrosend/cli`: status, campaigns, flows, sends, migrations and every MCP tool from the terminal |
| SDK | ✓ | `@nitrosend/sdk` (Node.js/TypeScript) and `@nitrosend/ai-sdk` (Vercel AI SDK tools) |

## Authentication

- **MCP**: OAuth 2.0 through the MCP server (dynamic client registration, PKCE, scope `mcp`). The client opens a Nitrosend sign-in, so there is no API key to paste.
- **REST API**: API key (`nskey_live_...`) sent as `Authorization: Bearer $NITROSEND_API_KEY`. Create keys under Settings > API Keys and keep them in an env var or secret manager. There is no test mode: every key sends real mail.
- **CLI**: `nitrosend login` signs in through the browser (OAuth). In CI, set `NITROSEND_API_KEY` instead.
- **Website signup forms**: a public `wpkey_live_...` key can only create contacts and add them to lists, so it is safe to embed in page source.
- **Get access**: sign up at nitrosend.com. MCP, API and CLI access are on every plan, including Free.

## MCP Setup

Claude Code:

```bash
claude mcp add --transport http nitrosend https://api.nitrosend.com/mcp
```

Clients that take a JSON config:

```json
{
  "mcpServers": {
    "nitrosend": { "url": "https://api.nitrosend.com/mcp" }
  }
}
```

Sign in when the client asks, then have the agent call `nitro_get_status`, which reports the account, sender, readiness and blockers. Setup for each client: [docs.nitrosend.com/integrations/overview](https://docs.nitrosend.com/integrations/overview).

## CLI

### Install

```bash
npm install -g @nitrosend/cli   # Node.js 18+
nitrosend login
```

### Common commands

```bash
# Account, sender, plan and readiness
nitrosend status

# Campaigns, flows and contacts
nitrosend campaigns list
nitrosend flows list
nitrosend contacts list --query "acme.com"

# Send one email (--dry-run validates without sending)
nitrosend send --to you@example.com --subject "Hello" --body "First send." --dry-run

# Move from another email platform (opens the import options in the browser)
nitrosend migrate sources
nitrosend migrate mailchimp
nitrosend migrate klaviyo --no-browser   # print the link instead of opening it

# Connect an integration
nitrosend connect hubspot

# Call any MCP tool from the terminal
nitrosend mcp tools list
nitrosend mcp tools call nitro_get_status --args '{"include":["account"]}'
```

`migrate` and `connect` need CLI 0.3.13 or later. Add `--json` to any command for machine-readable output.

## Common Agent Operations (via MCP)

Campaigns and flows are created as drafts. Sending a campaign or activating a flow is a separate step.

### Create an email sequence

```
"Create a 5-email onboarding sequence for new SaaS trial users.
Email 1: Welcome + what to do first (send immediately)
Email 2: Key feature highlight (day 2)
Email 3: Use case / success story (day 4)
Email 4: Check-in + support offer (day 7)
Email 5: Upgrade prompt (day 12)"
```

The agent builds the flow with its timing as a draft (`nitro_compose_flow`), ready to test and activate.

### Send a transactional email

```
"Send a password reset email to user@example.com with a reset link valid for 1 hour."
```

### Create a campaign

```
"Create a re-engagement campaign for subscribers who haven't opened in 90 days.
Subject line variants: [A] 'We miss you', [B] 'Still interested in [topic]?'
Test both, send winner to remaining list after 4 hours."
```

Subject line tests are in beta and need 1,000 or more recipients. Agents send versions with `nitro_control_delivery` (`versions`, plus `winner` to send the winner after 2, 4, 8 or 24 hours).

### Check sequence performance

```
"Show me open rates, click rates, and unsubscribes for the onboarding sequence."
```

### Move a list from another platform

```
"Move our Mailchimp audience to Nitrosend and keep everyone who unsubscribed off the list."
```

Bring opt-outs across first: import the old platform's unsubscribed file with **Unsubscribe all from marketing** and its bounced and spam complaint files with **Block all email delivery** (Contacts > Import in the app). Then connect Mailchimp, ActiveCampaign or Shopify and let it sync, or import a CSV of only the contacts who subscribed. Recipe: [docs.nitrosend.com/cli/recipes](https://docs.nitrosend.com/cli/recipes#move-from-another-email-platform).

## REST API

```bash
# Send an email
curl -X POST https://api.nitrosend.com/v1/my/messages \
  -H "Authorization: Bearer $NITROSEND_API_KEY" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: welcome-user-123" \
  -d '{"channel": "email", "to": "user@example.com", "subject": "Welcome", "html": "<p>Thanks for signing up.</p>"}'

# List campaigns
curl https://api.nitrosend.com/v1/my/campaigns \
  -H "Authorization: Bearer $NITROSEND_API_KEY"
```

Product events that start or personalize flows go to `POST /v1/my/events` ([Events API](https://docs.nitrosend.com/integrations/events-api)).

## Sending Domains and Deliverability

- **Nitrosend address**: send right away from an address such as `hello@your-brand.nitrosend.net`, with no DNS setup. It shares capacity, so large sends are paced.
- **Your own domain**: Nitrosend sets up a sending subdomain such as `send.yourdomain.com` and lists its verification, SPF, DKIM and return-path records. Supported DNS providers connect in one click, and records are verified automatically. MCP: `nitro_manage_domains`.
- **Your own provider** (paid plans): send through SendGrid, Postmark, Resend, Mailgun or Amazon SES while Nitrosend keeps composition, audiences, automation, tracking and suppression. MCP: `nitro_configure_providers`.
- **Dedicated IP**: a $50/month add-on that needs a supported plan, steady sending volume and provisioning and warm-up approval.

## Pricing

USD. Unlimited stored contacts on every plan; plans differ by monthly email volume. Paying annually saves 20% on the base plan.

| Plan | Monthly | Emails/month | Extra emails per 1,000 |
|------|---------|--------------|------------------------|
| Free | $0 | 500, plus 5,000 non-expiring starter emails | Upgrade required |
| Starter | $20 | 20,000 | $1.50 |
| Pro | $50 | 60,000 | $1.20 |
| Growth | $150 | 200,000 | $0.90 |
| Scale | $300 | 500,000 | $0.70 |
| Enterprise | Custom | 500,000+ | Agreed with you |

Current prices, add-ons and daily sending limits: [nitrosend.com/pricing.md](https://nitrosend.com/pricing.md).

## When to Use

- Building email sequences, campaigns and transactional email through an AI agent
- Teams already using Claude Code, Cursor, Codex or other AI tools as their main workflow
- Combining transactional (password resets, receipts) and marketing (nurture, campaigns) email in one account
- Rapid sequence prototyping: describe the sequence, review the draft
- Moving from Mailchimp, Klaviyo or another platform with unsubscribes and suppressions kept

## Links

- Docs: https://docs.nitrosend.com
- MCP setup by client: https://docs.nitrosend.com/integrations/overview
- REST API: https://docs.nitrosend.com/integrations/rest-api
- CLI: https://docs.nitrosend.com/cli/overview
- Agent skills (source): https://github.com/nitrosend/claude/tree/main/skills
- Pricing: https://nitrosend.com/pricing.md

## Relevant Skills

- emails
- onboarding
- churn-prevention
- lead-magnets
