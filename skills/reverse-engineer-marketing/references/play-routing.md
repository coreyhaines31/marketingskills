# Play Routing

Every play in a teardown names the skill that runs it and, for repeat work, the loop that keeps it going. Use this table to route each one. Write the play's prompt so it starts with that skill and passes along the teardown's specifics (the formula, the page family, the evidence link).

## Contents
- Routing table
- Writing the prompt
- Example

---

## Routing Table

| What the teardown found | Skill that runs it | Loop that keeps it going (marketing-loops) |
|---|---|---|
| A page family carrying non-brand traffic (templates, integrations, use cases, locations) | **programmatic-seo** | The programmatic-SEO quality loop |
| Comparison or alternative pages ranking | **competitors** | The keyword-gap loop |
| Glossary, guides, or a blog driving traffic | **content-strategy**, then **copywriting** | The content-calendar refill loop |
| Named and cited first in AI answers | **ai-seo** | The AI-answer check loop |
| Links from many domains to one asset | **link-building** | The backlink-prospecting loop |
| A free tool or calculator earning traffic | **free-tools** | (none; one-off build) |
| Long-running ads on a network | **ads** for structure, **ad-creative** for creative | The daily-creative-drop loop, the ad-fatigue loop |
| Founder posts with numbers driving reach | **social** | The content-repurposing loop |
| A content format or formula winning on a channel | **social** (short-form scripts and posts), **video** for production | The niche-outlier loop |
| Creators teaching the product | **influencer-marketing** | The creator-scouting loop |
| A launch, launch week, or Product Hunt spike | **launch** | The launch-reaction loop |
| Press or podcast runs | **public-relations** | The newsjacking loop |
| Community threads driving signups | **community-marketing** | The community-engagement loop |
| A "made with" badge or shared output loop | **referrals** (loop design), **signup** (the landing step) | The referral-nudge loop |
| An affiliate or referral program | **referrals** | The referral-nudge loop |
| Directory and marketplace listings | **directory-submissions** | The directory-submission loop |
| Fast first result, light sign-up | **signup**, **onboarding** | The onboarding drop-off loop |
| A pricing or packaging change that lined up with growth | **pricing** | The pricing-page-experiment loop |
| A trial or credit model that converts | **paywalls** | The trial-conversion loop |
| Partner or integration listings | **co-marketing** | The partner-pipeline loop |
| Lifecycle email or in-app nudges | **emails** | The lifecycle-email-refresh loop |
| A lead magnet or gated asset | **lead-magnets** | The lead-capture-asset loop |
| Outbound to a defined account list | **prospecting**, **cold-email** | The signal-sweep loop |
| An onboarding email sequence that converts (stage 3) | **emails** | The lifecycle-email-refresh loop |
| Save offers in the cancel flow (stage 3) | **churn-prevention** | The churn-signal loop |
| A fast, well-run sales process (stage 3) | **sales-enablement**, **revops** | (none; one-off build) |
| A positioning shift that came before growth (stage 5) | **product-marketing** for positioning, **copywriting** for the homepage | The claim-drift loop |
| Newsletter, podcast, or YouTube sponsorships (stage 5) | **influencer-marketing** | The creator-scouting loop |
| Coupon or lifetime-deal distribution (stage 5) | **offers** | (none; one-off test) |
| Events, virtual events, or conference sponsorships (stage 5) | **events** | (none; per event) |
| A review campaign (stage 5 review spike) | **referrals** (review programs) | The review-site-management loop |
| A marketplace or integration listing (stage 5) | **co-marketing**, **directory-submissions** | The partner-pipeline loop |
| An order bump, upsell, or downsell sequence (Funnel Hack) | **offers**, **cro** | The pricing-page-experiment loop |
| An abandoned-cart or abandoned-opt-in flow (Funnel Hack) | **emails**, **sms** | The lifecycle-email-refresh loop |
| A quiz or webinar funnel (Funnel Hack) | **lead-magnets**, **events** | The lead-capture-asset loop |
| Conquesting ads on competitor names (Funnel Hack) | **ads**, **competitors** | The paid-search query-mining loop |
| An industry-specific play from an industry pack | The skill the pack names | The loop the pack's play needs, if any |

Every play also needs its metric tracked. If the user can't measure it today, add an **analytics** step to the prompt.

Some plays don't transfer. A play that depended on the target's funding, audience, or founder fame goes in plays to skip, with the reason.

## Writing the Prompt

A good prompt gives the skill everything it would otherwise ask for:

1. **The skill:** "Use the programmatic-seo skill."
2. **The evidence:** what the target did and the link.
3. **The user's version:** the specific asset, scaled to the user's stage.
4. **The formula or house style** from stage 6, if it's a content play.
5. **The metric** and when to check it.

## Example

> Use the programmatic-seo skill. Acme's `/templates/*` family (480 pages, observed in their sitemap, 2026-10-30) carried about 41% of their non-brand search traffic, and it existed four months before their growth inflection. We have 12 template pages. Plan a template page family for our invoicing product: the template types our customers search for, the page structure, the data each page needs, and internal links from our pricing and features pages. Start with the 20 highest-volume template keywords. Track impressions for `/templates/` in Search Console weekly, and check at 60 days.
