# Upload-Post API Reference

Complete API documentation for multi-platform social media posting.

**Base URL**: `https://api.upload-post.com`

**Documentation**: [docs.upload-post.com](https://docs.upload-post.com)

---

## Authentication

All requests require an API key in the header:

```bash
Authorization: Apikey your-api-key-here
```

Get your API key from the [Upload-Post dashboard](https://app.upload-post.com).

---

## Supported Platforms

| Platform | Code | Content Types |
|----------|------|---------------|
| TikTok | `tiktok` | Video |
| Instagram Reels | `instagram` | Video, Images |
| Instagram Feed | `instagram_feed` | Video, Images, Carousels |
| YouTube Shorts | `youtube` | Video (< 60s, 9:16) |
| YouTube Long | `youtube_long` | Video |
| LinkedIn | `linkedin` | Video, Images |
| X/Twitter | `twitter` | Video, Images |
| Facebook | `facebook` | Video, Images |
| Threads | `threads` | Video, Images |
| Pinterest | `pinterest` | Video, Images |
| Reddit | `reddit` | Video, Images |
| Bluesky | `bluesky` | Video, Images |

---

## Upload Endpoint

### POST /api/upload

Upload and distribute content to multiple platforms.

#### Basic Request

```bash
curl \
  -H 'Authorization: Apikey YOUR_API_KEY' \
  -F 'video=@/path/to/video.mp4' \
  -F 'title="Your Title"' \
  -F 'description="Your description"' \
  -F 'platform[]=tiktok' \
  -F 'platform[]=instagram' \
  -F 'platform[]=youtube' \
  -X POST https://api.upload-post.com/api/upload
```

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `video` | File | Yes* | Video file (MP4, MOV, WebM) |
| `image` | File | Yes* | Image file (JPG, PNG, WebP) |
| `title` | String | Yes | Main title/caption |
| `description` | String | No | Extended description |
| `platform[]` | Array | Yes | Target platforms |
| `user` | String | No | Profile identifier (for multiple accounts) |
| `schedule` | ISO 8601 | No | Schedule time (UTC) |

*Either `video` or `image` required.

#### Platform-Specific Parameters

Override defaults for specific platforms:

```bash
# TikTok specific
-F 'tiktok_title="TikTok title with #fyp #viral"'
-F 'tiktok_description="TikTok description"'

# Instagram specific
-F 'instagram_caption="Instagram caption with different #hashtags"'

# YouTube specific
-F 'youtube_title="SEO Optimized YouTube Title | Keywords"'
-F 'youtube_description="Full YouTube description with links..."'
-F 'youtube_tags="tag1,tag2,tag3"'

# LinkedIn specific
-F 'linkedin_title="Professional LinkedIn Title"'
-F 'linkedin_description="Value-focused LinkedIn description"'
```

#### Response

```json
{
  "success": true,
  "post_id": "abc123",
  "platforms": {
    "tiktok": {
      "status": "processing",
      "id": "tiktok_video_id"
    },
    "instagram": {
      "status": "processing",
      "id": "instagram_media_id"
    },
    "youtube": {
      "status": "processing",
      "id": "youtube_video_id"
    }
  }
}
```

---

## Scheduling

### Schedule a Post

```bash
curl \
  -H 'Authorization: Apikey YOUR_API_KEY' \
  -F 'video=@video.mp4' \
  -F 'title="Scheduled Post"' \
  -F 'platform[]=tiktok' \
  -F 'platform[]=instagram' \
  -F 'schedule=2024-12-25T10:00:00Z' \
  -X POST https://api.upload-post.com/api/upload
```

### Get Scheduled Posts

```bash
curl \
  -H 'Authorization: Apikey YOUR_API_KEY' \
  'https://api.upload-post.com/api/scheduled'
```

### Cancel Scheduled Post

```bash
curl \
  -H 'Authorization: Apikey YOUR_API_KEY' \
  -X DELETE 'https://api.upload-post.com/api/scheduled/POST_ID'
```

---

## Analytics Endpoint

### GET /api/analytics/{post_id}

Get performance metrics for a post.

```bash
curl \
  -H 'Authorization: Apikey YOUR_API_KEY' \
  'https://api.upload-post.com/api/analytics/abc123'
```

#### Response

```json
{
  "post_id": "abc123",
  "created_at": "2024-01-15T10:00:00Z",
  "platforms": {
    "tiktok": {
      "views": 15420,
      "likes": 1250,
      "comments": 89,
      "shares": 234,
      "watch_time_avg": 12.5
    },
    "instagram": {
      "views": 8930,
      "likes": 890,
      "comments": 45,
      "saves": 123,
      "shares": 67
    },
    "youtube": {
      "views": 5670,
      "likes": 234,
      "comments": 34,
      "watch_time_avg": 28.3
    }
  },
  "totals": {
    "views": 30020,
    "likes": 2374,
    "comments": 168,
    "engagement_rate": 8.5
  }
}
```

---

## Profiles (Multiple Accounts)

### List Profiles

```bash
curl \
  -H 'Authorization: Apikey YOUR_API_KEY' \
  'https://api.upload-post.com/api/profiles'
```

### Post to Specific Profile

```bash
curl \
  -H 'Authorization: Apikey YOUR_API_KEY' \
  -F 'video=@video.mp4' \
  -F 'title="Post Title"' \
  -F 'platform[]=tiktok' \
  -F 'user=client_account_1' \
  -X POST https://api.upload-post.com/api/upload
```

---

## Webhooks

### Configure Webhook

Set up a webhook URL in your dashboard to receive post status updates:

```json
{
  "event": "post.completed",
  "post_id": "abc123",
  "platform": "tiktok",
  "status": "success",
  "platform_id": "tiktok_video_123",
  "url": "https://tiktok.com/@user/video/123"
}
```

### Event Types

| Event | Description |
|-------|-------------|
| `post.processing` | Upload received, processing |
| `post.completed` | Successfully posted to platform |
| `post.failed` | Failed to post (includes error) |
| `post.scheduled` | Post scheduled for future |

---

## Code Examples

### Python

```python
import requests

def upload_to_platforms(video_path, title, description, platforms):
    """Upload video to multiple platforms via Upload-Post"""
    
    with open(video_path, 'rb') as video_file:
        response = requests.post(
            'https://api.upload-post.com/api/upload',
            headers={
                'Authorization': 'Apikey YOUR_API_KEY'
            },
            files={
                'video': video_file
            },
            data={
                'title': title,
                'description': description,
                'platform[]': platforms
            }
        )
    
    return response.json()

# Example usage
result = upload_to_platforms(
    video_path='./my-video.mp4',
    title='Check out this marketing tip!',
    description='Learn how to grow your audience #marketing #tips',
    platforms=['tiktok', 'instagram', 'youtube', 'linkedin']
)

print(f"Post ID: {result['post_id']}")
```

### JavaScript/Node.js

```javascript
const FormData = require('form-data');
const fs = require('fs');
const axios = require('axios');

async function uploadToPlatforms(videoPath, title, description, platforms) {
  const form = new FormData();
  form.append('video', fs.createReadStream(videoPath));
  form.append('title', title);
  form.append('description', description);
  platforms.forEach(p => form.append('platform[]', p));

  const response = await axios.post(
    'https://api.upload-post.com/api/upload',
    form,
    {
      headers: {
        'Authorization': 'Apikey YOUR_API_KEY',
        ...form.getHeaders()
      }
    }
  );

  return response.data;
}

// Example usage
uploadToPlatforms(
  './my-video.mp4',
  'Check out this marketing tip!',
  'Learn how to grow your audience #marketing #tips',
  ['tiktok', 'instagram', 'youtube', 'linkedin']
).then(result => {
  console.log('Post ID:', result.post_id);
});
```

### cURL with Scheduling

```bash
# Schedule post for tomorrow at 9am UTC
curl \
  -H 'Authorization: Apikey YOUR_API_KEY' \
  -F 'video=@content.mp4' \
  -F 'title="Scheduled Content"' \
  -F 'description="This will post automatically"' \
  -F 'platform[]=tiktok' \
  -F 'platform[]=instagram' \
  -F 'platform[]=youtube' \
  -F 'schedule=2024-12-26T09:00:00Z' \
  -X POST https://api.upload-post.com/api/upload
```

---

## Error Handling

### Common Errors

| Code | Error | Solution |
|------|-------|----------|
| 401 | Invalid API key | Check your API key |
| 400 | Missing required field | Include video/image and platform |
| 413 | File too large | Compress video or upgrade plan |
| 422 | Invalid platform | Check platform code spelling |
| 429 | Rate limited | Wait and retry with backoff |
| 500 | Server error | Retry after a moment |

### Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "INVALID_PLATFORM",
    "message": "Platform 'tiktoc' is not valid. Did you mean 'tiktok'?",
    "details": {
      "valid_platforms": ["tiktok", "instagram", "youtube", ...]
    }
  }
}
```

---

## Rate Limits

| Plan | Requests/min | Uploads/day |
|------|--------------|-------------|
| Free | 10 | 10 |
| Basic | 60 | Unlimited |
| Professional | 120 | Unlimited |
| Business | Custom | Unlimited |

Implement exponential backoff for rate limit errors.

---

## Best Practices

1. **Validate locally first** — Check file format and size before upload
2. **Use webhooks** — Don't poll for status, receive notifications
3. **Handle failures gracefully** — Retry with backoff on transient errors
4. **Store post IDs** — Keep track for analytics retrieval
5. **Use scheduling** — Spread posts throughout the day
6. **Platform-specific content** — Use override parameters for best results

---

## Resources

- **Documentation**: [docs.upload-post.com](https://docs.upload-post.com)
- **Dashboard**: [app.upload-post.com](https://app.upload-post.com)
- **n8n Node**: Available in n8n community nodes
- **Support**: support@upload-post.com
