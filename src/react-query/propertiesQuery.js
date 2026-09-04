import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { getAuthToken } from './client'

const BASE = import.meta.env.VITE_APP_URL_BACKEND

const getAuthHeaders = () => {
  const token = getAuthToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// ==================== PUBLIC QUERIES ====================

// Get all properties (public)
export function useGetProperties(filters = {}) {
  const {
    page = 1,
    limit = 20,
    search,
    propertyType,
    listingType,
    district,
    sector,
    minPrice,
    maxPrice,
    verifiedOnly = true,
  } = filters

  return useQuery({
    queryKey: ['properties', filters],
    queryFn: async () => {
      const response = await axios.get(`${BASE}/properties`, {
        params: {
          page,
          limit,
          search,
          propertyType,
          listingType,
          district,
          sector,
          minPrice,
          maxPrice,
          verifiedOnly,
        },
      })
      return {
        items: response.data.data || [],
        total: response.data.meta?.total ?? 0,
        page: response.data.meta?.page ?? 1,
        totalPages: response.data.meta?.totalPages ?? 1,
      }
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

// Get featured properties
export function useGetFeaturedProperties(limit = 8) {
  return useQuery({
    queryKey: ['properties', 'featured', limit],
    queryFn: async () => {
      const response = await axios.get(`${BASE}/properties/featured`, {
        params: { limit },
      })
      return response.data
    },
    staleTime: 5 * 60 * 1000,
  })
}

// Get property by slug
export function useGetProperty(slug, { enabled = true } = {}) {
  return useQuery({
    queryKey: ['property', slug],
    queryFn: async () => {
      const response = await axios.get(`${BASE}/properties/${slug}`)
      return response.data
    },
    enabled: !!slug && enabled,
    staleTime: 5 * 60 * 1000,
  })
}

// Get properties stats
export function useGetPropertiesStats() {
  return useQuery({
    queryKey: ['properties', 'stats'],
    queryFn: async () => {
      const response = await axios.get(`${BASE}/properties/stats`)
      return response.data
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

// ==================== ADMIN QUERIES ====================

// Get all properties (admin - all statuses)
export function useGetAllPropertiesAdmin(filters = {}) {
  const { page = 1, limit = 20 } = filters

  return useQuery({
    queryKey: ['admin', 'properties', filters],
    queryFn: async () => {
      const response = await axios.get(`${BASE}/admin/properties`, {
        params: { page, limit },
        headers: getAuthHeaders(),
      })
      return {
        items: response.data.data || [],
        total: response.data.meta?.total ?? 0,
        page: response.data.meta?.page ?? 1,
        totalPages: response.data.meta?.totalPages ?? 1,
      }
    },
    staleTime: 1 * 60 * 1000,
  })
}

// Get pending verification properties
export function useGetPendingProperties() {
  return useQuery({
    queryKey: ['admin', 'properties', 'pending'],
    queryFn: async () => {
      const response = await axios.get(`${BASE}/admin/properties/pending`, {
        headers: getAuthHeaders(),
      })
      return response.data
    },
    staleTime: 1 * 60 * 1000,
  })
}

// Get all inquiries (admin)
export function useGetAllInquiries() {
  return useQuery({
    queryKey: ['admin', 'properties', 'inquiries'],
    queryFn: async () => {
      const response = await axios.get(`${BASE}/admin/properties/inquiries`, {
        headers: getAuthHeaders(),
      })
      return response.data
    },
    staleTime: 2 * 60 * 1000,
  })
}

// Get all viewings (admin)
export function useGetAllViewings() {
  return useQuery({
    queryKey: ['admin', 'properties', 'viewings'],
    queryFn: async () => {
      const response = await axios.get(`${BASE}/admin/properties/viewings`, {
        headers: getAuthHeaders(),
      })
      return response.data
    },
    staleTime: 2 * 60 * 1000,
  })
}

// ==================== MUTATIONS ====================

// Create property (admin or authenticated user)
export function useCreateProperty() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (propertyData) => {
      const response = await axios.post(`${BASE}/properties`, propertyData, {
        headers: getAuthHeaders(),
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'properties'] })
    },
  })
}

// Update property
export function useUpdateProperty() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...data }) => {
      const response = await axios.put(`${BASE}/properties/${id}`, data, {
        headers: getAuthHeaders(),
      })
      return response.data
    },
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['properties'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'properties'] })
      if (updated?.slug) {
        queryClient.invalidateQueries({ queryKey: ['property', updated.slug] })
      }
    },
  })
}

// Delete property
export function useDeleteProperty() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id) => {
      await axios.delete(`${BASE}/properties/${id}`, {
        headers: getAuthHeaders(),
      })
      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'properties'] })
    },
  })
}

// Verify property (admin)
export function useVerifyProperty() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id) => {
      const response = await axios.put(`${BASE}/admin/properties/${id}/verify`, {}, {
        headers: getAuthHeaders(),
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'properties'] })
    },
  })
}

// Reject property (admin)
export function useRejectProperty() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, reason }) => {
      const response = await axios.put(`${BASE}/admin/properties/${id}/reject`, 
        { reason },
        { headers: getAuthHeaders() }
      )
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'properties'] })
    },
  })
}

// Toggle featured (admin)
export function useToggleFeatured() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, featuredUntil }) => {
      const response = await axios.put(`${BASE}/admin/properties/${id}/feature`,
        { featuredUntil },
        { headers: getAuthHeaders() }
      )
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'properties'] })
    },
  })
}

// Submit inquiry (public)
export function useSubmitInquiry() {
  return useMutation({
    mutationFn: async ({ propertyId, ...inquiryData }) => {
      const response = await axios.post(
        `${BASE}/properties/${propertyId}/inquiry`,
        inquiryData
      )
      return response.data
    },
  })
}

// Request viewing (public)
export function useRequestViewing() {
  return useMutation({
    mutationFn: async ({ propertyId, ...viewingData }) => {
      const response = await axios.post(
        `${BASE}/properties/${propertyId}/viewing`,
        viewingData
      )
      return response.data
    },
  })
}

// Upload property images (cloudinary)
export function useUploadPropertyImages() {
  return useMutation({
    mutationFn: async (formData) => {
      const response = await axios.post(`${BASE}/cloudinary/upload-multiple`, formData, {
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'multipart/form-data',
        },
      })
      return response.data
    },
  })
}
