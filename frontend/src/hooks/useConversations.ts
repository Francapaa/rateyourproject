'use client'

import { useState, useEffect, useCallback } from 'react'
import { fetchFromApi } from '@/lib/api'
import type { Conversation } from '@/types/conversation'

interface UseConversationsReturn {
  conversations: Conversation[]
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
  createConversation: () => Promise<Conversation>
}

async function fetchConversations(): Promise<Conversation[]> {
  return fetchFromApi<Conversation[]>('/api/conversations')
}

async function createConversation(): Promise<Conversation> {
  return fetchFromApi<Conversation>('/api/conversations', {
    method: 'POST',
    credentials: "include", 
  })
}

export function useConversations(): UseConversationsReturn {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await fetchConversations()
      setConversations(data)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load conversations'
      console.error(err); 
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { conversations, isLoading, error, refetch, createConversation }
}
