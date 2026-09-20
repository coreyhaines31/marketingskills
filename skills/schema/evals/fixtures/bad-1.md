# Fixture: bad-1

Expected result: **fail**. Valid JSON, but it is not what the eval asks for: one type only, no
`@graph`, the recommended Organization properties missing, and the values left as placeholders
instead of the business the user named. A checker that only confirmed "a JSON-LD block exists"
would pass this.

---

Here is the Organization schema for your homepage:

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Your Company",
  "url": "https://example.com"
}
```

Run it through the Rich Results Test once it is live.
