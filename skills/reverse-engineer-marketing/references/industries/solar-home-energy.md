# Solar and Home Energy: Teardown Pack

Load this pack when the target sells residential solar, batteries, heat pumps, or other home energy upgrades, as an installer, a sales company, a dealer network, or a financing platform. Growth here is driven by policy, financing, and sales teams. Incentive changes move demand overnight, many companies sell through door-to-door teams or bought leads, and the installer and the seller are often different companies.

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

- "Get a free quote", "see how much you can save", and savings calculators that ask for an address and a utility bill.
- Financing language: "$0 down", lease, PPA, loan, "no upfront cost", and partner lenders named in the footer.
- Product pages for panels, batteries, and inverters by brand, and certification badges from manufacturers' installer programs.
- Dealer or "become a partner" pages for sales organizations, and recruiting pages for door-to-door "energy consultants".
- Service-area pages by state or utility, often matching where net metering or incentives are strongest. `teardown.mjs detect <domain>` and `teardown.mjs site <domain>` surface most of these.

## What Drives Growth Here

- **Policy sets the market.** Net metering rules, state incentives, and federal tax credits change payback overnight. California's move to net billing in April 2023 cut demand there. The federal residential credit (25D) ended for systems installed after December 31, 2025, while leases and PPAs can still use the business credit for a time. A growth curve has to be read against these dates first.
- **Financing is the product.** Most homeowners buy a monthly payment. Who funds the lease, PPA, or loan, and on what terms, decides who can sell. Lender and fund failures have taken down sales companies with them.
- **Sales models differ.** Door-to-door canvassing teams, bought leads from aggregators, retail kiosks, utility and builder partnerships, and online quotes each produce a different curve and cost per sale.
- **Seller vs installer.** Many brands sell and outsource installation, or install for a network of dealers. Find out which side of that split the target is on.
- **Batteries and electrification are the second act.** As solar incentives shift, companies push batteries, backup power after outages, heat pumps, and EV chargers to existing customers.

## Signals to Collect

| Signal | Where or how | What it shows |
|---|---|---|
| ★ Policy timeline | Dates of net metering changes, state incentive openings and closings, and federal credit changes in their markets | The demand shocks to line up before crediting any move; add each to moves.csv as context |
| ★ Interconnection and program data | State datasets of interconnected or incentive-funded projects, such as California DGStats and NYSERDA's solar program data on data.ny.gov (check each dataset's data key for installer or contractor fields) | Installs by month and territory, sometimes by contractor: real volume, not estimates |
| Service-area expansion | `teardown.mjs sitemap-growth <domain>` and Wayback of the "where we serve" page | New states and utilities, dated as moves |
| Financing partners | Footer and FAQ disclosures, `teardown.mjs history <url>` on financing pages | Who funds them and when terms changed |
| Canvassing and sales recruiting | Careers pages, job boards, and recruiting videos for door-to-door teams | Whether growth runs on field sales, and seasonal hiring waves |
| Dealer and partner programs | "Become a dealer" pages, partner portals on subdomains (`teardown.mjs subdomains <domain>`) | Whether they grow through a network of sales companies |
| Lead aggregator presence | Quote marketplaces and comparison sites in the category | Bought-lead dependence |
| Paid social and search | `teardown.mjs sc-ads <name> --domain <domain>` and the ad libraries | Offers ("$0 down", outage backup) and which states they target |
| ★ Complaints and enforcement | State attorney general actions, Better Business Bureau complaints, and `teardown.mjs cfpb <company>` for financing partners | Sales-practice problems that can stop growth |
| Contractor licenses | State contractor license lookups | Which states they're licensed in and when; new licenses are moves |
| Public company data | `teardown.mjs filings <company>` for public installers and suppliers | Customer counts, subscriber growth, cost to acquire, and financing costs |
| Product mix | Wayback of product pages and the `hero` headline history (`teardown.mjs hero <url>`) | When batteries, heat pumps, or chargers became the lead offer |

## Going Inside

- **Only request a quote for a home you own and would actually consider.** A quote can trigger a site visit, a design, and a sales call, and many quote forms sell your details to several installers. If the user isn't a genuine prospect, use public calculators up to the point where they need an address.
- With approval and a genuine need: request a quote under the user's real name, then log every call, text, and email, the time to first contact, the proposal format, the financing options shown, and how hard they push to sign at the first meeting.
- Never let anyone run a credit check or sign anything during the research. Stop before any credit application.
- Record what door-to-door reps say only from public sources (recruiting videos, training content they publish). Don't invite a canvasser in for research.

## Rules That Limit Copying

- **Door-to-door sales:** the FTC's Cooling-Off Rule gives buyers three days to cancel most door-to-door sales, and many cities and towns require solicitor permits. Several states have solar-specific door-to-door and disclosure rules. Check local rules before copying a canvassing model.
- **Disclosures:** California requires a Solar Energy System Disclosure Document with residential solar contracts, and other states have their own required disclosures.
- **Savings claims:** the FTC and state attorneys general have acted against misleading solar savings, "free solar", and tax credit claims. Savings claims need a real basis, and credit claims must match current law.
- **Financing:** loan ads follow the Truth in Lending Act. PACE financing now falls under the CFPB's ability-to-repay rule (issued December 2024).
- **Calls and texts:** TCPA consent rules apply, and bought solar leads have been a frequent source of TCPA lawsuits.

## Plays That Usually Transfer

| Play | Run it with |
|---|---|
| Savings calculator that captures address and bill | **free-tools**, **lead-magnets** |
| State and utility pages with real incentive details | **programmatic-seo**, **content-strategy** |
| Battery and backup offer to existing customers after outages | **emails**, **offers** |
| Referral program for installed customers | **referrals** |
| Fast quote follow-up with clear financing comparisons | **revops**, **sales-enablement** |
| Dealer or partner program for sales companies | **co-marketing** |
| Policy-change landing pages and campaigns | **launch**, **ads** |

## Metrics to Ask About

- **Cost per install:** marketing and sales cost per completed installation, not per lead.
- **Lead to signed contract rate:** by channel (canvassing, bought leads, online, referral).
- **Cancellation rate:** signed contracts that cancel before install.
- **Time to install and to permission to operate:** days from signing to a working system.
- **Attach rate:** batteries and other upgrades per solar customer.
- **Financing mix:** cash, loan, lease, and PPA shares.
- **Referral share:** installs from customer referrals.
