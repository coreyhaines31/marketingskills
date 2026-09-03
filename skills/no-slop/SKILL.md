---
name: no-slop
description: When prose is about to ship and must not read as AI-generated. Use when the user says "de-slop this," "no slop," "does this read as AI," "make this sound human," "remove the AI tells," "this sounds like ChatGPT," "anti-slop," "kill the AI voice," or wants a pre-delivery quality gate on copy. Run it before handoff on any prose deliverable — copy, emails, ad text, social posts, landing pages. For broad line-editing of existing copy, see copy-editing. For writing from scratch, see copywriting.
metadata:
  version: 1.0.0
---

# No-Slop

You are the last check before prose ships. Your job is to catch the constructions, words, and shortcuts that make writing read as machine-generated, and to fix them without inventing anything.

A tell is not a style nit. Readers now pattern-match AI writing in seconds, and once they do they discount the **claim**, not just the prose. One tell in a headline can lose the argument for a page that was otherwise true. That is why this runs on every prose deliverable before it leaves.

**Run no-slop before delivering any prose** — copy, emails, ad text, social posts, landing pages. It is a pass, not a rewrite: preserve the argument and the brand voice, remove the machine fingerprints.

Voice check first: read `.agents/product-marketing.md` (or `.claude/product-marketing.md`) if it exists. De-slopping never means flattening a real brand voice into the same clipped style everyone else uses — see **The register exception** below.

---

## How to run the pass

1. **Scan for Fatal tells** (below) and remove every one — these are non-negotiable.
2. **Scan for Flag tells** and fix unless the brand voice load-bears them.
3. **Run the two tests** (read-aloud, and the bar test).
4. **Route any unsupportable claim** you find to the copywriting rule (don't invent proof to replace slop) — see **Claims, not slop**.
5. **Report** what you changed by tier, and end with what you couldn't fix without more input (a real number, a customer quote, a voice doc).

Never swap one empty construction for another. If you can't make a line specific, flag it `[NEED: proof/number/example]` rather than dressing up the emptiness.

---

## Severity tiers

The upgrade over a flat checklist: not every tell is equal, so fix by priority.

| Tier | Meaning | Action |
|------|---------|--------|
| **Fatal** | Instantly reads as AI; discredits the claim | Remove every instance, always |
| **Flag** | Reads as AI in aggregate; fine once, damning as a pattern | Fix unless the brand voice genuinely needs it |
| **Context** | Only slop when empty (formal register, long sentences) | Judge against brand voice, not against formality |

---

## Fatal tells (remove on sight)

1. **"Not just X — but Y."** The single most recognizable AI construction. Variants: "It's not about X, it's about Y." Rewrite as a flat statement of Y.
   - ✗ It's not just a CRM, it's a growth engine.
   - ✓ It closes the loop between the ad click and the signed contract.
2. **Claims with no referent.** "Industry-leading," "best-in-class," "world-class," "cutting-edge," "next-level," "game-changing," "revolutionary." They say nothing and signal nothing specific was available. Delete or replace with the specific fact.
3. **Emoji as structure.** 🚀 ✨ 💡 leading bullets or headers. Fine in Slack, fatal in shipped copy.
4. **Invented proof.** A statistic, testimonial, customer name, or "up to X%" with no source. Never generate it — mark `[NEED: x]`.
5. **The em-dash summary clause as a habit.** One deliberate em-dash is style; the reflexive "— and that's what makes the difference" close is a signature tell. (House style here also avoids the decorative em-dash entirely; prefer a period or a colon.)

---

## Flag tells (fix unless load-bearing)

6. **Reflexive tricolon.** Three-item lists as the default rhythm ("faster, smarter, more reliable"). Fine once; a tell as a pattern. Replace with one specific claim.
7. **Metronomic sentence length.** Every sentence 12–18 words. Human writing varies violently. Break it: a three-word sentence, then a long one.
8. **Question-then-answer opening.** "What if there were a better way? There is." Cut the question, state the thing.
9. **The reassuring close.** Ending on a line that restates without adding ("and that's the difference").
10. **Symmetrical paragraphs.** Every block the same length. Vary deliberately.
11. **Hedged claims that should be flat.** "Can help you potentially reduce costs by up to 30%." Every hedge is a small confession; stack four and the reader believes none. → "Cuts fulfillment cost 31% at [customer]."
12. **Benefits with no mechanism.** "Save time" is a wish. "Save time by auto-matching invoices to POs" is a claim.
13. **Discourse glue.** "Moreover," "furthermore," "additionally," "that said," "it's worth noting." Usually deletable with no loss.

Exhaustive word and phrase lists (the delve/leverage/seamless/transform families) live in [references/lexical-tells.md](references/lexical-tells.md). Load it when doing a full lexical sweep.

---

## Marketing-channel slop

Generic copy checklists stop at prose. These are the tells specific to the surfaces this library writes for.

- **CTA slop.** "Get started today," "Take your X to the next level," "Unlock your potential," "Join thousands of." Replace with the specific next action and its payoff. → "See your unmatched invoices in 2 minutes."
- **Subject-line slop** (→ **emails**). Curiosity-gap bait with no substance ("You won't believe this…"), false "Re:"/"Fwd:", one-word hype ("🔥 Big news"). The subject should survive being read as the whole message.
- **Hook slop** (→ **ad-creative**). "POV:", "Stop scrolling," "Here's the thing nobody tells you," recycled trend audio with no relevance. A hook earns the next second by being specific to the viewer's state, not by generic pattern-interrupt.
- **Broetry / engagement bait** (→ **social**). One-line-per-paragraph LinkedIn cadence, "Agree?" closers, manufactured vulnerability, "Let that sink in." Say the substance a person would say out loud.
- **Persona by demographic, not state.** "For SMBs" tells the reader nothing about whether it's for them. "For teams still approving invoices in email" does.
- **Vanity-metric reporting slop** (→ **analytics**). Declaring a winner on ten conversions, quoting a rate without its denominator or window, a dashboard screenshot as "insight." A number without its comparison is decoration.
- **Both-sidesing.** Copy that carefully weighs pros and cons to sound balanced reads as generated. Take a position.

---

## The two tests

Faster than any checklist, and they catch what checklists miss.

1. **Read it aloud.** Every time you stumble, stall, or hear a press release, mark that sentence. This catches rhythm problems nothing else does.
2. **The bar test.** Would a person say this substance to another person at a bar? Not the register — the *substance*. If it would embarrass someone said out loud, it's not a claim, it's filler.

---

## Claims, not slop

Slop and unsupported claims travel together, and the fix for both is specificity, not decoration. When de-slopping surfaces a claim the source can't support, do not paper over it with a punchier empty line. Hand it to the **copywriting** rule: name the claim, offer the closest supportable version, and state the evidence that would unlock the original (a review export, a written guarantee, a citable dataset). A de-slop pass that invents a number to replace a cliché has made the copy worse, not better.

---

## What good sounds like

Specific. Uneven in rhythm. Willing to be blunt. Contains at least one fact that could be checked and disproved.

> Most invoice tools promise automation and then hand you a queue to approve manually. Ours matches the PO, checks the total, and escalates only the ones that don't reconcile. Last quarter that was 6% of them.

Three sentences. One number. One admission it doesn't handle everything. Not a word from the lexical tables.

---

## The register exception

Some brands genuinely speak in a polished, formal register — enterprise security, regulated finance, medical. **Register is not slop.** The test is never formality, it is *emptiness*: a formal sentence making a specific, falsifiable claim is fine; a casual sentence that says nothing is not. Check `.agents/product-marketing.md` for the intended voice before flattening it, and watch for the opposite failure — over-correcting every client into the same clipped, punchy style is its own tell.

---

## Related Skills

- **copywriting**: Writing prose from scratch, including website and landing-page copy (run no-slop before handoff)
- **copy-editing**: Broad line-editing and refresh of existing copy (no-slop is its AI-tell pass)
- **emails**, **social**, **ad-creative**, **cold-email**, **sms**: Channel prose that runs no-slop before delivery
- **product-marketing**: The product voice and positioning context (`.agents/product-marketing.md`) no-slop must preserve, not flatten
