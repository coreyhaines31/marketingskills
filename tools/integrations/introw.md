# Introw PRM

Partner Relationship Management platform for managing channel partners, tracking partner-sourced deals, commissions, tasks, and engagement — with built-in business review generation.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | - | Not available |
| MCP | ✓ | Full read/write via Claude connector |
| CLI | - | Not available |
| SDK | - | Not available |

## Authentication

- **Type**: OAuth2 (via MCP connector)
- **Setup**: Connect via Claude MCP connector — no API key management needed
- **Scope**: All data is scoped to the authenticated organisation

## Common Agent Operations

All operations are performed via MCP tools. The following are the primary tool calls available.

### Search Partners

```
search_partners
  dateRange: { field: "CREATED_AT" | "LAST_ACTIVITY_AT", from: "YYYY-MM-DD", to: "YYYY-MM-DD" }
```

Returns: partner name/ID, contact info, tier, lifecycle stage, categories, country, last activity date.

### Search CRM Objects (Deals, Tickets, Leads, Companies, Contacts)

```
search_crm_objects
  objectType: "DEAL" | "TICKET" | "LEAD" | "COMPANY" | "CONTACT"
  stage: "OPEN" | "WON" | "LOST"
  view: "ALL" | "DUE" | "OVERDUE" | "INACTIVE"
  rollingDateFilter: { field: "CLOSED_AT", value: "THIS_QUARTER" }
  sortBy: { property: "AMOUNT", direction: "DESC" }
  limit: 10
```

Synonym mapping: Opportunity/Forecast → `DEAL`, Account → `COMPANY`, Case → `TICKET`.

### Search Tasks

```
search_tasks
  status: "TODO" | "IN_PROGRESS" | "PENDING" | "COMPLETED" | "DONE"
  partnerId: "{partner_id}"
```

### Search Commissions

```
search_commissions
  partnerId: "{partner_id}"
```

Returns: commission amounts, currency, payment status, associated partner and deals.

### Generate Business Review (QBR/MBR/WBR)

```
generate_business_review
  duration: "QUARTERLY" | "MONTHLY" | "WEEKLY"
  partnerId: "{partner_id}"
```

Returns: pipeline & forecast analysis, form submissions overview, mutual action plan, goal tracking, timed agenda and next steps.

### Search Partner Engagement

```
search_partner_engagement
  partnerId: "{partner_id}"
  type: "ROOM_VISIT" | "OBJECT_SHARE" | "COMMENT" | "FORM_SUBMIT" | "TASK_CREATED" | ...
  dateRange: { from: "YYYY-MM-DD", to: "YYYY-MM-DD" }
```

Returns: comments, deal updates, asset views, task events, portal visits, form submissions, announcements, quotes.

### Add Comment to Deal/Object

```
add_comment
  comment: "Comment text"
  objectId: "{crm_object_id}"
  objectType: "DEAL" | "TICKET" | "LEAD" | "COMPANY" | "CONTACT"
```

### Create or Update Tasks

```
add_task
  name: "Task title"
  dueDate: "2025-02-20"
  assignedTo: "PARTNER" | "ORGANISATION"
  partnerId: "{partner_id}"

update_task
  taskId: 123
  status: "TODO" | "IN_PROGRESS" | "DONE"
```

### Update CRM Object Properties

```
update_crm_object
  objectId: "{crm_object_id}"
  objectType: "DEAL"
  propertiesToUpdate: { "amount": 50000, "stage": "Negotiation" }
```

### Share Lead or Register Deal

Two-step flow:
1. **Discovery**: provide `objectType` and `callToAction` to get form fields
2. **Submit**: provide `formId` and `userProvidedData` to submit

```
share_lead_or_register_deal
  objectType: "Deal"
  callToAction: "Register Deal"
  partnerId: "{partner_id}"
```

## Key Metrics

### Partner Data
- `id` - Partner ID
- `name` - Partner company name
- `championEmail` - Primary contact email
- `tier` - Current tier level
- `lifecycleStage` - Partner lifecycle stage
- `categories` - Partner categories
- `country` - Partner country
- `lastActivityAt` - Last activity date

### CRM Object Data
- `objectId` - External CRM ID
- `objectType` - DEAL, TICKET, LEAD, COMPANY, CONTACT
- `stage` - OPEN, WON, LOST
- `amount` - Deal amount
- `closeDate` - Expected close date

### Commission Data
- `amount` - Commission amount
- `currency` - Payment currency
- `paymentStatus` - Current payment status
- `partnerId` - Associated partner
- `dealId` - Associated deal

### Engagement Data
- `type` - Activity type (ROOM_VISIT, COMMENT, FORM_SUBMIT, etc.)
- `partnerId` - Partner involved
- `crmObjectId` - Related CRM object
- `createdAt` - Activity timestamp

## When to Use

- Managing channel partner relationships and tracking partner activity
- Reviewing partner-sourced pipeline (deals, leads, opportunities)
- Preparing QBR/MBR/WBR meetings with automated business review generation
- Tracking partner commissions and payouts
- Managing mutual action plans via tasks assigned to partners or internal teams
- Processing deal registrations and lead sharing from partners
- Monitoring partner portal engagement and content asset views

## Rate Limits

- Rate limits managed by the MCP connector
- All data scoped to authenticated organisation

## Relevant Skills

- revops
- sales-enablement
- referrals
- competitors
