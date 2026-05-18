# GitHub

GitHub REST API for prospecting use cases: listing users who star, fork, or watch a repo as a high-quality developer-intent signal.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | Public REST API, well-documented |
| MCP | - | Several community MCP servers exist; not bundled here |
| CLI | ✓ | [github-prospects.js](../clis/github-prospects.js) — stargazers, forks, watchers, user, rate-limit |
| SDK | ✓ | Official Octokit (JS, Python, Ruby, .NET, Go) |

## Authentication

- **Type**: Personal Access Token (PAT) or Fine-Grained PAT
- **Header**: `Authorization: Bearer {token}`
- **Get token**: https://github.com/settings/tokens
- **Scopes for prospecting**:
  - Public data (stargazers, forks, public profiles): **no scope required** with a token, or unauthenticated
  - Public repo metadata: `public_repo` scope
- **Env var**: `GITHUB_TOKEN`

### Rate limits

| Auth | Limit | When you hit it |
|------|-------|-----------------|
| Unauthenticated | 60 req/hr | Fine for one-off small lookups |
| Authenticated PAT | 5,000 req/hr | Sufficient for a 10K-star repo pull in one hour |
| GitHub App | 5,000–15,000 req/hr | For high-volume use |

A 1,000-star repo with full enrichment (1 list call + 1 profile call per user) = ~1,011 requests. Always set a token.

## Common Agent Operations

### List stargazers (users who starred a repo)

```bash
GET https://api.github.com/repos/{owner}/{repo}/stargazers?per_page=100&page=1

Accept: application/vnd.github+json
X-GitHub-Api-Version: 2022-11-28
Authorization: Bearer {token}
```

Pagination via `Link` header (`rel="next"`, `rel="last"`). Default 30 per page, max 100.

Returns array of user objects with `login`, `id`, `html_url`, `type` (User or Organization). Full profile fields (email, company, blog, bio, location) require a follow-up call per user.

### List forks (gives fork owner profiles)

```bash
GET https://api.github.com/repos/{owner}/{repo}/forks?per_page=100&page=1
```

Each fork object includes the `owner` (the user/org that forked). Forks are a stronger signal than stars — they imply intent to modify, not just bookmark.

### List watchers (subscribers)

```bash
GET https://api.github.com/repos/{owner}/{repo}/subscribers?per_page=100&page=1
```

GitHub's "watch" → API's "subscribers". Smaller pool than stargazers but signals deeper engagement.

### Get user profile (enrichment)

```bash
GET https://api.github.com/users/{username}
```

Returns: `name`, `company`, `blog`, `email` (if public), `bio`, `twitter_username`, `location`, `public_repos`, `followers`, `created_at`, `hireable`.

**Key fields for prospecting**:
- `email`: only ~5–20% of users publish this. Always nullable.
- `company`: many users include `@org` syntax — strip the `@` for plain company name.
- `blog`: often a personal website where contact info is published.
- `twitter_username` / `bio`: useful for cross-channel research.

### Check rate limit

```bash
GET https://api.github.com/rate_limit
```

## Prospecting Workflows

### Workflow 1 — Stargazers of a competitor or adjacent tool

```bash
# 100 stargazers, enrich each one, only keep those with email or company set
node tools/clis/github-prospects.js stargazers vercel/next.js \
  --limit 100 --enrich --format csv > nextjs-stars.csv
```

Filter the CSV in your spreadsheet by `company` set OR `email` set OR `blog` set. Hand off to Apollo/Clay/Hunter to enrich the rest with email-by-name+company.

### Workflow 2 — Forks of your own repo (warm intent)

People who fork your repo have already shown direct interest. High-conversion outreach prospects.

```bash
node tools/clis/github-prospects.js forks yourorg/yourrepo \
  --enrich --with-email --format csv > my-fork-prospects.csv
```

### Workflow 3 — Watchers of a category-defining repo

Watchers are smaller in number but higher in intent — they're tracking changes, not just bookmarking.

```bash
node tools/clis/github-prospects.js watchers tldraw/tldraw \
  --enrich --with-company --format csv > tldraw-watchers.csv
```

## CLI Reference

```bash
# Stargazers
node tools/clis/github-prospects.js stargazers <owner/repo> \
  [--limit N] [--enrich] [--with-email] [--with-company] \
  [--with-blog] [--type User|Organization] [--format csv|json]

# Forks
node tools/clis/github-prospects.js forks <owner/repo> [...same flags]

# Watchers (subscribers in API terms)
node tools/clis/github-prospects.js watchers <owner/repo> [...same flags]

# Single user lookup
node tools/clis/github-prospects.js user <username>

# Check rate limit
node tools/clis/github-prospects.js rate-limit
```

**Flags**:
- `--limit N`: cap total results pulled from the list endpoint
- `--target N`: when filtering with `--with-*`, stop enriching as soon as N users match (saves quota on restrictive filters)
- `--enrich`: fetch full profile per user (1 extra request each)
- `--with-email` / `--with-company` / `--with-blog`: filter to users with these fields set (implies `--enrich`)
- `--type User|Organization`: filter by account type
- `--format csv`: output prospecting-ready CSV; default is JSON
- `--dry-run`: preview the request without sending

## When to Use

- **SaaS prospecting** (primary use case): stargazers of a competitor, complement, or category-defining repo as in-market developer signal
- **Open-source product marketing**: see who's forking or watching your own repo for warm outreach
- **Developer-tool ICP discovery**: stargazers of `next.js`, `prisma`, `tailwindcss`, etc., signal a Next.js / Prisma / Tailwind developer
- **Trigger event monitoring**: a recent fork of a competitor's repo often signals dissatisfaction or active evaluation

## When NOT to Use

- **Email is your only signal you need** — GitHub yields email for only ~5–20% of users. Pair with Apollo, Clay, or Hunter for enrichment from name + company.
- **Hyper-broad lists** — a repo with 100K+ stars is mostly noise. Smaller, more specific repos (5K–25K stars) give higher-signal lists.
- **You don't have a way to handle high-volume LinkedIn lookup downstream** — most enrichment from GitHub username goes through LinkedIn Sales Nav manually.

## Compliance Notes

- **GitHub data is public** — no ToS issue with reading the API. The ToS prohibits abusive scraping (bypassing rate limits, mass account creation), not legitimate API usage.
- **Personal emails published on GitHub** — users opt in to publishing their email. Treat as business contact when paired with company/blog signals; respect GDPR/CAN-SPAM for the downstream send.
- **Source URL lineage** — for every prospect added from GitHub, capture `html_url` (their profile URL) and the source repo. Required for GDPR DSAR defense.
- **Cool-down between large pulls** — even at 5,000 req/hr, don't burst-fingerprint. Pagination is naturally paced; respect `X-RateLimit-Remaining` headers.

## Pairing with Other Tools

Typical GitHub prospecting pipeline:

1. Pull stargazers/forkers via this CLI
2. Filter to users with company set (or other signal)
3. **Enrich missing emails** via Apollo / Clay / Hunter (lookup by name + company domain)
4. **Validate emails** via Truelist before adding to outreach list
5. **Hand off** to cold-email skill for outreach

See `skills/prospecting/references/saas-prospecting.md` and `data-sources.md` for the full prospecting framework.

## Relevant Skills

- prospecting (primary use case)
- cold-email (downstream outreach)
- competitor-profiling (deeper account-level research on individual stargazers worth pursuing)
