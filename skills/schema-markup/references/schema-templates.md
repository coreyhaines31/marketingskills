# Schema Markup Templates

Copy-paste JSON-LD schema templates for common content types. Validate all schema using Google's Rich Results Test before deployment.

## Article Schema

For blog posts, news articles, and editorial content.

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "[Article Title - Max 110 characters]",
  "description": "[Brief description - 150-160 characters]",
  "image": "[URL to featured image]",
  "author": {
    "@type": "Person",
    "name": "[Author Name]",
    "url": "[Author profile URL]"
  },
  "publisher": {
    "@type": "Organization",
    "name": "[Publisher/Site Name]",
    "logo": {
      "@type": "ImageObject",
      "url": "[Logo URL]"
    }
  },
  "datePublished": "[YYYY-MM-DD]",
  "dateModified": "[YYYY-MM-DD]",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "[Canonical URL of article]"
  }
}
```

## BlogPosting Schema

More specific schema for blog content (subtype of Article).

```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "[Blog Post Title]",
  "description": "[Meta description]",
  "image": "[Featured image URL]",
  "author": {
    "@type": "Person",
    "name": "[Author Name]",
    "jobTitle": "[Author Title/Role]",
    "url": "[Author page URL]"
  },
  "publisher": {
    "@type": "Organization",
    "name": "[Site Name]",
    "logo": {
      "@type": "ImageObject",
      "url": "[Logo URL]",
      "width": "[Width in pixels]",
      "height": "[Height in pixels]"
    }
  },
  "datePublished": "[YYYY-MM-DDTHH:MM:SSZ]",
  "dateModified": "[YYYY-MM-DDTHH:MM:SSZ]",
  "mainEntityOfPage": "[Canonical URL]",
  "keywords": "[keyword1, keyword2, keyword3]",
  "wordCount": "[Number]",
  "articleSection": "[Category/Section name]"
}
```

## FAQPage Schema

For FAQ sections and dedicated FAQ pages. Note: Google now limits FAQ rich results to authoritative government and health sites for most queries.

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "[Question 1 text]?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "[Answer 1 - can include HTML formatting]"
      }
    },
    {
      "@type": "Question",
      "name": "[Question 2 text]?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "[Answer 2]"
      }
    },
    {
      "@type": "Question",
      "name": "[Question 3 text]?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "[Answer 3]"
      }
    }
  ]
}
```

## HowTo Schema

For instructional, tutorial, and step-by-step content. Note: Google deprecated HowTo rich results in September 2023 but schema still aids AI understanding.

```json
{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "[How to Title]",
  "description": "[Brief description of what this teaches]",
  "image": "[URL to instructional image]",
  "totalTime": "PT[X]M",
  "estimatedCost": {
    "@type": "MonetaryAmount",
    "currency": "USD",
    "value": "[Cost or 0 if free]"
  },
  "supply": [
    {
      "@type": "HowToSupply",
      "name": "[Supply/material 1]"
    },
    {
      "@type": "HowToSupply",
      "name": "[Supply/material 2]"
    }
  ],
  "tool": [
    {
      "@type": "HowToTool",
      "name": "[Tool 1]"
    },
    {
      "@type": "HowToTool",
      "name": "[Tool 2]"
    }
  ],
  "step": [
    {
      "@type": "HowToStep",
      "name": "[Step 1 Name]",
      "text": "[Step 1 detailed instructions]",
      "image": "[Optional step image URL]",
      "url": "[Optional anchor link to step]"
    },
    {
      "@type": "HowToStep",
      "name": "[Step 2 Name]",
      "text": "[Step 2 detailed instructions]"
    },
    {
      "@type": "HowToStep",
      "name": "[Step 3 Name]",
      "text": "[Step 3 detailed instructions]"
    }
  ]
}
```

## Product Schema

For e-commerce product pages.

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "[Product Name]",
  "description": "[Product description]",
  "image": "[Product image URL]",
  "brand": {
    "@type": "Brand",
    "name": "[Brand Name]"
  },
  "sku": "[SKU number]",
  "mpn": "[Manufacturer Part Number]",
  "offers": {
    "@type": "Offer",
    "url": "[Product page URL]",
    "priceCurrency": "USD",
    "price": "[Price]",
    "priceValidUntil": "[YYYY-MM-DD]",
    "availability": "https://schema.org/InStock",
    "seller": {
      "@type": "Organization",
      "name": "[Seller Name]"
    }
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "[Average rating]",
    "reviewCount": "[Number of reviews]"
  },
  "review": {
    "@type": "Review",
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": "[Rating]",
      "bestRating": "5"
    },
    "author": {
      "@type": "Person",
      "name": "[Reviewer Name]"
    },
    "reviewBody": "[Review text]"
  }
}
```

## LocalBusiness Schema

For businesses with physical locations.

```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "[Business Name]",
  "description": "[Business description]",
  "image": "[Business/storefront image URL]",
  "url": "[Website URL]",
  "telephone": "[Phone number]",
  "email": "[Email address]",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "[Street address]",
    "addressLocality": "[City]",
    "addressRegion": "[State/Province]",
    "postalCode": "[ZIP/Postal code]",
    "addressCountry": "[Country code, e.g., US]"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "[Latitude]",
    "longitude": "[Longitude]"
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "09:00",
      "closes": "17:00"
    }
  ],
  "priceRange": "[$$ or price range]",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "[Average rating]",
    "reviewCount": "[Number of reviews]"
  }
}
```

## Organization Schema

For company/organization information, typically site-wide.

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "[Organization Name]",
  "url": "[Website URL]",
  "logo": "[Logo URL]",
  "description": "[Organization description]",
  "foundingDate": "[YYYY]",
  "founder": {
    "@type": "Person",
    "name": "[Founder Name]"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "[Phone]",
    "contactType": "customer service",
    "email": "[Email]"
  },
  "sameAs": [
    "[Facebook URL]",
    "[Twitter URL]",
    "[LinkedIn URL]",
    "[Instagram URL]"
  ]
}
```

## BreadcrumbList Schema

For site navigation breadcrumbs.

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "[Home URL]"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "[Category]",
      "item": "[Category URL]"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "[Current Page]",
      "item": "[Current Page URL]"
    }
  ]
}
```

## WebPage Schema

Basic page-level schema that can be combined with other types.

```json
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "[Page Title]",
  "description": "[Meta description]",
  "url": "[Canonical URL]",
  "datePublished": "[YYYY-MM-DD]",
  "dateModified": "[YYYY-MM-DD]",
  "inLanguage": "en-US",
  "isPartOf": {
    "@type": "WebSite",
    "name": "[Site Name]",
    "url": "[Site URL]"
  },
  "breadcrumb": {
    "@type": "BreadcrumbList",
    "itemListElement": []
  }
}
```

## VideoObject Schema

For pages with embedded video content.

```json
{
  "@context": "https://schema.org",
  "@type": "VideoObject",
  "name": "[Video Title]",
  "description": "[Video description]",
  "thumbnailUrl": "[Thumbnail URL]",
  "uploadDate": "[YYYY-MM-DDTHH:MM:SSZ]",
  "duration": "PT[X]M[Y]S",
  "contentUrl": "[Direct video URL]",
  "embedUrl": "[Embed URL]",
  "interactionStatistic": {
    "@type": "InteractionCounter",
    "interactionType": { "@type": "WatchAction" },
    "userInteractionCount": "[View count]"
  }
}
```

---

## Validation Checklist

Before deploying schema markup:

1. [ ] Test with Google Rich Results Test: https://search.google.com/test/rich-results
2. [ ] Validate JSON syntax at https://validator.schema.org
3. [ ] Verify schema type is appropriate for content
4. [ ] Ensure all required properties are included
5. [ ] Confirm schema data matches visible page content
6. [ ] Check for warnings (not just errors)
7. [ ] Test on live page after deployment

## Common Schema Errors to Avoid

- Missing required properties (headline, author, datePublished)
- Mismatched schema type and content
- Invalid date formats (use ISO 8601: YYYY-MM-DD)
- Invalid URLs (must be absolute, not relative)
- Schema data doesn't match visible content
- Duplicate schema on same page
- Nested schema incorrectly structured
