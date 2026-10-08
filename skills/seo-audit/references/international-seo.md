# International SEO: Evidence & Sources

Detailed evidence backing the International SEO & Localization section of the SEO Audit skill. Organized by topic with source URLs and key quotes.

---

## Hreflang

### Placement Methods

Google supports three equivalent methods: HTML `<link>` in `<head>`, HTTP `Link` headers, and XML sitemap `<xhtml:link>` elements. Google confirmed no method is prioritized over another.

Google combines signals from both HTML and sitemaps. If the same language-region pair points to different URLs across methods, Google drops that pair rather than guessing.

- [Google Search Central: Localized Versions](https://developers.google.com/search/docs/specialty/international/localized-versions)
- [SEJ: Google Combines Hreflang Signals](https://www.searchenginejournal.com/google-combines-hreflang-signals-from-html-sitemaps/389219/)

### Reciprocal Requirement

Google's docs: "If page X links to page Y, page Y must link back to page X. If not, those annotations may be ignored or not interpreted correctly."

Every page must include itself (self-referencing) in the hreflang set. Missing self-referencing is the #1 error found by Semrush audits. A study of 374,756 domains found 67% of hreflang implementations had issues.

- [Google Search Central: Localized Versions](https://developers.google.com/search/docs/specialty/international/localized-versions)
- [Semrush: 9 Common Hreflang Errors](https://www.semrush.com/blog/hreflang-errors/)
- [SE Land: 31% of International Websites Contain Hreflang Errors](https://searchengineland.com/study-31-of-international-websites-contain-hreflang-errors-395161)

### x-default

Introduced April 2013. Designates the fallback page for users whose language/region matches no declared variant. Can point to the same URL as one of the language-specific alternates. Must be included in the complete set of annotations on every variant page.

- [Google Blog: x-default hreflang](https://developers.google.com/search/blog/2013/04/x-default-hreflang-for-international-pages)
- [Google Blog: How x-default can help you (2023)](https://developers.google.com/search/blog/2023/05/x-default)

### Language & Region Codes

Language: ISO 639-1 (2-letter). Region: ISO 3166-1 Alpha 2 (2-letter). Format: `language[-script][-region]`.

You cannot specify a region code alone. Common mistakes: `en-UK` (should be `en-GB`), `es-419` (not ISO 3166-1). A study found 8.9% of sites using hreflang contain invalid language codes.

- [Google Search Central: Localized Versions](https://developers.google.com/search/docs/specialty/international/localized-versions)
- [SE Land: 31% Study](https://searchengineland.com/study-31-of-international-websites-contain-hreflang-errors-395161)

### Hreflang at Scale (20+ locales)

With 20 locales, HTML `<head>` hreflang adds ~1.5KB per page for zero user benefit. Sitemap-based hreflang has zero runtime performance impact. `<xhtml:link>` child elements do NOT count toward the 50,000 URL sitemap limit (only `<loc>` elements count).

John Mueller recommends focusing hreflang on pages receiving wrong-language traffic, not every page: "I wouldn't do it for any of the other pages of the site because it's so complex & hard to manage."

- [SERoundtable: Child Elements Don't Count](https://www.seroundtable.com/google-child-elements-dont-count-towards-sitemap-url-limit-34377.html)
- [SERoundtable: Where To Focus Hreflang](https://www.seroundtable.com/using-hreflang-34127.html)
- [Yoast: hreflang Ultimate Guide](https://yoast.com/hreflang-ultimate-guide/)

### Google vs Bing

Bing treats hreflang as a "weak signal." Bing relies on `content-language` meta tag, HTML `lang` attribute, ccTLDs, and server location. Yandex supports hreflang like Google.

For both engines: implement hreflang (Google/Yandex) + `<html lang="...">` + `<meta http-equiv="content-language">` (Bing).

- [Digital Ready Marketing: Bing Doesn't Use Hreflang](https://digitalreadymarketing.com/bing-doesnt-use-hreflang-annotation-what-does-it-use/)
- [Yoast: hreflang Ultimate Guide](https://yoast.com/hreflang-ultimate-guide/)

---

## Canonicalization & i18n

### Choose Canonicals by Content and Language

Use self-referencing canonicals for distinct locale pages, including genuinely translated content. Do not consolidate different-language translations merely because they describe the same product.

For similar or duplicate regional pages in the **same language**, Google recommends choosing a preferred canonical and using consistent `hreflang` annotations. For example, equivalent German content at `example.de/` and `example.com/de/` can share a preferred canonical; every regional URL is not required to canonicalize to itself.

- [Google: Handling duplicate multilingual/multi-regional pages](https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites#handling-duplicate-pages-with-multilingualmulti-regional-sites)
- [Google: Consolidate Duplicate URLs](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)

### Align Canonical and Hreflang Signals

Keep canonical targets and `hreflang` clusters consistent with the chosen content/language strategy. `hreflang` identifies localized alternatives; it does not force Google to index each URL independently. Canonicals are signals to Google's selection process, not an indexing guarantee.

The preferred canonical must be a URL inside the `hreflang` cluster. Google ignores `hreflang` on a URL that is canonicalized to another one.

- [Google: Consolidate Duplicate URLs](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)

### Near-Duplicate Regional Variants

Mueller (2023 Office Hours): "If the content is completely the same, and we can't tell any difference, then for simplicity and user experience we may just show one version -- even if hreflang is present."

Google may consolidate identical or near-duplicate regional content despite `hreflang`. Use the same-language preferred-canonical strategy above where appropriate; do not promise that either self-canonicals or cosmetic differences will keep every regional URL indexed.

- [International Web Mastery: Same-Language Duplicate Pages](https://internationalwebmastery.com/blog/how-google-handles-canonicalization-of-same-language-duplicate-near-duplicate-pages/)
- [Google: Managing Multi-Regional Sites](https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites)

### Pagination Across Locales

Google: "Don't use the first page of a paginated sequence as the canonical page. Instead, give each page its own canonical URL." Each paginated page in each locale gets self-referencing canonical. `rel="next/prev"` deprecated March 2019.

- [Google: Pagination Best Practices](https://developers.google.com/search/docs/specialty/ecommerce/pagination-and-incremental-page-loading)

---

## International Sitemaps

### Structure

Each `<url>` entry includes `<xhtml:link>` alternates for every locale. Requires `xmlns:xhtml="http://www.w3.org/1999/xhtml"` namespace.

Split sitemaps by content type, not by locale. Splitting by locale creates maintenance problems because every locale sitemap must reference every other locale (reciprocal requirement).

- [Google Search Central: Localized Versions](https://developers.google.com/search/docs/specialty/international/localized-versions)
- [Lumar: How Google Handles Hreflang](https://www.lumar.io/office-hours/hreflang/)

### Size Limits

50,000 URLs / 50MB uncompressed per sitemap. Only `<loc>` elements count toward the 50K limit. But with 20 hreflang alternates per entry, the 50MB file size limit becomes the bottleneck. Plan for 2,000-5,000 URLs per sitemap when using full hreflang.

- [Google: Build and Submit a Sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [SERoundtable: Sitemap 50,000 Limit](https://www.seroundtable.com/google-sitemap-50-000-limit-based-on-location-urls-not-alternative-urls-33843.html)

### Submission

Submit the sitemap index in Search Console AND reference it in robots.txt. Individual child sitemaps can be submitted separately for per-sitemap reporting.

- [Google: Build and Submit a Sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)

### Next.js Caveat

Next.js `alternates.languages` does NOT automatically include a self-referencing `<xhtml:link>` for the `<loc>` URL. You must explicitly include the `<loc>` URL's own language in the `languages` object.

- [Next.js Docs: sitemap.xml](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap)

---

## URL Structure

### Strategies Compared

Google treats subdirectories and subdomains equivalently. Mueller: "From our point of view...they say subdomains and subdirectories are essentially equivalent."

URL parameters (`?lang=en`) are explicitly "Not recommended" per Google docs.

- [Google: Managing Multi-Regional Sites](https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites)

### Default Language

Mueller recommends: set `/` as x-default, put each language in its own prefix. Without marking `/` as x-default, "to Google it can look like '/' is a separate page from the others."

- [Google Blog: x-default](https://developers.google.com/search/blog/2023/05/x-default)
- [Google Blog: Creating the Right Homepage](https://developers.google.com/search/blog/2014/05/creating-right-homepage-for-your)

### Content Negotiation / IP Redirects

Google strongly advises against locale-adaptive pages. Googlebot crawls from US IPs and does not send Accept-Language headers. Separate URLs + hreflang are required.

- [Google: Locale-Adaptive Pages](https://developers.google.com/search/docs/specialty/international/locale-adaptive-pages)

### Trailing Slash Consistency

Mueller: trailing slash is "a significant part of the URL and will change the URL if it's there or not." Pick one format for all locale paths, internal links, canonicals, hreflang, and sitemaps.

Mueller (2025): "Consistency is the biggest technical SEO factor."

- [SERoundtable: Consistency Is The Biggest Technical SEO Factor](https://www.seroundtable.com/google-consistency-seo-40427.html)

### Search Console Geotargeting

The International Targeting report is deprecated. Google now relies entirely on hreflang, content language analysis, and linking patterns. You can add subdirectory properties for per-locale reporting.

- [Google Support: International Targeting Deprecated](https://support.google.com/webmasters/answer/12474899?hl=en)

### Framework Locale Modes

Use `localePrefix: 'always'` (next-intl) or equivalent. Never hide locale from URLs -- Google needs unique URLs per language. Using `'never'` mode disables alternate links entirely.

- [next-intl: Routing Configuration](https://next-intl.dev/docs/routing/configuration)
- [Next.js Discussion #18419](https://github.com/vercel/next.js/discussions/18419)

---

## Content Quality Across Locales

### Auto-Translated Content (2025 Stance)

Google removed longstanding guidance advising against auto-translated content in mid-2025. Current stance: "Our policies do not strictly define content that has been translated by AI as spam." The scaled content abuse policy mentions translation as a possible vector, but does not ban it.

Reddit scaled AI translations to 35+ languages with Google's knowledge. The key distinction is intent and quality, not the method.

- [Google Spam Policies](https://developers.google.com/search/docs/essentials/spam-policies)
- [Glenn Gabe: Auto-Translating Content](https://www.gsqi.com/marketing-blog/auto-translating-content-google-scaled-content-abuse/)
- [SE Land: Reddit AI Translations](https://searchengineland.com/google-comments-on-reddits-use-of-ai-to-translate-its-pages-456908)

### Thin Locale Pages

Google: "Localized versions of a page are only considered duplicates if the main content of the page remains untranslated." Pages with only translated boilerplate get clustered as duplicates.

Do NOT use noindex for unwanted locale pages (wastes crawl budget). Do not canonicalize distinct translations to another language merely to hide thin content. Best approach: don't create locale pages you can't make genuinely helpful.

- [Google: Localized Versions](https://developers.google.com/search/docs/specialty/international/localized-versions)
- [Google: Crawl Budget Management](https://developers.google.com/search/docs/crawling-indexing/large-site-managing-crawl-budget)

### Helpful Content System Impact

Merged into core ranking March 2024. Site-wide signal: "any content -- not just unhelpful content -- on sites determined to have relatively high amounts of unhelpful content overall is less likely to perform well in Search."

Low-quality translated pages can drag down the entire site. This is the strongest argument against creating locale pages that aren't genuinely helpful.

- [Google Blog: Helpful Content Update](https://developers.google.com/search/blog/2022/08/helpful-content-update)
- [Amsive: What Changed in 2024](https://www.amsive.com/insights/seo/googles-helpful-content-update-ranking-system-what-happened-and-what-changed-in-2024/)

### Partial Translation

Google: "Translating only the boilerplate text of your pages while keeping the bulk of your content in a single language...can create a bad user experience." Google uses visible content (not lang attribute) to determine page language.

Translate ALL content on a page if you create a locale version. Untranslated metadata (title, description) in the wrong language reduces CTR.

- [Google: Managing Multi-Regional Sites](https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites)

### Crawl Budget

Only a concern for 1M+ pages or 10K+ pages changing daily. But alternate URLs (hreflang targets) do consume crawl budget. Broken hreflang links waste budget AND invalidate signals.

- [Google: Crawl Budget Management](https://developers.google.com/search/docs/crawling-indexing/large-site-managing-crawl-budget)
- [Google Blog: Crawl Budget](https://developers.google.com/search/blog/2017/01/what-crawl-budget-means-for-googlebot)

### Locale-Specific Signals

Google identifies audience via: "local addresses and phone numbers on the pages, the use of local language and currency, links from other local sites, or signals from your Business Profile."

- [Google: Managing Multi-Regional Sites](https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites)
