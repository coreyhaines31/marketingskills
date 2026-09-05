import { defineCollection, z } from 'astro:content'
import { glob } from 'astro/loaders'

/**
 * Blog collection = the organic-traffic engine (one indexable URL per post).
 * Multilingual layout: src/content/blog/<lang>/<slug>.md → post.id = "<lang>/<slug>".
 * Single-language: drop the <lang> folder; post.id = "<slug>".
 */
const blog = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/blog' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(), // used for meta description + OG on the post page
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      author: z.string().default('Team'),
      tags: z.array(z.string()).default([]),
      heroImage: image().optional(),
      draft: z.boolean().default(false), // true = excluded from build
    }),
})

export const collections = { blog }
