# Care Services: Teardown Pack

Load this pack when the target provides care for people: senior living, home care, home health, hospice, childcare and daycare, or in-home tutoring and learning centers run as a local service. Growth here runs through families and referrers. The buyer is often an adult child or a parent, the decision is emotional and urgent, and referral agencies, hospitals, and licensing records shape who gets chosen.

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

- "Schedule a tour", "free in-home assessment", "check availability", or "join the waitlist" as the main calls to action.
- Location or community pages with levels of care (independent living, assisted living, memory care), service lists (companion care, personal care, skilled nursing), or age groups and classrooms for childcare.
- Pricing pages that say "starting at" or "contact us", plus payment pages about long-term care insurance, Medicaid waivers, veterans benefits, or childcare subsidies.
- Licensing statements and license numbers in the footer, and "Medicare-certified" for home health and hospice.
- Franchise brands with many local territories (`/locations/<city>`). `teardown.mjs detect <domain>` and `teardown.mjs site <domain>` flag most of these.

## What Drives Growth Here

- **The payer splits the model.** Medicare covers home health and hospice under a doctor's orders, so those grow through hospital and physician referrals. Non-medical home care and most assisted living are private pay, long-term care insurance, or Medicaid waivers, so they grow through families, search, and placement agencies. Childcare runs on private pay and state subsidies.
- **Placement and referral agencies sit in the middle.** Senior placement services and care marketplaces collect family inquiries and pass them to providers, often for a referral fee. A provider's dependence on them is a cost and a risk.
- **Occupancy and capacity are the real constraint.** Senior living grows by filling units, home care by hiring caregivers, childcare by licensed seats and staff ratios. Hiring and capacity signals often explain the curve better than marketing does.
- **Reviews and inspections carry the decision.** Families read reviews, government star ratings, and inspection reports before they call.
- **Local density matters.** Franchises and chains grow territory by territory, and referral relationships with local hospitals, doctors, and schools compound.

## Signals to Collect

| Signal | Where or how | What it shows |
|---|---|---|
| ★ Government ratings and inspections | CMS Care Compare and the CMS Provider Data Catalog for home health, hospice, and nursing homes; state licensing and inspection lookups for assisted living and childcare | Star ratings, survey results, deficiencies, and capacity: public facts families see first |
| ★ Licensing records | State licensing databases (licensed capacity, license dates, citations) | New locations and licensed seats or beds, dated as moves in moves.csv |
| Location and territory count | Wayback captures of the locations page; `teardown.mjs sitemap-growth <domain>` | Expansion pace and acquisitions |
| Placement and marketplace presence | Senior placement and care marketplace profiles, childcare search sites | Dependence on referral agencies and where families find them |
| Care-specific reviews | Senior living and home care review sites, care marketplaces, plus the official Places API or manual reads for Google | Review velocity per location; spikes are campaigns |
| ★ Caregiver and staff hiring | Careers pages and job boards, by location | Capacity growth, and whether hiring is the bottleneck |
| Pricing and payment pages | `teardown.mjs history <url>` on pricing pages; Wayback of payment-option pages | Price changes and when they added Medicaid, VA, or subsidy options |
| Referral partner programs | Pages for hospitals, physicians, discharge planners, or schools | Professional referral engines |
| Content for family decision makers | Guides on paying for care, choosing a daycare, warning signs; `teardown.mjs sitemap-growth <domain>` | Their search engine and when it launched |
| Paid search and social | `teardown.mjs sc-ads <name> --domain <domain>` and the ad libraries | Which care levels and locations they pay to fill |
| Tour and open house events | Event pages and social posts | Their main conversion event and its cadence |
| Call tracking | `teardown.mjs phones <url>` | Which channels they track separately |

## Going Inside

- **Don't book tours or assessments you won't need.** A senior living tour or in-home assessment takes a sales director or nurse's time. Only book if the user genuinely needs the care for their own family.
- **Don't submit inquiries to placement services for research.** One inquiry is passed to many providers and triggers calls to the user.
- With approval and a genuine need: book a tour or request information under the user's real name, then log the response time, the follow-up cadence, the questions asked, pricing transparency, and the deposit or move-in offers.
- Never share anyone else's health, age, or family details. Never photograph residents or children.

## Rules That Limit Copying

- **Medicare and Medicaid referrals:** the federal Anti-Kickback Statute bars paying for referrals of patients covered by federal health programs. Home health and hospice referral programs need counsel review.
- **Placement agency rules:** some states regulate senior placement and referral agencies. Washington and Oregon, for example, require disclosures of fees and relationships. Check state rules before running or relying on a referral-fee model.
- **Licensing and advertising:** states restrict what unlicensed providers can call themselves ("assisted living", "licensed daycare"), and many require license numbers in ads.
- **Health and privacy:** HIPAA applies to home health and hospice providers, so the tracking limits in the healthcare pack apply. Children's photos and stories need parental consent.
- **Reviews:** the FTC's consumer reviews rule applies, and families often post on behalf of a resident; don't solicit reviews in exchange for discounts.

## Plays That Usually Transfer

| Play | Run it with |
|---|---|
| Guides for family decision makers (paying for care, choosing care) | **content-strategy**, **lead-magnets** |
| Location pages with ratings, licensing, and real staff | **programmatic-seo**, **schema** |
| Tour and open house program with follow-up | **events**, **emails** |
| Professional referral partner program | **co-marketing**, **sales-enablement** |
| Review program for families after move-in or enrollment | **referrals** |
| Waitlist and capacity messaging for full locations | **cro**, **copywriting** |
| Caregiver recruiting as a marketing channel | **ads**, **social** |

## Metrics to Ask About

- **Occupancy or enrollment rate:** filled units, clients served, or seats filled, by location.
- **Inquiry to tour or assessment rate,** and **tour to move-in or enrollment rate.**
- **Cost per move-in or new client:** by channel, including placement fees.
- **Referral source mix:** families, placement agencies, hospitals and physicians, search.
- **Length of stay or client tenure:** months per resident, client, or child.
- **Caregiver hiring and turnover:** the capacity constraint for home care.
