import Link from 'next/link'
import { HexagonGraphic } from './HexagonGraphic'

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-surface-950 bg-grid">
      <div className="absolute inset-0 bg-gradient-to-b from-surface-950 via-transparent to-surface-950 pointer-events-none" />

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 md:py-32 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
        <div className="flex-1 text-center lg:text-left">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent/20 bg-accent/5 mb-8"
            style={{ animationDelay: '0.1s' }}
          >
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-xs text-accent font-body tracking-wider uppercase">
              Technical evaluation in minutes
            </span>
          </div>

          <h1
            className="font-display font-800 text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.05] text-balance"
            style={{ animationDelay: '0.2s' }}
          >
            How{' '}
            <span className="text-accent relative">
              hireable
              <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-accent/30" />
            </span>{' '}
            is your project?
          </h1>

          <p
            className="mt-6 md:mt-8 text-base md:text-lg text-muted max-w-xl mx-auto lg:mx-0 leading-relaxed"
            style={{ animationDelay: '0.3s' }}
          >
            Upload your project .ZIP, choose your role and experience level, and receive a
            hexagonal evaluation that shows exactly where you stand and
            what to improve.
          </p>

          <div
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            style={{ animationDelay: '0.4s' }}
          >
            <Link
              href="/login"
              className="group relative px-8 py-4 bg-accent text-surface-950 font-body font-semibold text-sm tracking-wide rounded-lg overflow-hidden transition-all duration-300 hover:bg-accent-light hover:shadow-lg hover:shadow-accent/20"
            >
              <span className="relative z-10">Start analysis</span>
            </Link>

            <Link
              href="#how-it-works"
              className="px-8 py-4 border border-surface-600 text-muted-light font-body font-medium text-sm tracking-wide rounded-lg transition-all duration-300 hover:border-accent/40 hover:text-accent"
            >
              How it works
            </Link>
          </div>
        </div>

        <div
          className="flex-shrink-0"
          style={{ animationDelay: '0.3s' }}
        >
          <HexagonGraphic />
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted text-xs tracking-widest uppercase">
        <span>Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-accent/40 to-transparent" />
      </div>
    </section>
  )
}