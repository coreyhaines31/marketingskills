# Nitrosend

AI-native email platform that combines transactional and marketing email in one stack, controlled entirely through AI assistants via MCP. No traditional dashboard required — build sequences, campaigns, and automations by prompting.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | REST API available |
| MCP | ✓ | Full MCP support — primary integration method |
| CLI | - | Not available |
| SDK | - | Use MCP or API directly |

## Authentication

- **Type**: API Key
- **MCP Setup**: Add Nitrosend MCP server to your Claude Code / AI assistant config
- **BYO Infrastructure**: Optionally bring your own SendGrid, Postmark, SES, or Resend keys
- **Get access**: Sign up at nitrosend.com — free tier includes 8K emails initially, then 500/month

## Pricing

| Plan | Cost | Volume |
|------|------|--------|
| Free | $0 | 8K initially, then 500/mo |
| Hobby | $20/mo | 25,000/mo |
| Pro | $100/mo | 150,000/mo |
| Scale | $300/mo | 500,000/mo |
| BYO | $60/mo | Unlimited (your infrastructure) |

Unlimited contacts on all plans — pay per email sent, not per subscriber.

## What Makes It Different

- **AI-first**: Designed to be controlled by Claude, ChatGPT, Codex, Cursor, Gemini, Windsurf — not a human clicking through a dashboard
- **Unified transactional + marketing**: Single platform for both, on separate infrastructure
- **Automatic optimization**: Continuously tests subject lines, send times, and content based on engagement
- **Auto-configured deliverability**: DKIM, SPF, DMARC, and dedicated IP warmup handled automatically
- **Migration-friendly**: Import from Mailchimp, Klaviyo, ActiveCampaign, HubSpot

## Common Agent Operations (via MCP)

### Create an email sequence

```
"Create a 5-email onboarding sequence for new SaaS trial users.
Email 1: Welcome + what to do first (send immediately)
Email 2: Key feature highlight (day 2)
Email 3: Use case / success story (day 4)
Email 4: Check-in + support offer (day 7)
Email 5: Upgrade prompt (day 12)"
```

Nitrosend builds the sequence, timing, and sends — no manual setup in a dashboard.

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

### Check sequence performance

```
"Show me open rates, click rates, and unsubscribes for the onboarding sequence."
```

### Import a list

```
"Import this CSV of 2,000 subscribers from our Mailchimp export."
```

## Deliverability Setup

Nitrosend handles this automatically on signup:
- DKIM signing
- SPF record configuration
- DMARC policy
- Dedicated IP provisioning (Pro+)
- IP warmup schedule

For BYO plan users: bring your own SendGrid, Postmark, SES, or Resend account and Nitrosend routes through your infrastructure.

## When to Use

- Building email sequences via AI without touching a dashboard
- Teams already using Claude Code or other AI coding tools as their primary workflow
- Combining transactional (password resets, receipts) and marketing (nurture, campaigns) in one place
- Rapid sequence prototyping — describe the sequence, get it built
- Migrating from Mailchimp/Klaviyo and wanting AI control going forward

## When to Use Something Else

- **Customer.io** — if you need complex event-based branching logic and behavioral triggers
- **Klaviyo** — if you're in e-commerce and need deep Shopify integration
- **Resend** — if you need transactional-only and prefer a pure API/code approach
- **Kit** — if you're a creator or newsletter-first

## Relevant Skills

- emails
- onboarding
- churn-prevention
- lead-magnets
