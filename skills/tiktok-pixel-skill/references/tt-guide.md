````md
# TikTok Pixel 事件配置指南

本指南旨在为广告主和开发者提供一个系统性的 TikTok Pixel 事件配置说明。无论您是初次接触 TikTok Pixel，还是希望优化现有集成，本文档都将覆盖从基础到高级的各项关键配置。

## 1. 基础集成

### 1.1. 初始化 Pixel

在您的网站所有页面的 `<head>` 标签中，需要嵌入 TikTok Pixel 的基础代码，并通过 `ttq.load` 方法初始化。这是所有事件追踪的起点。

```javascript
ttq.load('<YOUR_PIXEL_ID>');
```

### 1.2. 触发全局 PageView 事件

初始化之后，为了追踪用户的所有页面浏览行为，应在每个页面加载时调用 `ttq.page`。这将自动上报一个 `PageView` 事件，是衡量网站流量的基础。

```javascript
ttq.page();
```

## 2. 事件追踪

### 2.1. 标准事件

TikTok 提供了一系列标准事件，用于追踪用户在您网站上的关键转化行为，例如购买、注册、搜索等。通过 `ttq.track` 方法并传入标准事件名和可选参数来上报。

**示例：上报购买事件**
```javascript
ttq.track('Purchase', {
    value: 12.00,
    currency: 'USD',
    content_id: 'product001',
    content_type: 'product',
    quantity: 1
});
```

### 2.2. 自定义事件

对于标准事件无法覆盖的特定业务场景，您可以使用自定义事件。只需在 `ttq.track` 方法中提供一个非标准的事件名称即可。

**示例：追踪用户完成引导流程的第四步**
```javascript
ttq.track('Step4', {
    // optional parameters
    plan_type: 'premium',
    duration: 'yearly'
});
```

### 2.3. 仅对指定 Pixel ID 触发事件

在某些情况下，您可能在同一页面上管理多个 Pixel 实例，并希望某个事件仅发送给特定的 Pixel ID。有两种实现方式：

**方式一：使用 `instance` 方法**

```javascript
ttq.instance('<PIXEL_ID_A>').track('SpecialEvent', {
    // optional parameters
});
```

**方式二：在事件选项中指定 `pixel_code`**

```javascript
ttq.track('SpecialEvent', {
    // optional parameters
}, {
    pixel_code: '<PIXEL_ID_A>'
});
```

## 3. 高级配置

### 3.1. 高级匹配 (Advanced Matching)

高级匹配通过关联用户身份信息（如 Email 和电话号码）来提升跨设备和浏览器的归因准确率。您可以使用 `ttq.identify` 方法来安全地传递这些信息。数据在发送前会在客户端进行 SHA-256 哈希处理。

**用法一：传递 `external_id` 和用户信息**

```javascript
ttq.identify('YOUR_EXTERNAL_USER_ID', {
  email: 'email@example.com',
  phone_number: '+11234567890',
  sha256_email: 'hashed_email_value',
  sha256_phone_number: 'hashed_phone_value'
});
```

**用法二：仅传递用户信息**

```javascript
ttq.identify({
  email: 'email@example.com',
  phone_number: '+11234567890'
});
```

### 3.2. 事件去重 (Event Deduplication)

当您同时使用 Pixel (浏览器端) 和 Events API (服务器端) 上报相同事件时，为了避免重复计数，需要为每个事件提供一个唯一的 `event_id`。TikTok 会使用此 ID 来识别和合并重复的事件。

```javascript
ttq.track('Purchase', {
    value: 12,
    currency: 'USD'
}, {
    event_id: 'UNIQUE_EVENT_ID_12345'
});
```

### 3.3. 限制数据使用 (Limited Data Use - LDU)

对于需要遵循地区性隐私法规（如 CCPA）的场景，您可以在事件级别启用 LDU 标志，以限制 TikTok 对特定用户数据的使用方式。

```javascript
ttq.track('AddToCart', {
    limited_data_use: 1
    // ... other parameters
});
```

### 3.4. 关闭自动配置 (AutoConfig)

TikTok Pixel 默认启用 AutoConfig 功能，以智能地捕捉更多事件信号。如果您需要完全手动控制事件，可以在初始化时将其关闭。

```javascript
ttq.load('<YOUR_PIXEL_ID>', {
    autoConfig: false,
});
```

## 4. PII (个人身份信息) 标准化逻辑

为了提高匹配率，TikTok 会对传入的 Email 和电话号码进行标准化处理。了解其逻辑有助于确保您传递的数据能被正确识别。

### 4.1. Email 标准化逻辑

- **空值与空白**：`null`、`undefined`、`""` (空字符串) 或仅包含空格的字符串 (`"   "`) 最终都会被视为空值，不会进行上报。
- **格式错误**：缺少 `@` 符号、包含多个 `@`、缺少域名或前缀的 Email 地址会被标记为 `invalid`。
- **Gmail 地址**：
    - `.` (点)：对于 Gmail 地址，用户名中的 `.` 会被移除后进行匹配。例如 `test.user123@gmail.com` 会被建议标准化为 `testuser123@gmail.com`。
    - `+` (标签)：Gmail 的 `+` 标签会被移除。例如 `test+tag001@gmail.com` 会被建议标准化为 `test@gmail.com`。
- **域名修正**：一些常见的域名拼写错误可能会被识别并给出修正建议 (例如 `gamil.com` -> `gmail.com`)。

**示例小结**：
| 输入值 | TikTok 处理结果 | 说明 |
| --- | --- | --- |
| `null` 或 `""` | 视为空，不处理 | |
| `"   "` | 视为空，标记为 `invalid` | |
| `test@@gmail.com` | 标记为 `invalid` | 格式错误 |
| `test.user@gmail.com` | 标准化为 `testuser@gmail.com` | 移除 `.` |
| `test+tag@gmail.com`| 标准化为 `test@gmail.com` | 移除 `+` 标签 |

### 4.2. 电话号码标准化逻辑

- **空值与空白**：与 Email 类似，`null`、`undefined`、`""` 和仅含空格的字符串均被视为空值处理。
- **格式要求**：期望格式为 E.164 标准 (如 `+12025550123`)。
- **国家码**：
    - **缺少 `+` 号**：如果电话号码仅由数字组成且未包含 `+`，TikTok 会尝试根据用户的 IP 地址推断国家码，但这可能导致 `invalid_country` 错误。
    - **包含 `+` 号**：强烈建议始终包含 `+` 和国家码，如 `+8613812345678`，这是最可靠的格式。
- **非数字字符**：
    - **分隔符**：数字之间的空格、破折号 (`-`)、括号 (`()`) 会被移除并进行标准化。例如 `+86 138-1234-5678` 会被处理成 `+8613812345678`。
    - **字母或其他符号**：包含字母或特殊符号的输入将被标记为 `invalid` 和 `not_a_number`。

**示例小结**：
| 输入值 | TikTok 处理结果 | 说明 |
| --- | --- | --- |
| `""` 或 `null` | 视为空，不处理 | |
| `"13812345678"` | 可能因缺少国家码而匹配失败 | 建议使用 `+8613812345678` |
| `"+86 138 1234 5678"` | 标准化为 `+8613812345678` | 移除空格 |
| `"(202) 555-0123"` | 标准化为 `2025550123`，但可能因缺少国家码失效 | 建议使用 `+12025550123` |
| `"abcdefg"` | 标记为 `invalid` | 包含非数字字符 |

## 5. 官方参考文档

- **TikTok Pixel 帮助中心**：[https://ads.tiktok.com/help/article?aid=10028&redirected=1](https://ads.tiktok.com/help/article?aid=10028&redirected=1)
- **TikTok Pixel 事件属性文档**：[https://ads.tiktok.com/marketing_api/docs?rid=5ipocbxyw8v&id=1701890973258754](https://ads.tiktok.com/marketing_api/docs?rid=5ipocbxyw8v&id=1701890973258754)
- **CAPI 事件去重**：[https://ads.tiktok.com/marketing_api/docs?id=1723170195197953](https://ads.tiktok.com/marketing_api/docs?id=1723170195197953)

````