import { useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { ArrowRight, MapPin, Calendar, DollarSign, Star, Eye } from 'lucide-react'
import PropTypes from 'prop-types'

const EnhancedProjectCard = ({ project, index }) => {
  const cardRef = useRef(null)
  const imageRef = useRef(null)
  const contentRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const card = cardRef.current
    const image = imageRef.current
    const content = contentRef.current

    if (!card) return

    const ctx = gsap.context(() => {
      // Initial state
      gsap.set(content, { y: 20, opacity: 0 })

      // Card entrance animation
      gsap.fromTo(card,
        { y: 60, opacity: 0, scale: 0.95 },
        { 
          y: 0, 
          opacity: 1, 
          scale: 1, 
          duration: 0.6, 
          delay: index * 0.1,
          ease: 'power2.out',
          onComplete: () => {
            // Animate content after card is in place
            gsap.to(content, {
              y: 0,
              opacity: 1,
              duration: 0.4,
              ease: 'power2.out'
            })
          }
        }
      )

      // Hover effects
      const handleMouseEnter = () => {
        gsap.to(image, {
          scale: 1.1,
          duration: 0.5,
          ease: 'power2.out'
        })
        gsap.to(card, {
          y: -8,
          duration: 0.3,
          ease: 'power2.out'
        })
      }

      const handleMouseLeave = () => {
        gsap.to(image, {
          scale: 1,
          duration: 0.5,
          ease: 'power2.out'
        })
        gsap.to(card, {
          y: 0,
          duration: 0.3,
          ease: 'power2.out'
        })
      }

      card.addEventListener('mouseenter', handleMouseEnter)
      card.addEventListener('mouseleave', handleMouseLeave)

      return () => {
        card.removeEventListener('mouseenter', handleMouseEnter)
        card.removeEventListener('mouseleave', handleMouseLeave)
      }
    }, cardRef)

    return () => ctx.revert()
  }, [index])

  const handleCardClick = () => {
    navigate(`/projects/${project.slug || project.id}`)
  }

  const handleArrowClick = (e) => {
    e.stopPropagation()
    navigate(`/projects/${project.slug || project.id}`)
  }

  const handleQuickView = (e) => {
    e.stopPropagation()
    // Quick view functionality can be implemented later
    console.log('Quick view:', project)
  }

  const formatPrice = (price, currency = 'USD') => {
    if (!price) return 'Price on request'
    const formatted = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price)
    
    return currency === 'RWF' ? `${formatted} Rwf` : `${formatted} USD`
  }

  const mainImage = project.images?.[0]?.url || '/project1.png'
  
  // Determine price display
  let priceDisplay = 'Price on request'
  if (project.pricingTiers?.length > 0) {
    const firstTier = project.pricingTiers[0]
    const lastTier = project.pricingTiers[project.pricingTiers.length - 1]
    priceDisplay = `${formatPrice(firstTier.amount, firstTier.currency)} - ${formatPrice(lastTier.amount, lastTier.currency)}`
  } else if (project.basePrice) {
    priceDisplay = formatPrice(project.basePrice, project.currency)
  }

  return (
    <div
      ref={cardRef}
      className="group cursor-pointer bg-slate-900/50 rounded-2xl overflow-hidden border border-slate-700/50 hover:border-riec-orange/50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-riec-orange/20"
      onClick={handleCardClick}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          ref={imageRef}
          src={mainImage}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out"
        />
        
        {/* Overlay Badges */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Top Badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          {project.featured && (
            <span className="bg-riec-orange text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
              Featured
            </span>
          )}
          {project.purchasable && (
            <span className="bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
              For Sale
            </span>
          )}
        </div>

        {/* Quick Actions */}
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handleQuickView}
            className="bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-lg hover:bg-white transition-all duration-200 hover:scale-110"
            aria-label="Quick view"
          >
            <Eye className="w-4 h-4 text-slate-900" />
          </button>
        </div>

        {/* Category Badge */}
        <div className="absolute bottom-4 left-4">
          <span className="bg-slate-900/80 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-lg border border-white/20">
            {project.category?.toLowerCase() || 'residential'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div ref={contentRef} className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <p className="text-riec-orange font-bold text-xs uppercase tracking-wider mb-2">
              {project.category?.toLowerCase() || 'residential'} • {project.type?.toLowerCase().replace('_', ' ') || 'completed'}
            </p>
            <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-riec-orange transition-colors duration-300">
              {project.title}
            </h3>
          </div>
          <div className="text-right ml-4">
            <p className="text-slate-400 font-semibold text-sm mb-1">
              {project.year || new Date().getFullYear()}
            </p>
            {project.rating && (
              <div className="flex items-center gap-1 text-yellow-400">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-sm font-semibold">{project.rating}</span>
              </div>
            )}
          </div>
        </div>

        {/* Service Tags */}
          {project.services?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {project.services.slice(0, 3).map((s) => {
                const svc = s.service
                if (!svc) return null
                return (
                  <span key={s.id || svc.id} className="bg-slate-800 text-slate-300 text-[10px] font-medium px-2 py-0.5 rounded-full border border-slate-700/50">
                    {svc.name}
                  </span>
                )
              })}
              {project.services.length > 3 && (
                <span className="text-[10px] text-slate-500 self-center">+{project.services.length - 3}</span>
              )}
            </div>
          )}

          {/* Description */}
        <p className="text-slate-300 text-sm mb-4 line-clamp-2 leading-relaxed">
          {project.description?.replace(/<[^>]*>/g, '') || project.description}
        </p>

        {/* Key Details */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2 text-slate-400">
            <MapPin className="w-4 h-4 text-riec-orange" />
            <span className="text-xs truncate">{project.location || 'Kigali, Rwanda'}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <Calendar className="w-4 h-4 text-riec-orange" />
            <span className="text-xs">{project.year || '2024'}</span>
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mb-4">
          <DollarSign className="w-4 h-4 text-riec-orange" />
          <span className="text-white font-bold text-sm">{priceDisplay}</span>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {[...Array(Math.min(3, (project.team?.length || 0)))].map((_, i) => (
                <div
                  key={i}
                  className="w-6 h-6 bg-riec-orange rounded-full border-2 border-slate-900 flex items-center justify-center text-xs font-bold text-white"
                >
                  {String.fromCharCode(65 + i)}
                </div>
              ))}
            </div>
            {project.team?.length > 3 && (
              <span className="text-xs text-slate-400">+{project.team.length - 3}</span>
            )}
          </div>
          
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              navigate(`/projects/${project.slug || project.id}`)
            }}
            className="flex items-center gap-2 text-riec-orange font-semibold text-sm group-hover:gap-3 transition-all duration-300 hover:scale-105 cursor-pointer"
            aria-label="View project details"
          >
            View Details
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 pointer-events-none" />
          </button>
        </div>
      </div>
    </div>
  )
}

EnhancedProjectCard.propTypes = {
  project: PropTypes.shape({
    id: PropTypes.string.isRequired,
    slug: PropTypes.string,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    location: PropTypes.string,
    category: PropTypes.string,
    type: PropTypes.string,
    year: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    featured: PropTypes.bool,
    purchasable: PropTypes.bool,
    rating: PropTypes.number,
    images: PropTypes.array,
    pricingTiers: PropTypes.array,
    services: PropTypes.array,
    team: PropTypes.array
  }).isRequired,
  index: PropTypes.number
}

export default EnhancedProjectCard
