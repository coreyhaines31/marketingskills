// @ts-check
import { defineConfig } from 'astro/config'
import sitemap from '@astrojs/sitemap'
import tailwind from '@astrojs/tailwind'
import { SITE_URL } from './src/config.ts'

// Static SEO marketing site. `astro build` → dist/ served by CDN or nginx.
export default defineConfig({
  site: SITE_URL,          // drives canonical + sitemap + OG absolute URLs
  trailingSlash: 'ignore', // pick ONE policy and keep it consistent

  // Multilingual: default locale at root, others prefixed (/vi, /de …).
  // Single-language: delete this whole `i18n` block.
  i18n: {
    locales: ['en', 'vi'],
    defaultLocale: 'en',
    routing: { prefixDefaultLocale: false },
  },

  integrations: [
    tailwind({ applyBaseStyles: false }),
    sitemap({
      // Emits hreflang alternates in the sitemap. Match your locales.
      i18n: { defaultLocale: 'en', locales: { en: 'en', vi: 'vi' } },
      changefreq: 'weekly',
      priority: 0.7,
    }),
  ],
})
