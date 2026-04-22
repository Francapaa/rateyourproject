import { SENIORITY_LEVELS } from '@/const/seniority'

export function SeniorityLevels() {
  return (
    <section className="relative py-24 md:py-32 bg-surface-900 overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div className="text-center mb-16 md:mb-20">
          <span className="text-xs text-accent font-body tracking-[0.2em] uppercase">
            Levels
          </span>
          <h2 className="mt-4 font-display font-700 text-3xl md:text-4xl lg:text-5xl text-balance">
            Adapts to your seniority
          </h2>
          <p className="mt-4 text-muted max-w-2xl mx-auto leading-relaxed">
            Evaluating a junior project is not the same as a lead one. Criteria
            change based on your experience level to give you relevant feedback.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {SENIORITY_LEVELS.map((item, i) => (
            <div
              key={item.level}
              className="group relative p-7 rounded-xl bg-surface-950/80 border border-surface-700/30 transition-all duration-500 hover:border-accent/30 hover:bg-surface-800/60"
            >
              <div className="flex items-start gap-5">
                <div className="flex-shrink-0 w-14 h-14 rounded-lg bg-surface-800 border border-surface-600/50 flex items-center justify-center">
                  <span className="font-display font-700 text-accent text-lg">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-display font-600 text-lg">
                      {item.level}
                    </h3>
                    <span className="text-xs text-muted font-body px-2 py-0.5 rounded-full bg-surface-800 border border-surface-700/50">
                      {item.range}
                    </span>
                  </div>

                  <p className="text-muted-light text-sm leading-relaxed mb-4">
                    {item.description}
                  </p>

                  <ul className="space-y-1.5">
                    {item.expectations.map((exp) => (
                      <li
                        key={exp}
                        className="flex items-center gap-2 text-xs text-muted-light"
                      >
                        <span className="w-1 h-1 rounded-full bg-accent/60 flex-shrink-0" />
                        {exp}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}