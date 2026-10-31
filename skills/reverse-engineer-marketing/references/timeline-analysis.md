# Finding What Moved the Curve

Stage 7 in full. It needs no new data, only the two spine files, and it runs through `scripts/teardown.mjs moves`. It shows which moves lined up with growth speeding up. It can't show which moves caused it.

## Contents
- Inputs
- What the script computes
- Reading the output
- Confounders to name

---

## Inputs

**`moves.csv`**, one row per dated move:

| Column | Values |
|---|---|
| `date` | `YYYY-MM-DD` (use the 1st of the month if only the month is known) |
| `channel` | search, ai, paid, x, youtube, tiktok, instagram, linkedin, reddit, creators, sponsorship, pr, events, product-loop, referral, pricing, lifecycle, sales, infrastructure, hiring, launch |
| `kind` | launch, raise, founder-post, creator-video, ad-start, sponsorship, loop-first-seen, page-family, subdomain, tool-added, positioning-change, pricing-change, content-format, review-spike, reported-claim, hire |
| `move` | One line: what happened |
| `reach` | Views, likes, or score, if any |
| `link` | The evidence URL |
| `evidence` | Observed or Inferred |

**`traffic.csv`**: `month,visits,brand_searches`, one row per month, from one vendor for the whole series. Leave `brand_searches` blank if you don't have it. Blank cells and missing months are treated as gaps, never as zero, and a month listed twice is an error.

## What the Script Computes

```bash
node scripts/teardown.mjs moves --moves moves.csv --traffic traffic.csv --out moves-vs-growth.csv
```

- **Growth:** month-over-month change in visits (and brand searches), in percent.
- **Clusters:** a move within 42 days of the previous one joins its cluster. Credit goes to the cluster as a whole.
- **Lift per cluster:** average growth over the three months starting with the cluster's month, minus the average over the three months before, in percentage points. Calculated for visits and brand searches separately. It needs all six months: a cluster near either end of the series, or next to a gap, gets no lift rather than a partial one.
- **Top clusters:** the three with the largest visit lift.
- **Leading channel:** for each channel, Spearman rank correlation between its monthly move count and growth in the same month, one month later, and two months later. Under 18 months of data or under 6 moves on the channel, the script returns "too few to call" instead.

Output is JSON: `clusters`, `top`, and `leading`. `--out` also writes the clusters as CSV.

## Reading the Output

- **Top clusters:** name every move in each. The lift is Observed, as numbers. The claim that the moves drove it is Inferred.
- **Leading channel:** a channel whose activity correlates with growth one or two months later is a lead worth testing, not a finding. Monthly data and overlapping moves make it weak evidence.
- **Visits vs brand searches:**
  - Brand searches up, visits flat → the move created demand that arrived some other way (direct, AI answers, word of mouth).
  - Visits up, brand searches flat → look at non-brand search pages or paid.
  - Both up → demand and capture moved together, which is typical after a launch or a viral moment.
- **High reach, no lift:** posts or campaigns that spread widely and moved nothing. They're good candidates for the plays-to-skip list.
- **Before vs after the inflection:** moves that started before it are stronger candidates than moves that started after, which may be a result of growth (more budget, more hires).

## Confounders to Name

Every report of lift lists the ones that apply:

- A funding round or press wave in the same months
- A category-wide surge (check the curves of two peers with the same vendor)
- Seasonality (compare the same month a year earlier)
- A vendor estimate change (a sudden jump across many domains at once)
- A domain move, a redesign, or a big site migration
