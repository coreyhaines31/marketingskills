# Converly

> **◆ Verified Partner integration.** Converly sponsors Marketing Skills. This integration is disclosed and vetted for fit; it does **not** change what any skill recommends. It's listed here alongside the neutral options for the same job — use it when it's the right fit, not because it's a partner. See [Verified Partners](../REGISTRY.md#verified-partners).

Server-side conversion tracking for lead generation. When a visitor submits a form, books a meeting, or starts a chat, Converly sends the conversion to your ad platforms and analytics tools from its servers, with the lead's details attached so each platform can match it to the ad click.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | REST API for conversions your backend confirms. [developers.converly.io](https://developers.converly.io) |
| MCP | ✓ | Hosted MCP server at `https://app.converly.io/mcp` ([setup guide](https://converly.io/mcp)). An agent can do the setup and read the conversion log; the account owner signs in to each ad platform and installs the site snippet |
| CLI | ✓ | `@converly/cli`. JSON output by default, built for agents |
| SDK | ✓ | `@converly/sdk-node` for conversions only your backend can confirm (a verified signup, an API-received lead) |

## What it does

- **Sources (100).** Form builders (Gravity Forms, WPForms, Contact Form 7, Elementor, Fluent Forms, Formidable, Ninja Forms, Webflow, Framer, Wix, Squarespace and more), iframe tools connected by the account owner (Typeform, Jotform, Calendly, Acuity, Cal.com), chat (Intercom, LiveChat, Drift, HubSpot Chat), CRMs and email platforms (HubSpot, Salesforce, Pipedrive, HighLevel, ActiveCampaign, Mailchimp, Klaviyo), and course and membership platforms (Kajabi, Teachable, Thinkific, LearnDash). Full list under Supported tools below.
- **Destinations (18).** Google Ads, Meta Ads, Google Analytics, LinkedIn Ads, TikTok Ads, Microsoft Ads, Reddit Ads, ChatGPT Ads, Snapchat Ads, X Ads, AdRoll, Taboola, BuySellAds, and the privacy analytics tools Plausible, Fathom, GoSquared, Simple Analytics and Pirsch.
- **What travels with each conversion.** The lead's name, email and phone, the ad click IDs (gclid, gbraid, wbraid, fbclid, ttclid, li_fat_id, rdt_cid and ChatGPT's oppref), IP address and user agent. Contact details are formatted and hashed the way each platform requires, which is what Google's Enhanced Conversions and Meta's match quality run on.
- **Only confirmed successes count.** It fires on the tool's own success signal, never on a button click or a thank-you page load, so submissions the form rejects, including ones its spam protection blocks, aren't counted. For iframe tools, the lead's details are fetched from the tool's API once it confirms the submission.
- **Deduplication.** Where the platform's own tag is on the site, Converly fires into it and sends the server event with the same event ID, so the platform counts one conversion. Conversions from connected iframe tools are sent server-side only.
- **Delivery.** Failed sends retry automatically, and a recovery job picks up anything interrupted. A conversion that can't be delivered within about an hour is marked failed with the reason, so a lost connection shows up rather than failing silently.
- **Conversion log.** Organised by conversion, in terms a marketer can read: who converted, which form, what was captured, and whether each platform accepted it. Opening one shows the exact fields sent, the API request, the platform's response, and a plain-language error when something failed. 30 days of history.
- **Privacy.** Stops entirely when a browser sends Global Privacy Control. With a consent platform connected, it checks advertising consent at the moment of conversion. Passwords, card numbers and similar fields are never read. Data is hosted in the United States (Supabase and Railway); contact details are deleted after 7 days and conversion records after 30. An optional privacy mode keeps personal data out of the log entirely.
- **Pricing.** Standard $19/mo (1 site, 1 conversion flow, 100 conversions a month), Premium $49/mo (5 flows, 500 conversions), Enterprise custom. 14-day free trial. A flow is one source tool sending to any number of destinations, so one contact form going to Google Ads, Meta and GA4 is a single flow; a second tool, like a Calendly widget next to a Gravity Forms form, is a second flow.
- **Platform-reported results (these measure the platform features Converly uses, not Converly itself).** Meta says advertisers with a Conversions API setup saw an average 17.8% lower cost per result ([Meta, April 2026](https://www.facebook.com/business/news/pixel-conversionsapi-updates)). Google says advertisers using enhanced conversions saw an average 11% more Search conversions than with standard conversion imports ([Google, September 2026](https://blog.google/products/ads-commerce/data-strength-updates/)).

## Supported tools

Check this list before telling a user a tool is or isn't covered. Taken from [converly.io/integrations](https://converly.io/integrations) on 25 Sep 2026; the live page is the source of truth.

**Sources (100):** Gravity Forms, Contact Form 7, WPForms, Elementor, HubSpot Forms, Calendly, Typeform, Jotform, Intercom, ActiveCampaign, Wix Forms, Webflow, Squarespace, LiveChat, Acuity Scheduling, Tawk.to, Drift, Cal.com, Tally Forms, Ninja Forms, Formidable Forms, Fluent Forms, Forminator, Formstack, Framer, Marketo, Chili Piper, ClickFunnels, Unbounce, Pardot, Fillout Forms, Eloqua, HighLevel, Qualified, Paperform, Zoho Forms, OnceHub, Zoho SalesIQ, FormAssembly, Instapage, Avada, Duda, YouCanBookMe, Keap, Netlify, WS Form, GetLeadForms, Formsite, HubSpot Chat, HubSpot Meetings, Everest Forms, HappyForms, SureForms, Bloom, Hello Bar, OptinMonster, Popup Builder, Popup Maker, Square Appointments, Mindbody, Jobber, ServiceTitan, Housecall Pro, Mailchimp, Klaviyo, Brevo, Constant Contact, AWeber, GetResponse, MailerLite, Kit, MailPoet, Newsletter, Salesforce, Pipedrive, Systeme.io, Beaver Builder, Bricks, Brizy, Divi, SeedProd, Demio, Livestorm, WebinarJam, Goldcast, Kajabi, Teachable, Thinkific, LearnDash, LearnPress, Sensei, Tutor LMS, Mighty Networks, Paid Memberships Pro, ProfilePress, Ultimate Member, WishList Member, ThriveCart, Easy Digital Downloads, Wix Bookings.

**Destinations (18):** Google Ads, Meta Ads, Google Analytics, ChatGPT Ads, Microsoft Ads, TikTok Ads, LinkedIn Ads, Snapchat Ads, X Ads, Reddit Ads, AdRoll, Taboola, BuySellAds, Plausible, Fathom, GoSquared, Simple Analytics, and Pirsch.

## Authentication

- **CLI:** `converly login` opens a browser sign-in, or `converly login --device` prints a code for headless and remote agents. The session token stays on the user's machine. In CI or anywhere a login isn't possible, set `CONVERLY_API_KEY` instead.
- **MCP:** sign in through the MCP client's own connection flow.
- **Ad platforms:** the account owner connects each one on the platform's own sign-in screen. Credentials are stored in an encrypted vault, separate from conversion data, and never pass through Converly's interface. An agent cannot connect an account itself; it hands the user a link.
- **API and SDK:** server-side keys start with `sk_live_`, and the SDK signs requests with a `webhookSecret`. Both belong in environment variables or a secret manager, never in the repo or the browser.

## CLI

### Install

```bash
npm install -g @converly/cli     # Node 20+, zero dependencies
converly login --device          # or `converly login` on a machine with a browser
```

### Setup

`converly status` returns an ordered checklist, with the next command or question for each step. Run it first and again after every step, and follow it over any memorised sequence.

```bash
converly status
converly sites update <site_id> --domain https://example.com       # conversions from other domains are rejected
converly install snippet <site_id>                                  # the user pastes this into <head> on every page
converly destinations connect google-ads --site <site_id>           # returns a link the account owner opens
converly handoffs wait <handoff_id>                                 # confirms the connection finished
converly triggers connect typeform --site <site_id>                 # only for iframe tools that need a connection
converly destinations conversions google-ads                        # pick the conversion action to fire
converly flows create --site <site_id> --name "Contact form" --trigger gravity-forms --destination google-ads --conversion-id <id>
converly flows validate <flow_id>                                   # lists blockers without changing anything
converly flows publish <flow_id>
```

Nothing is captured until the flow is published, the snippet is installed, and the site's domain is set. Then the user submits a real test and the agent confirms it in the log.

### Common commands

```bash
converly events list --status failed            # recent conversions, filterable by flow, email, status, date
converly events get <event_id>                  # per-destination result for one conversion, and why it failed
converly install status <site_id>               # has the snippet ever been seen on the site?
converly destinations list                      # which platforms are connected
converly triggers                               # supported source tools, and which need a connection
converly destinations types                     # supported destinations
```

`converly test-event` sends a real conversion to platforms with no sandbox, so it requires `--allow-real` and the user's approval. `converly flows delete` requires `--yes`.

Converly also maintains its own agent skill for the full setup: `npx skills add converlyio/converly-agent`.

## Common Agent Operations

### Set up tracking for a form

Run the setup sequence above. The steps only a person can do are signing in to each ad platform, pasting the snippet into the site, and submitting the real test form. Say up front that those three are coming.

### Check whether a lead reached the ad platforms

Given the lead's email, `converly events list --email lead@example.com` then `converly events get <event_id>` shows whether each destination accepted it, and if not, why. Contact details are only searchable for 7 days.

### Diagnose "nothing is tracking"

Check the three conditions first: `converly install status <site_id>` (is the snippet live), the site's domain in `converly status`, and whether the flow is published. Then `converly flows validate <flow_id>` for anything else blocking it.

### Report a conversion your backend confirms

Install `@converly/sdk-node` on the backend, mark the form or button that starts the conversion with `data-converly-signup-intent` so the browser half is captured, then call `completeSignup` once the conversion is real (for example, after email verification). The SDK pairs it with the visitor's click IDs.

## How it fits the skills

- Converly is one of the server-side options compared in `conversion-tracking` → `references/server-side.md`, alongside direct platform APIs, server-side GTM (self-hosted or through Stape), CDPs, CRM sync tools and Tracklution. That skill owns the choice between them; this guide covers using Converly once it's the fit.
- It's also one way to **implement** the server-side send described in `attribution` → `references/first-party-tracking.md`. The strategy (what to count, source of truth, how to read the numbers) still comes from `attribution` and `analytics`.
- After conversions flow, judge results with `ads` discipline: never sum conversions across attribution windows, and treat vendor lift figures as a hypothesis to verify with a holdout.

## Links

- Site: https://converly.io
- Integrations: https://converly.io/integrations
- Pricing: https://converly.io/pricing
- Platform docs: https://help.converly.io/platform
- Developer docs and API: https://developers.converly.io
- MCP: https://converly.io/mcp
