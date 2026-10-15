# Prospecting and Outreach

How to build a prospect list, qualify it, write outreach people answer, and track it so nobody gets pitched twice.

## Building the List

Start from the target page and work outward:

1. **Competitor link gap.** Pull referring domains for the three to five pages that outrank the target page. Domains that link to two or more competitors but not to you are the warmest prospects (Ahrefs Link Intersect, Semrush Backlink Gap, or a DataForSEO backlinks comparison).
2. **AI-cited pages.** Run the target prompts and record the third-party pages engines cite. Add every one that discusses the category.
3. **Tactic searches.** Unlinked mentions, resource pages, broken links, and "best X" lists, using the searches in [tactics.md](tactics.md).
4. **Relationships.** Partners, integrations, customers, vendors, and event organizers.

Deduplicate by domain and keep the specific page with each domain, because outreach is about a page.

## Qualifying

Score each prospect before writing. Drop anything that fails the first two.

| Check | Pass | Fail |
|---|---|---|
| **Relevance** | Readers could plausibly need the product, or the page covers the category | Unrelated topic, whatever its domain rating |
| **Legitimacy** | Real organic traffic, named authors, editorial standards | Outbound links mostly unrelated commercial anchors, "write for us" on every topic, link prices listed |
| **AI citation** | Engines cite this page for the target prompts | Not cited (doesn't fail, just scores lower) |
| **Value to the target page** | A link here would reach a page that needs authority | Would only link the homepage |
| **Reachability** | A named person owns the page | Only a generic form |

Domain rating and similar scores are third-party estimates. Use them to sort, never as the qualifying test.

## Writing Outreach

Rules that apply to every tactic:

- **Lead with their page.** Name the page and what you noticed on it. If you can't name something specific, the prospect isn't qualified yet.
- **One ask.** Pick one: a link, an update, or an evaluation.
- **Make it easy.** Give the exact URL and, for a fix, the exact location on their page.
- **Offer something real** when you have it: a data point for their article, a fixed broken link, an expert quote, a free account to evaluate. Never offer money for a followed link.
- **Keep it under 100 words.** Editors skim.
- **One follow-up**, about a week later. Then stop. See **cold-email** for sending limits, deliverability, and opt-out handling.

### Unlinked mention

```
Subject: Thanks for including [brand] in [article title]

Hi [name],

Thanks for mentioning [brand] in "[article title]". The line about [specific detail] was spot on.

Would you link the mention to [specific URL]? It covers [what the reader gets there], which fits that section.

[sender name]
```

### Broken link

```
Subject: Broken link on [page title]

Hi [name],

The link to [dead resource name] in your "[page title]" section on [their page] returns a 404.

If you want a replacement, our [asset name] covers the same [topic], updated for [year]: [URL]. Either way, wanted you to know.

[sender name]
```

### "Best X" evaluation

```
Subject: [product] for your [list title]

Hi [name],

Your "[list title]" is one of the guides people use to choose a [category] tool. We're [product], built for [specific audience and use case].

If you update it, I can send a free account, pricing, and screenshots so you can judge it yourself.

[sender name]
```

### Resource page

```
Subject: A resource for your [page title] page

Hi [name],

Your [page title] page lists [type of resources] for [audience]. Our [asset name] ([URL]) is a free [what it is] that [what it does for that audience].

If it fits the list, I'd be glad to see it there.

[sender name]
```

Rewrite each draft for the specific page. Templates sent unchanged read as templates.

## Tracking

Keep one sheet so nobody is contacted twice and results can be measured:

| Column | What goes in it |
|---|---|
| Domain and page | The exact URL |
| Tactic | Mention, broken link, list, resource, partner, guest |
| Target page | Which of your pages the link should go to |
| AI-cited? | Yes or no, and for which prompt |
| Contact | Name, role, how found |
| Status | Qualified, drafted, approved, sent, followed up, replied, placed, declined |
| Dates | Sent, followed up, placed |
| Result | Link (followed, nofollow, sponsored), mention only, or none |

The **marketing-loops** backlink-prospecting loop reads this sheet as its state, so a weekly run can skip anyone already contacted.
