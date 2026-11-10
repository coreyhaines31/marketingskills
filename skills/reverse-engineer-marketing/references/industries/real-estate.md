# Real Estate: Teardown Pack

Load this pack when the target is a brokerage or agent team, a proptech company, a home builder, a property manager, or a commercial real estate firm. Growth here depends on listings and leads. Portals sit between buyers and agents, so many companies fight to own the lead before a portal does, and the agent or broker count is often the real growth engine.

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

- Listing search with IDX or MLS data (`/listings`, `/homes-for-sale/<city>`, `/property/<id>`), and IDX vendors (IDX Broker, iHomefinder, Showcase IDX) found by `teardown.mjs stack <domain>`.
- Real estate CRMs and lead tools (Follow Up Boss, kvCORE, BoldTrail, Lofty, Sierra Interactive, Real Geeks).
- "What's my home worth" valuation pages, neighborhood guides, and agent directories.
- Builders: community pages, floor plans, "quick move-in" inventory, and interest lists.
- Property managers: owner and resident portals (AppFolio, Buildium, Yardi, Entrata). `teardown.mjs detect <domain>` flags most of these.

## What Drives Growth Here

- **Agents are the growth engine for brokerages.** Many brokerages grow by recruiting agents, not by generating consumer leads. Check agent count and recruiting pages before judging consumer marketing.
- **Portals own search.** Zillow, Realtor.com, Redfin, and Homes.com dominate listing searches. Independents win on local content, neighborhood pages, and long-tail searches portals don't cover well.
- **Rates and inventory drive cycles.** Lead volume swings with mortgage rates and listing supply. Check the macro curve before crediting a move.
- **The rules of the game changed in 2024-2025.** After the NAR settlement, offers of buyer-agent compensation came off the MLS and written buyer agreements are required before touring (from August 17, 2024). In March 2025 NAR kept Clear Cooperation but added delayed-marketing exempt listings, and portals set their own standards on privately marketed listings. Many recent moves (flat-fee buyer offers, private listing networks, buyer-agreement funnels) are responses to these changes.
- **Seller leads are worth more than buyer leads.** Valuation tools and "sell your home" offers target sellers because a listing creates many buyer leads.
- **Builders and property managers market like product companies:** paid social for communities, interest lists, and incentives for builders; owner acquisition and resident retention for property managers.

## Signals to Collect

| Signal | Where or how | What it shows |
|---|---|---|
| ★ Agent count over time | Wayback captures of the agent directory; brokerage recruiting pages | Whether growth comes from recruiting; jumps are moves in moves.csv |
| Recruiting offers | "Join us" pages, revenue share and stock plans, read in Wayback captures (`teardown.mjs history <url>` catches fee and cap changes) | The agent value proposition and when it changed |
| Neighborhood and city page rollout | `teardown.mjs site` and `sitemap-growth` | Their local SEO engine; each wave is a move |
| Listing count and freshness | Their own search pages and portal profiles, read by hand | Market share signal and how current their IDX feed is |
| ★ Valuation and seller tools | "Home value", "instant offer", and cash-offer pages | How they capture seller leads before a portal does |
| Portal presence and ad products | Agent and brokerage profiles on Zillow, Realtor.com, Homes.com | Paid portal dependence |
| Paid social and search | `teardown.mjs ads` and `sc-ads` | Community launches, listing ads, recruiting ads |
| Video and listing content | YouTube channel, home tours, market updates | Agent-led content engines |
| Reviews | Official Places API or manual reads; portal reviews per agent | Reputation by agent and office |
| Builder community launches | Community pages and interest lists via Wayback and `subdomains` | Launch timing; each community is a move |
| ★ Public filings | `teardown.mjs filings <company>` for public brokerages, builders, and REITs | Agent counts, closings, orders, and marketing spend |
| Lead routing tools | `teardown.mjs stack <domain>` | How leads reach agents and how fast |
| ★ Private and exclusive listing programs | "Coming soon", "private exclusive", or off-market pages, dated in Wayback | Whether they use listing control to recruit agents and win sellers; launch dates are moves |

## Going Inside

- **Don't request showings or valuations for homes you won't buy or sell.** Agents spend real time on each request and often split fees with others. Only engage if the user has a genuine need.
- With approval and a genuine need: register on the listing search, save a search, and log every email, text, and call for 30 days. Record speed to first contact and how leads are assigned to agents.
- Without a genuine need: use public search pages, the valuation tool's first screens (stop before entering a real address that isn't the user's), and published recruiting materials.
- Never enter someone else's address or personal details into a valuation tool.

## Rules That Limit Copying

- **Fair Housing Act:** ads can't express a preference or limit based on protected classes, and HUD and the Justice Department have applied this to ad targeting and delivery. Meta runs housing ads as a special ad category with limited targeting, and Google restricts targeting by age, gender, parental status, marital status, and ZIP code for housing ads in the US and Canada.
- **MLS and IDX rules:** each MLS sets display rules for listing data, attribution, and refresh. You can't copy another site's listing data.
- **RESPA Section 8:** restricts referral fees and kickbacks among settlement service providers. Joint marketing and marketing services agreements with lenders and title companies have drawn CFPB scrutiny. Check with counsel.
- **State license rules:** most states require the brokerage name and license details in ads, and regulate team names.
- **Buyer agreements and compensation:** since August 2024, MLS participants need a written agreement with a buyer before touring, and compensation offers can't appear on the MLS. Copying a pre-2024 buyer funnel may not work.
- **Telemarketing and texting:** TCPA consent rules apply to lead follow-up. The FCC's one-to-one consent rule was struck down in January 2025, but prior express written consent still applies to marketing calls and texts made with an autodialer or a prerecorded or artificial voice. Do-not-call rules and state laws add their own limits.

## Plays That Usually Transfer

| Play | Run it with |
|---|---|
| Neighborhood and city page family with local data | **programmatic-seo**, **content-strategy** |
| Seller valuation tool as a lead magnet | **free-tools**, **lead-magnets** |
| Fast lead routing and follow-up sequences | **revops**, **emails**, **sms** |
| Agent recruiting page and offer | **product-marketing**, **offers** |
| Market update video series | **video**, **social** |
| Review program per agent | **referrals** |
| Local schema on listing and office pages | **schema** |

## Metrics to Ask About

- **Agent count and productivity:** agents, and closings or volume per agent.
- **Cost per closed transaction:** spend divided by closings, by channel.
- **Lead to appointment rate:** share of leads that meet an agent.
- **Speed to lead:** minutes to first contact.
- **Seller lead share:** listing leads vs buyer leads.
- **For builders:** interest list to sales appointment, and sales per community per month.
- **For property managers:** doors under management, owner churn, and resident renewal rate.
