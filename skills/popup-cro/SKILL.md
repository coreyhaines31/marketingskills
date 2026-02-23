---
name: popup-cro
description: Designs popup layouts, writes conversion copy, configures display triggers and timing, implements frequency capping, and A/B tests popup variants. Use when the user wants to create or optimize popups, modals, overlays, slide-ins, or banners for conversion purposes. Also use when the user mentions "exit intent," "popup conversions," "modal optimization," "lead capture popup," "email popup," "announcement banner," or "overlay." For forms outside of popups, see form-cro. For general page conversion optimization, see page-cro.
metadata:
  version: 1.0.0
---

# Popup CRO

## Initial Assessment

**Check for product marketing context first:**
If `.claude/product-marketing-context.md` exists, read it before asking questions. Use that context and only ask for information not already covered or specific to this task.

Before providing recommendations, understand:

1. **Popup Purpose**
   - Email/newsletter capture
   - Lead magnet delivery
   - Discount/promotion
   - Announcement
   - Exit intent save
   - Feature promotion
   - Feedback/survey

2. **Current State**
   - Existing popup performance?
   - What triggers are used?
   - User complaints or feedback?
   - Mobile experience?

3. **Traffic Context**
   - Traffic sources (paid, organic, direct)
   - New vs. returning visitors
   - Page types where shown

---

## Trigger Strategies

### Time-Based
- **Not recommended**: "Show after 5 seconds"
- **Better**: "Show after 30-60 seconds" (proven engagement)
- Best for: General site visitors

### Scroll-Based
- **Typical**: 25-50% scroll depth
- Indicates: Content engagement
- Best for: Blog posts, long-form content
- Example: "You're halfway through—get more like this"

### Exit Intent
- Detects cursor moving to close/leave
- Last chance to capture value
- Best for: E-commerce, lead gen
- Mobile alternative: Back button or scroll up

### Click-Triggered
- User initiates (clicks button/link)
- Zero annoyance factor
- Best for: Lead magnets, gated content, demos
- Example: "Download PDF" → Popup form

### Page Count / Session-Based
- After visiting X pages
- Indicates research/comparison behavior
- Best for: Multi-page journeys
- Example: "Been comparing? Here's a summary..."

### Behavior-Based
- Add to cart abandonment
- Pricing page visitors
- Repeat page visits
- Best for: High-intent segments

---

## Popup Types

| Type | Goal | Key Practice |
|------|------|-------------|
| **Email Capture** | Newsletter subscription | Clear value prop, single field, specific CTA ("Get Weekly Tips") |
| **Lead Magnet** | Content for email | Show preview of what they get, minimal fields, instant delivery |
| **Discount/Promo** | First purchase | Clear discount amount, deadline urgency, single use per visitor |
| **Exit Intent** | Last-chance conversion | Different offer than entry popup, address objections |
| **Announcement Banner** | Site-wide communication | Top of page, dismissable, time-limited |
| **Slide-In** | Less intrusive engagement | Corner/bottom entry, doesn't block content, easy dismiss |

---

## Implementation Code

### Exit Intent Detection

```javascript
document.addEventListener('mouseout', function(e) {
  if (e.clientY < 0 && !sessionStorage.getItem('popup_shown')) {
    showPopup();
    sessionStorage.setItem('popup_shown', 'true');
  }
});
```

### Frequency Capping with localStorage

```javascript
function shouldShowPopup(popupId, cooldownDays = 7) {
  const key = `popup_dismissed_${popupId}`;
  const dismissed = localStorage.getItem(key);
  if (dismissed && Date.now() - parseInt(dismissed) < cooldownDays * 86400000) {
    return false;
  }
  return true;
}

function dismissPopup(popupId) {
  localStorage.setItem(`popup_dismissed_${popupId}`, Date.now().toString());
}
```

### Tracking Events

```javascript
// Track popup interactions
analytics.track('popup_shown', { popup_id: 'exit-intent-discount', trigger: 'exit_intent' });
analytics.track('popup_converted', { popup_id: 'exit-intent-discount', email: true });
analytics.track('popup_dismissed', { popup_id: 'exit-intent-discount', method: 'close_button' });
```

---

## Copy Guidelines

- **Headlines**: Benefit-driven or curiosity-based ("Get [result] in [timeframe]", "Join [X] people who...")
- **CTA buttons**: First-person, value-focused ("Get My Discount", "Send Me the Guide")
- **Decline options**: Polite, non-manipulative ("No thanks", "Maybe later")
- **Subheadlines**: Address objections or set expectations ("No spam, ever", "Weekly tips in 5 min")

---

## Frequency and Rules

### Frequency Capping
- Show maximum once per session
- Remember dismissals (cookie/localStorage)
- 7-30 days before showing again
- Respect user choice

### Audience Targeting
- New vs. returning visitors (different needs)
- By traffic source (match ad message)
- By page type (context-relevant)
- Exclude converted users
- Exclude recently dismissed

### Page Rules
- Exclude checkout/conversion flows
- Consider blog vs. product pages
- Match offer to page context

---

## Compliance and Accessibility

### GDPR/Privacy
- Clear consent language
- Link to privacy policy
- Don't pre-check opt-ins
- Honor unsubscribe/preferences

### Accessibility
- Keyboard navigable (Tab, Enter, Esc)
- Focus trap while open
- Screen reader compatible
- Sufficient color contrast
- Don't rely on color alone

### Google Guidelines
- Intrusive interstitials hurt SEO
- Mobile especially sensitive
- Allow: Cookie notices, age verification, reasonable banners
- Avoid: Full-screen before content on mobile

---

## Measurement

### Key Metrics
- **Impression rate**: Visitors who see popup
- **Conversion rate**: Impressions → Submissions
- **Close rate**: How many dismiss immediately
- **Engagement rate**: Interaction before close
- **Time to close**: How long before dismissing

### What to Track
- Popup views
- Form focus
- Submission attempts
- Successful submissions
- Close button clicks
- Outside clicks
- Escape key

### Benchmarks
- Email popup: 2-5% conversion typical
- Exit intent: 3-10% conversion
- Click-triggered: Higher (10%+, self-selected)

---

## Output Format

### Popup Design
- **Type**: Email capture, lead magnet, etc.
- **Trigger**: When it appears
- **Targeting**: Who sees it
- **Frequency**: How often shown
- **Copy**: Headline, subhead, CTA, decline
- **Design notes**: Layout, imagery, mobile

### Multiple Popup Strategy
If recommending multiple popups:
- Popup 1: [Purpose, trigger, audience]
- Popup 2: [Purpose, trigger, audience]
- Conflict rules: How they don't overlap

### Test Hypotheses
Ideas to A/B test with expected outcomes

---

## Common Popup Strategies

### E-commerce
1. Entry/scroll: First-purchase discount
2. Exit intent: Bigger discount or reminder
3. Cart abandonment: Complete your order

### B2B SaaS
1. Click-triggered: Demo request, lead magnets
2. Scroll: Newsletter/blog subscription
3. Exit intent: Trial reminder or content offer

### Content/Media
1. Scroll-based: Newsletter after engagement
2. Page count: Subscribe after multiple visits
3. Exit intent: Don't miss future content

### Lead Generation
1. Time-delayed: General list building
2. Click-triggered: Specific lead magnets
3. Exit intent: Final capture attempt

---

## Optimization Workflow

1. **Implement** — Deploy popup with tracking events (shown, converted, dismissed)
2. **Baseline** — Run for 7 days minimum to establish conversion rate
   - *Validate*: ≥1,000 impressions before drawing conclusions
3. **Analyze** — Check conversion rate vs. benchmarks (email: 2-5%, exit intent: 3-10%)
4. **Iterate** — Test one variable at a time (trigger, copy, offer, timing)
   - *Validate*: Run each variant for ≥7 days or ≥500 impressions per variant
5. **Monitor** — Watch close rate and page exit rate for annoyance signals

---

## Experiment Ideas

Key areas to test:
- **Format**: Center modal vs. slide-in, full-screen vs. smaller, banner position
- **Triggers**: Exit intent vs. time delay vs. scroll depth, optimal timing thresholds
- **Copy**: Headline variations, CTA text, urgency vs. value framing, decline text tone
- **Personalization**: Dynamic content by visitor data, segment by traffic source
- **Frequency**: Session caps, cool-down periods, escalating offers across visits

**For detailed experiment variations**: See [references/experiments.md](references/experiments.md)

---

## Task-Specific Questions

1. What's the primary goal for this popup?
2. What's your current popup performance (if any)?
3. What traffic sources are you optimizing for?
4. What incentive can you offer?
5. Are there compliance requirements (GDPR, etc.)?
6. Mobile vs. desktop traffic split?

---

## Related Skills

- **form-cro**: For optimizing the form inside the popup
- **page-cro**: For the page context around popups
- **email-sequence**: For what happens after popup conversion
- **ab-test-setup**: For testing popup variations
