import type { Locale } from './config'
import { locales } from './config'

export const NAV_SECTIONS = [
  { key: 'about', anchor: '#o-nas' },
  { key: 'services', anchor: '#uslugi' },
  { key: 'prices', anchor: '#ceny' },
  { key: 'gallery', anchor: '#galeria' },
  { key: 'reviews', anchor: '#opinie' },
  { key: 'contacts', anchor: '#kontakt' },
] as const

export function localePath(locale: Locale, path = '/') {
  if (path.startsWith('/#')) {
    return `/${locale}${path.slice(1)}`
  }
  if (path.startsWith('#')) {
    return `/${locale}${path}`
  }
  const normalized = path === '/' ? '' : path.startsWith('/') ? path : `/${path}`
  return `/${locale}${normalized}`
}

export function switchLocalePath(pathname: string, nextLocale: Locale) {
  const parts = pathname.split('/')
  if (parts.length > 1 && locales.includes(parts[1] as Locale)) {
    parts[1] = nextLocale
    return parts.join('/') || `/${nextLocale}`
  }
  return `/${nextLocale}${pathname === '/' ? '' : pathname}`
}
