import { useMutation, useQuery } from '@tanstack/react-query'
import axios from 'axios'

const BASE = import.meta.env.VITE_APP_URL_BACKEND

// useCreateCheckout
export function useCreateCheckout() {
  return useMutation({
    mutationFn: async (body) => {
      const response = await axios.post(`${BASE}/payments/project-checkout`, body)
      return response.data
    },
  })
}

// useGetDownloads
export function useGetDownloads(token) {
  return useQuery({
    queryKey: ['downloads', token],
    queryFn: async () => {
      const response = await axios.get(`${BASE}/payments/downloads/${token}`)
      return response.data
    },
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
  })
}

// useGetPaymentStats
export function useGetPaymentStats() {
  return useQuery({
    queryKey: ['payments', 'stats'],
    queryFn: async () => {
      const response = await axios.get(`${BASE}/payments/stats`)
      return response.data
    },
    staleTime: 5 * 60 * 1000,
  })
}