# Truelist

Email verification and list hygiene. Verifies single addresses synchronously and lists asynchronously as batches, resolves catch-all (accept-all) domains with its Enhanced strategy, and returns an `email_state` plus a more specific `email_sub_state` for each address. Truelist also sells **Outbound**, sending infrastructure for cold email (see below).

API facts below were checked against Truelist's live spec ([truelist.io/spec.yaml](https://truelist.io/spec.yaml), v0.2.2; reference at [truelist.io/docs/api](https://truelist.io/docs/api)) and [MCP docs](https://truelist.io/docs/sdks/mcp) on 2026-10-07. The older [GitHub OpenAPI repo](https://github.com/Truelist-Labs/truelist-openapi) lags the live spec.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | REST API: inline verification, batches, results, account |
| MCP | ✓ | Official hosted server at `https://api.truelist.io/mcp` (OAuth sign-in, 7 tools). A self-hostable [truelist-mcp](https://github.com/Truelist-Labs/truelist-mcp) repo also exists |
| CLI | [✓](../clis/truelist.js) | Zero-dependency Node.js CLI in this repo; Truelist also publishes a Go [truelist-cli](https://github.com/Truelist-Labs/truelist-cli) |
| SDK | ✓ | Official: Node/TypeScript, Python, Ruby, PHP, Go, Java, .NET; plus WordPress and n8n |

## Authentication

- **API and CLI**: Bearer token, `Authorization: Bearer <key>`. Env var `TRUELIST_API_KEY`. Create a key in account settings.
- **MCP**: no API key. The client opens a browser to sign in to Truelist once, and stays authorized until you revoke it. Because sign-in is per user, the hosted MCP suits interactive sessions; scheduled jobs should use the API key with the CLI or API.
- **Base URL**: `https://api.truelist.io`

```bash
# Claude Code
claude mcp add --transport http truelist https://api.truelist.io/mcp
```

## Common Agent Operations

### Verify one or a few addresses (synchronous)

```bash
node tools/clis/truelist.js verify --email jane@acme.com
node tools/clis/truelist.js verify --email "jane@acme.com,bo@beta.io" --strategy enhanced
```

Underlying call: `POST /api/v1/verify_inline?email=<space-separated addresses>&validation_strategy=<strategy>`.

| Strategy | Use when |
|----------|----------|
| `accurate` (default) | Normal verification with retries |
| `fast` | Speed matters more than certainty; skips retry logic |
| `thorough` | Greylisting servers; waits longer (5-minute retry delay) |
| `enhanced` | Catch-all domains; adds post-validation checks to resolve accept-all results. Uses enhanced credits |

The inline endpoint also takes a `checks` parameter (`syntax`, `mx`, `disposable`, `role`, `smtp`) for sub-200ms signup-form checks that skip SMTP; see the API reference.

### Verify a list (asynchronous batch)

```bash
# CSV/text with the email in the first column, or a JSON array of emails (2+ addresses)
node tools/clis/truelist.js batch create --file prospects.csv --name "Q4 SaaS list" --webhook-url https://example.com/truelist-done

# Poll status (batch_state: pending → processing → completed)
node tools/clis/truelist.js batch get --id <batch-uuid>

# Pull results by state once completed (paginated, max 100 per page)
node tools/clis/truelist.js results --batch-id <batch-uuid> --state ok --per-page 100
node tools/clis/truelist.js results --batch-id <batch-uuid> --state invalid

node tools/clis/truelist.js batch list
```

A completed batch includes four CSV download URLs: `safest_bet_csv_url` (only addresses safe to send), `highest_reach_csv_url` (adds accept-all/catch-all addresses), `only_invalid_csv_url`, and `annotated_csv_url` (your original rows plus result columns). Counts aren't updated until the batch completes. Supply `--webhook-url` to get a POST with the batch ID on completion instead of polling.

### Account

```bash
node tools/clis/truelist.js account
```

## Result States

`email_state` (overall verdict):

| State | Meaning | Outbound action |
|-------|---------|-----------------|
| `ok` | Deliverable | Send |
| `email_invalid` | Not deliverable | Remove; it would bounce |
| `accept_all` | Catch-all domain; the mailbox can't be confirmed | Resolve with the `enhanced` strategy first. If still unresolved, send only for high-value accounts, from separate lower-volume inboxes |
| `risky` | May deliver but carries risk (role, disposable, and similar) | Exclude from cold outreach by default |
| `unknown` | Couldn't be determined (timeouts, greylisting) | Re-verify with `thorough`; don't send until resolved |

`email_sub_state` (reason): `email_ok`, `accept_all`, `is_disposable`, `is_role`, `failed_mx_check`, `failed_smtp_check`, `failed_spam_trap`, `failed_no_mailbox`, `failed_greylisted`, `failed_syntax_check`, `unknown_error`.

Read the two together. `ok` + `is_role` is deliverable but a shared inbox (info@, sales@), which cold outreach should skip. `email_invalid` + `failed_no_mailbox` means the address doesn't exist. Any `failed_spam_trap` result should be removed and the source of that list questioned.

Results filtering (`results --state`) accepts `ok`, `risky`, `invalid`, and `unknown`.

## MCP Tools

| Tool | Does | Credits |
|------|------|---------|
| `check_account` | Account, plan, and connected user | No |
| `validate_email` | One address, full validation chain | 1 (recent cached results free) |
| `validate_emails` | Up to 50 addresses; returns partial results with `stopped_reason` if a limit trips | 1 per email |
| `create_batch` | Batch of up to 10,000 addresses | 1 per email (cache hits free) |
| `list_batches` | Batches with progress counters | No |
| `get_batch` | One batch, with the four CSV download URLs when complete | No |
| `list_email_addresses` | Past results filtered by batch or state | No |

## Rate Limits

- 10 API requests per second per endpoint; `429` when exceeded. The email validation rate is separate and depends on plan.
- Source: [API reference](https://truelist.io/docs/api)

## Truelist Outbound (sending infrastructure)

Separate from verification, [Truelist Outbound](https://truelist.io/docs/outbound/overview) provides cold email sending infrastructure that you connect to a sequencer (Instantly, Smartlead, lemlist, or anything that sends over SMTP):
- Domains registered in your name, with SPF, DKIM, and DMARC configured automatically
- Mailboxes with SMTP/IMAP credentials for your sequencer, on a sending IP reserved for your account
- A 21-day sending ramp (10 → 20 → 30 → 40 sends a day per mailbox) enforced on Truelist's mail server, regardless of what the sequencer tries to send. There is no warmup network.
- Every recipient verified at send time; invalid or unverifiable recipients are rejected
- Server-enforced suppressions for hard bounces and complaints, and recurring blocklist monitoring

It doesn't run campaigns or write copy; the sequencer still does that. Compare it with general inbox providers in the `cold-email` skill's deliverability guidance.

## When to Use

- **Before any cold outreach**: verify every list before it reaches a sequencer, and re-verify anything older than 30–60 days before sending. Keep hard bounces under 2% (under 1% is the target).
- **Catch-all heavy lists** (B2B domains often accept all mail): use the `enhanced` strategy rather than dropping or blindly sending to accept-all results.
- **Signup and form validation**: inline verification with fast checks.
- **Recurring list hygiene** for CRM and ESP lists, via native integrations or scheduled batches.

## Native Integrations

Email platforms (Mailchimp, Klaviyo, HubSpot, ActiveCampaign, Brevo, Constant Contact, Kit, Drip), automation (Zapier, Make, n8n), CRM and sales (Salesforce, Go High Level, Clay), and ecommerce (BigCommerce, Shopify). Current list: [truelist.io/integrations](https://truelist.io/integrations).

## Relevant Skills

- prospecting (verify before anything enters an outreach list)
- cold-email (deliverability and list hygiene for sending)
- emails (subscriber list hygiene)
- popups (real-time form validation)
