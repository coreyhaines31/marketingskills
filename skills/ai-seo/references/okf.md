# Open Knowledge Format (OKF)

Google's v0.1 markdown spec for representing site content as an agent-readable bundle. Introduced on the [Google Cloud blog](https://cloud.google.com/blog/products/data-analytics/how-the-open-knowledge-format-can-improve-data-sharing) on 2026-06-12 and shipped inside Knowledge Catalog.

## What it is

OKF is a directory of cross-linked markdown files. Each file has:

- A YAML frontmatter block (`type` required; `title`, `description`, `resource`, `tags`, `timestamp` recommended)
- A standard markdown body
- Standard markdown links to other files in the bundle (which the spec treats as concept relationships)

An optional `index.md` lists the files for progressive disclosure. The bundle can be distributed as a git repo (recommended), a tarball/zip, or a subdirectory of a larger repo.

The [full spec](https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/HEAD/okf/SPEC.md) fits on one page. The repo lives under `GoogleCloudPlatform` (the "not an official Google product" disclaimer is Google's standard open-source boilerplate, not a denial — it appears on most of Google's open-source repos including their main AI samples repo).

### A minimal concept file

```markdown
---
type: Article
title: How to Connect the Ahrefs MCP Server to Manus
description: The official MCP servers, why they did not connect, and the fix.
resource: https://yoursite.com/blog/ahrefs-mcp-manus/
tags: [mcp, ahrefs]
---

# How to Connect the Ahrefs MCP Server to Manus

The body of the post, as clean markdown.
```

Add an `index.md` that lists all files so an agent can see the bundle's shape before opening each file, and that is the entire format.

## Honest framing

**Google built OKF for data teams sharing catalog metadata** — BigQuery tables, API endpoints, metrics, playbooks. Most of the spec's examples are data-team artifacts, not blog posts. Google's blog post framing: "improve data sharing" and "standardized documentation" for collaboration across teams.

Pointing OKF at a marketing site is a **clever repurposing** popularized by [Suganthan Mohanadasan](https://suganthan.com/blog/open-knowledge-format/). It's a legitimate use case for the format but not Google's primary one. Frame it accurately when explaining it to founders or marketing teams.

## What it does for AI search today

Nothing immediate. Nothing crawls the web for OKF bundles yet — the spec is weeks old, no AI engine has announced integration, and Knowledge Catalog ingests bundles only for paying enterprise customers' data teams.

Treat OKF as **protocol-layer registration** — the same shape of bet as early `schema.org` adoption was a decade ago. Schema took the better part of ten years to pay off; people who shipped it early are still glad they did.

A secondary benefit that pays off today regardless: **generating the bundle is itself an internal-linking audit**. Suganthan's tool draws every page as a node and every internal link as an edge, so islands and orphans become obvious at a glance.

## Where OKF fits in the agent-readable stack

| Layer | Purpose |
|---|---|
| `sitemap.xml` | Tells a crawler which URLs exist |
| `robots.txt` (with AI bot rules) | Permits or blocks AI crawlers |
| `llms.txt` | Points an agent at the handful of pages you most want read |
| `/pricing.md` | Structured pricing for agent-buyer comparisons |
| **`/okf/` bundle** | Hands over the content itself as cross-linked concepts |
| Schema markup | Per-page structured data (Article, FAQPage, Product, etc.) |

These stack rather than compete. `llms.txt` is a signpost, OKF is the library.

## How to ship one

Three options, ordered by how much effort they take:

### 1. Suganthan's free web tool (recommended for most sites)

[suganthan.com/okf-generator](https://suganthan.com/okf-generator/) — paste a URL or sitemap, crawls up to 100 pages, returns a downloadable bundle. Also draws the resulting page graph so you can spot disconnected pages before publishing.

### 2. WordPress plugin (pending wp.org approval)

Suganthan's plugin (free, GPL, awaiting wp.org approval at time of writing) installs in a minute, serves the bundle at `/okf/`, and rebuilds on every publish or edit so it stays in sync. Direct download link is in [his blog post](https://suganthan.com/blog/open-knowledge-format/). Requires WordPress 6.0+ and PHP 7.4+. Read-only — never edits posts or settings.

### 3. By hand

Only practical for a handful of pages. Each post becomes a markdown file with frontmatter that you cross-link manually. Miserable for a whole site.

## Hosting & discovery

Serve the bundle at `yoursite.com/okf/`, starting with `yoursite.com/okf/index.md`:

- **Static hosts / Cloudflare**: drag and drop
- **WordPress**: Suganthan's plugin handles the serving
- **Static sites with custom paths**: upload the directory to `/okf/`
- **Closed platforms (Wix, Squarespace, most page-builders)**: you usually can't serve files at custom paths — skip OKF entirely

After it's serving, add a line to `llms.txt` pointing to the bundle so agents that read `llms.txt` (today) can discover the bundle (later).

## When to skip

- Site is <10 pages — overhead exceeds payoff
- Site is on a closed platform that won't allow custom paths
- You're not maintaining `llms.txt`, schema markup, or other machine-readable files (OKF compounds with those; alone it does nothing)
- You can't budget the 30 minutes a quarter to refresh the bundle as content changes

## What to watch

OKF is v0.1, weeks old. Worth tracking, not worth obsessing over:

- Whether Google announces OKF support in AI Overviews / Knowledge Graph (currently no signal)
- Whether non-Google engines (ChatGPT, Perplexity, Claude) announce OKF reading
- Whether the spec moves to v1.0 (breaking changes are possible at <1.0)
- Whether Knowledge Catalog adds public ingestion endpoints
- Adoption signals — search GitHub for `okf/index.md` to see who's shipping bundles
