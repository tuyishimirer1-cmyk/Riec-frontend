import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { getAuthToken } from './client'

const BASE = import.meta.env.VITE_APP_URL_BACKEND

const getAuthHeaders = () => {
  const token = getAuthToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export function useGetDashboardStats(period = '30d') {
  return useQuery({
    queryKey: ['dashboard', 'stats', period],
    queryFn: async () => {
      const response = await axios.get(`${BASE}/dashboard/stats`, {
        params: { period },
        headers: getAuthHeaders(),
      })
      return response.data.data ?? response.data
    },
    staleTime: 60 * 1000,
  })
}

export function useGetDashboardRevenue(period = '30d') {
  return useQuery({
    queryKey: ['dashboard', 'revenue', period],
    queryFn: async () => {
      const response = await axios.get(`${BASE}/dashboard/revenue`, {
        params: { period },
        headers: getAuthHeaders(),
      })
      return response.data.data ?? response.data
    },
    staleTime: 60 * 1000,
  })
}
