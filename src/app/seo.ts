import { BRAND } from './brand'

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ?? 'https://emaroautocare.pl'

export const SITE_NAME = BRAND.name

export const OG_IMAGE = '/images/emaro/hero-desktop.png'
export const OG_IMAGE_WIDTH = 1200
export const OG_IMAGE_HEIGHT = 630
export const SCHEMA_LOGO = '/images/emaro/logo.png'

export function absoluteUrl(path = '/') {
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${SITE_URL}${normalized}`
}

export function phoneTel(phone: string) {
  return phone.replace(/[^\d+]/g, '')
}

export const SAME_AS = BRAND.instagram ? [BRAND.instagram] : []
