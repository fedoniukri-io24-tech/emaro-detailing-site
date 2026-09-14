import type { MetadataRoute } from 'next'
import { absoluteUrl } from './seo'
import { languageAlternates } from './lib/pageMetadata'
import { locales } from '../i18n/config'

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  return locales.map((locale) => ({
    url: absoluteUrl(`/${locale}`),
    lastModified,
    changeFrequency: 'weekly',
    priority: 1,
    alternates: {
      languages: languageAlternates(''),
    },
  }))
}
