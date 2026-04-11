# Cloudflare Setup Reference

Detailed setup and query reference for Cloudflare MCP / GraphQL Analytics API ingestion.
Used by Step 1 Path A of the agent-analytics skill.

---

## MCP Server Setup

Connect via the Cloudflare MCP server to query the GraphQL Analytics API. The queries
use the `httpRequestsAdaptiveGroups` dataset, available on all Cloudflare plans
including free.

**This is NOT the built-in "Cloudflare Developer Platform" connector** (that one only
covers Workers/D1/R2 and cannot access analytics). The correct MCP server URL is:

```
https://mcp.cloudflare.com/mcp
```

- **Claude desktop**: Settings > Developer > Edit Config, add to `mcpServers`
- **Claude Code**: `claude mcp add --transport http cloudflare-api https://mcp.cloudflare.com/mcp`
- **Cursor**: Add as a remote MCP server in settings

During OAuth authorization, grant at minimum the **Read Only** permission set, which
includes `account:read` (required for analytics access) and `zone:read`.

---

## Zone Discovery

Do NOT ask the user for their Zone ID. Auto-discover it:

```
GET /zones?per_page=50
```

Via the MCP execute tool:
```javascript
const response = await cloudflare.request({
  method: "GET", path: "/zones", query: { per_page: 50 }
});
return response.result.map(z => ({ name: z.name, id: z.id, plan: z.plan?.name }));
```

If there is one zone, use it automatically. If there are multiple, ask the user which
domain they want to analyze. The plan name (e.g., "Free Website") is useful for knowing
whether paid-only features like `clientRefererHost` will be available.

---

## Date Range Handling

Start by requesting 7 days of data. If the API returns an error like "cannot request a
time range wider than 1d", the zone is on the free plan. Fall back to querying one day
at a time and merging results — loop over the last 7 days individually.

---

## Main GraphQL Query

Use aliases to fetch all four bot categories in a single API call. Set limit to 10000
per alias (the Cloudflare maximum).

```graphql
{
  viewer {
    zones(filter: { zoneTag: "<ZONE_ID>" }) {

      aiUserInitiated: httpRequestsAdaptiveGroups(
        filter: {
          datetime_geq: "<START_DATE>"
          datetime_leq: "<END_DATE>"
          requestSource: "eyeball"
          OR: [
            { userAgent_like: "%ChatGPT-User%" }
            { userAgent_like: "%Claude-User%" }
            { userAgent_like: "%Claude-Code%" }
            { userAgent_like: "%Perplexity-User%" }
            { userAgent_like: "%DuckAssistBot%" }
            { userAgent_like: "%Google-Agent%" }
            { userAgent_like: "%Gemini-Deep-Research%" }
            { userAgent_like: "%MistralAI-User%" }
            { userAgent_like: "%Google-CloudVertexBot%" }
          ]
        }
        limit: 10000
        orderBy: [count_DESC]
      ) {
        count
        dimensions {
          clientRequestPath
          userAgent
          edgeResponseStatus
        }
      }

      aiSearch: httpRequestsAdaptiveGroups(
        filter: {
          datetime_geq: "<START_DATE>"
          datetime_leq: "<END_DATE>"
          requestSource: "eyeball"
          OR: [
            { userAgent_like: "%OAI-SearchBot%" }
            { userAgent_like: "%Claude-SearchBot%" }
            { userAgent_like: "%PerplexityBot%" }
            { userAgent_like: "%Meta-WebIndexer%" }
            { userAgent_like: "%ShapBot%" }
          ]
        }
        limit: 10000
        orderBy: [count_DESC]
      ) {
        count
        dimensions {
          clientRequestPath
          userAgent
          edgeResponseStatus
        }
      }

      training: httpRequestsAdaptiveGroups(
        filter: {
          datetime_geq: "<START_DATE>"
          datetime_leq: "<END_DATE>"
          requestSource: "eyeball"
          OR: [
            { userAgent_like: "%GPTBot%" }
            { userAgent_like: "%ClaudeBot%" }
            { userAgent_like: "%Google-Extended%" }
            { userAgent_like: "%Meta-ExternalAgent%" }
            { userAgent_like: "%Amazonbot%" }
            { userAgent_like: "%Bytespider%" }
            { userAgent_like: "%CCBot%" }
            { userAgent_like: "%AI2Bot%" }
          ]
        }
        limit: 10000
        orderBy: [count_DESC]
      ) {
        count
        dimensions {
          clientRequestPath
          userAgent
          edgeResponseStatus
        }
      }

      tradSearch: httpRequestsAdaptiveGroups(
        filter: {
          datetime_geq: "<START_DATE>"
          datetime_leq: "<END_DATE>"
          requestSource: "eyeball"
          OR: [
            { userAgent_like: "%Googlebot%" }
            { userAgent_like: "%bingbot%" }
            { userAgent_like: "%DuckDuckBot%" }
            { userAgent_like: "%Applebot%" }
            { userAgent_like: "%YandexBot%" }
            { userAgent_like: "%Baiduspider%" }
          ]
        }
        limit: 10000
        orderBy: [count_DESC]
      ) {
        count
        dimensions {
          clientRequestPath
          userAgent
          edgeResponseStatus
        }
      }

    }
  }
}
```

---

## AI Referral Query (Paid Plans Only)

The `clientRefererHost` filter is only available on paid Cloudflare plans. Attempt this
query; if it fails with a permissions error, skip it and note in the report that AI
referral analysis requires a paid Cloudflare plan or referrer data from another source.

```graphql
{
  viewer {
    zones(filter: { zoneTag: "<ZONE_ID>" }) {
      aiReferrals: httpRequestsAdaptiveGroups(
        filter: {
          datetime_geq: "<START_DATE>"
          datetime_leq: "<END_DATE>"
          requestSource: "eyeball"
          OR: [
            { clientRefererHost: "chatgpt.com" }
            { clientRefererHost_like: "%.chatgpt.com%" }
            { clientRefererHost: "perplexity.ai" }
            { clientRefererHost_like: "%.perplexity.ai%" }
            { clientRefererHost: "claude.ai" }
            { clientRefererHost_like: "%.claude.ai%" }
            { clientRefererHost: "gemini.google.com" }
            { clientRefererHost: "meta.ai" }
            { clientRefererHost: "mistral.ai" }
            { clientRefererHost_like: "%copilot.microsoft.com%" }
          ]
        }
        limit: 10000
        orderBy: [count_DESC]
      ) {
        count
        dimensions {
          clientRequestPath
          clientRefererHost
        }
      }
    }
  }
}
```

---

## MCP Response Structure

When using the Cloudflare MCP `execute` tool, the GraphQL response data is at
`response.result.viewer.zones[0]`, NOT at `response.result.data.viewer.zones[0]`.
The MCP wraps the response differently than a raw API call. Each alias (e.g.,
`aiUserInitiated`, `aiSearch`) is a key on the zone object containing an array of
`{ count, dimensions: { clientRequestPath, userAgent, edgeResponseStatus } }` objects.

---

## Fallback: API Token

If the user cannot connect the Cloudflare MCP (e.g., using a platform that doesn't
support custom MCP servers), they can create an API token at:

> dash.cloudflare.com > My Profile > API Tokens > Create Token > Custom token

Required permission: `Zone > Analytics > Read` scoped to their zone.

Then use `curl` to POST the same GraphQL queries to
`https://api.cloudflare.com/client/v4/graphql` with the header
`Authorization: Bearer <TOKEN>`. Save the JSON response and upload it for analysis.
