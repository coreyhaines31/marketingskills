# Insurance: Teardown Pack

Load this pack when the target sells insurance: carriers, managing general agents (MGAs), insurtechs, and independent or captive agencies, across auto, home, renters, life, health, Medicare, pet, and commercial lines. Growth here is a quote funnel bought through paid search, aggregators, and agents, and every word of it is regulated state by state.

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

- "Get a quote" as the main CTA, a ZIP code field on the homepage, and quote flows on a `quote.` or `get.` subdomain (`teardown.mjs subdomains <domain>`).
- Licensing disclosures in the footer: state license numbers, "licensed in all 50 states", or "underwritten by [carrier]". An "underwritten by" line means an MGA or insurtech fronted by a carrier.
- Agent locator pages (`/agents/<state>/<city>`), typical of captive carriers and agency networks.
- Lead and call-tracking scripts (`teardown.mjs stack <domain>`, `teardown.mjs phones <url>`), and TCPA consent text under the quote form.
- `teardown.mjs detect <domain>` flags quote CTAs and the `InsuranceAgency` schema type.
- **Sub-type:** a single carrier name and a claims page means a carrier; "compare quotes from 20+ carriers" means an agency or aggregator; Medicare plan pages and a TPMO disclaimer mean a Medicare marketer.

## What Drives Growth Here

- **The quote funnel is the business.** Visitors to quote starts to bound policies, with the price shown early or late. Small changes to the number of questions and the order they come in move growth more than brand work.
- **Paid search and aggregators buy most demand.** Auto, home, life, and Medicare terms are among the most expensive keywords in search. Many carriers also buy clicks, leads, and calls from comparison sites and lead networks.
- **Rate and underwriting decide growth.** A carrier can grow fast simply because its rates became competitive in a state, or stall because it pulled back. Marketing spend follows approved rates.
- **Distribution mix matters:** direct online, captive agents, independent agents, embedded partners (insurance offered inside a car purchase, a mortgage, a rental app), and affinity groups each have their own engine.
- **Retention compounds:** policies renew every six or twelve months, so bundling (home plus auto) and renewal rate are growth levers.

## Signals to Collect

| Signal | Where or how | What it shows |
|---|---|---|
| ★ Rate filings | SERFF Filing Access (the NAIC's public portal, in participating states) and state insurance department filing databases | Approved rate changes by state and line, with dates. A rate cut often explains a growth spike; each filing becomes a move |
| ★ State licenses and expansion | State department of insurance license lookups, and the NAIC's company search tools | Which states they're licensed in and when they entered each one |
| Financial statements | Statutory filings summarized by state regulators and the NAIC, and `teardown.mjs filings <company>` for public carriers | Written premium growth by state and line, the real growth curve |
| Paid search presence | Search ads for "[line] insurance", "[line] insurance quotes", and "cheap [line] insurance" in key states | Where and how hard they buy demand; ad copy and the landing page per line |
| ★ Aggregator and comparison placement | Comparison sites and "best [line] insurance" lists over time, with Wayback | Paid and editorial placement on the sites that sell leads and clicks |
| Quote flow length | Count the questions and steps to a price on each line's quote flow | How much friction they trade for underwriting data |
| Embedded partnerships | Partner pages, press, and checkout flows of partners (auto dealers, lenders, rental platforms) | Distribution through other companies' customers; each partner launch becomes a move |
| Agent network size | Agent locator counts over time from archived captures | Captive or network growth by region |
| Complaint data | State department complaint ratios and the NAIC Consumer Insurance Search | Service problems that precede churn, by company and line |
| ★ Medicare marketing calendar | Ad starts and landing pages around the Annual Enrollment Period (Oct 15 to Dec 7) | How a Medicare marketer concentrates spend, and its call-center capacity |
| TV and podcast ads | Podcast-ad search from the hidden-signals reference, and TV ad trackers if the user has one | Brand spend that drives branded search |
| Hiring | Licensed agent and sales center job posts by location | Call center scale-up before a push, dated |

## Going Inside

With approval, under the user's real identity:
- **Run the quote flow** to the price screen without binding a policy. Record the questions, their order, when they ask for contact details, and when the price appears.
- **Know the consequences first.** Quotes can trigger credit-based insurance score checks and calls from licensed agents. Tell the user before starting, and only enter the user's own true information. Never enter made-up drivers, homes, or health details: false information in an insurance application can be fraud.
- **Log the follow-up:** calls, texts, and emails after a quote, their timing, and whether a human agent calls.
- **Comparison sites:** submitting a form there sells the user's details to several companies. Only do it with explicit approval, and note how many companies contact the user.
- Never bind a policy, start a claim, or speak to agents under a false pretense.

## Rules That Limit Copying

- **State regulation:** insurance is regulated by each state's insurance department. Selling, soliciting, or negotiating insurance requires a producer license in that state, and advertising follows state unfair trade practices laws based on NAIC models.
- **Anti-rebating laws:** many states restrict giving gifts or incentives to buy insurance, though NAIC model changes in 2020 loosened rules on value-added services. Referral rewards and sign-up bonuses that work elsewhere may be illegal here; check with counsel.
- **Medicare:** CMS rules govern Medicare Advantage and Part D marketing, including required third-party marketing organization (TPMO) disclaimers and review of materials.
- **TCPA:** calls and texts to leads need prior express consent, and written consent for marketing with automated systems. The FCC's one-to-one consent rule was vacated by the Eleventh Circuit in January 2025, but lead buyers still face TCPA suits over weak consent. Copy the consent flow, never a purchased lead list.
- **Price claims:** "save up to $X" claims need substantiation under state rules and FTC law.

## Plays That Usually Transfer

| Play | Run it with |
|---|---|
| Shorter quote flow with the price shown earlier | **cro**, **signup** |
| State and line landing pages with real rate and coverage content | **programmatic-seo**, **seo-audit** |
| Quote abandonment follow-up with compliant consent | **emails**, **sms** |
| Embedded partnerships with companies that already own the moment of need | **co-marketing** |
| Comparison and "best [line] insurance" placement | **competitors**, **public-relations** |
| Bundling offer at quote and renewal | **offers**, **pricing** |
| Calculators for coverage amounts and costs | **free-tools** |

## Metrics to Ask About

- **Quote start rate and quote completion rate:** visitors who start a quote, and starts that reach a price.
- **Bind rate:** quotes that become policies.
- **Cost per bound policy:** marketing spend divided by policies bound, by channel.
- **Written premium growth:** by state and line.
- **Retention and renewal rate:** policies renewed at term.
- **Policies per household:** bundling depth.
- **Loss ratio by channel:** whether a channel brings profitable risk, not just volume.
