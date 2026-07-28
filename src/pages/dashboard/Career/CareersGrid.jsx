import { useTranslation } from 'react-i18next'
import { MapPin, Building2, Pencil, Trash2, Eye, EyeOff, Clock } from 'lucide-react'
import RichContent from '../../../components/ui/RichContent'

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

export default function CareersGrid({ careers, status, onEdit, onDelete, onPublish, onUnpublish }) {
  const { t } = useTranslation()

  if (careers.length === 0) {
    return (
      <div className="rounded-2xl border p-10 text-center text-xs"
        style={{ borderColor: 'var(--color-stroke)', background: 'var(--color-gray-1)', color: 'var(--color-body-color)' }}>
        {status === 'loading'
          ? t('dash.loading', { defaultValue: 'Loading…' })
          : t('dash.careers_page.empty', { defaultValue: 'No active jobs found.' })}
      </div>
    )
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {careers.map((job) => (
        <div key={job.id}
          className="group rounded-2xl bg-white border flex flex-col transition-shadow hover:shadow-md"
          style={{ borderColor: 'var(--color-stroke)', boxShadow: 'var(--shadow-1)' }}
        >
          {/* Accent bar — green if live, orange if draft */}
          <div className="h-1 rounded-t-2xl"
            style={{ background: job.isPublished ? 'var(--color-secondary)' : 'var(--color-riec-orange)' }} />

          <div className="flex flex-col flex-1 p-4 gap-3">
            {/* Icon + badge + actions */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl"
                  style={{ background: 'rgba(19,194,150,0.10)', color: 'var(--color-secondary)' }}>
                  <Building2 className="h-4 w-4" />
                </div>
                <span className="rounded-full px-2 py-0.5 text-[10px] font-bold"
                  style={job.isPublished
                    ? { background: 'rgba(19,194,150,0.10)', color: 'var(--color-secondary)' }
                    : { background: 'rgba(238,122,24,0.10)', color: 'var(--color-riec-orange)' }}>
                  {job.isPublished
                    ? t('dash.live',  { defaultValue: 'Live' })
                    : t('dash.draft', { defaultValue: 'Draft' })}
                </span>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <ActionBtn onClick={() => onEdit(job)} hoverBg="rgba(30,154,224,0.10)" hoverColor="var(--color-my-blue)" title="Edit">
                  <Pencil className="h-3.5 w-3.5" />
                </ActionBtn>
                <ActionBtn
                  onClick={() => job.isPublished ? onUnpublish(job.id) : onPublish(job.id)}
                  hoverBg="rgba(19,194,150,0.10)" hoverColor="var(--color-secondary)"
                  title={job.isPublished ? 'Unpublish' : 'Publish'}>
                  {job.isPublished ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </ActionBtn>
                <ActionBtn onClick={() => onDelete(job.id)} hoverBg="rgba(225,27,37,0.10)" hoverColor="var(--color-riec-red)" title="Delete">
                  <Trash2 className="h-3.5 w-3.5" />
                </ActionBtn>
              </div>
            </div>

            {/* Title */}
            <div>
              <p className="text-sm font-bold leading-snug" style={{ color: 'var(--color-primary)' }}>
                {job.title}
              </p>
              <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px]"
                style={{ color: 'var(--color-body-color)' }}>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />{job.location}
                </span>
                <span className="flex items-center gap-1">
                  <Building2 className="h-3 w-3" />{job.department}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />{job.employmentType?.replace(/_/g, ' ')}
                </span>
              </div>
            </div>

            {/* Rich description preview */}
            {job.description && (
              <div className="text-[11px] leading-relaxed line-clamp-3 flex-1"
                style={{ color: 'var(--color-body-color)' }}>
                <RichContent html={job.description} />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
