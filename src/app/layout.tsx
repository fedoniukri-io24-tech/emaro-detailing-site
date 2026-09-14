import type { Metadata, Viewport } from 'next'
import { Montserrat } from 'next/font/google'
import { headers } from 'next/headers'
import './globals.css'
import './emaro.css'
import { isLocale, localeHtmlLang, type Locale } from '../i18n/config'
import { absoluteUrl, OG_IMAGE, OG_IMAGE_HEIGHT, OG_IMAGE_WIDTH, SITE_NAME, SITE_URL } from './seo'

const montserrat = Montserrat({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: 'automotive',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: absoluteUrl('/pl'),
    languages: {
      pl: absoluteUrl('/pl'),
      uk: absoluteUrl('/uk'),
      'x-default': absoluteUrl('/pl'),
    },
  },
  openGraph: {
    type: 'website',
    locale: 'pl_PL',
    alternateLocale: ['uk_UA'],
    url: absoluteUrl('/pl'),
    siteName: SITE_NAME,
    images: [
      {
        url: OG_IMAGE,
        width: OG_IMAGE_WIDTH,
        height: OG_IMAGE_HEIGHT,
        alt: SITE_NAME,
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: [OG_IMAGE],
  },
  robots: {
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
  icons: {
    icon: [{ url: '/images/emaro/logo.png', sizes: '500x500', type: 'image/png' }],
    apple: [{ url: '/images/emaro/logo.png', sizes: '500x500', type: 'image/png' }],
  },
  other: {
    'geo.region': 'PL-MZ',
    'geo.placename': 'Warszawa',
  },
}

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
  width: 'device-width',
  initialScale: 1,
  colorScheme: 'light',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const headerLocale = (await headers()).get('x-locale') ?? ''
  const locale: Locale = isLocale(headerLocale) ? headerLocale : 'pl'
  const htmlLang = localeHtmlLang[locale]

  return (
    <html lang={htmlLang}>
      <body className={`emaro ${montserrat.className}`}>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  )
}
