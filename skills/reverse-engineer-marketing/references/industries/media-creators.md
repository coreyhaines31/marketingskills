# Media and Creators: Teardown Pack

Load this pack for publishers, newsletters, podcasts, YouTube channels, and creator businesses. The product is attention, so growth means audience growth plus how that audience gets monetized, and much of it comes from other creators through cross-promotion, recommendations, and guest spots.

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

- A subscribe form as the main call to action, with an archive of past issues or episodes.
- Newsletter platforms as CNAMEs or hosts in `teardown.mjs dns <domain>` (beehiiv, Substack, Ghost, Kit, and others), and podcast hosts in feed URLs.
- A "Sponsor" or "Advertise" page, often with a media kit.
- Membership, paid subscription, course, or merch pages tied to the same audience.
- `teardown.mjs detect <domain>` flags these together as media or creator.

## What Drives Growth Here

- **Other creators are the main channel.** Cross-promotions, recommendations inside newsletter platforms, guest appearances, and collaborations drive most audience growth for many creators.
- **Paid subscriber acquisition.** Many newsletters buy subscribers through ads, paid recommendation networks, and referral programs, then earn it back through sponsorships.
- **The format and cadence.** A consistent format, title pattern, and schedule compound; changes in cadence often line up with growth.
- **Monetization mix.** Sponsorships, paid subscriptions, products, and affiliate income each push the creator toward different growth tactics.
- **Platform algorithms.** On YouTube, TikTok, and podcasts, a single breakout piece of content can step up the whole curve.

## Signals to Collect

| Signal | Where or how | What it shows |
|---|---|---|
| ★ Subscriber or audience claims over time | `teardown.mjs history <url>` and `teardown.mjs hero <url>` on the homepage, sponsor page, and media kit | Self-reported audience size by date; label it reported, and each jump becomes a move in moves.csv |
| ★ Sponsorship rate card | The "Advertise" page and media kit, plus archived versions | Prices, open rates they claim, and how pricing rose with audience |
| Sponsors over time | Issue archives and episode notes, listing every sponsor and date | Who pays them and how full the ad inventory is |
| ★ Cross-promotions and recommendations | Recommendation lists on their sign-up page and profile (Substack recommendations, beehiiv's recommendations), "I also read" sections, and mentions in other newsletters | Which creators swap audiences with them; dated swaps become moves |
| ★ Paid recommendation networks | The post-sign-up "you might also like" screen on their form and on others' forms (beehiiv Boosts, SparkLoop, Kit's Creator Network) | Whether they buy subscribers per head through recommendations, or sell recommendations to others |
| Sponsorship marketplaces | Their listings on creator sponsorship marketplaces and newsletter ad networks | Public prices and audience claims, often more detailed than the media kit |
| Referral program | Referral pages with reward tiers, plus archives | How much growth comes from readers recruiting readers |
| Paid growth | `teardown.mjs sc-ads` and ad libraries for subscribe-focused ads | Whether they buy subscribers, and the lead magnet they use |
| Content cadence and format | Issue or episode archives, dated | Publishing rhythm and format changes |
| Breakout content | ScrapeCreators pulls on YouTube, TikTok, X, and Instagram, ranked within each channel | The pieces that stepped up the curve |
| Guest appearances | Podcast guest lists and YouTube collaborations, from transcripts and show notes | Borrowed audiences and when they started |
| Product and membership launches | `teardown.mjs sitemap-growth <domain>` and archived pricing pages | When they added paid tiers, courses, or communities |
| Social follower history | Archived profile pages and public trackers such as Social Blade for YouTube | Audience growth on each platform, dated |
| ★ Podcast rankings and reviews | Podcast chart positions and review counts over time | Ranking moves and listener growth proxies |

## Going Inside

- **Subscribe** with approval, under the user's real identity, and log the welcome sequence, every issue, every sponsor, and every upsell for 30 days.
- **Walk the paid tier sign-up** to the final step and stop; note the price, trial, and what's behind the paywall.
- **Request the media kit** only if the user is genuinely open to sponsoring; otherwise use the public sponsor page.
- **Guardrails:** don't sign up many fake addresses to test referral rewards; that inflates their numbers and breaks most referral terms. Don't pitch a cross-promotion you don't intend to run.

## Rules That Limit Copying

- **Sponsorship disclosure:** the FTC's Endorsement Guides (US, revised in 2023), the UK's CAP Code, and platform policies (YouTube's paid promotion label, Instagram's paid partnership label) require clear disclosure of paid sponsorships and affiliate links.
- **Email law:** CAN-SPAM (US), GDPR and ePrivacy (EU), and CASL (Canada) govern consent, especially for co-registration and paid subscriber acquisition.
- **Platform rules:** podcast platform policies, and newsletter platform rules against bought or rented lists and imported contacts without consent.
- **Copyright:** reusing clips, music, or another creator's format word for word can infringe; formats are free to learn from, content isn't.

## Plays That Usually Transfer

| Play | Run it with |
|---|---|
| A reader referral program with milestone rewards | **referrals** |
| Cross-promotion swaps with creators of similar size | **co-marketing** |
| A lead magnet that grows the list | **lead-magnets** |
| A consistent title and thumbnail formula per channel | **social**, **video** |
| A sponsor page with a clear rate card and audience profile | **sales-enablement**, **copywriting** |
| Guest appearances on shows with the target audience | **public-relations** |
| A welcome sequence that sets expectations and earns replies | **emails** |

## Metrics to Ask About

- **Subscriber growth rate:** net new subscribers per period, after unsubscribes.
- **Open and click rates:** for newsletters, measured the same way over time. Apple Mail Privacy Protection inflates opens, so ask for clicks and replies too, and treat claimed open rates in media kits as reported.
- **Subscriber acquisition cost:** for paid growth, cost per new subscriber.
- **Revenue per subscriber:** sponsorship, paid, and product revenue divided by audience.
- **Sponsor fill rate:** share of ad slots sold.
- **Paid conversion rate:** free subscribers who upgrade.
- **Downloads or views per episode or issue:** for podcasts and video.
