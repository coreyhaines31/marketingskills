# Install and event details

Use this reference when the task requires exact bootstrap placement guidance, platform event payload examples, event-name lookup, cross-platform mapping support, or install/event verification details.

## When to read this file

Read this file when you need one of the following:
- exact base bootstrap placement guidance
- the minified base code snippet structure
- TikTok or Meta standard event-name reference
- event payload examples for a specific platform event
- a starter mapping table from business action to platform events
- a checklist for install, mapping, and verification review

If the current task is only about CSP, consent gating, LDU, restricted-data handling, or Advanced Matching / PII, prefer `references/privacy-and-csp.md` first.

## Section map

- `## Bootstrap placement and base code` — TikTok bootstrap guidance and baseline install rules
- `## TikTok vs Meta bootstrap comparison` — dual-platform bootstrap comparison and page-view baseline differences
- `## Standard and custom event guidance` — standard TikTok events plus clearly labeled custom/internal examples
- `## Cross-platform event alignment starter table` — business-action-to-platform-event scaffold
- `## Recommended parameters by event` — parameter guidance and field-name caution notes
- `## Payload examples` — concrete `ttq.track(...)`, `ttq.identify(...)`, and `fbq(...)` examples
- `## Gap review checklist` — what to inspect when comparing TikTok and Meta
- `## Verification checklist` — install and event validation steps

## Bootstrap placement and base code

According to TikTok's install guide, the base code should:
- live near the **top of the `<head>` section**
- be pasted as the **full JavaScript base code block**, not as a partial fragment
- include the loader for `https://analytics.tiktok.com/i18n/pixel/events.js`
- call `ttq.load('<PIXEL_ID>')`
- call `ttq.page()` to emit the base page view event used for installation verification

Treat this as the baseline install reference, not as permission to paste the snippet into arbitrary files. The agent should still choose the correct shared render path in the current repo before applying it.

Use this full base code as the reference snippet and replace only `<PIXEL_ID>`.
Prefer compressed/minified basecode examples in this skill unless the user explicitly asks for expanded formatting:

```html
<script>
!function(w,d,t){w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._v='analytics/0.0.1',ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};ttq.load('<PIXEL_ID>');ttq.page()}(window,document,'ttq');
</script>
```

Important implementation details:
- Keep the full bootstrap intact.
- Replace only the Pixel ID placeholder before shipping.
- `Page View` is already covered by the base code via `ttq.page()`, so do not add a duplicate page-view event unless the app needs explicit SPA navigation handling.
- `ttq.track(...)` should fire where the business action is known to have succeeded.
- For page-load-based conversion events, put the event on the post-action page that only loads after success.
- For click-driven events, do not fire on raw click unless the click itself is the business success moment.
- If a page contains multiple pixels, the guide shows using `ttq.instance('<pixel_id>').track(...)` for pixel-specific event dispatch.

## TikTok vs Meta bootstrap comparison

Use this section when both platforms are in scope and you need a minimal bootstrap comparison.

| Concern | TikTok | Meta | Governance note |
|---|---|---|---|
| Base init call | `ttq.load('<PIXEL_ID>')` | `fbq('init', '<PIXEL_ID>')` | Keep one shared bootstrap location per platform. |
| Base page view | `ttq.page()` | `fbq('track', 'PageView')` | Avoid duplicating page views with SPA route hooks. |
| Placement goal | shared head/layout/app shell | shared head/layout/app shell | Prefer the same render path strategy when both platforms are enabled. |
| Multi-pixel handling | `ttq.instance(...)` patterns may apply | Meta may use multiple init IDs under the same `fbq` setup | Do not assume multi-pixel ownership is equivalent across platforms. |
| Validation | TikTok helper / diagnostics | Meta Pixel Helper / Events Manager diagnostics | Validate each platform locally, then compare behavior together. |

Treat the platforms symmetrically at the governance level even though the SDK calls differ.

## Standard and custom event guidance

### TikTok standard event names

The install guide includes examples such as:
- `AddPaymentInfo`
- `AddToCart`
- `AddToWishlist`
- `ApplicationApproval`
- `Purchase`
- `CompleteRegistration`
- `Contact`
- `CustomizeProduct`
- `Download`
- `FindLocation`
- `InitiateCheckout`
- `Lead`
- `Schedule`
- `Search`
- `StartTrial`
- `SubmitApplication`
- `Subscribe`
- `ViewContent`

## Cross-platform event alignment starter table

Use this as a planning scaffold before editing many files.

| Business action | TikTok event | Meta event | Shared trigger rule | Shared core fields | Platform-specific notes |
|---|---|---|---|---|---|
| Page view | `ttq.page()` | `PageView` | fire at the canonical page-view moment | page context only if used | SPA route behavior may need explicit handling |
| Product detail view | `ViewContent` | `ViewContent` | after product detail is actually rendered | product identity, value, currency | field shapes can differ |
| Add to cart | `AddToCart` | `AddToCart` | after cart mutation succeeds | product identity, quantity, value, currency | keep trigger moment aligned |
| Checkout start | `InitiateCheckout` | `InitiateCheckout` | when checkout truly starts | cart or commerce context | avoid firing too early |
| Payment info added | `AddPaymentInfo` | `AddPaymentInfo` | after payment info is accepted | value, currency, commerce context | confirm exact success point |
| Purchase success | `Purchase` | `Purchase` | after successful order/payment completion | value, currency, order/product context | deduplication and event identity may differ |
| Lead submit | `Lead` | `Lead` | after successful lead capture | shared lead semantics only | custom mapping may still be needed |
| Registration success | `CompleteRegistration` | `CompleteRegistration` | after confirmed registration success | shared registration context | keep semantics consistent |
| Search | `Search` | `Search` | after actual search action or results state | search term | field shape may differ by implementation |

This is a starter table, not a forced parity table. If one platform requires a custom event or a different field contract, record that explicitly rather than hiding the difference.

## Recommended parameters by event

Examples explicitly called out in the TikTok guide:
- `AddToCart`: `content_type`, `quantity`, `description`, `content_id`, `currency`, `value`
- `Purchase`: `content_type`, `quantity`, `description`, `content_id`, `currency`, `value`
- `ViewContent`: `content_type`, `quantity`, `description`, `content_id`, `currency`, `value`
- `Search`: `query`
- `StartTrial`: `currency`, `value`

Field-name caution for agents:
- Use `query` as the documented baseline for TikTok Search in this reference.
- Some broader analytics implementations or shared cross-platform contracts may instead use `search_string`.
- If the current repo already uses `search_string`, or if the latest official docs for the concrete implementation path differ, prefer the current repo conventions plus official docs over blind normalization.
- Do not present both `query` and `search_string` as simultaneous default recommendations.

Treat these parameter lists as recommended baselines, not as permission to invent unavailable values.

## Payload examples

Use these as payload references when validating or implementing events. Replace placeholders with real values from the user's application.

These are examples, not mandatory one-size-fits-all payloads. Prefer the smallest payload that is correct for the actual business action and data available in the repo.

### TikTok identity example

```js
ttq.identify({
  email: "<hashed_email_address>",
  phone_number: "<hashed_phone_number>",
  external_id: "<hashed_external_id>"
});
```

### TikTok ViewContent

```js
ttq.track('ViewContent', {
  contents: [
    {
      content_id: "<content_identifier>",
      content_type: "<content_type>",
      content_name: "<content_name>"
    }
  ],
  value: "<content_value>",
  currency: "<content_currency>"
});
```

### TikTok AddToWishlist

```js
ttq.track('AddToWishlist', {
  contents: [
    {
      content_id: "<content_identifier>",
      content_type: "<content_type>",
      content_name: "<content_name>"
    }
  ],
  value: "<content_value>",
  currency: "<content_currency>"
});
```

### TikTok Search

```js
ttq.track('Search', {
  query: "<search_keywords>"
});
```

### TikTok AddPaymentInfo

```js
ttq.track('AddPaymentInfo', {
  contents: [
    {
      content_id: "<content_identifier>",
      content_type: "<content_type>",
      content_name: "<content_name>"
    }
  ],
  value: "<content_value>",
  currency: "<content_currency>"
});
```

### TikTok AddToCart

```js
ttq.track('AddToCart', {
  contents: [
    {
      content_id: "<content_identifier>",
      content_type: "<content_type>",
      content_name: "<content_name>"
    }
  ],
  value: "<content_value>",
  currency: "<content_currency>"
});
```

### TikTok InitiateCheckout

```js
ttq.track('InitiateCheckout', {
  contents: [
    {
      content_id: "<content_identifier>",
      content_type: "<content_type>",
      content_name: "<content_name>"
    }
  ],
  value: "<content_value>",
  currency: "<content_currency>"
});
```

### TikTok PlaceAnOrder custom example

```js
ttq.track('PlaceAnOrder', {
  contents: [
    {
      content_id: "<content_identifier>",
      content_type: "<content_type>",
      content_name: "<content_name>"
    }
  ],
  value: "<content_value>",
  currency: "<content_currency>"
});
```

Treat `PlaceAnOrder` as a custom/internal example, not as a documented TikTok standard event.

### TikTok CompleteRegistration

```js
ttq.track('CompleteRegistration', {
  contents: [
    {
      content_id: "<content_identifier>",
      content_type: "<content_type>",
      content_name: "<content_name>"
    }
  ],
  value: "<content_value>",
  currency: "<content_currency>"
});
```

### TikTok Purchase

```js
ttq.track('Purchase', {
  contents: [
    {
      content_id: "<content_identifier>",
      content_type: "<content_type>",
      content_name: "<content_name>"
    }
  ],
  value: "<content_value>",
  currency: "<content_currency>"
});
```

### Meta PageView

```js
fbq('track', 'PageView');
```

### Meta ViewContent

```js
fbq('track', 'ViewContent', {
  content_ids: ["<content_identifier>"],
  content_type: "product",
  value: "<content_value>",
  currency: "<content_currency>"
});
```

### Meta AddToCart

```js
fbq('track', 'AddToCart', {
  content_ids: ["<content_identifier>"],
  content_type: "product",
  value: "<content_value>",
  currency: "<content_currency>"
});
```

### Meta InitiateCheckout

```js
fbq('track', 'InitiateCheckout', {
  value: "<checkout_value>",
  currency: "<checkout_currency>"
});
```

### Meta Purchase

```js
fbq('track', 'Purchase', {
  value: "<order_value>",
  currency: "<order_currency>"
});
```

### Meta Lead

```js
fbq('track', 'Lead', {
  value: "<lead_value>",
  currency: "<lead_currency>"
});
```

## Gap review checklist

When TikTok and Meta are both in scope, inspect whether:
- the same business action is tracked on both platforms when it should be
- both platforms fire at the same business success moment
- the core shared fields are present on both platforms where expected
- a difference is intentional or accidental
- one platform is implemented in app code while the other is owned by GTM or another system
- ownership and source of truth are clear
- page-view behavior is locally correct and cross-platform consistent enough for the business need

## Verification checklist

Validate success at two levels.

### Per-platform verification
- TikTok's install guide specifically recommends checking with:
  - **Pixel Helper**
  - **Test Events and Diagnostics**
  - **Debug Mode**
- Meta integrations should be checked with equivalent browser helper and Events Manager diagnostics where available.

### Cross-platform verification
When reviewing install and event behavior, inspect whether:
- the base bootstrap appears in the intended shared output for each platform
- the expected recommended parameters are present for commerce, search, and trial events when applicable
- the event fires exactly once at the real business success point on each platform
- page-view behavior is not duplicated by bootstrap plus SPA navigation hooks
- multiple-pixel pages dispatch to the intended pixel instance where applicable
- TikTok and Meta remain aligned on shared business semantics even when platform-specific fields differ
