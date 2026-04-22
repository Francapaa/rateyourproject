'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAnalysisSSE } from '@/hooks/useAnalysisSSE'
import { FileUpload } from '@/components/chat/FileUpload'
import { ChatEmptyState } from '@/components/chat/ChatEmptyState'
import { AnalysisResultCard } from '@/components/chat/AnalysisResultCard'
import type { AnalysisResult } from '@/types/analysis'

type AnalysisStatus = 'idle' | 'uploading' | 'analyzing' | 'complete' | 'error'

interface ChatContentProps {
  conversationId: string
  initialStatus?: AnalysisStatus
  initialResult?: AnalysisResult | null
}

export function ChatContent({ conversationId, initialStatus, initialResult }: ChatContentProps) {
  const { progress, status, result, error, startAnalysis, reset } = useAnalysisSSE()
  
  const effectiveStatus = status !== 'idle' ? status : (initialStatus ?? 'idle')
const effectiveResult = result ?? initialResult
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleFileSelect = (file: File) => {
    setSelectedFile(file)
    startAnalysis(file, conversationId)
  }

  const handleReset = () => {
    setSelectedFile(null)
    reset()
  }

  const hasExistingAnalysis = effectiveStatus === 'complete' && effectiveResult
  const isLoading = effectiveStatus === 'uploading' || effectiveStatus === 'analyzing'
  const showFileInfo = !!selectedFile && (effectiveStatus === 'analyzing' || effectiveStatus === 'complete')
  const isFinished = effectiveStatus === 'complete' || effectiveStatus === 'error'

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="flex-1 overflow-y-auto px-4 py-6">
      <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm font-body font-medium text-muted hover:text-accent transition-colors mb-10 ml-20"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
            <path d="M19 12H5" />
            <path d="m12 19-7-7 7-7" />
          </svg>
          Back to dashboard
        </Link>
        <div className="max-w-4xl mx-auto">
          {effectiveStatus === 'complete' && effectiveResult ? (
            <>
              <AnalysisResultCard result={effectiveResult} />
            </>
            ) : (
            <ChatEmptyState />
          )}
        </div>
      </div>

      <div className="border-t border-surface-700/50 bg-surface-950/80 backdrop-blur-md p-4">
        <div className="max-w-3xl mx-auto">
          {hasExistingAnalysis ? (
            <div className="flex items-center justify-center gap-3 px-4 py-3 bg-surface-900/50 border border-surface-700/30 rounded-xl">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-muted">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-muted">
              This conversation already has a complete analysis
            </p>
          </div>
          ) : (
            <FileUpload
              onFileSelect={handleFileSelect}
              disabled={isLoading}
              hidden={showFileInfo}
            />
          )}

          {showFileInfo && (
            <div className="flex items-center gap-3 px-4 py-3 bg-surface-900 border border-surface-700/50 rounded-xl">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 text-accent shrink-0">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-white truncate font-medium">
                  {selectedFile.name}
                </p>
              </div>
              {isFinished && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="shrink-0 p-2 text-muted hover:text-white hover:bg-surface-800 rounded-lg transition-colors"
                  aria-label="Nuevo análisis"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          )}

          {isLoading && (
            <div className="mt-3 flex items-center gap-3">
              <div className="relative w-8 h-8">
                <svg className="animate-spin w-8 h-8" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
                  {progress}%
                </span>
              </div>
              <span className="text-sm text-muted">
                {effectiveStatus === 'uploading' ? 'Subiendo archivo...' : 'Analizando proyecto...'}
              </span>
            </div>
          )}

          {effectiveStatus === 'error' && (
            <div className="mt-3 text-sm text-red-400">
              {'Error al analizar el proyecto, intentelo mas tarde.'}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}