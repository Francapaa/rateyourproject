'use client'

import { useRef, useState, useCallback } from 'react'

interface FileUploadProps {
  onFileSelect: (file: File) => void
  disabled?: boolean
  hidden?: boolean
}

const MAX_SIZE_MB = 100
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024

function validateFile(file: File): string | null {
  const isZip = file.type === 'application/zip' || file.name.toLowerCase().endsWith('.zip')
  if (!isZip) {
    return 'Solo se permiten archivos .zip'
  }
  if (file.size > MAX_SIZE_BYTES) {
    return `El archivo no puede superar los ${MAX_SIZE_MB}MB`
  }
  return null
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function FileUpload({ onFileSelect, disabled, hidden }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)



  const handleClick = useCallback(() => {
    inputRef.current?.click()
  }, [])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return

      const validationError = validateFile(file)
      if (validationError) {
        setError(validationError)
        return
      }

      setError(null)
      setSelectedFile(file)
      onFileSelect(file)

      if (inputRef.current) {
        inputRef.current.value = ''
      }
    },
    [onFileSelect]
  )

  const handleRemove = useCallback(() => {
    setSelectedFile(null)
    setError(null)
  }, [])

  if (hidden) {
    return null
  }

  return (
    <div className="w-full">
      <input
        ref={inputRef}
        type="file"
        accept=".zip"
        onChange={handleChange}
        disabled={disabled}
        className="hidden"
      />

      {!selectedFile ? (
        <button
          type="button"
          onClick={handleClick}
          disabled={disabled}
          className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-surface-900 border border-surface-700/50 rounded-xl text-muted hover:text-white hover:border-accent/50 hover:bg-surface-800 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
            />
          </svg>
          <span className="text-sm font-medium">Subir archivo .zip</span>
        </button>
      ) : (
        <div className="flex items-center gap-3 px-4 py-3 bg-surface-900 border border-surface-700/50 rounded-xl">
          <div className="flex-1 flex items-center gap-3 min-w-0">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="w-5 h-5 text-accent shrink-0"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
              />
            </svg>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-white truncate font-medium">
                {selectedFile.name}
              </p>
              <p className="text-xs text-muted">
                {formatFileSize(selectedFile.size)}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="shrink-0 p-2 text-muted hover:text-white hover:bg-surface-800 rounded-lg transition-colors"
            aria-label="Quitar archivo"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="w-4 h-4"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {error && (
        <p className="mt-2 text-xs text-red-400">{error}</p>
      )}
    </div>
  )
}