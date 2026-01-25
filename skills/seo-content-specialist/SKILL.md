---
name: seo-content-specialist
description: "Generate SEO-optimized content for traditional search engines, AI answer engines, and generative AI platforms. Use when the user needs help writing or optimizing content for (1) Blog posts, articles, or web pages targeting organic search, (2) Content optimized for Google AI Overviews and featured snippets, (3) Answer Engine Optimization (AEO) for ChatGPT, Perplexity, and voice assistants, (4) Generative Engine Optimization (GEO) for AI citations, (5) E-E-A-T optimization, (6) Schema markup and structured data, (7) Keyword research and topic cluster planning, or any content requiring search visibility across traditional and AI-powered discovery."
license: MIT
metadata:
  author: "[Ben Sabic](https://bensabic.ca)"
  version: "1.0.0"
---

# SEO Content Generation Skill

Create high-quality, search-optimized content that ranks in traditional search engines and gets cited by AI platforms.

## Core Philosophy

Modern search optimization requires content that serves three audiences simultaneously:
1. **Human readers** seeking valuable, trustworthy information
2. **Traditional search engines** indexing and ranking content
3. **AI systems** extracting and citing authoritative answers

Write for humans first, structure for machines second. Quality content naturally satisfies all three.

## The Triple Optimization Framework

### 1. Traditional SEO (Search Engine Optimization)
Optimize for Google, Bing, and traditional search results.

### 2. AEO (Answer Engine Optimization)
Optimize for direct answer displays: featured snippets, AI Overviews, voice assistants.

### 3. GEO (Generative Engine Optimization)
Optimize for AI citations: ChatGPT, Perplexity, Claude, Gemini.

## Content Creation Workflow

### Step 1: Pre-Writing Analysis

1. **Clarify intent and audience**
   - Identify primary and secondary keywords
   - Determine search intent: informational, navigational, commercial, transactional
   - Understand the target audience's expertise level

2. **Analyze competition**
   - Review top-ranking content for target keywords
   - Identify gaps and opportunities
   - Note content length, structure, and depth

3. **Plan content structure**
   - Create outline with H2/H3 hierarchy
   - Map keywords to sections
   - Plan FAQ section for AEO opportunities

### Step 2: Write Using the Answer-First Pattern

Structure content to lead with answers:

```
[Title with Primary Keyword]

[Opening paragraph: Answer the main question immediately - 2-3 sentences]

[Table of Contents for long-form content]

## [H2: Primary subtopic]
[Lead with key information]
[Supporting details and context]

## [H2: Secondary subtopics...]

## Frequently Asked Questions
[Question-format headings with direct answers]

## Key Takeaways
[Bulleted summary of main points]
```

**Paragraph-Level Pattern:**
1. **Lead with the answer** in the first sentence
2. **Expand with context** in sentences 2-3
3. **Provide evidence** with data, examples, or expert quotes
4. **Link to related concepts** for topical depth

### Step 3: Apply E-E-A-T Signals

Include these elements throughout content:

- **Experience**: First-hand accounts, case studies, personal testing
- **Expertise**: Technical accuracy, correct industry terminology
- **Authoritativeness**: Citations from respected sources, expert quotes
- **Trustworthiness**: Transparent sourcing, balanced viewpoints, current information

Trust is paramount—Google states untrustworthy pages have low E-E-A-T regardless of other signals.

### Step 4: Optimize On-Page Elements

**Title Tag (50-60 characters):**
- Primary keyword near the beginning
- Compelling and click-worthy

**Meta Description (150-160 characters):**
- Include primary keyword naturally
- Clear value proposition
- Call to action when appropriate

**Header Structure:**
```
H1: Page title (one per page)
  H2: Major sections
    H3: Subsections
```

**URL:** Short, descriptive, includes primary keyword, hyphens between words

### Step 5: Add AEO/GEO Content Blocks

See `references/aeo-geo-patterns.md` for complete patterns.

**Quick reference blocks:**

- **Definition blocks** for "what is" queries
- **Step-by-step blocks** for "how to" queries
- **Comparison tables** for "vs" queries
- **Pros/cons blocks** for evaluation queries
- **FAQ sections** for question-based queries

### Step 6: Generate Schema Markup

Use `scripts/generate_schema.py` for valid JSON-LD, or see `references/schema-templates.md`.

Common schema types:
- **Article**: Blog posts, news articles
- **FAQPage**: FAQ content sections
- **HowTo**: Instructional content
- **Product**: E-commerce pages
- **LocalBusiness**: Location-based content

### Step 7: Final Quality Check

Before finalizing, verify checklist in `references/seo-checklist.md`:

- [ ] Primary keyword in title, H1, first paragraph, URL
- [ ] Direct answer to main query within first 100 words
- [ ] FAQ section with 3-5 question-format headings
- [ ] Statistics cited from authoritative sources
- [ ] Expert quotes or first-hand experience included
- [ ] Internal and external links included
- [ ] Meta description written
- [ ] Image alt text optimized
- [ ] Content is factually accurate and current

## GEO-Specific Optimization

AI platforms cite content based on clarity, authority, structure, and recency.

### Domain-Specific Tactics

| Domain | Effective Tactics |
|--------|-------------------|
| Law & Government | Statistics, official citations |
| Health & Medicine | Expert credentials, study citations |
| Technology | Technical precision, current data |
| Finance | Data-driven analysis, regulatory citations |
| Arts & Humanities | Quotations, cultural references |

### Key GEO Principles

1. State facts explicitly—avoid implied meanings
2. Add statistics (increases citation rates 15-30%)
3. Include named expert quotes
4. Use fluent, readable language
5. Cite authoritative sources with links

## Output Deliverables

When generating SEO content, provide:

1. **Main content** with proper heading hierarchy
2. **Meta data** (title tag, meta description)
3. **FAQ section** with 3-5 questions
4. **Schema markup** as JSON-LD (when requested)
5. **Internal linking suggestions** based on topic clusters

## Writing Quality and Avoiding AI Patterns

Natural, human-sounding writing is essential for both reader engagement and E-E-A-T signals. AI-detectable content undermines trust and authority.

### Key Principles

1. **Avoid em dash (—) overuse** — The em dash is the primary tell of AI writing. Use commas, colons, or parentheses instead.

2. **Replace AI-flagged words** — See `references/ai-phrases-to-avoid.md` for complete list:
   - delve → explore, examine
   - leverage → use, apply
   - robust → strong, solid
   - comprehensive → complete, thorough
   - pivotal → key, important

3. **Use plain English** — See `references/plain-english-alternatives.md`:
   - utilise → use
   - facilitate → help
   - commence → start
   - prior to → before

4. **Avoid formulaic openings**:
   - ❌ "In today's fast-paced world..."
   - ❌ "In the ever-evolving landscape of..."
   - ❌ "Let's delve into..."
   - ✅ Start with the main point directly

5. **Remove empty intensifiers**: very, extremely, incredibly, absolutely, truly

6. **Vary sentence structure** — Mix short and long sentences; avoid repetitive patterns

### Self-Check Before Publishing

- Read aloud — if phrases sound unnatural, revise
- Ask: "Would I say this in conversation?"
- Check for repetitive sentence structures
- Look for clusters of AI-flagged words
- Verify each intensifier adds genuine meaning

## Resources

### References:

- `references/seo-checklist.md` — Complete on-page SEO checklist
- `references/aeo-geo-patterns.md` — Content block patterns for AI optimization
- `references/schema-templates.md` — Copy-paste schema markup templates
- `references/ai-phrases-to-avoid.md` — Words and phrases that signal AI-generated content; avoid these for natural, human-sounding writing
- `references/plain-english-alternatives.md` — Plain English replacements for complex or pompous words
- `references/content-transitions.md` — Signposting phrases and transitions to guide readers through content

### Scripts:

- `scripts/generate_metrics.py` — Analyze content for word count, read time, readability scores, and SEO recommendations
- `scripts/check_ai_patterns.py` — Scan content for AI-generated patterns and get a human-likeness score
- `scripts/generate_schema.py` — Generate valid JSON-LD schema