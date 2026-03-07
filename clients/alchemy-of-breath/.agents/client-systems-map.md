# Client Systems Map: Alchemy of Breath

> Systems audit snapshot — March 2026

---

## Domain & Infrastructure

| System | Details | Status | Notes |
|--------|---------|--------|-------|
| Primary domain | alchemyofbreath.com | Active | WAF/CDN protecting all routes |
| Academy subdomain | academyalchemyofbreath.com | Active | Separate domain — splits authority |
| CDN/WAF | Cloudflare (suspected) | Active | Blocks all non-browser agents (403) |
| Hosting | Unknown | Active | WAF layer prevents detection |
| SSL | HTTPS active | Active | Standard |

## Content Management

| System | Details | Status | Notes |
|--------|---------|--------|-------|
| CMS | WordPress (inferred) | Active | URL patterns, author pages confirm WP |
| E-commerce | WooCommerce (inferred) | Active | /shop/ URL, product sales |
| SEO Plugin | Unknown | Unknown | Likely Yoast or Rank Math |
| Learning Platform | academyalchemyofbreath.com | Active | Separate domain — Kajabi/Teachable/Thinkific |

## Marketing & Analytics Stack

| System | Details | Status | Notes |
|--------|---------|--------|-------|
| Google Analytics | Unknown (GA4 assumed) | Unknown | Needs verification via Search Console |
| Google Search Console | Unknown | Unknown | Must be connected — critical gap |
| Email Marketing | Unknown | Unknown | Likely Mailchimp, Kit, or ActiveCampaign |
| Social | Instagram (~42K), Facebook (~32K) | Active | Primary social channels |
| YouTube | Likely active | Unknown | Founder is video-forward |

## SEO Systems

| System | Details | Status | Issues |
|--------|---------|--------|--------|
| XML Sitemap | sitemap.xml | BLOCKED | Returns 403 — unknown content |
| Robots.txt | robots.txt | BLOCKED | Returns 403 — AI bot rules unknown |
| Schema Markup | Unknown | Unknown | Requires JS-rendered audit |
| Google Search Console | Unknown | Unknown | Must verify |
| Bing Webmaster | Unknown | Unknown | |

## Known URL Inventory (from Google Index)

| URL | Page Type | Issues |
|-----|-----------|--------|
| / | Homepage | |
| /breathwork-training/ | Primary conversion page | |
| /breathwork-training-backup/ | **BACKUP PAGE — INDEXED** | Critical: remove/noindex |
| /the-alchemist/ | Course page | |
| /free-breathwork-sessions/ | Lead gen page | |
| /events/ | Events listing | |
| /who-is-alchemy-of-breath/ | About | |
| /shop/ | E-commerce | |
| /BreathCamps/ | Retreat page | Mixed case URL — SEO issue |
| /anthony-abbagnano/ | Founder page | |
| /alchemy-meditation-2/ | Course/meditation | "-2" suffix indicates duplicate |
| /live-residential-breathwork-facilitator-training/ | Training variant | Potential cannibalization with /breathwork-training/ |
| /find-facilitator/ | Directory | |
| /benefits-of-doing-a-breathwork-facilitator-training-online/ | Blog post | At root level (not /blog/) |
| /what-is-the-difference-between-breathwork-functional-breath-work-pranayama/ | Blog post | At root level; extremely long URL |
| /author/amy/ | Author page | |

## Integration Gaps & Recommendations

| Gap | Priority | Recommended Tool | Action |
|-----|----------|-----------------|--------|
| No confirmed GSC | Critical | Google Search Console | Connect immediately |
| Bot protection blocking crawlers | Critical | Cloudflare WAF rules | Whitelist Googlebot, AI bots |
| Split domain authority (academy subdomain) | High | Subdirectory migration | Move to alchemyofbreath.com/academy/ |
| No schema audit possible | High | Rich Results Test | Run after bot fix |
| Email list CRM unknown | Medium | Audit current stack | Connect to CRM |

---

*Last updated: 2026-03-07 | Agent: Claude Code*
