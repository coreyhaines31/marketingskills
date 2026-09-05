/**
 * Central site config — the ONE file to edit when going to production.
 * SITE_URL drives canonical URLs, sitemap, and Open Graph.
 * APP_URL is the target of the "Login" / "Open app" button (the SPA behind login).
 */

// ⬇️ Production domain. No trailing slash.
export const SITE_URL = 'https://example.com'

// Login/CTA target. Same-domain path ('/app') or subdomain ('https://app.example.com').
export const APP_URL = '/app'

export const BRAND = {
  name: 'YourProduct',
  legalName: 'YourProduct, Inc.',
  tagline: 'One-line value proposition used as the default meta description.',
  // OG image MUST be PNG/JPG 1200×630 (crawlers reject SVG). Put it in public/.
  ogImage: '/og-default.png',
  twitter: '@yourproduct',
  email: 'hello@example.com',
} as const

// Locales: default first. Single-language sites: keep just ['en'].
export const LANGS = ['en'] as const
export type Lang = (typeof LANGS)[number]
export const DEFAULT_LANG: Lang = 'en'
