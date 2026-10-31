# Marketplaces: Teardown Pack

Load this pack for two-sided or multi-sided marketplaces and gig platforms. A marketplace has two funnels that feed each other, so the question is never just "how did they get users" but "which side did they buy first, where, and how did they keep both sides in balance."

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

- Two sign-up paths on the homepage: "Find a pro" and "Become a pro", "Book" and "List your space", "Hire" and "Earn".
- Separate nav or subdomains for the supply side (`pros.`, `hosts.`, `partners.`, `sellers.`, `drivers.`). `teardown.mjs subdomains <domain>` dates when each side got its own site.
- URL families per listing, per city, or per category (`/s/austin`, `/plumbers/denver`, `/listing/12345`). `teardown.mjs site <domain>` counts them.
- Pricing pages for the supply side (commission, listing fees, lead credits) and none for the demand side.
- Payment processors built for platforms (Stripe Connect onboarding pages, payout FAQs).
- `teardown.mjs detect <domain>` flags these together as a marketplace.

## What Drives Growth Here

- **One side is the bottleneck.** Usually supply early, demand later. Find out which side they paid to acquire and when that switched; the spend pattern flips at that point.
- **Growth is local or per category.** A marketplace launches city by city or category by category, and each launch has its own inflection. Read the curve per market, not just in total.
- **Supply creates the SEO.** Each listing, profile, or review page is a landing page. Many marketplaces get most demand from pages the supply side wrote for them.
- **Liquidity is the product.** Search results with no matches, empty calendars, and slow replies kill conversion. Moves that raise match rate (instant book, guaranteed response time, subsidies) often line up with growth more than marketing does.
- **Take rate shapes everything.** A rising take rate or new fees on one side often means growth is slowing or leverage has shifted.

## Signals to Collect

| Signal | Where or how | What it shows |
|---|---|---|
| ★ City and category launch dates | `teardown.mjs sitemap-growth <domain>` for when each city or category path first appeared | The order and pace of market launches; each first appearance becomes a move in moves.csv |
| Listing page count per market | `teardown.mjs site <domain>` grouped by city or category path | Where supply is deep and where it's thin |
| ★ Supply-side ads | `teardown.mjs sc-ads` and ad libraries, filtered for "earn", "list", "join as a pro" copy | How much they pay to recruit supply, and in which cities; ad start dates become moves |
| Demand-side ads | Same sources, filtered for buyer copy | Which markets they push demand into once supply exists |
| Supply onboarding pages over time | `teardown.mjs history <url>` on "become a host/pro" pages | Changes to commission, sign-up bonuses, and guarantees |
| ★ Supply recruiting in job boards and gig sites | Their own postings on job boards and gig listing sites | Paid supply recruitment disguised as hiring; dated postings become moves |
| Referral programs on each side | Referral pages for buyers and for sellers, with archive history | Which side they subsidize to spread |
| Programmatic landing pages | URL patterns like `/[service]/[city]` and their indexed count | The SEO engine and how fast it scaled |
| Review volume on listings | Count reviews on a sample of listings over time | Transactions per market, a rough liquidity proxy |
| Supply-side community | Forums, Facebook groups, subreddits, and Discords for hosts, drivers, or sellers | Supply sentiment, fee complaints, churn risk |
| Fee and take rate changes | Archived help center pages on fees, plus press coverage | Leverage shifts between the two sides |
| ★ Empty-search behavior | Search for a service in a thin market on the live site | What they show when liquidity fails (waitlist, nearby results, lead capture) |
| Guarantees and trust features | Insurance, background checks, refund guarantees, with launch dates | The trust moves that unlocked conversion |

## Going Inside

- **Demand side:** with approval, sign up as a buyer under the user's real identity. Record the search experience, how many results appear in two or three markets, response time from supply when you message about something you genuinely might buy, and the follow-up emails. Do not book or hire unless the user intends to buy.
- **Supply side:** read the full supply onboarding from the public pages and help center. Only start a supply sign-up if the user is willing to be visible as a competitor, and stop before creating a live listing.
- **Guardrails:** no fake listings, fake requests, or fake bookings. On a marketplace, a fake request costs a real provider time and sometimes money (lead fees). Never message supply-side users to recruit them away inside the platform; that breaks the platform's terms and misuses its contact data.

## Rules That Limit Copying

- **Worker classification:** gig platforms are subject to labor law on contractor vs employee status, which differs by country and state. Copying a supply model can carry classification risk; check with counsel.
- **Licensing:** many local services and rentals need licenses, and some cities restrict short-term rentals or require registration numbers on listings.
- **Fee disclosure:** the FTC's rule on unfair or deceptive fees (effective May 2025) requires upfront total prices for short-term lodging and live-event tickets in the US, California's SB 478 applies more broadly, and the EU requires total prices. Copy the fee structure with all-in pricing.
- **Reviews:** the FTC's rule on fake reviews and testimonials (in force since October 2024) bars fake reviews and reviews bought on the condition of sentiment. The EU's Digital Services Act and Omnibus Directive add review and ranking transparency duties for platforms. Don't seed new markets with fake reviews.
- **Platform ToS:** scraping a competitor marketplace's listings or contacting its users through its messaging is usually banned by its terms.

## Plays That Usually Transfer

| Play | Run it with |
|---|---|
| Programmatic pages per service and city, with real supply data on each | **programmatic-seo** |
| A supply-side referral bonus in the thinnest markets | **referrals** |
| A launch sequence per city: supply first, then local demand | **launch** |
| Lead capture or waitlist on empty search results | **popups**, **cro** |
| A guarantee that removes the buyer's main risk | **offers** |
| Supply recruiting ads with earnings-first copy | **ads**, **ad-creative** |
| Supply-side community for retention and word of mouth | **community-marketing** |

## Metrics to Ask About

- **Liquidity:** share of searches or requests that end in a match or transaction.
- **Time to first match:** how long a new buyer waits for a response or booking.
- **Supply utilization:** share of listed supply that transacts in a period.
- **Take rate:** platform revenue as a share of gross transaction value.
- **GMV per market:** gross transaction value by city or category.
- **Repeat rate on each side:** buyers who come back, sellers who stay active.
- **Supply and demand CAC:** acquisition cost per side, measured separately.
