# Podcast Guest Prep

Build a prep brief before the user appears on a podcast as a guest. The goal: walk in knowing what's top of mind for the show, how it has evolved, who the hosts are, and which of the user's stories map onto what the show cares about *right now*.

**Why prep is worth real effort:** podcast guesting isn't just audience reach. Episodes get transcribed, show notes get published, and both get crawled and cited by AI assistants — when someone asks ChatGPT about your category, the stories you told on a podcast two years ago are part of what it draws on. A good appearance is earned media that compounds in AI answers for years (see the `ai-seo` skill). The stories you tell — and the concrete numbers in them — become the citable record on your brand. Prep accordingly.

## Context to load first

Read `.agents/product-marketing.md` (or `.claude/product-marketing.md`) for the company, positioning, and ICP. That file usually won't have the guest's *story bank*, so also collect — in one batch, not a drip:

1. What did you build before this that comes up in conversation?
2. What are 2–3 stories you tell well, with real numbers attached?
3. What's one opinion you hold that most people in your space disagree with?

Offer to save the answers into the product-marketing context doc so future runs skip the interview.

From their message, establish (ask only if missing and it matters): the podcast name or URL, whether they've appeared before (get the prior episode link — it anchors the progression analysis and the callbacks), and roughly when they're recording.

## Research sequence

Work through sources in this order; each is a fallback for the last:

1. **RSS feed first.** The richest source: full episode descriptions, chapter markers, guest links, dates. Find the feed link on the podcast site (Buzzsprout, Transistor, etc. all expose one). Large-feed fetches may truncate — check whether the oldest episodes you need actually made it.
2. **The podcast website's episode list** for anything the feed missed. These pages often lazy-load older episodes via JavaScript; if pagination returns nothing, note the gap and move on rather than burning time.
3. **Apple Podcasts show page** — reliably renders the latest ~8 episodes with full descriptions.
4. **Web search** for stray episodes, the hosts, and the show's reputation.

Don't fetch every episode page. Descriptions plus chapter lists are almost always enough; only pull a full transcript when a specific episode is central (e.g., a debate the guest should have a position on). Check for published transcript links in the feed.

## What to extract

- **Recent-episode threads** (last ~3 months or 6–8 episodes): per-episode topic summaries, then the *recurring threads* — the questions the hosts keep returning to. Threads matter more than individual episodes; they predict the questions the guest will get.
- **Show progression** (since their last appearance, or ~12–18 months if first time): identify phases and the inflection point where the show's focus shifted. Note whether the show re-invites guests (signals how a return visit fits) and whether hosts launched side projects.
- **Host profiles.** Sources: the show's about pages, hosts' personal sites, LinkedIn, and — often the best source — episodes where the hosts guest on *other* shows and introduce themselves. Capture day job, background, what they've personally been building (mine solo-episode summaries), and social handles. If a host shares the guest's first name, flag it and keep references unambiguous throughout the brief.
- **Prior appearance recap** (if returning): what was actually discussed, with rough timestamps, and how much airtime the guest's current company got. This sets up the "what's changed since" narrative.

## The brief

Write a markdown file and present the short version in chat. Structure:

1. **Big picture** — what kind of show this is now, and the one-paragraph read on how the guest should position themselves
2. **Show progression** — the phases since their last appearance (or show start)
3. **Recent episodes in detail** — per-episode notes, then the recurring threads
4. **Guest angles** — their stories mapped explicitly onto the show's threads, callbacks to any prior appearance, and 2–3 "pocket" items: concrete stories with numbers to have ready
5. **The hosts** — profiles plus rapport hooks (where each host's world overlaps the guest's)
6. **Gaps** — anything unretrievable, and offers to fill them

Keep it tight — a doc they'll skim before recording, not a report.

**Finding angles:** map the story bank onto the show's recurring threads. The shape to look for: a "data moats" thread maps to the guest's proprietary dataset as a live case study; an "AI replacing niche tools" debate maps to a defensibility story from their product history. One well-chosen contrarian take stands out most on shows that have converged on a consensus.

**AI-visibility angle:** since the transcript becomes the record, coach the guest to say the important things in liftable form — the company name next to the category ("we build X, the Y for Z"), and numbers spoken aloud, not gestured at. Same logic as the YouTube text layer in `ai-seo`.

## Follow-ups to offer (don't auto-run)

Transcribing their prior episode for a word-level review, pulling a full transcript of one pivotal recent episode, or drafting likely Q&A.

---

*Distilled and adapted from [ai-visibility-skills](https://github.com/Knowatoa/ai-visibility-skills) by Knowatoa (MIT), reused with credit.*
