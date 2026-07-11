# Marketing Skills CN

国内市场营销技能库，基于 [marketingskills](https://github.com/coreyhaines31/marketingskills) 项目扩展，增加中国市场营销专属技能。

## 特性

- 🎯 **10个国内营销技能** - 覆盖微信、抖音、小红书、B站等国内主流平台
- 📊 **私域流量运营** - 企业微信、社群、小程序完整链路
- 🎬 **短视频与直播** - 抖音、快手内容创作与直播电商
- 📱 **多平台覆盖** - 微信生态、小红书种草、B站内容、微博话题
- 🔧 **国内工具集成** - 有赞、微盟、巨量引擎等平台对接

## 技能列表

### 核心技能
| 技能 | 描述 | 触发词 |
|------|------|--------|
| [wechat-ecosystem](skills/wechat-ecosystem/) | 微信生态运营 | 微信运营、公众号、小程序、企业微信 |
| [community-operations](skills/community-operations/) | 社群运营 | 社群运营、用户分层、活跃度 |
| [short-video-marketing](skills/short-video-marketing/) | 短视频营销 | 短视频、抖音、快手 |
| [live-commerce](skills/live-commerce/) | 直播电商 | 直播、直播带货、直播电商 |
| [xiaohongshu-marketing](skills/xiaohongshu-marketing/) | 小红书种草 | 小红书、种草、KOL合作 |
| [bilibili-marketing](skills/bilibili-marketing/) | B站内容营销 | B站、UP主、Z世代 |
| [weibo-marketing](skills/weibo-marketing/) | 微博话题营销 | 微博、热搜、话题营销 |
| [china-ads](skills/china-ads/) | 国内广告投放 | 腾讯广告、巨量引擎、百度营销 |
| [mini-program-ecommerce](skills/mini-program-ecommerce/) | 小程序电商 | 小程序电商、有赞、微盟 |
| [private-domain-analytics](skills/private-domain-analytics/) | 私域数据分析 | 私域分析、RFM、用户画像 |

## 安装

### 方式1: 直接克隆
```bash
git clone https://github.com/[your-username]/marketingskills-cn.git
cp -r marketingskills-cn/skills/* .agents/skills/
```

### 方式2: 作为子模块
```bash
git submodule add https://github.com/[your-username]/marketingskills-cn.git .agents/marketingskills-cn
```

## 使用

### 基础配置

1. **配置产品上下文**
   ```bash
   # 复制并编辑产品上下文模板
   cp .agents/product-marketing-cn.md .agents/product-marketing.md
   # 编辑 .agents/product-marketing.md 填写你的产品信息
   ```

2. **安装技能**
   ```bash
   # 将技能复制到你的项目
   cp -r skills/* .agents/skills/
   ```

3. **使用技能**
   ```
   "帮我做抖音短视频营销" → 使用 short-video-marketing 技能
   "搭建微信私域体系" → 使用 wechat-ecosystem 技能
   "小红书种草推广" → 使用 xiaohongshu-marketing 技能
   ```

### 技能引用关系

```
product-marketing-cn (基础层)
    │
    ├── 微信生态 (wechat-ecosystem)
    │   ├── 社群运营 (community-operations)
    │   └── 小程序电商 (mini-program-ecommerce)
    │
    ├── 短视频 (short-video-marketing)
    │   ├── 直播电商 (live-commerce)
    │   └── B站营销 (bilibili-marketing)
    │
    ├── 种草营销 (xiaohongshu-marketing)
    │   └── 微博营销 (weibo-marketing)
    │
    ├── 广告投放 (china-ads)
    │
    └── 数据分析 (private-domain-analytics)
```

## 目录结构

```
marketingskills-cn/
├── skills/                          # 技能目录
│   ├── wechat-ecosystem/           # 微信生态运营
│   ├── community-operations/       # 社群运营
│   ├── short-video-marketing/      # 短视频营销
│   ├── live-commerce/              # 直播电商
│   ├── xiaohongshu-marketing/      # 小红书种草
│   ├── bilibili-marketing/         # B站内容营销
│   ├── weibo-marketing/            # 微博话题营销
│   ├── china-ads/                  # 国内广告投放
│   ├── mini-program-ecommerce/     # 小程序电商
│   └── private-domain-analytics/   # 私域数据分析
├── tools/
│   └── REGISTRY-CN.md              # 国内工具注册表
├── .agents/
│   └── product-marketing-cn.md     # 产品上下文模板
├── README-CN.md                    # 本文件
└── VERSIONS-CN.md                  # 版本记录
```

## 国内营销工具

详见 [tools/REGISTRY-CN.md](tools/REGISTRY-CN.md)

### 电商平台
- 有赞: 全渠道连锁，企业级CRM
- 微盟: 广告营销驱动，腾讯生态

### SCRM系统
- 企业微信SCRM: 官方基础版
- 尘锋SCRM: 全行业，客户旅程可视化
- 微盛·企微管家: 电商零售，易用性强

### 广告平台
- 腾讯广告: 微信朋友圈、公众号广告
- 巨量引擎: 抖音、千川、巨量广告
- 小红书蒲公英: KOL合作、搜索竞价
- 百度营销: 搜索广告、AI智能框

### 数据分析
- 新榜: 内容创业服务
- 西瓜数据: 抖音数据分析
- 火烧云: 小红书数据分析

## 贡献

欢迎贡献新的国内营销技能！

### 添加新技能

1. 创建技能目录: `skills/your-skill-name/`
2. 创建 `SKILL.md` 文件，遵循规范
3. 更新 `README-CN.md` 技能列表
4. 更新 `VERSIONS-CN.md` 版本记录
5. 提交 PR

### 技能规范

- 技能名: 小写字母 + 连字符
- 文件大小: < 500行
- 必需字段: name, description, metadata.version
- 第一步: 检查 product-marketing-cn.md 上下文

## 版本记录

详见 [VERSIONS-CN.md](VERSIONS-CN.md)

## 许可证

MIT License

## 致谢

基于 [coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills) 项目扩展。