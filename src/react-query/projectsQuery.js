import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { getAuthToken } from './client'

const BASE = import.meta.env.VITE_APP_URL_BACKEND

const getAuthHeaders = () => {
  const token = getAuthToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// useGetProjects
export function useGetProjects(params = {}) {
  // Default include to fetch images and services for cards/tables
  const include = params.include ?? 'images,services'
  return useQuery({
    queryKey: ['projects', { ...params, include }],
    queryFn: async () => {
      const { pageSize, ...requestParams } = params
      if (pageSize !== undefined) {
        requestParams.limit = pageSize
      }
      requestParams.include = include
      // For dashboard/admin, fetch all projects (published + drafts)
      // For public pages, fetch only published
      if (requestParams.published === undefined && requestParams.isPublished === undefined) {
        // Check if we're in admin context by looking for JWT token
        const token = sessionStorage.getItem('riecToken') || localStorage.getItem('riecToken')
        requestParams.published = token ? 'all' : 'true'
      }
      const response = await axios.get(`${BASE}/projects`, { params: requestParams, headers: getAuthHeaders() })
      return {
        items: response.data.data || [],
        total: response.data.meta?.total ?? response.data.total ?? 0,
        page: response.data.meta?.page ?? response.data.page ?? 1,
        pageSize: response.data.meta?.limit ?? response.data.meta?.pageSize ?? 20,
        totalPages: response.data.meta?.totalPages,
      }
    },
    staleTime: 5 * 60 * 1000,
  })
}

// useGetProjectById
export function useGetProjectById(id) {
  return useQuery({
    queryKey: ['project', id],
    queryFn: async () => {
      const response = await axios.get(`${BASE}/projects/identifier/${id}`, { headers: getAuthHeaders() })
      return response.data.data ?? response.data
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  })
}

// useGetProjectBySlug
export function useGetProjectBySlug(
  slug,
  { include = 'images,assets,pricingTiers,services', enabled = true } = {}
) {
  return useQuery({
    queryKey: ['project', 'slug', slug, include],
    queryFn: async () => {
      const response = await axios.get(`${BASE}/projects/identifier/${slug}`, {
        params: include ? { include } : undefined,
        headers: getAuthHeaders(),
      })
      return response.data.data ?? response.data
    },
    enabled: !!slug && enabled,
    staleTime: 5 * 60 * 1000,
  })
}

// useCreateProject
export function useCreateProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (body) => {
      const response = await axios.post(`${BASE}/projects`, body, { headers: getAuthHeaders() })
      return response.data.data ?? response.data
    },
    onSuccess: (newProject) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      if (newProject?.id) {
        queryClient.setQueryData(['project', newProject.id], newProject)
      }
    },
  })
}

// useUpdateProject
export function useUpdateProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...body }) => {
      const response = await axios.put(`${BASE}/projects/identifier/${id}`, body, { headers: getAuthHeaders() })
      return response.data.data ?? response.data
    },
    onSuccess: (updatedProject) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      if (updatedProject?.id) {
        queryClient.setQueryData(['project', updatedProject.id], updatedProject)
      }
    },
  })
}

// useDeleteProject
export function useDeleteProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id) => {
      await axios.delete(`${BASE}/projects/identifier/${id}`, { headers: getAuthHeaders() })
      return id
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      queryClient.removeQueries({ queryKey: ['project', id] })
    },
  })
}

// usePublishProject
export function usePublishProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id) => {
      const response = await axios.post(`${BASE}/projects/identifier/${id}/publish`, { headers: getAuthHeaders() })
      return response.data.data ?? response.data
    },
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['project', updated?.id] })
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
  })
}

// useUnpublishProject
export function useUnpublishProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id) => {
      const response = await axios.post(`${BASE}/projects/identifier/${id}/unpublish`, { headers: getAuthHeaders() })
      return response.data.data ?? response.data
    },
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['project', updated?.id] })
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
  })
}

// useAddYoutubeVideo
export function useAddYoutubeVideo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ identifier, youtubeVideoUrl }) => {
      const response = await axios.post(`${BASE}/projects/identifier/${identifier}/youtube-video`, { youtubeVideoUrl }, { headers: getAuthHeaders() })
      return response.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['project', variables.identifier] })
    },
  })
}

// Categories hooks
export function useGetCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await axios.get(`${BASE}/projects/categories`, { headers: getAuthHeaders() })
      return response.data.data ?? response.data
    },
    staleTime: 10 * 60 * 1000,
  })
}

export function useGetProjectsByCategory(category) {
  return useQuery({
    queryKey: ['projects', 'category', category],
    queryFn: async () => {
      const response = await axios.get(`${BASE}/projects/by-category/${category}`, { headers: getAuthHeaders() })
      return {
        items: response.data.data || [],
        total: response.data.meta?.total ?? 0,
        page: response.data.meta?.page ?? 1,
        pageSize: response.data.meta?.limit ?? 20,
        category,
      }
    },
    enabled: !!category,
    staleTime: 5 * 60 * 1000,
  })
}

export function useGetCategoriesSummary() {
  return useQuery({
    queryKey: ['categories', 'summary'],
    queryFn: async () => {
      const response = await axios.get(`${BASE}/projects/categories/summary`, { headers: getAuthHeaders() })
      return response.data.data ?? response.data
    },
    staleTime: 10 * 60 * 1000,
  })
}