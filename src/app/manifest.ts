import type { MetadataRoute } from 'next'
import { BRAND } from './brand'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: BRAND.name,
    short_name: BRAND.shortName,
    description: 'Emaro Premium Auto Care — więcej niż czyste auto. Mobilny detailing w Warszawie.',
    start_url: '/pl',
    id: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait-primary',
    background_color: '#FFFFFF',
    theme_color: '#0a0a0a',
    lang: 'pl',
    dir: 'ltr',
    categories: ['business', 'automotive'],
    icons: [
      {
        src: '/images/emaro/logo.png',
        sizes: '500x500',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/images/emaro/logo.png',
        sizes: '500x500',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    related_applications: [],
    prefer_related_applications: false,
  }
}
