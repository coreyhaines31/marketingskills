# Pricing Page Teardown

A structured way to score a live pricing page and return prioritized fixes. It grades **two axes**: the classic **human buyer experience**, and — the newer, higher-leverage lens — **AI-agent readiness**: whether the LLMs and agents that increasingly shortlist and compare tools can actually read, quote, and recommend your pricing.

> **Framework credit:** the two-axis structure and especially the AI-agent-readiness lens are adapted from **Kyle Poyar's** (Growth Unhinged) pricing-page teardown. Learn-from-only — this rubric is authored independently; credit the framing to Poyar.

## Why the second axis matters now

Buyers increasingly ask ChatGPT, Perplexity, and Claude *"what's the best [category] tool and what does it cost?"* before they ever hit your site. If your price is trapped in an image, rendered only by JavaScript, or missing from the page's text, a text-fetching agent often can't read it — some agents render JS or fall back to vision/OCR, but many don't, so don't count on it. And a "Contact us" tier gives an agent no public number to quote at all. When the agent can't read your price, it recommends and quotes the competitor whose pricing it *can*. This axis is the pricing-page complement to `ai-seo` and `schema` — neither *guarantees* a citation, but a page a fetcher can't parse makes one much less likely.

**The 30-second test — the "paste test":** give the pricing URL to a **browsing-capable** AI (Perplexity, ChatGPT with search, or Claude with web) — or paste the page's *rendered* text — and ask *"What are the plans and prices?"* If it can't answer correctly and completely, agents fetching your page the same way will struggle too. It's a heuristic, not proof every agent fails (some render JS or use vision), but a clean miss is a real finding worth fixing.

## The rubric

Score each dimension **Pass / Partial / Gap** (or 1–5 if you want a number). Two sub-scores (one per axis) plus a prioritized fix list is the deliverable — not a single vanity number.

### Axis 1 — Human buyer experience

| # | Dimension | Passing looks like | Common gaps |
|---|---|---|---|
| 1 | **Value-prop clarity** | Above the fold: what you get + why it's worth it, in the buyer's words | Feature list with no outcome; "flexible plans for every team" |
| 2 | **Plan clarity / differentiation** | Obvious which plan is for whom and exactly how they differ | Feature-soup tables; tiers that blur together; no "who it's for" |
| 3 | **Cognitive load** | A buyer can decide in <30s | Too many tiers (5+), unexplained jargon, decision paralysis |
| 4 | **Trust signals** | Logos, testimonials, security/compliance, a guarantee near the CTA | No proof; trust content buried below the fold |
| 5 | **Pricing psychology** | A recommended/anchor tier, sensible anchoring, coherent charm vs. round pricing | No recommended tier; highest price hidden last; random price endings |
| 6 | **Transparency** | The actual price is shown; what's in/out is clear; no surprise fees | "Contact us" on every tier; hidden overages; usage limits omitted |

### Axis 2 — AI-agent readiness (the novel lens)

| # | Dimension | Passing looks like | Common gaps |
|---|---|---|---|
| 7 | **Machine-readable pricing** | The real numbers are in the page's HTML/text | Price in an image/SVG, JS-only render, or a PDF — text-fetching crawlers get nothing reliable; "Contact sales" leaves no public number to quote |
| 8 | **FAQ / objection coverage** | Extractable answers to "does it do X," "what's the limit," "can I cancel," "is there a free trial" | No FAQ, or answers only in a support portal an agent won't reach |
| 9 | **Per-tier depth in text** | Each plan's inclusions, limits, and quotas stated in words | Differences shown only as checkmark columns in an image; limits unnamed |
| 10 | **Structured data & extractability** | `Product`/`Offer` schema markup, clean semantic HTML, AI search/agent bots allowed to crawl (`llms.txt` is a nice-to-have, not yet a standard) | No schema; pricing behind auth/interaction; AI *search* bots blocked in robots.txt |

Dimensions 7 and 10 hand off to **`schema`** (Product/Offer JSON-LD) and **`ai-seo`** (extractability, AI-bot access, `llms.txt`) for implementation.

## How to run it

1. **Load context** — read `.agents/product-marketing.md` (ICP, positioning) so "clarity" is judged against the *right* buyer.
2. **Fetch the page as an agent would** — get the rendered text/HTML, not a screenshot. Note immediately whether prices appear in the text (that's dimension 7).
3. **Run the paste test** — ask an LLM for the plans and prices from the URL; record what it gets wrong or misses.
4. **Score all 10 dimensions** Pass/Partial/Gap with a one-line reason each.
5. **Prioritize fixes** by impact × effort. AI-readiness gaps are often *high impact, low effort* (add text prices, add Offer schema) — surface those first.

## Output template

```markdown
# Pricing Page Teardown — [url] — [date]

## Scores
- Human buyer experience: [X/6 passing]
- AI-agent readiness:      [X/4 passing]

## Paste test
[What an LLM returned for "plans and prices" — and what it got wrong/missed]

## Dimension-by-dimension
| # | Dimension | Verdict | Note |
|---|-----------|---------|------|
| 1 | Value-prop clarity | Pass/Partial/Gap | ... |
| … | … | … | … |

## Prioritized fixes (impact × effort)
1. [High/low] — [fix] — [why it matters] — [→ schema / ai-seo / cro if handing off]
2. ...

## The one thing
[The single highest-leverage fix — often "put your actual prices in text + add Offer schema so AI can quote you."]
```

## Common failure patterns

- **The image-price** — a beautiful pricing graphic with the numbers baked in. Humans love it; text-fetching agents (and screen readers) usually can't read it. Put prices in text; the image can stay as decoration.
- **"Contact us" everywhere** — sometimes right for true enterprise, but if *all* tiers hide price, both humans and agents bounce to a competitor with numbers. Show at least a starting price or a representative range.
- **Checkmark-only tables** — feature differences shown only as ✓/✗ columns in an image or icon font. State the actual limits and inclusions in words.
- **JS-only render / auth wall** — if the price only appears after interaction or login, most fetchers won't see it (only JS-rendering agents might).
- **Blocked AI *search* bots** — the crawlers that feed AI *answers* are the search agents, not the training crawlers: OpenAI's `OAI-SearchBot`, Anthropic's `Claude-SearchBot` / `Claude-User`, Perplexity's `PerplexityBot`. Blocking `GPTBot` only opts out of model *training*, not ChatGPT Search — so check which bots your robots.txt actually blocks. (Bot access is `ai-seo`'s domain — hand it off there.)

## Related
- `schema` — Product/Offer JSON-LD so machines read your tiers and prices.
- `ai-seo` — extractability, AI-bot access, `llms.txt`, getting cited by AI answers.
- `cro` — converting the human once the page is clear.
- `copywriting` — the value-prop and tier copy the teardown flags.
