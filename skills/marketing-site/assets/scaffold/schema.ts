/**
 * JSON-LD builders (schema.org). Import in a page and pass to a <JsonLd> component
 * that renders <script type="application/ld+json" set:html={JSON.stringify(x)} />.
 */
import { SITE_URL, BRAND } from '../config'

const abs = (path: string) => new URL(path, SITE_URL).href

export const organizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${SITE_URL}/#organization`,
  name: BRAND.legalName,
  url: SITE_URL,
  logo: abs('/favicon.svg'),
  email: BRAND.email,
  sameAs: [`https://twitter.com/${BRAND.twitter.replace('@', '')}`],
})

export const websiteSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  name: BRAND.name,
  url: SITE_URL,
  publisher: { '@id': `${SITE_URL}/#organization` },
})

export const faqSchema = (items: { q: string; a: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: items.map((it) => ({
    '@type': 'Question',
    name: it.q,
    acceptedAnswer: { '@type': 'Answer', text: it.a },
  })),
})

export const breadcrumbSchema = (crumbs: { name: string; path: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: crumbs.map((c, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: c.name,
    item: abs(c.path),
  })),
})

export const articleSchema = (o: {
  title: string; description: string; path: string; image?: string
  datePublished: string; dateModified?: string; authorName: string
}) => ({
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: o.title,
  description: o.description,
  image: abs(o.image ?? BRAND.ogImage),
  datePublished: o.datePublished,
  dateModified: o.dateModified ?? o.datePublished,
  author: { '@type': 'Organization', name: o.authorName },
  publisher: { '@id': `${SITE_URL}/#organization` },
  mainEntityOfPage: { '@type': 'WebPage', '@id': abs(o.path) },
})
