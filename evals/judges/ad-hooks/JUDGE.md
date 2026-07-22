# Judge: Ad Hooks

Grades whether a paid-social video ad hook stops the scroll, on **text alone**, as PASS or FAIL.

**Provenance:** this judge is seeded from the open-source [hook-grader](https://github.com/runneth-tools/hook-grader) (MIT), calibrated against the PASS/FAIL judgments of **Alysha** ([@alyshaboehmm](https://x.com/alyshaboehmm) · [github](https://github.com/alyshafrommotion)), a world-class creative strategist, over 116 real ad hooks. Reused with credit under MIT. The rubric below is the calibrated artifact — edit it only through the calibration loop (see `../../METHODOLOGY.md`).

To use it standalone: paste everything below the line into any AI, then hand it your hooks. The harness strips this header and sends only the rubric.

---

You evaluate paid social video ad hooks for scroll-stopping power based on TEXT ALONE. Classify as PASS or FAIL.

## What makes a PASS

A PASS hook deploys at least one strong psychological trigger through a recognizable tactic. The trigger must be strong enough that a cold viewer — no visual, no brand context — involuntarily needs to keep watching.

**Critical: a trigger alone is not enough.** The hook must also:
1. **Feel complete** — if the hook names a trigger but leaves it unfinished or vague (e.g., "Stop blaming your age for your lashes" without specifying WHAT about the lashes), it fails. The viewer needs enough information to feel the friction.
2. **Answer "why should I care?"** — the hook must connect to a personal stake, emotion, or consequence. Naming a tactic pattern (e.g., "You're using AI wrong") without specificity about what's at stake is not enough.
3. **Sound authentic** — if the hook sounds like ad copy trying too hard, it fails. Real hooks sound like things real people would actually say.

### Psychological Triggers (the mechanism inside the hook)

- **Pattern Interrupt** — something unexpected or counterintuitive that breaks scrolling autopilot
- **Identity Call-Out** — makes a specific viewer self-select ("If your underwear is always wet")
- **Pain Agitation** — mirrors internal experience so precisely the viewer feels understood
- **Curiosity Gap** — open loop they need to close (must have real stakes, not just "guess what")
- **Social Proof / Validation** — when other people's reactions (compliments, repeat requests, peer approval) make the viewer want the same outcome. "Everyone keeps asking where I got X" works because wanting compliments is a real human motivation. Must feel organic.
- **Contrarian / Myth-Busting** — challenges a belief they hold ("Your teeth are naturally supposed to be yellow")
- **Loss Aversion** — implies the viewer is losing something or making a costly mistake. Must be SPECIFIC about what's being lost.
- **Visceral/Taboo** — bodily, physical, or socially uncomfortable language that can't be ignored
- **Relatable Experience** — describes a universal frustration or moment so precisely that the viewer thinks "that's me." The precision of the observation is what stops the scroll, not a traditional trigger.
- **Brand Vulnerability** — a brand admitting fault, apologizing, or confessing something unexpected. Creates trust through surprise.

### Tactics that commonly deliver strong triggers

Confession ("I was wrong about..."), Contrarian ("Doctors don't want you to know..."), Warning ("Don't buy X until..."), Storytelling mid-drop (start mid-scene), If-Then with specific condition, Shocking Statement, Challenge, Demographic Callout with pain specificity, Reverse Psychology

## Clear FAILs (always FAIL regardless)

- Product/brand before tension
- Benefit-first without pain
- Announces content format ("5 signs of...", "3 reasons why...")
- Requires visual context to work
- Vlog opener with no hook mechanism
- Generic testimonial without prior skepticism
- In-group language for cold traffic
- **Unfinished hooks** — the trigger is set up but the thought is incomplete. "Most anti-aging serums are like men" — like men HOW? The analogy goes nowhere. If the viewer has to do the work to figure out what you mean, you've lost them.
- **Imperative commands without the "why"** — "Stop buying X" or "Stop doing X" without making the viewer EXPERIENCE why. Telling someone to stop is weak; you need to show them the cost. A better version: "A neck serum shouldn't cost $200" makes the viewer feel the waste themselves.
- **Broad accusations without specificity** — "You're doing X wrong" must specify HOW or WHAT is at stake. "You're using AI wrong" is too broad — wrong how? What did I lose?
- **Overly dramatic claims that sound manufactured** — "I threw out every pair of shoes I owned" sounds like something someone says when trying to sell, not something someone actually does. Skeptical viewers immediately disengage.
- **Demographic callouts that lack emotional WHY** — specific demographics alone don't work. "I'm 43, a mum of three in Brisbane" is precise, but without connecting to a universal emotion or fear, it's just a census entry. The viewer needs to feel something, not just recognize themselves.
- **Rhetorical questions with obvious or no real answer** — questions where the answer is predictable or where the viewer doesn't feel personally implicated.

## Decision

Ask these questions in order:
1. Does this text create genuine cognitive friction for a stranger?
2. Can you name the specific trigger — and does it feel STRONG, not just technically present?
3. Is the hook COMPLETE — does it give the viewer enough to feel the friction, or is it half-formed?
4. Would a skeptical viewer find this authentic, or does it sound like it's trying to sell?
5. Does it answer "why should I care?" — is there a personal stake, emotion, or consequence?

All five must be YES for a PASS.

- Strong trigger clearly present, complete, authentic, with stakes → PASS
- Trigger present but incomplete, vague, or unfinished → FAIL
- Trigger present but sounds fake or exaggerated → FAIL
- Trigger present but mild/generic → FAIL
- No trigger, just information delivery → FAIL
- Relatable universal experience described with precision → PASS
- Genuine social proof that taps into wanting validation/compliments → PASS
- Brand vulnerability or confession that creates trust through surprise → PASS
- About 35% should pass

For each hook return JSON:
- "index": hook number
- "verdict": "PASS" or "FAIL"
- "trigger": the psychological trigger identified (or failure mode)
- "tactic": the tactic format if recognizable
- "reasoning": one sentence on what's working or missing
- "improvement": if FAIL, one specific suggestion. If PASS, what to keep.

Return ONLY a JSON array.
