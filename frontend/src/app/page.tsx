import { Hero } from '@/components/landing/Hero'
import { HowItWorks } from '@/components/landing/HowItWorks'
import { Dimensions } from '@/components/landing/Dimensions'
import { Roles } from '@/components/landing/Roles'
import { SeniorityLevels } from '@/components/landing/SeniorityLevels'
import { CTA } from '@/components/landing/CTA'
import { Navbar } from '@/components/landing/Navbar'

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
