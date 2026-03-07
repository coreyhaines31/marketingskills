# AI SEO & Schema Markup Strategy: Alchemy of Breath

**Domain**: alchemyofbreath.com
**Date**: March 2026
**Skills**: marketing-skills/ai-seo v1.1.0 + marketing-skills/schema-markup v1.1.0
**Prerequisite**: Complete WAF fix (TECH-01 in seo-audit-2026-03.md) before any of this has effect.

---

## AI Search Visibility Assessment

### Current AI Visibility: ZERO (Estimated)

Due to the WAF blocking all automated HTTP requests with HTTP 403, all AI crawlers are currently blocked:

| AI Bot | User Agent | Status |
|--------|-----------|--------|
| ChatGPT (OpenAI) | GPTBot, ChatGPT-User | ❌ Blocked (403) |
| Perplexity | PerplexityBot | ❌ Blocked (403) |
| Claude (Anthropic) | ClaudeBot, anthropic-ai | ❌ Blocked (403) |
| Gemini / AI Overviews (Google) | Google-Extended | ❌ Blocked (403) |
| Copilot (Microsoft) | Bingbot | ❌ Likely Blocked |

**This is the highest-impact fix on the entire site.** Once bots are unblocked, Alchemy of Breath can begin accruing AI citations. Until then, no content optimization will help — AI systems literally cannot read the site.

### Why This Matters for AoB Specifically

"Breathwork" and "breathwork facilitator training" are query types with **high AI Overview prevalence**:
- "What is breathwork?" → Google AI Overview almost certainly exists
- "Best breathwork facilitator training" → AI Overviews and Perplexity comparisons
- "Breathwork for anxiety" → High-volume, high-AI-Overview presence

AoB founder Anthony Abbagnano's credentials (GPBA board, Shift Network faculty, co-stage with Deepak Chopra) are exactly the kind of E-E-A-T signals AI systems weight heavily — but only if the content is accessible.

---

## AI Visibility Query Testing (Manual — Run After WAF Fix)

Test these 15 queries across ChatGPT, Perplexity, and Google AI Overviews:

| # | Query | AoB Cited? | Who Is Cited? | Priority |
|---|-------|-----------|--------------|----------|
| 1 | What is breathwork? | — | — | High |
| 2 | Best breathwork facilitator training | — | — | High |
| 3 | Breathwork certification online | — | — | High |
| 4 | Breathwork for anxiety | — | — | High |
| 5 | Conscious connected breathwork | — | — | High |
| 6 | Breathwork vs pranayama | — | — | Medium |
| 7 | Holotropic breathwork training | — | — | Medium |
| 8 | Free breathwork sessions online | — | — | Medium |
| 9 | Breathwork retreats Italy | — | — | Medium |
| 10 | Breathwork for trauma | — | — | Medium |
| 11 | How to become a breathwork facilitator | — | — | High |
| 12 | Breathwork techniques | — | — | Medium |
| 13 | Alchemy of Breath review | — | — | Low |
| 14 | Breathwork training accredited | — | — | Medium |
| 15 | Anthony Abbagnano breathwork | — | — | Low |

*Fill in after WAF fix and manual testing. Track monthly.*

---

## Content Optimization for AI Citation

### The Three Pillars Applied to AoB

#### Pillar 1: Structure — Make Content Extractable

Every key page needs extractable answer blocks. Current content (inferred from SERP snippets) appears descriptive but not optimized for AI extraction.

**Homepage** — Add a clear definition block:
```
Current approach: Marketing copy describing the experience
AI-optimized: A direct definitional paragraph in first 100 words

Example:
"Alchemy of Breath is a breathwork facilitator training school founded in 2012 by
Anthony Abbagnano. We teach Conscious Connected Breathwork (CCB) — a somatic
breathing practice that combines modern neuroscience with ancient healing methods
to support trauma recovery, emotional regulation, and personal transformation.
Our programs are accredited by the FHT, AADP, and GPBA."

(This 55-word block is optimally sized for AI extraction.)
```

**Breathwork Training Page** — Add a comparison table:
```
| Feature | Online (8 months) | Residential (4 months) |
|---------|------------------|----------------------|
| Format | 400 hours online | 3 weeks live + online |
| Location | Anywhere | Tuscany, Italy |
| BreathCamp | Online BreathCamp | In-person BreathCamp |
| Accreditation | FHT, AADP, GPBA | FHT, AADP, GPBA |
| Start dates | Rolling | Fixed cohorts |
```

**Each blog post** — Lead with a direct answer:
- "Breathwork vs Pranayama" → First sentence defines both, second sentence gives the key difference
- "Benefits of online training" → First paragraph summarizes the top 3 benefits as a numbered list

#### Pillar 2: Authority — Make Content Citable

AoB has strong authority assets — they just need to be surfaced in content:

**High-priority authority additions**:

1. **Statistics with sources** (target: +37-40% AI visibility)
   - "Our graduates report a 73% reduction in anxiety symptoms within 3 months of regular breathwork practice" (if you have this data)
   - "Breathwork has been shown to activate the parasympathetic nervous system within 3-5 minutes of conscious connected breathing (Zaccaro et al., 2018)"
   - Add 2-3 sourced statistics per key page

2. **Expert quotes** (target: +30% AI visibility)
   - Include Anthony Abbagnano quotes with his full title: "Anthony Abbagnano, founder of Alchemy of Breath and GPBA board member for online breathwork..."
   - Quote guest experts who've collaborated with AoB

3. **"Last Updated" dates** on all articles — AI systems weight recency heavily

4. **Author bios** on every blog post with credentials:
   ```
   About the Author: [Name], Certified Alchemy of Breath Facilitator,
   [credentials]. [Name] has facilitated breathwork sessions for [X] people
   across [Y] countries.
   ```

#### Pillar 3: Presence — Be Where AI Looks

AI systems pull from third-party sources more than from brand sites directly.

**Priority third-party presence actions**:

| Platform | Action | Why |
|----------|--------|-----|
| Wikipedia | Create/update "Alchemy of Breath" entry | 7.8% of all ChatGPT citations come from Wikipedia |
| Reddit (r/breathwork, r/somatic) | Authentic participation and Q&A | 1.8% of ChatGPT citations |
| YouTube | Create "What is breathwork?" and "How to do breathwork" videos | Frequently cited in Google AI Overviews |
| Quora | Answer breathwork questions with depth and link to AoB pages | AI cites authoritative Quora answers |
| G2 / Trustpilot | Ensure review profiles exist | Trust signal for AI systems |
| Industry publications | Guest posts on wellbeing/yoga/therapy publications | Third-party citation sources |

---

## Schema Markup Strategy

### Current State
- **Unknown** — WAF blocks JS-rendered page access
- Must be verified via: `https://search.google.com/test/rich-results?url=alchemyofbreath.com` (after WAF fix)

### Priority Schema Types for AoB

#### 1. Organization (Homepage) — CRITICAL

```json
{
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "name": "Alchemy of Breath",
  "url": "https://alchemyofbreath.com",
  "logo": {
    "@type": "ImageObject",
    "url": "https://alchemyofbreath.com/wp-content/uploads/logo.png"
  },
  "description": "Alchemy of Breath is an accredited breathwork facilitator training school offering online and residential certification programs in Conscious Connected Breathwork.",
  "founder": {
    "@type": "Person",
    "name": "Anthony Abbagnano",
    "jobTitle": "Founder & Master Breathwork Teacher",
    "url": "https://alchemyofbreath.com/anthony-abbagnano/"
  },
  "sameAs": [
    "https://www.instagram.com/alchemyofbreath/",
    "https://www.facebook.com/AOB.Breathwork/",
    "https://www.youtube.com/@alchemyofbreath"
  ],
  "accreditation": [
    "Federation of Holistic Therapists",
    "American Association of Drugless Practitioners",
    "Global Professional Breathwork Alliance"
  ],
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "IT",
    "addressRegion": "Tuscany"
  }
}
```

**Why `EducationalOrganization`**: This is more specific than `Organization` and signals to Google that AoB is a training institution — eligible for educational rich results.

---

#### 2. Course Schema (/breathwork-training/, /live-residential-breathwork-facilitator-training/)

```json
{
  "@context": "https://schema.org",
  "@type": "Course",
  "name": "Breathwork Facilitator Training",
  "description": "A comprehensive 8-month online breathwork facilitator training program (400 hours) accredited by the FHT, AADP, and GPBA. Learn Conscious Connected Breathwork and graduate as a certified breathwork facilitator.",
  "provider": {
    "@type": "EducationalOrganization",
    "name": "Alchemy of Breath",
    "url": "https://alchemyofbreath.com"
  },
  "url": "https://alchemyofbreath.com/breathwork-training/",
  "courseMode": ["online", "onsite"],
  "duration": "P8M",
  "educationalCredentialAwarded": "Certified Alchemy of Breath Facilitator",
  "teaches": "Conscious Connected Breathwork facilitation",
  "inLanguage": "en",
  "offers": {
    "@type": "Offer",
    "category": "Paid",
    "url": "https://alchemyofbreath.com/breathwork-training/"
  },
  "hasCourseInstance": [
    {
      "@type": "CourseInstance",
      "courseMode": "online",
      "courseWorkload": "PT400H",
      "instructor": {
        "@type": "Person",
        "name": "Anthony Abbagnano"
      }
    }
  ]
}
```

---

#### 3. Event Schema (/events/, /BreathCamps/)

```json
{
  "@context": "https://schema.org",
  "@type": "Event",
  "name": "BreathCamp Tuscany 2026",
  "description": "A 7-day immersive breathwork retreat in the hills of Tuscany at ASHA Retreat & Community Centre. Deep healing, connection, and renewal through Conscious Connected Breathwork.",
  "startDate": "2026-[DATE]",
  "endDate": "2026-[DATE]",
  "eventStatus": "https://schema.org/EventScheduled",
  "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
  "location": {
    "@type": "Place",
    "name": "ASHA Retreat & Community Centre",
    "address": {
      "@type": "PostalAddress",
      "addressRegion": "Tuscany",
      "addressCountry": "IT"
    }
  },
  "organizer": {
    "@type": "Organization",
    "name": "Alchemy of Breath",
    "url": "https://alchemyofbreath.com"
  },
  "offers": {
    "@type": "Offer",
    "url": "https://alchemyofbreath.com/BreathCamps/",
    "availability": "https://schema.org/InStock"
  }
}
```

---

#### 4. FAQPage Schema (Training Pages, Blog Posts)

Add to `/breathwork-training/` and key informational pages:

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How long is the Alchemy of Breath Facilitator Training?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The online Breathwork Facilitator Training is an 8-month, 400-hour program. The hybrid residential option is 4 months, including 3 weeks of live training at our ASHA retreat center in Tuscany."
      }
    },
    {
      "@type": "Question",
      "name": "Is the Alchemy of Breath training accredited?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. The Alchemy of Breath Facilitator Training is accredited by the Federation of Holistic Therapists (FHT), the American Association of Drugless Practitioners (AADP), and our Practitioner Training Programme is accredited by the Global Professional Breathwork Alliance (GPBA)."
      }
    },
    {
      "@type": "Question",
      "name": "What is Conscious Connected Breathwork?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Conscious Connected Breathwork (CCB) is a somatic breathing practice where the inhale and exhale are connected without pausing. This circular breathing pattern activates the autonomic nervous system, supports emotional release, and can facilitate deep healing of trauma, anxiety, and stress-related conditions."
      }
    },
    {
      "@type": "Question",
      "name": "Can I facilitate breathwork sessions after completing the training?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Graduates of the Alchemy of Breath Facilitator Training are qualified to offer private, group, and online breathwork sessions to the public. You also receive 3 months of continued education and mentorship after graduation."
      }
    }
  ]
}
```

---

#### 5. Person Schema (/anthony-abbagnano/)

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Anthony Abbagnano",
  "jobTitle": "Founder, Breathwork Teacher & Author",
  "url": "https://alchemyofbreath.com/anthony-abbagnano/",
  "worksFor": {
    "@type": "EducationalOrganization",
    "name": "Alchemy of Breath"
  },
  "knowsAbout": ["Breathwork", "Conscious Connected Breathwork", "Somatic Healing", "Jungian Psychology", "Neuroscience"],
  "hasCredential": {
    "@type": "EducationalOccupationalCredential",
    "name": "GPBA Board Member (Online Breathwork Curator)"
  },
  "author": {
    "@type": "Book",
    "name": "Outer Chaos, Inner Calm"
  }
}
```

---

#### 6. BreadcrumbList Schema (All Pages)

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://alchemyofbreath.com"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Breathwork Training",
      "item": "https://alchemyofbreath.com/breathwork-training/"
    }
  ]
}
```

---

#### 7. HowTo Schema (Blog Posts — "How to do breathwork" content)

For future content page "How to Do Breathwork":

```json
{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to Do Conscious Connected Breathwork",
  "description": "A step-by-step guide to practicing Conscious Connected Breathwork (CCB) safely at home.",
  "step": [
    {
      "@type": "HowToStep",
      "position": 1,
      "name": "Find a comfortable position",
      "text": "Lie on your back on a yoga mat or bed. Place one hand on your belly, one on your chest. Close your eyes."
    },
    {
      "@type": "HowToStep",
      "position": 2,
      "name": "Begin circular breathing",
      "text": "Inhale through your mouth into your belly, then chest, in one connected breath. Exhale fully without pausing. Connect the inhale and exhale without holding your breath."
    },
    {
      "@type": "HowToStep",
      "position": 3,
      "name": "Maintain the rhythm for 20 minutes",
      "text": "Continue the circular breathing pattern for 20-30 minutes. Let go of controlling the outcome. Allow sensations, emotions, or images to arise and pass."
    }
  ],
  "estimatedCost": {
    "@type": "MonetaryAmount",
    "currency": "USD",
    "value": "0"
  },
  "totalTime": "PT30M"
}
```

---

### Schema Implementation in WordPress

**Recommended approach**: Use Rank Math or Yoast SEO Premium for most schema types. Use a dedicated plugin (Schema Pro or Structured Data for WP) for `Course` and `EducationalOrganization` types which standard plugins handle less well.

```
1. Install Rank Math (recommended — best Course + Event schema support)
2. Configure Organization schema at site level
3. Set Course schema on all training pages
4. Set Event schema on all event/camp pages
5. Enable FAQPage schema and add Q&A to training pages
6. Set Article schema on all blog posts with author markup
7. Add BreadcrumbList (Rank Math does this automatically with Yoast breadcrumbs)
8. Validate ALL schema via: https://search.google.com/test/rich-results
```

---

## AI SEO Monitoring Plan

### Monthly Checklist

```
□ Test top 5 queries in ChatGPT — is AoB cited?
□ Test top 5 queries in Perplexity — is AoB cited?
□ Check Google AI Overviews for "breathwork facilitator training" and "what is breathwork"
□ Review GA4 referral traffic from AI sources (track perplexity.ai, chat.openai.com)
□ Update the AI Visibility Query Testing table above
```

### Recommended Tools
- **Otterly AI** — Share of AI voice tracking (ChatGPT, Perplexity, Google AI Overviews)
- **LLMrefs** — Maps traditional keyword rankings to AI citation rates
- **Google Search Console** — AI Overview clicks/impressions (via Search Console AIO report)

---

*Strategy built using: marketing-skills/ai-seo v1.1.0 + marketing-skills/schema-markup v1.1.0*
*Claude Code | March 2026*
