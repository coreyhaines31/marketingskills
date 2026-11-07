# Precleared

Checks whether a cold or marketing email to one address is allowed in the recipient's country, before an agent sends it. One call returns a verdict (`ok_to_email`, `consent_needed`, `blocked` or `unknown`), the rule that decided it with its legal source, what the email's footer must include, a next step and a signed receipt. Covers the UK (PECR and UK GDPR), US (CAN-SPAM), Canada (CASL), Germany (UWG), France (CPCE), Australia (Spam Act 2003), Ireland (S.I. 336/2011) and the Netherlands (Telecommunicatiewet). For UK recipients it looks the company up on Companies House, because the rule turns on whether the recipient is a limited company or a sole trader.

Disclosure: this guide was contributed by Precleared's maker. It is a neutral integration under [PARTNERS.md](../PARTNERS.md), not a partner listing. Facts below were checked against the live API, [precleared.dev/openapi.json](https://precleared.dev/openapi.json) and [precleared.dev/docs](https://precleared.dev/docs) on 2026-10-17. Verdicts are decision support with sources, not legal advice.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | REST, `POST https://precleared.dev/api/v1/check`. Optional Bearer key. [OpenAPI spec](https://precleared.dev/openapi.json) |
| MCP | ✓ | Remote, Streamable HTTP: `https://precleared.dev/mcp`. No sign-in needed; a key is optional. Tools: `contact_check`, `verify_receipt` |
| CLI | - | None. The API is one JSON call, see below |
| SDK | - | None published yet |

## Authentication

- **Without a key:** nothing to set up. The free allowance is 100 checks a day per network address over MCP and 10 a day over the REST API.
- **With a key:** `Authorization: Bearer $PRECLEARED_API_KEY`. A free key from [precleared.dev/get-key](https://precleared.dev/get-key) gives 25 checks a day over the REST API (and its own 100 over MCP). Paid packs add credits that never expire. Keep the key in an env var or a secret manager, never in the repo.
- **Rate limit:** 60 checks a minute per key. Over that, the API answers `429` with `retry_after` in seconds.
- **Base URL:** `https://precleared.dev`

```bash
# Claude Code
claude mcp add --transport http precleared https://precleared.dev/mcp
# Codex
codex mcp add precleared --url https://precleared.dev/mcp
```

Cursor, Windsurf and other clients take the same URL in their MCP settings:

```json
{ "mcpServers": { "precleared": { "url": "https://precleared.dev/mcp" } } }
```

## Common Agent Operations

### Check one address before the first email

```bash
curl -s https://precleared.dev/api/v1/check \
  -H "Content-Type: application/json" \
  -d '{
    "recipient_email": "jane@acme.co.uk",
    "sender_country": "GB",
    "address_source": "published",
    "pitch": "Bookkeeping software for dental practices",
    "pitch_relevant": true
  }'
```

Request fields:

| Field | Required | Notes |
|-------|----------|-------|
| `recipient_email` or `recipient_domain` | one of them | The address, or just the domain when there is no address yet |
| `address_source` | send it | `published`, `bought`, `scraped`, `given` or `unknown`. It changes the verdict (CASL, the Spam Act and the Dutch rules all turn on it). A missing value counts as `unknown` |
| `sender_country` | no | `GB` (default) or `US` |
| `pitch`, `pitch_relevant` | no | What the email offers and whether it relates to the recipient's role; used by the Canadian and French rules |
| `recipient_country` | no | Two-letter code. Worth passing for `.com` domains, which carry no country |
| `company_number` | no | UK company number, raises confidence |
| `existing_customer`, `suppressed` | no | Both default to false. Pass `suppressed: true` for anyone on your own do-not-contact list |

Over MCP, `contact_check` takes the same fields.

### Read the answer

```json
{
  "verdict": "ok_to_email",
  "confidence": "high",
  "reasons": [{ "rule_key": "...", "text": "the rule, quoted", "source_title": "...", "source_url": "https://www.legislation.gov.uk/..." }],
  "footer_text": "what the footer must include",
  "next_step": "what to do now",
  "facts": { "recipient_country": "GB", "legal_form": "corporate", "company_number": "01234567", "mx_ok": true },
  "receipt": { "id": "cc_rcpt_...", "verify_url": "https://precleared.dev/api/v1/receipt?id=cc_rcpt_..." },
  "usage": { "free_remaining_today": 9, "credits_remaining": 0 }
}
```

| Verdict | Meaning | Outbound action |
|---------|---------|-----------------|
| `ok_to_email` | Allowed under the rule that applies | Send, with a footer that meets `footer_text`. Log the receipt id against the lead |
| `consent_needed` | Needs prior consent (for example a UK sole trader, or a German business address) | Do not send. Follow `next_step` |
| `blocked` | Not allowed on these facts (for example a bought list sent to a German address) | Do not send |
| `unknown` | A fact could not be established (no mail server, no country, a company that could not be matched) | Treat as `consent_needed` unless you can supply the missing fact (`recipient_country`, `company_number`) and check again |

`footer_text` describes the requirement (who you are, a postal address, how to opt out, and so on). It is not wording to paste. One check per address is enough; cache the verdict with the lead rather than re-checking every step of a sequence.

### Keep the receipt

```bash
curl -s "https://precleared.dev/api/v1/receipt?id=cc_rcpt_XXXXXXXXXXXXXXXX"
```

Returns the stored record: verdict, rules applied, masked recipient, timestamp, hashes, an Ed25519 signature and the public key to verify it. The same record is readable by anyone at `https://precleared.dev/r/<id>`, which is what you show a client or an auditor. A receipt proves what was asked and answered. It does not prove an email was sent. Over MCP, `verify_receipt` does the same.

## Errors

| Status | Meaning |
|--------|---------|
| `400` | Invalid body; `message` names the field |
| `401` | Invalid or revoked key |
| `402` | No free checks or credits left on this key; body includes `buy_url` |
| `429` | Keyless daily allowance used (`get_key_url` in the body), or more than 60 a minute on a key (`retry_after`) |

If the check cannot be made, hold the cold email until the next run rather than sending unchecked. Replies and transactional email do not need a check.

## Doing it yourself

The same questions can be answered by hand against the official guidance. A tool saves the lookups and gives you a record; it does not change the rules.

- UK: [ICO guide to PECR, electronic mail marketing](https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guide-to-pecr/electronic-and-telephone-marketing/electronic-mail-marketing/) and [PECR regulation 22](https://www.legislation.gov.uk/uksi/2003/2426/regulation/22). Sole traders and partnerships count as individual subscribers; check the recipient on Companies House.
- US: [FTC CAN-SPAM compliance guide](https://www.ftc.gov/business-guidance/resources/can-spam-act-compliance-guide-business). No prior consent needed; content and opt-out rules apply.
- Canada: [CRTC FAQ on CASL](https://crtc.gc.ca/eng/com500/faq500.htm) and [the Act](https://laws-lois.justice.gc.ca/eng/acts/E-1.6/page-1.html). Consent is express or implied, and implied consent depends on how the address was obtained.
- Germany: [UWG section 7, English translation](https://www.gesetze-im-internet.de/englisch_uwg/englisch_uwg.html). Prior consent for advertising email, business addresses included.
- France: [CNIL on email prospecting](https://www.cnil.fr/fr/la-prospection-commerciale-par-courrier-electronique).
- Australia: [Spam Act 2003](https://www.legislation.gov.au/C2004A01214/latest/text) and [ACMA's consent expectations](https://www.acma.gov.au/publications/2024-06/guide/consumer-consent-expectations-businesses-conducting-telemarketing-and-e-marketing).
- Ireland: [S.I. No. 336/2011, Regulation 13](https://www.irishstatutebook.ie/eli/2011/si/336/made/en/print).
- Netherlands: [Telecommunicatiewet, artikel 11.7](https://wetten.overheid.nl/BWBR0009950/2026-08-15/#Hoofdstuk11_Paragraaf11.1_Artikel11.7).

## Tradeoffs

- **Eight countries.** Recipients elsewhere in the EU get a cautious default (consent needed) rather than a country-specific rule, and the rest of the world is not covered.
- **`unknown` happens.** When a UK company cannot be matched, or a `.com` domain shows no country, the check says so rather than guessing. Passing `recipient_country` and `company_number` removes most of these.
- **One more call per lead,** about a second each, and a small cost at volume (packs are priced per check).
- **Not legal advice.** The rule and its source are quoted so a human can read them; the decision stays with you. For edge cases, a lawyer.
- **No suppression list.** It does not store your opt-outs; keep your own and pass `suppressed: true`.

## How it fits the skills

- **cold-email:** run the check once per address before the first email, after the list is verified for deliverability and before it reaches the sender. Send only on `ok_to_email`, write the footer to meet `footer_text`, and keep the receipt id with the lead.
- **prospecting:** when building a list for the UK, Canada, Australia or Europe, the verdicts tell you which rows need consent before any sequence starts, which changes how big the usable list really is.
- Alternatives for the same job: the official guidance above, done by hand; your sequencer's own consent and suppression features ([instantly](instantly.md), [lemlist](lemlist.md)); and a lawyer for anything novel. Deliverability verification ([truelist](truelist.md)) is a different question (will it arrive), and both still apply.

## Links

- Site: https://precleared.dev
- Docs: https://precleared.dev/docs
- Rules in force, with sources: https://precleared.dev/rules
- Weekly accuracy run: https://precleared.dev/accuracy
- Status: https://precleared.dev/api/v1/health
- Privacy: https://precleared.dev/privacy
- Recipes for Clay, n8n, Make and Zapier: https://precleared.dev/docs/recipes
