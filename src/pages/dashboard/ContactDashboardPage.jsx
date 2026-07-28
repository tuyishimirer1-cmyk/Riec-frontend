import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useGetContactSubmissions, useMarkSubmissionRead } from '../../react-query'

export default function ContactDashboardPage() {
  const { t } = useTranslation()
  const [page,     setPage]     = useState(1)
  const [pageSize, setPageSize] = useState(20)

  const { data, isLoading } = useGetContactSubmissions({ page, pageSize })
  const markReadMutation = useMarkSubmissionRead()

  const submissions = data?.items || []
  const total = data?.total ?? 0
  const totalPages = total && pageSize ? Math.ceil(total / pageSize) : null

  const handleMarkRead = async (id) => {
    await markReadMutation.mutateAsync(id)
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold" style={{ color: 'var(--color-primary)' }}>
            {t('dash.contact_page.title', { defaultValue: 'Contact Submissions' })}
          </h2>
          <p className="text-xs" style={{ color: 'var(--color-body-color)' }}>
            {total} {t('dash.contact_page.total', { defaultValue: 'total submissions' })}
          </p>
        </div>
        <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1) }}
          className="rounded-xl border px-3 py-2 text-xs focus:outline-none"
          style={{ borderColor: 'var(--color-stroke)', background: '#fff', color: 'var(--color-primary)' }}>
          {[10, 20, 50].map((n) => (
            <option key={n} value={n}>
              {n} {t('dash.contact_page.per_page', { defaultValue: '/ page' })}
            </option>
          ))}
        </select>
      </div>

      {/* Submissions list */}
      {isLoading ? (
        <p className="text-xs text-center py-8" style={{ color: 'var(--color-body-color)' }}>
          {t('dash.loading', { defaultValue: 'Loading…' })}
        </p>
      ) : (
        <div className="space-y-2">
          {submissions.map((s) => (
            <div key={s.id} className="flex items-start gap-3 rounded-xl px-3 py-2.5" style={{ background: 'var(--color-gray-1)' }}>
              <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold"
                style={{ background: 'rgba(238,122,24,0.12)', color: 'var(--color-riec-orange)' }}>
                {s.name?.[0]?.toUpperCase() || '?'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold truncate" style={{ color: 'var(--color-primary)' }}>{s.name}</p>
                <p className="text-[10px] truncate" style={{ color: 'var(--color-body-color)' }}>{s.email}</p>
                <p className="mt-0.5 text-[10px] line-clamp-1" style={{ color: 'var(--color-dark-5)' }}>{s.message}</p>
              </div>
              {!s.read && (
                <button onClick={() => handleMarkRead(s.id)}
                  className="flex-shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold"
                  style={{ background: 'rgba(19,194,150,0.12)', color: 'var(--color-secondary)' }}>
                  {t('dash.mark_read', { defaultValue: 'Mark read' })}
                </button>
              )}
            </div>
          ))}
          {submissions.length === 0 && (
            <p className="text-xs text-center py-8" style={{ color: 'var(--color-body-color)' }}>
              {t('dash.no_messages', { defaultValue: 'No messages yet.' })}
            </p>
          )}
        </div>
      )}

      {/* Pagination */}
      {totalPages && totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
            className="rounded-xl border px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-40"
            style={{ borderColor: 'var(--color-stroke)', color: 'var(--color-body-color)' }}
            onMouseEnter={(e) => { if (page > 1) e.currentTarget.style.background = 'var(--color-gray-1)' }}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
            {t('dash.contact_page.prev', { defaultValue: 'Previous' })}
          </button>
          <span className="text-xs" style={{ color: 'var(--color-body-color)' }}>
            {t('dash.contact_page.page_of', { page, total: totalPages, defaultValue: `Page ${page} of ${totalPages}` })}
          </span>
          <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages}
            className="rounded-xl border px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-40"
            style={{ borderColor: 'var(--color-stroke)', color: 'var(--color-body-color)' }}
            onMouseEnter={(e) => { if (page < totalPages) e.currentTarget.style.background = 'var(--color-gray-1)' }}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
            {t('dash.contact_page.next', { defaultValue: 'Next' })}
          </button>
        </div>
      )}
    </div>
  )
}
