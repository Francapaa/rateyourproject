'use client'

import { ChatContent } from '@/components/chat/ChatContent'
import { useAnalysisSSE } from '@/hooks/useAnalysisSSE'
import { useEffect, useState } from 'react'
import { isValidUUID } from '@/lib/utils'
import Link from 'next'

interface ChatPageProps {
  params: Promise<{ id: string }>
}

export default function ChatPage({ params }: ChatPageProps) {
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