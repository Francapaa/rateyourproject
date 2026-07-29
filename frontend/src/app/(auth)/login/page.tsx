import type { Metadata } from 'next'
import { LoginClient } from './_LoginClient'

export const metadata: Metadata = {
  title: 'Iniciar sesión',
  description: 'Accedé a RateYourProject con tu cuenta de Google para analizar la hireabilidad de tus proyectos.',
  openGraph: {
    title: 'Iniciar sesión — RateYourProject',
    description: 'Accedé con tu cuenta de Google para analizar tus proyectos.',
  },
}

export default function LoginPage() {
  return <LoginClient />
}
