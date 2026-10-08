# Sourcing, Enrichment, and Verification

How to get contacts legitimately, fill in missing data without paying twice or trusting bad data, and verify every address before it reaches a sequence.

## Sourcing without scraping LinkedIn

LinkedIn is where the people are, and scraping it is where the lawsuits are (see [compliance.md](compliance.md)). The workable pattern:

1. **Define the audience in Sales Navigator** (or LinkedIn search): titles, seniority, company size, industry, geography, recent job changes, growth. This is research, which is fine.
2. **Pull the contacts from a licensed database** using the same filters: Apollo, ZoomInfo, Clay's providers, Prospeo, and similar. They're licensed to provide the data and carry the provenance.
3. **Use LinkedIn by hand** for Tier 1 accounts: confirm the person still holds the role, read their recent posts, decide whether to connect.

Other sources that don't involve LinkedIn:

| Source | Good for | Notes |
|--------|----------|-------|
| Job boards via TheirStack or PredictLeads | Companies hiring in your function | Also reveals their tools |
| Directories and marketplaces | Niche lists: app store developers, agency directories, partner listings, software review categories | Check each site's terms; prefer official APIs or exports |
| Competitor customer pages | Logos and case studies | Public, but use them as accounts, not as a pitch ("I see you use X") |
| Google Places API | Local and SMB lists | The compliant programmatic route; see compliance.md |
| GitHub | Developer tools | See the SaaS branch reference |
| Podcast guests, conference speakers | Leaders who talk publicly | Ready-made research material too |
| AI list builders (Exa Websets, Parallel FindAll) | Niche lists from a plain-English description ("Series A fintechs that added a pricing page this year") | Precise but incomplete. In one 2026 evaluation the best tool found about a fifth of possible matches, at high precision. Use them for depth, not coverage |
| Apify actors | Structured data from sites without an API | Pick actors for public sites whose terms allow it; never for LinkedIn |
| Lookalikes | "More companies like our best customers" | Exa `find-similar`, Ocean.io, or seed-based search in your database |

## Enrichment: run providers in order

No single provider finds everyone, and the ones that find the most also return more wrong data. The standard approach is a **waterfall**: query providers one at a time and stop at the first confident result.

1. **Order providers by accuracy for your ICP, then by coverage.** Independent comparisons disagree wildly. Different 2025–26 benchmarks put the same tools anywhere from 25% to 87% find rates, and the highest finders sometimes had four times the false-positive rate. Run your own bake-off (below).
2. **Stop at the first result that passes verification.** Paying three providers for the same contact is the most common waste.
3. **Set a cost cap per contact** and log which provider filled each field.
4. **Mobile numbers are for Tier 1 only.** They're the most expensive field, and many are personal phones (see the phone rules in compliance.md). For EU and UK numbers, providers with human-verified European data tend to do better.
5. **Keep the enrichment result in your data, not just the sending tool**, so you can re-verify later and answer data subject requests.

Clay is the common way to orchestrate a waterfall across many providers. FullEnrich and similar aggregators do it as a single API call. Building it yourself means calling each provider's API in sequence.

### Provider bake-off

Before committing to a provider or an order, test on your own ICP:
1. Take 200 contacts you already know are correct (customers, recent conversations).
2. Strip the emails and phones, then run each candidate provider.
3. Score each: **found**, **correct**, **wrong** (a confident answer that was false), **cost per correct contact**.
4. Order the waterfall by fewest wrong answers first, then by cost per correct contact.

Repeat each quarter, because providers' data quality shifts.

## Verification

Verify every address before it reaches a sequence. This is the single cheapest protection for sender reputation.

**When to verify**
- When you enrich the contact.
- Again within 7 days of sending, for any list built earlier. B2B data decays steadily (vendor estimates run around 2% a month and 20–30% a year).
- Re-verify CRM contacts every quarter, and anything older than 30–60 days before using it.

**What to do with each result**

| Result | Action |
|--------|--------|
| Valid | Send |
| Invalid, disposable, or spam trap | Suppress permanently |
| Role address (info@, sales@) | Exclude from personal sequences. Fine only for local businesses that publish it as their main contact |
| **Catch-all (accept-all)** | See below |
| Unknown | Retry once later; don't send if it's still unknown |

**Catch-all domains** accept mail for any address, so basic verification can't tell whether the person exists. They make up a large share of B2B domains (vendor estimates run 15–28%). Handle them with a policy, not a guess:
1. **Resolve them** with a verifier that goes beyond the SMTP check (BounceBan, Scrubby, Truelist, and others combine extra signals). Some verifiers only mark catch-alls "risky."
2. **Send resolved-valid catch-alls from separate, lower-volume inboxes**, so a bad batch can't damage your main sending.
3. **Send unresolved catch-alls only for Tier 1 accounts**, where the account is worth the risk, and watch bounces on that inbox closely.

**Hard limits:** keep bounces under 2% per campaign (under 1% is best in class) and pause automatically above that. See the cold-email skill's deliverability reference.

## Suppression list

Keep one suppression list, synced to every tool that sends (email tool, LinkedIn tool, dialer, CRM), and check it before every send:
- Unsubscribes and opt-outs from any channel
- Hard bounces and invalid addresses
- Current customers and open deals (outbound to them is a sales-team problem)
- Competitors and partners
- People who replied "not interested," for the cooldown period you choose
- Do-not-contact requests and data deletion requests

Key it on email, LinkedIn URL, and phone number so a person removed in one channel is removed in all of them.

## Provenance

Every contact carries: the source (provider or URL), the collection date, the lawful basis for EU/UK contacts, and the last verification date and result. This answers "where did you get my email?" and makes data deletion requests possible.
