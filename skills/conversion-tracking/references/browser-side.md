# Browser-side tracking: the complete free path

Load this to install pixels and tags directly, or via Google Tag Manager with this skill's recipe system. This path is free, self-serve, and complete; for analytics-only destinations it's a sound default, though server-side still recovers the conversions ad blockers stop and gives more accurate numbers. When the destination is an ad platform, state its ceiling honestly, and the ceiling is two things, not one. Roughly 30% of conversions never get credited to the ad (ad blockers, Safari's cookie limits, and cross-device journeys where the ad is clicked on one device and the conversion happens on another; magnitudes in `discrepancies.md`), and what does arrive carries the click ID, IP address and user agent but not the lead's name, email or phone, which is what match quality and Enhanced Conversions run on. Say both, so the user's choice is informed.

Division of labour with the neighbouring references: this file is the on-page code. Account-side configuration (creating conversion actions, datasets, and goals) and per-platform diagnostics live in `google-ads.md`, `meta.md`, and `other-platforms.md`. The moment detection that should trigger everything here lives in `conversion-moments.md`. Generic GTM craft (naming, workspaces, consent mode, debugging) is covered in [analytics](../../analytics/references/gtm-implementation.md) and is not duplicated here.

Whatever is installed below, the non-negotiables apply: fire on confirmed success (never on a button click), and verify arrival in the platform, not just firing in the browser.

## Platform Pixels Overview

| Platform | Pixel/Tag Name | Events API | Key Events |
|----------|---------------|:----------:|------------|
| **Google Ads** | Google tag (gtag.js) | Enhanced Conversions | purchase, sign_up, generate_lead |
| **Meta** | Meta Pixel + CAPI | Conversions API | Purchase, Lead, ViewContent, AddToCart |
| **LinkedIn** | Insight Tag | Conversions API | conversion (URL or event-based) |
| **TikTok** | TikTok Pixel | Events API | Purchase, ViewContent, AddToCart, CompleteRegistration |
| **Twitter/X** | Twitter Pixel | - | Purchase, SignUp, Download |

---

## Google Ads

### Install the Google tag

Add to every page, in `<head>`:

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=AW-XXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'AW-XXXXXXXXX');
</script>
```

Replace `AW-XXXXXXXXX` with your Conversion ID from Google Ads > Tools > Conversions.

### Set up conversion actions

In Google Ads > Goals > Conversions > New conversion action:

| Conversion | Category | Value | Count |
|-----------|----------|-------|-------|
| Purchase | Purchase | Dynamic (order value) | Every |
| Sign up / Lead | Sign-up | Fixed ($X estimated value) | One |
| Demo request | Lead | Fixed ($X estimated value) | One |
| Free trial start | Sign-up | Fixed ($X estimated value) | One |

### Fire conversion events

```javascript
// Purchase
gtag('event', 'conversion', {
  'send_to': 'AW-XXXXXXXXX/CONVERSION_LABEL',
  'value': 99.00,
  'currency': 'USD',
  'transaction_id': 'ORDER-123'
});

// Lead / Sign up
gtag('event', 'conversion', {
  'send_to': 'AW-XXXXXXXXX/CONVERSION_LABEL',
  'value': 50.00,
  'currency': 'USD'
});
```

### Enhanced Conversions

Sends hashed first-party data (email, phone) to improve attribution after cookie restrictions. Enable in Google Ads > Goals > Settings > Enhanced conversions.

```javascript
gtag('set', 'user_data', {
  'email': 'user@example.com',      // auto-hashed by gtag
  'phone_number': '+11234567890'
});
```

### The GTM route and the recipe system

With GTM installed, prefer importing a prebuilt container over hand-building tags. This skill ships importable recipes for 18 form and booking tools, 4 universal patterns, and 6 destinations:

```
python3 ../scripts/build_recipe.py --tool gravity-forms --send google-ads \
    --conversion-id 123456789 --conversion-label AbCdEfGhIj -o import-me.json
```

The output file bundles the tool's detection listener, a custom event trigger on the canonical dataLayer event, a Conversion Linker, and the destination's conversion tag, all wired. Import it in GTM (Admin, then Import Container, choose the existing workspace, choose **Merge** with rename), review the preview diff, test in Preview mode, then publish. Tool slugs and event names are in `../assets/gtm-recipes/event-map.json`; the step-by-step walkthrough with expected outputs and failure modes is in `google-ads.md` Part A.

Without GTM, paste the tool's detection snippet from `../assets/snippets/` into the site head via the platform's custom code setting, then wire the platform tag to the dataLayer event it pushes.

## Meta (Facebook/Instagram)

### Install the Meta Pixel

Add to every page, in `<head>`:

```html
<script>
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', 'YOUR_PIXEL_ID');
  fbq('track', 'PageView');
</script>
```

Replace `YOUR_PIXEL_ID` from Meta Events Manager.

### Standard events

```javascript
// View a product or key page
fbq('track', 'ViewContent', {
  content_name: 'Pro Plan',
  content_category: 'Pricing',
  value: 29.00,
  currency: 'USD'
});

// Lead capture (form submit, demo request)
fbq('track', 'Lead', {
  content_name: 'Demo Request',
  value: 50.00,
  currency: 'USD'
});

// Purchase
fbq('track', 'Purchase', {
  value: 99.00,
  currency: 'USD',
  content_type: 'product',
  contents: [{ id: 'pro-plan', quantity: 1 }]
});

// Add to cart (e-commerce)
fbq('track', 'AddToCart', {
  content_ids: ['SKU-123'],
  content_type: 'product',
  value: 49.00,
  currency: 'USD'
});
```

### Conversions API (CAPI)

Server-side tracking that works alongside the pixel. Required for accurate tracking after iOS 14+ and cookie restrictions.

Set up via:
- **Direct integration** — send events from your server to Meta's API
- **Partner integrations** — Shopify, WooCommerce, Segment, etc. have built-in CAPI support
- **Conversions API Gateway** — Meta's managed solution via AWS

Key: send the same events from both pixel (browser) AND CAPI (server), with a shared `event_id` for deduplication.

### Aggregated Event Measurement (historical note)

AEM's 8-event prioritisation and its domain-verification requirement were removed in late 2023; guides still describing them are out of date. What remains from the iOS 14 era is modeled and delayed iOS conversions, which belong in expectation-setting, not setup. Domain verification is still good practice for account security and required by some features, just not an AEM gate.

## LinkedIn

### Install the Insight Tag

Add to every page, before `</body>`:

```html
<script type="text/javascript">
  _linkedin_partner_id = "YOUR_PARTNER_ID";
  window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
  window._linkedin_data_partner_ids.push(_linkedin_partner_id);
  (function(l) {
    if (!l){window.lintrk = function(a,b){window.lintrk.q.push([a,b])};
    window.lintrk.q=[]}
    var s = document.getElementsByTagName("script")[0];
    var b = document.createElement("script");
    b.type = "text/javascript";b.async = true;
    b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
    s.parentNode.insertBefore(b, s);})(window.lintrk);
</script>
```

### Conversion tracking

LinkedIn supports two methods:

**URL-based**: Fires when someone visits a specific URL (e.g., `/thank-you`).
Set up in Campaign Manager > Analyze > Conversion Tracking > Create Conversion.

**Event-based**: Fire manually on specific actions:

```javascript
window.lintrk('track', { conversion_id: YOUR_CONVERSION_ID });
```

### LinkedIn CAPI

For server-side tracking, LinkedIn offers a Conversions API. Set up via partner integrations (Segment, Tealium) or direct API calls. Deduplicates with the Insight Tag automatically when configured correctly.

---

## TikTok

### Install the TikTok Pixel

Add to every page, in `<head>`:

```html
<script>
  !function (w, d, t) {
    w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];
    ttq.methods=["page","track","identify","instances","debug","on","off",
    "once","ready","alias","group","enableCookie","disableCookie","holdConsent",
    "revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e)
    {t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};
    for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);
    ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;
    n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e};
    ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",
    o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,
    ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},
    ttq._o[e]=n||{};var s=document.createElement("script");
    s.type="text/javascript",s.async=!0,s.src=r+"?sdkid="+e+"&lib="+t;
    var a=document.getElementsByTagName("script")[0];
    a.parentNode.insertBefore(s,a)};
    ttq.load('YOUR_PIXEL_ID');
    ttq.page();
  }(window, document, 'ttq');
</script>
```

### Standard events

```javascript
// View content
ttq.track('ViewContent', {
  content_id: 'pro-plan',
  content_type: 'product',
  content_name: 'Pro Plan',
  value: 29.00,
  currency: 'USD'
});

// Complete registration / sign up
ttq.track('CompleteRegistration', {
  content_name: 'Free Trial'
});

// Purchase
ttq.track('Purchase', {
  content_id: 'pro-plan',
  content_type: 'product',
  value: 99.00,
  currency: 'USD',
  quantity: 1
});

// Add to cart
ttq.track('AddToCart', {
  content_id: 'SKU-123',
  content_type: 'product',
  value: 49.00,
  currency: 'USD'
});
```

### Events API (server-side)

TikTok's Events API works like Meta's CAPI — send the same events from your server for better attribution. Use `event_id` for deduplication with browser pixel events.

### Advanced Matching

Pass hashed user data for better attribution:

```javascript
ttq.identify({
  email: 'user@example.com',       // auto-hashed
  phone_number: '+11234567890'
});
```

---

## GA4 as a destination

Guided setup for recording form and booking conversions in Google Analytics 4, with an optional import into Google Ads. Account steps are guided (tell the user where to click, have them report back). Website and GTM steps the agent may be able to do directly.

**Contents**
- Step 1, check whether GA4 already runs
- Steps 2 to 3, create the property and get the Measurement ID
- Steps 4 to 6, wire the conversion (Path A with GTM, Path B without)
- Steps 7 to 8, mark the key event and verify in DebugView
- Steps 9 to 10, import the key event into Google Ads, then Verification and Common failures

### Setup

**Step 1 - Check whether GA4 already runs on the site**
- **Goal.** Avoid creating a duplicate property or double-installing the tag.
- **Do this.** Fetch or view the site's page source and search for `G-` inside a `googletagmanager.com/gtag/js?id=G-` script, a `gtag('config', 'G-` call, or a `GTM-` container (GTM may be loading GA4 internally). If you cannot check the source, ask the user whether they see website data in analytics.google.com.
- **Expect to see.** Either a G- Measurement ID (GA4 runs, skip to Step 4) or nothing (continue to Step 2). Note whether GTM is present, that decides Path A vs Path B later.
- **On error.** A `G-` string alone can be a false match. Confirm it sits inside a gtag script or config call. If GTM is present, the GA4 tag may live inside the container even though nothing shows in the page source.

**Step 2 - Create the property (skip if GA4 already runs)**
- **Goal.** Get a GA4 property that will hold the site's data.
- **Do this.** Ask the user to sign in at analytics.google.com, click Admin (bottom left), then Create, then Property. Have them enter a property name, reporting time zone, and currency, click Next through the business questions, then Create.
- **Expect to see.** A setup flow that moves straight into choosing a platform for data collection.
- **On error.** No Create button means their account lacks editor access at the account level, someone with admin rights must do this. If they land in an old Universal Analytics screen, they are in the wrong account.

**Step 3 - Add a web data stream and grab the Measurement ID**
- **Goal.** Get the G- Measurement ID that all tagging references.
- **Do this.** In Admin, under Data collection and modification, click Data streams, then Add stream, then Web. Enter the site URL and a stream name, then Create stream. Have the user read back the Measurement ID from the Stream details panel.
- **Expect to see.** A Measurement ID starting with G-, for example G-ABC123XYZ.
- **On error.** If the ID starts with AW- or GTM-, they copied the wrong thing, ask for the value labeled exactly "Measurement ID" on the web stream's details page.

### Wire the conversion

Pick 1 path. Path A when the site runs Google Tag Manager, Path B when it does not. Never both, that double counts.

**Step 4 (Path A): Build and import the GTM file**
- **Goal.** Add a detection tag for the tool plus a GA4 event tag that sends `generate_lead` when the tool's event fires.
- **Do this.** From the repo root run, substituting the tool key from `../assets/gtm-recipes/event-map.json`. `python3 ../scripts/build_recipe.py --tool {tool} --send ga4 --measurement-id G-XXXXXXXXXX -o import-me.json` (add `--event-name` only if the account wants a name other than the default `generate_lead`). Then in GTM click Admin, then Import Container, choose the file, pick the Existing workspace, choose Merge, then Rename conflicting tags, triggers, and variables, and Confirm. If the property is brand new and nothing loads GA4 yet, also add the base tag in GTM (Tags, New, Google tag, enter the G- ID, fire on Initialization, All Pages).
- **Expect to see.** The import preview lists the added tags and 1 trigger, no deletions.
- **On error.** "measurement ID should start with G-" means an AW- or GTM- ID was passed. Deletions in the import preview mean Overwrite was picked instead of Merge, cancel and redo.

**Step 5 (Path A): Preview, test, publish**
- **Goal.** Prove the GA4 event fires on a real submission before going live.
- **Do this.** Click Preview in GTM, connect to the page carrying the form, submit a test entry (ask the user before submitting on production). Confirm the tool's detection event (for example `gravity_form_submitted`, the canonical names live in `../assets/gtm-recipes/event-map.json` and `../assets/snippets/README.md`) appears and the GA4 event tag fired on it. Then Submit and Publish.
- **Expect to see.** The detection event exactly once per submission, and the GA4 event tag marked Fired.
- **On error.** No detection event means the wrong tool key or a form inside a cross-domain iframe, recheck `../assets/snippets/README.md`. The event firing twice means the detection code is installed twice (site head plus GTM), remove one.

**Step 6 (Path B): Paste the snippet and the gtag listener**
- **Goal.** Same outcome without GTM, using the platform's custom code setting.
- **Do this.** Paste the matching `../assets/snippets/{tool}.js` file inside a `<script>` tag in the site's `<head>`, then add the code below. Replace `G-XXXXXXXXXX` with the Measurement ID and `TOOL_EVENT_NAME` with the canonical event name. Skip the first block if GA4 already loads on the site.

```html
<!-- Google tag (gtag.js). Skip if GA4 already loads on this site -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>

<!-- Listener. Sends generate_lead when the detection event is pushed -->
<script>
  (function () {
    window.dataLayer = window.dataLayer || [];
    var originalPush = window.dataLayer.push;
    window.dataLayer.push = function (obj) {
      var result = originalPush.apply(this, arguments);
      if (obj && obj.event === 'TOOL_EVENT_NAME') {
        gtag('event', 'generate_lead');
      }
      return result;
    };
  })();
</script>
```

- **Expect to see.** On a test submission, the browser's Network tab shows a request to google-analytics.com containing `en=generate_lead`.
- **On error.** No request usually means a placeholder was left unreplaced or the event name does not exactly match the canonical name. If the page also runs GTM, stop, this is a Path A site and running both paths double counts.

**Step 7 - Mark generate_lead as a key event**
- **Goal.** Tell GA4 this event is the one that matters, which also makes it importable into Google Ads.
- **Do this.** Send 1 test submission first so the event exists. Then ask the user to open Admin, then under Data display click Events, find `generate_lead` in the table, and switch on the "Mark as key event" toggle. The event can take up to 24 hours to appear in this table (DebugView in Step 8 shows it within seconds, so use that to confirm firing in the meantime).
- **Expect to see.** The toggle on, and `generate_lead` listed under Admin, Data display, Key events.
- **On error.** Event not in the table yet means processing lag, wait up to 24 hours. If it never appears, the tag is not firing, go back to Step 5 or 6.

**Step 8 - Verify in DebugView**
- **Goal.** Watch the event arrive in GA4 in real time.
- **Do this.** Enable debug mode by opening tagassistant.google.com and connecting it to the site (GTM Preview mode also enables it automatically). Then have the user open Admin, then under Data display click DebugView, pick the debug device in the top left, and submit a test on the site.
- **Expect to see.** `generate_lead` appears in the event stream within seconds of the submission.
- **On error.** An empty DebugView means debug mode is not active on the browser doing the testing, or an ad blocker is eating the hits, retry in a clean profile. Events in DebugView but never in reports points to a consent or filtering problem, see `discrepancies.md`.

### Importing the key event into Google Ads

This is sensible only when there is no direct Google Ads conversion tag on the site (Path A or B in `google-ads.md` Part A). A direct Ads tag is faster and more complete, imports arrive 1 to 3 days stale.

**Step 9 - Link GA4 and Google Ads**
- **Goal.** Give Google Ads permission to see the property's key events.
- **Do this.** Ask the user to open GA4 Admin, then under Product links click Google Ads links, then Link, and choose their Google Ads account. They need editor rights on the GA4 property and admin access in Google Ads. Also confirm auto-tagging is on in Google Ads (Admin icon, Account settings, Auto-tagging).
- **Expect to see.** The Ads account listed under Google Ads links.
- **On error.** No accounts offered means the same Google login does not have admin access to the Ads account, link from a login that has both.

**Step 10 - Import the key event in Google Ads**
- **Goal.** Create a Google Ads conversion based on the GA4 key event.
- **Do this.** Ask the user to open Google Ads, click the Goals icon, then Conversions, then Summary, then + Create conversion action (older accounts show + New conversion action), choose Import, then Google Analytics 4 properties, then Web, then Continue. Select `generate_lead` and click Import and continue. Google's docs also offer this flow from inside GA4 under Advertising, Conversion management.
- **Expect to see.** A new conversion action in the Ads Summary table sourced from Google Analytics.
- **On error.** The key event not listed means Step 7 or Step 9 is incomplete, or the event is under 24 hours old. Data taking days to appear is normal, imports lag 1 to 3 days.

**The double-counting trap.** Never leave both an Ads website conversion action AND an imported GA4 key event set as Primary for the same real-world action. Bidding then counts every lead twice. Google usually auto-marks the import as Secondary when it detects the overlap, but verify it in the Summary table. If both exist, keep the direct Ads tag as Primary and the import as Secondary. Details in `google-ads.md` and `discrepancies.md`.

### Verification

Observable checks only:

1. **DebugView.** `generate_lead` appears within seconds of a test submission (Step 8).
2. **Realtime.** Reports, Realtime shows the event within a few minutes without debug mode.
3. **Next day.** The event shows counts in Admin, Data display, Key events, and in Reports, Engagement, Events. GA4 processing takes 24 to 48 hours, so never judge same-day numbers.
4. **Set expectations.** Even a perfect browser-side setup misses roughly 30% of conversions to ad blockers, Safari cookie limits, and cross-device journeys the browser can't connect back to the ad click. And GA4 will never exactly match Google Ads, that is normal. Both are covered in `discrepancies.md`.

### Common failures

For "GA4 and Google Ads don't match" questions and any silent undercounting, work through `discrepancies.md`. For problems on the Ads side of an import (statuses, Primary vs Secondary, attribution), use `google-ads.md`.

## Validating what you installed

The quick first-pass checklist, the full evidence procedure, and the report format live in `audit-playbook.md`; the fired-versus-arrived discipline and per-platform fast feedback surfaces are in `SKILL.md` under Verification discipline. Do not close a setup without them.

### Debugging tools

| Platform | Tool |
|----------|------|
| Google | Google Tag Assistant, Chrome DevTools Network tab |
| Meta | Meta Pixel Helper (Chrome extension), Events Manager Test Events |
| LinkedIn | Insight Tag Validator in Campaign Manager |
| TikTok | TikTok Pixel Helper (Chrome extension), Events Manager |
| All | GTM Preview Mode (if using Google Tag Manager) |
