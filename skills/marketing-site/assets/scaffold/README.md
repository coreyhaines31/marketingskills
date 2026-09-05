# scaffold/ — copy-and-adapt templates

Drop-in starting points for an Astro SEO marketing site. Copy into a new `web/` (or standalone) Astro project and edit `config.ts` first — everything else reads from it.

| File | Goes to | Purpose |
|------|---------|---------|
| `config.ts` | `src/config.ts` | The one file to edit for production: `SITE_URL`, `APP_URL`, brand, locales. |
| `astro.config.mjs` | project root | `site`, i18n locales, sitemap (with hreflang), Tailwind. |
| `BaseHead.astro` | `src/components/BaseHead.astro` | Per-page title/desc, canonical, OG, Twitter, hreflang. |
| `schema.ts` | `src/lib/schema.ts` | JSON-LD builders (Organization, WebSite, FAQ, Article, Breadcrumb). |
| `i18n-utils.ts` | `src/i18n/utils.ts` | Locale routing + hreflang path helpers. |
| `content.config.ts` | `src/content.config.ts` | Blog collection schema (content collections). |

**Order:** edit `config.ts` → wire `astro.config.mjs` → render `BaseHead` inside a `BaseLayout` → add pages → add blog. Then build and grep `dist/` to verify tags render (see `../../references/seo-checklist.md`).

**Single-language site:** delete the `i18n` block in `astro.config.mjs`, set `LANGS = ['en']` in `config.ts`, and the hreflang loop collapses to a single self-reference (harmless) — or trim it.

**Not included** (write per project): `BaseLayout.astro`, `Header`/`Footer`, landing sections, `robots.txt.ts`, `rss.xml.ts`, blog pages. The SKILL.md build order covers these; they are short and project-specific.
