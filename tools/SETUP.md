# Guided Marketing Tool Connections

Use this workflow when a user wants to connect marketing accounts to their local coding agent. It bridges the [tool registry](REGISTRY.md), provider integration guides, and [repository CLIs](clis/README.md). It is separate from the `onboarding` skill, which improves a product's customer activation.

## 1. Check the Environment Before Collecting Credentials

Confirm that the agent can run local commands and edit private files in the user's chosen workspace. In a chat-only environment, explain that limitation and offer these instructions for a local agent; do not ask the user to paste credentials into chat.

Confirm the checkout path, then run `node --version` and check that the selected CLI exists. The CLIs require Node 18+ and no dependency installation. The optional `--env-file` examples below require Node 20.6+; check `node --help` for support. On older Node versions, use the agent client's environment/secret configuration instead, or ask before installing a supported runtime. Do not silently change the user's runtime or system configuration.

## 2. Select Only the Needed Tools

Ask which tools the user wants to connect and which account/property and environment (sandbox or production) to use. Work on one chosen tool at a time. Do not create applications, request unrelated scopes, or configure all tools by default.

Keep each setup message to 3–5 lines: one action, why it is needed, the official link, and what nonsensitive confirmation to return. Wait for the user after app creation, permission approval, token generation, redirect setup, or account selection. Reuse completed steps and existing authorization. Never ask them to return a token, client secret, refresh token, or private key.

Example:

> We'll connect only GA4, using a read-only report first.
> Open your Google Analytics property and confirm the numeric property ID.
> Keep your access token in the local private file; don't paste it here.
> Tell me when it's saved and which property to read.

## 3. Store Selected Credentials Locally

Use the user's existing secret manager or environment setup when available. Otherwise, with their permission create `.env.marketing` in the chosen workspace. Do not overwrite an existing file. In a POSIX shell, this creates an empty owner-private file and fails if it already exists:

```bash
(umask 077; set -C; : > .env.marketing)
```

Build a template with only the chosen tool's variables from the table below. Use empty quoted values such as `GA4_ACCESS_TOKEN=""`; the user fills secrets in a local editor. Do not print the completed file or log values. The repository ignores `.env` and `.env.*`; in a different workspace verify or add that ignore rule **before** saving secrets. Check `git check-ignore .env.marketing` and `git ls-files --error-unmatch .env.marketing`: the file must be ignored and untracked. Gitignore does not untrack a previously committed file; if secrets were committed, stop and arrange removal and rotation with the user.

| Tool | Local variables | Boundary |
|------|-----------------|----------|
| Google Ads | `GOOGLE_ADS_TOKEN`, `GOOGLE_ADS_CUSTOMER_ID`; optional `GOOGLE_ADS_LOGIN_CUSTOMER_ID` | OAuth access token, target ID without hyphens; manager ID only when acting through a manager |
| Meta Ads | `META_ACCESS_TOKEN`; optional `META_AD_ACCOUNT_ID` | Account access and token permissions must match the intended read |
| LinkedIn Ads | `LINKEDIN_ACCESS_TOKEN` | Advertising API-approved app and member's ad-account access |
| GA4 | `GA4_ACCESS_TOKEN` | OAuth access token; numeric property ID is passed separately |
| Stripe | `STRIPE_API_KEY` for the HTTP example below | Restricted server-side key with permission to read customers; use a sandbox first |

Refresh tokens and app secrets belong in the user's secret manager for the selected OAuth flow. The repository CLIs consume access tokens and do not refresh them automatically. Do not put refresh tokens into an access-token variable. The `.env.marketing` file is data: use Node's environment loader or client configuration, not shell `source`/`eval`.

## 4. Complete the Selected Provider's Flow

### Google Ads

1. Select/create the intended Google Cloud project and enable Google Ads API. Apply for the appropriate API access level in Cloud Console; access now belongs to the project that owns OAuth credentials. Developer tokens were sunset September 9, 2026. Do not apply for one through the retired manager-account API Center. See the [current migration guide](https://developers.google.com/google-ads/api/docs/api-policy/developer-token).
2. Follow Google's [single-user OAuth flow](https://developers.google.com/google-ads/api/docs/oauth/single-user-authentication): consent screen, `https://www.googleapis.com/auth/adwords` scope, and Desktop App client for that flow. For a Web App, follow its documented redirect/authorization flow instead; registered redirect URIs must match. Keep client secrets and refresh tokens local.
3. Obtain an access token through that flow and save it as `GOOGLE_ADS_TOKEN`. Confirm the target customer and optional manager IDs. OAuth authorization does not replace project API access or account permissions.
4. Inspect the installed CLI's requirements. Older checkouts still require `GOOGLE_ADS_DEVELOPER_TOKEN`; new Cloud-project setups should update to a CLI that supports token-free project access. Do not invent a developer token to satisfy a local check. Existing legacy setups may still supply their token while updating.

### Meta Ads

1. Use an app associated with the intended business and user/account access. Follow [Marketing API authentication](https://developers.facebook.com/docs/marketing-api/get-started/authentication/). For a first reporting read, request the applicable `ads_read` permission rather than campaign-edit permissions by default.
2. Generate a user token through the documented flow. For longer use, follow the provider's token-extension flow (including Access Token Debugger's extension option when available), then inspect the resulting app, scopes, and expiration. Do not assume a fixed lifetime or indefinite validity.
3. Save the resulting token locally as `META_ACCESS_TOKEN`. A system-user token is an alternative for an authorized business setup; it still needs assigned account assets and permissions. Do not exchange or change credentials without existing authorization or user approval.

### LinkedIn Ads

1. Create or select the user's app and request the Advertising API product in its Products tab. Approval is an external gate; check the application's current status and pause this tool while pending. Continue other selected tools. Do not promise a 1–2 day turnaround or bypass approval. [Official application process](https://www.linkedin.com/help/linkedin/answer/a524477).
2. Follow the app's OAuth flow with its registered redirect URI and only the permissions needed for the intended operation (for account/reporting reads, consult `r_ads` and `r_ads_reporting`). Save the resulting access token as `LINKEDIN_ACCESS_TOKEN`.
3. Verify member access to the intended ad account and the app's [access tier](https://learn.microsoft.com/en-us/linkedin/marketing/integrations/marketing-tiers). Development calls can access production data; tier labels do not make arbitrary writes safe. Use a current versioned CLI/API as described in the [integration guide](integrations/linkedin-ads.md).

### GA4

1. Follow the [Analytics Data API quickstart](https://developers.google.com/analytics/devguides/reporting/data/v1/quickstart): enable the Data API and authorize a user or service account with property access. Use the `analytics.readonly` scope for reporting.
2. Obtain an OAuth access token through the chosen flow; save it as `GA4_ACCESS_TOKEN`. The repository CLI does not read a service-account JSON file or Application Default Credentials itself. Convert those credentials to an access token through the documented tooling, without displaying it in chat.
3. Select the numeric GA4 property ID, not a `G-...` measurement ID. Measurement Protocol secrets are for event writes and are not needed for this reporting check.

### Stripe

1. Select the intended account and a sandbox for initial setup. In the Dashboard, create a restricted key with only the customer-read permission needed below. A publishable `pk_...` key cannot read account data; a webhook signing secret is not an API key. See [Stripe's key guide](https://docs.stripe.com/keys).
2. Save the restricted key locally as `STRIPE_API_KEY`. This repository has no `tools/clis/stripe.js`; use the provider's CLI/MCP or the read-only HTTP check below. Configure only the selected connection.

## 5. Test a Small Read and Inspect the Response

Run from the repository root after the user authorizes the selected account read. These Node `--env-file` examples require Node 20.6+. With client-managed environment variables, omit `--env-file=.env.marketing`. Substitute the confirmed GA4 property ID.

```bash
node --env-file=.env.marketing tools/clis/google-ads.js account info
node --env-file=.env.marketing tools/clis/meta-ads.js accounts list
node --env-file=.env.marketing tools/clis/linkedin-ads.js accounts list
node --env-file=.env.marketing tools/clis/ga4.js reports run --property 123456789 --metrics activeUsers --start-date yesterday --end-date yesterday
```

Run only the chosen line. These checks read data; no campaign mutation, conversion creation, Measurement Protocol event, or payment is needed. Where supported, preview the selected request with `--dry-run` first. A preview proves local request shape, not connectivity or provider acceptance.

For Stripe with Node 20.6+, read at most one customer and print a count rather than customer details:

```bash
node --env-file=.env.marketing -e '
(async () => {
  if (!process.env.STRIPE_API_KEY) throw new Error("STRIPE_API_KEY required");
  const response = await fetch("https://api.stripe.com/v1/customers?limit=1", {
    headers: {Authorization: `Bearer ${process.env.STRIPE_API_KEY}`}
  });
  const data = await response.json();
  if (!response.ok || !Array.isArray(data.data)) throw new Error(`Stripe read failed (HTTP ${response.status})`);
  console.log(JSON.stringify({connected: true, returned: data.data.length}));
})().catch(error => { console.error(error.message); process.exitCode = 1; });
'
```

Check both process status **and** provider response. Some older CLIs can exit zero with an error payload. Record account/property, environment, operation, and outcome without secrets or customer data. Empty results can be a valid connection; they do not prove a broken account or permission to write.

| Failure | Next step |
|---------|-----------|
| Missing local variable | Verify variable names and how the client loads the private file; never print values |
| Expired/invalid token | Check expiry and the authorized refresh/login flow locally; do not repeatedly retry |
| Permission or project-access rejection | Check scopes, app approval, project access level, and account membership |
| Wrong account/property | Confirm the nonsensitive ID and sandbox/production context with the user |
| Rate limit or outage | Honor provider guidance; record blocked/pending rather than calling the connection ready |
| CLI route/version mismatch | Update or repair the checkout; do not request wider permissions to mask a client defect |

## 6. Finish with First Value

Report each selected tool as connected, waiting for user, waiting for provider approval, or failed with a specific next step. A completed setup for one tool does not imply the others are ready.

Offer a small read-only result: account inventory for Ads, yesterday's active users for GA4, or an authorized sandbox billing check for Stripe. Reuse permission already granted for that result; otherwise ask before accessing another account or a broader dataset. Route a full audit to the appropriate marketing skill. Campaign edits, sends, payments, and budget changes remain separate actions requiring the user's authorization.
