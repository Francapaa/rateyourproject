import type { Metadata } from 'next'
import { LoginClient } from './_LoginClient'

export const metadata: Metadata = {
  title: 'Sign in',
  description: 'Sign in to RateYourProject with your Google account to analyze the hireability of your projects.',
  openGraph: {
    title: 'Sign in — RateYourProject',
    description: 'Sign in with your Google account to analyze your projects.',
  },
}

export default function LoginPage() {
  return <LoginClient />
}
