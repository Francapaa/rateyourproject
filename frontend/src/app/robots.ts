import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site'

const PUBLIC = ['/', '/blog', '/login']
const PRIVATE = ['/dashboard', '/profile', '/chat']

const crawlerRule = (userAgent: string) => ({
  userAgent,
  allow: PUBLIC,
  disallow: PRIVATE,
})

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      crawlerRule('*'),
      crawlerRule('Googlebot'),
      crawlerRule('Google-Extended'),
      crawlerRule('GPTBot'),
      crawlerRule('ChatGPT-User'),
      crawlerRule('OAI-SearchBot'),
      crawlerRule('ClaudeBot'),
      crawlerRule('PerplexityBot'),
      crawlerRule('CCBot'),
      crawlerRule('Bytespider'),
      crawlerRule('Applebot'),
      crawlerRule('Google-InspectionTool'),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}