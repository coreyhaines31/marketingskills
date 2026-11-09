# Data Sources for a Teardown

Where each stage's evidence comes from. The skill is tool-agnostic for search and traffic data: use whatever the user has, but keep one vendor per curve. Social posts come from ScrapeCreators or Apify. Free sources go first. Quote a paid call's cost before making it, and keep a running total against the cap.

## Contents
- The bundled script
- Free sources
- Search, traffic, and backlinks
- AI mentions and citations
- Social posts and ad libraries
- Transcripts
- Browser and inbox for going inside
- The user's own data
- When a source fails

---

## The Bundled Script

`scripts/teardown.mjs` (Node 18+, no dependencies, no API keys) covers the free evidence:

| Command | What it returns |
|---|---|
| `site <domain>` | Every sitemap URL, grouped by page family, with locale prefixes folded in |
| `stack <domain> --months 24` | Ad pixels, analytics, testing, referral, and lifecycle scripts, with the first month each appears in Wayback's monthly captures |
| `history <url> --months 24` | Months a page's listed prices changed, with the archive link for each |
| `hero <url> --months 24` | Months the homepage headline, title, or meta description changed, with archive links |
| `sitemap-growth <domain> --months 24` | Sitemap size by month, and when each page family first appeared |
| `dns <domain>` | Mail tools (SPF, MX), domain verifications, and the platforms behind common marketing subdomains |
| `subdomains <domain>` | Subdomains from certificate logs with first-seen dates, preview and staging names filtered out |
| `ads <name> --domain <domain>` | Links to the Meta, Google, LinkedIn, and TikTok ad libraries for the company |
| `sc-ads <name> --domain <domain>` | Active Meta, Google, and TikTok ads through ScrapeCreators (needs `SCRAPECREATORS_API_KEY`; `--dry-run` shows the requests) |
| `detect <domain>` | Likely industry packs with the reasons (scripts, page text, schema types) |
| `shopify <domain>` | Public Shopify catalog: products with created dates, prices and sale flags, bestseller order, installed apps |
| `experiments <domain>` | Client-side testing tools, plus readable Optimizely and GrowthBook config names |
| `phones <url>` | Phone numbers in the page, call-tracking tools, and UTM test URLs for a browser check |
| `filings <company>` | SEC filings for public companies and Form D fundraise filings (needs a contact in `--ua` or `SEC_USER_AGENT`) |
| `cfpb <company>` | CFPB consumer complaints by month, with top products and issues |
| `fdic <bank>` | FDIC quarterly assets, deposits, and employee counts |
| `jobs <domain>` | Open roles from a public Greenhouse, Lever, or Ashby board: functions, marketing channels hired for, tools named, languages |
| `reviews <app> --domain <domain>` | App Store reviews: volume and rating by month, terms that skew to 1-2 star reviews, recent low reviews (`--from file.csv` for any other source) |
| `adoption --npm <pkg> --pypi <pkg> --github <owner/repo>` | Monthly npm and PyPI downloads and GitHub star history (stars need `GITHUB_TOKEN`) |
| `compare <domain> <domain> ... --you <domain>` | Several competitors side by side: what everyone does, what only one does, what the user lacks (Landscape mode) |
| `moves` | Lift per cluster of moves and leading channels (stage 7) |
| `diff` | Moves in a new log that weren't in the old one (Watch mode) |

Limits to state in the method notes:
- `stack` only sees scripts in the page source. Tags loaded through a tag manager or after a consent banner won't show, so a missing pixel isn't proof the channel wasn't used.
- `stack`'s first month is the first monthly capture with the script. If it equals the window's start month (`present_at_start`), the tool was already there.
- When a site blocks scripted fetches, `detect`, `experiments`, and `phones` read its latest Wayback capture instead and say so in `source`. The script doesn't disguise itself to get past a block.
- `history` reads prices from the HTML. Pages that render prices with JavaScript show up under `no_prices`. Open those captures by hand.

## Free Sources

| Source | Use it for |
|---|---|
| The target's site | Pricing, sign-up flow, docs, changelog dates, partner and affiliate pages, badges |
| Wayback Machine | When pages and page families first appeared: `web.archive.org/cdx/search/cdx?url=target.com/templates/*&output=json&collapse=urlkey` lists archived URLs with their dates |
| Ad libraries | Active ads, run dates, and landing pages (links from `ads`) |
| Google Trends | Relative brand interest by month, when no brand search volume is available |
| AI assistants | The stage 2 AI answer checks, run by hand |
| Search operators | `"made with target"`, `site:reddit.com "target"`, `site:target.com/compare` |
| Careers page and public job boards | Open roles for the hiring check (`jobs`) |
| App Store, npm, PyPI, and GitHub APIs | Reviews (`reviews`), downloads and stars (`adoption`) |

## Search, Traffic, and Backlinks

Use whichever of these the user already has. Pick one for the curve and keep it for the whole window, and for the user's own domain in stage 8.

| Source | Monthly history | Keywords by URL | Backlinks and anchors | Access |
|---|---|---|---|---|
| [DataForSEO](../../../tools/integrations/dataforseo.md) | Historical rank overview | Ranked keywords | Backlinks summary, anchors | Pay per call; CLI in the repo |
| [Semrush](../../../tools/integrations/semrush.md) | Organic traffic history | Organic positions | Backlinks, anchors | Subscription; MCP |
| [Ahrefs](../../../tools/integrations/ahrefs.md) | Organic traffic history | Organic keywords | Referring domains, anchors | Subscription; MCP |
| [Similarweb](../../../tools/integrations/similarweb.md) | Visits and traffic sources by month | Top keywords | - | Subscription |
| [RankParse](../../../tools/integrations/rankparse.md) | - | - | Backlinks, tech stack | Pay per call |

For tech stack beyond the page source, [TheirStack](../../../tools/integrations/theirstack.md) infers tools from job posts and also covers the hiring check. For news, funding, and mentions, [Exa](../../../tools/integrations/exa.md) searches the web by meaning. Multi-provider data gateways (one key, many vendors, billed per call) are listed in the [tools registry](../../../tools/REGISTRY.md).

## AI Mentions and Citations

Use the prompt tracker the user has connected. It gives share of voice and citations over time, which can go on the timeline next to traffic. Run the same prompt set for the target and the user.

| Option | Notes |
|---|---|
| Prompt trackers | Peec AI, Otterly, ZipTie, LLMrefs, Profound, Omnia, Ahrefs Brand Radar, Semrush. See the monitoring tools table in **ai-seo** |
| [Magister](https://magistermarketing.com?ref=marketingskills) | Runs AI visibility checks and citation reports across assistants from its connected workspace |
| Manual checks | The free fallback: ask three to five buyer questions in ChatGPT, Perplexity, Gemini, and Google AI Overviews; record the order brands are named and the pages cited |

*Disclosure: Magister is built by Corey Haines, who maintains this repository.*

## Social Posts and Ad Libraries

| Need | [ScrapeCreators](../../../tools/integrations/scrapecreators.md) | [Apify](../../../tools/integrations/apify.md) |
|---|---|---|
| YouTube videos and Shorts | `/v1/youtube/channel-videos`, `/v1/youtube/channel/shorts` | YouTube scraper actors |
| TikTok videos | `/v3/tiktok/profile/videos` | TikTok scraper actors |
| Instagram posts | `/v2/instagram/user/posts` | Instagram scraper actors |
| X posts | `/v1/twitter/user-tweets` | X scraper actors |
| Reddit mentions | `/v1/reddit/search` | Reddit scraper actors |
| Meta ads | `/v1/facebook/adLibrary/company/ads` | Meta Ad Library actors |
| Google ads | `/v1/google/company/ads` | Google Ads Transparency actors |
| TikTok ads | `/v1/tiktok/ad-library/search` | TikTok ad actors |
| LinkedIn posts and ads | Not used | Not used |

- **ScrapeCreators** is one key with one response style across platforms, which makes per-channel pulls quick. Billed in credits.
- **Apify** suits bulk pulls, scheduled runs, and platforms ScrapeCreators doesn't cover. Each actor has its own input and pricing; read its page first.
- **LinkedIn:** read the company page, employee posts, and the LinkedIn Ad Library by hand. This repo doesn't scrape LinkedIn.
- Media URLs expire. Download thumbnails and covers in the same run as the pull.
- The YouTube Data API (free with a key) and Reddit's public JSON are fine fallbacks when no paid source is set up.

## Transcripts

For stage 4 (team voices) and the podcast-ad search in stage 5:

| Source | Route |
|---|---|
| YouTube, TikTok, X video | ScrapeCreators transcript endpoints, or YouTube's own captions |
| Podcasts | The feed's `podcast:transcript` tag, the show's YouTube upload, or a podcast search API (Listen Notes, Podscan) if the user has a key; otherwise download the audio and transcribe it locally |

## Browser and Inbox for Going Inside

For stage 3, with the user's approval for each action:

| Need | Options |
|---|---|
| A browser the agent drives and screenshots | Claude in Chrome, agent-browser, [Browserbase](../../../tools/integrations/browserbase.md) |
| An inbox for the email sequence | A dedicated address or alias on the user's own domain |

## The User's Own Data

For stage 8:

| Source | What it adds |
|---|---|
| [Google Search Console](../../../tools/integrations/google-search-console.md) | Impressions and clicks by page family; whether the user has the target's winning families |
| [GA4](../../../tools/integrations/ga4.md), [PostHog](../../../tools/integrations/posthog.md), [Plausible](../../../tools/integrations/plausible.md) | Channel mix and signup conversion |
| [Google Ads](../../../tools/integrations/google-ads.md), [Meta Ads](../../../tools/integrations/meta-ads.md) | Which networks the user runs and what works there |
| The user's social accounts | The same content pull as stage 6, for a side-by-side |

Compare the user's real numbers only with each other. Against the target, use the same vendor's estimate for both domains.

## When a Source Fails

- **Blocked page:** try one other route (another fetcher, the Wayback copy). Still blocked → list it in the method notes and move on.
- **Endpoint error:** try one other source for the same job. Still failing → mark the item "unavailable". Never estimate it.
- **No history:** if a tool only returns current data, say the curve is unavailable before a date. Don't stitch in another vendor.
