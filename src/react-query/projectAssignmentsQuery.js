import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { getAuthToken } from './client'

const BASE = import.meta.env.VITE_APP_URL_BACKEND

const getAuthHeaders = () => {
  const token = getAuthToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export function useGetProjectAssignments(projectId) {
  return useQuery({
    queryKey: ['project-assignments', projectId],
    queryFn: async () => {
      const response = await axios.get(`${BASE}/projects/${projectId}/assignments`, { headers: getAuthHeaders() })
      return response.data.data || []
    },
    enabled: !!projectId,
    staleTime: 5 * 60 * 1000,
  })
}

export function useCreateProjectAssignment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ projectId, ...body }) => {
      const response = await axios.post(`${BASE}/projects/${projectId}/assignments`, body, { headers: getAuthHeaders() })
      return response.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['project-assignments', variables.projectId] })
    },
  })
}

export function useUpdateProjectAssignment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ projectId, assignmentId, role }) => {
      const response = await axios.put(`${BASE}/projects/${projectId}/assignments/${assignmentId}`, { role }, { headers: getAuthHeaders() })
      return response.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['project-assignments', variables.projectId] })
    },
  })
}

export function useDeleteProjectAssignment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ projectId, assignmentId }) => {
      const response = await axios.delete(`${BASE}/projects/${projectId}/assignments/${assignmentId}`, { headers: getAuthHeaders() })
      return response.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['project-assignments', variables.projectId] })
    },
  })
}
