import type { Metadata, Viewport } from 'next'
import { Bricolage_Grotesque, Instrument_Sans } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { AuthProvider } from '@/contexts/AuthContext'
import { JsonLd } from '@/components/seo/JsonLd'
import { SITE_URL } from '@/lib/site'
import './globals.css'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-bricolage',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
})

const instrument = Instrument_Sans({
  subsets: ['latin'],
  variable: '--font-instrument',
  weight: ['400', '500', '600'],
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'RateYourProject — Evaluate the hireability of your project',
    template: '%s | RateYourProject',
  },
  description: 'Upload your project, choose your role and seniority, and get a hexagonal hireability evaluation based on 6 key dimensions.',
  keywords: [
    'hireability evaluation',
    'code evaluation',
    'developer portfolio evaluation',
    'AI code analysis',
    'code review tool',
    'software engineer interview prep',
    'github project evaluation',
  ],
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }, { url: '/favicon.ico', sizes: 'any' }],
    apple: [{ url: '/apple-touch-icon.svg', sizes: '180x180', type: 'image/svg+xml' }],
  },
  openGraph: {
    type: 'website',
    siteName: 'RateYourProject',
    title: 'RateYourProject — Evaluate the hireability of your project',
    description: 'Upload your project, choose your role and seniority, and get a hexagonal hireability evaluation based on 6 key dimensions.',
    url: SITE_URL,
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RateYourProject — Evaluate the hireability of your project',
    description: 'Upload your project, choose your role and seniority, and get a hexagonal hireability evaluation based on 6 key dimensions.',
  },
  alternates: {
    canonical: SITE_URL,
  },
}

export const viewport: Viewport = {
  themeColor: '#0a0a0b',
}

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'RateYourProject',
  url: SITE_URL,
  description: 'AI-powered hireability evaluation for software projects.',
  logo: `${SITE_URL}/favicon.svg`,
  sameAs: [
    'https://github.com/Francapaa/rateyourproject',
    'https://www.linkedin.com/in/francisco-caparruva-6711a82a2/',
    'https://x.com/FCapaa',
  ],
}

const webApplicationSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'RateYourProject',
  url: SITE_URL,
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Web',
  description: 'Upload your project and get an AI-powered hireability evaluation across 6 key dimensions.',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  publisher: {
    '@type': 'Organization',
    name: 'RateYourProject',
    url: SITE_URL,
    logo: { '@type': 'ImageObject', url: `${SITE_URL}/favicon.svg` },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${bricolage.variable} ${instrument.variable}`}>
      <body>
        {SUPABASE_URL && (
          <>
            <link rel="preconnect" href={SUPABASE_URL} crossOrigin="anonymous" />
            <link rel="dns-prefetch" href={SUPABASE_URL} />
          </>
        )}
        <AuthProvider>
          <JsonLd data={organizationSchema} />
          <JsonLd data={webApplicationSchema} />
          {children}
        </AuthProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}