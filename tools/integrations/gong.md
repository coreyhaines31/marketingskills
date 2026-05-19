# Gong

Revenue intelligence platform that records, transcribes, and analyzes sales conversations (calls, video meetings, emails) to surface deal insights, coaching opportunities, and competitive intelligence.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | REST API, Basic Auth or OAuth2 |
| MCP | - | Not available |
| CLI | - | Not available |
| SDK | - | REST API only; community Python client via dltHub |

## Authentication

- **Type**: Basic Auth (Access Key + Secret) or OAuth2 for published apps
- **Get key**: Admin-only — Settings > API at https://app.gong.io
- **Base URL**: Tenant-specific — retrieve from your Gong API settings (typically `https://{tenant}.api.gong.io/v2/`)
- **Docs**: https://help.gong.io/docs/what-the-gong-api-provides

## API Endpoints

Most Gong API endpoints use **POST** with JSON request bodies for filtering. Check the [official API docs](https://gong.app.gong.io/settings/api/documentation) for current endpoint availability.

### Calls

```bash
# List calls (with date/user filters)
POST /v2/calls/extensive

# Get call transcripts (batch, by call IDs)
POST /v2/calls/transcript
```

### Users & Stats

```bash
# List users
GET /v2/users

# Get activity stats (talk ratio, questions asked, longest monologue)
POST /v2/stats/activity/day-by-day
```

### Engagement Flows

```bash
# List flows
GET /v2/flows

# Get flow analytics
GET /v2/flows/{id}/analytics
```

## Key Data Points

### Per Call
- Full transcript with speaker labels and timestamps
- Talk-to-listen ratio per participant
- Topics discussed (auto-detected)
- Questions asked (count and content)
- Longest monologue duration
- Next steps mentioned
- Competitor mentions
- Pricing discussions flagged

### Per Deal
- All associated calls and emails
- Deal stage progression
- Risk signals (gone dark, competitor mentioned, champion left)
- Engagement score

### Per Rep
- Talk ratio trends
- Question frequency
- Topic coverage vs. playbook
- Win rate correlation with behaviors

## Common Agent Operations

### Extract Competitive Intelligence from Calls

1. Query calls mentioning competitor names
2. Extract: objections raised, features compared, pricing discussed
3. Synthesize into competitive battlecard updates
4. Track competitor mention frequency over time

### Mine Calls for Customer Research

1. Pull transcripts from recent won/lost deals
2. Extract: pain points, trigger events, decision criteria, language used
3. Feed into persona building and messaging work
4. Identify recurring objections for sales enablement

### Revenue Attribution

1. Pull call data alongside CRM deal data
2. Map which content/pages were discussed in winning deals
3. Identify which talking points correlate with closed-won
4. Build content-to-revenue attribution reports

### Rep Coaching Insights

1. Compare top performer call patterns vs. team average
2. Identify: talk ratio, question frequency, topic coverage gaps
3. Surface specific call moments for coaching review
4. Track improvement over time

## Rate Limits

- 3 API calls per second
- 10,000 API calls per day
- Pagination required for large result sets

## When to Use

- Mining sales call transcripts for customer research and VOC data
- Extracting competitive intelligence from prospect conversations
- Building revenue attribution models (content → deal influence)
- Analyzing win/loss patterns across deal transcripts
- Coaching sales reps based on conversation analytics
- Identifying common objections and buying signals

## Limitations

- API access requires admin credentials
- Transcript quality depends on call audio quality
- Rate limits (10k/day) may constrain large-scale analysis
- Pricing is enterprise-level (not publicly listed, typically $100+/user/month)
- Requires team adoption — records calls via integrations, but also supports uploading calls from non-integrated telephony systems

## Relevant Skills

- customer-research
- sales-enablement
- competitors
- revops
- cold-email

## Sources

- [Gong API overview](https://help.gong.io/docs/what-the-gong-api-provides)
- [Gong API documentation](https://gong.app.gong.io/settings/api/documentation)
- [Call upload support](https://help.gong.io/docs/uploading-calls-from-a-non-integrated-telephony-system)
