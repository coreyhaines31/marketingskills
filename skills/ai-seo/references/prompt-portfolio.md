# Prompt Portfolio Design

Which prompts you track decides what your AI visibility numbers mean. A portfolio stuffed with glossary questions will report healthy visibility while you lose every shortlist. This reference covers how to choose prompts, group them, version them, and how often to run them, including the multi-turn buying conversations single prompts miss.

## Start with the measurement question

Write down the decision the numbers will drive before choosing a single prompt. "Are we on the shortlist for mid-market [category] buyers in the US?" needs a different portfolio from "Did our docs rewrite fix how Claude describes our API limits?"

## Build from real demand

Use the words buyers actually type. In order of preference:

1. Prompts buyers report directly (a "What did you ask the AI?" follow-up on your how-did-you-hear field, sales call notes)
2. Prompt-demand data from a tracking tool, if you have it
3. Customer research, support tickets, community threads, and sales objections
4. Your search terms, rewritten as someone would phrase them to an assistant

Don't mechanically turn a keyword list into questions. "crm small business" and "What CRM should a 5-person agency use if we live in Gmail?" retrieve different sources.

## Cover the intent families

| Family | Example shape |
|---|---|
| Category discovery | "What tools do teams use for [job]?" |
| Problem and solution research | "How do I stop [problem]?" |
| Comparisons and alternatives | "[You] vs [competitor]," "alternatives to [competitor]" |
| Recommendations and "best for" | "Best [category] for [segment or constraint]" |
| Trust, risk, and validation | "Is [you] legit?" "Does [you] have SOC 2?" |
| Price, availability, compatibility, limits | "[You] pricing," "Does [you] work with [tool]?" |
| Implementation and troubleshooting | "How do I set up [you] with [stack]?" |
| Local, shopping, or regulated | Only when they apply to the business |

Weight families by business value. A citation for a definition question rarely sells anything; see the revenue filter in SKILL.md's audit step.

## Three cohorts

| Cohort | Purpose | Rules |
|---|---|---|
| **Stable core** | Trend measurement | Changes rarely and only through versioning. This is the set you report on. |
| **Exploratory** | Emerging demand, new segments, new competitors | Rotates freely. Promote prompts into the core when they prove valuable. |
| **Diagnostic controls** | Known outcomes that tell you whether measurement drifted | Include prompts where you should always appear (your brand name) and never appear (an unrelated category). If those move, the tool or the engine changed, and your work had nothing to do with it. |

Keep engines, markets, languages, and personas as separate configurations. A US English ChatGPT run and a German Gemini run are different measurements; see [multilingual-and-commerce.md](multilingual-and-commerce.md).

Add paraphrase variants only where you need to measure wording sensitivity. Otherwise collapse variants of the same intent into one core prompt.

## How often to run

Two regimes, depending on portfolio size:

- **A broad portfolio (hundreds of prompts):** once a day is usually enough. In Profound's comparison of 753 prompts across seven platforms over two weeks, once-daily visibility estimates landed within about two percentage points of running each prompt ten times a day (Profound, July 2026). Extra runs helped citation share more than visibility, and couldn't remove day-to-day platform drift. Composition mattered more than frequency.
- **A small set (the 10–20 prompts of a DIY audit), short experiments, or citation-share precision:** run each prompt several times (3–5 per platform) and report the rate with its sample size, as the monitoring section in SKILL.md describes. With few prompts, one run per prompt is mostly noise.

Profound sells AI visibility tracking, so treat these figures as vendor research from one setup. Other trackers include Ahrefs Brand Radar, Semrush, Peec AI, Otterly, and ZipTie; check what each one samples before comparing their numbers.

## Version the portfolio

- Give the portfolio a version number and log every addition, removal, and weighting change with a date and reason.
- Never compare two periods that used materially different portfolios. Recalculate on the prompts both periods share.
- Freeze the core during an experiment.

## Read results by topic, then fix before you create

Score the portfolio by buying topic, not prompt by prompt. "Best auth API," "SSO provider for SaaS," and "SAML authentication tools" are one topic. For each topic, count how often you and each competitor appear across its prompts and runs: a competitor in 18 of 25 runs while you're in 4 is where to start, not a single prompt where both of you showed up once.

For the topics you're losing:

1. **Open the sources the engine cited when competitors won.** Record the page, the domain, the page type, and which competitor it mentions. After 20–30 prompts the same pages and domains repeat.
2. **Check whether you already have a page that should win.** If it exists, find out why it isn't surfacing (wrong intent, outdated, the answer buried, missing the proof or comparison the winning page has) before writing a new one. Two weak pages on one topic is worse than one fixed page.
3. **Rule out the technical layer** (indexing, crawler access, internal links) before rewriting anything.
4. **Decide the fix:** a new page, a better existing page, updated facts, or third-party sources (comparison pages and discussions you're absent from).
5. **Rerun the identical portfolio** once changes are crawled, with the same prompts and engines, and compare per topic.

*Topic-gap method adapted from Jam's AI search audit (October 2026).*

## Multi-turn buying journeys

Buyers don't stop at one prompt. Commercial conversations in ChatGPT were less likely to end after one turn than informational ones, and commercial intent rose from 13.9% to 19.2% of sampled conversations in a year (Profound, August 2026; sampled and modeled estimates). Earlier Profound research found web citations concentrate in the opening turns of a research conversation (Profound, Q4 2025 data). So the opening prompt decides which sources get pulled, and later turns decide who stays on the shortlist.

Map the journey by stage, then write one opening prompt and two or three realistic follow-ups for each:

| Stage | Typical follow-up |
|---|---|
| Define the need | "What should I look for in a [category]?" |
| Build a shortlist | "Which of these work for [constraint]?" |
| Compare | "How does [A] compare to [B] on [criterion]?" |
| Validate | "What do users complain about with [A]?" |
| Resolve risk | "Can I migrate from [incumbent] without losing [data]?" |
| Choose | "Which would you pick for a team like mine?" |

Run the conversation in one session and record, per turn, whether you were mentioned, recommended, cited, or dropped, and the framing around the mention. The turn where you fall off the shortlist is the content or evidence gap to fix. Track mention, shortlist inclusion, framing, and citations separately; see the visibility ladder in [citations-vs-recommendations.md](citations-vs-recommendations.md).

First decide whether AI buying conversations matter for the category at all. Profound found commercial-intent share varied about tenfold across industries in the same study.

---

*Framework lineage: cohort design, cadence regimes, and the journey map adapted (re-expressed and restructured) from Profound's MIT-licensed ai-prompt-portfolio-builder and commercial-ai-journey-mapper skills and the studies they cite (July and August 2026), credited.*
