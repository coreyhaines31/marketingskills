# Hyper Elements

Previews and checks an HTML email as classic Outlook, Outlook.com, Outlook for Mac, Gmail, the Gmail app, Apple Mail, Yahoo Mail and AOL Mail draw it, light and dark, on the agent's own machine. It takes any HTML email: a template exported from an ESP, MJML or React Email output, or hand-written HTML. It lists what each client removes or changes, with the line in the HTML and a fix, and checks the email's accessibility (alt text, link text, headings, language).

Facts below were checked against `@hyper-elements/cli` 0.2.9, `@hyper-elements/email-clients` 0.4.15 and `@hyper-elements/lint` 0.1.7 on 2026-11-15.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | - | Runs locally; no hosted API |
| MCP | - | Not available |
| CLI | ✓ | `npx @hyper-elements/cli` (Node 20.6+ or Bun 1.3+): `check`, `preview` |
| SDK | ✓ | Node: `@hyper-elements/email-clients` (`renderInEmailClients()`), `@hyper-elements/lint/html` (`lintHtml()`) |

## Authentication

None. There's no account, key or sign-up, and the email is never sent or uploaded: the checks and previews run on the machine. Free, MIT-licensed.

## Common Agent Operations

Save the email as a whole HTML file, from `<html>` to `</html>`, first: the template's HTML export from the ESP, or the HTML part of a test send. A fragment is refused.

### Check an email for what clients remove

```bash
npx @hyper-elements/cli check email.html
```

Prints each finding with its line, the clients it affects, a fix and a caniemail.com link, then lint's accessibility findings. `--clients outlook,gmail` narrows the clients, `--json` prints one JSON line per email, and the exit code is `1` when an email has errors. Pass `-` to read the HTML from stdin.

```text
info email/html-css at email.html:17: This email may have a <style> in its <body>: the client
  removes it, and what it styles shows without it [gmail, gmail-app, gmail-app-other]
  Fix: move it into the <head>, or write the styles inline
```

### Preview the email in each client

```bash
npx @hyper-elements/cli preview email.html --dark
```

Writes one self-contained HTML file per client and variant to `out/clients/email/` (`outlook.html`, `gmail.html`, `gmail.mac.html`, `apple-mail.iphone.html`, `yahoo.dark.html` and so on): the email as that client draws it, with what the client changed listed above it. Open them in Chrome. `--clients` picks the clients (comma-separated ids below), `--dark` adds the dark-mode previews, `--fonts inline` puts the fonts in each file so it draws offline.

### Screenshots and findings for an agent

```bash
# A PNG beside each preview, to look at or attach to a review
npx -p @hyper-elements/cli -p playwright-core hyper-elements preview email.html --screenshots

# What each client removed or changed, as JSON, without writing PNGs
npx -p @hyper-elements/cli -p playwright-core hyper-elements preview email.html --findings --json

# No Chrome, Edge or Playwright Chromium on the machine? Download Chromium once
npx -p @hyper-elements/cli -p playwright-core hyper-elements preview --install-browser
```

Each preview in `--findings --json` carries `removed` (for example `{ "what": "border-radius", "count": 2 }` for classic Outlook), `missing` (fonts or images that didn't load) and `diagnostics` (a heading or button classic Outlook wraps onto more lines, text unreadable in a dark mode, where Gmail clips the email).

### From code

```js
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { renderInEmailClients } from "@hyper-elements/email-clients";
import { lintHtml } from "@hyper-elements/lint/html";

const html = await readFile("email.html", "utf8");

// What each client removes, by line, and one preview file per client
const { previews, diagnostics } = await renderInEmailClients(html, {
  emailClients: ["outlook", "outlook-com", "gmail", "gmail-app", "apple-mail", "yahoo", "aol"],
  dark: true,
});
await mkdir("out", { recursive: true });
for (const p of previews) await writeFile(`out/${p.filename}`, p.html);
for (const d of diagnostics) console.log(d.line, d.clients.join(","), d.message);

// Accessibility: alt text, link text, headings, lang, title
for (const d of lintHtml(html).diagnostics) console.log(d.line, d.code, d.message);
```

```bash
npm i -D @hyper-elements/email-clients @hyper-elements/lint
```

## Clients

| Id | Client |
|----|--------|
| `outlook` | Classic Outlook on Windows |
| `outlook-com` | Outlook.com and new Outlook |
| `outlook-mac` | Outlook for Mac (light and dark) |
| `gmail` | Gmail on the web |
| `gmail-app` | The Gmail app, on Android and an iPhone |
| `gmail-app-other` | The Gmail app reading a non-Gmail account |
| `apple-mail` | Apple Mail on a Mac and Mail on an iPhone (light and dark) |
| `yahoo` | Yahoo Mail on the web (light and dark) |
| `aol` | AOL Mail on the web (light and dark) |

Webmail is previewed as read on Windows and on a Mac. `check` also covers Samsung Email and the Outlook apps by default, from caniemail's support tables, and Thunderbird, Proton Mail, Fastmail and other clients with `--clients`.

## Relevant Skills

- **emails**: check each email in a sequence in the clients its list reads in before it goes live
- **cold-email**: check an HTML cold email before the first send

## Links

- [CLI docs](https://hyperelements.dev/docs/cli)
- [`@hyper-elements/email-clients` on npm](https://www.npmjs.com/package/@hyper-elements/email-clients)
- [`@hyper-elements/lint` on npm](https://www.npmjs.com/package/@hyper-elements/lint)
- [Source](https://github.com/hyper-elements/hyper-elements)
