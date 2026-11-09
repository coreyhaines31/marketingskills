# Local Services: Teardown Pack

Load this pack when the target sells a service delivered at the customer's address or in a local office: plumbing, HVAC, electrical, roofing, cleaning, pest control, landscaping, garage doors, and multi-location franchises. Growth here is won on the phone and on the map. Most demand is urgent and local, so speed to answer, review volume, and Google's local surfaces matter more than brand.

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

- A phone number in the header, often with "24/7" or "same-day" copy, and click-to-call buttons on mobile.
- City and service-area pages (`/locations/<city>`, `/service-areas/`, `/<service>-<city>`), usually found by `teardown.mjs site <domain>`.
- Booking or estimate widgets from field-service software (ServiceTitan, Housecall Pro, Jobber, Workiz) and review widgets (Podium, Birdeye, NiceJob), found by `teardown.mjs stack <domain>`.
- Call-tracking scripts (CallRail, CallTrackingMetrics, Invoca, WhatConverts), found by `teardown.mjs phones <url>`.
- Financing badges (GreenSky, Synchrony, Wisetack, Service Finance) and "membership plan" or "maintenance club" pages.
- Franchise signals: `/franchise` or `/own-a-franchise` pages, a location finder, and per-location subpages or subdomains. `teardown.mjs detect <domain>` flags most of these.

## What Drives Growth Here

- **Calls are the conversion.** Most revenue starts with a phone call, so a company's channel mix shows up in its call-tracking setup, not in its analytics.
- **Google owns the top of the page.** Local Services Ads, the map pack, and Business Profile reviews take most clicks for "[service] near me". Review count, recency, and replies are a growth lever, not a vanity metric.
- **Average ticket shapes the playbook.** Low-ticket recurring work (cleaning, pest) grows through memberships and route density. High-ticket work (roofing, HVAC replacement) grows through financing, in-home sales, and storm or seasonal surges.
- **Roll-ups change the story.** Private equity platforms buy local brands, keep the old names, and centralize marketing. A sudden jump in locations or a rebrand is often an acquisition, not organic growth.
- **Lead marketplaces are a tax and a signal.** Heavy presence on Angi, Thumbtack, or Yelp ads means owned channels aren't yet enough.

## Signals to Collect

| Signal | Where or how | What it shows |
|---|---|---|
| Local Services Ads and the Google Verified badge | Search "[service] [city]" for each market, by hand or with a SERP API | Whether they pay per lead on Google, and in which cities. Google replaced the Google Guaranteed and Google Screened badges with one Google Verified badge on October 20, 2025, so older captures show the old badges |
| Business Profile reviews per location | Official Places API or manual reads, monthly | Review velocity and reply rate; a spike is a review campaign, a move in moves.csv |
| ★ Call-tracking number swaps | `teardown.mjs phones <url>`, then open the UTM test URLs in a browser | Which channels they track separately, and the tool they use; its first-seen date from `stack` becomes a move |
| Service-area page rollout | `teardown.mjs sitemap-growth <domain>` | When city pages launched and how fast they scaled; each wave is a move |
| City page quality | Read three to five city pages | Real local proof (techs, jobs, photos) vs swapped city names |
| ★ Location count over time | Wayback captures of the location finder or franchise map | Expansion pace and acquisition waves; date each jump as a move |
| Acquisitions and rebrands | Press releases, "now part of" footers, `teardown.mjs dns` mail and verification records shared with a parent company | PE ownership and centralized marketing |
| Lead marketplace presence | Angi, Thumbtack, HomeAdvisor, Yelp, Nextdoor business pages | Paid lead dependence and review spread across platforms |
| Financing and membership offers | Pricing, financing, and membership pages; `teardown.mjs history` on them | Ticket size strategy and recurring revenue push; changes are moves |
| ★ Seasonal and storm surges | Ad library start dates, `hero` banner changes, landing pages per event (hail, freeze, heat wave) | How fast they react to demand spikes |
| Field-service and booking tools | `teardown.mjs stack <domain>` | Online booking vs call-only, and how they capture leads after hours |
| Truck wraps, yard signs, direct mail | Their social posts and job photos | Offline channels you can't measure but can see |
| Hiring for techs vs marketing | Careers page and job boards | Whether capacity or demand is the constraint |
| ★ Contractor license records | State contractor license lookups (for example, California's CSLB) | License issue dates, classifications added, bonds, and complaints. A new classification (adding solar or HVAC) dates a service-line launch |

## Going Inside

- **Only contact them if the user would actually buy the service.** A fake quote request or booking costs a small business real money: a tech's time, a truck roll, a lost slot. If the user isn't a genuine customer, stay with public signals.
- If the user is a genuine customer (for example, they need the service at their own address), with approval: call the tracked number and record how fast they answer, the greeting, and the booking flow. Submit an online form and time the response by call, text, and email.
- Record the follow-up: estimate delivery, financing pitch, membership pitch, review request after the job.
- Never record a call without consent where the law requires it. Take notes instead.

## Rules That Limit Copying

- **Google Local Services Ads** require business verification, insurance, and, in many categories, license and background checks. The Google Verified badge replaced Google Guaranteed in October 2025, along with its money-back guarantee. You can't copy the badge, only qualify for it, and copy that still says "Google Guaranteed" is out of date.
- **Google Business Profile guidelines** ban keyword-stuffed business names, fake addresses, and virtual offices as service locations. Copying a competitor's stuffed name risks a suspension.
- **Reviews:** the FTC's rule on consumer reviews and testimonials (effective October 21, 2024) bans fake reviews, buying positive or negative reviews, and suppressing negative ones. Google also bans selectively asking only happy customers for reviews. Copy their request cadence, not shortcuts.
- **Licensing and advertising rules** vary by state and trade. Many states require a license number in ads. Check with counsel.
- **Financing ads** fall under the Truth in Lending Act. "0% financing" needs the required terms. Check with counsel.
- **Telemarketing and texting** follow TCPA consent rules. The FCC's one-to-one consent rule for lead generators was struck down in January 2025, but prior express written consent is still required for marketing calls and texts made with an autodialer or a prerecorded or artificial voice. Do-not-call rules and state laws add their own limits. Getting written opt-in for every marketing text is the safe practice.

## Plays That Usually Transfer

| Play | Run it with |
|---|---|
| City and service page family with real local proof | **programmatic-seo**, **site-architecture** |
| Review request flow after every job, with replies | **referrals**, **sms** |
| Call tracking per channel with offline conversion import | **conversion-tracking**, **attribution** |
| Membership or maintenance plan offer | **offers**, **pricing** |
| Financing message on high-ticket pages | **cro**, **copywriting** |
| Seasonal and storm-response landing pages and ads | **ads**, **ad-creative** |
| Local schema on every location page | **schema** |

## Metrics to Ask About

- **Cost per booked job:** marketing spend divided by jobs actually scheduled, not leads.
- **Booking rate:** share of calls and forms that become a scheduled job.
- **Speed to lead:** minutes from inquiry to first human contact.
- **Average ticket and close rate:** by service line and by channel.
- **Review velocity:** new reviews per location per month, and reply rate.
- **Membership attach rate:** share of customers on a recurring plan.
- **Revenue per technician:** shows whether capacity or demand limits growth.
