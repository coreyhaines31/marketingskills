---
name: mini-program-ecommerce
description: When the user wants to set up or optimize WeChat Mini Program e-commerce stores. Use when the user mentions "小程序电商", "有赞", "微盟", "微信商城", "小程序商城". For WeChat ecosystem, see wechat-ecosystem. For conversion optimization, see cro.
metadata:
  version: 1.0.0
---

# 小程序电商

You are a Mini Program e-commerce expert specializing in WeChat ecosystem commerce.

## Initial Assessment

**Check for product marketing context first:**
If `.agents/product-marketing-cn.md` exists (or `.agents/product-marketing.md`), read it before asking questions. This contains your product, audience, and positioning context.

## Platform Overview

### Major Platforms
| Platform | Best For | Pricing |
|----------|----------|---------|
| Youzan (有赞) | Full-chain retail, large brands | Custom pricing |
| Weimob (微盟) | Ad-driven brands | From ¥5,000/year |
| WeiDian (微店) | Individual sellers, small shops | Free + commission |
| Dianzan (点赞) | Social commerce | From ¥1,000/year |

### Platform Comparison
| Feature | Youzan | Weimob | WeiDian |
|---------|--------|--------|---------|
| CRM | ✅ Advanced | ✅ Good | ❌ Basic |
| Marketing Tools | ✅ Rich | ✅ Good | ⚠️ Limited |
| Multi-store | ✅ Yes | ✅ Yes | ❌ No |
| API | ✅ Full | ✅ Good | ⚠️ Limited |
| Support | ✅ Enterprise | ✅ Good | ⚠️ Community |

## Store Setup

### Basic Structure
```
Mini Program Store
├── Home Page
│   ├── Banner ( promotions )
│   ├── Category Navigation
│   ├── Hot Products
│   └── New Arrivals
├── Category Pages
├── Product Detail Page
│   ├── Images/Video
│   ├── Price & Specs
│   ├── Reviews
│   ├── Related Products
│   └── Add to Cart / Buy Now
├── Shopping Cart
├── Checkout
│   ├── Address
│   ├── Payment (WeChat Pay)
│   └── Coupon
├── Order Management
│   ├── Order List
│   ├── Order Detail
│   ├── Logistics Tracking
│   └── After-sales
└── User Center
    ├── Profile
    ├── My Orders
    ├── Coupons
    ├── Points
    └── Favorites
```

### Design Best Practices
1. **Performance**: First screen < 1s, page load < 2s
2. **Navigation**: Clear, intuitive, max 3 taps to product
3. **Images**: High-quality, multiple angles, zoom enabled
4. **CTA**: Prominent, contrasting color
5. **Trust**: Reviews, guarantees, secure payment badges

## Product Strategy

### Product Types
| Type | Margin | Volume | Best For |
|------|--------|--------|----------|
| Hot Products | Low | High | Traffic, acquisition |
| Regular Products | Medium | Medium | Revenue, profit |
| Premium Products | High | Low | Brand, profit |
| Exclusive Products | High | Low | Differentiation, loyalty |

### Pricing Strategy
1. **Anchor Pricing**: Show original price, discount price
2. **Bundle Pricing**: Buy more, save more
3. **Tiered Pricing**: Different prices for different quantities
4. **Membership Pricing**: VIP exclusive prices
5. **Limited-time Pricing**: Flash sales, countdown

### Product Page Optimization
- **Title**: Brand + Product + Key Feature + Spec
- **Images**: 5-10 images, main image + detail shots
- **Video**: Product demo, 15-30 seconds
- **Description**: Features, benefits, specifications
- **Social Proof**: Reviews, ratings, sales count
- **Urgency**: Limited stock, limited time

## Conversion Optimization

### Checkout Flow
```
Add to Cart → View Cart → Fill Address → Select Payment → Confirm Order → Pay
```

### Conversion Rate Benchmarks
| Metric | Good | Excellent |
|--------|------|-----------|
| Browse → Cart | 10% | 20% |
| Cart → Checkout | 30% | 50% |
| Checkout → Pay | 70% | 90% |
| Overall | 2% | 5% |

### Optimization Tactics
1. **One-click Buy**: Skip cart for single items
2. **WeChat Pay**: Seamless, trusted payment
3. **Address Auto-fill**: Use WeChat address book
4. **Coupon Pop-up**: First-purchase discount
5. **Abandoned Cart**: WeChat message reminder

## Marketing Tools

### Core Tools
| Tool | Purpose | Implementation |
|------|---------|----------------|
| Coupons | Drive conversion | First purchase,满减, categories |
| Flash Sales | Create urgency | Limited time, limited quantity |
| Group Buy | Social proof | WeChat group sharing |
| Points | Loyalty | Earn on purchase, redeem for discounts |
| Member Levels | Retention | VIP benefits, exclusive prices |

### Marketing Funnel
```
Traffic Sources → Store Visit → Product View → Add to Cart → Checkout → Purchase → Repeat
```

### Traffic Acquisition
1. **WeChat Official Account**: Menu link, article link
2. **WeChat Video Account**: Product showcase, live stream
3. **Enterprise WeChat**: Direct push, group sharing
4. **Social Sharing**: User referral, group buy
5. **Paid Ads**: Tencent Ads → Mini Program

## Operations Management

### Order Processing
1. **Auto-confirm**: 7 days after delivery
2. **Logistics**: Integrate with major carriers
3. **After-sales**: Return/refund within 7 days
4. **Customer Service**: WeChat-based support

### Inventory Management
- **Real-time sync**: Stock levels across channels
- **Low stock alert**: Automatic notifications
- **SKU management**: Variants, bundles, kits

### Data Analytics
| Metric | Target | Action |
|--------|--------|--------|
| UV/PV | >[X] | Increase traffic |
| Conversion Rate | >[X]% | Optimize funnel |
| Average Order Value | ¥[X] | Upsell, bundle |
| Repurchase Rate | >[X]% | Retention campaigns |

## Common Mistakes to Avoid

1. **Slow loading**: Users leave within 3 seconds
2. **Complex checkout**: Too many steps
3. **Poor images**: Low quality, few angles
4. **No social proof**: Missing reviews, ratings
5. **Ignoring mobile**: Not optimizing for small screens

## Implementation Checklist

- [ ] Choose platform (Youzan/Weimob recommended)
- [ ] Set up store structure
- [ ] Upload products with quality images
- [ ] Configure payment (WeChat Pay)
- [ ] Set up logistics integration
- [ ] Create marketing campaigns
- [ ] Configure analytics tracking
- [ ] Test complete purchase flow
- [ ] Launch and promote
- [ ] Monitor and optimize

## Related Skills

- **wechat-ecosystem**: For WeChat integration
- **cro**: For conversion optimization principles
- **community-operations**: For social commerce
- **china-ads**: For driving traffic to store
- **private-domain-analytics**: For measuring performance