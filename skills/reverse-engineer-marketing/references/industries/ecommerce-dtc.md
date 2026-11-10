# Ecommerce and DTC: Teardown Pack

Load this pack when the target sells physical products online, direct to consumers: Shopify and other storefronts, subscription brands, and sellers on Amazon or TikTok Shop. Growth here is a creative and margin game: paid social creative volume, offer structure, repeat purchase, and the catalog itself.

## Contents
- How to recognize it
- What drives growth here
- Signals to collect
- Going inside
- Rules that limit copying
- Plays that usually transfer
- Metrics to ask about

---

## How to Recognize It

- `/products/`, `/collections/`, and `/cart` paths in the sitemap; a `myshopify.com` CNAME or Shopify scripts (`cdn.shopify.com`).
- Ecommerce apps in `teardown.mjs stack <domain>`: Klaviyo, Attentive, Postscript, Yotpo, Okendo, Recharge, Rebuy, Gorgias.
- Meta and TikTok pixels plus a heavy Meta ad library presence.
- `teardown.mjs detect <domain>` and `teardown.mjs shopify <domain>` confirm a Shopify store.
- **Sub-type:** a "Subscribe and save" option means subscription economics; Amazon store links or "Buy on Amazon" mean marketplace sales matter; TikTok Shop links mean creator-led commerce.

## What Drives Growth Here

- **Creative volume:** on Meta and TikTok, the brands that grow ship many new ads a week and keep the few that work. Count new creatives, not only running ones.
- **Offer and margin:** bundles, free-shipping thresholds, subscription discounts, and gift-with-purchase raise order value enough to pay for ads. The offer often matters more than the product page.
- **Repeat purchase:** email and SMS flows, subscriptions, and replenishment timing decide whether paid acquisition is profitable.
- **The catalog:** new product drops, colorways, and limited editions create reasons to come back and fresh creative. Launch cadence is a growth lever.
- **Marketplaces and retail:** Amazon, TikTok Shop, and later retail stores add reach but change the margin story. Check where sales are moving.

## Signals to Collect

| Signal | Where or how | What it shows |
|---|---|---|
| ★ Full catalog with publish dates | `teardown.mjs shopify <domain>` (public `/products.json` on most Shopify stores) | Launch cadence, price changes, discount depth (compare-at prices), and catalog growth. Each drop becomes a move |
| ★ Best-seller order | `teardown.mjs shopify <domain>` (best-selling sort of the all-products collection) | Which products carry the business, without any estimates |
| Installed apps | `teardown.mjs stack <domain>` and `shopify` | Their retention, reviews, upsell, and subscription stack, dated by first capture |
| ★ Sale calendar | `teardown.mjs hero <domain>` and archived homepage captures | Every sale, discount depth, and free-shipping change by date. Becomes moves |
| New creatives per week | `teardown.mjs sc-ads <brand>` or the Meta Ad Library, by start date | Creative velocity and the formats they keep (UGC, founder, static, partnership ads) |
| Longest-running ads | Ad libraries sorted by start date | Hooks and offers they keep paying for: worth testing, though their performance is unknown |
| Partnership and whitelisted ads | Meta "Paid partnership" labels and creator handles on ads | Creator-led paid social, and which creators they pay |
| Review count per product | Product pages and review app widgets, over time | A sales proxy per product; spikes suggest review requests or sampling |
| Email and SMS capture offer | The popup on first visit | The discount or gift they use to capture subscribers |
| Amazon presence | The brand's Amazon store, review counts, and rank shown on listings | How much of the business moved to Amazon, and its review velocity |
| TikTok Shop | ScrapeCreators TikTok Shop endpoints, the shop page | Creator affiliate sales and product rank on TikTok |
| Affiliate and creator codes | Searches for "[brand] code", coupon sites, creator link pages | Which creators and sites drive sales, and the standard discount |
| Shopping ads | Google Shopping results for their category terms | Whether they compete on Google, and on which products |
| ★ Discount depth over time | `shopify` compare-at prices, plus the sale calendar | Whether growth is bought with discounting; rising sale share often precedes margin trouble |
| ★ Wholesale and retail shift | A `/wholesale` page, Faire listing, or stockist page, and retailer announcements | The move from DTC-only to retail, which changes the growth story (load the retail or CPG pack too) |

## Going Inside

With approval, under the user's real identity, and with a purchase budget the user sets:
- **Email and SMS capture:** subscribe through the popup with the dedicated inbox. Log the welcome series, its discount, and timing. Opt in to SMS only with the user's own number and approval.
- **Cart abandonment:** add to cart, start checkout with the email, and leave. Log every reminder and whether the discount grows.
- **Checkout:** screenshot order bumps, shipping thresholds, payment options (buy now, pay later), and the post-purchase upsell page.
- **Purchase (funnel hack):** buy once within budget to see the thank-you page offer, the post-purchase flow, the packaging inserts, and the review request timing.
- **Returns:** read the returns policy; return an item only under the published policy and only if the user wants to.
- Don't place orders you intend to cancel to probe inventory, and don't exploit coupon stacking bugs.

## Rules That Limit Copying

- **FTC Endorsement Guides (US):** creator and affiliate content needs clear disclosure. Copy the creator program, with disclosures.
- **FTC rule on fake reviews and testimonials (2024):** no buying, faking, or suppressing reviews. Review incentives must follow platform rules.
- **SMS:** the TCPA in the US requires prior express written consent for automated marketing texts, some states (Florida, Oklahoma) add their own rules, and carriers enforce messaging standards. Copy the flow, with compliant opt-in.
- **Subscriptions:** the FTC's 2024 click-to-cancel rule was vacated by the Eighth Circuit in July 2025, but ROSCA and state automatic renewal laws (California's amended law took effect July 1, 2025) still require clear terms, consent, and easy cancellation for subscribe-and-save.
- **Pricing claims:** "was" and "compare at" prices must reflect real prior prices under the FTC Guides Against Deceptive Pricing (16 CFR Part 233) and state law, and California and other states have sued over fictitious reference prices. Check with counsel before copying reference pricing.
- **Product claims:** health, supplement, and cosmetic claims fall under FTC and FDA rules. Don't copy a competitor's claim without your own substantiation.
- **Platform policies:** Meta and TikTok ad policies restrict before-and-after images and some product categories.

## Plays That Usually Transfer

| Play | Run it with |
|---|---|
| High-volume creative testing with proven hooks | **ad-creative**, **ads** |
| Email capture popup and welcome offer | **popups**, **emails** |
| Cart abandonment and post-purchase flows | **emails**, **sms** |
| Bundles, thresholds, and subscribe-and-save | **offers**, **pricing** |
| Creator and affiliate program | **influencer-marketing**, **referrals** |
| Product drop and sale calendar | **launch**, **marketing-plan** |
| Collection and category pages for search | **programmatic-seo**, **seo-audit** |
| Product page and checkout conversion | **cro** |

## Metrics to Ask About

- **Blended CAC and MER:** total marketing spend divided by new customers, and revenue divided by total marketing spend.
- **Contribution margin per order:** revenue minus product, shipping, payment, and ad costs.
- **Average order value:** revenue per order, and what raises it.
- **Repeat purchase rate:** share of customers who buy again within a set window.
- **Customer lifetime value:** gross margin per customer over a set period.
- **Subscription churn:** monthly cancellations and skips for subscription products.
- **Creative hit rate:** share of new ads that reach a spend or ROAS threshold.
