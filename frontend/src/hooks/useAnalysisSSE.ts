'use client'

import { useReducer, useCallback, useRef, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { AnalysisResult } from '@/types/analysis'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080'

type AnalysisStatus = 'idle' | 'uploading' | 'analyzing' | 'complete' | 'error'


interface UseAnalysisSSEReturn {
  progress: number
  status: AnalysisStatus
  result: AnalysisResult | null
  error: string | null
  startAnalysis: (file: File, conversationId: string) => void
  loadLatestAnalysis: (conversationId: string) => Promise<void>
  reset: () => void
}

type AnalysisState = {  
  progress: number
  status: 'idle' | 'uploading' | 'analyzing' | 'complete' | 'error'
  result: AnalysisResult | null
  error: string | null
}

type Action =
  |{ type: 'RESET' }
  | { type: 'UPLOADING' }
  | { type: 'ANALYZING' }
  | { type: 'PROGRESS'; payload: number } // progress percentage
  | { type: 'COMPLETE'; payload: AnalysisResult } 
  | { type: 'ERROR'; payload: string }

const initialState: AnalysisState = {
  progress: 0,
  status: 'idle',
  result: null,
  error: null,
}

function reducer(state: AnalysisState, action: Action): AnalysisState {
  switch (action.type) {
    case 'RESET':     return initialState
    case 'UPLOADING': return { ...initialState, status: 'uploading' }
    case 'ANALYZING': return { ...state, status: 'analyzing' }
    case 'PROGRESS':  return { ...state, progress: action.payload }
    case 'COMPLETE':  return { ...state, status: 'complete', result: action.payload }
    case 'ERROR':     return { ...state, status: 'error', error: action.payload }
  }
}

export function useAnalysisSSE(): UseAnalysisSSEReturn {
  const [state, dispatch] = useReducer(reducer, initialState)
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    return () => { abortRef.current?.abort() }
  }, [])

  const reset = useCallback(() => {
    abortRef.current?.abort()
    abortRef.current = null
    dispatch({ type: 'RESET' })
  }, [])

  const loadLatestAnalysis = useCallback(async (conversationId: string) => {
    const supabase = createClient()
    const { data: sessionData } = await supabase.auth.getSession()
    const token = sessionData.session?.access_token

    const headers: Record<string, string> = {}
    if (token) headers['Authorization'] = `Bearer ${token}`

    try {
      console.log("ID DE LA CONVERSACION: ", conversationId)
      const response = await fetch(`${API_URL}/api/analysis/${conversationId}`, {
        method: 'GET',
        headers,
      })

      if (!response.ok) {
        return
      }

      const json: { success: boolean; data: AnalysisResult | null } = await response.json()
      console.log(json.data) 
      if (json.success && json.data) {
        dispatch({ type: 'COMPLETE', payload: json.data })
      }
    } catch (err) {
      console.error('Failed to load latest analysis:', err)
    }
  }, [])

  const startAnalysis = useCallback(async (file: File, conversationId: string) => {
    abortRef.current?.abort()
    abortRef.current = new AbortController()
    dispatch({ type: 'UPLOADING' })

    const supabase = createClient()
    const { data } = await supabase.auth.getSession()
    const token = data.session?.access_token

    const formData = new FormData()
    formData.append('project', file)
    formData.append('conversation_id', conversationId)

    const headers: Record<string, string> = {}
    if (token) headers['Authorization'] = `Bearer ${token}`

    try {
      const response = await fetch(`${API_URL}/api/analysis/upload`, {
        method: 'POST',
        headers,
        body: formData,
        signal: abortRef.current.signal,
      })

      if (!response.ok) {
        dispatch({ type: 'ERROR', payload: `Upload failed: ${response.status}` })
        return
      }

      dispatch({ type: 'ANALYZING' }) //empieza el analisis

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) {
        dispatch({ type: 'ERROR', payload: 'No se pudo leer la respuesta del servidor' })
        return
      }

      let buffer = ''
      let currentEvent = ''
      let finished = false

      while (true) {
        const { done, value } = await reader.read()
        if (done || finished) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() ?? ''

        for (const line of lines) {
          if (!line.trim()) {
            currentEvent = ''
            continue
          }
          if (line.startsWith('event: ')) {
            currentEvent = line.slice(7).trim()
            continue
          }
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6))
              if (currentEvent === 'progress') {
                dispatch({ type: 'PROGRESS', payload: data.progress })
                console.log("PROGRESO: ", data.progress)
              } else if (currentEvent === 'done') {
                dispatch({ type: 'COMPLETE', payload: data })
                console.log("DATA:", data); 
                finished = true
                break
              } else if (currentEvent === 'error') {
                dispatch({ type: 'ERROR', payload: data.message })
                finished = true
                break
              }
            } catch {
              console.error('Failed to parse SSE data:', line.slice(6))
            }
          }
        }
      }
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        dispatch({ type: 'ERROR', payload: 'Error de conexión' })
      }
    }
  }, [reset])

  return {
    progress: state.progress,
    status: state.status,
    result: state.result,
    error: state.error,
    startAnalysis,
    loadLatestAnalysis,
    reset,
  }
}

/*
Paso 1: Dependencias
const startAnalysis = useCallback(async (file) => {
  // ...
}, [reset, status])  // ← status
Cada vez que status cambiaba (ej: uploading → analyzing), React recreaba todo el callback. Esto es normal, pero...
Paso 2: El return anticipado
if (!response.ok) {
  setStatus('error')
  return  // ← Early return aquí
}
if (data.overall_score !== undefined) {
  setStatus('complete')
  return  // ← o aquí
}
El problema era que dentro del callback había returns que dependían de condiciones, y esas condiciones usaban status.
Paso 3: La inconsistencia
if (data.message && status !== 'complete') {  // ← Usaba stale 'status'
  setStatus('error')
}
status dentro del callback era el valor viejo (del momento en que se creó el callback), no el actual. Esto causaba que:
- React pensara que el hook devolvía menos valores de los esperados
- El orden de los renders se desincronizara
---
La solución
En vez de depender de status (que cambia), usamos statusRef que no causa re-renders pero siempre tiene el valor actual:
const statusRef = useRef('idle')
useEffect(() => { statusRef.current = status }, [status])
// Dentro del callback:
if (data.message && statusRef.current !== 'complete') {  // ← Siempre el valor fresco
  setStatus('error')
}
*/
