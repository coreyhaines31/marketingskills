# Conversion Tracking Setup

How to set up conversion tracking pixels across ad platforms. This guide covers installation, event configuration, and validation — everything a marketer needs to ensure ad spend is properly attributed.

---

## Why This Matters

Without conversion tracking:
- Ad platforms can't optimize for your actual goals
- You're flying blind on ROAS and CPA
- Retargeting audiences can't be built
- You'll waste budget on impressions that don't convert

Get tracking right before spending a dollar on ads.

---

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

### Google Tag Manager alternative

If using GTM instead of inline gtag.js:
1. Install GTM container on all pages
2. Create Google Ads conversion tags in GTM
3. Set triggers for conversion events (form submissions, purchases)
4. Use the Data Layer to pass dynamic values (order amount, transaction ID)
5. Test with GTM Preview mode before publishing

---

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

### Aggregated Event Measurement

Required for iOS 14+ tracking. In Events Manager > Aggregated Event Measurement:
1. Verify your domain
2. Configure and prioritize your top 8 events in order of business importance
3. Purchase should typically be #1, Lead #2

---

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

## Validation Checklist

After installing any pixel, verify before going live:

### Browser-side checks

- [ ] Pixel fires on every page (check via browser extension)
- [ ] Conversion events fire at the right moment (after confirmed action, not on button click)
- [ ] Event parameters contain correct values (currency, amount, content IDs)
- [ ] No duplicate events firing on the same action
- [ ] Events fire on both desktop and mobile

### Platform-side checks

- [ ] Events appear in the platform's event manager/diagnostics
- [ ] Test conversions show correct values
- [ ] Event match quality is acceptable (Meta: score > 6)
- [ ] Server-side events are deduplicating with browser events (not double-counting)

### Debugging tools

| Platform | Tool |
|----------|------|
| Google | Google Tag Assistant, Chrome DevTools Network tab |
| Meta | Meta Pixel Helper (Chrome extension), Events Manager Test Events |
| LinkedIn | Insight Tag Validator in Campaign Manager |
| TikTok | TikTok Pixel Helper (Chrome extension), Events Manager |
| All | GTM Preview Mode (if using Google Tag Manager) |

---

## Common Mistakes

- **Firing purchase events on button click instead of confirmed payment** — always fire on the success/thank-you page or after server confirmation
- **Missing deduplication between pixel and server events** — without a shared `event_id`, you'll double-count conversions
- **Not testing on mobile** — many pixels break on mobile browsers or in-app webviews
- **Hardcoded test values** — remove test transaction amounts before going live
- **Forgetting to exclude internal traffic** — your team's visits inflate conversion data
- **Installing pixels without consent management** — GDPR/CCPA require user consent before firing tracking pixels in applicable regions
- **Pixel installed but no conversion actions created** — the pixel collects data, but the ad platform won't optimize without defined conversion actions

---

## When to Use Server-Side Tracking

Browser-only tracking is increasingly unreliable due to:
- iOS 14+ App Tracking Transparency
- Third-party cookie deprecation
- Ad blockers (30%+ of tech audiences)

**Use server-side (CAPI/Events API) when:**
- Running Meta or TikTok ads (strongly recommended)
- Your audience is tech-savvy (higher ad blocker usage)
- You need accurate purchase/revenue attribution
- You're spending >$5K/month on any platform

**Server-side is optional when:**
- Running Google Ads only (Enhanced Conversions covers most gaps)
- Low ad spend / testing phase
- B2B with LinkedIn only (Insight Tag is still reliable)
