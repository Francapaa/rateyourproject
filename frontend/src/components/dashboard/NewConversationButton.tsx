'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useConversations } from '@/hooks/useConversations'

interface NewConversationButtonProps {
  label?: string
  disabled?: boolean
}

export function NewConversationButton({ label = 'Nueva conversación', disabled = false }: NewConversationButtonProps) {
  const router = useRouter()
  const { conversations, createConversation } = useConversations()
  const [isCreating, setIsCreating] = useState(false)

  const handleClick = async () => {
    if (disabled) {
      router.push('/profile')
      return
    }

    if (conversations.length >= 2) {
      return
    }

    setIsCreating(true)
    try {
      const conversation = await createConversation()
      router.push(`/chat/${conversation.id}`)
    } catch (error) {
      console.error('Error creating conversation:', error)
      setIsCreating(false)
    }
  }

  const isAtLimit = conversations.length >= 2

  return (
    <button
      onClick={handleClick}
      disabled={disabled || isAtLimit || isCreating}
      className={`w-full flex items-center justify-center gap-3 px-6 py-4 font-body font-semibold text-sm rounded-xl transition-all duration-300 ${
        disabled || isAtLimit || isCreating
          ? 'bg-surface-700 text-muted cursor-not-allowed'
          : 'bg-accent text-surface-950 hover:bg-accent-light hover:shadow-lg hover:shadow-accent/20'
      }`}
      aria-label={label}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 animate-spin" style={{ animationPlayState: isCreating ? 'running' : 'paused' }}>
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
      {disabled
        ? 'Set up your profile'
        : isAtLimit
          ? 'Limit reached (2 analysis) '
          : isCreating
            ? 'Creating...'
            : label}
    </button>
  )
}
