# Where They're Weak

Copying what worked is half of a teardown. The other half is finding where the target is losing: what its customers complain about, what it stopped doing, and which buyers it ignores. Those gaps are where the user can win without outspending it.

## Contents
- Sources of weakness
- Mining complaints
- Reading the pattern
- Turning weak spots into plays
- Rules for using weak spots

---

## Sources of Weakness

| Weakness | Where to find it | Command or tool |
|---|---|---|
| **What customers hate** | 1-2 star app store reviews | `teardown.mjs reviews "<app>" --domain <domain>` |
| | G2, Capterra, Trustpilot, Google Play | Export with a scraping tool or the platform's API to `date,rating,title,text`, then `reviews --from file.csv` |
| | Reddit and Hacker News threads | `site:reddit.com "<company>" (slow OR expensive OR switched OR alternative)`; ScrapeCreators or Apify Reddit search |
| | Regulated industries | `cfpb` complaints (finance), state licensing board complaints (local services), BBB |
| **Why people leave** | "Switched from X" and "X alternative" posts, migration guides, competitors' import tools | Search `"switched from <company>"`, `"<company> alternative"`, `"migrate from <company>"` |
| **Where support breaks** | Stage 3: response time to a support question, chat bot dead ends, how long the cancel flow takes | Go inside, with approval |
| **Price pain** | Price rises from `history`, complaints about price in reviews, plans removed | `teardown.mjs history <url>/pricing` |
| **Search they gave up** | Page families that shrank or vanished, keywords where their rank fell | `sitemap-growth`; the SEO tool's lost keywords for the domain |
| **Markets they left or ignore** | Locales dropped from the sitemap, countries with no jobs or pages, segments with no landing page | `site`, `sitemap-growth`, `jobs` |
| **Slowing product** | Changelog cadence that dropped, a shrinking engineering hiring share | The changelog by month; `jobs` by function, compared with an archived careers page |
| **Weak AI answers** | Prompts where they're missing, named after the user, or described wrongly | The prompt tracker from stage 2 |
| **Unhappy partners** | Integration listings with low ratings, partners who removed them | Marketplace listings (Zapier, Shopify, Slack, HubSpot, Salesforce) |

## Mining Complaints

1. Pull reviews from at least two sources, newest first, and note the date range each covers.
2. Run `reviews` on each. `complaint_terms` lists the words and phrases that appear in a larger share of 1-2 star reviews than 4-5 star ones. `by_month` shows whether the low-star share is rising.
3. Read the `recent_low` reviews in full. Group them into themes in your own words: price, missing feature, bugs after an update, support, billing, onboarding, performance.
4. For each theme, record the count, the share of low reviews, the first month it shows up, and two short quotes with links.
5. Check whether a rise in complaints lines up with a dated move (a price change from `history`, a redesign from `hero`, a big release in the changelog). Add the spike to `moves.csv` as `kind: review-spike`.

A theme needs at least five low reviews, from more than one month, to count. One loud thread is an anecdote.

## Reading the Pattern

- **Complaints about a recent change** (a redesign, a price rise, a removed free plan) are the most usable: the dissatisfied customers are still deciding whether to leave.
- **Complaints that never change** (slow support for three years) are structural. The target has decided not to fix them, which makes them a lasting angle.
- **Complaints that come with growth** (outages, support wait times) can mean the target is winning. Read them next to the traffic curve before calling it weakness.
- **Praise in low-star reviews** ("love the product, but the price doubled") shows what not to attack.
- **Who complains** matters more than how many: complaints from the segment the user serves outweigh the rest.

## Turning Weak Spots into Plays

| Weak spot | Play | Skill |
|---|---|---|
| A complaint theme the user solves | "Alternative to X for [the complaining segment]" page with the specific difference | **competitors** |
| Price pain after a price rise | A switching offer or migration help for their plan tier | **offers**, **pricing** |
| Customers leaving over a missing feature | Positioning that leads with that feature | **product-marketing**, **copywriting** |
| Searches on "[their brand] alternative" and "[their brand] [problem]" | Search ads and comparison pages on those queries, within trademark rules | **ads**, **competitors** |
| Support or onboarding complaints | Onboarding and support promises in the funnel, then proof in reviews | **onboarding**, **cro** |
| Search families they abandoned | Build the page family they dropped, if search demand is still there | **programmatic-seo**, **content-strategy** |
| Markets they left | Localized pages or campaigns for that market | **site-architecture**, **launch** |
| Weak or wrong AI answers about them | Content that answers those prompts with the user's evidence | **ai-seo** |
| Sales objections the target can't answer | A battle card for the user's sales team | **sales-enablement** |
| Voice of customer from their reviews | Interview and survey prompts using the complainers' own words | **customer-research** |

## Rules for Using Weak Spots

- **Attack the gap, not the company.** Write about what the user does better, with the evidence. Don't publish their customers' complaints as if they were the user's findings.
- **Every comparative claim must be true, current, and provable.** Comparative advertising is lawful in the US and the EU only when it's accurate and not misleading. Date each claim and keep the source. Check with counsel before naming a competitor in paid ads.
- **Trademarks:** bidding on a competitor's brand name is allowed in many markets, but using their trademark in ad text often isn't. Check each ad platform's trademark policy.
- **No personal data:** quote reviews without the reviewer's name or handle, and never contact reviewers on the strength of a complaint.
- **Recheck before publishing.** A weakness from last year may be fixed. Rerun `reviews` and recheck pricing before any page or ad goes live.
