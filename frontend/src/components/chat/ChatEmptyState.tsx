export function ChatEmptyState() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-surface-800 border border-surface-700/50 mb-6">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 text-accent">
            <polygon points="12,2 22,8.5 22,15.5 12,22 2,15.5 2,8.5" />
          </svg>
        </div>
        <h2 className="font-display font-600 text-xl text-white mb-2">
          ¿En qué puedo ayudarte?
        </h2>
        <p className="text-muted text-sm max-w-sm">
          Escribí tu consulta sobre tu proyecto y te ayudo a evaluarlo.
        </p>
      </div>
    </div>
  )
}
