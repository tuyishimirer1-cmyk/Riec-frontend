import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { X, ArrowRight } from 'lucide-react'
import PropTypes from 'prop-types'

const ProcessModal = ({ isOpen, onClose, service, onGetQuote }) => {
  const modalRef = useRef(null)
  const overlayRef = useRef(null)
  const contentRef = useRef(null)

  useEffect(() => {
    const modal = modalRef.current
    const overlay = overlayRef.current
    const content = contentRef.current

    if (!modal || !overlay || !content) return

    const ctx = gsap.context(() => {
      if (isOpen) {
        // Reset and set initial states
        gsap.set(overlay, { opacity: 0 })
        gsap.set(modal, { scale: 0.9, opacity: 0 })
        gsap.set(content.children, { y: 30, opacity: 0 })

        // Animate overlay
        gsap.to(overlay, {
          opacity: 1,
          duration: 0.3,
          ease: 'power2.out'
        })

        // Animate modal
        gsap.to(modal, {
          scale: 1,
          opacity: 1,
          duration: 0.4,
          ease: 'back.out(1.7)',
          onComplete: () => {
            // Stagger animate content
            gsap.to(content.children, {
              y: 0,
              opacity: 1,
              duration: 0.5,
              stagger: 0.1,
              ease: 'power2.out'
            })
          }
        })
      } else {
        // Animate out
        gsap.to(content.children, {
          y: -30,
          opacity: 0,
          duration: 0.3,
          stagger: 0.05,
          ease: 'power2.in'
        })

        gsap.to(modal, {
          scale: 0.9,
          opacity: 0,
          duration: 0.3,
          ease: 'power2.in',
          delay: 0.1
        })

        gsap.to(overlay, {
          opacity: 0,
          duration: 0.3,
          ease: 'power2.in',
          delay: 0.2
        })
      }
    }, [modalRef, overlayRef, contentRef])

    return () => ctx.revert()
  }, [isOpen])

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  if (!service) return null

  // Default process steps if service doesn't have custom process
  const defaultProcess = [
    {
      title: 'Consultation',
      description: 'Initial meeting to understand your requirements and project scope'
    },
    {
      title: 'Planning & Design',
      description: 'Detailed planning and design phase with expert architects'
    },
    {
      title: 'Implementation',
      description: 'Professional execution of the project with quality assurance'
    },
    {
      title: 'Quality Review',
      description: 'Final inspection and delivery with comprehensive documentation'
    }
  ]

  let processSteps = defaultProcess
  if (service.process) {
    if (Array.isArray(service.process)) {
      processSteps = service.process
    } else if (typeof service.process === 'string') {
      try { processSteps = JSON.parse(service.process) } catch { processSteps = defaultProcess }
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center p-4 z-50 pointer-events-none">
        <div
          ref={modalRef}
          className="bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 w-full max-w-4xl max-h-[90vh] overflow-hidden pointer-events-auto"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-700/50 flex justify-between items-center bg-slate-800/50">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">Our Process</h2>
              <p className="text-slate-300 text-sm">
                {service.title || service.name} project workflow
              </p>
            </div>
            <button 
              className="text-slate-400 p-2 hover:bg-slate-700/50 rounded-lg transition-all duration-200 hover:text-white hover:scale-105"
              onClick={onClose}
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            <div ref={contentRef} className="space-y-6">
              {processSteps.map((step, index) => (
                <div key={index} className="flex gap-6 p-6 bg-slate-800/30 rounded-xl border border-slate-700/30 hover:bg-slate-800/50 transition-all duration-300 group">
                  {/* Step Number */}
                  <div className="flex-shrink-0 w-12 h-12 bg-riec-orange rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform duration-300">
                    {index + 1}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-bold text-white">{step.title}</h3>
                    </div>
                    <p className="text-slate-300 leading-relaxed">{step.description}</p>
                    
                    {step.details && (
                      <ul className="mt-3 space-y-2">
                        {step.details.map((detail, detailIndex) => (
                          <li key={detailIndex} className="flex items-start gap-2 text-sm text-slate-400">
                            <ArrowRight className="w-4 h-4 text-riec-orange mt-0.5 flex-shrink-0" />
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Call to Action */}
            <div className="mt-8 p-6 bg-gradient-to-r from-riec-orange/20 to-riec-orange/10 rounded-xl border border-riec-orange/30">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-bold text-white mb-1">Start Your Project</h4>
                  <p className="text-slate-300 text-sm">
                    Contact us to discuss your requirements
                  </p>
                </div>
                <button
                  onClick={() => {
                    if (onGetQuote) {
                      onGetQuote()
                    } else {
                      // Fallback: navigate to contact page
                      onClose()
                      window.location.href = '/contact'
                    }
                  }}
                  className="bg-riec-orange text-white px-6 py-3 rounded-lg font-semibold hover:bg-riec-orange-light transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg"
                >
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

ProcessModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  service: PropTypes.shape({
    title: PropTypes.string,
    name: PropTypes.string,
    process: PropTypes.oneOfType([PropTypes.string, PropTypes.array])
  }),
  onGetQuote: PropTypes.func
}

export default ProcessModal
