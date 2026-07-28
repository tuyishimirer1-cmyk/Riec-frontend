import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { getAuthToken } from './client'

const BASE = import.meta.env.VITE_APP_URL_BACKEND

const getAuthHeaders = () => {
  const token = getAuthToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export function useGetProjectImages(projectId) {
  return useQuery({
    queryKey: ['project-images', projectId],
    queryFn: async () => {
      const response = await axios.get(`${BASE}/projects/${projectId}/images`, { headers: getAuthHeaders() })
      return response.data.data || []
    },
    enabled: !!projectId,
    staleTime: 5 * 60 * 1000,
  })
}

export function useReorderProjectImages() {
  return useMutation({
    mutationFn: async ({ projectId, images }) => {
      const response = await axios.put(`${BASE}/projects/${projectId}/images/reorder`, { images }, { headers: getAuthHeaders() })
      return response.data
    },
  })
}

export function useUpdateProjectImage() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ projectId, imageId, ...body }) => {
      const response = await axios.put(`${BASE}/projects/${projectId}/images/${imageId}`, body, { headers: getAuthHeaders() })
      return response.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['project-images', variables.projectId] })
    },
  })
}

export function useDeleteProjectImage() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ projectId, imageId }) => {
      await axios.delete(`${BASE}/projects/${projectId}/images/${imageId}`, { headers: getAuthHeaders() })
      return { projectId, imageId }
    },
    onSuccess: ({ projectId }) => {
      queryClient.invalidateQueries({ queryKey: ['project-images', projectId] })
    },
  })
}
