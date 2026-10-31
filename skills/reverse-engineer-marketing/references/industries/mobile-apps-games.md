# Mobile Apps and Games: Teardown Pack

Load this pack for consumer mobile apps and mobile games. Most of the funnel lives inside the app stores and inside the app, where web analytics can't see it, so the evidence comes from store pages over time, ad libraries, and the first-run experience.

PC and console games should load [games-pc-console.md](games-pc-console.md) instead.

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

- App Store and Google Play badges as the main call to action, often with a QR code on desktop.
- A Smart App Banner (`apple-itunes-app` meta tag) in the page source, which also names the App Store app ID.
- Deep link subdomains (`link.`, `go.`, `open.`) from `teardown.mjs dns <domain>` and `teardown.mjs subdomains <domain>`.
- Attribution link domains in buttons and ads: `onelink.me` (AppsFlyer), `adj.st` (Adjust), `app.link` (Branch).
- `/.well-known/apple-app-site-association` and `/.well-known/assetlinks.json` on the domain, which list the app IDs and the paths that open in the app.
- A thin website with a press kit, support pages, and terms, and little else.
- `teardown.mjs detect <domain>` flags these together as a mobile app.

## What Drives Growth Here

- **The store page is the landing page.** Icon, screenshots, title, subtitle, and rating decide conversion from every source. Store page changes often line up with install growth more than new campaigns do.
- **Paid user acquisition and its payback.** Apps and games scale on paid installs once revenue per user covers cost per install. Creative volume and refresh rate are the levers.
- **Featuring and charts compound.** An editorial feature or a chart position brings a wave of organic installs.
- **Monetization shapes the funnel.** Subscription apps put a paywall early; games monetize later through in-app purchases and ads. The onboarding tells you which model they run.
- **Games soft launch first.** Many games test in a few countries for months before a global launch, tuning retention before scaling spend.

## Signals to Collect

| Signal | Where or how | What it shows |
|---|---|---|
| ★ Store page history | Archived copies of the App Store and Google Play pages: `teardown.mjs hero <url>` for the title and description, `history` for price, and screenshots by hand | Title, subtitle, and screenshot changes by month; each change becomes a move in moves.csv |
| Store keywords in title and subtitle | The current store listing compared with past versions | Which search terms they target in store search (see **aso**) |
| Ratings and review counts | Store pages over time | Review velocity, a rough install-growth proxy, and when they added rating prompts |
| Version history | The "What's New" release notes on store pages | Feature launch cadence; dated releases become moves |
| ★ In-app events and promotional content | In-app events on the App Store page and promotional content on Google Play | Seasonal and live-ops moves surfaced in the store |
| ★ Soft launch countries | Store availability by country, archived store pages in other regions, and launch press | Where they tested before going global, and when |
| Paid UA creative | `teardown.mjs sc-ads <name> --domain <domain>` and the Meta, Google, and TikTok ad libraries | Creative volume, formats, playable or gameplay ads, and the longest-running hooks |
| Apple Ads presence | Search their category and competitor terms in the App Store on a device, and check the Today tab and "You Might Also Like" placements | Whether they bid on category or competitor terms. Apple renamed Apple Search Ads to Apple Ads in April 2025 and added placements beyond search |
| ★ Custom product pages and store experiments | Store links in their ads (App Store links with a `ppid` parameter open a custom product page); Google Play custom store listings by country | Which audiences get their own screenshots and message, and what they test on the store page |
| ★ Deep link map | `/.well-known/apple-app-site-association` and `/.well-known/assetlinks.json` | Which web paths hand off to the app: the web-to-app routes they care about |
| ★ Ad monetization partners (games and free apps) | `/app-ads.txt` on the developer's site | The ad networks they sell inventory through, which shows whether ads are a core revenue line |
| Featuring | App Store "Today" stories, Google Play editorial lists, and their press about being featured | Organic spikes tied to featuring; dated features become moves |
| Attribution and deep links | Link domains in their buttons and ads (`onelink.me`, `adj.st`, `app.link`) and `teardown.mjs dns <domain>` for link subdomains | Which mobile measurement partner they use and how they run web-to-app links |
| Influencer and creator content | ScrapeCreators pulls on TikTok and YouTube for the app name | Creator-driven install waves |
| Web-to-app funnels | Landing pages with quizzes or web checkout before the install | Whether they sell subscriptions on the web, outside the store |

## Going Inside

- **Install and record the first session** on a real device the user controls, with approval. Screenshot every onboarding screen, permission prompt, personalization question, and the paywall.
- **Paywall:** note the trial length, plan order, default selection, and price. Don't start a paid trial without approval, and set a reminder to cancel if one is approved.
- **Rating prompt:** note when the app asks for a rating and what happens just before (many ask right after a success moment). On iOS the system prompt shows at most three times a year, so its timing is a deliberate choice.
- **Notifications:** with approval, allow notifications and log every push for two weeks by day and type, the same way go-inside.md logs emails.
- **Games:** play through the tutorial and the first session, and note the first purchase offer and when ads appear.
- **Guardrails:** no fake reviews, no review swaps, and no rating manipulation. Never decompile the app or inspect its network traffic beyond what any user sees; that breaks the store terms and often the law.

## Rules That Limit Copying

- **Apple App Store Review Guidelines and Google Play policies:** rules on subscription disclosure, misleading screenshots, and incentivized reviews. Apple requires its own rating API (no custom "rate us" prompts that ask for a review); Google Play offers an In-App Review API with its own quotas.
- **External payment links:** rules differ by store and region. In the US, a 2025 court order in Epic v. Apple opened the door to linking out to web checkout; in the EU, the Digital Markets Act sets its own terms. Check the current store policy before copying a web-to-app flow.
- **Privacy and attribution:** Apple's App Tracking Transparency requires consent before tracking across apps, so iOS attribution relies on SKAdNetwork and AdAttributionKit. GDPR and US state privacy laws add more limits.
- **Games:** Apple and Google require apps with loot boxes to disclose the odds, and some countries (Belgium, for example) treat paid loot boxes as gambling. Age ratings limit who you can target.
- **Subscription law:** the FTC's federal click-to-cancel rule was vacated by a federal appeals court in 2025, but state auto-renewal laws (California's, for example) and EU rules still set disclosure and cancel-flow requirements. Check with counsel.

## Plays That Usually Transfer

| Play | Run it with |
|---|---|
| Store page tests on icon, first screenshots, and subtitle | **aso** |
| A paywall placed after the first personalized result | **paywalls** |
| Onboarding that personalizes before asking for money | **onboarding** |
| Creator-led launch on TikTok and YouTube | **influencer-marketing**, **social** |
| High-volume paid creative with fast refresh | **ad-creative**, **ads** |
| A web-to-app funnel with a quiz on the web | **cro**, **paywalls** |
| Custom product pages matched to each ad audience | **aso**, **ad-creative** |
| Win-back pushes and emails for lapsed users | **emails**, **churn-prevention** |

## Metrics to Ask About

- **Store conversion rate:** page views to installs.
- **Day 1, 7, and 30 retention:** share of installers still active.
- **Trial start and trial-to-paid rate:** for subscription apps.
- **ARPU or LTV:** revenue per user over time.
- **CPI and payback period:** cost per install and how long until it's earned back.
- **Organic share of installs:** installs not attributed to paid campaigns.
- **Rating and review velocity:** average rating and new reviews per week.
