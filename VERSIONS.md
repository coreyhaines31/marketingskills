# Marketing Skills Versions

Current versions of all skills. Agents can compare against local versions to check for updates.

| Skill | Version | Last Updated |
|-------|---------|--------------|
| ab-testing | 2.0.0 | 2026-05-05 |
| ad-creative | 2.4.0 | 2026-07-09 |
| ai-seo | 2.1.0 | 2026-06-15 |
| analytics | 2.0.0 | 2026-05-05 |
| aso | 2.0.0 | 2026-05-05 |
| churn-prevention | 2.0.0 | 2026-05-05 |
| co-marketing | 2.0.0 | 2026-05-05 |
| cold-email | 2.0.0 | 2026-05-05 |
| community-marketing | 2.0.0 | 2026-05-05 |
| competitor-profiling | 2.0.0 | 2026-05-05 |
| competitors | 2.0.0 | 2026-05-05 |
| content-strategy | 2.0.0 | 2026-05-05 |
| copy-editing | 2.0.0 | 2026-05-05 |
| copywriting | 2.0.1 | 2026-06-16 |
| cro | 2.0.0 | 2026-05-05 |
| customer-research | 2.0.0 | 2026-05-05 |
| directory-submissions | 2.0.0 | 2026-05-05 |
| emails | 2.0.0 | 2026-05-05 |
| free-tools | 2.0.0 | 2026-05-05 |
| image | 2.0.1 | 2026-05-18 |
| launch | 2.0.1 | 2026-06-16 |
| lead-magnets | 2.0.0 | 2026-05-05 |
| marketing-council | 1.0.0 | 2026-07-06 |
| marketing-ideas | 2.0.0 | 2026-05-05 |
| marketing-loops | 1.1.0 | 2026-07-05 |
| marketing-plan | 1.1.0 | 2026-05-29 |
| marketing-psychology | 2.0.0 | 2026-05-05 |
| offers | 1.0.0 | 2026-06-16 |
| onboarding | 2.0.0 | 2026-05-05 |
| ads | 2.2.0 | 2026-07-05 |
| paywalls | 2.0.0 | 2026-05-05 |
| popups | 2.0.0 | 2026-05-05 |
| pricing | 2.0.1 | 2026-06-16 |
| product-marketing | 2.0.0 | 2026-05-05 |
| programmatic-seo | 2.0.0 | 2026-05-05 |
| prospecting | 1.0.0 | 2026-05-26 |
| public-relations | 1.0.0 | 2026-06-10 |
| referrals | 2.0.0 | 2026-05-05 |
| revops | 2.0.0 | 2026-05-05 |
| sales-enablement | 2.0.1 | 2026-06-16 |
| schema | 2.0.0 | 2026-05-05 |
| seo-audit | 2.0.0 | 2026-05-05 |
| signup | 2.0.0 | 2026-05-05 |
| site-architecture | 2.0.0 | 2026-05-05 |
| sms | 1.0.0 | 2026-05-21 |
| social | 2.2.0 | 2026-07-09 |
| video | 2.0.1 | 2026-05-18 |

## Recent Changes

### 2.8.4 (2026-07-09)

- **social** (2.1.0 → 2.2.0): added a **carousel framework library**. New `references/carousel-frameworks.md` — five slide-by-slide narrative architectures for Instagram carousels and LinkedIn document posts, re-expressed and extended from a pattern circulating on marketing X (Vibe Marketers HQ's five-framework breakdown): **Value-Stack** (exact-count cover → one item per slide → action close; the count is a checkable promise), **Problem-Proof** (result-as-fact hook → reframed problem → named mechanism → literal detail → screenshot receipt that closes slide 1's loop), **Hack List** (contrarian stat hook → why the common approach fails → one *named* technique per slide → thesis + CTA), **Rant Callout** (provocative claim → specific escalation → the fairness pivot that keeps it conviction-not-bitterness → signed close), and **Demo Walkthrough** (outcome first → pain → numbered process overview *before* the detail to cut mid-swipe drop-off → one real screenshot per step → result + positioning). Includes a framework-selection table (match structure to content type), two cross-framework rules (slide 1 is the thumbnail; one visual template per carousel), per-framework SaaS examples and failure modes, platform notes (IG 4:5 specs, LinkedIn PDF document posts with the post text as a second hook, TikTok photo-mode pacing), a production checklist (real claims only, exact counts delivered, one CTA), and measurement guidance (judge on saves + completion, not likes). SKILL.md wires the reference next to post templates and adds 'carousel,' 'slide-by-slide,' and 'document post' triggers; post-templates.md's generic Carousel Hook now points to the full library. New eval (id 7) covers framework selection, named-technique slides, LinkedIn document-post guidance, and no-invented-stats. Closes #421.

### 2.8.3 (2026-07-09)

- **ad-creative** (2.3.0 → 2.4.0): added a **brand-flexible style tier** to `references/motion-video-ads.md` — four token-driven styles that absorb any company's brand system instead of imposing their own palette: **monoline editorial** (thin single-weight ink line-art on the brand neutral, one accent sweep — the most universally brandable), **Swiss typographic** (the label set enormous in the brand's type on a grid; works for any brand with a font and a color), **wireglow** (wireframe subject on near-black with one gradient accent beam — dev-tool/dark-mode brands), and **duotone screenprint** (photography reduced to ink + accent). All driven by a **brand slots contract** — FIELD (neutral ground), INK (drawing/type color), ACCENT (one element per frame, scarcity is the design), TYPE FEEL, plus per-brand constraints (e.g. "gradients only on edges") — resolvable from brand guidelines or `.agents/product-marketing.md`. Includes per-style motion notes (lines draw themselves, beams pulse, type settles) under the same composition-never-changes rules. All four verified to render with clean typography using a real brand's tokens.

### 2.8.2 (2026-07-09)

- **ad-creative** (2.2.0 → 2.3.0): added the **faceless motion-style video ad format**. New `references/motion-video-ads.md` (format popularized by @borjafat; original re-expression of the open Bomx `super-video-maker` motion-collage recipe, extended with production lessons from shipping it end-to-end): a fully generated 15–45s concept/explainer video — styled poster stills (one per beat, series-locked via reference images) → image-to-video "living" motion → TTS narration → whisper-word-timed captions — at roughly $3–6 and ~15 minutes per finished video. Covers the provider-agnostic pipeline with a one-key Gemini path (Nano Banana Pro + Veo 3.1 + Gemini TTS) and alternatives (GPT-Image/Flux, Seedance/Kling/Runway, ElevenLabs), a **five-style visual library** with fill-in prompt formulas (screen-print collage, flat vector explainer, papercraft diorama, pop-art comic, claymation), a motion prompt formula, hard-earned QC gotchas (image-to-video models inject photoreal "maker hands" — and negative prompts make it worse; always QC each clip's final 2 seconds; caption/label collision; TTS/whisper sound-alike words in CTAs), ad-specific rules (brand in the poster for sound-off autoplay, beat 1 is the 3-second hook, regenerate stills per aspect rather than cropping), and AI-content disclosure notes. SKILL.md wires the reference into Generating Ad Visuals and adds 'motion video ad,' 'faceless video ad,' 'animated explainer ad,' and 'motion collage ad' description triggers.

### 2.8.1 (2026-07-08)

- **ad-creative** (2.1.0 → 2.2.0): added the **iMessage chat-reveal video ad format**. New `references/imessage-video-ads.md` — an original distillation of the format popularized by Shiv Sakhuja / Gooseworks (their public `create-imessage-video-ad` skill; the repo carries no open-source license, so content was re-expressed with credit rather than copied): a 9:16 video where a scripted iMessage thread unfolds bubble-by-bubble — screenshot hook → friend reacts → "what app is that?" → brand + promo-code reveal → static end card. Covers when to use it and when not (considered B2B, nothing screenshot-able, regulated-industry compliance), a compliance/grounding section tying dramatized conversations to the skill's Grounded Inputs rules (facts in the thread must be real; never frame the thread as a real testimonial), the six concept angles (result-as-screenshot, setup flex, cancellation moment, feature-as-punchline, friend-asks-friend inverse, receipt-as-hook), ad anatomy with script + pacing rules (8–14 bubbles, texting voice, brand appears once and late, rhythm not metronome, link-underlined promo code), three production routes (off-the-shelf Gooseworks skill; code-based HTML mockup + one continuous Playwright recording + ffmpeg stitch; Remotion for templated scale), the craft rules that sell the illusion (the recognizable send/receive SFX — CC0 recordings on BigSoundBank, with a trade-dress legal-review note; silent typing indicators; composer-typed text must equal sent text; static end card with the real logo SVG; native 1080×1920 recording; HTML-mimic real app UIs for hook screenshots instead of AI-generating them), a ship checklist, and an iteration order (hook attachment first). SKILL.md wires the reference into Generating Ad Visuals and adds 'iMessage ad,' 'chat reveal ad,' 'text message ad,' and 'fake DM ad' description triggers. Closes #411.

### 2.8.0 (2026-07-06)

- Added `marketing-council` skill — a simulated board of advisors staffed by twelve legendary marketers, built so their lenses deliberately collide: Seth Godin, David Ogilvy, Eugene Schwartz, Claude Hopkins, Gary Halbert, Russell Brunson, Alex Hormozi, April Dunford, Rory Sutherland, Byron Sharp, Ann Handley, and Gary Vaynerchuk. Three session modes (quick take / 3-5 seat council session / full council), a seating table mapping question types to strong fits plus **designated dissenters** (an agreeing council is an anti-pattern — e.g., Sharp dissents on niche strategies, Godin on funnel pressure, Hopkins on unmeasurable brand plays), and a session protocol ending in a **disagreement map** (each conflict named as its underlying trade-off plus the evidence that would settle it) and a chair's synthesis with skill handoffs. Per-advisor dossiers in `references/advisors/` were research-grounded via parallel web-research passes: each carries lens, frameworks with verified attributions (incl. misattribution flags — Dream 100 is Chet Holmes's, "salesmanship in print" is John E. Kennedy's coinage, brand image originated with Gardner & Levy, AIDA predates Halbert), documented positions with named sources, signature questions, best-for/blind-spots (with documented criticisms so dissent is honest), voice notes, and key works. Hard grounding rules: output labeled as simulation; no fabricated quotes (verifiable quotes with source, else paraphrase attributed to the work); no implied endorsements of the user's specific company; extra care for the eight living advisors including explicit do-not-fabricate flags (e.g., Hormozi launch figures are self-reported; recency questions about living advisors route to the research pass). Optional live research pass integrates deep-research / watch-video / last30days-style skills when installed, degrading to web search. `references/advisor-template.md` supports custom advisors saved to `.agents/advisors/` with a two-tier grounding standard (public figures need sources; private advisors' positions must come from the user, never invented). Includes an `evals/evals.json` suite covering dissent enforcement, quote discipline, custom-advisor flow, and the do-not-fabricate rule. Closes #391. Total skills: 47.

### 2.7.0 (2026-07-05)

- **ad-creative** (2.0.0 → 2.1.0): added scaled static ad production with grounded inputs. New `references/static-ad-templates.md` — a 15-template structural library for static ads (Headline Statement, Us vs. Them, Stat Callout, Review Card, Testimonial Stack, Before/After, Problem/Solution, Founder Message, Feature Spotlight, Press Mention, Lifestyle Hero, Numbered List, FAQ Card, Competitor Callout, Origin Story), each with structure, copy slot, DTC + SaaS examples, sourcing guidance, and compliance notes where relevant (before/after claims, press logos, comparative advertising). SKILL.md adds **Mode 3: Scaled Static Batches (Grounded)** and a **Grounded Inputs** section: a durable inputs corpus (`inputs/winning-ads/`, `inputs/reviews/`, `inputs/comments/`, plus `brand/`), hard grounding rules (every concept cites its source — a real review, winning ad, or ad comment; no invented claims or testimonials; refuse to generate when required inputs are empty rather than falling back to ungrounded output), and input-decay guidance. Ad comments called out as the most-skipped, highest-value input (public objections → FAQ Card ads; unprompted praise → customer-written angles). New static batch output format: `outputs/YYYY-MM-DD/` with scannable `INDEX.md` (template + grounding per concept), per-concept files, and images — built for the pick-5-of-50 human review workflow. Two new Common Mistakes (generating without grounding, skipping the comments input) and cross-refs to `marketing-loops` and `customer-research`. Frontmatter description adds 'static ads,' 'static ad concepts,' and 'ad templates' triggers. Remixed from a DTC "morning ads" playbook pattern, adapted for cross-agent use and extended with B2B/SaaS examples.
- **marketing-loops** (1.0.0 → 1.1.0): added **the daily-creative-drop loop** to the Paid section of `references/loop-catalog.md` (loop #44) — a daily batch of grounded static ad concepts via `ad-creative` Mode 3. Full nine-part anatomy: acts only when the grounded inputs corpus is populated (else asks for inputs instead of generating), one-batch-per-day idempotency via dated output folders plus near-duplicate tracking across recent batches, stages creative only (never publishes to the ad account), pauses itself if batches go unreviewed for a week (vanity-loop detection), and a companion input-freshness cadence (weekly `inputs/winning-ads/` refresh; monthly `inputs/reviews/` and `inputs/comments/` refresh).
- **ads** (2.1.0 → 2.2.0): major B2B operations expansion — five new references plus a routing-table pattern, adapted (re-expressed, reconciled, and extended with our own framing) from practitioner playbooks, notably Ivan Falco's ads-skills (ColdIQ; MIT + Commons Clause, so all content was rewritten rather than copied). New **Reference Routing** table at the top of SKILL.md maps user intent → reference file, with a hard rule that live-account operational decisions load the relevant playbook first. New references: **b2b-paid-playbook.md** (5-stage demand lifecycle past the funnel — Create/Capture/Accelerate-Activate/Revive/Expand with bottom-up build order; budget-by-stage matrix with ROI timelines; leading vs. lagging signals for 2-24-month sales cycles; breakeven CPL/CPC derivation; hard kill rules — 2-3× target CPL at zero conversions for new ads, 1.5-2× over target for aging ads; the optimize-to-quality trap + offline conversion loop with "the CRM wins" reconciliation; Urgency/Budget/Fit 0-9 lead scoring ranked by ad; the scaling quadrant 2×2; measurement maturity gate; channel selection incl. paid-review listings and the $100 test). **meta-decision-system.md** (fully quantified kill/graduate/scale engine anchored on TCPL — target cost per *qualified* lead: ad-count ceiling formula, 80/20 Scaling/Testing dual-CBO structure, day-7 delivery check with fair-share math, weekly quality evaluation with a 3×TCPL data gate and QL-rate bands, five-condition graduation criteria, fatigue frequency bands by campaign type, swap rules, creative production math with win rates and minimum proven-ad inventory, +20%-per-5-days scaling protocol with rollback triggers, weekly cadence, lead-form friction / social-amnesia fixes, Advantage+ transition at ~50 conversions/week, benchmarks + Q1/Q4 seasonality). **linkedin-b2b-playbook.md** (auto-then-manual-at-−20% bidding progression, penetration-based scaling triggers, audience sizing rules and failure modes, job-functions-vs-titles tradeoffs incl. the seniority mutual-exclusivity and Business-Development-contains-C-suite gotchas, audience splitting rules and platform distribution bias, funnel-stage benchmarks with the CTRTLP-vs-CTR trap, thought-leader-ads playbook incl. the 72-hour organic-first edit trick and format-as-auction-tactic insight, campaign-group build order, document/conversation/CTV format notes, the non-retroactive retargeting warning, and an audit shortlist). **google-search-playbook.md** (the five-rung intent ladder with don't-skip-rungs gating, brand pause test on total-not-paid conversions, capture-before-create channel rule, separate-budgets-by-intent account structure with themed-ad-groups-not-SKAGs and default settings to flip, Phrase/Exact→Broad progression with 30-conversion gates, starter negative lists + negative match-type mechanics gotcha, the weekly search-terms ritual with don't-over-negative restraint, bidding-by-conversion-volume table with ±10-15% target moves, the 2× daily budget rule, offline conversion import via GCLID, QS fix-order and form-length-as-intent-gate, PMax-for-B2B guardrails and value ranking, benchmarks + the 8-metric weekly scorecard). **abm-playbook.md** (go/no-go thresholds, LinkedIn ABM 1:1/1:few/1:many with list-size mechanics and segmentation against enterprise over-serving, personalized-creative lift + the Germany legal exception, engagement-based frequency capping, ABM-on-Meta enrichment workflow for the sub-5% match-rate problem, acceleration campaigns against open pipeline on awareness objectives, 60/30/10 cross-channel split, the UTM cross-channel remarketing mechanic, sales orchestration with 48-hour engagement triggers, and account-movement KPIs + 80/20 incrementality holdouts). Also: the mandatory **Google RSA Output Spec** moved verbatim from SKILL.md to `references/rsa-output-spec.md` (SKILL.md keeps a mandatory load-and-follow pointer), bringing SKILL.md from 552 back under the 500-line limit. New description triggers: 'ABM,' 'account-based marketing,' 'B2B ads,' 'lead quality,' 'negative keywords,' 'Performance Max,' 'thought leader ads,' 'when should I kill an ad.' New Related Skills cross-refs to `revops` and `customer-research`.

### 2.6.0 (2026-07-01)

- Added `marketing-loops` skill — a library of 43 repeatable marketing loops (recurring agent workflows an agent runs on a cadence). Inspired by ForwardFuture's Loop Library pattern but scoped to marketing operations, and positioned as the operational cousin of `marketing-ideas` (ideas = what to try once; loops = what to keep doing on a schedule). SKILL.md defines a nine-part loop anatomy — check cadence, acts-when (action condition), purpose, skills used, loop body, self-check, **state/idempotency** (last-run marker, dedupe key, cooldown — so loops don't double-act or re-nag), stop/bail-out, and output — plus a cadence rule (match frequency to how fast the signal actually changes), when NOT to loop (strategy/creative work, unreviewed spend/publish, sparse signals, vanity loops), and scheduling guidance that defers the mechanics to `loopify` (Claude Code `/loop` / `ScheduleWakeup` / `CronCreate`) or plain cron. `references/loop-catalog.md` holds all 43 loops grouped by function: SEO & Content (keyword-gap, ranking-drop watch, content-decay, internal-linking, programmatic-SEO quality, content-repurposing, content-calendar refill), Paid (ad-fatigue, paid-search query-mining, retargeting hygiene, landing-page regression), Earned/Social/Partnerships (newsjacking, social-listening, community-engagement, competitor-watch, backlink-prospecting, directory-submission, partner-pipeline), Activation (onboarding drop-off, signup-funnel-leak, lead-capture asset, feature-adoption), Retention (churn-signal, lifecycle-email-refresh, re-engagement, email-deliverability, voice-of-customer), Revenue (trial-conversion, PQL/upgrade-intent, pricing-page-experiment, paywall-optimization, expansion/upsell, failed-payment/dunning), Referral & Advocacy (referral-nudge, review-and-UGC-harvest, review-site-management, case-study-sourcing), and Ongoing Ops (weekly-marketing-review, experiment-backlog, analytics-anomaly, brand-mention/reputation, tracking-QA, campaign-postmortem). Each entry orchestrates existing skills and carries concrete guardrails — e.g. newsjacking has a veto list (tragedy/politics/crisis/sensitive verticals) + mandatory human approval; ad-fatigue requires real significance (spend/impressions/conversions/attribution/learning-phase); lifecycle-email optimizes on clicks/replies/complaints/bounces not opens; pricing/paywall judge winners on revenue-per-visitor/refunds/churn not conversion alone; review-harvest enforces consent/FTC/platform ToS; the experiment-backlog loop is a thin wrapper that hands off to `ab-testing`. `references/loop-template.md` gives authors a copy-paste template (fill-in prompts + worked before/after example + ship checklist) for creating their own loops. Three further references round out the skill: `loop-orchestration.md` (how loops compose into a four-layer system — sensing → diagnostic → action → learning — plus a staged rollout path so you adopt tracking + a weekly review before acquisition, and never build all 43 at once), `loop-state.md` (where loop state lives — `.agents/loops/<loop>.json` — the watermark/dedupe/cooldown/in-flight idempotency patterns, and a run-log format that doubles as a vanity-loop detector), and `loop-guardrails.md` (a two-tier action model of autonomous-safe vs. gated actions, spend/send caps + allowlists, CAN-SPAM/GDPR/FTC/platform-ToS compliance mapped to the loops each governs, PII handling, an always-escalate list, a required kill switch, and a pre-launch checklist). Includes a banned-vocabulary list (no "set it and forget it" / "fully autonomous marketing" / "10x on autopilot") and an `evals/evals.json` suite. Total skills: 46.
- **ads** (2.0.1 → 2.1.0): reframed the skill around the "audience knowledge → creative first, targeting filters second" shift, plus a new modern Meta playbook. Rewrote the **Audience Understanding & Targeting** section — audience research is still the highest-leverage work, but where you apply that knowledge has changed: as ad-platform algorithms have improved at matching, feeding audience identifiers into the *creative* (headlines, copy, hooks, examples) now outperforms jamming them into *targeting filters*. Added a platform-by-platform table splitting how much audience knowledge should go to creative vs. targeting (Meta post-Andromeda 80%+ creative; Google Search 60% targeting; PMax/Demand Gen 70% creative; LinkedIn 60% targeting; TikTok 70% creative; Twitter/X 50/50), guidance on applying each kind of audience identifier to creative, and a "trying to fix weak creative with hyper-precise targeting" failure-mode callout. Added a **Modern Meta playbook (Andromeda era — 2026+)** section covering Meta's 2025 Andromeda algorithm change: creative volume as the binding constraint (statics > polished video, ~1 hr/week of fresh creative for the winning offer), creative-as-targeting (broad audience + specific creative, with a duplicate-and-strip-targeting A/B test), and the 4-component retargeting framework (segment by funnel stage, retarget with different offers). Interest-stacking is now flagged as actively harmful on Meta. Skill body only; frontmatter description unchanged.

### 2.5.1 (2026-06-16)

- Bumped `copywriting`, `launch`, `pricing`, and `sales-enablement` from 2.0.0 → 2.0.1 to reflect the description changes that shipped in v2.5.0 (cross-references added pointing to the new `offers` skill). The skill bodies are unchanged; only the frontmatter description picked up a new "For ..., see offers" line. Without the version bump, the repo's update check (which compares VERSIONS.md against local skill metadata) would not surface the routing/discovery change to users with installed copies. Caught by codex review.

### 2.5.0 (2026-06-16)

- Added `offers` skill for offer design — the thing you actually sell, not the page that sells it. Built around two frameworks: (1) the Value Equation (Dream Outcome × Perceived Likelihood / Time Delay × Effort), originally Hormozi, now standard across direct-response and creator-economy training; and (2) the six-component anatomy of a complete offer (core deliverable, bonus stack, guarantee, scarcity, name, price + payment structure). Self-scoped explicitly: best for services, agency retainers, courses, coaching, info products, high-ticket B2B, and direct response. Less load-bearing for pure self-serve SaaS where `pricing` does more work. References include: `value-equation.md` (full breakdown of the four levers with diagnostic prompts and a worked example of a stuck $3K copywriting course), `offer-anatomy.md` (the six components with worked examples and a fractional-CMO before/after), `guarantee-design.md` (eight guarantee types with decision tree by business type, refund tolerance, and buyer sophistication; honest case for anti-guarantees on premium offers), `bonus-stacking.md` (bonuses-as-objection-handlers, the math of stated value, the 4-bonus pattern that works, common failure modes), `scarcity-urgency.md` (honest formats: capacity / cohort / founding-member / inventory / seasonal / bonus-expiry / price-increase; explicit rejection of fake countdown timers and manufactured FOMO; why fake scarcity is uniquely costly), `offer-formats.md` (default offer format by business type — service, course, coaching, info product, high-ticket B2B, agency retainer, self-serve SaaS, direct-response — with what to watch for each), and `examples.md` (six anonymized before/after worked examples spanning fractional CMO, copywriting course, Notion templates, B2B SaaS annual contract, group coaching mastermind, content agency retainer). Includes a banned-vocabulary list (game-changing, revolutionary, 10x, secret, hidden, "limited time" with no actual limit) and explicit anti-patterns (manipulative scarcity, over-promising guarantees, bonus inflation, course-bro aesthetic).
- Cross-references added in `pricing`, `copywriting`, `launch`, and `sales-enablement` descriptions pointing to `offers` for offer construction.
- Total skills: 45.

### 2.4.2 (2026-06-15)

- **ai-seo** (2.0.1 → 2.1.0): added coverage of Google's Open Knowledge Format (OKF), a v0.1 markdown spec for agent-readable site bundles introduced on the Google Cloud blog on 2026-06-12 and shipped inside Knowledge Catalog. New `references/okf.md` reference covers what OKF is (directory of cross-linked markdown files with YAML frontmatter — `type` required, plus `title`/`description`/`resource`/`tags`/`timestamp` recommended), honest framing (Google built it for data-team catalog metadata; site-readable repurposing popularized by Suganthan Mohanadasan is a clever secondary use), what it does for AI search today (nothing immediate; protocol-layer registration like early schema.org adoption), where OKF fits in the agent-readable stack alongside `sitemap.xml` / `robots.txt` / `llms.txt` / `/pricing.md` / schema, three ways to ship a bundle (Suganthan's free web generator, his pending WordPress plugin, or by hand), hosting guidance (`yoursite.com/okf/index.md` plus an `llms.txt` line pointing to it), when to skip (closed platforms like Wix/Squarespace, very small sites, sites without other machine-readable files), and what to watch (v1.0 spec, AI engine adoption signals). `SKILL.md` adds a brief OKF subsection under "Machine-Readable Files for AI Agents" pointing to the reference. Frontmatter description extended with new triggers: `llms.txt`, `OKF`, `Open Knowledge Format`, `knowledge bundle`, `agent-readable site`. `references/platform-ranking-factors.md` Google AI Overviews section gets an OKF callout framing it as a "register early" protocol bet rather than a confirmed ranking signal.

### 2.4.1 (2026-06-10)

- Renamed `pr` skill to `public-relations` to avoid collision with pull-request skills in other Claude Code plugins (common naming for code-review / GitHub PR automation). The skill description already disambiguated from pull requests, but the directory name `pr` was still ambiguous to skill resolvers and to users typing `/pr`. The rename happened within hours of the initial v2.4.0 publish, before meaningful install adoption. No content changes; skill version stays at 1.0.0. All cross-references in `social/SKILL.md`, `VERSIONS.md`, and `README.md` updated accordingly.

### 2.4.0 (2026-06-10)

- Added `public-relations` skill (originally shipped as `pr`, renamed in v2.4.1) for public relations / earned media work — pitching journalists, newsjacking trending stories, responding to press requests (HARO/Connectively, Qwoted, Featured, Help A B2B Writer), and building the owned-media foundation (press page + media kit). Four PR modes (reactive / proactive / inbound / owned), explicit when-to-skip framing, and a banned-vocabulary list. References include: `newsjacking.md` (detect → score → angle → pitch loop with newsworthiness scoring rubric, 7 angle templates, Google News / HN / Reddit curl recipes, failure modes); `journalist-pitching.md` (media list construction, journalist fit scoring, 6 pitch templates by angle — data story / exclusive launch / op-ed / customer story / trend connector / newsjack response — subject-line craft, embargo etiquette, follow-up cadence); `press-platforms.md` (daily triage workflow, response template, ROI reality check); `media-outlets.md` (tiered list of tech press, SaaS, AI, devtools, business outlets, newsletters, podcasts, vertical press, regional press — explicitly scoped to journalist-driven outlets, with startup directories deferred to `directory-submissions`). Scope is enforced via cross-references: the `public-relations` skill handles earned media; `directory-submissions` handles Product Hunt / BetaList / SaaS directories; `launch` handles the broader launch moment.
- **social** (2.0.0 → 2.1.0): added `references/listening.md` for engagement triage — a daily loop for surfacing the top posts to comment on rather than scrolling feeds. Includes a 5-dimension scoring rubric (ICP fit, intent signal, reach potential, comment opportunity, recency), comment quality tiers, curl-based recipes for Reddit / HN Algolia / Bluesky (no auth required), and a browser-driven workflow for LinkedIn and X via `dev-browser` with persistent session. Added `references/listening-sources-template.md` — a copyable starter for `.agents/listening-sources.md` covering brand/category context, ICP definition, target accounts per platform, intent keywords, subreddits, saved-search URLs, and a do-not-engage list. SKILL.md Engagement Strategy section now links to the listening reference.
- Total skills: 44.

### 2.3.0 (2026-05-27)

- Added `marketing-plan` skill — comprehensive AARRR-structured marketing plan generator. Produces a 13-section Notion-paste-ready plan document (executive summary, strategic frame, current state, AARRR breakdown, 90-day roadmap, 12-month outlook with funding-stage capability unlocks, marketing operations stack mapping skills + MCPs to AARRR stages, tactical idea bank cross-referencing all 139 `marketing-ideas` to AARRR + client-specific status, measurement framework, RACI, open decisions). Customized for current budget, team, stage, and tooling stack. Three-phase workflow: INIT (research + intake), REVIEW (section-by-section walkthrough), FINALIZE (compile + verify + optional publish to shared repo). References include methodology, plan-template, aarrr-framework, current-state-rubric (self-contained 17-section scoring rubric), ops-stack-mapping, idea-cross-reference (139-idea AARRR mapping), funding-stage-unlocks, measurement-framework, client-types (variations by B2B SaaS / D2C / hardware-hybrid / marketplace / dev tool / clinical / commerce), example-quietude (anonymized canonical reference plan, based on a real fCMO engagement with names/identifying details changed), budget-planning (two scientific methods for setting the marketing budget — Revenue-Based 5–40% of ARR, and Goal-Based formula reverse-engineered from the revenue target; plus blended CAC calculation, the 10–20% experimental buffer rule, the 3-3-2-2-2 VC growth path, and the forecasting reality check), growth-patterns (the real shape of SaaS growth — $0–10K / $10K–100K / $100K–1M phases with binding constraints, linear vs step-function vs S-curve patterns, and Channel × Product × Market layering), and team-and-agency-model (the strategy-in-house / execution-outsourced principle, three core functions Growth/Product/Content, π-shaped marketer framework, title progression Manager → Lead → Director → VP → Chief, agency selection framework, and the three-stage scaling model Early/Growth/Scale). Budget, growth-pattern, and team frameworks drawn from *Founding Marketing* by Corey Haines.
- Total skills: 43.

### 2.2.0 (2026-05-26)

- Added `prospecting` skill for building qualified prospect lists across SaaS, B2B, and local SMB motions. Includes shared 5-phase framework (ICP → discovery → qualify → score → output) plus branch-specific references (saas-prospecting, b2b-prospecting, local-prospecting), data-sources guide covering Apollo / Clay / ZoomInfo / Clearbit / Hunter / Snov / Truelist / RB2B / Sales Nav / BuiltWith / Crunchbase / GitHub, and compliance reference (CAN-SPAM, GDPR, CASL, platform ToS).
- Added `tools/clis/github-prospects.js` CLI for pulling GitHub stargazers, forkers, and watchers as a developer-intent signal — with pagination, enrichment, filter-based early termination, and CSV output.
- Added new tool integration docs: `truelist` (email deliverability validation, OpenAPI-aligned), `github` (REST API for prospecting), `firecrawl` (single-target page scraping), `browserbase` (real Chromium for JS-heavy pages or interaction).
- **ads** (2.0.0 → 2.0.1): added Google RSA Output Spec section enforcing 15 headlines × 30 chars, 4 descriptions × 90 chars, ad group structure labels, ≥8 negative keywords, ≥4 sitelinks/callouts, output ordering to avoid truncation, and a self-check before responding. Includes optional Brazilian medical (CFM) compliance rules when product context indicates that vertical.
- Added `sequenzy` tool integration (email marketing platform with MCP support).
- Fixed plugin.json version drift (was stuck at 1.9.0 across three releases) — `sync-skills.js` now auto-syncs `plugin.json` version to `marketplace.json` on every change. Closes #323.
- Added skill install artifacts (`.agents/`, `.claude/`, `skills-lock.json`) to `.gitignore`.
- Total skills: 42.

### 2.1.0 (2026-05-21)
- Added `sms` skill for SMS/MMS marketing — welcome flows, abandoned cart, post-purchase, win-back, promotional sends, and transactional/auth. Includes compliance reference (TCPA, A2P 10DLC, GDPR, CASL), sequence templates with character counts, and platform comparison (Klaviyo, Postscript, Attentive, Twilio, Brevo, SimpleTexting, Customer.io).
- Total skills: 41

### 2.0.1 (2026-05-18)

Content patch — no breaking changes, no new skills.

- **ai-seo** (2.0.0 → 2.0.1): aligned with Google's official AI features optimization guide. Added sections for Google's stance on AI optimization, query fan-out, agentic experiences (including UCP), explicit "what NOT to do" (scaled content abuse, etc.), and Search Console expectations. Reframed llms.txt / pricing.md / schema markup recommendations as "Google says not required, helpful for non-Google AI engines." Moved content-type tactics to `references/content-types.md` (added local/ecom Merchant Center + Business Profile guidance per Google).
- **image** (2.0.0 → 2.0.1): refreshed model lineup to current May 2026 releases — Nano Banana / Nano Banana Pro family naming, Flux Pro 1.1 + Kontext + Dev + Schnell variants, Ideogram 3.0, ChatGPT Images 2.0 / GPT Image, Midjourney v7, Recraft V3, SD 3.5 / SDXL. Updated decision tree and trigger phrases.
- **video** (2.0.0 → 2.0.1): refreshed model lineup — Sora 2 promoted from limited-availability caveat, Kling 2.5/3.0, added Seedance (ByteDance), Hailuo / MiniMax (character consistency), Hunyuan Video / Wan 2 (open-weight self-hosted), Pika 2.x. New "Quick picks" guide.

Total skills: 40 (unchanged).

### 2.0.0 (2026-05-05)

**Breaking changes** — Users must reinstall skills after this update.

#### Skill Renames (17)
| Old Name | New Name |
|----------|----------|
| ab-test-setup | ab-testing |
| analytics-tracking | analytics |
| aso-audit | aso |
| competitor-alternatives | competitors |
| email-sequence | emails |
| free-tool-strategy | free-tools |
| launch-strategy | launch |
| onboarding-cro | onboarding |
| paid-ads | ads |
| paywall-upgrade-cro | paywalls |
| popup-cro | popups |
| pricing-strategy | pricing |
| product-marketing-context | product-marketing |
| referral-program | referrals |
| schema-markup | schema |
| signup-flow-cro | signup |
| social-content | social |

#### Consolidations (1)
- `page-cro` + `form-cro` → `cro` (form content moved to `references/form.md`)

#### Why 2.0?
- Shorter, cleaner skill names
- Consistent naming conventions (no more `-strategy`, `-setup`, `-cro` suffixes)
- Consolidated CRO into single skill with references
- All cross-references updated across 100+ files

**Total skills: 40**

### 1.10.0 (2026-05-04)
- Added `co-marketing` skill for partner identification, joint campaigns, and co-marketing strategy
- Total skills: 41

### 2026-04-24
- Added `image` skill for AI image generation, design tools, profile/listing banners, and optimization
- Added `video` skill for AI video production (Hyperframes, HeyGen, Veo, Runway, Kling)
- Added short-form video section to `social` (1.3.0) — TikTok, Reels, Shorts frameworks
- Added HeyGen and Hyperframes tool integration guides
- Fixed plugin marketplace: `source` field now passes Claude Code schema validation (#270)
- Added proper `plugin.json` manifest with `"skills": "./skills"`
- Total skills: 40

### 2026-04-21
- Added `directory-submissions` skill for Product Hunt, G2, AI directories, and backlink strategy
- Added `competitor-profiling` skill for competitive intelligence research
- Added international SEO & localization section to `seo-audit` (1.2.0)
- Added conversion tracking reference to `ads` (cross-platform pixel setup)
- Added Zapier SDK integration for 8,000+ app access
- Fixed plugin loading: removed `./` prefix from marketplace.json skill paths (#243)
- Hardened CLI tools: Supermetrics API key moved to header, ZoomInfo JWT masked by default
- Fixed community-marketing YAML frontmatter (#240)
- Fixed Zapier webhook URL validation (#247)
- Added missing skills to VERSIONS.md (aso, community-marketing, customer-research — shipped in prior releases)
- Total skills: 38

### 2026-03-14
- Added `lead-magnets` skill for lead magnet strategy, format selection, and conversion optimization
- Added Composio integration layer for MCP access to OAuth-heavy tools (HubSpot, Salesforce, Meta Ads, LinkedIn Ads, Google Sheets, Slack, Notion, etc.)
- Added headless CMS integration guides (Sanity, Contentful, Strapi) with headless-cms reference
- Added 197 evals across all 33 skills for automated quality testing
- Optimized all 32 skill descriptions for better trigger phrase matching
- Replaced rigid imperatives with reasoning-based guidance across all skills
- Added 10 new CLI tools (airops, clay, close, coupler, crossbeam, outreach, pendo, similarweb, supermetrics, zoominfo)
- Added 13 new integration guides
- Bumped all 32 existing skills from 1.1.0 → 1.2.0

### 2026-02-27
- Migrated context path from `.claude/` to `.agents/` for agent-agnostic compatibility
- All skills now check `.agents/product-marketing.md` first, with `.claude/` fallback for older setups
- Updated install paths in README to reference `.agents/skills/`
- Bumped all 32 skills from 1.0.0 → 1.1.0

### 2026-02-22
- Added `revops` skill for revenue operations, lead lifecycle, scoring, routing, pipeline management, and CRM automation
- Added `sales-enablement` skill for sales decks, one-pagers, objection handling, demo scripts, and sales playbooks

### 2026-02-21
- Added `site-architecture` skill for website structure planning, page hierarchy, navigation design, URL structure, and internal linking strategy

### 2026-02-18
- Added `ai-seo` skill for AI search optimization (AEO, GEO, LLMO, AI Overviews)
- Moved AEO/GEO content patterns from `seo-audit` references to `ai-seo` skill
- Added `churn-prevention` skill for cancel flows, save offers, dunning, and payment recovery

### 2026-02-17
- Added `ad-creative` skill for bulk ad creative generation and performance-based iteration
- Added 51 zero-dependency CLI tools for marketing platforms (`tools/clis/`)
- Added 31 new integration guides (`tools/integrations/`)
- Added 4 email outreach CLIs: hunter, snov, lemlist, instantly
- Security hardening: header auth for meta-ads, URL encoding, input validation
- All CLIs reviewed via independent codex audit (auth, security, error handling, consistency)

### 2026-01-27
- Initial version tracking added
- Added tools registry with 29 integration guides
