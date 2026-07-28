import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { getAuthToken } from './client'

const BASE = import.meta.env.VITE_APP_URL_BACKEND

const getAuthHeaders = () => {
  const token = getAuthToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// useGetServices
export function useGetServices({ page = 1, limit = 20 } = {}) {
  return useQuery({
    queryKey: ['services', { page, limit }],
    queryFn: async () => {
      const response = await axios.get(`${BASE}/services`, { params: { page, limit }, headers: getAuthHeaders() })
      return {
        items: response.data.data || [],
        total: response.data.total ?? response.data.data?.length ?? 0,
        page: response.data.meta?.page ?? 1,
        totalPages: response.data.meta?.totalPages ?? 1,
        hasNext: response.data.meta?.hasNext ?? false,
        hasPrev: response.data.meta?.hasPrev ?? false,
      }
    },
    staleTime: 5 * 60 * 1000,
  })
}

// useGetService
export function useGetService(id, { include, enabled = true } = {}) {
  return useQuery({
    queryKey: ['service', id, include],
    queryFn: async () => {
      const response = await axios.get(`${BASE}/services/${id}`, {
        params: include ? { include } : undefined,
        headers: getAuthHeaders(),
      })
      return response.data.data ?? response.data
    },
    enabled: !!id && enabled,
    staleTime: 5 * 60 * 1000,
  })
}

// useCreateService
export function useCreateService() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (body) => {
      const response = await axios.post(`${BASE}/services`, body, { headers: getAuthHeaders() })
      return response.data.data ?? response.data
    },
    onSuccess: (newService) => {
      queryClient.invalidateQueries({ queryKey: ['services'] })
      if (newService?.id) {
        queryClient.setQueryData(['service', newService.id], newService)
      }
    },
  })
}

// useUpdateService
export function useUpdateService() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...body }) => {
      const response = await axios.put(`${BASE}/services/${id}`, body, { headers: getAuthHeaders() })
      return response.data.data ?? response.data
    },
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['services'] })
      if (updated?.id) {
        queryClient.invalidateQueries({ queryKey: ['service', updated.id] })
      }
    },
  })
}

// useDeleteService
export function useDeleteService() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id) => {
      await axios.delete(`${BASE}/services/${id}`, { headers: getAuthHeaders() })
      return id
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ['services'] })
      queryClient.removeQueries({ queryKey: ['service', id] })
    },
  })
}