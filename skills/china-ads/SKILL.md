---
name: china-ads
description: When the user wants to do paid advertising on Chinese platforms including Tencent Ads, Ocean Engine (巨量引擎), and Baidu Marketing. Use when the user mentions "腾讯广告", "巨量引擎", "百度营销", "信息流广告", "SEM", "国内广告投放". For general advertising principles, see ads. For A/B testing, see ab-testing.
metadata:
  version: 1.0.0
---

# 国内广告投放

You are a Chinese digital advertising expert specializing in Tencent Ads, Ocean Engine, and Baidu Marketing.

## Initial Assessment

**Check for product marketing context first:**
If `.agents/product-marketing-cn.md` exists (or `.agents/product-marketing.md`), read it before asking questions. This contains your product, audience, and positioning context.

## Platform Overview

### Tencent Ads (腾讯广告)
| Feature | Details |
|---------|---------|
| Reach | WeChat, QQ, Tencent News, Tencent Video |
| Ad Formats | Moments, Official Account, Mini Program, Video |
| Targeting | Demographics, interests, behaviors, LBS |
| Best For | Brand awareness, private domain traffic |
| Minimum Budget | ¥5,000/month |

### Ocean Engine (巨量引擎)
| Feature | Details |
|---------|---------|
| Reach | Douyin, Toutiao, Xigua Video, Feishu |
| Ad Formats | Feed, Search, Shopping, Live, Brand |
| Targeting | Interests, behaviors, demographics, device |
| Best For | E-commerce, app installs, lead generation |
| Minimum Budget | ¥10,000/month |

### Baidu Marketing (百度营销)
| Feature | Details |
|---------|---------|
| Reach | Baidu Search, Baidu Feed, Baidu Maps |
| Ad Formats | Search, Information Feed, Brand Zone |
| Targeting | Keywords, demographics, interests |
| Best For | B2B, local services, high-intent users |
| Minimum Budget | ¥3,000/month |

## Campaign Strategy

### Budget Allocation
| Stage | Tencent | Ocean Engine | Baidu |
|--------|---------|--------------|-------|
| Cold Start | 30% | 50% | 20% |
| Growth | 40% | 40% | 20% |
| Maturity | 35% | 35% | 30% |

### Funnel Alignment
```
Awareness → Tencent Ads (Moments, Video)
Consideration → Ocean Engine (Douyin, Toutiao)
Conversion → Baidu (Search), Ocean Engine (Shopping)
Retention → Tencent (Private Domain)
```

## Tencent Ads Deep Dive

### Ad Formats
| Format | Placement | Best For |
|--------|-----------|----------|
| Moments | WeChat feed | Brand, engagement |
| Banner | Official Account | Traffic, conversions |
| Mini Program | In-app | E-commerce, services |
| Video | Tencent Video | Awareness, storytelling |

### Targeting Options
1. **Demographics**: Age, gender, location, device
2. **Interests**: Categories, behaviors, purchase history
3. **Custom**: Lookalike, retargeting, CRM upload
4. **LBS**: Radius, POI, geo-fencing

### Optimization Tips
- **Creative**: Use WeChat-style content (authentic, conversational)
- **Landing**: WeChat-native experience (Mini Program preferred)
- **Timing**: Peak hours (12:00-14:00, 20:00-23:00)
- **Budget**: Start small, scale based on performance

## Ocean Engine Deep Dive

### Ad Formats
| Format | Placement | Best For |
|--------|-----------|----------|
| Feed | Douyin, Toutiao | Engagement, conversions |
| Search | Douyin, Toutiao | High-intent users |
| Shopping | Douyin | E-commerce |
| Live | Douyin | Real-time conversion |
| Brand | All apps | Awareness |

### Algorithm Understanding
**Key Metrics (Douyin):**
- Completion rate: 40% weight
- Interaction rate: 25% weight
- Conversion rate: 20% weight
- Replay rate: 15% weight

**Traffic Pool:**
1. Initial: 200-500 views
2. Second: 1,000-5,000 views
3. Third: 10,000-100,000 views
4. Viral: 100,000+ views

### Optimization Tips
- **Creative**: Native, authentic, hook in first 1.5 seconds
- **Targeting**: Interest-based > demographic-based
- **Landing**: Douyin-native or Mini Program
- **Testing**: A/B test creatives, optimize for completion rate

## Baidu Marketing Deep Dive

### Ad Formats
| Format | Placement | Best For |
|--------|-----------|----------|
| Search | Baidu search | High-intent, B2B |
| Feed | Baidu apps | Awareness, engagement |
| Brand Zone | Search results | Brand protection |
| AI Answer | AI search | Future-proofing |

### Keyword Strategy
1. **Brand Keywords**: Protect brand terms
2. **Product Keywords**: Feature-specific terms
3. **Competitor Keywords**: Competitor brand terms
4. **Long-tail Keywords**: Specific user intent

### Optimization Tips
- **Keywords**: Focus on long-tail, high-intent
- **Ad Copy**: Clear value prop, strong CTA
- **Landing**: Fast-loading, mobile-optimized
- **Bidding**: Start with manual, optimize to auto

## Creative Best Practices

### Universal Rules
1. **Hook**: First 1.5 seconds critical
2. **Value**: Clear benefit within 5 seconds
3. **Authentic**: Real > polished
4. **Mobile**: Vertical format, large text
5. **CTA**: Clear, compelling action

### Platform-Specific
| Platform | Style | Length |
|----------|-------|--------|
| WeChat Moments | Conversational, authentic | 15-30s video, 3-6 images |
| Douyin | Native, entertaining | 15-60s video |
| Baidu Search | Direct, benefit-focused | Text + landing page |
| Toutiao | Informative, storytelling | 30-60s video, articles |

## Measurement

### Key Metrics
| Metric | Definition | Target |
|--------|------------|--------|
| CPM | Cost per 1,000 impressions | Industry benchmark |
| CPC | Cost per click | <¥[X] |
| CTR | Click-through rate | >[X]% |
| CVR | Conversion rate | >[X]% |
| ROAS | Return on ad spend | >[X] |
| LTV:CAC | Lifetime value:CAC ratio | >3:1 |

### Attribution
- **First Touch**: Initial awareness channel
- **Last Touch**: Final conversion channel
- **Multi-touch**: All touchpoints in journey
- **Recommended**: Data-driven attribution

## Common Mistakes to Avoid

1. **Platform mismatch**: Wrong platform for goal
2. **Budget spread too thin**: Better to focus on 1-2
3. **Ignoring creative fatigue**: Refresh every 2-4 weeks
4. **No landing page optimization**: High bounce rates
5. **Missing tracking**: Can't measure ROI

## Implementation Checklist

- [ ] Define campaign goal and KPIs
- [ ] Select platforms based on audience
- [ ] Set budget and bidding strategy
- [ ] Create audience targeting
- [ ] Develop creative assets
- [ ] Set up landing pages
- [ ] Configure tracking pixels
- [ ] Launch campaign
- [ ] Monitor daily, optimize weekly
- [ ] Scale winners, pause losers

## Related Skills

- **ads**: For general advertising principles
- **ab-testing**: For testing ad creatives
- **analytics**: For tracking campaign performance
- **short-video-marketing**: For Douyin content creation
- **wechat-ecosystem**: For WeChat advertising integration