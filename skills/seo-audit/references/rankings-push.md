# Rankings Push

Audits find what's broken. This reference covers the next step: moving pages that already rank onto page one, and shipping new pages so they start strong. Both are cheaper than winning a query from nothing, because Google has already decided the site is relevant.

## Find the candidates

From Search Console, pull query + page pairs for the trailing 28 days (compare with the previous period to filter out spikes):

| Bucket | Filter | Fix type |
|--------|--------|----------|
| **Striking distance** | Average position 8–20, impressions above a floor that fits the site (often 100+/month) | Content and links |
| **Weak click-through** | Position 1–5, CTR well below other pages at similar positions | Title and meta description |
| **Near the top** | Position 4–7 on a revenue query | Content, links, and featured-snippet format |

Prioritize by business value: a position-11 query that drives demos beats a position-9 glossary term with three times the impressions.

Before touching a page, check for **cannibalization**: if two of your pages rank for the same query, positions often bounce between them and neither climbs. Pick one owner, merge the useful parts of the other into it, and redirect.

## Diagnose against the top three

Open the three results above you and write down, for each one, the concrete reason it wins. Usually one of these:

- **Intent match.** They answer the question the searcher is asking; your page answers a neighboring one. A pricing query answered with a features page loses.
- **A missing section.** They cover a sub-question you skip. The People Also Ask box and the subheadings across the top results show what searchers expect.
- **Freshness.** Their facts, screenshots, or year are current and yours aren't.
- **Format.** They have the table, steps, or tool the query calls for.
- **Links.** They're linked from more, and stronger, pages, inside their site and out.

If you can't name a reason, don't guess with a rewrite. The gap is more likely authority than on-page, and the fix is links (the `backlink-prospecting` loop in `marketing-loops`) rather than content.

## Make the smallest change that closes the gap

- **Answer the query in the first two sentences**, then expand. This is also the passage AI Overviews and assistants tend to quote.
- **Add the missing section**, not a rewrite of the whole page. Pages that already rank have signals worth keeping.
- **Put the query in the title and H1** if it reads naturally. If the title is already aligned, leave it.
- **Add internal links to the page** from your strongest related pages, with anchor text that describes the target. This is often the biggest single lever and the most neglected.
- **Refresh what's stale**: facts, screenshots, the year, broken links.
- **For weak click-through only**, change the title and meta description and nothing else, so the result is attributable. Patterns in [title-tags.md](title-tags.md).

Record the starting position, impressions, and CTR, then wait 3–4 weeks before judging or changing the page again. Rankings take time to settle after an edit, and stacked changes make it impossible to know what worked.

If two rounds move nothing, stop editing. The page is probably limited by intent mismatch (Google wants a different kind of page) or authority, and more on-page work won't fix either.

## Shipping a new page

A new page should launch with everything it needs to be found, so it doesn't spend months as an orphan:

- [ ] Internal links from at least three relevant existing pages, with descriptive anchors
- [ ] Unique title and meta description matching the target query
- [ ] One H1, aligned with the title
- [ ] Self-referencing canonical
- [ ] Added to the XML sitemap
- [ ] Structured data where the page type supports it (see `schema`)
- [ ] Main content present in the server-rendered HTML, not only after JavaScript runs
- [ ] Indexable: no stray `noindex`, not blocked in robots.txt
- [ ] Linked to the right conversion path (see `cro`)

After it ships, request indexing once in Search Console. Requesting again doesn't speed anything up. If the page isn't indexed after a few weeks, check the causes in the Indexation section of the audit instead of resubmitting.

## Run it on a schedule

The striking-distance push loop in `marketing-loops` runs this weekly with state, cooldowns, and a stop rule. The SEO operator recipe in the same skill combines it with the other SEO loops.
