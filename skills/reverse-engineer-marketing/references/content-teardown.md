# Content Teardown, Channel by Channel

Stage 6 in full: how to work out what a company's best posts have in common, and turn that into formulas the user can reuse. This covers what the company publishes. What others say about it belongs to stage 2's social and creators row.

## Contents
- Sampling
- Splitting into thirds
- Reading the images
- Channel checklists
- Write-up
- Contact sheets

---

## Sampling

- **Handles:** only accounts linked from the target's site, or whose bio links back to it. Founders' personal accounts count when the site or press links them.
- **Window:** up to 100 posts from the last 180 days per channel. Save them to `teardowns/<target>/<channel>/posts.csv` with the pull date.
- **Settle time:** skip posts younger than 10 days. Their numbers are still moving.
- **Source:** ScrapeCreators or Apify social actors (see [data-sources.md](data-sources.md)). LinkedIn is read by hand.

| Channel | Score each post by |
|---|---|
| YouTube | Views (score long-form and Shorts separately) |
| TikTok | Views, with saves and shares as a tiebreak |
| Instagram | Likes + comments (views for reels when available) |
| X | Views |
| LinkedIn | Reactions + comments |
| Reddit | Score |

## Splitting into Thirds

With code, rank posts within one channel and split them into thirds. Compare the top third with the bottom third, and leave the middle out, since it blurs the contrast. Never compare scores across channels: a weak TikTok often outscores a strong LinkedIn post.

Fewer than 24 settled posts on a channel → list them with their numbers and call no pattern.

## Reading the Images

Download the thumbnail, cover, or first slide for every top-third post and for a matching number of bottom-third posts, all in one batch. TikTok and Instagram media links expire within hours. Open each file before describing it.

- What the image shows is **Observed**. Why it might work is **Inferred**.
- A file that didn't download is "not read". Never describe an image from its caption or title.

## Channel Checklists

### YouTube
- **Title:** word count, a number or dollar figure, first person, a question, brackets or a tag, the promise
- **Thumbnail:** a face and its expression, text on it (word count), the product or the outcome, a split or before/after, the dominant color, the logo
- **Pairing:** does the thumbnail repeat the title or add a second idea?
- **Format:** Shorts vs long-form, length, series or one-offs

### TikTok
- **Cover:** which frame, and its text
- **Opening:** the first line of the caption and the on-screen text in the first seconds
- **Format:** talking head, screen recording, slideshow, skit, green screen, duet or stitch
- **Sound:** trending or original
- Length, hashtag count, posting rhythm

### Instagram
- **Mix:** reels vs carousels vs single images, and which wins
- **Cover or first slide:** headline size, word count, template
- **Carousels:** slide count, and what the final slide asks for
- **Caption:** the line shown before "more"
- **Grid:** recurring colors, type, frames, logo position

### X
- **The first line**, shown before "Show more", and the total length
- **Thread or single post**
- **Media:** none, product screenshot, chart or metric card, video, meme
- **Account:** founder vs brand, and which performs better
- Whether the best posts share numbers (revenue, users, growth)

### LinkedIn
- **The opening two lines**, shown before "see more"
- **Format:** text only, image, document carousel, video
- People vs product in the visuals
- Company page vs employee posts, and whether employee posts match the company's LinkedIn ads

### Reddit
- **Title pattern:** question, story, "I built..."
- Subreddits, self vs link posts
- Whether the account says who it works for

## Write-Up

Per channel:

- **What the winners share:** three to five traits, each counted for both thirds ("7 of 10 top thumbnails show a face, 1 of 10 bottom ones"). The counts are Observed; the reason is Inferred.
- **House style:** what holds across every post: named colors with hex values read off the images, type, templates, logo placement, recurring series.
- **Formulas:** two or three fill-in templates behind the top titles, covers, or openings, with one real example each, e.g. "[Number] [audience] use [product] to [outcome]. Here's how."
- **What changed:** before vs after the inflection, where the dates allow.

For breaking down why one specific post spread, see the reverse-engineering framework in **social**.

## Contact Sheets

Per channel, one image with the top third in one row and the bottom-third sample in the row below, each labeled with its score and date. It's the fastest way for someone to check a claimed pattern. Build it from the downloaded files, for example with ffmpeg's `tile` filter, and link it in the write-up.
