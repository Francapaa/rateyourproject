'use client'

import { useCallback, useEffect, useReducer } from 'react'
import { fetchProfile, updateProfile } from '@/lib/api'
import type { ProfileData } from '@/types/profile'

interface ProfileFormState {
  role: string
  seniority: string
}

type AsyncStatus = 'idle' | 'loading' | 'saving' | 'error' | 'success'

interface ProfileState {
  profile: ProfileData | null
  form: ProfileFormState
  asyncStatus: AsyncStatus
  error: string | null
}

type ProfileAction =
  | { type: 'LOAD_START' }
  | { type: 'LOAD_SUCCESS'; profile: ProfileData }
  | { type: 'LOAD_ERROR'; error: string }
  | { type: 'SET_FIELD'; field: keyof ProfileFormState; value: string }
  | { type: 'SAVE_START' }
  | { type: 'SAVE_SUCCESS'; profile: ProfileData }
  | { type: 'SAVE_ERROR'; error: string }
  | { type: 'RESET_STATUS' }

const initialState: ProfileState = {
  profile: null,
  form: { role: '', seniority: '' },
  asyncStatus: 'idle',
  error: null,
}

function profileReducer(state: ProfileState, action: ProfileAction): ProfileState {
  switch (action.type) {
    case 'LOAD_START':
      return { ...state, asyncStatus: 'loading', error: null }

    case 'LOAD_SUCCESS':
      return {
        ...state,
        profile: action.profile,
        form: { role: action.profile.role, seniority: action.profile.seniority },
        asyncStatus: 'idle',
        error: null,
      }

    case 'LOAD_ERROR':
      return { ...state, asyncStatus: 'error', error: action.error }

    case 'SET_FIELD':
      return {
        ...state,
        form: { ...state.form, [action.field]: action.value },
        asyncStatus: state.asyncStatus === 'success' ? 'idle' : state.asyncStatus,
      }

    case 'SAVE_START':
      return { ...state, asyncStatus: 'saving', error: null }

    case 'SAVE_SUCCESS':
      return {
        ...state,
        profile: action.profile,
        form: { role: action.profile.role, seniority: action.profile.seniority },
        asyncStatus: 'success',
        error: null,
      }

    case 'SAVE_ERROR':
      return { ...state, asyncStatus: 'error', error: action.error }

    case 'RESET_STATUS':
      return { ...state, asyncStatus: 'idle', error: null }

    default:
      return state
  }
}

interface UseProfileReturn {
  profile: ProfileData | null
  form: ProfileFormState
  isLoading: boolean
  isSaving: boolean
  error: string | null
  isSuccess: boolean
  setField: (field: keyof ProfileFormState, value: string) => void
  handleSave: () => Promise<void>
}

export function useProfile(): UseProfileReturn {
  const [state, dispatch] = useReducer(profileReducer, initialState)

  const loadProfile = useCallback(async () => {
    dispatch({ type: 'LOAD_START' })
    try {
      const data = await fetchProfile()
      dispatch({ type: 'LOAD_SUCCESS', profile: data })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load profile'
      dispatch({ type: 'LOAD_ERROR', error: message })
    }
  }, [])

  useEffect(() => {
    loadProfile()
  }, [loadProfile])

  const setField = useCallback((field: keyof ProfileFormState, value: string) => {
    dispatch({ type: 'SET_FIELD', field, value })
  }, [])

  const handleSave = async () => {
    dispatch({ type: 'SAVE_START' })
    try {
      const updated = await updateProfile(state.form)
      dispatch({ type: 'SAVE_SUCCESS', profile: updated })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update profile'
      dispatch({ type: 'SAVE_ERROR', error: message })
    }
  }

  return {
    profile: state.profile,
    form: state.form,
    isLoading: state.asyncStatus === 'loading',
    isSaving: state.asyncStatus === 'saving',
    error: state.error,
    isSuccess: state.asyncStatus === 'success',
    setField,
    handleSave,
  }
}
