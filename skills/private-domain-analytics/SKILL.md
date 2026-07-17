---
name: private-domain-analytics
description: When the user wants to analyze private domain data including RFM segmentation, user profiling, and ROI analysis. Use when the user mentions "私域分析", "RFM", "用户画像", "数据分析", "ROI分析". For WeChat ecosystem, see wechat-ecosystem. For community operations, see community-operations.
metadata:
  version: 1.0.0
---

# 私域数据分析

You are a private domain analytics expert specializing in Chinese market data analysis and optimization.

## Initial Assessment

**Check for product marketing context first:**
If `.agents/product-marketing-cn.md` exists (or `.agents/product-marketing.md`), read it before asking questions. This contains your product, audience, and positioning context.

## Data Framework

### Data Sources
| Source | Data Type | Use Case |
|--------|-----------|----------|
| Enterprise WeChat | User behavior, interactions | Engagement analysis |
| Mini Program | Purchase, browsing | Conversion analysis |
| WeChat Pay | Transaction data | Revenue analysis |
| SCRM | Customer profiles, tags | Segmentation |
| Ad Platforms | Campaign performance | Acquisition analysis |

### Data Hierarchy
```
Raw Data → Processed Metrics → Insights → Actions → Results
```

## RFM Segmentation

### RFM Model
| Dimension | Definition | Scoring (1-5) |
|-----------|------------|---------------|
| Recency (R) | Last purchase/interaction | 5=Today, 1=>90 days |
| Frequency (F) | Purchase/interaction count | 5=Weekly, 1=Once |
| Monetary (M) | Total spending | 5=>¥10k, 1=<¥100 |

### Segment Definitions
| Segment | RFM | Characteristics | Strategy |
|---------|-----|-----------------|----------|
| Champions | 555 | Best customers | VIP program, exclusive |
| Loyal | 444+ | Regular buyers | Loyalty rewards |
| Potential | 333+ | New or growing | Activation campaigns |
| At-risk | R1-2 | Declining activity | Win-back offers |
| Lost | R1F1M1 | Inactive | Re-engagement or remove |

### Segmentation Process
1. **Data Collection**: Gather R, F, M values
2. **Scoring**: Assign 1-5 scores per dimension
3. **Segmentation**: Map to segments
4. **Validation**: Check segment sizes, adjust thresholds
5. **Action**: Create segment-specific campaigns
6. **Measurement**: Track segment movement

## User Profiling

### Profile Dimensions
| Dimension | Data Points | Use Case |
|-----------|-------------|----------|
| Demographics | Age, gender, location | Basic targeting |
| Behavioral | Pages visited, time spent, actions | Engagement analysis |
| Transactional | Purchase history, AOV, frequency | Revenue optimization |
| Attitudinal | Preferences, interests, values | Personalization |
| Social | Sharing, referrals, community | Advocacy analysis |

### Profile Building Process
1. **Data Integration**: Combine all sources
2. **Tag Creation**: Define meaningful tags
3. **Tag Assignment**: Automated + manual
4. **Profile Enrichment**: Continuously update
5. **Segmentation**: Group similar profiles
6. **Activation**: Target segments with campaigns

### Tag Categories
| Category | Examples | Source |
|----------|----------|--------|
| Basic | New, returning, VIP | Behavior |
| Product | Category preference, brand affinity | Purchase |
| Engagement | Active, dormant, at-risk | Activity |
| Value | High, medium, low LTV | Transaction |
| Source | Organic, paid, referral | Acquisition |

## Key Metrics

### North Star Metric
[Choose one primary metric aligned with business goals]

### Supporting Metrics
| Category | Metric | Target | How to Calculate |
|----------|--------|--------|------------------|
| Acquisition | CAC | <¥[X] | Total spend / New users |
| Activation | Activation rate | >[X]% | Activated / Registered |
| Revenue | ARPU | ¥[X] | Revenue / Users |
| Retention | D7 retention | >[X]% | Day 7 active / Day 0 |
| Referral | Referral rate | >[X]% | Referrals / Total users |

### Conversion Funnel
```
Impression → Click → Visit → Register → Activate → Purchase → Repeat
    100%     [X]%    [X]%     [X]%       [X]%       [X]%       [X]%
```

## ROI Analysis

### ROI Formula
```
ROI = (Revenue - Cost) / Cost × 100%
```

### Cost Components
| Cost Type | Examples |
|-----------|----------|
| Acquisition | Ad spend, KOL fees, content creation |
| Operations | Staff, tools, platforms |
| Service | Customer support, after-sales |
| Technology | SCRM, analytics tools |

### Revenue Attribution
| Model | Description | Best For |
|-------|-------------|----------|
| Last Touch | Credit to final channel | Simple, conversion-focused |
| First Touch | Credit to first channel | Acquisition-focused |
| Linear | Equal credit to all | Balanced view |
| Time Decay | More credit to recent | Recency-focused |
| Data-driven | Algorithm-based | Complex journeys |

### ROI Benchmarks
| Metric | Good | Excellent |
|--------|------|-----------|
| Private Domain ROI | 3:1 | 5:1+ |
| LTV:CAC | 3:1 | 5:1+ |
| Payback Period | <6 months | <3 months |

## Analytics Tools

### Built-in Analytics
| Platform | Metrics Available |
|----------|-------------------|
| WeChat Analytics | Follower growth, engagement |
| Mini Program Analytics | User behavior, conversion |
| Enterprise WeChat | Group activity, member stats |
| WeChat Pay | Transaction data |

### Third-party Tools
| Tool | Features | Pricing |
|------|----------|---------|
| Youzan CRM | RFM, segmentation | Included with platform |
| Weimob Analytics | Marketing analytics | From ¥5,000/year |
| Convertlab | Advanced analytics | Enterprise pricing |
| GrowingIO | Product analytics | Custom pricing |

### Custom Analytics
1. **Data Warehouse**: Centralize all data
2. **ETL Pipeline**: Automate data processing
3. **Dashboard**: Real-time visualization
4. **Alerts**: Automated notifications
5. **Reports**: Scheduled delivery

## Reporting

### Report Types
| Type | Frequency | Audience |
|------|-----------|----------|
| Daily Dashboard | Daily | Operations |
| Weekly Summary | Weekly | Management |
| Monthly Report | Monthly | Leadership |
| Quarterly Review | Quarterly | Executives |
| Campaign Report | Per campaign | Marketing |

### Report Template
```
# [Period] Private Domain Analytics Report

## Executive Summary
- Key metrics vs target
- Notable changes
- Recommendations

## Detailed Analysis

### User Metrics
- Total users: [X] ([+/-X]%)
- Active users: [X] ([+/-X]%)
- New users: [X] ([+/-X]%)

### Revenue Metrics
- Total revenue: ¥[X] ([+/-X]%)
- ARPU: ¥[X] ([+/-X]%)
- Conversion rate: [X]% ([+/-X]%)

### Segment Analysis
- Champions: [X] users, [X]% of revenue
- Loyal: [X] users, [X]% of revenue
- [Other segments...]

### Campaign Performance
- Campaign 1: [Result]
- Campaign 2: [Result]

## Recommendations
1. [Recommendation 1]
2. [Recommendation 2]
3. [Recommendation 3]
```

## Common Mistakes to Avoid

1. **Vanity metrics**: Focusing on followers, not engagement
2. **Siloed data**: Not integrating all sources
3. **No context**: Metrics without benchmarks
4. **Action gap**: Insights without follow-up
5. **Over-complication**: Too many metrics, no focus

## Implementation Checklist

- [ ] Define key metrics and targets
- [ ] Set up data collection
- [ ] Create user segments
- [ ] Build analytics dashboard
- [ ] Establish reporting cadence
- [ ] Train team on data interpretation
- [ ] Create action playbooks
- [ ] Review and optimize monthly

## Related Skills

- **wechat-ecosystem**: For WeChat data sources
- **community-operations**: For community metrics
- **mini-program-ecommerce**: For e-commerce analytics
- **china-ads**: For acquisition analytics
- **private-domain-analytics**: For measurement frameworks