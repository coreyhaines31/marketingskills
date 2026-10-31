# Retail: Teardown Pack

Load this pack when the target sells through physical stores, alone or alongside online: chains, omnichannel retailers, and franchise retail. Growth here comes from opening the right stores, filling them, and linking online and in-store behavior through loyalty and local search.

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

- A store locator with many locations and a page per store (`/stores/<city>`, `/locations/<state>/<city>`).
- "Buy online, pick up in store", store inventory checks, or "in stock at your store" on product pages.
- A loyalty program and a mobile app linked from the site.
- Job posts for store managers, district managers, and real estate or site selection roles.
- For franchises: a `/franchise` or "Own a franchise" page.
- `teardown.mjs detect <domain>` flags store locators and location page families.

## What Drives Growth Here

- **Store openings:** new locations are the main growth lever, so the store count over time is the growth curve. Pace, regions, and formats (small format, outlet) matter.
- **Same-store sales:** growth in existing stores comes from traffic and basket size, driven by promotions, assortment, and loyalty.
- **Local search:** shoppers search "near me". Store pages, Google Business Profiles, and local inventory decide who gets the visit.
- **Loyalty and the app:** loyalty data drives personalized offers and repeat visits. App installs and loyalty sign-ups are key moves.
- **Franchising:** growth may be franchise sales, so the franchise recruitment funnel is a second marketing engine.

## Signals to Collect

| Signal | Where or how | What it shows |
|---|---|---|
| ★ Store count over time | The store locator and its archived captures; `teardown.mjs sitemap-growth <domain>` on the location pages | Opening pace and regions. Each batch of openings becomes a move |
| ★ Store openings in job posts | Job posts for new store staff, by city, dated | Openings before they're announced |
| Location page quality | A sample of store pages: hours, inventory, events, schema | The local SEO engine (see **schema**) |
| Google Business Profiles | Review counts, ratings, and reply rate per location, via the official Google Places API or by hand | Local reputation by store; never use a Maps scraper |
| Weekly circular cadence | The circular or deals page and its archive | The promotion calendar and discount depth; promotions become moves |
| Loyalty program | The loyalty page and its archived versions | Rewards structure and when it changed |
| App store rank and reviews | App Store and Google Play pages (see **aso**) | How hard they push the app and how it's received |
| Local inventory ads | Google Shopping results with "in store" labels | Whether they push store pickup through search |
| ★ Store closures | Locator captures and FDD Item 20 tables | Closures hide behind net store counts; gross openings and closures show the real pace |
| ★ Retail media network | A "media" or "advertise with us" page aimed at brands | Whether they run a retail media business, which funds discounts |
| Events and in-store experiences | Store event pages and social posts | Traffic drivers beyond price |
| ★ Franchise disclosure documents | The franchise page, plus the FDD from state franchise databases (California, Wisconsin, Minnesota, and others publish them) | Item 19 financial performance representations (if included), unit counts and openings and closures by year (Item 20), and fees. Real numbers, often for years back |
| Real estate and expansion news | Press, local news on new leases, real estate job posts | Where they're heading next |

## Going Inside

With approval, under the user's real identity:
- **Loyalty sign-up:** join with the dedicated inbox. Log the welcome offer, points rules, and the email and push cadence.
- **App:** install, screenshot onboarding, permission requests (location, notifications), and the first offer.
- **Buy online, pick up in store:** within budget, test the flow and the pickup experience.
- **Store visit:** if the user or their team visits in person, photograph public displays only where store policy allows. Note signage, QR codes, and loyalty prompts at checkout.
- Don't photograph staff or customers, and don't question store staff under false pretenses.

## Rules That Limit Copying

- **Pricing and promotions:** "was" prices and sale claims must follow FTC guidance and state law on reference pricing. Check with counsel before copying claims.
- **Loyalty and data:** state privacy laws (CCPA and CPRA in California, and others) cover loyalty data and financial-incentive notices. Copy the program with the notices.
- **SMS and app push:** TCPA rules apply to marketing texts.
- **Franchise sales:** the FTC Franchise Rule requires a disclosure document, and some states require registration. A competitor's franchise marketing can't be copied without the same disclosures.
- **Accessibility:** US courts have applied the ADA to retail websites and apps, and accessibility lawsuits against retailers are common. Build to WCAG; check with counsel.

## Plays That Usually Transfer

| Play | Run it with |
|---|---|
| Store and location page family | **programmatic-seo**, **schema** |
| Local reviews program per location | **referrals** |
| Loyalty program and its email flows | **emails**, **offers** |
| App install and onboarding push | **aso**, **onboarding** |
| Promotion and event calendar | **marketing-plan**, **events** |
| Grand opening launches per store | **launch**, **public-relations** |
| SMS offers with compliant opt-in | **sms** |

## Metrics to Ask About

- **Same-store sales growth:** sales growth in stores open more than a year.
- **Store traffic and conversion:** visits per store and share of visits that buy.
- **Average basket:** spend per transaction.
- **Loyalty penetration:** share of sales from loyalty members.
- **Online to store share:** share of online orders picked up in store, and store visits driven by online.
- **New store ramp:** months for a new store to reach its target sales.
- **Local search actions:** calls, direction requests, and visits from Business Profiles per store.
