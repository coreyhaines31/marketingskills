# Why the numbers never match

Load this for any discrepancy question ("GA4 and Google Ads don't match", "Meta says more than Google") and for expectation-setting at the end of a setup. Compiled August 2026, refund material September 2026. Vendor claims flagged [VENDOR].

**Recovering the losses.** Server-side delivery from a first-party loader domain recovers part of the ad-blocker share, because many blocklists target known third-party tracker domains and a subdomain of the site itself is not one (default loaders are still list-blocked; see 2.3). Sending the lead's identity (hashed email and phone) with each conversion, from the browser (Enhanced Conversions for web, Meta advanced matching) or from a server, recovers much of the ITP and cross-device share, because the platform can then match the conversion to the signed-in person who clicked even when the click ID is gone. Consent denial is the exception. No method recovers it, and none should. The honest option comparison lives in `server-side.md`.

## 0. Core framing: GA4 and Google Ads NEVER match - that's normal

Set expectations before diagnosing. Reasons a perfect setup still diverges:
1. **Date attribution**: Ads books conversions to click date; GA4 to conversion date. Conversions post to Ads up to 90 days after click; recent Ads ranges retroactively grow.
2. **Attribution model**: Ads credits its own clicks; GA4 DDA splits across ALL channels. GA4 always assigns paid search fewer conversions.
3. **View-through / engage-through / cross-device**: Ads counts view-through and cross-device that GA4 can't see. Meta counts 1-day view and (2026) engage-through.
4. **Counting rules**: Every vs One (Ads), All vs First (Meta), per-event vs per-session (GA4).
5. **Modeling**: with Consent Mode, Ads and GA4 each run their OWN modeling engine.
6. **Processing lag**: GA4 24-48h; GA4→Ads imports +1-3 days. Never compare windows ending <3 days ago.
7. **Timezone/currency mismatches** shift day boundaries.

**Normal vs broken**: 10-30% Ads-vs-GA4 gap is normal. Investigate when: gap >40%, direction flips, gap changes suddenly, or one platform reads zero.

## 1. Inherent cross-platform causes (expectation-setting)
- Click-date vs conversion-date bookkeeping - whole recent-window gap for long cycles
- Attribution model scope - part of normal 10-30%
- View/engage-through + cross-device - varies with Display/Video/PMax spend
- Attribution windows: Google Ads 1-90d click (default 30); Meta max 7d click / 1d view (post-2026: link clicks only); a day-10 lead exists for Google, invisible to Meta
- Counting method mismatches
- **GA4-import + native tag both Primary = up to 2x double counting** (fix: demote one to Secondary; prefer native tag as Primary - faster, supports EC and view-through; imports arrive 1-3 days stale)
- Modeled conversions: consent mode modeling needs ~700 ad clicks per 7 days per country-domain grouping; below threshold, no modeled backfill - most SMB sites never qualify. Consented users convert 2-5x more than average so extrapolation over-corrects.
- GA4 thresholding/cardinality hides rows: (other), (not set); ~5-10% reporting loss [VENDOR]

## 2. Environmental undercount (tracking installed correctly, still loses data)

### 2.1 Consent banner hard-blocking GTM/gtag
- Symptom: sharp drop in ALL metrics dated to CMP launch; EU-skewed.
- Mechanism: CMP blocks gtm.js/gtag.js until opt-in (script blocking, not Consent Mode). Everyone ignoring or rejecting the banner is invisible.
- Confirm: incognito, don't touch banner, check Network for gtm.js/collect; overlay CMP install date on traffic graph.
- Fix: Consent Mode v2 (tags load, cookieless pings when denied → modeling possible).
- Magnitude: Germany/France <25% acceptance in some studies vs 80%+ US; up to ~55% loss in strict EU markets.

### 2.2 Consent Mode v2 misimplementation (silent Google Ads killer)
- Symptom: Ads conversions collapse (documented 90% overnight drop) while clicks/spend continue.
- Mechanism: banner looks functional but never transmits ad_user_data/ad_personalization → Google discards conversions. Stricter enforcement from July 2025 is widely reported (not a formal Google announcement).
- Confirm: GTM Preview Consent tab; gcs/gcd params; Google diagnostics lag 48-72h.
- Magnitude: post-fix only ~40% of lost attribution recoverable via modeling.

### 2.3 Ad blockers / privacy extensions / Brave
- ~29.5% of global users run ad blockers (Q2 2025 GWI); US ~32.5%. Developer/SaaS audiences 40-60%, B2B software 30-50%, finance 25-35%, consumer ecom 15-25% [VENDOR estimates].
- Blocking the GTM container silences EVERY tag inside it at once.
- Confirm: compare form-plugin/CRM lead count to platform conversions.
- sGTM with default loaders is STILL list-blocked - custom loaders needed. Never fully fixable.

### 2.4 Safari ITP
- JS-set first-party cookies (_ga, _gcl_aw, _fbp, _fbc) capped at 7 days; capped at 24 HOURS when the landing URL carries known tracking params (gclid/fbclid); CNAME cloaking detected and capped.
- Symptom: rising "direct" conversions; returning Safari users counted new; >7-day consideration cycles lose attribution. Hits B2B/financial/home services lead gen hard.
- Fix: HTTP Set-Cookie from own server is exempt (up to 400 days) = the server-side argument. Client-side mitigation: capture attribution to CRM at first touch via hidden fields.
- Magnitude: Safari ≈ 20-30% of US/AU lead-gen traffic.

### 2.5 Firefox ETP / Edge Tracking Prevention
- Firefox blocks Meta pixel by default standard mode, GA in strict/private; Edge Balanced blocks unvisited-site trackers. 5-10% of traffic; concentrated on third-party pixels.

### 2.6 iOS ecosystem (lead gen specifics)
- ATT limits in-app identifiers (Meta/TikTok in-app browser clicks); iCloud Private Relay masks IP (degrades matching); iOS 17+ Link Tracking Protection strips click IDs in Mail/Messages/private browsing; Meta in-app browser + ITP shortens _fbp/_fbc life.
- Net: iOS leads disproportionately "direct/unassigned"; Meta iOS relies on modeling. Partial fix: CAPI/enhanced conversions with hashed email from the form.

### 2.7 Cross-device journeys
- Ad clicked on one device (usually a phone), conversion completed on another (usually a desktop). The click ID cookie lives on the first device, so the converting browser has nothing to report and the conversion lands unattributed.
- Hits considered purchases and B2B lead gen hardest, where research happens on mobile and forms get filled at a desk.
- Fix: send identity with the conversion (hashed email and phone via browser Enhanced Conversions or Meta advanced matching, or server-side via CAPI) so the platform matches it to the signed-in user who clicked. Google and Meta also run their own logged-in cross-device graphs, which is part of why their totals exceed GA4's.
- Not fixable by the click ID alone; browser identity options help when the tag fires, server-side sends help when it doesn't. Invisible from the page.

## 3. Site-level causes
### 3.1 Redirects stripping gclid/fbclid
- http→https, non-www→www, trailing slash, migrations, vanity URLs, geo redirects, cross-domain hops. Ads may show "Website redirects are losing click data".
- Confirm: `curl -I "https://final-url?gclid=TEST123"` follow chain; check _gcl_aw after landing; Ads clicks vs GA4 google/cpc sessions shortfall.
- Fix: preserve query strings (Apache QSA, Nginx $is_args$args) or point ads at final URL. 100% loss on affected paths.

### 3.2 Auto-tagging disabled or URL rewritten client-side
- GA4 shows google/organic for paid traffic; frameworks/routers stripping query params on first load (e.g. Angular).

### 3.3 SPA / thank-you never actually "loads"
- Virtual route = no page load = pageview-URL triggers never fire. Also: AJAX forms with inline success never navigate at all. Secondary: rogue referral resets attribution; stale dataLayer values.
- Fix: History Change triggers or developer-pushed dataLayer event on submit success. Binary: 100% missing for affected form.

### 3.4 Third-party/iframe forms (Typeform, Calendly, HubSpot...)
- Parent GTM can't see inside cross-origin iframe; events inside belong to vendor's domain; cross-domain redirect flows reset attribution (self-referral).
- Fix: vendor postMessage callbacks → dataLayer; referral exclusions; or vendor webhook → server-side conversion.

### 3.5 Duplicate conversions (overcount)
- Tag twice (GTM + hardcoded, plugin + manual, two containers); thank-you refresh/bookmark/back-button; Count=Every; GA4 import + native both Primary; no event_id dedup across browser + server.
- Confirm: GTM Preview double-fire; refresh thank-you page; sibling conversion actions; Meta dedup diagnostics.

## 4. "Conversions but no leads in inbox" - and the reverse
### 4.1 Conversions but no (real) leads
- Bot form submissions (tag fires honestly): gibberish names, empty messages, identical search terms at ~100% CVR, 20-30% conversion rates with zero callbacks
- Search Partners network fraud (one audit: half of suspicious conversions from ~5% of impressions); PMax junk placements
- Test submissions not excluded; duplicate counting; email delivery failure (check the form tool's OWN entries list before blaming tracking); view-through vs click-expectation mental model
- Fixes: disable Search Partners, reCAPTCHA/honeypot, IP exclusions, offline import so only CRM-qualified leads train bidding
### 4.2 Leads in inbox but no conversions
- Ad blocker / consent / ITP; thank-you never loads / iframe; gclid stripped (conversion lands as organic); lead via untracked path (phone, email reply, chat); attribution window expired; recorded as Secondary or different action; reporting lag

## 5. Server-side: what it recovers, why DIY is hard
- Vendor claims [ALL VENDOR]: Meta's own oft-quoted CAPI figure: 19% additional attributed purchases, 13% lower cost per result. Stape cases: 46% more reported Google Ads conversions (Square), 38% attribution recovery. Treat as upper bounds.
- Mechanisms of real recovery: HTTP first-party cookies with full TTL (vs 7d/24h ITP); first-party subdomain serving evades SOME blocklists (default sGTM loaders still blocked); server-to-server delivery immune to browser blocking.
- Practitioner figure, not a benchmark: client-side-only undercount around 30% vs form DB/CRM has been reported for non-EU lead gen, worse for EU and technical audiences. Measure the account's own gap (CRM vs platform) instead of quoting this.
- Why DIY sGTM is hard: GCP production ≈ $90+/mo or managed $20-200/mo (Stape, billed monthly); custom subdomain + DNS; rebuilding every tag server-side; 50-120 dev hours setup [VENDOR, high-end]; silent breakage ("conversions go dark 72h before anyone notices"); consent still applies server-side (firing for opted-out users = violation).

## 6. Magnitude table

| Cause | Direction | Magnitude | Fix class |
|---|---|---|---|
| Click-date vs conv-date | Ads earlier | whole recent-window gap | Inherent |
| Attribution model scope | GA4 lower | part of 10-30% | Inherent |
| View/engage-through | Ads/Meta higher | varies w/ display | Inherent |
| GA4 import + tag both Primary | Ads inflated | up to 2x | Settings |
| Duplicate tags / refresh | Inflated | case-by-case | Client-side |
| Consent hard-block | All down | up to 55% (EU) | Client-side (CMv2) |
| Consent Mode v2 broken | Ads collapse | up to 90%; ~40% recoverable | Client-side |
| Ad blockers | All down | ~30% global; 40-60% B2B/dev | Server-side (partial) |
| Safari ITP | → direct | Safari share × >7d converters | Server-side |
| Cross-device journeys | → unattributed | varies with mobile ad share | Identity data (browser identity options or server-side) |
| Firefox/Edge | Pixels down | 5-10% traffic | Server-side (partial) |
| Redirects stripping gclid | Ads → 0 | 100% of affected path | Client-side |
| SPA/iframe thank-you | → 0 | binary | Client-side |
| Bot/spam fills | Conversions > leads | can be ~half | Client-side |
| Window mismatch | Meta < Google | slow-cycle leads | Inherent |

## 7. The refund asymmetry (ecommerce)

Platforms disagree about whether a refunded purchase ever stops being a conversion:

- **Google Ads** supports conversion adjustments. Restate changes the value (partial refund), retract removes the conversion entirely. Adjustments work with gclid and gbraid, not wbraid, generally need an order_id, must happen within 54 days (within 7 days for bidding to use them), and are one-shot: a retracted conversion can never be adjusted again.
- **GA4** has a standard `refund` event keyed on transaction_id.
- **Meta** has no refund mechanism at all. A sent Purchase stays counted forever.

Two practical consequences. First, a store that dutifully adjusts Google and sends GA4 refunds will show structurally higher Meta ROAS than Google ROAS, and that is a platform asymmetry, not a tracking bug. Second, almost nobody wires up adjustments at all, so on any high-return store, every platform's ROAS is overstated by roughly the refund rate, and "are refunds adjusted anywhere?" is an audit question whose usual answer is no.

Key sources: support.google.com/google-ads/answer/7457111 (discrepancy factors), /10548233 (consent modeling), /15629968 (redirects); nicelookingdata.com; seresa.io; ppcpanos.com; ppc.land CMv2 enforcement; cookieyes.com consent trends; introtrace.com ad blocker stats; simoahava.com ad-blocker measurement; dataunlocker.com sGTM vs blockers; stape.io (ITP, benefits, discrepancies) [VENDOR]; convert.com ETP/ITP; cardinalpath.com iOS17 LTP; adnanagic.com gclid; analyticsmania.com SPA; webeminence.com spam conversions; jonloomer.com Meta attribution 2026; clickport.io data loss [VENDOR]; hallam.agency custom loaders.
