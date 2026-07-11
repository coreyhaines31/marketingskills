---
name: community-operations
description: When the user wants to build and manage online communities, including group management, user segmentation, and engagement optimization. Use when the user mentions "社群运营", "用户分层", "活跃度", "留存", "社群管理". For WeChat ecosystem, see wechat-ecosystem. For private domain analytics, see private-domain-analytics.
metadata:
  version: 1.0.0
---

# 社群运营

You are a community operations expert specializing in Chinese market private domain communities.

## Initial Assessment

**Check for product marketing context first:**
If `.agents/product-marketing-cn.md` exists (or `.agents/product-marketing.md`), read it before asking questions. This contains your product, audience, and positioning context.

## Community Types

### By Purpose
| Type | Focus | Size | Engagement Level |
|------|-------|------|------------------|
| Product Community | Product usage, feedback | 100-500 | High |
| Interest Community | Industry, topic | 200-1000 | Medium |
| VIP Community | Premium users | 50-200 | Very High |
| Service Community | Support, FAQ | 500-2000 | Low-Medium |

### By Platform
| Platform | Features | Best For |
|----------|----------|----------|
| Enterprise WeChat | CRM integration, tags | B2C, service |
| WeChat Group | Familiar, easy access | General community |
| DingTalk | Enterprise features | B2B |
| Feishu | Collaboration tools | Tech teams |

## User Segmentation (RFM Model)

### RFM Framework
| Dimension | Definition | Scoring |
|-----------|------------|---------|
| Recency (R) | Last purchase/interaction | 1-5 (5=recent) |
| Frequency (F) | Purchase/interaction frequency | 1-5 (5=frequent) |
| Monetary (M) | Spending amount | 1-5 (5=high) |

### User Tiers
| Tier | RFM Score | Characteristics | Strategy |
|------|-----------|-----------------|----------|
| VIP | R5F5M5 | High value, loyal | Exclusive service, early access |
| Loyal | R4F4M4+ | Regular, engaged | Reward programs, community |
| Potential | R3F2M2+ | New or occasional | Activation campaigns |
| At-risk | R2F1M3+ | Declining activity | Win-back offers |
| Lost | R1F1M1 | Inactive | Re-engagement or remove |

### Segmentation Process
1. **Data Collection**: Track user behavior, purchases, interactions
2. **RFM Scoring**: Calculate scores for each dimension
3. **Tier Assignment**: Map scores to user tiers
4. **Strategy Design**: Create targeted strategies per tier
5. **Execution**: Implement tier-specific campaigns
6. **Measurement**: Track tier movement and retention

## Community Building

### Setup Checklist
- [ ] Define community purpose and rules
- [ ] Choose platform (Enterprise WeChat recommended)
- [ ] Create community structure (main group + sub-groups)
- [ ] Design onboarding flow
- [ ] Set up moderation tools
- [ ] Create content calendar
- [ ] Train community managers

### Community Rules Template
```
Welcome to [Community Name]!

Our purpose: [Clear mission statement]

Rules:
1. Be respectful and constructive
2. No spam or self-promotion (except designated threads)
3. Stay on topic
4. Help others when possible
5. Have fun!

Breaking rules = warning → mute → remove

管理员: @admin1 @admin2
```

### Onboarding Flow
1. **Welcome Message**: Personal greeting, community rules
2. **Introduction Thread**: New member introduces themselves
3. **Quick Start Guide**: Key resources, how to participate
4. **First Engagement**: Ask a question, join a discussion
5. **Value Delivery**: Provide immediate value (resource, insight)

## Engagement Strategies

### Daily Activities
| Time | Activity | Purpose |
|------|----------|---------|
| 9:00 | Good morning + daily tip | Start engagement |
| 12:00 | Lunch break topic | Casual interaction |
| 15:00 | Q&A session | Value delivery |
| 20:00 | Evening discussion | Deep engagement |

### Weekly Activities
| Day | Activity | Purpose |
|-----|----------|---------|
| Monday | Weekly goals, motivation | Set tone |
| Tuesday | Industry news, trends | Value delivery |
| Wednesday | User spotlight, case study | Social proof |
| Thursday | Q&A, AMA | Engagement |
| Friday | Weekend challenge, fun | Community building |
| Saturday | User-generated content | Participation |
| Sunday | Week review, preview | Retention |

### Monthly Activities
- **Product update**: New features, improvements
- **User awards**: Top contributors, achievements
- **Exclusive offer**: Community-only deals
- **Live event**: AMA, workshop, webinar
- **Community review**: Metrics, improvements

### Gamification Elements
| Element | Implementation | Purpose |
|---------|----------------|---------|
| Points | Earn for participation | Motivation |
| Badges | Achievement recognition | Status |
| Leaderboards | Top contributors | Competition |
| Rewards | Physical/digital prizes | Incentive |
| Levels | Progression system | Long-term engagement |

## Content Strategy

### Content Types
| Type | Frequency | Engagement |
|------|-----------|------------|
| Educational | 3x/week | High |
| User stories | 1x/week | Medium |
| Behind-the-scenes | 1x/week | Medium |
| Polls/questions | 2x/week | High |
| Celebrations | As needed | Medium |

### Content Calendar Template
```
Week 1: Product education
- Mon: Feature tutorial
- Wed: Use case spotlight
- Fri: Best practices

Week 2: Community building
- Mon: User introduction
- Wed: Discussion topic
- Fri: Fun challenge

Week 3: Industry value
- Mon: Trend analysis
- Wed: Expert insight
- Fri: Resource sharing

Week 4: Engagement boost
- Mon: Poll/quiz
- Wed: AMA session
- Fri: Monthly review
```

## Moderation

### Moderation Levels
| Level | Action | When |
|-------|--------|------|
| Warning | Private message | Minor violation |
| Mute | Temporary silence | Repeated violation |
| Remove | Remove from group | Serious violation |
| Ban | Block permanently | Severe/illegal |

### Common Issues & Solutions
| Issue | Solution |
|-------|----------|
| Spam | Auto-filter, manual review |
| Off-topic | Redirect, create dedicated thread |
| Conflict | Private mediation, neutral ground |
| Low engagement | Inject content, create events |
| Negative sentiment | Address concerns, provide support |

### Moderation Tools
- **Enterprise WeChat**: Auto-reply, keyword filter, group management
- **Third-party**: WeTool (deprecated alternatives), custom bots
- **Manual**: Active monitoring, quick response

## Retention Strategies

### 7-Day Activation SOP
```
Day 0: Welcome + first value
Day 1: Check-in, ask about experience
Day 2: Share relevant resource
Day 3: Invite to participate in discussion
Day 4: Introduce to another member
Day 5: Share exclusive content
Day 6: Ask for feedback
Day 7: Celebrate first week, set expectations
```

### Churn Prevention
| Signal | Action |
|--------|--------|
| No activity 7 days | Check-in message |
| No activity 14 days | Exclusive offer |
| No activity 30 days | Personal outreach |
| Negative feedback | Immediate resolution |

### Re-engagement Campaigns
1. **Win-back offer**: Special discount for returning members
2. **Exclusive content**: Value they can't get elsewhere
3. **Personal invitation**: Direct outreach from community manager
4. **FOMO**: Show what they're missing

## Measurement

### Key Metrics
| Metric | Target | How to Measure |
|--------|--------|----------------|
| Active rate | >30% weekly | Active members / total |
| Response rate | >50% | Responses / questions |
| Retention rate | >70% monthly | Members staying / total |
| Referral rate | >10% | New from referrals |
| Sentiment score | >4.0/5 | Survey, feedback |

### Analytics Tools
- **Enterprise WeChat**: Group analytics, member activity
- **Third-party SCRM**: Youzan, Weimob, Chenfeng
- **Custom tracking**: UTM, event tracking

## Common Mistakes to Avoid

1. **Over-moderation**: Too strict, kills spontaneity
2. **Under-moderation**: Chaos, spam, conflict
3. **Inconsistent engagement**: Activity peaks and valleys
4. **Ignoring feedback**: Not acting on member input
5. **Selling too much**: Overly promotional content
6. **No clear purpose**: Community lacks direction

## Implementation Checklist

- [ ] Define community type and purpose
- [ ] Choose platform (Enterprise WeChat recommended)
- [ ] Create community rules
- [ ] Design onboarding flow
- [ ] Set up moderation tools
- [ ] Create content calendar
- [ ] Train community managers
- [ ] Launch with seed members
- [ ] Monitor and iterate
- [ ] Measure and report

## Related Skills

- **wechat-ecosystem**: For WeChat-specific community setup
- **private-domain-analytics**: For measuring community performance
- **short-video-marketing**: For Video Account community content
- **live-commerce**: For live streaming community events
- **china-ads**: For driving traffic to communities