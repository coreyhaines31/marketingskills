# Gambling and Betting: Teardown Pack

Load this pack for sportsbooks, online casinos, sweepstakes and social casinos, daily fantasy, poker, and lotteries. Growth here is gated by law: a company can only grow where it holds a license or where its model is legal, so state and country launches are the biggest moves on the timeline, and every marketing tactic sits under advertising and responsible gambling rules that change often.

Legal status varies by jurisdiction and product and changes frequently. Treat everything in this pack as a starting point, confirm current status with the regulator, and check with counsel before copying any tactic.

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

- Odds, "bet", "spins", "promo code", or "sign-up bonus" as the main call to action, often with a state selector or geolocation check.
- Responsible gambling footers: age limits (21+ or 18+), a helpline number, license numbers, and regulator names.
- Geolocation and age verification tools in the page or app flow, and state-specific subdomains or paths (`nj.`, `/pa/`).
- Sweepstakes and social casinos show "no purchase necessary" language and two currencies (one for play, one redeemable).
- `teardown.mjs detect <domain>` flags sportsbook and odds language, deposit-match offers, problem-gambling helplines, and sweepstakes terms. Confirm the industry with the user.

## What Drives Growth Here

- **Launches are the growth.** Each new state, province, or country license opens a market at once, usually with a launch-day bonus war. Line up the curve with launch dates first.
- **Acquisition is bonus-led and expensive.** New-customer offers, odds boosts, and deposit matches drive sign-ups, so customer acquisition cost and bonus abuse shape the economics. Watch how offers shrink as a market matures.
- **Affiliates are a primary channel.** Review, odds comparison, and picks sites earn commissions per depositor or revenue share. Placement on those sites is often bought, and affiliates may need their own license or registration.
- **Retention is product and promos.** Same-game parlays, live betting, loyalty tiers, and personalized promos keep players. Cross-selling from sportsbook to casino is a major lever where casino is legal.
- **Sweepstakes and prediction-market models grew where licensed products were not legal,** and both face fast-moving legal challenges, with several US states banning sweepstakes casinos in 2025.

## Signals to Collect

| Signal | Where or how | What it shows |
|---|---|---|
| ★ License and launch dates by jurisdiction | State and country regulator license lists and press releases, their "where we operate" page, and `teardown.mjs history <url>` on it | The real growth timeline; each launch becomes a move in moves.csv |
| ★ Regulator revenue and handle reports | Monthly reports many US state regulators publish by operator | Real, dated revenue, handle, and market share, not estimates |
| Welcome offer history | `teardown.mjs history <url>` and `teardown.mjs hero <url>` on promo pages; affiliate sites' archived offer listings | Offer size and structure by month and market; changes become moves |
| ★ Affiliate footprint | Odds comparison and review sites, their affiliate program page, and affiliate links with tracking parameters | How much acquisition runs through affiliates and which sites rank them first |
| Promo code campaigns | Codes in their ads, sponsorships, and creator content | Which partners get trackable codes, which shows the channels they measure |
| Sponsorships and partnerships | Team, league, media, and venue partnership announcements | Brand spend by market, often timed to launches |
| Paid ads | `teardown.mjs sc-ads <name> --domain <domain>` and ad libraries | Creative, offers, and which markets they target; ad platforms only allow gambling ads from certified advertisers |
| App store presence | Store pages by country and state availability notes | Where the real-money app is live, and rating trends |
| Product launches | Changelogs, app release notes, press | Same-game parlays, live betting, casino add-ons, and new sports; dated moves |
| Responsible gambling features | Deposit limits, time-outs, self-exclusion pages | Compliance posture, which regulators and partners check |
| Public company filings | `teardown.mjs filings <company>` | Customer counts, promo spend, and market-by-market results for listed operators |

## Going Inside

- Only with the user's approval, under their real identity, and only if the user is of legal age and located where the product is legal. Geolocation checks exist for a reason; never use a VPN or false location to get past them.
- Walk the sign-up to the point of identity verification and stop unless the user approves going further. Screenshot the offer terms, wagering requirements, and the responsible gambling prompts shown.
- Don't deposit or bet without explicit approval and a set amount. Never claim bonuses with multiple accounts; that's bonus abuse and breaks the terms.
- Log promotional emails, texts, and pushes for 30 days if the user opts in, noting how fast they arrive after sign-up.

## Rules That Limit Copying

- **Licensing:** real-money products and their marketing are legal only where the operator is licensed. Marketing into a market where it isn't legal can breach state or national law. Check with counsel.
- **Advertising codes:** in the US, state regulators set advertising rules (age limits, "risk-free" claims, college targeting), and the American Gaming Association's Responsible Marketing Code sets industry standards. In the UK, the Gambling Commission and the CAP and BCAP codes apply, and bonus wagering requirements are capped at 10 times the bonus since January 2026.
- **Never target minors or vulnerable people.** No marketing to people under the legal age, on college campuses, or to self-excluded players. Don't copy any tactic that relies on targeting people with gambling problems.
- **Ad platforms:** Google requires gambling advertisers to be certified, Meta requires prior written permission, and both limit targeting by country and state.
- **Affiliates and promo terms:** many regulators hold operators responsible for affiliate claims, and some require affiliates to register. Offer terms must be clear and not misleading.
- **Sweepstakes and social casinos:** legal status differs by state and is changing quickly. Don't copy the model without current legal advice.

## Plays That Usually Transfer

| Play | Run it with |
|---|---|
| A launch playbook per new market, with a dated offer and partner plan | **launch**, **offers** |
| An affiliate program with clear, compliant terms | **referrals** |
| Market-specific landing pages with local teams and events | **programmatic-seo**, **site-architecture** |
| Partnership and sponsorship activations with trackable codes | **co-marketing**, **attribution** |
| Lifecycle promos tied to the sports calendar | **emails**, **sms** |
| Comparison and review site presence | **competitors**, **link-building** |

## Metrics to Ask About

- **First-time depositors:** new players who deposit, by market and channel.
- **Customer acquisition cost:** including bonus cost, not just media.
- **Handle and hold:** total amount wagered, and the share the operator keeps.
- **Net gaming revenue:** revenue after promotional credits.
- **Promo intensity:** promotional spend as a share of gross revenue.
- **Retention and cross-sell:** players active after 30 and 90 days, and the share using more than one product.
- **Affiliate share of acquisition.**
