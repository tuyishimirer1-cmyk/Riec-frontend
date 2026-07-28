import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

const BASE = import.meta.env.VITE_APP_URL_BACKEND

// useHealthCheck
export function useHealthCheck() {
  return useQuery({
    queryKey: ['health'],
    queryFn: async () => {
      const response = await axios.get(`${BASE}/health`)
      return response.data
    },
    staleTime: 5 * 60 * 1000,
    refetchInterval: 30 * 1000,
  })
}