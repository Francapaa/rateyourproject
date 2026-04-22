import { DIMENSIONS } from '@/const/dimensions'

const dimensionIcons = [
  <svg key="architecture" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>,
  <svg key="code" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
    <polyline points="16,18 22,12 16,6" strokeLinecap="round" strokeLinejoin="round" />
    <polyline points="8,6 2,12 8,18" strokeLinecap="round" strokeLinejoin="round" />
  </svg>,
  <svg key="testing" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
    <path d="M9 11l3 3L22 4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" strokeLinecap="round" strokeLinejoin="round" />
  </svg>,
  <svg key="docs" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <polyline points="14,2 14,8 20,8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </svg>,
  <svg key="deploy" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>,
  <svg key="practices" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>,
]

export function Dimensions() {
  return (
    <section id="dimensions" className="relative py-24 md:py-32 bg-surface-900">
      <div className="absolute inset-0 bg-grid opacity-50" />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div className="text-center mb-16 md:mb-20">
          <span className="text-xs text-accent font-body tracking-[0.2em] uppercase">
            Metrics
          </span>
          <h2 className="mt-4 font-display font-700 text-3xl md:text-4xl lg:text-5xl text-balance">
            Six dimensions. Complete vision.
          </h2>
          <p className="mt-4 text-muted max-w-2xl mx-auto leading-relaxed">
            Each evaluation analyzes your project across six key areas that
            determine its technical quality and your readiness level.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {DIMENSIONS.map((dim, i) => (
            <div
              key={dim.name}
              className="group relative p-6 rounded-xl bg-surface-950/80 border border-surface-700/30 backdrop-blur-sm transition-all duration-500 hover:border-accent/30 hover:-translate-y-1"
            >
              <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10">
                <div className="w-12 h-12 rounded-lg bg-surface-800 border border-surface-600/50 flex items-center justify-center text-accent/70 group-hover:text-accent group-hover:border-accent/30 transition-all duration-300 mb-5">
                  {dimensionIcons[i]}
                </div>

                <h3 className="font-display font-600 text-lg mb-2">
                  {dim.name}
                </h3>
                <p className="text-muted-light text-sm leading-relaxed">
                  {dim.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}