import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus, Wrench } from 'lucide-react'
import { useGetServices, useDeleteService, useGetProjects, useSearchServices } from '../../react-query'
import ServiceEditDrawer from './Service/ServiceEditDrawer'
import ServicesGrid from './Service/ServicesGrid'
import DashboardSearchBar from './components/DashboardSearchBar'

export default function ServicesDashboardPage() {
  const { t } = useTranslation()
  const [page,             setPage]             = useState(1)
  const [search,           setSearch]           = useState('')
  const [drawer,           setDrawer]           = useState(null)
  const [expandedServices, setExpandedServices] = useState(new Set())

  const isSearching = search.trim().length >= 2

  const { data: servicesData, isLoading } = useGetServices({ page, limit: 20 })
  const { data: searchData } = useSearchServices(search)
  const deleteServiceMutation = useDeleteService()
  const { data: projectsData } = useGetProjects({ pageSize: 50, include: 'services' })

  const services      = isSearching ? (searchData?.items || []) : (servicesData?.items || [])
  const status        = isLoading ? 'loading' : 'idle'
  const total         = servicesData?.total ?? 0

  const getRelatedProjects = (serviceId) => {
    if (!projectsData?.items) return []
    return projectsData.items
      .filter((p) => p.services?.some((s) => s.serviceId === serviceId))
      .slice(0, 4)
  }

  const handleDelete = async (id) => {
    if (!window.confirm(t('dash.services_page.delete_confirm', { defaultValue: 'Delete this service?' }))) return
    await deleteServiceMutation.mutateAsync(id)
  }

  const toggleServiceExpansion = (serviceId) => {
    setExpandedServices((prev) => {
      const next = new Set(prev)
      next.has(serviceId) ? next.delete(serviceId) : next.add(serviceId)
      return next
    })
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold" style={{ color: 'var(--color-primary)' }}>
            {t('dash.services_page.title', { defaultValue: 'Services' })}
          </h2>
          <p className="text-xs" style={{ color: 'var(--color-body-color)' }}>
            {total} {t('dash.services_page.total', { defaultValue: 'total services' })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <DashboardSearchBar
            value={search}
            onChange={(q) => { setPage(1); setSearch(q) }}
            placeholder={t('dash.services_page.search', { defaultValue: 'Search services…' })}
          />
          <button onClick={() => setDrawer('new')}
            className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold text-white transition-colors"
            style={{ background: 'var(--color-riec-orange)', boxShadow: '0 4px 12px rgba(238,122,24,0.35)' }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-riec-orange-light)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'var(--color-riec-orange)'}
          >
            <Plus className="h-3.5 w-3.5" />
            {t('dash.services_page.new_btn', { defaultValue: 'New Service' })}
          </button>
        </div>
      </div>

      <ServicesGrid
        services={services}
        status={status}
        page={page}
        total={total}
        pageSize={20}
        expandedServices={expandedServices}
        onToggleExpand={toggleServiceExpansion}
        onEdit={(s) => setDrawer(s)}
        onDelete={handleDelete}
        getRelatedProjects={getRelatedProjects}
        onPagePrev={() => setPage((p) => Math.max(1, p - 1))}
        onPageNext={() => setPage((p) => p + 1)}
      />

      {drawer && (
        <ServiceEditDrawer
          editing={drawer === 'new' ? null : drawer}
          onClose={() => setDrawer(null)}
          relatedProjects={projectsData?.items || []}
        />
      )}
    </div>
  )
}