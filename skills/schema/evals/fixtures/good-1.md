# Fixture: good-1

Expected result: **pass**. Form: `<script>` tag, `@graph`, `sameAs` as an array, `logo` as a URL
string. This is the shape most writers reach for first.

---

Paste this into the `<head>` of the TaskFlow homepage (or the layout component if the head is
managed by your framework):

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@id": "https://www.taskflow.com/#organization",
      "@type": "Organization",
      "name": "TaskFlow",
      "url": "https://www.taskflow.com",
      "logo": "https://www.taskflow.com/logo.png",
      "description": "TaskFlow is a project management tool that helps product teams plan work, track progress, and ship faster.",
      "sameAs": [
        "https://twitter.com/taskflow",
        "https://www.linkedin.com/company/taskflow"
      ]
    },
    {
      "@id": "https://www.taskflow.com/#website",
      "@type": "WebSite",
      "name": "TaskFlow",
      "url": "https://www.taskflow.com",
      "publisher": { "@id": "https://www.taskflow.com/#organization" },
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://www.taskflow.com/search?q={search_term_string}"
        },
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@id": "https://www.taskflow.com/#software",
      "@type": "SoftwareApplication",
      "name": "TaskFlow",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web, iOS, Android",
      "description": "Project management for product teams.",
      "publisher": { "@id": "https://www.taskflow.com/#organization" },
      "offers": {
        "@type": "Offer",
        "price": "12.00",
        "priceCurrency": "USD",
        "url": "https://www.taskflow.com/pricing"
      }
    }
  ]
}
</script>
```

Before you deploy: run the page through Google's Rich Results Test and the Schema.org validator,
then watch the Search Console structured data report for the first week.
