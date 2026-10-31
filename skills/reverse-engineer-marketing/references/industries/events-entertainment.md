# Events and Entertainment: Teardown Pack

Load this pack for ticketed events, venues, festivals, conferences run as businesses, sports teams, live entertainment, and attractions. Every event is a launch with a hard deadline: demand builds through a sequence of announcements and sales phases, and inventory expires on the day. The growth story is how they sequence announcements, price phases, and fill the last seats.

For a company that runs webinars or events as a marketing channel, use the **events** skill instead.

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

- "Get tickets", "Buy passes", or "Register" as the main call to action, linking to a ticketing platform (Ticketmaster, AXS, Eventbrite, Dice, See Tickets, Tixr, or a conference platform).
- Ticketing on a `tickets.` or `register.` subdomain, which `teardown.mjs dns <domain>` and `teardown.mjs subdomains <domain>` surface.
- Lineup, speaker, or schedule pages; dates and a venue on the homepage; sponsor logos and a "Sponsor" or "Partner with us" page.
- `Event`, `MusicEvent`, `SportsEvent`, or `Festival` schema on event pages.
- `teardown.mjs detect <domain>` flags ticketing platforms (Ticketmaster, Eventbrite, AXS, DICE, Tixr), ticket and lineup calls to action, and event schema types. Confirm the industry with the user.

## What Drives Growth Here

- **Announcement sequencing.** Date reveal, first lineup or speakers, headliner, schedule, and final additions are each a demand spike. The order and spacing are deliberate.
- **Price phases create urgency.** Early bird, tiered general admission, group and VIP packages, and late price increases move buyers forward. Dynamic pricing on major platforms changes prices with demand.
- **Presales build the list.** Fan club, credit card, sponsor, and email presales reward sign-ups before the public on-sale, and the list is the real asset across years.
- **Repeat attendance and community.** For recurring festivals and conferences, alumni, returning-buyer offers, and year-round content decide how much each edition costs to sell.
- **Sponsorship can matter more than tickets.** For conferences and many festivals, sponsor revenue funds the event, so the sponsor deck and sponsor roster tell you how the business works.

## Signals to Collect

| Signal | Where or how | What it shows |
|---|---|---|
| ★ Announcement timeline | `teardown.mjs hero <url>` and `teardown.mjs history <url>` on the homepage and lineup or speaker page; their social posts by date | Each reveal, dated; every announcement becomes a move in moves.csv |
| ★ Price phase history | `teardown.mjs history <url>` on the tickets page, plus archived ticketing pages | When each price tier opened and sold out, and how much prices rose |
| Presale structure | Presale sign-up pages, sponsor and card presales, email announcements | Which partners get early access and how they grow the list |
| Sell-out and low-inventory messages | Archived ticket pages and their social posts ("Tier 2 sold out") | Pace of sales by phase; label sell-out claims as reported |
| ★ Secondary market prices | Resale listings on secondary ticket marketplaces, checked over time | Real demand: resale above face value means underpricing or strong demand |
| Sponsor roster over time | Archived sponsor pages and logos by edition | Sponsor growth, churn, and which categories pay |
| Sponsorship deck | Their public "Sponsor" page and any public prospectus | Packages, prices, and the audience claims they sell to sponsors |
| Speaker or artist promotion | ScrapeCreators pulls on the artists' and speakers' own channels about the event | How much reach comes from the lineup promoting themselves |
| Paid ads | `teardown.mjs sc-ads <name> --domain <domain>` and ad libraries, by date | Spend timing around on-sale dates and the final weeks |
| Email and SMS capture | Sign-up forms, waitlists, and "notify me" pages | How they collect demand before tickets go on sale |
| Group and affiliate programs | Group discount pages, ambassador or promoter codes, affiliate links | Peer-to-peer and promoter-driven sales |
| Content between editions | Recordings, recaps, podcasts, and year-round newsletters | How they keep the audience warm for the next edition |
| Public company filings | `teardown.mjs filings <company>` for listed promoters, ticketing companies, and teams' parent companies | Attendance, ticket fees, and sponsorship revenue at scale |

## Going Inside

- With approval and under the user's real identity, join the email list, presale sign-up, and waitlist, and log every message by date and offer through an on-sale.
- Walk the ticket checkout to the final payment step and stop. Screenshot the price at the first screen and at checkout, every fee, and any upsells (parking, VIP, merch, insurance).
- Only buy tickets the user will use, with explicit approval and a set amount. Never use bots, multiple accounts, or tools that get around purchase limits; they're illegal for most US public events under the BOTS Act and break platform terms.
- For conferences, request the sponsor prospectus only if the user is genuinely considering sponsoring.

## Rules That Limit Copying

- **All-in pricing:** the FTC's Rule on Unfair or Deceptive Fees, in effect since May 12, 2025, requires sellers and resellers of live-event tickets to show the total price, including mandatory fees, upfront. Several states have their own ticket pricing laws.
- **Bots and resale:** the US BOTS Act bans using software to get around ticket purchase limits, and some states regulate resale and speculative listings.
- **Scarcity claims:** "only a few left" and sell-out claims must be true; deceptive urgency falls under the FTC Act and state consumer protection laws.
- **Sweepstakes and giveaways:** ticket giveaways that require a purchase or social action follow sweepstakes law and platform promotion rules.
- **Talent and venue contracts:** artist, speaker, and venue agreements often restrict how names, logos, and recordings can be used in marketing.
- **Sponsorship disclosure:** paid speaker slots and sponsored content need clear disclosure under the FTC's Endorsement Guides.

## Plays That Usually Transfer

| Play | Run it with |
|---|---|
| A dated announcement calendar with a demand spike at each reveal | **launch**, **social** |
| Price phases with clear deadlines | **pricing**, **offers** |
| A presale list built months before on-sale | **lead-magnets**, **emails**, **sms** |
| Lineup or speaker co-promotion kits | **co-marketing**, **influencer-marketing** |
| Group and ambassador ticket codes | **referrals** |
| A sponsor page with packages and audience proof | **sales-enablement** |
| Year-round content that keeps past attendees engaged | **content-strategy**, **events** |

## Metrics to Ask About

- **Sell-through by phase:** tickets sold per price tier and the date each tier sold out.
- **Average ticket price and fee revenue:** after discounts and comps.
- **Repeat attendance rate:** buyers who return the next edition.
- **List size and presale conversion:** sign-ups and the share who buy.
- **Sponsorship revenue and renewal rate.**
- **Cost per ticket sold:** marketing spend divided by paid tickets, by channel.
- **Show-up rate:** scanned tickets as a share of tickets sold.
