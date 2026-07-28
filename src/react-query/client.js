import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 1,
    },
    mutations: {
      onError: (error) => {
        console.error('Mutation error:', error)
      },
    },
  },
})

// Helper to get token from localStorage
export const getAuthToken = () => {
  try {
    const stored = localStorage.getItem('riec_auth')
    if (!stored) return null
    const parsed = JSON.parse(stored)
    if (!parsed.expiresAt || parsed.expiresAt < Date.now()) {
      localStorage.removeItem('riec_auth')
      return null
    }
    return parsed.accessToken
  } catch {
    return null
  }
}