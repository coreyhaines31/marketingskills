# How Each AI Platform Picks Sources

Each AI search platform has its own search index, ranking logic, and content preferences. This guide covers what matters for getting cited on each one.

Sources cited throughout: Princeton GEO study (KDD 2024), SE Ranking's domain study (Nov 2025), Sellm.io's ranking-factor model, and Profound's citation data (2025). Most are vendor research with correlational methods.

**Evidence order.** Weigh claims in this order: (1) official engine documentation and webmaster guidance, (2) controlled experiments and primary research, (3) large observational datasets, (4) practitioner case studies and commentary. When official guidance and observational data conflict, follow the documentation for eligibility and crawler controls and test the observation. Every number below is a dated snapshot of a moving system; re-check it before quoting it to a client.

---

## The Fundamentals

Every AI platform shares three baseline requirements:

1. **Your content must be in their index** — Each platform uses a different search backend (Google, Bing, Brave, or their own). If you're not indexed, you can't be cited.
2. **Your content must be crawlable for discovery** — Allow the relevant search-discovery path through robots.txt and your WAF; model-training controls are separate.
3. **Your content must be extractable** — AI systems pull passages, not pages. Clear structure and self-contained paragraphs win.

Beyond these basics, each platform weights different signals. Here's what matters and where.

---

## Google AI Overviews

Google AI Overviews pull from Google's own index and lean heavily on E-E-A-T signals (Experience, Expertise, Authoritativeness, Trustworthiness). BrightEdge measured them on about 48% of its tracked queries in February 2026, with wide swings by industry (most B2B tech and healthcare queries, few shopping queries).

**What makes Google AI Overviews different:** They already have your traditional SEO signals — backlinks, page authority, topical relevance. The additional AI layer adds a preference for content with cited sources and structured data. The GEO study (Aggarwal et al., 2023) found that adding citations, quotations, and statistics raised visibility by roughly 30–40% on its own metric; individual examples in the paper show much larger jumps, but those aren't typical or additive.

**AI Overviews don't just recycle the traditional Top 10.** Some studies have put the overlap between AI Overview sources and conventional organic results as low as ~15%, though figures vary widely by study, date, and query set. Pages that wouldn't crack page 1 can still get cited with clear, extractable answers. Even so, practitioners consistently find that better organic rankings mean better AI visibility, so don't treat the low-overlap stat as permission to skip SEO.

**What to focus on:**
- Schema markup gives AI Overviews structured context (Article, HowTo, Product). It's one lever among several, and Google says no special markup is required for AI features. Google limited FAQ rich results to government and health sites in 2023, so don't promise an AI lift from FAQPage schema
- Build topical authority through content clusters with strong internal linking
- Include named, sourced citations in your content (not just claims)
- Author bios with real credentials matter — E-E-A-T is weighted heavily
- Get into Google's Knowledge Graph where possible (an accurate Wikipedia entry helps)
- Target "how to" and "what is" query patterns — these trigger AI Overviews most often

**Watch for OKF.** In June 2026 Google introduced the [Open Knowledge Format](https://cloud.google.com/blog/products/data-analytics/how-the-open-knowledge-format-can-improve-data-sharing) — a markdown spec for agent-readable site bundles. There is no confirmed signal that AI Overviews factor it in today, but the spec is published, the GitHub repo lives under `GoogleCloudPlatform`, and it ships inside Knowledge Catalog. For protocol-layer "register early" plays, it has the same shape as early schema.org adoption did a decade ago. See **Machine-Readable Files for AI Agents** in the main `SKILL.md` for how to generate and serve a bundle.

---

## ChatGPT

ChatGPT's web search draws from a Bing-based index. It combines this with its training knowledge to generate answers, then cites the web sources it relied on.

**What makes ChatGPT different:** Link authority correlates strongly with citation. SE Ranking's study of 129,000 domains (Nov 2025) found referring domains were the single strongest predictor: sites with up to 2,500 referring domains averaged 1.6–1.8 citations, sites with more than 350,000 averaged 8.4, and citations nearly doubled past about 32,000. It's a correlation, and big brands have both links and everything else.

**Freshness is a major differentiator.** Several vendor studies report that recently updated pages earn several times more ChatGPT citations than stale ones. The multipliers vary by study and none is well documented, so treat freshness as a strong lean and don't forecast with any one multiplier.

**Content-answer fit matters most among page-level signals.** Sellm.io trained a model on 400,000+ URLs across 10,000 queries (undated vendor study) and found that how closely a page's substance and structure match ChatGPT's own answer was its strongest predictor of citation, well ahead of domain authority and on-page structure. Write the direct answer the question deserves, and you're more likely to be the source it cites.

**Where ChatGPT looks beyond your site:** In Profound's data from Aug 2024 to Jun 2025 (680 million citations), Wikipedia took 7.8% of ChatGPT citations, Reddit 1.8%, and Forbes 1.1%. Those shares have moved since: ChatGPT's August 2026 retrieval changes nearly removed Reddit as a source (see the volatility section in [agent-readiness.md](agent-readiness.md)). Company sites took most citations in Profound's later dataset (see [citations-vs-recommendations.md](citations-vs-recommendations.md)), and third-party mentions still shape recommendations.

**What to focus on:**
- Invest in earned links and authority; referring domains were the strongest correlate in SE Ranking's study
- Update competitive content at least monthly
- Structure your content the way ChatGPT structures its answers (conversational, direct, well-organized)
- Include verifiable statistics with named sources
- Clean heading hierarchy (H1 > H2 > H3) with descriptive headings

---

## Perplexity

Perplexity always cites its sources with clickable links, making it the most transparent AI search platform. It combines its own index with Google's and runs results through multiple reranking passes — initial relevance retrieval, then traditional ranking factor scoring, then ML-based quality evaluation that can discard entire result sets if they don't meet quality thresholds.

**What makes Perplexity different:** It's the most "research-oriented" AI search engine, and its citation behavior reflects that. Perplexity maintains curated lists of authoritative domains (Amazon, GitHub, major academic sites) that get inherent ranking boosts. It uses a time-decay algorithm that evaluates new content quickly, giving fresh publishers a real shot at citation.

**Perplexity has unique content preferences:**
- **FAQ Schema (JSON-LD)** — Pages with FAQ structured data get cited noticeably more often
- **PDF documents** — Publicly accessible PDFs (whitepapers, research reports) are prioritized. If you have authoritative PDF content gated behind a form, consider making a version public.
- **Publishing velocity** — How frequently you publish matters more than keyword targeting
- **Self-contained paragraphs** — Perplexity prefers atomic, semantically complete paragraphs it can extract cleanly

**What to focus on:**
- Allow PerplexityBot in robots.txt
- Implement FAQPage schema on any page with Q&A content
- Host PDF resources publicly (whitepapers, guides, reports)
- Add Article schema with publication and modification timestamps
- Write in clear, self-contained paragraphs that work as standalone answers
- Build deep topical authority in your specific niche

---

## Microsoft Copilot

Copilot is embedded across Microsoft's ecosystem — Edge, Windows, Microsoft 365, and Bing Search. It relies entirely on Bing's index, so if Bing hasn't indexed your content, Copilot can't cite it.

**What makes Copilot different:** The Microsoft ecosystem connection creates unique optimization opportunities. Copilot cites LinkedIn heavily (its LinkedIn citations more than doubled May → Oct 2026 and run about 6.5× its Reddit citations, per Ahrefs data), and GitHub content is a natural fit too. Copilot also puts more weight on page speed — sub-2-second load times are a clear threshold.

**What to focus on:**
- Submit your site to Bing Webmaster Tools (many sites only submit to Google Search Console)
- Read its **AI Performance** report (beta since February 2026): how often your pages are cited in Copilot and Bing's AI answers, plus the **grounding queries** Bing used to retrieve them. Grounding queries are Bing's interpretation of the request, not what the user typed, so they show what the engine is actually searching for. No click data, and no mapping from a query to a specific citation.
- Use IndexNow protocol for faster indexing of new and updated content
- Optimize page speed to under 2 seconds
- Write clear entity definitions — when your content defines a term or concept, make the definition explicit and extractable
- Build presence on LinkedIn (articles, posts, and a complete company page; see [linkedin-ai-citations.md](linkedin-ai-citations.md)) and GitHub if relevant
- Ensure Bingbot has full crawl access

---

## Claude

Claude uses Brave Search as its search backend when web search is enabled — not Google, not Bing. This is a completely different index, which means your Brave Search visibility directly determines whether Claude can find and cite you.

**What makes Claude different:** Claude is extremely selective about what it cites. While it processes enormous amounts of content, its citation rate is very low — it's looking for the most factually accurate, well-sourced content on a given topic. Data-rich content with specific numbers and clear attribution performs significantly better than general-purpose content.

**What to focus on:**
- Verify your content appears in Brave Search results (search for your brand and key terms at search.brave.com)
- If it's missing, request a crawl at search.brave.com/submit-url. It only alerts Brave's crawler: there's no webmaster console or sitemap submission, so check referrals from search.brave.com in your analytics to see whether it worked
- Decide separately whether to allow `Claude-SearchBot` for search discovery, `Claude-User` for user-directed retrieval, and `ClaudeBot` for potential model training
- Maximize factual density — specific numbers, named sources, dated statistics
- Use clear, extractable structure with descriptive headings
- Cite authoritative sources within your content
- Aim to be the most factually accurate source on your topic — Claude rewards precision
- Don't rely on self-ranked "best X" lists. In a live test (Sep 2026), Claude noted that results for a "best [category]" query were dominated by vendors ranking themselves #1 and leaned on juried awards and practitioner reputation instead

---

## Meta AI and Muse

Meta AI answers questions across Facebook, Instagram, WhatsApp, Messenger, and Meta's glasses. Muse, Meta's personal agent built on the Muse Spark model, launched in September 2026 and acts for the user: it connects to apps, recommends products, and buys them. Muse can search the full Shopify product catalog and check out with Link by Stripe, Shop Pay, and PayPal, plus retail connectors such as Walmart, Best Buy, Sephora, and Wayfair (TechCrunch, Sep 2026). Meta makes Muse free and expects to earn a fee on transactions, so shopping is the surface to watch.

Meta hasn't documented which search index Meta AI uses or how it picks sources. Early hands-on tests found Muse unreliable at shopping tasks (Tom's Guide and CNN, Sep 2026). Treat practitioner claims about "ranking in Muse" as unverified.

**What to focus on:**
- Allow `meta-webindexer`. Meta says it crawls to improve Meta AI search results and so Meta can cite and link your content. Decide on `meta-externalagent` (training) separately
- For physical products, make sure your Shopify catalog data is complete and current: titles, attributes, variants, price, and availability (see [multilingual-and-commerce.md](multilingual-and-commerce.md))
- Apply the agent-readability basics in SKILL.md's Agentic Experiences section, since Muse reads and acts on pages for the user
- Test with real prompts in the Meta AI app and log results with dates; there's no Meta citation report to rely on

---

## Allowing AI Bots in robots.txt

Do not copy one blanket allowlist. Choose controls by documented purpose, then check WAF and CDN rules as well as `robots.txt`.

```text
# Automatic search discovery
User-agent: Bingbot
User-agent: Googlebot
User-agent: OAI-SearchBot
User-agent: PerplexityBot
User-agent: Claude-SearchBot
User-agent: meta-webindexer
Allow: /

# Potential model training (publisher choice shown as disallow)
User-agent: GPTBot
User-agent: ClaudeBot
User-agent: meta-externalagent
Disallow: /

# Gemini model training and grounding (publisher choice shown as disallow)
User-agent: Google-Extended
Disallow: /
```

User-triggered fetchers such as `ChatGPT-User`, `Claude-User`, and `Perplexity-User` are separate from automatic discovery. Vendor behavior can differ: OpenAI says `robots.txt` rules may not apply to `ChatGPT-User`, and Perplexity says `Perplexity-User` generally ignores them because these fetches are user-requested; Meta says `meta-externalfetcher` may bypass them. Meta also runs `facebookexternalhit` for link previews when a URL is shared on its apps; leave it allowed or shared links lose their title and image. Use `OAI-SearchBot`, not `ChatGPT-User`, to manage ChatGPT Search inclusion. `Google-Extended` is a standalone product token rather than a separate HTTP crawler; Google says it controls certain Gemini training and grounding uses and does not affect Google Search inclusion or ranking.

Verify the current names and consequences in the vendors' maintained documentation: [OpenAI](https://developers.openai.com/api/docs/bots), [Perplexity](https://docs.perplexity.ai/docs/resources/perplexity-crawlers), [Anthropic](https://privacy.anthropic.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler), [Meta](https://developers.facebook.com/docs/sharing/webmasters/web-crawlers), and [Google](https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers).

For implementation, inspect `/robots.txt` manually first. Optional helpers include each vendor's own crawler documentation and robots.txt testing tools.

---

## Where to Start

If you're optimizing for AI search for the first time, focus your effort where your audience actually is:

**Start with Google AI Overviews** — They reach the most users (about 48% of BrightEdge-tracked queries, Feb 2026) and you likely already have Google SEO foundations in place. Add schema markup, include cited sources in your content, and strengthen E-E-A-T signals.

**Then address ChatGPT** — It's the most-used standalone AI search tool for tech and business audiences. Focus on freshness (update content monthly), domain authority, and matching your content structure to how ChatGPT formats its responses.

**Then expand to Perplexity** — Especially valuable if your audience includes researchers, early adopters, or tech professionals. Add FAQ schema, publish PDF resources, and write in clear, self-contained paragraphs.

**Copilot, Claude, and Meta AI are lower priority** unless your audience skews enterprise/Microsoft (Copilot), developer/analyst (Claude), or consumer shopping on Meta's apps (Meta AI and Muse). But the fundamentals — structured content, cited sources, schema markup — help across all platforms.

**Actions that help everywhere:**
1. Set an explicit, purpose-specific robots policy: allow relevant discovery crawlers while deciding training and user-triggered retrieval separately
2. Implement schema markup (FAQPage, Article, Organization at minimum)
3. Include statistics with named sources in your content
4. Update content regularly — monthly for competitive topics
5. Use clear heading structure (H1 > H2 > H3)
6. Keep page load time under 2 seconds
7. Add author bios with credentials
