import type { Metadata } from 'next'
import { Bricolage_Grotesque, Instrument_Sans } from 'next/font/google'
import { AuthProvider } from '@/contexts/AuthContext'
import { JsonLd } from '@/components/seo/JsonLd'
import './globals.css'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://rateyourproject.com'

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
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RateYourProject — Evaluate the hireability of your project',
    description: 'Upload your project, choose your role and seniority, and get a hexagonal hireability evaluation based on 6 key dimensions.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: SITE_URL,
  },
}

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'RateYourProject',
  url: SITE_URL,
  description: 'AI-powered hireability evaluation for software projects.',
  logo: `${SITE_URL}/favicon.svg`,
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
        <AuthProvider>
          <JsonLd data={organizationSchema} />
          <JsonLd data={webApplicationSchema} />
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}