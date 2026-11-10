# Signal Plays

A list tells you who could buy. A signal tells you who might buy now. This reference turns signals into outbound plays: which signals to trust, how fresh they need to be, what to do when one fires, and how much effort each account deserves.

Signals are a timing and relevance filter. They don't replace ICP fit. A strong signal at a company outside your ICP is still a skip, and a great-fit account with no signal can still get a well-aimed message built on its situation.

## Rank signals by how close they are to you

The closer the signal is to your product and your past customers, the better it converts. Work down this list and stop where you have enough volume:

| Rank | Signal | Why it works | Typical source |
|------|--------|--------------|----------------|
| 1 | **Your own product usage**: a signup from a company domain, a plan limit hit, a big upload, a team invite | They already chose you once | Your product analytics, billing |
| 2 | **Past champions changing jobs** | Former users bring the tool with them; vendors report win rates roughly double when the buyer has used the product before | CRM contacts + job-change tracking (UserGems, Clay, manual LinkedIn checks) |
| 3 | **High-intent website visits**: pricing, comparison, integration pages | Active evaluation | Visitor identification (RB2B, Warmly, Vector), your analytics |
| 4 | **Engagement with you or a competitor**: comments on your posts or a competitor's, community questions | Public interest in the problem | Trigify, Common Room, social listening |
| 5 | **Hiring in the function you serve**, or a new leader in it | New budget and a mandate to change things | Job boards (TheirStack, PredictLeads), LinkedIn |
| 6 | **Funding, launches, expansion** | Budget, plus pressure to grow fast | Crunchbase, news, press releases |
| 7 | **Tech stack changes**: adding or dropping a tool next to yours | A related decision is in motion | BuiltWith, Wappalyzer, job-post tech mentions |
| 8 | **Generic third-party intent** | Weakest, and noisy | Bombora-style intent feeds, review-site intent |

Stack signals before acting on the weaker ones. Hiring a lifecycle marketer **plus** an ESP in the stack **plus** a fit score above your threshold is worth a sequence. Any one of those alone usually isn't.

## Warm paths: your network is a signal too

Before buying a list, mine the relationships you already have. A warm introduction gets read when the twentieth cold email of the day doesn't, and AI-written outreach makes that gap wider.

1. **Export your network.** LinkedIn connections (Settings → Data privacy → Get a copy of your data), calendar attendees, and inbox contacts. LinkedIn's export includes emails only for connections who allow it.
2. **Enrich and rank** every contact: company, role, industry, headcount. Score them against your ICP like any other list.
3. **Match against target accounts** to find first- and second-degree paths into the companies you want.
4. **Start with your calendar.** Recent meetings show who is in a buying moment right now.
5. **Find one connector per vertical**: someone trusted by buyers who ignore cold outreach (an agency owner who knows every other agency owner). Pay them the way you'd pay for a qualified meeting, and disclose the arrangement.
6. **Double opt-in intros only.** Ask the connector, then the target, before anyone is introduced. Keep a human approving every intro, and never ask one contact to take intros for two vendors in the same week. Trust is the asset; spend it slowly.

*Adapted from Cody Schneider's podcast with Chris of Super Connector (October 2026).*

## Freshness windows

A signal decays. Act inside these windows or downgrade it:

| Signal | Act within | After that |
|--------|-----------|------------|
| Product usage spike, limit hit | Same day (ideally within minutes) | Treat as a normal product-qualified lead |
| Pricing or comparison page visit | 24 hours | Drop to the general list |
| Champion job change | 30–90 days in the new role | They've already chosen their stack |
| New leader in the function | First 90 days | Priorities are set |
| Job post for the function | While the post is open, up to ~60 days | Hire made, budget allocated |
| Funding announcement | 30–60 days | Old news; don't congratulate on it |
| Tech install or removal | 30 days | Decision done |

Record the signal date on every lead. A lead sheet without signal dates can't be prioritized.

## From signal to play

Every signal you track should map to a specific play, so nobody improvises the angle at send time:

| Signal | Play | Opening angle | Channel order |
|--------|------|---------------|---------------|
| Product limit hit | Sales-assist | Offer to help them get more from the plan they're outgrowing | Email from a founder or account owner within minutes, then LinkedIn |
| Champion job change | Reunion | Reference the work they did with you before; ask how the new team handles it | LinkedIn first (they're updating their profile), then email |
| Pricing page visit (identified) | Evaluation help | Don't mention the visit. Lead with the decision they're probably weighing | Email, then call for Tier 1 |
| New leader in the function | First 90 days | The thing new leaders in that role usually fix first, with proof | LinkedIn connect, then email |
| Hiring for the function | Bridge the gap | What they can get done before the hire lands, or what the hire will need | Email |
| Competitor engager | Alternative | The problem they engaged with, not the competitor | LinkedIn, then email |

Write the angle as the problem the signal implies. "Saw you raised a Series A" is a fact everyone else sent. "Most teams that just raised are told to double pipeline in two quarters, and the site usually becomes the bottleneck" is a reason to reply.

## Gap plays: a signal plus a gap you can see

The strongest services and tooling plays pair two things: a signal that the company is spending or growing, and a gap you can verify from outside that your offer fixes. The signal says they have budget and a reason to act. The gap gives you a specific, checkable opener instead of a guess.

| Signal | Gap to verify | How to check it from outside | Fits an offer like |
|--------|---------------|------------------------------|--------------------|
| Recent funding or a new marketing leader | The site hasn't changed in a long time, or doesn't match the new story | Wayback Machine snapshots, the copyright year, positioning that doesn't match the funding announcement | Website, CRO, positioning |
| Hiring several SDRs or BDRs | The outbound stack doesn't match the plan | The tools named in the job post, sending-domain DNS (SPF, DKIM, DMARC), the tech stack | Email infrastructure, enrichment, deliverability |
| Hiring for repetitive work (data entry, reporting, lead research, CRM admin) | The job post describes tasks that can be automated | The responsibilities list in the post itself | Automation, RevOps, AI agents |
| Running paid ads | No visible ad or analytics tags | Page source, browser network tab, or a tag-checker extension (Meta Pixel Helper, Google Tag Assistant) | Tracking and attribution setup |
| Running paid ads | Paid traffic lands on the homepage | The destination link on each ad in the Meta Ad Library or LinkedIn Ad Library | Landing pages, CRO |
| Running the same ads for months | Creative fatigue | Start dates in the Meta Ad Library; the Google Ads Transparency Center for search and YouTube | Ad creative |
| Many locations | Missing or thin location pages | Store locator count vs. pages found with `site:domain.com/locations`; Google Business Profiles per location | Local SEO |
| Many integrations or use cases | Few pages about them | The integrations directory vs. a `site:` search for integration or use-case pages | Programmatic SEO, content |
| A lead magnet (ebook, calculator, webinar) | No follow-up after opt-in | Opt in with an address you control and log every email for 14 days, then unsubscribe | Email nurture, lifecycle |
| Expanding into a new country | The site isn't localized for it | Language switcher, `hreflang` tags, local currency and payment methods on pricing | Localization, international SEO |

**Rules for gap plays:**

1. **Verify the gap; never assume it.** Record what you checked, the date, and a screenshot or URL. An agent asked to find gaps will invent them unless every gap needs evidence. "No gap found" is a valid result, the same as "no hook found" in [account-research.md](account-research.md).
2. **Know what can't be seen from outside.** Server-side tracking (Meta's Conversions API, server-side Google Tag Manager) doesn't show in page source, so a missing browser tag isn't proof of missing tracking. Ask, don't accuse. A homepage is also a normal destination for brand-name search ads, and an ad running for months may be the winner rather than tired. Ad longevity is a proxy, not proof.
3. **Re-check before sending.** Gaps get fixed. Re-verify within 7 days of the first touch, or drop the gap from the message.
4. **The gap must map to your offer.** Spotting a problem you can't fix is research, not a play.
5. **Lead with the observation and a question, not a verdict.** "Your Meta ads for the spring launch point to the homepage. Is that on purpose?" gets replies. "Your landing pages are wasting your ad spend" gets deleted. Offer the evidence, and the teardown, only after they say yes (see the cold-email skill's outbound plays reference).

Searching for these by hand is slow, which is why the plays used to be rare. Agents with web, ad-library, and X search access (Grok, for example, searches X directly) can build the list. A human still reviews the evidence for Tier 1 and a sample for Tier 2. Once a play gets replies, run it on a schedule with the signal-sweep loop in the marketing-loops skill.

## Two worked examples

**A services agency selling to B2B SaaS (for example, a CRO and landing page agency)**
- **Signals:** funding in the last 60 days; a new VP Marketing or head of growth; open roles for growth or performance marketers; a redesigned site or new pricing page; paid search or paid social campaigns launching.
- **Play:** value first, built on a verified gap from the gap plays table. Offer a short teardown of their actual page. Send it only after they say yes. See the cold-email skill's outbound plays reference.
- **Volume:** about 50 well-researched accounts a week beats 5,000 generic sends. Agencies rely on depth.

**A self-serve SaaS tool (for example, an email verification product)**
- **Signals:** signups from company domains; credit or plan limits hit; large list uploads; team invites. Off-product signals include companies hiring lifecycle, RevOps, or SDR roles and cold-email tools appearing in their stack.
- **Play:** product-led outbound for usage signals, problem-led cold outbound for the rest. The outbound plays reference covers both.
- **Volume:** usage signals are few but hot. Cold lists can be larger, but every send has to model the deliverability the product sells.

## Account tiers

Tiers decide how much research and how many channels each account gets. Assign the tier before writing anything.

| Tier | Accounts | Research | Channels | Copy |
|------|----------|----------|----------|------|
| **Tier 1 (1:1)** | Top ~25–50 by fit and signal | A full account brief (see [account-research.md](account-research.md)), mobile numbers | Email, LinkedIn, phone, video, possibly direct mail | Written per person; a human reviews every message |
| **Tier 2 (1:few)** | Segments of 20–200 sharing one specific pain | Segment research plus one personal line | Email + LinkedIn | Written per segment, with a personal opener; a human reviews a sample |
| **Tier 3 (1:many)** | Everyone else who fits | The segment definition is the research | Email | Written per segment; relevance comes from how tightly the segment is defined |

Keep campaigns small. Several vendor and agency datasets show reply rates falling as campaign size grows, with campaigns of 50 or fewer recipients replying at roughly twice the rate of campaigns over 1,000.

## Tools for detecting signals

| Signal type | Options | Agent access |
|-------------|---------|--------------|
| Job postings and hiring | TheirStack, PredictLeads, LinkedIn Jobs (manual) | TheirStack has an MCP; PredictLeads has an API |
| Job changes | UserGems, Clay job-change tracking, manual checks of past champions | Clay MCP |
| Website visitors | RB2B (US, person-level), Warmly, Vector, Koala | Mostly webhooks into your CRM or a Zap |
| Social and community engagement | Trigify, Common Room | Both have APIs and MCPs |
| Funding and news | Crunchbase, news search, Exa | Exa MCP; Crunchbase API on paid plans |
| Public posts and announcements | X search (Grok searches X directly), LinkedIn posts (manual), news search | Grok via the xAI API; Exa MCP |
| Ad activity | Meta Ad Library, Google Ads Transparency Center, LinkedIn Ad Library | Meta Ad Library API (political and EU ads only; check its current scope); otherwise browser research |
| Tech stack | BuiltWith, Wappalyzer, tech mentions in job posts | APIs |
| Product usage | Your own analytics and billing events | Webhooks into your CRM |

See the [tools registry](https://github.com/coreyhaines31/marketingskills/blob/main/tools/REGISTRY.md) for setup. A scheduled sweep of these sources is the signal-sweep loop in the marketing-loops skill.

## Common mistakes

- Treating any funding round as a buying signal for everything.
- Opening with the signal itself ("Congrats on the raise"). Use it to choose the angle, then talk about their problem.
- Acting on stale signals. A six-month-old job change is just a job.
- Mentioning website visits that the prospect doesn't know were tracked. It reads as surveillance.
- Running every account at the same depth. Tier first.
