# Regulated Goods: Teardown Pack

Load this pack for alcohol, cannabis, hemp and CBD, tobacco and vaping, and firearms and accessories. These companies can't use most of the channels other brands rely on, so how they grow around the restrictions is the teardown. Legal status differs by product and by state, and it's changing, so date every legal claim and check it again before acting on it.

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

- An age gate on entry ("Are you 21 or older?") and age verification at checkout (AgeChecker.Net, Veriff, Yoti, ID scanning)
- Alcohol: "Where to buy", state shipping lists, wine club platforms and compliance tools (Commerce7, WineDirect, Vinoshipper, ShipCompliant)
- Cannabis: embedded dispensary menus (Dutchie, Jane, Leafly, Weedmaps), license numbers in the footer, state-by-state store locators
- Tobacco and vaping: the required nicotine warning on product pages, adult-only signup, and shipping limits by state
- Firearms: "ships to your FFL" language, FFL dealer locators, and state restriction notices
- `teardown.mjs detect <domain>` flags age gates, nicotine warnings, dispensary menus, and FFL language

## What Drives Growth Here

- **The big ad platforms are mostly closed.** Google and Meta ban or tightly restrict ads for cannabis, tobacco and vapes, and firearms, and limit alcohol by country and audience age. Growth comes from owned channels, retail partners, and community.
- **Distribution is the moat.** Alcohol runs through distributors and retailers under the three-tier system; cannabis through licensed dispensaries in each state; firearms through dealers. New distributors, states, and retail doors explain most growth.
- **Retail menus and locators are the storefront.** For cannabis and alcohol, being on dispensary menus and retailer apps matters more than the brand's own site.
- **Email and SMS are owned, but restricted.** Carriers treat these categories as restricted SMS content, and some messaging providers bar some of them outright, so the lists that do exist are valuable.
- **Each state is a launch.** A new legal market, a new license, or a new shipping state is a dated move.

## Signals to Collect

| Signal | Where or how | What it shows |
|---|---|---|
| ★ Alcohol label approvals | TTB's public COLA Registry, searched by brand or company | Every label approved, with dates: new products, line extensions, and launch cadence. Each wave becomes a move in moves.csv |
| ★ State license footprint | State cannabis regulators' license lookups; state alcohol beverage control lookups; ATF's FFL listings for firearms dealers | Licensed locations and markets added over time |
| State sales data | Some state cannabis regulators publish sales or tax data by license or by month | Real revenue trends for licensed operators in those states |
| ★ Retail menu presence | Brand pages on dispensary menu platforms; retailer apps and delivery services for alcohol | Doors carrying them and where new doors are added |
| Distributor announcements | Press releases, trade press, state distributor partnership news | New states and distributors, dated |
| Tobacco marketing authorization | FDA's lists of authorized tobacco products and its warning letters | Whether their products can legally be sold, and enforcement history |
| DTC shipping states | Their shipping policy page; `teardown.mjs history <url>` on it | When each state opened or closed for direct shipping |
| Age-gated owned channels | Email and SMS signups, loyalty programs, membership clubs | How they build reach without ads; the incentives they offer |
| Content and creator programs | Creators, podcasts, YouTube channels, ambassador programs | Reach built where ads aren't allowed; check disclosures and age rules |
| Events and trade shows | Industry trade shows, tastings, festivals, range days, dispensary pop-ups | Offline launches and retail activations |
| Ads that do run | `teardown.mjs ads <name> --domain <domain>` and `teardown.mjs sc-ads <name> --domain <domain>` | What gets past platform policy (brand content, lifestyle, accessories) and how they frame it |
| Reviews and ratings | Retailer and menu platform reviews, app store reviews | Product traction by door and market |

## Going Inside

- **Only buy if the user is of legal age, in a place where the product is legal, and approves the purchase.** Never misstate age or location to get past a gate.
- Don't buy firearms, ammunition, nicotine, or cannabis for a teardown unless the user would buy them anyway and can legally. Public pages, menus, and locators usually show enough.
- Sign up for email, SMS, and loyalty programs under the user's real identity to log cadence and offers.
- Screenshot the age gate, the verification step, and the checkout restrictions by state.

## Rules That Limit Copying

- **Alcohol:** TTB regulates labeling (labels need an approved COLA) and advertising content under 27 CFR parts 4, 5, and 7. Industry self-regulatory codes from the spirits, beer, and wine trade groups require ads to run only where a set share of the audience, above 70% depending on the code, is of legal drinking age. Direct shipping is allowed for wine in most states and for spirits in only a few, and state rules differ.
- **Cannabis:** adult-use marijuana is still a Schedule I controlled substance federally. An April 2026 order moved FDA-approved marijuana drugs and state-licensed medical marijuana to Schedule III, broader rescheduling was still under review, and the order faced court challenges. State law governs licensing and advertising, often with audience-age and content rules. Don't ship across state lines.
- **Hemp and CBD:** a November 2025 federal law redefines hemp and bans most intoxicating hemp-derived THC products (more than 0.4 mg total THC per container) from November 12, 2026. FDA also limits health claims and CBD in food.
- **Tobacco and vaping:** FDA requires premarket authorization for tobacco products, including e-cigarettes, and a nicotine addiction warning on covered products and their ads. The PACT Act, as extended to e-cigarettes in 2020, requires seller registration and age verification at delivery, and bars mailing vapes through USPS. Many states ban flavored products.
- **Firearms:** online firearm sales must transfer through a licensed dealer (FFL). Ammunition and accessory rules vary by state. Google and Meta prohibit ads for firearms and ammunition and restrict many accessories.
- **Platforms and SMS:** Google and Meta policies change often and differ by country. For SMS, age gating is the minimum, not a pass: carriers restrict alcohol, firearms, and tobacco content, and messaging providers such as Twilio prohibit some categories (cannabis and CBD among them) whatever the age gate, with rules that vary by number type. Check the provider's current forbidden-content policy before proposing an SMS play.
- **Influencers:** creators must disclose paid posts under FTC rules, and alcohol and cannabis codes add audience-age rules.
- Laws here change quickly. Check with counsel before copying any channel, claim, or shipping practice.

## Plays That Usually Transfer

| Play | Run it with |
|---|---|
| An age-gated email program with a reason to join, plus SMS only where the provider allows the category | **emails**, **sms** |
| Retail and menu presence with a locator and retailer support | **co-marketing**, **sales-enablement** |
| A membership club or loyalty program | **referrals**, **offers** |
| State launch playbooks with retailer and press outreach | **launch**, **public-relations** |
| Educational content that ranks without making health claims | **content-strategy**, **seo-audit** |
| Events, tastings, and pop-ups | **events** |
| Compliant creator and ambassador programs | **influencer-marketing** |

## Metrics to Ask About

- **Doors and menus:** retail locations or dispensary menus carrying the product
- **Depletions:** for alcohol, what distributors sell to retailers. It sits between the producer's shipments to distributors and the retailer's sales to consumers, so it isn't consumer demand
- **Velocity:** units sold per door per week
- **Markets live:** states or countries open, and time to launch a new one
- **Owned list size and growth:** age-verified email and SMS subscribers
- **Club or loyalty retention:** members still active after a set period
- **Repeat purchase rate** by channel
