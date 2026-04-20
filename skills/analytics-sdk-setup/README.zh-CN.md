# Analytics SDK Setup

中文说明见此文件。英文版请看 [`README.md`](./README.md)。

一个面向真实代码库的 agent skill，用来审计、安装、比较、对齐和修复 TikTok Pixel + Meta Pixel 集成。

## 为什么有这个项目

Analytics SDK 工作通常不是难在原理，而是死在那些很常见的问题上：snippet 被贴错位置、同一平台被初始化两次、TikTok 和 Meta 逐渐漂移、以及在没有明确政策的情况下启用了隐私敏感行为。

这个项目把这些经验沉淀成一个可复用的 skill，交给 repo-aware 编码代理使用。它不把 analytics 当作“贴代码”问题，而是当作工程与治理问题来处理。

### 它的差异点

- **先理解 repo，再动代码** —— 不盲贴 snippet，而是先看真实代码结构。
- **天然双平台视角** —— 把 TikTok 和 Meta 当成一个系统，而不是两个孤立 patch。
- **先选执行模式，再继续** —— 强制代理先判断是直接实现、先做计划，还是先提问。
- **默认隐私保守** —— 不猜测 CSP、LDU、consent 或 PII 行为。
- **输出有结构** —— 支持 questions-first、plan-first、direct-implementation 三种结果形态。

## 使用 `skills` CLI 安装

最简单的试用方式，是使用 [`skills`](https://www.npmjs.com/package/skills) CLI。

### 快速安装示例

把这个 skill 通过本地路径安装到 Claude Code 项目里：

```bash
npx skills add ./analytics-sdk-setup -a claude-code
```

也可以从 GitHub 仓库来源安装：

```bash
npx skills add Peter-WF/analytics-sdk-setup -a claude-code
```

安装后可以这样验证：

```bash
npx skills list -a claude-code
```

### 项目级安装 vs 全局安装

对 Claude Code 来说，`skills` CLI 同时支持项目级和全局安装。

| 范围 | 参数 | Claude Code 路径 | 适用场景 |
|---|---|---|---|
| 项目级 | 默认 | `.claude/skills/` | 随项目共享，必要时可提交到仓库 |
| 全局 | `-g` | `~/.claude/skills/` | 跨项目复用 |

全局安装示例：

```bash
npx skills add ./analytics-sdk-setup -g -a claude-code
```

## 这个 skill 能做什么

这个 skill 面向需要在真实仓库里处理 tracking 代码的编码代理。

它帮助代理完成这些工作：

- 审计现有 TikTok / Meta 接入
- 比较两个平台并识别漂移
- 修复重复初始化
- 对齐事件触发时机与事件语义
- 审查 bootstrap ownership 与 source of truth
- 在 consent、CSP、LDU、Advanced Matching 等约束下安全工作

## 它是如何工作的

这个 skill 强制代理遵守 repo-aware 工作流，而不是一上来就直接写代码。

### 必须先做的第一步

在做任何事之前，代理必须：

1. 先判断执行模式
2. 明确输出所选模式
3. 用 1–2 行解释原因

### 执行模式

- **Mode A — Direct implementation**：repo、范围、配置来源和隐私约束都明确时，直接实现。
- **Mode B — Plan first**：任务仍然偏架构、范围较大，或者主要是治理问题时，先做计划。
- **Mode C — Questions first**：Pixel ID、consent 行为、route 范围或 ownership 等关键 blocker 还不明确时，先提问。

### 核心工作模型

这个 skill 通过双平台决策框架来工作：

- 每个平台本身是否正确
- 跨平台是否一致
- ownership 和 source of truth 在哪里
- 一个局部修复是否真的改善整体治理

这意味着它不只问“TikTok 能不能跑起来”，还会继续追问：TikTok 和 Meta 是否保持对齐、是否存在重复初始化、ownership 是否清晰、以及隐私敏感改动是否真的被允许。

## 项目结构

```text
analytics-sdk-setup/
├── README.md
├── README.zh-CN.md
├── SKILL.md
├── SKILL.zh-CN.md
├── agent-system-prompt.md
├── agent-system-prompt.zh-CN.md
├── evals/
│   └── evals.json
└── references/
    ├── install-and-events.md
    ├── install-and-events.zh-CN.md
    ├── privacy-and-csp.md
    └── privacy-and-csp.zh-CN.md
```

### 文件分工

- `SKILL.md` —— 规范主文档
- `agent-system-prompt.md` —— 面向单一 prompt block 环境的紧凑运行时摘要
- `evals/evals.json` —— 用于执行模式与触发行为回归检查的轻量提示词集合
- `references/install-and-events.md` —— bootstrap placement、事件映射、payload 和验证
- `references/privacy-and-csp.md` —— consent、CSP、LDU、Advanced Matching / PII 护栏
- `*.zh-CN.md` —— 方便审查和团队推广的中文 companion 文件

## 参考资料

先通过 README 理解项目，再根据需要深入下面这些文档。

### 规范主文档

- [`SKILL.md`](./SKILL.md)
- [`SKILL.zh-CN.md`](./SKILL.zh-CN.md)

### 紧凑运行时 prompt

- [`agent-system-prompt.md`](./agent-system-prompt.md)
- [`agent-system-prompt.zh-CN.md`](./agent-system-prompt.zh-CN.md)

### 安装与事件参考

- [`references/install-and-events.md`](./references/install-and-events.md)
- [`references/install-and-events.zh-CN.md`](./references/install-and-events.zh-CN.md)

### 隐私与 CSP 参考

- [`references/privacy-and-csp.md`](./references/privacy-and-csp.md)
- [`references/privacy-and-csp.zh-CN.md`](./references/privacy-and-csp.zh-CN.md)

## 示例请求

可以把这个 skill 用在下面这类请求里：

- “Compare TikTok and Meta tracking in this repo and tell me where they drift.”
- “Fix duplicate Pixel initialization and keep TikTok and Meta aligned.”
- “Add Purchase tracking for TikTok and Meta using the same business moment and shared contract.”
- “Audit ownership, consent gating, and source of truth for TikTok and Meta events.”

它也适合更窄一点的请求，例如：

- 修复某个 app shell 里的重复初始化
- 在已知成功点增加一个明确事件
- 审查某次改动是否真的需要调整 CSP

## 快速操作示例

这些示例适合用来检查 skill 是否在正确场景下被触发。

### 审计与对账
用户提示词：
> Compare TikTok and Meta tracking in this repo and tell me where they drift.

预期第一步：
- 先判断执行模式
- 在提出改动前先检查 repo ownership、共享 bootstrap 和事件漂移

### 狭窄的重复初始化修复
用户提示词：
> Fix the duplicate Pixel initialization in our checkout app shell, but do not change unrelated tracking.

预期第一步：
- 只有在 ownership 和隐私 blocker 都清晰时才进入 direct implementation
- 保持修复局部化，避免做 broad refactor

### Questions-first 隐私 blocker
用户提示词：
> Add TikTok + Meta Purchase tracking, but I am not sure whether consent gating or Pixel IDs are already configured.

预期第一步：
- 切换到 questions-first
- 只问最少的阻塞性问题，而不是编造 ID 或隐私行为

## 快速验证流程

安装后，可以用下面的轻量方式验证 skill：

1. 先确认 skill 已安装：
   ```bash
   npx skills list -a claude-code
   ```
2. 用一个 audit prompt 和一个 blocker 较多的 prompt 分别触发它。
3. 检查第一轮输出是否明确选择了 `Mode A`、`Mode B` 或 `Mode C`。
4. 检查 plan/questions 模式是否没有直接跳进 patch。
5. 检查输出是否保持隐私保守，并在两个平台都在范围内时把 TikTok + Meta 当作共享治理问题处理。

## 安全与验证说明

这个 skill 是有意设计成“保守默认”的。

- 它**不会**假设 Pixel ID、consent 规则、CSP allowlist、LDU 规则或 PII 来源。
- 它**不会**默认启用 Advanced Matching / PII。
- 它优先复用 repo 里已有的 analytics 和 privacy abstraction。
- 当隐私策略不明确时，它会把相关改动视为 blocker，而不是继续猜。

对于安装结果，可以直接用 `skills` CLI 验证：

```bash
npx skills list -a claude-code
```

对于运行效果，最重要的检查包括：

- 每个平台的 bootstrap 只初始化一次
- page-view 行为不会重复
- 目标事件只在真实业务时刻触发一次
- 隐私 gate 行为符合预期

## 相关链接

- [`skills` on npm](https://www.npmjs.com/package/skills)
- [Agent Skills specification](https://agentskills.io)
- [skills.sh](https://skills.sh)
- [Claude Code skills documentation](https://code.claude.com/docs/en/skills)
