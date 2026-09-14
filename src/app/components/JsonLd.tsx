import { BRAND } from '../brand'
import type { Dictionary } from '../../i18n/types'
import type { Locale } from '../../i18n/config'
import { localeHtmlLang } from '../../i18n/config'
import {
  OG_IMAGE,
  SAME_AS,
  SCHEMA_LOGO,
  SITE_NAME,
  SITE_URL,
  absoluteUrl,
  phoneTel,
} from '../seo'

function JsonLdScript({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

type Props = {
  locale: Locale
  dict: Dictionary
}

export default function JsonLd({ locale, dict }: Props) {
  const lang = localeHtmlLang[locale]
  const pageUrl = absoluteUrl(`/${locale}`)

  const organization = {
    '@context': 'https://schema.org',
    '@type': 'AutoDetailing',
    '@id': `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      url: absoluteUrl(SCHEMA_LOGO),
    },
    image: absoluteUrl(OG_IMAGE),
    description: dict.seo.defaultDescription,
    email: BRAND.email,
    telephone: phoneTel(BRAND.phone),
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Warszawa',
      addressRegion: 'Mazowieckie',
      addressCountry: 'PL',
    },
    areaServed: {
      '@type': 'GeoCircle',
      geoMidpoint: {
        '@type': 'GeoCoordinates',
        latitude: 52.2297,
        longitude: 21.0122,
      },
      geoRadius: '50000',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: phoneTel(BRAND.phone),
      contactType: 'customer service',
      email: BRAND.email,
      areaServed: ['PL'],
      availableLanguage: ['Polish', 'Ukrainian'],
    },
    priceRange: '$$',
    currenciesAccepted: 'PLN',
    sameAs: [...SAME_AS],
  }

  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    alternateName: BRAND.shortName,
    description: dict.seo.defaultDescription,
    publisher: { '@id': `${SITE_URL}/#organization` },
    inLanguage: ['pl', 'uk'],
  }

  const webPage = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${pageUrl}/#webpage`,
    url: pageUrl,
    name: dict.seo.defaultTitle,
    description: dict.seo.defaultDescription,
    isPartOf: { '@id': `${SITE_URL}/#website` },
    about: { '@id': `${SITE_URL}/#organization` },
    inLanguage: lang,
    primaryImageOfPage: absoluteUrl(OG_IMAGE),
  }

  const services = Object.values(dict.services.items).map((item) => ({
    '@type': 'Offer',
    itemOffered: {
      '@type': 'Service',
      name: item.title,
      description: item.description,
      provider: { '@id': `${SITE_URL}/#organization` },
      areaServed: 'Warszawa i okolice',
    },
    priceSpecification: {
      '@type': 'PriceSpecification',
      priceCurrency: 'PLN',
      description: item.price,
    },
  }))

  const offerCatalog = {
    '@context': 'https://schema.org',
    '@type': 'OfferCatalog',
    name: dict.services.titleBefore + dict.services.titleEm,
    itemListElement: services,
  }

  return (
    <>
      <JsonLdScript data={organization} />
      <JsonLdScript data={website} />
      <JsonLdScript data={webPage} />
      <JsonLdScript data={offerCatalog} />
    </>
  )
}
