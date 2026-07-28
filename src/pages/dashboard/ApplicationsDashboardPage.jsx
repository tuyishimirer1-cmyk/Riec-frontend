import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Users, UserCheck, Clock, Star } from 'lucide-react'
import { useGetApplications, useGetApplicationStats, useUpdateApplication, useBulkUpdateApplications, useDeleteApplication } from '../../react-query'
import { APPLICATION_STATUS } from '../../react-query'
import ApplicationsTable from './Application/ApplicationsTable'
import ApplicationDetailDrawer from './Application/ApplicationDetailDrawer'
import DashboardSearchBar from './components/DashboardSearchBar'

const inputCls = 'rounded-xl border px-3 py-2 text-xs focus:outline-none transition-colors'
const inputStyle = { borderColor: 'var(--color-stroke)', background: '#fff', color: 'var(--color-primary)' }

export default function ApplicationsDashboardPage() {
  const { t } = useTranslation()
  const [page,      setPage]      = useState(1)
  const [search,    setSearch]    = useState('')
  const [filters,   setFilters]   = useState({})
  const [selected,  setSelected]  = useState([])
  const [bulkStatus, setBulkStatus] = useState('')
  const [viewing,   setViewing]   = useState(null)

  const { data: applicationsData, isLoading } = useGetApplications({
    page,
    limit: 20,
    search: search.trim() || undefined,
    ...filters,
  })
  const { data: statsData } = useGetApplicationStats()
  const updateApplicationMutation = useUpdateApplication()
  const bulkUpdateApplicationsMutation = useBulkUpdateApplications()
  const deleteApplicationMutation = useDeleteApplication()

  const applications = applicationsData?.items || []
  const total = applicationsData?.total ?? 0
  const status = isLoading ? 'loading' : 'idle'

  const stats = statsData ?? {}
  const byStatus = (s) => {
    const row = stats.byStatus?.find((x) => x.status === s)
    if (!row) return 0
    return typeof row._count === 'number' ? row._count : row._count?._all ?? 0
  }

  const handleStatusUpdate = async (id, newStatus) => {
    await updateApplicationMutation.mutateAsync({ id, status: newStatus }).catch(() => {})
  }

  const handleDelete = async (id) => {
    if (!window.confirm(t('dash.applications_page.delete_confirm', { defaultValue: 'Delete this application?' }))) return
    await deleteApplicationMutation.mutateAsync(id)
  }

  const handleBulkUpdate = async () => {
    if (!bulkStatus || !selected.length) return
    await bulkUpdateApplicationsMutation.mutateAsync({ applicationIds: selected, status: bulkStatus })
    setSelected([])
    setBulkStatus('')
  }

  const handleSelectToggle = (id) =>
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])

  const STAT_CARDS = [
    { label: t('dash.kpi.applications', { defaultValue: 'Total' }),   value: stats.total ?? total, icon: Users,     bg: 'rgba(30,154,224,0.10)',  color: 'var(--color-my-blue)' },
    { label: 'New',         value: byStatus(APPLICATION_STATUS.NEW),         icon: Clock,     bg: 'rgba(238,122,24,0.10)',  color: 'var(--color-riec-orange)' },
    { label: 'Shortlisted', value: byStatus(APPLICATION_STATUS.SHORTLISTED), icon: Star,      bg: 'rgba(19,194,150,0.10)',  color: 'var(--color-secondary)' },
    { label: 'Hired',       value: byStatus(APPLICATION_STATUS.HIRED),       icon: UserCheck, bg: 'rgba(133,80,11,0.10)',   color: '#85500B' },
  ]

  return (
    <div className="space-y-4">

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
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

      {/* Header + filters */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold" style={{ color: 'var(--color-primary)' }}>
            {t('dash.applications_page.title', { defaultValue: 'Applications' })}
          </h2>
          <p className="text-xs" style={{ color: 'var(--color-body-color)' }}>
            {total} {t('dash.applications_page.total', { defaultValue: 'total' })}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <DashboardSearchBar
            value={search}
            onChange={(q) => { setPage(1); setSearch(q) }}
            placeholder={t('dash.applications_page.search', { defaultValue: 'Search applicants…' })}
          />
          <input type="text"
            placeholder={t('dash.applications_page.filter_job', { defaultValue: 'Filter by Job ID' })}
            onChange={(e) => setFilters((f) => ({ ...f, jobId: e.target.value || undefined }))}
            className={inputCls} style={inputStyle}
            onFocus={(e) => e.target.style.borderColor = 'var(--color-riec-orange)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--color-stroke)'}
          />
          <select
            onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value || undefined }))}
            className={inputCls} style={inputStyle}>
            <option value="">{t('dash.applications_page.all_status', { defaultValue: 'All Status' })}</option>
            {Object.values(APPLICATION_STATUS).map((s) => (
              <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Bulk actions */}
      {selected.length > 0 && (
        <div className="flex flex-wrap items-center gap-3 rounded-xl border px-4 py-3"
          style={{ borderColor: 'var(--color-stroke)', background: 'var(--color-gray-1)' }}>
          <span className="text-xs font-semibold" style={{ color: 'var(--color-primary)' }}>
            {selected.length} {t('dash.applications_page.selected', { defaultValue: 'selected' })}
          </span>
          <select value={bulkStatus} onChange={(e) => setBulkStatus(e.target.value)}
            className={inputCls} style={inputStyle}>
            <option value="">{t('dash.applications_page.select_status', { defaultValue: 'Move to…' })}</option>
            {Object.values(APPLICATION_STATUS).map((s) => (
              <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
            ))}
          </select>
          <button onClick={handleBulkUpdate} disabled={!bulkStatus}
            className="rounded-xl px-4 py-2 text-xs font-bold text-white disabled:opacity-40 transition-colors"
            style={{ background: 'var(--color-secondary)' }}>
            {t('dash.applications_page.apply', { defaultValue: 'Apply' })}
          </button>
          <button onClick={() => setSelected([])}
            className="rounded-xl border px-3 py-2 text-xs font-medium transition-colors"
            style={{ borderColor: 'var(--color-stroke)', color: 'var(--color-body-color)' }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-gray-2)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
            {t('dash.applications_page.clear', { defaultValue: 'Clear' })}
          </button>
        </div>
      )}

      <ApplicationsTable
        applications={applications}
        status={status}
        page={page}
        onPagePrev={() => setPage((p) => Math.max(1, p - 1))}
        onPageNext={() => setPage((p) => p + 1)}
        onView={setViewing}
        onDelete={handleDelete}
        onStatusUpdate={handleStatusUpdate}
        selected={selected}
        onSelectToggle={handleSelectToggle}
        onSelectAll={setSelected}
      />

      {viewing && (
        <ApplicationDetailDrawer
          application={viewing}
          onClose={() => setViewing(null)}
          onStatusUpdate={handleStatusUpdate}
        />
      )}
    </div>
  )
}
