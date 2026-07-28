import { useState, useCallback, useRef, useEffect } from 'react'
import axios from 'axios'

// Get auth token directly from localStorage
const getAuthToken = () => {
  try {
    const stored = localStorage.getItem('riec_auth')
    if (!stored) return null
    return JSON.parse(stored)?.accessToken
  } catch {
    return null
  }
}

const BASE = import.meta.env.VITE_APP_URL_BACKEND

/**
 * Axios-based upload hook that reports progress.
 * upload(url, formData) → Promise<parsedResponseData>
 * progress: 0–100
 */
export function useXhrUpload() {
  const [progress,  setProgress]  = useState(0)
  const [uploading, setUploading] = useState(false)
  const [error,     setError]     = useState(null)
  const tokenRef = useRef(null)

  useEffect(() => {
    tokenRef.current = getAuthToken()
  }, [])

  const reset = useCallback(() => { setProgress(0); setError(null) }, [])

  const upload = useCallback((url, formData) => {
    return new Promise((resolve, reject) => {
      const token = tokenRef.current

      setUploading(true)
      setError(null)
      setProgress(0)

      axios.post(`${BASE}${url}`, formData, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : undefined,
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (e) => {
          if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100))
        },
      })
        .then((res) => {
          setUploading(false)
          setProgress(100)
          resolve(res.data?.data ?? res.data)
        })
        .catch((err) => {
          setUploading(false)
          const msg = err?.response?.data?.message || err?.message || 'Upload failed'
          setError(msg)
          reject(new Error(msg))
        })
    })
  }, [])

  return { upload, progress, uploading, error, reset }
}
