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

## Two worked examples

**A services agency selling to B2B SaaS (for example, a CRO and landing page agency)**
- **Signals:** funding in the last 60 days; a new VP Marketing or head of growth; open roles for growth or performance marketers; a redesigned site or new pricing page; paid search or paid social campaigns launching.
- **Play:** value first. Offer a short teardown of their actual page. Send it only after they say yes. See the cold-email skill's outbound plays reference.
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
| Tech stack | BuiltWith, Wappalyzer, tech mentions in job posts | APIs |
| Product usage | Your own analytics and billing events | Webhooks into your CRM |

See the [tools registry](https://github.com/coreyhaines31/marketingskills/blob/main/tools/REGISTRY.md) for setup. A scheduled sweep of these sources is the signal-sweep loop in the marketing-loops skill.

## Common mistakes

- Treating any funding round as a buying signal for everything.
- Opening with the signal itself ("Congrats on the raise"). Use it to choose the angle, then talk about their problem.
- Acting on stale signals. A six-month-old job change is just a job.
- Mentioning website visits that the prospect doesn't know were tracked. It reads as surveillance.
- Running every account at the same depth. Tier first.
