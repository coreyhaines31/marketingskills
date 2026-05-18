# Browserbase

Headless browser as a service. Spin up real Chromium browsers via API, drive them with Playwright/Puppeteer, get full session recordings. Useful when a target site requires JS rendering, user interaction, or session state that simple HTTP fetches can't handle.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | REST API for session management |
| MCP | ✓ | Official Browserbase MCP server (Stagehand) |
| CLI | - | None official |
| SDK | ✓ | Node, Python; drives Playwright/Puppeteer |

## Authentication

- **Type**: API Key
- **Header**: `x-bb-api-key: YOUR_API_KEY`
- **Get key**: https://www.browserbase.com/settings
- **Env vars**: `BROWSERBASE_API_KEY`, `BROWSERBASE_PROJECT_ID`
- **Base URL**: `https://api.browserbase.com`

## Core Operations

### Create a browser session

```bash
POST https://api.browserbase.com/v1/sessions
x-bb-api-key: YOUR_API_KEY

{
  "projectId": "YOUR_PROJECT_ID"
}
```

Returns a session ID and a WebSocket URL (`connectUrl`) you connect to with Playwright or Puppeteer.

### Connect with Playwright (Node)

```js
import { chromium } from 'playwright-core';
import { Browserbase } from '@browserbasehq/sdk';

const bb = new Browserbase({ apiKey: process.env.BROWSERBASE_API_KEY });
const session = await bb.sessions.create({ projectId: process.env.BROWSERBASE_PROJECT_ID });

const browser = await chromium.connectOverCDP(session.connectUrl);
const page = await browser.newPage();
await page.goto('https://joescoffeeshop.com');
const html = await page.content();
const title = await page.title();
await browser.close();
```

### List session recordings

```bash
GET https://api.browserbase.com/v1/sessions/{sessionId}/logs
```

Useful for debugging when a scrape doesn't return what you expected — session recordings show exactly what the browser saw.

### Stagehand (high-level AI-friendly wrapper)

Browserbase ships [Stagehand](https://github.com/browserbase/stagehand), a Playwright wrapper with `act()`, `extract()`, and `observe()` methods that take natural-language instructions instead of CSS selectors. Stagehand also publishes an MCP server.

```js
import { Stagehand } from '@browserbasehq/stagehand';

const stagehand = new Stagehand({ env: 'BROWSERBASE' });
await stagehand.init();
await stagehand.page.goto('https://joescoffeeshop.com');

const contact = await stagehand.page.extract({
  instruction: "Extract the business phone number, email, and street address",
  schema: { phone: 'string', email: 'string', address: 'string' }
});
```

## When to Use (over Firecrawl)

- **Site requires user interaction** (cookie consent, age gate, click-through before content loads)
- **Form submission** to access a quote/contact page
- **Session state matters** (logged-in tools, multi-step flows)
- **Complex JS rendering** that even Firecrawl's headless option struggles with
- **Want full session recordings** for audit/debugging
- **AI-driven scraping** via Stagehand's natural-language extraction

For simple "scrape a page as markdown," **Firecrawl is lower-overhead**. Use Browserbase when you actually need the browser-as-a-service model.

## When NOT to Use

Same hard rules as Firecrawl. Browserbase gives you a more powerful browser, which means the temptation to bypass anti-scraping defenses is higher. Don't:

- ✗ Bulk-scrape Google Maps / search results, LinkedIn, Yelp, or any platform whose ToS forbids it
- ✗ Bypass CAPTCHAs, login walls, or bot protections
- ✗ Auto-fill forms on platforms you don't have an account or legitimate access to

**Use Browserbase for**: individual public business sites the user has a URL for, where rendering or interaction is required.

## Pricing

- Free tier: limited monthly minutes
- Paid tiers scale by browser minutes + concurrency
- Confirm at https://www.browserbase.com/pricing

## Relevant Skills

- prospecting (programmatic site visits for prospect enrichment)
- competitor-profiling (when competitor sites need rendering or interaction)
- cro (page audits that need real browser state)
- analytics (testing tracking implementations end-to-end)
