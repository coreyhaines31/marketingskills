# Mobile Subscription App Paywalls

Consumer iOS and Android subscription apps (fitness, learning, focus, faith, scanners) run on different paywall mechanics from SaaS upgrade screens. Billing goes through the app stores, the paywall usually sits inside onboarding, and most revenue comes from a yearly plan sold on day one. Use this reference for those apps; the rest of the skill still applies to the copy, design, and testing.

## Contents

- Placement: after the first personalized result
- Hard paywall vs. freemium
- Plan presentation
- Trials
- One abandon offer
- Store fees and web checkout
- Unit economics per download
- App Store review checklist

## Placement: after the first personalized result

The common pattern is **onboarding → personalized result → paywall**. Onboarding asks a few questions about the user's goal, the app shows something built for them (a plan, a score, a first analysis), and the paywall follows while that result is on screen. The result is the value moment the paywall leans on; a paywall on first launch, before anything personal has happened, asks for money with nothing to point at.

## Hard paywall vs. freemium

A hard paywall (no core use without a trial or purchase) and freemium (a capped free tier) are both legitimate. RevenueCat's State of Subscription Apps 2026 found hard-paywall apps converting roughly five times as many users to paid in the first 35 days as freemium apps, while one-year retention of yearly subscribers was about the same for both (27% vs. 28%). Freemium still fits when the free tier drives sharing or word of mouth. If you keep a free tier, cap it daily so the limit is felt in the habit, not after a month.

## Plan presentation

1. **Lead with the yearly plan**, with the per-week or per-month equivalent as supporting text ("$0.58/week, billed $29.99 yearly"). The billed amount and period must stay clear; the breakdown is framing, not a replacement.
2. **Offer at most one shorter option** (weekly or monthly) as the comparison.
3. **Localize prices by storefront** rather than converting one price.
4. **Test price, plan mix, trial length, and design** remotely so changes don't need an app release. Paywall platforms such as Superwall, RevenueCat Paywalls, and Adapty do this; pick on fit with your stack.

## Trials

- **Offer a free trial on the yearly plan** and schedule a reminder before it ends. Surprise renewals drive refunds, one-star reviews, and chargebacks.
- **Trial length is a test, not a default.** RevenueCat's 2026 data shows longer trials (17+ days) converting at a higher median rate than trials of four days or less, at the cost of waiting longer for revenue. Short trials suit apps where value lands in a day or two; longer trials suit habits that take a week to form.

## One abandon offer

When someone closes the paywall without starting a trial, one discounted yearly offer is a standard move. Show it **once**, not on every close, and keep it consistent with the rules in the main skill (respect the no, no fake countdowns).

## Store fees and web checkout

Fees change and differ by country, so treat these as a snapshot (October 2026) and check current terms before modeling:

- **Apple:** subscriptions pay 15% for members of the App Store Small Business Program (under $1M in annual proceeds). Otherwise 30% in a subscriber's first year and 15% after.
- **Google Play (US, UK, EEA, from June 30, 2026):** a 10% service fee on subscriptions plus a 5% billing fee when Google Play's billing is used, so 15% in practice. The 10% service fee also applies when users pay through an alternative biller or a web link; only the billing fee drops away. Other markets follow on later dates.
- **US iOS link-outs to web checkout** are allowed, and Apple's commission on them is still being set in court. Model the web path at a range of possible rates rather than at zero.

**Web-to-app funnel:** ad → web onboarding quiz → web paywall → download link. It moves payment off the store and lets you test onboarding without app releases, but it adds a step between the ad and the app. Check each storefront's link-out rules before building it.

## Unit economics per download

```
revenue per download = trial start rate × trial-to-paid rate × yearly price × (1 − store fee)
```

One founder's working estimate is 30% of downloads starting a trial and 30% of trials paying about $30 a year, which comes to about $2.70 per download before fees. Treat that as a starting assumption to replace with your own numbers within a few weeks of launch, not a benchmark. Revenue per download is what tells you how much you can pay per install on ads or creators.

## App Store review checklist

- [ ] Price, billing period, trial length, and "auto-renews until cancelled" shown on the paywall
- [ ] Links to Terms of Use (EULA) and Privacy Policy
- [ ] Restore Purchases
- [ ] A visible close button, no dark patterns
- [ ] Trial-ending reminder scheduled
- [ ] `paywall_viewed`, `trial_started`, and `subscription_started` events fire with the paywall variant ID

---

*Patterns adapted from Blake Anderson's ai-app-playbook (MIT, October 2026); conversion and trial-length data from RevenueCat's State of Subscription Apps 2026; fees from Google's Android Developers Blog (June 2026), Apple's Small Business Program terms, and coverage of the Epic v. Apple link-out proceedings.*
