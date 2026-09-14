import type { MetadataRoute } from 'next'
import { absoluteUrl } from './seo'
import { languageAlternates } from './lib/pageMetadata'
import { locales } from '../i18n/config'

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()
  const paths = ['', '/privacy'] as const

  return paths.flatMap((path) =>
    locales.map((locale) => ({
      url: absoluteUrl(`/${locale}${path}`),
      lastModified,
      changeFrequency: path === '' ? ('weekly' as const) : ('monthly' as const),
      priority: path === '' ? 1 : 0.5,
      alternates: {
        languages: languageAlternates(path),
      },
    })),
  )
}
