import type { Metadata } from 'next'
import { Hero } from '@/components/landing/Hero'
import { HowItWorks } from '@/components/landing/HowItWorks'
import { Dimensions } from '@/components/landing/Dimensions'
import { Roles } from '@/components/landing/Roles'
import { SeniorityLevels } from '@/components/landing/SeniorityLevels'
import { CTA } from '@/components/landing/CTA'
import { Navbar } from '@/components/landing/Navbar'

export const metadata: Metadata = {
  title: 'Evaluá la hireabilidad de tu proyecto',
  description: 'Descubrí cómo tu proyecto se compara con lo que buscan las empresas. Evaluación gratuita en 6 dimensiones: Arquitectura, Calidad de Código, Testing, Documentación, Deploy y Buenas Prácticas.',
  openGraph: {
    title: 'RateYourProject — Evaluá la hireabilidad de tu proyecto',
    description: 'Descubrí cómo tu proyecto se compara con lo que buscan las empresas. Evaluación gratuita en 6 dimensiones.',
  },
}

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <HowItWorks />
      <Dimensions />
      <Roles />
      <SeniorityLevels />
      <CTA />
    </main>
  )
}
