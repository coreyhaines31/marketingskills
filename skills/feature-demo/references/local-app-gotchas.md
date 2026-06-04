# Local-App Gotchas

The recorder hits `BASE_URL` (default `http://127.0.0.1:8000`) and
just needs the page to render in headless Chromium. Any stack works
— Laravel, Rails, Django, Next.js, etc. But a few cross-cutting
issues bite Playwright recordings on plain HTTP localhost.

## `Secure; SameSite=None` cookies are rejected

Chromium refuses to set cookies with `Secure` over plain HTTP. If
your session cookie is set with `Secure; SameSite=None`, the user
never stays logged in — every navigation is anonymous and the demo
bounces back to the login page. Two fixes:

- **Flip to `SameSite=Lax`** for the recording run (does not require
  Secure). Often just an `.env` flag or a one-line config tweak.
- **Or serve HTTPS** with a self-signed cert and pass
  `ignoreHTTPSErrors: true` in the Playwright context options
  (already on by default in the template).

## Strict CSP blocks the overlay

Pages that ship `Content-Security-Policy: style-src 'self'` (no
`unsafe-inline`) will block the subtitle bar + cursor overlay
because they're set via inline `style="..."` attributes. The
recorder template already sets `bypassCSP: true` on the Playwright
context to disable enforcement during the recording. **Don't strip
that.**

## SPA crashes on boot leave a blank video

If a required env var is empty and the SPA's bootstrap throws (e.g.
`new Pusher('')` because `VITE_PUSHER_APP_KEY` isn't set, an
analytics constructor that asserts on a missing token, etc.), the
page renders blank or partially. The recorder captures the blank
frames silently. Verify the page renders in a real browser before
recording.

The narrator trims the first frames anyway (anchored to the first
subtitle's offset), but it can only trim a few hundred ms before
hitting the first scene — it can't recover a permanently-broken
page.

## Pre-recording state accumulates across runs

If the demo depends on a known user/account, multiple runs leave
side-effect rows behind (extra steps in a sequence, extra leads,
etc.). Those then make `:has-text("X")` selectors ambiguous —
matching the new modal option AND the already-existing card from a
prior run.

Use a `resetDemoState()` block at the top of the recorder to wipe
just the rows your demo touches. Shell out via `spawnSync` (array
form so the shell doesn't expand `$vars` in the snippet) and run
your stack's appropriate tool — `php artisan tinker --execute`,
`bundle exec rails runner`, a SQL one-liner, an admin API call.

The recorder template has a commented Laravel/Tinker example you
can adapt.

## Production-pointing env vars in cloud sessions

Some session setups (e.g. agents that ship a DB-query skill) export
`DB_HOST` / `DB_PASSWORD` / `DB_SOCKET` pointing at **production**
RDS. Any `artisan` / `rails` / `psql` command that inherits the
shell env will silently hit prod. Always:

- Unset / override those vars when running schema or seed commands
- Use a local-only override at the start of your reset script

The recorder template doesn't import process.env wholesale; if you
adapt the Laravel example, the `env` object passed to `spawnSync`
should explicitly set `DB_HOST=127.0.0.1` (or wherever your local
DB lives) instead of forwarding `process.env`.
