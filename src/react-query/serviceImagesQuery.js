import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { getAuthToken } from './client'

const BASE = import.meta.env.VITE_APP_URL_BACKEND

const getAuthHeaders = () => {
  const token = getAuthToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// useGetServiceImages
export function useGetServiceImages(serviceId, { page = 1, limit = 20 } = {}) {
  return useQuery({
    queryKey: ['service-images', serviceId, { page, limit }],
    queryFn: async () => {
      const response = await axios.get(`${BASE}/services/${serviceId}/images`, {
        params: { page, limit },
        headers: getAuthHeaders(),
      })
      return response.data.data ?? []
    },
    enabled: !!serviceId,
    staleTime: 5 * 60 * 1000,
  })
}

// useUploadServiceImage
export function useUploadServiceImage(serviceId) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (files) => {
      const fd = new FormData()
      files.forEach((f) => fd.append('files', f))
      const response = await axios.post(`${BASE}/services/${serviceId}/images`, fd, {
        headers: { 'Content-Type': 'multipart/form-data', ...getAuthHeaders() },
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-images', serviceId] })
    },
  })
}

// useUpdateServiceImage
export function useUpdateServiceImage() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ serviceId, imageId, ...body }) => {
      const response = await axios.put(`${BASE}/services/${serviceId}/images/${imageId}`, body, { headers: getAuthHeaders() })
      return response.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['service-images', variables.serviceId] })
    },
  })
}

// useDeleteServiceImage
export function useDeleteServiceImage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ serviceId, imageId }) => {
      await axios.delete(`${BASE}/services/${serviceId}/images/${imageId}`, { headers: getAuthHeaders() })
      return { serviceId, imageId }
    },
    onSuccess: ({ serviceId }) => {
      queryClient.invalidateQueries({ queryKey: ['service-images', serviceId] })
    },
  })
}