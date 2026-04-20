# Module: Repository Search Strategy

## Purpose
Search the repository efficiently to find TikTok Pixel code, Meta Pixel code, analytics abstractions, business event trigger points, and data sources needed for TikTok Pixel implementation.

Use this module whenever the task involves repository analysis.

## Core Principle
Do not search only for obvious Pixel API calls.
Search for both:
- direct tracking code,
- indirect abstractions and business trigger points.

A repository may hide tracking behind wrappers, analytics services, middleware, hooks, or shared utilities.

## Search Goals
A complete repository search should help answer:

1. Where is TikTok Pixel initialized?
2. Where are TikTok events fired?
3. Where is Meta Pixel already implemented?
4. What shared analytics abstractions exist?
5. Where does the business event actually succeed?
6. Where do event parameters come from?

## Search Layers

### Layer 1: Direct API Search
Search for direct platform calls.

TikTok-related:
- `ttq`
- `ttq.load`
- `ttq.page`
- `ttq.track`
- `ttq.identify`
- `TiktokAnalyticsObject`

Meta-related:
- `fbq`
- `fbq('track'`
- `fbq('trackCustom'`
- `fbq('init'`
- `eventID`
- `trackSingle`
- `trackSingleCustom`

Use this layer to discover obvious existing implementations.

### Layer 2: Analytics Abstraction Search
Search for analytics wrappers or dispatch layers.

Useful search terms:
- `trackEvent`
- `analytics`
- `sendEvent`
- `pixel`
- `tracking`
- `telemetry`
- `dispatchEvent`
- `reportEvent`
- `conversion`
- `marketing`

The goal is to find whether TikTok and Meta are abstracted behind:
- service modules,
- hooks,
- middleware,
- shared utilities,
- plugin systems,
- tag manager integrations.

### Layer 3: Business Trigger Search
Search for where the real business moment occurs.

Examples:
- add-to-cart reducer / action / mutation
- order success callback
- checkout completion handler
- lead form submit success
- registration success response
- search execution handler
- route transition after success
- modal success callback

Search terms depend on the task:
- `addToCart`
- `checkout`
- `purchase`
- `submit`
- `success`
- `complete`
- `confirm`
- `lead`
- `register`
- `search`
- `order`
- `cart`

### Layer 4: Parameter Source Search
Search for parameter origins.

Look for:
- product data models
- cart state
- checkout response
- order summary
- currency configuration
- quantity fields
- search query state
- user profile / email / phone sources
- transaction identifiers
- line items

Prefer business state and backend-confirmed data over UI-only values.

## Search Order
When handling a page-level TikTok Pixel task, prefer this search sequence:

1. Search for direct TikTok Pixel code.
2. Search for direct Meta Pixel code.
3. Search for analytics wrappers.
4. Search for target business trigger points.
5. Search for parameter data sources.
6. Search for deduplication or identity handling.

This order helps avoid getting lost in repository complexity too early.

## What to Extract
From each useful code location, extract:

- file location,
- function or module purpose,
- whether the code is global or local,
- whether it is active or legacy,
- what event it corresponds to,
- what parameters it uses,
- what trigger point it uses,
- whether it can be reused for TikTok.

## Red Flags
Watch for:
- dead code or old analytics code paths,
- duplicate wrappers,
- A/B test branches,
- environment flags,
- page-specific conditions,
- lazy-loaded modules,
- multiple app shells,
- code that looks like tracking but is only logging.

## Output Behavior
Summarize repository search results as:

- **TikTok code locations**
- **Meta code locations**
- **shared analytics layers**
- **business trigger points**
- **parameter sources**
- **most reusable implementation path**

## Important Rules
- Do not assume the first search hit is the right implementation path.
- Do not search only by event name.
- Do not stop after finding Meta code; continue to locate the actual business success point.
- Prefer stable shared abstractions over scattered local event injections.