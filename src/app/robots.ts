import type { MetadataRoute } from 'next'
import { absoluteUrl, SITE_URL } from './seo'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/'],
      },
      {
        userAgent: 'GPTBot',
        allow: ['/llms.txt', '/'],
        disallow: ['/api/'],
      },
      {
        userAgent: 'Google-Extended',
        allow: ['/llms.txt', '/'],
        disallow: ['/api/'],
      },
    ],
    sitemap: absoluteUrl('/sitemap.xml'),
    host: SITE_URL,
  }
}
