# PC and Console Games: Teardown Pack

Load this pack for PC and console games and the studios and publishers behind them. Growth is concentrated around a few dated moments (the store page going live, festivals, the demo, launch, updates, sales), and the store's own algorithm amplifies whatever momentum a game brings to those moments. Mobile games use [mobile-apps-games.md](mobile-apps-games.md).

## Contents
- How to recognize it
- What drives growth here
- Signals to collect
- Going inside
- Rules that limit copying
- Plays that usually transfer
- Metrics to ask about

---

## How to Recognize It

- "Wishlist on Steam" as the main call to action, with Steam, PlayStation, Xbox, Nintendo eShop, or Epic Games Store badges.
- A press kit page, a Discord invite as the second call to action, and a trailer embedded above the fold.
- Links to `store.steampowered.com/app/<id>` that give you the Steam app ID for every later lookup.
- A publisher or studio site that lists several games, each with its own store links.
- `teardown.mjs detect <domain>` flags Steam store links, wishlist calls to action, and `VideoGame` schema. Sites heavy on news or trailers can also score as media; confirm the industry with the user.

## What Drives Growth Here

- **Wishlists before launch decide launch week.** Steam notifies wishlisters at launch and on discounts, and strong early sales feed Steam's own visibility features. Most of the marketing happens before release.
- **Festivals and events are scheduled moves.** Steam Next Fest runs three times a year, and themed Steam festivals and seasonal sales give games dated visibility windows. Which events a game joined, and what it shipped for each, explains its wishlist steps.
- **Demos and playtests are acquisition.** A demo during Next Fest, a public playtest, or an early access launch turns attention into wishlists and reviews.
- **Creators move the curve.** Streamer and YouTuber coverage often precedes the biggest jumps, and the studio's key distribution to creators is a deliberate campaign.
- **Updates relaunch the game.** Major updates, DLC, and console ports bring players back and get fresh visibility, so a live game has several curves, not one.

## Signals to Collect

| Signal | Where or how | What it shows |
|---|---|---|
| ★ Follower and player history | Public Steam data sites such as SteamDB for follower counts, concurrent players, and price history by app ID | The real demand curve before and after launch; follower count is a common public proxy for wishlists, so label it Inferred |
| ★ Store page history | `teardown.mjs hero <url>` (title and short description) and `history <url>` (price) on the Steam store page, plus archived captures read by hand for capsule art, tags, and trailers | When the capsule art, short description, tags, trailer, and price changed; each change becomes a move in moves.csv |
| Store page coming-soon date | Wayback captures of the Steam page, SteamDB's app history | How long the page collected wishlists before launch |
| ★ Festival and event participation | Steam event pages, the game's own announcement posts on Steam, Next Fest demo listings | Which events they joined and what they shipped for each (a demo, a trailer, a discount); dated moves |
| Demo and playtest | The Steam page's demo listing, playtest sign-ups, and their dates | When they opened the game to players, and the demo's own follower and review counts |
| Review count and score over time | The Steam review histogram on the store page | Launch momentum, review spikes after updates, and review bombing |
| ★ Creator coverage | ScrapeCreators YouTube and TikTok pulls for the game name, and public Twitch viewership trackers | Which creators covered it, when, and which video lined up with a follower jump |
| Creator key programs | Their press kit, "for creators" page, and key-distribution platform listings | Whether they run an organized key campaign and to which tier of creators |
| Discord community | Member count from the public invite page, sampled over time | Community growth and how they gather playtesters |
| Social and trailer performance | ScrapeCreators pulls on their channels; trailer views on YouTube and IGN-style channels | Which trailer or clip broke out |
| Console and platform launches | PlayStation, Xbox, Nintendo, and Epic store pages and announcement dates | Ports and timed exclusives as separate growth moves |
| Publisher and funding | Press releases, publisher sites, `teardown.mjs filings <company>` for public publishers | Who funds marketing, and when a publisher took over |
| Sales and discount history | Price history on public Steam data sites | Discount depth and cadence, and how much each sale moved players |

## Going Inside

- With approval, follow and wishlist the game on Steam under the user's real account, join the Discord, and subscribe to the newsletter. Log every Steam notification, Discord announcement, and email for 30 days.
- Play the demo or playtest and record the first 15 minutes: the hook, the tutorial, where the demo ends, and the wishlist prompt at the end.
- Don't buy the full game without approval. Don't request creator or press keys unless the user is a real creator or press outlet.
- Never join playtests or betas with extra accounts, and never leave reviews you didn't earn by playing.

## Rules That Limit Copying

- **Steamworks rules:** Valve's documentation governs store page assets, review policies, key distribution, and event participation. Steam bans offering incentives for reviews, and keys sold off Steam have their own rules. Read the current Steamworks documentation before copying a key or review tactic.
- **Console certification:** PlayStation, Xbox, and Nintendo each have submission, age rating, and marketing-asset rules, and store features (like pre-order placement) depend on platform deals.
- **Age ratings:** ESRB, PEGI, and other rating bodies limit how and to whom a game can be advertised.
- **Creator disclosure:** sponsored streams and videos follow the FTC's Endorsement Guides in the US and similar rules elsewhere, and a free key can count as a material connection that needs disclosure.
- **Loot boxes and in-game purchases:** several countries regulate paid random rewards, and platforms require odds disclosure.

## Plays That Usually Transfer

| Play | Run it with |
|---|---|
| A coming-soon store page live months before launch, with tested capsule art | **aso**, **ad-creative** |
| A Next Fest demo that ends on a wishlist prompt | **launch**, **cro** |
| A creator key campaign by tier and timing | **influencer-marketing** |
| A Discord-led playtest that feeds reviews at launch | **community-marketing** |
| A trailer and short-clip formula per channel | **video**, **social** |
| An update or DLC treated as a relaunch | **launch**, **emails** |

## Metrics to Ask About

- **Wishlists and wishlist conversion:** wishlists before launch, and the share that buy in the first weeks.
- **Follower to wishlist ratio:** how the public number relates to the private one for their own games.
- **Concurrent players:** peak and average, by week after launch and after each update.
- **Review count and positive share:** the first-week count matters for visibility.
- **Demo players and demo-to-wishlist rate.**
- **Revenue by platform:** Steam vs consoles vs other stores.
- **Discount lift:** units sold during a sale vs the weeks before.
