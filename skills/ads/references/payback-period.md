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

**Payback Period = CAC / ARPU** (monthly).

The answer is in **months** — how long until a customer pays back what you spent to acquire them. **Target 3–12 months.** Under 3 is often leaving growth on the table; over 12 means you're financing customers longer than most early-stage balance sheets can survive.

Because it's per-cohort and per-plan (not blended), it exposes exactly what LTV:CAC hides.

### Worked example — same CAC, wildly different payback

Say a channel costs **$300 to acquire a customer** (CAC = $300):

| Plan | ARPU (monthly) | Payback = CAC / ARPU | Verdict |
|------|---------------|----------------------|---------|
| Starter | $9 | 300 / 9 = **33.3 months** | Unaffordable. You wait ~3 years to break even on acquisition — before churn. Do not run this channel for this plan. |
| Pro | $99 | 300 / 99 = **3.0 months** | Healthy. Bottom of the target band. Scale it. |
| Enterprise | $999 | 300 / 999 = **0.3 months** | Excellent. Pays back in ~9 days. Pour budget in. |

Same CAC, same channel. On the $9 plan the channel is a cash incinerator; on the $999 plan it's a printing press. **Blended LTV:CAC would have averaged these into one meaningless "we're fine."** Payback Period forces you to run the channel only for the plans it can actually afford.

The practical move: compute payback **per plan (or per cohort)**, then only turn on paid acquisition for the segments where it lands inside 3–12 months. Route the cheap-plan buyers to organic/product-led motions instead.

## Discounted Payback Period (churn-adjusted)

Raw payback assumes everyone survives to pay you back. They don't — especially in those first 3 months. Adjust for it:

**Discounted Payback Period = CAC / (ARPU × annual retention)**

Multiply ARPU by the fraction of customers still paying, so the denominator reflects real, retained revenue instead of theoretical revenue.

Example: CAC $300, ARPU $99, annual retention 70%:
- Raw: 300 / 99 = 3.0 months
- Discounted: 300 / (99 × 0.70) = 300 / 69.3 = **4.3 months**

Still inside the band — but the discounted number is the one to budget against. When retention is weak, discounted payback blows past 12 months even when raw payback looked fine; that gap is your early warning.

## Using it as the channel gate

1. Compute CAC for the channel (all-in: spend / customers, including creative and management).
2. Compute discounted payback per plan/cohort.
3. **Turn the channel on only where discounted payback ≤ 12 months** (aim for 3–12).
4. Re-run monthly — CAC drifts up as you scale; the gate moves with it.

This composes with breakeven CPL/CPC math in [b2b-paid-playbook.md](b2b-paid-playbook.md): breakeven tells you the *most* you can pay per lead; payback tells you *how long your cash is tied up* — you need both to scale without running dry.

## Two adjacent rules

**OOH without social amplification is a waste of money.** Out-of-home (billboards, transit, print) has no click, no pixel, no deterministic loop on its own. It only pays back when it's engineered to be photographed, posted, and amplified on social — the OOH buys the moment, social buys the reach. Running OOH with no social plan is buying awareness you can't measure or compound.

**Narrative momentum** (ad copy): the strongest-performing ads carry a story forward rather than restate a pitch — each line earns the next, building tension toward the CTA instead of front-loading features. Pair it with the discipline of **testing one variable at a time** (copy, then creative, then audience) so you can tell what actually moved payback. Depth on both lives in the **ad-creative** skill; this file only flags them as levers that change your CAC.

---

*Source: Corey Haines, *Founding Marketing*, ch. 7 ("Spend budget where customers spend their time"). Payback targets and the Baremetrics first-3-months churn finding are practitioner-reported — recalibrate against your own cohort data. For attribution of the CAC inputs, see the **attribution** skill; for setting ARPU and plan structure, see the **pricing** skill.*
