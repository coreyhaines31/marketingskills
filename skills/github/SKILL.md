---
name: github
description: When the user wants to navigate, search, review code, manage pull requests or issues, or perform any actions on GitHub's web interface. Also use when the user mentions "GitHub," "pull request," "PR review," "code search," "GitHub issues," "branch," "fork," "commit," "repository navigation," or "merge." Use this whenever someone needs help working within the GitHub web UI.
---

# GitHub Navigation Skill

## Overview

This skill enables navigation of GitHub's web interface for searching, reviewing code, and managing pull requests and issues.

## Critical Rules

1. **Two Different Search Systems**: GitHub has completely different syntax for code search vs issues/PR search. Code search supports `AND`, `OR`, `NOT`, and regex. Issues/PR search has different operators — mixing them will fail.

2. **Repository Names Must Be Complete**: In code search, `repo:owner/name` requires the FULL repository name. Partial names don't work. Multiple repos need `OR`: `repo:facebook/react OR repo:vuejs/vue`

3. **Branch vs Commit Editing**: You can only edit files when viewing a BRANCH, not a commit. If you see a disabled pencil icon, look for "Edit on default branch" in the dropdown next to it, or navigate to the branch first.

4. **Date Format**: Always use ISO 8601 (YYYY-MM-DD) for date filters: `created:>2024-09-01`

5. **Use @me for Current User**: When searching, use `author:@me`, `assignee:@me`, `review-requested:@me` instead of trying to figure out username.

6. **Batch Review Comments**: Use "Start a review" to collect multiple comments, then submit all at once. Don't use "Add single comment" for each line — creates notification spam.

7. **New AND/OR Support**: Issues/PR search gained `AND`/`OR`/parentheses support in Oct 2024, but may not be available in all GitHub instances yet. If it doesn't work, fall back to simpler syntax.

8. **Cannot Approve Own PRs**: You cannot approve your own pull requests. Don't try.

## UI Navigation

**Search Bar:**

- Top of screen, different behavior for code vs issues/PRs
- Press `s` or `/` to focus search bar from anywhere
- Use `?` to see all keyboard shortcuts

**Branch Dropdown:**

- In file tree (left sidebar) and file editor
- Click to see recent branches
- Type to search/filter branches
- Click "View all branches" for full list with tabs (Your branches, Active, Stale, All)
- "View on default branch" button appears when not on default branch

**File Tree (Left Sidebar):**

- New primary navigation method
- Click folders to expand/collapse
- Click files to view
- Shows current branch at top

**Key Navigation:**

- File finder: Press `t` key anywhere
- Command palette: `Ctrl+K` (Windows/Linux) or `Cmd+K` (Mac)
- Go to Code: `g` then `c`
- Go to Issues: `g` then `i`
- Go to Pull requests: `g` then `p`

**Pull Request Review:**

- Click `+` next to line numbers for inline comments
- Click-drag line numbers for multi-line comments
- "Review changes" button (top right) to submit review
- Choose: Comment / Approve / Request changes
- Mark files as viewed (checkbox in Files changed tab)
- Resolve conversations after addressing

**Review Navigation in Files Changed:**

- `]` — Next file
- `[` — Previous file
- Checkbox to mark file as viewed

**Common URL Patterns:**

```
Repository: github.com/owner/repo
PR: github.com/owner/repo/pull/123
Issue: github.com/owner/repo/issues/456
File: github.com/owner/repo/blob/branch/path/file.ext
```

**Key Search Queries:**

```
Find your review requests: is:open is:pr review-requested:@me
Find your open PRs: is:open is:pr author:@me
Find assigned issues: is:open is:issue assignee:@me
```

**Review Types:**

- **Comment**: Feedback without approval/blocking
- **Approve**: Approve for merge
- **Request changes**: Blocks merge (if branch protection enabled)

**Issue/PR Labels:**

- Multiple labels AND: `label:bug label:urgent`
- Multiple labels OR: `label:"bug","feature"` (comma-separated)
- Exclude: `-label:wontfix`

## Efficiency Tips

**Search Strategy:**

- Start broad with type filter: `is:issue` or `is:pr`
- Add status early: `is:open`
- Use `@me` shortcuts: `review-requested:@me`, `author:@me`
- For code search, specify repo first: `repo:owner/name` then add filters
- Remember: Code search needs FULL repo names, no partial matching

**Keyboard-First Navigation:**

- Learn the `g + [letter]` shortcuts for tabs
- Use `t` for file finder instead of clicking through file tree
- `Ctrl+K` (Windows/Linux) or `Cmd+K` (Mac) command palette is fastest for most actions
- `?` shows full shortcut list when stuck

**Review Efficiency:**

- Batch comments with "Start a review" instead of commenting one by one
- Use suggestion blocks (` ```suggestion`) so authors can apply with one click
- Mark files as viewed to track progress through large PRs
- Navigate files with `]` and `[` keys, not mouse clicks

**Common Patterns:**

- Editing on commit? Look for "Edit on default branch" in pencil dropdown
- Can't find branch? Click "View all branches" for full searchable list
- Too many search results? Add more specific filters one at a time
- Force-pushed to PR? Re-request reviews as they may have been dismissed
