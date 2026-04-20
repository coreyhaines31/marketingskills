# 安装与事件细节

当任务需要精确的 bootstrap placement 指南、平台事件 payload 示例、事件名查询、跨平台映射支持或安装 / 事件验证细节时，使用此 reference。

## 何时阅读此文件

当你需要以下任一内容时，阅读此文件：
- 精确的基础 bootstrap placement 指南
- 压缩 / minified base code snippet 结构
- TikTok 或 Meta 标准事件名参考
- 某个具体平台事件的 payload 示例
- 从 business action 到平台事件的 starter mapping table
- 安装、映射与验证审查清单

如果当前任务只涉及 CSP、consent gating、LDU、restricted-data handling 或 Advanced Matching / PII，优先阅读 `references/privacy-and-csp.md`。

## 章节索引

- `## Bootstrap 放置与基础代码` — TikTok bootstrap 指南和基础安装规则
- `## TikTok 与 Meta 的 bootstrap 对比` — 双平台 bootstrap 对比与 page-view 基线差异
- `## 标准事件与自定义事件说明` — TikTok 标准事件，以及明确标注的 custom / internal example
- `## 跨平台事件对齐起步表` — 从 business action 到平台事件的脚手架
- `## 各事件推荐参数` — 参数建议与字段名注意事项
- `## Payload 示例` — `ttq.track(...)`、`ttq.identify(...)` 和 `fbq(...)` 的具体示例
- `## 差异审查清单` — 比较 TikTok 与 Meta 时要检查的内容
- `## 验证清单` — 安装与事件验证步骤

## Bootstrap 放置与基础代码

根据 TikTok 的安装指南，base code 应该：
- 放在 **`<head>` section 顶部附近**
- 以**完整 JavaScript base code block** 形式粘贴，而不是部分片段
- 包含 `https://analytics.tiktok.com/i18n/pixel/events.js` 的 loader
- 调用 `ttq.load('<PIXEL_ID>')`
- 调用 `ttq.page()` 来发送基础 page-view 事件，供安装验证使用

把这部分视为基础安装参考，而不是允许你把 snippet 随便贴进任意文件。代理仍然应该先在当前 repo 中选择正确的共享 render path，再应用它。

下面这段完整 base code 可作为 reference snippet，只替换 `<PIXEL_ID>` 即可。
除非用户明确要求展开格式，否则在此技能中优先使用压缩 / minified basecode 示例：

```html
<script>
!function(w,d,t){w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._v='analytics/0.0.1',ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};ttq.load('<PIXEL_ID>');ttq.page()}(window,document,'ttq');
</script>
```

Important implementation details:
- 保持完整 bootstrap 不变。
- 上线前只替换 Pixel ID 占位符。
- `Page View` 已经通过 `ttq.page()` 包含在 base code 中，因此除非应用确实需要显式 SPA navigation handling，否则不要再加重复的 page-view 事件。
- `ttq.track(...)` 应该放在可以确认业务动作已经成功的位置。
- 对于基于页面加载的 conversion event，应把事件放在只会在成功后加载的 post-action page 上。
- 对于 click 驱动事件，除非 click 本身就是业务成功时刻，否则不要在原始 click 上触发。
- 如果页面包含多个 pixel，指南展示了使用 `ttq.instance('<pixel_id>').track(...)` 对指定 pixel 发送事件的方式。

## TikTok 与 Meta 的 bootstrap 对比

当任务同时涉及两个平台，并且你需要一个最小 bootstrap 对比时，使用本节。

| Concern | TikTok | Meta | Governance note |
|---|---|---|---|
| Base init call | `ttq.load('<PIXEL_ID>')` | `fbq('init', '<PIXEL_ID>')` | 每个平台只保留一个共享 bootstrap 位置。 |
| Base page view | `ttq.page()` | `fbq('track', 'PageView')` | 避免与 SPA route hook 叠加，导致 page view 重复。 |
| Placement goal | shared head/layout/app shell | shared head/layout/app shell | 当两个平台都启用时，优先采用同样的 render path 策略。 |
| Multi-pixel handling | 可能使用 `ttq.instance(...)` 模式 | Meta 可能在同一套 `fbq` 设置下使用多个 init ID | 不要假设多 pixel ownership 在两个平台上是等价的。 |
| Validation | TikTok helper / diagnostics | Meta Pixel Helper / Events Manager diagnostics | 先分别验证每个平台，再一起比较行为。 |

虽然 SDK 调用不同，但在治理层面应对称地看待这两个平台。

## 标准事件与自定义事件说明

### TikTok standard event names

安装指南中的示例事件包括：
- `AddPaymentInfo`
- `AddToCart`
- `AddToWishlist`
- `ApplicationApproval`
- `Purchase`
- `CompleteRegistration`
- `Contact`
- `CustomizeProduct`
- `Download`
- `FindLocation`
- `InitiateCheckout`
- `Lead`
- `Schedule`
- `Search`
- `StartTrial`
- `SubmitApplication`
- `Subscribe`
- `ViewContent`

## 跨平台事件对齐起步表

在修改很多文件之前，把它当作 planning scaffold 使用。

| Business action | TikTok event | Meta event | Shared trigger rule | Shared core fields | Platform-specific notes |
|---|---|---|---|---|---|
| Page view | `ttq.page()` | `PageView` | 在规范的 page-view 时刻触发 | 如有需要只附带 page context | SPA route 行为可能需要显式处理 |
| Product detail view | `ViewContent` | `ViewContent` | 在产品详情真正渲染完成后触发 | 产品标识、value、currency | 字段形状可能不同 |
| Add to cart | `AddToCart` | `AddToCart` | 在购物车 mutation 成功后触发 | 产品标识、quantity、value、currency | 保持触发时机一致 |
| Checkout start | `InitiateCheckout` | `InitiateCheckout` | 在 checkout 真正开始时触发 | 购物车或 commerce context | 避免触发过早 |
| Payment info added | `AddPaymentInfo` | `AddPaymentInfo` | 在支付信息被接受后触发 | value、currency、commerce context | 确认准确成功点 |
| Purchase success | `Purchase` | `Purchase` | 在订单 / 支付成功完成后触发 | value、currency、订单 / 产品上下文 | 去重与事件身份可能不同 |
| Lead submit | `Lead` | `Lead` | 在 lead 成功采集后触发 | 共享的 lead 语义 | 可能仍需要 custom mapping |
| Registration success | `CompleteRegistration` | `CompleteRegistration` | 在注册成功后触发 | 共享的注册上下文 | 保持语义一致 |
| Search | `Search` | `Search` | 在真实搜索动作或结果状态出现后触发 | 搜索词 | 字段形状可能因实现而异 |

这是一个 starter table，不是强制 parity table。如果某个平台需要 custom event，或需要不同字段 contract，应明确记录，而不是把差异藏起来。

## 各事件推荐参数

TikTok 指南中明确列出的推荐参数示例：
- `AddToCart`: `content_type`, `quantity`, `description`, `content_id`, `currency`, `value`
- `Purchase`: `content_type`, `quantity`, `description`, `content_id`, `currency`, `value`
- `ViewContent`: `content_type`, `quantity`, `description`, `content_id`, `currency`, `value`
- `Search`: `query`
- `StartTrial`: `currency`, `value`

Field-name caution for agents:
- 在此 reference 中，把 `query` 视为 TikTok Search 的文档基线。
- 某些更广义的 analytics 实现或共享 cross-platform contract 也可能使用 `search_string`。
- 如果当前 repo 已经使用 `search_string`，或者该具体实现路径的最新官方文档不同，优先遵循当前 repo 约定和官方文档，而不是机械统一。
- 不要把 `query` 和 `search_string` 同时当作默认推荐值来表达。

这些参数列表只是推荐基线，不代表你可以编造实际不存在的值。

## Payload 示例

当你在验证或实现事件时，把这些作为 payload 参考。请把占位符替换为用户应用中的真实值。

这些只是 example，而不是一套必须照搬的统一 payload。优先选择对当前业务动作和 repo 中可用数据来说最小且正确的 payload。

### TikTok identity example

```js
ttq.identify({
  email: "<hashed_email_address>",
  phone_number: "<hashed_phone_number>",
  external_id: "<hashed_external_id>"
});
```

### TikTok ViewContent

```js
ttq.track('ViewContent', {
  contents: [
    {
      content_id: "<content_identifier>",
      content_type: "<content_type>",
      content_name: "<content_name>"
    }
  ],
  value: "<content_value>",
  currency: "<content_currency>"
});
```

### TikTok AddToWishlist

```js
ttq.track('AddToWishlist', {
  contents: [
    {
      content_id: "<content_identifier>",
      content_type: "<content_type>",
      content_name: "<content_name>"
    }
  ],
  value: "<content_value>",
  currency: "<content_currency>"
});
```

### TikTok Search

```js
ttq.track('Search', {
  query: "<search_keywords>"
});
```

### TikTok AddPaymentInfo

```js
ttq.track('AddPaymentInfo', {
  contents: [
    {
      content_id: "<content_identifier>",
      content_type: "<content_type>",
      content_name: "<content_name>"
    }
  ],
  value: "<content_value>",
  currency: "<content_currency>"
});
```

### TikTok AddToCart

```js
ttq.track('AddToCart', {
  contents: [
    {
      content_id: "<content_identifier>",
      content_type: "<content_type>",
      content_name: "<content_name>"
    }
  ],
  value: "<content_value>",
  currency: "<content_currency>"
});
```

### TikTok InitiateCheckout

```js
ttq.track('InitiateCheckout', {
  contents: [
    {
      content_id: "<content_identifier>",
      content_type: "<content_type>",
      content_name: "<content_name>"
    }
  ],
  value: "<content_value>",
  currency: "<content_currency>"
});
```

### TikTok PlaceAnOrder custom example

```js
ttq.track('PlaceAnOrder', {
  contents: [
    {
      content_id: "<content_identifier>",
      content_type: "<content_type>",
      content_name: "<content_name>"
    }
  ],
  value: "<content_value>",
  currency: "<content_currency>"
});
```

把 `PlaceAnOrder` 视为 custom / internal example，而不是 TikTok 官方文档中的标准事件。

### TikTok CompleteRegistration

```js
ttq.track('CompleteRegistration', {
  contents: [
    {
      content_id: "<content_identifier>",
      content_type: "<content_type>",
      content_name: "<content_name>"
    }
  ],
  value: "<content_value>",
  currency: "<content_currency>"
});
```

### TikTok Purchase

```js
ttq.track('Purchase', {
  contents: [
    {
      content_id: "<content_identifier>",
      content_type: "<content_type>",
      content_name: "<content_name>"
    }
  ],
  value: "<content_value>",
  currency: "<content_currency>"
});
```

### Meta PageView

```js
fbq('track', 'PageView');
```

### Meta ViewContent

```js
fbq('track', 'ViewContent', {
  content_ids: ["<content_identifier>"],
  content_type: "product",
  value: "<content_value>",
  currency: "<content_currency>"
});
```

### Meta AddToCart

```js
fbq('track', 'AddToCart', {
  content_ids: ["<content_identifier>"],
  content_type: "product",
  value: "<content_value>",
  currency: "<content_currency>"
});
```

### Meta InitiateCheckout

```js
fbq('track', 'InitiateCheckout', {
  value: "<checkout_value>",
  currency: "<checkout_currency>"
});
```

### Meta Purchase

```js
fbq('track', 'Purchase', {
  value: "<order_value>",
  currency: "<order_currency>"
});
```

### Meta Lead

```js
fbq('track', 'Lead', {
  value: "<lead_value>",
  currency: "<lead_currency>"
});
```

## 差异审查清单

当 TikTok 和 Meta 同时在范围内时，检查：
- 是否在应当跟踪的地方，两个平台都跟踪了同一个业务动作
- 两个平台是否在同一个业务成功时刻触发
- 预期的共享核心字段是否都存在
- 差异究竟是有意还是意外
- 是否一个平台在 app code 中实现，而另一个平台由 GTM 或其他系统拥有
- ownership 和 source of truth 是否清晰
- page-view 行为在本地是否正确，以及对当前业务是否足够跨平台一致

## 验证清单

从两个层面验证成功。

### Per-platform verification
- TikTok 的安装指南特别推荐使用以下工具检查：
  - **Pixel Helper**
  - **Test Events and Diagnostics**
  - **Debug Mode**
- Meta 集成则应使用对应的浏览器 helper 和 Events Manager diagnostics（如果可用）进行检查。

### Cross-platform verification
在审查安装和事件行为时，检查：
- 每个平台的 base bootstrap 是否出现在预期共享输出中
- 在适用时，commerce、search 和 trial 事件是否包含预期推荐参数
- 事件是否在每个平台都只触发一次，并且发生在真实业务成功点
- page-view 是否被 bootstrap 与 SPA navigation hook 重复发送
- 在多 pixel 页面中，事件是否发送到了目标 pixel instance
- 即使平台特有字段不同，TikTok 和 Meta 是否仍然在共享业务语义上保持对齐
