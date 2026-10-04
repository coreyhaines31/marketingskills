# LinkedIn Ads

B2B advertising platform with professional targeting.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | Versioned Marketing API for campaigns, audiences, analytics |
| MCP | - | Not available |
| CLI | [✓](../clis/linkedin-ads.js) | Zero-dependency Node.js CLI |
| SDK | - | API-only (community libraries available) |

## Authentication and version

- **Type**: OAuth 2.0
- **Env var**: `LINKEDIN_ACCESS_TOKEN`
- **Header**: `Authorization: Bearer {access_token}`
- **Scopes**: `r_ads`, `r_ads_reporting`, `rw_ads`, depending on the operation
- **Version**: `LINKEDIN_API_VERSION` sets the required `LinkedIn-Version` header; the CLI defaults to `202609`, verified supported in October 2026. Check the [current supported versions](https://learn.microsoft.com/en-us/linkedin/marketing/integrations/migrations) before selecting a version.

Requests use `https://api.linkedin.com/rest` and `X-RestLi-Protocol-Version: 2.0.0`. The CLI encodes nested records, lists and URNs using Rest.li syntax. `--dry-run` previews the request with the access token masked.

## Common Agent Operations

### Get ad accounts and campaigns

```bash
node tools/clis/linkedin-ads.js accounts list
node tools/clis/linkedin-ads.js campaigns list --account-id 123456
```

The corresponding resources are `/rest/adAccounts?q=search` and `/rest/adAccounts/{account_id}/adCampaigns?q=search`. Campaign and creative operations require the owning account ID.

### Get campaign analytics

```bash
node tools/clis/linkedin-ads.js campaigns analytics --id 123456 \
  --start-year 2026 --start-month 9 --start-day 1 \
  --end-year 2026 --end-month 9 --end-day 30
```

The CLI calls `/rest/adAnalytics` with `q=analytics`, `pivot=CAMPAIGN`, `timeGranularity=ALL`, structured `dateRange`, and list-valued campaign URNs. Requested metrics are impressions, clicks, local-currency spend and `externalWebsiteConversions`.

### Create a paused campaign

Supply the account, campaign group, locale, targeting and political declaration explicitly. The example shows a text ad; Sponsored Content and Dynamic Ads also need `--associated-entity` with the beneficiary organization's URN. Dynamic Ads additionally require `--total-budget` and `--format FOLLOW_COMPANY|JOBS|SPOTLIGHT`; both budget currencies use `--currency`.

```bash
node tools/clis/linkedin-ads.js campaigns create \
  --account-id 123456 --campaign-group-id 234567 --name "Campaign Name" \
  --type TEXT_AD --cost-type CPC --unit-cost 5.00 --daily-budget 100.00 \
  --currency USD --locale-country US --locale-language en \
  --targeting '{"include":{"and":[{"or":{"urn:li:adTargetingFacet:locations":["urn:li:geo:103644278"]}}]}}' \
  --political-intent NOT_DECLARED --dry-run
```

`--political-intent` must reflect the advertiser's declaration (`POLITICAL`, `NOT_POLITICAL` or `NOT_DECLARED`), not a declaration inferred by an agent. For EU targeting, LinkedIn requires the partner interface to show its [advertiser consent notice](https://learn.microsoft.com/en-us/linkedin/marketing/integrations/ads/account-structure/create-and-manage-campaigns#campaign) before submission or activation: it begins "I confirm this is not political advertising." The full notice also covers the advertiser's ads under the targeted countries' rules, including EU rules. Present the complete notice from the linked documentation clearly, with its checkbox selected by default as LinkedIn specifies, and pass the advertiser's actual response in `politicalIntent`. The CLI flag alone does not collect that consent. Creation remains `PAUSED`; it does not activate spending. Use the account's currency. Amounts are passed as decimal strings, preserving precision.

On a successful empty HTTP 201 response, the CLI returns the new ID from `x-restli-id`. LinkedIn still validates account access, targeting, budgets and campaign requirements.

### Update campaign status

```bash
node tools/clis/linkedin-ads.js campaigns update \
  --account-id 123456 --id 345678 --status PAUSED
```

This calls `/rest/adAccounts/{account_id}/adCampaigns/{campaign_id}` with `X-RestLi-Method: PARTIAL_UPDATE` and a status-only patch.

### Get creatives

```bash
node tools/clis/linkedin-ads.js creatives list \
  --account-id 123456 --campaign-id 345678
```

Uses `/rest/adAccounts/{account_id}/creatives?q=criteria` with list-valued campaign URNs.

### Get audience counts

```bash
node tools/clis/linkedin-ads.js audiences count \
  --targeting '{"include":{"and":[{"or":{"urn:li:adTargetingFacet:locations":["urn:li:geo:103644278"]}}]}}'
```

Uses the `GET /rest/audienceCounts?q=targetingCriteriaV2` finder. The JSON criteria are converted to Rest.li record/list syntax, including encoded URN keys and values. No POST body is sent.

## Key Metrics

| Metric | Description |
|--------|-------------|
| `impressions` | Ad impressions |
| `clicks` | Total clicks |
| `costInLocalCurrency` | Spend |
| `externalWebsiteConversions` | Website conversions |
| `leadGenerationMailContactInfoShares` | Lead form submissions |

## Campaign Types

- `SPONSORED_UPDATES` - Sponsored content
- `TEXT_AD` - Text ads
- `SPONSORED_INMAILS` - Message ads
- `DYNAMIC` - Dynamic ads

## Official API References

- [Ad accounts](https://learn.microsoft.com/en-us/linkedin/marketing/integrations/ads/account-structure/create-and-manage-accounts)
- [Campaigns and required fields](https://learn.microsoft.com/en-us/linkedin/marketing/integrations/ads/account-structure/create-and-manage-campaigns)
- [Campaign formats](https://learn.microsoft.com/en-us/linkedin/marketing/integrations/ads/campaign-formats)
- [Creatives](https://learn.microsoft.com/en-us/linkedin/marketing/integrations/ads/account-structure/create-and-manage-creatives)
- [Reporting](https://learn.microsoft.com/en-us/linkedin/marketing/integrations/ads-reporting/ads-reporting)
- [Audience count syntax](https://learn.microsoft.com/en-us/linkedin/marketing/integrations/ads/advertising-targeting/audience-counts)

## Relevant Skills

- ads
- analytics
