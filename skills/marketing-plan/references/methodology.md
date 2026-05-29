# Methodology — How a Marketing Plan Gets Made

The three-phase workflow that produces a comprehensive marketing plan. SKILL.md is the orchestration layer; this is the operational detail.

## Phase 1 — INIT (research + intake)

**Goal:** Walk into Phase 2 with enough context to draft every section without guessing.

### Step 1.1 — Set up the plan folder

Canonical file layout for every plan:

```
~/marketing-plans/{client-slug}/
├── materials/         # Client-provided files (decks, audit output, brand-voice doc, etc.)
├── research.md        # Written in Phase 1 (INIT)
├── progress.md        # State machine — see Step 1.1.1 for schema
├── sections/
│   ├── 01.md          # Executive summary (written last, ordered first)
│   ├── 02.md          # Strategic frame
│   ├── ...
│   └── 13.md          # Measurement, RACI, open decisions, appendix
└── final_plan.md      # Compiled deliverable (Phase 3 output)
```

### Step 1.1.1 — `progress.md` state schema

Every plan tracks a single `progress.md` file at the plan root. It's the source of truth for resumption. Schema:

```markdown
# {Client} — Marketing Plan Progress

phase: init | review | finalize | finalized
current_section: <number, only meaningful during review phase>
plan_version: v1
last_updated: YYYY-MM-DD HH:MM

## Sections completed
- [ ] 2. Strategic frame
- [ ] 3. Current state
- [ ] 4. Acquisition
- [ ] 5. Activation
- [ ] 6. Retention
- [ ] 7. Referral
- [ ] 8. Revenue
- [ ] 9. 90-day roadmap
- [ ] 10. 12-month outlook
- [ ] 11. Marketing operations stack
- [ ] 12. Tactical idea bank
- [ ] 13. Measurement, RACI, open decisions, appendix
- [ ] 1. Executive summary (synthesized last)

## Approved artifacts
sections/02.md, sections/03.md, ... (list as they're written)

## Notes
<any open decisions, blockers, or out-of-band context that aren't in research.md>
```

### Step 1.1.2 — Resumption decision tree

On every invocation, check state in this order:

1. **No `{client-slug}/` folder** → fresh plan. Create folder + `materials/` + empty `sections/`. Start INIT (Step 1.2).
2. **Folder exists, no `research.md`** → INIT was interrupted. Resume from Step 1.2.
3. **`research.md` exists, no `progress.md`** → INIT done, REVIEW not started. Create `progress.md`, start REVIEW from Section 2.
4. **`progress.md` exists, `phase: review`** → REVIEW in progress. Resume from `current_section` (or first unchecked box).
5. **`progress.md` exists, `phase: finalize`** → FINALIZE was interrupted. Re-run Phase 3.
6. **`progress.md` exists, `phase: finalized`** → plan is done. **Do not silently overwrite.** Ask the user: *"This plan is finalized (v{N}). Want to (a) revise it as v{N+1}, (b) start a fresh plan in a new folder, or (c) re-open a specific section?"*

Update `phase` and `last_updated` whenever state changes.

### Step 1.2 — Read existing materials

If `materials/` has files, read all of them. Common drops:
- Pitch deck / investor deck
- Positioning doc / brand voice doc
- Customer research / ICP doc
- App Store metrics / analytics snapshot
- Lifecycle email inventory
- Prior audit output (any scored current-state assessment the team has run)
- SEO research (`seo/plan.md`, `seo/keyword-shortlist.md`)
- Kickoff call transcript
- Founder Slack / async notes

Read everything. Capture key facts to `research.md` as you go.

### Step 1.3 — Pull live data where wired

If MCPs/APIs are wired for this client, pull:

- **Ahrefs** → domain rating, organic keywords, backlinks, top pages, ref domains (per `/seo-audit` skill)
- **GA4 MCP** → traffic by channel, conversion events, retention curves
- **Stripe MCP** → MRR, ARR, churn, plan mix, blended LTV by cohort
- **App Store Connect** (manual or `dev-browser`) → install → trial → paid funnel; cohort retention
- **Customer.io MCP** → flow inventory, send / open / click / unsubscribe rates
- **Shopify** → product page conversion, AOV, repeat rate
- **GitHub MCP** → repos inventory, last commit dates, what's stale
- **Notion** → internal knowledge directory if exposed

Don't ask the user to copy/paste data that can be pulled directly.

### Step 1.4 — Conduct structured intake

For every gap in the materials, ask the user. The minimum intake covers ten topics:

#### Intake 1 — Client overview
- What does the company do, in one sentence (founder's words)?
- What's the primary product?
- What other products / SKUs / tiers exist?
- Is the product live, beta, or pre-launch?
- If beta: throttling? GA timeline?

#### Intake 2 — ICP
- Who are you for, in one sentence?
- What do they say they want?
- What do they actually want?
- What's their stated problem? Their real problem?
- Demographics / firmographics: who fits the ICP exactly?

#### Intake 3 — Funnel state today
- What are the current funnel numbers? (signups, activations, paid, retention)
- What's the funnel *shape* — is it bottle-necked at top, middle, or bottom?
- What's the biggest leak?

#### Intake 4 — Funding state
- Current round (pre-seed / seed / Series A / etc.)?
- Total raised to date?
- Current burn / runway?
- Active raise? Closing when?
- Investors of note?
- Permission to mention fCMO engagement in pitches?

#### Intake 5 — Team
- Founders and what each owns (product, marketing, sales, etc.)?
- Other roles on the team and their marketing surface area?
- Advisors who touch marketing?
- Agencies / contractors / fractionals?
- Where are the obvious gaps?

#### Intake 6 — Budget
- Current monthly marketing spend, broken down: paid acquisition, tools, retainers, headcount?
- Budget tier this maps to (see `funding-stage-unlocks.md`)?
- What budget unlocks when the next round closes?

#### Intake 7 — Channels currently active
- Acquisition: organic SEO, paid search, paid social, content, social, partnerships, events, PR, ambassadors, etc. — for each, status (live / paused / never tried)
- Activation: onboarding state, signup flow, paywall, first-session experience, app store listing
- Retention: lifecycle email state, in-app upsells, churn cohort
- Referral: program existence, attribution, inbound interest
- Revenue: pricing structure, plan mix, recent experiments

#### Intake 8 — Already done
What past work should this plan acknowledge?
- Major launches and dates
- PR moments and who covered
- Content pillars / hubs / cornerstone pieces
- Partnerships
- Awards / certifications
- Notable customers / users (if consumer-named users)
- Past advisors / fractionals

#### Intake 9 — In-flight and stuck
- What's drafted but not shipped? Why?
- What's been "almost ready" for months?
- What's blocking each?
- What's broken or actively harmful?

#### Intake 10 — Strategic posture
- The most important thing to fix this quarter (founder's read)
- The most important thing to ignore this quarter (founder's read)
- What investors / board are asking about most
- Any constraints not visible elsewhere (legal, partnership-related, brand-related)

### Step 1.5 — Score current state against the rubric

Use the 17-section rubric in `references/current-state-rubric.md` as your scoring lens. Two modes:

- **From rich materials.** When the team has shared decks, prior content audits, an existing brand voice doc, recent positioning work, or a kickoff call transcript — score from those. Mark "scored from materials" in the section heading.
- **From a separately scored audit.** If the team already has a scored current-state assessment (in any format), ingest those numbers directly. Don't redo the work.

Either way, the output is the scored 17-row table that becomes Section 3 of the plan, followed by a 2–4 sentence "shape interpretation" calling out where strengths and gaps cluster.

### Step 1.6 — Write research.md

Compile everything into `research.md` with this structure:

```markdown
# {Client} — Marketing Plan Research Record

**Date:** YYYY-MM-DD
**Author:** (fCMO / planner name)

## Company snapshot
- One-sentence description
- Stage (pre-seed / seed / Series A / etc.)
- Product status (beta / GA)

## ICP
- Primary ICP
- Stated vs. actual problem
- Demographics / firmographics

## Funnel state today
- Current numbers
- Funnel shape
- Biggest leak

## Funding
- Total raised
- Current round status
- Runway

## Team
- Founders and ownership
- Marketing surface area by person
- Gaps

## Current marketing budget
- $/mo total
- Breakdown
- Tier mapping

## Channels currently active
[By AARRR stage]

## Already done (acknowledge in plan)
[List]

## In-flight and stuck
[List with blockers]

## Strategic posture
- Founder's top priority
- Founder's top de-prioritization
- Investor pressure points
- Constraints

## Current-state rubric scores
[17 section scores using `references/current-state-rubric.md`. If a prior scored audit exists, paste those scores. Otherwise mark "scored from materials."]

## Materials read
[List of files in materials/ + when read]
```

Save. Move to Phase 2.

---

## Phase 2 — REVIEW (section-by-section drafting)

**Goal:** Walk through all 13 sections of the plan template (`references/plan-template.md`), drafting each, getting user confirmation, saving as you go.

### Step 2.1 — Initialize progress.md

Use the schema defined in Step 1.1.1 above. Set `phase: review`, `current_section: 2`, `plan_version: v1`, and stamp `last_updated`.

### Step 2.2 — Walk each section in this order: 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, then 1

Section 1 (Executive Summary) is drafted **last** because it depends on every other section's conclusions. Walk Sections 2 → 13 in numeric order, then synthesize Section 1 from the others. The final compiled `final_plan.md` is always presented in canonical order 1 → 13.

For each section, use the template at `references/plan-template.md` to draft. Then in chat:

1. Present the draft (or key bullets — short sections inline, long sections as bullet outline first)
2. Ask: *"Approve, adjust, or expand?"*
3. Iterate until user confirms
4. Save the confirmed text to `sections/01.md` ... `sections/13.md` (one file per section, zero-padded for sort order). This is the canonical persisted artifact — recovery depends on it.
5. Check the box in `progress.md`
6. Move to next section

### Step 2.3 — Section-specific guidance

**Section 1 (Executive summary)** is synthesized from Sections 2–13 after they're all approved. Draft it last; present it first in the output document.

**Section 3 (Current state)** uses the embedded 17-section rubric in `references/current-state-rubric.md`. If a prior scored audit exists, paste those scores in. If not, score from available materials.

**Sections 4–8 (AARRR)** each follow the same internal structure: current state, the plan (numbered moves), 90-day moves, 12-month outlook, skills + tools. Don't skip the skills + tools sub-section — it's what makes the plan operationally honest.

**Section 11 (Marketing operations stack)** is auto-generatable from `references/ops-stack-mapping.md` plus the specific moves named in Sections 4–8.

**Section 12 (Idea bank)** is auto-generatable from `references/idea-cross-reference.md` plus client-specific filters (skip ideas that conflict with brand voice; status moves based on funding-stage timing).

**Section 13** lives at the end. Open decisions should be ranked by impact. Appendix should reference only files the team can access (warn about machine-local paths).

### Step 2.4 — Brand voice consistency

If the client has documented brand voice rules (captured in research.md / Section 2), every section must respect them. Common voice constraints:
- Vocabulary rules (YES / NO lists)
- CTA rules (e.g., "never pressure")
- Initiatory vs. explanatory framing
- Tone (e.g., authoritative-yet-accessible, intimate-yet-professional)

If a section's draft violates the brand voice, redo it before showing it to the user.

---

## Phase 3 — FINALIZE (compile + verify + publish)

**Goal:** Produce `final_plan.md` and optionally publish to a shared repo.

### Step 3.1 — Compile

Set `phase: finalize` in `progress.md` before starting. Concatenate `sections/01.md` through `sections/13.md` into `final_plan.md` (canonical order 1 → 13, regardless of drafting order). Add:
- Title header with date and "v1" version marker
- "Prepared by / For / Date / Status" frontmatter
- Section anchors that work in Notion paste

### Step 3.2 — Verification pass

Before printing:

- **Cross-reference check** — every marketing-ideas number (e.g., "idea #17") matches the actual idea in `references/idea-cross-reference.md`. Every related-skill mention either exists in the `marketingskills` repo or is documented as an external dependency (see ops-stack-mapping note on cross-marketplace skills).
- **MCP/API check** — every tool mentioned in Section 11 actually exists in the user's stack (per research.md intake) OR is flagged as "future / not yet wired."
- **Path check** — no machine-specific paths (`/Users/...`, `/home/...`) in the output. Replace with descriptive references.
- **Voice check** — final read against brand voice rules. Flag and fix violations.
- **Open-decisions check** — every "TBD" or unanswered question from intake is listed in Section 13's open decisions, not hidden in the body.
- **Acknowledge check** — every item from "already done" in research.md is acknowledged somewhere in the plan.

### Step 3.3 — Print

Output `final_plan.md` to the plan folder. Print a summary to chat:

> *"Marketing Plan v1 saved to `~/marketing-plans/{client-slug}/final_plan.md`. ~X,XXX words across 13 sections. Ready to paste into Notion or share with the team."*

### Step 3.4 — Publish (optional)

Ask the user:
> *"Want me to publish this to a shared GitHub repo so the team can access it? If yes, what's the target repo and path (e.g., `{client-org}/{client-context}/marketing/plan.md`)?"*

If yes:
- Clone (or assume cloned) target repo
- Check out a feature branch or push direct to main per user's preference
- Copy `final_plan.md` to the target path
- Adjust the appendix to use repo-relative paths (not machine paths)
- Commit + push
- Confirm with commit URL

If no: leave it local. Done.

### Step 3.5 — Mark finalized

Set `phase: finalized` in `progress.md` and stamp `last_updated`. This is the terminal state and prevents future `/marketing-plan` invocations from silently overwriting the plan (see Step 1.1.2 case 6).

---

## Resuming a plan

Resumption is governed entirely by the decision tree in Step 1.1.2 above — always check state in that order on every invocation.

If the user says *"start over"* → ask whether they want to delete the existing folder or move it to `archive/` first; don't silently overwrite.
If the user says *"redo Section X"* → uncheck that box in `progress.md`, delete `sections/0X.md`, and re-draft.

## Failure modes to watch for

- **Skipping intake.** A plan written without proper intake is generic and won't survive contact with the founder. Always do the full ten-topic intake unless the user explicitly waives it.
- **Pretending data exists.** If you can't confirm a number (current MRR, retention rate, etc.), don't guess. Mark it `[TBD — to confirm with team]` in the plan and add to open decisions.
- **Ignoring the brand voice.** If the client has a strong voice (most do), every section must respect it. Read the voice rules before drafting any copy-adjacent text.
- **Padding the idea bank.** Section 12 is comprehensive only if it includes the skip list with reasons. Don't pad with ideas that clearly don't fit just to hit the 139.
- **Glossing over uncomfortable metrics.** If churn is high or activation is low, name it in Current State. Founders read past sugar-coating.
- **Forgetting funding-stage logic.** If the client is mid-raise, the plan must explain what changes when the round closes. Skipping this turns a plan into a wish-list.
