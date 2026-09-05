/**
 * i18n helpers for hreflang + locale-prefixed routing.
 * Scheme: default locale at root ('/'), others prefixed ('/vi/...').
 * Single-language site: you can delete this and hardcode lang in BaseHead.
 */
import { DEFAULT_LANG, LANGS, type Lang } from '../config'

/** Locale from URL: /vi/... → 'vi', otherwise the default. */
export function getLangFromUrl(url: URL): Lang {
  const seg = url.pathname.split('/')[1]
  return (LANGS as readonly string[]).includes(seg) && seg !== DEFAULT_LANG ? (seg as Lang) : DEFAULT_LANG
}

/** Build a locale-prefixed path. localizedPath('/blog','vi') → '/vi/blog'; default → '/blog'. */
export function localizedPath(path: string, lang: Lang): string {
  const clean = '/' + path.replace(/^\/+/, '')
  if (lang === DEFAULT_LANG) return clean === '/' ? '/' : clean.replace(/\/$/, '')
  return (`/${lang}${clean === '/' ? '' : clean}`).replace(/\/$/, '') || `/${lang}`
}

/** Strip a locale prefix so a page can map itself to every locale for hreflang. */
export function stripLangPrefix(pathname: string): string {
  const others = LANGS.filter((l) => l !== DEFAULT_LANG)
  const re = new RegExp(`^/(${others.join('|')})(?=/|$)`)
  const out = pathname.replace(re, '')
  return out === '' ? '/' : out
}
