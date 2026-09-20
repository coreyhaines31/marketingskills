# Fixture: good-2

Expected result: **pass**. Form: fenced JSON block, per-node `@context`, `sameAs` as a single
string, `logo` as an `ImageObject`, `SearchAction` reached through an `@id` reference.

Same page, same facts, same acceptance — a different writer made different (equally legal)
choices. If the checker only accepted one of these two, it would be scoring style, not correctness.

---

Add the following block just before `</head>` on the TaskFlow homepage. If you are on Next.js,
render it from the layout with `dangerouslySetInnerHTML` so it stays server-side rendered.

```json
{
  "@graph": [
    {
      "@context": "https://schema.org",
      "@id": "https://www.taskflow.com/#organization",
      "@type": "Organization",
      "url": "https://www.taskflow.com",
      "name": "TaskFlow",
      "description": "TaskFlow is project management software for product teams: plan work, track progress, ship faster.",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.taskflow.com/static/logo-512.png",
        "width": 512,
        "height": 512
      },
      "sameAs": "https://www.linkedin.com/company/taskflow"
    },
    {
      "@context": "https://schema.org",
      "@id": "https://www.taskflow.com/#website",
      "@type": "WebSite",
      "url": "https://www.taskflow.com",
      "name": "TaskFlow",
      "potentialAction": { "@id": "https://www.taskflow.com/#sitesearch" }
    },
    {
      "@context": "https://schema.org",
      "@id": "https://www.taskflow.com/#sitesearch",
      "@type": "SearchAction",
      "target": "https://www.taskflow.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    },
    {
      "@context": "https://schema.org",
      "@id": "https://www.taskflow.com/#software",
      "@type": "SoftwareApplication",
      "name": "TaskFlow",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web",
      "offers": {
        "@type": "Offer",
        "price": "12.00",
        "priceCurrency": "USD"
      }
    }
  ]
}
```

Validate it with the Schema.org validator plus the Rich Results Test before shipping; after
deploy, confirm in Search Console that the SoftwareApplication and WebSite items were picked up.
