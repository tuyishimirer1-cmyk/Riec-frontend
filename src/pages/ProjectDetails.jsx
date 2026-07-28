import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Users, 
  FileText, 
  Download, 
  Eye,
  Share2,
  Heart,
  Star,
  CheckCircle,
  ArrowRight,
  Home,
  Grid3X3
} from 'lucide-react'
import {
  useAddFavorite,
  useCreateCheckout,
  useGetFavoriteStatus,
  useGetProjectAssetDownloadUrl,
  useGetProjectBySlug,
  useRemoveFavorite,
} from '../react-query'
import EnhancedProjectCard from '../components/page_elements/Projects/EnhancedProjectCard'

const ProjectDetails = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [isLiked, setIsLiked] = useState(false)
  const [isShared, setIsShared] = useState(false)
  const [buyerInfo, setBuyerInfo] = useState({ fullName: '', email: '' })

  // Use React Query directly instead of Redux selectors
  const { data: project, isLoading, error } = useGetProjectBySlug(slug, { enabled: !!slug })
  const { data: favoriteStatus } = useGetFavoriteStatus(slug)
  const addFavoriteMutation = useAddFavorite()
  const removeFavoriteMutation = useRemoveFavorite()
  const createCheckoutMutation = useCreateCheckout()
  const fetchDownloadUrlMutation = useGetProjectAssetDownloadUrl()

  const heroRef = useRef(null)
  const sectionsRef = useRef(null)
  const galleryRef = useRef(null)

  useEffect(() => {
    if (!project) return

    const ctx = gsap.context(() => {
      // Hero animation with popping effect
      gsap.fromTo(heroRef.current,
        { scale: 0.8, opacity: 0, rotationY: 10 },
        { scale: 1, opacity: 1, rotationY: 0, duration: 1.2, ease: 'elastic.out(1, 0.5)' }
      )

      // Floating elements animation
      gsap.fromTo('.floating-element',
        { y: 0, rotation: 0 },
        { 
          y: -10, 
          rotation: 5, 
          duration: 3, 
          repeat: -1, 
          yoyo: true,
          ease: 'power1.inOut'
        }
      )

      // Sections animation with stagger
      if (sectionsRef.current) {
        gsap.fromTo(sectionsRef.current.children,
          { y: 60, opacity: 0, scale: 0.9 },
          { 
            y: 0, 
            opacity: 1, 
            scale: 1,
            duration: 0.8, 
            stagger: 0.2, 
            ease: 'back.out(1.7)',
            scrollTrigger: {
              trigger: sectionsRef.current,
              start: 'top 80%'
            }
          }
        )
      }

      // Gallery animation with popping effect
      if (galleryRef.current) {
        gsap.fromTo(galleryRef.current.children,
          { y: 40, opacity: 0, scale: 0.8, rotationX: 15 },
          { 
            y: 0, 
            opacity: 1, 
            scale: 1, 
            rotationX: 0,
            duration: 0.7, 
            stagger: 0.1, 
            ease: 'back.out(1.2)',
            scrollTrigger: {
              trigger: galleryRef.current,
              start: 'top 85%'
            }
          }
        )
      }
    }, [heroRef, sectionsRef, galleryRef])

    return () => ctx.revert()
  }, [project])

  useEffect(() => {
    if (typeof favoriteStatus?.favorited === 'boolean') {
      setIsLiked(favoriteStatus.favorited)
    }
  }, [favoriteStatus])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-riec-dark text-slate-100">
        <div className="text-center">
          <div className="relative w-16 h-16 mb-6">
            <div className="absolute inset-0 animate-blob opacity-20" style={{ background: 'var(--color-riec-orange)' }}></div>
            <div className="absolute inset-0 animate-spin border-4 border-riec-orange border-t-transparent rounded-full"></div>
          </div>
          <p className="text-sm animate-fade-in-up">Loading project details...</p>
        </div>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-riec-dark text-slate-100">
        <div className="text-center max-w-md">
          <div className="mb-8 animate-blob" style={{ width: '120px', height: '120px', background: 'var(--color-riec-orange)' }}></div>
          <h2 className="text-2xl font-bold text-white mb-4">Project Not Found</h2>
          <p className="text-slate-400 mb-6">The project you're looking for doesn't exist or has been moved.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              type="button" 
              onClick={() => navigate('/projects')} 
              className="rounded-full border border-slate-500 px-6 py-3 text-sm font-semibold hover:bg-slate-800 transition-all duration-300 hover:scale-105"
            >
              <Grid3X3 className="w-4 h-4 mr-2" />
              Browse All Projects
            </button>
            <button 
              type="button" 
              onClick={() => navigate('/')} 
              className="rounded-full bg-riec-orange px-6 py-3 text-sm font-semibold text-white hover:bg-riec-orange-light transition-all duration-300 hover:scale-105"
            >
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!project) return null

  const { title, location, category, type, description, images = [], pricingTiers = [], assets = [], services = [], purchasable, featured } = project
  const mainImage = images[0]?.url || '/project1.png'

  const hasAuth = () => {
    try {
      const raw = localStorage.getItem('riec_auth')
      if (!raw) return false
      const parsed = JSON.parse(raw)
      return !!parsed?.accessToken
    } catch {
      return false
    }
  }

  const handleToggleFavorite = async () => {
    if (!hasAuth()) {
      window.alert('Please log in to save favorites.')
      navigate('/login')
      return
    }

    try {
      if (isLiked) {
        await removeFavoriteMutation.mutateAsync(slug)
        setIsLiked(false)
      } else {
        await addFavoriteMutation.mutateAsync(slug)
        setIsLiked(true)
      }
    } catch (e) {
      const message = e?.response?.data?.message || 'Unable to update favorites.'
      window.alert(Array.isArray(message) ? message.join(', ') : message)
    }
  }

  const handleCheckout = async (tierId) => {
    if (!buyerInfo.fullName || !buyerInfo.email) {
      window.alert('Please enter your full name and email before checkout.')
      return
    }

    try {
      const result = await createCheckoutMutation.mutateAsync({
        projectId: project.id,
        tierId,
        fullName: buyerInfo.fullName,
        email: buyerInfo.email,
      })

      const checkoutLink = result?.link || result?.paymentLink || result?.checkoutUrl || result?.url
      if (checkoutLink) window.open(checkoutLink, '_blank', 'noopener,noreferrer')
    } catch (e) {
      const message = e?.response?.data?.message || 'Unable to start checkout.'
      window.alert(Array.isArray(message) ? message.join(', ') : message)
    }
  }

  const handleDownload = async (assetId) => {
    try {
      const result = await fetchDownloadUrlMutation.mutateAsync({ projectId: project.id, assetId })
      const downloadUrl = result?.downloadUrl || result?.url
      if (downloadUrl) window.open(downloadUrl, '_blank', 'noopener,noreferrer')
    } catch (e) {
      const message = e?.response?.data?.message || 'Unable to generate download link.'
      window.alert(Array.isArray(message) ? message.join(', ') : message)
    }
  }

  return (
    <div className="min-h-screen bg-riec-dark pb-16">
      <Helmet><title>{title ? `${title} | R.I.E.C` : 'Project | R.I.E.C'}</title></Helmet>

      <div className="mx-auto max-w-screen-2xl px-4 pt-28 md:px-8">
        {/* Back Navigation */}
        <button 
          type="button" 
          onClick={() => navigate('/projects')} 
          className="mb-8 group flex items-center gap-2 text-slate-300 hover:text-riec-orange transition-all duration-300 hover:gap-3"
        >
          <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
          <span className="text-sm font-medium">Back to Projects</span>
        </button>

        {/* Enhanced Hero Section with Popping Design */}
        <div ref={heroRef} className="relative overflow-hidden rounded-3xl bg-slate-900/80 shadow-[0_30px_120px_rgba(0,0,0,0.6)] mb-16">
          {/* Floating Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-10 left-10 w-20 h-20 animate-blob opacity-10" style={{ background: 'var(--color-riec-orange)' }}></div>
            <div className="absolute top-1/2 right-20 w-16 h-16 animate-blob opacity-10" style={{ background: 'var(--color-riec-yellow)', animationDelay: '1s' }}></div>
            <div className="absolute bottom-10 left-1/4 w-24 h-24 animate-blob opacity-10" style={{ background: 'var(--color-riec-red)', animationDelay: '2s' }}></div>
          </div>
          
          <div className="relative z-10 grid gap-0 md:grid-cols-2">
            {/* Image Gallery */}
            <div className="relative h-80 w-full md:h-full">
              <img src={mainImage} alt={title} className="h-full w-full object-cover transition-transform duration-700 hover:scale-110" />
              {featured && (
                <span className="absolute left-4 top-4 rounded-full bg-riec-orange px-3 py-1 text-xs font-semibold text-white animate-fade-in-up floating-element">
                  Featured
                </span>
              )}
              
              {/* Enhanced Image Actions */}
              <div className="absolute top-4 right-4 flex gap-2">
                <button className="group bg-white/90 backdrop-blur-sm p-3 rounded-xl shadow-lg hover:bg-white hover:scale-110 transition-all duration-300">
                  <Eye className="w-5 h-5 text-slate-900 group-hover:text-riec-orange transition-colors duration-300" />
                </button>
                <button 
                  onClick={() => setIsShared(!isShared)}
                  className="group bg-white/90 backdrop-blur-sm p-3 rounded-xl shadow-lg hover:bg-white hover:scale-110 transition-all duration-300"
                >
                  <Share2 className={`w-5 h-5 text-slate-900 transition-colors duration-300 ${isShared ? 'text-riec-orange' : 'group-hover:text-riec-orange'}`} />
                </button>
                <button 
                  onClick={handleToggleFavorite}
                  className="group bg-white/90 backdrop-blur-sm p-3 rounded-xl shadow-lg hover:bg-white hover:scale-110 transition-all duration-300"
                >
                  <Heart className={`w-5 h-5 transition-colors duration-300 ${isLiked ? 'fill-current text-riec-orange' : 'text-slate-900 group-hover:text-riec-orange'}`} />
                </button>
              </div>
            </div>
            
            {/* Enhanced Project Info */}
            <div className="flex flex-col justify-between p-8 md:p-12">
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <span className="bg-riec-orange/20 text-riec-orange text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wider animate-fade-in-up">
                    {type?.toLowerCase().replace('_', ' ') || 'completed'}
                  </span>
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                    {title}
                  </h1>
                </div>
                
                <div className="flex items-center gap-6 mb-6">
                  <div className="flex items-center gap-2 text-slate-300">
                    <MapPin className="w-5 h-5 text-riec-orange" />
                    <span className="text-sm">{location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <Calendar className="w-5 h-5 text-riec-orange" />
                    <span className="text-sm">{new Date().getFullYear()}</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-3 mb-8">
                  {category && <span className="bg-slate-800 px-4 py-2 text-xs uppercase tracking-wide text-slate-200 rounded-full animate-fade-in-up" style={{ animationDelay: '0.3s' }}>{category}</span>}
                  {purchasable && <span className="bg-emerald-500/20 px-4 py-2 text-xs font-semibold text-emerald-300 rounded-full animate-fade-in-up" style={{ animationDelay: '0.4s' }}>Plan purchasable</span>}
                </div>
              </div>
              
              <p className="text-slate-200 text-sm md:text-base leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.5s' }}>{description}</p>
            </div>
          </div>
        </div>

        {/* Project Sections */}
        <div ref={sectionsRef} className="space-y-16">
          {/* Associated Services */}
          {services.length > 0 && (
            <section>
              <h2 className="mb-8 text-3xl font-bold text-white animate-fade-in-up">Services</h2>
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {services.map((s) => {
                  const svc = s.service
                  if (!svc) return null
                  return (
                    <Link
                      key={s.id || svc.id}
                      to={`/services/${svc.slug}`}
                      className="group bg-slate-900/80 p-6 rounded-2xl border border-slate-700/50 hover:border-riec-orange/50 transition-all duration-300 hover:scale-[1.02]"
                    >
                      <h3 className="text-lg font-bold text-white group-hover:text-riec-orange transition-colors mb-2">{svc.name}</h3>
                      {svc.shortDescription && (
                        <p className="text-sm text-slate-400 leading-relaxed">{svc.shortDescription}</p>
                      )}
                    </Link>
                  )
                })}
              </div>
            </section>
          )}

          {/* Enhanced Image Gallery */}
          {images.length > 1 && (
            <section>
              <h2 className="mb-8 text-3xl font-bold text-white animate-fade-in-up">Project Gallery</h2>
              <div ref={galleryRef} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {images.map((image, index) => (
                  <div key={index} className="group relative overflow-hidden rounded-2xl bg-slate-800/50 aspect-4/3 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
                    <img 
                      src={image.url} 
                      alt={image.caption || `${title} ${index + 1}`} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/0 via-black/20 to-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                      <div className="bg-white/90 backdrop-blur-sm p-3 rounded-xl">
                        <Eye className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Enhanced Pricing Tiers */}
          {pricingTiers.length > 0 && (
            <section>
              <h2 className="mb-8 text-3xl font-bold text-white animate-fade-in-up">Pricing Options</h2>

              {purchasable && (
                <div className="mb-6 space-y-3 rounded-2xl border border-slate-700 bg-slate-900/70 p-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <input
                      value={buyerInfo.fullName}
                      onChange={(e) => setBuyerInfo((prev) => ({ ...prev, fullName: e.target.value }))}
                      placeholder="Full name"
                      className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-riec-orange focus:outline-none"
                    />
                    <input
                      type="email"
                      value={buyerInfo.email}
                      onChange={(e) => setBuyerInfo((prev) => ({ ...prev, email: e.target.value }))}
                      placeholder="Email"
                      className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-riec-orange focus:outline-none"
                    />
                  </div>

                  <p className="rounded-xl border border-riec-orange/30 bg-riec-orange/10 px-3 py-2 text-xs text-slate-200">
                    After successful payment, a download token will be sent to this email. Use that token on the payment result page to unlock purchased files.
                  </p>
                </div>
              )}

              <div className="grid gap-8 md:grid-cols-3">
                {pricingTiers.map((tier, index) => (
                  <div key={tier.id || tier.name} className="group bg-slate-900/80 p-8 text-slate-100 rounded-3xl shadow-[0_18px_60px_rgba(0,0,0,0.6)] border border-slate-700/50 hover:border-riec-orange/50 transition-all duration-300 hover:scale-105 animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="flex justify-between items-start mb-6">
                      <p className="text-xs uppercase tracking-[0.25em] text-slate-400 font-semibold">{tier.name}</p>
                      {tier.isActive && <CheckCircle className="w-6 h-6 text-green-400 animate-fade-in-up" style={{ animationDelay: `${index * 0.1 + 0.2}s` }} />}
                    </div>
                    <p className="mb-6 text-3xl font-bold animate-fade-in-up" style={{ animationDelay: `${index * 0.1 + 0.1}s` }}>
                      {tier.priceLabel || (tier.amount != null ? `${tier.currency || ''} ${tier.amount}` : '')}
                    </p>
                    {tier.description && <p className="text-sm text-slate-300 animate-fade-in-up" style={{ animationDelay: `${index * 0.1 + 0.2}s` }}>{tier.description}</p>}
                    
                    <button
                      onClick={() => handleCheckout(tier.id)}
                      disabled={createCheckoutMutation.isPending}
                      className="mt-8 w-full bg-riec-orange text-white px-8 py-4 rounded-xl font-semibold hover:bg-riec-orange-light transition-all duration-300 hover:scale-105 group disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <span className="transition-transform duration-300 group-hover:translate-x-1">Purchase Plan</span>
                      <ArrowRight className="inline-block w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-2" />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Enhanced Assets/Documents */}
          {assets.length > 0 && (
            <section>
              <h2 className="mb-8 text-3xl font-bold text-white animate-fade-in-up">Project Documents</h2>
              <div className="overflow-x-auto rounded-3xl bg-slate-900/80 text-sm text-slate-100 shadow-[0_18px_60px_rgba(0,0,0,0.6)]">
                <table className="min-w-full">
                  <thead className="border-b border-slate-700 text-slate-400">
                    <tr>
                      <th className="px-6 py-4 text-left font-semibold">Document Type</th>
                      <th className="px-6 py-4 text-left font-semibold">Version</th>
                      <th className="px-6 py-4 text-left font-semibold">Uploaded by</th>
                      <th className="px-6 py-4 text-left font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assets.map((asset, index) => (
                      <tr key={asset.id} className="border-b border-slate-700/60 last:border-b-0 hover:bg-slate-800/30 transition-all duration-200 animate-fade-in-up" style={{ animationDelay: `${index * 0.05}s` }}>
                        <td className="px-6 py-4">{asset.documentType || asset.type}</td>
                        <td className="px-6 py-4">{asset.version || '—'}</td>
                        <td className="px-6 py-4">{asset.uploadedBy?.name || '—'}</td>
                        <td className="px-6 py-4">
                          <div className="flex gap-3">
                            <button className="group text-riec-orange hover:text-riec-orange-light transition-colors duration-300 hover:scale-110">
                              <Eye className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                            </button>
                            {asset.isDownloadable && (
                              <button
                                onClick={() => handleDownload(asset.id)}
                                className="group text-riec-orange hover:text-riec-orange-light transition-colors duration-300 hover:scale-110"
                              >
                                <Download className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProjectDetails
