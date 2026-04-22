import { createClient } from '@/lib/supabase/client'
import type { ApiResponse } from '@/types/conversation'
import type { ProfileData, UpdateProfileInput } from '@/types/profile'
import type { AnalysisResult } from '@/types/analysis'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080'

async function getAccessToken(): Promise<string | null> {
  const supabase = createClient()
  const { data } = await supabase.auth.getSession()
  return data.session?.access_token ?? null
}

export async function fetchFromApi<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await getAccessToken()

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`)
  }

  const json: ApiResponse<T> = await response.json()

  if (!json.success) {
    throw new Error(json.error ?? 'Unknown error')
  }

  return json.data
}

export async function fetchProfile(): Promise<ProfileData> {
  return fetchFromApi<ProfileData>('/api/auth/me')
}

export async function updateProfile(input: UpdateProfileInput): Promise<ProfileData> {
  return fetchFromApi<ProfileData>('/api/auth/profile', {
    method: 'PATCH',
    body: JSON.stringify(input),
  })
}

export async function uploadProject(file: File): Promise<AnalysisResult> {
  const token = await getAccessToken()

  const formData = new FormData()
  formData.append('project', file)

  const headers: Record<string, string> = {}
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${API_URL}/api/analysis/upload`, {
    method: 'POST',
    headers,
    body: formData,
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error(`Upload failed: ${response.status} ${response.statusText}`)
  }

  const json: ApiResponse<AnalysisResult> = await response.json()

  if (!json.success) {
    throw new Error(json.error ?? 'Unknown error')
  }

  return json.data
}
