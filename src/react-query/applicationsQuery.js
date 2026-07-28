import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { getAuthToken } from './client'

const BASE = import.meta.env.VITE_APP_URL_BACKEND

const getAuthHeaders = () => {
  const token = getAuthToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// Application status constants
export const APPLICATION_STATUS = {
  NEW: 'NEW',
  IN_REVIEW: 'IN_REVIEW',
  SHORTLISTED: 'SHORTLISTED',
  HIRED: 'HIRED',
  REJECTED: 'REJECTED',
}

// Status workflow - defines valid transitions
export const STATUS_WORKFLOW = {
  NEW: [APPLICATION_STATUS.IN_REVIEW, APPLICATION_STATUS.REJECTED],
  IN_REVIEW: [APPLICATION_STATUS.SHORTLISTED, APPLICATION_STATUS.REJECTED],
  SHORTLISTED: [APPLICATION_STATUS.HIRED, APPLICATION_STATUS.REJECTED],
  HIRED: [],
  REJECTED: [],
}

// Status styles for UI
export const STATUS_STYLE = {
  [APPLICATION_STATUS.NEW]: { bg: 'rgba(238,122,24,0.10)', color: 'var(--color-riec-orange)' },
  [APPLICATION_STATUS.IN_REVIEW]: { bg: 'rgba(30,154,224,0.10)', color: 'var(--color-my-blue)' },
  [APPLICATION_STATUS.SHORTLISTED]: { bg: 'rgba(19,194,150,0.10)', color: 'var(--color-secondary)' },
  [APPLICATION_STATUS.HIRED]: { bg: 'rgba(133,80,11,0.10)', color: '#85500B' },
  [APPLICATION_STATUS.REJECTED]: { bg: 'rgba(225,27,37,0.10)', color: 'var(--color-riec-red)' },
}

// useGetApplications
export function useGetApplications({ page = 1, limit = 20, jobId, status, department, location, search } = {}) {
  return useQuery({
    queryKey: ['applications', { page, limit, jobId, status, department, location, search }],
    queryFn: async () => {
      const response = await axios.get(`${BASE}/applications`, {
        params: { page, limit, jobId, status, department, location, search },
        headers: getAuthHeaders(),
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

// useGetApplication
export function useGetApplication(id) {
  return useQuery({
    queryKey: ['application', id],
    queryFn: async () => {
      const response = await axios.get(`${BASE}/applications/${id}`, {
        headers: getAuthHeaders(),
      })
      return response.data
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  })
}

// useUpdateApplication
export function useUpdateApplication() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...body }) => {
      const response = await axios.put(`${BASE}/applications/${id}`, body, {
        headers: getAuthHeaders(),
      })
      return response.data
    },
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['applications'] })
      queryClient.invalidateQueries({ queryKey: ['application', updated?.id] })
    },
  })
}

// useDeleteApplication
export function useDeleteApplication() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id) => {
      await axios.delete(`${BASE}/applications/${id}`, {
        headers: getAuthHeaders(),
      })
      return id
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ['applications'] })
      queryClient.removeQueries({ queryKey: ['application', id] })
    },
  })
}

// useBulkUpdateApplications
export function useBulkUpdateApplications() {
  return useMutation({
    mutationFn: async (updates) => {
      const response = await axios.put(`${BASE}/applications/bulk-update`, updates, {
        headers: getAuthHeaders(),
      })
      return response.data
    },
  })
}

// useGetApplicationStats
export function useGetApplicationStats() {
  return useQuery({
    queryKey: ['applications', 'stats'],
    queryFn: async () => {
      const response = await axios.get(`${BASE}/applications/stats`, {
        headers: getAuthHeaders(),
      })
      return response.data
    },
    staleTime: 5 * 60 * 1000,
  })
}