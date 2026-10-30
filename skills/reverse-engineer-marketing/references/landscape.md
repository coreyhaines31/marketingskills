# Landscape Mode

Compare three to five competitors side by side before tearing any one of them down. A single teardown shows what one company did. A landscape shows what the whole category does, which plays are table stakes, which are one company's bet, and where nobody is playing.

## Contents
- When to run it
- Run the comparison
- Read the matrix
- Add the paid and hand-read columns
- Pick who to tear down
- The landscape deliverable

---

## When to Run It

- The user names several competitors, or asks "what is everyone in my category doing?"
- Before a full teardown, to pick the company most worth studying.
- When the user has no clear lead competitor and needs to see the field first.

Use three to five competitors. Fewer than three gives no pattern; more than six becomes noise.

## Run the Comparison

```bash
node <skill-dir>/scripts/teardown.mjs compare a.com b.com c.com --you yours.com --out teardowns/landscape/matrix.csv
```

For each domain, `compare` reads, all for free:

- **Homepage scripts:** ad pixels, analytics, testing, referral, and lifecycle tools (from `stack`'s signatures, current homepage only)
- **DNS:** marketing email platforms, ad and social account verifications, and the platforms behind marketing subdomains
- **Sitemap:** page families with 10 or more pages (templates, integrations, compare, customers, a localized site)
- **Hiring:** the marketing channels on a public Greenhouse, Lever, or Ashby board (from `jobs`)

It returns:

| Field | Meaning |
|---|---|
| `everyone` | Signals every competitor shows. Table stakes in this category |
| `most` | Signals at least half of them show |
| `only_one` | Signals one company shows and the rest don't. Each is a bet, worth checking in a full teardown |
| `you_missing` | Signals at least half of them show and the user doesn't (needs `--you`) |
| `you_only` | Signals the user shows and no competitor does |
| `profiles` | Per company: headline, likely industry, sitemap size, top page families, open roles by function |

The CSV is the full matrix: one row per signal, one column per domain.

## Read the Matrix

- **Table stakes the user lacks** are the first gaps to close, but only when they make sense for the user's stage. Every competitor running a Meta pixel says the channel is normal here, not that the user should start tomorrow.
- **One company's bet** is the most interesting row. Check whether that company is growing faster than the rest (same-vendor traffic estimates, or `adoption` for developer tools). A bet plus faster growth is the teardown to run first.
- **Nobody does it** is an open lane or a dead end. A missing page family might be untapped search demand, or it might have been tried and dropped. Check `sitemap-growth` or Wayback for a family that once existed and was removed, and check search volume, before calling it an opportunity.
- **Hiring rows lead the rest.** A competitor hiring for SEO or partnerships today will show those page families or programs in three to six months.
- **Signals are Observed; strategy is Inferred.** "Has a Meta pixel" is Observed. "Runs Meta ads" needs the ad library. "Meta ads drive their growth" needs a full teardown.

## Add the Paid and Hand-Read Columns

`compare` covers what's free and fast. Add these columns by hand or with the user's tools, labeled with source and date:

| Column | Source |
|---|---|
| Traffic estimate and 12-month trend | One vendor for every company (DataForSEO, Semrush, Ahrefs, or Similarweb) |
| Non-brand share and top page family by traffic | The same SEO tool |
| Active ads per network | `sc-ads` or the ad library links from `ads` |
| AI answer share of voice | The prompt tracker from stage 2, same prompt set for all |
| Pricing: entry price, free plan, trial | Each pricing page, on the same date |
| Review count and rating | `reviews` for app stores; G2, Capterra, or Trustpilot by hand |
| Positioning | The `headline` from each profile, side by side |

## Pick Who to Tear Down

Rank the competitors by: growth rate (same vendor), the number of `only_one` bets they hold, and closeness to the user's buyer. Recommend one company for a full teardown and say why in one line.

## The Landscape Deliverable

`teardowns/landscape/landscape.md`:

1. **The field:** one line per company with headline, traffic trend, and open roles
2. **Table stakes:** what everyone does, and which of these the user lacks
3. **Bets:** each company's unique signals, with whether that company is growing faster
4. **Open lanes:** what nobody does, each checked against search demand and Wayback
5. **Where each one is weak:** the top complaint or gap per company (see [weak-spots.md](weak-spots.md))
6. **Recommendation:** the company to tear down first, and the one gap to close this month, with the skill that runs it
