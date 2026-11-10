# Fitness and Wellness: Teardown Pack

Load this pack when the target is a gym, boutique studio, franchised fitness brand, or a wellness app, coach, or program. Growth here is an intro offer that turns into a membership, kept alive by community and habit, and limited by how easily members can cancel.

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

- A class schedule, "book a class" or "first class free" CTA, and an intro offer ("2 weeks for $49", "first month $1").
- Booking and membership platforms in page scripts or links: Mindbody, Mariana Tek, Zen Planner, Glofox, ABC Fitness, Wellhub, and class aggregators such as ClassPass. Check `teardown.mjs stack <domain>` and outbound links.
- A location finder with a page per studio, and a `/franchise` page for franchised brands.
- For apps and coaching: App Store and Google Play badges, a quiz-based onboarding funnel, and a trial-to-subscription paywall.
- `teardown.mjs detect <domain>` flags these with schema types like `ExerciseGym`, `HealthClub`, and `SportsActivityLocation`.

## What Drives Growth Here

- **The intro offer is the funnel.** Studios live on intro-offer volume and the share that converts to a membership within the offer window. Price, length, and the follow-up after class one decide everything.
- **New locations add growth in steps.** For franchised fitness, openings (and presales before a studio opens) are the curve. Presale campaigns sell founding memberships months before the doors open.
- **Seasonality is extreme.** January, back-to-school, and pre-summer drive sign-ups. Spending and offers spike on those dates.
- **Retention is community.** Attendance in the first 30 to 60 days predicts who stays. Challenges, leaderboards, and instructor followings are retention tools that also drive referrals.
- **Aggregators cut both ways.** ClassPass and Wellhub bring new visitors and fill empty spots, but they can train customers not to buy memberships. Watch how a studio uses them.

## Signals to Collect

| Signal | Where or how | What it shows |
|---|---|---|
| ★ Franchise disclosure documents | FDDs from state franchise databases (California, Wisconsin, Minnesota, and others) | Item 19 financial performance (if included), unit openings, closures, and transfers by year (Item 20), fees, and required marketing spend. Real numbers, years back |
| Location count and presales | Locator captures over time, "coming soon" and presale pages | Opening pace; each presale launch becomes a move |
| Intro offer history | `teardown.mjs history <url>` on the pricing or intro page, and archived homepages with `teardown.mjs hero <domain>` | Offer price and length changes by date; each change becomes a move |
| Membership pricing | Pricing pages, and per-location pricing where it varies | Price tiers, class packs vs unlimited, and local price testing |
| ★ Cancellation terms | Membership agreement and FAQ pages, archived | Notice periods, fees, and in-person or online cancellation, which affect complaints and churn |
| Aggregator presence | ClassPass and Wellhub listings: which locations, which classes, and credit prices | How much they rely on aggregators and in which markets |
| Challenge calendar | Social posts, event pages, and emails for six-week or 30-day challenges | Their retention and re-engagement moments, dated |
| Google Business Profile reviews per studio | Official Places API or manual reads | Review velocity by location and instructor mentions; spikes become moves |
| Instructor and creator presence | Instructors' social accounts and class follow-ons | Whether growth depends on star instructors |
| Corporate wellness deals | Partner pages and Wellhub or employer program listings | Employer-paid distribution |
| App store data (apps) | Store page history and ratings (see **aso**) | Feature launches, paywall changes, and rating trends |
| Paid social offers | `teardown.mjs sc-ads <brand> --domain <domain>` and ad libraries, by season | The intro offers they advertise and when |

## Going Inside

With approval, under the user's real identity, and with a budget the user sets:
- **Book a real intro class** only if the user or their team will attend. A no-show takes a spot from a real customer. Record the booking flow, the reminder messages, the in-studio upsell after class, and the follow-up over two weeks.
- **Intro offer to membership:** log every email, text, and call during the intro window, and the membership pitch.
- **Cancellation test:** if the user bought an intro membership, cancel it and record each step, the save offer, and whether online cancellation is available.
- **Apps:** run the onboarding quiz, screenshot the paywall and trial terms, and log trial emails. Cancel before renewal unless the user approves keeping it.
- Never take class photos of members, and don't recruit instructors or members on the premises.

## Rules That Limit Copying

- **Automatic renewal laws:** the FTC's 2024 click-to-cancel rule was vacated by the Eighth Circuit in July 2025, but ROSCA, the FTC's earlier negative option rule, and state laws still apply. California's amended automatic renewal law (effective July 1, 2025) requires express consent and cancellation in the same medium the customer signed up in. Copy the offer, not a hard-to-cancel flow.
- **Health club laws:** many states have health club or health studio statutes covering contract length, cooling-off periods, and cancellation rights (for example, after moving or disability). Check each state before copying contract terms.
- **Health claims:** weight-loss and health outcome claims need substantiation under FTC law, and before-and-after images are restricted by Meta and TikTok ad policies.
- **Health data in apps:** wellness apps that collect health data can fall under the FTC's Health Breach Notification Rule (updated 2024), which limits sharing data through ad pixels.
- **Franchise sales:** the FTC Franchise Rule and state registration laws govern franchise marketing.

## Plays That Usually Transfer

| Play | Run it with |
|---|---|
| Intro offer test (price, length, first-class format) | **offers**, **pricing** |
| Intro-window follow-up sequence by email and text | **emails**, **sms** |
| Presale campaign for a new location | **launch**, **ads** |
| Challenges that drive attendance and referrals | **referrals**, **community-marketing** |
| Location page family with schedules and reviews | **programmatic-seo**, **schema** |
| Save offers and pause options in a compliant cancel flow | **churn-prevention** |
| App quiz onboarding and paywall | **onboarding**, **paywalls** |

## Metrics to Ask About

- **Intro offer conversion:** share of intro buyers who become members within the window.
- **Cost per intro sale and per member:** by channel.
- **First-30-day attendance:** visits per new member, the leading churn signal.
- **Monthly churn and average membership length.**
- **Aggregator share:** share of visits and revenue from ClassPass, Wellhub, and similar.
- **Revenue per location and presale count at opening.**
- **Trial to paid (apps):** share of trials that convert, and month-two retention.
