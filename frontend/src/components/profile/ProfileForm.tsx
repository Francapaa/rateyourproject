'use client'

import { useProfile } from '@/hooks/useProfile'
import { ROLES } from '@/const/roles'
import { SENIORITY_LEVELS } from '@/const/seniority'

export function ProfileForm() {
  const {
    profile,
    form,
    isLoading,
    isSaving,
    error,
    isSuccess,
    setField,
    handleSave,
  } = useProfile()

  const hasChanges =
    profile?.role !== form.role || profile?.seniority !== form.seniority

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="p-6 rounded-2xl bg-surface-900 border border-surface-700/50 animate-pulse">
          <div className="h-6 bg-surface-700 rounded w-1/4 mb-6" />
          <div className="space-y-4">
            <div className="h-10 bg-surface-700 rounded w-full" />
            <div className="h-10 bg-surface-700 rounded w-full" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <section className="p-6 rounded-2xl bg-surface-900 border border-surface-700/50">
        <h2 className="font-display font-600 text-lg text-white mb-6">
          About you
        </h2>
        <div className="flex items-center gap-4">
          {profile?.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={profile.name || profile.email}
              className="w-16 h-16 rounded-full"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-surface-700 flex items-center justify-center">
              <span className="text-xl font-body font-semibold text-muted-light">
                {(profile?.name || profile?.email || 'U')[0].toUpperCase()}
              </span>
            </div>
          )}
          <div>
            <p className="font-body font-semibold text-white">
              {profile?.name || 'Sin nombre'}
            </p>
            <p className="text-sm text-muted">{profile?.email}</p>
          </div>
        </div>
      </section>

      <section className="p-6 rounded-2xl bg-surface-900 border border-surface-700/50">
        <h2 className="font-display font-600 text-lg text-white mb-6">
          Settings
        </h2>

        <div className="space-y-6">
          <div>
            <label
              htmlFor="role-select"
              className="block text-sm font-body font-medium text-muted-light mb-2"
            >
              Role
            </label>
            <select
              id="role-select"
              value={form.role}
              onChange={(e) => setField('role', e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-surface-800 border border-surface-600/50 text-white font-body text-sm focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-colors appearance-none cursor-pointer"
            >
              <option value="" disabled>
                Select your role
              </option>
              {ROLES.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="seniority-select"
              className="block text-sm font-body font-medium text-muted-light mb-2"
            >
              Seniority
            </label>
            <select
              id="seniority-select"
              value={form.seniority}
              onChange={(e) => setField('seniority', e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-surface-800 border border-surface-600/50 text-white font-body text-sm focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-colors appearance-none cursor-pointer"
            >
              <option value="" disabled>
                Select your seniority
              </option>
              {SENIORITY_LEVELS.map((level) => (
                <option key={level.value} value={level.value}>
                  {level.level} ({level.range})
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <div className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {isSuccess && (
          <div className="mt-6 p-4 rounded-xl bg-green-500/10 border border-green-500/30">
            <p className="text-sm text-green-400">Perfil actualizado correctamente.</p>
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSave}
            disabled={!hasChanges || isSaving || !form.role || !form.seniority}
            className="px-6 py-3 bg-accent text-surface-950 font-body font-semibold text-sm rounded-lg transition-all duration-300 hover:bg-accent-light hover:shadow-lg hover:shadow-accent/20 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none"
          >
            {isSaving ? 'Saving...' : 'Save changes'}
          </button>
        </div>
      </section>
    </div>
  )
}
