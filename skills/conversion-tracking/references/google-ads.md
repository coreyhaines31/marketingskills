# Google Ads

## Part A: setup from zero

Guided setup for wiring a form or booking tool to Google Ads. The agent usually cannot log into the user's ad account, so account steps say exactly where to click and what to report back. Website and GTM steps the agent may be able to do directly.

**Contents**
- Before you start (pick Path A or Path B)
- Path A, with Google Tag Manager (Steps 1 to 5, recommended)
- Path B, no Google Tag Manager (Steps 6 to 8)
- Step 9, auto-tagging check (both paths)
- Enhanced conversions note, then Verification and Common failures

### Before you start

You need three things:

- Access to the Google Ads account (the user has this, you guide them).
- The form or booking tool in play. This skill has detection recipes for 18 form and booking tools, plus 4 universal patterns (phone clicks, file downloads, thank-you pages, and generic AJAX forms). The full list with canonical dataLayer event names lives in `../assets/gtm-recipes/event-map.json` and `../assets/snippets/README.md`. Example, Gravity Forms pushes `gravity_form_submitted`. Supported tools are Calendly, Contact Form 7, Divi Forms, Elementor Forms, Fluent Forms, Formidable Forms, Forminator, Framer Forms, Gravity Forms, Jotform, Ninja Forms, Tally, Typeform, Webflow Forms, Wix Forms, Wix Bookings, WPForms, and WS Form.
- A decision on the install path. Check the site's page source for a `GTM-` container snippet, or ask the user. If GTM is installed, use Path A. If not, use Path B. Never do both, that double counts.

Also do a quick duplicate pre-check before installing anything. Fetch the page source and look for an existing `AW-` ID, a `gtag('event', 'conversion'` call, or an existing Google Ads conversion tag inside the GTM container. If the same real-world action is already being tracked, fix or replace that setup rather than adding a second one on top. Two tags for one form is the classic overcounting setup.

How the pieces fit, so you can explain it to the user:

1. The detection code watches the form and pushes a dataLayer event the moment someone actually submits.
2. The Google Ads conversion tag hears that event and reports a conversion using the Conversion ID and Label.
3. The Conversion Linker (Path A) or the Google tag (Path B) stores the gclid, the click ID Google appends to ad URLs when auto-tagging is on.
4. Google matches the conversion to the stored click ID, and the conversion shows up against the campaign that earned it.

Values to collect from the user along the way, so nothing stalls mid-flow:

- The Conversion ID and Conversion label (Step 2).
- Whether auto-tagging is on (Step 9).
- The conversion action's Status column reading, any time verification is in question.

### Path A, with Google Tag Manager (recommended)

End state, GTM does all the listening and firing, and nothing gets pasted into the site's code. The user does Steps 1 and 2 in their Google Ads account and reports 2 values back. The agent can usually do Steps 3 to 5 itself if it has GTM access, otherwise guide the user through them.

**Step 1 - Create the conversion action in Google Ads**
- **Goal.** Create a Website conversion action so Google Ads has something to record submissions against.
- **Do this.** Ask the user to sign in to Google Ads, click the Goals icon in the left menu, then Conversions, then Summary, then click + Create conversion action (older accounts show + New conversion action). Choose Website. If Google asks for the website address and scans the site, skip the "Automatically without code" suggestions and choose to add a conversion action manually. Set the category to Submit lead form (use Book appointment for Calendly or Wix Bookings), give it a clear name like "Lead form submitted", leave value off or use one value per conversion, set counting to One, then save.
- **Expect to see.** The new action appears under Goals, Conversions, Summary with status "Unverified". That status is normal at this point.
- **On error.** If the user only sees a simplified screen with no Goals menu, the account is in Smart Mode and needs switching to expert mode first. If the only option offered tracks page visits by URL, they went down the "Automatically without code" route, which counts page loads rather than real submissions. Go back and add the action manually.

**Step 2 - Grab the Conversion ID and Conversion Label**
- **Goal.** Get the 2 values the tag needs, the Conversion ID (the digits after AW-) and the Conversion Label.
- **Do this.** Ask the user to click the new conversion action's name in the Summary table, scroll to the "Tag setup" section, and click "Use Google Tag Manager". Have them read back the Conversion ID and Conversion label shown there. The "Install the tag yourself" option shows the same 2 values inside the code, after `AW-` and after the slash in `send_to`.
- **Expect to see.** A Conversion ID that is all digits (like 123456789) and a Conversion label that is a short mixed-case string (like AbCdEfGhIj).
- **On error.** No "Tag setup" section usually means the action was created as a URL-based or imported action, which has no label. Recreate it manually per Step 1. If the ID they read starts with AW-, just strip that prefix, the script also strips it for you.

**Step 3 - Build the import file**
- **Goal.** Produce 1 GTM container file that bundles the tool's detection tag, the Google Ads conversion tag, and a Conversion Linker tag.
- **Do this.** Run this, substituting the tool key from `../assets/gtm-recipes/event-map.json` and the 2 values from Step 2. `python3 ../scripts/build_recipe.py --tool {tool} --send google-ads --conversion-id {id} --conversion-label {label} -o import-me.json` The script uses only the Python standard library and can run from any folder, paths resolve relative to the script file.
- **Expect to see.** The script prints "wrote import-me.json" plus which dataLayer event it detects and where it sends.
- **On error.** "invalid choice" on --tool means the tool key is misspelled or unsupported, check the 22 keys in `../assets/gtm-recipes/event-map.json`. A complaint about missing --conversion-id or --conversion-label means Step 2 values were not passed.

**Step 4 - Import the file into GTM**
- **Goal.** Load the 3 tags and their trigger into the site's existing GTM container without touching anything already there.
- **Do this.** In Google Tag Manager open the site's container, click Admin, then Import Container. Choose the import-me.json file, pick the Existing workspace (usually Default Workspace), choose Merge, then Rename conflicting tags, triggers, and variables. Review the preview dialog and click Confirm.
- **Expect to see.** The preview dialog lists roughly 3 added tags and 1 added trigger, no deletions. After confirming, the workspace shows the new tags.
- **On error.** If the container already had a Conversion Linker tag, the import creates a renamed duplicate. Keep 1 and delete the other. If the preview shows deletions, stop, Overwrite was selected instead of Merge.

**Step 5 - Preview, test, publish**
- **Goal.** Prove the tags fire on a real submission before making them live.
- **Do this.** In GTM click Preview, connect to the page carrying the form, and submit a test entry (ask the user first before submitting on a production site). In the Tag Assistant window, look for the tool's event (for example `gravity_form_submitted`) in the left timeline and confirm the "Google Ads Conversion" tag fired on it. Then go back to GTM and click Submit, then Publish.
- **Expect to see.** The detection event appears exactly once per submission, and the conversion tag shows as Fired.
- **On error.** If the detection event never appears, the form may sit inside an iframe from another domain, or the tool guess was wrong. Recheck against the table in `../assets/snippets/README.md`. If the event appears twice, the detection snippet is installed twice (pasted in the site head and imported into GTM), remove one.

### Path B, no Google Tag Manager

End state, 3 pieces of code sit in the site's `<head>` via the platform's custom code setting. The detection snippet, the Google tag, and a small listener that fires the conversion. No GTM account needed.

**Step 6 - Create the conversion action and grab the IDs**
- **Goal.** Same as Path A, get a conversion action plus its Conversion ID and Conversion Label.
- **Do this.** Follow Steps 1 and 2 above exactly. On the Tag setup screen, "Install the tag yourself" is the natural choice here, and both values are visible inside the code it shows.
- **Expect to see.** A conversion action with status "Unverified", plus the ID and label written down.
- **On error.** Same failure modes as Steps 1 and 2.

**Step 7 - Install the detection snippet**
- **Goal.** Make the site announce each submission as a dataLayer event.
- **Do this.** Copy the matching `../assets/snippets/{tool}.js` file from this repo and paste it inside a `<script>` tag in the site's `<head>`, using the platform's custom code setting (for example WordPress header scripts, Webflow custom code, Framer custom code).
- **Expect to see.** After a test submission, running `window.dataLayer.filter(e => e.event)` in the browser console shows the tool's event (for example `typeform_form_submitted`) exactly once.
- **On error.** Nothing in the dataLayer means the snippet is not on the page carrying the form, or the wrong tool's snippet was used. The event firing twice means it was installed twice.

**Step 8 - Add the Google tag and the conversion listener**
- **Goal.** Load Google's tag and fire a conversion whenever the detection event appears.
- **Do this.** Paste this into the site's `<head>`, after the detection snippet is also in place. Replace `AW-XXXXXXXXX` with AW- plus the Conversion ID, `YYYYYYYYYYY` with the Conversion Label, and `TOOL_EVENT_NAME` with the canonical event from `../assets/gtm-recipes/event-map.json`.

```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=AW-XXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'AW-XXXXXXXXX');
</script>

<!-- Conversion listener. Fires when the detection event is pushed -->
<script>
  (function () {
    window.dataLayer = window.dataLayer || [];
    var originalPush = window.dataLayer.push;
    window.dataLayer.push = function (obj) {
      var result = originalPush.apply(this, arguments);
      if (obj && obj.event === 'TOOL_EVENT_NAME') {
        gtag('event', 'conversion', {
          'send_to': 'AW-XXXXXXXXX/YYYYYYYYYYY'
        });
      }
      return result;
    };
  })();
</script>
```

- **Expect to see.** On a test submission, the browser's Network tab shows a request to googleadservices.com or google.com containing `/pagead/conversion/` with the ID and label.
- **On error.** No conversion request usually means a placeholder was left unreplaced (search the page source for XXXXXXXXX) or the event name does not match the canonical name exactly. A 400 style response often means the label is wrong.

### Auto-tagging check (both paths)

**Step 9 - Confirm auto-tagging is on**
- **Goal.** Make sure every ad click carries a gclid, the click ID Google uses to match a conversion back to the ad. Without it, tagged conversions cannot be credited.
- **Do this.** Ask the user to click the Admin icon in Google Ads, then Account settings, then the Auto-tagging section, and confirm the box "Tag the URL that people click through from my ad" is checked. If not, check it and click Save.
- **Expect to see.** The box checked. Clicking one of their own ads lands on a URL containing `?gclid=`.
- **On error.** If the box is on but landing URLs have no gclid, the site is stripping URL parameters through a redirect. See the click ID chain checks in Part B below and in `audit-playbook.md`.

### Enhanced conversions

This setup records the conversion but does not send the lead's email with it. The free next step is browser-side: enable enhanced conversions on the conversion action and supply user-provided data in GTM (automatic detection, a CSS selector, or a dataLayer variable) or the Google tag. It rides the same blocker and cookie losses as the tag. Server-side paths (an uploader, a managed tool, or your own backend send) are the alternative where blockers or iframes keep the browser from seeing the email. See `server-side.md` if match quality matters to the account.

### Verification

Observable checks only, in order:

1. **Tag Assistant.** Open tagassistant.google.com, connect to the site, submit a test, and confirm the Google Ads conversion tag fires on the detection event.
2. **Status column.** In Goals, Conversions, Summary, the action shows "Unverified" at first. That is normal for up to 48 hours, occasionally 72. It should then move to "Recording conversions". "No recent conversions" after that still means the tag is healthy, just quiet.
3. **Troubleshoot link.** Hovering a stuck "Unverified" or "Tag inactive" status shows a Troubleshoot link that launches Tag Assistant against the site. Use it before assuming the worst.
4. **Real ad click test.** Website conversions only count after an ad click. A bare test submission proves the tag fires but will not appear as a conversion. Click a live ad, submit, then check the next day.
5. **The 3 day rule.** Never judge a reporting window that ends less than 3 days ago. Conversions post against the click date and keep arriving late, so recent totals always grow retroactively.
6. **Duplicate scan.** In the Summary table, confirm only 1 Primary conversion action exists for this real-world action. If a GA4 key event import for the same form also sits at Primary, demote one to Secondary or bidding counts every lead twice (details in Part B below).
7. **Set expectations.** Even a perfect browser-side setup misses typically 10–30% (depending on audience) of conversions to ad blockers, Safari cookie limits, and cross-device journeys (clicked on a phone, converted on a laptop). That gap is environmental, not a bug. See `discrepancies.md`.

### Common failures

For anything that goes wrong after setup (statuses stuck on Unverified, Tag inactive dates, double counting, consent mode killing conversions, gclid stripping), work through the failure catalog in Part B below.

## Part B: diagnostic reference

Compiled August 2026 from Google Ads Help documentation, practitioner blogs (Analytics Mania, Adalysis, Adnan Agic, PPC Land, Cometly, TagFly, Elevar, ConversionTracking.io), and community threads.

**Fix assets.** From-zero setup steps are in Part A above. Missing or wrong triggers are usually fixed by this skill's tested assets: `../assets/snippets/`, `../assets/gtm-recipes/`, merged and ID-injected by `../scripts/build_recipe.py`.

### Part B.1: Diagnostic Surfaces (check these first, in this order)

### 1.1 Conversion action status - Goals > Conversions > Summary

The "Status" column per conversion action is the single highest-value diagnostic signal:

| Status | Meaning | Implication |
|---|---|---|
| **Unverified** | Google has never seen the tag fire for this action. Normal for a few hours (up to 48h) after setup; if it persists for days, the tag was never installed, has the wrong ID/label, or fires on a page nobody visits | Broken setup - tag never fired once |
| **Recording conversions** | Tag seen and conversions recorded in last 7 days | Healthy |
| **No recent conversions** | Tag IS detected, but zero conversions in last 7 days | Tag works; either no conversions actually happened, low volume, or the event snippet page is unreachable. Not necessarily broken |
| **Tag inactive** / **Inactive** | Google no longer sees the tag AND no conversions in 7 days. UI shows last-detected date and last-conversion date | Tag was removed/broken on a specific date - correlate with site redesigns, GTM publishes, plugin updates |
| **Needs attention** | Active but has errors (commonly enhanced-conversions data problems) | Partially working; open Diagnostics |
| **Removed** | Conversion action deleted/disabled in the account | Re-enable the action |

**Three more statuses the table above misses.** Harvested from Google's own status
documentation, and each means something different from the four above:

- **Misconfigured.** Conversions have stopped recording *entirely* because of a setup error
  or a broken tag. This is the most urgent status there is and it is not the same as
  Unverified: Unverified means never seen, Misconfigured means it worked and now does not.
- **Awaiting conversions.** No conversions in 7 days, expected when the action was created
  under 48 hours ago, the campaigns are paused, or traffic is too low to produce one. Do not
  diagnose a tag problem from this without first checking whether campaigns are even running.
- **Removed (deleted or archived).** Distinct from the disabled "Removed" row above: the action
  was manually deleted or archived. Nothing is broken; someone did this on purpose, possibly a
  previous agency. Ask before recreating it.

Separately, Tag Diagnostics grades tags **excellent / good / needs attention / urgent**, and
there are three distinct enhanced-conversions diagnostic reports (web tag, web API, and
leads). A user saying "diagnostics says there's a problem" could mean any of them, so ask
which screen they are looking at before interpreting it.

The **last detected date** on Tag inactive dates the breakage - ask "what changed on the site/GTM/plugins on that date?"

### 1.2 Built-in Troubleshoot flow / Tag Assistant
Hovering an "Unverified"/"Tag inactive"/"Needs attention" status shows a **Troubleshoot** link that launches Google Tag Assistant (tagassistant.google.com).

### 1.3 Diagnostics tab (enhanced conversions)
Goals > Summary > Diagnostics: grades Excellent / Good / Needs attention / No recent data / Urgent, plus alerts (missing user_data fields, formatting errors, low match rate).

### 1.4 Auto-tagging setting
Admin > Account settings > Auto-tagging - must be ON for gclid attribution and any offline/CRM import.

### 1.5 Other account-level surfaces
- "Maintain your Google tag" - surfaces "Website redirects are losing click data" warning
- Conversion action settings: count (One/Every), click-through window (default 30d), attribution model, Primary/Secondary
- Segment > Conversions > Conversion action on campaign tables - reveals WHICH action generated the numbers (catches double counting)
- "by conv. time" columns - conversions are otherwise reported against click date, not conversion date

### Part B.2: Tag anatomy

### 2.1 Google tag (gtag.js)
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=AW-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'AW-XXXXXXXXXX');
</script>
```
IDs: `AW-` Google Ads, `G-` GA4, `GTM-` container, `DC-` Floodlight. A page with only `G-`/`GTM-` can still work if Ads conversions run through GTM - check container contents before declaring missing.

### 2.2 Event snippet
```html
gtag('event', 'conversion', {'send_to': 'AW-XXXXXXXXXX/AbCdEfGhIj0123456789', 'value': 0.0, 'currency': 'USD'});
```
`send_to` = `AW-CONVERSION_ID/CONVERSION_LABEL`. Google offers "page load" (thank-you page) or "click" (`gtag_report_conversion(url)`) variants.

### 2.3 GTM pattern
`GTM-XXXXXXX` snippet in head + noscript iframe. Inside: a Google Ads Conversion Tracking tag (ID + Label) plus a Conversion Linker tag on All Pages.

### 2.4 Network requests that prove a conversion fired
- Classic ping: `googleadservices.com/pagead/conversion/{ID}/?...label={LABEL}`
- Consent-aware paths: `google.com/pagead/1p-conversion/...` and `.../ccm/collect`
- `gcs` param encodes consent (`G111` granted, `G100` denied); `gcd` = Consent Mode v2 state. `gcs=G100` on the ping = conversion modeled at best, not recorded.

### 2.5 gclid lifecycle
1. Auto-tagging appends `?gclid=` at click time (iOS/privacy contexts use `gbraid`/`wbraid`)
2. gclid must survive every redirect to the tagged page
3. Google tag / Conversion Linker stores it in first-party cookies: `_gcl_aw` (gclid), `_gcl_gb` (wbraid/gbraid), `_gcl_dc` (dclid). Linker must fire on ALL pages, before conversion tags.
4. Event snippet reads the cookie and sends it with the ping
5. Google keeps gclid 90 days; offline imports referencing older clicks fail. Conversion must land inside the action's click window (default 30d).

Chain test: visit `landingpage?gclid=TEST123` → confirm survives redirects → check cookies for `_gcl_aw` containing TEST123 → submit form → look for conversion ping in Network.

### Part B.3: Failure catalog

### Category A - Tag missing or never firing
- **A1. Tag never installed / wrong pages** (VERY COMMON): status stuck Unverified; spend with zero conversions ever. Check landing AND thank-you page source for `AW-`/`GTM-`.
- **A2. Tag removed during redesign/migration/theme or plugin update** (VERY COMMON): was Recording, now Tag inactive; conversions flatline on a date. Correlate last-detected date with deploys.
- **A3. GTM changes never published** (VERY COMMON): tags exist only in an unpublished workspace draft. Check GTM Versions.
- **A4. Wrong Conversion ID or Label** (COMMON): GTM Preview shows tag firing, Ads records nothing. Compare GTM values against the action's Tag setup character-for-character.
- **A5. Tag from the wrong account / MCC confusion** (OCCASIONAL, agency-specific): conversions land in a previous agency's account, or MCC cross-account tracking conflicts. Compare on-page AW- ID with the account's conversion tracking ID.
- **A6. Performance/caching layers blocking the tag** (OCCASIONAL): Cloudflare Rocket Loader/APO, WP Rocket JS-delay, CSP blocks. Console errors; no request to googletagmanager.com.

### Category B - Tag fires but the conversion moment is missed (heart of lead-gen audits)
- **B1. GTM Form Submission trigger doesn't fire** (VERY COMMON): AJAX forms without standard submit events, misconfigured validation/conditions, broken dataLayer. Fix: thank-you pageview, Element Visibility on success message, platform callback, or dataLayer push.
- **B2. Form in a cross-origin iframe** (VERY COMMON): Typeform, Calendly, HubSpot, Jotform. Parent GTM can't see submissions; iframe can't see parent's `_gcl_aw`. Fix: postMessage listeners, provider redirect to first-party thank-you, or capture gclid to hidden field + server-side import.
- **B3. Conversion fires on a page that redirects before ping completes** (COMMON): browser kills the request in flight. Fix: thank-you page firing or gtag_report_conversion callback.
- **B4. Thank-you page URL changed / trigger mismatch** (VERY COMMON): trigger matches `/thank-you`, page became `/thanks`; trailing-slash or query-string breaking "equals" conditions.
- **B5. No thank-you page at all, inline success message** (COMMON): Element Visibility trigger or provider callback needed.
- **B6. Overcounting: wrong page / per-pageview / double implementation** (COMMON): snippet on every page; thank-you reload recounts (Count=Every); hardcoded gtag AND GTM tag both firing; website tag AND imported GA4 key event both Primary.

### Category C - Click ID / attribution chain broken
- **C1. Auto-tagging disabled** (COMMON): tag verified, conversions near zero; no gclid in landing URLs; GA4 shows Ads traffic as organic.
- **C2. gclid stripped by redirects** (VERY COMMON, invisible): http→https, non-www→www, trailing slash, geo redirects, shorteners. Test: `curl -IL "https://landingpage?gclid=TEST123"` and watch each hop. Fix: final URLs in ads, or forward query strings (Apache QSA, Nginx `$is_args$args`).
- **C3. Conversion Linker missing** (COMMON in GTM setups): no `_gcl_aw` cookie; heavy undercount especially Safari.
- **C4. Cross-domain journey** (COMMON): `_gcl_aw` scoped to first domain. Fix: Linker cross-domain linking or pass gclid in URL.
- **C5. gclid mutated** (RARE): CMS/scripts lowercase or truncate the gclid - Google treats as different ID.
- **C6. No ad click in the test path** (COMMON false alarm): website conversions only count after an ad click. Direct test submissions never appear in Ads.

### Category D - Consent & privacy
- **D1. Consent Mode misconfigured** (VERY COMMON in EEA/UK): conversions drop 30-90% after CMP install; CMP never flips ad_storage/ad_user_data to granted. Confirm: Tag Assistant Consent tab; `gcs=G100` persisting after accept. Since March 2024 Google requires ad_user_data/ad_personalization for EEA; stricter enforcement from July 2025 has been widely reported (not a formal Google announcement).
- **D2. Consent denied traffic + modeling gaps**: denied conversions dropped or modeled; Ads and GA4 model independently. URL passthrough (`url_passthrough: true`) partially recovers.
- **D3. Ad blockers / ITP baseline loss** (ALWAYS PRESENT): typically 10–30% never track client-side, depending on audience. Mitigate with enhanced conversions / server-side.

### Category E - Account configuration
- **E1. Action set to Secondary** (VERY COMMON confusion): only counts in "All conversions", not "Conversions"; doesn't drive Smart Bidding. Inverse: two Primaries for same event = double counting.
- **E2. Conversion window too short / lag misread** (COMMON): conversions back-dated to click date; recent days fill in retroactively; processing hours to 72h (gbraid/wbraid); GA4 imports +1-2 days. Don't judge the last 3 days.
- **E3. Count Every vs One** (COMMON): leads should be One.
- **E4. Campaign-level goal exclusions**: campaign uses custom goals excluding the action.

### Category F - GA4-imported conversions
- **F1. GA4 key event not imported** (VERY COMMON): not marked Key event, never imported, accounts not linked, or data-sharing disabled. Import only counts forward.
- **F2. GA4 vs Ads numbers "don't match"** (CONSTANT, not a bug): click-date vs event-date, double counting when both Primary, different attribution models, Ads counts view-through/cross-device, separate consent modeling, lag, timezone. 10-30% divergence is normal. Pick ONE source of truth per action; demote the other to Secondary.

### Category G - Offline / CRM imports & enhanced conversions
- **G1. Upload errors**: "identifiers too old" (gclid 90d), "click too recent" (wait ~6h), "invalid conversion time" (timezone bugs), "unknown click" (malformed gclid, Excel mangling, wrong account, auto-tagging off at click time), "conversion action not found" (must be source Import from clicks), unhashed/badly formatted user data (lowercase emails, E.164 phones, SHA-256).
- **G2. gclid never captured into the CRM** (VERY COMMON root failure): no hidden field, or reads URL only (lost on multi-page journeys - read from `_gcl_aw` cookie), multi-step forms dropping it.
- **G3. Enhanced conversions (web) not providing user_data** (COMMON): EC enabled but no user_data mapping; broken CSS selectors; format errors. Verify Tag Assistant shows hashed `em`/`pn` on the ping.
- **G4. Enhanced conversions for leads misconfigured** (COMMON): tag must capture hashed email/phone at submit; upload same normalized identifiers later; failure points: terms not accepted, wrong action source, non-normalized uploads.
- **G5. Lead form assets (Google-hosted)**: conversions counted natively; leads sit in Ads 30 days unless webhook/CRM integration delivers them. Website tags irrelevant to these.

### Category H - Phone-call conversions
Google forwarding number or website call conversions (number swap). Failures: number hardcoded as image/formatted differently so swap fails; call trackers (CallRail) replacing after Google's snippet; minimum call length filters.

### Part B.4: Ranked prevalence
1. Tag/trigger never fires for the real form flow (B1/B2/B4)
2. Tag removed or GTM unpublished after site changes (A2/A3)
3. Secondary vs Primary / column misreading (E1)
4. Consent Mode misconfiguration post-CMP (D1)
5. gclid chain broken (C1-C3)
6. Wrong ID/label or wrong account (A4/A5)
7. GA4-import confusion and mismatch panic (F1/F2)
8. Timing misreads (E2)
9. Duplicate counting (B6)
10. Offline/EC import failures (G1-G4) - lower volume, highest per-case complexity

### Part B.5: Suggested audit order
1. Account surface first: statuses + last-detected dates; Primary/Secondary; counts; windows; auto-tagging; campaign goals; Diagnostics; segment by action
2. Date correlation: flatline date vs deploys/GTM versions/CMP installs
3. Page source: AW-/GTM- on landing + thank-you pages; duplicates; consent defaults
4. Live walk: `?gclid=TEST` → redirect survival → `_gcl_aw` → submit → conversion ping + gcs value; Tag Assistant
5. Attribution back-end: GA4 link/import; CRM gclid capture; upload errors; EC diagnostics
6. Only then conclude "tracking is fine, the campaign just isn't converting"

Key sources: support.google.com/google-ads (answers 7548399, 15629968, 13321563, 11956168, 15713840, 10989978), analyticsmania.com (28 reasons; form triggers; conversion linker), adalysis.com top-10 mistakes, adnanagic.com gclid redirects, ppc.land consent mode v2 enforcement, nicelookingdata.com GA4 vs Ads, conversiontracking.io iframes, cometly.com, tagfly.io, freak.marketing inactive tags, playhouse.digital gclid hidden field, pemavor.com offline imports.
