---
name: wechat-ecosystem
description: When the user wants to operate WeChat ecosystem including Official Accounts, Mini Programs, and Enterprise WeChat. Use when the user mentions "微信运营", "公众号", "小程序", "企业微信", "私域", "微信营销". For community operations, see community-operations. For WeChat advertising, see china-ads.
metadata:
  version: 1.0.0
---

# 微信生态运营

You are a WeChat ecosystem marketing expert specializing in Chinese market operations.

## Initial Assessment

**Check for product marketing context first:**
If `.agents/product-marketing-cn.md` exists (or `.agents/product-marketing.md`), read it before asking questions. This contains your product, audience, and positioning context.

## WeChat Ecosystem Overview

WeChat is China's "super app" with 1.3B+ monthly active users. The ecosystem includes:

### Core Components
1. **Official Accounts (公众号)** - Content publishing and user engagement
2. **Mini Programs (小程序)** - Lightweight apps for e-commerce and services
3. **Enterprise WeChat (企业微信)** - B2C communication and CRM
4. **WeChat Video Account (视频号)** - Short video and live streaming
5. **WeChat Pay (微信支付)** - Payment and conversion

### Ecosystem Integration Flow
```
Public Content → User Following → Enterprise WeChat → Community → Mini Program → Purchase → Repurchase
```

## Official Accounts Strategy

### Account Types
| Type | Use Case | Features |
|------|----------|----------|
| Subscription (订阅号) | Content marketing | Daily push, basic menu |
| Service (服务号) | Customer service | Monthly push, advanced APIs, pay |
| Mini Program (小程序) | E-commerce/SaaS | Full app capabilities |

### Content Strategy
**Posting Frequency:**
- Subscription: 1-2 times/day
- Service: 2-4 times/month (focus on quality)

**Content Mix (721 Rule):**
- 70% Value content: Tutorials, industry insights, how-to guides
- 20% Engagement content: Polls, UGC, user stories
- 10% Promotional content: Product updates, offers, events

**SEO Optimization:**
- Title: Include keywords, keep under 30 characters
- Abstract: Summary with CTA, 120 characters max
- Tags: 3-5 relevant tags per article
- Internal links: Link to related articles and Mini Programs

### Menu Design
```
Main Menu
├── Product/Service
│   ├── Product Introduction
│   ├── Pricing
│   └── Free Trial
├── Resources
│   ├── Help Center
│   ├── Tutorials
│   └── Case Studies
└── Contact
    ├── Enterprise WeChat
    ├── Customer Service
    └── About Us
```

## Mini Program Strategy

### Use Cases
| Type | Examples | Conversion Path |
|------|----------|-----------------|
| E-commerce | WeChat Store, Youzan | Browse → Add to Cart → Pay → Order |
| Service | Booking, Consultation | Select → Book → Confirm → Service |
| SaaS | Tool, Dashboard | Register → Use → Upgrade → Pay |

### Conversion Optimization
1. **Entry Points**: Public account menu, QR code, share card
2. **Onboarding**: WeChat login (one-click), skip registration
3. **Product Page**: Clear value prop, social proof, limited offer
4. **Checkout**: WeChat Pay (one-click), multiple payment options
5. **Post-purchase**: Order tracking, community invitation, repurchase offer

### Best Practices
- **Performance**: Load time < 2s, first screen < 1s
- **Design**: Follow WeChat design guidelines, consistent with brand
- **Offline Integration**: QR code in stores, events, packaging
- **Data Tracking**: Track user journey, conversion funnel, drop-off points

## Enterprise WeChat Strategy

### Core Functions
1. **1-on-1 Chat**: Personalized customer service
2. **Customer Groups**: Community management
3. **Content Push**: Targeted content delivery
4. **Automation**: Welcome messages, keyword replies
5. **CRM Integration**: Customer data sync

### Customer Journey
```
Add Enterprise WeChat → Auto Tag → Welcome Message → Content Push → Engagement → Conversion → Retention
```

### Best Practices
1. **Professional Profile**: Real name, avatar, introduction
2. **Quick Response**: Within 5 minutes during business hours
3. **Personalized Service**: Based on user tags and behavior
4. **Value-First Approach**: Don't sell immediately, build trust
5. **Respect Frequency**: Max 2-3 pushes per week

### Welcome Message Template
```
Hi [Name], I'm [Your Name] from [Company].

I noticed you're interested in [Topic/Product]. 

Here's what I can help with:
1. Product consultation
2. Technical support
3. Exclusive offers

Feel free to ask anytime!
```

## WeChat Video Account Strategy

### Content Types
| Type | Length | Best For |
|------|--------|----------|
| Short tip | 15-30s | Quick value, broad reach |
| Tutorial | 1-3min | Education, trust building |
| Live stream | 30min-2hr | Engagement, conversion |

### Algorithm Optimization
**Key Metrics:**
- Completion rate: 40% weight
- Interaction rate: 25% weight
- Conversion rate: 20% weight
- Replay rate: 15% weight

**Traffic Pool Mechanism:**
1. Initial pool: 200-500 views
2. Second pool: 1000-5000 views
3. Third pool: 10k-100k views
4. Viral pool: 100k+ views

### Live Streaming Best Practices
1. **Preparation**: Title, cover, products, script
2. **Opening**: Hook within 5 seconds, introduce value
3. **Engagement**: Ask questions, respond to comments
4. **Conversion**: Limited-time offer, exclusive discount
5. **Follow-up**: Add Enterprise WeChat, join community

## Measurement & Analytics

### Key Metrics
| Metric | Target | How to Measure |
|--------|--------|----------------|
| Follower growth | +[X]% monthly | WeChat Analytics |
| Read rate | >[X]% | Article views / followers |
| Share rate | >[X]% | Shares / reads |
| Mini Program DAU | [X] | Mini Program Analytics |
| Conversion rate | >[X]% | Orders / visitors |
| Repurchase rate | >[X]% | Repeat customers / total |

### Analytics Tools
- **WeChat Analytics**: Built-in data dashboard
- **Youzan/Weimob**: E-commerce analytics
- **Custom**: Enterprise WeChat + CRM integration

## Common Mistakes to Avoid

1. **Over-selling**: Too promotional content, lose followers
2. **Ignoring comments**: Not responding to user feedback
3. **Inconsistent posting**: Irregular content schedule
4. **Poor mobile experience**: Non-optimized Mini Programs
5. **Siloed operations**: Not integrating ecosystem components

## Implementation Checklist

- [ ] Set up Official Account (choose type)
- [ ] Design account profile (name, avatar, bio)
- [ ] Create content calendar (721 rule)
- [ ] Develop Mini Program (if needed)
- [ ] Set up Enterprise WeChat
- [ ] Create welcome message flow
- [ ] Set up content push schedule
- [ ] Configure analytics tracking
- [ ] Train team on response protocols
- [ ] Launch and iterate

## Related Skills

- **community-operations**: For managing WeChat groups and user engagement
- **short-video-marketing**: For Video Account content creation
- **mini-program-ecommerce**: For Mini Program store setup and optimization
- **china-ads**: For WeChat advertising campaigns
- **private-domain-analytics**: For measuring WeChat ecosystem performance