# Static Ad Template Library

Fifteen structural templates for static (image) ad creative. Each is a layout framework with slots for brand-specific copy — the structure is proven; the inputs make it yours.

Use these when generating static ad concepts at volume (Meta, Instagram, LinkedIn, display). Cycle through **all** templates rather than clustering on 2-3 favorites: template diversity is angle diversity, and the winner is usually not the one you'd have picked by hand.

## How to Use This Library

1. **Ground first.** Read the inputs corpus (winning ads, reviews, ad comments, brand voice) before generating anything. See "Grounded Inputs" in SKILL.md.
2. **Cycle templates.** For a batch of N concepts, spread across all 15 templates (3-4 variations each for a 50-concept batch).
3. **Fill slots from source material.** Every variation pulls its copy from a real review, a winning ad pattern, or an ad comment — and cites which one.
4. **Write the visual description.** Each concept includes enough visual direction that a designer or image-generation tool can produce it without guessing.

## Generation Rules

- Every variation must include: **template name, headline copy, body copy, visual description, source grounding**
- Source grounding = which review, winning ad, or comment this concept is based on
- Never produce a variation without source grounding — no invented claims, stats, or testimonials
- Pull copy directly from customer language whenever possible; don't paraphrase reviews into marketing-speak
- Match the brand voice doc on tone, not generic direct-response voice
- Real names, real stats, real quotes only — fabricated social proof is a compliance and trust violation

---

## The 15 Templates

### 1. Headline Statement

Bold one-line claim. Single product hero shot. Minimal background. The headline does all the work.

- **Structure**: One dominant text line (60%+ of visual weight), product image, logo small
- **Copy slot**: One claim specific enough to stop the scroll
- **DTC example**: "The last greens powder you'll ever buy."
- **SaaS example**: "Close your books in 3 days, not 3 weeks."
- **Source it from**: Your strongest winning-ad hook or the most repeated benefit in reviews

### 2. Us vs. Them

Side-by-side comparison. Competitor or "old way" on the left (grayed out), your product on the right (full color). 4-6 comparison rows.

- **Structure**: Two columns, check/cross marks per row, your side visually alive
- **Copy slot**: Comparison rows — each row a real differentiator, not filler
- **DTC example**: "Their multivitamin: 13 ingredients. Ours: 60."
- **SaaS example**: "Spreadsheets: 6 hours a week. Us: 6 minutes."
- **Source it from**: Reviews that mention switching, or comments comparing you to a competitor

### 3. Stat Callout

One dominant number takes up 60% of the visual. Supporting context below.

- **Structure**: Giant stat, one line of context, product or logo anchor
- **Copy slot**: A real, defensible number — measurement beats superlative
- **DTC example**: "97% of users feel a difference in 14 days."
- **SaaS example**: "11 hours saved per rep, per week."
- **Source it from**: Case studies, product analytics, or survey data — never invent the number

### 4. Review Card

A five-star testimonial styled as a screenshotted product review. Reviewer name, star rating, date.

- **Structure**: Looks like a native review UI (G2, Trustpilot, Amazon, App Store — match where your buyers read reviews)
- **Copy slot**: A real review, verbatim — the artifact's credibility is its realism
- **DTC example**: A Trustpilot card: "I've tried 6 of these. This is the only one I reordered."
- **SaaS example**: A G2-styled card: "Killed 4 tools and replaced them with this."
- **Source it from**: `inputs/reviews/` verbatim — with permission where the platform requires it

### 5. Testimonial Stack

Three customer quotes arranged vertically, photo + name + one-line quote each.

- **Structure**: Three short rows; quotes must be scannable in 2 seconds each
- **Copy slot**: Three quotes covering *different* objections or benefits — not the same praise three times
- **DTC example**: Three customers on results, taste, and convenience
- **SaaS example**: Three roles (IC, manager, exec) each praising their own outcome
- **Source it from**: Reviews — pick for coverage, not just enthusiasm

### 6. Before / After

Split image with arrow between. Transformation framing — product results, workflow, or visual proof.

- **Structure**: Two panels, arrow or divider, minimal copy labeling each state
- **Copy slot**: Label the states in the customer's words ("Sunday-night spreadsheet dread" → "Reports send themselves")
- **DTC example**: Skin, energy, space — the classic visual transformation
- **SaaS example**: Cluttered 6-tab workflow → one clean dashboard
- **Compliance note**: Before/after claims are regulated in health, finance, and beauty — verify platform policy before using
- **Source it from**: Transformation language in reviews ("I used to X, now I Y")

### 7. Problem / Solution

Pain point on top (text or image), product as the answer below.

- **Structure**: Two zones — tension above, relief below
- **Copy slot**: The pain in the customer's exact words, then the product's one-line answer
- **DTC example**: "Tired of 6 supplements every morning?" → one scoop visual
- **SaaS example**: "Your CRM knows nothing about product usage." → integration screenshot
- **Source it from**: The most common pain phrasing in `inputs/reviews/` — verbatim beats paraphrase

### 8. Founder Message

Handwritten-style or plain-text note from the founder. Conversational, personal tone.

- **Structure**: Note-style layout, founder name/photo, no product glamour shot
- **Copy slot**: "I built this because..." — one honest paragraph, no marketing polish
- **DTC example**: "Hey — I made this because every 'healthy' snack was secretly candy."
- **SaaS example**: "I ran RevOps for 6 years. This is the tool I kept wishing existed."
- **Source it from**: The actual founding story — this template collapses if fabricated

### 9. Feature Spotlight (Ingredient Spotlight)

Product hero in the center, 4-6 callout boxes around the edges highlighting key components.

- **Structure**: Center image, radiating callouts, each callout 3-6 words
- **Copy slot**: The components buyers actually ask about — not your full feature list
- **DTC example**: Product bottle with callouts per key ingredient and what it does
- **SaaS example**: Dashboard screenshot with callouts on the 4 features reviews mention most
- **Source it from**: Which features/ingredients appear most in reviews and comments

### 10. Press Mention

"As seen in" with publication logos and a pull quote.

- **Structure**: Logo row + one strong quote + product anchor
- **Copy slot**: A real quote from real coverage
- **DTC example**: "The category's first genuinely new idea in years." — [publication]
- **SaaS example**: Analyst or industry-newsletter quote with the outlet's logo
- **Compliance note**: Only use logos of outlets that actually covered you; check their logo-usage terms
- **Source it from**: Actual press, podcasts, newsletters, or analyst mentions

### 11. Lifestyle Hero

Product in use in a real environment. Minimal copy. Aspirational, not salesy.

- **Structure**: One photograph does the work; a short line and logo at most
- **Copy slot**: 5-8 words, identity-flavored ("Mornings, handled.")
- **DTC example**: Product on a kitchen counter mid-routine
- **SaaS example**: The tool on-screen in a real work moment (standup, close call, ship day)
- **Source it from**: Winning ads' visual patterns; identity language in reviews

### 12. Numbered List

"5 reasons [audience] are switching to [brand]." Icons next to each point.

- **Structure**: Numbered rows, icon + short line each, product anchor at bottom
- **Copy slot**: Each reason a distinct angle — pain, outcome, proof, differentiator, price
- **DTC example**: "5 reasons runners switched to [brand] this year"
- **SaaS example**: "4 reasons finance teams are leaving [legacy tool]"
- **Source it from**: Aggregate the most common switching reasons across reviews

### 13. FAQ Card

A common objection as the question, answered directly.

- **Structure**: Question prominent, answer concise, product anchor
- **Copy slot**: The objection *as customers phrase it* — the recognition is the hook
- **DTC example**: "But does it work for sensitive skin? Yes — and here's why."
- **SaaS example**: "Will this survive our security review? SOC 2 Type II, SSO, EU hosting."
- **Source it from**: `inputs/comments/` — the objections people post publicly under your ads

### 14. Competitor Callout

Name a specific competitor (or the category default) and explain the difference. Bold but factual.

- **Structure**: Their name vs. yours, one clear axis of difference
- **Copy slot**: A difference you can defend with facts — comparative claims invite scrutiny
- **DTC example**: "Like [competitor], minus the 14g of sugar."
- **SaaS example**: "[Competitor] charges per seat. We don't."
- **Compliance note**: Comparative advertising must be truthful and substantiatable; some platforms restrict naming competitors
- **Source it from**: Competitor mentions in reviews and comments — customers name the alternative for you

### 15. Origin Story

Founder photo with the why-we-built-this narrative. Longer copy than other formats.

- **Structure**: Portrait or team photo, 2-3 short paragraphs, product secondary
- **Copy slot**: The specific moment or frustration that started it — specificity is the credibility
- **DTC example**: "We spent 2 years and 47 batches getting this right. Here's why."
- **SaaS example**: "We were the customer. The tool we needed didn't exist, so we built it."
- **Source it from**: The real story — pairs with warm/retargeting audiences better than cold

---

## Per-Concept Output Format

Each generated concept follows this structure:

```markdown
## Concept [N]: [Template Name]

**Headline**: [the headline copy]
**Body**: [supporting copy, if the template uses it]
**Visual**: [layout description specific enough to design or generate from]
**Image prompt**: [prompt for the image tool, if generating — see generative-tools.md]
**Grounded in**: [which review / winning ad / comment this traces to, quoted or named]
```

For a batch, add an `INDEX.md` listing every concept with its template type and grounding source, so the reviewer can scan 50 concepts in two minutes.

## Batch Distribution

For a standard 50-concept batch: 3-4 variations per template across all 15. If performance data shows certain templates consistently winning for this brand, shift to 60% proven templates / 40% full-cycle coverage — but never drop coverage to zero. Fatigue is why you're generating daily; the template that's tired next month is the one you're scaling today.
