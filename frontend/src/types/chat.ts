export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export type ChatMessageType = 'text' | 'upload'

export interface UploadFileState {
  file: File | null
  status: 'idle' | 'uploading' | 'success' | 'error'
  error?: string
}
