# Hotjar

Behavior analytics platform with heatmaps, session recordings, and surveys for understanding user experience.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | Survey export and user lookup (Scale plans) |
| MCP | - | Not available |
| CLI | ✓ | [hotjar.js](../clis/hotjar.js) |
| SDK | ✓ | JavaScript tracking snippet, Identify API, Events API |

## Authentication

- **Type**: OAuth 2.0 Client Credentials
- **Token endpoint**: `POST https://api.hotjar.io/v1/oauth/token`
- **Header**: `Authorization: Bearer {access_token}`
- **Get credentials**: Hotjar Dashboard > Integrations > API
- **Token expiry**: 3600 seconds (1 hour)

### Token Request

```bash
POST https://api.hotjar.io/v1/oauth/token
Content-Type: application/x-www-form-urlencoded

grant_type=client_credentials&client_id={client_id}&client_secret={client_secret}
```

### Token Response

```json
{
  "access_token": "<token>",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

## Common Agent Operations

### List Surveys

```bash
GET https://api.hotjar.io/v1/sites/{site_id}/surveys

Authorization: Bearer {access_token}
```

### Get Survey Responses

```bash
GET https://api.hotjar.io/v1/sites/{site_id}/surveys/{survey_id}/responses?limit=100

Authorization: Bearer {access_token}
```

Supports cursor-based pagination with `cursor` and `limit` parameters.

The public API reference documents survey export and user lookup. It does not
provide the site-list, heatmap, recording, or form-export routes shown in the
legacy CLI commands. Those commands are not verified public API integrations;
use the dashboard for those workflows. Find site IDs in Sites & Organizations.

Survey export requires Ask Scale. API credentials expire after one year and
must be replaced. The documented public API version is `v1`.

```bash
node tools/clis/hotjar.js surveys list --site-id 42 --limit 25 --cursor '<next_cursor>'
node tools/clis/hotjar.js surveys responses --site-id 42 --survey-id '<survey_id>' --cursor '<next_cursor>'
```

Repeat the original command with the returned `next_cursor` to retrieve another
page. Request previews use the same URL and remain offline.

Source: [Hotjar API Reference](https://help.hotjar.com/hc/en-us/articles/36820005914001-Hotjar-API-Reference).

## Key Metrics

### Survey Response Data
- `response_id` - Unique response identifier
- `answers` - Array of question/answer pairs
- `created_at` - Response timestamp
- `device_type` - Desktop, mobile, tablet

## Parameters

### Surveys and Survey Responses
- `limit` - Results per page (CLI default: 100; API maximum: 100)
- `cursor` - The `next_cursor` returned by the previous page
- Responses are sorted by creation date descending; filtering by date is not supported.

## When to Use

- Analyzing user behavior patterns on landing pages
- Collecting qualitative feedback via on-site surveys
- Identifying UX issues through session recordings
- Understanding scroll depth and engagement via heatmaps
- Validating CRO hypotheses with user behavior data
- Form abandonment analysis

## Rate Limits

- 3000 requests/minute (50 per second)
- Rate limited by source IP address
- Cursor-based pagination for large result sets

## Relevant Skills

- cro
- ab-testing
- analytics
- ux-audit
- landing-page
