# Payback Period Budgeting

The gate before every channel decision: **can I afford this channel?** Advertising has to be **deterministic** — $1 in, more than $1 out, on a clock you can name. Payback Period is how you set the clock.

## Kill LTV:CAC first

**LTV:CAC is a useless, often destructive metric.** It feels rigorous and is usually a lie. Four flaws:

1. **It assumes all customers churn.** LTV bakes in an eventual death for every account. Your best customers don't churn — they compound. A metric that pre-writes everyone's obituary underprices your actual base.
2. **It assumes churn is evenly timed.** It isn't. Baremetrics data shows **more churn happens in the first 3 months than in any other window** — front-loaded, not smooth. Blended LTV smears that spike into a flat average and hides the real risk (and the real payback math).
3. **It hides per-plan variance under blended ARPU.** A $9/mo plan and a $999/mo plan get averaged into one number that describes neither. The channels, creative, and payback that work for the $9 buyer are nothing like the $999 buyer — but blended LTV:CAC says "3:1, we're fine" and you scale the wrong thing.
4. **It ignores revenue delay.** Free trials, free plans, and long sales cycles mean money arrives weeks or months after CAC is spent. LTV:CAC treats acquisition and revenue as simultaneous. They're not. The gap is where startups run out of cash.

A "healthy" 3:1 LTV:CAC can sit on top of a channel that bankrupts you, because the ratio never asks *when the cash comes back*.

## The replacement: Payback Period

**Revenue-only ratio = CAC / monthly ARPU.** For acquisition-cost recovery use **gross-margin payback = CAC / (monthly ARPU × gross margin)**, with gross margin as a fraction. The revenue-only ratio assumes 100% gross margin; it excludes serving costs. See [the CAC payback definition](https://chartmogul.com/saas-metrics/cac-payback/).

The simplified ratio is in **months** and assumes steady monthly gross profit with no churn or collection delay. **A 3–12 month target is a planning reference.** Choose a target using your cash runway, margins and cohort recovery; a shorter or longer ratio alone does not justify changing spend.

Because it's per-cohort and per-plan (not blended), it exposes exactly what LTV:CAC hides.

### Worked example — same CAC, wildly different payback

Say a channel costs **$300 to acquire a customer** (CAC = $300). The table below is revenue-only, before serving costs and churn; it is a comparison, not permission to scale:

| Plan | ARPU (monthly) | Revenue-only ratio = CAC / ARPU | Verdict |
|------|---------------|----------------------|---------|
| Starter | $9 | 300 / 9 = **33.3 months** | Don't fund paid acquisition for this plan. 33.3 months before costs and churn, and longer once margin is included. |
| Pro | $99 | 300 / 99 = **3.0 months** | Check margin first. At 80% gross margin it's 3.8 months; at 20% it's 15.2 months, which is too slow to scale. |
| Enterprise | $999 | 300 / 999 = **0.3 months** | Scale, after confirming when cash is actually collected (annual invoices, net-60 terms). |

Same CAC does not imply the same affordability. At 20% gross margin the $99 plan takes 300 / (99 × 0.20) = **15.2 months** even before churn, despite its 3.0-month revenue-only ratio. Compare plans separately and verify serving costs before approving spend.

The practical move: compute recovery **per plan (or per cohort)** against measured margin, retention and cash timing. Use the 3–12 month target as a planning assumption to compare with runway, not a universal approval rule.

## Cohort recovery — account for when churn happens

`CAC / (ARPU × annual retention)` is not discounted payback. A single year-end retention percentage cannot identify the monthly recovery path. Time-value discounting requires an explicit discount rate; retention describes customer survival.

For a cohort, find the first month where cumulative gross profit per original acquired customer covers CAC:

```
Cumulative recovery through month n = sum(ARPU_t × gross_margin_t × retained_fraction_t)
```

Use measured retained revenue per original customer instead when available; do not multiply by retention again. Include collection delay when assessing cash recovery. If the observed cohort has not recovered CAC, report that rather than inventing a payback date.

Example: CAC $300, ARPU $99 and 80% gross margin. Two cohorts both retain 70% at month 12:
- Early loss: 70% retained in every month 1–12 → $55.44 monthly gross profit per original customer; recovery first crosses $300 in **month 6**.
- Late loss: 100% retained in months 1–11, 70% at month 12 → $79.20 for the first eleven months; recovery crosses $300 in **month 4**.

The old single-retention ratio gives the same 4.3 months to both cohorts and ignores gross margin. Their actual recovery differs despite identical year-end retention.

## Using it as the channel gate

1. Compute CAC for the channel (all-in: spend / customers, including creative and management).
2. Compute gross-margin payback and check the measured cohort recovery path, including revenue collection timing.
3. Compare recovery with runway and your chosen target (the 3–12 month band is a planning reference). Do not scale on a revenue-only ratio or annual retention multiplier.
4. Re-run monthly — CAC drifts up as you scale; the gate moves with it.

This composes with breakeven CPL/CPC math in [b2b-paid-playbook.md](b2b-paid-playbook.md): breakeven tells you the *most* you can pay per lead; payback tells you *how long your cash is tied up* — you need both to scale without running dry.

## Two adjacent rules

**OOH without social amplification is a waste of money.** Out-of-home (billboards, transit, print) has no click, no pixel, no deterministic loop on its own. It only pays back when it's engineered to be photographed, posted, and amplified on social — the OOH buys the moment, social buys the reach. Running OOH with no social plan is buying awareness you can't measure or compound.

**Narrative momentum** (ad copy): the strongest-performing ads carry a story forward rather than restate a pitch — each line earns the next, building tension toward the CTA instead of front-loading features. Pair it with the discipline of **testing one variable at a time** (copy, then creative, then audience) so you can tell what actually moved payback. Depth on both lives in the **ad-creative** skill; this file only flags them as levers that change your CAC.

---

*Source: Corey Haines, *Founding Marketing*, ch. 7 ("Spend budget where customers spend their time"). Payback targets and the Baremetrics first-3-months churn finding are practitioner-reported — recalibrate against your own cohort data. For attribution of the CAC inputs, see the **attribution** skill; for setting ARPU and plan structure, see the **pricing** skill.*
