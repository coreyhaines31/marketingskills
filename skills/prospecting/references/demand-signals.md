# Demand-Signal Discovery (Find Your First Customers)

The other three branches build a list from who *fits* (firmographics, technographics, proximity). This branch builds a list from who is *already showing the pain* — the early-stage motion where you have a product and a hunch but no customer base yet, and you need your first ten real conversations. You are not filtering a database; you are mining recent public discourse for people describing the exact problem you solve, then linking every prospect to the evidence.

Use this branch when the user is pre-product-market-fit, launching something new, or looking for **design partners, beta users, or first customers** rather than a scaled outbound list. It reuses the shared five phases and every compliance guardrail in SKILL.md; what changes is where you look, how you score, and what you ship.

Pattern credit: the framework here is re-expressed from the open-source `first-customer-finder` Codex skill (Kappaemme, MIT), extended with our live-recency tooling.

## What makes this branch different

| | List-building branches (SaaS / B2B / SMB) | Demand-signal discovery |
|---|---|---|
| Starts from | A firmographic ICP | A described problem |
| Sources | Contact databases (Apollo, ZoomInfo, Clay) | Public discourse (forums, reviews, issues, posts) |
| Contact step | Enrich + verify email deliverability | None — reach them where they already posted |
| Wins on | Coverage at scale | 10 strong evidence-backed matches over a long list |
| Output | A scored lead sheet | An evidence report + manual outreach plan |

A prospect here without a cited pain, need, or timing signal is a speculative fit — it does **not** belong in the primary shortlist. Evidence is the entry ticket.

## Step 1 — Product brief (before any searching)

Define, specifically enough to *reject* weak matches:

- product and the promised outcome
- primary user and the economic buyer (often different)
- the urgent job to be done
- the current alternative or workaround being replaced
- the likely adoption trigger (what makes now the moment)
- geography / language constraint
- clear disqualifiers

Don't start broad collection until the brief is sharp. Pull from `.agents/product-marketing.md` if it exists.

## Step 2 — Mine the five signal buckets

Search several angles, not one query repeated. Adapt wording to how the audience actually talks (mine their vocabulary from organic content first — see the ad-creative hook-system's organic-language note for the same idea).

1. **Explicit demand** — "looking for," "recommend a tool for," "alternative to [X]," "does anything exist that," "how do you all handle."
2. **Pain** — "takes hours," "so manual," "hate that," "keeps breaking," "biggest frustration with," "why is there no."
3. **Workaround** — spreadsheets, copy-paste, a VA, a Zapier chain, a script, a template, any repeated manual step that your product would replace.
4. **Switching** — cancellation, migration, "moving off [competitor]," a missing feature, a pricing complaint, competitor frustration.
5. **Timing** — a public launch, a new hire for the relevant function, expansion, a new workflow or regulation, an integration announcement — a *current* event that makes the product relevant now.

**Use our live-recency edge.** A generic skill relies on whatever a web search surfaces; you have better:
- **last30days** — Reddit, Hacker News, X, YouTube, and web signals from the last 30 days. This is the single highest-value tool for this branch: recency *is* the timing signal.
- **social-fetch** — pull the full content of a specific post/thread you find, normalized.
- **scraping** / **Firecrawl** / **Browserbase** — read the original public page (a forum thread, a GitHub issue, a review), never qualify from a search snippet alone.
- **deep-research** — for a multi-source sweep with adversarial verification when the wedge is broad.
- **competitor-profiling** / **customer-research** — competitor switching signals and review-mining for the pain language.

## Step 3 — Source mix (public only)

Forums and public community threads · public social posts and replies · product and app-marketplace reviews · GitHub issues and feature requests · public company pages, job posts, changelogs, launch announcements · "looking for a tool" posts and directories.

Avoid private groups, gated communities, data brokers, leaked datasets, and any source whose terms prohibit access — the same compliance guardrails as every other branch (see SKILL.md), including the no-sensitive-traits rule.

**Business/professional context only.** Qualify and reach out only where someone is posting in a professional or business capacity about a work problem (a founder in an indie-hackers thread, a developer in a GitHub issue, an ops lead in a subreddit for their role). Exclude personal-distress contexts entirely — health, financial hardship, addiction, grief, or any consumer support forum where people are venting personal problems, even if your product is tangentially relevant. When the motion is genuinely consumer (B2C), a public pain post is not on its own a lawful basis for cold outreach — reach people through the channel's own norms (reply publicly where replying is expected) and never DM a stranger off a personal post.

Quote minimally, paraphrase by default, and link every material pain or timing signal.

## Step 4 — Score on demand-fit (not ICP-fit)

The list-building branches score Hot/Warm/Cold on ICP fit. This branch scores 0–100 on **demand fit** — how strongly the evidence says this specific prospect wants this specific thing now. Score each dimension 0–5:

| Dimension | Weight | What it measures |
|---|---|---|
| **Pain strength** | 25% | Directness, severity, repetition, and cost of the stated problem |
| **Product fit** | 25% | How directly your product solves the evidenced job |
| **Timing** | 20% | Freshness + a current trigger present |
| **Public reachability** | 15% | A natural, relevant public/professional contact path exists |
| **Evidence quality** | 15% | Specificity, source reliability, confidence the signal is really theirs |

```
score = pain/5*25 + fit/5*25 + timing/5*20 + reachability/5*15 + evidence/5*15
```

| Band | Meaning |
|---|---|
| **80–100** | Strong first-customer candidate |
| **65–79** | Promising — validate fast |
| **50–64** | Plausible but missing a material signal |
| **Below 50** | Do not include in the primary shortlist |

An old explicit request can still count — but lower the timing score and label the date. A company that merely matches the industry with no evidenced trigger is *not* a qualified prospect here.

### Prospect stages

- **High intent** — publicly requesting a solution or actively switching
- **Problem aware** — clearly describing the pain or an expensive workaround
- **Trigger present** — a current business event makes the product relevant
- **Potential fit** — ICP match, incomplete evidence → keep *outside* the primary shortlist

### Evidence ledger (per qualified prospect)

Displayed name (company/project/public professional) · source title + URL · visible publication date or "date unavailable" · source type · the concise pain/timing signal · observed evidence vs. inference (label which) · score breakdown · freshness warning when the signal is stale.

## Step 5 — Draft outreach, never send it

Recommend the most natural channel *already associated with the source*, and only where a reply is a normal part of that channel (reply in the public thread, respond via a public professional profile). Don't turn a public post into a private DM the poster didn't invite, and never contact someone off a personal-distress post. Draft one opener, under ~90 words, in this shape:

1. mention the public context naturally
2. connect it to the exact problem
3. explain the product in one sentence
4. ask one low-friction question

Never claim familiarity you don't have, never fabricate personal details, and never auto-send: no messages, connects, follows, comments, form submissions, or CRM records unless the user separately authorizes that action. This is the manual/gated posture from the marketing-loops guardrails.

## Step 6 — Ship the evidence report

Lead with the most actionable evidence, in this order:

1. **Verdict** — does the product have reachable early-customer signal, or not yet? (An honest "not yet, here's why" is a valid answer.)
2. **ICP** — buyer, job, trigger, disqualifiers.
3. **Top prospect** — the single strongest evidence-backed candidate and why now.
4. **Prospect shortlist** — per prospect: source, pain signal, demand-fit score, stage, why-now, channel, opener.
5. **Repeated patterns** — pains and triggers recurring across prospects (these are your positioning and messaging gold).
6. **Seven-day manual outreach plan** — a low-volume validation sequence (e.g., contact the top 3 with one source-based question; share a mockup only after they confirm the pain; target three conversations and one design-partner commitment).
7. **Limits** — what evidence is missing and what must be confirmed through real conversations.

For a shareable standalone HTML version of this report, the JSON→HTML generator pattern in ad-creative's [creative-review-page.md](../../ad-creative/references/creative-review-page.md) is the model (escape every value; keep it self-contained).

## The honesty rules (non-negotiable)

- Every primary prospect links to at least one real public signal. No signal, no shortlist.
- Label the output **"potential customer based on public signals"** — never "interested," "will buy," or "has consented."
- Prefer ten strong matches over a long generic list. Make uncertainty and stale evidence visible.
- Personalize from the cited source, not from invented assumptions.
- Treat the shortlist as a research hypothesis to validate through conversations, not a customer database.
