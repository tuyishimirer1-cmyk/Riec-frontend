import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { getAuthToken } from './client'

const BASE = import.meta.env.VITE_APP_URL_BACKEND

const getAuthHeaders = () => {
  const token = getAuthToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export function useGetProjectTiers({ projectId, onlyActive } = {}) {
  return useQuery({
    queryKey: ['project-tiers', projectId, onlyActive],
    queryFn: async () => {
      const response = await axios.get(`${BASE}/projects/${projectId}/tiers`, {
        params: { onlyActive },
        headers: getAuthHeaders(),
      })
      return response.data.data || []
    },
    enabled: !!projectId,
    staleTime: 5 * 60 * 1000,
  })
}

export function useCreateProjectTier() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ projectId, ...body }) => {
      const response = await axios.post(`${BASE}/projects/${projectId}/tiers`, body, { headers: getAuthHeaders() })
      return response.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['project-tiers', variables.projectId] })
    },
  })
}

export function useUpdateProjectTier() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ projectId, tierId, ...body }) => {
      const response = await axios.put(`${BASE}/projects/${projectId}/tiers/${tierId}`, body, { headers: getAuthHeaders() })
      return response.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['project-tiers', variables.projectId] })
    },
  })
}

export function useDeleteProjectTier() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ projectId, tierId }) => {
      const response = await axios.delete(`${BASE}/projects/${projectId}/tiers/${tierId}`, { headers: getAuthHeaders() })
      return response.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['project-tiers', variables.projectId] })
    },
  })
}
