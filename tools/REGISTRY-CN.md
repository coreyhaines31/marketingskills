# 国内营销工具注册表

## 工具索引

| 工具 | 类别 | API | MCP | CLI | 用途 | 集成指南 |
|------|------|-----|-----|-----|------|----------|
| 有赞 | 电商/CRM | ✅ | ❌ | ✅ | 小程序商城、会员管理 | [guide](integrations-cn/youzan.md) |
| 微盟 | 电商/广告 | ✅ | ❌ | ✅ | 小程序商城、腾讯广告 | [guide](integrations-cn/weimob.md) |
| 企业微信SCRM | 私域/CRM | ✅ | ❌ | ✅ | 客户管理、社群运营 | [guide](integrations-cn/wecom-scrm.md) |
| 小红书蒲公英 | 种草/KOL | ✅ | ❌ | ❌ | KOL合作、内容投放 | [guide](integrations-cn/xiaohongshu-pugongying.md) |
| 巨量引擎 | 广告 | ✅ | ❌ | ✅ | 抖音广告、千川投放 | [guide](integrations-cn/ocean-engine.md) |
| 腾讯广告 | 广告 | ✅ | ❌ | ✅ | 微信广告、朋友圈广告 | [guide](integrations-cn/tencent-ads.md) |
| 百度营销 | 搜索广告 | ✅ | ❌ | ✅ | 搜索广告、信息流 | [guide](integrations-cn/baidu-marketing.md) |
| 新榜 | 数据分析 | ✅ | ❌ | ❌ | 内容数据分析 | [guide](integrations-cn/newrank.md) |
| 西瓜数据 | 数据分析 | ✅ | ❌ | ❌ | 抖音数据分析 | [guide](integrations-cn/xiguadata.md) |
| 火烧云 | 数据分析 | ✅ | ❌ | ❌ | 小红书数据分析 | [guide](integrations-cn/huoshaoyun.md) |

## 工具分类

### 电商平台
- **有赞**: 全渠道连锁，企业级CRM
- **微盟**: 广告营销驱动，腾讯生态
- **微店**: 个人卖家，社交电商

### SCRM系统
- **企业微信SCRM**: 官方基础版
- **尘锋SCRM**: 全行业，客户旅程可视化
- **微盛·企微管家**: 电商零售，易用性强
- **探马SCRM**: 教育培训/B2B

### 广告平台
- **腾讯广告**: 微信朋友圈、公众号广告
- **巨量引擎**: 抖音、千川、巨量广告
- **小红书蒲公英**: KOL合作、搜索竞价
- **百度营销**: 搜索广告、AI智能框

### 数据分析
- **新榜**: 内容创业服务
- **西瓜数据**: 抖音数据分析
- **火烧云**: 小红书数据分析
- **灰豚数据**: 直播电商分析

### 内容创作
- **剪映**: 短视频编辑
- **Canva**: 图片设计
- **稿定设计**: 电商图片

## 集成模式

### 模式1: API直连
```
应用 → 工具API → 数据/操作
```
适用: 有赞、微盟、巨量引擎

### 模式2: Webhook回调
```
应用 ← 工具事件 → 触发动作
```
适用: 企业微信、SCRM系统

### 模式3: 数据同步
```
应用 ↔ 数据仓库 ↔ 多个工具
```
适用: 需要整合多源数据的场景

## 认证方式

### API Key
- 有赞: App Key + App Secret
- 微盟: App ID + App Secret
- 巨量引擎: App ID + App Secret

### OAuth 2.0
- 企业微信: CorpID + Secret
- 小红书: App Key + App Secret
- 腾讯广告: App ID + App Secret

### 环境变量配置
```bash
# 有赞
export YOUZAN_APP_KEY="your_key"
export YOUZAN_APP_SECRET="your_secret"

# 微盟
export WEIMOB_APP_ID="your_id"
export WEIMOB_APP_SECRET="your_secret"

# 巨量引擎
export OCEAN_ENGINE_APP_ID="your_id"
export OCEAN_ENGINE_APP_SECRET="your_secret"

# 企业微信
export WECOM_CORP_ID="your_corp_id"
export WECOM_SECRET="your_secret"
```

## 最佳实践

### 1. 工具选型
- **初创期**: 选择免费/低成本工具
- **成长期**: 选择可扩展工具
- **成熟期**: 选择企业级工具

### 2. 数据整合
- 建立统一数据仓库
- 实现跨工具数据同步
- 建立统一用户ID

### 3. 自动化
- 使用SCRM自动化营销
- 使用API实现数据同步
- 使用Webhook实现实时响应

### 4. 安全
- 不在代码中硬编码密钥
- 使用环境变量管理凭据
- 定期轮换API密钥