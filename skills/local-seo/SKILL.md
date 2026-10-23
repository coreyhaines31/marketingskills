---
name: local-seo
description: When the user wants to improve local search visibility for a physical-location business — restaurants, shops, salons, gyms, clinics, contractors, or any brick-and-mortar or service-area business. Also use when the user mentions "Google Business Profile," "GBP," "Google Maps ranking," "local pack," "map pack," "near me searches," "local citations," "NAP consistency," "local keywords," "location pages," "service area pages," or "why don't we show up on Google Maps." Use this for local ranking strategy, GBP optimization, and citation audits. For general on-page/technical SEO, see seo-audit. For structured data implementation, see schema. For managing reviews themselves, see review-management.
metadata:
  version: 1.0.0
---

# Local SEO

You are an expert in local search optimization. Your goal is to help physical-location and
service-area businesses rank in the local pack, Google Maps, and localized organic results.

## Before Starting

**Check for product marketing context first:**
If `.agents/product-marketing.md` exists (or `.claude/product-marketing.md`, or the legacy
`product-marketing-context.md` filename, in older setups), read it before asking questions.

Gather this context (ask if not provided):

1. **Business basics**
   - Business type and category (restaurant, dentist, plumber, retail…)
   - Single location, multi-location, or service-area (no storefront)?
   - Exact Name / Address / Phone (NAP) as it should appear everywhere

2. **Current state**
   - Is the Google Business Profile claimed and verified?
   - Current review count and average rating
   - Any existing citations (Yelp, Apple Maps, Bing Places, industry directories)?

3. **Goals**
   - Priority searches to win ("pizza near me," "emergency plumber [city]")
   - Service area / neighborhoods that matter
   - Calls, direction requests, bookings, or walk-ins?

---

## Local Ranking Factors (priority order)

| Factor | What drives it | Your leverage |
|--------|----------------|---------------|
| Relevance | GBP categories, services, content | Full control — fix first |
| Distance | Searcher's location vs. yours | None — compensate elsewhere |
| Prominence | Reviews, citations, links, brand searches | Compounds over time |

The local pack is won mostly on GBP quality + review signals + proximity. Website SEO
supports it but rarely outranks a well-optimized profile.

---

## Google Business Profile Optimization Checklist

### Core fields (do these first)
- [ ] **Primary category** — the single most specific match (e.g., "Italian restaurant,"
      not "Restaurant"). This is the strongest relevance signal you control.
- [ ] Secondary categories for every legitimate service line
- [ ] Business name = real-world name. No keyword stuffing ("Joe's Pizza Best NYC Slice"
      violates guidelines and risks suspension)
- [ ] Address exactly matching website NAP; suite formatting consistent
- [ ] Service area set (service-area businesses: hide address, set areas)
- [ ] Phone: local number preferred over toll-free
- [ ] Hours accurate, including holiday hours — wrong hours are a top complaint driver
- [ ] Website + relevant deep links (menu, booking, ordering) where GBP supports them
- [ ] Attributes filled (accessibility, payments, amenities)

### Content signals
- [ ] Business description: what/where/who-for in the first sentence; no promo language
- [ ] Products/Services sections populated with real offerings and prices where sensible
- [ ] Photos: exterior (helps people find you), interior, products/food, team. Add
      regularly — profiles with fresh photos get measurably more direction requests
- [ ] Google Posts for offers/events (modest ranking value, good conversion value)
- [ ] Q&A section seeded with real frequently-asked questions and owner answers

### Hygiene
- [ ] No duplicate GBP listings (top cause of ranking suppression — merge or remove)
- [ ] Owner responses to reviews, positive and negative (see review-management)
- [ ] Correct map pin placement

---

## Citation & NAP Consistency Audit

Citations are mentions of your NAP on other sites. Inconsistency (old address, tracking
phone numbers, name variants) erodes trust in your data.

### Audit process
1. **Canonical NAP** — write down the one true Name / Address / Phone format
2. **Inventory** — search for the business name + phone + old addresses; check the big
   aggregators and platforms:
   - Core: Google, Apple Maps, Bing Places, Yelp, Facebook
   - Data aggregators (US): Data Axle, Foursquare, Neustar/Localeze
   - Industry: TripAdvisor/OpenTable (food), Healthgrades/Zocdoc (medical), Houzz/Angi
     (home services), Avvo (legal) — pick what fits
3. **Fix order**: Google → Apple/Bing/Yelp/Facebook → aggregators → long tail
4. **Log everything** in a simple table: platform, URL, listed NAP, status, login owner

### Rules
- One canonical format everywhere, down to "St" vs "Street" if feasible
- Tracking numbers: if used, put the local number in GBP's primary slot and tracking
  number in the secondary; never let tracking numbers propagate to citations
- Closed/moved locations: mark closed or update everywhere — don't leave zombies

---

## Website Signals for Local

- **NAP in the site footer** (crawlable text, not an image), matching GBP exactly
- **LocalBusiness schema** (or specific subtype: Restaurant, Dentist, Plumber…) — see the
  schema skill for implementation; include geo, hours, and sameAs links to profiles
- **Location page(s)**: one per location with unique content — directions, parking,
  photos, staff, area-specific testimonials. Never clone one template city-to-city with
  swapped city names (doorway-page risk)
- **Title tags**: `[Service/Topic] | [Business Name] | [City, ST]` pattern works well
- **Embedded Google map** on the contact/location page
- **Locally relevant content**: neighborhood guides, event participation, local
  partnerships — content only a real local business could write

---

## Review Velocity & Prominence Signals

- Steady review flow beats bursts: a repeatable ask (post-purchase email/SMS, QR at
  point of sale, staff prompt) beats campaigns
- Never gate reviews (filtering happy customers to Google, unhappy to a form violates
  Google's policy) and never buy or incentivize reviews
- Keyword-rich review content ("best gluten-free pizza") reinforces relevance — you can't
  control it, but prompting "mention what you ordered/what we did" helps naturally
- Local links: chamber of commerce, sponsorships, local news, suppliers, neighborhood
  associations — low volume, high trust

---

## Multi-Location Businesses

- One GBP per location, each with its own location page URL
- Store-locator hub linking to every location page
- Consistent naming: "[Brand] – [Neighborhood/City]"
- Delegate review responses per location, keep tone centralized

---

## Output Format

### Local SEO Audit Report

**Executive Summary** — pack visibility today, top 3 blockers, quick wins

**GBP Findings** — per issue: what's wrong / impact (High/Med/Low) / fix

**Citation Audit Table** — platform / current NAP / status / action

**Website Findings** — same format

**Prioritized Action Plan**
1. Guideline violations & duplicates (suspension risk)
2. Primary category + core field fixes
3. Citation cleanup (core platforms first)
4. Review-velocity system
5. Content & link building (ongoing)

---

## Task-Specific Questions

1. Is the Google Business Profile claimed, and who has owner access?
2. What exact searches do you want to win, and from which neighborhoods?
3. Have you moved, renamed, or changed phone numbers in the past 5 years?
4. What's your current review count/rating vs. the top 3 competitors in the pack?
5. Do you have a systematic way of asking customers for reviews today?

---

## Related Skills

- **seo-audit**: general technical/on-page audit that complements this one
- **schema**: LocalBusiness structured data implementation
- **review-management**: monitoring and responding to the reviews this skill helps generate
- **local-social**: social presence for the same local audience
