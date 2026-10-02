# Positioning and Consensus in AI Answers

LLMs don't just retrieve pages. They hold an association between your brand and a category, a segment, and a set of strengths and weaknesses, built from everything written about you. This reference covers how to shape that association, and why it moves slowly.

Most of this comes from practitioner experience rather than controlled studies, mainly Harpreet Singh on Edward Sturm's podcast (E1182, "AEO Companies Are Selling You 2016 SEO," Sep 2026). Claims are labeled as anecdote or opinion where that's all they are.

## Contents
- Old SEO, New Name
- Positioning Moves Slowly
- Make Every Profile Say the Same Thing
- Work Backwards from the Fan-Out
- Segment and Industry Pages
- Managing the "Cons" Others Write
- Head Terms Where Incumbents Are Already Chosen
- What Not to Copy

---

## Old SEO, New Name

Much of what gets sold as AEO is traditional SEO: keywords in URLs, FAQs, meta descriptions, solution pages, listicles, press releases. These still work, because strong organic rankings remain one of the best predictors of AI visibility, especially in Google's AI features.

The risk is applying them without the history. Tactics that were tuned for years (how many FAQs, how keyword-stuffed a URL, how many near-duplicate pages) get overused when someone presents them as new, and the result can be a short-term lift followed by lost organic traffic (practitioner opinion; no data cited).

**How to apply:** before recommending a tactic as "for AI," ask whether it's an SEO tactic with a known failure mode, and keep it inside normal SEO limits. Be skeptical of vendor statistics with no source or date.

---

## Positioning Moves Slowly

A brand known for one segment for years doesn't become known for another because its pages change.

- **Repositioning:** a mid-market brand that rewrites its site for enterprise can lose mid-market answers before it earns enterprise ones, and "disappear from LLMs for a while." Enterprise prompts are already associated with incumbents (anecdote, one client).
- **Mergers and rebrands:** an acquired brand often stops appearing for prompts it used to own once its pages fold into the parent (practitioner observation).
- **Local and niche markets too:** for many categories, models have "already picked their winners," and new entrants start behind (opinion).

**How to apply before a repositioning, rebrand, or merger** (a practitioner sequence, not a tested playbook):
1. Record a baseline for the old segment's prompts *and* the target segment's prompts.
2. Watch for a dip and warn stakeholders it may happen. This rests on practitioner reports, not controlled data.
3. Move off-site signals first (profiles, reviews, press, analyst listings, partner pages), then stage the on-site rewrite, rather than switching everything at once.
4. Keep pages that still win old-segment prompts until the new association shows up in tracking.

---

## Make Every Profile Say the Same Thing

Models look for consensus. Your G2, Capterra, Gartner, Crunchbase, LinkedIn, and partner-directory profiles should describe you with the same segment, category, and differentiators as your About page. If you're targeting enterprise, those profiles should say enterprise.

- Fill in free profiles fully (what you do, who it's for, which industries), even on platforms you don't pay for.
- Review text matters as much as profile text. Models read what customers say on those pages.
- This is one of the cheapest changes available: an afternoon of edits across profiles you already have.

Pair with the review-generation playbook in the directory-submissions skill.

---

## Work Backwards from the Fan-Out

Extract the real background queries for your key prompts (the DevTools method in [format-volatility.md](format-volatility.md)), then look at which domains they name.

- If ChatGPT's first fan-out round runs `site:` searches on Gartner, G2, or Capterra for your category, those profiles are your priority, often ahead of publishing another page on your own site.
- The mix differs by category and changes over time, so check your own prompts rather than copying someone else's list. One practitioner saw Gartner rise in finance-software fan-outs and moved review effort from G2 toward Gartner (anecdote).

---

## Segment and Industry Pages

AI answers are increasingly personalized and segment-aware: models place brands into enterprise, mid-market, or SMB, and match them to industries.

- Build pages for the core industries or segments you actually serve ("email marketing for e-commerce," "RFP software for government"), with real specifics for each.
- Start with your core segments. Scale isn't the problem in itself; near-duplicate pages that swap the industry name without adding real value are what Google's scaled-content policy targets. See [content-types.md](content-types.md).

---

## Managing the "Cons" Others Write

Affiliates and review aggregators list a con for every product to look balanced. Find what they say about you.

- If a listed con reinforces a known weakness models already repeat (for example, long implementation), ask the publisher to use a different con that is also true and less central.
- Never ask for negatives to be removed or for false claims. The goal is accuracy, not a clean sheet.

To repair a weakness models repeat, address it in public with specifics: one practitioner's client turned "implementation takes forever" around over 1.5–2 years with founder posts about the process, guides on real timelines, and a concrete "4–8 weeks" on the implementation page (anecdote). See also the "recommended against" section of [citations-vs-recommendations.md](citations-vs-recommendations.md).

---

## Head Terms Where Incumbents Are Already Chosen

For prompts like "best email marketing software," incumbents are in the training data and on every list. Practitioner playbooks (opinion, not tested):

- **Run both formats.** A solution page for the term and a buyer's-guide listicle, since engines currently weight them differently (see [format-volatility.md](format-volatility.md)).
- **Amplify earned third-party proof.** Publish and promote G2 grid placements and analyst mentions; don't just collect them.
- **Occupy several places on the results page.** Your YouTube video, creator coverage, review profiles, and press, not only your own page. Compare Google and Bing results, since different engines draw on different backends.
- **Rank the leader honestly.** In a "best X for Y" guide, it can work better to name the category leader first and show where you go further, than to rank yourself #1 (see the self-promotional listicle risk in [citations-vs-recommendations.md](citations-vs-recommendations.md)).

---

## What Not to Copy

The same episode floats tactics this skill does not recommend:

- **Invented awards or brand-run "review" sites** presented as independent. These are inauthentic mentions, and fake or misleadingly sourced reviews can break the FTC's 2024 rule on consumer reviews and testimonials (16 CFR Part 465).
- **Fast-decaying press-release tricks** (which cheap wire syndicates into which outlets). If you use press releases, check that the destination pages are indexed before paying; outlets change this without notice.
