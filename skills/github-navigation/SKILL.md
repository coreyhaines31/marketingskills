---
name: github-navigation
description: When the user wants to navigate GitHub's web interface, search for code or issues, review pull requests, manage branches, edit files, or perform any GitHub repository tasks. Use when the user mentions "GitHub," "pull request," "PR," "repository," "branch," "code search," "issues," "commit," "fork," "merge," or any GitHub-specific actions. Also use when helping with code review workflows, PR approvals, or issue management.
---

# GitHub Navigation

You are an expert at navigating GitHub's web interface efficiently. Your goal is to help users search, review, and manage code repositories using the right tools and shortcuts.

## Critical Rules

1. **Two Different Search Systems**: GitHub has completely different syntax for code search vs issues/PR search. Code search supports `AND`, `OR`, `NOT`, and regex. Issues/PR search has different operators — mixing them will fail.

2. **Repository Names Must Be Complete**: In code search, `repo:owner/name` requires the FULL repository name. Partial names don't work. Multiple repos need `OR`: `repo:facebook/react OR repo:vuejs/vue`

3. **Branch vs Commit Editing**: You can only edit files when viewing a BRANCH, not a commit. If you see a disabled pencil icon, look for "Edit on default branch" in the dropdown next to it, or navigate to the branch first.

4. **Date Format**: Always use ISO 8601 (YYYY-MM-DD) for date filters: `created:>2024-09-01`

5. **Use @me for Current User**: When searching, use `author:@me`, `assignee:@me`, `review-requested:@me` instead of trying to figure out username.

6. **Batch Review Comments**: Use "Start a review" to collect multiple comments, then submit all at once. Don't use "Add single comment" for each line — creates notification spam.

7. **Cannot Approve Own PRs**: You cannot approve your own pull requests.

## UI Navigation

**Search Bar:**
- Top of screen, different behavior for code vs issues/PRs
- Press `s` or `/` to focus search bar from anywhere
- Use `?` to see all keyboard shortcuts

**Branch Dropdown:**
- In file tree (left sidebar) and file editor
- Click to see recent branches; type to search/filter
- "View on default branch" button appears when not on default branch

**Key Keyboard Shortcuts:**
- File finder: `t`
- Command palette: `Cmd+K` (Mac) / `Ctrl+K` (Windows/Linux)
- Go to Code: `g` then `c`
- Go to Issues: `g` then `i`
- Go to Pull requests: `g` then `p`
- Show all shortcuts: `?`

## Search Queries

**Issues and PRs:**
```
Find your review requests:  is:open is:pr review-requested:@me
Find your open PRs:         is:open is:pr author:@me
Find assigned issues:       is:open is:issue assignee:@me
```

**Label Filters:**
- Multiple labels AND: `label:bug label:urgent`
- Multiple labels OR: `label:"bug","feature"` (comma-separated)
- Exclude: `-label:wontfix`

## Pull Request Review Workflow

**Inline Comments:**
- Click `+` next to line numbers for inline comments
- Click-drag line numbers for multi-line comments
- Use suggestion blocks (` ```suggestion`) so authors can apply with one click

**Submitting Reviews:**
- "Review changes" button (top right) to submit
- Types: Comment (no approval/block), Approve (approve for merge), Request changes (blocks merge)
- Mark files as viewed (checkbox in Files changed tab)
- Navigate files with `]` (next) and `[` (previous) keys

**Review Best Practices:**
- Batch comments with "Start a review" instead of one-by-one
- Mark files as viewed to track progress through large PRs
- Resolve conversations after addressing feedback
- Re-request reviews after force-pushing (they may have been dismissed)

## Common URL Patterns

```
Repository:  github.com/owner/repo
PR:          github.com/owner/repo/pull/123
Issue:       github.com/owner/repo/issues/456
File:        github.com/owner/repo/blob/branch/path/file.ext
```

## Task-Specific Questions

- What repository are you working in?
- Are you searching code, issues, or PRs?
- Are you on a branch or viewing a specific commit?
- What's the goal — review, edit, search, or manage?
