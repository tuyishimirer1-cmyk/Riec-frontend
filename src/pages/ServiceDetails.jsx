import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { 
  ArrowLeft, 
  ArrowRight, 
  MapPin, 
  Calendar, 
  Clock, 
  CheckCircle,
  Users,
  Award,
  Zap
} from 'lucide-react'
import { useGetService } from '../react-query'
import { useQuoteModal } from '../components/layouts/MainLayout'
import ProcessModal from '../components/modals/ProcessModal'
import EnhancedProjectCard from '../components/page_elements/Projects/EnhancedProjectCard'
import { getServiceDefaultImage } from '../utils/serviceImageHelper'

gsap.registerPlugin(ScrollTrigger)

const ServiceDetails = () => {
  const { serviceId } = useParams()
  const navigate = useNavigate()
  const [isProcessModalOpen, setIsProcessModalOpen] = useState(false)
  const { openQuoteModal } = useQuoteModal() || {}
  
  const handleGetQuote = () => {
    setIsProcessModalOpen(false)
    setTimeout(() => {
      if (openQuoteModal) openQuoteModal()
    }, 100)
  }
  
  // Fetch service details with related published projects included
  const { data: service, isLoading: serviceLoading, error: serviceError } = useGetService(serviceId, {
    include: 'images,projects',
  })

  // Unwrap the nested project relation from the service.projects include
  const projects = (service?.projects || []).map((ps) => ps.project).filter(Boolean)

  const heroRef = useRef(null)
  const contentRef = useRef(null)
  const projectsRef = useRef(null)

  useEffect(() => {
    if (!service) return

    const ctx = gsap.context(() => {
      // Hero animation
      gsap.fromTo(heroRef.current,
        { scale: 0.95, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.8, ease: 'power3.out' }
      )

      // Content sections animation
      gsap.fromTo(contentRef.current?.children || [],
        { y: 50, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.6, 
          stagger: 0.15, 
          ease: 'power2.out',
          scrollTrigger: {
            trigger: contentRef.current,
            start: 'top 80%'
          }
        }
      )

      // Projects animation
      if (projectsRef.current) {
        gsap.fromTo(projectsRef.current.children,
          { y: 60, opacity: 0 },
          { 
            y: 0, 
            opacity: 1, 
            duration: 0.6, 
            stagger: 0.1, 
            ease: 'power2.out',
            scrollTrigger: {
              trigger: projectsRef.current,
              start: 'top 85%'
            }
          }
        )
      }
    }, [heroRef, contentRef, projectsRef])

    return () => ctx.revert()
  }, [service])

  if (serviceLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-riec-dark text-slate-100">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-riec-orange border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm">Loading service details...</p>
        </div>
      </div>
    )
  }

  if (serviceError || !service) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-riec-dark text-slate-100">
        <p className="mb-4 text-sm text-red-400">Service not found</p>
        <button 
          type="button" 
          onClick={() => navigate('/services')} 
          className="rounded-full border border-slate-500 px-6 py-2 text-xs font-semibold hover:bg-slate-800 transition-colors"
        >
          Back to Services
        </button>
      </div>
    )
  }

  const mainImage = getServiceDefaultImage(service)

  // Service features based on mainTasks
  const features = service.mainTasks?.map((task, index) => ({
    icon: index === 0 ? <Award className="w-6 h-6" /> : 
          index === 1 ? <Users className="w-6 h-6" /> : 
          index === 2 ? <Zap className="w-6 h-6" /> : 
          <CheckCircle className="w-6 h-6" />,
    title: task.title,
    description: task.description
  })) || []

  return (
    <>
      <Helmet>
        <title>{service.title || service.name} | R.I.E.C</title>
        <meta name="description" content={service.shortDescription || service.description} />
      </Helmet>

      <div className="min-h-screen bg-riec-dark pb-16">
        {/* Hero Section */}
        <div ref={heroRef} className="relative h-96 overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${mainImage})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-riec-dark/90 via-riec-dark/70 to-riec-dark/95"></div>
          </div>
          
          <div className="relative z-10 h-full flex items-center">
            <div className="max-w-screen-2xl mx-auto px-6 md:px-12 w-full">
              <button 
                type="button"
                onClick={() => navigate('/services')}
                className="mb-6 flex items-center gap-2 text-slate-300 hover:text-riec-orange transition-colors duration-200"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm font-medium">Back to Services</span>
              </button>
              
              <div className="max-w-3xl">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                  {service.title || service.name}
                </h1>
                <p className="text-xl text-slate-200 mb-8 leading-relaxed max-w-2xl">
                  {service.shortDescription || service.description}
                </p>
                
                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={() => setIsProcessModalOpen(true)}
                    className="bg-riec-orange text-white px-8 py-3 rounded-lg font-semibold hover:bg-riec-orange-light transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg"
                  >
                    View Our Process
                  </button>
                  <button
                    type="button"
                    onClick={openQuoteModal}
                    className="bg-white/10 backdrop-blur-sm text-white px-8 py-3 rounded-lg font-semibold border border-white/30 hover:bg-white/20 transition-all duration-300 hover:scale-105"
                  >
                    Send Message
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="max-w-screen-2xl mx-auto px-6 md:px-12 py-16">
          <div ref={contentRef} className="space-y-16">
            {/* Detailed Description */}
            <section>
              <h2 className="text-3xl font-bold text-white mb-6">About This Service</h2>
              <div
                className="prose prose-invert max-w-none text-slate-300 text-lg leading-relaxed"
                dangerouslySetInnerHTML={{ __html: service.detailedDescription || service.description }}
              />
            </section>

            {/* Features */}
            {features.length > 0 && (
              <section>
                <h2 className="text-3xl font-bold text-white mb-6">Key Features</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {features.map((feature, index) => (
                    <div key={index} className="bg-slate-800/50 p-6 rounded-xl border border-slate-700/50 hover:bg-slate-800/70 transition-all duration-300 group">
                      <div className="text-riec-orange mb-4 group-hover:scale-110 transition-transform duration-300">
                        {feature.icon}
                      </div>
                      <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                      <p className="text-slate-300 leading-relaxed">{feature.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Service Stats */}
            <section>
              <h2 className="text-3xl font-bold text-white mb-6">Why Choose Us</h2>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center p-6 bg-slate-800/50 rounded-xl border border-slate-700/50">
                  <div className="text-3xl font-bold text-riec-orange mb-2">15+</div>
                  <p className="text-slate-300">Years Experience</p>
                </div>
                <div className="text-center p-6 bg-slate-800/50 rounded-xl border border-slate-700/50">
                  <div className="text-3xl font-bold text-riec-orange mb-2">500+</div>
                  <p className="text-slate-300">Projects Completed</p>
                </div>
                <div className="text-center p-6 bg-slate-800/50 rounded-xl border border-slate-700/50">
                  <div className="text-3xl font-bold text-riec-orange mb-2">98%</div>
                  <p className="text-slate-300">Client Satisfaction</p>
                </div>
                <div className="text-center p-6 bg-slate-800/50 rounded-xl border border-slate-700/50">
                  <div className="text-3xl font-bold text-riec-orange mb-2">24/7</div>
                  <p className="text-slate-300">Support Available</p>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Related Projects */}
        {projects.length > 0 && (
          <section className="bg-slate-900/50 py-16">
            <div className="max-w-screen-2xl mx-auto px-6 md:px-12">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-white">Related Projects</h2>
                <Link
                  to="/projects"
                  className="flex items-center gap-2 text-riec-orange font-semibold hover:gap-3 transition-all duration-300"
                >
                  View All Projects
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
              
              <div ref={projectsRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project, index) => (
                  <EnhancedProjectCard key={project.id} project={project} index={index} />
                ))}
              </div>

              {serviceLoading && (
                <div className="flex justify-center py-8">
                  <div className="w-8 h-8 border-4 border-riec-orange border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
          </section>
        )}
      </div>

      {/* Process Modal */}
      <ProcessModal
        isOpen={isProcessModalOpen}
        onClose={() => setIsProcessModalOpen(false)}
        service={service}
        onGetQuote={handleGetQuote}
      />
    </>
  )
}

export default ServiceDetails
