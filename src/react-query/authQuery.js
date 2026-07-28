import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

const BASE = import.meta.env.VITE_APP_URL_BACKEND

// Storage key
const STORAGE_KEY = 'riec_auth'

// Helper functions for localStorage
const loadStoredAuth = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed.expiresAt || parsed.expiresAt < Date.now()) {
      localStorage.removeItem(STORAGE_KEY)
      return null
    }
    return parsed
  } catch {
    return null
  }
}

const saveAuth = (auth) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(auth))
}

const clearAuth = () => {
  localStorage.removeItem(STORAGE_KEY)
}

// useAuth hook - get current authenticated user
export function useAuth() {
  return useQuery({
    queryKey: ['auth'],
    queryFn: () => loadStoredAuth(),
    staleTime: Infinity,
    cacheTime: Infinity,
    retry: false,
  })
}

// useLogin mutation
export function useLogin() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ email, password }) => {
      const response = await axios.post(`${BASE}/auth/login`, { email, password })
      return response.data.data
    },
    onSuccess: (data) => {
      const { accessToken, expiresIn, role } = data
      const expiresAt = Date.now() + (expiresIn || 0) * 1000
      const auth = { email: arguments[1]?.email || '', accessToken, role, expiresAt }
      saveAuth(auth)
      queryClient.setQueryData(['auth'], auth)
    },
  })
}

// useRegister mutation
export function useRegister() {
  return useMutation({
    mutationFn: async (body) => {
      const response = await axios.post(`${BASE}/auth/register`, body)
      return response.data
    },
  })
}

// useLogout mutation
export function useLogout() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      await axios.post(`${BASE}/auth/logout`)
    },
    onSuccess: () => {
      clearAuth()
      queryClient.setQueryData(['auth'], null)
    },
  })
}