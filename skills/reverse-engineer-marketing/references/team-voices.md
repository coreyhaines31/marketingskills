# Team Voices

Stage 4 in full: what the company's founders, leaders, and staff say in public about how they grow. Interviews and talks are often the strongest evidence a teardown gets, because people say outright what worked, when, and why. Their job posts say what they plan to do next.

## Contents
- Finding the people
- Finding what they said
- Getting the words
- Extracting claims
- Job posts as strategy documents

---

## Finding the People

Start with leaders whose work shapes growth: founders, CEO, heads of growth, marketing, product, sales, partnerships, community, and devrel. Sources:

- The team, about, and press pages, and author bylines on the blog
- X and Bluesky bios that name the company, and who the founders' accounts follow and reply to most
- Podcast guest pages and conference speaker lists
- Funding announcements and press releases, which name leaders and early hires
- LinkedIn company pages, read by hand (this repo doesn't scrape LinkedIn)

Keep it to people speaking publicly in a work capacity. Don't profile private lives, and don't contact anyone.

## Finding What They Said

| Source | How to find it |
|---|---|
| Podcasts | Search "[name] podcast" and "[company] founder interview"; Apple Podcasts and Spotify search; podcast search APIs (Listen Notes, Podscan) if the user has a key |
| YouTube talks and interviews | Search "[name]" and "[company] [conference]", sorted by views |
| Conference talks | Event sites, slides on Speaker Deck or SlideShare |
| X threads | The person's top posts, and searches for "how we grew", "lessons", "ARR", "users" from their handle |
| Blog posts and newsletters | Their own blog and guest posts, investor blogs, growth newsletters that interviewed them |
| Founder AMAs | Reddit, Hacker News, Indie Hackers, Product Hunt maker comments |

## Getting the Words

- **YouTube, TikTok, X videos:** transcripts via [ScrapeCreators](../../../tools/integrations/scrapecreators.md) (`/v1/youtube/video/transcript`, `/v1/tiktok/video/transcript`, `/v1/twitter/tweet/transcript`), or YouTube's own captions.
- **Podcasts:** many feeds publish transcripts (a `podcast:transcript` tag in the RSS feed), and many shows post episodes to YouTube too. Otherwise, download the audio and transcribe it locally.
- Save each transcript to `teardowns/<target>/voices/<date>-<person>-<show>.txt` with the source link.

## Extracting Claims

Read every transcript and pull out claims about growth into `voices.csv`:

`said_on,person,role,source,claim,topic,dated_to,quote,link`

- **Topics:** channel, tactic, number, mistake, hire, pricing, positioning, ICP, what's next.
- **dated_to** is when the thing they describe happened ("our first 1,000 users came from Reddit in early 2024"), which is often different from when they said it.
- **Quote** the exact words, short. Label every claim "reported": it's what they say, not what was measured.
- Each claim with a `dated_to` also becomes a row in `moves.csv` (evidence: Inferred, source: reported).

Then look for:
- **Claims that match the data** (they say templates drove SEO, and the template family grew before the inflection): strong evidence.
- **Claims the data doesn't back**: note them. Founders remember the story, not always the order.
- **Things they say didn't work**: these go straight to plays to skip.
- **Repeated phrases** across interviews: that's the positioning they've rehearsed.

## Job Posts as Strategy Documents

Read the full text of current and past job posts, not just titles. Start with `teardown.mjs jobs <domain> --out teardowns/<target>/jobs.csv`, which finds a public Greenhouse, Lever, or Ashby board and summarizes it: roles by function, marketing channels being hired for, tools named, languages required, and "first marketing hire" wording. Past posts are on Wayback (`web.archive.org/web/*/target.com/careers*`) and on job boards. Saving `jobs.csv` each month lets Watch mode spot new roles by id.

What to pull from each post:
- **The mandate:** "own our PLG motion", "scale programmatic SEO to 10,000 pages", "launch our partner program", "build our first outbound team". This is the plan, written down.
- **Numbers:** team size, targets, budgets ("manage $2M/year in paid").
- **Tools named:** the stack the team uses.
- **Reports to:** where the function sits.
- **First seen:** the date the post first appeared, which dates the push.

Add each mandate to `moves.csv` as `kind: hire` with the posting date. [TheirStack](../../../tools/integrations/theirstack.md) searches job posts by company if the user has it.
