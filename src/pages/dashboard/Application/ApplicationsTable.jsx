import { useTranslation } from 'react-i18next'
import { Eye, Trash2, ChevronDown, Download, FileText, File, Award } from 'lucide-react'
import { APPLICATION_STATUS, STATUS_STYLE, STATUS_WORKFLOW } from '../../../react-query'

export default function ApplicationsTable({
  applications, status, page,
  onPagePrev, onPageNext,
  onView, onDelete, onStatusUpdate,
  selected, onSelectToggle, onSelectAll,
}) {
  const { t } = useTranslation()

  const allSelected = applications.length > 0 && applications.every((a) => selected?.includes(a.id))

  const HEADERS = [
    '', // checkbox
    t('dash.applications_page.col_applicant', { defaultValue: 'Applicant' }),
    t('dash.applications_page.col_email',     { defaultValue: 'Email' }),
    t('dash.applications_page.col_job',       { defaultValue: 'Job' }),
    t('dash.applications_page.col_cv',        { defaultValue: 'CV' }),
    t('dash.applications_page.col_cover',     { defaultValue: 'Cover Letter' }),
    t('dash.applications_page.col_quals',     { defaultValue: 'Qualifications' }),
    t('dash.applications_page.col_status',    { defaultValue: 'Status' }),
    t('dash.applications_page.col_actions',   { defaultValue: 'Actions' }),
  ]

  return (
    <div className="rounded-2xl bg-white border overflow-hidden"
      style={{ borderColor: 'var(--color-stroke)', boxShadow: 'var(--shadow-1)' }}>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-xs">
          <thead className="border-b" style={{ borderColor: 'var(--color-stroke)', background: 'var(--color-gray-1)' }}>
            <tr>
              <th className="px-4 py-3">
                <input type="checkbox" checked={allSelected}
                  onChange={(e) => onSelectAll?.(e.target.checked ? applications.map((a) => a.id) : [])}
                  className="rounded" />
              </th>
              {HEADERS.slice(1).map((h) => (
                <th key={h} className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider"
                  style={{ color: 'var(--color-body-color)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => {
              const nextStatuses = STATUS_WORKFLOW[app.status] || []
              
              // Parse qualifications
              let qualifications = []
              try {
                if (app.qualifications && typeof app.qualifications === 'string') {
                  qualifications = JSON.parse(app.qualifications)
                }
              } catch (e) {
                console.error('Failed to parse qualifications:', e)
              }
              
              return (
                <tr key={app.id} className="border-b transition-colors"
                  style={{ borderColor: 'var(--color-gray-1)' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-gray-1)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <td className="px-4 py-3">
                    <input type="checkbox"
                      checked={selected?.includes(app.id) || false}
                      onChange={() => onSelectToggle?.(app.id)}
                      className="rounded" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold"
                        style={{ background: 'rgba(30,154,224,0.12)', color: 'var(--color-my-blue)' }}>
                        {app.fullName?.[0]?.toUpperCase() || '?'}
                      </div>
                      <span className="font-semibold" style={{ color: 'var(--color-primary)' }}>{app.fullName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3" style={{ color: 'var(--color-body-color)' }}>{app.email}</td>
                  <td className="px-4 py-3" style={{ color: 'var(--color-body-color)' }}>{app.job?.title || app.jobId}</td>
                  
                  {/* CV Column */}
                  <td className="px-4 py-3">
                    {app.cvUrl ? (
                      <a href={app.cvUrl} target="_blank" rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-medium transition-colors"
                        style={{ color: 'var(--color-my-blue)' }}
                        onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                        onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                        title="Download CV">
                        <FileText className="h-3.5 w-3.5" />
                        CV
                      </a>
                    ) : (
                      <span className="text-xs" style={{ color: 'var(--color-dark-6)' }}>N/A</span>
                    )}
                  </td>
                  
                  {/* Cover Letter Column */}
                  <td className="px-4 py-3">
                    {app.coverLetter ? (
                      app.coverLetter.startsWith('http') ? (
                        <a href={app.coverLetter} target="_blank" rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-medium transition-colors"
                          style={{ color: 'var(--color-secondary)' }}
                          onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                          onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                          title="Download Cover Letter">
                          <File className="h-3.5 w-3.5" />
                          File
                        </a>
                      ) : (
                        <span className="text-xs" style={{ color: 'var(--color-secondary)' }} title="Text cover letter">
                          Text
                        </span>
                      )
                    ) : (
                      <span className="text-xs" style={{ color: 'var(--color-dark-6)' }}>N/A</span>
                    )}
                  </td>
                  
                  {/* Qualifications Column */}
                  <td className="px-4 py-3">
                    {qualifications.length > 0 ? (
                      <div className="flex flex-wrap items-center gap-1">
                        {qualifications.map((qual, idx) => (
                          qual.fileUrl ? (
                            <a key={idx}
                              href={qual.fileUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-0.5 text-xs font-medium transition-colors"
                              style={{ color: 'var(--color-riec-orange)' }}
                              onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                              onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                              title={`${qual.type || 'Certificate'} - ${qual.institution || ''}`}>
                              <File className="h-3.5 w-3.5" />
                              {idx + 1}
                            </a>
                          ) : (
                            <span key={idx} className="text-xs" style={{ color: 'var(--color-dark-6)' }} title="No file">
                              {idx + 1}
                            </span>
                          )
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs" style={{ color: 'var(--color-dark-6)' }}>N/A</span>
                    )}
                  </td>
                  
                  <td className="px-4 py-3">
                    {nextStatuses.length > 0 ? (
                      <div className="relative group inline-block">
                        <button className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold"
                          style={STATUS_STYLE[app.status] || STATUS_STYLE.NEW}>
                          {app.status?.replace(/_/g, ' ') || 'NEW'}
                          <ChevronDown className="h-2.5 w-2.5" />
                        </button>
                        <div className="absolute left-0 top-full mt-1 z-10 hidden group-hover:block rounded-xl border bg-white shadow-lg overflow-hidden min-w-[120px]"
                          style={{ borderColor: 'var(--color-stroke)', boxShadow: 'var(--shadow-2)' }}>
                          {nextStatuses.map((s) => (
                            <button key={s}
                              onClick={() => onStatusUpdate?.(app.id, s)}
                              className="flex w-full items-center gap-2 px-3 py-2 text-[10px] font-semibold transition-colors hover:bg-[var(--color-gray-1)]"
                              style={{ color: STATUS_STYLE[s]?.color || 'var(--color-body-color)' }}>
                              {s.replace(/_/g, ' ')}
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <span className="rounded-full px-2 py-0.5 text-[10px] font-bold"
                        style={STATUS_STYLE[app.status] || STATUS_STYLE.NEW}>
                        {app.status?.replace(/_/g, ' ') || 'NEW'}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <ActionBtn onClick={() => onView?.(app)} title="View Details"
                        hoverBg="rgba(30,154,224,0.10)" hoverColor="var(--color-my-blue)">
                        <Eye className="h-3.5 w-3.5" />
                      </ActionBtn>
                      {app.cvUrl && (
                        <ActionBtn 
                          onClick={() => window.open(app.cvUrl, '_blank')} 
                          title="Download CV"
                          hoverBg="rgba(19,194,150,0.10)" 
                          hoverColor="var(--color-secondary)">
                          <Download className="h-3.5 w-3.5" />
                        </ActionBtn>
                      )}
                      <ActionBtn onClick={() => onDelete?.(app.id)} title="Delete"
                        hoverBg="rgba(225,27,37,0.10)" hoverColor="var(--color-riec-red)">
                        <Trash2 className="h-3.5 w-3.5" />
                      </ActionBtn>
                    </div>
                  </td>
                </tr>
              )
            })}
            {applications.length === 0 && (
              <tr>
                <td colSpan={9} className="px-4 py-10 text-center text-xs" style={{ color: 'var(--color-body-color)' }}>
                  {status === 'loading'
                    ? t('dash.loading', { defaultValue: 'Loading…' })
                    : t('dash.applications_page.empty', { defaultValue: 'No applications found.' })}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function ActionBtn({ onClick, title, hoverBg, hoverColor, children }) {
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
