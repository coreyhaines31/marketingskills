# Prospecting Compliance Reference

The legal and platform-ToS constraints that apply to prospect list building. Read first, every engagement.

> Operational guidance, not legal advice. For high-volume programs or programs touching EU/UK residents, run your setup past a privacy attorney.

---

## United States — CAN-SPAM (downstream)

CAN-SPAM regulates the cold email **send**, not the list build. But the list build matters because:

- You must be able to identify the source of every email address you contact (required if challenged)
- The "from" line and email content rules apply at send time — but you can't lie about how you got the contact
- Opt-out requests must be honored within 10 business days and tracked
- Every commercial email needs a working opt-out and the sender's valid physical postal address, so plan both before the first send

**For prospecting specifically**: capture and retain the source URL + date for every contact you add to a list. CAN-SPAM doesn't require it explicitly, but defending your sender practices does.

---

## EU / UK — GDPR

The strictest applicable framework. Triggers when:

- Your prospect resides in EU/UK
- You're processing personal data (any identifiable info, including business emails tied to a named person)

### Lawful bases for cold B2B outreach

You have three credible options:

1. **Legitimate interest** (most common for B2B). Requires:
   - The contact is in a business role likely to be interested in your offer
   - The data was collected from a public, business-context source
   - You provide a clear opt-out
   - You can articulate the legitimate interest test in writing

2. **Consent** — typically not feasible for cold outreach (you don't have consent before first contact)

3. **Existing customer relationship** — only applies to current customers, not prospects

### What you must do

- Capture **source + date + lawful basis** for every contact
- Honor data subject access requests (DSARs) — you must be able to disclose, correct, or delete on request
- Include a privacy notice / opt-out in the first outreach
- Don't store personal data longer than necessary for the legitimate interest

### EU specifics

- **Commercial interest counts.** The CJEU's KNLTB ruling (October 2024) confirmed that a purely commercial interest can be a legitimate interest. You still need the balancing test in writing (a legitimate interests assessment).
- **Tell people where you got their data.** When the data didn't come from the person directly (Article 14), say so within a month, and at the latest in the first message. One line works: "I found your email on [source]; reply 'remove' and I'll delete it."
- **Germany is different.** Germany's unfair competition law (UWG §7) requires prior consent for advertising email, B2B included, and competitors enforce it through lawsuits. Exclude German contacts from cold email; use LinkedIn or phone (B2B calls need presumed consent, meaning a concrete reason to believe they'd welcome the call).
- **National rules sit on top of GDPR.** Several countries apply stricter ePrivacy rules to email. When a campaign targets one EU country heavily, check that country's rules.

### What disqualifies a list

- Bulk-scraped LinkedIn data — explicit ToS violation + GDPR risk
- Email addresses purchased from a list broker without source provenance
- "Anyone @ this domain" guessed emails sent without verification (multiplies risk + bounces)

---

## UK — PECR

PECR sets the email rules on top of UK GDPR:

- **Corporate subscribers** (limited companies, LLPs, public bodies) can be cold-emailed at their work address without consent, as long as you identify yourself and offer an opt-out.
- **Sole traders and partnerships** are treated like individuals and need consent. Many small agencies and consultancies fall in this group, so check the entity type before sending.
- **Fines rose sharply.** The Data (Use and Access) Act 2025 raised the PECR maximum from £500,000 to £17.5 million or 4% of global turnover, and wrote direct marketing into UK GDPR as a recognised legitimate interest.

---

## Australia — Spam Act

Australia is consent-based. Inferred consent can come from a conspicuously published business address with no "no unsolicited messages" notice, where the message relates to the person's role. Address-harvesting software is prohibited outright. Every message needs sender identification and a working unsubscribe.

---

## Canada — CASL

Stricter than CAN-SPAM. Cold B2B outreach requires:

- **Express consent** (explicit opt-in) — typically not present for cold prospecting
- **OR implied consent** — existing business relationship within 24 months, OR business address publicly published on the company's own site for the purpose of receiving such communications

**Practical implication for Canadian prospects**: relying on the publicly-published-address exception is the most defensible cold prospecting basis in Canada. You must include sender identification, mailing address, and an unsubscribe mechanism in every message.

---

## Platform Terms of Service

### LinkedIn

- **Sales Navigator** as a research tool: fine. Use it to define account and persona filters, then pull contacts from a licensed database. Sales Navigator has no native export, caps searches at 2,500 results, and syncs to a CRM only on Advanced plans.
- **Scraping LinkedIn at any scale**: explicit ToS violation. Banned accounts are permanent. Don't.
- **LinkedIn enforces against vendors as well as users.** It sued Proxycurl (which shut down in July 2025 under a permanent injunction) and ProAPIs (October 2025) over fake-account scraping, and removed company pages for Apollo, Seamless, and HeyReach. Any data or automation vendor that depends on LinkedIn can disappear overnight; keep an alternative.
- **Logged-out vs logged-in.** Courts have treated scraping public, logged-out pages differently from scraping behind a login or with fake accounts, which breaches the User Agreement. Under GDPR, "publicly visible" still doesn't mean free to use: France's regulator fined Kaspr €240,000 (December 2024) for collecting contact details from LinkedIn that users had chosen to hide.
- **Apollo, Clay, and ZoomInfo** claim LinkedIn-overlap data through various legitimate channels — verify their data sources before assuming compliance
- **Messages, InMail, and connection requests** are still processing of personal data, so GDPR, PECR, and similar laws apply exactly as they do to email: lawful basis, an opt-out on request, and source records. LinkedIn's own rules apply on top, and third-party automation tools violate its User Agreement.

### Google Maps

- ToS prohibits bulk extraction or productizing Maps data
- Browser-assisted research as a discovery aid: acceptable
- Place IDs are exempt from Google's caching limits, so storing them to re-look up a business is fine. Other Maps content (reviews, ratings, photos, and bulk-copied listing details) can't be cached beyond the terms or rebuilt into your own database
- The Places API is the compliant way to pull business data programmatically, within its terms
- Use Maps to **find** local businesses, then cross-source from the business's own site for the data you retain

### Apollo / ZoomInfo / other licensed data providers

- All have their own ToS limiting reselling, downstream sharing, and use cases
- Read your contract — typically you can use the data for your own outreach but not productize it
- Don't share extracts publicly (e.g., on a leaderboard, in a public report)

### Crunchbase

- Free tier is read-only for personal use
- Paid tier permits broader use within contractual scope
- API access requires paid Pro+ tier

---

## Phone and SMS (US)

- **Do Not Call.** Scrub numbers against the National DNC Registry and your internal DNC list before calling. B2B calls to business lines are lower risk, but mobile numbers enriched from data providers are often personal cell phones, which the rules protect.
- **AI voice counts as an artificial voice.** The FCC's February 2024 ruling puts AI-generated voices under the TCPA's artificial or prerecorded voice rules. AI-voiced calls to cell phones need prior express consent, and written consent for marketing. Damages run $500–$1,500 per call. Use AI voice only for inbound calls and requested callbacks.
- **Opt-outs by any reasonable means.** Since April 2025, a consumer can revoke consent by any reasonable means (a reply of "stop," a spoken request), and you have 10 business days to honor it.
- **Cold SMS** to US mobiles needs consent plus 10DLC registration. Treat SMS as a channel for people who've already engaged.

---

## Anti-Patterns (Don't Do These)

1. **Bulk-scraping LinkedIn / Google Maps / Yelp**. Browser-assisted research is OK; automated scrapers pointed at these platforms are not. **Firecrawl and Browserbase are fine for an individual prospect's own website** (the URL you found through manual discovery) — not for the platforms hosting prospects.
2. **Buying lists from random vendors** without source provenance. You inherit their legal exposure.
3. **Guessing emails and sending unverified**. Bounce rates over 2% destroy sender reputation; legally, you can't claim a "legitimate interest" basis for an email you fabricated.
4. **Harvesting personal email addresses** (Gmail, personal Outlook, etc.) from public profiles. Personal addresses raise GDPR risk significantly.
5. **Storing data you don't need**. Minimize retention. Don't keep prospect lists forever — GDPR right to deletion applies.
6. **Skipping the lawful basis documentation**. If challenged, you need to show your work. Capture source URL + collection date for every contact.
7. **Reselling prospect lists**. You may not have the right to share them downstream. Read your data provider contracts.
8. **CAPTCHA bypass / login wall bypass**. Even if technically possible, this signals bot behavior and violates virtually every ToS.

---

## Quick Audit Checklist

Before shipping a list to the user (or downstream to cold-email):

- [ ] Every contact has a source URL + collection date
- [ ] No contacts sourced from scraped LinkedIn data
- [ ] No bulk Maps content (reviews, ratings, listing copies) retained beyond Google's terms
- [ ] Country gating applied: Germany excluded from cold email, UK sole traders and partnerships excluded without consent, CASL and Spam Act requirements met for Canada and Australia
- [ ] Phone numbers scrubbed against DNC; no AI-voice calls to mobiles without consent
- [ ] Lawful basis documented (legitimate interest test for B2B, or relevant alternative)
- [ ] Email addresses validated (deliverability check before outreach)
- [ ] Personal addresses (Gmail, etc.) flagged or excluded
- [ ] Source provider contracts permit the intended use case
- [ ] Retention plan documented (when to delete)
- [ ] First outreach will include an opt-out, a postal address, and (for EU/UK) where the data came from (downstream concern for cold-email skill, but mention it now)
