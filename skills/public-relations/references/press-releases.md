# Press Releases

How to write a press release and where to send it. A release is a dated, public record that something happened, written so a reporter could lift paragraphs from it. It rarely earns coverage by itself. Pitch the story to journalists (see [journalist-pitching.md](journalist-pitching.md)) and treat the release as the reference copy they can check facts against.

## Contents
- When a release is worth it
- Structure
- Writing rules
- Distribution options
- Picking an option
- What wire distribution actually gets you
- Passing wire editorial review
- Timing
- Checklist

---

## When a Release Is Worth It

Write one when:
- Something concrete happened: a launch, a major version, a funding round, an acquisition, a partnership with a named company, a senior hire, or original data
- You want a dated public record that partners, investors, and AI assistants can cite ("when did X launch?", "who led the round?")
- A journalist asks for one, or you're running an embargo and need the canonical text

Skip it when:
- The news is a minor feature or a blog-post-sized update. Put it in the changelog.
- The plan is "send it over the wire and wait for TechCrunch to call." Paid distribution mostly produces syndicated copies on press release sections of news sites. Reporters at tier-1 outlets rarely pick up startup stories from the wire.
- It's material news for a public company. That needs legal and IR review and a disclosure-grade wire. This reference doesn't cover it.

---

## Structure

```
FOR IMMEDIATE RELEASE

[Headline: Company + what happened, under 15 words]
[Optional subheadline: the one fact that makes it matter]

[CITY, State, Month Day, Year] - [Lead: who did what, when, and why it matters, in one or two sentences.]

[Paragraph 2: the detail. What it does, who it's for, the specific numbers.]

[Paragraph 3: proof. A customer result, data, or the problem it fixes.]

"[Quote from a named founder or exec that gives an opinion or a reason, not a feeling]," said [Name], [Title] at [Company].

[Paragraph 4: availability. Price, date, where to get it, link.]

About [Company]
[Two to three sentences. Same text every time.]

Media contact
[Name]
[Email]
[Phone]

###
```

400 to 600 words is the usual range. Most paid wires price by length, so longer costs more.

---

## Writing Rules

- **The headline names the company and the event.** "Acme launches offline mode for its field-service app" beats "Acme redefines field service."
- **The lead stands alone.** If an editor cuts everything after paragraph one, the story should still be there.
- **Specific numbers, with a source.** "Cut onboarding from 9 days to 2 across 40 customers" not "dramatically faster."
- **One or two quotes that say something.** A reason, an opinion, or a prediction. "We're thrilled to announce" is filler a reporter will skip.
- **Third person, past or present tense.** No "we" outside quotes.
- **Same banned words as pitches.** No "revolutionary," "game-changing," "disruptive," "synergy," "best-in-class."
- **A real media contact.** A named person with an email that gets answered the same day.
- **Few links, plain anchor text.** One to three links to your own site, anchored on the brand name or the URL. Google's spam policies name "links with optimized anchor text in articles, guest posts, or press releases distributed on other sites" as link spam. Assume wire links pass no ranking credit; the link-building skill's risk policy covers the rules.

---

## Distribution Options

Prices checked 2026-10-20. PR Newswire and Business Wire don't publish rate cards, so their numbers are third-party estimates. Get a quote before budgeting.

| Option | Cost | What you get | Tradeoffs |
|--------|------|--------------|-----------|
| **Own newsroom page** (`/press` or `/newsroom`) | Free | The canonical copy on your domain, indexed with the rest of your site | Only people who already look for you will find it |
| **[PRLog](https://www.prlog.org)** | Free; optional paid package removes ads | A hosted, search-indexed release page | Low editorial bar, little journalist readership |
| **[EIN Presswire](https://www.einpresswire.com/pricing)** | $149 for 1 release, $499 for 5, $999 for 15 | Syndication to news sites, Google News, and (per their page) an AP News placement | 700-word limit on the single release; placements are syndicated copies, not articles |
| **[PR Newswire](https://www.prnewswire.com)** | No public prices. Estimates: about $800+ for a 400-word US national release, plus a $195 annual membership | The largest newsroom and journalist reach; used for public company disclosure | Cost grows fast with length, images, and add-ons; pricing requires a sales call |
| **[Business Wire](https://www.businesswire.com)** | No public prices. Estimates: about $475 local to $760-$940 national for 400 words | Similar reach to PR Newswire; also disclosure-grade | Same as PR Newswire |

Other mid-priced wires (PRWeb, GlobeNewswire, Accesswire) work like EIN Presswire or the big two. Compare on their current pricing pages.

---

## Picking an Option

Post every release on your own newsroom page first. Then add distribution based on the goal:

| Goal | Fits |
|------|------|
| A dated public record, nothing more | Own newsroom page, optionally PRLog |
| Search presence and syndicated copies for a launch, small budget | EIN Presswire, or another low-cost wire |
| Earnings, M&A, or other material news at a public company | PR Newswire or Business Wire, with legal review |
| An agent running the launch end to end with no human checkout | A pay-per-call wire API (see the registry's Press Release Distribution category), or a human buys a wire package and the agent writes the copy |
| Actual articles written by reporters | None of the above alone. Pitch (see [journalist-pitching.md](journalist-pitching.md)) |

---

## What Wire Distribution Actually Gets You

Set expectations before anyone pays:

- **Copies, not coverage.** Most placements are your text, unchanged, in a press release or partner section of a news site. Some are labeled as paid content.
- **Little direct traffic.** Few people read the press release sections of news sites. The distribution report's "potential audience" number is the sites' total readership, not readers of your release.
- **No ranking credit from the links.** Placements are usually nofollow, and Google treats keyword-anchored wire links as spam anyway.
- **Real but modest value.** Branded search results, a citable source for AI assistants, and a link you can send to partners.
- **Don't claim "as featured in."** A syndicated copy on a site isn't coverage by that outlet. Using its logo as if it were misleads readers and annoys the outlet.

---

## Passing Wire Editorial Review

Paid wires have editors who read every release before it goes out. A release that reads like an ad gets held with "Action Required", and the scheduled date slips until it's fixed. These are the patterns that got releases held on EIN Presswire in November 2026. Other wires apply similar guidelines.

### What gets a release held

| Flag | Example that was held | Rewrite that passed |
|------|-----------------------|---------------------|
| **Question or "How to" headline** | "Can AI Manage LinkedIn Ads, X Ads and Reddit Ads? Acme Brings B2B Ad Platforms into Claude" | "Acme Adds LinkedIn Ads, X Ads and Reddit Ads Support for AI Assistants" |
| **Second or first person outside a quote** | "...shows whether ChatGPT recommends your business" | "...measures whether ChatGPT recommends a business" |
| **Advertorial body** (mainly selling, no news) | "Enter a website and get a scored audit. No credit card required." | "Acme today launched a free audit that scores a website's..." |
| **Imperative calls to action** | "Run it at example.com/audit." | "The audit is available at example.com/audit." |
| **How-to steps and sample prompts** | "1. Add the connector. 2. Sign in. 3. Ask for the work." | "Teams add the connector, sign in, and connect their accounts." |

A release can pass review once and still have these patterns. Editors aren't consistent, so fix all of them before you submit, not only the ones that were flagged.

### Rules that pass

- **The headline is a neutral announcement:** "[Company] Launches / Adds / Announces [thing]". EIN caps it at 120 characters and recommends 80.
- **Open the lead with the company and the event:** "[Company] today announced...". Don't open with a reader's question ("Marketers asking 'Can AI...?' can now...").
- **Third person everywhere except inside a quote.** "You" and "we" are allowed in a quote attributed to a named person, but a quote addressed to the reader ("your buyers") still reads as an ad. Keep quotes about the company's reasoning.
- **Describe availability instead of telling the reader to act:** "is available at", "pricing starts at", not "Try it", "Sign up" or "Get started".
- **Put setup steps and example prompts on your own site,** and link to that page.
- **Add one sentence of context** that makes it news: a shift in the market or a problem the launch responds to. Without it, a product description reads as an advertorial.

### Question-shaped keywords

Question headlines ("How to track brand mentions in ChatGPT") are tempting when the goal is to be cited by AI assistants for that question. Wires reject them. Put the question phrasing on pages you control (an FAQ, a guide, the newsroom copy) and keep the wire headline neutral, while still naming the product category and the platforms.

### Fixing a held or scheduled release

- **A held release:** edit the copy, then answer each issue on the wire's resolve page and resubmit. On EIN that's Resolve Issues, Save Your Answers, then Submit for Review.
- **An approved, scheduled release** can usually be reverted to a draft, edited and resubmitted. It goes back into the review queue, so leave a few business days before its date.
- **Check anchored links after an edit.** EIN's anchor-text links match an exact phrase in the body. If you reword that phrase, update the link's anchor text too, or the link silently disappears.
- **Once a release is distributed it can't be edited.** Get the copy right before the first one goes out, because the first releases set the template for the rest.

### Account verification

New EIN accounts are checked before any release can be submitted. Two things held up one account:

- **The profile has to match a real person and company:** the legal company name, and the account holder's personal LinkedIn rather than the company page.
- **The website has to show a physical business address,** in the footer or on the contact page. A registered-agent address was accepted. A site with only an email address is held until one is added.

---

## Timing

- The usual advice is Tuesday to Thursday, morning US Eastern. Avoid Friday afternoon unless you want it buried.
- Schedule off the hour (8:07, not 8:00). Many releases go out on the hour.
- If a journalist has an exclusive or an embargo, the release goes out when their story runs or when the embargo lifts, not before.
- Update the newsroom page the same minute the release goes live, so anyone who searches finds the canonical copy.

---

## Checklist

- [ ] Is there a concrete event, with a date?
- [ ] Does the headline name the company and the event, with no question or "How to"?
- [ ] Is it in the third person, with no "you" or "we" outside a quote and no "Try it" or "Sign up" calls to action?
- [ ] Does the lead paragraph work alone?
- [ ] Is every number specific and sourced?
- [ ] Does the quote give a reason or an opinion?
- [ ] Is it under 600 words?
- [ ] Are links few, to your own site, with plain anchor text?
- [ ] Is there a named media contact who will answer today?
- [ ] Is it posted on your own newsroom page?
- [ ] Are journalists getting a pitch, not just the release?
