# Crossbeam

Partner ecosystem platform (now part of Reveal) for sharing account data with partners to identify co-sell opportunities, overlapping customers, and partner-sourced pipeline.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | Partners, Populations, Overlaps, Reports, Threads |
| MCP | ✓ | [Claude connector](https://claude.com/connectors/crossbeam) |
| CLI | ✓ | [crossbeam.js](../clis/crossbeam.js) |
| SDK | - | REST API only |

## Authentication

- **Type**: API Key
- **Header**: `Authorization: Bearer {api_key}`
- **Get key**: Settings > API at https://app.crossbeam.com

## Common Agent Operations

### List Partners

```bash
GET https://api.crossbeam.com/v1/partners
Authorization: Bearer {api_key}
```

### Get Partner Details

```bash
GET https://api.crossbeam.com/v1/partners/{id}
Authorization: Bearer {api_key}
```

### List Populations

```bash
GET https://api.crossbeam.com/v1/populations
Authorization: Bearer {api_key}
```

### List Overlaps

```bash
GET https://api.crossbeam.com/v1/overlaps/accounts?partner-id={partner_id}&population-ids[]={own_population_id}
Authorization: Bearer {api_key}
```

### Find a Source Record's Overlaps

```bash
GET https://api.crossbeam.com/v1/overlaps/accounts/search?record_id={source_record_id}
Authorization: Bearer {api_key}
```

The CLI defaults to partner account overlaps; `--type leads` selects partner
lead overlaps. The type describes the partner's records, not necessarily your
own source records. Use `overlaps list --population-id` for your own population
and `overlaps get --partner-population-id` for the partner's population filter.

`overlaps get --record-id` performs exact source-record matching and returns the
API's overlap search results. `--id` remains an alias for that source record ID;
it is not an overlap object's ID. List responses expose `pagination.next_cursor`
and `has_more`; pass the cursor with `--cursor` and continue until `has_more` is
false, even if a page is empty. The search endpoint is not paged.

See the [Crossbeam Partner API reference](https://developers.crossbeam.com/).

### Search Accounts

```bash
GET https://api.crossbeam.com/v1/accounts/search?domain={domain}
Authorization: Bearer {api_key}
```

### List Reports

```bash
GET https://api.crossbeam.com/v1/reports
Authorization: Bearer {api_key}
```

### List Collaboration Threads

```bash
GET https://api.crossbeam.com/v1/threads
Authorization: Bearer {api_key}
```

## Key Metrics

### Partner Data
- `id` - Partner ID
- `name` - Partner company name
- `status` - Partnership status (active, pending, etc.)
- `created_at` - When the partnership was established
- `populations_shared` - Number of shared populations

### Population Data
- `id` - Population ID
- `name` - Population name (e.g., "Customers", "Open Opportunities")
- `record_count` - Number of records in population
- `partner_visibility` - What partners can see

### Overlap Data
- `id` - Overlap ID
- `partner_id` - Partner involved
- `population_id` - Population matched
- `account_name` - Overlapping account name
- `overlap_type` - Type of overlap (customer, prospect, etc.)
- `match_confidence` - Match confidence score

### Report Data
- `id` - Report ID
- `name` - Report name
- `type` - Report type
- `created_at` - Creation date
- `results` - Report results data

## Parameters

### Overlaps List
- `partner_id` - Filter by specific partner
- `population_id` - Filter by specific population

### Accounts Search
- `domain` - Company domain to search for

## When to Use

- Identifying co-sell opportunities with channel partners
- Finding overlapping customers and prospects across partner ecosystems
- Building partner-sourced pipeline by matching accounts
- Tracking partner influence on deals
- Creating account mapping reports for partner meetings
- Prioritizing which partners to engage based on overlap data

## Rate Limits

- Rate limits vary by plan
- Standard: 100 requests/minute
- Pagination supported on list endpoints

## Relevant Skills

- revops
- sales-enablement
- referrals
- competitors
