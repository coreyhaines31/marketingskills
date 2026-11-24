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

For acceptance rules per field, cache keys, and how to treat errors versus genuine no-matches, see [enrichment-playbook.md](enrichment-playbook.md). Clay is the common way to orchestrate a waterfall across many providers. FullEnrich and similar aggregators do it as a single API call. Building it yourself means calling each provider's API in sequence.

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
- Right before upload, on every list. Re-validate within 7 days of sending if the list sat. B2B data decays steadily (vendor estimates run around 2% a month and 20–30% a year).
- Re-verify CRM contacts every quarter, and anything older than 30–60 days before using it.

Cut competitors, wrong personas, do-not-contact entries, and duplicates **before** you validate, so you don't pay credits for leads you'll drop (see [list-sizing-and-refill.md](list-sizing-and-refill.md)).

**What to do with each result**

| Result | Action |
|--------|--------|
| Valid | Send |
| Invalid, disposable, or spam trap | Suppress permanently |
| Role address (info@, hello@, sales@) | Skip by default in personal sequences. Include only on an explicit yes for a specific campaign. Local businesses that publish one as their main contact are the usual exception |
| **Catch-all (accept-all)** | Deeper pass, then the default policy below |
| Unknown | Retry once later; don't send if it's still unknown |

**Catch-all domains** accept mail for any address, so basic verification can't tell whether the person exists. They make up a large share of B2B domains (vendor estimates run 15–28%), and far more for founder and agency audiences, which are heavy on Google Workspace. In one 54-address list of that kind, 36 came back accept-all on the standard pass. The catch-all decision can change list size more than anything else.

**Default catch-all policy** (use it unless the user opts into something riskier):
1. **Keep the safest-bet results only**: valid, plus accept-all addresses that a deeper pass resolves to valid.
2. **Run the deeper pass on the accept-all results only**, not the whole list. A deeper pass uses a verifier that goes beyond the SMTP check (BounceBan, Scrubby, Truelist's Enhanced strategy, and others combine extra signals). Some verifiers only mark catch-alls "risky." In the 54-address list above, the deeper pass resolved 26 of the 36 to valid, 7 to invalid, and left 3 still accept-all. Without it, two thirds of the list would have been dropped or sent blind.
3. **Drop what is still accept-all** after the deeper pass. Send it only if the user opts in, and then only for Tier 1 accounts, from separate, lower-volume inboxes, with bounces watched closely.

With this policy, one set of campaigns across three brands had 11 bounces on about 3,700 sends (0.29%).

**Estimating validation credits.** The deeper pass costs more than a standard check (3 credits per address in one setup; check your verifier's pricing). Estimate before you run it:

```text
credits = list size × 1 (standard pass) + accept-all count × deeper-pass cost
credits per sendable lead = credits ÷ (valid + resolved-valid)
```

For the 54-address list, at 1 credit per standard check: 54 + 36 × 3 = 162 credits, of which 108 went to the deeper pass and bought 26 sendable leads, about 4 credits each. The share of accept-all results drives the cost, so estimate it from a small sample of the audience before validating a whole list. If the deeper pass costs more per resolved lead than sourcing a new one, source more instead.

**Hard limits:** keep bounces under 2% per campaign (under 1% is best in class) and pause automatically above that. See the cold-email skill's deliverability reference.

### After upload: the stuck-verification trap

A validated list can still stall in the sending tool. Uploading 70 validated leads to a sending tool with its own verification switched on put them into a pending state that never cleared, and nothing was sent.

- **Upload with the sending tool's own verification off** when the list has already been validated.
- **Check a sample in the sending tool after upload**: open a handful of leads and confirm their status is active (not pending or verifying) and that they are scheduled in the campaign.
- If leads are stuck pending, remove and re-upload them with the tool's verification off rather than waiting.

## Suppression list

Keep one suppression list, synced to every tool that sends (email tool, LinkedIn tool, dialer, CRM), and check it before every send:
- Unsubscribes and opt-outs from any channel
- Hard bounces and invalid addresses
- Current customers and open deals (outbound to them is a sales-team problem)
- Competitors and partners
- People who replied "not interested," for the cooldown period you choose
- Do-not-contact requests and data deletion requests

Key it on email, LinkedIn URL, and phone number so a person removed in one channel is removed in all of them.

**Do-not-contact list.** Competitors, agencies, and anyone who said no go on a do-not-contact list that is checked before every upload, not only before sends. Export unsubscribes from the sending tool into it on a schedule (at least before each upload), so an opt-out in one campaign or brand reaches the next list.

**Dedupe before every upload**, in this order:
1. The sending workspace (everyone already in any campaign there)
2. The blocklist and do-not-contact list
3. Prior campaigns, including finished ones
4. Any sister brand sharing the workspace or the same audience

Then keep **one contact per company per campaign**, so two people at one company don't get the same sequence on the same days.

## Provenance

Every contact carries: the source (provider or URL), the collection date, the lawful basis for EU/UK contacts, and the last verification date and result. This answers "where did you get my email?" and makes data deletion requests possible.
