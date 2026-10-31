# Nonprofit: Teardown Pack

Load this pack for charities, advocacy groups, foundations, and membership nonprofits. Nonprofits grow through donors, not customers, and US nonprofits publish their finances every year, so a teardown can line up fundraising moves against real revenue.

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

- "Donate", "Give monthly", "Fundraise", and "Ways to give" pages, often on a `donate.` or `give.` subdomain
- Donation platforms on the donate page (Classy, Givebutter, Donorbox, Blackbaud, Fundraise Up, Bloomerang, Funraise, Every.org). `teardown.mjs stack` flags Classy, Givebutter, Donorbox, and Fundraise Up; check the donate page and its subdomain for the others
- A 501(c)(3) or EIN line in the footer, and "tax-deductible" language
- Peer-to-peer fundraising pages (`/fundraise`, personal pages under a campaign)
- `teardown.mjs detect <domain>` flags those donation platforms and nonprofit language

## What Drives Growth Here

- **Monthly donors are the base.** Recurring giving is steadier and more valuable than one-time gifts, so the monthly ask and its placement matter.
- **Campaign moments drive spikes.** Giving Tuesday, year-end, disasters, matching campaigns, and anniversaries create most one-time revenue.
- **Peer-to-peer turns supporters into fundraisers.** Events, challenges, and birthday fundraisers reach networks the organization can't reach directly.
- **Major gifts and grants dominate many budgets.** Visible marketing may be a small share of revenue. Read the financials before crediting marketing.
- **Free ad credits change the math.** Google Ad Grants gives eligible nonprofits up to $10,000 a month in search ads, with rules attached (an account-wide click-through rate of at least 5%, among others).

## Signals to Collect

| Signal | Where or how | What it shows |
|---|---|---|
| ★ IRS Form 990 revenue by year | ProPublica Nonprofit Explorer and the IRS Tax Exempt Organization Search | Contributions, program revenue, fundraising expenses, and staff pay by year: real numbers, not estimates. Small organizations file the 990-EZ or 990-N with less detail, and private foundations file the 990-PF. Filings lag the fiscal year by months |
| ★ Revenue mix | Form 990 Part VIII (statement of revenue), Schedule A (public support), and annual reports | How much comes from contributions, government grants, events, and program services. Donor names on Schedule B are not public for most charities |
| ★ Paid fundraisers and event results | Form 990 Schedule G | Professional fundraising firms they pay and what each event grossed and netted |
| ★ Campaign calendar | Wayback captures of the homepage and donate page; `teardown.mjs hero <domain>` | Giving Tuesday, year-end, and matching campaigns, dated. Each becomes a move in moves.csv |
| Donate page and default amounts | `teardown.mjs history <url>` on the donate page | Changes to suggested amounts, the monthly default, and the ask |
| Donation platform changes | `teardown.mjs stack <domain>` | When they switched platforms, which often changes conversion |
| Peer-to-peer programs | Fundraising pages, event pages, challenge sites | Supporter-led campaigns and their reach |
| Matching gift tools | Employer matching widgets (Double the Donation and similar) | Whether they capture corporate matches |
| Donor-advised fund and stock options | "Give from your DAF" buttons (such as DAFpay), stock and crypto giving pages | Whether they court larger, planned gifts online |
| Fee coverage and tribute giving | The donate form | Whether they ask donors to cover fees, and offer honor or memorial gifts |
| Google Ad Grants use | Search ads for their cause terms | Whether they use free search ads and on which topics |
| Email and SMS appeals | Subscribe under the user's real identity; log appeals | Appeal cadence, subject lines, and urgency framing |
| Charity ratings | Charity Navigator, Candid (GuideStar) profiles | Trust signals donors see, and changes in ratings |
| Corporate partners | Partner pages and cause-marketing campaigns | Sponsorship and cause-marketing revenue sources |
| Hiring | Careers pages | Development (fundraising) staffing, digital roles, major gifts officers |

## Going Inside

- Make a donation only with the user's explicit approval and budget, under their real identity. Then log the thank-you sequence, receipts, and the next ask.
- Subscribe to emails and SMS to record appeal cadence, especially around year-end and Giving Tuesday.
- Start a peer-to-peer fundraising page only if the user will actually fundraise. Don't create fake campaigns.

## Rules That Limit Copying

- **Charitable solicitation registration:** many US states require registration before asking residents for donations. Check with counsel before running a national campaign.
- **IRS rules** govern donation receipts, quid pro quo disclosures, and political activity limits for 501(c)(3) organizations.
- **Google Ad Grants policies** set eligibility (government entities, hospitals, and schools are excluded), account structure, and quality requirements. Copying a paid-search structure into a Grants account can break them.
- **Cause marketing laws:** some states regulate commercial co-ventures, where a business promotes that a purchase benefits a charity.
- **Email and SMS consent rules** (CAN-SPAM, TCPA) apply to nonprofits too.

## Plays That Usually Transfer

| Play | Run it with |
|---|---|
| A monthly giving ask as the default on the donate page | **cro**, **offers** |
| A year-end and Giving Tuesday campaign sequence | **emails**, **launch** |
| Peer-to-peer fundraising for events and birthdays | **referrals**, **events** |
| Matching gift campaigns with a deadline | **offers** |
| Content that ranks for cause and issue searches | **content-strategy**, **seo-audit** |
| Donor thank-you and retention sequences | **emails**, **churn-prevention** |

## Metrics to Ask About

- **Donor retention rate:** share of last year's donors who gave again
- **Recurring donors** and monthly recurring revenue
- **Average gift** and gifts per donor
- **Donate page conversion rate**
- **Cost to raise a dollar:** fundraising expense divided by contributions
- **Peer-to-peer reach:** donors per fundraiser
