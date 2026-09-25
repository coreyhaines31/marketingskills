# LinkedIn, TikTok, Microsoft, and the rest

## Part A: setup from zero

Contents:
1. Before you start (applies to all 3)
2. LinkedIn Ads (Insight Tag and conversion rules)
3. Microsoft Ads (UET tag and conversion goals)
4. TikTok Ads (pixel and form events)
5. Verification and common failures

Before you start. You usually cannot log into the user's ad accounts, so account steps are guided. Give exact clicks and ask what they see. Website and GTM steps you can do yourself with access. Conversion moments come from this repo's detection snippets, which push canonical dataLayer events at the true submission moment. The names live in ../assets/gtm-recipes/event-map.json and snippets/README.md (for example, Typeform pushes typeform_form_submitted). And set expectations once, up front. Even a perfect browser-side setup misses roughly 30% of conversions to ad blockers, Safari cookie limits, and cross-device journeys the browser can't connect back to the ad click. See discrepancies.md.

### LinkedIn Ads

LinkedIn is mid-rollout on menu names. Newer accounts show Data in the left menu, older accounts show Analyze. If the user cannot find a screen under one, have them check the other.

**Step 1 - Create the Insight Tag**
- Goal. Generate the sitewide tag and its Partner ID.
- Do this. In Campaign Manager, ask the user to click Data in the left menu, then Signals Manager, scroll to the Sources catalog section, and click Insight Tag (older accounts use Analyze, then Insight Tag). Then they choose "I will use a tag manager" to get the Partner ID, or "I will install the tag myself" to get the full code. Ask them to paste back the Partner ID or code.
- Expect to see. A short numeric Partner ID, or a code block containing _linkedin_partner_id.
- On error. If neither Data nor Analyze shows the option, the user's Campaign Manager role is too limited (needs Account Manager or higher). If a tag already exists, reuse it. Only 1 Insight Tag may run per page.

**Step 2 - Install the tag**
- Goal. Load the Insight Tag on every page.
- Do this. With GTM, create a new tag using the LinkedIn Insight community template (or a Custom HTML tag with the full code), enter the Partner ID, set the trigger to All Pages, then Submit and Publish. Without GTM, paste the full code into the site's global footer, just before the closing body tag, on every page.
- Expect to see. The Network tab on any page shows requests to snap.licdn.com and px.ads.linkedin.com/collect.
- On error. Installed only on the landing page means retargeting and page-based conversions silently miss everything else, so it must be sitewide. If the requests never appear, a consent banner or content blocker is stopping snap.licdn.com.

**Step 3 - Create the conversion rule**
- Goal. Tell LinkedIn what counts as a lead.
- Do this. Ask the user to click Analyze, then Conversion tracking (some accounts show this under Data or Measurement), then Create conversion. Name it, pick Lead as the type, and choose how it is detected. Prefer an event-specific conversion, or a page-load rule matching the thank-you page URL. If a URL rule, choose "contains" on a stable path fragment like /thank-you. Do not use Exact match. LinkedIn appends its own parameters (including li_fat_id) to landing URLs, and exact-match rules break on them.
- Expect to see. The new rule listed in Conversion tracking.
- On error. Exact-match rules record nothing even when everything else works, which is the top LinkedIn-specific failure. And "contains /thank-you" also matches sub-pages, so check for overlapping rules that double count.

**Step 4 - Associate the rule with campaigns**
- Goal. Make conversions actually record. This is the critical LinkedIn gotcha.
- Do this. In the creation flow's final step, tick the campaigns the conversion applies to before clicking Create. For existing rules, open the conversion and edit its associated campaigns.
- Expect to see. The conversion's row shows 1 or more associated campaigns.
- On error. A rule with no campaign association records nothing, forever, with no warning. Whenever LinkedIn shows 0 conversions, check association first.

Testing reality. Only a real ad click can produce a LinkedIn conversion. Ad previews, direct visits, and test submissions never count. Test with a real ad click in an incognito window and allow up to 24 hours for it to appear.

### Microsoft Ads

**Step 1 - Get the UET tag**
- Goal. Find the tag ID and code.
- Do this. Ask the user to click Conversions in the left menu, then UET tag (older layouts use Tools, then Conversion tracking). New accounts usually have a tag auto-created. In the Action column they click View tag to see the code, and paste back the tag ID.
- Expect to see. A numeric tag ID and a code block referencing bat.bing.com/bat.js.
- On error. No tag listed means click Create UET tag and name it after the site. Multiple tags means confirm which one the account's goals use, and install only that one.

**Step 2 - Install the tag**
- Goal. Load UET on every page, including the thank-you page.
- Do this. With GTM, create a tag with the built-in Microsoft Advertising Universal Event Tracking template, enter the tag ID, trigger on All Pages, Submit and Publish. Without GTM, paste the code into the site's global head.
- Expect to see. The Network tab shows bat.bing.com/bat.js loading and a beacon to bat.bing.com/action/0.
- On error. Tag only on landing pages misses the thank-you page, so destination goals never fire. Theme or plugin updates silently removing the tag is common, so recheck after site changes.

**Step 3 - Create a conversion goal**
- Goal. Make anything count at all. The number 1 Microsoft failure is a UET tag installed with no goal, and nothing counts until a goal exists.
- Do this. Ask the user to click Conversions, then Conversion goals, then Create. Choose Website as the type, then either a Destination URL goal (thank-you page) or an Event goal. For URL goals, use "Contains" with a short stable fragment like /thank-you, never Equals, since trailing slashes, https variants, and appended parameters all break exact matches. For Event goals, the action and category values are case-sensitive and must match the uetq.push call exactly.
- Expect to see. The goal listed with Tag status Unverified at first.
- On error. Goal created but stuck Unverified for days means the tag never fired once (revisit Step 2). "No recent conversions" with a working tag usually means the URL rule does not match the real thank-you URL, so compare character for character.

**Step 4 - Fire the lead moment and verify**
- Goal. Send the conversion event and prove the install.
- Do this. For a destination goal, nothing more is needed if the form redirects to the thank-you page. Otherwise, fire a custom event on the canonical dataLayer event from ../assets/gtm-recipes/event-map.json via a GTM Custom HTML tag containing window.uetq = window.uetq || []; uetq.push('event', 'submit_lead_form', {}); and create a matching Event goal with that exact action string. Then install the UET Tag Helper Chrome extension, load the site, and turn it on.
- Expect to see. UET Tag Helper reports "This UET tag is set up correctly", and a test submission shows the custom event in the helper plus a bat.bing.com/action/0 request.
- On error. Helper is real-time but the goal status UI lags up to 24 hours, so do not panic at a lagging dashboard when the helper is green. Event fires but the goal stays at 0 usually means a case mismatch between the push and the goal.

### TikTok Ads

**Step 1 - Create the pixel**
- Goal. Create the web data source and get the pixel ID.
- Do this. Ask the user to open TikTok Ads Manager, go to Tools, then Events Manager. Click Connect Data Source, select Web, enter the website URL, and pick Manual Setup (not a partner integration). They create and name the pixel, then paste back the pixel ID and code.
- Expect to see. A pixel listed in Events Manager with its ID and an install code block referencing analytics.tiktok.com.
- On error. Choosing a partner integration flow when the site's platform is not listed dead-ends. Back out and use Manual Setup. A pixel that already exists should be reused, not duplicated.

**Step 2 - Install the base code**
- Goal. Load the pixel sitewide, early in the page.
- Do this. With GTM, use the official TikTok Pixel template from the community gallery with the pixel ID, trigger on All Pages, Submit and Publish. Without GTM, paste the code high in the site's global head.
- Expect to see. The Network tab shows analytics.tiktok.com loading on every page.
- On error. TikTok flags "code not installed in header" when the script loads late, and queued events get dropped. Move it up in the head. No requests at all points to a consent banner or blocker.

**Step 3 - Fire the form event**
- Goal. Report the lead moment. TikTok's standard web event for a form submission is SubmitForm. Use CompleteRegistration for account signups instead. There is no plain "Lead" event in TikTok's current standard web event list.
- Do this. In GTM, create a Custom Event trigger for the canonical dataLayer event from ../assets/gtm-recipes/event-map.json, and attach a Custom HTML tag containing a script with ttq.track('SubmitForm');. Without GTM, use the same dataLayer watcher pattern shown in meta.md (Step 7, the small dataLayer watcher), calling ttq.track('SubmitForm') instead of fbq.
- Expect to see. On a test submission, a request to analytics.tiktok.com carrying the SubmitForm event.
- On error. Event name typos or old names silently record nothing, so copy SubmitForm exactly. If the tag fires but nothing reaches TikTok, the base code loaded after the event fired.

**Step 4 - Test it**
- Goal. Confirm events arrive in TikTok.
- Do this. Ask the user to open Events Manager, select the pixel, and use the Test Events feature while they load the site and submit a test entry. The TikTok Pixel Helper Chrome extension gives a page-level readout, and the Diagnostics tab surfaces install warnings.
- Expect to see. Pageview on load, then SubmitForm once per submission, with no Diagnostics warnings.
- On error. Events show in Pixel Helper but not in Events Manager usually means a wrong pixel ID. Duplicate SubmitForm rows mean 2 installs of the event tag.

Lead quality note. TikTok strongly pushes pairing the pixel with its Events API for lead campaigns, and that is a server-side job with tokens and hashing, not a paste-in snippet. When the user wants it, route through server-side.md.

### Verification

All observable, per platform:

- LinkedIn. The Insight Tag shows as active in Signals Manager after real traffic (allow up to 24 hours). The conversion rule lists associated campaigns. A real ad click followed by a test submission appears in Campaign Manager within 24 hours.
- Microsoft. UET Tag Helper shows green on every key page. A submission produces a bat.bing.com/action/0 request. The goal's status moves from Unverified to Recording after the first real conversion.
- TikTok. Test Events shows exactly 1 SubmitForm per submission, Pixel Helper reports the correct pixel ID, and Diagnostics shows no header or coverage warnings.

### Common failures

When a check fails or numbers look wrong later, diagnose against the per-platform failure catalogs in Part B of this file (LinkedIn L1 to L8, Microsoft B1 to B9, TikTok T1 to T10, plus the cross-platform cheatsheet).

## Part B: diagnostic reference

### LinkedIn diagnostics

#### Insight Tag anatomy
- `_linkedin_partner_id = "1234567"` variable; script `snap.licdn.com/li.lms-analytics/insight.min.js`
- Noscript: `px.ads.linkedin.com/collect/?pid=<id>&fmt=gif`
- Event conversions: `window.lintrk('track', { conversion_id: 12345678 })`
- Console: `window._linkedin_data_partner_ids`, `typeof window.lintrk`

#### Click ID
- `li_fat_id` appended with Enhanced Conversion Tracking enabled (default on new tags); stored in first-party cookie `li_fat_id`, 30 days. CAPI idType: LINKEDIN_FIRST_PARTY_ADS_TRACKING_UUID - strongest match key besides hashed email.
- Browser matching otherwise depends on logged-in LinkedIn session (third-party cookies) - degrades badly with cookie blocking; non-member traffic never matches.

#### Failure modes
- **L1. Tag not installed/verified** (VERY COMMON)
- **L2. Wrong partner ID or conversion_id mismatch** (COMMON)
- **L3. Conversion rule URL-matching misconfiguration** (VERY COMMON, top LinkedIn-specific cause): "Exact" breaks on appended params INCLUDING LinkedIn's own li_fat_id; "Starts with" + protocol breaks on http/https; the tag can REORDER URL parameters. Use "contains" on stable path fragments.
- **L4. Conversion not attached to a campaign** (COMMON, LinkedIn-specific): unassociated conversion rules record NOTHING.
- **L5. Member-match dependency & testing pitfalls** (COMMON false alarm): ad preview clicks never convert; testing while logged into advertiser account suppressed; 2-24h lag. Test via real ad click in incognito; wait 24h.
- **L6. Double-counting via overlapping URL rules** (OCCASIONAL): "contains /thank-you" also matches sub-pages.
- **L7. CSP / ad blocker / duplicate tags** (COMMON): CSP must allow snap.licdn.com + px.ads.linkedin.com; only ONE Insight Tag per page.
- **L8. SPA route changes untracked** (COMMON): call `window.lintrk('track')` on route changes.

#### LinkedIn CAPI
Direct API path: non-expiring token from Campaign Manager > Signals Manager > Direct API (SMB-viable). Developer Portal path needs approved app + review (slow). Identifiers: SHA-256 email or li_fat_id. B2B reality: personal-vs-work email mismatch caps match rates. No official browser test extension - use Campaign Manager status + network checks.

### TikTok diagnostics

#### Pixel anatomy
- Global `ttq`; script `analytics.tiktok.com/i18n/pixel/events.js`
- `ttq.load('<id>')`, `ttq.page()`, `ttq.track('SubmitForm'|'Lead'|'Contact')`
- Advanced matching: `ttq.identify({email, phone_number})`

#### Click ID
- `ttclid` → first-party `ttclid` cookie. `_ttp` browser ID. TikTok pixel cookies expire 13 months. ttclid strongest Events API match signal, _ttp second. Same strip risks as fbclid.

#### Failure modes
- **T1. Base code missing / wrong ID** (VERY COMMON)
- **T2. "Code not installed in header"** (COMMON): loads too late, queued events dropped
- **T3. Lead fires at wrong moment / missing params** (COMMON): redirect race, GTM selector issues
- **T4. "First-party cookies not found"** (OCCASIONAL): disabled in pixel settings
- **T5. Advanced Matching format errors** (COMMON): email lowercase, phone E.164, else silently useless
- **T6. Consent/ad-blocker suppression** (VERY COMMON): roughly 30% loss typical
- **T7. Dedup misconfigured Pixel vs Events API** (COMMON): dedup on event_id + name within 48h window
- **T8. Events API auth/payload failures** (COMMON): expired token, malformed timestamps, unhashed PII
- **T9. SPA navigation untracked** (COMMON): call ttq.page() on route changes
- **T10. Legacy/misspelled event names** (OCCASIONAL)

#### Events API
Pixel code + self-serve access token (easier than LinkedIn). event_id mirrored with pixel; email SHA-256 lowercased; phone SHA-256 E.164; raw IP+UA; ttclid from URL/cookie. Test tooling: TikTok Pixel Helper extension, Test Events tab, Diagnostics tab.

### Microsoft Ads (UET) diagnostics

#### UET anatomy
- Script `bat.bing.com/bat.js`; global queue `window.uetq`; tag ID `{ti:"XXXXXXXX"}`
- Custom events: `window.uetq.push('event', 'action', {event_category, event_label, event_value})`
- Beacons: `bat.bing.com/action/0?ti=...`

#### Click ID
- MSCLKID auto-tagging on by default (Settings > Account level options); `msclkid=` → first-party cookie `_uetmsclkid` (~90d); `_uetsid` session, `_uetvid` visitor (13mo). Strip risks: redirects, cross-domain (must be manually carried).

#### Failure modes
- **B1. "UET installed = conversions tracked" fallacy** (VERY COMMON, the #1 Microsoft failure): UET only records raw activity; NOTHING counts until a conversion goal is created.
- **B2. Destination-URL goal never matches** (VERY COMMON): trailing slashes, http/https, case, .html, appended params. Use "contains".
- **B3. Goal status decoder**: Unverified (no activity yet, wait 24h) / Tag inactive (no hits 24h) / InactiveDueToTagUnavailable (permission change) / No recent conversions (rule not matching) / Recording. UI lags up to 24h; UET Tag Helper is real-time.
- **B4. Event goal case sensitivity** (COMMON): action/category/label matching is case-sensitive.
- **B5. Tag only on landing pages / removed by theme update** (COMMON): must be site-wide incl. thank-you.
- **B6. GTM misconfiguration** (COMMON)
- **B7. Consent Mode gap** (VERY COMMON since May 2025, widely missed): Microsoft requires consent signals since May 5 2025; basic mode denied conversions are LOST ENTIRELY (no modeling, unlike Google). Advanced Consent Mode opt-in since Feb 2026. GTM users can inherit Google Consent Mode via the UET tag's "Consent settings" toggle - must be explicitly enabled.
- **B8. Duplicate UET tags** (OCCASIONAL)
- **B9. Copying goals from Google without adjustment** (OCCASIONAL): imported campaigns don't import working tracking.

#### Server-side
No SMB-level web CAPI equivalent. Paths: offline conversion imports via msclkid captured to CRM, or UET enhanced conversions with hashed email/phone. Failure: msclkid never captured in hidden field or auto-tagging off. Test: UET Tag Helper extension (green/yellow/red), bat.bing.com/action/0 requests, goal Tracking Status.

### Cross-platform cheatsheet

| | Meta | LinkedIn | TikTok | Microsoft |
|---|---|---|---|---|
| Script host | connect.facebook.net | snap.licdn.com | analytics.tiktok.com | bat.bing.com |
| Beacon | facebook.com/tr | px.ads.linkedin.com/collect | analytics.tiktok.com | bat.bing.com/action/0 |
| Global | fbq | lintrk, _linkedin_data_partner_ids | ttq | uetq |
| Click ID → cookie | fbclid → _fbc (90d; ITP 24h/7d) | li_fat_id → li_fat_id (30d) | ttclid → ttclid (13mo) | msclkid → _uetmsclkid (~90d) |
| Browser ID | _fbp (90d) | member cookies (3rd party) | _ttp (13mo) | _uetvid (13mo) |
| Dedup key | event_name + event_id | URL-rule scoping | event_id + name, 48h | goal-level |
| Server-side | CAPI (token, hashed em/ph, event_id) | CAPI (Direct API token, email/li_fat_id) | Events API (token, em/ph, ttclid) | Offline imports via msclkid |
| Test tool | Test Events + Pixel Helper | Campaign Manager status only | Test Events + Pixel Helper | UET Tag Helper |

Universal checks every audit: consent banner (accept vs decline test); ad-blocker attrition roughly 30%; redirect-before-beacon race; iframe embeds; SPA routes; thank-you missing base tag; duplicate installs; wrong account/ID; URL-rule mismatches; testing hygiene (incognito, real ad clicks, 24h lags).

Key sources: trackingplan.com meta pixel; watsspace.com dedup; niblin.com EMQ; ego-digital.io _fbc; measureschool.com; jonloomer.com AEM; bluefroganalytics.com LinkedIn; jacobfilipp.com LinkedIn; b2linked.com ep38; learn.microsoft.com LinkedIn CAPI + click IDs; benly.ai TikTok; admanage.ai TikTok helper; ads.tiktok.com cookies; conversios.io UET; mbadv.agency Microsoft UET; help.ads.microsoft.com.
