# Judge: CTAs

Grades whether a call-to-action — a button label or a CTA line — makes the next step clear, valuable, and low-friction, on **text alone**, as PASS or FAIL.

**Provenance:** Seed judge — the example inputs below are a starter corpus and the verdicts are AI-drafted, awaiting human labeling by **Corey Haines**, the framework's human calibrator (the role Alysha plays for `ad-hooks`). No agreement number is published until that labeling pass is complete — see the labeling note in `../../METHODOLOGY.md`. The rubric below is the seed artifact — refine it through the calibration loop (see `../../METHODOLOGY.md`).

To use it standalone: paste everything below the line into any AI, then hand it your CTAs. The harness strips this header and sends only the rubric.

---

You evaluate call-to-action copy — button labels and CTA lines — for whether the click feels clear, worth it, and safe, based on TEXT ALONE. Classify as PASS or FAIL.

The job of a CTA is to make the next step obvious. A reader glancing at it should know **what happens when they click**, **why it's worth doing**, and **that it won't cost them more than they're ready to give**. Context matters — the same words work differently under a pricing table than in a nav bar — but you grade the copy's *inherent* clarity and value, not the page it might sit on.

## What makes a PASS

A PASS CTA does at least the first of these, and doesn't trip any failure below:

1. **Names a clear action or outcome** — the reader knows what clicking does or what they get. "Download the template," "Book a demo," "Get my results" all point somewhere specific.
2. **Ties to the value the reader receives** — the strongest CTAs answer "what's in it for me?" right in the label. "Get my free audit" beats "Submit." "Start saving on payroll" beats "Get started." First-person or benefit framing ("Show me my plan," "Claim my 20% off") often does this well.
3. **Keeps perceived friction low** — the commitment implied matches where the reader is. A low-stakes verb ("See pricing," "Try it free," "Explore plans") is safer than a high-commitment one ("Buy now," "Purchase") when trust hasn't been earned yet. Reassurance that lowers friction ("Start free — no card needed") is a plus.

The click should feel **worth it and safe**. A PASS doesn't need all three — a plain-but-clear action verb tied to an obvious outcome can pass — but it must not read as generic, value-less, vague, or higher-commitment than the words justify.

## Clear FAILs — the failure taxonomy

Most weak CTAs die one of these deaths. This is the bulk of the judgment.

- **Generic / mechanical** — system-default labels with no meaning attached. "Submit," "Click here," "Continue," "Next," "OK," "Enter" — these describe a form mechanic, not a reason to act. "Learn more" with no object is the canonical offender: learn more about *what*?
- **Value-less action** — a real verb but no reason to do it. "Sign up," "Register," "Create account," "Subscribe" state the mechanic of committing without a single word on what the reader gets for it. The action is clear; the *why* is missing.
- **Vague outcome** — the words sound active but the reader can't picture what they'll actually get. "Get started" is the archetype — started with *what*, and then what? "Explore," "Discover," "Find out" without a concrete object leave the outcome fuzzy.
- **High-commitment too early** — the copy asks for more than the reader is ready to give. "Buy now," "Purchase," "Pay $99," "Start your 14-day free trial" (which foregrounds the trial-ending clock and the card entry) all *sound* like a big step. If nothing has lowered the stakes, the commitment framing outweighs the value and the reader hesitates. (The same words can pass with friction-reducing context — but on text alone, unmitigated high-commitment framing fails.)
- **Clever-but-unclear** — a pun, metaphor, or branded phrase where cleverness buried the action. "Let's ride," "Unlock the magic," "Join the movement," "Take the leap" — the reader has to decode what actually happens. Cleverness that still names the action can pass; cleverness that replaces it fails.
- **Mismatched to intent** — the ask doesn't fit the moment the label implies. A hard "Talk to sales" on what reads like a top-of-funnel content offer, or "Buy now" where the reader clearly hasn't decided, creates a jarring jump. The step is clear but wrong-sized for the intent.
- **Over-long / stuffed** — the CTA tries to say everything and becomes a sentence no one reads on a button. "Click here to sign up now for our completely free 30-day trial with full access to every feature" buries the action in qualifiers. A CTA line can be a full sentence, but it must still land one clear ask.
- **Passive or weak verb** — "Get access" (to what?), "Find out more," "Read on" — low-energy phrasing that neither names value nor implies momentum.
- **False or inflated urgency** — "Act now or miss out!" / "Last chance!" with no real scarcity reads as manipulative and *raises* perceived risk rather than lowering friction.

## Decision

Ask these in order:

1. **Can a stranger tell what clicking does** — is there a clear action or outcome, not just a form mechanic ("Submit," "Continue")?
2. **Does it answer "why should I click?"** — is the value the reader gets present or obvious, or is it a value-less "Sign up"?
3. **Is the outcome concrete**, or is it vague ("Get started," "Explore") where the reader can't picture the result?
4. **Does the commitment implied match a cold reader's readiness** — or does it sound higher-friction ("Buy now," "Start your free trial") than the words earn?
5. **Is it clear over clever, and tight enough to read at a glance?**

For a PASS: #1 is YES, #2 is YES or clearly implied by the action, and #3–#5 are all clear. Any generic, value-less, vague, over-committing, clever-but-unclear, mismatched, or bloated label → FAIL.

- Clear action tied to real value, right-sized commitment → PASS
- Clear, specific action with an obvious outcome, even if plain → PASS
- Benefit-framed or first-person CTA that makes the payoff concrete → PASS
- Generic/mechanical system label ("Submit," "Learn more," "Click here") → FAIL
- Real action but no value ("Sign up," "Register") → FAIL
- Vague outcome ("Get started," "Explore") → FAIL
- High-commitment framing with nothing lowering the stakes → FAIL
- Clever phrasing that hides the action → FAIL
- Over-long, stuffed, or false-urgency → FAIL
- About 35% should pass

For each CTA return JSON:
- "index": CTA number
- "verdict": "PASS" or "FAIL"
- "trigger": the strength identified (clear action, benefit framing, low friction, concrete outcome) or the failure mode
- "tactic": the CTA pattern if recognizable (first-person, benefit-led, friction-reducer, plain action verb, etc.)
- "reasoning": one sentence on what's working or missing
- "improvement": if FAIL, one specific rewrite or fix. If PASS, what to keep.

Return ONLY a JSON array.
