# Loop Template

A copy-paste template for authoring your own marketing loop. Fill every one of the nine parts — a loop missing its **state/idempotency**, **self-check**, or **stop/bail-out** isn't a system, it's a way to do the wrong thing on a schedule.

Before you start, sanity-check that this *should* be a loop at all (see "When NOT to loop" in `SKILL.md`): it's recurring, signal-driven, and doesn't require human judgment to set strategy or creative direction each run.

---

## Blank template (copy this)

```markdown
### The <name> loop
- **Check cadence**: <how often it looks — match to how fast the signal changes, not how often you'd like an update>
- **Acts when**: <the action condition — what must be true to actually DO something vs. just check and skip. Most runs should skip.>
- **Purpose**: <the ONE outcome this loop exists to move>
- **Skills used**: <which marketing skills the loop orchestrates each run>
- **Loop body**:
  1. <step — usually: pull data / diff vs. last run>
  2. <step — identify what, if anything, crossed the action condition>
  3. <step — draft or stage the response>
- **Self-check**: <the verification done BEFORE acting — is the signal real vs. noise/seasonality/tracking bug? Is the sample big enough to be significant?>
- **State / idempotency**: <what it remembers between runs — last-run marker, dedupe key, cooldown window, "already handled" set — so it doesn't double-act or re-nag the same people>
- **Stop / bail-out**: <when it skips, halts, escalates to a human, or disables itself — plus what it does on error. Include a human checkpoint before anything that spends money or publishes.>
- **Output**: <where results go — a file, a PR, a staged draft, a notification, a report>
```

---

## Fill-in prompts (answer these, in order)

1. **What outcome does this protect or grow?** (rankings, ad efficiency, activation, retention, revenue, referrals) → *Purpose*
2. **How fast does that signal actually change?** (hours / days / weeks / months) → *Check cadence*
3. **What has to be true before it's worth acting?** (a threshold crossed, a new item appeared, a regression vs. baseline) → *Acts when*
4. **What data does it read and what does it produce each run?** → *Loop body* + *Output*
5. **What would make it act on a false signal?** (noise, seasonality, a tracking break, too-small a sample) → *Self-check*
6. **What must it remember so it doesn't repeat itself?** (dedupe key, cooldown, last-run marker) → *State / idempotency*
7. **When should it stop, skip, or hand off to a human?** (no action needed, error, spend/publish decision, N failed attempts) → *Stop / bail-out*

If you can't answer 5, 6, and 7 concretely, the loop isn't ready to run.

---

## Worked example (blank → filled)

Say you sell a freemium API tool and want to stop losing signups who never make their first API call.

```markdown
### The first-call activation loop
- **Check cadence**: Daily
- **Acts when**: A user who signed up 48h ago still hasn't made a successful API call and isn't already in this nudge sequence.
- **Purpose**: Increase the share of new signups that reach first value (first successful API call).
- **Skills used**: `onboarding`, `emails`, `analytics`
- **Loop body**:
  1. Pull signups from ~48h ago and their first-call status.
  2. Filter to those with zero successful calls and no active nudge.
  3. Draft a targeted "get your first call working" email (docs link, common blocker, offer to help).
- **Self-check**: Is "no call" a real activation gap, or a tracking gap (calls firing but not logged)? Confirm against server logs before emailing.
- **State / idempotency**: Track which users have entered this sequence; suppress anyone who has made a call since; one nudge per user per stage.
- **Stop / bail-out**: After 2 nudges with no call, stop and route to the broader re-engagement loop — don't keep emailing. Skip the run entirely if the events pipeline looks stale.
- **Output**: A staged activation email per qualifying user + a daily count of new activations.
```

Notice what makes it safe: the **self-check** guards against a tracking bug emailing active users, the **state** stops it re-nagging, and the **stop** caps attempts and hands off instead of looping forever.

---

## Ship checklist

Before you schedule a new loop, confirm:

- [ ] All nine parts are filled — especially self-check, state, and stop.
- [ ] Cadence matches signal speed (you're not checking daily for a weekly-moving signal).
- [ ] It's designed so **most runs do nothing** — it acts only on a real condition.
- [ ] Anything that **spends money or publishes** has a human checkpoint (unless caps + an allowlist are explicitly authorized).
- [ ] State prevents double-acting and re-nagging the same people.
- [ ] There's an error path (stale data → report "stale," don't fabricate movement) and a manual off switch.
- [ ] For scheduling mechanics, see the "Scheduling a loop" section in `SKILL.md`.

Once it runs, give it a few cycles and ask the "is this a vanity loop?" question: if nobody acts on the output, delete it.
