# CardCrafter (卡咔)

AI image generation for Chinese social media formats: multi-page Xiaohongshu (RedNote) posts, WeChat article covers, knowledge cards, and single images from prompts. Chinese-market product — the console and docs are in Chinese.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | Yes | REST under `https://api.cardcrafter.cn/openapi/v1` |
| MCP | Yes | Hosted Streamable HTTP server at `https://api.cardcrafter.cn/mcp` — no local install |
| CLI | - | - |
| SDK | - | Use REST or MCP directly |

## Authentication

- **Type**: API key (starts with `kc-`)
- **Header**: `Authorization: Bearer $KAKA_API_KEY` (or `X-API-Key`)
- **Get key**: Sign in at [cardcrafter.cn](https://www.cardcrafter.cn) → sidebar "API 接入" → 生成 API Key. The key spends the account's own energy credits.

Store the key in `KAKA_API_KEY`. Base URL is `https://api.cardcrafter.cn` (override with `KAKA_BASE_URL`).

## What It Generates

| Endpoints | Output | Notes |
|-----------|--------|-------|
| `POST /openapi/v1/viral/outlines` → `POST /openapi/v1/viral/images` | Xiaohongshu post: AI writes title, body, and per-page outline, then renders 3–15 card pages (3:4) | Outline is synchronous (allow up to 4 min); rendering is async |
| `POST /openapi/v1/series/split` → `POST /openapi/v1/series/images` | Splits existing long-form text into 1–18 card pages (9:16 / 1:1 / 4:3) | Text with `\n---\n` separators splits deterministically (no AI call); the draft is editable via `PUT` before rendering |
| `POST /openapi/v1/covers` | Multi-size covers in one call (WeChat 2.35:1, Xiaohongshu 3:4, 9:16, …) | `GET /openapi/v1/covers/platforms` lists sizes |
| `POST /openapi/v1/cards` | Knowledge cards from raw text (AI polishes the copy) | 9:16 / 3:4 / 1:1 |
| `POST /openapi/v1/images` | Single image from a prompt | 1:1 / 3:4 / 4:3 / 9:16 / 16:9 / 2.35:1; optional style and one reference image |

## Common Operations

Check balance and daily quota:

```bash
curl -sS https://api.cardcrafter.cn/openapi/v1/me \
  -H "Authorization: Bearer $KAKA_API_KEY"
```

Generate WeChat + Xiaohongshu covers (async job):

```bash
cat > cover.json <<'EOF'
{"title": "AI 绘画入门指南", "subtitle": "零基础 10 分钟上手", "platforms": ["wechat_article_cover", "xiaohongshu_cover"]}
EOF
curl -sS -X POST https://api.cardcrafter.cn/openapi/v1/covers \
  -H "Authorization: Bearer $KAKA_API_KEY" -H "Content-Type: application/json" \
  --data-binary @cover.json
```

Generate one image from a prompt (async job):

```bash
cat > image.json <<'EOF'
{"prompt": "一只戴墨镜的橘猫在冲浪板上乘风破浪，扁平插画，高饱和撞色", "ratio": "9:16"}
EOF
curl -sS -X POST https://api.cardcrafter.cn/openapi/v1/images \
  -H "Authorization: Bearer $KAKA_API_KEY" -H "Content-Type: application/json" \
  --data-binary @image.json
```

Poll any job to a terminal state — `completed`, `partial`, or `error` (renders typically take 2–5 minutes):

```bash
curl -sS https://api.cardcrafter.cn/openapi/v1/records/rec_xxxx \
  -H "Authorization: Bearer $KAKA_API_KEY"
```

`partial` means some pages failed; every scene has a regenerate endpoint (e.g. `POST /openapi/v1/covers/regenerate`) that accepts a per-page `feedback` string.

**Windows note**: request bodies containing Chinese text must be written to a UTF-8 file and sent with `--data-binary @file`. Inline Chinese in a Windows shell gets transcoded to GBK and the API rejects it with `422 mojibake_detected`.

## MCP Server Setup

Hosted remote MCP (Streamable HTTP) exposing the same operations as the REST API — 17 tools including `get_me`, `list_styles`, `generate_viral_outline`, `generate_series_split`, `generate_cover`, `generate_card`, `generate_image`, and `get_record`. No OAuth; pass the API key as a header.

For Claude Desktop / Claude Code via `mcp-remote`:

```json
{
  "mcpServers": {
    "cardcrafter": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://api.cardcrafter.cn/mcp", "--header", "Authorization: Bearer KAKA_API_KEY"]
    }
  }
}
```

Replace `KAKA_API_KEY` with the real key; keep it in the environment or a secret store, not in the repo. Any client that speaks Streamable HTTP can connect to `https://api.cardcrafter.cn/mcp` directly with the same header.

## Pricing & Limits

- Energy-credit billing, same prices as the web product: per call for outlines and text splitting, per image for renders and covers. `GET /me` returns the balance and daily quota (the quota is user-adjustable, 1–1000 calls/day).
- Failed generations refund automatically. Generated image URLs expire after 15 days — download assets you need to keep.
- The image model is configured server-side; requests cannot pin a specific model or vendor.

## Links

- [Full API reference](https://api.cardcrafter.cn/openapi/skill.md) — every endpoint with request/response shapes, webhooks, and error codes
- [Product & API key console](https://www.cardcrafter.cn)
