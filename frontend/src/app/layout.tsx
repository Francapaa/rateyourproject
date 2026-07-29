import type { Metadata } from 'next'
import {Analytics} from '@vercel/analytics/next'; 
import { Bricolage_Grotesque, Instrument_Sans } from 'next/font/google'
import { AuthProvider } from '@/contexts/AuthContext'
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
    default: 'RateYourProject — Evaluá la hireabilidad de tu proyecto',
    template: '%s | RateYourProject',
  },
  description: 'Subí tu proyecto, elegí tu rol y seniority, y recibí una evaluación hexagonal de hireabilidad basada en 6 dimensiones clave.',
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }, { url: '/favicon.ico', sizes: 'any' }],
  },
  openGraph: {
    type: 'website',
    siteName: 'RateYourProject',
    title: 'RateYourProject — Evaluá la hireabilidad de tu proyecto',
    description: 'Subí tu proyecto, elegí tu rol y seniority, y recibí una evaluación hexagonal de hireabilidad basada en 6 dimensiones clave.',
    url: SITE_URL,
    locale: 'es_AR',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RateYourProject — Evaluá la hireabilidad de tu proyecto',
    description: 'Subí tu proyecto, elegí tu rol y seniority, y recibí una evaluación hexagonal de hireabilidad basada en 6 dimensiones clave.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: SITE_URL,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`${bricolage.variable} ${instrument.variable}`}>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
