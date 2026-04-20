# 隐私、CSP 与数据处理

当任务涉及 TikTok 和 Meta 的 CSP allowlist、consent 行为、limited-data handling、restricted-data policy、Advanced Matching / PII 或跨平台隐私治理时，使用此 reference。

## 何时阅读此文件

当你需要以下任一内容时，阅读此文件：
- Pixel 加载相关的 CSP directive 指南
- 关于 bootstrap、event 或 identifier 的 consent-gating 决策
- Limited Data Use 或 restricted-data handling 指南
- Advanced Matching / PII 要求与 identifier 规则
- TikTok 和 Meta 的共享隐私策略指导

如果任务只涉及 bootstrap placement、event mapping、payload example 或 install verification，优先阅读 `references/install-and-events.md`。

## 跨平台隐私审查视角

当任务同时涉及 TikTok 和 Meta 时，从两个层面审查隐私决策：
- shared policy layer
- platform-specific adapter layer

在 shared policy layer，确认：
- consent 是否必须先于加载或发送事件
- restricted-data handling 是适用于全部流量，还是只适用于某个子集
- 是否允许使用 identifier 做 matching
- 由哪个系统拥有这个决策：app code、wrapper、GTM、backend 还是 privacy platform

在 platform-specific layer，确认：
- 共享决策如何映射到 TikTok 行为
- 共享决策如何映射到 Meta 行为
- 是否有某个平台绕过了另一个平台正在遵守的更严格规则

除非这种差异是有意且已记录的，否则不要让一个平台在隐私敏感行为上默默跑得比另一个更远。

## Consent-gating 选择

在实现隐私敏感行为之前，先决定是 gate 哪一层：
- **Gate load** — 在 consent 授权前不加载 Pixel。
- **Gate send** — 加载 bootstrap，但在 consent 授权前抑制事件发送。
- **Gate identify** — 在政策允许的情况下可以保留非 PII 跟踪，但在获得 consent / legal basis 之前，不发送 `ttq.identify(...)` 或其他 matching signal。

记录当前使用的是哪一种 gate，以及这个决策在哪里生效。

当 TikTok 和 Meta 同时在范围内时，优先先做一份共享策略决策，然后再映射到各自平台 adapter。

## CSP 审查流程

如果站点启用了 Content Security Policy，检查 TikTok Pixel 资源与上报端点是否需要加入 allowlist。

检查以下 directive：
- `frame-src`
- `script-src`
- `img-src`
- `connect-src`

TikTok CSP 指南表明，集成可能需要如下 allowlist 条目：
- `frame-src`: `bytedance:` 和 `sslocal:`
- `script-src`、`img-src` 和 `connect-src` 中可能包括：
  - `analytics.tiktok.com`
  - `analytics-ipv6.tiktokw.us`
  - `ads.tiktok.com`

Guidance：
- 只修改最少必要的 directive。
- 清楚说明到底是哪个 directive 阻止了 Pixel。
- 区分哪些改动已经确认，哪些仍需要用户的安全团队审查。
- 如果实际被拦截的资源与指南不同，以当前官方文档和观察到的浏览器错误为准。

## TikTok 与 Meta 的隐私决策矩阵

当任务同时涉及两个平台时，把下表作为最小治理矩阵使用。

| Concern | Shared governance question | TikTok note | Meta note |
|---|---|---|---|
| CSP / resource loading | 实际被阻止的是哪些 directive 或域名？ | 检查 TikTok 的资源 allowlist 和观察到的错误。 | 检查 Meta 的资源 allowlist 和观察到的错误。 |
| Consent gating | 两个平台是否都应该用同样的 gate load / gate send 行为？ | 判断是 gate bootstrap、event，还是 identifier。 | 判断是 gate bootstrap、event，还是 identifier。 |
| Restricted-data handling | restricted-data 逻辑适用于所有流量，还是只适用于部分流量？ | TikTok LDU 可以是 pixel-wide，也可以是 event-level。 | Meta 可能需要它自己的 restricted-data 或 data-processing 控制。 |
| Matching / identifiers | 是否允许使用 email、phone 或 external identifier？ | `ttq.identify(...)` 必须遵循 consent 与 first-party 规则。 | Meta matching 必须遵循同一份共享隐私决策，即使实现方式不同。 |
| Shared policy source | 规范隐私规则的 source of truth 在哪里？ | 优先使用消费共享 policy signal 的 adapter。 | 优先使用消费同一 policy signal 的 adapter。 |

不要假设 TikTok 的实现天然就定义了正确的 Meta 实现，反之亦然。

## Limited Data Use (LDU)

在启用数据发送之前，明确判断用户是否有 LDU 义务。

先问：
- 他们是否在适用 LDU 的地区或场景中运营？
- 现有 frontend / backend 里是否已经有标记 restricted traffic 的逻辑？
- LDU 应该由地区、consent 状态、账户类型，还是其他业务规则决定？

来自 TikTok 指南的实现细节：
- TikTok 的 LDU 指南把该特性描述为支持某些美国州隐私 opt-out 场景；在实现前，请先核对官方文档中当前实际覆盖的地区。
- 有两种实现模式：
  - 对该 pixel 下所有事件启用 LDU：`ttq.load('<PIXEL_ID>', { limited_data_use: true })`
  - 对单个事件启用 LDU：`ttq.track('Purchase', { limited_data_use: true })`
- 如果只有部分流量受限，优先选择 per-event LDU。
- 只有当用户策略确实适用于该 pixel 下所有事件时，才选择 pixel-wide LDU。

跨平台治理说明：
- 如果 TikTok 和 Meta 同时在范围内，先定义 restricted-data 逻辑是否属于 shared policy layer。
- 然后记录每个平台 adapter 如何表达这份 policy。
- 如果 repo 只在某一个平台支持 restricted-data handling，明确指出这种不对称。

## Advanced Matching / PII

Advanced Matching 需要显式批准。

在启用之前先问：
- 是否要发送 `email`、`phone_number`、`external_id` 或其他 identifier？
- 这些值从哪里来？
- 它们是否已经标准化或哈希？
- 是否具备将这些数据用于广告衡量的 consent？

判断 advertiser 是否可以使用 PII 的原则：
- 只能使用 advertiser 通过自身 first-party 流程已经收集到的 identifier，例如 signup、login、checkout、lead form、CRM-backed 已登录资料，或其他用户明确参与的 account / session 流程。
- 如果 advertiser 无法指出合法的 first-party 来源和 consent / legal basis，就不要启用 Manual Advanced Matching。
- 优先使用已经存在于应用状态、session、checkout 数据或确认提交的表单中的值；不要发明、抓取或推断 identifier。
- 官方文档讨论的是 `external_id`，不是 `external_pii`。如果用户说的是 `external_pii`，先确认他们是不是其实指 first-party external user identifier。

advertiser 可以从哪里获得各类 identifier：
- `email`: login、signup、checkout、newsletter 或其他 advertiser 已拥有的 first-party form / profile 数据
- `phone_number`: checkout、signup、support / contact 或 profile 流程中已收集的手机号
- `external_id`: advertiser 控制的 first-party user / customer identifier，例如内部账号 ID 或 CRM/customer ID

来自 TikTok 指南的实现细节：
- 对于 manual Advanced Matching，应把 `ttq.identify(...)` 放在对应 `ttq.track(...)` 调用之前。
- 指南中支持的 identifier 包括 `email`、`phone_number` 和 `external_id`。
- 原始 `email` 和 `phone_number` 可以交给 TikTok 在客户端做哈希，但前提是 advertiser 的隐私政策、consent 状态和 legal basis 允许这样做。
- 如果手动传入哈希值，遵循指南中的字段级哈希规则；指南指定的是 **SHA-256**。
- Email 哈希要求：哈希前先转小写，并去掉首尾空格。
- Phone number 要求：哈希前先标准化为 **E.164** 格式。
- External ID 要求：哈希前去掉首尾空格。

跨平台治理说明：
- 如果 TikTok 和 Meta 同时在范围内，先决定 shared policy layer 是否允许 matching。
- 然后决定两个平台是否都接收 identifier，还是只让其中一个接收。
- 即使 matching 被推迟或只在一个平台启用，也应保留非 PII 路径。

## 共享策略与平台适配器

当两个平台同时存在时，优先采用以下治理模型：
1. 只定义一次 shared privacy rule
2. 确认这份规则的 source of truth
3. 把规则映射成 TikTok 行为
4. 把同一规则映射成 Meta 行为
5. 记录任何有意的平台差异

如果 repo 已有 consent manager、privacy abstraction 或 GTM 管理的 privacy layer，优先复用，而不是再发明一条新的平行隐私路径。

## Reference pattern for Manual Advanced Matching

```javascript
ttq.identify({
    email: '0c7e6a405862e402eb76a70f8a26fc732d07c32931e9fae9ab1582911d2e8a3b',
    phone_number: '9f7ec22d72092cd3c0b58726ed9c2d91b92e51a3f29837508fb2948bb22dd2fd',
    external_id: '936a185caaa266bb9cbe981e9e05cb78cd732b0b3280eb944412bb6f8f8f07af',
})

ttq.track('CompleteRegistration')
```

## Rules

- 默认不要启用 PII reporting。
- 只有在用户明确要求、且隐私规则允许时，才复用已有 user / profile / session 数据。
- 即使 Advanced Matching 被推迟，也要保留非 PII bootstrap 路径。
- 不要绕过用户现有的 consent 或法律审查流程。
- 只在确实拥有所需 identifier 的页面 / 事件上发送 `ttq.identify(...)`。
- 如果 TikTok 和 Meta 同时在范围内，检查是否有某个平台在一条另一个平台并不共享的规则下接收了 identifier。
