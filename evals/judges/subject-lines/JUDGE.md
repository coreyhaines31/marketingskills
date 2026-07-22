# Judge: Email Subject Lines

Grades whether an email subject line earns the open — without being clickbait or spam — on **text alone**, as PASS or FAIL.

**Provenance:** Seed judge — the example inputs below are a starter corpus and the verdicts are AI-drafted, awaiting human labeling by **Corey Haines**, the framework's human calibrator (the role Alysha plays for `ad-hooks`). No agreement number is published until that labeling pass is complete — see the labeling note in `../../METHODOLOGY.md`.

To use it standalone: paste everything below the line into any AI, then hand it your subject lines. The harness strips this header and sends only the rubric.

---

You evaluate email subject lines for whether they earn the open, on TEXT ALONE. Classify as PASS or FAIL.

The bar is not "does this look fine in an inbox." The bar is: does this line give a specific reader a **real reason to open now** — and does it clear the deliverability/trust bar (not spammy, not misleading)? A subject line that trips spam filters or over-promises never reaches or keeps the reader, no matter how clever.

## What makes a PASS

A PASS subject line creates a genuine reason to open — and would survive the reader opening. It does at least one of these well, and does none of the FAIL things:

1. **Creates real curiosity with substance** — an open loop the reader needs to close, where there's an actual, specific payoff behind it. Not "guess what happened" but curiosity anchored to something the reader can tell is worth their time.
2. **Is relevant and specific to the reader** — names the reader's situation, a concrete number, a named thing, or a moment precise enough that the right reader thinks "this is for me." Specificity is the single strongest signal.
3. **Promises a clear benefit or intrigue** — the reader can see what they get by opening (a useful thing, an answer, a shortcut), or feels a pull they can't ignore. The benefit must be real, not vague ("value inside").
4. **Sounds human** — reads like something a real person would actually write to one other person, not like a template, a press release, or a corporate announcement. Lowercase, plainspoken, a little personal — these often help.

And it must **clear deliverability/trust**:
- Not spammy (no ALL CAPS, no `!!!`, no `$$$`, no spam-trigger words).
- Not misleading (the open loop must resolve honestly inside the email — no bait-and-switch).

A great subject line usually pairs specificity with a reason to care, in the fewest words possible. "Your invoice is 3 days overdue" passes on pure relevance. "the mistake that cost us 40% of signups" passes on curiosity-with-substance. "quick question about your Q3 roadmap" passes as human and specific.

## The failure taxonomy (this is the bulk of the judgment)

Most subject lines fail. Name the specific way each one dies:

- **Generic / templated** — the interchangeable subject line that could front any email from any company. "Our January newsletter," "Company update," "This week at [Company]," "Monthly digest." Nothing here is a reason to open — it's a filing label. FAIL.
- **Vague hype with no substance** — "Big news!", "You won't believe this," "Something exciting is coming," "We have an announcement." Manufactured excitement with zero information. The reader can't tell what's inside or why they'd care. FAIL.
- **Clickbait that over-promises** — "This one trick will 10x your revenue overnight," "The secret they don't want you to know." Promises more than any email could deliver. Even if it earns the open, it burns trust on open — and a good subject line has to survive the open. FAIL.
- **ALL CAPS / spammy punctuation / spam-trigger words** — "FREE GIFT INSIDE!!!", "ACT NOW — LIMITED TIME!!!", "$$$ MAKE MONEY FAST $$$", "Congratulations, you've been selected." Trips spam filters and reads as junk. Words like FREE (caps), URGENT, WINNER, GUARANTEED, RISK-FREE stacked with punctuation are instant fails. FAIL.
- **Misleading / bait-and-switch** — an open loop or claim the email won't honestly resolve. "Re: your refund" when there's no refund, "You left something in your cart" to someone who has no cart, a personal-sounding line that opens into a mass promo. Earns the open by lying. FAIL.
- **Corporate / no-stakes** — technically clear but nothing is at stake for the reader. "Introducing our new brand identity," "We've updated our terms of service," "A message from our CEO." Real information, zero reason for the reader to prioritize it now. (Genuinely transactional/required notices are a gray zone — but marketing dressed as an announcement fails.) FAIL.
- **Too clever to parse** — a pun, in-joke, or wordplay so oblique the reader can't tell what the email is about in the half-second they give it. Cleverness that costs comprehension. "A tale of two spreadsheets" — of what? If the reader has to decode it, they scroll past. FAIL.
- **RE: / FWD: fakery** — fake reply/forward prefixes ("Re:", "Fwd:") on an email that is not a reply or forward, used to fake familiarity and jump the inbox. Cheap trick, corrodes trust, and spam filters flag it. FAIL.
- **Emoji-stuffing** — emojis as a substitute for a reason to open, or stacked for attention ("🔥🔥 HOT DEAL 🔥🔥", "🎉🎉🎉 You're invited 🎉🎉🎉"). A single well-placed emoji can be fine; emoji doing the work that words should do is a fail.
- **Command with no why** — "Open this," "Read now," "Don't miss out," "Check this out." Ordering the reader to open without giving them a reason. FAIL.
- **Curiosity with no substance** (near-miss) — an open loop that's structurally fine but has nothing real behind it. "You'll want to see this," "I have to tell you something." Feels like curiosity, delivers nothing the reader can weigh. The reader has learned these are empty. FAIL.
- **Clever but empty** (near-miss) — a line that's well-crafted, human, even charming, but gives no actual reason to open. Style without substance. FAIL — the craft is real, the reason to open is not.

## Decision

Ask these questions in order:

1. Does this give a real reason to open **now** — curiosity with substance, specific relevance, or a clear benefit — or is it a filing label / manufactured hype?
2. Is it **specific** enough that the right reader thinks "this is for me," or is it generic and interchangeable?
3. Would it **survive the open** — does the promise resolve honestly, or is it clickbait / bait-and-switch?
4. Does it clear **deliverability/trust** — no ALL CAPS, no `!!!`/`$$$`, no spam-trigger stacking, no RE:/FWD: fakery, no emoji-stuffing?
5. Does it **sound human**, or like a template / press release / corporate announcement?

A PASS needs a real reason to open (Q1) AND enough specificity or intrigue to matter (Q2) AND to survive the open (Q3) AND clear deliverability (Q4). Sounding human (Q5) rarely saves an empty line, but sounding robotic often sinks a borderline one.

- Specific + real reason to open + survives open + clean → PASS
- Curiosity present but nothing real behind it → FAIL
- Clever/charming but no actual reason to open → FAIL
- Generic, templated, or a filing label → FAIL
- Vague hype, over-promise, or clickbait → FAIL
- ALL CAPS, spammy punctuation, spam-trigger words, RE:/FWD: fakery, emoji-stuffing → FAIL
- Misleading / bait-and-switch → FAIL
- Corporate announcement with no stakes for the reader → FAIL
- About 35% should pass

For each subject line return JSON:
- "index": subject line number
- "verdict": "PASS" or "FAIL"
- "trigger": what earns the open (curiosity-with-substance, specific relevance, clear benefit, human voice) — or the failure mode
- "tactic": the recognizable format if any (specificity, open loop, personal note, question, transactional, etc.)
- "reasoning": one sentence on what's working or missing
- "improvement": if FAIL, one specific suggestion. If PASS, what to keep.

Return ONLY a JSON array.
