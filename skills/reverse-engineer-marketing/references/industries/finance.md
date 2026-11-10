# Finance: Teardown Pack

Load this pack for fintech apps, banks and credit unions, lenders, card issuers, insurers, and wealth or brokerage firms. Growth in finance runs on trust, regulated offers, and paid distribution through comparison sites, and regulators publish more hard data about these companies than about almost any other industry.

Insurance carriers and agencies should also load [insurance.md](insurance.md).

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

- Footer disclosures: "Member FDIC", "Equal Housing Lender", "NMLS ID", "Securities offered through", "Member SIPC", "Banking services provided by [partner bank]"
- A partner bank named in the footer means a fintech on a banking-as-a-service sponsor bank. Growth then depends on what the sponsor allows
- Pages for rates, APY, APR, "check your rate", "get a quote", and calculators
- Identity, verification, and account-linking tools in the sign-up flow (Plaid, Socure, Persona, Alloy, Onfido). They usually load on the sign-up page, not the homepage, so check that page's source; `teardown.mjs stack` doesn't track them
- App store listings in the Finance category, often with a web app that only handles sign-up
- `teardown.mjs detect <domain>` flags the disclosure language (Member FDIC, NMLS, APY, SIPC)

## What Drives Growth Here

- **Offers move the curve.** A higher APY, a sign-up bonus, a 0% intro APR, or a cash-back rate often explains a growth jump better than any content or ad change. Date every offer change.
- **Comparison and affiliate sites are the main paid channel.** NerdWallet, Bankrate, Credit Karma, The Points Guy, LendingTree, Policygenius and similar sites rank for the high-intent searches and get paid per approved account. Placement there is bought, negotiated, and rotated.
- **Search is YMYL ("your money or your life").** Google holds finance content to a higher bar, so credentialed authors, reviewers, and editorial policies matter more than volume.
- **Referral programs pay cash.** "Give $50, get $50" programs are common and often drive a large share of new accounts for consumer fintechs.
- **Approval rates gate the funnel.** For lending and cards, the marketing only works if underwriting approves enough applicants, so the pre-qualification step is part of the growth engine.

## Signals to Collect

| Signal | Where or how | What it shows |
|---|---|---|
| ★ Complaint volume by month | `teardown.mjs cfpb <company>` (CFPB consumer complaint database). It lists the names the database uses; rerun with `--exact "Name"` if the top match is wrong | A growth proxy (complaints rise with customers) and a weakness map by product and issue. Spikes become moves in moves.csv |
| ★ Bank deposits and assets by quarter | `teardown.mjs fdic <bank>` (FDIC BankFind, FDIC-insured banks only); NCUA quarterly call report data for credit unions | Real growth numbers for banks and credit unions, not estimates. For a fintech, check the sponsor bank |
| ★ SEC filings | `teardown.mjs filings <company>` | For public companies: customer or account counts, marketing spend, CAC and payback language, funded accounts. S-1s often describe the growth playbook in plain words. Form D filings date private rounds |
| ★ Sponsor bank disclosures | The fintech's footer, terms, and deposit agreement, then `teardown.mjs fdic <partner bank>` | Which bank holds the deposits, when they added or switched banks, and the sponsor bank's own deposit growth |
| Adviser and broker records | SEC Investment Adviser Public Disclosure (Form ADV) and FINRA BrokerCheck | Assets under management, client counts, and registration dates for advisers and broker-dealers |
| ★ Sign-up and referral bonus history | Bonus-tracking blogs such as Doctor of Credit, plus Wayback captures of the promo page | Every bonus launch, increase, and end, dated. Each change becomes a move |
| Rate and APY history | Archived captures of the rates page, read by hand (`teardown.mjs history <url>` catches currency amounts, not percentages like APY) | When they raised or cut rates relative to competitors |
| Comparison site placement | Search "best [product]" on the major comparison sites; Wayback of those list pages | Which lists they're on, their position over time, and when they entered or dropped off |
| Affiliate program terms | Their partner page and affiliate network listings | Payout model and which partners they recruit |
| Credentialed content | Author and reviewer bylines, editorial policy pages | Whether they invest in YMYL trust signals |
| Calculators and tools | `teardown.mjs site` for `/calculator` or `/tools` page families | Free tools that capture search demand for rates and payments |
| App store rank and reviews | App Store and Google Play history | Consumer adoption and review themes |
| Regulatory actions | CFPB enforcement actions, state regulator orders, SEC and FINRA actions | Events that stalled growth, or practices they had to stop |
| Licensing footprint | NMLS Consumer Access for lenders; state insurance department lookups | Which states they can sell in, and when each license was added |

## Going Inside

- **Get the user's explicit approval before any application.** Opening a deposit account is usually a soft check, but a credit card, loan, or line of credit application can mean a hard credit pull on the user. Explain the consequences, and prefer pre-qualification flows that state "won't affect your credit score".
- Never apply for credit, insurance, or an account in anyone else's name. Never enter false income, employment, or identity details. That's fraud, not research.
- Screenshot the pre-qualification flow, the disclosures shown at each step, and how the offer is presented (rate ranges, "as low as" language, terms).
- Log the onboarding emails and the referral program prompt: when they ask you to refer, and the reward.
- For insurance, request a quote under the user's real details only if the user approves sharing them. Quote forms on comparison and lead-generation sites often pass details to several carriers and agents, so read the consent text first.

## Rules That Limit Copying

- **Truth in Lending Act (Regulation Z)** and **Truth in Savings Act (Regulation DD):** trigger terms in ads (a rate, a payment amount) require specific disclosures. Copying "as low as 4.99%" means copying the disclosure duty.
- **UDAAP:** the CFPB polices unfair, deceptive, or abusive acts. Bonus terms and "free" claims are frequent targets.
- **FINRA Rule 2210 and SEC marketing rules** govern broker-dealer and adviser communications, including testimonials and performance claims.
- **State insurance regulations** and licensing limit who can quote and sell in each state.
- **Platform policies:** Google Ads requires financial services verification in many countries and restricts some products (for example, short-term loans). Meta treats credit, insurance, banking, investment, and payment ads as the Financial Products and Services special ad category (it replaced the Credit category in January 2025), which limits age, gender, and location targeting and lookalike audiences.
- **Fair lending rules** (ECOA, and the Fair Housing Act for mortgage and housing-related credit) limit audience targeting for credit ads.
- Check with counsel before copying an offer, a claim, or an ad structure in a regulated product.

## Plays That Usually Transfer

| Play | Run it with |
|---|---|
| A two-sided cash referral program with clear terms | **referrals** |
| Calculators for rates, payments, and savings that rank for intent searches | **free-tools**, **programmatic-seo** |
| A pre-qualification step that shows an offer before the full application | **signup**, **cro** |
| Getting onto comparison and "best X" lists | **link-building**, **public-relations** |
| Credentialed, reviewed content for YMYL searches | **content-strategy**, **seo-audit** |
| A time-limited bonus or rate promotion with a clear end date | **offers**, **launch** |
| Lifecycle emails that move a new account to first deposit or first use | **emails**, **onboarding** |

## Metrics to Ask About

- **Funded accounts:** accounts with money in them, not sign-ups
- **Approval rate:** share of applications approved
- **Cost per funded account** and cost per approved application
- **Deposits per account** or balances per customer
- **Activation:** first deposit, first transaction, or direct deposit set up
- **Referral share:** share of new accounts from the referral program
- **Complaint rate:** complaints per thousand customers over time
