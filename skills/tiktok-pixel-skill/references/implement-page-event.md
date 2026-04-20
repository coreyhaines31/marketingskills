# Workflow: Implement TikTok Pixel for a Page or Business Flow

## Goal
Handle a repository-level TikTok Pixel task for a page or flow by combining:
- Base Code audit,
- TikTok event audit,
- Meta alignment audit,
and then turning the result into a concrete implementation plan.

## Step 1: Understand the task target
Identify:
- the target page or business flow,
- the user action,
- the business moment that should be tracked,
- the likely TikTok Pixel event,
- whether the user wants to install, validate, repair, or migrate.

If the exact event is not explicitly given, infer the most likely event from the business action, and state that inference clearly.

## Step 2: Establish implementation context
Check what implementation context is available:
- full repository,
- file subset,
- code snippet,
- business flow description,
- existing Meta Pixel code,
- existing TikTok Pixel code.

Prefer repository evidence over abstract assumptions.

## Step 3: Run Base Code audit
Read `references/basecode-audit.md`.

Determine:
- whether TikTok Base Code exists,
- whether initialization appears globally valid,
- whether the current page is actually covered,
- whether `ttq.page()` or page-level initialization assumptions are missing.

## Step 4: Run TikTok event audit
Read `references/event-audit.md`.

Determine:
- whether the target TikTok event already exists,
- whether its name is correct,
- whether parameters are sufficient and valid,
- whether trigger timing is correct,
- whether deduplication or identity logic is needed.

## Step 5: Run Meta alignment audit
Read `references/meta-alignment-audit.md`.

Determine:
- whether matching Meta implementation exists,
- whether it provides reusable trigger points,
- whether it provides reusable parameter sources,
- what Meta-to-TikTok differences must be corrected.

## Step 6: Merge findings
Combine the three audit tracks into one implementation view:

- what already exists,
- what is missing,
- what is incorrect,
- what can be reused,
- what is uncertain.

Do not leave the result as three disconnected sections.

## Step 7: Design a code-level implementation plan
Produce a practical implementation plan that answers:

- where the TikTok code should be inserted,
- what existing logic should be reused,
- which parameters should be mapped,
- whether deduplication should be added,
- whether trigger timing should be moved,
- whether Base Code must be fixed first.

## Step 8: Provide example implementation
When possible, provide sample code using:
- `ttq.load`
- `ttq.page`
- `ttq.track`
- `ttq.identify`

Use the minimum necessary example to illustrate the patch.

## Step 9: Provide validation guidance
Explain how to validate:
- event firing,
- parameter correctness,
- missing or duplicate firing,
- page coverage,
- migration correctness.

## Final Rule
The workflow is not complete unless it leads to an implementation-ready answer.
