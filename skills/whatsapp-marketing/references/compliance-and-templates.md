# WhatsApp Marketing Compliance & Template Guide

This reference provides the technical and regulatory framework for running WhatsApp marketing programs across both the **WhatsApp Business App** and the **WhatsApp Business Cloud API / On-Premises API**.

---

## 1. The Meta 24-Hour Customer Service Window

Understanding conversation windows is critical to avoid failed message deliveries and high costs:

### User-Initiated Conversations (Inbound)
* When a customer sends a message to your WhatsApp Business number, a **24-hour service window** opens.
* During this 24-hour window, you can send free-form session messages (text, media, audio, interactive menus) without pre-approval from Meta.
* Every inbound reply from the customer resets the 24-hour timer.

### Business-Initiated Conversations (Outbound)
* Any message sent **outside** the 24-hour window (or initiating a new chat from your side) **MUST** use a pre-approved **Meta Message Template**.
* Free-form text will be rejected with an API error (`131047: Re-engagement message`).

---

## 2. Meta Conversation Categories & Pricing

Meta categorizes all outbound WhatsApp template messages into 4 types:

| Category | Description | Example |
| :--- | :--- | :--- |
| **Marketing** | Promotions, product announcements, discount drops, cart recovery, re-engagement. | *"Hey Alex! Your cart items are selling out fast. Get 15% off with code FLASH15."* |
| **Utility** | Order confirmations, tracking updates, billing statements, booking confirmations. | *"Your order #4921 has shipped! Track delivery here: [Link]"* |
| **Authentication** | One-time passcodes (OTP), account verification, 2FA logins. | *"Your verification code is 849201. It expires in 10 minutes."* |
| **Service** | User-initiated support responses within the 24-hour window. | Free-form problem-solving and support replies. |

> [!IMPORTANT]
> Meta automatically re-classifies templates upon submission. If a utility template includes promotional language (e.g. *"Your order has shipped! Also check out our new arrivals"*), it will be rejected or re-categorized as **Marketing** (which incurs higher per-message fees).

---

## 3. Opt-In & Opt-Out Requirements

WhatsApp has a zero-tolerance policy for unsolicited spam. A high block/report rate will immediately downgrade your phone number's quality score and suspend your messaging tier.

### Valid Opt-In Methods
1. **Website Checkbox / Form**: An explicit, unchecked opt-in checkbox during checkout, lead capture, or account registration (e.g., *"Receive order updates and exclusive deals on WhatsApp"*).
2. **Click-to-WhatsApp (CTWA) Ads**: When a user clicks a Facebook/Instagram ad with a pre-filled message, their initial message constitutes opt-in for that specific conversation.
3. **Keyword Inbound / QR Codes**: User scans a physical/digital QR code or texts a keyword like `JOIN` or `DEALS` to your number.
4. **Interactive Chat Opt-In**: Asking the customer inside a support conversation: *"Would you like us to notify you via WhatsApp when this item is back in stock?"* with a Quick Reply button `[Yes, notify me]`.

### Mandatory Opt-Out Mechanics
* **Marketing templates must include a 1-tap opt-out button** (Quick Reply `[Stop Promotions]` or `[Unsubscribe]`) or standard keyword instruction (`Reply STOP to unsubscribe`).
* When a user sends `STOP`, `UNSUBSCRIBE`, `CANCEL`, or clicks the opt-out button:
  1. The CRM/system must immediately flag the contact as unsubscribed.
  2. Send a single confirmation message: *"You've been unsubscribed from promotional updates. Reply START anytime to re-subscribe."*
  3. Cease all non-transactional outbound templates immediately.

---

## 4. Phone Number Quality Rating & Messaging Limits

Every WhatsApp Business API phone number has a **Quality Rating** and a **Messaging Tier**:

### Quality Ratings
* **Green (High Quality)**: Low block/report rate. Full messaging speed and capacity.
* **Yellow (Medium Quality)**: Warning state. Increased user complaints or blocks.
* **Red (Low Quality)**: Critical state. High block rate. Number is at risk of being throttled or suspended.

### Messaging Tiers (Daily Unique Contacts)
* **Tier 1**: 1,000 unique business-initiated contacts per 24 hours.
* **Tier 2**: 10,000 unique business-initiated contacts per 24 hours.
* **Tier 3**: 100,000 unique business-initiated contacts per 24 hours.
* **Tier 4 (Unlimited)**: Unlimited unique contacts per 24 hours.

### How to Upgrade Tiers Safely
* You automatically jump to the next tier when:
  1. Your quality rating is **High (Green)**.
  2. In the past 7 days, you sent messages to at least 50% of your current tier limit.
* **Warming up a new number**: Never blast 1,000 cold contacts on day one. Start with 100–200 high-intent, recent opt-ins who expect your message to establish a clean initial quality rating.

---

## 5. Standard Interactive Message Formats

Interactive WhatsApp messages convert 2–3x higher than plain text blocks.

### Format A: Quick Reply Buttons (Up to 3 buttons)
```json
{
  "type": "button",
  "sub_type": "quick_reply",
  "index": "0",
  "parameters": [
    { "type": "payload", "payload": "OPT_IN_VIP" }
  ]
}
```
* Use for simple choices: `[Yes, Claim 15%]`, `[Ask a Question]`, `[Stop Promotions]`.

### Format B: Call-to-Action Buttons (Up to 2 buttons)
* **URL Button**: Opens browser (e.g. `[Complete Checkout 🛒]`).
* **Phone Call Button**: Initiates phone call (e.g. `[Call Support 📞]`).

### Format C: Interactive List Messages (Up to 10 items)
* Best for catalog browsing, booking slots, or multi-step qualification flows.
