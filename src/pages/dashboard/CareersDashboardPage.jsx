import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus, Briefcase, Eye, EyeOff } from 'lucide-react'
import {
  useGetCareers,
  useGetCareerStats,
  useDeleteCareer,
  usePublishCareer,
  useUnpublishCareer,
  useSearch,
} from '../../react-query'
import CareerModal from './Career/CareerModal'
import CareerEditDrawer from './Career/CareerEditDrawer'
import CareersGrid from './Career/CareersGrid'
import DashboardSearchBar from './components/DashboardSearchBar'

export default function CareersDashboardPage() {
  const { t } = useTranslation()
  const [page,    setPage]    = useState(1)
  const [search,  setSearch]  = useState('')
  const [filters, setFilters] = useState({})
  const [modal,   setModal]   = useState(null)
  const [drawer,  setDrawer]  = useState(null)

  const isSearching = search.trim().length >= 2

  const { data: careersData, isLoading } = useGetCareers({ page, limit: 20, ...filters })
  const { data: searchData } = useSearch(search, filters)
  const { data: stats }   = useGetCareerStats()
  const deleteCareerMutation = useDeleteCareer()
  const publishCareerMutation = usePublishCareer()
  const unpublishCareerMutation = useUnpublishCareer()

  const careers      = isSearching ? (searchData?.items || []) : (careersData?.items || [])
  const status       = isLoading ? 'loading' : 'idle'

  const handleDelete = async (id) => {
    if (!window.confirm(t('dash.careers_page.delete_confirm', { defaultValue: 'Delete this career posting?' }))) return
    await deleteCareerMutation.mutateAsync(id)
  }

  const handlePublish = async (id) => publishCareerMutation.mutateAsync(id)
  const handleUnpublish = async (id) => unpublishCareerMutation.mutateAsync(id)

  const total     = stats?.total     ?? careers.length
  const published = stats?.published ?? careers.filter((c) => c.isPublished).length
  const draft     = total - published

  const STAT_CARDS = [
    { label: t('dash.careers_page.stat_total',     { defaultValue: 'Total Roles' }), value: total,     icon: Briefcase, bg: 'rgba(238,122,24,0.10)', color: 'var(--color-riec-orange)' },
    { label: t('dash.careers_page.stat_published', { defaultValue: 'Published' }),   value: published, icon: Eye,       bg: 'rgba(19,194,150,0.10)', color: 'var(--color-secondary)' },
    { label: t('dash.careers_page.stat_draft',     { defaultValue: 'Draft' }),       value: draft,     icon: EyeOff,    bg: 'rgba(30,154,224,0.10)', color: 'var(--color-my-blue)' },
  ]

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {/* eslint-disable-next-line no-unused-vars */}
        {STAT_CARDS.map(({ label, value, icon: Icon, bg, color }) => (
          <div key={label} className="rounded-2xl bg-white border p-4 flex items-center gap-3"
            style={{ borderColor: 'var(--color-stroke)', boxShadow: 'var(--shadow-1)' }}>
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl"
              style={{ background: bg, color }}>
              <Icon className="h-4 w-4" />
            </div>
            <div>
              <p className="text-lg font-bold leading-none" style={{ color: 'var(--color-primary)' }}>{value}</p>
              <p className="text-[10px] mt-0.5" style={{ color: 'var(--color-body-color)' }}>{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold" style={{ color: 'var(--color-primary)' }}>
            {t('dash.careers_page.title', { defaultValue: 'Careers' })}
          </h2>
          <p className="text-xs" style={{ color: 'var(--color-body-color)' }}>
            {published} {t('dash.careers_page.open_roles', { defaultValue: 'open roles' })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <DashboardSearchBar
            value={search}
            onChange={(q) => { setPage(1); setSearch(q) }}
            placeholder={t('dash.careers_page.search', { defaultValue: 'Search roles…' })}
          />
          <button onClick={() => setModal('new')}
            className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold text-white transition-colors"
            style={{ background: 'var(--color-riec-orange)', boxShadow: '0 4px 12px rgba(238,122,24,0.35)' }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-riec-orange-light)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'var(--color-riec-orange)'}
          >
            <Plus className="h-3.5 w-3.5" />
            {t('dash.careers_page.post_btn', { defaultValue: 'Post Career' })}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <input type="text"
          placeholder={t('dash.careers_page.filter_dept', { defaultValue: 'Department' })}
          onChange={(e) => setFilters((f) => ({ ...f, department: e.target.value || undefined }))}
          className="rounded-xl border px-3 py-2 text-xs focus:outline-none transition-colors"
          style={{ borderColor: 'var(--color-stroke)', background: '#fff', color: 'var(--color-primary)' }}
          onFocus={(e) => e.target.style.borderColor = 'var(--color-riec-orange)'}
          onBlur={(e) => e.target.style.borderColor = 'var(--color-stroke)'}
        />
        <input type="text"
          placeholder={t('dash.careers_page.filter_loc', { defaultValue: 'Location' })}
          onChange={(e) => setFilters((f) => ({ ...f, location: e.target.value || undefined }))}
          className="rounded-xl border px-3 py-2 text-xs focus:outline-none transition-colors"
          style={{ borderColor: 'var(--color-stroke)', background: '#fff', color: 'var(--color-primary)' }}
          onFocus={(e) => e.target.style.borderColor = 'var(--color-riec-orange)'}
          onBlur={(e) => e.target.style.borderColor = 'var(--color-stroke)'}
        />
        <select
          onChange={(e) => setFilters((f) => ({ ...f, published: e.target.value === '' ? undefined : e.target.value === 'true' }))}
          className="rounded-xl border px-3 py-2 text-xs focus:outline-none"
          style={{ borderColor: 'var(--color-stroke)', background: '#fff', color: 'var(--color-primary)' }}>
          <option value="">{t('dash.careers_page.filter_all',       { defaultValue: 'All' })}</option>
          <option value="true">{t('dash.careers_page.filter_live',  { defaultValue: 'Published' })}</option>
          <option value="false">{t('dash.careers_page.filter_draft', { defaultValue: 'Draft' })}</option>
        </select>
      </div>

      <CareersGrid
        careers={careers}
        status={status}
        onEdit={(c) => setDrawer(c)}
        onDelete={handleDelete}
        onPublish={handlePublish}
        onUnpublish={handleUnpublish}
      />

      {/* Pagination */}
      <div className="flex justify-center gap-2">
        <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
          className="rounded-xl border px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-40"
          style={{ borderColor: 'var(--color-stroke)', color: 'var(--color-body-color)' }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-gray-1)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
          {t('dash.careers_page.prev', { defaultValue: 'Previous' })}
        </button>
        <span className="px-3 py-1.5 text-xs" style={{ color: 'var(--color-body-color)' }}>
          {t('dash.careers_page.page', { page, defaultValue: `Page ${page}` })}
        </span>
        <button onClick={() => setPage((p) => p + 1)}
          className="rounded-xl border px-3 py-1.5 text-xs font-medium transition-colors"
          style={{ borderColor: 'var(--color-stroke)', color: 'var(--color-body-color)' }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-gray-1)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
          {t('dash.careers_page.next', { defaultValue: 'Next' })}
        </button>
      </div>

      {modal === 'new' && (
        <CareerModal
          editing={null}
          onClose={() => setModal(null)}
        />
      )}

      {drawer && (
        <CareerEditDrawer
          editing={drawer}
          onClose={() => setDrawer(null)}
        />
      )}
    </div>
  )
}
