# Agent Press Wire

Pay-per-call **API + MCP server** that drafts a press release from a product page (or takes your own copy) and either publishes it on a hosted newsroom page or distributes it over a newswire. Payment is per call in USDC on Base via [x402](https://x402.org). No account or API key.

- **Site**: [agentpresswire.dev](https://agentpresswire.dev) (agent summary at `/llms.txt`, spec at `/openapi.json`)
- **MCP server**: [`agent-press-wire-mcp`](https://www.npmjs.com/package/agent-press-wire-mcp) on npm, source at [github.com/dylancaponi/agent-press-wire-mcp](https://github.com/dylancaponi/agent-press-wire-mcp)
- Disclosure: this guide was contributed by the person who built Agent Press Wire. It is not a Verified Partner. For the other distribution options (own newsroom, PRLog, EIN Presswire, PR Newswire, Business Wire) see the public-relations skill's [press-releases.md](https://github.com/coreyhaines31/marketingskills/blob/main/skills/public-relations/references/press-releases.md).

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | HTTP, paid per call via x402 (HTTP 402 then a signed USDC payment) |
| MCP | ✓ | `npx -y agent-press-wire-mcp` (stdio); quotes only until a wallet and spend cap are set |
| CLI | - | Use the API or MCP |
| SDK | - | Any x402 client works (e.g. `@x402/fetch`) |

## Pricing

| Endpoint | Price | What it does |
|----------|-------|--------------|
| `POST /v1/press-release` | $1 | 350-450 word release published on a public newsroom page. About 20 seconds |
| `POST /v1/wire-release` | $99 | 450-600 word release distributed to 500+ news sites and 100+ TV and radio sites after editorial review. Requires `city`, `country`, `contact_email` |
| `POST /v1/wire-release/premium` | $299 | Same as wire, plus AP News, USA Today, Barchart, and StreetInsider |
| `GET /v1/wire-release/{id}` | Free | Order status and live placement links |

Charged only when the job succeeds. Validation failures and refusals return 422 before payment settles.

## Authentication

No API key. Each paid call is authorized by an x402 payment signed with a Base wallet that holds USDC. Keep the wallet's private key in an env var or secret manager, never in the repo. Use a dedicated wallet funded with only what you plan to spend.

## Setup (MCP)

Quote only, no wallet:

```bash
claude mcp add agent-press-wire -- npx -y agent-press-wire-mcp
```

With payments enabled, capped at $1 per call and $5 total:

```bash
claude mcp add agent-press-wire \
  -e X402_PRIVATE_KEY=0xYOUR_KEY -e MAX_SPEND_USD=1 -e MAX_TOTAL_SPEND_USD=5 \
  -- npx -y agent-press-wire-mcp
```

`MAX_SPEND_USD` defaults to 0 (quote only). Every paid call takes two steps: the first returns the price and a `confirm_token`, and the agent calls again with the same parameters and that token after the user approves the price.

## Common Agent Operations

**Tools (MCP):**

- `announce_launch_newsroom`: $1 hosted release from `product_url` and an `announcement`.
- `distribute_press_release`: wire distribution, `tier: "wire"` ($99) or `tier: "premium"` ($299).
- `get_release_status`: free status check for a wire order.

**API (any x402 client):**

```bash
# First request returns 402 with the payment terms; an x402 client signs and retries.
curl -X POST https://agentpresswire.dev/v1/press-release \
  -H "Content-Type: application/json" \
  -d '{"product_url": "https://example.com", "announcement": "v2 adds offline mode"}'
```

**Bring your own copy:** add `headline` and `body` to any paid call and the text is published as written (body 150-900 words, 380-900 on wire tiers; headline names the company; at most 5 links, all to the product's own site).

## Limits

- USDC on Base only. No card checkout.
- Refuses token sales, gambling, adult content, cure claims, and cannabis.
- Wire tiers refuse market-moving news (earnings, M&A, IPOs, stock news, FDA, lawsuits). Use PR Newswire or Business Wire for disclosure.
- English only. The announcing brand must match the product page.
- New service with a small track record compared to the established wires.

## When to Use

- An agent is running a launch and needs to publish or distribute a release without a human going through a checkout.
- You want a hosted release page for a small launch at low cost.

## When Something Else Fits

- **Own newsroom page or PRLog**: free, when a public record is all you need.
- **EIN Presswire**: card checkout and package pricing, when a human is buying.
- **PR Newswire / Business Wire**: public company disclosure or the widest journalist reach.

## Relevant Skills

- public-relations
- launch
