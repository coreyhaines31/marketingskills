# Partner Program & Tools Registry — Rules & Boundaries

The single source of truth for how tools and partners work in this repository. If anything elsewhere is ambiguous, this document governs.

- **Public pitch & pricing:** [marketing-skills.com/sponsorship](https://marketing-skills.com/sponsorship)
- **Content rules for mentioning any tool:** [CONTRIBUTING.md → Mentioning Tools](../CONTRIBUTING.md#mentioning-tools-the-integrity-rubric)
- **The tool index itself:** [REGISTRY.md](REGISTRY.md)
- **The legal terms:** the Partner Agreement, provided to each partner (accepted at checkout)

## The one principle

**Sponsorship funds the work, never the recommendations.** Money buys a *disclosed presence*, never a bias. Every rule below follows from this. The library is free and MIT-licensed; sponsors and partners fund maintenance and new skills so the core stays free, open, and editorially independent — whoever is paying.

## Three kinds of tool entries

Every tool in [REGISTRY.md](REGISTRY.md) is exactly one of these:

| Kind | What it is | Who | Marker | Disclosure | Placement |
|---|---|---|---|---|---|
| **Tool integration** | A neutral integration guide for a real marketing tool with a programmatic surface | Anyone (incl. non-partners) can contribute one via PR | none | none required | Listed in the Tool Index / By Category |
| **◆ Verified Partner** | A tool whose maker funds the library (Skill or Category Partner) | Vetted, application-only, paid | ◆ | Disclosure header in its integration guide + ◆ in the registry + entry in `partners.json` | Verified Partners section + README + site + launch announcement |
| **House tool** | A tool built by the maintainer (e.g. Truelist) | The repo author | (noted) | **Stricter** than a partner — its guide states the repo author owns the tool | Held as a category House Tool; that slot is not for sale |

A partner integration is the *same* neutral integration guide as any other tool, plus disclosure and placement. It is not a different kind of content — it earns no softer editorial treatment.

## What sponsorship buys — and never buys

**Buys:**
- A dedicated, disclosed integration guide for the tool (◆).
- Featured placement — logo, link, blurb — on the README and the site.
- A launch announcement (tweet + LinkedIn + Swipe Files newsletter mention).
- For Category Partners: a category *slot* exclusivity + an "Official [Category] Partner" title/badge.

**Never buys:**
- A recommendation. No skill is edited to prefer a partner.
- Bias in any existing skill. Skills recommend the right tool for the job, partner or not.
- Exclusivity over what agents recommend. Category exclusivity is a *sponsorship-slot* exclusivity, never a recommendation exclusivity — a skill may still name a competitor when it's the right answer.
- Removal or demotion of any other tool. Partner entries are additive.
- A claim of "best in category." The badge means "paid, disclosed, vetted for fit."

## Tiers (summary)

Full pricing and perks live on the [sponsorship page](https://marketing-skills.com/sponsorship). In brief:

| Tier | Price | Billing | Gets |
|---|---|---|---|
| Supporter | $1–199/mo | GitHub Sponsors | README + site listing |
| Sponsor | $200/mo | GitHub Sponsors | Featured logo + link + blurb on README and site |
| **Skill Partner** | $500/mo | Stripe · 6-mo min | A disclosed ◆ integration + launch announcement + everything in Sponsor. **Non-exclusive.** |
| **Category Partner** | $1,500/mo | Stripe · 6-mo min | Category-slot exclusivity + official-partner title/badge + top category placement + quarterly Swipe Files feature + YouTube description slot + dual launch. Everything in Skill Partner. |

Partner tiers are **application-only** (vetted, then paid) and carry a **6-month minimum**. Annual prepay = two months free.

## Disclosure travels with the file

Disclosure is on the artifact, not just the site — skills and guides get forked and re-indexed across the ecosystem, so the disclosure must survive that.

A Verified Partner integration guide opens with this header:

```markdown
> **◆ Verified Partner integration.** [Tool] sponsors Marketing Skills. This integration
> is disclosed and vetted for fit; it does **not** change what any skill recommends. It's
> listed alongside the neutral options for the same job — use it when it's the right fit,
> not because it's a partner. See [Verified Partners](../REGISTRY.md#verified-partners).
```

Plus a ◆ marker in [REGISTRY.md](REGISTRY.md) and an entry in [`../partners.json`](../partners.json). A **House tool** additionally states in its guide that the repo author owns the tool.

## Editorial control & the integrity rubric

- **The maintainer holds final editorial control** and may edit or cut anything for neutrality and accuracy, at any time.
- **Any content that names a tool — partner or not — must pass the [integrity rubric](../CONTRIBUTING.md#mentioning-tools-the-integrity-rubric):** options not one answer, at the point of relevance, no forced endorsement, facts over framing, disclosed, and the *swap test* (swap the tool for a competitor and it should still read fair).
- **Partner integrations surface only at the point of relevance** — when a user is implementing or working with that tool. They never hijack generic queries and never insert themselves into a skill's recommendation as the answer.

## Category exclusivity (precise definition)

- **Skill Partner is non-exclusive.** Competitors may hold Skill Partner placements in the same category.
- **Category Partner buys a slot, not the answer.** No competing tool receives a Verified Partner integration or partner slot in that category while the agreement is active. It does **not** mean core skills only recommend that partner, and it does not restrict what any skill says. Categories are defined in writing in the agreement; a multi-category tool claims one category.
- **House-tool categories are not for sale** (e.g. email verification is held by Truelist).

## The partner lifecycle

1. **Apply** — application via the sponsorship page (vetted for fit).
2. **Agreement** — the Partner Agreement (6-month minimum), accepted at checkout.
3. **Pay** — Stripe; acceptance (version + timestamp) recorded with the subscription. Nothing publishes until the first payment clears.
4. **Onboard** — the partner submits logo, blurb, docs, and setup specifics via the onboarding form.
5. **Author** — the integration guide is drafted collaboratively; **the maintainer holds the pen** and final editorial control.
6. **Publish** — add the partner to [`../partners.json`](../partners.json), run [`../scripts/sync-partners.mjs`](../scripts/sync-partners.mjs) to regenerate the README + registry blocks, commit. The site reads `partners.json` directly.
7. **Renewal / lapse** — renewal is an explicit conversation, never an automatic charge. On lapse there's a **30-day notice period** where the integration is flagged as unmaintained before removal — installs are never silently broken. Deactivate with `"active": false` (keeps history, removes it from every surface).

## `tools/integrations/` spec (any tool, partner or not)

**What qualifies:** a real marketing tool with a programmatic surface an agent can use — an API, MCP server, and/or CLI. Neutral integrations are welcome from anyone via PR.

**Format** (match the existing guides, e.g. [`integrations/resend.md`](integrations/resend.md)):
- `# Tool Name` + a one-line description
- `## Capabilities` table — API / MCP / CLI / SDK availability with notes
- `## Authentication` — auth type; secrets go in env vars / a secret manager, never in the repo
- Setup + common operations (with real command/code examples)
- Links to official docs

**CLIs** (`../clis/*.js`) are zero-dependency Node 18+ scripts: show usage with no args, support `--dry-run`, and never require credentials just to print help. See [AGENTS.md](../CLAUDE.md) build/verify rules.

**A partner integration** is all of the above **plus** the disclosure header, the ◆ marker, and the `partners.json` entry.

## Single source of truth

The partner data lives once in [`../partners.json`](../partners.json). `sync-partners.mjs` generates the README Partners section and the Verified Partners table from it; the site fetches the same file. Edit one place, run the script, commit — every surface updates together. Run `node scripts/sync-partners.mjs --check` to verify nothing has drifted.
