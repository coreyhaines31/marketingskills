# Programmatic SEO Assessment: Alchemy of Breath

**Domain**: alchemyofbreath.com
**Date**: March 2026
**Skill**: marketing-skills/programmatic-seo v1.1.0
**Emphasis**: Schema markup + scale opportunities

---

## Executive Summary

Alchemy of Breath has significant programmatic SEO potential across 4 playbooks:
1. **Personas** — "breathwork for [audience/condition]" pages
2. **Glossary** — "what is [breathwork term]" pages
3. **Locations** — "breathwork facilitator in [city]" using the find-facilitator directory
4. **Comparisons** — "breathwork vs [modality]" and "alchemy of breath vs [competitor]"

The facilitator directory (`/find-facilitator/`) is the single biggest programmatic opportunity — it is already a structured data source waiting to become 500+ rankable location/profile pages.

---

## Opportunity 1: Facilitator Directory (HIGHEST PRIORITY)

### The Opportunity

AoB has a certified facilitator network spanning multiple countries. The current `/find-facilitator/` page likely shows a searchable map or list. This should become **individual facilitator profile pages**.

### Playbook: Profiles + Locations

**URL pattern**: `/facilitators/{name}-{city}/` or `/find-facilitator/{city}/`

**Page template** (per facilitator):
```
Title: [Facilitator Name] — Certified Breathwork Facilitator in [City]
H1: [Full Name], Alchemy of Breath Certified Breathwork Facilitator
Location: [City, Country]
Specialty: [e.g., trauma, anxiety, corporate wellness]
Session types: [online, in-person, group]
Contact/Book: [link to their booking page]
Bio: [2-3 paragraphs from facilitator]
Credentials: Certified by Alchemy of Breath ([year])
```

**URL pattern** (location hub):
```
/find-facilitator/ (hub — all facilitators, search map)
├── /find-facilitator/united-kingdom/
│   ├── /find-facilitator/united-kingdom/london/
│   └── /find-facilitator/united-kingdom/edinburgh/
├── /find-facilitator/united-states/
│   ├── /find-facilitator/united-states/new-york/
│   └── /find-facilitator/united-states/los-angeles/
├── /find-facilitator/germany/
├── /find-facilitator/australia/
└── /find-facilitator/online/  ← high volume opportunity
```

**Target keywords**:
- "breathwork facilitator London" (est. 200-500/mo)
- "breathwork facilitator near me" (est. 1,500+/mo — geo-served)
- "breathwork facilitator online" (est. 800/mo)
- "certified breathwork facilitator [city]"

**Schema for facilitator profile pages**:
```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "name": "[Facilitator Name]",
      "jobTitle": "Certified Breathwork Facilitator",
      "hasCredential": {
        "@type": "EducationalOccupationalCredential",
        "credentialCategory": "certification",
        "name": "Alchemy of Breath Certified Facilitator",
        "recognizedBy": {
          "@type": "Organization",
          "name": "Alchemy of Breath"
        }
      },
      "knowsAbout": ["Breathwork", "Conscious Connected Breathwork", "Somatic Healing"],
      "areaServed": {
        "@type": "City",
        "name": "[City]"
      }
    },
    {
      "@type": "LocalBusiness",
      "name": "[Facilitator Name] — Breathwork",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "[City]",
        "addressCountry": "[Country Code]"
      },
      "priceRange": "$$",
      "serviceType": "Breathwork Sessions"
    }
  ]
}
```

**Scale**: If AoB has 200+ certified facilitators globally, this is 200+ indexed pages immediately, each targeting a local keyword. With proper schema, individual facilitator pages can appear in local search results.

**Effort**: Medium (requires facilitator data export from academy platform + WordPress template)

---

## Opportunity 2: "Breathwork For [Condition/Audience]" Pages

### The Opportunity

High-volume searches exist for breathwork as a solution to specific conditions. AoB's content (and training curriculum) covers all of these. These pages don't exist currently as dedicated landing pages.

### Playbook: Personas

**URL pattern**: `/breathwork-for/{condition-or-audience}/`

**Priority pages to build**:

| Page URL | Target Query | Est. Monthly Volume | Current Coverage |
|----------|-------------|---------------------|-----------------|
| /breathwork-for/anxiety/ | breathwork for anxiety | 5,000+ | None |
| /breathwork-for/trauma/ | breathwork for trauma | 3,000+ | None |
| /breathwork-for/depression/ | breathwork for depression | 2,500+ | None |
| /breathwork-for/stress/ | breathwork for stress | 4,000+ | None |
| /breathwork-for/sleep/ | breathwork for sleep | 2,000+ | None |
| /breathwork-for/beginners/ | breathwork for beginners | 3,500+ | Partial |
| /breathwork-for/ptsd/ | breathwork for ptsd | 1,500+ | None |
| /breathwork-for/therapists/ | breathwork for therapists | 800+ | None |
| /breathwork-for/yoga-teachers/ | breathwork for yoga teachers | 500+ | None |
| /breathwork-for/corporate/ | breathwork corporate wellness | 1,200+ | None |

**Page template** (each page):
```
H1: Breathwork for [Condition]: How Conscious Connected Breathing Supports [Outcome]

[Definition block — 50 words, AI-extractable]
[Science/mechanism section — with cited studies]
[What to expect in a session section]
[HowTo schema — basic practice they can try now]
[Testimonial/case study]
[CTA: Free session → Training → Find facilitator]
[FAQ schema — 4-5 questions]
```

**Schema additions**:
- `MedicalWebPage` or `WebPage` with `MedicalAudience` if applicable (careful — avoid medical claims)
- `HowTo` for any breathing technique on the page
- `FAQPage` for common questions
- `Article` with author credentials

**Scale**: 10-20 pages covering all major conditions and audiences

**Effort**: Low-medium (template-based, can use existing AoB content as source material)

---

## Opportunity 3: Breathwork Glossary ("What Is [Term]")

### The Opportunity

The breathwork space has many terms that people search for definitions. AoB already has one page targeting this: `/what-is-the-difference-between-breathwork-functional-breath-work-pranayama/` — but it's poorly structured and has an SEO-unfriendly URL.

### Playbook: Glossary

**URL pattern**: `/breathwork-guide/{term}/` or `/what-is/{term}/`

**Priority glossary entries**:

| URL | Query | Est. Volume |
|-----|-------|-------------|
| /what-is/breathwork/ | what is breathwork | 12,000+ |
| /what-is/conscious-connected-breathwork/ | conscious connected breathwork | 1,200+ |
| /what-is/holotropic-breathwork/ | what is holotropic breathwork | 2,500+ |
| /what-is/transformational-breathwork/ | transformational breathwork | 800+ |
| /what-is/somatic-breathwork/ | somatic breathwork | 1,500+ |
| /what-is/pranayama/ | what is pranayama | 8,000+ |
| /breathwork-vs/pranayama/ | breathwork vs pranayama | 1,000+ |
| /breathwork-vs/meditation/ | breathwork vs meditation | 2,000+ |
| /breathwork-vs/yoga/ | breathwork vs yoga | 800+ |

**Schema additions**:
```json
{
  "@context": "https://schema.org",
  "@type": "DefinedTerm",
  "name": "Conscious Connected Breathwork",
  "description": "A somatic breathing practice where the inhale and exhale are connected without pausing, creating a circular breathing pattern that activates the autonomic nervous system and supports emotional processing.",
  "inDefinedTermSet": {
    "@type": "DefinedTermSet",
    "name": "Alchemy of Breath Breathwork Glossary"
  }
}
```

**Scale**: 15-30 pages covering all major modalities and comparisons

---

## Opportunity 4: Comparison Pages

### The Opportunity

"Breathwork training [X] vs [Y]" and "alternatives to [X]" searches are growing as the space gets more crowded.

### Playbook: Comparisons

**URL pattern**: `/compare/{competitor}/` or `/breathwork-training/{competitor}-alternative/`

**Priority pages**:

| URL | Target Query | Notes |
|-----|-------------|-------|
| /compare/soma-breath/ | soma breath vs alchemy of breath | Direct competitor |
| /compare/others/ | best breathwork facilitator training | Generic comparison |
| /breathwork-training-alternatives/ | breathwork training alternatives | Category intent |

**Note**: Handle comparisons fairly and accurately. AI systems penalize obviously biased comparison content. AoB's differentiators (accreditations, founder credentials, Tuscany retreats) should be stated factually, not hyperbolically.

---

## Implementation Roadmap

### Phase 1 (After WAF fix + blog restructure): Weeks 1-4

**Build the "breathwork for [condition]" hub**:
```
1. Create hub page: /breathwork-for/ (overview + list of all condition pages)
2. Build top 5 priority condition pages:
   - /breathwork-for/anxiety/
   - /breathwork-for/stress/
   - /breathwork-for/beginners/
   - /breathwork-for/trauma/
   - /breathwork-for/sleep/
3. Add HowTo + FAQPage schema to each
4. Internal link from homepage, training page, and free-sessions page
```

### Phase 2: Weeks 5-8

**Glossary + What Is pages**:
```
1. Create hub: /what-is/breathwork/ (the definitive resource)
2. Build 8 glossary pages for modalities and comparisons
3. Migrate existing /what-is-the-difference-between-breathwork-functional-breath-work-pranayama/
   → 301 redirect → /breathwork-vs/pranayama/
4. Add DefinedTerm schema
```

### Phase 3: Weeks 9-16

**Facilitator directory pages**:
```
1. Export facilitator data from academy platform (name, city, country, specialty, bio)
2. Create WordPress template for facilitator profile pages
3. Build location hub pages by country/city
4. Generate individual facilitator pages from data
5. Add LocalBusiness + Person schema to each
6. Submit in sitemap as separate sitemap section
```

---

## Schema at Scale: The Programmatic Approach

For 100+ pages, schema cannot be written manually. Implementation approach by phase:

| Phase | Page Type | Schema Type | Implementation Method |
|-------|-----------|------------|----------------------|
| 1 | Condition pages | HowTo + FAQPage + Article | Rank Math custom fields per page |
| 2 | Glossary pages | DefinedTerm + Article | WordPress custom template with ACF fields |
| 3 | Facilitator profiles | Person + LocalBusiness | WP custom post type with auto-generated JSON-LD |
| 3 | Location hubs | ItemList + LocalBusiness | WP archive template with schema |

**For facilitator profiles at scale**:
```php
// WordPress: add to functions.php or custom plugin
// Outputs JSON-LD for each facilitator CPT

function aob_facilitator_schema() {
  if (is_singular('facilitator')) {
    $name = get_the_title();
    $city = get_field('city');
    $country = get_field('country_code');

    $schema = [
      '@context' => 'https://schema.org',
      '@type' => 'Person',
      'name' => $name,
      'jobTitle' => 'Certified Breathwork Facilitator',
      'hasCredential' => [
        '@type' => 'EducationalOccupationalCredential',
        'name' => 'Alchemy of Breath Certified Facilitator',
      ],
      'areaServed' => [
        '@type' => 'City',
        'name' => $city,
      ],
    ];

    echo '<script type="application/ld+json">' . json_encode($schema) . '</script>';
  }
}
add_action('wp_head', 'aob_facilitator_schema');
```

---

## Crawl Budget & Indexation for Scale

When launching 100+ pages:

```
1. Use a separate sitemap section: sitemap-facilitators.xml
2. Reference from sitemap_index.xml
3. Submit facilitator sitemap to Google Search Console separately
4. Monitor: Search Console Coverage report → watch for "Discovered but not indexed"
5. Prioritize: Noindex facilitator pages with <50 words of unique content
6. Add InternalSearch schema to /find-facilitator/ hub page
```

---

## ROI Projection (Conservative)

| Opportunity | Est. Pages | Avg. Monthly Searches | Est. Organic Traffic (3% CTR) | Primary Conversion |
|-------------|-----------|----------------------|------------------------------|-------------------|
| Condition pages | 15 | 2,500/page | 37 visits/page = 555 total | Free sessions → training |
| Glossary | 20 | 3,000/page | 90 visits/page = 1,800 total | Brand awareness → training |
| Facilitator profiles | 200 | 150/profile | 4.5 visits/profile = 900 total | Facilitator bookings |
| Comparisons | 5 | 1,000/page | 30 visits/page = 150 total | Training conversion |
| **Total** | **240** | — | **~3,400 additional organic visits/mo** | — |

*At 1% conversion to training inquiry and $3,000 ACV: ~34 leads/mo potential from programmatic pages alone.*

---

*Built using: marketing-skills/programmatic-seo v1.1.0 | Claude Code | March 2026*
