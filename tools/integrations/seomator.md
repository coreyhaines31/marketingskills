# SEOmator

Open-source SEO audit engine (MIT) that runs on your own machine as a CLI and an MCP server. It checks a page or a small crawl against a few hundred rules across technical SEO, content, structured data, performance, security headers, accessibility, and AI-search readiness, and scores the result.

Facts below were checked against the [repository](https://github.com/seo-skills/seo-audit-skill) at version 8.0.1 on 2026-11-23.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | - | Runs locally; no hosted API |
| MCP | ✓ | Local server over stdio, registered as `seomator-audit` |
| CLI | ✓ | `seomator`, from the npm package `@seomator/seo-audit` |
| SDK | ✓ | The same package can be imported in Node |

## Install

```bash
npm install -g @seomator/seo-audit
seomator audit https://example.com
```

Needs Node 20 or later. Core Web Vitals and JavaScript-rendering checks use the Chrome, Chromium, or Edge already on the machine.

## Authentication

None. It fetches public pages from your machine.

## MCP Setup

```bash
claude mcp add seomator-audit -- npx -y @seomator/seo-audit mcp
```

The server refuses addresses that resolve to loopback, private, or link-local networks unless started with `--allow-private`. Add that flag only to audit a local or intranet site.

## Common Agent Operations

```bash
# One page
seomator audit https://example.com

# With Core Web Vitals measured in a browser
seomator audit https://example.com --cwv

# Only some categories
seomator audit https://example.com -c core,security,perf

# A small crawl
seomator audit https://example.com --crawl --max-pages 20

# Output an agent can read
seomator audit https://example.com --format json -o results.json
seomator audit https://example.com --format llm

# What a rule checks and how to fix it
seomator explain <rule-id>
```

Exit codes: `0` pass, `1` a gate failed, `2` the run could not happen. That makes it usable as a CI check.

## How to Read the Output

- A check the tool couldn't take a reading for is reported as **not measured**, with the reason (for example "needs a browser render"). Don't count those as passes or as failures.
- The score is the tool's own weighting of its rules. Use it to compare the same site over time, not as a ranking prediction.
- New rules are advisory until the project adds them to the score.

## Limits

- A crawl is sized for an audit: 10 pages by default and up to 1,000 per run. It is not a full-site crawler for large sites.
- It has no search-traffic data. Pair it with Google Search Console for queries, impressions, and indexing.
- Browser renders load the page's own resources without the private-network check that plain fetches have.

## When to Use

- A repeatable technical audit an agent can run with no account and no cost
- A check in CI that fails a build when a page breaks a chosen rule
- A second reading next to a crawler or a hosted audit

## When Not to Use

- Large sites that need every URL crawled: use a dedicated crawler
- Backlink, keyword, or traffic questions: use an SEO data tool or Search Console

## Note on Skill Names

The repository also ships an agent skill named `seo-audit`, the same name as this library's skill. Installing both gives an agent two skills with one name. This guide covers the CLI and MCP server only.

## Relevant Skills

- **seo-audit**: the audit method this tool can supply readings for
- **ai-seo**: its AI-readiness checks (bot access, `llms.txt`, semantic HTML)
- **schema**: its structured data checks

## Links

- [Repository and README](https://github.com/seo-skills/seo-audit-skill)
- [npm package](https://www.npmjs.com/package/@seomator/seo-audit)
