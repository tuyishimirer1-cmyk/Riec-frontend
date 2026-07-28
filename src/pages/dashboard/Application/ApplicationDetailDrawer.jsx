import { useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import gsap from 'gsap'
import { X, Mail, Phone, FileText, ExternalLink } from 'lucide-react'
import { STATUS_WORKFLOW, STATUS_STYLE } from '../../../react-query'

export default function ApplicationDetailDrawer({ application: app, onClose, onStatusUpdate }) {
  const { t }      = useTranslation()
  const overlayRef = useRef(null)
  const panelRef   = useRef(null)

  useEffect(() => {
    gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.25 })
    gsap.fromTo(panelRef.current, { x: '100%' }, { x: '0%', duration: 0.38, ease: 'power3.out' })
  }, [])

  const handleClose = () => {
    gsap.to(panelRef.current, { x: '100%', duration: 0.3, ease: 'power3.in' })
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.22, onComplete: onClose })
  }

  const nextStatuses = STATUS_WORKFLOW[app.status] || []

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div ref={overlayRef} onClick={handleClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      <div ref={panelRef}
        className="relative z-10 flex flex-col bg-white w-full max-w-md h-full"
        style={{ boxShadow: '-8px 0 40px rgba(10,45,83,0.14)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b px-5 py-4 flex-shrink-0"
          style={{ borderColor: 'var(--color-stroke)' }}>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold flex-shrink-0"
              style={{ background: 'rgba(30,154,224,0.12)', color: 'var(--color-my-blue)' }}>
              {app.fullName?.[0]?.toUpperCase() || '?'}
            </div>
            <div>
              <p className="text-sm font-bold" style={{ color: 'var(--color-primary)' }}>{app.fullName}</p>
              <p className="text-[10px]" style={{ color: 'var(--color-body-color)' }}>{app.job?.title || app.jobId}</p>
            </div>
          </div>
          <button onClick={handleClose}
            className="rounded-xl p-2 transition-colors hover:bg-[var(--color-gray-1)]"
            style={{ color: 'var(--color-body-color)' }}>
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">

          {/* Current status */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold" style={{ color: 'var(--color-body-color)' }}>
              {t('dash.applications_page.status', { defaultValue: 'Status' })}
            </span>
            <span className="rounded-full px-3 py-1 text-[10px] font-bold"
              style={STATUS_STYLE[app.status] || STATUS_STYLE.NEW}>
              {app.status?.replace(/_/g, ' ') || 'NEW'}
            </span>
          </div>

          {/* Contact info */}
          <div className="rounded-2xl border p-4 space-y-2.5"
            style={{ borderColor: 'var(--color-stroke)', background: 'var(--color-gray-1)' }}>
            <Row icon={<Mail className="h-3.5 w-3.5" />} label={app.email} />
            {app.phone && <Row icon={<Phone className="h-3.5 w-3.5" />} label={app.phone} />}
            {app.cvUrl && (
              <a href={app.cvUrl} target="_blank" rel="noreferrer"
                className="flex items-center gap-2 text-xs font-semibold transition-colors"
                style={{ color: 'var(--color-secondary)' }}>
                <FileText className="h-3.5 w-3.5" />
                {t('dash.applications_page.view_resume', { defaultValue: 'View Resume' })}
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>

          {/* Cover letter */}
          {app.coverLetter && (
            <div>
              <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider"
                style={{ color: 'var(--color-body-color)' }}>
                {t('dash.applications_page.cover_letter', { defaultValue: 'Cover Letter' })}
              </p>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--color-dark-5)' }}>
                {app.coverLetter}
              </p>
            </div>
          )}

          {/* Notes */}
          {app.notes && (
            <div>
              <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider"
                style={{ color: 'var(--color-body-color)' }}>
                {t('dash.applications_page.notes', { defaultValue: 'Notes' })}
              </p>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--color-dark-5)' }}>
                {app.notes}
              </p>
            </div>
          )}

          {/* Status workflow actions */}
          {nextStatuses.length > 0 && (
            <div>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-wider"
                style={{ color: 'var(--color-body-color)' }}>
                {t('dash.applications_page.move_to', { defaultValue: 'Move to' })}
              </p>
              <div className="flex flex-wrap gap-2">
                {nextStatuses.map((s) => (
                  <button key={s}
                    onClick={() => { onStatusUpdate(app.id, s); handleClose() }}
                    className="rounded-xl px-3 py-1.5 text-[10px] font-bold transition-colors"
                    style={STATUS_STYLE[s]}
                    onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                    onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                  >
                    {s.replace(/_/g, ' ')}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function Row({ icon, label }) {
  return (
    <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--color-body-color)' }}>
      <span style={{ color: 'var(--color-dark-6)' }}>{icon}</span>
      {label}
    </div>
  )
}
