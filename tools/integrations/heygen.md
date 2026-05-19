# HeyGen

AI avatar video generation platform. Create talking-head videos from text scripts with realistic lip-sync, expressions, and gestures.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | Yes | REST API v2 for video generation, avatars, templates |
| MCP | Yes | Official hosted MCP server — no local install needed |
| CLI | - | - |
| SDK | Yes | Node.js SDK available |

## Authentication

- **Type**: API Key
- **Header**: `X-Api-Key: {api_key}`
- **Get key**: Settings > API in HeyGen dashboard

## MCP Server Setup

HeyGen provides a hosted remote MCP server. No local installation required.

### Claude Code / Claude Desktop

Add to your MCP config:

```json
{
  "mcpServers": {
    "heygen": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://mcp.heygen.com/mcp"]
    }
  }
}
```

On first use, authenticates via browser OAuth. The MCP server exposes tools for:
- Creating videos from scripts
- Listing and selecting avatars
- Managing templates
- Checking video status

## API Quick Start

### Create a Video

```bash
curl -X POST https://api.heygen.com/v2/video/generate \
  -H "X-Api-Key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "video_inputs": [{
      "character": {
        "type": "avatar",
        "avatar_id": "AVATAR_ID",
        "avatar_style": "normal"
      },
      "voice": {
        "type": "text",
        "input_text": "Your script goes here.",
        "voice_id": "VOICE_ID"
      }
    }],
    "dimension": {
      "width": 1920,
      "height": 1080
    }
  }'
```

### List Avatars

```bash
curl https://api.heygen.com/v2/avatars \
  -H "X-Api-Key: YOUR_API_KEY"
```

### Check Video Status

```bash
curl https://api.heygen.com/v1/video_status.get?video_id=VIDEO_ID \
  -H "X-Api-Key: YOUR_API_KEY"
```

## Common Marketing Use Cases

| Use Case | Approach |
|----------|----------|
| Product explainer | Script from features → avatar presents |
| Feature announcement | Template with avatar + screen recording |
| Multilingual content | Same script, different language/voice |
| Personalized outreach | Dynamic variables (name, company) in script |
| Weekly updates | Recurring template, swap script text |

## Custom Avatars

Upload a 2-5 minute video of yourself speaking to create a digital twin:
- Looks and sounds like you
- Generates unlimited videos from text scripts
- Available on Creator plan and above

## Pricing

| Plan | Videos/mo | Max Duration |
|------|-----------|-------------|
| Free | 3 | 3 min |
| Creator | Unlimited | 5 min |
| Business | Unlimited | 20 min |
| Enterprise | Unlimited | Custom |

Check [heygen.com/pricing](https://www.heygen.com/pricing) for current prices — they change frequently.

## Rate Limits

- Free: 3 videos/month
- Paid: Based on plan tier, concurrent generation limits apply
- API rate limits: Check response headers for `X-RateLimit-*`

## Relevant Skills

- video
- social
- ad-creative
- sales-enablement
