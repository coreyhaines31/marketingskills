# SEO Audit: cochranlaw.com (Cochran, Kroll & Associates, P.C.)

**Audit Date:** February 11, 2026
**Site:** https://www.cochranlaw.com/
**Business Type:** Personal Injury & Medical Malpractice Law Firm (Michigan)
**Skills Applied:** seo-audit, schema-markup, content-strategy, page-cro, programmatic-seo, competitor-alternatives

---

## Executive Summary

Cochran, Kroll & Associates, P.C. is a Michigan-based personal injury and medical malpractice law firm with a well-established web presence. The site has solid foundational elements -- dedicated practice area pages, city-specific location pages, attorney bios, and a verdicts/results page. However, there are significant opportunities for improvement across technical SEO, on-page optimization, content strategy, schema markup, and conversion rate optimization.

### Top 5 Priority Issues

1. **Duplicate/Thin Content on City Pages** -- Location pages reuse substantial content (verdicts, testimonials, practice area descriptions) with minimal localization
2. **Missing Schema Markup** -- No evidence of LocalBusiness, Attorney, LegalService, or FAQ schema on key pages
3. **Content Gaps vs. Competitors** -- Competitors like Buckfire Law, McKeen & Associates, and Sommers Schwartz have significantly deeper content
4. **Weak Blog/Content Strategy** -- Blog appears to be primarily case results rather than educational, search-targeted content
5. **CRO Opportunities** -- Conversion elements (CTAs, trust signals, objection handling) could be significantly strengthened

### Quick Wins Identified

- Add LocalBusiness + Attorney schema markup across all pages
- Optimize title tags and meta descriptions for city pages
- Add FAQ schema to practice area pages
- Create unique content for each city page with local statistics
- Add prominent trust signals (awards, ratings, case results) near CTAs

---

## 1. Technical SEO Audit

### 1.1 Crawlability

**Robots.txt & Sitemap**
- **Issue**: Unable to verify robots.txt and sitemap.xml (site returns 403 to automated requests)
- **Impact**: Medium
- **Recommendation**: Ensure robots.txt is accessible and references an XML sitemap. Verify sitemap contains all indexable URLs and is submitted to Google Search Console.

**Site Architecture**
- **Observation**: The site uses a logical hierarchy:
  - `/practice-areas/` -- Hub page for all practice areas
  - `/practice-areas/medical-malpractice/` -- Category pages
  - `/practice-areas/medical-malpractice/cancer-misdiagnosis/` -- Subcategory pages
  - `/case-types/` -- Alternate grouping (e.g., `/case-types/workplace-injury-lawyer-michigan/`)
  - `/personal-injury-lawyer-[city]/` -- Location pages at root level
- **Issue**: Two parallel structures exist -- `/practice-areas/` and `/case-types/` -- which may cause confusion and potential cannibalization
- **Impact**: Medium
- **Recommendation**: Consolidate to a single taxonomy. If both serve distinct purposes, ensure clear internal linking and no keyword overlap between them.

**URL Structure**
- Clean, keyword-rich URLs (good)
- Lowercase, hyphen-separated (good)
- Location pages follow `/personal-injury-lawyer-[city]/` pattern (good)
- Some workplace injury pages use location pattern: `/workplace-injury-lawyer-lansing/` (good)

### 1.2 Indexation

**Index Status (via site: search)**
- Homepage, practice area pages, city pages, blog, attorneys page, verdicts page all indexed
- Multiple city-specific pages confirmed indexed (Warren, Ann Arbor, Grand Rapids, Flint, Canton, Lansing)

**Potential Issues**
- **Duplicate content risk**: City pages share substantial identical content -- Google may choose not to index or may consolidate rankings
- **Cannibalization risk**: `/personal-injury-lawyer-michigan/` and `/case-types/personal-injury-lawyer-michigan/` appear to target the same keyword
- **Impact**: High
- **Recommendation**:
  - Audit for duplicate URLs targeting the same keyword
  - Implement canonical tags to resolve any duplicates
  - Ensure only one page targets each primary keyword

### 1.3 Site Speed & Core Web Vitals

**Status**: Unable to run automated PageSpeed test (403 block on automated tools)

**Recommendation**:
- Run the site through Google PageSpeed Insights (pagespeed.web.dev) manually
- Check Core Web Vitals in Google Search Console
- Target: LCP < 2.5s, INP < 200ms, CLS < 0.1
- Common law firm site issues: Large hero images, unoptimized JavaScript, render-blocking CSS, heavy third-party scripts (chat widgets, analytics)

### 1.4 Mobile-Friendliness

**Status**: Unable to test automatically

**Recommendation**:
- Verify responsive design across devices
- Check tap target sizes for phone numbers and CTAs
- Ensure click-to-call is implemented for the 866-MICH-LAW number
- With 60%+ of legal searches on mobile, this is critical

### 1.5 Security & HTTPS

- **Confirmed**: Site uses HTTPS (good)
- Verify: HTTP redirects to HTTPS, no mixed content, valid SSL certificate

---

## 2. On-Page SEO Audit

### 2.1 Title Tags

**Homepage**: "Medical Malpractice Lawyers in Michigan | Personal Injury Attorney near you"
- Good: Contains primary keyword, reasonable length
- **Issue**: "near you" is vague -- consider a specific geo-modifier
- **Recommendation**: "Medical Malpractice Lawyers in Michigan | Cochran, Kroll & Associates"

**City Pages** (examples from search results):
- "Personal Injury Lawyer in Warren - Free Consultations"
- "Personal Injury Lawyer in Ann Arbor - Cochran Law"
- "Personal Injury Lawyer in Flint, Michigan - Cochran Law"
- "Workplace Injury Lawyer in Lansing - Cochran Law"
- Good: Keyword + city + brand
- **Recommendation**: Add differentiator where possible (e.g., "Free Consultation" on all, or "$XX Million Recovered")

**Practice Area Pages**:
- "Medical Malpractice Cancer Misdiagnosis Lawyers" -- Missing geographic modifier
- **Recommendation**: Add "in Michigan" to practice area title tags

### 2.2 Meta Descriptions

**Observation**: Limited visibility into meta descriptions from search snippets

**Recommendations**:
- Every page needs a unique meta description (150-160 characters)
- Include: primary keyword, geographic modifier, call-to-action, differentiator
- Example for homepage: "Michigan's top-rated medical malpractice & personal injury attorneys. $15.8M largest verdict. Free consultation -- call 866-MICH-LAW. No fee unless we win."

### 2.3 Heading Structure

**Recommendations**:
- One H1 per page containing primary keyword
- H1 should differ from the title tag (complementary, not identical)
- Use H2s for major sections (practice areas, case results, why choose us)
- Use H3s for subsections
- Include keywords naturally in headings

### 2.4 Content Optimization

**City Pages -- Critical Issue**
- **Issue**: Heavy content duplication across city pages. Same verdict descriptions ($15.8M verdict, $1.4M pedestrian recovery, $3.3M brain injury award, $1.25M construction worker) appear on virtually every page.
- **Impact**: High -- Google devalues thin/duplicate content
- **Recommendation**: Each city page needs unique content including:
  - Local accident/injury statistics for that city/county
  - Specific court information (county courthouse, local judges)
  - Notable local cases or outcomes
  - Community involvement in that area
  - Driving/commuting hazards specific to that city
  - Local hospital/medical facility information relevant to medical malpractice

**Practice Area Pages**
- **Observation**: Content appears to be reasonably detailed for medical malpractice
- **Recommendation**: Ensure each practice area page has 1,500+ words of unique, in-depth content covering:
  - What constitutes this type of case in Michigan
  - Michigan-specific laws and statutes
  - Statute of limitations
  - Common scenarios and examples
  - What compensation is available
  - FAQ section

### 2.5 Image Optimization

**Recommendations**:
- Add descriptive alt text to all images (attorney photos, office photos, infographics)
- Use WebP format for faster loading
- Implement lazy loading for below-the-fold images
- Name image files descriptively (e.g., `terry-cochran-michigan-personal-injury-attorney.webp`)

### 2.6 Internal Linking

**Current State**: Basic navigation-level linking observed

**Recommendations**:
- Link from blog posts to relevant practice area pages
- Link from city pages to practice area pages and vice versa
- Add "Related Practice Areas" sections on each practice area page
- Link attorney bio pages to their specific practice area expertise
- Create a content hub structure: Practice Area Hub -> Specific Topics -> Related Blog Posts

---

## 3. Content Quality Assessment

### 3.1 E-E-A-T Signals (Critical for YMYL/Legal)

Legal websites are classified as **YMYL (Your Money or Your Life)** by Google, meaning E-E-A-T signals are especially important.

**Experience (Needs improvement)**
- Verdicts page demonstrates outcomes but lacks detail
- **Recommendation**: Create detailed case study pages with:
  - Client situation (anonymized)
  - Legal challenges faced
  - Strategy employed
  - Outcome achieved
  - Client testimonial

**Expertise (Moderate)**
- Attorney bios mention credentials and experience
- Eileen Kroll's nursing background is a strong differentiator
- **Recommendation**:
  - Add author bylines to all content (linked to attorney bio pages)
  - Include bar admission details, education, publications, speaking engagements
  - Add "About the Author" section to blog posts

**Authoritativeness (Needs improvement)**
- **Recommendation**:
  - Display all awards, recognitions, and ratings prominently
  - Get listed/featured on Justia, Avvo, Super Lawyers, Best Lawyers (competitor firms have strong directory presence)
  - Seek case mentions in Michigan Lawyers Weekly, local news
  - Add Google Reviews widget to site (there is a /google-reviews page)

**Trustworthiness (Moderate)**
- Contingency fee messaging present (good)
- Contact information available (good)
- Disclaimer page exists (good)
- **Recommendation**: Add privacy policy prominently, security badges, bar association logos

### 3.2 Content Strategy Gaps

**Current content**: Primarily case results and practice area descriptions

**Missing content types** (based on content-strategy skill framework):

**Awareness Stage Content**
- "What is medical malpractice in Michigan?"
- "How to know if you have a personal injury case"
- "Michigan no-fault insurance explained"
- "What to do after a car accident in Michigan"
- "Signs of medical negligence"

**Consideration Stage Content**
- "Best medical malpractice lawyers in Michigan"
- "How to choose a personal injury attorney"
- "Medical malpractice vs. medical negligence"
- "Personal injury lawyer cost in Michigan"

**Decision Stage Content**
- Detailed case studies
- Video testimonials
- Process explanation (what to expect when you hire us)
- FAQ pages for each practice area

**Resource/Educational Content**
- Michigan personal injury law guide (comprehensive hub page)
- Medical malpractice statute of limitations in Michigan
- Workers compensation guide for Michigan
- Car accident claim process in Michigan
- Local injury statistics and safety resources

### 3.3 Blog Strategy

**Current State**: Blog appears to focus on case results/legal news

**Recommendations**:
- Shift to a search-targeted content strategy
- Publish 2-4 SEO-optimized educational articles per month
- Target long-tail keywords at each buyer stage
- Topics should answer common client questions (mine intake calls for ideas)
- Add author attribution, publish dates, and schema markup to all posts

---

## 4. Schema Markup Recommendations

Based on the schema-markup skill, the following structured data should be implemented:

### 4.1 Organization Schema (Homepage)

```json
{
  "@context": "https://schema.org",
  "@type": "LegalService",
  "name": "Cochran, Kroll & Associates, P.C.",
  "url": "https://www.cochranlaw.com/",
  "logo": "https://www.cochranlaw.com/logo.png",
  "telephone": "+18668642529",
  "description": "Michigan personal injury and medical malpractice law firm",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "[City]",
    "addressRegion": "MI",
    "addressCountry": "US"
  },
  "areaServed": {
    "@type": "State",
    "name": "Michigan"
  },
  "priceRange": "Free Consultation",
  "paymentAccepted": "Contingency Fee"
}
```

### 4.2 Attorney Schema (Each Attorney Bio Page)

```json
{
  "@context": "https://schema.org",
  "@type": "Attorney",
  "name": "Terry Cochran",
  "jobTitle": "Senior Partner",
  "worksFor": {
    "@type": "LegalService",
    "name": "Cochran, Kroll & Associates, P.C."
  },
  "knowsAbout": ["Personal Injury", "Medical Malpractice", "Traumatic Brain Injury"]
}
```

### 4.3 FAQ Schema (Practice Area Pages)

Add FAQ schema to each practice area page with common questions and answers.

### 4.4 BreadcrumbList Schema (All Pages)

Implement breadcrumb schema to help Google understand site hierarchy.

### 4.5 Review/AggregateRating Schema

If eligible (based on Google guidelines), implement review schema using Google Reviews data.

---

## 5. Local SEO Audit

### 5.1 Google Business Profile

- **Recommendation**: Ensure Google Business Profile is fully optimized with:
  - All practice areas listed
  - Office photos
  - Regular posts (case results, legal tips, firm news)
  - Active review management (respond to all reviews)
  - Q&A section populated

### 5.2 Local Citations (NAP Consistency)

- **Ensure consistent Name, Address, Phone** across all directories
- Priority directories for law firms: Justia, Avvo, FindLaw, Martindale-Hubbell, Super Lawyers, Yelp, BBB

### 5.3 Location Pages (Programmatic SEO Opportunity)

**Current State**: City pages exist for Warren, Ann Arbor, Grand Rapids, Flint, Canton, Lansing

**Issues**:
- Content duplication across pages (critical)
- Limited local differentiation

**Recommendation** (using programmatic-seo framework):
Each city page should include:

1. **Unique local intro** (2-3 paragraphs about legal needs in that city)
2. **Local statistics** (accident rates, injury stats for that county)
3. **Court information** (county courthouse, typical case timelines)
4. **Local landmarks/roads** relevant to common accidents
5. **Case results from that area** (where applicable)
6. **Map/directions** to nearest office
7. **Unique FAQ** section with city-specific questions
8. **LocalBusiness schema** with city-specific address

**Additional cities to target** (based on Michigan population):
- Detroit (primary market)
- Sterling Heights
- Dearborn
- Livonia
- Troy
- Southfield
- Novi
- Kalamazoo
- Saginaw

---

## 6. Competitor Analysis

### 6.1 Key Competitors Ranking for Target Keywords

| Firm | Strengths | What Cochran Can Learn |
|------|-----------|----------------------|
| **Buckfire Law** | Deep content, 25+ years emphasis, awards prominently displayed | More educational content, stronger trust signals |
| **McKeen & Associates** | "$130M result" featured, Michigan Lawyers Weekly recognition, Detroit News coverage | Leverage media mentions, feature largest verdict more prominently |
| **Sommers Schwartz** | "Pioneer" positioning, 45+ years, $1B+ recovered total | Emphasize cumulative results, thought leadership |
| **Legal Directories** (Justia, Avvo, Super Lawyers) | Dominate top positions for head keywords | Optimize directory profiles, encourage reviews on these platforms |

### 6.2 Competitive Gaps (Opportunities for Cochran)

1. **Eileen Kroll's nursing background** -- This is a unique differentiator that competitors cannot match. Feature it more prominently across all medical malpractice content.
2. **Case results page** -- Expand from a simple list to detailed, story-driven case studies
3. **Michigan-specific legal guides** -- Create the definitive resource for Michigan personal injury law
4. **Video content** -- Attorney explainer videos for common questions

---

## 7. Conversion Rate Optimization (CRO)

Based on the page-cro skill framework:

### 7.1 Value Proposition Clarity

- **Current**: "Medical Malpractice Lawyers in Michigan"
- **Recommendation**: Lead with outcomes and differentiators
  - "Michigan's $15.8M Verdict Winners | Medical Malpractice & Personal Injury"
  - Emphasize: Attorney-nurse team, decades of experience, contingency fee

### 7.2 CTA Optimization

- **Current CTAs**: "Free Consultation", phone number 866-MICH-LAW
- **Recommendations**:
  - Make CTA buttons more specific: "Get Your Free Case Review" vs. generic "Contact Us"
  - Add sticky header/footer CTA on mobile
  - Include urgency: "Statute of limitations may apply -- act now"
  - Add multiple CTA touchpoints throughout long pages
  - A/B test CTA copy variations

### 7.3 Trust Signals

**Add near every CTA**:
- Google review rating and count
- "No Fee Unless We Win" badge
- Total amount recovered for clients
- Years of experience
- Awards and recognitions
- Attorney photos (builds personal connection)

### 7.4 Form Optimization

Based on form-cro skill:
- Minimize form fields (name, phone, brief description)
- Add "confidential" reassurance
- Include "response within 24 hours" commitment
- Show social proof next to form

---

## 8. Prioritized Action Plan

### Critical Fixes (Blocking Performance)

| # | Action | Impact | Skill Reference |
|---|--------|--------|----------------|
| 1 | Resolve URL duplication between `/practice-areas/` and `/case-types/` | High | seo-audit |
| 2 | Add unique content to each city/location page | High | programmatic-seo |
| 3 | Implement canonical tags across all pages | High | seo-audit |

### High-Impact Improvements

| # | Action | Impact | Skill Reference |
|---|--------|--------|----------------|
| 4 | Implement LegalService + Attorney schema markup | High | schema-markup |
| 5 | Add FAQ schema to all practice area pages | High | schema-markup |
| 6 | Optimize title tags and meta descriptions site-wide | High | seo-audit |
| 7 | Create detailed case study pages (5-10 to start) | High | content-strategy |
| 8 | Optimize Google Business Profile and directory listings | High | seo-audit (local) |
| 9 | Build out educational content strategy (blog) | High | content-strategy |
| 10 | Strengthen CTA copy and placement | Medium-High | page-cro |

### Quick Wins (Easy, Immediate Benefit)

| # | Action | Impact | Skill Reference |
|---|--------|--------|----------------|
| 11 | Add "in Michigan" to practice area title tags | Medium | seo-audit |
| 12 | Add alt text to all images | Medium | seo-audit |
| 13 | Add BreadcrumbList schema | Medium | schema-markup |
| 14 | Feature Eileen Kroll's nursing background prominently | Medium | page-cro |
| 15 | Add trust signals (awards, ratings) near all CTAs | Medium | page-cro |
| 16 | Update Resource Center with internal links (not just external) | Medium | seo-audit |

### Long-Term Recommendations

| # | Action | Impact | Skill Reference |
|---|--------|--------|----------------|
| 17 | Create Michigan Personal Injury Law hub page (comprehensive guide) | High | content-strategy |
| 18 | Expand city pages to cover all major Michigan cities | Medium | programmatic-seo |
| 19 | Build competitor comparison pages (vs. Buckfire, vs. McKeen) | Medium | competitor-alternatives |
| 20 | Develop video content library | Medium | content-strategy |
| 21 | Create interactive tools (case value estimator, statute of limitations calculator) | Medium | free-tool-strategy |
| 22 | Implement A/B testing on key landing pages | Medium | ab-test-setup |

---

## 9. Content Calendar Starter (First 90 Days)

### Month 1: Foundation
- Audit and fix all title tags and meta descriptions
- Implement schema markup (Organization, Attorney, BreadcrumbList)
- Rewrite 3 city pages with unique local content
- Publish 2 educational blog posts targeting awareness keywords

### Month 2: Content Build
- Create 3 detailed case study pages
- Add FAQ sections (with schema) to top 5 practice area pages
- Publish 4 blog posts targeting consideration-stage keywords
- Optimize Google Business Profile

### Month 3: Expansion
- Rewrite remaining city pages with unique content
- Create Michigan Personal Injury Law comprehensive guide
- Add 3 new city pages for underserved areas
- Publish 4 blog posts and begin link building outreach

---

## 10. Skills Summary

The following skills from the marketingskills repository were applied in this audit:

| Skill | How It Was Applied |
|-------|-------------------|
| **seo-audit** | Core audit framework -- technical SEO, on-page, content quality, E-E-A-T |
| **schema-markup** | Structured data recommendations (LegalService, Attorney, FAQ, Breadcrumb) |
| **content-strategy** | Content gaps analysis, buyer-stage keyword mapping, content calendar |
| **page-cro** | Conversion optimization for homepage and landing pages |
| **programmatic-seo** | City/location page strategy and template recommendations |
| **competitor-alternatives** | Competitive landscape analysis and comparison page opportunities |
| **analytics-tracking** | Recommended for measuring SEO performance post-implementation |
| **form-cro** | Contact form optimization recommendations |
| **free-tool-strategy** | Interactive tool ideas (case estimator, statute calculator) |
| **ab-test-setup** | A/B testing recommendations for CRO improvements |

---

## Questions Before Next Steps

To deepen this audit and create an implementation plan, I would need:

1. **Google Search Console access** -- To check actual indexation status, crawl errors, and keyword performance
2. **Google Analytics data** -- To understand current traffic levels, top pages, and conversion rates
3. **Current organic keyword rankings** -- From Ahrefs, SEMrush, or similar
4. **Site speed data** -- Run Google PageSpeed Insights manually (the site blocks automated tools)
5. **Confirmation on office locations** -- How many physical offices, and where?
6. **Google Business Profile status** -- Is it claimed and optimized?
7. **Content management system** -- What CMS is the site built on? (Helps determine implementation approach for schema, etc.)
8. **Top priority keywords** -- What 5-10 keywords matter most for the firm?
9. **Budget for SEO tools** -- Access to Screaming Frog, Ahrefs, or Semrush would enable a deeper technical crawl

---

*Audit compiled using the marketingskills agent skills repository (v1.0.0). All skills current as of January 27, 2026.*
