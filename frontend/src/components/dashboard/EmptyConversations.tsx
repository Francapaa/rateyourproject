export function EmptyConversations() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 mb-6 rounded-full bg-surface-800 flex items-center justify-center">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 text-muted">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </div>
      <h3 className="font-display font-600 text-lg text-white">
        No tenés conversaciones aún
      </h3>
      <p className="mt-2 text-sm text-muted max-w-sm">
        Iniciá una nueva conversación para empezar a analizar tu proyecto.
      </p>
    </div>
  )
}
