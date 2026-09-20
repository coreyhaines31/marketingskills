# Fixture: bad-2

Expected result: **fail**. The block looks complete and covers the right types, but it does not
parse — a trailing comma and an unquoted key. This is the failure mode a reader skimming the
answer will miss, and the one a browser will silently drop.

---

Paste this into the TaskFlow homepage head:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: "TaskFlow",
      "url": "https://www.taskflow.com",
      "logo": "https://www.taskflow.com/logo.png",
      "description": "Project management for product teams.",
      "sameAs": ["https://twitter.com/taskflow"],
    },
    {
      "@type": "SoftwareApplication",
      "name": "TaskFlow",
      "applicationCategory": "BusinessApplication"
    }
  ]
}
</script>
```

Validate with the Rich Results Test before deploying.
