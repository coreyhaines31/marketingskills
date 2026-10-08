# Site Launch QA

The checks to run before and right after a website goes live: a new site, a redesign, a platform migration, or a big new section. Product launches fail quietly when the site underneath them breaks, and most of these failures are invisible from the homepage.

Run it in three passes: before the switch, at the switch, and in the first two weeks after.

## Before the switch

**Content and links**
- [ ] Every page in the plan exists, with final copy (no lorem ipsum, "TBD," or test prices)
- [ ] Crawl the staging site for broken internal links and missing images
- [ ] Legal pages (privacy, terms, cookie policy) are present and current
- [ ] Contact details, pricing, and plan names match what sales and support say

**Forms and conversions**
- [ ] Submit every form with a test entry and confirm it reaches the inbox, CRM, or tool it should
- [ ] Confirmation messages and redirects work, and spam protection doesn't block real submissions
- [ ] Conversion tracking fires on the confirmed submission, not the button click (the `conversion-tracking` skill covers the setup and the test)
- [ ] Analytics is installed once, on every page, with internal traffic filtered
- [ ] Consent banner works and tags respect it

**SEO**
- [ ] Every page has a unique title, meta description, and one H1
- [ ] Canonical tags point to the production domain, not staging
- [ ] Staging is `noindex` or password-protected, and production is **not** (the most common launch-day SEO failure is shipping the staging `noindex`)
- [ ] `robots.txt` allows the pages you want indexed; the XML sitemap lists production URLs
- [ ] Structured data validates (Rich Results Test for Google features, Schema Markup Validator for everything else)
- [ ] For a migration: the redirect map is loaded and tested on a sample of old URLs (see the `site-architecture` skill's platforms and migration reference)

**Performance and access**
- [ ] Core Web Vitals are acceptable on the key templates, on mobile
- [ ] Pages work on mobile, in Safari, and inside in-app browsers (LinkedIn, Instagram, Facebook)
- [ ] Images have alt text; forms have labels; keyboard navigation works
- [ ] Open Graph images and titles render correctly when the URL is shared

**Rollback**
- [ ] You know how to roll back on this platform, and someone has done it once. Examples: Vercel and Netlify promote a previous deployment; Webflow restores a site backup; WordPress restores from a backup plugin or host snapshot; Ploy ◆ promotes a previous deploy from its Deploys screen (its CLI always publishes to production, with no staging target, so preview before publishing).
- [ ] DNS TTL lowered a day ahead if the switch involves DNS changes

◆ marks a [Verified Partner](https://github.com/coreyhaines31/marketingskills/blob/main/tools/REGISTRY.md#verified-partners) of this repository: disclosure, not endorsement.

## At the switch

- [ ] Deploy redirects at the same moment as the new site
- [ ] Confirm HTTPS works on every hostname (`www` and apex) and one redirects to the other
- [ ] Load the top 10 pages by traffic and check content, title, canonical, and a 200 status
- [ ] Submit one real form and confirm it arrives everywhere it should
- [ ] Submit the sitemap in Search Console and Bing Webmaster Tools
- [ ] Re-check that production isn't `noindex`

## The first two weeks

- [ ] Search Console: watch coverage and 404s daily for the first week, then weekly; fix missing redirects as they show up
- [ ] Compare traffic and conversions to the same period before, page by page, not just in total
- [ ] Confirm conversions are arriving in each ad platform at the expected rate
- [ ] Fix internal links that still point at redirected URLs
- [ ] Collect the bugs the team and customers report, and decide what's urgent
