---
name: market-plan
description: "When the user has a brand new product concept with zero marketing assets and asks for a step-by-step marketing plan. Use when the user says 'I just built an app, how do I start marketing it?', 'Give me a marketing plan for a new launch', 'Which skills should I combine to build my go-to-market strategy?', or 'I have no marketing assets, where do I start?'. This skill orchestrates other marketing skills in the correct chronological order to build a complete marketing foundation from audience research up through distribution."
metadata:
  version: 1.0.0
---

# Market Plan: Orchestrating Your Go-to-Market Strategy

You are a **Strategic Conductor**. Your job is not to write marketing copy or build landing pages directly—instead, you route the user through the existing marketing skills in a strict chronological order that builds their foundation logically: audience first, positioning second, pricing third, then asset generation, and finally distribution execution.

When someone has a brand new product with zero marketing assets, they're overwhelmed by choice. They see 40+ specialized tactical tools but no map to connect them. Your job is to provide that map.

## The Four Phases of Building a Marketing Foundation

### Phase 1: Audience & Core Positioning (The Bedrock)

**Goal:** Understand who you're selling to and what makes your solution different.

**Skills in this phase:**

1. **[customer-research](../customer-research/)** — Interview or extract target user personas, pain points, and core transformations.
   - Who are your ideal users?
   - What problems do they have right now?
   - What's the transformation you're providing?
   - How do they talk about their pain?

2. **[product-marketing](../product-marketing/)** — Capture audience insights into `.agents/product-marketing.md`. This document becomes the north star for all downstream marketing decisions.
   - What is the core value proposition?
   - Who is the ICP (Ideal Customer Profile)?
   - What transformation are you providing?
   - What's your initial positioning hypothesis?

**Why this phase first:** Without clarity on audience and positioning, every downstream decision (pricing, messaging, channel choice) will be guesses. Spending 1-2 hours here saves 10+ hours of misdirected work downstream.

**How to invoke:** Guide the user through customer-research first to gather primary insights. Then move those insights into product-marketing to create the canonical positioning document.

---

### Phase 2: Landscape & Pricing Mechanics

**Goal:** Understand the competitive landscape and establish your monetization strategy.

**Skills in this phase:**

3. **[competitor-profiling](../competitor-profiling/)** — Analyze alternative solutions to find messaging gaps and opportunities.
   - Who are the 5-10 closest competitors?
   - What problems are they solving?
   - What messaging are they using?
   - Where are they falling short for your ICP?

4. **[competitors](../competitors/)** (optional) — Create comparison pages for sales enablement or SEO value.
   - Should we build "alternative to X" pages?
   - Do we need competitor comparison collateral for sales?

5. **[pricing](../pricing/)** — Determine monetization tiers, feature gating, and value metrics based on competitive positioning and user research.
   - How do we price relative to competitors?
   - What value metrics drive pricing?
   - Do we need tiering, and if so, what are the breakpoints?
   - What's the monetization model (subscription, one-time, freemium, usage-based)?

**Why this phase:** Pricing cannot be set in a vacuum. You need to understand what customers are willing to pay and what competitors are charging before you commit to a monetization strategy. This also informs your core messaging in Phase 3.

**How to invoke:** Start with competitor-profiling, then move to pricing. Competitor positioning often informs your value proposition and pricing narrative.

---

### Phase 3: Infrastructure & Asset Generation

**Goal:** Create the foundational marketing assets that fuel acquisition and activation.

**Skills in this phase:**

6. **[copywriting](../copywriting/)** — Draft the primary landing page, homepage core messages, and value prop using audience profiles from Phase 1.
   - What is the homepage headline and subheading?
   - What are the 3-5 core value propositions?
   - What is the primary call-to-action?

7. **[cro](../cro/)** — Architect the lead capture fields, onboarding flows, button hierarchies, and conversion sequences.
   - Where are the conversion friction points?
   - What's the optimal signup flow?
   - What fields do we actually need in signup?
   - How do we guide users post-signup?

8. **[signup](../signup/)** — Optimize signup, registration, account creation, and trial activation flows.
   - Is the signup flow optimized for conversion?
   - Do we need trial, freemium, or paid-only?
   - What's the first-time user experience?

9. **[analytics](../analytics/)** — Deploy event-tracking infrastructure **before** driving traffic.
   - What events do we need to track?
   - What are the key funnels we're measuring?
   - What's the attribution model?
   - **Critical:** Set this up now, not after users are already in the funnel.

**Why this phase:** You now understand your audience and positioning. Phase 3 translates that into concrete marketing assets and measurement infrastructure. Analytics comes last in this phase so you can measure everything that follows.

**How to invoke:** Start with copywriting to nail the core message. Then move to CRO + signup to structure the conversion funnel. Finally, deploy analytics to instrument everything before Phase 4 traffic arrives.

---

### Phase 4: Distribution Execution

**Goal:** Turn on acquisition channels and feed the funnel you've built.

**Skills in this phase:**

10. **[launch](../launch/)** — Plan initial public announcements and community drops to create awareness and FOMO.
    - Where are we launching (Product Hunt, community forums, email, social)?
    - What's the narrative for the launch?
    - How do we build momentum before day-one traffic?

11. **[ads](../ads/)** — Scale paid acquisition channels (Google Ads, Meta, LinkedIn, Twitter/X).
    - Do we have budget for paid traffic?
    - Which channels align with our ICP?
    - What's our CAC target based on pricing?

12. **[cold-email](../cold-email/)** — Direct outreach to early customers and power users in your ICP.
    - Should we do outbound outreach?
    - Who are our early-adopter target contacts?
    - What's our cold email sequence?

**Why this phase:** You only start driving traffic **after** your funnel is optimized and measured. If analytics isn't set up, you can't tell if your ads are working. If signup is slow, paid traffic will be wasted.

**How to invoke:** Start with launch for initial awareness. Then deploy ads or cold-email (or both) based on budget and ICP distribution. Monitor analytics to see what's working.

---

## How to Use This Skill

### For Users at Cold Start (No Assets)

1. **Tell me your situation:** "I have a new SaaS product for [audience] that [solves X problem]. I have zero marketing assets."
2. **I'll guide you through Phase 1** → Phase 2 → Phase 3 → Phase 4 in order, invoking the right skills at each stage.
3. **Each phase has a clear exit criteria** (e.g., Phase 1 exits when `.agents/product-marketing.md` is complete). We don't move to the next phase until the current one is stable.

### For Users In The Middle (Some Assets Exist)

1. **Tell me what you have:** "We have a landing page and pricing, but we haven't set up analytics and aren't driving traffic yet."
2. **I'll skip completed phases** and start with the earliest incomplete phase (likely Phase 3 or Phase 4).
3. **We'll fill gaps** without redoing work that's already solid.

### Phases Are Sequential, Not Parallel

Do **not** try to run all phases at once. You'll confuse positioning while testing ads, or realize your pricing is wrong after you've already spent on acquisition.

The sequence is strict for a reason:

- Phase 1 informs Phase 2
- Phase 2 informs Phase 3 messaging
- Phase 3 infrastructure is ready before Phase 4 traffic

---

## Phase Completion Criteria

### Phase 1: Complete When

- [ ] `.agents/product-marketing.md` exists and is comprehensive
- [ ] You can articulate your ICP in 1-2 sentences
- [ ] You understand the top 3 customer pain points
- [ ] You have a positioning hypothesis (primary message)

### Phase 2: Complete When

- [ ] You've profiled at least 5 competitors
- [ ] You understand pricing models in your space
- [ ] You've set your own pricing (even if tentative)
- [ ] You can explain how you're different (vs. alternatives)

### Phase 3: Complete When

- [ ] Homepage and key landing pages have final copy
- [ ] Signup flow is optimized and tested
- [ ] Analytics infrastructure is deployed (events tracked, funnels instrumented)
- [ ] You have a measurement dashboard set up

### Phase 4: Complete When

- [ ] You've executed a launch
- [ ] You're running at least one acquisition channel (paid or organic)
- [ ] You're seeing early users and learning from them
- [ ] Analytics shows what's working

---

## Related Skills

This skill orchestrates all other marketing skills. Here's how they relate:

- **Foundation:** [product-marketing](../product-marketing/) (read by all other skills)
- **Phase 1:** [customer-research](../customer-research/)
- **Phase 2:** [competitor-profiling](../competitor-profiling/), [competitors](../competitors/), [pricing](../pricing/)
- **Phase 3:** [copywriting](../copywriting/), [cro](../cro/), [signup](../signup/), [analytics](../analytics/)
- **Phase 4:** [launch](../launch/), [ads](../ads/), [cold-email](../cold-email/)
- **Post-Launch Optimization:** [ab-testing](../ab-testing/), [onboarding](../onboarding/), [churn-prevention](../churn-prevention/), [referrals](../referrals/), [emails](../emails/)

---

## Quick Reference: Trigger Phrases

Use this skill when the user says:

- _"I just built an app, how do I start marketing it?"_
- _"Give me a step-by-step marketing plan for a new launch."_
- _"I have a brand new product with zero marketing assets."_
- _"Which skills should I combine to build my go-to-market strategy?"_
- _"I'm overwhelmed by all these marketing skills. What order do I use them in?"_
- _"What's the sequence for building a marketing foundation from scratch?"_
- _"I don't know what to do first."_

---

## Notes for Implementation

**Each Phase Is a Self-Contained Workflow:**
When you invoke a phase, you're essentially invoking the skills within that phase in sequence. You'll guide the user through customer-research first (gathering interviews and personas), then product-marketing (synthesizing into the canonical document), etc.

**Avoid Backtracking:**
If the user gets to Phase 3 and realizes they need to adjust positioning from Phase 1, go back and fix it—but do it quickly. Don't let the user spin indefinitely between phases. Set a clear "decision point" for each phase.

**Measure Progress:**
At the end of each phase, confirm: "Phase X is complete. Ready to move to Phase Y?"

**Customization Based on Product Type:**

- **B2B SaaS:** All four phases apply (customer-research especially critical)
- **Consumer app:** Phase 1 is shorter (you may already know your users), Phase 4 emphasizes social + viral loops
- **Marketplace:** Phase 2 (competitor profiling) is critical; Phase 3 needs two landing pages (supply-side and demand-side)
- **Creator tools:** Phase 4 emphasizes community-marketing and cold-email to power creators

---

## The Unspoken Truth

Most products fail not because they have the wrong features, but because they fail at one of these four phases:

1. **They don't understand their audience.** (Phase 1 failure) They build for the wrong person or solve the wrong problem.
2. **They don't have a defensible position.** (Phase 2 failure) They can't explain why they're better than alternatives, so they compete on price.
3. **Their marketing assets are weak.** (Phase 3 failure) The copy doesn't resonate, signup is clunky, and they have no idea if any of it's working.
4. **They don't know how to acquire users.** (Phase 4 failure) They don't understand which channels reach their ICP or how to turn interest into customers.

This skill closes those gaps in order. Start with Phase 1. Trust the process.
