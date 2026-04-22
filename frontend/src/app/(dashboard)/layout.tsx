import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-surface-950">
      <header className="fixed top-0 left-0 right-0 z-50 bg-surface-950/80 backdrop-blur-md border-b border-surface-700/30">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6 text-accent">
              <polygon points="12,2 22,8.5 22,15.5 12,22 2,15.5 2,8.5" />
            </svg>
            <span className="font-display font-700 text-lg tracking-tight">
              RateYourProject
            </span>
          </Link>

          {user && (
            <Link
              href="/profile"
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <span className="text-sm text-muted-light hidden sm:block">
                {user.user_metadata?.full_name || user.email}
              </span>
              {user.user_metadata?.avatar_url ? (
                <img
                  src={user.user_metadata.avatar_url}
                  alt={user.user_metadata?.full_name || user.email || 'User'}
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-surface-700 flex items-center justify-center">
                  <span className="text-xs font-body font-semibold text-muted-light">
                    {(user.user_metadata?.full_name || user.email || 'U')[0].toUpperCase()}
                  </span>
                </div>
              )}
            </Link>
          )}
        </div>
      </header>

      <main className="pt-16">{children}</main>
    </div>
  )
}
