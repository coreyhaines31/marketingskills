````md
# 将 Meta Pixel 事件转化为 TikTok Pixel 的实操指南

本指南为熟悉 Meta (Facebook) Pixel 的开发者和市场营销人员设计，旨在提供一个清晰、实用的迁移方案，帮助您快速地将现有的 Meta Pixel 事件追踪体系平滑过渡到 TikTok Pixel。

## 1. TikTok vs. Meta Pixel API 对照总表

下表总结了 Meta Pixel 和 TikTok Pixel 在核心功能上的 API 用法对应关系，帮助您快速理解两者之间的异同。

| 功能 | TikTok Pixel | Meta (Facebook) Pixel |
| --- | --- | --- |
| **初始化** | `ttq.load('<PIXEL_ID>');` | `fbq('init', '<PIXEL_ID>');` |
| **全局 PageView** | `ttq.page();` | `fbq('track', 'PageView');` |
| **标准事件** | `ttq.track('Purchase', { ... });` | `fbq('track', 'Purchase', { ... });` |
| **自定义事件** | `ttq.track('CustomEventName', { ... });` | `fbq('trackCustom', 'CustomEventName', { ... });` |
| **高级匹配 (PII)** | `ttq.identify({ email: '...', phone_number: '...' });` | `fbq('init', '<PIXEL_ID>', { em: '...', ph: '...' });` |
| **指定 Pixel 触发** | `ttq.instance('<PIXEL_ID>').track(...)`<br>或<br>`ttq.track(..., { pixel_code: '<PIXEL_ID>' })` | `fbq('trackSingleCustom', '<PIXEL_ID>', ...);` |
| **事件去重 ID** | `ttq.track(..., { event_id: '...' });` | `fbq('track', ..., { eventID: '...' });` |
| **限制数据使用 (LDU)**| `ttq.track('Event', { limited_data_use: 1 });` | `fbq('dataProcessingOptions', ['LDU'], 0, 0);` |
| **关闭自动配置**| `ttq.load('<PIXEL_ID>', { autoConfig: false });` | `fbq('set', 'autoConfig', false, '<PIXEL_ID>');` |

## 2. 分步迁移方法

### 步骤一：替换初始化与 PageView 代码

首先，将您网站中 Meta Pixel 的初始化代码替换为 TikTok Pixel 的 `load` 和 `page` 调用。

**Meta Pixel (原代码):**
```javascript
<!-- Facebook Pixel Code -->
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '<YOUR_META_PIXEL_ID>');
fbq('track', 'PageView');
</script>
```

**TikTok Pixel (替换后):**
```javascript
<!-- TikTok Pixel Code -->
<script>
!function (w, d, t) {
  w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};

  ttq.load('<YOUR_TIKTOK_PIXEL_ID>');
  ttq.page();
}(window, document, 'ttq');
</script>
```

### 步骤二：迁移高级匹配 (PII)

Meta Pixel 通常在 `init` 调用中传递 PII 信息。在 TikTok Pixel 中，这些信息需要通过独立的 `ttq.identify` 方法传递。

**Meta Pixel (原代码):**
```javascript
fbq('init', '<YOUR_META_PIXEL_ID>', {
  em: 'jane.doe@example.com',
  fn: 'Jane',
  ln: 'Doe',
  ph: '12025550123'
});
```

**TikTok Pixel (迁移后):**
```javascript
// 注意：TikTok Pixel 主要使用 email 和 phone_number
ttq.identify({
  email: 'jane.doe@example.com',
  phone_number: '+12025550123' // 建议使用 E.164 格式
});
```

### 步骤三：映射标准和自定义事件

事件名称和参数的映射是迁移的核心。

- **标准事件**：大多数标准事件名称在两个平台是相同的（如 `Purchase`, `AddToCart`）。您只需将 `fbq('track', ...)` 调用替换为 `ttq.track(...)`。
- **自定义事件**：Meta 的 `fbq('trackCustom', ...)` 直接对应到 TikTok 的 `ttq.track(...)`。
- **参数**：确保将 Meta 事件的参数对象原样或按需调整后传递给 `ttq.track`。

**示例：迁移 "Purchase" 事件**
**Meta Pixel (原代码):**
```javascript
fbq('track', 'Purchase', {
    value: 25.00,
    currency: 'USD',
    content_ids: ['PROD123'],
    content_type: 'product'
});
```
**TikTok Pixel (迁移后):**
```javascript
ttq.track('Purchase', {
    value: 25.00,
    currency: 'USD',
    content_id: 'PROD123', // 注意：Meta 的 content_ids (复数) 在 TikTok 对应 content_id (单数)
    content_type: 'product'
});
```

**示例：迁移自定义事件 "Step4"**
**Meta Pixel (原代码):**
```javascript
fbq('trackCustom', 'Step4', {
    plan_type: 'premium'
});
```
**TikTok Pixel (迁移后):**
```javascript
ttq.track('Step4', {
    plan_type: 'premium'
});
```

### 步骤四：处理事件去重 ID

如果您同时使用浏览器端和服务器端上报，需要将 Meta 的 `eventID` 映射到 TikTok 的 `event_id`。

**Meta Pixel (原代码):**
```javascript
fbq('track', 'Purchase', { /* ... */ }, {
    eventID: 'UNIQUE_ID_FOR_PURCHASE_123'
});
```

**TikTok Pixel (迁移后):**
```javascript
ttq.track('Purchase', { /* ... */ }, {
    event_id: 'UNIQUE_ID_FOR_PURCHASE_123' // 键名从 eventID 变为 event_id
});
```

### 步骤五：配置地区隐私 (LDU)

对于需要遵循 CCPA 等法规的场景，需要迁移 LDU 配置。

**Meta Pixel (原代码):**
```javascript
// 在需要限制数据处理的上下文中调用
fbq('dataProcessingOptions', ['LDU'], 0, 0);
fbq('track', 'Lead', { ... });
```

**TikTok Pixel (迁移后):**
```javascript
// 在事件级别直接传递 LDU 标志
ttq.track('Lead', {
    ... // 其他参数
    limited_data_use: 1
});
```
TikTok 的 LDU 配置在事件级别，更加灵活。您需要在每个需要限制的事件中添加 `limited_data_use: 1`。

### 步骤六：联调与验证

迁移完成后，使用 TikTok Pixel Helper (浏览器插件) 或在浏览器开发者工具的网络标签页中过滤 "analytics.tiktok.com" 的请求，来验证 TikTok Pixel 事件是否按预期触发，以及参数是否正确。

## 3. 参考链接

- **Meta Pixel 官方文档**:
    - [Reference](https://developers.facebook.com/docs/meta-pixel/reference)
    - [Advanced Topics](https://developers.facebook.com/docs/meta-pixel/advanced/)
    - [Object Properties](https://developers.facebook.com/docs/meta-pixel/implementation/conversion-tracking#object-properites)

- **TikTok Pixel 官方文档**:
    - [Help Center Article](https://ads.tiktok.com/help/article?aid=10028&redirected=1)
    - [Properties Documentation](https://ads.tiktok.com/marketing_api/docs?rid=5ipocbxyw8v&id=1701890973258754)
    - [Event Deduplication (CAPI)](https://ads.tiktok.com/marketing_api/docs?id=1723170195197953)

````