# Automotive: Teardown Pack

Load this pack for dealers and dealer groups, automakers (OEMs), EV brands, auto service and repair, and parts retailers. Auto marketing is split between the brand, which builds demand, and dealers, who capture it locally, and much of the evidence sits in inventory listings and third-party marketplaces.

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

- Inventory pages with VINs, stock numbers, "new", "used", and "certified pre-owned" filters
- Dealer website platforms (Dealer.com, DealerOn, Dealer Inspire, Dealer eProcess), named in the footer. `teardown.mjs stack` flags Dealer.com and Dealer Inspire
- Chat and lead tools common to dealers (CarNow, Gubagoo, ActivEngage), plus trade-in tools, in the page source
- "Schedule service", "Value your trade", "Get pre-approved", and "Build and price" pages
- Phone tracking on every page, often per department (sales, service, parts); check with `teardown.mjs phones <url>`
- `teardown.mjs detect <domain>` flags dealer platforms and inventory patterns

## What Drives Growth Here

- **Inventory is the product page.** The number of vehicles listed, how fast they turn, and how well each listing ranks and syndicates drives leads.
- **Third-party marketplaces carry much of the shopping.** Cars.com, Autotrader, CarGurus, and Facebook Marketplace are where many buyers start. Dealers pay for placement and badges there.
- **Co-op money shapes dealer ads.** OEMs reimburse part of dealer advertising if it follows brand rules, so dealer ad patterns often follow OEM programs.
- **Service drives profit and loyalty.** The service lane brings customers back, and service marketing (reminders, specials, recalls) is a growth engine on its own.
- **EV brands sell direct.** Without dealers, they rely on reservations, referral programs, test-drive events, and owner communities.

## Signals to Collect

| Signal | Where or how | What it shows |
|---|---|---|
| ★ Inventory count over time | Wayback captures of inventory pages; marketplace listing counts | Inventory size and mix (new vs used) by month. Big changes become moves in moves.csv |
| ★ Marketplace placement and badges | Their listings on Cars.com, Autotrader, CarGurus | Which marketplaces they pay for, deal ratings, and review counts |
| Pricing language | Inventory pages and listings | "No-haggle" pricing, market-based pricing, or add-ons, which shape conversion |
| Service specials | `teardown.mjs history <url>` on the service specials page | Service offers by month and how often they rotate |
| Dealer reviews | Dealer review sites (DealerRater) and Google reviews through the Places API | Review volume and themes by department |
| Phone tracking per department | `teardown.mjs phones <url>` | Which channels and departments they track |
| Group footprint | The dealer group's locations page over time | Acquisitions of rooftops, dated |
| ★ Referral and reservation programs (EV) | Referral pages, owner forums, Wayback of reservation pages | Rewards and reservation deposits that drove direct sales |
| Test-drive and event programs | Events pages, local event listings | Direct-to-consumer demand generation |
| Recall and service campaigns | NHTSA recall database | Service-lane opportunities and brand risk, dated |
| Local search pages | `teardown.mjs site` for model, city, and service page families | Programmatic pages per model and location |
| ★ Vehicle listing ads | Google search results for "[model] for sale near [city]" (vehicle ads carousel) and Meta automotive inventory ads in the ad library | Whether their live inventory feeds paid listings, and on which platforms |
| Incentive and lease specials | `teardown.mjs history <url>` on the specials page; OEM incentive pages | Which offers come from the OEM and which the dealer adds, by month |
| Hiring | Careers pages | BDC (business development center) staffing, digital roles, new stores |

## Going Inside

- **No fake leads.** Dealers pay for leads and staff respond fast. Submit a lead form only if the user is actually shopping.
- If the user is shopping, record the response time, the channels used (call, text, email), and the follow-up cadence.
- Screenshot the trade-in, financing pre-approval, and online purchase flows. A credit application can mean a hard pull, so get explicit approval and prefer pre-qualification.
- For service, book a real appointment only if the user needs one.

## Rules That Limit Copying

- **FTC rules on auto advertising:** the FTC's CARS Rule was vacated by the Fifth Circuit on January 27, 2025, before it took effect, but the FTC still enforces Section 5 against misleading prices, junk add-on fees, and financing claims, and several states have their own rules on advertised and offered prices. Check current guidance before copying price language.
- **State dealer advertising laws** often require specific disclosures for advertised prices, fees, and incentives.
- **Truth in Lending (Regulation Z) and the Consumer Leasing Act (Regulation M):** payment and lease ads trigger disclosure requirements.
- **OEM co-op rules** limit what dealers can say and show if they want reimbursement.
- **Direct sales laws:** some states restrict automakers from selling directly, which limits copying EV direct models.

## Plays That Usually Transfer

| Play | Run it with |
|---|---|
| Model, trim, and city page families that rank for local shopping searches | **programmatic-seo** |
| A fast lead response process across call, text, and email | **revops**, **sms** |
| Service reminders and specials that bring owners back | **emails**, **sms** |
| Review requests after sales and service | **referrals** |
| An owner referral program | **referrals** |
| Test-drive and owner events | **events** |
| Inventory and service ads tied to live stock | **ads** |

## Metrics to Ask About

- **Leads per vehicle in stock** and lead-to-sale rate
- **Speed to lead:** minutes to first response
- **Days to turn:** how long inventory sits
- **Cost per sale** by source (marketplaces, paid search, social)
- **Service retention:** share of buyers who come back for service
- **Customer pay repair orders:** service revenue per month
