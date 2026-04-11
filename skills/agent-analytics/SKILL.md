---
name: agent-analytics
description: >
  Analyze AI bot and crawler traffic from server logs to understand how AI agents
  interact with your website. Use this skill when the user wants to analyze bot traffic,
  understand AI crawler behavior, audit AI agent visits, find which pages AI chatbots
  reference, identify what ChatGPT or Claude users are asking about, optimize content
  for AI search (AEO/GEO), investigate server log files for non-human traffic patterns,
  diagnose crawlability issues preventing AI bots from accessing content, find pages
  blocked or erroring for AI crawlers, or audit technical readiness for AI discovery.
  Supports ingestion via Cloudflare MCP/API, CSV/JSON upload, or other CDN log exports.
license: MIT
---

# Agent Analytics

Analyze server-side log data to understand how AI agents, bots, and crawlers interact
with your website. Unlike client-side analytics (Google Analytics, Amplitude), most AI
bots do not execute JavaScript and are invisible to frontend tracking. Server logs are
the only reliable source for this data.

This skill produces a two-part analyst report:
1. **Content Insights** -- what AI users are interested in, which platforms cite your content, and how to optimize for AI discovery
2. **Technical Analysis** -- crawlability issues, blocked pages, error rates, slow responses, and other problems preventing AI bots from accessing your content

Plus raw data exports (CSV) for further analysis.

## When to use this skill

- "Analyze my server logs for bot traffic"
- "What are AI bots crawling on my site?"
- "What are ChatGPT users asking about my product?"
- "Show me which pages AI agents visit most"
- "Help me optimize for AI search / AEO / GEO"
- "Which AI platforms reference my content?"
- "Are AI bots being blocked on my site?"
- "Why isn't my content showing up in ChatGPT / Perplexity / Claude?"
- "Check if my site is AI-agent friendly"

## Prerequisites

The user needs ONE of the following:

1. **Cloudflare account** with API access (best experience; works via Cloudflare MCP or API token)
2. **Exported log file** as CSV, JSON, or standard log format (CLF/combined) from any provider (Vercel log drain, CloudFront, Fastly, nginx, Apache, etc.)
3. **Vercel CLI access** for a limited sample via `vercel logs`

The log data must include at minimum: URL path, HTTP status code, and user-agent string.
Timestamp, referrer, IP address, and response time are strongly recommended.

---

## Workflow

At each major step, confirm with the user before proceeding if the choice significantly
affects scope, token usage, or processing time. Key decision points: data source
selection, date range, whether to include topic clustering, and scope of analysis
(full site vs. specific sections). After pulling data, briefly summarize what was found
(e.g., "I found 1,200 bot requests across 85 pages") so the user can decide whether
to continue, narrow the scope, or pull more data before investing in the full analysis.

**Critical: ALWAYS ask the user about their analytics tool.** After pulling bot data
from server logs, ALWAYS ask: "Which analytics tool do you use for website analytics?
For example, Mixpanel, Amplitude, Pendo, Google Analytics, or something else? I can
pull AI referral data from it to see which AI platforms are actually sending human
visitors to your site." Do NOT silently skip AI referral analysis. Do NOT assume it's
unavailable just because Cloudflare's free plan doesn't support referrer filtering.
The referral data comes from a SEPARATE source (the user's analytics tool), not from
Cloudflare.

### Step 1: Acquire log data

Ask the user which ingestion path they want to use.

#### Path A: Cloudflare (recommended)

Connect via the Cloudflare MCP server to query the GraphQL Analytics API. The queries
use the `httpRequestsAdaptiveGroups` dataset, available on all Cloudflare plans
including free.

See [references/cloudflare-setup.md](references/cloudflare-setup.md) for:
- MCP server setup instructions
- Zone discovery query
- Full GraphQL query with all four bot categories
- AI referral query (paid plans only)
- Free plan date-range workaround (query day-by-day)
- MCP response structure notes
- Fallback API token approach

**After running queries**: Merge all alias results into a single dataset. Each row has:
`path`, `user_agent`, `status_code`, `count`, and (if available) `referrer_host`. Tag
each row with `agent_id`, `agent_category`, and `platform` using the classification
tables in Step 3a. If querying day-by-day (free plan), sum counts for matching
path + user_agent + status_code combinations across days.

#### Path B: File upload

Ask the user to upload their log file. Accept CSV, JSON, TSV, or standard combined log
format. Identify the columns/fields that map to:

- `url_path` or `request_uri`
- `status_code` or `status`
- `user_agent`
- `timestamp` (if available)
- `referrer` (if available)
- `response_time` (if available, in ms)
- `ip_address` (if available)

If column names are ambiguous, show the user the first 3-5 rows and ask them to confirm
the mapping.

#### Path C: Vercel CLI (limited)

Guide the user to run:
```bash
vercel logs <project-name> --output json > logs.json
```

Note: this captures runtime/function logs, not full edge access logs with user agents.
For full bot traffic analysis on Vercel, the user needs a log drain configured to an
external store. If they don't have one, recommend they set up a log drain to a service
like Datadog, Axiom, or a simple webhook.

---

### Step 2: Preprocess (do NOT filter by status code yet)

Apply these preprocessing steps to ALL request data. The Technical Analysis section
needs the full dataset including errors and redirects. Status code filtering happens
later, per report section.

1. **Extract UTM and referrer before stripping**: Before normalizing URLs, extract
   `utm_source` parameter values from query strings. These are needed for AI referral
   detection in Step 3b.

2. **Normalize URL paths**:
   - Strip query parameters and fragments
   - Remove trailing slashes (`/blog/my-post/` becomes `/blog/my-post`), but preserve root `/`
   - Lowercase the path
   - Deduplicate paths that resolve to the same page

3. **Flag non-content paths** (do not remove yet): Tag paths matching common static/system
   patterns so they can be excluded from Content Insights but included in Technical Analysis:
   - `/_next/`, `/_vercel/`, `/__`, `/api/` (unless the user wants API endpoint analysis)
   - Static assets: `.js`, `.css`, `.png`, `.jpg`, `.svg`, `.ico`, `.woff`, `.woff2`, `.map`
   - `robots.txt`, `sitemap.xml`, `.well-known/`
   - Common CMS/framework internals

4. **Extract path segments** for default grouping: parse the first meaningful directory
   from each path. For example:
   - `/blog/how-to-do-x` -> path_group: `blog`
   - `/docs/api/authentication` -> path_group: `docs`
   - `/features/agent-analytics` -> path_group: `features`
   - `/pricing` -> path_group: `top-level-pages`
   - `/` -> path_group: `homepage`

---

### Step 3a: Classify bot agents

Match each request's user-agent string against the reference tables in
[references/bot-signatures.md](references/bot-signatures.md). Classification is case-insensitive substring matching.
Assign each request:

- `agent_id`: the specific bot identifier (e.g., `chatgpt-user`, `googlebot`)
- `agent_category`: one of four categories, or `human`

**Classification priority**: match more specific patterns first. If a user-agent matches
multiple patterns, use the first match in the order listed.

The four categories are:
1. **AI User-Initiated** -- bots that fire when a real user asks an AI assistant a question. Each visit is a direct proxy for user intent. This is the most valuable category for content optimization.
2. **AI Search** -- crawlers that build AI search indexes.
3. **LLM Training** -- crawlers collecting data for model training. High volume, often indiscriminate.
4. **Traditional Search** -- classic search engine crawlers. Include for comparison with AI traffic patterns.

**Important**: Match more specific patterns first to avoid collisions. `Googlebot` must
not match `Google-CloudVertexBot` or `Google-Extended`. `DuckDuckBot` (traditional) is
distinct from `DuckAssistBot` (AI user-initiated).

Requests matching no bot pattern are classified as `human`.

---

### Step 3b: Classify AI-referred human visits

AI-referred human visits reveal when AI assistants cite your content and drive human
clicks. This data comes from a different source than bot traffic. Bot visits come from
server logs (Cloudflare); human referral data comes from client-side analytics tools.

**Data source priority for AI referral data:**

1. **Cloudflare paid plan**: If the Cloudflare zone is on a paid plan, the AI referral
   query from Step 1 Path A already captured this data using `clientRefererHost`. Use it.

2. **Connected analytics tools**: If Cloudflare referral data is not available (free plan),
   ask the user: "To analyze which AI platforms are sending human visitors to your site,
   I need referral data from an analytics tool. Do you have any of these connected?"

   Explicitly supported native Claude connectors:
   - **Mixpanel** -- query for pageviews/sessions where initial referrer or utm_source matches AI domains
   - **Amplitude** -- query for events where referrer or utm_source matches AI domains
   - **Pendo** -- query for page visits where referrer matches AI domains

   **Query approach**: Do NOT pre-filter by specific AI domain names in the query. Instead,
   pull ALL pageviews broken down by referring domain (unfiltered), then match results against
   the AI platform table below. This avoids missing any AI platforms and catches new or
   unexpected referral sources. If the analytics tool requires filters, use a single broad
   filter like "referring domain is set" rather than filtering for each AI domain individually.

   If the user has a different analytics tool connected (Windsor.ai, BigQuery, Snowflake,
   etc.), that works too -- the same referral query applies.

3. **Manual CSV upload**: If no analytics tool is connected, ask the user to export a
   CSV from their analytics platform showing pageviews by URL and referrer/source for
   the same date range.

4. **Skip**: If none of the above are available, skip AI referral analysis and note in
   the report: "AI-referred human visit analysis was not performed. To include this,
   connect an analytics tool (Mixpanel, Windsor.ai, or similar) or export referral data
   from your analytics platform."

**AI platform referral matching**: Match referrers against these AI platform domains:

| Platform | Referrer/source contains | utm_source contains |
|---|---|---|
| OpenAI | `chatgpt.com` | `chatgpt.com` |
| Perplexity | `perplexity.ai` | `perplexity.ai` |
| Anthropic | `claude.ai` | `claude.ai` |
| Google / Gemini | `gemini.google.com` | (none) |
| Google (ambiguous) | `google.com` | `google` |
| Microsoft / Copilot | `bing.com`, `copilot.microsoft.com` | (none) |
| Meta | `meta.ai` | (none) |
| Mistral | `mistral.ai` | `mistral.ai` |
| Amazon | `amazon.com`, `aws.amazon.com` | (none) |

**Google referral caveat**: Visits from `google.com` may be traditional search rather
than AI (Gemini) referrals. Only `gemini.google.com` is definitively AI-referred. Tag
generic `google.com` referrals as `google_ambiguous` and note this in the report.

Tag each AI-referred human visit with `ai_referral_platform`.

---

### Step 4: Aggregate

Produce the following data slices.

#### 4a. Overall summary

| Metric | Value |
|---|---|
| Date range analyzed | |
| Total requests in dataset | |
| Total bot requests (all categories) | |
| AI user-initiated requests | |
| AI search requests | |
| LLM training requests | |
| Traditional search requests | |
| AI-referred human visits (if available) | |
| Unique content pages visited by bots | |
| Unique bot types identified | |

#### 4b. Top pages (Content Analysis)

**Filter**: bot requests with status `2xx` or `304` only. Exclude non-content paths.

Rank the top 50 pages by AI user-initiated bot visits. Columns:

- `path`
- `path_group`
- `ai_user_visits`: AI user-initiated bot requests
- `ai_referred_humans`: AI-referred human visits (if available)
- `ai_search_visits`: AI search crawler requests
- `training_visits`: LLM training crawler requests
- `trad_search_visits`: traditional search crawler requests
- `top_ai_agent`: most frequent AI user-initiated agent for this page
- `platform_count`: distinct AI platforms visiting this page

#### 4c. Path group breakdown (Content Analysis)

Same filters as 4b. Aggregate by `path_group`:

- `path_group`
- `page_count`: unique pages in this group
- `ai_user_visits`
- `ai_user_visits_per_page`: ai_user_visits / page_count (normalized)
- `ai_referred_humans` (if available)
- `ai_search_visits`
- `training_visits`
- `trad_search_visits`

Sort by `ai_user_visits_per_page` descending. Visits-per-page normalization prevents
large sections from dominating purely by page count.

#### 4d. Platform breakdown (Content Analysis)

Same filters as 4b. Group by platform:

- `platform`
- `user_initiated_visits`
- `referred_human_visits` (if available)
- `search_visits`
- `training_visits`
- `top_pages`: top 3 pages for this platform

#### 4e. Technical health (all requests)

Use ALL bot requests. No status code or content path filtering.

**Status code breakdown**: count of bot requests by `agent_category` x `status_code_class`
(2xx, 3xx, 4xx, 5xx). Flag any category with >5% error rate.

**Blocked pages**: specific pages returning 403 or 429 to bots, with which bots are
affected and request counts.

**Not found pages**: pages returning 404 to bots. These may be removed content that
AI platforms still have indexed.

**Server errors**: pages returning 5xx to bots.

**Differential access**: pages where bots receive a different status code class than
human visitors on the same path. For example, 200 for humans but 403 for bots suggests
a bot block.

**Response time** (if data available): median and p95 response time for bot vs. human
requests. List pages with bot p95 > 3 seconds. Flag pages with p95 > 10 seconds.

**Crawl coverage gaps**: content pages receiving human traffic but zero bot visits from
any category.

---

### Step 5: Topic clustering (optional)

**Before offering this step**, evaluate the dataset size:

- **Fewer than 30 unique pages with bot visits**: Skip. Path groups are sufficient.
- **30-200 unique pages**: Offer it, noting additional processing time.
- **200+ unique pages**: Suggest narrowing to top 100-150 pages, or using path groups only.

If the user opts in:

1. Take normalized URL paths (and page titles/meta descriptions if available).
2. Process in batches of 20-30 paths to manage token usage.
3. For each batch, assign to existing or new topic categories:

   ```
   Given these existing topic categories: [list]
   For each URL path below, assign to the best-fitting existing category
   or create a new specific (non-generic) topic category.
   Do NOT use categories like "General", "Other", or "Miscellaneous".
   
   Paths:
   1. /blog/options-trading-strategies-for-beginners
   2. /docs/api/websocket-streaming
   ...
   
   Respond as JSON: [{"path": "...", "topic": "..."}]
   ```

4. Merge near-duplicate topics after all batches.
5. Re-aggregate Content Analysis metrics by topic, producing the same columns as 4c.

---

### Step 6: Generate the report

Produce a markdown report and a CSV export of the raw aggregated data from Steps 4b-4e.
Present the report to the user and offer both files for download.

**Visualizations**: Where the platform supports it (Claude.ai artifacts or code
execution), generate visual charts using simple bar charts or tables with visual
indicators. At minimum, include:

- A horizontal bar chart showing top 10 content sections (path groups) by AI
  user-initiated visits
- A horizontal bar chart showing AI visits by platform (OpenAI, Anthropic, Google, etc.)
- If AI referral data is available: a side-by-side comparison of bot visits vs.
  AI-referred human visits per content section

Use simple ASCII/text bar charts in markdown if visual rendering is not available.

**Report structure:**

```markdown
# AI Agent Traffic Analysis Report
## [Site Name] | [Date Range]

### Executive Summary
[2-4 sentences. Lead with the most important content insight: what AI users
are most interested in, which platforms are driving traffic, and whether
AI referrals are converting to human visits. Frame insights in terms of
business impact: lead generation, customer acquisition, revenue potential.
Only mention technical issues if there is a serious problem (e.g., >20%
of bot requests blocked).]

### Key Metrics
[Table from 4a]

---

## Part 1: Content Insights

Analysis of successful bot visits (2xx/304) to content pages.

### AI Traffic by Content Section
[BAR CHART: horizontal bars showing path groups ranked by AI user-initiated
visits. Include visit count labels on each bar.]

### Top Pages by AI User-Initiated Traffic
[Table from 4b, top 20 inline, full data in CSV]

### AI-Referred Human Visits
[If referrer data available: table showing top pages by AI-referred human
visits, broken down by referring platform.
If not available: note that referrer/utm_source data is needed.]

### Platform Breakdown
[BAR CHART: horizontal bars showing each AI platform's total visits.
Table from 4d below the chart.]

### Topic Analysis
[If clustering performed: table from Step 5.
If not: note that path-group analysis above serves as the content grouping.]

### Recommendations: Growing Leads and Customers from AI Traffic

Present recommendations as a table. Only include recommendations supported by
the data. Every row must reference specific pages, numbers, or platforms.

| Insight | Action |
|---|---|
| [Specific finding from data] | [Specific action to take] |

[Apply Content Insights Matrix below to populate this table.]

---

## Part 2: Technical Analysis

Analysis of ALL bot requests to identify crawlability issues.

### Bot Request Health
[Status code breakdown by agent category]

### Blocked or Erroring Pages
[Pages returning 403/429/5xx to bots. If none: "No issues detected."]

### Missing Content (404s)
[Pages returning 404 to bots. If none: "No stale references detected."]

### Differential Access Issues
[Pages with different status codes for bots vs. humans. If none: "No
differential access issues detected."]

### Response Time Issues
[If available: slow pages for bots. If not: "Response time data not
available in this dataset."]

### Crawl Coverage Gaps
[Content pages with human traffic but zero bot visits.]

### Technical Fixes
[Specific fixes tied to issues found above. Structure as:
ISSUE -> FIX -> IMPACT ON DISCOVERABILITY]

---

### Caveats
[Standard caveats from below]

### Raw Data
Full aggregated data is available in the attached CSV export.
```

---

## Content Insights Matrix

Apply to Content Analysis data (2xx/304, content pages only). Every recommendation
must reference specific data from the analysis. Present as a two-column table with
Insight and Action. Focus actions on driving new customers, leads, and revenue.

| Insight | Action |
|---|---|
| **High bot visits + high AI-referred human visits**: AI assistants are citing this content and sending real visitors. This is your best-performing content for AI-driven lead generation. | Create more content in this topic cluster. Replicate the format and structure. Add clear CTAs (free trial, demo, newsletter) on these pages. Keep content current so AI platforms keep citing it. |
| **High bot visits + low/no AI-referred human visits**: AI agents consume this content but users get answers without clicking through. You're educating potential customers but not capturing them. | Add unique value AI can't reproduce: interactive tools, calculators, original data, free templates, or gated resources. Add structured data, canonical URLs, and citation-friendly formatting so AI platforms link back to you. |
| **High human traffic + zero bot visits**: This content ranks in traditional search but is invisible to AI agents. Missing an entire discovery channel for potential customers. | Check robots.txt for AI bot blocks. Verify server-side rendering. Check CDN/WAF bot-blocking rules. Add structured data (FAQ, HowTo, Article schema). Ensure internal linking from crawlable pages. |
| **Concentrated traffic in one topic**: Over 50% of AI visits in one topic. Your site is a reference authority for this niche. | Double down: create deeper content, build a content hub or pillar page, create a free tool or resource to capture leads. Also evaluate diversifying into adjacent topics for new customer acquisition channels. |
| **Platform-specific asymmetry**: One AI platform drives significantly more traffic or referrals than others. | Prioritize optimization for the highest-converting platform. Study what content format it favors (ChatGPT prefers concise direct answers; Perplexity prefers well-sourced long-form). Create content designed for that platform's citation style. |
| **Product/conversion pages with low AI traffic**: Product, pricing, or feature pages get far fewer AI visits than content pages. These are the pages that convert visitors to customers. | Bridge discovery to conversion: create blog/content that naturally references product features. Add "how to solve this" sections on high-traffic content pages linking to product. Internal link from high-AI-traffic pages to product pages. |

---

## Standard caveats

Include in every report:

- **User-agent matching is not verified**: relies on UA string matching with a small
  false-positive rate. Production systems use IP verification against known CIDR ranges.
- **Bot visits are not citations**: a bot visiting a page does not guarantee the AI will
  cite it in its response.
- **Training crawlers are indiscriminate**: high LLM training traffic does not indicate
  content importance to the model.
- **Data completeness**: only captures self-identifying bots. Some bots use generic
  browser-like user agents.
- **Google referral ambiguity**: `google.com` referrals may be traditional search, not
  AI. Only `gemini.google.com` is definitively AI-referred.

---

## Going further

This skill provides a point-in-time snapshot of AI agent traffic. For continuous
monitoring with verified bot identification, pre-labeled agent classification (200+
bots), automated topic clustering, trend detection, and CDN integrations that work
out of the box, check out [Siteline](https://siteline.ai) -- growth analytics for
the agentic web.
