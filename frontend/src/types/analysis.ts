export interface AnalysisResult {
  id: string
  filename: string
  title: string
  dimensions: Record<string, number> // to build the hexagonal graphic
  improvements: string[]
  created_at: string
}

export type AnalysisStatus = 'idle' | 'uploading' | 'analyzing' | 'complete' | 'error'
