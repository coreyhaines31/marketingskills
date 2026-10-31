# Logistics and Transportation: Teardown Pack

Load this pack for freight brokers, 3PLs and fulfillment providers, trucking carriers, last-mile and courier companies, freight forwarders, and freight tech. Logistics companies run two funnels at once: one for shippers who buy capacity and one for the carriers or drivers who supply it. Federal registration data makes much of their growth public.

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

- "Get a quote", "Ship with us", and "Track a shipment" next to "Carriers", "Haul with us", or "Drive for us"
- USDOT and MC numbers in the footer or on the carrier page
- Driver recruiting pages with pay, home time, sign-on bonuses, and "Apply in minutes" forms
- Carrier onboarding portals (setup packets, insurance upload, quick-pay terms) and load board links
- Warehouse location maps, integration pages for Shopify and marketplaces, and per-order pricing for fulfillment
- `teardown.mjs detect <domain>` flags USDOT and MC numbers and shipper, carrier, and driver CTAs

## What Drives Growth Here

- **The freight cycle moves everyone.** Spot rates, contract rates, and capacity swing in multi-year cycles. A broker that grew fast in a tight market may be shrinking in a loose one. Compare the target against the cycle before crediting any move.
- **Capacity is half the funnel.** Brokers win on carrier relationships; carriers win on drivers. Driver recruiting spend and carrier onboarding speed often decide how much freight they can take.
- **Shipper growth runs on RFPs and routing guides.** Annual bid seasons and getting into a shipper's routing guide matter more than inbound leads for mid-market and enterprise freight.
- **Fulfillment 3PLs grow through ecommerce platforms.** Integrations, app store listings, and agency partnerships bring brands; warehouse count limits how many.
- **Sales headcount is the engine for brokers.** Many brokerages grow by hiring and ramping freight agents and account reps, often with agent programs that split revenue.

## Signals to Collect

| Signal | Where or how | What it shows |
|---|---|---|
| ★ Operating authority dates | FMCSA SAFER company snapshot and Licensing and Insurance records; the FMCSA Authority History dataset on data.transportation.gov | When each MC number was granted, revoked, or reinstated. New authorities for new entities date expansions; each becomes a move in moves.csv |
| ★ Fleet size over time | SAFER snapshots (power units, drivers, mileage from the biennial MCS-150 update), with Wayback for older captures | Real fleet growth for carriers, not estimates |
| Safety record | FMCSA SMS and CSA data, inspections and crashes | Whether growth came with safety problems that limit shippers who will use them |
| ★ Driver recruiting intensity | Their driver pages, CDL job boards, and job sites; `teardown.mjs history <url>` on the pay page | Sign-on bonuses, pay changes, and how many lanes they hire for. Bonus jumps signal capacity pushes |
| Load board presence | Public broker profiles and ratings on load boards and broker-rating services | How carriers rate them on pay speed and honesty, which affects capacity |
| Carrier onboarding terms | The carrier page and setup packet | Quick-pay fees, payment terms, and tools offered to carriers |
| Ocean intermediary licenses | The Federal Maritime Commission's list of licensed ocean transportation intermediaries | Licensed NVOCC and freight forwarder status, with dates |
| EPA SmartWay partnership | EPA's public SmartWay partner list | Sustainability credentials shippers ask for in RFPs |
| Warehouse footprint | Wayback captures of the locations page; local news on new facilities | Fulfillment capacity added by month |
| Ecommerce integrations | Shopify App Store and marketplace partner listings | When each integration launched, and its reviews |
| ★ Shipper case studies and logos | Wayback of the customers page | Verticals and shipper sizes they win over time |
| Freight agent programs | "Become an agent" pages and agent job posts | Revenue-share models used to add sales capacity |
| Funding and acquisitions | `teardown.mjs filings <company>` (Form D for private raises) and press | Capital raised and brokerages acquired, dated |

## Going Inside

- **No fake loads or quotes.** A quote request or posted load costs a broker or carrier real time. Request a quote only if the user actually ships freight, with approval.
- If the user is a real shipper, record the quote speed, how pricing is presented (all-in vs line items), tracking updates, and the follow-up from sales.
- Read the public carrier setup page and packet. Don't start carrier onboarding as a fake carrier, and never submit someone else's USDOT or MC number.
- For fulfillment 3PLs, use the public pricing calculator and integration docs. Book a sales call only under the user's real identity.

## Rules That Limit Copying

- **FMCSA registration:** brokers need their own operating authority and a $75,000 surety bond or trust (BMC-84 or BMC-85). Copying a broker model without authority is illegal.
- **Double brokering and fraud:** re-brokering freight without authorization and using another company's identity are illegal and a growing enforcement focus. Don't copy any "capacity hack" that relies on them.
- **Driver recruiting ads:** pay claims must be accurate, and background checks fall under the Fair Credit Reporting Act. Texting drivers requires TCPA consent.
- **Shipper claims:** on-time and damage-rate claims in RFPs and ads need evidence.
- **Safety:** marketing can't promise service levels that require breaking hours-of-service rules.
- Check with counsel before copying an agent revenue-share or broker model.

## Plays That Usually Transfer

| Play | Run it with |
|---|---|
| A driver recruiting funnel with clear pay, fast apply, and follow-up by text | **signup**, **sms** |
| Lane and city pages for shipper searches ("[city] to [city] freight") | **programmatic-seo** |
| Instant quote tools for shippers | **free-tools**, **cro** |
| RFP and routing-guide pursuit lists for target shippers | **prospecting**, **sales-enablement** |
| Ecommerce platform integrations and app listings for fulfillment | **co-marketing**, **directory-submissions** |
| Carrier referral and loyalty programs | **referrals** |
| Shipper case studies by vertical | **sales-enablement** |

## Metrics to Ask About

- **Loads per day** or shipments per month, and revenue per load
- **Gross margin per load:** for brokers, shipper rate minus carrier rate
- **Carrier base:** active carriers and new carrier setups per month
- **Driver turnover** and cost per hired driver
- **Tender acceptance:** share of contract loads accepted
- **On-time pickup and delivery**
- **Fulfillment:** orders per month, cost per order, and client churn
