# Listing Kit

Most directories, review sites, registries, and awesome lists ask for the same 20–25 facts with different length limits. Fill this kit in once before the first submission, then copy from it. It keeps facts consistent across listings (the same name, URL, pricing, and category everywhere), which helps both moderators and AI engines match the listings to one product.

The kit holds the facts and a base version of the copy at each length. Rule 3 still applies: before each tier, adapt the opening sentence and emphasis using `positioning-variations.md`. Keep the facts identical; vary the framing.

Save it as `listing-kit.json` (or `.md`) in the repo or a shared folder so later submissions, relaunches, and teammates use the same source.

---

## Gather Before Asking

Fill as much as you can from what already exists, then ask the user only for what's missing:

- `package.json`, `README.md`, and any plugin or registry manifests in the repo
- The homepage `<title>`, meta description, and Open Graph tags
- The pricing, privacy, terms, and contact pages
- Logo, favicon, and screenshot files in the repo's public or assets folder
- `.agents/product-marketing.md`, if it exists, for audience, competitors, and positioning

Flag anything that doesn't match across sources (two different taglines, an old price on the pricing page) and ask which is current before using it.

---

## Template

```json
{
  "product": {
    "name": "",
    "url": "https://",
    "pricing_url": "",
    "privacy_url": "",
    "terms_url": "",
    "contact_url": "",
    "listing_email": "",
    "launch_date": "",
    "company_name_public": "",
    "github_repo": ""
  },
  "copy": {
    "tagline_40": "",
    "tagline_60": "",
    "summary_100": "",
    "summary_160": "",
    "description_500": "",
    "description_150_words": "",
    "awesome_list_line": "- [Name](https://url) - Plain one-line description.",
    "key_features": [],
    "founder_story": ""
  },
  "taxonomy": {
    "primary_category": "",
    "secondary_categories": [],
    "tags": [],
    "alternatives_to": [],
    "audience": "",
    "platforms": []
  },
  "pricing": {
    "model": "free | freemium | free trial | paid | open source",
    "starting_price": "",
    "free_tier": "",
    "checked_on": ""
  },
  "assets": {
    "logo_svg": "",
    "logo_square_1024": "",
    "logo_square_512": "",
    "favicon": "",
    "og_image_1200x630": "",
    "screenshots_1920x1080": [],
    "screenshots_1280x800": [],
    "demo_video_url": ""
  },
  "agent": {
    "mcp_endpoint": "",
    "mcp_registry_name": "",
    "package": "",
    "install_command": "",
    "llms_txt": ""
  }
}
```

### Field notes

| Field | Limit | Notes |
|---|---|---|
| `tagline_40` | 40 chars | Launch sites and badge widgets. Say what it does, not a slogan. |
| `tagline_60` | 60 chars | Product Hunt-style taglines and title fields. Name the category so search intent matches. |
| `summary_100` | 100 chars | Short-description fields, and the Official MCP Registry `server.json` description (see `agent-registry-files.md` for its limit). |
| `summary_160` | 160 chars | Meta-description-length fields. Who it's for, what goes in, what comes out. |
| `description_500` | ~500 chars | Fields with a minimum or maximum near 500. Some forms reject text under their minimum, so check before pasting. |
| `description_150_words` | ~150 words | Long descriptions. Start from this and adapt per tier with `positioning-variations.md`. |
| `awesome_list_line` | One line | Match each list's format exactly. No hype words, no tracking parameters. |
| `alternatives_to` | 3–5 names | For AlternativeTo, SaaSHub, and "alternative" fields. Only products a buyer would really compare. |
| `listing_email` | — | A role address on the product domain (`hello@`, `press@`), not a personal inbox. See contact hygiene in the main skill. |
| `company_name_public` | — | The brand name, not a holding company or personal LLC, unless the directory requires the legal entity. |
| `pricing.checked_on` | — | Date the pricing was last confirmed. Recheck before a new batch. |

Count characters, not words, for the `_40`, `_60`, `_100`, and `_160` fields. Form limits are hard cutoffs, and a cut-off tagline looks careless on the live listing.

### Writing the copy

- Plain, factual sentences. Moderators and awesome-list maintainers reject copy that reads like an ad.
- Skip hype words ("revolutionary," "seamless," "game-changing," "unleash"), exclamation marks, and emoji.
- Name concrete inputs, outputs, integrations, and limits. "Turns Stripe exports into a monthly churn report" beats "powerful analytics."
- Keep claims you can back up. Don't put a user count, rating, or "#1" in a listing unless it's current and sourced.

### Asset sizes

Keep these exported and hosted at stable URLs before the first batch:

| Asset | Size | Used by |
|---|---|---|
| Square logo | 1024×1024 and 512×512 PNG, plus SVG | Most directories; some need a transparent background |
| Small icon | 48–64px PNG or WebP, plus favicon | Directory cards, registries |
| Social image | 1200×630 | Link previews, some launch sites |
| Screenshots | 1920×1080 and 1280×800 | Review sites, launch sites; some cap file size, so keep a compressed copy |
| Demo video | 60–90 seconds | Product Hunt, review sites |

---

## Submission Log

Keep one log for every attempt, including skips and rejections, and check it before starting each directory so nothing is submitted twice. The CSV in `submission-tracker-template.csv` works, or keep the same fields as JSON:

```json
{
  "directory": "AlternativeTo",
  "submit_url": "https://alternativeto.net/manage-item/",
  "tier": 2,
  "status": "submitted | live | rejected | skipped_paid_only | skipped_not_a_fit | needs_human",
  "listing_or_pr_url": "",
  "submitted_on": "2026-11-11",
  "link_check": "unqualified link observed | nofollow | sponsored | ugc | missing | unverified",
  "notes": ""
}
```

Use `needs_human` for anything the agent stopped on: a CAPTCHA, a login, a payment, a legal agreement, or an unclear category.

---

The single-kit approach and the agent submission rules in the main skill were prompted by [Ilias Ism's directory-submissions skill](https://github.com/Illyism/seo-skills); the content here is written independently.
