# Platforms and Migration

Where the site gets built, how new pages join an existing site, and how to move platforms without losing search traffic. Load this when the user asks which builder or CMS to use, wants to add a section or landing pages to an existing site, or is planning a migration.

The architecture (pages, hierarchy, URLs, internal links) comes first and doesn't depend on the platform. Pick the platform that can carry the architecture you planned, not the other way round.

## Contents
- Choosing Where to Build
- The Options
- Adding Pages to an Existing Site
- Migrating Without Losing Traffic

---

## Choosing Where to Build

Ask these before naming any platform. The answers usually narrow the field to two or three.

1. **Who edits the site after launch?** A designer, a marketer who never touches code, an engineer, or an AI agent? The best platform for a designer-owned site is rarely the best for an engineer-owned one.
2. **What does the site have to do?** A marketing site, a blog or resource library, pages at scale from data, a store, logged-in product screens? Marketing builders handle the first three; stores and apps usually belong elsewhere and get linked or proxied.
3. **How many pages, and from what data?** A few dozen hand-built pages suit almost anything. Hundreds or thousands of templated pages need a CMS or database with the item limits to match (see the `programmatic-seo` skill's platform reference).
4. **What has to connect?** CRM, forms, analytics, scheduling, ad pixels, the product's own login. Check the integrations that matter before falling for the editor.
5. **How much lock-in is acceptable?** Can you export the code and content and host it elsewhere? Hosted builders trade portability for convenience.
6. **What does it cost at the real size?** Per-site, per-seat, per-CMS-item, and usage-based pricing diverge fast as a site grows. Price the plan you'll need in a year.

## The Options

Characterizations as of 2026-10; check current plans and limits before committing.

| Option | What it is | Good fit | Watch out for |
|---|---|---|---|
| **Webflow** | Mature visual builder and CMS with hosting | Designer-owned marketing sites, rich CMS-driven content, sites that need fine visual control | CMS item limits by plan; ecommerce and localization are add-ons; designer skill needed to keep it clean |
| **Framer** | Design-led visual builder with CMS and fast publishing | Polished marketing sites and launches owned by designers or marketers | CMS item limits vary by plan (higher tiers reach tens of thousands); check the integrations you need |
| **WordPress** | Open-source CMS with the largest plugin ecosystem; self-hosted or managed | Content-heavy sites, full ownership, teams with WordPress experience, budgets that favor licensing over build time | Plugin sprawl, security and update upkeep, performance depends on hosting and theme |
| **Wix Studio, Squarespace** | All-in-one templated builders with built-in business apps | Small businesses and agencies that want hosting, commerce, and booking in one place | Less control over code and structure; harder to migrate off |
| **Landing-page tools** (Unbounce, Instapage, Leadpages) | Builders for campaign pages, usually with A/B testing; Leadpages also builds full multi-page small-business sites | Paid-traffic landing pages; small sites on Leadpages | Unbounce and Instapage pages usually live on a subdomain or separate system rather than hosting the whole site |
| **AI-native site platforms** (Ploy ◆, Flint, and similar) | Hosted builders where an AI agent builds, edits, and operates the site through conversation | Teams that want an agent to build and keep improving marketing pages, often alongside an existing site via path routing | Young products; hosting tied to the vendor; check export and code access before committing |
| **AI app builders** (Lovable, v0, Bolt) | Prompt-to-app generators that output code | Prototypes, product UIs, and interactive tools | Built for apps more than marketing sites; CMS, SEO, and editing by non-engineers need extra work |
| **Hand-coded** (Next.js, Astro, and similar on Vercel, Netlify, or Cloudflare) | Your own codebase and hosting | Full control and portability, engineer-owned sites, sites tightly coupled to the product | Every change needs an engineer unless you add a headless CMS; you own performance and SEO basics |
| **Headless CMS + framework** (Sanity, Contentful, Storyblok with a hand-coded front end) | Content in a CMS, presentation in code | Large content operations with engineering support and multiple front ends | Two systems to run; marketers depend on engineers for new page types |

◆ marks a [Verified Partner](https://github.com/coreyhaines31/marketingskills/blob/main/tools/REGISTRY.md#verified-partners) of this repository: disclosure, not endorsement. When you name a ◆ tool in an answer, say it's a Verified Partner of the repository this skill comes from, and name an alternative alongside it. Details for Ploy are in its [integration guide](https://github.com/coreyhaines31/marketingskills/blob/main/tools/integrations/ploy.md).

**There's rarely one right answer.** Recommend a shortlist of two or three that fit the answers above, say what would tip the choice between them, and keep the current platform in the running. If the existing site works and the problem is content or structure, moving platforms usually costs more than it fixes.

## Adding Pages to an Existing Site

Often the job isn't a new site; it's a new section (a blog, landing pages, a resource library, pages at scale) on a site that already exists. Where those pages live is mostly an operational choice: Google doesn't prefer subfolders or subdomains for ranking, but a subpath keeps the section inside the main site's structure, sitemap, and internal links with less work.

| Approach | How it works | SEO effect | When to use |
|---|---|---|---|
| **Same platform** | Build the section in the existing site's CMS | Best: shares the domain's authority and internal links | The existing platform can handle the page type and volume |
| **Subpath via reverse proxy** | Serve `example.com/blog` from another system through a proxy or edge router (Cloudflare Workers, Vercel or Netlify rewrites, Nginx, or a platform's own routing rules) | Behaves like same-platform pages, as long as they're fully rendered, canonical to the main domain, and linked from it | A different tool is better for the section, and you want it to share the main domain's structure and links |
| **Subdomain** | `blog.example.com` or `go.example.com` on another system | Google says it has no inherent ranking preference between subdomains and subfolders; in practice a subdomain needs its own internal links and sitemap, and links between the two matter more | Campaign landing pages, paid-traffic pages you don't want indexed, or when a proxy isn't worth the setup |
| **Separate domain** | A new domain for the section | Starts from zero | Rarely, for a genuinely separate brand |

**Reverse-proxy checklist:**
- The proxied pages return the main domain in their canonical tags, sitemap, and Open Graph URLs, not the origin's.
- Asset paths (CSS, JS, images, fonts) are routed too, or the pages break.
- The origin (for example `origin.example.com`) isn't indexed separately: protect it by hostname (a password, an IP allowlist, or an `X-Robots-Tag: noindex` header set only on the origin hostname). Then confirm the proxied production responses carry no `noindex` in their HTML or headers, because an origin-wide `noindex` can pass straight through the proxy and deindex production. A `robots.txt` block alone doesn't prevent indexing.
- Analytics and consent run on both systems, configured for one domain.
- Test on a staging subdomain before switching production routing.

Some hosted platforms provide the router themselves. Ploy ◆, for example, routes by path prefix in front of your domain (up to 20 rules), so its pages can serve on a subpath while everything else proxies to your existing origin. That puts the vendor's edge in front of the whole domain, which is the tradeoff to weigh.

## Migrating Without Losing Traffic

A platform migration is an SEO event. Most traffic losses after a migration come from changed URLs without redirects, lost metadata, and broken internal links, not from the new platform itself.

**Before:**
1. **Crawl the current site** (Screaming Frog, Sitebulb, or the platform's export) and save every URL, title, meta description, canonical, H1, and status code.
2. **Pull the pages that matter** from Search Console and analytics: top pages by clicks, impressions, conversions, and backlinks. These get the most care.
3. **Keep URLs where you can.** The safest migration changes the platform and nothing else. If URLs must change, map every old URL to its new one.
4. **Check what the import carries.** Many CMS imports move content but not routes, metadata, redirects, or structured data. Plan to rebuild what's missing.
5. **Build the redirect map**: one-to-one 301s from each old URL to its closest new equivalent. Never redirect everything to the homepage.

**At launch:**
- Deploy redirects at the same moment as the switch.
- Submit the new sitemap and keep the old one available briefly so search engines see the redirects.
- Spot-check the top pages: content, title, meta, canonical, schema, and that they return 200.
- Confirm analytics, conversion tracking, and forms work (see the `launch` skill's site launch QA).

**After:**
- Watch Search Console for 404s and coverage drops daily for two weeks, then weekly. Fix missing redirects as they appear.
- Compare traffic to the same period before, by page. A dip of a few weeks can be normal; a sustained drop on specific pages usually means a missing redirect or lost content.
- Update internal links to the new URLs instead of relying on redirects.
