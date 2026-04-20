# Module: Trigger Timing Reasoning

## Purpose
Determine whether a TikTok Pixel event should fire at the current implementation point, or whether the trigger should be moved to a more accurate business moment.

Use this module whenever evaluating or proposing event placement.

## Core Principle
The correct trigger point should reflect business truth, not merely UI interaction.

A click, mount, or submit attempt is not always the same as a successful business event.

## Main Questions
Answer the following:

1. What real business moment should this event represent?
2. Does the current code location align with that moment?
3. Is the current trigger too early, too late, duplicated, or unreliable?
4. Would async behavior, routing, or optimistic UI make the event inaccurate?

## Timing Categories

### 1. Page Load / Page Exposure
Suitable for:
- global page exposure
- landing page visits
- route-based page view logic

Typical signal:
- page load,
- route enter,
- route change,
- page component mount in a route-aware system.

Use carefully in SPAs:
- initial mount may not cover subsequent route transitions.

### 2. User Intent
This is an early-stage action such as:
- clicking a button,
- opening a modal,
- starting a form,
- pressing checkout.

These signals show user intent, but not always business completion.

Use cautiously:
- user intent may be a weak event trigger if success is not guaranteed.

### 3. Submission Attempt
This is stronger than mere click, but still not always success.

Examples:
- form submit handler,
- add-to-cart request dispatch,
- checkout API call start.

Use when:
- the event is meant to represent attempt rather than success.

Avoid when:
- the event should represent confirmed completion.

### 4. Confirmed Success
This is usually the strongest trigger point.

Examples:
- API success callback,
- order confirmed response,
- cart updated success,
- lead submission success,
- registration success,
- search executed with committed query state,
- confirmation page after verified completion.

Prefer this category for conversion events.

### 5. Post-Success Navigation
Sometimes the repository fires events after redirect or page transition.

This can be acceptable if:
- the success state is durable,
- event emission is still guaranteed,
- the destination page reliably reflects confirmed success.

Risks:
- event loss during navigation,
- duplicated firing on refresh,
- false positives if navigation is reachable from multiple paths.

## Event-Specific Guidance

### PageView
Usually:
- page load or route-enter logic,
- `ttq.page()` rather than a custom track call.

### AddToCart
Prefer:
- confirmed cart-add success,
not only button click,
unless business logic guarantees click == add success.

### InitiateCheckout
Prefer:
- actual checkout initiation point,
such as transition into checkout or checkout-start confirmation,
not merely viewing cart.

### Purchase
Prefer:
- confirmed order success,
- confirmation page backed by real purchase state,
- successful checkout completion callback.

Do not place Purchase on:
- checkout button click,
- payment form open,
- pre-confirmation stages.

### Lead
Prefer:
- successful lead submission,
not only form open or CTA click.

### CompleteRegistration
Prefer:
- successful account creation confirmation,
not merely submit intent.

### Search
Prefer:
- executed search action,
- committed query submission,
not partial typing or focus.

## Timing Risk Patterns
Watch for:

- optimistic UI before server confirmation,
- redirect before event dispatch completes,
- retry loops,
- duplicate success callbacks,
- event on both click and success,
- multiple route mounts,
- stale state during async transitions,
- modal reopen causing repeated events.

## Output Behavior
When evaluating a trigger point, state:

1. current trigger point,
2. target business moment,
3. whether they align,
4. risk if misaligned,
5. recommended trigger point.

## Recommended Verdict Labels
Use:
- Correct timing
- Acceptable but weak
- Too early
- Too late
- Duplicate risk
- Needs verification

## Important Rules
- Do not approve a trigger point just because it is easy to implement.
- Do not use click timing for success events unless business semantics justify it.
- Do not separate timing judgment from actual code flow.
- If the success signal is not visible, clearly mark the timing recommendation as inferred.