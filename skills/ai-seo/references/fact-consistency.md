# Fact Consistency: Do Your Own Sources Agree?

[Answer accuracy](answer-accuracy.md) starts from what an assistant said and traces it back. This check starts from your side. When two of your own pages state a fact differently, an assistant can quote either one, and so can the chat or support bot on your own site. Fix those conflicts first and a whole class of "false" and "stale" verdicts disappears before you run a single prompt.

It is also how you build the first claims ledger, the list the claim-drift loop in **marketing-loops** checks each product change against.

## When to run it

- Before the first answer-accuracy audit, so its fixes don't fight each other
- After a pricing change, plan rename, rebrand, or retired feature
- Before you launch or retrain an AI agent that answers from your site or docs (site chat, help-center bot, in-app assistant)
- When sales hears a price, limit, or term from prospects that nobody recognizes

## 1. Pick the facts

Start with 10–20 facts that change a buying decision. Most of them sit in these families:

| Family | Examples |
|---|---|
| Price | Price per plan, billing unit (per seat, per workspace, usage), monthly vs. annual, currency |
| Trial and free tier | Trial or pilot length, what it includes, whether a card is needed, free-plan limits |
| Plans | Plan names, which features sit in which plan, usage limits, overage |
| Integrations | The full list, and which ones are native, partner-built, or through a third-party connector |
| Security and compliance | Certifications and their type (SOC 2 Type I vs. Type II), SSO and which plan has it, data residency, DPA |
| Contract terms | Cancellation, notice period, refunds, auto-renewal, minimum term |
| Setup | Implementation time, what the customer has to do, what support covers |

## 2. List every surface that states them

- **Site pages**: pricing, plan comparison, FAQ, feature and integration pages, security or trust page, comparison and alternative pages, ad landing pages
- **Docs and legal**: help center, API docs, changelog, terms, order form template, DPA
- **Old content**: blog posts, launch announcements, and webinar pages that mention a price or limit
- **Machine-readable copies**: Product/Offer JSON-LD (see **schema**), `llms.txt` or a pricing markdown file, an OKF bundle (see [okf.md](okf.md))
- **AI surfaces you run**: site chat, help-center bot, in-app assistant, any public agent or MCP endpoint
- **Profiles**: G2, Capterra, app marketplaces, Crunchbase, LinkedIn (see [positioning-and-consensus.md](positioning-and-consensus.md))

Search your own domain for each fact's keywords (`site:yourdomain.com "free trial"`, plus your site search), since the stale copy is usually on a page nobody thinks of as a pricing page.

## 3. Quote, don't paraphrase

For each fact on each surface, record the exact sentence, the URL, and the date you read it. A paraphrase hides the difference: "from $49" and "$49 per seat, billed annually" summarize to the same thing and mean different prices.

Read the served HTML text, not only the rendered page. A price that exists only in an image, a calculator, or a script is a finding in itself (see [agent-readiness.md](agent-readiness.md)). If a surface should state a fact and doesn't, record "not stated." Omissions are findings too.

## 4. Compare and classify

| Type | What it looks like |
|---|---|
| **Conflict** | Two values for one fact: a 14-day trial on the pricing page, 30 days in the FAQ |
| **Stale** | An old value left behind: a retired plan name in a help article |
| **Scope drift** | Same number, different condition: per seat vs. per workspace, monthly vs. annual billing, "SSO" with no plan named |
| **Omission** | A list that drops items: the integrations page lists five CRMs, the docs list four |
| **Absolute vs. qualified** | Marketing says "cancel anytime," the terms require 30 days' notice |
| **Unsupported** | A claim no source of truth backs: a certification on a landing page but not on the trust page |
| **Machine vs. human** | The JSON-LD or `llms.txt` price differs from the visible price |

## 5. Name a source of truth and an owner

Marketing copy is a copy of a fact, not its source. For each fact, write down where the real value lives and who can change it:

| Fact | Usual source of truth | Usual owner |
|---|---|---|
| Price, billing unit, limits | Billing system or pricing config | Product or finance |
| Contract terms | Terms and order form | Legal |
| Certifications, SSO, data residency | Trust page backed by the audit report | Security |
| Features per plan, integrations | Product and docs | Product |

Then keep the result as a claims ledger:

| Fact | Value | Source of truth | Owner | Surfaces that state it | Status |
|---|---|---|---|---|---|
| Trial length | 14 days, no card | Billing config | Product | pricing, FAQ, help article, site chat | FAQ says 30 days: fix |

## 6. Ask your own AI surfaces

Comparing pages with each other catches conflicts. It doesn't catch a fact that never got into the bot's knowledge, because nothing disagrees with it. So ask each AI surface you run the buyer's questions directly, and log the answers with the verdicts in [answer-accuracy.md](answer-accuracy.md).

- **Ask list questions and yes/no questions.** "Which CRMs do you integrate with?" can drop an item that "Do you integrate with [a specific CRM]?" gets right. Retrieval often answers the narrow question and misses the item in the broad one.
- **Ask for the qualifier.** "Can I cancel anytime? Is there a notice period?" shows whether the bot carries the terms or only the marketing line.
- **Ask how buyers phrase it.** "Is there a pilot?", "Can I try it first?", and "Do you have a free trial?" may pull different pages.
- **Run each question several times**, and again after every re-index. One clean answer proves little.

## 7. Fix in order

Rate each mismatch with the severity scale in [answer-accuracy.md](answer-accuracy.md), then fix from the source outward:

1. **Confirm the source of truth.** If legal and billing disagree, that is a decision for them, not a copy edit.
2. **Pages buyers and crawlers hit most**: pricing, plan comparison, FAQ, security page.
3. **Machine-readable copies**: structured data, `llms.txt`, feeds.
4. **Old content**: update the fact with a date, or redirect the page if it has no other job.
5. **AI surfaces you run**: re-sync or re-index, then ask the same questions again.
6. **Profiles and directories**, then factual correction requests to third parties.

Price, contract, and compliance wording goes to the owner for sign-off before it ships. Don't fix a conflict by deleting the fact everywhere. A missing fact gets filled from someone else's page, often an older one.

## Report

1. The facts checked, the surfaces read, and the capture date
2. Mismatches by type and severity, each with both quotes and URLs
3. The claims ledger, with a source of truth and owner per fact
4. AI-surface answers that disagreed with the ledger, with the question wording
5. The fix list in order, with the exact replacement sentence for each page
6. What couldn't be checked (gated pages, PDFs behind a form, a bot you can't query)

## Example

Northwind Forms (a fictional form builder) checks four facts across its site and support bot:

| Fact | Pricing page | Elsewhere on the site | Support bot | Type |
|---|---|---|---|---|
| Trial | "14-day free trial" | FAQ: "Try free for 30 days" | "30 days" | Conflict; the bot follows the FAQ |
| SSO | Business plan only | Security page: "SSO on all paid plans" | "Yes" (no plan named) | Conflict and scope drift |
| Integrations | Lists 6 | Help center lists 5, no spreadsheet sync | The list question gets 5; asked about spreadsheet sync directly, it says yes | Omission |
| Cancellation | "Cancel anytime" | Terms: 30 days' notice on annual plans | "Cancel anytime" | Absolute vs. qualified |

Billing config says 14 days, so the FAQ changes first and the bot is re-indexed and asked again. The SSO line on the security page goes to the security owner. The cancellation copy goes to legal with the terms quoted next to it.
