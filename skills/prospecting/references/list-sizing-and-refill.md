# List Sizing and Refill

How to size and segment a list when outbound runs as experiments, and how to keep a running campaign stocked without letting unvalidated or mismatched leads in.

For testing whether a signal works, see [signal-testing.md](signal-testing.md). For validation and dedupe, see [sourcing-and-enrichment.md](sourcing-and-enrichment.md).

## Segment first, then source

Build one list per segment or signal, not one big list. In one project, the narrow, specific segment got about 3× the human replies per contacted lead of the broad one (5.9% against 2.1%). A segment is narrow when one problem fits all of it.

Before pulling a single lead, write the segment's pain in one line: "[Who] struggles with [problem] because [reason]." If two parts of the list need different lines, they are two segments.

## Cohort size

| Motion | Default cohort | Why |
|--------|----------------|-----|
| SaaS / B2B | About 80 leads | Big enough to read, small enough to kill |
| Local SMB | About 100 leads | Lower reply rates need more sends per read |

Under about 25 leads, a cohort can't say anything on its own. In one set of runs, lists of 1, 17, 19, 26, 37, 54, and 73 leads were built across different signals; the ones under 25 could only be read together with others. For a list that small:

- **Merge** it with another list that shares the same pain line and offer, keeping `signal_name` so the readout can still split them, or
- **Wait** for the next wave to fill it.

A campaign of 1 to 20 leads is not worth running alone. Write the lead count per segment down before launch, next to the readout date. A pilot split between a signal and a control arm is the exception: run it small to catch a large effect, and say that up front (see [signal-testing.md](signal-testing.md)).

## Order of operations

Validation costs credits, so cut before you validate:

1. **Source** candidates for one segment.
2. **Cut obvious non-fits**: competitors, wrong persona, out of ICP, and anyone on the do-not-contact list.
3. **Dedupe** in this order: the sending workspace, the blocklist, prior campaigns, and any sister brand sharing the workspace. Keep one contact per company per campaign.
4. **Validate** what's left (see the catch-all policy in [sourcing-and-enrichment.md](sourcing-and-enrichment.md)).
5. **Tag and route**: persona, wave, source tool, signal, signal date.

## Weekly refill

A running campaign needs fresh leads. Refill it the same way every week:

1. **Pull** new candidates from the same sources and filters.
2. **Dedupe** against the workspace, blocklist, prior campaigns, and sister brands.
3. **Tag each lead with a persona** using the persona signal packs below.
4. **Validate**, then re-validate anything that sat more than 7 days before upload.
5. **Route** each lead to the campaign for its persona.
6. **Hold the rest.** Leads whose persona has no campaign yet go in a hold file, not into the nearest campaign. When the hold file reaches cohort size, it becomes a campaign.
7. **Set the `wave` variable** (`w1`, `w2`, ...) on every lead, so refills inside one campaign stay separable in the readout.

## Gated vs ungated top-up

| | Gated refill | Ungated auto top-up |
|---|---|---|
| What it is | The weekly recipe above | The sending tool's built-in lead finder adds leads to the campaign |
| Validation | Your validator and policy | Skips your validator |
| Persona routing | Yes | No |
| Use it for | The main supply | A volume backup only |

**Pause the ungated top-up first** when bounces rise, before touching anything else. Its leads are the ones that skipped validation. Tag its leads with their own `source_tool` and `wave` so they can be read and cut separately.

## Persona signal packs

A persona signal pack is the written rule set for tagging a lead to one persona. It makes tagging fast and consistent, and lets the weekly refill run without judgment calls.

```markdown
## Persona: [name, e.g. founder_agency]

**Title rules:** [include: Founder, Owner, Managing Director] [exclude: Intern, Assistant]
**Company rules:** [industry, size band, geography, business model] [exclude: competitors, agencies we partner with]
**Signal rules:** [which signals qualify, with the freshness window for each]
**Pain line:** [one line: who struggles with what, and why]
**Target campaign:** [campaign name, or "hold" if none yet]
```

One pack per persona. A lead that matches no pack goes to the hold file; a lead that matches two goes to the one with the stronger signal.

## Lead sheet columns

Add these to every lead sheet for experiment-run outbound, alongside the standard columns in SKILL.md:

```csv
persona,wave,source_tool,signal,signal_date
```

## Common mistakes

- Sourcing one broad list and segmenting it after the fact.
- Running a 15-lead campaign and reading its reply rate as a result.
- Validating before cutting competitors and duplicates, and paying for leads you'll drop.
- Pushing an unmatched persona into the nearest campaign instead of the hold file.
- Leaving the ungated top-up running while bounces climb.
- Mixing refill waves with no `wave` field, so the readout can't tell week 1 from week 4.
