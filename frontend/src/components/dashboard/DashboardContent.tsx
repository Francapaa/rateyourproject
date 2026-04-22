'use client'

import Link from 'next/link'
import { ConversationList } from '@/components/dashboard/ConversationList'
import { EmptyConversations } from '@/components/dashboard/EmptyConversations'
import { NewConversationButton } from '@/components/dashboard/NewConversationButton'
import { useConversations } from '@/hooks/useConversations'
import { useProfile } from '@/hooks/useProfile'

export function DashboardContent() {
  const { conversations, isLoading, error } = useConversations()
  const { profile: profileData, isLoading: profileLoading } = useProfile()

  const hasConversations = conversations.length > 0
  const hasProfileConfigured = profileData?.role && profileData?.seniority

  return (
    <div className="max-w-2xl mx-auto">
      {!profileLoading && !hasProfileConfigured && (
        <div className="mb-8 p-6 rounded-2xl bg-accent/5 border border-accent/20">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-accent">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4" />
                <path d="M12 8h.01" />
              </svg>
            </div>
            <div>
              <h3 className="font-body font-semibold text-white text-sm">
                Set up your profile
              </h3>
              <p className="mt-1 text-sm text-muted leading-relaxed">
                You need select your role and years of experience.
              </p>
              <Link
                href="/profile"
                className="mt-3 inline-flex items-center gap-2 text-sm font-body font-semibold text-accent hover:text-accent-light transition-colors"
              >
                Ir al perfil
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      )}

      <section className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display font-700 text-2xl text-white">
            Recent analysis
          </h2>
          {hasConversations && (
            <span className="text-xs text-muted font-body">
              {conversations.length} {conversations.length === 1 ? 'analyse' : 'analysis'}
            </span>
          )}
        </div>

        {isLoading && (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-surface-900 border border-surface-700/50 animate-pulse"
              >
                <div className="h-4 bg-surface-700 rounded w-3/4" />
                <div className="h-3 bg-surface-700 rounded w-1/4 mt-2" />
              </div>
            ))}
          </div>
        )}

        {error && !isLoading && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30">
            <p className="text-sm text-red-400">
              Error al cargar las conversaciones. Intentá de nuevo más tarde.
            </p>
          </div>
        )}

        {!isLoading && !error && hasConversations && (
          <ConversationList conversations={conversations} />
        )}

        {!isLoading && !error && !hasConversations && <EmptyConversations />}
      </section>

      <NewConversationButton disabled={!hasProfileConfigured} />
    </div>
  )
}
