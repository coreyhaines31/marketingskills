# From Shipped Code to Marketing

Most product updates never get marketed because nobody translates them. The engineers wrote the PR description for each other, and by the time marketing hears about it, the moment has passed. An agent with access to the repo can close that gap every week: read what shipped, decide what's worth telling, and draft it in customer language.

## Inputs

For the chosen window (usually the last week, or since the last release tag):
- **Merged PRs** with titles, descriptions, and linked issues. These explain *why* better than commits do.
- **Commit log** for anything merged without a PR: `git log --since="1 week ago" --no-merges --pretty=format:"%h %s (%an, %ar)"`
- **Changed files**, read wherever a title doesn't make the user-facing effect clear.
- **Release notes or tags**, if the team already writes them.
- **Feature flags**: what's actually live for customers versus merged behind a flag.

Only market what customers can use today. Anything behind a flag, in internal beta, or not yet deployed waits.

## Translate before you write

Engineering changes are described by what changed in the code. Customers care about what changed for them. For each change, write one line: **"You can now ___"** or **"___ no longer ___."** If you can't fill that in, the change is invisible to customers. Refactors, dependency bumps, CI, and test changes go in no marketing output at all.

Then group the visible changes with the tiers in the Ongoing Launch Strategy section of `SKILL.md`:

| Tier | Typical changes | Output |
|------|-----------------|--------|
| **Major** | New capability, new plan, big workflow change | Changelog + blog post + email + social + in-app |
| **Medium** | New integration, notable UX improvement, performance gain customers can feel | Changelog + targeted email or in-app + one social post |
| **Minor** | Fixes, polish, small additions | Changelog only, batched |

Several medium changes that share a theme ("five improvements to reporting") can be bundled into one major-tier story.

## Ground every claim in the change

- State what the change does, not what it might do for someone. "Exports now include custom fields," not "unlock deeper insights."
- Use numbers only if they come from the change itself (a benchmark in the PR, a measured speedup). Never invent customer results, adoption, or impact.
- If a PR says the change is partial ("phase 1," "first step toward"), the announcement says so too.
- Credit the user who asked for it, where the team does that and the user agreed.

## Watch for marketing that just became wrong

Every shipped change can also make an existing claim false: a new limit, a renamed plan, a removed integration, a price change. Check the site, docs, comparison pages, and ads for statements the change contradicts. On a schedule, this is the claim-drift loop in `marketing-loops`.

New capabilities also open new search demand. A new integration can deserve its own page ("[Product] + [Tool] integration"), and a new feature can answer queries or comparisons the product couldn't win before. Add those to the content backlog (see `content-strategy` and `competitors`).

## Weekly digest format

```markdown
## Shipped: [date range]

### For customers
- **[Major]** [You can now ...] (PR #123)
- **[Medium]** [You can now ...] (PR #130)
- **[Minor]** [Fixed ...] (PR #131, #134)

### Changelog entry
## [version or date]
### Added
- [Customer-facing description]
### Changed
- [...]
### Fixed
- [...]

### Drafts
- Blog post: [working title], [angle], [who it's for]
- Email: [subject line options] → [segment]
- Social: [one post per major or medium change, built on its single most useful detail]
- In-app: [message + where it appears]

### Pages to update
- [Page]: [statement that's now wrong or incomplete]

### New content opportunities
- [Query or comparison the change makes winnable]
```

Use Keep a Changelog headings (Added, Changed, Deprecated, Removed, Fixed, Security) so the changelog stays scannable over time.

## Writing the drafts

- **Changelog:** one line per change, written for a customer and in past or present tense. Link docs for anything non-obvious.
- **Blog post (major only):** the problem the customer had, what changed, how to use it (with screenshots), and who it's for. The `copywriting` skill covers structure; its AI-tell rules apply.
- **Email:** lead with the change for that segment; one call to action that takes them to the feature. See `emails`.
- **Social:** one concrete detail per post, with a screenshot or 10-second clip of the feature doing it. See `social`.

Drafts are staged for a human to review and send. Nothing in this workflow publishes on its own.
