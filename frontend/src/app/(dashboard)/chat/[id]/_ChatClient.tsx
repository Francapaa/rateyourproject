'use client'

import { ChatContent } from '@/components/chat/ChatContent'
import { useAnalysisSSE } from '@/hooks/useAnalysisSSE'
import { useEffect, useState } from 'react'
import { isValidUUID } from '@/lib/utils'

interface ChatClientProps {
  params: Promise<{ id: string }>
}

export function ChatClient({ params }: ChatClientProps) {
  const [conversationId, setConversationId] = useState<string>('')
  const { loadLatestAnalysis, status, result } = useAnalysisSSE()

  useEffect(() => {
    const loadData = async () => {
      const resolvedParams = await params
      const id = resolvedParams.id
      if (isValidUUID(id)) {
        setConversationId(id)
        await loadLatestAnalysis(id)
      }
    }
    loadData()
  }, [params, loadLatestAnalysis])

  return (
    <ChatContent 
      conversationId={conversationId} 
      initialStatus={status}
      initialResult={result}
    />
  )
}
