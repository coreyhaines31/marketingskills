# deed.page

Static hosting that an agent can publish to with one HTTP request: send an HTML file or a folder, get back an HTTPS URL. No account or signup step.

- **Disclosure**: this guide was contributed by the deed.page team (Avatar 8 LLC). It is not a Verified Partner listing.
- **Docs**: [deed.page/docs](https://deed.page/docs) · agent-readable reference at [deed.page/llms.txt](https://deed.page/llms.txt)
- **Agent skill (MIT)**: [github.com/f-o-x11/deed-page-skill](https://github.com/f-o-x11/deed-page-skill)

## When to Use

Use when a skill has produced a static page that a person outside the agent session needs to open, and nobody has set up a hosting account for it yet. Examples from this repo:

- The creative review page from the ad-creative skill (`review.html` plus `images/`), shared with a client or teammate for sign-off
- A one-page draft from the lead-magnets or free-tools skills that a stakeholder wants to click through before it goes onto the real site
- A temporary event or webinar page while the main site is still being changed

Other options for the same job:

- **Send the file**: zip the folder and attach it. No hosting, no public URL, and the reviewer has to open it locally.
- **Vercel, Netlify, Cloudflare Pages, GitHub Pages**: better when the page belongs to a real project with a repo, previews per branch, custom domains, and a team account already exists. Each needs an account and a CLI login or repo connection first.
- **The site's own CMS** (Webflow, WordPress, Ploy and others in the registry): the right place for anything that ships to production on the brand's domain.

deed.page fits the gap between those: a review or draft link right now, from a headless agent, with no credentials to configure. It is not a CMS, has no forms backend, and does not run server code.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | REST: `PUT`/`POST /v1/sites` with raw HTML, a `.tar.gz`, or multipart files |
| MCP | ✓ | Remote Streamable HTTP server at `https://deed.page/mcp` (`publish_site`, `update_site`, `delete_site`, `list_sites`, `site_analytics`, and others) |
| CLI | - | No dedicated CLI; `curl` is enough |
| SDK | - | Use any HTTP client |

## Authentication

- **First publish**: no key. The response includes a `token` (shown once). Store it in a secret manager or a private file such as `~/.config/deed-page/token` (mode 600); never commit it, print it in logs, or put it in a page.
- **Every later request**: `Authorization: Bearer $DEEDPAGE_TOKEN`. The token owns the slugs it created; it is needed to update or delete them.
- Optional recovery email can be attached later; without one, a lost token cannot be recovered.

## Common Operations

### Publish a single page

```bash
curl -T review.html "https://deed.page/v1/sites?slug=acme-q4-review-7k2p" \
  -H "X-Client: my-agent"
```

The response is JSON with `url` (for example `https://acme-q4-review-7k2p.deed.page/`), `version`, and, on the first publish, `token`. A raw HTML body is stored as `index.html`. Slugs are lowercase letters, digits, and hyphens; add a random suffix so the URL is not guessable from the client name alone.

### Publish a folder (HTML plus relative images)

```bash
tar -C outputs/2026-10-27 -czf /tmp/review.tar.gz .
curl -T /tmp/review.tar.gz "https://deed.page/v1/sites?slug=acme-q4-review-7k2p" \
  -H "X-Client: my-agent" \
  -H "Authorization: Bearer $DEEDPAGE_TOKEN"
```

Pack from inside the folder (`-C … .`) so `index.html` (or `review.html`) sits at the site root and relative image paths keep working. Publishing again to the same slug with the same token replaces the content and creates a new version.

### Set an expiry for review links

```bash
curl -T /tmp/review.tar.gz "https://deed.page/v1/sites?slug=acme-q4-review-7k2p" \
  -H "X-Client: my-agent" \
  -H "X-Ttl: 1209600" \
  -H "Authorization: Bearer $DEEDPAGE_TOKEN"
```

`X-Ttl` is in seconds (here 14 days). Without it the site stays up until deleted.

### Delete

```bash
curl -X DELETE "https://deed.page/v1/sites/acme-q4-review-7k2p" \
  -H "Authorization: Bearer $DEEDPAGE_TOKEN"
```

The URL returns 404 afterwards.

### MCP setup (Claude Code)

```bash
claude mcp add --transport http deed-page https://deed.page/mcp
```

List the tools and read their schemas before calling them. Publishing creates a public URL, so confirm with the user before publishing anything that contains unreleased campaign details.

## Tradeoffs

- **Public by default.** Anyone with the URL can open the page. Password protection exists only on paid plans; on the free plan, do not publish material that must stay private (unannounced pricing, client data, embargoed launches).
- **Free plan limits**: 25 sites, 25 MB per site, 4 MB per single request (larger folders use a manifest upload), and a small "Published with deed.page" link on each page. Paid plans start at $3/month and remove the link. Current numbers: [deed.page/pricing](https://deed.page/pricing).
- **Static only.** HTML, CSS, JavaScript, images, and PDFs. Forms need a third-party endpoint; tracking scripts work like on any static host.
- **Custom domains** are supported through the API, but for a page that should live on the brand's domain long term, the site's own CMS or host is usually the better home.

## Links

- Docs: [deed.page/docs](https://deed.page/docs)
- Agent reference: [deed.page/llms.txt](https://deed.page/llms.txt)
- Pricing: [deed.page/pricing](https://deed.page/pricing)
- Agent skill: [github.com/f-o-x11/deed-page-skill](https://github.com/f-o-x11/deed-page-skill)
