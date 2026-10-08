# Location Pages and Measurement

Use this when the request includes local pages, schema, or performance reporting.

## Page Content That Helps a Local Customer

For a real customer-facing location, include accurate location/contact details, hours, services available there, booking/call links, access/parking directions where known, staff or location evidence, and useful nearby/service information. Link it from a location index and relevant service pages.

For service coverage without an office, explain actual availability, constraints, travel or call-out policies, relevant local work examples when available, and a clear enquiry path. Say that it is a service area. Do not show a fake street address or imply a staffed branch.

Example decision: a plumber has one operating base and serves two nearby towns. One honest coverage page may suffice. Separate town pages are justified only by additional useful information or evidence; neither town automatically merits another Business Profile.

Before scaling, confirm a stable data source and meaningful differences across pages. Check the current [doorway-abuse policy](https://developers.google.com/search/docs/essentials/spam-policies#doorway-abuse). Route justified templates to programmatic-seo and hierarchy to site-architecture; consolidate pages when the proposed variants add no value.

## Local Structured Data

Use the most specific accurate LocalBusiness subtype and a stable identifier for each real location. Match the visible page facts; connect the location URL, public phone, hours, and physical coordinates where applicable. Do not mark service cities as invented branches or publish a hidden residential address through JSON-LD.

Important distinction: Schema.org can describe a business without satisfying Google's rich-result requirements. Google's [LocalBusiness documentation](https://developers.google.com/search/docs/appearance/structured-data/local-business) requires an address for that search feature. For a business that cannot publish one, preserve privacy and explain that the rich-result requirement is unmet; do not fabricate an address or promise eligibility from `areaServed` alone.

Self-serving LocalBusiness review markup does not earn review stars merely because the business displays testimonials. Do not import a profile rating into markup as a shortcut to stars.

Use schema for implementation. Validate the rendered page and relevant test tools, then verify deployed markup matches the public content. A stripped text fetch is insufficient proof that JavaScript-injected JSON-LD is absent. Validation does not guarantee display or a local-pack ranking change.

## Measure Customer Outcomes

Keep a baseline by location and period:

| Metric | Evidence | Interpretation limits |
|---|---|---|
| Qualified calls/bookings/leads | CRM or owner-confirmed outcomes | Deduplicate; attribution may be incomplete |
| Profile interactions | Available Business Profile performance export | Interaction is not a completed sale |
| Organic local queries/pages | Search Console query/page reports | Privacy thresholds and aggregation limit detail |
| Website actions from profile links | Analytics with consistent campaign tags | Consent, blockers, and tagging can affect counts |
| Local visibility | Comparable query/location observations | Distance, personalization, and volatility matter |

Use a consistent tagging convention for profile website links while keeping the canonical location URL stable. Test that redirects and booking flows preserve the attribution needed. For call tracking, retain a genuine reachable business contact and verify the platform's current phone rules; do not blindly replace canonical citation numbers.

Review changes against a comparable period, seasonality, opening-hours changes, and service capacity. Record what changed and when. Treat a visibility increase as an observation, not proof of causation or additional revenue. Set follow-up timing with the user rather than promising a universal recovery deadline.
