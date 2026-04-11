# Bot Signatures Reference

User-agent classification tables for the agent-analytics skill. Classification is
case-insensitive substring matching. Match more specific patterns first to avoid
collisions (e.g., `Google-CloudVertexBot` before `Googlebot`).

---

## Category 1: AI User-Initiated

Bots that fire when a real user asks an AI assistant a question. Each visit is a
direct proxy for user intent. **Most valuable category for content optimization.**

| Agent ID | User-Agent Contains | Platform |
|---|---|---|
| `chatgpt-user` | `ChatGPT-User` | OpenAI |
| `claude-user` | `Claude-User` | Anthropic |
| `claude-code` | `Claude-Code` | Anthropic |
| `perplexity-user` | `Perplexity-User` | Perplexity |
| `duckassistbot` | `DuckAssistBot` | DuckDuckGo |
| `google-agent` | `Google-Agent` | Google |
| `google-cloudvertexbot` | `Google-CloudVertexBot` | Google |
| `gemini-deep-research` | `Gemini-Deep-Research` | Google |
| `mistralai-user` | `MistralAI-User` | Mistral |

---

## Category 2: AI Search

Crawlers that build AI search indexes. Not direct proxies for user queries, but
indicate your content is being indexed for AI-powered search surfaces.

| Agent ID | User-Agent Contains | Platform |
|---|---|---|
| `oai-searchbot` | `OAI-SearchBot` | OpenAI |
| `claude-searchbot` | `Claude-SearchBot` | Anthropic |
| `perplexitybot` | `PerplexityBot` | Perplexity |
| `meta-webindexer` | `Meta-WebIndexer` | Meta |
| `shapbot` | `ShapBot` | Perplexity |

---

## Category 3: LLM Training

Crawlers collecting data for model training. High volume, often indiscriminate.

| Agent ID | User-Agent Contains | Platform |
|---|---|---|
| `gptbot` | `GPTBot` | OpenAI |
| `claudebot` | `ClaudeBot` | Anthropic |
| `google-extended` | `Google-Extended` | Google |
| `meta-externalagent` | `Meta-ExternalAgent` | Meta |
| `amazonbot` | `Amazonbot` | Amazon |
| `amazon-qbusiness` | `Amazon-QBusiness` | Amazon |
| `bytespider` | `Bytespider` | ByteDance |
| `ai2bot` | `AI2Bot` | AI2 |
| `ccbot` | `CCBot` | Common Crawl |

---

## Category 4: Traditional Search

Classic search engine crawlers. Include for comparison with AI traffic patterns.

| Agent ID | User-Agent Contains | Platform |
|---|---|---|
| `googlebot` | `Googlebot` | Google |
| `googlebot-image` | `Googlebot-Image` | Google |
| `googlebot-video` | `Googlebot-Video` | Google |
| `bingbot` | `bingbot` | Microsoft |
| `duckduckbot` | `DuckDuckBot` | DuckDuckGo |
| `baiduspider` | `Baiduspider` | Baidu |
| `yandexbot` | `YandexBot` | Yandex |
| `yeti` | `Yeti` | Naver |
| `slurp` | `Slurp` | Yahoo |
| `yisouspider` | `YisouSpider` | Sogou |
| `applebot` | `Applebot` | Apple |
