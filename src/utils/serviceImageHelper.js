/**
 * Get default image for a service based on its slug or name
 * This ensures every service has a meaningful default image
 * Uses high-quality modern professional images from Unsplash
 */
export const getServiceDefaultImage = (service) => {
  // If service has images, use the first one
  if (service?.images?.[0]?.url) return service.images[0].url
  if (service?.heroImage) return service.heroImage
  if (service?.imageUrl) return service.imageUrl
  
  // Map service slugs/names to modern professional images
  const slug = (service?.slug || '').toLowerCase()
  const name = (service?.name || service?.title || '').toLowerCase()
  
  // Interior Design - Modern interior (check first to avoid conflict)
  if (slug.includes('interior') || name.includes('interior')) {
    return 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&q=80'
  }
  
  // Land Surveying - Professional land surveying work (LOCAL IMAGE)
  if (slug.includes('land') || name.includes('land survey')) {
    return '/land_surveying.png'
  }
  
  // Boundary Surveying - Survey equipment/GPS
  if (slug.includes('boundary') || name.includes('boundary')) {
    return 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200&q=80'
  }
  
  // Topographic Surveying - Aerial/topographic view
  if (slug.includes('topo') || name.includes('topograph')) {
    return 'https://images.unsplash.com/photo-1589519160732-57fc498494f8?w=1200&q=80'
  }
  
  // Construction - Modern construction site
  if (slug.includes('construction') || name.includes('construction')) {
    return 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1200&q=80'
  }
  
  // House Design / Architecture - Modern house exterior
  if (slug.includes('design') || slug.includes('architecture') || slug.includes('house') ||
      name.includes('design') || name.includes('architecture') || name.includes('house')) {
    return 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80'
  }
  
  // Supervision - Construction supervisor/engineer
  if (slug.includes('supervision') || name.includes('supervision')) {
    return 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=1200&q=80'
  }
  
  // Property Valuation/Evaluation - Professional with clipboard
  if (slug.includes('evaluation') || slug.includes('valuation') || 
      name.includes('evaluation') || name.includes('valuation')) {
    return 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=80'
  }
  
  // Default fallback - Modern construction/architecture
  return 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200&q=80'
}
