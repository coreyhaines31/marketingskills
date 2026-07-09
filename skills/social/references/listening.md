# Social Listening & Engagement Triage

How to surface the right posts to engage with each day — instead of randomly scrolling. The goal is a short, scorable list ("here are your top 10 posts to comment on") rather than an open feed.

## Contents
- When to use this
- The daily triage loop
- Scoring rubric
- Comment quality tiers
- Sources & how to pull them
- Per-platform notes
- Common workflows

---

## When to Use This

Use listening when the goal is **commenting and relationships**, not posting. Typical asks:
- "Give me the top 10 posts I should comment on today"
- "Who's complaining about [competitor] right now?"
- "Find people asking for a tool like mine"
- "Surface posts from my 20 target accounts in the last 24h"
- "What's the conversation around [topic] this week?"

If the user wants to **create** content, use the rest of the social skill. Listening feeds creation (it surfaces angles, language, objections), but the output is different.

---

## The Daily Triage Loop

A repeatable 20-minute loop the user (or the agent, on their behalf) can run each morning. Wire it to a **Dust Trigger** to run automatically on a schedule.

1. **Pull** — fetch new posts from defined sources (target accounts, keywords, subreddits, hashtags). See [sources](#sources--how-to-pull-them).
2. **Filter** — drop anything older than 24h, low signal, or off-topic.
3. **Score** — apply the [rubric](#scoring-rubric). Keep top 10.
4. **Draft** — for each, draft a comment matched to the post's tier.
5. **Post** — user reviews, edits, posts (or the agent posts via a connector once approved). Mark which actually went live.
6. **Log** — track what you commented on and what got replies in **Agent Memory**. This is your engagement loop dataset, and it stops the loop re-surfacing posts you already handled.

Output format the agent should produce:

```
TOP 10 POSTS — 2026-06-05

1. [Score 9/10] @author — LinkedIn — 2h ago
   "We just rolled out X and the team is loving it…"
   Why: ICP fit (B2B SaaS, 50–200 employees), buying-intent signal
   Suggested comment: [draft]
   Link: https://…
```

---

## Scoring Rubric

Score each post 1–10 across five dimensions, then sum and rank.

| Dimension | What it measures | Weight |
|-----------|------------------|--------|
| **ICP fit** | Is the author your target customer / influencer? | 2x |
| **Intent signal** | Are they expressing a problem, asking, or shopping? | 2x |
| **Reach potential** | Is the post getting traction (likes/comments rising)? | 1x |
| **Comment opportunity** | Can you say something genuinely useful, not generic? | 2x |
| **Recency** | Posted in last 1–4h (early comments win, especially on LinkedIn) | 1x |

**Intent signal examples (high-value):**
- "Looking for a tool that does X"
- "Why is [category] so painful?"
- "We just switched from [competitor] because…"
- "Anyone use [competitor] — is it worth it?"
- A complaint about a known competitor

**Drop if any of these are true:**
- Author isn't ICP and isn't an influencer
- Post is >24h old and already has 50+ comments (your comment buries)
- Generic motivational/AI-slop post
- Self-promotion thread where comments don't get reach
- You can't add anything beyond "Great post!"

---

## Comment Quality Tiers

Match the comment to the post. Don't waste a tier-1 draft on a tier-3 opportunity.

**Tier 1 — Relationship builder (target accounts, ICP, high intent)**
- Add a specific insight or counter-example
- Reference your own experience with specifics (numbers, names, outcomes)
- Ask a thoughtful follow-up that invites a reply
- Length: 2–4 sentences, no link

**Tier 2 — Visibility play (high-reach post, adjacent topic)**
- Add one sharp insight in one sentence
- Pattern: "Agreed — and the part most miss is [X]"
- Length: 1–2 sentences

**Tier 3 — Light touch (relationship maintenance)**
- Specific reaction, not "Love this"
- Quote a specific line and react to it
- Length: 1 sentence

**Never:** "Great post!", emoji-only, "+1", LinkedIn-isms like "This is gold 🔥"

---

## Sources & How to Pull Them

Reddit, Hacker News, and Bluesky expose **public HTTP/JSON endpoints** — the agent can fetch each URL with **Browse** (which returns the JSON to parse), or hit it through a connector/MCP server if one is set up. No login needed. LinkedIn, X, Instagram, and TikTok have no useful public API — use **Computer**/**Browse** in a signed-in session (below).

### Reddit (public JSON)
- **New posts in a subreddit** — Browse `https://www.reddit.com/r/SaaS/new.json?limit=25` (swap the subreddit). Read each post's title, author, permalink, score, num_comments, created_utc, and the first ~300 chars of selftext.
- **Search Reddit by keyword** (last day, newest first) — Browse `https://www.reddit.com/search.json?q=KEYWORD&sort=new&t=day&limit=25`. Swap `KEYWORD` for `"alternative to notion"`, `"recommend a crm"`, a competitor name, or your own brand for mentions (quote multi-word phrases).

### Hacker News (Algolia search)
- **Recent stories mentioning a keyword** — Browse `https://hn.algolia.com/api/v1/search_by_date?query=KEYWORD&tags=story`. To limit to the last 24h, append `&numericFilters=created_at_i>TIMESTAMP`, where `TIMESTAMP` is the Unix time 24h ago.
- **Recent comments** — same URL with `&tags=comment`.

### Bluesky (public API)
- **Search posts by keyword** — Browse `https://public.api.bsky.app/xrpc/app.bsky.feed.searchPosts?q=KEYWORD&limit=25&sort=latest`. Read author handle, text, likeCount, replyCount.

### RSS (blogs, podcasts, YouTube)
- **YouTube channel** — Browse `https://www.youtube.com/feeds/videos.xml?channel_id=CHANNEL_ID`
- **Blog / newsletter feed** — Browse the feed URL (e.g. `https://example.com/feed/`) and read the latest items.

> Prefer **Web Search** when you want to cast wider than a single source (e.g. "who's talking about [topic] this week"), and the endpoints above when you want a specific, structured pull.

### LinkedIn & X — use Computer in a signed-in session

LinkedIn and X don't expose useful public APIs, but the agent can drive a real, signed-in browser with **Computer**/**Browse**:

1. The user signs into LinkedIn / X once in the browser session.
2. The agent navigates to a target URL (feed, profile, saved search, hashtag).
3. The agent reads the page, extracts posts, scores them with the [rubric](#scoring-rubric), and drafts comments.
4. The user reviews and posts (don't auto-post — high-stakes, bot-detection risk).

**Useful URLs to navigate to:**

| URL pattern | What it shows |
|-------------|---------------|
| `linkedin.com/in/HANDLE/recent-activity/all/` | A target account's recent posts |
| `linkedin.com/feed/hashtag/TOPIC/` | Hashtag feed |
| `linkedin.com/feed/` | Your main feed (algorithmic — less useful for triage) |
| `x.com/HANDLE` | A target account's profile |
| `x.com/search?q=QUERY&f=live` | Real-time search (use `f=live` for chronological) |
| `x.com/i/lists/LIST_ID` | A curated list — best for target accounts |

**Tips:**
- On X, build a private list of target accounts and use the list URL. Far cleaner than the algorithmic feed.
- LinkedIn's `/recent-activity/all/` URL is the cleanest way to see one person's posts without the algorithm.
- For both platforms, scroll to load more posts (Computer supports scrolling) before extracting.

**Paid alternatives if you don't want to drive a browser:**

| Platform | Tools |
|----------|-------|
| LinkedIn | Sales Navigator (saved searches), Taplio (engagement) |
| X | TweetDeck/X Pro (saved columns), Typefully, Taplio, Tweet Hunter |

**Still closed (no good path):**
- Instagram & TikTok — closed APIs, browser automation is detectable and risky. Use native saved searches / hashtag follows.

---

## Per-Platform Notes

### LinkedIn
- **Browser-driven** (Computer/Browse in a signed-in session) — see [LinkedIn & X](#linkedin--x--use-computer-in-a-signed-in-session)
- **First-hour comments matter most** — algorithm weights early engagement heavily. Prioritize posts <2h old from target accounts.
- Comments with 5+ words get more reach than reactions
- Replying to other commenters can put you in front of their network
- Tag the author in your reply only if it adds context

### Twitter/X
- **Browser-driven** (Computer/Browse) — build a private list of target accounts and navigate to the list URL
- Reply within first 30 min for max reach on big accounts
- Quote-tweet > reply when adding substantial value
- Threading your reply (multi-tweet) signals effort
- Don't pile on dunks — relationships > clout

### Reddit
- Read the subreddit rules before commenting (some ban self-promotion outright)
- Earn karma in the sub before linking to anything you own
- Long, specific answers win. AMAs and "help me decide" threads are gold
- Never lead with your product — answer the question first

### Hacker News
- Comment quality bar is high; low-effort gets downvoted fast
- Founders commenting on threads about their product is welcomed if you're transparent
- Search for past discussions of your category — they're often dormant gold mines

### Bluesky
- Smaller volume but high engagement-to-follower ratio
- Tech and indie-hacker communities are active
- Custom feeds (like Bluesky's "Following" + topic feeds) replace algorithmic search

---

## Common Workflows

### "Give me my top 10 posts to comment on today"
1. Pull from: target account RSS/saved searches + Reddit (relevant subs) + HN (last 24h)
2. Score with the [rubric](#scoring-rubric)
3. Output top 10 with suggested comments

### "Find people complaining about [competitor]"
1. Reddit search: `"competitor name" -site:competitor.com` sorted by new
2. HN comment search for competitor name
3. Bluesky search for competitor handle/name
4. Score by intent signal (high if switching language: "moving from", "alternatives to", "frustrated with")

### "Surface brand mentions from the last week"
1. Reddit search for brand name
2. HN search (stories + comments) for brand name
3. Bluesky search for brand name + handle
4. Output as: reply needed (yes/no), tone (positive/negative/neutral), suggested response

### "Find target-account posts I missed"
1. Maintain a list of target accounts with their RSS / Reddit usernames / Bluesky handles
2. Fetch each source's recent posts
3. Filter to last 24h, output sorted by score

---

## Setting Up the Source List

Keep your sources in a **knowledge item** attached to the social agent (a Dust Folder file, or a connected Notion/Google Doc) — or the essentials in **Agent Memory**. The agent reads it when running the daily loop.

**A ready-to-fill template lives at [listening-sources-template.md](listening-sources-template.md).** Copy its contents, fill in the brackets, and save it as your social/listening knowledge item. The template covers: brand/category, ICP (for scoring), target accounts per platform, intent keywords, subreddits, saved-search URLs, and a do-not-engage list.

To run the loop on a schedule, wire it to a **Dust Trigger** (e.g. every weekday at 9am) and keep the "already engaged" set in **Agent Memory** so you don't re-surface the same posts.
