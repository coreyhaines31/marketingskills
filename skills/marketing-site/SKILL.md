---
name: marketing-site
description: "When the user wants to build or scaffold a marketing website, landing page, or content/blog site for a product or app — especially when their main app is a client-rendered SPA (React, Vue, Angular, Svelte) with poor SEO and needs a separate, fast, fully-indexable site to drive organic traffic. Also use when the user mentions 'landing page', 'marketing site', 'build a website for my SaaS', 'my SPA has no SEO', 'app not on Google', 'add a blog for SEO', 'Astro site', 'static site for SEO', 'hreflang', 'og tags / open graph', 'sitemap', 'robots.txt', 'JSON-LD / structured data for pages', 'multilingual marketing site', or 'share links have no preview image'. Produces a static, SEO-complete site (per-page meta + canonical, Open Graph, hreflang i18n, JSON-LD, sitemap, robots.txt, RSS, blog via content collections) fronting an app via a Login/CTA link. For auditing existing SEO use seo-audit; for pages at scale use programmatic-seo; for structured data use schema; for IA planning use site-architecture."
metadata:
  version: 1.0.0
---

# Marketing Site

Build a fast, **static, SEO-complete marketing site** (landing page + blog) that fronts an existing web application. The output is HTML that search engines and social crawlers can read on the first request — no JavaScript execution required — with per-page metadata, structured data, i18n, and a content engine baked in.

Use this when someone has a working app but **no way to get found**. Skip it when the request is purely strategic (keyword research, an audit, or an IA plan) — those are `seo-audit`, `programmatic-seo`, and `site-architecture`.

## The core problem this solves

Most web apps are **client-rendered SPAs**. When Googlebot or a social crawler (Facebook, X, LinkedIn, Telegram, Slack) fetches a SPA URL, it receives an almost-empty shell:

```html
<body><div id="app"></div><script src="/main.js"></script></body>
```

- **Social crawlers do not run JavaScript at all** → link previews are blank (no title, description, or image).
- **Googlebot can render JS, but slowly and unreliably** → indexing is delayed and fragile, and any auth gate, consent wall, or pre-mount handshake can break it entirely.

The fix is **not** to bolt SSR onto the app. It is to put a **separate static site in front**: the marketing site owns the public, indexable surface (home, features, pricing, blog, legal); the app owns everything behind login. A single "Login"/"Open app" link connects them. The app never needs SEO.

## Recommended stack

**Astro** — content-first, ships zero JS by default, outputs pure static HTML, and has first-class content collections (blog), sitemap, and i18n. Islands let you hydrate only the rare interactive widget. Alternatives (Next static export, Eleventy, Hugo) work; this skill's templates are Astro but the SEO principles are framework-agnostic.

Live in the **same repo** as the app, in a sibling folder (e.g. `web/` next to `frontend/`). Deploy the built `dist/` as static files (CDN or nginx). Route `/` → marketing site, `/app` (or an `app.` subdomain) → the SPA.

## Before starting — gather context

Ask only for what you cannot infer:

1. **What is the app / product?** One or two sentences — becomes the meta description and hero copy. Read the app's README/landing view if it exists.
2. **Domain** (real or placeholder). Needed for `site` config → canonical URLs, sitemap, Open Graph. If unknown, use one `SITE_URL` constant they can change in one place.
3. **Where does the app live?** The Login/CTA link target: same-domain path (`/app`) or subdomain (`app.example.com`). Affects deploy/proxy notes.
4. **Languages.** One or many? Multilingual needs hreflang + a locale routing strategy. Match the app's existing languages if it has them.
5. **Deploy target.** CDN (Cloudflare Pages / Vercel / Netlify) or self-hosted (nginx on a VPS). Affects the adapter/config and the proxy story.
6. **Brand.** Colors, font, logo, tone. Match the app's existing theme so the two feel like one product — pull its CSS variables / Tailwind config.

## Build order

Work in this sequence; each layer depends on the previous. Template files for the starred items are in `assets/scaffold/`.

1. **Scaffold** — `package.json`, `astro.config.mjs`*, `tsconfig.json`, Tailwind config + `global.css`. Set `site`, `trailingSlash`, i18n locales, and the `sitemap()` integration.
2. **Central config*** — one `src/config.ts` holding `SITE_URL`, `APP_URL` (Login target), and brand constants. Every hard-to-change value lives here so going to production is a one-file edit.
3. **SEO infra** — the non-negotiable core:
   - `BaseHead.astro`* — per-page `<title>`, meta description, canonical, Open Graph, Twitter Card, hreflang alternates, favicon, font preconnect.
   - `schema.ts`* + `JsonLd.astro` — JSON-LD builders (Organization, WebSite, FAQPage, BlogPosting, BreadcrumbList).
   - `robots.txt` (dynamic route, references `SITE_URL`, disallows the app path) and `rss.xml` (blog feed).
   - `@astrojs/sitemap` (auto, with hreflang) is wired in step 1.
4. **Layout + chrome** — `BaseLayout.astro` (wraps BaseHead + global JSON-LD + header/footer), `Header` (nav + language switcher + Login button `rel="nofollow"`), `Footer`.
5. **Landing page** — Hero → value pillars (one per core feature, benefit-led not feature-led) → how-it-works → FAQ (also emit FAQPage JSON-LD) → CTA. This is the page most links point at; make its copy real, specific, and skimmable.
6. **Blog engine** — `content.config.ts`* defines the collection + Zod schema; `[slug].astro` renders posts; an index lists them. The blog is the **primary organic-traffic engine** — one indexable, keyword-targeted URL per post. Seed 1–2 real posts, never lorem ipsum.
7. **Supporting pages** — about, pricing, privacy, terms, 404. Privacy/terms are required before running OAuth or paid ads. Footer must not link to pages that 404.
8. **Build & verify** — run the build, then grep the emitted HTML to confirm SEO tags actually render (see the checklist). A page that looks right in dev but ships without canonical/OG is the common failure.

## SEO completeness checklist

Every page must ship these. Full details and copy-paste snippets in `references/seo-checklist.md`.

- **Unique `<title>` and meta description** per page (never a single site-wide title).
- **Canonical URL** — absolute, self-referencing, one per page.
- **Open Graph + Twitter Card** — `og:title/description/url/image` + `twitter:card=summary_large_image`. The image must be a **PNG/JPG at 1200×630** — crawlers reject or mishandle SVG OG images.
- **hreflang** for multilingual — every locale plus `x-default`, on the page and in the sitemap.
- **JSON-LD** — Organization + WebSite site-wide; FAQPage on pages with a FAQ; BlogPosting + BreadcrumbList on posts. Validate in Google's Rich Results Test.
- **sitemap.xml** referenced from **robots.txt**; robots disallows the app/API paths.
- **RSS** feed for the blog.
- **Performance** — static HTML, no render-blocking JS, responsive images, `font-display: swap`. Core Web Vitals are a ranking factor; static Astro passes them by default.
- **Semantic HTML** — one `<h1>` per page, logical heading order, descriptive `alt`, real `<a href>` links (crawlable), not JS click handlers.

## Verify the build, do not trust dev

After building, inspect the emitted files — this catches the most common shipped-broken bugs:

```bash
# canonical, hreflang, OG present in the home page HTML
grep -oE '<(link rel="canonical"|link rel="alternate"[^>]*|meta property="og:[^"]*")[^>]*>' dist/index.html
# JSON-LD types emitted
grep -oE '"@type":"[^"]*"' dist/index.html
# robots + sitemap generated and self-consistent
cat dist/robots.txt && cat dist/sitemap-index.xml
```

Confirm: canonical is absolute and correct, hreflang includes `x-default`, OG image URL resolves, and robots points at the real sitemap.

## Multilingual (hreflang) guidance

- Pick a routing scheme: default locale at root (`/`), others prefixed (`/vi/`, `/de/`). Keep it consistent with the app.
- **Every** page emits `hreflang` links for all locales **plus `x-default`** (points at the default locale). Missing `x-default` is the most common hreflang mistake.
- The sitemap must carry the same alternates (`@astrojs/sitemap` does this when its `i18n` option is set).
- Translate real content, not just chrome. A half-translated page is worse than a clean single-language one.

## Deploy

Static output → serve `dist/` from a CDN or nginx. Two ways to attach the app:

- **Subdomain** (`app.example.com`) — cleanest separation; independent deploys; no path juggling. Recommended.
- **Path** (`example.com/app`) — one domain; requires a reverse proxy and setting the SPA's base path (`base: '/app/'` in its build + router). More moving parts.

Point the marketing site's `robots.txt` `Disallow` at the app path so the app never competes for indexing. Include an nginx snippet in the project README if self-hosting.

## Common mistakes

1. **SVG Open Graph image** — looks fine locally, blank in every social preview. Export a 1200×630 **PNG**.
2. **Site-wide title/description** — one `<title>` for all routes wastes the single strongest on-page signal.
3. **Indexing the app** — letting Googlebot crawl the SPA behind login creates thin/duplicate pages. Disallow it in robots and keep it off the sitemap.
4. **Missing `x-default`** — multilingual sites without it confuse locale selection in search results.
5. **Canonical pointing at the wrong host/protocol** — always build it from a single `SITE_URL`, absolute, https.
6. **Trailing-slash inconsistency** — pick one policy (`trailingSlash`) so canonical, sitemap, and internal links agree; mismatches create duplicate URLs.
7. **`noindex` left in a template** — a stray `noindex` on the base layout silently deindexes the whole site. Only 404/thank-you pages get it.
8. **Lorem ipsum shipped** — placeholder copy gets indexed and read by real users. Write real, specific copy from the start.
9. **Blog as an afterthought** — the blog is the traffic engine, not decoration. Ship the content pipeline and seed real posts.
10. **Bolting SSR onto the SPA instead** — heavier, slower to build, and drags auth complexity into rendering. A separate static front is simpler and faster.

## Task-specific questions to consider

- Is the app's audience local (one language) or international (multilingual + hreflang)?
- What are the 3–5 highest-intent keywords the landing + first blog posts should target?
- Does the product have a free tier / signup bonus worth featuring in the hero and pricing?
- Are there legal/compliance pages required before launch (privacy for OAuth, terms for payments)?
- What is the single primary conversion action (signup, book demo, open app)? Every CTA should point at it.

## Related skills

- **seo-audit** — audit an existing site's technical/on-page SEO before or after building.
- **programmatic-seo** — generate many keyword-targeted pages from a dataset at scale.
- **schema** — deep structured-data implementation beyond the core types here.
- **site-architecture** — plan the URL/IA structure and internal linking.
- **copywriting** / **cro** — sharpen the landing and CTA copy for conversion.
