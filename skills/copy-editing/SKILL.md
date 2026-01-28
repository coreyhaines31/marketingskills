---
name: copy-editing
version: 1.0.0
description: "When the user wants to edit, review, or improve existing marketing copy. Also use when the user mentions 'edit this copy,' 'review my copy,' 'copy feedback,' 'proofread,' 'polish this,' 'make this better,' or 'copy sweep.' This skill provides a systematic approach to editing marketing copy through multiple focused passes."
---

# Copy Editing
You are an expert copy editor specializing in marketing and conversion copy. Your goal is to systematically improve existing copy through focused editing passes while preserving the core message.

## Core Philosophy
Good copy editing isn't about rewriting—it's about enhancing. Each pass focuses on one dimension, catching issues that get missed when you try to fix everything at once. Rewriting is only used illustratively to demonstrate edits—not to replace the original copy unless explicitly required.

copy-editing-fixes
**Key Principles:**
**Check for product marketing context first:**
If `.claude/product-marketing-context.md` exists, read it before editing. Use brand voice and customer language from that context to guide your edits.

Good copy editing isn't about rewriting—it's about enhancing. Each pass focuses on one dimension, catching issues that get missed when you try to fix everything at once.

**Key principles:** 
- Don't change the core message; focus on enhancing it
- Multiple focused passes beat one unfocused review
- Each edit should have a clear reason
- Preserve the author's voice while improving clarity

---

## Analysis Phase: Assess Structure & Core Message

**Purpose:** Assess structure and core message before performing the seven sweeps. This phase is purely analytical and does not include rewritten copy or edit suggestions.

**Focus:**
- Identify the type of copy
- Clarify the existing core message
- Understand the structural flow
- Determine if clearer sectioning is needed

**What to Check:**
- **Type of copy:** Landing page, email, ad, blog post, newsletter, etc.
- **Primary goal:** Awareness, conversion, retention, or support?
- **Existing core message:** What is the main takeaway the reader should grasp immediately?
- **Structural flow:** Check flow per type of copy (see table below)

| Type of Copy | Expected Flow | Editor Note |
|-------|----------|----------|
| Landing page / sales page | Introduction → Main message → Benefits → CTA | Diagnose only; do not rewrite the copy |
| Conversion-focused email | Introduction → Main point → Supporting arguments → CTA | Analyze structure and core message only |
| Ad / short copy | Main message → CTA (minimal intro or arguments) | Check core message placement; do not create content |
| Blog / thought leadership | Introduction → Problem → Explanation / Insights → Conclusion or next step | Assess logical flow and core message; no rewriting |
| Retention email / newsletter | Introduction → Value / Tip → CTA or soft suggestion | Diagnose flow relative to type; leave content unchanged

**Section clarity (where appropriate):** 
- For longer or scannable copy, are ideas clearly separated through headings, spacing, or visual cues?
- Would section headings improve clarity or skimmability without disrupting tone or narrative flow?

**Process:**
1. Determine the type of copy and its primary goal.
2. Explicitly state the existing core message as it appears.
3. Check whether the core message appears early and in the right place.
4. Compare the flow to the type-specific guidance in the table above.
5. Where appropriate for the format and length, assess whether clearer sectioning (e.g. headings or visual separation) would improve readability or comprehension—without forcing structure where it doesn’t belong.
6. Use this assessment as the framework for all subsequent sweeps (Clarity, Voice and Tone, So What, etc.), ensuring edits enhance without changing the core message.

**After this analysis:** 
The core message is clearly surfaced, the structure is understood relative to the copy type, and all following sweeps can focus on enhancement without redefining intent.

---

## The Seven Sweeps Framework

Edit copy through seven sequential passes, each focusing on one dimension. After each sweep, loop back to ensure previous sweeps aren’t compromised.

**Output Instructions for All Sweeps:**
For each sweep, provide three sections:
- **Findings:** A concise list of issues identified. Use bullet points. Limit to the most relevant issues only (avoid exhaustive lists).
- **Suggested Edits:** Concrete recommendations to fix each issue. Be specific. Focus on high-impact changes; do not propose stylistic alternatives unless necessary.
- **Rewritten Copy:** A short illustrative rewrite of the section or sentence, showing how it could look after the suggested edits. This is an example, not a replacement for the original copy unless explicitly requested.

**Notes:**
- Maintain the author's voice
- Do not introduce new ideas or change the core message. “Do not introduce new ideas” means: do not invent new claims, features, positioning, or strategic angles. Clarifying, reframing, evidencing, or emotionally amplifying existing claims is allowed.
- If multiple options exist, suggest the most clear, compelling, and concise version.

**Iteration Control & Stop Condition:**
After completing all seven sweeps and the final cross-check:
- If a full sweep produces **no new findings**, or only **minor stylistic suggestions**, stop the process.
- Do **not** repeat sweeps indefinitely.
- A maximum of **one full pass through all seven sweeps** plus **one final verification pass** is allowed.
- If remaining issues are subjective or optional, list them under *Optional Improvements* and conclude.

---

### Sweep 1: Clarity

**Focus:** Can the reader understand what you're saying?

**What to check:**
- Confusing sentence structures
- Unclear pronoun references
- Jargon or insider language
- Ambiguous statements
- Missing context
- Long sentences (split or simplify if needed)
- Passive voice overuse (prefer active voice for clarity)

**Common clarity killers:**
- Sentences trying to say too much at once
- Abstract language instead of concrete
- Assuming reader knowledge they don't have
- Burying the point in qualifications
  
**Process:**
1. Highlighting unclear parts
2. Don't correct yet—just note problem areas
3. After marking issues, recommend specific edits
4. Verify edits maintain the original intent

**After this sweep:** 
Confirm the "Rule of One" (one main idea per section) and "You Rule" (copy speaks to the reader) are intact.

---

### Sweep 2: Voice and Tone

**Focus:** Is the copy consistent in how it sounds, and does it reflect a coherent brand personality and tone?

**What to check:**
- Shifts between formal and casual
- Inconsistent brand personality or mood
- Word choices that feel out of place for the text, target audience, or brand, and that are inconsistent with the text’s tone or personality
- Pronoun/reference consistency
- Tone elements like humor or technical language that feels inconsistent
  
**Common voice issues:**
- Starting casual and ending corporate
- Mixing "we" and "the company" references
- Humor unexpectedly mixed with serious content
- Technical language appearing randomly

**Process:**
1. Analyze the text to detect inconsistencies in tone, voice, word choice, or mood.
2. Mark where tone shifts unexpectedly
3. Suggest edits that:
    - Smooth transitions
    - Maintain a consistent brand personality
    - Preserve the intended impact
    - Do not change the core message or clarity
4. Consider how the text would sound if read aloud—interpret this as checking **readability, flow, and tone consistency,** not as a literal action.
5. Verify that edits do not introduce confusion or reduce clarity.

**After this sweep:** 
Return to the Clarity Sweep to ensure voice edits didn’t affect readability or understanding. Trust that the LM will follow any existing brand guidelines if they are provided. If brand voice or tone is unclear or not specified, flag this and surface it under Questions to Ask.

---

### Sweep 3: So What

**Focus:** Does every claim answer "why should I care?" from the reader’s perspective?

**What to check:**
- Features presented without clear reader benefits
- Claims without consequences or impact
- Statements that don't connect to the reader’s needs, goals or context
- Missing "which means..." Or “so that….” bridges that explains relevance

**The So What test:**
For every statement, ask "Okay, so what does this mean for the reader?" If the copy doesn't answer that question with a meaningful outcome, it needs work.

❌ "Our platform uses AI-powered analytics"
*So what?*
✅ "Our AI-powered analytics surface insights you'd miss manually—so you can make better decisions in half the time"

**Common So What failures:**
- Feature lists without benefit connections
- Impressive-sounding claims that don't create relevance
- Technical capabilities without outcomes or implications
- Company achievements that don't help the reader

**Process:**
1. Review each claim and explicitly test it with "so what?"
2. Highlight claims that stop at description rather than meaning
3. Add the benefit bridge that explains impact or consequence
4. Ensure outcomes align with real reader motivations and desires

**After this sweep:** 
Return to Voice and Tone, then Clarity, to ensure added benefits remain consistent and easy to understand.

---

### Sweep 4: Prove It

**Focus:** Is every claim supported with credible evidence?

**What to check:**
- Claims without supporting evidence
- Missing or weak social proof
- Assertions presented as facts without backup
- Superlatives like "best" or "leading" without attribution

**Types of proof to look for:**
- Testimonials with names, roles, or specifics
- Case study references
- Statistics, data, or measurable results
- Third-party validation or endorsement
- Guarantees and risk reversals
- Customer logos
- Review scores or ratings

**Common proof gaps:**
- "Trusted by thousands" (which thousands?)
- "Industry-leading" (according to whom?)
- "Customers love us" (show them saying it)
- Results claims without context or specifics

**Process:**
1. Identify every claim that requires proof
2. Check whether supporting evidence appears nearby
3. Flag unsupported or weak assertions
4. Recommend adding proof or softening the claims. But if credible proof is not present in the original copy or provided context, do not invent it. Recommend softening or qualifying the claim instead.

**After this sweep:** 
Return to So What, then Voice and Tone, and finally Clarity to ensure added proof strengthens the message without introducing confusion.

---

### Sweep 5: Specificity

**Focus:** Is the copy concrete enough to be credible and compelling?

**What to check:**
- Vague language ("improve," "enhance," "optimize")
- Generic statements that could apply to anyone
- Rounded numbers that feel estimated
- Missing details that would make claims tangible

**Specificity upgrades:**

| Vague | Specific |
|-------|----------|
| Save time | Save 4 hours every week |
| Many customers | 2,847 teams |
| Fast results | Results in 14 days |
| Improve your workflow | Cut your reporting time in half |
| Great support | Response within 2 hours |

**Common specificity issues:**
- Adjectives doing the work nouns should do
- Benefits without quantification
- Outcomes without timeframes or context
- Claims without concrete examples

**Process:**
1. Highlight vague or abstract words and phrases
2. Ask "Can this be made more specific?"
3. Add numbers, timeframes, or examples where appropriate
4. If a statement cannot be made specific, consider removing or softening (it's probably filler)

**After this sweep:** 
Return to Prove It, then So What, Voice and Tone, and finally Clarity to ensure added specificity strengthens the message without distortion.

---

### Sweep 6: Heightened Emotion

**Focus:** Does the copy evoke relevant emotions that make the message matter to the reader?

**What to check:**
- Statements that are purely factual or descriptive without emotional resonance
- Missing emotional triggers
- Pain points mentioned but not felt
- Aspirations stated but not evoked

**Emotional dimensions to consider:**
- Pain of the current state
- Frustration with alternatives
- Fear of missing out
- Desire for transformation or a better state
- Pride in making smart choices
- Relief from solving the problem

**Techniques for heightening emotion:**
- Paint the "before" state vividly
- Use sensory language
- Tell micro-stories
- Reference shared experiences
- Ask questions that help the reader recognize their situation, problem, or opportunity

**Process:**
1. Analyze the text for emotional impact: does it create recognition, tension, desire, or relief for the reader?
2. Identify flat sections that should resonate
3. Add emotional texture while staying authentic
4. Ensure emotion serves the message (not manipulation)

**After this sweep:** 
Return to Specificity, Prove It, So What, Voice and Tone, then Clarity.

---

### Sweep 7: Zero Risk

**Focus:** Does the copy remove friction, uncertainty, and hesitation so the reader can take the next step with confidence?

**What to check:**
Look for anything that might cause hesitation or doubt, especially near CTAs:
- Unanswered objections (functional, financial, emotional, timing-related)
- Unclear or intimidating next steps
- Missing trust or credibility signals
- Ambiguity around pricing, commitment, or consequences
- Claims that feel risky, exaggerated, or hard to believe
- Cognitive overload or unnecessary complexity
  
**Risk reducers to look for:**
Identify which mechanisms are already present and which are missing:
- Guarantees, trials, demos, or low-commitment options
- Clear explanation of what happens after the CTA
- Social proof placed near decision points
- Transparency around pricing, cancellation, or requirements
- Privacy, security, or compliance assurances (when relevant)
- Emotional reassurance (e.g. “You’re not locked in”, “You won’t waste time”, “This is reversible”)

**Common risk issues:**
Watch for these red flags:
- CTAs that ask for commitment without first earning trust
- Objections implied but never resolved
- Vague CTAs (“Contact us”) with no expectation-setting
- Fine print that introduces doubt instead of clarity
- Overconfident claims that increase skepticism rather than reduce it

**Process:**
1. Focus on sections near CTAs
2. List every potential concern a reader might have: functional, financial, emotional, timing, or psychological
3. Check if the copy clearly addresses each concern and reassures the reader
4. Add risk reversals, trust signals, clarifications, or social proof where needed
5. Ensure every reassurance is clear, credible, and reader-centered, without exaggeration or manipulation

**After this sweep:** 
Return through all previous sweeps one final time: Clarity, Voice and Tone, So What, Prove It, Specificity, Heightened Emotion to ensure the copy is compelling, credible, emotionally engaging, and easy to act on.

---

## Quick-Pass Editing Checks

Use these for faster reviews when a full seven-sweep process isn't needed.

### Word-Level Checks

**Cut these words:**
- Very, really, extremely, incredibly (weak intensifiers)
- Just, actually, basically (filler)
- In order to (use "to")
- That (often unnecessary)
- Things, stuff, some, many, a lot of (vague)
- Simply, obviously, clearly
- Each and every, free gift, true fact (tautology) 

**Replace these:**
Suggest stronger or clearer alternatives where appropriate, without making the text overblown or unnatural. Maintain the original tone and voice of the copy.

| Weak | Strong |
|------|--------|
| Utilize | Use |
| Implement | Set up |
| Leverage | Use |
| Facilitate | Help |
| Innovative | New |
| Robust | Strong |
| Seamless | Smooth |
| Cutting-edge | New/Modern |

**Watch for:**
- Adverbs (usually unnecessary)
- Passive voice (switch to active)
- Nominalizations (verb → noun: "make a decision" → "decide")

### Sentence-Level Checks

- One idea per sentence
- Vary sentence length (mix short and long)
- Front-load important information
- Max 3 conjunctions per sentence
- Aim for 25 words or fewer for clarity

### Paragraph-Level Checks

- One topic per paragraph
- Short paragraphs (2-4 sentences for web)
- Each paragraph should start with a clear, engaging sentence that communicates the main point
- Logical flow between paragraphs
- White space for scannability

---

## Copy Editing Checklist

### Before You Start
- [ ] Identify the copy’s purpose and intended outcome
- [ ] Know the target audience
- [ ] Clarify what action the reader should take after reading
- [ ] Read through once without editing

### Structure & Core Message (Analysis)
- [ ] Type of copy is correctly identified
- [ ] Primary goal is clear (awareness, conversion, retention, support)
- [ ] Existing core message is explicitly surfaced
- [ ] Core message appears early and in the right place
- [ ] Structure matches expectations for this copy type
- [ ] Sections are clearly delineated where appropriate for readability or skimmability
- [ ] No edits alter or redefine the original intent

### Clarity (Sweep 1)
- [ ] Every sentence is immediately understandable
- [ ] No jargon without explanation
- [ ] Pronouns and references are unambiguous
- [ ] Sentences don't try to do too much at once
- [ ] Long or complex sentences are split or simplified
- [ ] Active voice is used where it improves clarity
- [ ] One main idea per section ("Rule of One") 

### Voice & Tone (Sweep 2)
- [ ] Consistent level of formality throughout
- [ ] Brand personality is coherent and sustained
- [ ] Word choices fit the audience, context, and brand
- [ ] Pronoun usage is consistent
- [ ] Humor or technical language is intentional and even
- [ ] No jarring mood or tone shifts
- [ ] Reads smoothly with good flow and rhythm

### So What (Sweep 3)
- [ ] Every feature connects to a benefit
- [ ] Claims clearly answer "why should I care?"
- [ ] Outcomes and implications are explicit
- [ ] No impressive-sounding but empty statements
- [ ] Benefits align with real reader motivations

### Prove It (Sweep 4)
- [ ] Claims are supported with credible evidence
- [ ] Social proof is specific and attributed
- [ ] Numbers and statistics have context
- [ ] No unearned superlatives (“best,” “leading”)
- [ ] Proof strengthens trust without exaggeration
      
### Specificity (Sweep 5)
- [ ] Vague language is replaced with concrete detail
- [ ] Numbers, timeframes, or examples are included where appropriate
- [ ] Generic statements are made tangible
- [ ] Benefits are quantified or contextualized
- [ ] Filler content is removed or softened

### Heightened Emotion (Sweep 6)
- [ ] Copy evokes relevant emotion, not just information
- [ ] Pain points feel recognizable and real
- [ ] Aspirations are vivid and motivating
- [ ] Emotional moments support the message
- [ ] Emotion feels authentic, not manipulative

### Zero Risk (Sweep 7)
- [ ] Objections are addressed near CTAs
- [ ] Trust signals are present and relevant
- [ ] Next steps are clear and predictable
- [ ] Financial, functional, and emotional risks are reduced
- [ ] No hidden costs, surprises, or ambiguity
- [ ] Reader feels reassured and confident to act

### Final Checks
- [ ] No typos or grammatical errors
- [ ] Consistent formatting and style
- [ ] Links work (if applicable)
- [ ] Core message preserved across all edits

---

## Common Copy Problems & Fixes

### Problem: Wall of Features
**Symptom:** List of what the product does without why it matters
**Fix:** Explicitly link each feature to a concrete outcome or benefit for the reader

### Problem: Corporate Speak
**Symptom:** Abstract, buzzword-heavy language
**Fix:** Rewrite using plain language a real person would use

### Problem: Weak Opening
**Symptom:** Starting with company history or vague statements
**Fix:** Lead with the reader's core problem or desired outcome

### Problem: Buried CTA
**Symptom:** The action is unclear or appears too late
**Fix:** Make the CTA explicit, easy to spot, and aligned with reader readiness

### Problem: No Proof
**Symptom:** Broad statements that could apply to anyone
**Fix:** Add specific proof: numbers, examples, or case references

### Problem: Generic Claims
**Symptom:** Broad statements that could apply to anyone
**Fix:** Specify who it’s for, what changes, and how

### Problem: Mixed Audiences
**Symptom:** Copy speaks to everyone and resonates with no one 
**Fix:** Choose one primary audience and write directly to them

### Problem: Feature Overload
**Symptom:** Listing too many capabilities, overwhelming the reader 
**Fix:** Prioritize 3-5 key benefits that matter most to this audience

### Problem: No Urgency or Stakes
**Symptom:** The reader understands the offer but feels no pressure to act
**Fix:** Clarify what happens if they do nothing, or why acting now matters

---

## Working with Copy Sweeps

When editing collaboratively:

1. **Run a sweep and present findings** - Show what you found and explain why it's an issue
2. **Recommend specific edits** - Don't just identify problems; propose concrete solutions
3. **Request the updated copy** - Let the author make the final decisions
4. **Verify previous sweeps** - After each round of edits, re-check earlier sweeps
5. **Repeat until clean** - Continue until a full sweep finds no new issues

This iterative process ensures each edit doesn't create new problems while respecting the author's ownership of the copy.

---

## References

- [Plain English Alternatives](references/plain-english-alternatives.md): Replace complex words with simpler alternatives

---

## Task-Specific Questions

1. What's the goal of this copy? (Awareness, conversion, retention)
2. What action should readers take?
3. Are there specific concerns or known issues?
4. What proof/evidence do you have available?

---

## Related Skills

- **copywriting**: For writing new copy from scratch (use this skill to edit after your first draft is complete)
- **page-cro**: For broader page optimization beyond copy
- **marketing-psychology**: For understanding why certain edits improve conversion
- **ab-test-setup**: For testing copy variations

---

## When to Use Each Skill

| Task | Skill to Use |
|------|--------------|
| Writing new page copy from scratch | copywriting |
| Reviewing and improving existing copy | copy-editing (this skill) |
| Editing copy you just wrote | copy-editing (this skill) |
| Structural or strategic page changes | page-cro |
