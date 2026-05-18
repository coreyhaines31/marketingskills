# Local SMB Prospecting Reference

For when the user sells to local small businesses — shops, gyms, restaurants, salons, clinics, professional services, contractors, real estate, fitness studios, dental practices.

Adapted from and generalized beyond the local-client-prospector pattern (browser-assisted discovery + website status classification + proximity scoring).

---

## ICP Signals That Matter (Local SMB branch)

### Operational signals

- **Active business** — Google Business Profile updated, recent reviews, recent hours updates
- **Recent activity** — open right now, regular hours posted, recent photos uploaded by owner
- **Customer engagement** — owner responding to reviews, posts on social, active calendar (for service businesses)

### Online presence signals (the core SMB qualification axis)

The reference local-client-prospector skill uses **website status** as the primary qualification — port this directly. Four classifications:

| Status | Definition | Typical outcome |
|--------|-----------|-----------------|
| **No site found** | No credible standalone website after cross-checked search | **Hot prospect** for web/marketing service |
| **Social only** | Facebook, Instagram, WhatsApp, Linktree, booking portal, marketplace page only — no standalone site | **Hot prospect** for web/marketing service |
| **Weak site** | Standalone site exists but outdated, broken, very thin, non-mobile-friendly, or missing clear contact/conversion flow | **Warm prospect** for refresh / rebuild service |
| **Has site** | Credible, modern standalone site exists | **Low prospect** unless other signals apply (e.g., poor SEO, weak conversion design) |

### Proximity signals

- **Distance** from the user's location or service area
- **Density** — clusters of similar businesses in one area = neighborhood targeting opportunity
- **Travel time** — useful when in-person discovery, install, or service delivery is required

### Decay signals

- Closed permanently (Google Maps banner)
- Reviews paused or business listing reported as closed
- Last activity (review, post) >12 months ago

---

## Discovery Sources (Local SMB branch)

### Primary

- **Google Maps** (browser, manual) — search "category near [location]" and walk the visible results. Cross-check details. Don't bulk-extract.
- **Yelp** — secondary verification; complementary categories
- **Bing Local / Apple Maps** — different coverage on smaller businesses
- **Facebook Pages search** — many SMBs are Facebook-only

### Cross-verification

- **Business's own website** (if any)
- **Industry directories** (e.g., Healthgrades for medical, OpenTable for restaurants, Avvo for legal)
- **Local Chamber of Commerce listings**
- **State business registries** for incorporation status
- **Search results for "[business name] [city]"** to discover non-Maps presence

---

## Browser Research Workflow

1. Open a browser and search Google Maps for the category near `base_location`
2. Build a candidate list from visible local results, search results, and public directories
3. For each candidate, inspect public sources to fill required fields
4. Search the exact business name plus city/town to check whether a standalone website exists
5. Classify website status per the table above
6. Mark confidence: High (2+ sources), Medium (1 source + consistent evidence), Low (incomplete/ambiguous)

When the user explicitly asks for subagents AND subagents are available, split candidates into non-overlapping batches and ask each subagent to verify only website/social/contact status. Don't use subagents for the primary search if it slows progress.

### Optional: programmatic verification with Firecrawl or Browserbase

Once you have a candidate's website URL (found via manual Maps/Yelp discovery), you can speed up website-status classification by hitting the URL programmatically:

- **Firecrawl** for simple "is this site live, modern, mobile-friendly, conversion-flow-equipped" reads — returns clean markdown you can inspect
- **Browserbase** when the candidate site requires JS rendering, has a cookie consent dialog, or you need session state

**Strict line**: use these on the individual business's URL. **Don't** point them at Google Maps, Yelp, or any platform whose ToS prohibits bulk extraction — discovery stays manual.

See [data-sources.md](data-sources.md) for setup details.

---

## Qualification Checklist (Local SMB branch)

- [ ] Business is active (recent reviews or activity in last 6 months)
- [ ] Category matches user's service offering
- [ ] Distance / proximity within target radius
- [ ] Website status classified
- [ ] Phone or contact channel verified
- [ ] At least one cross-source confirms business operates at the listed address
- [ ] Not a duplicate / chain location / out-of-scope category
- [ ] Not closed permanently

---

## Lead Scoring (Local SMB)

Use this simple rubric (matches local-client-prospector pattern):

| Score | Criteria |
|-------|----------|
| **Hot** | No site found OR social-only + phone present + active business + within target radius |
| **Warm** | Weak site, poor online presentation, or marketplace/booking-page only |
| **Cold** | Good website already present OR low confidence |
| **Skip** | Closed, duplicate, outside radius, irrelevant category, or not a business prospect |

---

## Output Columns (Local SMB branch)

Chat table (≤15 rows):

```
| Score | Business | Category | Area | Distance | Website status | Website/Social | Phone | Why it's a prospect | Confidence |
```

CSV:

```csv
score,business,category,area,distance_km,website_status,website_url,social_urls,phone,email,source_urls,why_prospect,confidence,verified_date,notes
```

Rules:
- Keep "Why it's a prospect" short and actionable
- Use `Not found` instead of leaving blank fields
- Include source links sparingly, not all of them
- After the table, add **Best first outreach targets** with the top 3 leads and one practical reason each
- If confidence is low, state exactly what remains uncertain

---

## Top Outreach Targets Selection (Local SMB)

Prioritize for the top 3 hot leads:

1. **No site / social only + phone present** = clearest service opportunity
2. **High review count** = active, established business with real customers
3. **Owner-responded reviews** = engaged owner = more likely to evaluate a vendor
4. **Industry alignment with your service specialty** beats generic category match

Each top target rationale should be one sentence naming the gap and the signal: "No standalone website (cross-checked); 80+ Google reviews with owner replies; 2 km from target area."

---

## Compliance Notes (Local SMB-specific)

The local branch is the most scraping-sensitive of the three motions. Specifically:

- **Google Maps Terms of Service** prohibit bulk extraction. Treat browser visits as research, not as data acquisition.
- **Don't store full Google Maps Place IDs in your CRM** — the ToS limits storage of Maps data.
- **Public business contact channels only**: published phone, contact form, info@ email. Don't reach individual employees through their personal channels.
- **Owner/operator name when published on the business's own site** is OK to use. If you only got it from LinkedIn, mark the source.

---

## Common Mistakes (Local SMB)

1. **Bulk-scraping Google Maps** — fastest way to violate ToS and lose the research channel.
2. **Treating Google Maps data as truth** — listings go stale. Cross-check hours, status, and reviews.
3. **Skipping the website status cross-check** — finding "no site" on Maps doesn't mean no site exists; do an exact-name web search before classifying.
4. **Targeting only the largest businesses** — they're already covered by other providers. The 2–5 employee SMBs are the under-served opportunity.
5. **Generic outreach to all hot leads** — local SMBs respond better to outreach that names their specific gap ("I noticed your menu isn't visible on mobile") than generic pitches.
6. **Ignoring chains and franchises** as Skip — sometimes the franchisee is the buyer and they have local marketing authority. Verify before skipping.
