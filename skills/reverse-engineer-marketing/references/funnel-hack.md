# Funnel Hack

Funnel Hack mode in full: buy from the target the way a customer would, and map every step from the first ad to the last follow-up. It extends [go-inside.md](go-inside.md), and all of its rules apply: the user approves each action, the user's real identity, and a dedicated inbox on the user's domain.

## Contents
- Before you buy
- Map the money path
- Find their tests
- Read their paid search
- Build the swipe file
- The funnel map deliverable

---

## Before You Buy

- **Set a budget with the user** before the first purchase: the total, the products, and whether to take upsells. Every purchase needs an explicit yes with the amount.
- **Buy to keep.** Refund only under the seller's published policy and for a real reason. Don't plan purchases around refunds.
- **Use the user's payment method and name.** No virtual cards in made-up names.
- **Don't exploit bugs.** If a checkout misprices something or a discount stacks by mistake, note it and don't use it.
- **Pick the entry point a real buyer would use:** an active ad (from `sc-ads` or the ad libraries), a lead magnet, or the homepage. Record which one, because funnels differ by entry.

## Map the Money Path

Screenshot and record each step in `teardowns/<target>/funnel/steps.csv`:

`step,url,screenshot,offer,price,anchor_price,cta,timer_or_scarcity,notes`

| Step | What to capture |
|---|---|
| **Ad** | Hook, offer, and the exact landing page with its UTM parameters |
| **Landing page** | Headline, offer stack, proof, guarantee, CTA, page speed |
| **Opt-in** | Fields, lead magnet, consent language, SMS opt-in |
| **Thank-you page** | The immediate next offer, often a low-price first purchase |
| **Checkout** | Order bump, payment options (Shop Pay, buy now pay later, PayPal), shipping threshold, subscribe-and-save, trust badges |
| **Upsells and downsells** | Each one-time offer after checkout: product, price, and what happens if you decline |
| **Confirmation** | Post-purchase offers, referral prompt, account creation |
| **Follow-up** | Every email and SMS for 30 days, logged as in go-inside.md |

Then run the side paths:

- **Abandoned cart:** add to cart, enter the email, leave. Log the emails and texts, their timing, and whether the discount grows with each one.
- **Abandoned opt-in:** start the quiz or opt-in and stop halfway, if the flow captures the email early.
- **Popups:** note what triggers each one (time, scroll, exit intent), the offer, and whether it changes on a second visit (hand to **popups**).
- **Webinar funnels:** registration page, confirmation, reminder sequence, the replay page, the minute the pitch starts, the offer, and the deadline.
- **Quiz funnels:** every question, the branches, each result page, and the offer each result gets.

### Check the Urgency

Open each countdown timer, "only N left", and "offer ends tonight" message in two clean browser sessions, a few hours apart, and again after the stated deadline. Record exactly what you saw as Observed: "the timer restarted in a new session", "the count stayed at 7 for three days". Whether the scarcity is staged is Inferred: a count that never moves can mean no sales, and a restarting timer can be a disclosed per-visitor offer. Either way, don't copy urgency as if it's what converts, and remember that false scarcity runs into the FTC's rules on deceptive practices.

## Find Their Tests

- **`teardown.mjs experiments <domain>`** lists the client-side testing tools and, for Optimizely and GrowthBook, the readable names in their configs. Names like `pricing_annual_default_v3` or `checkout_bump_socks` hint at what they test, though a name in a config can be paused or finished.
- **Variant check:** load the landing page, pricing page, and checkout in three or four fresh sessions and compare. Different headlines, prices, or bumps suggest a live test or personalization, labeled Inferred. Screenshot each variant.
- **Dynamic text:** change `?keyword=`, `?utm_term=`, or `?q=` on an ad landing page and see if the headline changes to match.
- **Geo pricing:** if the browser tool supports country proxies, compare prices by country.

## Read Their Paid Search

Search results with ads, from a SERP API (DataForSEO, SerpApi) or by hand:

| Query | What it shows |
|---|---|
| Their brand name | Whether they protect it, and who bids on it |
| Your brand name | Whether they bid on you, and their ad copy against you |
| Other competitors' names | Who they treat as their rivals |
| Category terms ("best X", "X software", "X near me") | The ad copy and landing pages they pay for |
| "[their brand] alternative", "[their brand] pricing" | How they defend their own funnel |

Record the ad copy and landing page for each, dated. Hand conquesting findings to **ads** and **competitors**.

## Build the Swipe File

One file, `teardowns/<target>/funnel/swipe.md`, grouped by type, every item linked and dated:

- **Hooks:** first lines of ads, emails, and landing pages
- **Headlines and subheads**
- **Offer stacks:** bonuses, guarantees, payment plans, price anchors
- **Proof:** testimonial formats, numbers, logos, review widgets
- **CTAs and button copy**
- **Email subject lines** with their send day

Hand the swipe file to **offers**, **copywriting**, and **emails**. Copy the structure, never the words: their copy is protected.

## The Funnel Map Deliverable

`teardowns/<target>/funnel/map.md`:

1. **The diagram:** each step as a box with its price, in order, with branches for declines and abandons
2. **The offer stack table:** every product and offer, its price, its anchor, and where it appears
3. **The follow-up calendar:** day by day, email and SMS, with offers
4. **Tests seen:** tools, config names, variants
5. **Urgency check results**
6. **What to copy and what not to:** with the skill that runs each copied piece (**offers**, **cro**, **popups**, **emails**, **sms**, **pricing**, **paywalls**)
7. **Spend:** what was bought, the total, and any refunds under the published policy
