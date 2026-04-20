# Audit: TikTok Event Audit

## Purpose
Check whether the target TikTok Pixel event is implemented correctly for the target page or flow.

This audit is mandatory for page-level TikTok Pixel implementation tasks.

## Source of Truth
Use `references/tt-guide.md` as the primary reference for:
- standard event usage,
- custom event usage,
- `ttq.track(...)`,
- `ttq.identify(...)`,
- `event_id`,
- limited data use,
- parameter expectations.

## Main Questions
Answer the following:

1. Does the target event already exist?
2. Is the event name correct for the business moment?
3. Are the parameters correct and sufficiently populated?
4. Is the trigger timing correct?
5. Is the trigger logic attached to the correct business completion point?
6. Is deduplication needed?
7. Is identify / advanced matching relevant and correctly handled?

## Step 1: Identify the target event
Infer the most appropriate TikTok event from the user's requested business action.

Examples:
- page view / landing page exposure -> `PageView`
- product detail exposure -> may remain `PageView` plus context-specific data strategy
- add to cart success -> `AddToCart`
- checkout initiation -> `InitiateCheckout`
- order completion -> `Purchase`
- lead submit success -> `Lead`
- registration success -> `CompleteRegistration`
- search submission -> `Search`

If the repository already uses a different event name, judge whether:
- it is valid,
- it is suboptimal,
- it is custom but acceptable,
- it should be migrated to a standard event.

## Step 2: Check event presence
Search for:
- `ttq.track(`
- wrapper functions that call TikTok tracking
- event name strings
- analytics abstraction layers
- event dispatch utilities
- business success callbacks
- click handlers and submit handlers

Determine:
- whether the target event exists,
- whether it fires once or multiple times,
- whether it is directly visible or hidden inside abstractions.

## Step 3: Check event naming correctness
Judge whether the chosen event name matches the actual business moment.

Do not approve an event name only because it is already present.
Check:
- whether the event is too early,
- whether it reflects intent rather than completion,
- whether a standard event should replace a generic custom event.

## Step 4: Check parameter correctness
Use `references/tt-guide.md` and `references/parameter-mapping.md`.

Check:
- whether required or important parameters are present,
- whether parameter names match TikTok expectations,
- whether the data source is trustworthy,
- whether the values represent the real user action,
- whether parameter semantics match the event.

Examples of issues:
- missing `currency` on revenue events,
- wrong item identifier field,
- stale or placeholder values,
- parameters taken from UI text instead of business data,
- copying Meta parameter names without TikTok adjustment.

## Step 5: Check trigger timing
Use `references/trigger-timing-reasoning.md`.

Judge whether the event fires at the correct moment.

Examples:
- `AddToCart` should preferably align with confirmed cart addition, not only button click if click does not guarantee success.
- `Purchase` should align with order success or confirmation, not only checkout button click.
- `Lead` should align with successful submission, not form open.
- `Search` should align with executed search, not input focus.

Pay special attention to:
- async requests,
- optimistic UI,
- route transitions,
- redirects,
- popup / modal flows,
- success callbacks,
- retry logic.

## Step 6: Check deduplication
Determine whether browser + server dual reporting is likely or already present.

If yes, check whether:
- an event identifier exists,
- TikTok uses `event_id`,
- the value is stable and unique enough.

If there is Meta-side deduplication only, determine whether TikTok deduplication must also be added.

## Step 7: Check identify / advanced matching
Determine whether user identity enrichment is relevant.

Check whether:
- email exists,
- phone exists,
- the implementation already collects identity data,
- the timing is appropriate for `ttq.identify(...)`,
- the values appear normalized or normalization-ready.

Do not force identify usage when the flow does not reliably produce user identity data.

## Step 8: Summarize quality
Classify the event implementation as one of:

- Missing
- Present but incorrect
- Present but incomplete
- Present and likely acceptable
- Present and strong

## Output Requirements
Summarize findings as:

- **Target event**
- **Presence**
- **Event naming**
- **Parameters**
- **Trigger timing**
- **Deduplication**
- **Identify / matching**
- **Overall quality**

## Important Rules
- Do not approve an event just because a `ttq.track(...)` call exists.
- Do not assume click timing equals business completion.
- Do not assume Meta parameter names are safe for TikTok without adjustment.
- Do not require every optional parameter; judge by business value and correctness.
- Prioritize business truth over UI surface signals.
