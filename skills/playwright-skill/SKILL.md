---
name: playwright-skill
description: Production-tested Playwright patterns for E2E, API, component, visual, accessibility, and security testing. Covers locators, fixtures, POM, network mocking, auth flows, debugging, CI/CD (GitHub Actions, GitLab, CircleCI, Azure, Jenkins), framework recipes (React, Next.js, Vue, Angular), and migration guides from Cypress/Selenium. TypeScript and JavaScript.
license: MIT
---

# Playwright Skill

> Opinionated, production-tested Playwright guidance. Every pattern includes when (and when *not*) to use it.

**70+ reference guides** covering the full Playwright surface: selectors, assertions, fixtures, page objects, network mocking, auth, visual regression, accessibility, API testing, CI/CD, debugging, and more, with TypeScript and JavaScript examples throughout.

## Golden Rules

1. **`getByRole()` over CSS/XPath** - resilient to markup changes, mirrors how users see the page
2. **Never `page.waitForTimeout()`** - use `expect(locator).toBeVisible()` or `page.waitForURL()`
3. **Web-first assertions** - `expect(locator)` auto-retries; `expect(await locator.textContent())` does not
4. **Isolate every test** - no shared state, no execution-order dependencies
5. **`baseURL` in config** - zero hardcoded URLs in tests
6. **Retries: `2` in CI, `0` locally** - surface flakiness where it matters
7. **Traces: `'on-first-retry'`** - rich debugging artifacts without CI slowdown
8. **Fixtures over globals** - share state via `test.extend()`, not module-level variables
9. **One behavior per test** - multiple related `expect()` calls are fine
10. **Mock external services only** - never mock your own app; mock third-party APIs, payment gateways, email

## Guide Index

### Writing Tests

| What you're doing | Guide | Deep dive |
|---|---|---|
| Choosing selectors | [locators.md](https://github.com/testdino-hq/playwright-skill/blob/main/core/locators.md) | [locator-strategy.md](https://github.com/testdino-hq/playwright-skill/blob/main/core/locator-strategy.md) |
| Assertions & waiting | [assertions-and-waiting.md](https://github.com/testdino-hq/playwright-skill/blob/main/core/assertions-and-waiting.md) | |
| Organizing test suites | [test-organization.md](https://github.com/testdino-hq/playwright-skill/blob/main/core/test-organization.md) | [test-architecture.md](https://github.com/testdino-hq/playwright-skill/blob/main/core/test-architecture.md) |
| Playwright config | [configuration.md](https://github.com/testdino-hq/playwright-skill/blob/main/core/configuration.md) | |
| Page objects | [page-object-model.md](https://github.com/testdino-hq/playwright-skill/blob/main/pom/page-object-model.md) | [pom-vs-fixtures-vs-helpers.md](https://github.com/testdino-hq/playwright-skill/blob/main/pom/pom-vs-fixtures-vs-helpers.md) |
| Fixtures & hooks | [fixtures-and-hooks.md](https://github.com/testdino-hq/playwright-skill/blob/main/core/fixtures-and-hooks.md) | |
| Test data | [test-data-management.md](https://github.com/testdino-hq/playwright-skill/blob/main/core/test-data-management.md) | |
| Auth & login | [authentication.md](https://github.com/testdino-hq/playwright-skill/blob/main/core/authentication.md) | [auth-flows.md](https://github.com/testdino-hq/playwright-skill/blob/main/core/auth-flows.md) |
| API testing | [api-testing.md](https://github.com/testdino-hq/playwright-skill/blob/main/core/api-testing.md) | |
| Visual regression | [visual-regression.md](https://github.com/testdino-hq/playwright-skill/blob/main/core/visual-regression.md) | |
| Accessibility | [accessibility.md](https://github.com/testdino-hq/playwright-skill/blob/main/core/accessibility.md) | |
| Mobile & responsive | [mobile-and-responsive.md](https://github.com/testdino-hq/playwright-skill/blob/main/core/mobile-and-responsive.md) | |
| Network mocking | [network-mocking.md](https://github.com/testdino-hq/playwright-skill/blob/main/core/network-mocking.md) | [when-to-mock.md](https://github.com/testdino-hq/playwright-skill/blob/main/core/when-to-mock.md) |
| Forms & validation | [forms-and-validation.md](https://github.com/testdino-hq/playwright-skill/blob/main/core/forms-and-validation.md) | |

### Debugging & Fixing

| Problem | Guide |
|---|---|
| General debugging workflow | [debugging.md](https://github.com/testdino-hq/playwright-skill/blob/main/core/debugging.md) |
| Flaky / intermittent tests | [flaky-tests.md](https://github.com/testdino-hq/playwright-skill/blob/main/core/flaky-tests.md) |
| Common beginner mistakes | [common-pitfalls.md](https://github.com/testdino-hq/playwright-skill/blob/main/core/common-pitfalls.md) |

### Framework Recipes

| Framework | Guide |
|---|---|
| Next.js | [nextjs.md](https://github.com/testdino-hq/playwright-skill/blob/main/core/nextjs.md) |
| React | [react.md](https://github.com/testdino-hq/playwright-skill/blob/main/core/react.md) |
| Vue 3 / Nuxt | [vue.md](https://github.com/testdino-hq/playwright-skill/blob/main/core/vue.md) |
| Angular | [angular.md](https://github.com/testdino-hq/playwright-skill/blob/main/core/angular.md) |

### CI/CD & Infrastructure

| Topic | Guide |
|---|---|
| GitHub Actions | [ci-github-actions.md](https://github.com/testdino-hq/playwright-skill/blob/main/ci/ci-github-actions.md) |
| GitLab CI | [ci-gitlab.md](https://github.com/testdino-hq/playwright-skill/blob/main/ci/ci-gitlab.md) |
| CircleCI / Azure DevOps / Jenkins | [ci-other.md](https://github.com/testdino-hq/playwright-skill/blob/main/ci/ci-other.md) |
| Parallel execution & sharding | [parallel-and-sharding.md](https://github.com/testdino-hq/playwright-skill/blob/main/ci/parallel-and-sharding.md) |
| Docker & containers | [docker-and-containers.md](https://github.com/testdino-hq/playwright-skill/blob/main/ci/docker-and-containers.md) |

### Migration Guides

| From | Guide |
|---|---|
| Cypress | [from-cypress.md](https://github.com/testdino-hq/playwright-skill/blob/main/migration/from-cypress.md) |
| Selenium / WebDriver | [from-selenium.md](https://github.com/testdino-hq/playwright-skill/blob/main/migration/from-selenium.md) |

## Language Note

All guides include TypeScript and JavaScript examples. When the project uses `.js` files or has no `tsconfig.json`, examples are adapted to plain JavaScript.

## Source

Full guides available at [testdino-hq/playwright-skill](https://github.com/testdino-hq/playwright-skill).
