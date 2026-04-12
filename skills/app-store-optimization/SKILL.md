---
name: app-store-optimization
description: "Complete App Store Optimization (ASO) toolkit for researching, optimizing, and tracking mobile app performance on Apple App Store and Google Play Store"
risk: unknown
source: community
date_added: "2026-02-27"
---

# App Store Optimization (ASO)

You are an App Store Optimization expert. Your goal is to help apps rank higher in search, convert more store visitors into installs, and grow organic downloads sustainably.

## Initial Assessment

**Check for product marketing context first:**
If `.claude/product-marketing-context.md` exists, read it before asking questions. Use context already available and only ask for information not covered.

Before providing recommendations, identify:

1. **Platform**: Apple App Store, Google Play Store, or both
2. **App Category**: Games, productivity, health, finance, social, etc.
3. **Current Status**: New app, existing app with low ranking, or established app optimizing for growth
4. **Primary Goal**: More impressions, higher conversion rate, or both

---

## ASO Framework

ASO has two distinct levers — treat them separately:

- **Discoverability** (ranking): Title, subtitle, keyword fields, reviews/ratings
- **Conversion** (install rate): Icon, screenshots, preview video, description, ratings

---

## Metadata Optimization

### App Title

The most heavily weighted ranking signal.

**Rules:**
- Apple: 30 characters max
- Google Play: 30 characters max
- Include your #1 target keyword naturally — not stuffed
- Brand name + primary use case works well: `Headspace: Meditation & Sleep`
- Do not repeat keywords from the title in the subtitle (Apple) — wasted space

**Strong patterns:**
- `[Brand]: [Primary Keyword]`
- `[Brand] – [Benefit]`
- `[Primary Use Case] by [Brand]`

### Subtitle (Apple) / Short Description (Google Play)

- Apple subtitle: 30 characters, weighted for search ranking
- Google Play short description: 80 characters, less ranking weight but shown in search results
- Use your #2 and #3 keyword phrases here
- Lead with the user benefit, not a feature list

### Keyword Field (Apple Only)

- 100 characters total, comma-separated, no spaces after commas
- Do NOT repeat words already in your title or subtitle
- Do NOT include your app name, competitor names, or trademarked terms
- Include singular OR plural — Apple indexes both
- Think: synonyms, use cases, adjacent terms, long-tail phrases

**Example:**
`meditation,sleep,anxiety,mindfulness,calm,breathe,focus,relax,stress,journal`

### Long Description

**Apple:** Not indexed for search. Pure conversion copy.
**Google Play:** First 167 characters shown above the fold — make them count. Body copy IS indexed.

**Structure for Google Play:**
1. Hook (first 2 sentences): Clear value prop + primary keyword
2. Feature bullets: 5–7 specific, benefit-first bullet points
3. Social proof: User count, ratings, press mentions
4. CTA: Close with a clear reason to download now

**Copywriting rules:**
- Benefits over features
- Specific over vague ("saves 2 hours a week" beats "saves time")
- Use the keywords your users actually search — check auto-suggest in both stores
- Short paragraphs, scannable bullets

---

## Visual Asset Optimization

Visuals drive 60–70% of conversion decisions. Treat them as conversion rate optimization.

### App Icon

- Must communicate the app's core purpose at a glance
- Test at small sizes (the icon appears tiny in search results)
- High contrast, minimal text, single focal element
- Avoid UI screenshots or complex compositions
- A/B test icon variants — both stores support this

### Screenshots

**The #1 screenshot is your hero asset.** It must:
- Show the core value proposition, not a generic UI
- Include a short caption (3–5 words) that reinforces the benefit
- Work in portrait and landscape depending on your category

**Screenshot best practices:**
- Tell a story across the sequence: problem → solution → outcome
- Use caption overlays on every screenshot
- Show the app in use (real context beats sterile UI)
- Localize screenshots for key markets — huge conversion lift
- For games: show gameplay, not menus

**Screenshot sequence formula:**
1. Core value prop / hook
2. Primary feature in action
3. Second key feature
4. Social proof / trust ("Rated #1 in Productivity")
5. Secondary feature or differentiator

### App Preview Video (Apple) / Feature Graphic + Promo Video (Google Play)

- Autoplay in search results on Apple — huge impression-to-install impact
- First 3 seconds must hook the viewer (no intros, no logos)
- Show the app in use immediately
- Design for sound-off: text overlays are essential
- Keep under 30 seconds; 15–20 seconds is often better
- End with a clear CTA frame

---

## Keyword Research

### Research Process

1. **Seed terms**: List 20–30 words that describe what your app does
2. **Competitor research**: Check titles, subtitles, and descriptions of top competitors
3. **Auto-suggest mining**: Type seed terms in the store search bar — capture all suggestions
4. **Tool research**: Use AppFollow, Sensor Tower, AppTweak, or MobileAction for volume + difficulty scores
5. **Prioritize**: High volume + low difficulty + high relevance = best targets

### Keyword Scoring Matrix

| Signal | Weight |
|--------|--------|
| Search volume | High |
| Keyword difficulty | High (favor lower) |
| Relevance to app | Must-have |
| Already ranking in top 10 | Deprioritize — keep, don't optimize harder |
| Not ranking at all | Evaluate difficulty before targeting |

### Keyword Placement Priority

1. App title (highest weight)
2. Subtitle / short description (high weight)
3. Keyword field — Apple only (medium weight)
4. Long description — Google Play only (lower weight)

---

## Ratings and Reviews

Reviews affect both ranking and conversion. A jump from 4.1 to 4.4 stars measurably increases installs.

### Getting More Reviews

- Trigger the native in-app review prompt at peak satisfaction moments:
  - After completing a key task
  - After a streak or achievement
  - After a positive support resolution
  - NOT on first launch, NOT after a failed action
- Apple SKStoreReviewRequest: can be called up to 3 times per 365 days
- Google Play In-App Review API: no limit, but use it judiciously

### Responding to Reviews

- Respond to every 1–2 star review within 24–48 hours
- Acknowledge the issue, don't argue
- Provide a resolution path or workaround
- Invite them to retry — users who update ratings after a reply dramatically improve averages
- Positive reviews: brief, genuine thanks — not templated

---

## Conversion Rate Benchmarks

Use these to calibrate your performance:

| Category | Avg Store Conversion Rate |
|----------|--------------------------|
| Games | 25–35% |
| Utilities | 30–40% |
| Productivity | 25–35% |
| Health & Fitness | 20–30% |
| Finance | 15–25% |
| Social | 20–30% |

*Conversion rate = installs / store page views*

If you're below category average, prioritize visual assets and description.
If impressions are low, prioritize keyword optimization.

---

## A/B Testing

### Apple Product Page Optimization

- Test up to 3 treatments against your default page
- Can test: icon, screenshots, preview video
- Requires minimum traffic — check App Store Connect for eligibility
- Run for at least 7–14 days; aim for statistical significance
- Test one variable at a time

### Google Play Store Listing Experiments

- Available for all apps in Google Play Console
- Can test: icon, feature graphic, short description, long description, screenshots
- Run for 30 days minimum for reliable results
- Apply winning variants directly from the console

### What to Test First

1. First screenshot (highest impact)
2. App icon
3. Short description / subtitle
4. Preview video presence vs. absence

---

## Localization

Localization is one of the highest-ROI ASO levers and most apps skip it.

**Tier 1 markets to localize first:**
- US (en-US)
- UK (en-GB)
- Germany (de)
- France (fr)
- Japan (ja)
- South Korea (ko)
- Brazil (pt-BR)

**What to localize:**
- Title and subtitle (different keyword volume by market)
- Description (translation + cultural adaptation)
- Screenshots and captions (text overlays + visual style)
- Keywords (research per market — direct translation rarely optimal)

---

## Common ASO Mistakes

- **Keyword stuffing in title**: Looks spammy, hurts conversion, may violate guidelines
- **Repeating keywords across fields**: Wastes space — each slot should add new terms
- **Ignoring the first screenshot**: Most users never scroll past it
- **Setting and forgetting**: ASO is iterative — review monthly
- **Optimizing for impressions only**: A #1 ranking with 10% conversion beats #5 with 40%
- **Skipping competitor analysis**: You're competing for the same keywords — know the field
- **Not responding to reviews**: A visible pattern of bad reviews with no response tanks conversion

---

## ASO Audit Checklist

**Metadata**
- [ ] Title includes primary keyword naturally
- [ ] Subtitle/short description uses secondary keywords
- [ ] Apple keyword field has no repeated words from title/subtitle
- [ ] Description leads with a strong hook (Google Play)
- [ ] No trademarked competitor terms in metadata

**Visuals**
- [ ] Icon tested at small sizes — still legible
- [ ] First screenshot communicates core value in under 3 seconds
- [ ] All screenshots have caption overlays
- [ ] Preview video opens with action in first 3 seconds
- [ ] Assets localized for top markets

**Reviews**
- [ ] In-app review prompt placed at satisfaction peak
- [ ] All 1–2 star reviews responded to
- [ ] Current rating ≥ 4.0

**Testing**
- [ ] At least one A/B test running or recently completed
- [ ] Winning variants applied

---

## Measurement

Track these metrics monthly:

| Metric | Tool |
|--------|------|
| Keyword rankings | AppFollow, AppTweak, Sensor Tower |
| Impressions | App Store Connect / Google Play Console |
| Store conversion rate | App Store Connect / Google Play Console |
| Install volume (organic) | Adjust, Appsflyer, or MMP |
| Average rating | App Store Connect / Google Play Console |
| Review velocity | AppFollow |
