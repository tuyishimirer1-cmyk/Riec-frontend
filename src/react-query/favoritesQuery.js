import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { getAuthToken } from './client'

const BASE = import.meta.env.VITE_APP_URL_BACKEND

const getAuthHeaders = () => {
  const token = getAuthToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export const hasAuthToken = () => !!getAuthToken()

export function useGetFavorites({ page = 1, limit = 12 } = {}) {
  const token = getAuthToken()

  return useQuery({
    queryKey: ['favorites', { page, limit }],
    queryFn: async () => {
      const response = await axios.get(`${BASE}/favorites`, {
        params: { page, limit },
        headers: getAuthHeaders(),
      })

      return {
        items: response.data.data || [],
        total: response.data.meta?.total ?? response.data.total ?? 0,
        page: response.data.meta?.page ?? page,
        totalPages: response.data.meta?.totalPages ?? 1,
      }
    },
    enabled: !!token,
    staleTime: 2 * 60 * 1000,
  })
}

export function useGetFavoriteStatus(identifier) {
  const token = getAuthToken()

  return useQuery({
    queryKey: ['favorites', 'status', identifier],
    queryFn: async () => {
      const response = await axios.get(`${BASE}/favorites/projects/${identifier}/status`, {
        headers: getAuthHeaders(),
      })
      return response.data
    },
    enabled: !!identifier && !!token,
    staleTime: 60 * 1000,
  })
}

export function useAddFavorite() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (identifier) => {
      const response = await axios.post(`${BASE}/favorites/projects/${identifier}`, undefined, {
        headers: getAuthHeaders(),
      })
      return response.data
    },
    onSuccess: (_, identifier) => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] })
      queryClient.invalidateQueries({ queryKey: ['favorites', 'status', identifier] })
    },
  })
}

export function useRemoveFavorite() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (identifier) => {
      await axios.delete(`${BASE}/favorites/projects/${identifier}`, {
        headers: getAuthHeaders(),
      })
      return identifier
    },
    onSuccess: (identifier) => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] })
      queryClient.invalidateQueries({ queryKey: ['favorites', 'status', identifier] })
    },
  })
}
