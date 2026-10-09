# LinkedIn Ads

B2B advertising platform with professional targeting (job title, function, seniority, company, industry, company size) and account-based targeting from uploaded company and contact lists.

API facts below were checked against the [LinkedIn Marketing API docs](https://learn.microsoft.com/en-us/linkedin/marketing/versioning) on 2026-10-07.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | Versioned Marketing API at `https://api.linkedin.com/rest` (accounts, campaigns, creatives, targeting, audiences, reporting) |
| MCP | - | No official server; [Composio](composio.md) offers a LinkedIn toolkit |
| CLI | [✓](../clis/linkedin-ads.js) | Zero-dependency Node.js CLI (versioned REST API) |
| SDK | - | API-only (community libraries available) |

## Authentication

- **Type**: OAuth 2.0 (3-legged) access token from an app approved for the Marketing API program
- **Header**: `Authorization: Bearer {access_token}`
- **Scopes**: `r_ads`, `rw_ads`, `r_ads_reporting`
- **Env vars**: `LINKEDIN_ACCESS_TOKEN`; optional `LINKEDIN_API_VERSION` (YYYYMM, CLI default `202609`)

## Versioning

- Every call needs a `Linkedin-Version: YYYYMM` header plus `X-Restli-Protocol-Version: 2.0.0`. Requests without a version, or with a sunset version, return an error; the latest version is never applied by default.
- New versions ship monthly and each is supported for at least a year. Version `202510` sunsets on 2026-10-15. Bump the version at least once a year.
- The old unversioned `/v2/adAccountsV2`, `/v2/adCampaignsV2`, `/v2/adCreativesV2`, `/v2/adAnalyticsV2`, and `/v2/audienceCountsV2` paths are replaced by the versioned paths below.
- Rest.li 2.0 syntax: lists are `List(a,b)`, objects are `(key:value)`, and URNs inside query parameters must be URL-encoded (`urn%3Ali%3AsponsoredCampaign%3A123`).

## Common Agent Operations

### Ad accounts

```bash
node tools/clis/linkedin-ads.js accounts list
# GET https://api.linkedin.com/rest/adAccounts?q=search
```

### Campaigns (scoped to an ad account)

```bash
node tools/clis/linkedin-ads.js campaigns list --account-id 507404993 --status ACTIVE
# GET /rest/adAccounts/{accountId}/adCampaigns?q=search&search=(status:(values:List(ACTIVE)))

node tools/clis/linkedin-ads.js campaigns create --account-id 507404993 --campaign-group-id 600 --name "ABM retargeting" --daily-budget 50
# POST /rest/adAccounts/{accountId}/adCampaigns   (created PAUSED; add targeting before activating)

node tools/clis/linkedin-ads.js campaigns update --account-id 507404993 --id 123456 --status PAUSED
# POST /rest/adAccounts/{accountId}/adCampaigns/{campaignId}
# X-RestLi-Method: PARTIAL_UPDATE   body: {"patch":{"$set":{"status":"PAUSED"}}}
```

### Reporting

```bash
node tools/clis/linkedin-ads.js campaigns analytics --id 123456 --start 2026-09-01 --end 2026-09-30
# GET /rest/adAnalytics?q=analytics&pivot=CAMPAIGN&timeGranularity=ALL
#     &dateRange=(start:(year:2026,month:9,day:1),end:(year:2026,month:9,day:30))
#     &campaigns=List(urn%3Ali%3AsponsoredCampaign%3A123456)
#     &fields=impressions,clicks,landingPageClicks,costInLocalCurrency,externalWebsiteConversions,dateRange,pivotValues
```

Request metrics explicitly with `fields` (up to 20); otherwise only impressions and clicks come back. Use `q=statistics` with `pivots=List(...)` for up to three pivots, and the `MEMBER_COMPANY` pivot to see which companies saw an ABM campaign. Professional demographic metrics are approximate and delayed 12–24 hours.

### Creatives

```bash
node tools/clis/linkedin-ads.js creatives list --account-id 507404993 --campaign-id 123456
# GET /rest/adAccounts/{accountId}/creatives?q=criteria&campaigns=List(urn%3Ali%3AsponsoredCampaign%3A123456)
```

### Audience size

```bash
node tools/clis/linkedin-ads.js audiences count \
  --targeting "(include:(and:List((or:(urn%3Ali%3AadTargetingFacet%3Alocations:List(urn%3Ali%3Ageo%3A103644278))))))"
# GET /rest/audienceCounts?q=targetingCriteriaV2&targetingCriteria=...
```

The count is 0 when the audience is under 300 members (privacy threshold). Look up targeting entity URNs with `/rest/adTargetingEntities` (typeahead or by facet).

## Account-Based and Outbound Use

- **Matched Audiences**: upload a target account list (companies) or contact list to retarget the accounts you're prospecting, so your name is familiar before and during outreach. See [Matched Audiences](https://learn.microsoft.com/en-us/linkedin/marketing/matched-audiences/matched-audiences). Test ad accounts can't upload audience segments.
- **Company engagement**: the `MEMBER_COMPANY` reporting pivot shows which target companies are seeing and clicking ads, a warm signal for sales follow-up (see the `ads` skill's ABM playbook).

## Key Metrics

| Metric | Description |
|--------|-------------|
| `impressions` | Ad impressions |
| `clicks` | Total clicks |
| `landingPageClicks` | Clicks to the landing page |
| `costInLocalCurrency` | Spend |
| `externalWebsiteConversions` | Conversions tracked with the Insight Tag or Conversions API |
| `oneClickLeads` | Lead Gen Form submissions |

## Campaign Types

- `SPONSORED_UPDATES` - Sponsored content
- `TEXT_AD` - Text ads
- `SPONSORED_INMAILS` - Message ads
- `DYNAMIC` - Dynamic ads

## Rate Limits

- Limits are set per application and per member and shown in your app's Developer Portal analytics; LinkedIn doesn't publish fixed numbers for most endpoints.
- `adAnalytics` throttles above 45 million metric values per 5-minute window; request only the fields you need. Long URLs can hit `414`; use [query tunneling](https://learn.microsoft.com/en-us/linkedin/shared/references/migrations/query-tunneling-migration).

## Relevant Skills

- ads
- analytics
- attribution
- prospecting (account lists for ABM)
