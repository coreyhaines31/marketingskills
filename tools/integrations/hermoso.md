# Hermoso

AI ad creation, ad library research and social publishing for one or more brands. It renders image and video ads that use a brand's saved product photos and logo, pulls ads from the Meta, Google and LinkedIn ad libraries, and publishes or schedules posts to the accounts a brand has connected. Renders run as asynchronous jobs.

Facts below were checked against the [OpenAPI spec](https://app.hermoso.ai/openapi.json) and the [API](https://hermoso.ai/docs/api/), [MCP](https://hermoso.ai/docs/mcp/) and [CLI](https://hermoso.ai/docs/cli/) docs on 2026-11-19. The read-only calls below were also run live that day.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | REST, `https://app.hermoso.ai/v1`, JSON bodies. Server-side only: it sends no CORS headers |
| MCP | ✓ | Remote server at `https://app.hermoso.ai/mcp` (Streamable HTTP, OAuth). A stdio server ships in the npm package: `npx -y hermoso mcp` |
| CLI | ✓ | `hermoso` on npm. `hermoso call <tool>` runs any tool the MCP server has |
| SDK | - | Plain HTTP |

The API has two tiers:

- **Modelled resources** (`/v1/brands`, `/v1/generations`, `/v1/jobs`, `/v1/library`, `/v1/posts`, `/v1/channels`, `/v1/media`, `/v1/credits`) are versioned. Fields are added, never removed or changed.
- **The tool passthrough** (`/v1/tools/{name}`) reaches every tool the MCP server and CLI have, including research, ad campaign management and analytics. The route, auth and errors are stable, but a tool's arguments can change. Read `GET /v1/tools/{name}` for its current JSON Schema before calling it.

## Authentication

- **Type**: Bearer API key: `Authorization: Bearer hmk_...`
- **Env var** (convention): `HERMOSO_TOKEN` (the CLI and the stdio MCP server read it)
- **Get key**: in the app at `https://app.hermoso.ai`, on the MCP & CLI tab under Terminal & API keys. A key reaches either the whole account or one brand, with member or admin access. MCP clients sign in with OAuth instead, and `hermoso auth login` opens a browser and stores a key locally.
- **Brands**: an account can hold several brands. Send `X-Hermoso-User: <brand id>` to act on one; the workspace is never read from the request body.
- **Rate limit**: per key, 300 reads and 60 writes per minute. Responses carry `X-RateLimit-Limit`, `X-RateLimit-Remaining` and `X-RateLimit-Reset`; a 429 also carries `Retry-After`.

## MCP Server Setup

### Claude Code

```bash
claude mcp add --transport http hermoso https://app.hermoso.ai/mcp
claude mcp login hermoso
```

`claude mcp login` opens the sign-in page in a browser (`--no-browser` prints the link instead). Clients that take a stdio command can run the npm package with a key from the environment:

```bash
HERMOSO_TOKEN=hmk_... npx -y hermoso mcp
```

## CLI

```bash
npm install -g hermoso
hermoso auth login                        # or set HERMOSO_TOKEN
hermoso tools --search "competitor ads"   # find a tool
hermoso tools pull_competitor_ads         # its arguments
hermoso call pull_competitor_ads --json '{"companyName": "Liquid Death"}'
hermoso jobs get <id>
```

Every command takes `--json` for machine-readable output.

## Common Agent Operations

The examples use `H="Authorization: Bearer $HERMOSO_TOKEN"`.

### List brands

```bash
curl https://app.hermoso.ai/v1/brands -H "$H"
```

Returns `data[]` with `id`, `name`, `is_default`, `current` (the brand this request resolved to), `shared`, `role` and `headers` (the exact headers that select that brand). An id the key cannot act on is a 404 with `error.code` `brand_not_found`.

### Generate an image ad

```bash
# Optional: price the render first. Nothing is queued or charged.
curl -X POST https://app.hermoso.ai/v1/generations/quote \
  -H "$H" -H "X-Hermoso-User: <brand id>" -H "Content-Type: application/json" \
  -d '{"type": "image", "prompt": "The product on a kitchen counter in morning light, headline: Breakfast in two minutes", "aspect_ratio": "4:5"}'

curl -X POST https://app.hermoso.ai/v1/generations \
  -H "$H" -H "X-Hermoso-User: <brand id>" -H "Content-Type: application/json" \
  -H "Idempotency-Key: $(uuidgen)" \
  -d '{"type": "image", "prompt": "The product on a kitchen counter in morning light, headline: Breakfast in two minutes", "aspect_ratio": "4:5"}'
```

- Answers 202 with a job (`id`, `status`, `poll`). Poll it as shown below.
- `use_brand` (default `true`) attaches the brand's saved product photos, and its logo when the prompt asks for one. `ref_images` takes up to 3 Hermoso-hosted images instead.
- `model` is an id from `GET /v1/models?type=image`, which lists each model's aspect ratios and sizes. Omit it to let Hermoso pick.

### Start a video render without waiting

```bash
curl -X POST "https://app.hermoso.ai/v1/tools/generate_video?wait=0" \
  -H "$H" -H "X-Hermoso-User: <brand id>" -H "Content-Type: application/json" \
  -H "Idempotency-Key: <a unique value>" \
  -d '{"prompt": "Slow push-in on the product on a sunlit bathroom shelf", "durationSeconds": 8, "aspectRatio": "9:16"}'
```

- `wait=0` answers 202 with a `tool_job`: `job_id`, `poll` (also sent as `Location`) and `retry_after_seconds`. Without `wait`, the request is held for up to 45 seconds and then answers 200 with a job id.
- `durationSeconds` must be one of the chosen model's `durations` in `GET /v1/models?type=video`. Add `"dryRun": true` to get the estimated credits without rendering.
- Do not call the tool again to check on a render: that starts a second one. Resending the same `Idempotency-Key` returns the same job.
- For a finished video ad on the brand (planned shots, product photos, brand voice), call `plan_ad` and pass its full output as `creative` to `render_ad`.
- `POST /v1/generations` with `"type": "video"` also queues a video and answers 202.

### Poll a job

```bash
curl https://app.hermoso.ai/v1/jobs/<job id> -H "$H" -H "X-Hermoso-User: <brand id>"
```

- `status` is `queued`, `running`, `done` or `error`. Keep polling on a value you have not seen; a few seconds between reads is enough.
- On `done`, `url` is the finished file and a video has `poster_url`. On `error`, `error_message` says why.
- A 404 `job_not_found` is final. Stop polling and do not re-run the render.
- To skip polling, send `X-Hermoso-Callback-Url: https://...` on the render call and the job is POSTed there when it finishes.
- `GET /v1/jobs?status=running&limit=25` lists recent jobs, newest first, with `has_more` and `next_cursor`.

### Schedule or publish a post

```bash
# Which channels this brand can post to: connected, caption_max, carousel limits, visibilities
curl https://app.hermoso.ai/v1/channels -H "$H" -H "X-Hermoso-User: <brand id>"

# Host an outside file (a job or Library url can be used as it is)
curl -X POST "https://app.hermoso.ai/v1/media?url=https://example.com/ad.png" -H "$H" -H "X-Hermoso-User: <brand id>"

curl -X POST https://app.hermoso.ai/v1/posts \
  -H "$H" -H "X-Hermoso-User: <brand id>" -H "Content-Type: application/json" \
  -H "Idempotency-Key: <a unique value>" \
  -d '{
    "channels": ["instagram", "linkedin"],
    "caption": "Breakfast in two minutes.",
    "media": ["<hosted url>"],
    "scheduled_at": "2026-12-01T15:00:00Z"
  }'
```

- Omit `scheduled_at` to publish now, or send `"use_queue": true` to take the brand's next posting slot (not both).
- Two or more `media` items make a carousel, in order. `captions_by_channel` overrides the caption per channel, and `visibility` takes `public`, `unlisted`, `private` or `draft` where the channel supports it.
- Channel limits (caption length, carousel size, visibility) are checked when the post is created and refused with a 400. A channel that is not connected answers 401 with `error.type` `connector_error` and `error.connector`, and nothing is scheduled.
- Each channel publishes on its own. `results[]` reports each one, and `status` is `scheduled`, `processing`, `published`, `partially_published`, `failed` or `indeterminate`.
- `GET`, `PATCH` and `DELETE` on `/v1/posts/{id}` read, reschedule and cancel. `GET /v1/posts?status=scheduled` lists posts.

### List the Library

```bash
curl "https://app.hermoso.ai/v1/library?type=video&limit=10" -H "$H" -H "X-Hermoso-User: <brand id>"
```

Every image and video the brand has made, newest first. Each item has `url` (a durable public file), `type`, `poster_url`, `model` and `created_at`. `type` is `image`, `video` or `all`; `limit` is 1 to 60.

### Research competitor ads

```bash
# One advertiser's ads from the Meta Ad Library
curl -X POST https://app.hermoso.ai/v1/tools/pull_competitor_ads \
  -H "$H" -H "Content-Type: application/json" \
  -d '{"companyName": "Liquid Death", "country": "US", "limit": 20}'

# Keyword search across all Meta advertisers
curl -X POST https://app.hermoso.ai/v1/tools/search_meta_ads \
  -H "$H" -H "Content-Type: application/json" \
  -d '{"query": "protein pancakes", "status": "ACTIVE", "mediaType": "VIDEO", "limit": 10}'

# An open question across brands and platforms, answered with a written synthesis (30-60 seconds)
curl -X POST https://app.hermoso.ai/v1/tools/research_ads \
  -H "$H" -H "Content-Type: application/json" \
  -d '{"query": "the longest-running sleep supplement ads on Meta and the angles they use"}'
```

- A tool call answers with `text` (a sentence for a model) and `data` (the structured result).
- `search_google_ads` (by `domain` or `advertiserId`) and `search_linkedin_ads` (by `company`, `keyword` or `companyId`) cover the Google and LinkedIn libraries.
- Add `"get_cost": true` to any of these for the price without running it.
- An argument the tool does not take is never silently dropped: a likely misspelling is refused with `400 invalid_arguments` and a `did_you_mean`.

### Find other tools

```bash
curl "https://app.hermoso.ai/v1/tools?search=google%20ads%20keyword&limit=10" -H "$H"
curl https://app.hermoso.ai/v1/tools/plan_ad -H "$H"
```

By default the list leaves out tools whose account the brand has not connected. `include=all` lists them too, each with `available: false` and a `connect_url`.

## Rate Limits and Credits

- A free plan is available.
- Generation and ad library research spend credits. Price a render with `POST /v1/generations/quote`, or a tool call with `"get_cost": true`. `GET /v1/credits` returns the balance and plan.
- A call that cannot be paid for answers with `error.type` `insufficient_credits`. The account owner can cap a brand's monthly spend; a capped call answers 429 with `error.code` `credit_limit`.

## Tradeoffs

- Renders are asynchronous: poll `GET /v1/jobs/{id}` or register a callback URL.
- An API key carries full account authority, so the API is server-side only. Use a key limited to one brand when an agent works on one brand.
- Connecting a social or ad account needs a person to complete the platform's OAuth screen in the app, or through a link from `POST /v1/connect-links`.
- Tool arguments change as tools improve. Read the schema from `GET /v1/tools/{name}` rather than hard-coding it.
- For other routes to the same jobs: [AdMakeAI](admakeai.md) and [HeyGen](heygen.md) for ad creative, [Post Bridge](post-bridge.md) and [Buffer](buffer.md) for scheduling, and [Meta Ads](meta-ads.md) or [Google Ads](google-ads.md) for campaigns without a creative tool.

## Notes for Agents

- Publishing is outward-facing. A post without `scheduled_at` or `use_queue` goes out immediately, so post only what the user approved or asked to post.
- Send an `Idempotency-Key` on every call that spends credits or publishes. A replay returns the original response for 24 hours, and a replayed render returns the job as it is now.
- Ad campaigns built through the tools are created paused. Activating spend and deleting need `"confirm": true`, so confirm the exact target with the user first.

## Relevant Skills

- **ad-creative**: writing and generating ad creative and variations
- **ads**: building and reading paid campaigns
- **social**: scheduling and publishing organic posts
- **video**: generating video ads
- **competitor-profiling**: researching what competitors are running
