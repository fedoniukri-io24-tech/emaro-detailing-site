import type { Metadata } from 'next'
import NotFoundContent from '../components/NotFoundContent'
import { getDictionarySync } from '../../i18n/getDictionary'
import { defaultLocale } from '../../i18n/config'
import { buildPageMetadata } from '../lib/pageMetadata'

const dict = getDictionarySync(defaultLocale)

export const metadata: Metadata = buildPageMetadata({
  locale: defaultLocale,
  title: dict.notFound.metaTitle,
  description: dict.notFound.metaDescription,
  keywords: dict.seo.keywords,
  ogImageAlt: dict.seo.ogImageAlt,
  noIndex: true,
  absoluteTitle: true,
})

export default function LocaleNotFound() {
  return <NotFoundContent />
}
