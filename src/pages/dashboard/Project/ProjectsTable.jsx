import { useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Pencil, Trash2, Eye, EyeOff, Settings2 } from 'lucide-react'
import gsap from 'gsap'

const Badge = ({ children, style }) => (
  <span className="rounded-full px-2 py-0.5 text-[10px] font-bold" style={style}>{children}</span>
)

export default function ProjectsTable({
  projects, status, page, pageSize, totalPages,
  filters, onFilterChange, onPageSizeChange,
  onEdit, onDelete, onPublish, onUnpublish, onManage,
  onPagePrev, onPageNext,
}) {
  const { t } = useTranslation()
  const tableRef = useRef(null)

  useEffect(() => {
    if (!tableRef.current) return
    gsap.fromTo(tableRef.current,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' })
  }, [projects])

  const FILTER_INPUTS = [
    { key: 'type',     placeholder: t('dash.projects_page.filter_type',     { defaultValue: 'Filter by type' }) },
    { key: 'category', placeholder: t('dash.projects_page.filter_category', { defaultValue: 'Filter by category' }) },
    { key: 'location', placeholder: t('dash.projects_page.filter_location', { defaultValue: 'Filter by location' }) },
  ]

  const HEADERS = [
    t('dash.projects_page.col_title',      { defaultValue: 'Title' }),
    t('dash.projects_page.col_location',   { defaultValue: 'Location' }),
    t('dash.projects_page.col_type',       { defaultValue: 'Type' }),
    t('dash.projects_page.col_category',   { defaultValue: 'Category' }),
    t('dash.projects_page.col_purchasable',{ defaultValue: 'Purchasable' }),
    t('dash.projects_page.col_status',     { defaultValue: 'Status' }),
    t('dash.projects_page.col_actions',    { defaultValue: 'Actions' }),
  ]

  return (
    <>
      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {FILTER_INPUTS.map(({ key, placeholder }) => (
          <input key={key} type="text" placeholder={placeholder}
            defaultValue={filters[key] || ''}
            onChange={(e) => onFilterChange(key, e.target.value || undefined)}
            className="rounded-xl border px-3 py-2 text-xs transition-colors focus:outline-none"
            style={{
              borderColor: 'var(--color-stroke)',
              background: '#fff',
              color: 'var(--color-primary)',
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--color-riec-orange)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--color-stroke)'}
          />
        ))}
        <select value={pageSize} onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="rounded-xl border px-3 py-2 text-xs focus:outline-none"
          style={{ borderColor: 'var(--color-stroke)', background: '#fff', color: 'var(--color-primary)' }}>
          {[10, 20, 50].map((n) => (
            <option key={n} value={n}>
              {n} {t('dash.projects_page.per_page', { defaultValue: '/ page' })}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div ref={tableRef} className="rounded-2xl bg-white overflow-hidden border"
        style={{ borderColor: 'var(--color-stroke)', boxShadow: 'var(--shadow-1)' }}>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-xs">
            <thead className="border-b" style={{ borderColor: 'var(--color-stroke)', background: 'var(--color-gray-1)' }}>
              <tr>
                {HEADERS.map((h) => (
                  <th key={h} className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider"
                    style={{ color: 'var(--color-body-color)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p.id} className="border-b transition-colors"
                  style={{ borderColor: 'var(--color-gray-1)' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-gray-1)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <td className="px-4 py-3">
                    <p className="font-semibold" style={{ color: 'var(--color-primary)' }}>{p.title}</p>
                    <p className="text-[10px]" style={{ color: 'var(--color-body-color)' }}>{p.slug}</p>
                  </td>
                  <td className="px-4 py-3" style={{ color: 'var(--color-body-color)' }}>{p.location || '—'}</td>
                  <td className="px-4 py-3" style={{ color: 'var(--color-body-color)' }}>{p.type}</td>
                  <td className="px-4 py-3" style={{ color: 'var(--color-body-color)' }}>{p.category}</td>
                  <td className="px-4 py-3">
                    <Badge style={p.purchasable
                      ? { background: 'rgba(19,194,150,0.12)', color: 'var(--color-secondary)' }
                      : { background: 'var(--color-gray-2)', color: 'var(--color-body-color)' }}>
                      {p.purchasable
                        ? t('dash.projects_page.yes', { defaultValue: 'Yes' })
                        : t('dash.projects_page.no',  { defaultValue: 'No' })}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge style={p.isPublished
                      ? { background: 'rgba(19,194,150,0.12)', color: 'var(--color-secondary)' }
                      : { background: 'rgba(238,122,24,0.12)', color: 'var(--color-riec-orange)' }}>
                      {p.isPublished
                        ? t('dash.live',  { defaultValue: 'Live' })
                        : t('dash.draft', { defaultValue: 'Draft' })}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <ActionBtn onClick={() => onManage(p)} title="Manage"
                        hoverBg="rgba(238,122,24,0.10)" hoverColor="var(--color-riec-orange)">
                        <Settings2 className="h-3.5 w-3.5" />
                      </ActionBtn>
                      <ActionBtn onClick={() => onEdit(p)} title="Edit"
                        hoverBg="rgba(30,154,224,0.10)" hoverColor="var(--color-my-blue)">
                        <Pencil className="h-3.5 w-3.5" />
                      </ActionBtn>
                      <ActionBtn
                        onClick={() => p.isPublished ? onUnpublish(p.id) : onPublish(p.id)}
                        title={p.isPublished ? 'Unpublish' : 'Publish'}
                        hoverBg="rgba(19,194,150,0.10)" hoverColor="var(--color-secondary)">
                        {p.isPublished ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      </ActionBtn>
                      <ActionBtn onClick={() => onDelete(p.id)} title="Delete"
                        hoverBg="rgba(225,27,37,0.10)" hoverColor="var(--color-riec-red)">
                        <Trash2 className="h-3.5 w-3.5" />
                      </ActionBtn>
                    </div>
                  </td>
                </tr>
              ))}
              {projects.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-xs" style={{ color: 'var(--color-body-color)' }}>
                    {status === 'loading'
                      ? t('dash.loading', { defaultValue: 'Loading…' })
                      : t('dash.projects_page.empty', { defaultValue: 'No projects found.' })}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t px-4 py-3"
          style={{ borderColor: 'var(--color-stroke)' }}>
          <span className="text-[10px]" style={{ color: 'var(--color-body-color)' }}>
            {projects.length > 0
              ? t('dash.projects_page.showing', {
                  first: (page - 1) * pageSize + 1,
                  last: Math.min(page * pageSize, totalPages ? totalPages * pageSize : projects.length),
                  total: totalPages ? totalPages * pageSize : projects.length,
                  defaultValue: `Showing ${(page - 1) * pageSize + 1}–${Math.min(page * pageSize, totalPages ? totalPages * pageSize : projects.length)} of ${totalPages ? totalPages * pageSize : projects.length}`,
                })
              : t('dash.projects_page.no_results', { defaultValue: 'No results' })}
          </span>
          <div className="flex items-center gap-2">
            <PaginationBtn onClick={onPagePrev} disabled={page === 1}>
              {t('dash.projects_page.prev', { defaultValue: 'Previous' })}
            </PaginationBtn>
            {totalPages && totalPages > 1 && (
              <span className="text-xs" style={{ color: 'var(--color-body-color)' }}>
                {t('dash.projects_page.page_of', { page, total: totalPages, defaultValue: `Page ${page} of ${totalPages}` })}
              </span>
            )}
            <PaginationBtn onClick={onPageNext} disabled={page >= (totalPages || 1)}>
              {t('dash.projects_page.next', { defaultValue: 'Next' })}
            </PaginationBtn>
          </div>
        </div>
      </div>
    </>
  )
}

function ActionBtn({ onClick, title, hoverBg, hoverColor, children }) {
  return (
    <button onClick={onClick} title={title}
      className="rounded-lg p-1.5 transition-colors"
      style={{ color: 'var(--color-dark-6)' }}
      onMouseEnter={(e) => { e.currentTarget.style.background = hoverBg; e.currentTarget.style.color = hoverColor }}
      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-dark-6)' }}
    >
      {children}
    </button>
  )
}

function PaginationBtn({ onClick, disabled, children }) {
  return (
    <button onClick={onClick} disabled={disabled}
      className="rounded-xl border px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-40"
      style={{ borderColor: 'var(--color-stroke)', color: 'var(--color-body-color)' }}
      onMouseEnter={(e) => !disabled && (e.currentTarget.style.background = 'var(--color-gray-1)')}
      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
    >
      {children}
    </button>
  )
}
