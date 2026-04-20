# Privacy, CSP, and data handling

Use this reference when the task involves CSP allowlists, consent behavior, limited-data handling, restricted-data policies, Advanced Matching / PII, or cross-platform privacy governance for TikTok and Meta.

## When to read this file

Read this file when you need one of the following:
- CSP directive guidance for Pixel loading
- consent-gating decisions for bootstrap, events, or identifiers
- Limited Data Use or restricted-data handling guidance
- Advanced Matching / PII requirements and identifier rules
- shared privacy-policy guidance across TikTok and Meta

If the current task is only about bootstrap placement, event mapping, payload examples, or install verification, prefer `references/install-and-events.md` first.

## Cross-platform privacy review lens

When TikTok and Meta are both in scope, review privacy decisions at two levels:
- the shared policy layer
- the platform-specific adapter layer

At the shared policy layer, confirm:
- whether consent is required before loading or sending events
- whether restricted-data handling applies to part or all of the traffic
- whether identifiers may be used for matching
- which system owns the decision: app code, wrapper, GTM, backend, or privacy platform

At the platform-specific layer, confirm:
- how the shared decision is translated into TikTok behavior
- how the shared decision is translated into Meta behavior
- whether one platform is bypassing a stricter rule applied to the other

Do not let one platform silently outrun the other on privacy-sensitive behavior unless that difference is intentional and documented.

## Consent-gating choices

Before implementing privacy-sensitive behavior, decide which layer is gated:
- **Gate load** — do not load the Pixel before consent is granted.
- **Gate send** — load the bootstrap but suppress event dispatch until consent is granted.
- **Gate identify** — allow non-PII tracking where policy permits, but withhold `ttq.identify(...)` or other matching signals until consent/legal basis exists.

Document which gate is in use and where that decision is enforced.

When TikTok and Meta are both in scope, prefer one shared policy decision first, then map it into each platform adapter.

## CSP review workflow

If the site has Content Security Policy, check whether TikTok Pixel resources and reporting endpoints need allowlisting.

Inspect directives such as:
- `frame-src`
- `script-src`
- `img-src`
- `connect-src`

The TikTok CSP guide shows that integrations may need allowlist entries such as:
- `frame-src`: `bytedance:` and `sslocal:`
- `script-src`, `img-src`, and `connect-src` entries such as:
  - `analytics.tiktok.com`
  - `analytics-ipv6.tiktokw.us`
  - `ads.tiktok.com`

Guidance:
- Patch only the minimum required directives.
- Explain exactly which directive blocks the Pixel.
- Separate confirmed changes from items the user's security team still needs to review.
- If the actual blocked resources differ from the guide, trust the current official docs and observed browser errors.

## TikTok vs Meta privacy decision matrix

Use this as a minimal governance matrix when both platforms are in scope.

| Concern | Shared governance question | TikTok note | Meta note |
|---|---|---|---|
| CSP / resource loading | Which directives or domains are actually blocked? | Review TikTok resource allowlists and observed errors. | Review Meta resource allowlists and observed errors. |
| Consent gating | Should load and send behavior be gated the same way on both platforms? | Decide whether to gate bootstrap, events, or identifiers. | Decide whether to gate bootstrap, events, or identifiers. |
| Restricted-data handling | Does restricted-data logic apply to all traffic or only a subset? | TikTok LDU can be pixel-wide or event-level. | Meta may require its own restricted-data or data-processing controls. |
| Matching / identifiers | Are email, phone, or external identifiers allowed at all? | `ttq.identify(...)` must follow consent and first-party rules. | Meta matching must follow the same shared privacy decision, even if implementation differs. |
| Shared policy source | Where is the canonical privacy rule defined? | Prefer adapters that consume a shared policy signal. | Prefer adapters that consume the same shared policy signal. |

Do not assume the TikTok implementation automatically defines the right Meta implementation, or vice versa.

## Limited Data Use (LDU)

Before enabling data sending, explicitly determine whether the user has LDU obligations.

Ask:
- Do they operate in regions or scenarios where LDU applies?
- Is there existing backend/frontend logic that marks restricted traffic?
- Should LDU be decided by region, consent state, account type, or another business rule?

Implementation details from the TikTok guide:
- TikTok's LDU guide describes the feature as support for certain U.S. state privacy opt-out scenarios; verify the currently covered regions in the official doc before implementation.
- There are two implementation modes:
  - enable LDU for all events under the pixel via `ttq.load('<PIXEL_ID>', { limited_data_use: true })`
  - enable LDU per event via `ttq.track('Purchase', { limited_data_use: true })`
- Prefer per-event LDU if only part of the traffic is restricted.
- Prefer pixel-wide LDU only if the user's policy truly applies to all events under that pixel.

Cross-platform governance note:
- If TikTok and Meta are both in scope, first define whether restricted-data logic belongs to a shared policy layer.
- Then document how each platform adapter expresses that policy.
- If the repo only supports restricted-data handling on one platform, call out the asymmetry explicitly.

## Advanced Matching / PII

Advanced Matching needs explicit approval.

Ask before enabling it:
- Do they want to send `email`, `phone_number`, `external_id`, or other identifiers?
- Where do those values come from?
- Are they already normalized or hashed?
- Do they have consent to use them for advertising measurement?

How to decide whether the advertiser can use PII:
- Only use identifiers the advertiser already collects through its own first-party flows, such as signup, login, checkout, lead forms, CRM-backed authenticated profiles, or another user-approved account/session flow.
- If the advertiser cannot point to a legitimate first-party source plus consent/legal basis, do not enable Manual Advanced Matching.
- Prefer values already available in the application state, session, checkout data, or confirmed form submissions; do not invent, scrape, or infer identifiers.
- The official guide discusses `external_id`, not `external_pii`. If the user says `external_pii`, clarify whether they actually mean a first-party external user identifier.

How the advertiser can obtain each supported identifier:
- `email`: from login, signup, checkout, newsletter, or other first-party forms/profile data the advertiser already owns.
- `phone_number`: from checkout, signup, support/contact, or profile flows where the advertiser already collected the user's phone.
- `external_id`: a first-party user or customer identifier controlled by the advertiser, for example an internal account ID or CRM/customer ID.

Implementation details from the TikTok guide:
- For manual Advanced Matching, place `ttq.identify(...)` directly before the related `ttq.track(...)` call.
- Supported identifiers shown in the guide include `email`, `phone_number`, and `external_id`.
- Raw `email` and `phone_number` values can be passed and hashed client-side by TikTok, but only if the advertiser's privacy policy, consent state, and legal basis allow that path.
- If passing hashed values manually, follow the guide's field-specific hashing rules; the referenced guide specifies **SHA-256**.
- Email hashing requirements in the guide: lowercase before hashing and trim leading/trailing spaces.
- Phone number requirements in the guide: normalize to **E.164** format before hashing.
- External ID requirements in the guide: trim leading/trailing spaces before hashing.

Cross-platform governance note:
- If TikTok and Meta are both in scope, first decide whether matching is allowed at the shared policy layer.
- Then decide whether both platforms should receive identifiers, or only one should.
- Keep a non-PII path available even if matching is postponed or enabled only on one platform.

## Shared policy and platform adapters

Prefer this governance model when both platforms are present:
1. define the shared privacy rule once
2. identify the source of truth for that rule
3. map the rule into TikTok behavior
4. map the same rule into Meta behavior
5. document any intentional platform-specific differences

If the repo already has a consent manager, privacy abstraction, or GTM-owned privacy layer, reuse it instead of inventing a new parallel policy path.

## Reference pattern for Manual Advanced Matching

```javascript
ttq.identify({
    email: '0c7e6a405862e402eb76a70f8a26fc732d07c32931e9fae9ab1582911d2e8a3b',
    phone_number: '9f7ec22d72092cd3c0b58726ed9c2d91b92e51a3f29837508fb2948bb22dd2fd',
    external_id: '936a185caaa266bb9cbe981e9e05cb78cd732b0b3280eb944412bb6f8f8f07af',
})

ttq.track('CompleteRegistration')
```

## Rules

- Never enable PII reporting by default.
- Reuse existing user/profile/session data only if the user asked for it and privacy rules allow it.
- Keep the non-PII bootstrap path available even if Advanced Matching is postponed.
- Do not bypass the user's consent or legal review process.
- Only emit `ttq.identify(...)` on pages/events where the needed identifiers are truly available.
- If TikTok and Meta are both in scope, check whether one platform is receiving identifiers under a rule that the other platform does not share.
