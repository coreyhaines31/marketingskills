# Claim Page & Landing Page Guide — Valuation Outreach

How to build the page where prospects claim their valuation report.

---

## Core Principle

**Show value before asking for anything.**

The prospect just replied to a cold email. They're curious but skeptical. If they click the link and see a login wall, you lose them. If they see their actual data, you win.

---

## Page Structure

### 1. Hero Section (Above the Fold)

```
[Company Logo — yours, not theirs]

{Company Name} — Your Agency Valuation Report
Prepared {Date} | Part of the {Project Name} {Industry} Analysis

┌─────────────────────────────────────┐
│                                     │
│   Estimated Valuation: $X.XM        │
│                                     │
│   ██████████████░░░░  Top 35%       │
│   of {industry} agencies analyzed   │
│                                     │
└─────────────────────────────────────┘
```

**What to show immediately (no gate):**
- Their company name (proves it's personalized)
- The headline valuation number
- Where they rank relative to peers (percentile or tier)
- The date it was prepared

**Why:** This is the "wow moment." They see their number instantly. Now they're hooked and want to understand it.

---

### 2. Summary Metrics (Still Visible, No Gate)

Show 3-5 key metrics with visual indicators (bars, scores, color coding).

```
Key Metrics Snapshot

Service Diversification    ████████░░  Strong
Estimated Revenue Range    ████████████  $X-$XM
Market Positioning         ██████░░░░  Average
Digital Presence Score     █████████░  Above Average
Growth Indicators          ███████░░░  Moderate
```

**Include a one-sentence explanation under each metric:**
- "Based on your service offerings and market positioning..."
- "Compared to {number} agencies in {niche/region}..."

---

### 3. The Gate (Soft Transition to CTA)

After the free summary, introduce a natural break where they take an action to see more.

**Option A: Email Gate**
```
Want the full breakdown?

Enter your email to unlock the detailed report —
including methodology, comparables, and recommendations.

[Email field] [Get Full Report]

Your data stays private. We don't share or sell emails.
```

**Option B: Account Creation**
```
Create your free account to:
✓ See the detailed valuation breakdown
✓ Get updated when your valuation changes
✓ Compare against industry benchmarks

[Create Account] or [Continue with Google]
```

**Option C: Direct CTA (No Gate on Report)**
```
── Full Report Below ──

[Full report content visible]

...

────────────────────

Want to discuss your results?

[Book a 15-Minute Call]    [Get Detailed Analysis]
```

**Recommendation:** Option C (no gate on the report) works best for small batches. You're building trust, not collecting leads at scale. Let them see everything, then offer the next step naturally.

---

### 4. The Full Report Section

If ungated or after gate completion, show the detailed breakdown.

**Section 4a: Valuation Breakdown**
```
How We Calculated Your Valuation

Revenue Estimate          $X — $X
  Based on: team size, service rates, client indicators

Valuation Multiple        X.X — X.Xx
  Based on: service mix, recurring revenue %, niche

Estimated Range           $X.XM — $X.XM

Methodology: We analyze public signals — website content,
team size indicators, service offerings, market positioning,
and industry benchmarks from {source}. This is an estimate,
not a formal appraisal.
```

**Section 4b: Strengths & Opportunities**
```
What's Working
• {Specific strength — e.g., "Strong service differentiation
  in the SEO + content space"}
• {Specific strength}
• {Specific strength}

Where There's Opportunity
• {Specific gap — e.g., "No visible case studies or social
  proof on the website"}
• {Specific gap}
• {Specific gap}
```

**Section 4c: Peer Comparison**
```
How You Compare

                    You     Avg     Top 25%
Service Range       8       5       10
Digital Presence    72      58      85
Positioning Score   6.5     5.2     8.1
```

Don't name specific competitors. Use anonymized benchmarks ("agencies in your revenue tier," "top quartile in your niche").

---

### 5. Conversion CTA Section

At the bottom of the report, present the next step.

```
What's Next?

Your valuation is a snapshot — here's how to act on it.

[Primary CTA Button — e.g., "Book a Free Strategy Call"]

Or:
• Download as PDF
• Get quarterly updates
• See methodology details
```

**CTA Copy Options:**

| Goal | Button Text | Supporting Copy |
|------|-------------|-----------------|
| Book a call | "Discuss Your Valuation" | "15 minutes. No pitch. Walk through your numbers with an analyst." |
| Detailed report | "Get the Deep Dive" | "Full methodology, comparable transactions, and growth recommendations." |
| Account signup | "Track Your Valuation" | "Create a free account to get updated when your numbers change." |
| PDF download | "Download Your Report" | "Save a copy for your records or share with your team." |

---

## Design Principles

### Do
- Use their company name prominently — at least 3 times on the page
- Show real numbers immediately — the valuation should be visible within 2 seconds
- Use clean, professional design — this is a report, not a marketing page
- Include methodology notes — transparency builds credibility
- Make it mobile-friendly — founders check email on their phones
- Load fast — no heavy animations or video backgrounds

### Don't
- Don't put a login wall before any data is shown
- Don't use aggressive countdown timers or fake urgency
- Don't plaster your own branding larger than their company name
- Don't show competitor names or sensitive third-party data
- Don't require phone number or company size to see the report
- Don't use popup modals on the claim page — they already clicked through from email

---

## URL Structure

**Recommended format:**
```
https://yourdomain.com/report/{unique-id}
```

Or with company slug:
```
https://yourdomain.com/valuation/{company-slug}
```

**Important:**
- Use unique IDs, not guessable sequential numbers
- Don't put the company name in a query parameter (looks spammy in email previews)
- HTTPS required (obviously)
- Make the URL short enough to look clean in an email reply

---

## Technical Checklist

- [ ] Page loads in < 2 seconds
- [ ] Company name renders correctly (watch for special characters)
- [ ] Valuation data populates dynamically (not hardcoded)
- [ ] Mobile responsive
- [ ] CTA buttons work and track clicks
- [ ] Analytics tracking on page view, scroll depth, CTA clicks
- [ ] Open Graph / social meta tags (in case they share the link)
- [ ] No broken states if data is missing (graceful fallbacks)
- [ ] Privacy-safe: no PII exposed in URL or page source

---

## Post-View Tracking

Track these events to trigger follow-up emails:

| Event | Trigger |
|-------|---------|
| Page viewed | Start 24-48 hour follow-up timer |
| Scrolled past summary | They're engaged — higher priority follow-up |
| Clicked CTA | Route to appropriate conversion flow |
| Downloaded PDF | Strong interest signal |
| Visited multiple times | Very warm — prioritize personal outreach |
| No view after 48 hours | Send a nudge: "Did you get a chance to look?" |
