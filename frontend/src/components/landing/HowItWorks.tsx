import { STEPS } from '@/const/steps'

const stepIcons = [
  <svg key="upload" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
    <path d="M12 16V4m0 0l-4 4m4-4l4 4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4 17v2a1 1 0 001 1h14a1 1 0 001-1v-2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>,
  <svg key="profile" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 4-7 8-7s8 3 8 7" strokeLinecap="round" />
  </svg>,
  <svg key="evaluation" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
    <polygon points="12,2 22,8.5 22,15.5 12,22 2,15.5 2,8.5" />
    <line x1="12" y1="2" x2="12" y2="22" />
    <line x1="2" y1="8.5" x2="22" y2="8.5" />
    <line x1="2" y1="15.5" x2="22" y2="15.5" />
  </svg>,
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-24 md:py-32 bg-surface-950">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16 md:mb-20">
          <span className="text-xs text-accent font-body tracking-[0.2em] uppercase">
            Process
          </span>
          <h2 className="mt-4 font-display font-700 text-3xl md:text-4xl lg:text-5xl text-balance">
            Three steps. No fluff.
          </h2>
          <p className="mt-4 text-muted max-w-2xl mx-auto leading-relaxed">
            From uploading your project to receiving your complete evaluation,
            the process is straightforward and transparent.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 relative">
          <div className="hidden md:block absolute top-16 left-[20%] right-[20%] h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />

          {STEPS.map((step, i) => (
            <div
              key={step.number}
              className="group relative p-8 rounded-2xl bg-surface-900 border border-surface-700/50 transition-all duration-500 hover:border-accent/30 hover:bg-surface-800/80"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="text-accent/60 group-hover:text-accent transition-colors duration-300">
                  {stepIcons[i]}
                </div>
                <span className="font-display font-700 text-4xl text-surface-700 group-hover:text-accent/20 transition-colors duration-300">
                  {step.number}
                </span>
              </div>

              <h3 className="font-display font-600 text-xl mb-3">
                {step.title}
              </h3>
              <p className="text-muted-light text-sm leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}