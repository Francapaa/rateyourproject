import Link from 'next/link'

export function CTA() {
  return (
    <section className="relative py-24 md:py-32 bg-surface-950">
      <div className="absolute inset-0 bg-grid opacity-30" />

      <div className="absolute inset-0 bg-gradient-to-t from-accent/5 via-transparent to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-surface-800 border border-surface-700/50 mb-8">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10 text-accent">
            <polygon points="12,2 22,8.5 22,15.5 12,22 2,15.5 2,8.5" />
            <line x1="12" y1="2" x2="12" y2="22" />
            <line x1="2" y1="8.5" x2="22" y2="8.5" />
            <line x1="2" y1="15.5" x2="22" y2="15.5" />
          </svg>
        </div>

        <h2 className="font-display font-700 text-3xl md:text-4xl lg:text-5xl text-balance">
          Evaluate your project{' '}
          <span className="text-accent">now</span>
        </h2>

        <p className="mt-5 text-muted max-w-xl mx-auto leading-relaxed text-base md:text-lg">
          Do not wait until they ask you in an interview. Find out today
          where you stand and what you can improve.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/login"
            className="group relative px-10 py-4 bg-accent text-surface-950 font-body font-semibold text-sm tracking-wide rounded-lg overflow-hidden transition-all duration-300 hover:bg-accent-light hover:shadow-lg hover:shadow-accent/20"
          >
            <span className="relative z-10">Start for free</span>
          </Link>
        </div>
      </div>
    </section>
  )
}