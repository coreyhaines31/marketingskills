# Modern Meta Playbook (Andromeda Era)

Meta launched the **Andromeda** algorithm in 2025, which fundamentally changed Meta ads. The old playbook (interest stacking, polished video creative, single-winner scaling) underperforms. The new playbook:

## Creative volume is the constraint (statics > polished video)
- Andromeda is "a hungry panda" — it needs constant fresh creative or it fatigues
- **Statics often outperform video in 2026** because:
  - Meta's algorithm has a bias toward statics — it can show more statics per session per user, so they're cheaper to deliver
  - Static creative is 10x cheaper and faster to produce than video, enabling the volume Andromeda needs
  - Even top advertisers running 17+ VSLs report that down-and-dirty native statics often beat 2.5-month-production VSLs
- **Dedicate 1 hour per week** to producing fresh creatives for your winning offer. Volume > polish.

## Creative IS the targeting (broad audience + specific creative)
- The old playbook: stack interests, narrow the audience, hope to find the right buyer
- The new playbook: target broadly (just the country) and let the creative do the targeting
- **Long-form ad copy works better than short-form** in 2026 — gives Meta a wider context window to understand who to show the ad to
- Test it: take your best winning ad with interest-stacked targeting, duplicate it, remove all targeting (just pick the country), run side-by-side for 7 days. Check CPAs. Broad typically wins.

## The one-keyword hack (identity-trigger keywords)
- Take your winning ad
- Duplicate it with a niche/identity keyword inserted in the headline or body copy
- *"Here's how to get 462 leads per week on autopilot"* → *"Here's how to get 462 **dental** leads per week on autopilot"* / *"...**lawyer** leads..."* / *"...**property investment** leads..."*
- The keyword is an **identity trigger** for the viewer AND a targeting signal for Andromeda
- Dramatically drops CPL and opens audience pockets you couldn't reach with a generic ad

## AI variant farming (the 100-people test)
- Take your winning ad
- Feed to Claude/ChatGPT/Kong with the prompt:
  > *"I want you to read this ad and be the author. If I show the next ad I'm going to ask you to write to 100 people, not 1 in 100 would be able to tell you it's written by a different person. Now write this for [demographic/niche]."*
- The output should read essentially the same with subtle relevance shifts for the target
- Apply in sequence: body copy → headlines → creative
- Drop all variants in a CBO, let Meta's AI allocate spend
- **Limit:** variants this close count as one concept to Andromeda. Use them to localize a proven winner. Testing volume has to come from new concepts, which are what reach new people (see "Creator ads at volume" below).

## Zombie campaigns
- After running a CBO, Meta will give 80% of variants no spend
- Take the dead variants you have **high conviction** about
- Launch them in a separate ad set ("zombie campaign")
- Typically resurrects 20% as winners that Meta's first allocation passed over

## Don't make ads look like ads
- Hundreds of millions of people have ad blockers — the polished-ad aesthetic kills performance
- Study what content **natively performs** in your niche on TikTok/Instagram/YouTube → produce ads that match that aesthetic
- **Burner account technique:** create a clean Instagram/TikTok account, follow all influencers and pages in your niche, like their content. Your feed becomes a curated view of what's natively winning. Produce ads that match.
- If you have an organic video with millions of views, **run that exact video as a paid ad** — proven content + paid distribution = the highest-leverage move

## Creator ads at volume
Wispr Flow went from about 100 to over 3,500 ads in its Meta account in nine months (October 2026, their head of performance marketing). The lessons that carry over to any creator-led program:

- **Meta groups ads it judges too similar** (practitioners put the line at roughly 60% similarity) and limits their delivery. A hundred creators making the same talking-head video amount to one concept, and copies of a winner pull reach from the winner too.
- **Plan on three axes.** Every ad argues one **concept** (a single product truth, which is 90% of ads), through one **angle** (saves time at work, works with the tools I already use), to one **awareness level** (new to the category, or a power user looking for something better). The matrix shows which feature, said which way, to which audience, is winning. Without it you pay Meta and your creators for lessons you can't read back out.
- **Optimize for a quality event.** For PLG products, find the action that predicts a retained user (Wispr Flow uses words dictated past a habit threshold), send it to Meta, and judge ads on it. Downloads and signups alone reward ads that bring people who never come back. If that event is too rare to optimize on, optimize up-funnel and judge on it anyway (see [meta-decision-system.md](meta-decision-system.md) for the 50-conversions-a-week bar).
- **Test the funnel inside Instagram's in-app browser before spending a dollar.** Swipe up from a real ad preview on a phone: the page loads, the promise matches what the creator said, and every event and parameter lands in your analytics. Safari on desktop doesn't count.
- **Read the funnel stage by stage.** Strong hook and hold rates but no clicks: the ad earned attention but not the swipe. Clicks but no conversions: the landing page breaks the creator's promise. Conversions from low-quality customers: look at targeting and campaign structure, and try cost caps.
- **Give each ad about five days before judging it.** A Friday launch meets a different audience than a Monday one. A testing winner can also die when it graduates to a scaling budget an order of magnitude larger; graduate in steps you can afford and watch each one.
- **Keep a lessons file that feeds the briefs.** Wispr Flow keeps a marketing repo that collects what each test taught (in ads, landing pages, newsletters, and creator partnerships) and drafts the next round of creator briefs from it. **marketing-loops** has the monthly-creative-retro loop for this.

For recruiting, paying, and briefing the creators themselves, see the performance-paid creator program in the **influencer-marketing** skill.

## Ad sequencing (build the path, not one winner)

Meta's ranking model reads a person's activity as an ordered timeline: ad clicks, conversions, and organic engagement, each in sequence (Meta Engineering's posts on its GEM ads model, November 2025 and October 2026). The practical read: the second ad someone sees is judged against the first. Stop testing every ad in a vacuum and ask what ad 2 says to someone who already saw ad 1.

**Explicit sequencing in auction campaigns** rolled out in early 2026, account by account. The setup is narrow, so check Meta's current help docs before planning around it:

- Objective: Awareness (Maximize reach) or Engagement (ThruPlay). Not available on Sales or Leads.
- Frequency control set to **Target frequency**, not the default cap.
- **Lifetime budget** at the ad set level, at least 7 days, with Advantage campaign budget off.
- At least two ads published in the ad set.

**Size the sequence to the flight.** Campaign length and the frequency window cap how many ads fit: a 3-week flight showing one ad every 7 days fits three. Two or three ads is the usual range; longer paths lose people along the way.

**A typical path:** hook → problem → proof (testimonial or case study) → offer. Each ad assumes the previous one was seen, so ad 3 doesn't re-explain the product.

**The trade-off:** target frequency usually costs more per impression than standard delivery, so judge a sequence on downstream conversions (ideally against a holdout), not CPM. For conversion objectives, where sequencing isn't available, approximate the path with engagement retargeting: video viewers or engagers from the hook ad get the proof ad, then the offer.

*Sequencing framing from Cody Schneider (October 2026); setup requirements from Jon Loomer's testing and Meta's documentation as of early 2026.*
