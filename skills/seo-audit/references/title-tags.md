# Title Tags

How to write and audit titles for both rankings and clicks. The title is the strongest on-page relevance signal you control and the first thing a searcher reads, so it has two jobs. It has to match the query, and it has to win the click against nine other results.

## Start from the results page

Search the page's target query before writing. The titles already ranking tell you three things:
- **The format Google rewards** for this query: lists, guides, tools, product pages, comparisons.
- **The words searchers expect to see**: modifiers like "best," "free," "template," "vs," a year, a number.
- **The gap**: what every title promises, and what none of them do.

Match the format, use the expected words, and differentiate on the gap. A how-to title on a query where every result is a tool page loses no matter how well it's written.

## Default structure

```text
[Primary query] + [what makes this result worth clicking] + [brand, if it helps]
```

- **Query first.** Put it in the first few words, where both the ranking and the reader's scan start.
- **Then the reason to click**: a number, a specific outcome, a scope ("for Shopify stores"), freshness, or a format ("free template").
- **Brand last**, and only where it earns the space. A well-known brand adds clicks; an unknown one mostly adds truncation risk.
- **About 50–60 characters.** Google truncates by pixel width, not characters, so keep the important words in the first 50.

## Pattern by page type

Pick the page type first, then the pattern. Don't blend two patterns in one title unless the results page does.

| Page type | When | Pattern |
|-----------|------|---------|
| Product / feature | Commercial query for what you sell | `[Category] for [Audience] \| [Brand]` |
| Pricing | "[brand] pricing," "[category] cost" | `[Brand] Pricing: Plans and Costs` |
| Comparison | "X vs Y" | `[A] vs [B]: [the deciding difference]` |
| Alternatives | "[competitor] alternatives" | `[N] Best [Competitor] Alternatives ([Year])` |
| Listicle | "best [things]" | `[N] Best [Things] for [Audience] in [Year]` |
| How-to | Task query | `How to [Task]` or `How to [Task] Without [Obstacle]` |
| Definition | "what is [term]" | `What Is [Term]? [Short payoff]` |
| Guide / pillar | Broad topic | `[Topic]: A Complete Guide for [Audience]` |
| Template / tool | "[thing] template," "[thing] calculator" | `Free [Thing] [Template/Calculator] ([Format])` |
| Troubleshooting | Error or problem query | `How to Fix [Problem]` or `[Error]: What It Means and How to Fix It` |

Only use "free," a year, or a number when the page delivers on it. A "2026" title on a page last updated in 2024 is a promise the content breaks.

## Keep the set consistent

- **Title, H1, URL slug, and meta description** should all describe the same topic. They don't need identical wording, but a reader moving from the title to the page should never wonder whether they landed in the right place.
- **Every title is unique.** Duplicates split relevance and usually mean a template is filling in the same string everywhere.
- **Don't change slugs** to chase a year or a number. Change the title; leave the URL and its links alone.

## Google rewrites titles

Google replaces the title tag with its own text in a meaningful share of results, usually taking it from the H1 or anchor text. It does this most often when a title is:
- Much longer than the display width
- Stuffed with keywords or repeated boilerplate ("| Brand | Brand Blog | Home")
- Out of line with the page's H1 or content
- Generic ("Home," "Products," "Untitled")

If Search Console or a live search shows a different title than the one you wrote, treat it as a signal: tighten the title and align it with the H1.

## Fixing low click-through

A page in the top five with a click-through rate well below other pages at the same position has a title or description problem, not a content problem. Compare it to the results around it and rewrite to:
- State the specific outcome or answer, not the topic
- Add the qualifier the searcher is filtering for (audience, platform, price, format)
- Remove words that add length without meaning ("Ultimate," "Complete Guide to the Many...")

Change one page at a time and record the baseline CTR, so a gain is attributable. Allow 3–4 weeks before judging.

## Common fixes

| Problem | Before | After |
|---------|--------|-------|
| Says nothing | `Home` | `Invoicing Software for Freelancers \| Acme` |
| Bloated | `The Ultimate Complete Guide to Everything About Email Deliverability` | `Email Deliverability: 12 Fixes for Inbox Placement` |
| Wrong page type | `Plans That Grow With You` | `Acme Pricing: Plans and Costs` |
| Brand first on an unknown brand | `Acme \| Project Management for Agencies` | `Project Management for Agencies \| Acme` |
| Promise the page breaks | `Free CRM Templates` (one paid template) | `CRM Template for Small Teams (Google Sheets)` |

## Bulk audits

Work from a crawl export (URL, title, H1, length, indexable status) and, if available, Search Console queries per page. Return changes as a table the owner can approve line by line:

```markdown
| Page | Current title | Proposed title | Reason |
|------|---------------|----------------|--------|
| /pricing | Plans That Grow With You | Acme Pricing: Plans and Costs | Matches the "acme pricing" query |
```

Give 2–3 options only for the pages that matter most (top revenue pages, top-5 rankings with weak CTR). For the long tail, one proposal per page keeps the review fast.
