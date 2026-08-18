# WhatsApp Marketing Playbooks & Scripts

Ready-to-deploy playbooks, conversation flows, and interactive message templates for high-converting WhatsApp marketing programs.

---

## Playbook 1: Click-to-WhatsApp (CTWA) Lead Gen Funnel

**Goal**: Convert traffic from Facebook/Instagram ads into qualified leads directly within a WhatsApp chat.

### Ad Setup:
* **Objective**: Engagement or Leads (Destination: WhatsApp).
* **Pre-filled User Message**: *"Hi! I'd like to get the free Growth Audit for my SaaS."*

### Automated Chat Flow (Triggered on Inbound message):
```text
Bot (Message 1 - Instant):
Hey {{1}}! 👋 Thanks for reaching out about the Growth Audit. 

To make sure we prepare the exact audit for your team, what's your current stage?

Buttons:
[ 🚀 Pre-revenue / Idea ]
[ 📈 $1k - $10k MRR ]
[ 🏆 $10k+ MRR ]
```

```text
Bot (Message 2 - Branching based on selection):
Got it! What is your product website URL? (Just type it below)
```

```text
User:
https://example.com

Bot (Message 3 - Confirmation & Calendar Booking):
Awesome! We received your details. Would you like our growth lead to send your audit video here or schedule a 15-min live walkthrough?

Buttons:
[ 🎥 Send Video Here ]
[ 📅 Book Live Walkthrough ]
```

---

## Playbook 2: E-Commerce Abandoned Cart Recovery

**Timing**: Send 45–60 minutes after cart abandonment. (Do not send immediately; allow organic completion).

### Message Template (Category: MARKETING):
* **Header**: Image of the abandoned item (dynamic media ID)
* **Body**:
  ```text
  Hey {{1}}, you left something in your bag at {{2}}! 🛍️

  Your {{3}} is reserved, but stock is running low. Finish your order now and take an extra 10% off with code SAVE10.
  ```
* **Footer**: *Reply STOP to unsubscribe*
* **Buttons**:
  1. URL Button: `[ Complete Order 🛒 ]` (Deep-linked to pre-filled checkout)
  2. Quick Reply: `[ Need Help? 💬 ]` (Routes to live agent or FAQ bot)

---

## Playbook 3: High-Touch Post-Purchase & Review Generation

**Timing**: Send 3–5 days after confirmed delivery.

### Message 1 (Category: UTILITY or MARKETING):
```text
Hey {{1}}, your order of {{2}} arrived a few days ago! How are you enjoying it so far?

Buttons:
[ ⭐ Loving it! ]
[ ❓ Have questions ]
```

### Branching:
* **If "Loving it!"**:
  ```text
  That makes our day! 🙌 Would you mind taking 30 seconds to share your review on Trustpilot/Google? Here's the direct link: {{3}}
  ```
* **If "Have questions"**:
  ```text
  We're here to help! Let us know what's going on or reply to this message and our support team will jump right in.
  ```

---

## Playbook 4: VIP Broadcast & Flash Drop (High Urgency)

**Audience**: Engaged customers who opted in for VIP drops.
**Frequency**: Maximum 1–2 times per month to preserve list health.

### Template (Category: MARKETING):
* **Header**: Video / Image Preview
* **Body**:
  ```text
  🚨 VIP EARLY ACCESS: {{1}} is officially live!

  Because you're on our VIP WhatsApp list, you get first access 2 hours before the public launch.

  Use VIP code {{2}} for free express shipping. Only 200 units available.
  ```
* **Footer**: *Reply STOP to opt out*
* **Buttons**:
  1. URL Button: `[ Shop VIP Drop ⚡ ]`
  2. Quick Reply: `[ Check Sizing 📏 ]`
