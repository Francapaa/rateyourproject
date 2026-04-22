'use client'

interface ImprovementsListProps {
  improvements: string[]
}

export function ImprovementsList({ improvements }: ImprovementsListProps) {
  if (!improvements || improvements.length === 0) {
    return null
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1 h-4 bg-accent rounded-full" />
        <h3 className="font-display font-semibold text-white text-sm uppercase tracking-wider">
          Recommended improvements
        </h3>
      </div>

      <div className="space-y-2">
        {improvements.map((improvement, index) => (
          <div
            key={index}
            className="group relative flex items-start gap-3 p-3 rounded-lg bg-surface-900/50 border border-surface-700/30 hover:border-accent/40 transition-all duration-300 hover:bg-surface-900"
          >
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center">
              <span className="text-[10px] font-display font-bold text-accent">
                {index + 1}
              </span>
            </div>
            <p className="text-sm text-muted leading-relaxed group-hover:text-white transition-colors">
              {improvement}
            </p>
            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-accent/0 via-accent/5 to-accent/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          </div>
        ))}
      </div>
    </div>
  )
}