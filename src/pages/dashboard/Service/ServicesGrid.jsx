import { useTranslation } from 'react-i18next'
import { Pencil, Trash2, Wrench, ListChecks } from 'lucide-react'

function ActionBtn({ onClick, hoverBg, hoverColor, title, children }) {
  return (
    <button onClick={onClick} title={title}
      className="rounded-lg p-1.5 transition-colors"
      style={{ color: 'var(--color-dark-6)' }}
      onMouseEnter={(e) => { e.currentTarget.style.background = hoverBg; e.currentTarget.style.color = hoverColor }}
      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-dark-6)' }}>
      {children}
    </button>
  )
}

export default function ServicesGrid({
  services, status, page, total, pageSize,
  onEdit, onDelete, onPagePrev, onPageNext,
  expandedServices, onToggleExpansion, getRelatedProjects,
}) {
  const { t } = useTranslation()

  const totalPages = total && pageSize ? Math.ceil(total / pageSize) : null

  if (services.length === 0) {
    return (
      <div className="rounded-2xl border p-10 text-center text-xs"
        style={{ borderColor: 'var(--color-stroke)', background: 'var(--color-gray-1)', color: 'var(--color-body-color)' }}>
        {status === 'loading'
          ? t('dash.loading', { defaultValue: 'Loading…' })
          : t('dash.services_page.empty', { defaultValue: 'No services found.' })}
      </div>
    )
  }

  return (
    <>
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {services.map((svc) => {
        const relatedProjects = getRelatedProjects(svc.id)
        const isExpanded = expandedServices?.has(svc.id)
        
        return (
          <div key={svc.id}
            className="group rounded-2xl bg-white border flex flex-col transition-all duration-300 hover:shadow-lg"
            style={{ borderColor: 'var(--color-stroke)', boxShadow: 'var(--shadow-1)' }}
          >
            {/* Header Section */}
            <div className="h-20 rounded-t-2xl flex items-center justify-between px-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl"
                  style={{ background: 'rgba(238,122,24,0.10)', color: 'var(--color-riec-orange)' }}>
                  <Wrench className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-bold leading-none" style={{ color: 'var(--color-primary)' }}>{svc.name}</p>
                  <p className="text-[10px] mt-0.5" style={{ color: 'var(--color-body-color)' }}>
                    {svc.mainTasks?.length || 0} {t('dash.services_page.tasks', { defaultValue: 'tasks' })}
                  </p>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <ActionBtn
                  onClick={() => onToggleExpansion(svc.id)}
                  hoverBg="rgba(30,154,224,0.10)" hoverColor="var(--color-my-blue)"
                  title={isExpanded ? 'Collapse' : 'Expand'}
                >
                  <svg className="w-3.5 h-3.5 transition-transform duration-300" style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </ActionBtn>
                <ActionBtn
                  onClick={() => onEdit(svc)}
                  hoverBg="rgba(30,154,224,0.10)" hoverColor="var(--color-my-blue)"
                  title={t('dash.services_page.edit_title', { defaultValue: 'Edit' })}
                >
                  <Pencil className="h-3.5 w-3.5" />
                </ActionBtn>
                <ActionBtn
                  onClick={() => onDelete(svc.id)}
                  hoverBg="rgba(225,27,37,0.10)" hoverColor="var(--color-riec-red)"
                  title={t('dash.services_page.delete', { defaultValue: 'Delete' })}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </ActionBtn>
              </div>
            </div>

            {/* Content Section */}
            <div className="flex-1 p-4">
              {/* Service Description */}
              <div className="mb-4">
                <p className="text-sm leading-relaxed line-clamp-2" style={{ color: 'var(--color-body-color)' }}>
                  {svc.shortDescription || svc.description}
                </p>
              </div>

              {/* Related Projects */}
              {relatedProjects.length > 0 && (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold" style={{ color: 'var(--color-primary)' }}>
                      {t('dash.services_page.related_projects', { defaultValue: 'Related Projects' })} ({relatedProjects.length})
                    </h4>
                    <button
                      onClick={() => window.open('/projects', '_blank')}
                      className="text-xs font-medium rounded-lg px-3 py-1.5 transition-colors"
                      style={{ 
                        borderColor: 'var(--color-stroke)', 
                        color: 'var(--color-riec-orange)',
                        background: 'transparent'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-riec-orange)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      {t('dash.services_page.view_all', { defaultValue: 'View All' })}
                    </button>
                  </div>
                  
                  {/* Projects Preview */}
                  <div className={`grid gap-2 transition-all duration-300 overflow-hidden ${isExpanded ? 'grid-cols-1' : 'grid-cols-2'}`}
                    style={{ maxHeight: isExpanded ? 'none' : '200px' }}
                  >
                    {relatedProjects.slice(0, isExpanded ? 6 : 4).map((project, index) => (
                      <div 
                        key={project.id}
                        className="bg-gray-50 rounded-lg p-3 border transition-all duration-200 hover:bg-gray-100 hover:shadow-md cursor-pointer"
                        style={{ borderColor: 'var(--color-stroke)' }}
                        onClick={() => window.open(`/projects/${project.slug || project.id}`, '_blank')}
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gray-200 rounded-md flex items-center justify-center">
                            <span className="text-xs font-bold" style={{ color: 'var(--color-body-color)' }}>
                              {project.title?.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium truncate" style={{ color: 'var(--color-primary)' }}>
                              {project.title}
                            </p>
                            <p className="text-[10px] truncate" style={{ color: 'var(--color-body-color)' }}>
                              {project.category}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Tasks Count */}
            {svc.mainTasks?.length > 0 && (
              <div className="flex items-center gap-1.5 text-[10px] px-4 py-2 border-t"
                style={{ borderColor: 'var(--color-stroke)', color: 'var(--color-dark-6)' }}>
                <ListChecks className="h-3 w-3" />
                {svc.mainTasks.length} {t('dash.services_page.tasks', { defaultValue: 'tasks' })}
              </div>
            )}
          </div>
        )
      })}
    </div>

    {/* Pagination */}
    {totalPages && totalPages > 1 && (
      <div className="flex items-center justify-between mt-4">
        <span className="text-[10px]" style={{ color: 'var(--color-body-color)' }}>
          {t('dash.services_page.showing', {
            first: (page - 1) * pageSize + 1,
            last: Math.min(page * pageSize, total),
            total,
            defaultValue: `Showing ${(page - 1) * pageSize + 1}–${Math.min(page * pageSize, total)} of ${total}`,
          })}
        </span>
        <div className="flex items-center gap-2">
          <button onClick={onPagePrev} disabled={page === 1}
            className="rounded-xl border px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-40"
            style={{ borderColor: 'var(--color-stroke)', color: 'var(--color-body-color)' }}
            onMouseEnter={(e) => { if (page > 1) e.currentTarget.style.background = 'var(--color-gray-1)' }}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
            {t('dash.services_page.prev', { defaultValue: 'Previous' })}
          </button>
          <span className="text-xs" style={{ color: 'var(--color-body-color)' }}>
            {t('dash.services_page.page_of', { page, total: totalPages, defaultValue: `Page ${page} of ${totalPages}` })}
          </span>
          <button onClick={onPageNext} disabled={page >= totalPages}
            className="rounded-xl border px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-40"
            style={{ borderColor: 'var(--color-stroke)', color: 'var(--color-body-color)' }}
            onMouseEnter={(e) => { if (page < totalPages) e.currentTarget.style.background = 'var(--color-gray-1)' }}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
            {t('dash.services_page.next', { defaultValue: 'Next' })}
          </button>
        </div>
      </div>
    )}
    </>
  )
}
