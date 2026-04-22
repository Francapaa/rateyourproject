import { ROLES } from '@/const/roles'

const roleStyles = [
  { gradient: 'from-amber-500/10 to-orange-500/10', border: 'hover:border-amber-500/40', accent: 'text-amber-400' },
  { gradient: 'from-emerald-500/10 to-teal-500/10', border: 'hover:border-emerald-500/40', accent: 'text-emerald-400' },
  { gradient: 'from-blue-500/10 to-indigo-500/10', border: 'hover:border-blue-500/40', accent: 'text-blue-400' },
]

export function Roles() {
  return (
    <section id="roles" className="relative py-24 md:py-32 bg-surface-950">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16 md:mb-20">
          <span className="text-xs text-accent font-body tracking-[0.2em] uppercase">
            Specialization
          </span>
          <h2 className="mt-4 font-display font-700 text-3xl md:text-4xl lg:text-5xl text-balance">
            Evaluation by role
          </h2>
          <p className="mt-4 text-muted max-w-2xl mx-auto leading-relaxed">
            Each discipline has its own criteria. Your analysis adapts
            to the role you choose, evaluating what really matters.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ROLES.map((role, i) => {
            const style = roleStyles[i]
            return (
              <div
                key={role.title}
                className={`group relative p-8 rounded-2xl bg-surface-900 border border-surface-700/50 transition-all duration-500`}
              >
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                <div className="relative z-10">
                  <h3 className={`font-display font-700 text-2xl mb-4`}>
                    {role.title}
                  </h3>
                  <p className="text-muted-light text-sm leading-relaxed mb-6">
                    {role.description}
                  </p>

                  <div className="pt-5 border-t border-surface-700/50">
                    <span className="text-xs text-muted tracking-wide uppercase">
                      Skills evaluated
                    </span>
                    <p className="mt-2 text-sm text-muted-light font-body">
                      {role.skills}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}