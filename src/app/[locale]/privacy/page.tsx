import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import PrivacyContent from '../../components/PrivacyContent'
import { getDictionary } from '../../../i18n/getDictionary'
import { isLocale, type Locale } from '../../../i18n/config'
import { buildPageMetadata } from '../../lib/pageMetadata'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  if (!isLocale((await params).locale)) return {}
  const locale = (await params).locale as Locale
  const dict = await getDictionary(locale)

  return buildPageMetadata({
    locale,
    path: '/privacy',
    title: dict.privacy.metaTitle,
    description: dict.privacy.metaDescription,
    noIndex: false,
  })
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const locale = (isLocale((await params).locale) ? (await params).locale : 'pl') as Locale
  const dict = await getDictionary(locale)

  return (
    <>
      <Navbar />
      <main id="main-content">
        <PrivacyContent dict={dict} locale={locale} />
      </main>
      <Footer />
    </>
  )
}
