import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { getAuthToken } from './client'

const BASE = import.meta.env.VITE_APP_URL_BACKEND

const getAuthHeaders = () => {
  const token = getAuthToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// useGetCareer
export function useGetCareer(id) {
  return useQuery({
    queryKey: ['career', id],
    queryFn: async () => {
      const response = await axios.get(`${BASE}/careers/${id}`)
      return response.data
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  })
}

// useGetCareers
export function useGetCareers({ page = 1, limit = 20, location, department, type, published } = {}) {
  return useQuery({
    queryKey: ['careers', { page, limit, location, department, type, published }],
    queryFn: async () => {
      const response = await axios.get(`${BASE}/careers`, {
        params: { page, limit, location, department, type, published },
      })
      return {
        items: response.data.data || [],
        total: response.data.meta?.total ?? response.data.total ?? 0,
        page: response.data.meta?.page ?? page,
        totalPages: response.data.meta?.totalPages ?? 1,
      }
    },
    staleTime: 5 * 60 * 1000,
  })
}

// useCreateCareer
export function useCreateCareer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (body) => {
      const response = await axios.post(`${BASE}/careers`, body, {
        headers: getAuthHeaders(),
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['careers'] })
    },
  })
}

// useUpdateCareer
export function useUpdateCareer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...body }) => {
      const response = await axios.put(`${BASE}/careers/identifier/${id}`, body, {
        headers: getAuthHeaders(),
      })
      return response.data
    },
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['careers'] })
      queryClient.invalidateQueries({ queryKey: ['career', updated?.id] })
    },
  })
}

// useDeleteCareer
export function useDeleteCareer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id) => {
      await axios.delete(`${BASE}/careers/identifier/${id}`, {
        headers: getAuthHeaders(),
      })
      return id
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ['careers'] })
      queryClient.removeQueries({ queryKey: ['career', id] })
    },
  })
}

// usePublishCareer
export function usePublishCareer() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id) => {
      const response = await axios.post(`${BASE}/careers/identifier/${id}/publish`, undefined, {
        headers: getAuthHeaders(),
      })
      return response.data
    },
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['careers'] })
      queryClient.invalidateQueries({ queryKey: ['career', updated?.id] })
    },
  })
}

// useUnpublishCareer
export function useUnpublishCareer() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id) => {
      const response = await axios.post(`${BASE}/careers/identifier/${id}/unpublish`, undefined, {
        headers: getAuthHeaders(),
      })
      return response.data
    },
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['careers'] })
      queryClient.invalidateQueries({ queryKey: ['career', updated?.id] })
    },
  })
}

// useApplyJob
export function useApplyJob() {
  return useMutation({
    mutationFn: async (body) => {
      const response = await axios.post(`${BASE}/applications`, body)
      return response.data
    },
  })
}

// useGetCareerStats
export function useGetCareerStats() {
  return useQuery({
    queryKey: ['careers', 'stats'],
    queryFn: async () => {
      const response = await axios.get(`${BASE}/careers/stats`, {
        headers: getAuthHeaders(),
      })
      return response.data
    },
    staleTime: 5 * 60 * 1000,
  })
}