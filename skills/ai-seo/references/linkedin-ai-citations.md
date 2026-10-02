# LinkedIn Content That Gets Cited by AI

LinkedIn is one of the most-cited domains for professional and B2B queries. But which LinkedIn surface gets cited depends heavily on the engine, and the mix moved sharply during 2026. Treat every number here as a dated snapshot and check your own prompts.

## Contents
- Which Surface, Which Engine
- Who Can Crawl What
- What Makes LinkedIn Content Citable
- Durability
- Risks
- Checklist
- Sources

---

## Which Surface, Which Engine

| Engine | What it cites from LinkedIn (2026) |
|---|---|
| **ChatGPT** | Shifted from Pulse articles to feed posts. Ahrefs data shows ChatGPT citations of `/pulse/` down ~86% and `/posts/` up ~74% between May and Oct 2026, with a ~36% overall LinkedIn drop in the mid-August retrieval change that also hit Reddit |
| **Perplexity** | Largest raw count of LinkedIn citations in OtterlyAI's sample and our Ahrefs pull, with company pages the biggest share in Ahrefs. (Semrush, measuring the share of answers that cite LinkedIn at all, found it lower on Perplexity than on ChatGPT or AI Mode, so the ranking depends on the measure) |
| **Copilot** | Cites LinkedIn heavily and increasingly (citations more than doubled May → Oct 2026, ~6.5× its Reddit citations). Pulse and posts both appear |
| **Google AI Overviews / AI Mode** | Posts and Pulse both cited, plus company pages |
| **Gemini** | Almost never cites LinkedIn (~0 in three separate datasets). Don't count on LinkedIn for Gemini visibility |
| **Claude** | Its search crawler is allowed on articles, posts, profiles, and company pages; little published citation data |

**What this means:**
- Publish both: feed posts for ChatGPT, long-form articles for Perplexity, Copilot, and Google's AI features.
- Maintain the company page as well as people's profiles. Perplexity cites company pages most; ChatGPT and AI Mode mostly cite individual members.
- Skip collaborative articles (`/advice/`). They're effectively uncited now.

**Our Ahrefs snapshot** (citations of linkedin.com URLs in Ahrefs' AI-responses data, pulled 2026-10-02; the prompt pool changes over time, so treat as directional):

| Path | ChatGPT, May 1 | ChatGPT, now | Perplexity | AI Overviews | AI Mode | Copilot | Gemini |
|---|---|---|---|---|---|---|---|
| All linkedin.com | 239K | 185K | 787K | 352K | 292K | 154K (65K in May) | ~0.7K |
| `/pulse/` articles | 22.7K | 3.3K | 84K | 43K | 51K | 23K | ~0 |
| `/posts/` | 17.7K | 30.8K | 133K | 62K | 55K | 18K | 0 |
| `/company/` | — | — | 474K | 51K | 41K | 15K | — |
| `/in/` profiles | — | — | 103K | 12K | 13K | 15K | — |

---

## Who Can Crawl What

LinkedIn's robots.txt (checked 2026-10-02):

| Crawler | Articles, posts, profiles, company pages |
|---|---|
| Googlebot, Bingbot | Allowed |
| OAI-SearchBot (ChatGPT search), Claude-SearchBot | Allowed |
| GPTBot, ChatGPT-User, ClaudeBot, Claude-User, PerplexityBot, Perplexity-User, Google-Extended, CCBot | Blocked |

So ChatGPT and Claude can cite LinkedIn from their search indexes, but their live "go read this page" agents can't fetch it. Perplexity cites LinkedIn most despite both of its bots being blocked, presumably through another index.

**Check your own articles for `noindex`.** LinkedIn appears to noindex some Pulse articles, reportedly from low-follower or low-engagement accounts, and only for crawlers, so the logged-in author never sees it (one small test, n=3). Check both the robots meta tag and the `X-Robots-Tag` header on the final response, for each crawler you care about:

```bash
URL=https://www.linkedin.com/pulse/your-article-slug
for UA in Googlebot bingbot OAI-SearchBot; do
  echo "== $UA"
  curl -sIL -A "$UA" "$URL" | grep -iE '^(HTTP/|x-robots-tag)'
  curl -sL -A "$UA" "$URL" | grep -ioE '<meta[^>]+name="(robots|googlebot|bingbot)"[^>]*>'
done
```

A `noindex` in either place for a crawler means that engine's index likely won't carry the article. An absent tag isn't proof it's indexed; confirm with a `site:` search.

---

## What Makes LinkedIn Content Citable

**Supported by independent data:**
- **Engagement barely matters.** Likes and comments show almost no correlation with citation. The median cited post has 15–25 reactions; 100 reactions get cited about as often as 10,000.
- **Follower count matters little.** Authors under 500 followers get cited, and about half of citations come from authors under 10K.
- **Original over reshared.** About 95% of cited posts are original.
- **Teach something.** Most cited posts share knowledge or advice.
- **Consistency.** About 75% of cited post authors posted 5+ times in the prior four weeks.
- **Length.** Cited articles are mostly 500–2,000 words; cited posts mostly 50–300 words.
- **Recent.** About half of cited content is under three months old.

**Vendor causal model (Scrunch, ~4K posts, treat as directional):** technical detail (+77%), named entities like tools, companies, and people (+33%), and a niche topic (+18%) raised citation. Unicode bold or italic text (−58%) and "link in comments" (−31%) lowered the post's own citations. The study is about ChatGPT, and it also found link-in-comments can help the linked page get cited, so it's a trade-off if your goal is citations for your own site.

**Platform-reported (LinkedIn's guide, Mar 2026):** articles of 800–1,200 words, posts of 200–300 words, post 2–3 times a week. The guide also suggests 3,000+ followers and 10+ comments help, which the independent data above doesn't support.

**Mechanics:**
- A post's first words become its URL slug, so front-load the target phrase.
- Structure articles like blog content: clear headings, a direct answer early, specific numbers and names.

---

## Durability

- Citations can be durable for specific, low-competition prompts. One B2B writer's six Pulse articles were cited in 54–86% of 28 tracked runs over ~20 weeks for a niche prompt (Kaleigh Moore, Sep 2026, anecdote).
- At the platform level they're volatile. One fixed-prompt study measured LinkedIn's share of AI answers falling ~65% from Feb to Jul 2026, while others measured it rising on Perplexity over the same months. Track by engine, and don't put all your third-party effort into LinkedIn (see the volatility section in [agent-readiness.md](agent-readiness.md)).

---

## Risks

- **No canonical control.** LinkedIn sets its own canonical on articles, so a full republish of your blog post competes with your own page. Publish on your site first, then post an adapted version (rewrite a meaningful share of it) or a summary that links back.
- **You don't own it.** LinkedIn decides indexing, can noindex articles, and changes formats. By default, US members' content can be used to train LinkedIn and Microsoft models.
- **Gemini blind spot.** Visibility built on LinkedIn won't carry to Gemini.

---

## Checklist

- [ ] Feed posts and long-form articles both in the mix, matched to the engines you care about
- [ ] Company page complete and consistent with your About page (see [positioning-and-consensus.md](positioning-and-consensus.md))
- [ ] Target phrase in a post's first words
- [ ] Original, specific, technical content with named entities; no Unicode bold; decide deliberately where the link goes (in-post helps the post, in-comments may help the destination)
- [ ] Articles checked for crawler `noindex`
- [ ] Blog posts published on your own site first; LinkedIn version adapted, not duplicated
- [ ] Citations tracked per engine, re-checked monthly

---

## Sources

All dated; most are vendor studies running their own trackers, so none is fully neutral.

- Profound, LinkedIn as most-cited domain for professional queries (Mar 2026): https://www.tryprofound.com/blog/linkedin-is-the-most-cited-domain-for-professional-queries-in-ai-search
- Semrush, LinkedIn AI visibility study, 325K prompts (Mar 2026): https://www.semrush.com/blog/linkedin-ai-visibility-study/
- OtterlyAI, LinkedIn AI search citations study, 1.31M citations (Jun 2026): https://otterly.ai/blog/linkedin-ai-search-citations-study/
- Cloro, LinkedIn articles vs posts (Aug–Sep 2026): https://cloro.dev/blog/linkedin-articles-vs-posts/
- Goodie, social media AI citations study (Sep 2026): https://higoodie.com/blog/social-media-ai-citations-study-2026/
- Scrunch, LinkedIn posts and ChatGPT citations (May 2026): https://scrunch.com/blog/linkedin-posts-robots-cant-resist-what-data-says-about-chatgpt-citations
- Mid-August 2026 ChatGPT source shift (Promptwatch, Petra Labs): https://somethinginc.com/blog/chatgpt-citation-sources-docs-replaced-reddit/
- Ahrefs AI responses data by URL path, pulled 2026-10-02 (directional; the prompt pool changes over time)
- LinkedIn robots.txt, fetched 2026-10-02; LinkedIn's AEO guide (Mar 2026)
