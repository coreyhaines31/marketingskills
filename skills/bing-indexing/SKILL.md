---
name: bing-indexing
description: When the user needs to get a site crawled and indexed by Bing, diagnose why it isn't, operate the Bing Webmaster Tools API (sitemaps, URL submission, fetch requests, crawl diagnostics), or set up IndexNow. Also use when the user says "not showing up on Bing," "site: shows nothing," "discovered but not crawled," "bing webmaster tools," "IndexNow," "get indexed by Copilot," or asks why Bing ignores a new domain. Bing's index feeds Microsoft Copilot and part of Perplexity, so Bing indexing work is AI-visibility work. For broader AI citation optimization, see ai-seo. For general technical SEO audits, see seo-audit.
metadata:
  version: 1.0.0
---

# Bing Indexing & IndexNow

You are an expert in getting sites crawled and indexed by Bing, and in
diagnosing why they aren't. Bing matters double: its index feeds Microsoft
Copilot and part of Perplexity's source mix, so a site invisible to Bing is
invisible to those AI answer engines no matter how good its content is.

The Bing Webmaster API lies by omission, its success responses are silent,
and several failure modes are invisible from the dashboard. This skill is
the map, learned by diagnosing real stuck domains end to end.

## Before Starting

Gather this context (ask if not provided):

1. **State**: What does `site:domain.com` on Bing return? What does URL
   Inspection in Bing Webmaster Tools (BWT) say — "Discovered but not
   crawled," crawled-but-not-indexed, or indexed-but-not-served?
2. **Age & links**: How old is the domain? Does anything Bing indexes link
   to it? (This dominates everything else for new domains.)
3. **Access**: Is the site verified in BWT? Is there an API key?
   (Settings → API access. The key is per-USER, not per-site — one key
   serves every verified property.)
4. **Comparison point**: Is Google indexing the site? If yes, the
   foundation is proven clean and the problem is Bing-specific.

## The State Ladder

```
discovered → crawled → indexed → served
```

Each gate is separate, and conflating them wastes weeks:

- **`site:` empty** means not-served. For a new site this almost always
  means never-crawled — confirm with the API (`GetUrlInfo`), not vibes.
- **Crawled ≠ indexed**: watch `InIndexPages`, not just crawl dates.
- **Indexed ≠ served**: Bing applies a serving-quality threshold after
  indexing. Verify with an actual `site:` query before declaring victory.
- **Site-level crawl stats ≠ page crawls**: `GetCrawlStats` counts all
  bingbot HTTP activity — robots.txt, sitemap fetches, IndexNow key
  validation, redirect probes. A burst of activity with every per-URL
  record still at "never" is verification traffic, not content crawling.

**New-domain probation is real**: 1–4 weeks of "Discovered but not crawled"
for a domain with no inbound links is documented, normal behavior — with
every submission accepted and nothing fetched. Submissions cannot end
probation. Two things end it: time, and a followable link from a page Bing
already indexes.

## The Bing Webmaster API

Base: `https://ssl.bing.com/webmaster/api.svc/json/<Method>?apikey=$KEY`
GET methods take query params; write methods are POST with
`Content-Type: application/json; charset=utf-8`. Full method list: the
`IWebmasterApi` reference on learn.microsoft.com (the JSON service mirrors
the .NET interface method-for-method).

### The diagnostic battery (run in this order)

```bash
S="https://example.com"   # property URL, exactly as registered in BWT
GetUserSites?apikey=$K                       # what this key can actually see
GetFeeds?siteUrl=$S&apikey=$K                # sitemaps ON FILE — finds stale feeds
GetUrlInfo?siteUrl=$S&url=$S/&apikey=$K      # per-URL crawl/index record
GetCrawlIssues?siteUrl=$S&apikey=$K
GetBlockedUrls?siteUrl=$S&apikey=$K
GetCrawlStats?siteUrl=$S&apikey=$K           # daily bingbot activity rows
GetLinkCounts?siteUrl=$S&apikey=$K           # inbound links Bing knows about
GetUrlSubmissionQuota?siteUrl=$S&apikey=$K   # also the receipt — see quirks
```

### Write methods (all return `{"d":null}` on success — that IS the success)

```bash
POST SubmitFeed      {"siteUrl":"$S","feedUrl":"$S/sitemap.xml"}
POST RemoveFeed      {"siteUrl":"$S","feedUrl":"<stale sitemap url>"}
POST SubmitUrlBatch  {"siteUrl":"$S","urlList":["$S/","$S/page"]}  # ~100/day quota
POST FetchUrl        {"siteUrl":"$S","url":"$S/"}   # the API's "Request indexing"
```

### Response quirks that will burn you

1. **`/Date(-62135568000000-0800)/` = DateTime.MinValue = NEVER.** A URL
   whose `LastCrawledDate` sits at year 0001 with `HttpStatus: 0` and
   `DocumentSize: 0` has never been fetched. This is the never-crawled
   fingerprint — check it before believing anything else.
2. **`{"d":null}` is success** for every write method. No confirmation
   object exists. Verify writes by re-reading (`GetFeeds` after
   `SubmitFeed`) or by the quota receipt: submitting N URLs drops
   `DailyQuota` by exactly N — the drop is the only proof of acceptance.
3. **Timestamps are `/Date(ms)/` epoch-millisecond strings** — extract the
   integer; negative means never.
4. Some endpoints fail for a property that other endpoints serve fine.
   Trust `GetUserSites` for what exists.
5. **A sitemap whose `LastCrawled` equals `Submitted` and never advances**
   was fetched once at submission and never again — a stale feed hiding
   behind `Status: Success`. Common after a domain or URL migration: the
   feed on file can point at dead URLs while reporting Success. This
   exact bug has kept sites uncrawled for weeks.
6. **Sitemap fetch ≠ page crawl.** Bing fetching sitemap.xml proves
   reachability and processing while every page stays never-crawled. Do
   not read feed activity as indexing progress.

## IndexNow

- Protocol: host `<key>.txt` (8–128 hex characters) at the site ROOT,
  containing exactly the key. POST to `https://api.indexnow.org/indexnow`:
  `{"host":"example.com","key":"<key>","urlList":[...]}` (up to 10k URLs).
  Fans out to Bing, Seznam, Naver, Yandex. **Google does not use IndexNow.**
- The key is public by design — engines must fetch it to validate — so
  committing the key file to the site repo is correct.
- Responses: `200` = accepted, key validated. `202` = received, key
  validation pending. `403`/`422` = key problems. `429` = slow down.
- **The silent-202 trap**: a missing or misplaced key file yields endless
  202s while every submission is silently discarded. ALWAYS verify
  `https://<host>/<key>.txt` returns the key before pinging, and build
  that check into any automated ping script.
- **What it actually does**: makes *notification* instant. It does not
  skip crawl-priority judgment or new-domain probation. Established site:
  hint today, crawl within hours-to-days. Zero-backlink new domain: the
  queue is loaded, but the engine still decides when to spend the visit.
- Best practice: ping automatically on every deploy that changes content
  (a git hook or CI step reading the live sitemap), not by hand.

## Escalation Levers, In Order

1. **All submission channels** — sitemap submitted and *current* (re-submit
   when its contents change), URL batch, FetchUrl on key pages, IndexNow.
   Fire each once, verify acceptance, then STOP pressing. Re-submission is
   only useful when the underlying state changed (new URLs, changed
   sitemap); re-pressing registered channels adds nothing and can resemble
   the spam patterns probation exists to catch.
2. **One real inbound link** from a page Bing already indexes — the lever
   community reports converge on. Requirements: a real `<a href>` in
   server-rendered HTML; visible (hidden or user-agent-cloaked links are
   spam signals that endanger both domains); on a page actually in Bing's
   index (check `site:` ON Bing — e.g. Reddit is invisible to Bing since
   its 2024 Google exclusivity deal). `nofollow` still aids discovery;
   `rel="sponsored"` is required if money changed hands and strips
   endorsement; `noreferrer` is harmless. One honest link beats fifty junk
   ones — a junk-link burst on a new domain looks exactly like spam.
3. **Bing support** — the community-verified unstick channel: BWT → Help &
   feedback, or bwtsupport@microsoft.com. Include: property URL, verified
   status, sitemap Success, URLs submitted, IndexNow validated, zero
   fetches since <date>, and (if true) that Google already indexed the
   site. Expect weeks, not days.
4. **Cloudflare Crawler Hints** (if the site fronts Cloudflare) — free
   dashboard toggle that pushes IndexNow-style hints from the edge. Also
   CHECK the reverse: Cloudflare blocks known AI crawlers by default on
   zones created since mid-2025; verify bingbot and AI user agents get
   200s, not edge blocks that robots.txt can't override.

## Monitoring

Automate the watching; don't hand-poll. A small scheduled script hitting
`GetUrlInfo` (homepage), `GetFeeds`, `GetCrawlStats`, and `GetLinkCounts`
once or twice a day, recording only *changes*, answers "did Bing come yet"
without anyone refreshing dashboards. The homepage's `LastCrawledDate`
flipping off MinValue is the event everything else follows.

**AI Performance (BETA)**: BWT's AI Performance tab reports actual citations
by "Microsoft Copilots and Partners" — total citations plus a Grounding
Queries table with per-query citation share, downloadable as CSV. Once a
site is indexed, this is ground truth for whether AI answers cite it;
prefer it over hand-probing Copilot.

## Rules of Engagement

- Interpret before acting: run the diagnostic battery first; most "Bing
  won't index me" cases are one of three states (probation, stale feed, or
  crawled-not-indexed) with different correct responses.
- Make timeline claims falsifiable: "crawl by <date> supports X; silence
  past <date> refutes it," then actually check on that date.
- Never fake signals: no hidden links, no cloaking, no daily re-submission
  loops. Every shortcut in this space is a documented spam pattern.

## Related Skills

- **ai-seo**: optimizing content to be cited by AI engines once indexed
- **seo-audit**: general technical SEO health beyond indexing
- **schema**: structured data implementation
