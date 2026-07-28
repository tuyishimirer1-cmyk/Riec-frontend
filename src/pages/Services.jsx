/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import {
  Compass, Ruler, Map as MapIcon, Layers,
  Palette, Home, HardHat, DollarSign,
  CheckCircle, Wrench,
} from 'lucide-react'
import ServiceSection from '../components/page_elements/Services/ServiceSection'
import ScrollIndicator from '../components/page_elements/Services/ScrollIndicator'
import ProcessModal from '../components/modals/ProcessModal'
import { useGetServices, useGetServiceImages } from '../react-query'

const TASK_ICONS = [Layers, CheckCircle, Wrench]

const truncate = (str, limit) => {
  if (!str) return ''
  const words = str.split(' ')
  return words.length > limit ? words.slice(0, limit).join(' ') + '…' : str
}

function ServiceSectionWithImage({ service, index, onViewProjects, onViewProcess }) {
  const { data: images } = useGetServiceImages(service.id, { limit: 1 })
  const image = images?.[0]?.url || '/service-placeholder.png'
  return (
    <ServiceSection
      key={service.id}
      id={service.id}
      title={service.title}
      description={service.description}
      features={service.features}
      image={image}
      index={index}
      onViewProjects={() => onViewProjects(service)}
      onViewProcess={() => onViewProcess(service)}
    />
  )
}

function Services() {
  const [activeSection, setActiveSection] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(6)
  const [selectedService, setSelectedService] = useState(null)
  const [isProcessModalOpen, setIsProcessModalOpen] = useState(false)

  const { data: servicesData, isFetching } = useGetServices({ page, pageSize })
  const servicesList = servicesData?.items || []
  const total = servicesData?.total || 0

  const handleViewProjects = (service) => {
    // Navigate to service details page
    window.location.href = `/services/${service.id}`
  }

  const handleViewProcess = (service) => {
    setSelectedService(service)
    setIsProcessModalOpen(true)
  }

  const iconMap = {
    surveying: Compass,
    boundary: Ruler,
    topographic: MapIcon,
    'construction-layout': Layers,
    'interior-design': Palette,
    'house-design': Home,
    'construction-supervision': HardHat,
    'property-valuation': DollarSign,
  }

  const services = useMemo(
    () =>
      servicesList.map((service, index) => {
        const id =
          service.id ||
          service.slug ||
          (service.title || `service-${index}`).toLowerCase().replace(/\s+/g, '-')
        const Icon =
          iconMap[id] ||
          Object.values(iconMap)[index % Object.values(iconMap).length]
        const features =
          service.mainTasks?.length
            ? service.mainTasks.map((task, i) => {
                const Icon = TASK_ICONS[i % TASK_ICONS.length]
                return {
                  icon: <Icon className="w-6 h-6" />,
                  title: truncate(task.title || `Task ${i + 1}`, 6),
                  // description: truncate(task.description, 3),
                }
              })
            : []

        return {
          id,
          title: service.title || service.name,
          description: service.shortDescription || service.description,
          image: service.imageUrl || '/service-placeholder.png',
          features,
          icon: Icon,
        }
      }),
    [servicesList]
  )

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 2
      for (const service of services) {
        const element = document.getElementById(service.id)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(service.id)
            break
          }
        }
      }
    }
    window.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [services])

  const totalPages = Math.max(1, Math.ceil((total || services.length) / pageSize))

  return (
    <>
      <Helmet>
        <title>Services | R.I.E.C</title>
        <meta name="description" content="R.I.E.C is a construction company in Rwanda that provides high-quality construction services." />
      </Helmet>
      <div className="bg-riec-dark min-h-screen pb-16">
        <ScrollIndicator services={services} activeSection={activeSection} />

        {services.map((service, index) => (
          <ServiceSectionWithImage 
            key={service.id} 
            service={service} 
            index={index}
            onViewProjects={handleViewProjects}
            onViewProcess={handleViewProcess}
          />
        ))}

        <div className="mt-8 flex items-center justify-center gap-4 px-6">
          <button
            type="button"
            onClick={() => setPage((p) => p - 1)}
            disabled={page <= 1 || isFetching}
            className="rounded-full border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-100 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800 transition-colors"
          >
            Previous
          </button>
          <span className="text-xs text-slate-400">Page {page} of {totalPages}</span>
          <button
            type="button"
            onClick={() => setPage((p) => p + 1)}
            disabled={page >= totalPages || isFetching}
            className="rounded-full border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-100 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800 transition-colors"
          >
            Next
          </button>
          <select
            className="ml-4 rounded-full border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-100"
            value={pageSize}
            onChange={(e) => { setPage(1); setPageSize(Number(e.target.value)) }}
          >
            {[6, 9, 12].map((size) => (
              <option key={size} value={size}>{size} / page</option>
            ))}
          </select>
        </div>
      </div>

      {/* Process Modal */}
      <ProcessModal
        isOpen={isProcessModalOpen}
        onClose={() => setIsProcessModalOpen(false)}
        service={selectedService}
      />
    </>
  )
}

export default Services
