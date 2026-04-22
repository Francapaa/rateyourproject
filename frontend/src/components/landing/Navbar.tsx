'use client'

import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'

export function Navbar() {
  const { user, signOut } = useAuth()

  return (
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

        <nav className="hidden md:flex items-center gap-8">
          <a href="#how-it-works" className="text-sm text-muted-light hover:text-accent transition-colors">
            How it works
          </a>
          <a href="#dimensions" className="text-sm text-muted-light hover:text-accent transition-colors">
            Dimensions
          </a>
          <a href="#roles" className="text-sm text-muted-light hover:text-accent transition-colors">
            Roles
          </a>
        </nav>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="px-5 py-2 bg-accent text-surface-950 font-body font-semibold text-sm rounded-lg hover:bg-accent-light transition-colors"
              >
                Dashboard
              </Link>
              <button
                onClick={signOut}
                className="px-5 py-2 text-muted-light font-body font-medium text-sm rounded-lg border border-surface-700/50 hover:text-accent hover:border-accent/50 transition-colors"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="px-5 py-2 bg-accent text-surface-950 font-body font-semibold text-sm rounded-lg hover:bg-accent-light transition-colors"
            >
              Get started
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}