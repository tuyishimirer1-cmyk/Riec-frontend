import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { getAuthToken } from './client'

const BASE = import.meta.env.VITE_APP_URL_BACKEND

const getAuthHeaders = () => {
  const token = getAuthToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// useGetContactSubmissions
export function useGetContactSubmissions({ page = 1, pageSize = 20 } = {}) {
  return useQuery({
    queryKey: ['contact-submissions', page, pageSize],
    queryFn: async () => {
      const response = await axios.get(`${BASE}/contact/admin/submissions`, {
        params: { page, pageSize },
        headers: getAuthHeaders(),
      })
      return {
        items: response.data.data || [],
        total: response.data.total ?? 0,
        page: response.data.page ?? page,
        totalPages: response.data.totalPages ?? Math.max(1, Math.ceil((response.data.total ?? 0) / pageSize)),
      }
    },
    staleTime: 5 * 60 * 1000,
  })
}

// useMarkSubmissionRead
export function useMarkSubmissionRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id) => {
      const response = await axios.patch(
        `${BASE}/contact/admin/submissions/${id}/read`,
        undefined,
        { headers: getAuthHeaders() }
      )
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact-submissions'] })
    },
  })
}

// useCreateContact
export function useCreateContact() {
  return useMutation({
    mutationFn: async (body) => {
      const response = await axios.post(`${BASE}/contact`, body)
      return response.data.data ?? response.data
    },
  })
}

// useCreateQuote
export function useCreateQuote() {
  return useMutation({
    mutationFn: async (body) => {
      const response = await axios.post(`${BASE}/contact/quote`, body)
      return response.data.data ?? response.data
    },
  })
}