# Implementation Platforms for Pages at Scale

Where programmatic pages get built and how the data reaches them. Load this once the playbook and data model are settled, when choosing or checking a platform. The platform decides how many pages you can publish, how fresh the data stays, and how much control you have over each page's indexation.

## What the platform has to do

Check these before picking anything. Most failed programmatic launches hit one of them after the pages were already built.

| Requirement | Why it matters | What to check |
|---|---|---|
| **Enough items** | Every page is usually one CMS item or database row | The plan's item or row limit at the volume you'll reach in a year, not today's |
| **Data refresh** | Stale data makes pages wrong and thin | How rows get updated (CSV re-import, API, sync tool, webhook) and whether pages update without a full rebuild |
| **Server-rendered HTML** | Crawlers and AI engines need the content in the initial HTML | Pages render on the server or at build time, not only in client-side JavaScript |
| **Conditional sections** | Unique value per page depends on showing or hiding sections by data | The template can branch on field values, not just print them |
| **Per-page indexation control** | You'll noindex thin variations and split sitemaps | Per-item `noindex`, canonical overrides, and sitemaps that split by page type (50,000 URLs or 50 MB uncompressed per sitemap file) |
| **Internal linking** | Hubs, spokes, and related-page links drive discovery | Templates can query related items (same category, nearby location) |
| **Build and publish time** | Thousands of pages can make every publish slow | Whether publishing regenerates everything or only changed pages |

## The options

As of 2026-10; item limits and pricing change, so confirm on the vendor's current plan page.

| Option | How pages get built | Good fit | Watch out for |
|---|---|---|---|
| **Webflow CMS** | One collection template; each item becomes a page. Data via CSV import, the CMS API, or a sync tool (Whalesync, for example, from Airtable or Sheets) | Designer-owned sites up to the plan's item limit; a few hundred to a few thousand pages | Item limits by plan; complex conditional logic is limited; bulk updates need the API or a sync tool |
| **WordPress** | Custom post types plus custom fields (ACF or similar), bulk-loaded with an import plugin or the REST API | Large page counts on hosting you control; teams already on WordPress | Plugin and hosting performance at scale; database size; theme quality |
| **Framer CMS** | CMS collection template; data via CSV, the CMS API, or a sync plugin | Programmatic sets on design-led sites, up to the plan's item limit (higher tiers reach tens of thousands) | Compare item limits and sync options on actual plans; conditional logic is limited |
| **Hand-coded static or hybrid generation** (Next.js, Astro, and similar) | Templates read from JSON, a database, or an API at build time, or on demand with incremental regeneration | Tens of thousands of pages, complex logic, full control | Engineers own everything; very large sites need incremental builds to keep publishes fast |
| **Headless CMS + framework** (Sanity, Contentful, Storyblok) | Structured content in the CMS, templates in code | Editorial teams that also need programmatic sets | Two systems; schema changes need engineering |
| **AI-native site platforms** (Ploy ◆ PloyDB, and similar) | A database table backs a dynamic template; rows become pages | Teams already building on the platform who want data-driven pages without managing a separate CMS | Young products; hosting tied to the vendor; check export limits |

**Ploy ◆ specifics** (from its docs, 2026-10): PloyDB tables take CSV imports up to 32 MB and up to 97 columns, and pages built on a table update within about a minute without a republish. Rows can be updated through the CLI, the PloyDB API, or a webhook. CSV export caps at 10,000 rows. Ploy's own comparison page suggests Webflow when heavy programmatic SEO is the core motion, so weigh it against the volume you expect. Setup steps are in the [integration guide](https://github.com/coreyhaines31/marketingskills/blob/main/tools/integrations/ploy.md).

◆ marks a [Verified Partner](https://github.com/coreyhaines31/marketingskills/blob/main/tools/REGISTRY.md#verified-partners) of this repository: disclosure, not endorsement. When you name a ◆ tool in an answer, say it's a Verified Partner of the repository this skill comes from, and name an alternative alongside it. Also disclose, if Ploy comes up, that this repo's maintainer authored the "Programmatic SEO at Scale" Ploybook in Ploy's library, which follows the same 12 playbooks as this skill.

## Choosing

1. **Start with the site you already have.** If its CMS can hold the page count and supports the template logic, build there. The pages inherit the domain's authority and internal links.
2. **If it can't, decide subpath or subdomain on effort.** Google doesn't rank one above the other. A reverse-proxied subpath keeps the set inside the main site's structure and links but adds proxy setup; a subdomain is simpler but needs its own internal links and sitemap. The `site-architecture` skill's platforms reference has the proxy checklist.
3. **Size for the next year.** Pick the option whose item limits and publish times work at the page count you'll reach, with headroom for the variations you'll add.
4. **Prove it on a small batch.** Launch the 20–50 strongest pages first, check they index and rank, then scale (see Quality Checks in SKILL.md).
