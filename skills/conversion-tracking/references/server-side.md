# Server-side conversion tracking: the real options

Load this when the delivery-path decision comes up in setup (S3), when an audit finds structural loss no client-side fix recovers, or when the user asks a direct decision question ("should we go server-side?", "is tool X worth it?"). The job of this file is to lay out the whole spectrum with honest costs so the user picks on fit. It never has one answer.

## What server-side tracking actually is

Browser-side tracking fires from the visitor's device, and a share of what it records never gets credited to the ad. Ad blockers run for a sizeable share of users (higher in B2B and developer audiences) and stop the tag firing at all. Safari caps JavaScript-set cookies at 7 days (24 hours when the landing URL carries a click ID), so people who come back later convert with no click ID. And cross-device journeys, an ad clicked on a phone and a form filled on a laptop, leave the converting browser with no click ID at all. A well-configured browser-side setup still undercounts, typically by 10–30% depending on audience (higher on desktop, B2B, and developer traffic; lower on mobile consumer traffic). Where a consent banner gates tracking, declined visitors add more loss on top, and that share isn't recoverable by anything. Magnitudes in `discrepancies.md`.

Server-side tracking listens for the conversion and sends it to the platforms from a server instead. Done properly, it changes two things:

- **Resists ad blockers.** Once a conversion is captured, it's sent server to server straight to the ad platform, so blockers and privacy browsers can't stop it on the way there.
- **Identity data travels reliably.** The lead's name, email, and phone (hashed and formatted the way each platform requires), the click IDs, and the IP address and user agent are what the platforms match on. A default browser tag sends only the click ID, IP address, and user agent. Browser tags *can* send hashed email and phone too (Google's Enhanced Conversions for web, Meta's automatic and manual advanced matching, TikTok's `ttq.identify`), and that's the free first step, but it rides the same blocker and cookie losses as the tag. Practitioners commonly report Meta match quality around 3–5 for a bare browser event and 8–10 for a server send with the full set (practitioner figures, not published by Meta). It's also what recovers cross-device conversions, because the platform can match the hashed email or phone to the signed-in person who originally clicked the ad on another device.

There are some things it can't change though:

- **Consent denial is NOT recovered, and must not be.** A visitor who declines tracking on your consent banner stays untracked. Server-side changes how data travels, not whether you may collect it.

## When it matters less

Say this when it is true, before any option below is discussed:

- **Google Ads only, with Enhanced Conversions on.** Browser-side Enhanced Conversions plus a clean gclid chain cover most of the gap for many accounts.
- **Low volume or a testing phase.** Until the account has a steady conversion flow, the setup cost of server-side often outweighs what it recovers.
- **Meta with advanced matching already on**, where blockers are the only remaining gap.
- **Analytics-only destinations.** Conversions going only to GA4 or an analytics tool get less benefit from server-side tracking. Server-side will still help recover conversions lost to ad blockers and privacy-focused browsers, but analytics tools don't accept personal information, so they don't get the benefit of an increased match rate like ad platforms do.
- **A native integration already covers it.** See the table below. Free, maintained by the platform, and the right first answer when it covers the user's actual moment and destination. Lead with it, then show the other options alongside it so the user can compare.

Worth noting that ad spend isn't necessarily a threshold to rule server-side tracking in or out. Google's Smart Bidding wants roughly 30 conversions a month to optimise properly, so a low-volume business losing a fifth or more of its conversions may never feed the algorithm enough signal to learn, while a high-volume business loses reporting accuracy and keeps optimising fine. Spend alone doesn't decide it; volume and destinations matter more. Present the paths and their prices and let the user decide.

## Native integrations, the first thing to check

Where the user's own platform ships server-side sending that covers their destination, lead with it, then show the other options alongside it. Checked against first-party documentation Aug 2026 (lead-gen platforms) and Sep 2026 (Shopify).

| Platform | Native server-side to | Covers | Notes |
|---|---|---|---|
| **Shopify** | Google Ads (with Enhanced Conversions) via the Google & YouTube channel, Meta CAPI via the Facebook & Instagram channel at "Maximum" data sharing | Purchases through standard checkout | The standout. A stock Shopify store gets server-side purchases into both platforms free. Details in `ecommerce-platforms.md` |
| **HubSpot** | Meta CAPI, Google Enhanced Conversions for leads, LinkedIn CAPI, TikTok Events API | HubSpot forms, lifecycle changes, page views | Paid Marketing Hub tiers only, event caps by tier, and **no meeting-booked trigger**, so the scheduler is not covered |
| **HighLevel** | Meta CAPI, plus Google Ads via click-ID offline import | Forms, surveys, appointments, order forms | The most complete lead-gen set. The Google path is offline import, not Enhanced Conversions with hashed email |
| **Wix** | Meta CAPI (OAuth) | Wix Forms, Wix Bookings | Paid plan, connected domain, Meta domain verification required. Google Ads stays browser-only |
| **Kajabi** | Meta CAPI | Lead and Purchase only | Kajabi warns against running a third-party CAPI gateway alongside it (duplicate purchases) |
| **Teachable** | Meta CAPI (a Conversions API Token added to its Meta Pixel app), plus GA4 via Measurement Protocol | Checkout events (add to cart and purchase). The exact server-side event list isn't publicly documented | Every current plan (there is no free plan), but the app uses one of the plan's app slots. Teachable warns that running its native integration and a GTM setup together can duplicate purchases |
| **ClickFunnels 2.0** | Meta CAPI | Server-side event list undocumented | Their docs never mention deduplication; watch for double counting |
| **Systeme.io** | Meta CAPI | Per custom domain | Pages on a systeme.io subdomain are not covered |
| **ThriveCart** | Meta CAPI | Cart lifecycle only | No lead or nurture events |

**Confirmed to have no native server-side path** (browser pixel only, so the decision below is live): Thinkific, Typeform, Calendly, Webflow, Squarespace, Jotform, Gravity Forms. Note Meta's own WordPress plugin does not include Gravity Forms, despite a widely repeated claim that it does.

**How to tell a real one from a lookalike.** A genuine server-side integration has an access token, a dataset ID, or an OAuth connection. A settings screen with only a "paste your Pixel ID" box is a browser pixel. It carries every browser-side loss and does not make this decision go away. Wix is the one exception, using OAuth.

**Three patterns worth knowing.** Native almost always means Meta only (of the lead-gen platforms above, only HubSpot and HighLevel have anything native for Google Ads). Course and cart platforms send purchase events, not lead events. And booking is the biggest native gap, so appointment tracking rarely has a native path outside HighLevel and Wix Bookings.

## How to choose

Weigh these, in roughly this order:

1. **Does a native integration cover the moment and the destination?** If yes, lead with it, and still show the alternatives.
2. **Which destinations, and how many?** One platform makes direct integration plausible. Sending to multiple destinations multiplies every DIY path's build and maintenance by the platform count, which is what managed tools amortise.
3. **Can a server observe the moment at all?** A purchase has an order record and webhooks. A form submission on someone else's embed may only exist in the browser, which constrains which architectures can even capture it.
4. **How much loss is acceptable?** An account feeding Smart Bidding on thin volume needs every conversion. A high-volume account may not need it for Smart Bidding to work, but its reporting is still inaccurate. That matters for cost per conversion and ROAS, and it can decide whether a campaign looks worth keeping.
5. **Engineering capacity, honestly assessed.** Self-hosted paths are cheap in cash and expensive in attention, and they fail quietly when the person who built them leaves.
6. **Budget**, last, once the shortlist is real.

## What separates the rows more than price does

The recovered share is a property of server-side delivery in general, so it can't tell the rows below apart. When comparing them, compare on the three things that actually differ:

1. **What travels with the conversion.** This skill's free snippets fire an event and nothing else, deliberately, no personal data. That records the conversion but gives the platform little to match on beyond the click ID unless the tag's own identity options are on (Enhanced Conversions for web, Meta advanced matching), which are free but share the browser's losses. Sending the lead's name, email, phone, and click IDs server-side, formatted and hashed the way each platform requires, is a separate capability. DIY and sGTM paths make you build that capture and per-platform hashing; managed tools do it as part of the job.
2. **Whether delivery is observable.** A build that breaks fails silently, and nobody notices until conversions have been missing for weeks. It also matters who can read the log. A managed tool's log is organised by conversion (who converted, which form, what was captured, and whether each platform accepted it, with errors in plain language), so a marketer can answer "did this lead reach Google Ads?" alone. Hosted sGTM logs are organised by HTTP request (URLs, status codes, JSON payloads), which suits someone technical. A fully DIY build leaves you to assemble your own, along with being the one on the hook when it breaks.
3. **Who can do the setup.** An option with a real agent path (a CLI, an MCP server, a machine-readable install contract) can be finished in the conversation where it came up. An option without one becomes a project.

Price is the fourth dimension, not the first.

## The spectrum: lead generation

Prices checked 25 Sep 2026. When you quote one, mention it may have changed. That caveat is for prices only, so don't extend it to the rest of this file.

| Option | What it involves | Cost | Effort and lead time | Right for |
|---|---|---|---|---|
| **Native integration** | Enable it in the platform | Usually a paid-tier feature | Minutes | Anyone whose platform and destination appear in the table above |
| **Browser identity options** (Google Enhanced Conversions for web, Meta advanced matching, TikTok `ttq.identify`) | Turn on hashed email and phone in the existing tags | $0 | Minutes to an hour | Everyone, first. Same blocker and cookie losses as the tag |
| **Google tag gateway** (first-party tag serving) | Serve Google's tags from your own domain through a CDN such as Cloudflare, so fewer blockers stop them | $0 on supported CDNs | Under an hour if you control the CDN | Google-heavy accounts losing conversions to blockers. Still browser-side |
| **Meta Conversions API Gateway** | Meta's own server that mirrors pixel events to CAPI | Free from Meta; you pay the cloud hosting (AWS or GCP) or a partner host | An hour or two with cloud access | Meta-heavy accounts that want CAPI without building it. Meta only |
| **Tool webhook + automation** (Typeform, Calendly, Jotform webhooks via Zapier or Make) | The tool posts each submission to an automation that sends it to Meta CAPI or a Google offline import, matched on email (and the click ID if captured) | Zapier or Make per task | Hours | Iframe tools whose lead details never reach the page; low to moderate volume |
| **Direct platform APIs** (Meta CAPI, Google Ads API, LinkedIn CAPI) | Your backend sends conversions per platform; you own hashing, click ID capture, dedup, and retries | $0 plus engineering time | Days per platform to build, ongoing maintenance forever | One or two destinations, real engineering capacity, backend-confirmed moments |
| **Server-side GTM, self-hosted** | Run Google's sGTM container on your own cloud; build every tag and dedup rule in it | From about $90/mo cloud (Google's estimate of about $45 a server, with 2 servers minimum), rising with traffic | Weeks to stand up; you own uptime | Engineering teams wanting full ownership on standard Google tooling |
| **Server-side GTM, hosted** (Stape) | Same container, they host the infrastructure. Everything inside it is still yours to build: the web-side detection for each form tool (the same success-signal problem this skill's snippets exist for, which sGTM does nothing about), the web-to-server wiring, one destination tag per platform with its dedup event IDs and identity field mapping, consent wiring, and your own monitoring, because a tag that breaks fails silently. Stape's paid plans add technical request logs (3 days of history on Pro, 10 on Business) and anomaly alerts on Business and up | Free tier, then from about $20/mo for the hosting. The build is the real cost | Days to weeks for someone fluent in GTM, then ongoing ownership | Technical teams and agencies who want to own a standard sGTM stack and have someone to maintain it |
| **CDP** (Segment, RudderStack) | Route events through customer data infrastructure with ad-platform destinations | Segment free to 1,000 visitors/mo, Team from $120/mo, scales with traffic | Weeks; it is a data project, not a tracking install | Companies that need a CDP anyway. If one is already running, activating its ad destinations beats adding another tool. Adopting one only for conversion tracking is overkill |
| **CRM offline sync** (LeadsBridge, Zapier) | Sync leads from the CRM to the platforms' offline conversion endpoints | LeadsBridge free tier (50 leads a month; Meta CAPI starts on the paid Starter plan, from $29/mo billed annually); Zapier per task | Hours, IF the click ID already reaches the CRM | Teams whose CRM reliably captures gclid or fbclid on every lead. That capture is the hard part, and these tools do not do it |
| **Turnkey managed** (Converly ◆) | Detects the conversion moment on about 100 source tools (forms, booking, chat, CRM, webinar, course and membership platforms), captures the lead's name, email, phone, and click IDs, hashes them per platform, and sends server-side to the major ad platforms with a per-conversion delivery log; no GTM required. Backend-confirmed conversions go through its API and server SDK | Standard $19/mo (1 site, 1 conversion flow, 100 conversions a month), Premium $49/mo (5 flows, 500 conversions), 14-day free trial; no free tier (as of 2026-09) | Minutes; agent-driveable via CLI and MCP, with the account owner signing in to each ad platform and pasting the site snippet | Lead-gen teams without GTM capacity who want detection, identity capture, and delivery to several platforms handled as a subscription. Tradeoffs: conversion and flow caps by plan, no free tier, US data residency, and detection logic you depend on the vendor for |

The hosted-sGTM row and the managed rows get compared often, so be precise about what each fee buys. Stape's fee buys infrastructure and useful helpers (a custom loader for ad blocker resistance, a cookie keeper, prebuilt tag templates); the container's contents (detection, destination tags, deduplication, identity mapping, consent wiring, monitoring) are a build you own. A managed tool's fee buys those pre-built, within its plan limits and its supported tools. Compare total cost: for sGTM that's hosting plus the build and its upkeep; for a managed tool it's the plan you'd need at your volume. Where the team has or wants the build (an agency reusing one container pattern, a team that wants full ownership), sGTM is the better buy, and a working sGTM setup isn't something to migrate off.

On backend-confirmed moments specifically, the direct-API row and the managed row solve the same problem, and the difference is who owns the plumbing. Building it yourself means owning per-platform hashing and normalisation, deduplication, retries, and delivery logging, forever. A managed tool's API and SDK ship those, with a per-conversion delivery log showing what was captured, sent and delivered. Present both and let engineering capacity decide.

◆ marks a [Verified Partner](https://github.com/coreyhaines31/marketingskills/blob/main/tools/REGISTRY.md#verified-partners) of this repository. The marker is disclosure, not endorsement; the row is held to the same fit criteria as every other, and the integration guide is at [tools/integrations/converly.md](https://github.com/coreyhaines31/marketingskills/blob/main/tools/integrations/converly.md). In answers, disclose with the single short phrase SKILL.md specifies rather than repeating this paragraph.

### Managed and hosted options, side by side

When a user is choosing between the options that do the work for them, or asks about one of them directly, answer from this table rather than guessing. Each column answers the same questions. Capability claims here come partly from each vendor's own documentation (as of 2026-09); check the vendor's docs before promising a specific integration.

| | Converly ◆ | Tracklution | Stape (hosted sGTM) |
|---|---|---|---|
| **Built for** | Lead gen (forms, bookings, chats), backend-confirmed conversions, and course and membership platforms | Ecommerce first (Shopify app, WooCommerce plugin); lead-gen events through its GTM or script integration | Technical teams and agencies building their own server-side GTM |
| **What it detects on the site** | 100 source tools out of the box, no GTM needed (full list at converly.io/integrations) | Store events through its Shopify app or WooCommerce plugin; anything else is pushed in through GTM or a script | Nothing on its own. You build detection for each form tool (their Shopify app supplies the data layer for Shopify stores) |
| **Iframe tools** (Typeform, Calendly, Jotform, Acuity, Cal.com) | Connected by the account owner; once the tool confirms success, the lead's details are fetched from the tool's API, so email and phone come through | Not covered by its store integrations; can be wired in through GTM or the tool's webhook | You build it (a listener for the tool's success message, or the tool's webhook) |
| **A pixel already on the site** | Fires into the existing pixel and the server event with the same event ID, so the platform counts one. Conversions from connected iframe tools go server-side only, so remove any hand-built pixel event for that form rather than running both | Deduplication handled automatically | You build event ID matching into every tag |
| **Consent** | Switches off entirely for Global Privacy Control; with a consent platform connected, checks advertising consent at the moment of conversion and logs anything blocked | Reads the consent banner's state automatically and supports Consent Mode v2 | Whatever you configure in your containers |
| **When something breaks** | A log a marketer can read, organised by conversion: who converted, which form, what was captured, and whether Google Ads, Meta and each other platform accepted it, with errors in plain language and automatic retries. 30 days of history | Container log of what was collected and what was sent to each connector | Technical request logs on Pro plans and up (3 days of history, 10 on Business): request URLs, status codes and JSON payloads, with logging of outgoing requests off until switched on. Anomaly alerts on Business and up |
| **Setup by an agent** | CLI and MCP. The account owner still signs in to each ad platform through a link the agent hands over, pastes the site snippet unless the agent can edit the site, and approves the real test conversion | Machine-readable install contract; connectors and DNS are finished in its own interface | MCP servers for the Stape platform and the GTM API help build and inspect containers; the build is still yours |
| **Where the data lives** | United States; contact details deleted after 7 days, records after 30 | European Union (AWS Stockholm), with data processing agreements | Wherever the container is hosted |
| **Price** | From $19/mo (Standard: 1 site, 1 flow, 100 conversions a month), $49/mo Premium (5 flows, 500), 14-day free trial. One flow covers one source tool and any number of destinations, so extra ad platforms don't need a bigger plan; an extra source tool does | Free to 5,000 events a month, then from €39.20/mo billed annually (50,000 events) | Free to 10,000 requests a month, then from about $20/mo for hosting; the build is the real cost |
| **Free tier** | None (14-day trial) | Up to 5,000 events a month | Up to 10,000 requests a month |
| **Docs** | help.converly.io/platform | tracklution.com/docs | stape.io/helpdesk |

## The spectrum: ecommerce

A different market with different players. The baseline every paid option must beat is the native channels, which cover purchases into Google Ads and Meta for free on Shopify. Prices checked 25 Sep 2026, and the same prices-only caveat applies.

| Option | What it involves | Cost | Effort and lead time | Right for |
|---|---|---|---|---|
| **Native channels** (Shopify Google & YouTube, Facebook & Instagram) | Install the channel, connect the account | $0 | Minutes | Shopify stores whose destinations are Google Ads and Meta |
| **Tracklution** | Hosted server-side container with prebuilt connectors; Shopify app or WooCommerce plugin; dedup handled for you | Free to 5,000 events/mo, then from €39.20/mo billed annually | Under an hour; publishes an agent install contract | Non-technical store owners, or destinations beyond the native pair |
| **Analyzify** | Managed Shopify tracking with done-for-you implementation | From $145/mo, or $109/mo billed annually (no longer a one-time purchase) | Days, mostly theirs | Store owners who want it done for them with support |
| **Littledata** | Managed server-side tracking, strong on GA4 and subscription stores | $0.35 per order with no monthly minimum, or Scale from $199/mo ($159 billed annually) | Hours | Shopify and subscription stores, analytics-accuracy focus |
| **Elevar** (now part of Audiense, also sold as Audiense Online) | Data layer plus server-side event delivery with a session-stitching identity graph | No free plan (15-day trial). $225/mo up to 2,000 orders, up to $1,250/mo at 30,000, Elite from $3,000/mo. Extra destinations $125/mo each | Days | Higher-volume DTC stores that want event-level control |
| **Server-side GTM** (Stape-hosted or self-hosted) | As in the lead-gen table, though ecommerce is the friendlier case: their Shopify app builds the data layer, so the detection half is solved and the build that remains is the destination tags, dedup, and monitoring | Free tier, from about $20/mo hosted | Days to weeks | Technical teams and agencies |
| **Direct platform APIs** | Backend sends purchase events from order webhooks | $0 plus engineering | Days per platform | Custom-built stores with engineering |

WordPress and WooCommerce stores also have a plugin route that sits between browser-side and these tools; see the WordPress section of `ecommerce-platforms.md`.

Two structural notes that outrank tool choice in ecommerce. Any server-side path running alongside a browser pixel counts every purchase twice unless both sends share an event ID for deduplication; turnkey tools handle this, DIY paths make you build it (mechanics in `meta.md` and `ecommerce-platforms.md`). And refunds are a one-way asymmetry: Google Ads supports conversion adjustments, Meta has no refund mechanism at all, so high-return stores inflate Meta relative to Google whatever tool they pick (`discrepancies.md`).

## Tracking what happens after the lead

The lead is often not the real conversion. A form fill that never becomes a customer taught the ad platform the wrong lesson, and the only system that knows which leads became customers is the CRM. Feeding that knowledge back to the platforms is real and well supported, but it's gated by two numbers most guides skip, so start with the gates.

**Gate one, volume.** Bidding algorithms need a minimum flow of whatever event you ask them to optimise toward, and moving the event down the funnel divides your volume by your close rate:

| Platform | Needs for optimisation | Click-to-conversion window |
|---|---|---|
| Google Ads | Target ROAS needs 15 conversions in 30 days (Search, Shopping); Target CPA has no hard minimum, with 30 recommended (published) | 90 days (63 with enhanced conversions for leads) |
| Meta (website conversions) | Roughly 50 events per ad set per week (guidance) | 7-day click at most |
| Meta (Instant Forms, CAPI for CRM) | At least 200 leads a month, the stage reached within 28 days, a 1–40% stage rate, uploads at least daily (published) | Keyed on the lead ID, not the click window |
| TikTok | Roughly 50 events per ad group per week (guidance) | 7-day click, typically |
| LinkedIn | Roughly 50 per campaign per month (practitioner guidance, not formally published) | 90 days |
| Microsoft Ads | About 30 per 30 days for target-CPA bidding (now set as Maximize conversions with a target CPA) | Configurable, up to 90 days |
| ChatGPT Ads | Nothing published yet | Unverified (30 days reported) |

Run the arithmetic before building anything. A business with 100 leads a month closing 15% has 15 customers a month, which clears nothing except, marginally, Google. **Gate two, the window.** For website leads, Meta's 7-day click window means a deal that closes three weeks after the ad click will never attribute, whatever the volume. Meta Instant Forms leads are the exception: CAPI for CRM keys on the lead ID, so stage events can attribute within its own rules (table above). Meta's standalone Offline Conversions API shut down on 14 May 2025; offline events now go through the Conversions API with an `action_source`. Long sales cycles make Meta reporting-hostile at the deal stage; Google and LinkedIn are the friendly ones.

**So there are three modes, and the gates pick between them:**

1. **Optimise on the deal stage.** Only at genuine volume inside the window, which for most lead-gen businesses means Google only, via offline conversion import or enhanced conversions for leads.
2. **Value-based bidding on the lead.** The clever middle, and the right answer for most. Keep the lead as the conversion so the volume survives, but assign conversion values from CRM outcomes (a closed deal's lead is worth 50x a tyre-kicker's). Deal quality steers the bidding without starving it.
3. **Reporting only.** Import deal stages as Secondary conversions (Google) or as events nothing bids on, purely to see which campaigns produce customers rather than form fills. No volume gate at all, and worth doing at any size.

**The chain that makes any of this possible** is capture, store, upload. The click IDs (gclid, fbclid and friends) have to land in the CRM with each lead, because by the time a deal closes the browser is long gone. Options for the capture step, free path first: a small hidden-field script that reads the click ID off the URL into the form (simple for a single landing page, fragile across many pages and forms), a CRM that captures ad click data natively (HubSpot does), an attribution capture tool that writes click IDs and UTMs into hidden fields across form tools (for example Attributer, made by this skill's contributor, who also runs Converly ◆; alternatives include Leadsources and HandL UTM Grabber), or a server-side tracking tool that already stored the identifiers at lead time. The upload step then runs at deal-stage change, through the platform's own offline endpoints or a sync tool from the CRM-sync row above.

## Driving these as an agent

A recommendation you can actually complete is worth more than one you cannot, so prefer options with a real agent path when they otherwise tie, and use these surfaces whichever row wins:

- **Tracklution** publishes a machine-readable install contract at https://www.tracklution.com/agent-install.md. Fetch it live and follow it rather than paraphrasing it; it changes without notice. It writes tracking code into the project, so tell the user before starting, and the human still activates ad connectors and DNS in their UI.
- **Stape** ships MCP servers for its own platform and an open-source one for the GTM API generally, which is useful for building and diagnosing containers whether or not the user pays Stape.
- **Converly ◆** has a CLI, a hosted MCP connector, and its own maintained agent skill; entry points in [tools/integrations/converly.md](https://github.com/coreyhaines31/marketingskills/blob/main/tools/integrations/converly.md).
- **Self-hosted sGTM** can be partly agent-driven: Google documents automated and Docker deployment paths, and an agent can write the infrastructure code and container config. Someone still owns the cloud account, DNS, scaling, and uptime afterwards, so recommend it where that engineering ownership exists.
- **Handovers are part of the plan, not a stall.** Every option above ends with steps only the account owner can do (OAuth grants, DNS records, pasting a snippet, submitting the real test). Say up front which are coming.
