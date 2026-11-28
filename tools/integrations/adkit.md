# AdKit

Ad campaign management and reporting on Meta, Google, TikTok, Reddit and LinkedIn through an MCP server and a CLI. X has campaign and ad group reads and writes. Microsoft, Pinterest and ChatGPT Ads have account setup and raw API requests only. AdKit also searches a library of competitor ads from Meta, Google and LinkedIn, and generates ad images. Changes are saved as drafts by default, and a draft goes live only when someone publishes it.

Commands below were checked against the `--help` output of `@adkit/cli` 1.13.61 and the [AdKit docs](https://adkit.so/docs) on 2026-11-28. The read-only calls (`status`, `manage meta results`, `manage drafts list`, `library advertisers search`, `library ads --advertiser`, and the `adkit_manage` results call below) were also run live that day.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | - | No public REST reference. Scripts use the CLI, or the MCP server with an API key |
| MCP | ✓ | Remote server at `https://mcp.adkit.so` (Streamable HTTP). Clients sign in with OAuth or send an API key as a Bearer token |
| CLI | ✓ | `@adkit/cli` on npm. Output is JSON when stdout is not a terminal, or with `--json` |
| SDK | - | Use the CLI or the MCP server |

## Authentication

- **Projects**: a project is one brand or client, with its own connected ad accounts. Every call acts on one project.
- **MCP clients**: OAuth sign-in in the browser. The sign-in expires after 90 days without use. To sign in again, run `/mcp` in Claude Code.
- **API key**: after install (see [CLI](#cli)), `adkit setup` opens a browser and the CLI stores a key locally. To create a key by hand, open [Devices & Keys](https://app.adkit.so/settings/devices) in the dashboard. CLI keys don't expire.
- **Env vars**: the CLI reads `ADKIT_API_KEY` for the key and `ADKIT_PROJECT_ID` for the project. MCP clients that take headers send `Authorization: Bearer <key>`.
- **Picking a project**: the CLI acts on the active project (`adkit projects use <id>`) unless a command passes `--project <id>`. Over MCP, call the `adkit_projects` tool first (tool list in [MCP server](#mcp-server)).
- **Access levels**: each MCP sign-in and each API key has one of four levels: Disabled, Read-only, Draft only, or Draft + Publish. The project sets the default, and a single key can have its own level in [Devices & Keys](https://app.adkit.so/settings/devices). New projects start on Draft + Publish.

## Setup

### MCP server

```bash
claude mcp add --transport http adkit https://mcp.adkit.so
```

Then run `/mcp` in Claude Code and finish the sign-in in the browser. For unattended runs, send a key instead:

```bash
claude mcp add --transport http adkit https://mcp.adkit.so \
  --header "Authorization: Bearer $ADKIT_API_KEY"
```

In Claude.ai or Claude Desktop, add `https://mcp.adkit.so` as a custom connector (paid Claude plans only), then sign in. In ChatGPT, turn on Developer mode, then add it as a new app under Settings → Apps. Clients that only take a stdio command can run `npx -y mcp-remote https://mcp.adkit.so`.

After sign-in, every client gets the same tools:

| Tool | What it does |
|------|--------------|
| `adkit_projects` | List, create and select projects |
| `adkit_status` | Connected platforms and ad accounts for the project |
| `adkit_manage` | Read and edit campaigns, ad sets or ad groups, ads, keywords and drafts on each platform. `entity: "results"` returns performance |
| `adkit_library` | Search advertisers and their ads in the ad library, keep a watchlist, save ads to boards |
| `adkit_studio` | Generate ad images from a prompt or a reference ad |
| `adkit_integrations` | Read GA4, Search Console and Merchant Center data for the project |
| `adkit_upload_file` | Upload an image or video file to an ad platform |
| `adkit_help` | Field names and per-platform limits |

### CLI

```bash
npm install -g @adkit/cli
adkit setup                    # opens a browser to sign in, then stores a key
adkit status                   # connected platforms and ad accounts
adkit projects list
adkit projects use <project id>
adkit help --search "keyword planner"   # find the command for a job
```

`adkit <command> --help` prints the flags for any command, and `--help full` prints every field.

## Common Agent Operations

The examples use the CLI. Each command maps to one MCP tool call. For example, `adkit manage meta results ads --period 7d` is:

```json
{ "tool": "adkit_manage", "platform": "meta", "entity": "results", "action": "list", "params": { "level": "ads", "period": "7d" } }
```

Call `adkit_help` with `{ "path": "manage meta" }` for a platform's entities and field names.

### Read performance

```bash
# Meta: one row per campaign for the last 30 days
adkit manage meta results

# Meta: the 10 ads with the highest spend in one campaign, last 7 days
adkit manage meta results ads --campaign-ids 123 --period 7d --sort spend --limit 10

# Meta: daily rows by age group
adkit manage meta results adsets --period 7d --breakdowns day,age

# Google Ads: the search terms that triggered your ads
adkit manage google results search-terms --period 30d --sort cost --limit 50
```

- Each entity also has `list` and `get` commands, for example `adkit manage meta campaigns list`. They return configuration only (names, status, budgets). Spend, clicks and conversions come from `results`.
- Each platform has its own `results` command: `adkit manage tiktok results`, `adkit manage reddit results`, and so on.
- Meta reports are cached for up to 30 minutes. Add `--refresh` for fresh numbers.
- `--period` takes `3d`, `7d`, `14d`, `28d`, `30d`, `90d` or presets such as `last_month`. Use `--from` and `--to` (`YYYY-MM-DD`) for other ranges.

### Change a campaign (as a draft)

```bash
# Saved as a draft, nothing changes on Meta yet
adkit manage meta campaigns update <campaign id> --status paused

# Review what is waiting
adkit manage drafts list --platform meta --limit 10

# Publish after the user approves. This is the step that changes the live account
adkit manage drafts publish <draft id>
```

- Every create and update command saves a draft unless it gets `--publish`.
- A person can review drafts at `https://app.adkit.so/manage/drafts?open=<draft id>`.
- `drafts delete <id>` removes a draft. A published draft is kept as a record and can't be deleted.

### Create a campaign

```bash
adkit manage meta campaigns create --name "Spring Sale" --objective sales --budget-daily 50
```

`--objective` takes `traffic`, `awareness`, `engagement`, `leads`, `sales` or `app_promotion`, and `--budget-daily` is in the ad account's currency.

A campaign holds ad sets, and an ad set holds ads, so create them in that order. `adkit manage meta adsets --help` and `adkit manage meta ads --help` list the fields. Other platforms follow the same order, with ad groups in place of ad sets. On Reddit, configure the account's profile, pixel and funding defaults first (`adkit manage reddit accounts --help`).

### Research competitor ads

```bash
# Find the advertiser
adkit library advertisers search "liquid death"

# Its ads, with the highest estimated spend first
adkit library ads --advertiser <advertiser id> --sort spend --limit 20

# Advertisers similar to the active project
adkit library advertisers similar
```

- `--platform` takes `meta`, `google` or `linkedin`, and `--format` takes `image`, `video`, `carousel` or `text`.
- `--min-days 60` keeps ads that have run for at least 60 days. Advertisers usually stop ads that lose money, so a long-running ad is likely one that works. It is a signal, not proof.
- Spend is an estimate, and some ads have none. A missing spend figure does not mean low spend, so sort by `longest` or filter with `--min-days` too.

### Generate an ad image

```bash
adkit studio generate --instructions "The product on a kitchen counter in morning light" --aspect 4:5 --wait
adkit studio generate --ref library-ad:<ad id> --mode clone --wait
```

`--mode` takes `create`, `clone`, `edit` or `resize`. `--ref` takes a file uploaded to Studio (`media:<id>`, see `adkit studio media --help`), an ad saved to a board (`swipe:<id>`), a library ad (`library-ad:<id>`) or a local file (`file:./hero.png`).

### Send a raw platform API request

```bash
adkit manage platform-api-requests --platform tiktok --endpoint "campaign/get/" --method GET \
  --payload '{"advertiser_id":"123"}' --request-description "List TikTok campaigns" --account 123
```

The `adkit manage <platform>` commands above use the same field names on every platform. This command sends a request in the platform's own API format instead, for endpoints those commands don't cover. A person has to turn it on in [Agent Permissions](https://app.adkit.so/settings/permissions) first; the agent can't. Recognized read-only requests run immediately. Other methods create a draft unless they get `--publish`.

## Platform Coverage

- **Meta, Google, TikTok, Reddit, LinkedIn**: campaigns, ad sets or ad groups, ads and results. Google adds `keywords` (including negative keyword lists), `asset-groups` for Performance Max, `conversions`, `research` (Keyword Planner) and `change-history`. Google Display is in beta.
- **X**: accounts, and campaign and ad group reads and writes.
- **Microsoft, Pinterest, ChatGPT Ads**: account setup and raw API requests only.

## Pricing

Paid plans start at $29 per month, with a 7-day free trial and a free demo of 50 actions. See [pricing](https://adkit.so/pricing).

## Tradeoffs

- Connecting an ad account needs a person to complete the platform's OAuth screen in the AdKit dashboard.
- Changes are saved as drafts, so there is one more step before anything goes live. With a Draft only key, the agent can't publish at all, and a person publishes from the dashboard.
- For Microsoft, Pinterest and ChatGPT Ads, the agent has to know each platform's endpoints and payloads, because AdKit only passes the raw request through.

Alternatives for the same jobs:

- One platform's own API: [Meta Ads](meta-ads.md), [Google Ads](google-ads.md), [LinkedIn Ads](linkedin-ads.md), [TikTok Ads](tiktok-ads.md).
- Meta, TikTok and LinkedIn Ads across client profiles: [Adeli](adeli.md).
- Reporting only: [Supermetrics](supermetrics.md).
- Ad research: [AdSpy](adspy.md).

## Notes for Agents

- Publishing changes live ads and can spend money. Publish only what the user approved, and name the exact draft before you do.
- If an agent only reports, give it a Read-only key. AdKit refuses every change from that key and says why, so the agent can't change an account by mistake.
- Write commands take `--account <ad account id>`. AdKit picks the account on its own only when the project has one account on that platform. Run `adkit status` first, and pass `--account` when there are more.
