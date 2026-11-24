# Signal Testing

A signal is a hypothesis: "people showing this will reply more than people who don't." This reference covers how to test that against a control, what every signal-sourced lead has to carry so you can learn from it later, what finding each signal cost in real runs, and how to search public posts and transcripts without putting a misquote in copy.

For which signals to try and how fresh they need to be, see [signal-plays.md](signal-plays.md). For how big each cohort should be, see [list-sizing-and-refill.md](list-sizing-and-refill.md).

## A signal has to tie to the pain

A signal only helps when it connects to the problem the offer solves. Otherwise it is just a nicer first line. In one run, generic signal openers (a mention of the signal with no link to the problem) got 1 reply and 1 unsubscribe from 27 contacted leads. A hiring post for a marketing role is a signal for a marketing agency; for an accounting tool it is trivia.

Before sourcing a signal, write one sentence: "This signal means they probably have [problem], because [reason]." If you can't write it, don't source the signal.

## Signal vs control split

To learn whether the signal earns its sourcing cost, split one lead pool into two arms that differ only in the signal:

| | Signal arm | Control arm |
|---|---|---|
| Leads | Half the pool, at random | The other half |
| First line | The specific signal, tied to the problem | No signal line |
| Offer, body, CTA | Same | Same |
| Inboxes, daily limits, send window | Same | Same |

Rules:

1. **Same pool, split 50/50 at random.** Don't put the best-looking leads in the signal arm. Sort by a random column, then alternate.
2. **Change only the signal line.** If the offer or inboxes differ, the result says nothing about the signal.
3. **Write down before launch**: the metric (human replies per contacted lead, with auto-replies and out-of-office excluded), the readout date, the number of leads per arm, and the smallest difference that size can detect.
4. **Say what the test can detect up front.** Small arms only catch large effects. With 19 leads per arm, the signal arm needs about 5 human replies against 0 for the control before the difference is unlikely to be chance (two-sided Fisher exact test, p < 0.05). With 80 per arm, it needs about 8 against 1. A test that comes back "no difference" at these sizes means "no large difference," not "the signal doesn't work."
5. **Don't read it early.** Wait for the readout date, after the last follow-up has had time to land.

A pilot with 19 leads per arm is worth running to catch a large effect cheaply. Treat anything smaller as direction, and confirm it on the next wave. For sample-size math beyond this, see the **ab-testing** skill.

## Required lead variables

Every signal-sourced lead carries its evidence as fields, set at upload:

| Variable | Example | Rule |
|----------|---------|------|
| `project` | `acme-outbound-q4` | Required: missing blocks the upload |
| `source_tool` | `x-search`, `job-board`, `podcast-index` | Required: missing blocks the upload |
| `signal_name` | `hiring_marketing_role` | Required: missing blocks the upload |
| `persona` | `founder_agency` | Required: missing blocks the upload |
| `wave` | `w3` | Required: missing blocks the upload. Keeps refills separable in the readout (see [list-sizing-and-refill.md](list-sizing-and-refill.md)) |
| `signal_detail` | `Posted a Head of Growth role` | Required before the lead is sent the signal line |
| `signal_date` | `2026-11-12` | Required before send. A date field, not a note, so staleness can be checked at send time against the freshness windows in [signal-plays.md](signal-plays.md) |
| `signal_url` | Link to the post, page, or episode | Required before send. Audit trail only; never shown in copy |
| `validation_status` | `valid`, `accept_all_resolved` | Required before send. See [sourcing-and-enrichment.md](sourcing-and-enrichment.md) |

A lead without these fields can't be traced back to the signal, so it can't count in the readout. Control-arm leads carry the same fields, with the signal fields still filled; the copy just doesn't use them.

## Signal source matrix

Fill this table only from real runs, and add a row each time you measure one. A cost or hit rate copied from a vendor page doesn't belong here.

| Signal | Where to find it | Cost per lead | Hit rate | Failure modes |
|--------|------------------|---------------|----------|---------------|
| Public posts about the problem (X) | Keyword search with date operators (`since:`, `until:`) | Well under $0.001 per search call | Not yet measured | Posts that mention the words without the problem; accounts with no company to qualify |
| Podcast transcripts about the problem | Transcript phrase search with a date filter; speaker names from the result highlights | Not yet measured | Not yet measured | No category filter, so results need ICP checks; speaker labels and paraphrases can be wrong (see below) |
| Hiring for a marketing role | Job boards, careers pages | Not yet measured | Not yet measured | Post already filled; recruiter reposts |
| Recent funding | Funding databases, press releases | Not yet measured | Not yet measured | Every vendor sees it; stale after 60 days |
| Website pricing change | Dated snapshots of the pricing page | Not yet measured | Not yet measured | No date for the change without a saved copy or archive snapshot |
| Strong reviews, weak website | Review sites plus the business's own site | Not yet measured | Not yet measured | "Weak" is a judgment; record what you checked |
| Paying for ads, weak website | Public ad libraries plus the landing page | Not yet measured | Not yet measured | See the gap play rules in [signal-plays.md](signal-plays.md) |
| A local job posting | Local job boards | Not yet measured | Not yet measured | Small businesses repost the same role for months |

Finding the contact after the signal is a separate cost. Measured on one set of runs:

| Lookup | Cost | Hit rate | Note |
|--------|------|----------|------|
| Work email from a LinkedIn profile URL | About 1 cent per hit, free on a miss | 35 of 42 profiles (83%) | The best value of the lookup tools tried. The profile URL must come from a licensed source or a manual check, not a scrape |
| Work email from name + company domain | Per lookup | 4 of 12 (33%) | Use only when no profile URL is available |

Divide the cost by the hit rate to compare lookups: the cost per found contact, not per call, is what matters.

## Phrase search for posts, blogs, and podcasts

When the signal is someone describing the problem in public:

1. **Search for the problem in the buyer's words**, not your category name. "Our onboarding emails don't get opened" finds more than "lifecycle marketing."
2. **Add a date filter** so every hit is inside the freshness window. On X, use `since:` and `until:`. For podcast transcripts, which may have no category filter, search transcript phrases with a date filter and take the speaker names from the result highlights.
3. **Qualify every hit against the ICP.** A good quote from outside the ICP is still a skip.
4. **Verify the quote word for word against the source before it goes in copy.** Open the post, page, or episode and match the line exactly. In one run, six lines that were paraphrases, not the speaker's words, were caught this way and rewritten before use. If you can't match it, describe the point in your own words and don't put it in quotation marks.
5. **Confirm who said it.** Transcript speaker labels are sometimes wrong, and hosts paraphrase guests. Check the episode page.
6. **Store the URL in `signal_url`**, not in the message.

## Common mistakes

- Treating a signal as proven because the signal arm got a reply or two.
- Changing the offer between arms, then crediting the signal.
- Reading a 19-per-arm test as "the signal doesn't work" when it could only have detected a large effect.
- Keeping the signal date in a free-text note, so nobody checks it at send time.
- Quoting a paraphrase as if it were the prospect's words.
