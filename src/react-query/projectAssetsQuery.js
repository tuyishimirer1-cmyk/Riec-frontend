import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { getAuthToken } from './client'

const BASE = import.meta.env.VITE_APP_URL_BACKEND

const getAuthHeaders = () => {
  const token = getAuthToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export function useGetProjectAssets({ projectId, page = 1, limit = 50, tierId, documentType } = {}) {
  return useQuery({
    queryKey: ['project-assets', projectId, { page, limit, tierId, documentType }],
    queryFn: async () => {
      const response = await axios.get(`${BASE}/projects/${projectId}/assets`, {
        params: { page, limit, tierId, documentType },
        headers: getAuthHeaders(),
      })

      return {
        items: response.data.data || [],
        total: response.data.meta?.total ?? response.data.total ?? 0,
        page: response.data.meta?.page ?? page,
        pageSize: response.data.meta?.limit ?? limit,
      }
    },
    enabled: !!projectId,
    staleTime: 5 * 60 * 1000,
  })
}

export function useGetProjectAssetDownloadUrl() {
  return useMutation({
    mutationFn: async ({ projectId, assetId }) => {
      const response = await axios.get(`${BASE}/projects/${projectId}/assets/${assetId}/download`, { headers: getAuthHeaders() })
      return response.data
    },
  })
}

export function useUpdateProjectAsset() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ projectId, assetId, ...body }) => {
      const response = await axios.put(`${BASE}/projects/${projectId}/assets/${assetId}`, body, { headers: getAuthHeaders() })
      return response.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['project-assets', variables.projectId] })
    },
  })
}

export function useDeleteProjectAsset() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ projectId, assetId }) => {
      await axios.delete(`${BASE}/projects/${projectId}/assets/${assetId}`, { headers: getAuthHeaders() })
      return { projectId, assetId }
    },
    onSuccess: ({ projectId }) => {
      queryClient.invalidateQueries({ queryKey: ['project-assets', projectId] })
    },
  })
}
