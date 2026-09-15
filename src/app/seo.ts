import { BRAND } from './brand'

const DEFAULT_SITE_URL = 'https://emaroautocare.pl'

function normalizeSiteUrl(raw?: string): string {
  const value = raw?.trim()
  if (!value) return DEFAULT_SITE_URL

  const withProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`

  try {
    return new URL(withProtocol.replace(/\/$/, '')).origin
  } catch {
    return DEFAULT_SITE_URL
  }
}

export const SITE_URL = normalizeSiteUrl(
  process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined),
)

export const SITE_NAME = BRAND.name

export const OG_IMAGE = '/images/emaro/og-share.png'
export const OG_IMAGE_WIDTH = 1200
export const OG_IMAGE_HEIGHT = 630
export const SCHEMA_LOGO = '/images/emaro/logo.png'
export const APPLE_TOUCH_ICON = '/images/emaro/apple-touch-icon.png'

export function getSiteVerification(): {
  google?: string
  yandex?: string
  other?: Record<string, string>
} | undefined {
  const google = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim()
  const yandex = process.env.NEXT_PUBLIC_YANDEX_VERIFICATION?.trim()
  const bing = process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION?.trim()
  if (!google && !yandex && !bing) return undefined
  return {
    ...(google ? { google } : {}),
    ...(yandex ? { yandex } : {}),
    ...(bing ? { other: { 'msvalidate.01': bing } } : {}),
  }
}

export function absoluteUrl(path = '/') {
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${SITE_URL}${normalized}`
}

export function phoneTel(phone: string) {
  return phone.replace(/[^\d+]/g, '')
}

export const SAME_AS = [
  BRAND.instagram,
  BRAND.telegram,
  BRAND.whatsapp,
].filter(Boolean) as string[]
