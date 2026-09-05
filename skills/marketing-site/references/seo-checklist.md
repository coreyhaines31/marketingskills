# SEO completeness checklist + snippets

Copy-paste reference for the tags every page of a marketing site must ship. Snippets are Astro but map 1:1 to any templating layer. Build all URLs from a single absolute `SITE_URL` so canonical, OG, sitemap, and hreflang always agree.

## 1. Title + description (per page, unique)

```astro
<title>{pageTitle} · {BRAND}</title>
<meta name="description" content={pageDescription} />
```

- 50–60 chars for title, 140–160 for description.
- Never reuse one site-wide title. The `<title>` is the strongest on-page signal.

## 2. Canonical (absolute, self-referencing)

```astro
---
const canonical = new URL(Astro.url.pathname, SITE_URL).href.replace(/(.+)\/$/, '$1')
---
<link rel="canonical" href={canonical} />
```

## 3. Open Graph + Twitter Card

```astro
<meta property="og:type" content="website" />          <!-- "article" for posts -->
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:url" content={canonical} />
<meta property="og:image" content={new URL('/og.png', SITE_URL).href} />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content={title} />
<meta name="twitter:description" content={description} />
<meta name="twitter:image" content={new URL('/og.png', SITE_URL).href} />
```

- **OG image MUST be PNG or JPG, 1200×630.** SVG is rejected/mishandled by Facebook, X, LinkedIn.
- Test with the Facebook Sharing Debugger and X Card Validator before launch.

## 4. hreflang (multilingual)

```astro
<link rel="alternate" hreflang="en" href={`${SITE_URL}/`} />
<link rel="alternate" hreflang="vi" href={`${SITE_URL}/vi`} />
<link rel="alternate" hreflang="x-default" href={`${SITE_URL}/`} />
```

- Include **every locale + `x-default`**. Missing `x-default` is the #1 hreflang error.
- Emit the same alternates in the sitemap (`@astrojs/sitemap` `i18n` option).

## 5. JSON-LD structured data

Site-wide (in the base layout): **Organization** + **WebSite**.
Per page type: **FAQPage** (pages with a FAQ), **BlogPosting** + **BreadcrumbList** (posts).

```json
{ "@context": "https://schema.org", "@type": "FAQPage",
  "mainEntity": [{ "@type": "Question", "name": "…",
    "acceptedAnswer": { "@type": "Answer", "text": "…" } }] }
```

- The visible page must contain the same FAQ text as the JSON-LD, or Google may flag it.
- Validate every type in Google's Rich Results Test.

## 6. robots.txt (dynamic)

```
User-agent: *
Allow: /
Disallow: /app       # the SPA behind login — do not index
Disallow: /api/

Sitemap: {SITE_URL}/sitemap-index.xml
```

## 7. RSS

Generate `/rss.xml` from the blog collection (title, description, pubDate, link, categories). Link it from `<head>`:

```astro
<link rel="alternate" type="application/rss+xml" title="Blog" href={`${SITE_URL}/rss.xml`} />
```

## 8. Performance / Core Web Vitals

- Static HTML, zero render-blocking JS (Astro default).
- Responsive images with width/height set (no layout shift); modern formats (WebP/AVIF).
- `font-display: swap`; preconnect to font hosts.
- Target LCP < 2.5s, CLS < 0.1, INP < 200ms — static sites pass these by default.

## 9. Semantic HTML / crawlability

- Exactly one `<h1>` per page; heading levels in order.
- Real `<a href>` links (crawlable) — not `<div onclick>`.
- Descriptive `alt` on meaningful images; empty `alt=""` on decorative ones.
- Language declared: `<html lang="…">` matching the page locale.

## Post-build verification

```bash
grep -oE '<link rel="canonical"[^>]*>' dist/index.html          # exactly one, absolute
grep -oE '<meta property="og:[^"]*"[^>]*>' dist/index.html       # og:title/description/url/image
grep -oE 'hreflang="[^"]*"' dist/index.html                      # all locales + x-default
grep -oE '"@type":"[^"]*"' dist/index.html                       # expected JSON-LD types
cat dist/robots.txt dist/sitemap-index.xml                       # present + consistent
```

## Launch tasks (outside the build)

- Submit the sitemap in Google Search Console + Bing Webmaster Tools.
- Verify the OG preview in the Facebook Sharing Debugger and X Card Validator.
- Confirm the app path is excluded from indexing (robots + not in sitemap).
- Set up analytics (privacy-friendly options: Plausible, Umami) and Search Console performance monitoring.
