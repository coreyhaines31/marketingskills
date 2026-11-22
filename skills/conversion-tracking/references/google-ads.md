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
- The form or booking tool in play. This skill has detection recipes for 22 form and booking tools, plus 4 universal patterns (phone clicks, file downloads, thank-you pages, and generic AJAX forms). The full list with canonical dataLayer event names lives in `../assets/gtm-recipes/event-map.json` and `../assets/snippets/README.md`. Example, Gravity Forms pushes `gravity_form_submitted`. Supported tools are Acuity Scheduling, Cal.com, Calendly, Contact Form 7, Divi Forms, Elementor Forms, Fluent Forms, Formidable Forms, Forminator, Framer Forms, Gravity Forms, HubSpot Forms, Jotform, Ninja Forms, Squarespace Forms, Tally, Typeform, Webflow Forms, Wix Forms, Wix Bookings, WPForms, and WS Form.
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
- **Do this.** Ask the user to sign in to Google Ads, click the Goals icon in the left menu, then Conversions, then Summary, then click + Create conversion action (older accounts show + New conversion action). Choose Website. If Google asks for the website address and scans the site, skip the "Automatically without code" suggestions and choose to add a conversion action manually. Set the category to Submit lead form (use Book appointment for Acuity Scheduling, Cal.com, Calendly or Wix Bookings), give it a clear name like "Lead form submitted", leave value off or use one value per conversion, set counting to One, then save.
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
- **On error.** "invalid choice" on --tool means the tool key is misspelled or unsupported, check the 26 keys in `../assets/gtm-recipes/event-map.json`. A complaint about missing --conversion-id or --conversion-label means Step 2 values were not passed.
- **Acuity only.** Acuity needs a second file. Paste `../assets/snippets/acuity-scheduling-field.html` into Acuity's Custom Conversion Tracking field (Integrations, then Custom Conversion Tracking) with the site's own address in `SITES`, or no booking ever reaches the page. Acuity runs that field for package and gift certificate purchases too, so count only events where `acuity_type` is `appointment`.

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
- **Acuity only.** Acuity needs a second file. Paste `../assets/snippets/acuity-scheduling-field.html` into Acuity's Custom Conversion Tracking field (Integrations, then Custom Conversion Tracking) with the site's own address in `SITES`, or no booking ever reaches the page. Acuity runs that field for package and gift certificate purchases too, so count only events where `acuity_type` is `appointment`.

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

## Call conversions: setup from zero

Guided setup for phone-led businesses running Google Ads. This covers picking the right call-conversion type and wiring Google's two native call paths (**Calls from ads** and **Website call conversions**). Form and booking setup lives in Part A above; offline CRM and call-log uploads live in Part B Category G and `server-side.md`.

### Choose the right call-conversion path

Phone-led businesses have five distinct options. Pick on what you actually want Google Ads to optimize toward, and be explicit about what each one measures:

| Option | What it counts | Cost & scope | When to use it |
|---|---|---|---|
| **`tel:` click (`phone_click`)** | Taps or clicks on `tel:` links on the site | Free, browser-side, works in every country | Baseline when forwarding numbers or call trackers are not available, or as a **Secondary** intent signal. **Not answered-call tracking** |
| **Calls from ads** (Google forwarding number on ad assets) | Calls placed directly from call assets, location assets, or call ads that meet a minimum call length | Free in Google Ads (eligible countries only); Google Ads traffic only | Always enable when running call or location assets so SERP calls are measured alongside site calls |
| **Website call conversions** (Google number swap) | Calls to a dynamically swapped Google forwarding number after a Google ad click that meet a minimum call length | Free in Google Ads (eligible countries only); Google Ads traffic only; plain-text numbers only | Default free answered-call path for Google-Ads-only local businesses on an eligible site |
| **Third-party call tracker** (CallRail, CallTrackingMetrics, Invoca, WhatConverts) | Answered calls, recordings, call duration, and qualification across Google Ads, Meta, organic, and direct via dynamic number insertion (DNI) | Paid monthly plan plus number/minute usage | When attribution across non-Google channels, call recordings, IVR/whisper, or regions without Google forwarding numbers matter |
| **Offline import of answered or booked calls** | Qualified calls, booked jobs, or closed deals pushed back from a CRM or call log | $0 via Google Data Manager API (or paid sync tools in `server-side.md`); needs `gclid` or normalized lead phone/email capture | When bidding should optimize on booked/qualified calls rather than every 60-second ring, or when pairing with a third-party tracker |

**Rules for `../assets/snippets/phone-click.js` (the `tel:` click detector):**
- `phone-click.js` measures **call intent** (someone tapped or clicked a `tel:` link), not an answered call. On desktop especially, many clicks never dial; on mobile, visitors can tap and cancel.
- Use `phone-click.js` via `../assets/gtm-recipes/README.md` (`build_recipe.py --tool phone-click --send google-ads`) or Part A's Path A/B flow when no forwarding-number or call-tracker path is available, and state clearly to the user that it counts intent rather than answered calls. (Note the PII rule in `../assets/snippets/README.md`: drop `phone_number` and `link_text` from the push if the page shows visitor-specific rep numbers.)
- **Replace or demote it when real call tracking goes live.** As soon as Website call conversions, a third-party tracker, or offline call imports are active for the same phone number, remove the `tel:` click action or demote it to **Secondary** so Smart Bidding does not count one caller twice (once for the tap and once for the call).
- **Layer Calls from ads with Website call conversions.** They cover different surfaces (dialing from the ad vs. dialing on the website) and do not overlap.

### Before you start (call conversions)

Do a duplicate and conflict pre-check before touching tags:
1. Check the page source and GTM container for existing `AW-` tags, `phone_conversion_number` snippets, GTM "Google Ads Calls from Website Conversion" tags, and any third-party DNI script (CallRail, CallTrackingMetrics, Invoca, WhatConverts, etc.). Never run two number-swap scripts on the same displayed phone number.
2. Check **Goals > Conversions > Summary** for existing Phone calls actions or a Primary `tel:` click action so you do not create a duplicate Primary goal.
3. Confirm the business is in a country where Google forwarding numbers are available, and collect the exact phone number text as displayed on the site (header, footer, hero, and contact page).

### Path 1: Calls from ads (ad-level call and location assets)

End state: account-level Call reporting is on, and a single Primary "Calls from ads" action filters out short wrong-number hangups. No website code is needed.

**Step 1 - Enable account-level Call reporting**
- **Goal.** Let Google Ads assign Google forwarding numbers to call assets, location assets, and call ads so it can measure call duration.
- **Do this.** Ask the user to sign in to Google Ads, click the **Admin** icon, open **Account settings**, expand **Call reporting**, set it to **On**, and click **Save**. Have them confirm that **Call reporting** stays **On** and note their business country.
- **Expect to see.** Call reporting shows as **On** in Account settings.
- **On error.** If Call reporting is unavailable or Google forwarding numbers are not supported in the target country, Google cannot track call duration from ads. Use `phone-click.js` for site `tel:` intent, a third-party call tracker, or offline call imports instead.

**Step 2 - Create or verify the Calls from ads conversion action**
- **Goal.** Have one enabled conversion action measuring calls from ads with an appropriate minimum duration.
- **Do this.** Ask the user to open **Goals** > **Conversions** > **Summary**. First check whether an active "Calls from ads" action already exists. If not, click **+ Create conversion action** (or **+ New conversion action**), select **Phone calls**, and choose **Calls from ads using call assets or call-only ads** (labeled **Calls from ads** in the UI). Set category to **Phone call lead** (or **Contact**), name it clearly (for example `Calls from ads (60s+)`), set **Count** to **One**, set **Call length** to the minimum seconds that qualify a real inquiry (default **60** seconds; shorten to 30s only if quick bookings finish faster, or raise to 90-120s for noisy categories), set **Primary** if bidding should optimize on calls, and save. Have the user report back the action's **Status**, **Primary/Secondary** setting, and **Call length**.
- **Expect to see.** The action appears in Summary as Enabled (no website tag setup step is shown for Calls from ads).
- **On error.** If a default Calls from ads action already exists, edit its settings rather than creating a second one. Confirm campaigns with call or location assets include this conversion goal (not a custom goal excluding it).

### Path 2: Website call conversions (number swap on the site)

End state: visitors arriving from a Google Ad see a dynamically swapped Google forwarding number on the site, and calls meeting the minimum duration record in Google Ads. The user does Step 1 in Google Ads and reports 3 values back (Conversion ID, Conversion Label, exact displayed phone number); the agent or user does Step 2 and Step 3.

**Step 1 - Create the Website call conversion action in Google Ads**
- **Goal.** Create the conversion action and collect the Conversion ID, Conversion Label, and exact displayed phone number.
- **Do this.** Confirm **Call reporting** is **On** (Path 1, Step 1). Then ask the user to go to **Goals** > **Conversions** > **Summary**, click **+ Create conversion action**, select **Phone calls**, and choose **Calls to a phone number on your website**. Set category (**Phone call lead** or **Contact**), name (for example `Website calls (60s+)`), **Count** to **One**, **Call length** (default **60** seconds), and enter the **Phone number** and **Destination number** matching the business number on the site. Save, scroll to **Tag setup**, open **Use Google Tag Manager** (or **Install the tag yourself**), and report back:
  1. **Conversion ID** (digits after `AW-`)
  2. **Conversion Label**
  3. Exact **displayed phone number string** on the site (formatting, spaces, parentheses, hyphens)
- **Expect to see.** The new action sits in Summary with status **Unverified** until the tag runs on the site.
- **On error.** If **Calls to a phone number on your website** cannot use a forwarding number, check that Call reporting is On and the country is supported. If the site displays different numbers per branch or location, create one conversion action per number or match by CSS class (`phone_conversion_css_class`).

**Step 2 - Install the website number-swap tag**

Pick GTM if the site already runs a `GTM-` container, or `gtag.js` if it does not. Never install both. Make sure auto-tagging is **On** (Step 9 in Part A above) in either path, because Google only swaps the number when it detects an ad click (`gclid` / `_gcl_aw`).

*Option A, with Google Tag Manager:*
- **Goal.** Fire Google's number-swap tag alongside Conversion Linker without pasting raw scripts into the site.
- **Do this.** In GTM, create a **Google Ads Calls from Website Conversion** tag. Fill **Displayed Phone Number to Replace** with the exact string visible on the page (character-for-character, including spaces, brackets, or hyphens, or use the CSS selector option if formatting varies across locations), **Conversion ID**, and **Conversion Label**. Set the trigger to **All Pages** (or every page displaying the number). Confirm a **Conversion Linker** tag is present and firing on **All Pages**. Preview in Tag Assistant, then **Submit** and **Publish**.
- **Expect to see.** Tag Assistant shows both **Conversion Linker** and **Google Ads Calls from Website Conversion** firing on page load.

*Option B, without Google Tag Manager (`gtag.js`):*
- **Goal.** Load the Google tag once and attach the `phone_conversion_number` config in `<head>`.
- **Do this.** Ensure the base Google tag (`gtag.js` for `AW-XXXXXXXXX`) is present in `<head>` once (if Part A Path B already installed it, do not paste a second base script), then add the phone config snippet right after `gtag('config', 'AW-XXXXXXXXX');`:

```html
<script>
  gtag('config', 'AW-XXXXXXXXX/YYYYYYYYYYY', {
    'phone_conversion_number': '1-650-555-5555'
  });
</script>
```

Replace `AW-XXXXXXXXX` with `AW-` plus the Conversion ID, `YYYYYYYYYYY` with the Conversion Label, and `'1-650-555-5555'` with the exact phone string displayed in the page HTML (or supply `'phone_conversion_css_class'` if multiple formats share a class).
- **Expect to see.** The phone number in the page HTML is plain continuous text (wrapping it in `<a href="tel:...">` is fine; Google swaps both the visible text and the `tel:` target) and matches `'phone_conversion_number'` exactly.
- **On error.** Do not combine this tag with a third-party DNI script (CallRail, CallTrackingMetrics, Invoca, WhatConverts) on the same phone number. Pick one swap owner; if a third-party tracker owns the swap, use offline call imports instead (Category G and `server-side.md`).

**Step 3 - Verify the swap and conversion arrival**
- **Goal.** Prove the swap works in the browser without wasting ad spend, then confirm live arrival in Google Ads.
- **Do this.**
  1. **Run the `#google-wcc-debug` Force test.** Open the live page with `#google-wcc-debug` appended to the URL (for example `https://example.com/contact#google-wcc-debug`) in an incognito window with ad blockers off. A small Google debug box appears in the bottom-left corner; click **Force** and verify that every instance of the phone number on the page (header, footer, body, mobile sticky bar) swaps to a Google test placeholder (such as `(999) 999-9999` or `999-999-9999`).
  2. **Check Tag Assistant.** Connect `tagassistant.google.com` and confirm the Website Call Conversion tag / `gtag('config', 'AW-.../...')` and Conversion Linker both executed.
  3. **Verify live account status and lag.** Real Google forwarding numbers only appear on genuine ad-click visits (not direct visits), and conversions only record when calls pass the minimum call length. In **Goals > Conversions > Summary**, expect **Unverified** to move to **No recent conversions** or **Recording conversions** within 48 hours of tagged ad traffic, and apply the 3-day reporting lag rule before judging totals.
  4. **Confirm no double counting.** Verify any `tel:` click action (`phone_click`) for the same number is removed or set to **Secondary**.
- **Expect to see.** Clicking **Force** in `#google-wcc-debug` updates the displayed number and its `tel:` link cleanly across the page.
- **On error.** If **Force** leaves the number unchanged, check Category H below (image/SVG numbers, split HTML tags, format mismatches, caching/CSP, or a third-party call tracker overwriting the DOM).

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
- **H1. Phone number not swapped: format mismatch, split markup, or image/SVG** (VERY COMMON): Google's website call script scans the DOM for an exact text match to `phone_conversion_number`. It fails silently when the number is an image or SVG, formatted inconsistently across header/footer/mobile bar (for example `(650) 555-5555` on the page vs `1-650-555-5555` in the tag), or split across nested HTML tags (`<span>(650)</span> <span>555-5555</span>`). Test by opening the URL with `#google-wcc-debug` and clicking **Force**. Fix: render continuous plain text matching the tag string character-for-character (keeping `<a href="tel:...">` around the text is fine) or target a shared CSS class via `phone_conversion_css_class`.
- **H2. Third-party call tracker conflict (competing number swaps)** (COMMON): a third-party dynamic number insertion (DNI) script (CallRail, CallTrackingMetrics, Invoca, WhatConverts) swaps the page number before Google's script runs so Google cannot find the original number, or overwrites Google's forwarding number afterward. Google Ads stays Unverified or shows zero website calls while the tracker logs calls. Fix: keep one swap owner per phone number. Either import qualified calls from the tracker / CRM into Google Ads (Category G) and remove Google's website call tag, or disable third-party DNI on Google Ads traffic if using Google forwarding numbers.
- **H3. Minimum call length filter mismatched to real inquiries** (COMMON): the default is 60 seconds. Businesses where receptionists book or dispatch in 30 to 45 seconds lose valid conversions to the threshold; conversely, a 5 to 15 second threshold counts wrong numbers, hang-ups, and IVR drop-offs as leads. Check call duration distributions in Google Ads or the call tracker and tune the minimum call length to actual qualified-call durations.
- **H4. Auto-tagging off, Conversion Linker missing, or gclid stripped** (COMMON): Google only swaps the website phone number when the visit carries Google Ads click attribution (`gclid` / `_gcl_aw`). Direct visitors and ad clicks whose `gclid` was stripped by redirects (C2) or dropped because Conversion Linker is missing (C3) see the static number and never register a website call. Run the `?gclid=TEST123` + `_gcl_aw` check before assuming the call snippet is broken.
- **H5. `tel:` click tracking mistaken for answered calls or double-counted** (VERY COMMON): `phone-click.js` (or a GTM `tel:` click trigger) counts intent (the tap), including desktop clicks with no dialer and unanswered dials. If both a `tel:` click action and a Website call conversion (or call-tracker import) are set to **Primary**, one phone call records two conversions. Fix: remove the `tel:` click action or demote it to **Secondary** once answered-call tracking is active.
- **H6. Account Call reporting off, ineligible country, or ad asset mismatch** (OCCASIONAL): **Calls from ads** stays at zero when **Call reporting** is off in `Admin > Account settings`, when the business country does not support Google forwarding numbers, or when call/location assets are disapproved or excluded by campaign conversion goals (E4). Check Call reporting, country eligibility, asset approval, and campaign goals.
- **H7. Consent Mode denial, ad blockers, or SPA route timing** (COMMON): when Consent Mode keeps `ad_storage` denied or a blocker prevents `gtag.js`/`gtm.js` from loading, the swap script never runs and visitors dial the static number. In single-page apps (React, Next.js), a phone number rendered on a later client-side route or lazy component after initial page load can miss a Pageview-only tag; re-fire the website call tag on History Change or after the component mounts.

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
