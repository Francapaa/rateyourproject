import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'RateYourProject — Evaluate the hireability of your project',
    short_name: 'RateYourProject',
    description:
      'Upload your project and get an AI-powered hireability evaluation across 6 key dimensions.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0a0a0b',
    theme_color: '#0a0a0b',
    icons: [
      { src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml' },
      { src: '/apple-touch-icon.svg', sizes: '180x180', type: 'image/svg+xml' },
    ],
  }
}