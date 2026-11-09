# Playbook Template

The teardown's main deliverable, `teardowns/<target>/playbook.md`. Quick mode uses the same sections, trimmed: five plays, headline findings only, no content section.

---

```markdown
# [Target]: How It Grew, [Month Year] to [Month Year]

For [user's company], [date]. Built from public evidence; no affiliation with [Target].
Labels: Observed (linked evidence), Inferred (reasoned from evidence), Not found.

## In Short

- **Curve:** [~X → ~Y monthly visits, vendor, pull date]. Inflection: [month(s)].
- **Lined up with growth:** [top 1-3 clusters, one line each, with lift]
- **Biggest gap for you:** [one line]
- **Start this week:** [play #1 in one line]

## The Curve and the Moves

[Chart or month-by-month table of the curve with each move pinned to its month]

| Date | Channel | Move | Reach | Lift (visits / brand) | Label |
|---|---|---|---|---|---|

## The Funnel

| Stage | What [Target] does | Label + link |
|---|---|---|
| Acquisition | [search families, AI answers, paid networks, social, PR] | |
| Activation | [sign-up method, first action, time to first result] | |
| Revenue | [plans, trial rule, pricing changes and dates] | |
| Referral | [badges, shared outputs, invites, affiliate program] | |
| Retention signals | [lifecycle tools, changelog cadence] | |
| Hiring | [channels being scaled] | |

## Inside the Product

| Step | What we saw | Screenshot |
|---|---|---|
| Sign-up | | `inside/screens/01-...png` |
| First result | [minutes, steps] | |
| Emails | [n emails in 30 days; the day-by-day pattern] | `inside/emails.csv` |
| Upgrade wall | | |
| Cancel flow | [save offers] | |
| Sales | [booking tool, response time, follow-up cadence] | |
| Chat probe | [their answer to "how are you different from us?", verbatim] | |

## What the Team Says

| Said on | Who | Claim (reported) | About when | Matches the data? | Link |
|---|---|---|---|---|---|

## Hidden Signals

- **Infrastructure:** [mail tools, verifications, new subdomains with dates]
- **Positioning shifts:** [headline changes by month]
- **Page rollout:** [sitemap growth and family first-seen dates]
- **Paid promotion:** [sponsorships, affiliates, coupons, events]
- **Counters:** [review spikes, marketplace listings, community size]

## Content

### [Channel]
- **Sample:** [n posts, date range]
- **What the winners share:** [counted traits, top third vs bottom third]
- **House style:** [colors with hex, type, templates]
- **Formulas:** [fill-in templates with one real example each]
- **Contact sheet:** [link]

## Your Gap

| Funnel stage | [Target] | You | Gap |
|---|---|---|---|

[Note whether the comparison is estimate vs estimate or uses your own data.]

## Plays

### 1. [Play name]
- **Evidence:** [Observed/Inferred, links; before or after the inflection; lift]
- **Your gap:** [from the gap table]
- **Run it with:** [skill] · **Keep it going with:** [loop, or "one-off"]
- **Effort:** [a day / a week / a quarter] · **First result:** [time] · **Watch:** [metric] · **Cost to try:** [$]
- **Prompt:**
  > Use the [skill] skill. [Evidence in one sentence.] [The user's version, concrete.] [Formula or house style, for content plays.] [Metric and when to check it.]

## Plays to Skip

- **[Play]:** [why: weak evidence, or it depended on something you don't have]

## 14-Day Start

| Day | Do | Skill |
|---|---|---|
| 1 | | |
| 14 | Check [metric] | |

## Method Notes

- **Sources and pull dates:**
- **Blocked or unavailable:**
- **Images not read:**
- **Accounts created and demos booked:** [with dates, under whose name]
- **Inferred claims:**
- **Data cost:** [total, and per stage]
```

---

## Watch Report Template

`teardowns/<target>/watch-<YYYY-MM>.md`:

```markdown
# [Target]: New Moves, [Month Year]

Compared with the log from [previous date].

| Date | Channel | Move | Label + link | Changes a play? | Hand to |
|---|---|---|---|---|---|

[Or: "No new moves this month."]
```

## Weak vs Strong Plays

| Weak | Strong |
|---|---|
| "Post more on LinkedIn" | "Use the social skill: post your weekly signup number every Monday as a one-number card, the format behind 6 of [Target]'s top 8 LinkedIn posts" |
| "Do SEO" | "Use the programmatic-seo skill: build `/templates/[use-case]` pages, the family behind ~41% of [Target]'s non-brand traffic" |
| "Make it viral" | "Use the referrals skill: add a removable 'Made with [Product]' link on free-plan outputs, pointing to a sign-up page that opens the same template" |
