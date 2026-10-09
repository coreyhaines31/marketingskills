# Composio Marketing Tools

Detailed mapping of Composio toolkits to marketing use cases. Organized by the same categories as [REGISTRY.md](../REGISTRY.md).

## CRM

| Composio Toolkit | Auth | Key Marketing Actions | Depth |
|-----------------|------|----------------------|-------|
| `HUBSPOT` | OAuth 2.0 | Get/create contacts, list deals by stage, get company info, manage lists, search contacts by property | Deep |
| `SALESFORCE` | OAuth 2.0 | Run SOQL queries, get/create leads, list opportunities, get account details, update records | Deep |

## Email & SMS

| Composio Toolkit | Auth | Key Marketing Actions | Depth |
|-----------------|------|----------------------|-------|
| `ACTIVECAMPAIGN` | API Key | Get contacts, list automations, add contacts to lists, get campaign stats | Medium |
| `KLAVIYO` | API Key | Get profiles, list segments, get campaign metrics, add to lists | Medium |
| `MAILCHIMP` | OAuth 2.0 | Get audiences, list campaigns, get campaign reports, add subscribers | Deep |
| `GMAIL` | OAuth 2.0 | Send emails, search inbox, read messages, manage labels | Deep |

## Advertising

| Composio Toolkit | Auth | Key Marketing Actions | Depth |
|-----------------|------|----------------------|-------|
| `FACEBOOKADS` | OAuth 2.0 | Get campaign insights, list ad sets, get ad performance, read audience data | Medium |
| `LINKEDIN` | OAuth 2.0 | Get campaign analytics, list campaigns, get company page stats | Medium |
| `GOOGLEADS` | OAuth 2.0 | Get campaign performance, list ad groups, keyword stats | Medium |

## Productivity & Collaboration

| Composio Toolkit | Auth | Key Marketing Actions | Depth |
|-----------------|------|----------------------|-------|
| `GOOGLESHEETS` | OAuth 2.0 | Read/write cells, create sheets, format ranges, append rows | Deep |
| `SLACK` | OAuth 2.0 | Send messages, read channels, upload files, search messages | Deep |
| `NOTION` | OAuth 2.0 | Read/create pages, query databases, update blocks, search | Deep |
| `AIRTABLE` | OAuth 2.0 | List/create/update records, query views, manage tables | Deep |

## Commerce

| Composio Toolkit | Auth | Key Marketing Actions | Depth |
|-----------------|------|----------------------|-------|
| `SHOPIFY` | OAuth 2.0 | Get products, list orders, get customer data, inventory levels | Deep |

## Analytics

| Composio Toolkit | Auth | Key Marketing Actions | Depth |
|-----------------|------|----------------------|-------|
| `GOOGLEANALYTICS` | OAuth 2.0 | Run reports, get real-time data, list properties | Medium |

## Coverage Depth Guide

- **Deep** — 20+ actions, covers most common operations, suitable for daily use
- **Medium** — 5-20 actions, covers core read operations and some writes
- **Shallow** — Under 5 actions, basic read-only access

## Coverage vs. Native Tools

This table shows where Composio adds value compared to what's already in the MarketingSkills registry:

| Tool | Native MCP | Native CLI | Composio MCP | Recommendation |
|------|:----------:|:----------:|:------------:|----------------|
| HubSpot | ✓ | ✓ | ✓ | Prefer the native HubSpot MCP (GA April 2026); Composio if you already route everything through it |
| Salesforce | - | ✓ | ✓ | **Use Composio** — adds MCP access |
| Meta Ads | - | ✓ | ✓ | **Use Composio** — adds MCP access |
| LinkedIn Ads | - | ✓ | ✓ | **Use Composio** — adds MCP access |
| Google Sheets | - | - | ✓ | **Use Composio** — only MCP option |
| Slack | - | - | ✓ | **Use Composio** — only MCP option |
| Notion | - | - | ✓ | **Use Composio** — only MCP option |
| Airtable | - | - | ✓ | **Use Composio** — only MCP option |
| ActiveCampaign | - | ✓ | ✓ | **Use Composio** — adds MCP access |
| Klaviyo | - | ✓ | ✓ | **Use Composio** — adds MCP access |
| Shopify | - | ✓ | ✓ | **Use Composio** — adds MCP access |
| Gmail | - | - | ✓ | **Use Composio** — only MCP option |
| GA4 | ✓ | ✓ | ✓ | **Use native** — deeper coverage |
| Stripe | ✓ | ✓ | ✓ | **Use native** — deeper coverage |
| Mailchimp | ✓ | ✓ | ✓ | **Use native** — deeper coverage |
| Google Ads | ✓ | ✓ | ✓ | **Use native** — deeper coverage |

## Toolkit Reference

Each Composio toolkit name maps to its `TOOL_NAME` identifier used in the Composio platform. When searching for available actions, use these exact names:

```bash
# List all actions for a toolkit
npx composio actions list --app HUBSPOT

# Search for specific actions
npx composio actions list --app FACEBOOKADS --search "insights"
```

For the full integration guide including setup, pricing, and limitations, see [composio.md](../integrations/composio.md).
