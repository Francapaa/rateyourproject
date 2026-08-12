import type { Metadata } from 'next'
import { Hero } from '@/components/landing/Hero'
import { HowItWorks } from '@/components/landing/HowItWorks'
import { Dimensions } from '@/components/landing/Dimensions'
import { Roles } from '@/components/landing/Roles'
import { SeniorityLevels } from '@/components/landing/SeniorityLevels'
import { FAQSection } from '@/components/landing/FAQSection'
import { CTA } from '@/components/landing/CTA'
import { Navbar } from '@/components/landing/Navbar'

export const metadata: Metadata = {
  title: {
    absolute: 'Evaluate the hireability of your project | RateYourProject',
  },
  description: 'Discover how your project compares to what companies really look for. Free evaluation across 6 dimensions: Architecture, Code Quality, Testing, Documentation, Deploy and Best Practices.',
  openGraph: {
    title: 'RateYourProject — Evaluate the hireability of your project',
    description: 'Discover how your project compares to what companies really look for. Free evaluation across 6 dimensions.',
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
      <FAQSection />
      <CTA />
    </main>
  )
}
