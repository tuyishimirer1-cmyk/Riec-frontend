import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { getAuthToken } from './client'

const BASE = import.meta.env.VITE_APP_URL_BACKEND

const getAuthHeaders = () => {
  const token = getAuthToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// useSearch
export function useSearch(query, filters = {}) {
  return useQuery({
    queryKey: ['search', query, filters],
    queryFn: async () => {
      const params = new URLSearchParams({ q: query, ...filters })
      const response = await axios.get(`${BASE}/search?${params}`, { headers: getAuthHeaders() })
      return response.data.data ?? response.data
    },
    enabled: !!query,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

// useSearchProjects
export function useSearchProjects(query, filters = {}) {
  return useQuery({
    queryKey: ['search', 'projects', query, filters],
    queryFn: async () => {
      const params = new URLSearchParams({ q: query, ...filters })
      const response = await axios.get(`${BASE}/search/projects?${params}`, { headers: getAuthHeaders() })
      return {
        items: response.data.data ?? [],
        total: response.data.total ?? response.data.meta?.total ?? 0,
        page: response.data.meta?.page ?? 1,
        pageSize: response.data.meta?.limit ?? 20,
        totalPages: response.data.meta?.totalPages,
      }
    },
    enabled: !!query,
    staleTime: 2 * 60 * 1000,
  })
}

// useSearchServices
export function useSearchServices(query) {
  return useQuery({
    queryKey: ['search', 'services', query],
    queryFn: async () => {
      const response = await axios.get(`${BASE}/search/services`, {
        params: { q: query },
        headers: getAuthHeaders(),
      })
      return {
        items: response.data.data ?? [],
        total: response.data.total ?? response.data.meta?.total ?? 0,
        page: response.data.meta?.page ?? 1,
        pageSize: response.data.meta?.limit ?? 20,
        totalPages: response.data.meta?.totalPages,
      }
    },
    enabled: !!query,
    staleTime: 2 * 60 * 1000,
  })
}