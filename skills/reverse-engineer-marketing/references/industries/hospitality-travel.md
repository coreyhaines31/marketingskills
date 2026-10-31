# Hospitality and Travel: Teardown Pack

Load this pack for hotels, vacation rentals, restaurants and chains, and travel brands and tour operators. Growth here is a fight with intermediaries: online travel agencies, metasearch, and delivery apps own much of the demand, so the key question is how a brand wins direct bookings without losing the reach those platforms bring.

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

- A booking engine, reservation widget, or "Order online" button as the main call to action.
- Booking and reservation tools in the page source or as CNAMEs on `book.`, `reservations.`, `order.` subdomains, visible through `teardown.mjs stack` and `teardown.mjs dns` (hotel booking engines, restaurant reservation and online ordering platforms).
- Location pages with addresses, menus, rooms, or tour dates; schema for hotels, restaurants, or events.
- Loyalty program pages and "Book direct" messaging.
- `teardown.mjs detect <domain>` flags these together as hospitality or travel.

## What Drives Growth Here

- **Direct vs third-party mix.** Every booking through an OTA or delivery app costs a commission. A shift toward direct booking is often the real growth story, even when total demand is flat.
- **Metasearch and Google matter.** Hotel and travel brands compete in Google Hotels, metasearch, and Google Business Profiles. Rankings, rates shown there, and reviews drive clicks.
- **Reviews and photos convert.** Ratings on travel and review platforms decide whether a listing gets clicked at all.
- **Seasonality and events.** Demand follows seasons, holidays, and local events. Compare a month with the same month last year.
- **Loyalty and repeat visits.** For chains and restaurants, the loyalty app and the CRM drive repeat frequency, which is where margin lives.

## Signals to Collect

| Signal | Where or how | What it shows |
|---|---|---|
| ★ Book-direct offers over time | `teardown.mjs history <url>` and `teardown.mjs hero <url>` on the homepage and booking page, for "best rate", member rate, or direct-only perks | When they started pushing direct bookings; each change becomes a move in moves.csv |
| ★ Rate parity spot checks | Compare the price for the same room and date on their site (logged out and logged in), the main OTAs, and Google Hotels | Whether they keep public parity and undercut only with a login-gated member rate, the usual way around parity clauses |
| ★ Google free booking links and metasearch | Their property in Google Hotels and Google Vacation Rentals; "Reserve with Google" on restaurant listings | Whether their own booking engine shows up next to the OTAs on Google |
| ★ Delivery app markup | The same menu items on their own ordering site vs the delivery apps | Whether they price delivery apps higher to push first-party ordering |
| Location and opening history | `teardown.mjs sitemap-growth <domain>` for location pages, plus archived location lists | Openings and closings by date; each opening becomes a move |
| OTA and delivery app presence | Their listings on the main OTAs, metasearch, and delivery apps | Which intermediaries they rely on, and which they dropped |
| Review volume and ratings | Travel review platforms and Google ratings through official APIs or manual checks, not Maps scrapers | Demand and guest sentiment per location; review spikes become moves |
| Loyalty program changes | Archived loyalty pages and app store version history | New tiers, points changes, and app launches; dated changes become moves |
| Menu or package price changes | `teardown.mjs history <url>` on menu, rooms, or tour pages | Pricing moves and limited-time offers |
| Paid ads | `teardown.mjs sc-ads`, ad libraries, and metasearch ad presence | Seasonal spend, destination targeting, and promo offers |
| Creator and UGC content | ScrapeCreators pulls on TikTok, Instagram, and YouTube for the brand and locations | Creator-driven demand, often the main channel for restaurants and experiences |
| Email and SMS capture | Popups and sign-up forms on the site | The offer used to build the direct list |
| ★ Event and seasonal calendar | Archived homepage banners and event pages | How they fill low seasons and slow nights |
| Partnerships | Airline, credit card, and local tourism board partnerships, with dates | Co-marketing channels that bring travelers |

## Going Inside

- **Join the loyalty program and email list** with approval, under the user's real identity, and log every message by day and offer for 30 to 60 days.
- **Walk the booking or ordering flow** to the final confirmation step and stop there. Screenshot fees, add-ons, upsells (room upgrades, add-on tours, desserts), and cancellation terms. Compare the total at the first screen with the total at checkout, which is where fee disclosure rules bite.
- **Install the loyalty or ordering app** and note the first-order offer and push cadence.
- **Guardrails:** never complete a booking, reservation, or order the user won't use. A no-show costs a small hotel a room and a restaurant a table. Only book if the user genuinely plans to stay or eat, and cancel within the free window if plans change.

## Rules That Limit Copying

- **Price display and fees:** the FTC's Rule on Unfair or Deceptive Fees, in effect since May 12, 2025, requires hotels, vacation rentals, and the platforms that sell them to show the total price, including mandatory fees such as resort fees, upfront. Some states (California, for example) have broader all-in pricing laws, and the EU and UK have their own price display rules.
- **Rate parity clauses:** OTA contracts can limit how a property prices direct bookings. In the EU, the Digital Markets Act bans Booking.com's parity clauses (since late 2024), and some countries restricted them earlier; elsewhere they still appear in contracts. Check the user's own OTA contracts before copying a pricing tactic.
- **Reviews:** the FTC's rule on consumer reviews bars fake reviews and incentives tied to a review's sentiment. Platforms go further: many, including Google and Tripadvisor, bar any incentive for a review, and review gating. Copy the request timing, not the incentive.
- **Alcohol and food:** alcohol advertising rules and allergen labeling rules limit menu and promo copy.
- **Short-term rentals:** many cities require registration and limit listings.

## Plays That Usually Transfer

| Play | Run it with |
|---|---|
| A member rate or direct-booking perk promoted on the booking page | **offers**, **cro** |
| A loyalty program built around repeat visits | **referrals**, **emails** |
| Location pages with local content, menus, and schema | **programmatic-seo**, **schema** |
| A creator program for local food or travel creators | **influencer-marketing** |
| Seasonal and event campaigns to fill slow periods | **events**, **emails** |
| An email and SMS capture offer on the site | **popups**, **sms** |
| A review request flow after every stay or meal | **referrals** |

## Metrics to Ask About

- **Direct booking share:** bookings or orders through owned channels vs intermediaries.
- **Commission cost per booking:** fees paid to OTAs and delivery apps.
- **Occupancy and RevPAR:** for hotels, rooms filled and revenue per available room.
- **Covers and average check:** for restaurants, guests served and spend per guest.
- **Repeat visit rate:** guests or customers who come back in a period.
- **Review score and volume per location.**
- **Loyalty members and active rate:** members who booked or ordered recently.
