# Consumer Hardware: Teardown Pack

Load this pack when the target sells physical devices to consumers: electronics, smart home, wearables, audio, kitchen gadgets, and other engineered products. Growth here comes in launches: a crowdfunding or pre-order spike, review coverage that decides the launch, then retail and Amazon distribution, all limited by manufacturing and inventory.

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

- Product pages with tech specs, "what's in the box", compatibility lists, and a "pre-order" or "ships in [month]" label.
- Links to a past Kickstarter or Indiegogo campaign, or a BackerKit pledge manager.
- "Available at" retailer logos (Best Buy, Target, Amazon), and warranty registration and support pages.
- An app or firmware download page for connected devices, and an `app.` or `account.` subdomain.
- `teardown.mjs detect <domain>` flags crowdfunding links (Kickstarter, Indiegogo, BackerKit), tech-spec and in-the-box pages, and pre-order text; run `teardown.mjs shopify <domain>` when it's on Shopify.

## What Drives Growth Here

- **Launches are the curve.** Most revenue lands in spikes: the crowdfunding campaign, the pre-order window, launch reviews, holiday season, and each new model. Read the curve launch by launch.
- **Reviews make or break a launch.** Tech reviewers, YouTube creators, and gift guides set the narrative in the first weeks. Review units and embargo dates are planned months ahead.
- **Inventory caps growth.** Stockouts, shipping delays, and pre-order backlogs can hide demand. A flat curve can mean sold out, not unwanted.
- **Distribution shifts the margin:** DTC first, then Amazon, then big-box retail, each with its own marketing (retail media, endcaps, Amazon Vine and Deals).
- **Accessories, subscriptions, and new generations** drive revenue from the installed base after the first sale.

## Signals to Collect

| Signal | Where or how | What it shows |
|---|---|---|
| ★ Crowdfunding campaign history | The Kickstarter or Indiegogo page (backers, total raised, updates, comments), and third-party trackers of daily pledges where available | Launch size, the pre-launch list that drove day one, the reward tiers that sold, and shipping delays from updates and comments |
| ★ Pre-launch list | Archived "notify me" or reservation pages, and referral-for-early-access pages | How they built the day-one audience; launch dates become moves |
| Pre-order and ship dates | Archived captures of product pages, read by hand for "ships in" text (`teardown.mjs history <url>` only tracks prices) | Backlogs and production ramps; each ship-date change is a move |
| ★ Stockouts | Product page availability over time from archived captures, and `shopify` variant data | When demand outran supply, which hides growth in the curve |
| Launch review coverage | Searches for "[product] review" on YouTube and tech sites, dated | Embargo dates and which reviewers they seeded; review dates become moves |
| Creator seeding | Creator videos with gifted or sponsored disclosures, and affiliate links | The creator program behind the launch |
| Gift guide placement | Holiday gift guides from major publications, archived | Q4 demand drivers |
| Amazon presence | The Amazon listing, review count over time, ratings, and Vine reviews | Amazon's share of sales and review velocity |
| Retail distribution | "Available at" logos, retailer product pages, and press releases | Retail expansion by date |
| Model generations | Product pages and press for each new version | Launch cadence and the installed-base upgrade cycle |
| Accessories and subscriptions | Accessory catalog and subscription pages | Post-purchase revenue streams |
| Regulatory listings | FCC equipment authorization database for devices with radios | Devices filed before announcement, sometimes months before launch |
| Support and community | Forums, subreddits, and support page volume | Quality issues, returns pressure, and loyal-user communities |

## Going Inside

With approval, under the user's real identity, and within the user's budget:
- **Join the pre-launch list or reservation** with the dedicated inbox, and log the launch sequence and early-bird offers.
- **Buy the product** to keep (see funnel-hack.md). Record checkout upsells (protection plans, accessories), shipping communication, unboxing inserts, the setup flow and app, account creation, and review request timing.
- **Back a campaign** only within the approved budget, and only if the user accepts the delivery risk.
- **Returns and warranty:** read the policies. Return only under the published policy and for a real reason.
- Don't open devices to copy hardware design, don't break software terms, and don't post reviews of a competitor's product.

## Rules That Limit Copying

- **FCC equipment authorization (US):** devices with radios generally need authorization before they're marketed or sold. Pre-authorization advertising and display need specific disclosures, and delivery to consumers before authorization is prohibited. Check the current rule (47 CFR 2.803) before running pre-orders.
- **Shipping times:** the FTC Mail, Internet, or Telephone Order Merchandise Rule requires shipping in the stated time (or 30 days if none is stated) and a delay notice with a cancellation option. Pre-order dates must be real.
- **Crowdfunding platform rules:** Kickstarter requires working prototypes for hardware and bans photorealistic renderings that could be mistaken for a finished product. Copy the campaign structure within those rules.
- **Warranty:** the Magnuson-Moss Warranty Act governs written warranties, including bans on voiding a warranty just for using third-party parts. Several states have right-to-repair laws for electronics.
- **Claims and labels:** the FTC's Made in USA Labeling Rule, battery and safety standards, California Proposition 65 warnings, and the EU's CE and WEEE requirements. Creator content needs disclosure under the FTC Endorsement Guides.

## Plays That Usually Transfer

| Play | Run it with |
|---|---|
| Pre-launch list with referral for early access | **launch**, **referrals** |
| Crowdfunding campaign page and reward tiers | **launch**, **offers** |
| Creator seeding and embargoed review program | **influencer-marketing**, **public-relations** |
| Gift guide and holiday push | **public-relations**, **marketing-plan** |
| Comparison pages against the previous model and rivals | **competitors** |
| Post-purchase setup, accessories, and review request flow | **emails**, **onboarding** |
| Product demo videos | **video** |

## Metrics to Ask About

- **Pre-launch list size and list-to-order conversion.**
- **Launch-week sales and review coverage count.**
- **Sell-through:** share of retail inventory sold to consumers in a period.
- **Return rate and reasons:** by channel.
- **Attach rate:** accessories and protection plans per device.
- **Contribution margin by channel:** DTC, Amazon, and retail.
- **Repeat or upgrade rate:** owners who buy the next model or accessories.
