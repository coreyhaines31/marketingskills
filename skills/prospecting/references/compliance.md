# Prospecting Compliance Reference

The legal and platform-ToS constraints that apply to prospect list building. Read first, every engagement.

> Operational guidance, not legal advice. For high-volume programs or programs touching EU/UK residents, run your setup past a privacy attorney.

---

## United States — CAN-SPAM (downstream)

CAN-SPAM regulates the cold email **send**, not the list build. But the list build matters because:

- You must be able to identify the source of every email address you contact (required if challenged)
- The "from" line and email content rules apply at send time — but you can't lie about how you got the contact
- Opt-out requests must be honored within 10 business days and tracked

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

### What disqualifies a list

- Bulk-scraped LinkedIn data — explicit ToS violation + GDPR risk
- Email addresses purchased from a list broker without source provenance
- "Anyone @ this domain" guessed emails sent without verification (multiplies risk + bounces)

---

## Canada — CASL

Stricter than CAN-SPAM. Cold B2B outreach requires:

- **Express consent** (explicit opt-in) — typically not present for cold prospecting
- **OR implied consent** — existing business relationship within 24 months, OR business address publicly published on the company's own site for the purpose of receiving such communications

**Practical implication for Canadian prospects**: relying on the publicly-published-address exception is the most defensible cold prospecting basis in Canada. You must include sender identification, mailing address, and an unsubscribe mechanism in every message.

---

## Platform Terms of Service

### LinkedIn

- **Sales Navigator** as a research tool: fine
- **Scraping LinkedIn at any scale**: explicit ToS violation. Banned accounts are permanent. Don't.
- **Apollo, Clay, and ZoomInfo** claim LinkedIn-overlap data through various legitimate channels — verify their data sources before assuming compliance
- **InMail and Connection Requests**: governed by LinkedIn's own messaging rules, not by CAN-SPAM/GDPR (because LinkedIn-internal)

### Google Maps

- ToS prohibits bulk extraction or productizing Maps data
- Browser-assisted research as a discovery aid: acceptable
- Storing Place IDs or large structured Maps data in your CRM: explicit ToS prohibition
- Use Maps to **find** local businesses, then cross-source from the business's own site for the data you retain

### Apollo / ZoomInfo / Clearbit

- All have their own ToS limiting reselling, downstream sharing, and use cases
- Read your contract — typically you can use the data for your own outreach but not productize it
- Don't share extracts publicly (e.g., on a leaderboard, in a public report)

### Crunchbase

- Free tier is read-only for personal use
- Paid tier permits broader use within contractual scope
- API access requires paid Pro+ tier

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
- [ ] No Google Maps Place IDs or large Maps-structured data retained
- [ ] Lawful basis documented (legitimate interest test for B2B, or relevant alternative)
- [ ] Email addresses validated (deliverability check before outreach)
- [ ] Personal addresses (Gmail, etc.) flagged or excluded
- [ ] Source provider contracts permit the intended use case
- [ ] Retention plan documented (when to delete)
- [ ] First outreach will include unsubscribe + privacy notice (downstream concern for cold-email skill, but mention it now)
