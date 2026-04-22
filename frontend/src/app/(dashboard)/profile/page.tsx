import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ProfileForm } from '@/components/profile/ProfileForm'

export default async function ProfilePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-surface-950 bg-grid">
      <div className="max-w-2xl mx-auto px-6 py-12">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm font-body font-medium text-muted hover:text-accent transition-colors mb-10"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
            <path d="M19 12H5" />
            <path d="m12 19-7-7 7-7" />
          </svg>
          Back to dashboard
        </Link>

        <div className="mb-10">
          <h1 className="font-display font-700 text-3xl md:text-4xl text-white">
            Profile
          </h1>
          <p className="mt-2 text-muted text-sm">
            Set up your role and seniority to obtain a detailed analysis.
          </p>
        </div>

        <ProfileForm />
      </div>
    </div>
  )
}
