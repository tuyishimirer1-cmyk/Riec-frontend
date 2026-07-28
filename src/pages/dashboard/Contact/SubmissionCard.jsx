import { useRef, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { MailOpen, Mail, X } from 'lucide-react'
import gsap from 'gsap'

const WORD_LIMIT = 18

function truncate(str) {
  if (!str) return ''
  const words = str.split(' ')
  return words.length > WORD_LIMIT ? words.slice(0, WORD_LIMIT).join(' ') + '…' : str
}

function SubmissionDrawer({ submission: s, onClose, onMarkRead }) {
  const { t }      = useTranslation()
  const overlayRef = useRef(null)
  const panelRef   = useRef(null)

  useEffect(() => {
    gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.22 })
    gsap.fromTo(panelRef.current, { x: '100%' }, { x: '0%', duration: 0.35, ease: 'power3.out' })
  }, [])

  const handleClose = () => {
    gsap.to(panelRef.current, { x: '100%', duration: 0.28, ease: 'power3.in' })
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.2, onComplete: onClose })
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div ref={overlayRef} onClick={handleClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div ref={panelRef}
        className="relative z-10 flex flex-col bg-white w-full sm:max-w-md h-full min-h-0"
        style={{ boxShadow: '-8px 0 40px rgba(10,45,83,0.14)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b px-5 py-4 flex-shrink-0"
          style={{ borderColor: 'var(--color-stroke)' }}>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl text-sm font-bold flex-shrink-0"
              style={s.read
                ? { background: 'var(--color-gray-2)', color: 'var(--color-body-color)' }
                : { background: 'rgba(238,122,24,0.12)', color: 'var(--color-riec-orange)' }}>
              {s.name?.[0]?.toUpperCase() || '?'}
            </div>
            <div>
              <p className="text-sm font-bold" style={{ color: 'var(--color-primary)' }}>{s.name}</p>
              <p className="text-[10px]" style={{ color: 'var(--color-body-color)' }}>{s.email}</p>
            </div>
          </div>
          <button onClick={handleClose}
            className="rounded-xl p-2 transition-colors"
            style={{ color: 'var(--color-body-color)' }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-gray-1)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {s.subject && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider mb-1"
                style={{ color: 'var(--color-body-color)' }}>
                {t('dash.contact_page.subject', { defaultValue: 'Subject' })}
              </p>
              <p className="text-xs font-semibold" style={{ color: 'var(--color-primary)' }}>{s.subject}</p>
            </div>
          )}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider mb-1"
              style={{ color: 'var(--color-body-color)' }}>
              {t('dash.contact_page.message', { defaultValue: 'Message' })}
            </p>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--color-dark-5)' }}>{s.message}</p>
          </div>
        </div>

        <div className="border-t px-5 py-4 flex-shrink-0" style={{ borderColor: 'var(--color-stroke)' }}>
          <button onClick={() => { onMarkRead(s.id); handleClose() }} disabled={s.read}
            className="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-colors disabled:opacity-40"
            style={s.read
              ? { background: 'var(--color-gray-2)', color: 'var(--color-body-color)' }
              : { background: 'rgba(19,194,150,0.10)', color: 'var(--color-secondary)' }}
            onMouseEnter={(e) => { if (!s.read) e.currentTarget.style.background = 'rgba(19,194,150,0.20)' }}
            onMouseLeave={(e) => { if (!s.read) e.currentTarget.style.background = 'rgba(19,194,150,0.10)' }}>
            {s.read ? <MailOpen className="h-3.5 w-3.5" /> : <Mail className="h-3.5 w-3.5" />}
            {s.read
              ? t('dash.contact_page.read',      { defaultValue: 'Read' })
              : t('dash.contact_page.mark_read', { defaultValue: 'Mark as read' })}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function SubmissionCard({ submission: s, onMarkRead }) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className="rounded-2xl bg-white border p-4 cursor-pointer transition-all"
        style={{
          borderColor: s.read ? 'var(--color-stroke)' : 'var(--color-riec-orange)',
          boxShadow: s.read ? 'var(--shadow-1)' : '0 2px 12px rgba(238,122,24,0.12)',
        }}
        onMouseEnter={(e) => e.currentTarget.style.boxShadow = 'var(--shadow-2)'}
        onMouseLeave={(e) => e.currentTarget.style.boxShadow = s.read ? 'var(--shadow-1)' : '0 2px 12px rgba(238,122,24,0.12)'}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl text-sm font-bold"
              style={s.read
                ? { background: 'var(--color-gray-2)', color: 'var(--color-body-color)' }
                : { background: 'rgba(238,122,24,0.12)', color: 'var(--color-riec-orange)' }}>
              {s.name?.[0]?.toUpperCase() || '?'}
            </div>
            <div className="min-w-0">
              <p className={`text-xs ${s.read ? '' : 'font-bold'}`}
                style={{ color: 'var(--color-primary)' }}>{s.name}</p>
              <p className="text-[10px]" style={{ color: 'var(--color-body-color)' }}>{s.email}</p>
              <p className="mt-1.5 text-xs leading-relaxed"
                style={{ color: s.read ? 'var(--color-dark-6)' : 'var(--color-dark-5)' }}>
                {truncate(s.message)}
              </p>
            </div>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onMarkRead(s.id) }}
            disabled={s.read}
            className="flex-shrink-0 flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-[10px] font-bold transition-colors"
            style={s.read
              ? { background: 'var(--color-gray-2)', color: 'var(--color-body-color)', cursor: 'default' }
              : { background: 'rgba(19,194,150,0.10)', color: 'var(--color-secondary)' }}
            onMouseEnter={(e) => { if (!s.read) e.currentTarget.style.background = 'rgba(19,194,150,0.20)' }}
            onMouseLeave={(e) => { if (!s.read) e.currentTarget.style.background = 'rgba(19,194,150,0.10)' }}
          >
            {s.read ? <MailOpen className="h-3 w-3" /> : <Mail className="h-3 w-3" />}
            {s.read
              ? t('dash.contact_page.read',      { defaultValue: 'Read' })
              : t('dash.contact_page.mark_read', { defaultValue: 'Mark read' })}
          </button>
        </div>
      </div>

      {open && (
        <SubmissionDrawer
          submission={s}
          onClose={() => setOpen(false)}
          onMarkRead={onMarkRead}
        />
      )}
    </>
  )
}
