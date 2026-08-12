import type { Metadata } from 'next'
import { DashboardContent } from '@/components/dashboard/DashboardContent'

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Manage your hireability analyses and review your evaluated project history.',
  robots: { index: false, follow: false },
}

export default async function DashboardPage() {
  return (
    <div className="min-h-screen bg-surface-950 bg-grid">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-10">
          <h1 className="font-display font-700 text-3xl md:text-4xl text-white">
            Dashboard
          </h1>
          <p className="mt-2 text-muted text-sm">
          Manage your project analyses.
          </p>
        </div>

        <DashboardContent />
      </div>
    </div>
  )
}
