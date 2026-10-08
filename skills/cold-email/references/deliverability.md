# Cold Email Deliverability

The best cold email does nothing if it lands in spam. Deliverability is set up before the first send and watched every week after. This reference covers the sending setup, the mailbox providers' rules, volume limits, warmup, monitoring, and when to stop.

Numbers here come mostly from sending-infrastructure vendors and mailbox providers' own guidelines. Mailbox providers change enforcement without notice, so treat the volume figures as starting points and let your own placement tests decide.

## The rules from Google, Yahoo, and Microsoft

| Provider | What it requires | Enforcement |
|----------|------------------|-------------|
| **Gmail** | SPF and DKIM for everyone; for bulk senders (about 5,000+ messages a day to personal Gmail), also DMARC, alignment, one-click unsubscribe on marketing mail, and spam complaints under 0.3% | Since November 2025, non-compliant mail gets permanent rejections rather than temporary deferrals. Once you're classified as a bulk sender, the status is permanent |
| **Yahoo** | Matches Google's requirements | Since 2024 |
| **Microsoft** (Outlook.com, Hotmail, Live) | SPF, DKIM, and DMARC for senders above 5,000 a day | Since May 5, 2025, non-compliant mail is rejected (`550 5.7.515`) |

Google's bulk-sender rules apply to mail sent to personal Gmail accounts, not to Google Workspace business addresses. A cold program under 5,000 a day isn't technically a "bulk sender." Follow the rules anyway: they describe what every filter rewards, and the complaint threshold applies to everyone.

**Complaint rate:** keep spam complaints under 0.1% and never reach 0.3%. Practitioners report Workspace sending degrading well before 0.3%.

## Sending setup

**Never send cold email from your primary domain.** One bad campaign can damage the domain your customers, invoices, and password resets depend on.

1. **Buy secondary domains** that are obviously yours (`getacme.com`, `acmehq.com`, `tryacme.com`). Redirect each to your main site.
2. **Authenticate every domain:** SPF, DKIM, and DMARC (start at `p=none` with reporting), aligned to the From domain. Add a custom tracking domain only if you track clicks (see Tracking, below).
3. **Create 2–3 mailboxes per domain**, each a real-looking person with a name, photo, and signature. Never use aliases of a single mailbox; both Google and Microsoft treat that as abuse of their terms.
4. **Only buy mailboxes from properly licensed tenants.** In late 2025 Google reportedly suspended large numbers of resold Workspace mailboxes built on education, nonprofit, or legacy accounts. Cheap "reseller" inboxes are disposable at best.
5. **Match the provider to your prospects where you can.** Google-hosted mailboxes for audiences on Google Workspace (most startups and SaaS), Microsoft-hosted for enterprise audiences on Microsoft 365. Vendors report better inbox placement when the two match. Check a prospect's mail host from their MX record.

### Volume math

| Setting | Starting point |
|---------|----------------|
| Sends per mailbox per day | 20–30 (Google-hosted); test lower for Microsoft-hosted, where 2026 operator reports range from single digits to dozens |
| Mailboxes per domain | 2–3 |
| Daily volume | Mailboxes × sends per mailbox |

Example: 500 sends a day ≈ 20 mailboxes at 25 each ≈ 7–10 domains. Follow-ups count toward the daily volume.

Plan for spares. Keep 10–20% extra domains warmed and idle, so a burned domain can be swapped out without stopping the program.

## Warmup

New mailboxes need 3–4 weeks of ramp before full cold volume:
- **Weeks 1–2:** warmup only, plus a handful of real emails to people likely to reply.
- **Weeks 3–4:** start cold sends at 5–10 a day per mailbox and increase gradually.
- **After that:** keep light warmup running in the background.

Warmup networks still help new mailboxes, but a mailbox whose only engagement is warmup traffic is a recognizable pattern. Real replies are the strongest reputation signal there is, which is one more reason to write emails people answer.

## The email itself

- **Plain text.** No images, no HTML templates, no attachments.
- **No link in the first email,** and at most one link in later ones. Never use link shorteners.
- **Turn off open tracking.** Apple Mail Privacy Protection makes opens meaningless, and the tracking pixel itself is a spam signal. One large sender dataset found reply rates roughly doubled when open tracking was off. Measure replies instead.
- **Turn off click tracking** unless you need it, and then only with a custom tracking domain.
- **Under about 80 words** for the first email.
- **Vary the copy.** Identical bodies across thousands of sends look like bulk mail. Segment-specific copy and real personalization fix this naturally. Keep spintax as a last resort.
- **Opt-out line.** A plain-text line ("If this isn't relevant, reply 'no' and I won't follow up") plus your postal address in the signature. CAN-SPAM requires both; see the prospecting skill's compliance reference.

## Verify before you send

Bounces are the fastest way to damage a domain. Keep them under 2% per campaign; under 1% is best in class. A single day with several percent bounces can trigger a review at Google.

- Verify every list before upload, and re-verify anything older than about a week.
- Handle catch-all domains with a policy. See the prospecting skill's sourcing and enrichment reference.
- Pause any campaign automatically when its bounce rate passes 2%.

## Monitoring

| Check | How | When |
|-------|-----|------|
| Inbox placement | Seed tests (MailReach, GlockApps, or your sending tool's built-in test) | Before every new campaign and weekly |
| Domain reputation | Google Postmaster Tools; Microsoft SNDS | Weekly |
| Bounce rate | Sending tool, per campaign and per mailbox | Daily |
| Spam complaints | Postmaster Tools; replies containing "spam" or "stop" | Weekly |
| Blocklists | A blocklist checker for each sending domain | Weekly |
| Authentication | DMARC aggregate reports | Monthly |

## Stop-loss rules

Decide these before launch and enforce them automatically where your tool allows:

| Trigger | Action |
|---------|--------|
| Bounce rate above 2% on a campaign | Pause the campaign and re-verify the list |
| Inbox placement below ~70% on a mailbox or domain | Pull it from rotation, return it to warmup, investigate |
| Spam complaints approaching 0.1% | Pause, cut volume, review targeting and copy |
| Domain appears on a major blocklist | Stop sending from it; delist or retire it |
| Reply rate under ~1% after 300+ sends | Stop the campaign; the targeting or offer is wrong, and more volume makes it worse |

## Common mistakes

- Sending from the primary domain
- Buying the cheapest reseller mailboxes and losing all of them at once
- Skipping verification "because the data provider verified it"
- Leaving open tracking on and optimizing for a number that isn't real
- Scaling volume to fix a low reply rate
- Running warmup and cold sends at full volume from day one

## Tools

| Job | Options |
|-----|---------|
| Sending and mailbox rotation | Instantly, Smartlead, lemlist, EmailBison, Salesforge |
| Domain and mailbox provisioning | Inframail, Maildoso, Mailforge, Truelist Outbound (managed domains, mailboxes, and a dedicated IP with an enforced ramp), Zapmail, or Google Workspace and Microsoft 365 directly |
| Placement testing | GlockApps, MailReach, or your sending tool's built-in test (Instantly has one) |
| Reputation | Google Postmaster Tools, Microsoft SNDS |
| DMARC monitoring | EasyDMARC, dmarcian, Valimail |
| List verification | Bouncer, MillionVerifier, NeverBounce, Truelist, ZeroBounce, and others |

Setup guides: [tools registry](https://github.com/coreyhaines31/marketingskills/blob/main/tools/REGISTRY.md).
