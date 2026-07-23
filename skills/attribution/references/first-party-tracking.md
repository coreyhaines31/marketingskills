# First-Party Attribution — The Own-Your-Attribution Runbook

How to instrument and stitch attribution yourself when you control the site/app. This is the build track (Pillar B). It's distilled from real production builds and kept tool-agnostic — **PostHog + SavvyCal are the worked example**, but the pattern maps to any product-analytics tool with `identify()`/merge (Segment, Amplitude, GA4 user-id) and any third-party conversion domain with a metadata passthrough + webhook (Calendly, Cal.com, Stripe Checkout, Typeform).

The core method — closing the `identify()` gap so conversions join to anonymous browsing history — is **adapted from Tessa Kriesel's PostHog attribution approach**. Several of the production refinements that make this operate at scale are also hers, credited inline: the full-touch-path capture that feeds the model track (Step 4), the CRM last-mile with source/confidence/basis and a Paid-vs-Organic read (Step 5), the account rollup, and the "expect ~zero until the stitch is verified, with a campaign-window fallback + backfill" window (Cross-subdomain stitching). Credit where due.

## The one idea

First-party attribution joins **anonymous browsing** to the **eventual conversion**:

```
anonymous visitor          identify() at conversion         breakdown
─────────────────          ────────────────────────         ─────────
distinct_id = anon_uuid    identify(email)                  conversion event
$initial_utm_source=...  → merges anon history        →     by $initial_utm_source
$initial_referrer=...      into person(email)               = "where do customers come from"
```

Everything below serves that join. If `identify()` never fires, every customer looks like they appeared from nowhere — that's *the gap*.

## Step 0 — Audit before you build

The most expensive mistake is rebuilding attribution that already works. Many SaaS apps already `identify()` at signup and already carry first-touch on person profiles. **Check the live data first:**

- Do person profiles carry `$initial_utm_source` / `$initial_referring_domain`?
- Does a conversion event (`Signed up`, `Converted to paid`) break down *cleanly* by channel, or is everything "Direct"?
- Is identity keyed by **email** or by an internal **UUID**? (This changes every guard below.)
- Does cross-subdomain stitching work (marketing site → app.yourdomain.com)?

Only instrument the **specific conversions that are genuinely un-joined**. In one real audit the self-serve funnel was already solved end-to-end; the *only* gap was a booking on a third-party domain. Don't touch what works.

## Step 1 — Identify at each real conversion

At every conversion moment, call `identify()` with a stable id, and set person properties:

```js
// Normalize before use as a distinct_id — analytics tools match exact strings,
// so "Corey@x.com" and "corey@x.com" split into two people otherwise.
export function identifyUser(email) {
  const normalized = email.trim().toLowerCase();
  window.posthog?.identify(normalized, { email: normalized });
}
```

With `person_profiles: 'identified_only'`, this is the moment the person is created and their first-touch props are stamped. Fire it on form success, signup, first purchase — any moment you learn who the anonymous visitor actually is.

## Step 2 — Stitch conversions on a domain you don't own

When the conversion completes on a third-party domain (a booking tool, hosted checkout), you can't run your analytics there. Smuggle the anonymous id through the tool's **metadata passthrough**, then merge it back in the **webhook**.

### 2a — Capture-phase link decorator

One document-level listener rewrites every outbound booking link at click time — no per-CTA edits, and it covers plain clicks, keyboard activation, and middle-click (`auxclick`):

```js
// Append the anonymous distinct_id to any SavvyCal link at click time.
function decorate(e) {
  const anchor = e.target?.closest?.("a[href]");
  if (!(anchor instanceof HTMLAnchorElement)) return;

  let url;
  try { url = new URL(anchor.href); } catch { return; }
  const host = url.hostname;
  if (host !== "savvycal.com" && !host.endsWith(".savvycal.com")) return;

  const distinctId = getPostHogDistinctId();   // anonymous-only — see guard
  if (!distinctId) return;                       // fail closed

  url.searchParams.set("metadata[ph_distinct_id]", distinctId);
  anchor.href = url.toString();
}
document.addEventListener("click", decorate, true);    // capture phase
document.addEventListener("auxclick", decorate, true);
```

For an **inline embed** (e.g. `/demo` with an embedded calendar), pass the same id in the embed's metadata config instead; poll briefly (~2s) for the id on fresh visits, but never block the calendar from rendering.

### 2b — Read the anonymous id safely

The SDK stub queues calls before it loads, so `get_distinct_id()` returns undefined early — fall back to the tool's own cookie:

```js
export function getPostHogDistinctId() {
  if (typeof window === "undefined") return null;

  // Prefer the loaded SDK.
  try {
    if (window.posthog?.__loaded) {
      const id = window.posthog.get_distinct_id();
      if (id) return isAnonymousDistinctId(id) ? id : null;
    }
  } catch {}

  // Fall back to PostHog's cookie before the SDK finishes loading.
  try {
    const prefix = `ph_${POSTHOG_API_KEY}_posthog=`;
    const cookie = document.cookie.split(/;\s*/).find(c => c.startsWith(prefix));
    if (!cookie) return null;
    const parsed = JSON.parse(decodeURIComponent(cookie.slice(prefix.length)));
    return typeof parsed.distinct_id === "string" && isAnonymousDistinctId(parsed.distinct_id)
      ? parsed.distinct_id : null;
  } catch { return null; }
}
```

### 2c — Merge in the webhook

The third-party tool returns your metadata in its `booking.created` (or `checkout.completed`) webhook. Fire an identity merge + a conversion event to your analytics ingestion endpoint:

```js
// Normalize the booking email the same way the app does (Step 1), or the
// booking person will split from the app-side identity for the same user.
const userId = email.trim().toLowerCase();

const events = [];
if (anonId) {
  events.push({
    event: "$identify",
    distinct_id: userId,                                  // the known person
    properties: { $anon_distinct_id: anonId, $set: { email: userId, name } },  // merge the journey
  });
}
events.push({
  event: "discovery_call_booked",
  distinct_id: userId,
  properties: { booking_id, journey_linked: Boolean(anonId) },  // track the fallback rate
});

await fetch(`${POSTHOG_HOST}/batch/`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ api_key: POSTHOG_API_KEY, batch: events }),
  signal: AbortSignal.timeout(3000),   // bound it; never hang the webhook
});
```

When no id survives (link bypassed the decorator, e.g. a booking link inside a generated email/PDF), fall back to **email-only capture** with `journey_linked: false`. You still get the conversion; you just don't get the journey for that one.

**First-touch survival caveat (PostHog specifics):** the `$anon_distinct_id` merge carries the anonymous person's *event* history, but with `person_profiles: 'identified_only'` the anonymous visitor may never have had a person profile, so their `$initial_*` first-touch props aren't guaranteed to land on the merged person. Two robust fixes: call `posthog.createPersonProfile()` client-side *before* the visitor navigates off to the third-party domain (so the profile and its `$initial_*` exist to merge into), **or** capture the first-touch values client-side and pass them through the same metadata passthrough, then re-assert them in the webhook with `$set_once` (`$set_once` never overwrites an existing value, so it's safe). Without one of these, you can get the booking joined to the journey's *events* but a blank `$initial_utm_source` on the person — verify on a real booking. ([posthog-js#1524](https://github.com/PostHog/posthog-js/issues/1524).)

## Step 3 — The guardrails (do not skip)

### Anonymity guard — fail closed

Only ever smuggle the *anonymous* id. After `identify()`, the current `distinct_id` becomes the user's email/UUID — leaking that into a third-party URL, or merging on it in the webhook, folds unrelated people together and leaks PII.

**Pick the guard that matches your identity model — the two are not interchangeable.** The `@`-check below is *only* safe when your app identifies by **email**; do not copy it into a UUID-identity app.

```js
// EMAIL-IDENTITY apps only. True only for ids safe to smuggle: reject
// email-shaped values (an identified email) and cap length.
export function isAnonymousDistinctId(id) {
  return id.length > 0 && id.length <= 100 && !id.includes("@");
}
```

**If the app identifies by UUID, not email**, the `@` check is useless — an identified UUID would pass it and leak. Instead test that the current `distinct_id` still equals the `device_id` (calling `identify()` changes `distinct_id` but leaves `device_id`), and **fail closed** when `device_id` is unreadable:

```js
// UUID-identity variant: only anonymous when distinct_id still == device_id.
function isAnonymous(posthog) {
  const did = posthog.get_distinct_id?.();
  const dev = posthog.get_property?.("$device_id");
  if (!did || !dev) return false;   // ambiguous → treat as identified, send nothing
  return did === dev;
}
```

The rule in one line: **when identity is ambiguous, send nothing.** A missing journey is a data gap; a wrong merge is corruption.

### First-touch data quality — the cheapest big win

Redirects overwrite the true first touch, inflating "Direct"/"Referral" and hiding real acquisition. Exclude these from referrer/channel classification (usually a *settings* change in the analytics tool, not code):

- **OAuth / checkout redirects:** `accounts.google.com`, `login.microsoftonline.com`, `login.live.com`, `checkout.stripe.com`
- **Self / subdomain referrals:** `yourdomain.com`, `app.yourdomain.com`, `auth.yourdomain.com`
- **Dev/internal traffic:** `localhost`, `127.0.0.1`, test accounts

This is the **highest-trust-per-effort** fix in the whole runbook — no deploy, immediate accuracy gain. Do it first.

### Cross-subdomain stitching

Marketing site → app on a subdomain must share **one analytics project** and a **cross-subdomain cookie** (PostHog's `cross_subdomain_cookie` default handles `yourdomain.com` → `app.yourdomain.com`). Verify the journey survives the handoff, or every signup looks like it started at the app.

**Expect near-zero numbers until the stitch is verified in prod — don't panic.** (Production note from Tessa Kriesel.) Before the cross-subdomain stitch is confirmed live, first-party attribution reads *basically nothing* — journeys break at the handoff and everything looks like direct. It flips from ~0 to real numbers the week the stitch actually ships. Two things get you through that window:

- **A campaign-window heuristic fallback.** When a signup has no linked journey, attribute it to the campaign/channel that was live during its signup window (by date + landing page + active UTMs). It's coarse, but it's a real signal while the stitch stabilizes, and it beats a blank.
- **Backfill the pre-stitch cohort.** Everyone who signed up *before* the stitch landed has no journey either. Backfill them with the same campaign-window heuristic (or self-reported, if you have it) so your history isn't a cliff on launch day.

Mark these fallback-attributed conversions with a lower-confidence `basis` (see Step 5) so you never confuse a heuristic guess with a verified journey.

### Harden the webhook

- Verify the provider's **signature** (`SAVVYCAL_WEBHOOK_SECRET` etc.).
- **Validate** the smuggled id (string, ≤100 chars, no `@`) before merging.
- Run the analytics call **after** any business-critical work, bounded by a timeout, **non-fatal** on failure.
- **Log the booking id, never the email.**

## Step 4 — Report

- **Config check:** many tools default to *last-touch* (PostHog's Marketing Analytics scene does). First-party attribution wants first-touch — build insights on `$initial_*` explicitly, or switch the default.
- **The payoff insight:** conversion event broken down by `$initial_utm_source` / `$initial_referring_domain` — "where does every signup/booking come from."
- **Channel → revenue:** conversion event by channel, joined to revenue/MRR person properties. Note: some tools compute revenue props *at ingest* (person-on-events), so historical events may read 0 — use the persons table for current MRR, or tier by plan.
- **Track your own coverage:** the `journey_linked: false` rate tells you how many conversions bypassed the stitch. Watch it after launch.
- **Store the full touch path, not just `$initial_*`.** (Refinement from Tessa Kriesel.) First-touch alone lets you break conversions down by *first* channel — but it can't run the multi-touch models from the interpretation track (SKILL.md §2: position-based, linear, time-decay). If you also persist the **ordered sequence of touches** per person (channel + timestamp for each, e.g. an events-table query or a `touch_path` array on the person), the build track *feeds* the interpretation track: you can now score the same journey six ways on your own data instead of only reading about the models. This is what makes Pillar A and Pillar B shake hands — capture first-touch to ship, capture the full path to model.

## Step 5 — The last mile: get attribution into the CRM

(This whole step is a production refinement from Tessa Kriesel — it's the thing that turned first-party attribution from a dashboard into an operating signal.)

A channel breakdown living in your analytics tool is a *report*. The thing sales and lifecycle actually act on is **attribution written onto the record in the CRM**, per account. Sync it out:

- **A `source` field, plus `source_confidence` and `source_basis`.** Don't write a bare channel — write the channel *and how you know it*. `basis` = `journey_linked` (verified stitch), `self_reported` (survey), or `campaign_window` (the heuristic fallback above); `confidence` = high/medium/low accordingly. Sales treats a high-confidence journey_linked source very differently from a low-confidence guess — give them that context or they'll distrust the whole field.
- **A Paid-vs-Organic read off the medium.** The single most-used cut in practice: derive `paid` vs `organic` from the touch's `utm_medium` (cpc/paid-social/display → paid; organic/referral/email/direct → organic) and stamp it on the record. It's the fastest way for a rep or a nurture flow to know whether this account cost acquisition dollars.
- **Roll up to the account, not just the contact** (B2B) — see the account-rollup note below and in `by-business-type.md`.
- **Hand the record off to revops.** Once the source/confidence/basis + paid/organic live on the account, how pipeline and lifecycle *use* them (routing, lead scoring, nurture branching, revenue attribution reporting) is the **revops** skill's job. This runbook's job is to get a trustworthy, labeled source onto the record.

**Account rollup (B2B).** One org is several people signing up with mixed work *and* personal emails, so person-level attribution scatters the story across records. Roll each person's source up to the **account** (match on email domain, enrichment, or your CRM's contact→account link) and attribute at the account level — that's where the signal has to land to be useful to a salesperson working the whole buying committee.

## Verification checklist

- Click a booking CTA → URL shows `metadata[<id_param>]=<anon-uuid>`.
- In console: `posthog.identify('test@x.com')` → click again → the param must **NOT** appear (guard works). `posthog.reset()` after.
- Hand-POST a webhook `/batch/` payload → expect `{"status":"Ok"}`, person appears merged.
- Post-ship: first real webhook log shows `journey_linked: true`.
- Confirm first-touch survives cross-subdomain: start on marketing site, sign up in app, check the person carries the original `$initial_utm_source`.

## Adapting to other stacks

| Piece | PostHog (worked example) | Generalizes to |
|---|---|---|
| Anonymous id | `distinct_id` / `$device_id` | Segment `anonymousId`, Amplitude `deviceId`, GA4 client_id |
| Merge call | `$identify` + `$anon_distinct_id` | Segment `identify` (known `userId`, same `anonymousId`) + `alias` where needed; Amplitude `setUserId` on the session that still holds the anonymous `deviceId` (the stitch is deviceId↔userId — Amplitude's Identify API only sets user *properties*, it does not merge); GA4 `user_id` on the same `client_id` |
| Ingestion | `/batch/` | Segment HTTP API, Amplitude HTTP v2, GA4 Measurement Protocol |
| Third-party passthrough | SavvyCal `metadata[...]` | Calendly UTM/`salesforce_uuid`, Cal.com metadata, Stripe `client_reference_id`/metadata |
| First-touch props | `$initial_*` | Segment/Amplitude first-touch, GA4 first_user_* dimensions |

The shape never changes: **grab the anonymous id → carry it across the boundary → merge on the far side → break the conversion down by first-touch.**
