'use client'

import { DynamicHexagon } from './DynamicHexagon'
import { ImprovementsList } from './ImprovementsList'
import type { AnalysisResult } from '@/types/analysis'

interface AnalysisResultCardProps {
  result: AnalysisResult
}

export function AnalysisResultCard({ result }: AnalysisResultCardProps) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="relative overflow-hidden rounded-2xl bg-surface-900/80 border border-surface-700/50 backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-surface-900 pointer-events-none" />
        
        <div className="absolute top-0 left-0 w-32 h-32 bg-accent/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-24 h-24 bg-accent/5 rounded-full blur-2xl translate-x-1/2 translate-y-1/2 pointer-events-none" />

        <div className="relative p-6 md:p-8">
          <div className="flex flex-col lg:flex-row gap-8 lg:items-start lg:justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-accent">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                  </svg>
                </div>
                <span className="text-xs font-body text-accent uppercase tracking-widest">
                  Complete analysis
                </span>
              </div>

              <h2 className="font-display font-bold text-2xl md:text-3xl text-white leading-tight mb-6">
                {result.title || 'Evaluación del Proyecto'}
              </h2>

              <div className="flex justify-center lg:justify-start mb-6 lg:mb-0">
                <DynamicHexagon dimensions={result.dimensions} size="lg" />
              </div>
            </div>

            <div className="flex-1 max-w-lg">
              <ImprovementsList improvements={result.improvements} />
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-surface-700 to-transparent" />
      </div>
    </div>
  )
}