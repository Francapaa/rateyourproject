'use client'

import Link from 'next/link'
import { GoogleIcon } from '@/components/ui/GoogleIcon'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const handleGoogleLogin = async () => {
    const supabase = createClient()
    const redirectUrl = `${window.location.origin}/auth/callback`

    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
      },
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-950 bg-grid px-6">
      <div className="absolute inset-0 bg-gradient-to-b from-surface-950 via-transparent to-surface-950 pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-3 mb-8">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6 text-accent">
              <polygon points="12,2 22,8.5 22,15.5 12,22 2,15.5 2,8.5" />
            </svg>
            <span className="font-display font-700 text-lg tracking-tight">
              RateYourProject
            </span>
          </Link>

          <h1 className="font-display font-700 text-3xl md:text-4xl">
            Bienvenido
          </h1>
            <p className="mt-3 text-muted text-sm leading-relaxed">
            Inicia sesion para continuar con tus analisis
          </p>
        </div>

        <div className="p-8 rounded-2xl bg-surface-900 border border-surface-700/50">
          <button
            onClick={handleGoogleLogin}
            className="
              w-full flex items-center justify-center gap-3
              px-6 py-3 bg-accent text-surface-950
              font-body font-semibold text-sm rounded-lg
              transition-all duration-300
              hover:bg-accent-light hover:shadow-lg hover:shadow-accent/20
            "
          >
            <GoogleIcon />
            Continuar con Google
          </button>

          <div className="mt-6 text-center">
            <p className="text-xs text-muted">
              Al continuar, aceptas nuestros{' '}
              <a href="#" className="text-accent/80 hover:text-accent underline underline-offset-2">
                Terminos de servicio
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
