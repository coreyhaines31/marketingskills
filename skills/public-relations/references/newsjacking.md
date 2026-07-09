# Newsjacking — Reactive PR Workflow

Injecting your POV into a story that's already trending. Done well: free distribution off a wave of attention. Done badly: cringe at best, brand damage at worst.

## Contents
- When newsjacking works (and when it doesn't)
- The detect → score → angle → pitch loop
- Newsworthiness scoring rubric
- Story angle library
- Speed: the only thing that matters
- Sources & tooling
- Failure modes

---

## When Newsjacking Works

- **Tech/regulatory news in your category** — new law, new platform launch, competitor pivot, big acquisition
- **Industry data drops** — a major report drops, you have a sharper take or contradicting data
- **Public conversation** — a debate or controversy where your expertise is genuinely relevant
- **Seasonal/cyclical moments** — earnings season, year-end reviews, conference weeks

## When to Skip

- **Tragedies, accidents, deaths** — no exceptions. Don't.
- **Politically charged stories** unless your brand explicitly takes political stances
- **You have no genuine expertise** in the area
- **The window is already closed** — if a story is 48h+ old and you weren't first, you're late
- **The angle is "we have a product for this"** — that's marketing, not journalism

---

## The Loop

A repeatable workflow the agent can run on demand or daily (wire it to a Dust Trigger for the daily cadence).

1. **Detect** — surface trending stories in your category (see [Sources & Tooling](#sources--tooling))
2. **Score** — apply the [newsworthiness rubric](#newsworthiness-scoring-rubric); drop anything below threshold
3. **Angle** — generate 2–3 angles per story using the [angle library](#story-angle-library)
4. **Validate** — sanity-check: do you actually have the expertise/data to back this angle?
5. **Pitch** — draft a tight pitch to 3–5 journalists who cover this beat (see [journalist-pitching.md](journalist-pitching.md))
6. **Post** — also publish on your blog, LinkedIn, X — it builds the trail journalists check before quoting you

Output format the agent should produce:

```
NEWSJACK CANDIDATE — 2026-06-10

Story: "EU passes AI Act amendment requiring agent registration"
Source: TechCrunch, 3h ago
Score: 8/10 (high relevance, fresh, you have proprietary data)

Angles:
1. Data hot take: "Our analysis of 12,000 agent deployments shows 73% would fail this requirement"
2. Contrarian: "Why the registration rule will hurt safety, not improve it"
3. Customer story: "How [customer] is preparing — interview offer"

Recommended: #1 (you have unique data, strongest hook)
Pitch draft: [see journalist-pitching.md for template]
Target journalists: [list with rationale]
```

---

## Newsworthiness Scoring Rubric

Score each candidate 1–10 on five dimensions, multiply by the weight, then sum. Max possible: 80 (10 × the 8x weight total).

| Dimension | What it measures | Weight |
|-----------|------------------|--------|
| **Timeliness** | Story <24h old? Window still open? | 2x |
| **Relevance** | Genuinely in your expertise area? | 2x |
| **Angle uniqueness** | Can you say something no one else is saying? | 2x |
| **Authority** | Do you have data, customers, or experience to back it? | 1x |
| **Reach potential** | Will this story keep growing or has it peaked? | 1x |

**Threshold:** weighted total ≥ 50/80. Below that, skip.

**Auto-disqualify if:**
- The story is about something tragic
- Your angle is "I disagree" with nothing to back it
- You haven't actually formed an opinion — you just want to be quoted

---

## Story Angle Library

Use these templates to generate angles fast.

### 1. Data hot take
*"We analyzed [N] [things] after [event]. Here's what we found."*

Best when you have proprietary data. The journalist gets a stat, you get the citation.

### 2. Contrarian
*"Everyone says [popular take]. Here's why they're wrong."*

Best when you can defend the position with specifics. Weak when it's just contrarianism for attention.

### 3. "We predicted this"
*"Six months ago we wrote [thing] — here's what's happening now and what's next."*

Best when you actually did predict it. Lethal to your credibility if you didn't.

### 4. Customer impact
*"Here's a [customer type] who's directly affected. We can put you in touch."*

Best for B2B. Reporters love named customers willing to talk.

### 5. Insider explainer
*"This story is complicated. Here's what's actually happening."*

Best when most coverage is missing nuance. You're not arguing — you're educating.

### 6. Trend connector
*"This isn't isolated — it's part of a bigger shift we're seeing in [pattern]."*

Best when you have several data points or examples to connect.

### 7. Founder POV
*"As someone who's built in this space for [X years], here's the part most people are missing."*

Best for opinion pieces / op-eds. Weak as a soundbite pitch.

---

## Speed: The Only Thing That Matters

Newsjacking decays fast. Approximate windows:

| Story type | Effective window |
|-----------|------------------|
| Breaking tech news | 4–12 hours |
| Major regulation / policy | 24–48 hours |
| Industry report / data drop | 24–72 hours |
| Conference announcement | Same day |
| Acquisition / funding news | 12–24 hours |

**Implication:** if you can't draft and send within the window, don't bother. Set up the loop so detection → pitch takes <2 hours.

---

## Sources & Tooling

Reuses tooling from the `social` skill's listening workflow. Same install: `brew install jq`.

### Google News RSS (no auth)

```bash
# Replace QUERY with topic (use + for spaces, %22 for quotes)
curl -s "https://news.google.com/rss/search?q=QUERY&hl=en-US&gl=US&ceid=US:en" \
  | xmllint --xpath "//item[position()<11]" - 2>/dev/null
```

### Hacker News (Algolia) for tech stories

```bash
SINCE=$(($(date +%s) - 86400))
curl -s "https://hn.algolia.com/api/v1/search_by_date?query=QUERY&tags=story&numericFilters=created_at_i>${SINCE}" \
  | jq '.hits[] | {title, url, points, num_comments, created_at, hn_url: ("https://news.ycombinator.com/item?id="+.objectID)}'
```

### Reddit (for category-specific subs)

```bash
curl -s -A "newsjack/1.0" \
  "https://www.reddit.com/r/SUBREDDIT/top.json?t=day&limit=15" \
  | jq '.data.children[].data | {title, url, score, num_comments, created_utc}'
```

### Journalist research (browser-driven)

For finding *which* journalists are covering the story right now:
- **dev-browser** → Google News search for the story → click through to articles → note the bylines
- Then go to those journalists' X / LinkedIn / Muck Rack profile to confirm beat and recent coverage

See also [journalist-pitching.md](journalist-pitching.md) for the full discovery workflow.

### Source list

For repeatable monitoring, add a "Newsjacking topics" section to `.agents/listening-sources.md` (template in the `social` skill's references):

```markdown
## Newsjacking topics (Google News RSS)
- "AI agent regulation"
- "[your category] funding"
- "[your competitors] OR [adjacent competitors]"

## Industry data drops (RSS / manual)
- Pitchbook reports
- a16z state of [industry] reports
- [your category] benchmark reports
```

---

## Failure Modes

Things that have ended careers and brands.

- **Tragedy-jacking** — Oreo's 2013 Super Bowl tweet worked. Most attempts since have not. Wartime, disasters, deaths: don't.
- **The forced fit** — "Here's our take on [trending story] — it's actually about [our product]." Journalists see through this instantly.
- **The empty take** — pitching "we have an opinion" without specifics. Journalists need a quote-worthy line, not "we're closely watching this."
- **Speed without judgment** — being first with a bad take is worse than being late with a good one. The 30-minute "is this brand-appropriate?" gut check exists for a reason.
- **Pitching the same angle to 50 journalists** — they talk. Get caught once, lose the relationships.
- **No follow-through** — pitch goes out, journalist responds in 20 minutes, founder takes 6 hours to reply. Story moves on.

---

## Companion Practice: The Public Trail

Every newsjack pitch is stronger if the journalist can find evidence you've been thinking about this publicly. Before pitching:

1. Publish a short post (blog, LinkedIn, X thread) with your take
2. Reference it in the pitch ("more thinking here: [link]")
3. This signals you're not opportunistic — you're an actual voice in the space

If you don't have time to publish, you're probably not ready to pitch.
