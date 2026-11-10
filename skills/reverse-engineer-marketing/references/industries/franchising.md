# Franchising: Teardown Pack

Load this pack when the target grows by selling franchises: restaurant, fitness, home service, care, education, and retail brands with franchised units. Franchise brands run two funnels at once. Franchise development sells territories to investors, and local marketing fills each unit with customers. The franchise disclosure document makes much of this growth public.

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

- An "own a franchise", "franchise opportunities", or "become a franchisee" link, often to a separate franchise development site or subdomain (`franchise.`, `ownafranchise.`), found by `teardown.mjs subdomains <domain>`.
- A location finder with per-unit pages (`/locations/<city>`), sometimes with per-unit phone numbers, hours, and reviews.
- "Independently owned and operated" lines in the footer or on location pages.
- Franchise development pages with investment ranges, "available markets" maps, and webinar or Discovery Day signups.
- Local listing platforms behind location pages, found by `teardown.mjs stack <domain>`. Load the industry pack for the brand's category too.

## What Drives Growth Here

- **Two funnels, two buyers.** Investors buy territories; consumers buy the service. Unit growth comes from the development funnel. Revenue per unit comes from local marketing and operations. Read both.
- **Signed is not open.** Brands announce units sold, but the development pipeline (signed but not open) can stall or fail. Openings, closures, and transfers tell the real story.
- **Brokers and portals drive development.** Franchise brokers and consultant networks, franchise portals, and expos send many investor leads, usually for a fee on each sale.
- **Brand funds pay for marketing.** Franchisees pay into a brand fund and often must spend a set amount locally. That fund decides national advertising, and local spend varies by franchisee.
- **Unit economics sell franchises.** Financial performance figures, when the brand publishes them, are the main sales argument. Any such claim, wherever it appears, must have a reasonable basis and be included in Item 19 of the disclosure document.

## Signals to Collect

| Signal | Where or how | What it shows |
|---|---|---|
| ★ Franchise disclosure documents | Free state databases: Wisconsin DFI's franchise search, California DFPI's franchise search, the Minnesota FDD search, and NASAA's multi-state search | The official record: fees, investment, unit counts, and financial performance, by year |
| ★ Item 20 unit tables | Item 20 in each year's FDD | Openings, closures, terminations, transfers, and projected openings for three years: the real growth curve, add each year to moves.csv |
| ★ Item 19 financial performance | Item 19, if the brand includes it | Average or median unit revenue, which the brand uses to sell franchises; compare across years |
| Fees and marketing obligations | Items 5, 6, 7, and 11 | Initial fee, royalty, brand fund and local advertising requirements, and initial investment; changes are moves |
| ★ SBA loan data | SBA 7(a) and 504 FOIA data on data.sba.gov, which includes franchise codes | Loan volume by brand and year, a check on how many units actually got financed |
| Location count over time | Wayback captures of the location finder; `teardown.mjs sitemap-growth <domain>` | Public unit growth between FDD years |
| Franchise development marketing | The development site, webinars, Discovery Days, `teardown.mjs sc-ads <name> --domain <domain>` | How they sell to investors and which markets they push |
| Broker and portal presence | Franchise portals, franchise rankings, and broker network listings | Which development channels they pay for |
| Local marketing system | Location pages, per-unit social accounts, local ads in the ad libraries | How much local marketing is centralized vs left to franchisees |
| Franchisee reviews and sentiment | Franchisee forums, news coverage, and court filings | Franchisee health, a leading signal for closures |
| Per-unit consumer reviews | Official Places API or manual reads across locations | Consistency across units, and which units underperform |
| Ownership changes | Press releases, `teardown.mjs filings <company>` for public franchisors and their parents | Private equity ownership and multi-brand platforms |

## Going Inside

- **Request franchise information only if the user is genuinely exploring buying a franchise.** A development inquiry goes to a sales team and often to a broker. If the user isn't a prospective franchisee, use the public FDD, development pages, and webinars that don't need a sales call.
- With approval and genuine interest: register for the investor webinar or Discovery Day under the user's real name, then log the follow-up sequence, the qualification questions, and how quickly they move to the FDD.
- **Don't contact franchisees listed in Item 20 for research.** Prospective buyers call them for due diligence; a teardown shouldn't use that list for outreach.
- For the consumer side, the category pack's first-hand checks apply at a single unit.

## Rules That Limit Copying

- **FTC Franchise Rule:** the franchisor must give the FDD at least 14 calendar days before the buyer signs or pays. Financial performance claims are only allowed if they're in Item 19, so a competitor's earnings claims in ads may not be allowed for the user.
- **State registration:** about a dozen states, including California, Illinois, Maryland, Minnesota, New York, Virginia, Washington, and Wisconsin, require registration before offering franchises, and some require franchise sales ads to be filed before use.
- **FTC guidance from July 2024:** franchisors can't charge fees that weren't disclosed in the FDD, and clauses that stop franchisees from talking to regulators are treated as unfair practices.
- **Brokers:** some states require franchise brokers or sellers to register. Check before paying for broker-sourced sales.
- **Consumer side:** the category's own rules apply (healthcare, food, home services), and franchisees' local ads still follow brand and legal standards.

## Plays That Usually Transfer

| Play | Run it with |
|---|---|
| Location page system with per-unit content and reviews | **programmatic-seo**, **schema** |
| Investor webinar and Discovery Day program | **events**, **emails** |
| Franchise development site built around unit economics | **copywriting**, **cro** |
| Local marketing playbook and templates for franchisees | **marketing-plan**, **ad-creative** |
| Broker and portal channel with tracked cost per sale | **revops**, **attribution** |
| Franchisee referral program for new owners | **referrals** |
| Review consistency program across units | **referrals**, **social** |

## Metrics to Ask About

- **Net unit growth:** openings minus closures and terminations per year.
- **Signed-not-open pipeline:** units sold that haven't opened, and how long they've waited.
- **Average unit volume:** revenue per unit, and its spread across units.
- **Cost per franchise sale:** development marketing and broker fees per signed agreement.
- **Lead to signed agreement rate:** for investor leads, by source.
- **Same-store sales growth:** existing units' revenue growth.
- **Franchisee turnover:** transfers and terminations as a share of units.
