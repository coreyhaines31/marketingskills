# Affiliate Program Design

Detailed guidance for building and managing affiliate programs.

## Contents
- Commission Structures
- Cookie Duration
- Affiliate Recruitment
- Affiliate Enablement
- Verify an Existing Partner Link
- Tools & Platforms (Referral Program Tools, Affiliate Program Tools, Choosing a Tool)
- Fraud Prevention (Common Referral Fraud, Prevention Measures)

## Commission Structures

**Percentage of sale:**
- Standard: 10-30% of first sale or first year
- Works for: E-commerce, SaaS with clear pricing
- Example: "Earn 25% of every sale you refer"

**Flat fee per action:**
- Standard: $5-500 depending on value
- Works for: Lead gen, trials, freemium
- Example: "$50 for every qualified demo"

**Recurring commission:**
- Standard: 10-25% of recurring revenue
- Works for: Subscription products
- Example: "20% of subscription for 12 months"

**Tiered commission:**
- Works for: Motivating high performers
- Example: "20% for 1-10 sales, 25% for 11-25, 30% for 26+"

---

## Cookie Duration

How long after click does affiliate get credit?

| Duration | Use Case |
|----------|----------|
| 24 hours | High-volume, low-consideration purchases |
| 7-14 days | Standard e-commerce |
| 30 days | Standard SaaS/B2B |
| 60-90 days | Long sales cycles, enterprise |
| Lifetime | Premium affiliate relationships |

---

## Affiliate Recruitment

### Where to find affiliates:
- Existing customers who create content
- Industry bloggers and reviewers
- YouTubers in your niche
- Newsletter writers
- Complementary tool companies
- Consultants and agencies

### Outreach template:
```
Subject: Partnership opportunity — [Your Product]

Hi [Name],

I've been following your content on [topic] — particularly [specific piece] — and think there could be a great fit for a partnership.

[Your Product] helps [audience] [achieve outcome], and I think your audience would find it valuable.

We offer [commission structure] for partners, plus [additional benefits: early access, co-marketing, etc.].

Would you be open to learning more?

[Your name]
```

---

## Affiliate Enablement

Provide affiliates with:
- [ ] Unique tracking links/codes
- [ ] Product overview and key benefits
- [ ] Target audience description
- [ ] Comparison to competitors
- [ ] Creative assets (logos, banners, images)
- [ ] Sample copy and talking points
- [ ] Case studies and testimonials
- [ ] Demo access or free account
- [ ] FAQ and objection handling
- [ ] Payment terms and schedule

---

## Verify an Existing Partner Link

Use when a partner already shares a referral link and needs to know whether it still credits them (for example after the program sends a new link or changes its offer).

1. Take both exact URLs: the one actually sent to customers (including any shortener) and the one the program now supplies. Trace each redirect chain separately from a clean session with a normal **GET**; `HEAD` can return a different status without exercising the customer path:

   ```sh
   set -o pipefail
   curl -sS --location --max-redirs 8 --max-time 20 --dump-header - --output /dev/null -- "$url" \
     | awk 'tolower($0) ~ /^(http\/|location:)/'
   ```

   Use a separate cookie jar per link if the flow needs cookies, and keep cookie values and per-click IDs out of shared notes. If tracking depends on the browser, use the network's documented click test; a header-only trace is not an end-to-end conversion test.
2. Compare what decides attribution: the network's partner key, presence of a click ID, final HTTP result, market, and the visible offer or signup CTA. Each network has its own parameters; check its docs. For example, PartnerStack uses `ps_partner_key` with `ps_xid`, or `gspk` with `gsxid` (URL-decode the query, Base64-decode the key when encoded; see its [link-testing guide](https://support.partnerstack.com/hc/en-us/articles/360009184274-Sharing-your-link)). Match the key to the partner's known key or the exact link supplied for that account. A campaign name or UTM alone does not prove ownership.
3. Reuse the program-issued share URL as supplied rather than a landing URL or a generated click ID. Two links can carry the same partner key and still lead to different offers: report an offer mismatch separately from attribution. A tracked redirect only proves the link-level result; for a commission question, check the referred signup and commission status in the partner dashboard.

---

## Tools & Platforms

### Referral Program Tools

**Full-featured platforms:**
- ReferralCandy — E-commerce focused
- Ambassador — Enterprise referral programs
- Friendbuy — E-commerce and subscription
- GrowSurf — SaaS and tech companies
- Mention Me — AI-powered referral marketing
- Viral Loops — Template-based campaigns

**Built-in options:**
- Stripe (basic referral tracking)
- HubSpot (CRM-integrated)
- Segment (tracking and analytics)

### Affiliate Program Tools

**Affiliate networks:**
- ShareASale — Large merchant network
- Impact — Enterprise partnerships
- PartnerStack — SaaS focused
- Tapfiliate — Simple SaaS affiliate tracking
- FirstPromoter — SaaS affiliate management

**Partner Relationship Management (PRM):**
- Introw — Full PRM with deal registration, commissions, tiers, QBRs, and partner engagement tracking ([integration guide](https://github.com/coreyhaines31/marketingskills/blob/main/tools/integrations/introw.md))

**Additional platforms:**
- Rewardful — Stripe-integrated affiliates
- Refersion — E-commerce affiliates

### Choosing a Tool

Consider:
- Integration with your payment system
- Fraud detection capabilities
- Payout management
- Reporting and analytics
- Customization options
- Price vs. program scale

---

## Fraud Prevention

### Common Referral Fraud
- Self-referrals (creating fake accounts)
- Referral rings (groups referring each other)
- Unauthorized coupon distribution or attribution interception
- Fake email addresses
- VPN/device spoofing

### Prevention Measures

**Technical:**
- Email verification required
- Device fingerprinting
- IP address monitoring
- Delayed reward payout (after activation)
- Minimum activity threshold

**Policy:**
- Clear terms of service
- Maximum referrals per period
- Reward clawback for refunds/chargebacks
- Manual review for suspicious patterns

**Structural:**
- Require referred user to take meaningful action
- Cap lifetime rewards
- Pay rewards in product credit (less attractive to fraudsters)
