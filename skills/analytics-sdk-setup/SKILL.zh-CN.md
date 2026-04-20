---
name: analytics-sdk-setup
description: 当用户希望编码代理在真实 repo 中审计、安装、对账、对齐或修复 TikTok Pixel 和/或 Meta Pixel 代码时使用此技能——尤其适用于重复初始化、tracking 漂移、事件映射、consent/CSP/LDU/隐私 gating，或 analytics ownership 不清晰的场景。
---

# Analytics SDK 设置

当用户希望编码代理在真实代码库中检查、安装、比较、对齐、对账或修复 TikTok Pixel 和 Meta Pixel 跟踪时，使用此技能。

即使用户没有直接提到这个技能名，只要真实需求是 repo 级别的 Pixel 调试或对齐工作，例如重复初始化、page-view 行为异常、tracking 漂移、事件映射、consent/CSP 审查，或 source of truth 清理，也应激活这个技能。

这个技能面向 Claude Code、Cursor 以及类似的 repo-aware 编码代理。代理不能只是盲贴 snippet，而是必须先检查仓库、找到共享 bootstrap 位置、避免重复初始化、保留现有有效集成，并在启用敏感跟踪前明确隐私 / 合规决策。

## 配套 prompt

如果当前环境不会直接加载 `SKILL.md`，而是只接受单个 prompt block，请使用：
- `agent-system-prompt.md`

将 `SKILL.md` 视为规范的主技能说明，将 `agent-system-prompt.md` 视为紧凑的运行时摘要。

## 使用示例

这个技能适用于下面这类请求：
- "Compare TikTok and Meta tracking in this repo and tell me where they drift."
- "Fix duplicate Pixel initialization and keep TikTok and Meta aligned."
- "Add Purchase tracking for TikTok and Meta using the same business moment and shared contract."
- "Audit ownership, consent gating, and source of truth for TikTok and Meta events."

如果用户只是想要概念解释，而不是 repo 分析或实现，不要使用这个技能。

## 核心目标

这个技能不只是为了安装或修一个单独的 Pixel。

它的核心目标，是帮助代理把 TikTok 和 Meta 当作一个双平台跟踪系统来处理：
- 验证每个平台本身是否正确
- 评估跨平台一致性
- 识别 ownership 和 source of truth
- 判断哪些应该统一
- 判断哪些应该保持平台差异

示例或 reference 中可能先写 TikTok，但这个技能的范围并不局限于 TikTok。只要任务同时涉及两个平台，任何实现、审计或修复都应该同时考虑两边。

## 必须先做的第一步

在做任何事情之前，你 MUST：
1. 先判断执行模式（`Mode A`、`Mode B` 或 `Mode C`）
2. 明确输出所选模式
3. 用 1-2 行说明原因

在完成这一步之前，DO NOT 编写任何代码。

## 快速修复模式

如果用户请求显然很窄，例如修复重复初始化，或只新增一个事件：
- 可以跳过完整的治理分析
- 优先关注局部正确性
- 只有在用户明确提到两个平台，或者这个局部改动显然会制造漂移时，才检查跨平台对齐

只有在任务范围确实足够窄、且隐私 blocker 也都已解决时，才能使用 quick-fix 判断。

Quick fix mode 不会绕过 output contract。你仍然要保留所选模式要求的必要章节，只是可以把非关键治理部分写得更简短，或标记为不适用。

## 思考步骤（必须遵守）

1. 用户在要求什么？
2. repo 是否可用？
3. 是否存在 blocker？
4. 选择执行模式。
5. 然后再继续。

## 何时激活

当用户提出以下任一请求时，激活此技能：
- 安装或修复 TikTok Pixel 或 Meta Pixel
- 对齐、对账或比较 TikTok 和 Meta 的事件跟踪
- 调查重复 Pixel 初始化、page-view 行为异常或 tracking 漂移
- 配置事件映射、参数映射、去重或 Advanced Matching
- 审查 CSP、LDU、consent 或与 PII 相关的约束
- 审计现有 analytics 集成是否正确
- 清理 repo 中 analytics ownership 或 source of truth
- 让 Cursor、Claude Code 之类的编码代理直接实现或调试 Pixel 集成
- 产出关于 TikTok / Meta 跟踪治理或对账的建议

即使用户没有说出“analytics-sdk-setup”，只要明显需要 repo-aware 的 Pixel 检查、修复或对齐，也应该激活。

## 何时不要激活

如果用户只是想要以下内容，不要启动完整执行流程：
- 概念解释、文档帮助或术语澄清
- TikTok Pixel 和 Meta Pixel 的高层理论差异
- 不涉及代码库的营销策略讨论
- 分析报表类工作，而不是 SDK / Pixel 集成与修复

如果用户只想要解释，直接回答即可，不要运行完整技能流程。

## 跨平台决策框架

当任务同时涉及 TikTok 和 Meta 时，始终通过以下四个视角评估工作：

1. `Per-platform correctness`
   - 每个平台是否都安装正确、只初始化一次，并在正确的业务时机发送事件？

2. `Cross-platform consistency`
   - 两个平台是否用兼容的时机和核心语义表示同一个业务动作？

3. `Ownership and source of truth`
   - 哪个文件、模块、wrapper、provider 或 tag manager 拥有 bootstrap、事件映射、隐私 gating 和参数 contract？

4. `Governance over local fixes`
   - 一个局部修复会改善整个双平台系统，还是会加剧 TikTok 和 Meta 之间的漂移？

如果局部修复会让双平台治理更差，优先给出 plan 或治理建议，而不是做狭窄 patch。

## Execution mode decision

在提出代码改动前，必须准确选择一种执行模式。

### Mode A: Direct implementation

只有在以下条件全部满足时，才能直接实现：
- repo 可用，并且目标 app 或 site 可以识别。
- 能够定位共享 bootstrap 位置，或已有 analytics abstraction。
- 平台范围明确：TikTok、Meta 或两者。
- Pixel ID 已提供，或者 repo 内已经有可信配置来源。
- 目标环境、域名、页面范围或 route 范围足够明确，可以安全实现。
- 请求足够具体，例如安装 bootstrap、修复重复初始化，或新增某个明确事件。
- 不存在会迫使代理去猜 consent、LDU 或 PII 行为的隐私 blocker。

### Mode B: Plan first

如果代码库可用，但工作仍偏设计型，应使用 plan-first，例如：
- 共享 render path 不明显。
- repo 包含多个 app、品牌、域名，或多个可能的接入点。
- 用户想要的是广义的 TikTok / Meta 事件对齐，而不是单一修复。
- 代理需要先把业务动作映射到事件，再改代码。
- 当前集成在 wrapper、provider、inline snippet 或 tag-manager ownership 之间混杂，需要先审查。
- 主要任务是比较、治理审查或对账，而不是一个狭窄实现。

在这个模式下，你 MUST NOT 修改代码或提出 patch。

### Mode C: Questions first

如果存在 blocker，先问最少但高价值的问题，包括：
- Pixel ID 缺失，且 repo 中没有可靠配置来源。
- Consent、LDU 或 PII / Advanced Matching 要求未知，而这些会影响实现行为。
- 目标 app、环境、route 范围或 rollout 范围不明确。
- 现有 analytics provider 或 tag-manager ownership 不清楚。
- 用户想对齐事件，但背后的业务语义仍然模糊。

在这个模式下，你 MUST NOT 提出实现方案或代码。

如果不确定，优先遵循：
1. 先 audit，后 implementation
2. 先 plan，后 broad refactor
3. 优先保留现有隐私行为，而不是启用新的 tracking
4. 优先做最小 bootstrap 修复，而不是推测式事件扩张

## Required inputs and blocking conditions

在进行实质性改动前，先收集或确认这些输入。

### Required for direct implementation
- 涉及哪些平台：TikTok、Meta 或两者
- Pixel ID，或现有可信配置来源
- 目标 app、域名、页面或 route group
- 目标环境：仅生产、也包含 staging，还是全部环境
- Pixel 是全局加载，还是只在选定页面加载
- 如果请求涉及事件实现，需要明确要跟踪哪些业务事件

### Blocking conditions

如果以下任一问题未解决，不要直接实现敏感或有歧义的行为：
- 是否启用了 CSP，以及 tracking 改动是否需要修改 CSP
- 是否已有 consent gating，或应该 gate load 还是 gate event dispatch
- 是否适用 LDU，以及它是 pixel-wide 还是 event-specific
- 是否允许 Advanced Matching / PII
- 是否存在单一共享 bootstrap 位置
- 是否已有 GTM / analytics provider / wrapper 拥有这部分集成
- TikTok 和 Meta 是否应该共享一个 business-event contract，还是在某段流程中故意分叉

如果存在 blocker，切换到 plan-first 或 questions-first，不要猜。

## Safe defaults and conservative behavior

当信息不完整时，使用以下保守默认：
- 不要编造 Pixel ID、事件语义、consent 规则、CSP allowlist、LDU 策略或 PII 来源。
- 默认不要启用 Advanced Matching / PII。
- 除非规则明确，否则不要启用 LDU。
- 如果事件范围不清楚，把工作限制在 bootstrap placement、重复审计或 plan。
- 如果环境范围不清楚，优先复用 repo 中已有的 env gating，而不是发明新策略。
- 如果 repo 已有 analytics config、隐私工具或 wrapper，优先复用，而不是绕过。
- 如果 SPA 中 page-view 语义不明确，不要推测性地添加 route-change tracking。
- 在得到明确批准前，让隐私敏感行为保持关闭。
- 不要在某些平台差异本来就是有意或必须时，强行做对称统一。

## Repo inspection workflow

在添加或移动 SDK 代码之前，始终先检查现有代码。

按以下顺序执行：
1. 找出用户真正希望被跟踪的目标 app、site 或 package。
2. 判断页面如何产出：共享 HTML template、SSR layout、SPA shell、Next.js layout，还是已有 analytics provider。
3. 找到最合适的共享 bootstrap 位置。
4. 搜索现有 TikTok 和 Meta 初始化。
5. 搜索现有事件分发、helper wrapper、route-change hook 以及 tag-manager bridge。
6. 确认以下内容的 ownership 和 source of truth：
   - bootstrap placement
   - event taxonomy
   - parameter contract
   - consent 或 privacy gating
   - tag-manager 与 app-code 的边界
7. 将治理状态分类为以下之一：
   - `single-platform only`
   - `dual-platform but ungoverned`
   - `platform-correct but cross-platform drifted`
   - `aligned with intentional platform-specific differences`
   - `privacy/governance blocked`
8. 如有必要，记录工程标签，例如：
   - duplicate initialization
   - event-only mismatch
   - privacy / gating mismatch
   - wrapper conflict
   - CSP blocked
9. 如果 repo 证据改变了最初判断，重新选择执行模式。

## Duplicate detection protocol

在改任何东西之前，同时检查 direct call 和 wrapped integration。

### Search for direct init and page-view calls
- TikTok bootstrap: `ttq.load(`
- TikTok base page view: `ttq.page(`
- Meta bootstrap: `fbq('init'`
- Meta page view: `fbq('track', 'PageView'`

### Also inspect wrapper-level ownership
检查：
- analytics provider 组件
- 包装 `ttq` 或 `fbq` 的 helper function
- tag-manager bridge
- root layout 或 app-shell 的 script injection helper
- 可能导致 page-view 重复的 route-change hook

### Treat these as duplicate-risk scenarios
以下情况都应视为重复风险：
- 同一个平台从多个 layout、template 或 app shell 初始化。
- bootstrap 和 SPA route hook 同时发送 base page-view，且意图不明确。
- 某个组件 mount 或 click handler 也初始化了 SDK。
- inline snippet 与更高层的 provider 或 GTM 管理集成并存。

### Consolidation rule
如果发现重复初始化且 ownership 明确：
1. 在最佳共享位置保留一个初始化。
2. 删除其他 init / load 调用。
3. 保留现有有效事件跟踪，除非事件本身也有问题。
4. 只有在不会引入更大 refactor 的情况下，才复用或收敛配置。

如果 ownership 不明确，不要自动合并冲突集成。切换到 plan-first 或 questions-first。

## Implementation workflow

只有在 direct-implementation 模式下使用这个流程。

1. 每个平台只保留或创建一个共享 bootstrap 位置。
2. 优先使用已有的全局 layout、base template、app shell 或 analytics provider，而不是分散 snippet。
3. 尽量复用已有 config、环境开关、consent 工具和隐私 wrapper。
4. 在扩展事件代码前，先修复重复初始化。
5. 在映射到 TikTok / Meta 细节之前，先定义或保留共享 business-event contract。
6. 只在真实业务成功点新增或规范事件调用。
7. 只有在两个平台明确表示同一业务动作时，才对齐 payload。
8. 改动保持最小、局部，并只围绕 tracking。
9. 优先修复坏掉的事件调用，而不是重新安装整个 SDK。

Do not:
- 在 UI 组件、click handler 或重复页面脚本里初始化
- 因为别处 tracking 出问题，就再加一个 init / load
- 在没有明确必要时，用 raw snippet 替换合规 wrapper
- 做与 tracking 无关的广泛重构
- 仅因为一个平台本地正确，就声称双平台治理已完成

如果需要 bootstrap placement、事件命名、映射、payload 示例和验证细节，请在实现事件相关改动前查看 `references/install-and-events.md`。

## Plan-only workflow

当 repo 可用，但实现还不该开始时，使用这个流程。

输出一个简洁但可直接落地的报告，包含：
- 已确认的平台范围
- 可能的共享 bootstrap 位置
- 各平台当前状态
- 治理状态
- duplicate-init 发现
- 现有 privacy / consent / CSP 约束
- 按业务动作整理的 draft event mapping
- 明确 blocker 和推荐下一步

如果主要任务仍然是架构、范围选择、事件设计或跨平台治理，优先给出 plan，而不是直接编辑。

## Ownership and source of truth

当同时涉及 TikTok 和 Meta 时，识别并报告：
- bootstrap ownership 在哪里
- event taxonomy 在哪里定义
- mapping rule 在哪里定义
- privacy gate 在哪里生效
- GTM、app code、wrapper 或 backend logic 是否分别拥有系统不同部分

如果 ownership 是分裂的，plan 或 implementation report 应明确说明这种分裂是有意的、临时的，还是当前漂移的根源。

## Privacy and compliance guardrails

在启用敏感行为前，必须显式检查隐私约束。

- 如果项目里已有 consent 或 privacy 工具，优先复用。
- 不要编造 CSP allowlist。
- 不要编造 LDU 逻辑或区域规则。
- 未经明确批准，也没有合法 first-party 数据来源时，不要启用 Advanced Matching / PII。
- 不要绕过现有法律、consent 或地区审查流程。
- 如果实现会改变敏感行为而政策又不明确，就停下来提问。
- 如果同时涉及 TikTok 和 Meta，检查它们是否应该受同一套共享隐私策略控制。

如果需要 CSP、consent gating、LDU、identifier handling 和共享隐私治理细节，请在实现这些改动前查看 `references/privacy-and-csp.md`。

## Output contract

使用以下结果结构之一。

### If you are in questions-first mode

```markdown
# Analytics SDK questions

## What blocks implementation
- ...

## Decisions that affect both TikTok and Meta
- ...

## Required answers
1. ...
2. ...
3. ...

## Safe progress so far
- ...
```

提问时只问最少但高价值的问题。如果真正阻塞实现的只有 2-3 个答案，不要把完整输入清单全抛出来。

### If you are in plan-first mode

```markdown
# Analytics SDK setup plan

## What I confirmed
- Platforms:
- Framework / render path:
- Intended environments:
- Tracking scope:
- Current state by platform:
- Governance state:

## TikTok vs Meta gaps
- ...

## What to unify
- ...

## What remains platform-specific
- ...

## Ownership / source of truth
- ...

## Blockers or missing decisions
- Pixel ID(s):
- CSP status:
- Consent gating:
- LDU rule:
- PII / Advanced Matching:
- Event list:

## Governance recommendation
- ...

## Recommended next step
- ...
```

### If you are in direct-implementation mode

```markdown
# Analytics SDK implementation

## Bootstrap location
- file/path
- why this is the shared render point

## Current state by platform
- TikTok:
- Meta:

## Cross-platform decisions
- ...

## What was unified
- ...

## Intentional platform-specific differences
- ...

## Ownership / source of truth
- ...

## Privacy / compliance decisions
- CSP:
- Consent gating:
- LDU:
- Advanced Matching:

## Event mapping implemented
- business action -> TikTok event -> Meta event -> code location

## TikTok vs Meta gaps that remain
- ...

## Verification
- per-platform correctness holds
- cross-platform consistency is improved or explicitly bounded
- bootstrap initializes once per platform
- target events fire once at the correct business moment
- privacy gates behave as intended
```

## Reference routing

如果任务涉及：
- bootstrap placement、event payload、event mapping 或 platform-specific implementation detail → 阅读 `references/install-and-events.md`
- CSP、consent behavior、LDU、Advanced Matching / PII，或 shared-vs-platform-specific privacy rule → 阅读 `references/privacy-and-csp.md`

把 vendor snippet、payload example 和低层策略细节都放在 reference 里，不要再塞回这个主文件。

## Pre-implementation gate

在写代码前，确认以下全部成立：
- 目标 app 或 site 已识别。
- 已识别共享 render path 或现有 analytics abstraction。
- 已完成各平台当前状态分类。
- 已完成治理状态分类。
- 对 duplicate-init 的 ownership 已有足够把握，可以安全修改。
- 阻塞性的隐私问题已解决，或任务已被限制在安全、非敏感的子范围内。
- 当前选择的执行模式仍然正确。

如果其中任何一项失败，不要进行大范围实现。

## Post-implementation verification

结束前，从两个层面验证成功。

### Per-platform correctness
- 每个平台最多只初始化一次。
- 初始化位于全局 / 共享位置。
- 除非是有意为之且能解释清楚，否则组件或 click handler 中不应再残留 init / load 调用。
- Page-view 行为只出现在预期位置，且不会重复。
- 当适用时，Purchase 等 commerce 事件包含 `currency` 和 `value` 等必要字段。
- 隐私 gate 行为符合预期，没有被绕过。

### Cross-platform consistency
- 只有在业务语义一致时，TikTok 和 Meta 的事件名与关键参数才需要对齐。
- 保留下来的差异必须是有意且被说明的。
- Ownership 和 source of truth 要被保留或澄清。
- 实现应与相关 reference 文件保持一致。
