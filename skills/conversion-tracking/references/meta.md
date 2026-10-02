# Meta

## Part A: setup from zero

Contents:
1. Create the dataset and get your Pixel ID
2. Install the base code (GTM path or direct paste)
3. Fire the Lead event on the conversion moment
4. Test with Test Events
5. Event Match Quality and the Conversions API (the honest ceiling)
6. Verification and common failures

How to use this guide. You usually cannot log into the user's Meta account, so ad-account steps are guided. Give the user the exact clicks and ask them to report back what they see. Website and GTM steps you can often do yourself if you have access.

Terminology. Meta renamed the pixel container. What used to be "a pixel" now lives inside a dataset in Events Manager. The website tag is still called the Meta Pixel and the ID works the same way, so treat Dataset ID and Pixel ID as the same number.

### 1. Create the dataset

**Step 1 - Open Events Manager**
- Goal. Get the user to the screen where datasets are created and listed.
- Do this. Ask the user to go to business.facebook.com, click All tools in the left menu, and open Events Manager. Confirm the correct business portfolio is selected in the top-left corner.
- Expect to see. A Data sources panel, either empty or listing existing datasets. Ask the user to read out any dataset names and IDs already there.
- On error. If they land on a personal ad account with no business portfolio, they need to use the account that owns the ad campaigns. If a dataset for this site already exists, reuse it and skip Step 2. Creating a second dataset for the same site splits your data and invites duplicate installs.

**Step 2 - Create the dataset**
- Goal. Create the container that receives events and generates the Pixel ID.
- Do this. Click the green Connect data button, choose Web, then click Connect. Name the dataset after the website (for example "acme.com website") and finish the creation flow. If Meta asks whether to set up "Conversions API and Meta Pixel" or "Meta Pixel only", choose Meta Pixel only for now. Decline any partner integration offers, since you will install the code directly.
- Expect to see. A new dataset in Data sources.
- On error. If the Connect data button is missing, the user's role lacks permission. They need Manage access to the business portfolio, or an admin can create the dataset for them. If the flow forces a partner integration screen, there is usually a skip or "do it manually" link near the bottom.

**Step 3 - Get the Pixel ID**
- Goal. Capture the exact ID the code snippets need.
- Do this. Open the new dataset and click its Settings tab. Ask the user to copy the Dataset ID and paste it back to you.
- Expect to see. A 15 to 16 digit number.
- On error. If the user pastes a short number or something with letters, they copied the wrong field (often the business ID). The Dataset ID sits at the top of Settings. If 2 datasets exist, confirm which one the ad campaigns optimize toward before wiring anything.

### 2. Install the base code

The base code loads Meta's script on every page and records PageView. It does not record leads yet. Pick 1 install path, never both. A double install is the most common cause of duplicate events.

This is the standard base snippet. Replace YOUR_PIXEL_ID (both places) with the ID from Step 3.

```html
<!-- Meta Pixel base code -->
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
<noscript><img height="1" width="1" style="display:none"
src="https://www.facebook.com/tr?id=YOUR_PIXEL_ID&ev=PageView&noscript=1"
/></noscript>
```

**Step 4 - Install via GTM (Path A)**
- Goal. Load the base code on every page through Google Tag Manager.
- Do this. In tagmanager.google.com, open the site's container. Click Tags, then New. Name it "Meta Pixel - Base Code". Choose Tag Configuration, then Custom HTML, and paste the snippet above without the noscript block (GTM injects with JavaScript, so the noscript part does nothing there). Under Triggering choose All Pages. Save, then click Submit and Publish.
- Expect to see. A new published container version listing the tag. On any page of the live site, the browser's Network tab shows a request to connect.facebook.net.
- On error. The classic miss is saving without publishing. GTM Preview will show the tag while the live site stays silent until Submit is clicked. The other is a second base code already in the site theme or a plugin, which later shows as "pixel activated multiple times" in Pixel Helper. Keep exactly 1.

**Step 5 - Paste into the site head (Path B)**
- Goal. Load the base code sitewide without GTM.
- Do this. Paste the full snippet, including noscript, into the site's global head area using the platform's custom code setting (for example Webflow Site settings under Custom code, WordPress via a header snippet plugin, Framer Site settings under Custom Code). It must load on every page, not just the form page.
- Expect to see. View source on any page shows fbq('init' with the correct ID, and the Network tab shows connect.facebook.net loading.
- On error. Code pasted into a single page's settings instead of the sitewide setting means thank-you pages and other entry points go untracked. Code pasted into the body works but fires late and loses some events, so move it to the head if the platform allows.

### 3. Fire the Lead event on the conversion moment

The base code alone measures nothing that matters. You need fbq('track', 'Lead') to run at the exact moment a form is submitted.

Use the standard Lead event, not a custom name. Meta parks first-seen custom event names as blocked until the account owner approves them, and custom names need an extra custom conversion wrapper before campaigns can optimize on them. Lead works everywhere immediately. This repo ships detection snippets that watch each form tool and push a canonical dataLayer event at the true submission moment. The canonical names live in ../assets/gtm-recipes/event-map.json and snippets/README.md. For example, the Typeform snippet pushes typeform_form_submitted. Install the detection snippet or GTM recipe for the user's form tool first, then connect that event to Meta with 1 of the 2 steps below.

**Step 6 - With GTM, a Custom Event trigger plus a Lead tag**
- Goal. Fire the Lead event whenever the canonical dataLayer event appears.
- Do this. In GTM, click Triggers, then New. Choose Custom Event and set Event name to the tool's canonical event, for example typeform_form_submitted (look yours up in ../assets/gtm-recipes/event-map.json). Name the trigger to match. Then click Tags, then New, choose Custom HTML, and paste this exactly. Attach the trigger you just made, save, Submit, and Publish.

```html
<script>
  fbq('track', 'Lead');
</script>
```

- Expect to see. In GTM Preview, a test form submission shows the canonical event in the left timeline and the Lead tag listed under Tags Fired.
- On error. If Preview shows the event but the tag does not fire, the trigger's Event name does not match the dataLayer string character for character. Copy it from event-map.json rather than retyping. If the event itself never appears in Preview, the detection snippet or recipe is not installed or the form tool was misidentified.

**Step 7 - Without GTM: a small dataLayer watcher**
- Goal. Fire the Lead event from plain code when the detection snippet pushes its event.
- Do this. The repo snippets announce conversions with dataLayer.push, so paste this wrapper into the site head after the Meta base code. Replace the event name with the user's tool from ../assets/gtm-recipes/event-map.json.

```html
<script>
(function () {
  var EVENT_NAME = 'typeform_form_submitted'; // your tool's event name

  window.dataLayer = window.dataLayer || [];
  var originalPush = window.dataLayer.push;
  window.dataLayer.push = function () {
    for (var i = 0; i < arguments.length; i++) {
      var entry = arguments[i];
      if (entry && entry.event === EVENT_NAME && typeof fbq === 'function') {
        fbq('track', 'Lead');
      }
    }
    return originalPush.apply(window.dataLayer, arguments);
  };
})();
</script>
```

- Expect to see. On a test submission, the Network tab shows a request to facebook.com/tr containing ev=Lead.
- On error. If nothing fires, check load order. This wrapper must run after the base code defines fbq and before the form is submitted, so keep all 3 pieces (base code, wrapper, detection snippet) in the head. If Lead fires twice per submission, the site has both this wrapper and a GTM tag doing the same job. Keep 1.

### 4. Test with Test Events

**Step 8 - Run a live test**
- Goal. Watch the events arrive in Meta in real time.
- Do this. Ask the user to open Events Manager, open the dataset, and click the Test events tab. They enter the URL of the page carrying the form and click the button to open it. In that new tab, they submit a test entry on the form. Optionally install the Meta Pixel Helper Chrome extension first, which adds a badge showing what fired on the page.
- Expect to see. A PageView row appears as the page loads, then a Lead row within a few seconds of the submission. A healthy Lead shows the correct Pixel ID, arrives exactly once per submission, and is marked as received from the browser. Pixel Helper shows 1 pixel with the right ID and lists PageView and Lead.
- On error. PageView appears but Lead never does, which means the conversion moment is not wired (revisit Step 6 or 7, and confirm the detection snippet is installed). Or 2 Lead rows appear per submission, which means a double install. Nothing appears at all usually means the test browser runs an ad blocker or the consent banner was silently rejected, so retest in a normal window and accept the banner.

### 5. Event Match Quality and the Conversions API

Event Match Quality (EMQ) is Meta's 1 to 10 score for how well it can match each event to a real person. The user can see it by opening the Lead event's card in Events Manager and clicking View details. Scores update slowly, so allow 24 to 48 hours after changes.

A browser-only Lead like the one built above typically scores 3 to 5. That is expected, not broken. It carries only cookie and browser signals (the _fbp and _fbc cookies, IP, user agent) and no customer information. (These scores are practitioner-reported, not published by Meta.) Raising EMQ requires sending the lead's actual details, such as hashed email and phone, through advanced matching or the Conversions API. Turn on automatic advanced matching in Events Manager first (free); CAPI is the next step, with options in `server-side.md`.

The Conversions API (CAPI) sends the same events server to server, which ad blockers and Safari's cookie limits cannot touch, and it can attach the customer details that lift EMQ. One rule matters above all when pixel and CAPI both run. Each real-world conversion sent from both must share the same event_id and event_name, because Meta deduplicates on that pair only. Mismatched IDs mean every lead counts twice, and "lead" versus "Lead" are different names. A healthy pair shows 1 row marked Deduplicated in Test Events.

The honest boundary. Building CAPI yourself needs a server or a paid vendor, an access token, SHA-256 hashing of normalized customer data, and event_id coordination with the pixel. That is beyond a copy-paste setup, so route this decision through server-side.md rather than improvising it.

Set expectations either way. Even a perfectly configured browser-side setup misses typically 10–30% (depending on audience) of conversions to ad blockers, Safari cookie limits, and cross-device journeys the browser can't connect back to the ad click. Details and magnitudes are in discrepancies.md.

### Verification

Run every check that applies. All are observable, no guessing.

- Test Events shows exactly 1 Lead row per test submission, never 0 and never 2.
- The browser Network tab shows a request to facebook.com/tr with ev=Lead returning a 2xx status on submission.
- Meta Pixel Helper reports exactly 1 pixel, and its ID matches the Dataset ID from Step 3.
- Within 24 to 48 hours, the dataset's Overview tab shows the Lead event with a nonzero count.
- In Ads Manager, the Lead event is selectable as the conversion goal when editing a campaign.

### Common failures

When any check above fails, or events behave strangely after setup, diagnose against Part B of this file (pixel anatomy, the click ID lifecycle, and failure modes M1 to M12).

## Part B: diagnostic reference

**Reading the Diagnostics tab.** Meta surfaces problems here that neither Overview nor Test
Events will show. Two behaviours worth knowing before interpreting what a user reports:

- **Issues age out of view.** If Meta does not re-detect an issue the next day it moves from
  **Active** to **Previously detected**. So "the diagnostics tab is clean" does not mean the
  problem is fixed, it may mean it simply was not seen again yet. Ask them to check
  Previously detected too.
- **Deduplication fails on formatting, not just on missing IDs.** The browser sending
  `ord-123` while the server sends `ord_123` is a mismatch, and so is a case difference. The
  symptom is doubled conversions with both sources apparently configured correctly, which
  reads as an implementation success right up until the numbers are wrong.

### Pixel anatomy
- Script src: `connect.facebook.net/en_US/fbevents.js`
- Init: `fbq('init', '<15-16 digit id>')`; advanced matching adds `{em:..., ph:...}` second arg
- Events: `fbq('track', 'Lead')` standard; `fbq('trackCustom', 'X')`; dedup-ready adds 4th arg `{eventID: '...'}`
- Noscript: `facebook.com/tr?id=<pixel>&ev=PageView&noscript=1`
- Ground truth: 2xx request to `facebook.com/tr/?id=<pixel>&ev=<event>`
- Console: `typeof fbq === 'function'`

### Click ID lifecycle
- `?fbclid=` appended to every ad click → pixel writes first-party cookie `_fbc` = `fb.1.<timestampMs>.<fbclid>` (90d nominal). Only created if pixel loads on the landing page with fbclid present.
- `_fbp` = browser ID cookie, set on first visit (90d).
- Chain breakers: Safari ITP caps JS cookies to 7 days, and 24 HOURS on URLs carrying known tracking params like fbclid; ad blockers strip fbclid; redirect chains drop query params; consent banners blocking the pixel on landing = no _fbc ever.
- Lost _fbc = conversion arrives unattributed → shows as organic; ROAS underreports.

### Failure modes
- **M1. Base code missing/not loading** (VERY COMMON): no activity in Events Manager. Check DOM for `fbq`/`connect.facebook.net`; Network for `/tr`.
- **M2. Wrong pixel ID / wrong Business Manager** (COMMON): pixel fires into someone else's dataset (old agency). Compare `/tr?id=` against Events Manager > Data Sources.
- **M3. CMP blocking the pixel** (VERY COMMON EU/UK): works when you test (you accepted), production volume a fraction of traffic. Test incognito without accepting.
- **M4. Lead event never fires on submit** (VERY COMMON, the #1 lead-gen failure): (a) only base code installed, no Lead call; (b) fires on click but page redirects before /tr completes; (c) iframe embeds - submission happens on third-party domain; (d) GTM trigger tied to changed CSS selector; (e) SPA/multi-step, thank-you is a route change.
- **M5. New custom events "Blocked by Meta"** (OCCASIONAL): first-seen custom event names parked as blocked until owner approves. Events Manager > Settings > Manage Event Blocking. ~20 min to activate after unblocking.
- **M6. Duplicate events** (VERY COMMON): two installs (theme+GTM+plugin); click AND thank-you both firing; Pixel + CAPI without matching event_id. Meta dedups on event_name + event_id ONLY. Case mismatch ("lead" vs "Lead"), regenerated IDs, reused IDs all break dedup. Healthy pair shows one row marked "Deduplicated" in Test Events.
- **M7. CAPI arrives but low Event Match Quality** (VERY COMMON): EMQ 1-10; drivers in order: hashed email, hashed phone (E.164), fbc, fbp, IP+UA, name/zip, external_id. PII must be SHA-256 after normalization (lowercase, trimmed). Missing phone or unforwarded _fbp/_fbc tanks it. Check event card > View Details; allow 24-48h after changes.
- **M8. CAPI plumbing failures** (COMMON): expired token, wrong dataset ID, event_time >7 days old rejected (physical-store events up to 62 days), missing action_source, no user_data at all. Use Test Events with test_event_code.
- **M9. Pixel Helper warnings**: "did not load" = fbevents.js blocked; "activated multiple times" = duplicate; "took too long" = lost on redirect; "new domain sending data" = hijacked pixel (fix with Traffic Permissions).
- **M10. Browser/device attrition** (STRUCTURAL): typically 10–30% below the form backend depending on audience; iOS worst. The core CAPI argument.
- **M11. iOS14/AEM legacy** (mostly resolved): 8-event cap + domain verification requirement dropped (announced May 2023); the AEM tab left Events Manager around mid-2025. Residual: modeled/delayed iOS conversions.
- **M12. Custom event not selectable in Ads Manager** (OCCASIONAL): custom names need a custom conversion wrapper to optimize on. Prefer standard `Lead` event.

### Meta CAPI requirements
Meta's standalone Offline Conversions API shut down on 14 May 2025; offline and CRM events now go through the Conversions API with an `action_source`.

Dataset ID + access token (Events Manager > Settings), POST to `graph.facebook.com/v*/{dataset_id}/events`. Needs event_name, event_time (≤7d), action_source, event_id (dedup), user_data with ≥1 identifier (email/phone SHA-256 lowercased/trimmed; fbp/fbc/IP/UA raw). SMB difficulty: server code or paid intermediary, event_id coordination, hashing rules, token management, dedup verification.

### Test tooling
Test Events (browser + server via test_event_code, shows dedup status), Meta Pixel Helper extension, Events Manager Diagnostics tab.
