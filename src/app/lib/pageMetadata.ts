import type { Metadata } from 'next'
import { locales, type Locale } from '../../i18n/config'
import {
  absoluteUrl,
  OG_IMAGE,
  OG_IMAGE_HEIGHT,
  OG_IMAGE_WIDTH,
  SITE_NAME,
} from '../seo'

export const localeToOgLocale: Record<Locale, string> = {
  pl: 'pl_PL',
  uk: 'uk_UA',
}

export function languageAlternates(path = '') {
  const normalized = path === '/' ? '' : path.startsWith('/') ? path : `/${path}`
  const languages: Record<string, string> = {
    'x-default': absoluteUrl(`/pl${normalized}`),
  }
  for (const locale of locales) {
    languages[locale] = absoluteUrl(`/${locale}${normalized}`)
  }
  return languages
}

type PageMetaInput = {
  locale: Locale
  path?: string
  title: string
  description: string
  keywords?: string[]
  noIndex?: boolean
  ogImageAlt?: string
  ogImage?: string
  absoluteTitle?: boolean
}

export function buildPageMetadata({
  locale,
  path = '',
  title,
  description,
  keywords = [],
  noIndex = false,
  ogImageAlt,
  ogImage = OG_IMAGE,
  absoluteTitle = true,
}: PageMetaInput): Metadata {
  const normalized = path === '/' ? '' : path.startsWith('/') ? path : `/${path}`
  const url = absoluteUrl(`/${locale}${normalized}`)
  const ogLocale = localeToOgLocale[locale]
  const alternateLocales = locales
    .filter((code) => code !== locale)
    .map((code) => localeToOgLocale[code])
  const imageUrl = ogImage.startsWith('http') ? ogImage : absoluteUrl(ogImage)

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    keywords: keywords.length ? keywords : undefined,
    applicationName: SITE_NAME,
    authors: [{ name: SITE_NAME, url: absoluteUrl('/') }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    category: 'automotive',
    referrer: 'origin-when-cross-origin',
    alternates: {
      canonical: url,
      languages: languageAlternates(normalized),
    },
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      title,
      description,
      url,
      locale: ogLocale,
      alternateLocale: alternateLocales,
      images: [
        {
          url: imageUrl,
          width: OG_IMAGE_WIDTH,
          height: OG_IMAGE_HEIGHT,
          alt: ogImageAlt ?? title,
          type: 'image/png',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [
        {
          url: imageUrl,
          width: OG_IMAGE_WIDTH,
          height: OG_IMAGE_HEIGHT,
          alt: ogImageAlt ?? title,
        },
      ],
    },
    robots: noIndex
      ? { index: false, follow: true }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
            'max-video-preview': -1,
          },
        },
    other: {
      'geo.region': 'PL-MZ',
      'geo.placename': 'Warszawa',
      'geo.position': '52.2297;21.0122',
      ICBM: '52.2297, 21.0122',
    },
  }
}
